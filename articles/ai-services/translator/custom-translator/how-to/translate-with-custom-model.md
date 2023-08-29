---
title: Translate text with a custom model
titleSuffix: Azure AI services
description: How to make translation requests using custom models published with the Azure AI Translator Custom Translator.  
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: how-to
---
# Translate text with a custom model 

After you publish your custom model, you can access it with the Translator API by using the `Category ID` parameter. 

## How to translate

1. Use the `Category ID` when making a custom translation request via Microsoft Translator [Text API V3](../../reference/v3-0-translate.md?tabs=curl). The `Category ID` is created by concatenating the WorkspaceID, project label, and category code. Use the `CategoryID` with the Text Translation API to get custom translations.

   ```http
   https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=de&category=a2eb72f9-43a8-46bd-82fa-4693c8b64c3c-TECH

   ```

   More information about the Translator Text API can be found on the [Translator API Reference](../../reference/v3-0-translate.md) page.

1. You may also want to download and install our free [DocumentTranslator app for Windows](https://github.com/MicrosoftTranslator/DocumentTranslation/releases).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about building and publishing custom models](../beginners-guide.md)
