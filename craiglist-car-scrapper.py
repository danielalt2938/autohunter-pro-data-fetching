import pycraigslist
from craigslist_meta import Site

for site in Site.all():
    if site.has_area():
        for area in site:
            all_autos = pycraigslist.forsale.cta(site=site.key, area=area.key)
            for auto in all_autos.search():
                print(auto)
    else:
        all_autos = pycraigslist.forsale.cta(site=site.key)
        for auto in all_autos.search():
            print(auto)