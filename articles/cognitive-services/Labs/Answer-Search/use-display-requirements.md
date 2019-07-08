---
title: Use and display requirements - Project Answer Search
titlesuffix: Azure Cognitive Services
description: Use and display requirements for the Project Answer Search endpoint.
services: cognitive-services
author: mikedodaro
manager: nitinme

ms.service: cognitive-services
ms.subservice: answer-search
ms.topic: conceptual
ms.date: 04/13/2018
ms.author: rosh
---

# Project Answer Search use and display requirements

Use and display requirements apply to any implementation of the content and associated information, for example, relationships, metadata and other signals, available through calls to the Bing Knowledge Search, Bing Custom Search, Entity Search, Image Search, News Search, Video Search, Visual Search, Web Search, Spell Check, and Autosuggest APIs. Implementation details related to these requirements can be found in documentation for specific features and results.

## 1. Bing Spell Check and Bing Autosuggest API.

Do not:

- copy, store, or cache any data you receive from the Bing Spell Check, or Bing Autosuggest APIs
- use data you receive from the Bing Spell Check or Bing Autosuggest APIs as part of any machine learning or similar algorithmic activity to train, evaluate, or improve new or existing services which you or third parties may offer.

## 2. Definitions

- "answer" refers to a category of results returned in a response. For example, a response from the Bing Web Search API may include answers in the categories of webpage results, image, video, and news;
- "response" means any and all answers and associated data received in response to a single call to a Search API;
- "result" refers to an item of information in an answer. For example, the set of data connected with a single news article is a result in a news answer.
- “Search APIs” means, collectively, the Bing Custom Search, Entity Search, Image Search, News Search, Video Search, Visual Search, and Web Search APIs. 


## 3. Search APIs

The requirements in this Section 3 apply to the Search APIs.

**A. Internet search experience.** All data returned in responses may only be used in internet search experiences. An internet search experience means the content displayed, as applicable: 
- is relevant and responsive to the end user's direct query or other indication of the user's search interest and intent (for example, user-indicated search query); 
- helps users find and navigate to the sources of data (for example, the provided URLs are implemented as hyperlinks so the content or attribution is a clickable link conspicuously displayed with the data); or, if of Bing Entity Search API, visibly link to the bing.com URL provided in the response that enables the user to navigate to the search results for the relevant query on bing.com;
- includes multiple results for the end user to select from (for example, several results from the news answer are displayed, or all results if fewer than several are returned); 
- is limited to an amount appropriate to serve the search purpose (for example, image thumbnails are thumbnail-sized in proportion to the user's display); 
- includes visible indication to the end user that the content is Internet search results (for example, a statement that the content is "From the web"); and
- includes any other combination of measures appropriate to ensure your use of data received from the Search APIs does not violate any applicable laws or third-party rights (for example, if relying on a Creative Commons license, complying with the applicable license terms). Consult your legal advisors to determine what measures may be appropriate.
The only exception to the internet search experience requirement is for URL discovery as described in Section 3E (Non-display URL discovery) following. 

**B. Restrictions.** Do not:

- copy, store, or cache any data from responses (except retention to the extent permitted by the "Continuity of Service" section following); 
- use data received from the Search APIs as part of any machine learning or similar algorithmic activity to train, evaluate, or improve new or existing services that you or third parties may offer.
- modify content of results (other than to reformat them in a way that does not violate any other requirement), unless required by law or agreed by Microsoft; 
- omit attribution and URLs associated with result content;
- reorder, including by omission, results displayed in an answer when an order or ranking is provided (for the Bing Custom Search API, this rule does not apply to reordering implemented through the customsearch.ai portal), unless required by law or agreed by Microsoft;
- display other content within any part of a response in a way that would lead an end user to believe that the other content is part of the response; 
- display advertising that is not provided by Microsoft on any page that displays any part of a response; 
-display any advertising with responses (i) from the Bing Image, News or Video Search APIs; or (ii) that are filtered or limited primarily (or solely) to image, news and/or video results.

**C. Notices and Branding.** 

- Prominently include a functional hyperlink to the Microsoft Privacy Statement, available at  https://go.microsoft.com/fwlink/?LinkId=521839, near each point in the user experience (UX) that offers a user the ability to input a search query. Label the hyperlink “Microsoft Privacy Statement”.
- Prominently display Bing branding, consistent with the guidelines available at https://go.microsoft.com/fwlink/?linkid=833278, near each point in the UX that offers a user the ability to input a search query.  Such branding must clearly denote to the user that Microsoft is powering the internet search experience.
- You may attribute each response (or portion of a response) displayed from the Bing Web, Image, News, and Video APIs to Microsoft as described in https://go.microsoft.com/fwlink/?linkid=833278, unless Microsoft specifies otherwise in writing for your use. 
- Do not attribute responses (or portions of responses) displayed from the Bing Custom Search API to Microsoft, unless Microsoft specifies otherwise in writing for your particular use.


**D. Transferring responses.** If you enable a user to transfer a response from a Search API to another user, such as through a messaging app or social media posting, the following apply: 
- Transferred responses must:
  - Consist of content that is unmodified from the content of the responses displayed to the transferring user (formatting changes are permissible);
  - Not include any data in metadata form;
  - For responses from the Bing Web, Image, News, and Video APIs, display language indicating the response was obtained through an internet search experience powered by Bing (for example, "Powered by Bing," "Learn more about this image on Bing," or using the Bing logo);
  - For responses from the Bing Custom Search API, display language indicating the response was obtained through an internet search experience (for example, "Learn more about this search result”);
  - Prominently display the full query used to generate the response; and
  - Include a prominent link or similar attribution to the underlying source of the response, either directly or through the search engine (bing.com, m.bing.com, or your custom search service, as applicable).
- You may not automate the transfer of responses. A transfer must be initiated by a user action clearly evidencing an intent to transfer a response.
- You may only enable a user to transfer responses that were displayed in response to the transferring user's query.

**E. Continuity of service.** Do not copy, store, or cache any data from Search API responses. However, to enable continuity of service access and data rendering, you may retain results solely under the following conditions:

**Device.** You may enable an end user to retain results on a device for the lesser of (i) 24 hours from the time of the query or (ii) until an end user submits another query for updated results, provided that retained results may be used only:

- to enable the end user to access results previously returned to that end user on that device (for example, in case of service interruption); or
- to store results returned for your proactive query personalized in anticipation of the end user's needs based on that end user's signals (for example, in case of anticipated service interruption).

**Server.** You may retain results specific to a single end user securely on a server you control and display the retained results only:

- to enable the end user to access a historical report of results previously returned to that user in your solution, provided that the results may not be (i) retained for more than 21 days from the time of the end user's initial query and (ii) displayed in response to an end user's new or repeated query; or
- to store results returned for your proactive query personalized in anticipation of an end user's needs based on that end user's signals for the lesser of (i) 24 hours from the time of the query or (ii) until an end user submits another query for updated results.

Whenever retained, results for a specific user cannot be commingled with results for another user, i.e., the results of each user must be retained and delivered separately.

**General.** For all presentation of retained results:

- include a clear, visible notice of the time the query was sent,
- present the user a button or similar means to re-query and obtain updated results, 
- retain the Bing branding in the presentation of the results, and
- delete (and refresh with a new query if needed) the stored results within the timeframes specified.

**F. Non-display URL discovery.** You may only use search responses in a non-internet search experience for the sole purpose of discovering URLs of sources of information responsive to a query from your user or customer. You may copy such URLs in a report or similar response you provide (i) only to that user or customer, in response to that query and (ii) that includes significant additional valuable content relevant to the query. The requirements in sections 3A through 3E of these use and display requirements do not apply to this non-display use, except: 

- You shall not cache, copy, or store any data or content from, or derived from, the search response, other than the limited URL copying described previously;
- Ensure your use of data (including the URLs) received from the Search APIs does not violate any applicable laws or third-party rights; and
- You shall not use the data (including the URLs) received from the Search APIs as part of any search index or machine learning or similar algorithmic activity to create train, evaluate, or improve services that you or third parties may offer.

## Next steps
[Answer Search overview](overview.md)
