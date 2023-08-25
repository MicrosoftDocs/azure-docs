---
title: Use and display requirements for the Bing Search APIs
titleSuffix: Azure AI services
description: The requirements for displaying search results from the Bing Search APIs in your applications.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: conceptual
ms.date: 01/12/2023
ms.author: aahi
---

# Bing Search API use and display requirements

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

These use and display requirements apply to any implementation of the content and associated information from the following Bing Search APIs, including relationships, metadata, and other signals.

- Bing Custom Search
- Bing Entity Search
- Bing Image Search
- Bing News Search
- Bing Video Search
- Bing Visual Search
- Bing Web Search
- Bing Spell Check
- Bing Autosuggest

## Definitions

|Term  |Description  |
|---------|---------|
|Answer     | A category of results returned in a response. For example, a response from the Bing Web Search API can include answers in the categories of webpage results, image, video, and news. |
|Response     | Any and all answers and associated data received in response to a single call to a Search API. |
|Result    | An item of information in an answer. For example, the set of data connected with a single news article is a result in a news answer. |
|Search APIs    | collectively, the Bing Custom Search, Entity Search, Image Search, News Search, Video Search, Visual Search, Local Business Search, and Web Search APIs. |

## Bing Spell Check and Bing Autosuggest API restrictions

Do not:

- Copy, store, or cache any data you receive from the Bing Spell Check or Bing Autosuggest APIs.
- Use data you receive from Bing Spell Check or Bing Autosuggest APIs as part of any machine learning or similar algorithmic activity. Do not use this data to train, evaluate, or improve new or existing services that you or third parties might offer.
- Display data received from the Bing Spell Check or Bing Autosuggest APIs on the same page as content from any general web search engine, large language models or advertising network.

## Bing Search APIs

> [!NOTE]
> The requirements in this section apply to only the Search APIs, which does not include Bing Spell Check or Bing Autosuggest.

### Internet search experience requirements

All data returned in responses may only be used in internet search experiences. An internet search experience means the content displayed:

- Is relevant and responsive to the end user's direct query, or other indication of their search interest and intent (for example, a user-indicated search query).

- Helps users find and navigate to the response's data sources. For example, providing clickable links from hyperlinks in the response.

- Includes multiple results for the user to select from.

- Are in a placement that enables users to search.

- Includes a visible indication that the content is an internet search result. For example, a statement that the content is "from the web".

- Includes any other appropriate measures to ensure your Bing Search API data does not violate any applicable laws or third-party rights. Consult your legal advisors to determine what measures may be appropriate.

The only exception to these internet search experience requirements is for URL discovery, as described later in this article.

### Restrictions

Do not:

- Copy, store, or cache any data from responses (except retention to the extent permitted by [continuity of service](#continuity-of-service).

- Use data received from the Search APIs as part of any machine learning or similar algorithmic activity. Do not use this data to train, evaluate, or improve new or existing services that you or third parties might offer.

- Display data received from the Search APIs on the same page as content from any general web search engine, large language models or advertising network.

- Modify the content of results (other than to reformat them in a way that does not violate any other requirement), unless required by law or agreed to by Microsoft.

- Omit attribution information and URLs associated with result content.

- Reorder, including by omission, the results displayed in an answer when an order or ranking is provided, unless required by law or agreed to by Microsoft.

    > [!NOTE]
    > This requirement does not apply to reordering implemented through the portal for the Bing Custom Search API.

- Display other content within any part of a response in a way that would lead a user to believe that the other content is part of the response.

- Display advertising that is not provided by Microsoft on any page that displays any part of a response.

- Display any advertising on pages with responses:
  - From the Bing Image, News Search, Video Search, or Visual Search APIs
  - That are filtered or limited primarily (or solely) to image, news and/or video or visual search results.

### Notices and branding

Do:

- Prominently include a functional hyperlink to the [Microsoft Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=521839), near each point in the user experience (UX) that offers a user the ability to input a search query. Label the hyperlink **Microsoft Privacy Statement**.

- Prominently display Bing branding, consistent with the [Bing Trademark Usage Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks), near each point in the UX that offers a user the ability to input a search query. Such branding must clearly state to the user that Microsoft is powering the internet search experience.

- You can attribute each response (or portion of a response) displayed from the Bing Web Search, Image Search, News Search, Video Search, and Visual Search APIs to Microsoft, unless Microsoft specifies otherwise in writing for your use. This is described in [Bing Trademark Usage Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks).

Do not:

- Attribute responses (or portions of responses) displayed from the Bing Custom Search API to Microsoft, unless Microsoft specifies otherwise in writing for your particular use.

### Transferring responses

If you enable a user to transfer a response from a Search API to another user, such as through a messaging app or social media posting, the following apply:

- Transferred responses must:
  - Consist of content that is unmodified from the content of the responses displayed to the transferring user. Formatting changes are permissible.
  - Not include any data in metadata form.
  - For responses from the Bing Web, Image, News, Video, and Visual APIs, display language indicating the response was obtained through an internet search experience powered by Bing. For example, you can display language such as "Powered by Bing" or "Learn more about this image on Bing," or you can use the Bing logo.
  - For responses from the Bing Custom Search API, display language indicating the response was obtained through an internet search experience. For example, you can display language such as "Learn more about this search result.”
  - Prominently display the full query used to generate the response.
  - Include a prominent link or similar attribution to the underlying source of the response, either directly or through the search engine (bing.com, m.bing.com, or your custom search service, as applicable).
- You may not automate the transfer of responses. A transfer must be initiated by a user action clearly evidencing an intent to transfer a response.
- You may only enable a user to transfer responses that were displayed in response to the transferring user's query.

### Continuity of service

Do not copy, store, or cache any data from Search API responses. However, to enable continuity of service access and data rendering, you may retain results solely under the following conditions:

#### Device

You may enable a user to retain results on a device for the lesser of (i) 24 hours from the time of the query, or (ii) until a user submits another query for updated results, provided that retained results may be used only:

- To enable the user to access results previously returned to that user on that device (for example, in case of service interruption).
- To store results returned for your proactive query personalized in anticipation of the user's needs, based on that user's signals (for example, in case of anticipated service interruption).

#### Server

You may retain results specific to a single user securely on a server you control, and display the retained results only:

- To enable the user to access a historical report of results previously returned to that user in your solution. The results may not be (i) retained for more than 21 days from the time of the end user's initial query, and (ii) displayed in response to a user's new or repeated query.
- To store results returned for your proactive query personalized in anticipation of the user's needs, based on that user's signals. You can store these results for the lesser of (i) 24 hours from the time of the query, or (ii) until a user submits another query for updated results.

Whenever retained, results for a specific user cannot be commingled with results for another user. That is, the results of each user must be retained and delivered separately.

### General

For all presentation of retained results:

- Include a clear, visible notice of the time the query was sent.
- Present the user with a button or similar means to re-query and obtain updated results.
- Retain the Bing branding in the presentation of the results.
- Delete (and refresh with a new query if needed) the stored results within the timeframes specified.

### Non-display URL discovery

You may only use search responses in a non-internet search experience for the sole purpose of discovering URLs of sources of information responsive to a query from your user or customer. You may copy such URLs in a report or similar response you provide:

- Only to that user or customer, in response to that query.
- Only if it includes significant additional valuable content, relevant to the query.

The previous sections of Search APIs use and display requirements do not apply to this non-display use, except for the following:

- Do not cache, copy, or store any data or content from, or derived from, the search response, other than the limited URL copying described previously.
- Ensure your use of data (including the URLs) received from the Search APIs does not violate any applicable laws or third-party rights.
- Do not use the data (including the URLs) received from the Search APIs as part of any search index or machine learning or similar algorithmic activity. Do not use this data to create train, evaluate, or improve services that you or third parties might offer.

## GDPR compliance  

With respect to any personal data subject to the European Union General Data Protection Regulation (GDPR) and that is processed in connection with calls to the Search APIs, Bing Spell Check API, or Bing Autosuggest API, you understand that you and Microsoft are independent data controllers under the GDPR. You are independently responsible for your compliance with the GDPR.
