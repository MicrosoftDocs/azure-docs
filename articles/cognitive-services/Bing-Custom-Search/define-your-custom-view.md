---
title: "Bing Custom Search: Define a custom view | Microsoft Docs"
description: Describes how to create a site and vertical search services
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Define a custom search instance
A Custom Search instance lets you tailor the search experience to include content only from websites that your users care about. Instead of performing a web-wide search, Bing searches only the slice of the web that interests you.
To create your custom view of the web, use the Bing Custom Search [portal](https://customsearch.ai). For information about signing in to the portal, see [Create your first Bing Custom Search instance](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-custom-search/quick-start). The portal lets you create a search instance that specifies the domains, subsites, and webpages that you want Bing to search, and those that you don’t want it to search. In addition to specifying the URLs of the content that you know about, you can also ask the portal to suggest content that you may want to add to your view. 
The following are the ways that you can define a slice of the web: 

1.	Domain. A domain slice includes all content found within. For example, www.microsoft.com. Omitting 'www' causes Bing to also search the domain’s subdomains. For example, if you specify microsoft.com, Bing also returns results from support.microsoft.com or technet.microsoft.com.
2.	Subsite. A subsite slice includes all content found in the subsite and paths below it. You may specify a maximum of two subsites in the path. For example, www.microsoft.com/en-us/windows/ 
3.	Webpage. A webpage slice includes only that webpage in your custom search. For example, https://www.microsoft.com/en-us/store/b/home. Specify the full URL of the webpage, If you do not include the HTTP protocol, the service treats it as a domain or subsite.

All domains, subsites, and webpages that you specify must be public and indexed by Bing. If you own a public site that you want to include in the search, and Bing hasn’t indexed it, see the Bing [webmaster documentation](https://www.bing.com/webmaster/help/webmaster-guidelines-30fba23a) for details about getting Bing to index it. Also, see the webmaster documentation for details about getting Bing to update your crawled site if the index is out of date.


## Adding slices to your custom search
When you define your custom search instance, you specify the active and blocked domains, subsites, and webpages that you want to search or not search.  

- Active: A list of domains, subsites, or webpages to include in the search. 
- Blocked: A list of domain, subsites, or webpages to exclude from the search. The items that you block should be content found under the domains and subpages listed in your Active list 

 To access each list, click on the Active and Blocked tabs in your custom search instance. 

## Active and Blocked lists 
To specify a slice of the web that you want Bing to search, click the **Active** tab and list the domains, subsites, and webpages to search. You can add a slice directly to the list or add more than one slice by uploading a text file using the upload icon.

File Upload details: 

- File upload is available only for adding slices to the Active list, you cannot use it to add slices to the Blocked. 
- Create a text file and specify a single domain, subsite, or webpage per line. The entire upload is rejected if an error occurs. 
- During the upload process, the service asks you to specify the type of each entry. For example, does the entry specify a site, subsite, or webpage. 
- If the Blocked list contains the domain, subsite, or webpage that you specified in the upload file, the service removes it from the Blocked list and adds it to the Active list. 
- The service ignores duplicates found in the upload file.

To edit or delete slices, use the options under the Controls column. 

All changes to the Active list are automatically saved and reflected instantly against your custom search endpoint.

Similarly, you can add slices to the Blocked list (except you can’t use an upload file to specify the slices).

## Pinned list
The portal also lets you pin a specific webpage to the top of the search result if the user enters a specific search term. The **Pinned** tab contains a list of query term and webpage pairs that specify the webpage that appears as the top result for a specific query. The user’s query term must exactly match the pinned query term.
For information about pinning results, see [Adjust Rank](#adjustrank).

## Site suggestions
After adding slices to the Active list, the service generates site and subsite suggestions that you might want to add to your search. The **You might want to add** section contains the suggestions. The instance settings page includes this section only if suggestions are available. 

To add suggestions to your Active list, click the + icon.  Because the service generates suggestions base on your settings, be sure to click **Refresh** after adding the suggestions. 

## Preview pane
At any time, you can test out your search instance by using the preview pane. This pane mimics the results that the instance would return for a specific query. You can also review Bing results by switching to Bing using the My Instance drop-down button next to the search button. 

> [!NOTE]
> Searches will hit the en-US Bing market

<a name="adjustrank"></a>
## Adjust rank
The portal lets you adjust ranking to manipulate the results that Bing returns. In the Preview pane, enter a search term and run the query. The preview pane list the search result for the query. To the right of each result is the list of adjustments you can make. 

- Block. Moves the domain, subsite, or webpage to the Blocked list. You select the level to block. Bing excludes content from the selected site in the search results. 
- Boost. Boosts content from the domain or subsite higher in the search results. You select whether to boost content from the domain or subsite that the webpage belongs to.
- Demote. Demotes content from the domain or subsite lower in the search results. You select whether to demote content from the domain or subsite that the webpage belongs to. 
- Pin-to-top. Define the webpage that appears at the top of the results if the user’s query term exactly matches the query term you used. The Active list does not have to contain the webpage for you to pin it. 

## Boosting and demoting
You can super boost, boost, or demote any domain or subsite in your Active list. By default, all slices are added with the same weight. Items that are Super boosted or Boosted are ranked higher in the search results (with super boost ranking higher than boost). Items that are demoted are ranked lower in the search results.

It is important to note that super boost, boost, and demote give respective weight variants to the domains or subpages. This is just one of many signals used by the ranker to determine the order of the results. This means that their effect for a specific query is not guaranteed as many other factors might influence the overall ranking of the web results.  To determine the possible effect that boosting or demoting has on the ranker, test the search experience using the Preview pane.

You can super boost, boost, or demote items by using the Ranking Adjust controls in the Active list or by using the Boost and Demote controls exposed in the Preview pane. The service adds the slice to your Active list and adjust the ranking accordingly.

Super boost, boost, and demote changes are automatically saved and reflect instantly against your custom search endpoint. 

## Pin to top
To pin a webpage to the top of the search results for a specific query, choose one of the following options:

1.	In the Pinned tab, enter the URL of the webpage to pin to the top of the results and the exact query that will trigger the pinning. 
2.	In the Preview pane, enter a query term and click search. Next, identify the webpage in the results that you want to pin to the top of the results if the user enters the same query. Then, click Pin to top. The service adds the webpage and query to the Pinned list. 

You can track your pins in the Pinned tab. The pins are shown as '\<query\>, \<webpage\>' pairs. 

Changes are automatically saved and reflect instantly against your custom search instance. 

The webpage is pinned only if the user’s query exactly matches your query. 

Please note the following restrictions when working with pins: 

- For a specific query, you can pin a maximum of one webpage to the top of the results.

## Use Bing to specify slices
There are a couple of ways to specify the slices of the web that make up your custom search. If you know the slices you want to include in your instance, simply add them to your instance’s Active list. For information about adding items to the Active list yourself, see Define your custom instance.
But if you’re not sure which slices to include, you can run Bing queries in the Preview pane and see what Bing returns. You can then select the slices that you want to include in your custom search. You likely need to run multiple query terms to make sure you identify all the slices that you want for your instance. 

Follow these steps to use Bing to add slices to your Custom Search instance. 
1.	Sign in to Bing Custom Search [portal](https://customsearch.ai).
2.	Create an instance or select an instance to update .
3.	In the Preview pane on the right side, select Bing from the dropdown list.
4.	In the search box, enter a query term that’s relevant for your instance.
5.	Click **Add site** next to the result you want to include.
6.	Select **Entire Site**, **Subsite**, or **Exact URL** in the **What do you want to add**? window.
7.	Click the **Ok** button.

## Understanding Quota
- For each custom search instance, the maximum number of ranking adjustments that you may make to **Active** and **Blocked** slices is limited to 400.
- Adding a slice to the Active or Blocked tabs counts as one ranking adjustment.
- Boosting and demoting count as two ranking adjustments.
- For each custom search instance, the maximum number of pins that you may make is limited to 200.

## Next steps

- [Search your custom instance](./search-your-custom-view.md)
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)