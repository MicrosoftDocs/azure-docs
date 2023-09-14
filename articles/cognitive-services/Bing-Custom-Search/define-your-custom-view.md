---
title: Configure your Bing Custom Search experience | Microsoft Docs
titleSuffix: Azure AI services
description: The portal lets you create a search instance that specifies the slices of the web; domains, subpages, and webpages.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: conceptual
ms.date: 02/12/2019
ms.author: aahi
---

# Configure your Bing Custom Search experience

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

A Custom Search instance lets you tailor the search experience to include content only from websites that your users care about. Instead of performing a web-wide search, Bing searches only the slices of the web that interest you. To create your custom view of the web, use the Bing Custom Search [portal](https://www.customsearch.ai).

The portal lets you create a search instance that specifies the slices of the web: domains, subpages, and webpages, that you want Bing to search, and those that you don’t want it to search. The portal can also suggest content that you may want to include.

Use the following when defining your slices of the web:

| Slice name | Description                                                                                                                                                                                                                                                                                                |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Domain     | A domain slice includes all content found within an internet domain. For example, `www.microsoft.com`. Omitting `www.` causes Bing to also search the domain’s subdomains. For example, if you specify `microsoft.com`, Bing also returns results from `support.microsoft.com` or `technet.microsoft.com`. |
| Subpage    | A subpage slice includes all content found in the subpage and paths below it. You may specify a maximum of two subpages in the path. For example, `www.microsoft.com/en-us/windows/`                                                                                                                       |
| Webpage    | A webpage slice can include only that webpage in a custom search. You can optionally specify whether to include subpages.                                                                                                                                                                                  |

> [!IMPORTANT]
> All domains, subpages, and webpages that you specify must be public and indexed by Bing. If you own a public site that you want to include in the search, and Bing hasn’t indexed it, see the Bing [webmaster documentation](https://www.bing.com/webmaster/help/webmaster-guidelines-30fba23a) for details about getting Bing to index it. Also, see the webmaster documentation for details about getting Bing to update your crawled site if the index is out of date.

## Add slices of the web to your custom search instance

When you create your custom search instance, you can specify the slices of the web: domains, subpages, and webpages, that you want to have included or blocked from your search results. 

If you know the slices you want to include in your custom search instance, add them to your instance’s **Active** list. 

If you’re not sure which slices to include, you can send search queries to Bing in the **Preview** pane and select the slices that you want. To do this: 

1. select "Bing" from the dropdown list in the Preview pane, and enter a search query

2. Click **Add site** next to the result you want to include. Then click OK.

>[!NOTE]
> [!INCLUDE[publish or revert](./includes/publish-revert.md)]

<a name="active-and-blocked-lists"></a>

### Customize your search experience with Active and Blocked lists 

You can access the list of active and blocked slices by clicking on the **Active** and **Blocked** tabs in your custom search instance. Slices added to the active list will be included in your custom search. Blocked slices won't be searched, and won't appear in your search results.

To specify the slices of the web you want Bing to search, click the **Active** tab and add one or more URLs. To edit or delete URLs, use the options under the **Controls** column. 

When adding URLs to the **Active** list you can add single URLs, or multiple URLs at once by uploading a text file using the upload icon.

![The Bing Custom Search Active tab](media/file-upload-icon.png)

To upload a file, create a text file and specify a single domain, subpage, or webpage per line. Your file will be rejected if it isn't formatted correctly.

> [!NOTE]
> * You can only upload a file to the **Active** list. You cannot use it to add slices to the **Blocked** list.  
> * If the **Blocked** list contains a domain, subpage, or webpage that you specified in the upload file, it will be removed from the **Blocked** list, and added to the **Active** list.
> * Duplicate entries in your upload file will be ignored by Bing Custom Search. 

### Get website suggestions for your search experience

After adding web slices to the **Active** list, the Bing Custom Search portal will generate website and subpage suggestions at the bottom of the tab. These are slices that Bing Custom Search thinks you might want to include. Click **Refresh** to get updated suggestions after updating your custom search instance's settings. This section is only visible if suggestions are available.

## Search for images and videos

You can search for images and videos similarly to web content by using the [Bing Custom Image Search API](/rest/api/cognitiveservices-bingsearch/bing-custom-images-api-v7-reference) or the [Bing Custom Video Search API](/rest/api/cognitiveservices-bingsearch/bing-custom-videos-api-v7-reference). You can display these results with the [hosted UI](hosted-ui.md), or the APIs. 

These APIs are similar to the non-custom [Bing Image Search](../bing-image-search/overview.md) and [Bing Video Search](../bing-video-search/overview.md) APIs, but search the entire web, and do not require the `customConfig` query parameter. See these documentation sets for more information on working with images and videos. 

## Test your search instance with the Preview pane

You can test your search instance by using the preview pane on the portal's right side to submit search queries and view the results. 

1. Below the search box, select **My Instance**. You can compare the results from your search experience to Bing, by selecting **Bing**. 
2. Select a safe search filter and which market to search (see [Query Parameters](/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference#query-parameters)).
3. Enter a query and press enter or click the search icon to view the results from the current configuration. You can change your search type you perform by clicking **Web**, **Image**, or **Video** to get corresponding results. 

<a name="adjustrank"></a>

## Adjust the rank of specific search results

The portal enables you to adjust the search ranking of content from specific domains, subpages, and webpages. After sending a search query in the preview pane, each search result contains a list of adjustments you can make for it:  

| Adjustment | Description |
|------------|-------------|
| Block      | Moves the domain, subpage, or webpage to the Blocked list. Bing will exclude content from the selected site from appearing in the search results.                    |
| Boost      | Boosts content from the domain or subpage to be higher in the search results.                                                                                        |
| Demote     | Demotes content from the domain or subpage lower in the search results. You select whether to demote content from the domain or subpage that the webpage belongs to. |
| Pin to top | Moves the domain, subpage, or webpage to the **Pinned** list. This Forces the webpage to appear as the top search result for a given search query.                   |

Adjusting rank is not available for image or video searches.

### Boosting and demoting search results

You can super boost, boost, or demote any domain or subpage in the **Active** list. By default, all slices are added with no ranking adjustments. Slices of the web that are Super boosted or Boosted are ranked higher in the search results (with super boost ranking higher than boost). Items that are demoted are ranked lower in the search results.

You can super boost, boost, or demote items by using the **Ranking Adjust** controls in the **Active** list, or by using the Boost and Demote controls in the Preview pane. The service adds the slice to your Active list and adjusts the ranking accordingly.

> [!NOTE] 
> Boosting and demoting domains and subpages is one of many methods Bing Custom Search uses to determine the order of search results. Because of other factors influencing the ranking of different web content, the effects of adjusting rank may vary. Use the Preview pane to test the effects of adjusting the rank of your search results. 

Super boost, boost, and demote are not available for the image and video searches.

## Pin slices to the top of search results

The portal also lets you pin URLs to the top of search results for specific search terms, using the **Pinned** tab. Enter a URL and query to specify the webpage that will appear as the top result. Note that you can pin a maximum of one webpage per search query, and only indexed webpages will be displayed in searches. Pinning results is not available for image or video searches.

You can pin a webpage to the top in two ways:

* In the **Pinned** tab, enter the URL of the webpage to pin to the top, and its corresponding query.

* In the **Preview** pane, enter a search query and click search. Find the webpage you want to pin for your query, and click **Pin to top**. the webpage and query will be added to the **Pinned** list.

### Specify the pin's match condition

By default, webpages are only pinned to the top of search results when a user's query string exactly matches one listed in the **Pinned** list. You can change this behavior by specifying one of the following match conditions:

> [!NOTE]
> All comparisons between the user's search query, and the pin's search query are case insensitive.

| Value | Description                                                                          |
|---------------|----------------------------------------------------------------------------------|
| Starts with | The pin is a match if the user's query string starts with the pin's query string |
| Ends with   | The pin is a match if the user's query string ends with the pin's query string.  |
| Contains    | The pin is a match if the user's query string contains the pin's query string.   |


To change the pin's match condition, click the pin's edit icon. In the **Query match condition** column, click the dropdown list and select the new condition to use. Then, click the save icon to save the change.

### Change the order of your pinned sites

To change the order of your pins, you can drag-and-drop the them, or edit their order number by clicking the "edit" icon in the **Controls** Column of the **Pinned** list.

If multiple pins satisfy a match condition, Bing Custom Search will use the one highest in the list.

## View statistics

If you subscribed to Custom Search at the appropriate level (see the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/)), a **Statistics** tab is added to your production instances. The statistics tab shows details about how your Custom Search endpoints are used, including call volume, top queries, geographic distribution, response codes, and safe search. You can filter details using the provided controls.

## Usage guidelines

- For each custom search instance, the maximum number of ranking adjustments that you may make to **Active** and **Blocked** slices is limited to 400.
- Adding a slice to the Active or Blocked tabs counts as one ranking adjustment.
- Boosting and demoting count as two ranking adjustments.
- For each custom search instance, the maximum number of pins that you may make is limited to 200.

## Next steps

- [Call your custom search](./search-your-custom-view.md)
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](../bing-web-search/hit-highlighting.md)
- [Page webpages](../bing-web-search/paging-search-results.md)
