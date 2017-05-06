# 3 Simple Steps To Create Your Custom Search

You can build a custom search engine in three simple steps: 
	
	1. Sign up, get your free trial Azure subscription key, start building your search in the Custom Search Portal.
	2. Publish your Custom Search.
	3. Integrate Your Search into an endpoint application.


![picture alt](Bing-Custom-Search/BCS-Overview.png "High-level overview Bing Custom Search")


## Step 1: Sign up to get your free trial Azure subscription key
Signing up to Bing Custom Search requires you to have a Microsoft Account.
After you have successfully completed the sign-up, you have been automatically granted a free trial Azure subscription key. 

You can start now to configure your custom search, and publish your settings.

It's free to sign up to Bing Custom Search. However, the usage is capped to certain quota:
* You can call Bing Web Search API with your Azure subscription key max. 1,000 times per month.
* You can do up to 600 different ranking adjustments.

The pricing overview gives detailed information on the quota that you have available for the Free Preview. 


## Step 2: Build your search in the Custom Search Portal
In the Custom Search Portal, you can build your custom search settings. 
You can build as many different search scenarios as you want. Technically, a search scenario is referred to as _custom search instances_.
Before you publish a custom search scenario, you should:
	
	1. Define the sites that you want to search over.
	2. Apply & adjust (Bing) ranking on & for, respectively, your selected sites, and based on your needs.


## Step 3: Publish your custom search
Once you decide that the custom search instance meets your search needs, you can publish the custom search settings.
Publishing means, that you are given a Bing Web Search API v5 endpoint that you can call programmatically. 
To retrieve results from the Bing Web Search API, you need to specify your subscription key along with a custom configuration ID that you can see in the portal.


## Step 4: Integrate your search into an endpoint application.
In general, Bing Custom Search supports unlimited use cases and search scenarios. The two most common scenarios are:
* Building a site search
* Building a topical search

### Site search
To build a site search solution with Bing Custom Search, you can use the following features:
* Let your users search across all your websites.
* Pin top results to ensure sites that are important for your or your business are shown on top.
* Adjust and control ranking based on your needs.

### Vertical search
To build a topical search, you can:
* Design a custom search targeting hundreds of sites and webpages on a topic
* Deploy the search internally, and externally

### Integration into your endpoint
Finally, the results retrieved via Bing Web Search API are shown in an endpoint. For example, an external website, an internal website, an app, etc. Any endpoint that can consume and render JSON files is suited for the integration.


## Supported browsers
* Microsoft Edge - Desktop
* Microsoft Internet Explorer - Desktop
* Google Chrome - Desktop
