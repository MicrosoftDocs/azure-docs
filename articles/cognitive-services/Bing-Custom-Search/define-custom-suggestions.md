---
title: Define Custom Autosuggest suggestions - Bing Custom Search
titlesuffix: Azure Cognitive Services
description: Describes how to configure Custom Autosuggest with custom suggestions
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: conceptual
ms.date: 09/28/2017
ms.author: v-brapel
---

# Configure your custom autosuggest experience

Custom Autosuggest returns a list of suggested search query strings that are relevant to your search experience. The suggested query strings are based on a partial query string that the user provides in the search box. The list will contain a maximum of 10 suggestions. 

You specify whether to return only custom suggestions or to also include Bing suggestions. If you include Bing suggestions, custom suggestions appear before the Bing suggestions. If you provide enough relevant suggestions, it's possible that the returned list of suggestions will not include Bing suggestions. Bing suggestions are always in the context of your Custom Search instance. 

To configure search query suggestions for your instance, click the **Autosuggest** tab.  

> [!NOTE]
> To use this feature, you must subscribe to Custom Search at the appropriate level (see [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/)).

It can take up to 24 hours for suggestions to be reflected in the serving endpoint (API or hosted UI).

## Enable Bing suggestions

To enable Bing suggestions, toggle the **Automatic Bing suggestions** slider to the on position. The slider becomes blue.

## Add your own suggestions

To add your own query string suggestions, add them to the list under **User-defined suggestions**. After adding a suggestion in the list, press the enter key or click the **+** icon. You can specify the suggestion in any language. You can add a maximum of 5,000 query string suggestions.

## Upload suggestions

As an option, you can upload a list of suggestions from a file. The file must contain one search query string per line. To upload the file, click the upload icon and select the file to upload. The service extracts the suggestions from the file and adds them to the list.

## Remove suggestions

To remove a query string suggestion, click the remove icon next to the suggestion you want to remove.

## Block suggestions

If you include Bing suggestions, you can add a list of search query strings you don't want Bing to return. To add blocked query strings, click **Show blocked suggestions**. Add the query string to the list and press the enter key or click the **+** icon. You can add a maximum of 50 blocked query strings.



[!INCLUDE[publish or revert](./includes/publish-revert.md)]

>[!NOTE]  
>It may take up to 24 hours for Custom Autosuggest configuration changes to take effect.


## Enabling Autosuggest in Hosted UI

To enable query string suggestions for your hosted UI, click **Hosted UI**. Scroll down to the **Additional Configuration** section. Under **Web search**, select **On** for **Enable autosuggest**. To enable Autosuggest, you must select a layout that includes a search box.


## Calling the Autosuggest API

To get suggested query strings using the Bing Custom Search API, send a `GET` request to the following endpoint.

```
GET https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/Suggestions 
```

The response contains a list of `SearchAction` objects that contain the suggested query strings.

```
        {  
            "displayText" : "sailing lessons seattle",  
            "query" : "sailing lessons seattle",  
            "searchKind" : "CustomSearch"  
        },  
```

Each suggestion includes a `displayText` and `query` field. The `displayText` field contains the suggested query string that you use to populate your search box's dropdown list.

If the user selects a suggested query string from the dropdown list, use the query string in the `query` field when calling the [Bing Custom Search API](overview.md).


## Next steps

- [Get custom suggestions](./get-custom-suggestions.md)
- [Search your custom instance](./search-your-custom-view.md)
- [Configure and consume custom hosted UI](./hosted-ui.md)