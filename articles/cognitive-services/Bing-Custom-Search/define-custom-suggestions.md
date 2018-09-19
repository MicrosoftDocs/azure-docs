---
title: "Bing Custom Search: Define Custom Autosuggest suggestions | Microsoft Docs"
description: Describes how to configure Custom Autosuggest with custom suggestions
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-custom-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Configure your custom autosuggest experience
If you subscribed to Custom Search at the appropriate level (see the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/)), you can customize the search suggestions made in your Custom Search experience. Custom Autosuggest returns a list of suggested queries based on a partial query string that the user provides. With Custom Autosuggest, you provide custom search suggestions relevant to your search experience. You specify whether to return only custom suggestions or to also include Bing suggestions. If you include Bing suggestions, custom suggestions appear before the Bing suggestions. Bing suggestions are restricted to the context of your Custom Search instance.

## Configure Custom Autosuggest
Use the following instructions to configure Custom Autosuggest for your Custom Search instance.

1.  Sign in to [Custom Search](https://customsearch.ai).
2.  Click a Custom Search instance. To create an instance, see [Create your first Bing Custom Search instance](quick-start.md).
3.  Click the **Autosuggest** tab.

## Enable Bing suggestions
To enable Bing suggestions, toggle the **Automatic Bing suggestions** slider to the on position. The slider becomes blue.

## Add suggestions
To add a suggestion, enter it into the text box. Press the enter key or click the **+** icon. Custom suggestions can be in any language and will appear before Bing suggestions.

## Upload suggestions
You can upload a list of suggestions from a file. Place each suggestion on a separate line. Click the upload icon and select your file.

## Remove suggestions
To remove a suggestion, click the remove icon next to the suggestion you want to remove.

[!INCLUDE [publish or revert](./includes/publish-revert.md)]

  >[!NOTE]  
  >It may take up to 24 hours for Custom Autosuggest configuration changes to take effect.

## Next steps

- [Get custom suggestions](./get-custom-suggestions.md)
- [Search your custom instance](./search-your-custom-view.md)
- [Configure and consume custom hosted UI](./hosted-ui.md)