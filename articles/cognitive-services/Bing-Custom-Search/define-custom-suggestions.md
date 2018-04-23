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
If you subscribed to Custom Search at the appropriate level (see the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/)), you can customize the search suggestions made in your Custom Search experience. Custom Autosuggest returns a list of suggested queries based on a partial query string that the user provides. With Custom Autosuggest, you add suggestions that appear before the suggestions that Bing provides. Bing suggestions are restricted to the context of your Custom Search instance.

## Enable Custom Autosuggest
Use the following instructions to enable Custom Autosuggest for your Custom Search instance.

1.	Sign in to [Custom Search](https://customsearch.ai).
2.	Click a Custom Search instance. To create an instance, see [Create your first Bing Custom Search instance](quick-start.md).
3.  Click the **Autosuggest** tab.
4.  Toggle the **Enable autosuggest** slider to the on position. The slider becomes blue.

## Add suggestions
To add a suggestion, enter it into the text box whose place-holder reads **Type in a search suggestion**. Press the enter key or click the **+** icon. Custom suggestions can be in any language.

## Upload suggestions
You can upload a list of suggestions from a file, place each suggestion on a separate line. Click the upload icon and select your file.

## Remove suggestions
To remove a suggestion, click the remove icon next to the suggestion you want to remove.

  >[!NOTE]  
  >It may take up to 24 hours for changes to take effect.

## Next steps

- [Get custom suggestions](./get-custom-suggestions.md)
- [Search your custom instance](./search-your-custom-view.md)
- [Configure and consume custom hosted UI](./hosted-ui.md)