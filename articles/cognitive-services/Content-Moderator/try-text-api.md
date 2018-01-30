---
title: Moderate text by using the Text Moderation API in Azure Content Moderator | Microsoft Docs
description: Test-drive text moderation by using the Text Moderation API in the online console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Moderate text from the API console

Use the [Text Moderation API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f) in Azure Content Moderator to scan your text content. The operation scans your content for profanity, and compares the content against custom and shared blacklists.

## Use the API console
Before you can test-drive the API in the online console, you need your subscription key. This is located on the **Settings** tab, in the **Ocp-Apim-Subscription-Key** box. For more information, see [Overview](overview.md).
1.	Go to the [Text Moderation API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f). 

  The **Text - Screen** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 

  ![Text - Screen page region selection](images/test-drive-region.png)

  The **Text - Screen** API console opens.

3.  Select the query parameters that you want to use in your text screen. For this example, use the default value for **language**. For **autocorrect**, **PII**, and **clssify (preview)**, select **true**. Leave the **ListId** field empty.

  ![Text - Screen console query parameters](images/text-api-console-inputs.PNG)
 
4.	For **Content-Type**, select the type of content you want to screen. For this example, use the default **text/plain** content type. In the **Ocp-Apim-Subscription-Key** box, enter your subscription key.

5.	In the **Request body** box, enter some text. The following example shows an intentional typo in the text.

```
	Is this a grabage or crap email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
	These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300.
	Also, 544-56-7788 looks like a social security number (SSN).
```

6.	The following response shows the various insights from the API. It contains potential profanity, PII, classification (preview), and the auto-corrected version.

> [!NOTE]
> The machine-assisted 'Classification` feature is in preview.

```
{
	"OriginalText": "Is this a grabage or crap email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.\r\nThese are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300.\r\nAlso, 544-56-7788 looks like a social security number (SSN).",
	"NormalizedText": "Is this a grabage or crap email abcdef@ abcd. com, phone: 6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, Redmond, WA 98052. \r\nThese are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300. \r\nAlso, 544- 56- 7788 looks like a social security number ( SSN) .",
"Misrepresentation": null,
	"PII": {
    		"Email": [{
      			"Detected": "abcdef@abcd.com",
      			"SubType": "Regular",
      			"Text": "abcdef@abcd.com",
      			"Index": 32
    			}],
    		"IPA": [{
      			"SubType": "IPV4",
      			"Text": "255.255.255.255",
      			"Index": 72
    			}],
    		"Phone": [{
      			"CountryCode": "US",
      			"Text": "6657789887",
      			"Index": 56
    			}, {
      			"CountryCode": "US",
      			"Text": "870 608 4000",
      			"Index": 211
    			}, {
      			"CountryCode": "UK",
      			"Text": "+44 870 608 4000",
      			"Index": 207
    			}, {
      			"CountryCode": "UK",
      			"Text": "0344 800 2400",
      			"Index": 227
    			}, {
      			"CountryCode": "UK",
      			"Text": "0800 820 3300",
      			"Index": 244
    		}],
   		 "Address": [{
     			 "Text": "1 Microsoft Way, Redmond, WA 98052",
      			"Index": 89
    		}],
    		"SSN": [{
      			"Text": "665778988",
      			"Index": 56
    		}, {
      			"Text": "544-56-7788",
      			"Index": 266
    		}]
  		},
	"Classification": {
    	"ReviewRecommended": true,
    	"Category1": {
      		"Score": 1.5113095059859916E-06
    	},
    	"Category2": {
      		"Score": 0.12747249007225037
    	},
    	"Category3": {
      		"Score": 0.98799997568130493
    	}
  		},
  	"Language": "eng",
  	"Terms": [{
    		"Index": 21,
    		"OriginalIndex": 21,
    		"ListId": 0,
   		 "Term": "crap"
  		}],
  	"Status": {
    		"Code": 3000,
    		"Description": "OK",
    		"Exception": null
  		},
 	 "TrackingId": "2eaa012f-1604-4e36-a8d7-cc34b14ebcb4"
}
```

For an explanation of the various insights, refer to the [text moderation API overview](text-moderation-api.md).

## Next steps

Use the REST API in your code or start with the [text moderation .NET quickstart](text-moderation-quickstart-dotnet.md) to integrate with your application.
