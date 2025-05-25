# Minimal Facebook Marketplace Scraper
# Author: Jorge A. Gill Romero
# Date: April 2025

from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
import csv
import datetime

abs_path = os.path.abspath(__file__)
dir_path = os.path.dirname(abs_path)

class fbm_scraper():
    def __init__(self, city_code, proxy=None, threshold=100, headless=True):
        self.threshold = threshold
        self.city_code = city_code
        self.login_blocks = 0

        if proxy:
            self.browser = Driver(
                browser="chrome",
                headless=headless,
                proxy=proxy,
                agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
            )
        else:
            self.browser = Driver(
                browser="chrome",
                headless=headless,
                agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
            )

        self.url_to_scrap = f"https://www.facebook.com/marketplace/{city_code}/vehicles?sortBy=creation_time_descend&exact=true"
        self.links = {}
        self.checkpoint = [x.replace(".html", "") for x in os.listdir(f"{dir_path}/publications/{self.city_code}")] if os.path.exists(f"{dir_path}/publications/{self.city_code}") else []

        self.print_and_log(f"{self.city_code} INFO: Starting the scrap of city code.")

    def log(self, message):
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        log_message = f"[{now}] {message}\n"
        log_file = os.path.join(dir_path, "scraper.log")
        with open(log_file, "a") as f:
            f.write(log_message)

    def print_and_log(self, message):
        self.log(message)
        print(message)

    def process_login_block(self):
        try:
            WebDriverWait(self.browser, 5).until(EC.presence_of_element_located((By.XPATH, "//span[contains(text(), 'Email')]")))
            close_button = self.browser.find_element(By.XPATH, "//div[contains(@aria-label, 'Close')]")
            self.browser.execute_script("arguments[0].click();", close_button)
            self.login_blocks += 1
            self.print_and_log(f"{self.city_code} INFO: Login block found and closed. Total login blocks: {self.login_blocks}")
        except:
            self.print_and_log(f"{self.city_code} INFO: No login block found.")

    def human_scroll(self):
        total_scroll = 1
        recorded_heights = []
        while True:
            random_pixels = 1000
            random_wait = 1.5
            total_scroll += random_pixels
            self.browser.execute_script(f"window.scrollTo(0, {total_scroll});")
            current_height = self.browser.execute_script("return document.body.scrollHeight")
            recorded_heights.append(current_height)
            self.process_login_block()
            if len(recorded_heights) > 5 and all(recorded_heights[-i] == recorded_heights[-i-1] for i in range(1, 5)):
                break
            time.sleep(random_wait)

    def scrap_link(self, link):
        self.browser.get(link)
        time.sleep(2)
        publication_id = link.split("/")[5]
        html = self.browser.page_source
        output_path = os.path.join(dir_path, "publications", self.city_code, f"{publication_id}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        self.print_and_log(f"{self.city_code} INFO: Saved HTML for {publication_id}")

    def scrap_links(self):
        elements = self.browser.find_elements(By.XPATH, '//div[@class="x3ct3a4"]')
        for element in elements:
            product_href = element.find_element(By.XPATH, 'a')
            product_id = product_href.get_attribute('href').split("/")[5]
            if product_id in self.checkpoint:
                continue
            self.links[product_id] = product_href.get_attribute('href')

    def execute_scrap_process(self):
        self.browser.get(self.url_to_scrap)
        time.sleep(2)
        self.human_scroll()
        self.scrap_links()

if __name__ == "__main__":
    if not os.path.exists(f"{dir_path}/publications"):
        os.makedirs(f"{dir_path}/publications")

    with open(f"{dir_path}/input.csv", "r") as f:
        reader = csv.reader(f)
        lines = list(reader)

    for line in lines:
        city_code = line[0].strip()
        threshold = int(line[1].strip())
        proxy = line[2].strip() if len(line) > 2 else None

        if not os.path.exists(f"{dir_path}/publications/{city_code}"):
            os.makedirs(f"{dir_path}/publications/{city_code}")

        worker = fbm_scraper(city_code, proxy, threshold, headless=True)
        worker.execute_scrap_process()

        for product_id, link in worker.links.items():
            worker.scrap_link(link)
            time.sleep(0.5)

        worker.print_and_log(f"{city_code} INFO: Finished scraping {len(worker.links)} items.")