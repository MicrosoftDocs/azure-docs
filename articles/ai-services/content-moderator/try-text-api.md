---
title: Moderate text by using the Text Moderation API - Content Moderator
titleSuffix: Azure AI services
description: Test-drive text moderation by using the Text Moderation API in the online console.
services: cognitive-services
author: PatrickFarley
ms.author: pafarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: how-to
ms.date: 10/27/2021
---

# Moderate text from the API console

Use the [Text Moderation API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f) in Azure AI Content Moderator to scan your text content for profanity and compare it against custom and shared lists.

## Get your API key

Before you can test-drive the API in the online console, you need your subscription key. This is located on the **Settings** tab, in the **Ocp-Apim-Subscription-Key** box. For more information, see [Overview](overview.md).

## Navigate to the API reference

Go to the [Text Moderation API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f). 

  The **Text - Screen** page opens.

## Open the API console

For **Open API testing console**, select the region that most closely describes your location. 

  ![Text - Screen page region selection](images/test-drive-region.png)

  The **Text - Screen** API console opens.

## Select the inputs

### Parameters

Select the query parameters that you want to use in your text screen. For this example, use the default value for **language**. You can also leave it blank because the operation will automatically detect the likely language as part of its execution.

> [!NOTE]
> For the **language** parameter, assign `eng` or leave it empty to see the machine-assisted **classification** response (preview feature). **This feature supports English only**.
>
> For **profanity terms** detection, use the [ISO 639-3 code](http://www-01.sil.org/iso639-3/codes.asp) of the supported languages listed in this article, or leave it empty.

For **autocorrect**, **PII**, and **classify (preview)**, select **true**. Leave the **ListId** field empty.

  ![Text - Screen console query parameters](images/text-api-console-inputs.png)

### Content type

For **Content-Type**, select the type of content you want to screen. For this example, use the default **text/plain** content type. In the **Ocp-Apim-Subscription-Key** box, enter your subscription key.

### Sample text to scan

In the **Request body** box, enter some text. The following example shows an intentional typo in the text.

```
Is this a grabage or <offensive word> email abcdef@abcd.com, phone: 4255550111, IP: 
255.255.255.255, 1234 Main Boulevard, Panapolis WA 96555.
```

## Analyze the response

The following response shows the various insights from the API. It contains potential profanity, personal data, classification (preview), and the auto-corrected version.

> [!NOTE]
> The machine-assisted 'Classification' feature is in preview and supports English only.

```json
{
   "original_text":"Is this a grabage or <offensive word> email abcdef@abcd.com, phone: 
   6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.",
   "normalized_text":"   grabage  <offensive word> email abcdef@abcd.com, phone: 
   6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.",
   "auto_corrected_text":"Is this a garbage or <offensive word> email abcdef@abcd.com, phone: 
   6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.",
   "status":{
      "code":3000,
      "description":"OK"
   },
   "pii":{
      "email":[
         {
            "detected":"abcdef@abcd.com",
            "sub_type":"Regular",
            "text":"abcdef@abcd.com",
            "index":32
         }
      ],
      "ssn":[

      ],
      "ipa":[
         {
            "sub_type":"IPV4",
            "text":"255.255.255.255",
            "index":72
         }
      ],
      "phone":[
         {
            "country_code":"US",
            "text":"6657789887",
            "index":56
         }
      ],
      "address":[
         {
            "text":"1 Microsoft Way, Redmond, WA 98052",
            "index":89
         }
      ]
   },
   "language":"eng",
   "terms":[
      {
         "index":12,
         "original_index":21,
         "list_id":0,
         "term":"<offensive word>"
      }
   ],
   "tracking_id":"WU_ibiza_65a1016d-0f67-45d2-b838-b8f373d6d52e_ContentModerator.
   F0_fe000d38-8ecd-47b5-a8b0-4764df00e3b5"
}
```

For a detailed explanation of all sections in the JSON response, refer to the [Text moderation](text-moderation-api.md) conceptual guide.

## Next steps

Use the REST API in your code, or follow the [.NET SDK quickstart](./client-libraries.md?pivots=programming-language-csharp%253fpivots%253dprogramming-language-csharp) to integrate with your application.
