---
title: "Content Moderator REST API quickstart"
titleSuffix: Azure AI services
description: In this quickstart, learn how to get started with the Azure Content Moderator REST API. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: include
ms.date: 12/08/2020
ms.author: pafarley
---

Get started with the Azure Content Moderator REST API. 

Content Moderator is an AI service that lets you handle content that is potentially offensive, risky, or otherwise undesirable. Use the AI-powered content moderation service to scan text, image, and videos and apply content flags automatically. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

Use the Content Moderator REST API to:

* Moderate text
* Moderate images

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator"  title="Create a Content Moderator resource"  target="_blank">create a Content Moderator resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Content Moderator. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.


## Moderate text

You'll use a command like the following to call the Content Moderator API to analyze a body of text and print the results to the console.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/content-moderator/quickstart.sh" ID="textmod":::

Copy the command to a text editor and make the following changes:

1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.
   [!INCLUDE [subdomains-note](../../../../../includes/cognitive-services-custom-subdomains-note.md)]
1. Optionally change the body of the request to whatever string of text you'd like to analyze.

Once you've made your changes, open a command prompt and enter the new command. 

### Examine the results

You should see the text moderation results displayed as JSON data in the console window. For example:

```json
{
  "OriginalText": "Is this a <offensive word> email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255,\n1 Microsoft Way, Redmond, WA 98052\n",
  "NormalizedText": "Is this a <offensive word> email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, \n1 Microsoft Way, Redmond, WA 98052",
  "AutoCorrectedText": "Is this a <offensive word> email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, \n1 Microsoft Way, Redmond, WA 98052",
  "Misrepresentation": null,
  "PII": {
    "Email": [
      {
        "Detected": "abcdef@abcd.com",
        "SubType": "Regular",
        "Text": "abcdef@abcd.com",
        "Index": 21
      }
    ],
    "IPA": [
      {
        "SubType": "IPV4",
        "Text": "255.255.255.255",
        "Index": 61
      }
    ],
    "Phone": [
      {
        "CountryCode": "US",
        "Text": "6657789887",
        "Index": 45
      }
    ],
    "Address": [
      {
        "Text": "1 Microsoft Way, Redmond, WA 98052",
        "Index": 78
      }
    ]
  },
 "Classification": {
    "Category1": 
    {
      "Score": 0.5
    },
    "Category2": 
    {
      "Score": 0.6
    },
    "Category3": 
    {
      "Score": 0.5
    },
    "ReviewRecommended": true
  },
  "Language": "eng",
  "Terms": [
    {
      "Index": 10,
      "OriginalIndex": 10,
      "ListId": 0,
      "Term": "<offensive word>"
    }
  ],
  "Status": {
    "Code": 3000,
    "Description": "OK",
    "Exception": null
  },
  "TrackingId": "1717c837-cfb5-4fc0-9adc-24859bfd7fac"
}
```

For more information on the text attributes that Content Moderator screens for, see the [Text moderation concepts](../../text-moderation-api.md) guide.

## Moderate images

You'll use a command like the following to call the Content Moderator API to moderate a remote image and print the results to the console.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/content-moderator/quickstart.sh" ID="imagemod":::

Copy the command to a text editor and make the following changes:

1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.
1. Optionally change the `"Value"` URL in the request body to whatever remote image you'd like to moderate.

> [!TIP]
> You can also moderate local images by passing their byte data into the request body. See the [reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c) to learn how to do this.

Once you've made your changes, open a command prompt and enter the new command. 

### Examine the results

You should see the image moderation results displayed as JSON data in the console window. 

```json
{
  "AdultClassificationScore": x.xxx,
  "IsImageAdultClassified": <Bool>,
  "RacyClassificationScore": x.xxx,
  "IsImageRacyClassified": <Bool>,
  "AdvancedInfo": [],
  "Result": false,
  "Status": {
    "Code": 3000,
    "Description": "OK",
    "Exception": null
  },
  "TrackingId": "<Request Tracking Id>"
}
```

For more information on the image attributes that Content Moderator screens for, see the [Image moderation concepts](../../image-moderation-api.md) guide.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator REST API to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

* [Image moderation concepts](../../image-moderation-api.md)
* [Text moderation concepts](../../text-moderation-api.md)
