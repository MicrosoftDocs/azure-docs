This article provides information  to help you quickly get started using Bing Custom Search to accomplish the following tasks:

	1. Create a custom search instance
	2. Define the slices of the web that you want to search over
	3. Adjust the Bing ranker to customize the search based on your needs.
	4. Tracking your custom search settings.
	5. Use Site Suggestions to enhance your custom search settings.
	6. Publish your settings to get a Bing Web Search API link.
	7. Programmatically retrieve custom search results from Bing Web Search API.

# Create a custom search instance 

After logging in, you see all your custom search instances that you have created so far.


![picture alt](Bing-Custom-Search/MyCustomSearchEngines.png "View all the custom search instances that you have created so far.")


A custom search instance contains all the settings that are required to define a custom search tailored towards a scenario of your choice. For example, you might want to create a search to find bike touring related content. You might want to create a custom search instance called **BikeTouring**.

Provide then a meaningful name for your custom search instance. Confirm the name by clicking **configure**. You can change the name of your custom search instance any time later.


![picture alt](Bing-Custom-Search/CreateSearch.PNG "Create a new custom search instance called 'BikeTours'")


# Define the slices of the web that you want to search over
	
Next, define the right set of slices of the web to search over for your scenario. The custom slices can comprise:
		
* Domains, for example https://www.adventurecycling.org/
* Subdomains up to two sub-paths, for example https://www.adventurecycling.org/resources/portrait-gallery/
* Web-pages, for example https://www.adventurecycling.org/resources/blog/the-best-of-2016-new-signs-new-routes-new-amtrak-bike-services/


![picture alt](Bing-Custom-Search/AddingSites.png  "Add sites, subsites and exact URLs to the subset of the web that you want to search over.")


The selected slices must be available online, and also be Bing's index. 
If your site does not show up in your search, you can follow up with Bing directly to ensure your site is indexed. Consult the [Bing webmaster documentation](https://www.bing.com/webmaster/help/webmaster-guidelines-30fba23a) to understand how to submit sites for indexing.

## Add first slice
Start building your search by entering a domain, subdomain, or single webpage. To confirm your choice click **ADD**. 
You can omit the "http", "https", "www" etc. prefixes.


![picture alt](Bing-Custom-Search/FirstEntry.PNG "Start to create your custom search by entering a first site, subsite or exact URL.")


## Extend the slices to search over
To add more domains, subdomains or webpages, select the row below your last entry, specify your entry, followed by pressing **enter**. To remove an entry, click **delete** under Controls.


![picture alt](Bing-Custom-Search/AddingSites.png "Expand the set of sites, subsites and single web pages that you want to search over.")


# Adjust the Bing ranker to customize the search based on your needs
Start validating your settings by searching over your defined subset of the web. On the right-hand side, you see the Search Preview. Enter a search term at the top, and press **enter** or click the search icon.

*_Note_*: In case you do not see any result for your query, you might not have added enough websites to your custom slice of the web. As a result, no relevant search result can be found.


![picture alt](Bing-Custom-Search/SearchPreview.png "Check your current search settings.")


Next to each result you can see five different options to adjust the ranking for your custom search: 

* Pin to top, that is, for a specific query you define which specific web page appears on top of the results.
* Block, that is, sites, subsites, or web pages that you "block" are never shown in your custom search, regardless of the search query
* Boost, that is, the site, subsite, or web pages that you "boost" are generically ranked higher among the search results that are retrieved, independently from the search query.
* Demote, that is, the site, subsite, or web pages selected for demoting are ranked lower among the search results that are retrieved for any search query.

## Creating pins
Adjusting the ranking to pin search results to the top for specific queries can be done in two ways:

1. Trigger a query on the search preview. Select from the results shown in the preview the web page that you want to pin on top for that query and click on **Pin to top**.	
2. Go to the "Pinned" tab, and provide both 
- exact URL
- the exact query, for which this URL should be show on top


![picture alt](Bing-Custom-Search/ManualPin.PNG "Manually add a pin-to-top URL for a given query.")

You can track your pins in the **Pinned** tab. The pins are shown as 'exact query, exact URL' pairs. To activate your pins, that is, make the retrievable via Bing Web Search API, you must click **Push Pins** on the bottom left of the portal.

![picture alt](Bing-Custom-Search/TrackingPins.PNG "Tracking pins, and pushing them to Bing API.")

## Using pins
When you work with pins:

* For a specific query, you can pin max. one URL to the top.
* It takes approx. 15 minutes until a **pin-to-top** adjustment is retrievable via Bing Web Search API. 
* Do not forget to press "Push Pins" to activate your **pin-to-top** adjustments.
* Deleting a pin is not instantaneously reflected in the Search Preview. You will still see the former pinned URL on top for the specific query, until you use again the **Push Pin** function. Remember that it takes approx. 15 minutes until the new pins are activated.


# Tracking your custom search settings

You can track your ranking adjustments, and modify them at any time via the tabs **Active**, **Blocked**, and **Pinned**. 

*Active*: Every time you add a boost, super boost or demote adjustment, you see a new entry in the Active tab. You can modify your adjustments at any time by using the options under **Ranking Adjust** and **Controls**. |
*Blocked*: Every time you add a block adjustment, you see a new entry in the **Block** tab. You can deactivate a block rule by using the control **delete**. 
*Pinned*: Every time you add a pin to top adjustment, it is added to the tab **Pinned**.

![picture alt](Bing-Custom-Search/TrackingSearchSettings.png "Track your custom search settings.")

## Understanding the free trial limitations for a custom search instance
* Per custom search instance, the maximum number of ranking adjustments as documented in the tabs "Added" and "Blocked" are capped to a max. of 400. That is, every entry in "Added" and "Blocked" counts towards that limit of 400.
* Further, the maximum number of pins per custom search instance is limited to 200.

# Publish your settings to get a programmatic Bing Web Search API link.
All your settings are automatically saved. Once you are happy with your search settings, click the "Custom Search Endpoint" icon that is shown next to the custom instance name. 

![picture alt](EditCustomSearchInstanceName.png "Publish your custom search instance.")

You are routed to a page that shows you details on the Bing Web Search API endpoint for your custom search instance. 
To try out your search, specify a query and click **Test API**. You see on the right-hand side the algorithmic results from your custom search.

![picture alt](Bing-Custom-Search/API Endpoint.png "Test retrieving custom search results via Bing Web Search API.")

You can also validate calling your custom endpoint in different languages. In the UI, you find a Curl-based example in the box "API endpoint", which you can run in your Windows Cmd. 


# Programmatically retrieve custom search results from Bing Web Search API.
You can programmatically retrieve your custom search results via [Bing Web Search API](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/search-the-web). Requesting Bing Web Search API to obtain customized responses works the same way as requesting standard Bing web responses - with two differences: 
	1. The request URL has an additional parameter called **customconfig**.
	2. The response contains fewer elements than standard Bing Web Search API. That is, Bing Custom Search allows customizing web results only. For this reason, it's not possible to retrieve, for example, image or news answers with using the **customconfig** parameter in the search request.

## Request Parameters

### Request URL

```
https://cognitivegblppe.azure-api.net/bingcustomsearch/v5.0/search[?q][&customconfig][&count][&offset][&mkt][&safesearch]
```

| Parameter | Type | Required / Optional| Description |
| --- | --- | --- | ---|
| q | string | Required |The user's search query string |
|customconfig | number | Optional | Unique identifier for your custom search instance |
| count | number | Optional | The number of search results to return in the response. The actual number delivered may be less than requested.|
| offset | number | Optional | The zero-based offset that indicates the number of search results to skip before returning results.|
| mkt | string | Optional | The market where the results come from. Typically, it is the country where the user is making the request from. However, it could be a different country if the user is not located in a country where Bing delivers results. The market must be in the form -. For example, en-US. |
| safesearch |string | Optional | A filter used to filter results for adult content.|


Full list of supported markets: 
es-AR,en-AU,de-AT,nl-BE,fr-BE,pt-BR,en-CA,fr-CA,es-CL,da-DK,fi-FI,fr-FR,de-DE,zh-HK,en-IN,en-ID,en-IE,it-IT,ja-JP,ko-KR,en-MY,es-MX,nl-NL,en-NZ,no-NO,zh-CN,pl-PL,pt-PT,en-PH,ru-RU,ar-SA,en-ZA,es-ES,sv-SE,fr-CH,de-CH,zh-TW,tr-TR,en-GB,en-US,es-US 

### Request headers

| Parameter | Type | Required / Optional| Description |
| --- | --- | --- | ---|
| Ocp-Apim-Subscription-Key | string | Required | Subscription key, which provides access to this API. Found in your subscriptions. |

## Request Body

Bing Custom Search allows customizing web results only, which maps to the response field **webPages**. For example, images or news results cannot be customized. That's why they are not retrievable when calling Bing Web Search API with the **customconfig** parameter in the search request.

Below you see a JSON response of a Bing Web Search API call with a **customconfig** parameter.

```
{
    "_type" : "SearchResponse",
    "queryContext" : {...},
    "webPages" : {...},
    "spellSuggestion" : {...},
    "timeZone" : {...},
    "rankingResponse" : {...}
}
```
