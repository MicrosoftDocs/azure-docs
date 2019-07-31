---
title: "Quickstart: Analyze text content in Python - Content Moderator"
titleSuffix: Azure Cognitive Services
description: How to analyze text content for various objectionable material using the Content Moderator SDK for Python
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley

# As a Python developer of content management software, I want to analyze text content for offensive or inappropriate material so that I can categorize and handle it accordingly.
---

# Quickstart: Analyze text content for objectionable material in Python

This article provides information and code samples to help you get started using the Content Moderator SDK for Python. You will learn how to execute term-based filtering and classification of text content with the aim of moderating potentially objectionable material.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites
- A Content Moderator subscription key. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Content Moderator and get your key.
- [Python 2.7+ or 3.5+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installing/) tool

## Get the Content Moderator SDK

Install the Content Moderator Python SDK by opening a command prompt and running the following command:

```bash
pip install azure-cognitiveservices-vision-contentmoderator
```

## Import modules

Create a new Python script named _ContentModeratorQS.py_ and add the following code to import the necessary parts of the SDK. The pretty print module is included for an easier to read JSON response.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/content_moderator_quickstart.py?name=imports)]


## Initialize variables

Next, add variables for your Content Moderator subscription key and endpoint URL. Add the name `CONTENT_MODERATOR_SUBSCRIPTION_KEY` to your environment variables with your subscription key as its value. For your base endpoint URL, add `CONTENT_MODERATOR_ENDPOINT` to your environment variables with your region-specific URL as its value, for example `https://westus.api.cognitive.microsoft.com`. Free trial subscription keys are generated in the **westus** region.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/content_moderator_quickstart.py?name=authentication)]

A string of multiline text from a file will be moderated. Include the [content_moderator_text_moderation.txt](https://github.com/Azure-Samples/cognitive-services-content-moderator-samples/blob/master/documentation-samples/python/content_moderator_text_moderation.txt) file into your local root folder and add its file name to your variables:

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/content_moderator_quickstart.py?name=textModerationFile)]

## Query the Moderator service

Create a **ContentModeratorClient** instance using your subscription key and endpoint URL. 

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/content_moderator_quickstart.py?name=client)]

Then, use your client with its member **TextModerationOperations** instance to call the moderation API with the function `screen_text`. See the **[screen_text](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.textmoderationoperations?view=azure-python)** reference documentation for more information on how to call it.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/content_moderator_quickstart.py?name=textModeration)]

## Check the printed response

Run the sample and confirm the response. Upon successful completion is returns a **Screen** instance. 
A successful result is shown below:

```console
{'auto_corrected_text': '" Is this a garbage email abide@ abed. com, phone: '
                        '6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, '
                        'Redmond, WA 98052. Crap is the profanity here. Is '
                        'this information PII? phone 3144444444\\ n"',
 'classification': {'category1': {'score': 0.00025233393535017967},
                    'category2': {'score': 0.18468093872070312},
                    'category3': {'score': 0.9879999756813049},
                    'review_recommended': True},
 'language': 'eng',
 'normalized_text': '" Is this a garbage email abide@ abed. com, phone: '
                    '6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, '
                    'Redmond, WA 98052. Crap is the profanity here. Is this '
                    'information PII? phone 3144444444\\ n"',
 'original_text': '"Is this a grabage email abcdef@abcd.com, phone: '
                  '6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, '
                  'WA 98052. Crap is the profanity here. Is this information '
                  'PII? phone 3144444444\\n"',
 'pii': {'address': [{'index': 82,
                      'text': '1 Microsoft Way, Redmond, WA 98052'}],
         'email': [{'detected': 'abcdef@abcd.com',
                    'index': 25,
                    'sub_type': 'Regular',
                    'text': 'abcdef@abcd.com'}],
         'ipa': [{'index': 65, 'sub_type': 'IPV4', 'text': '255.255.255.255'}],
         'phone': [{'country_code': 'US', 'index': 49, 'text': '6657789887'},
                   {'country_code': 'US', 'index': 177, 'text': '3144444444'}]},
 'status': {'code': 3000, 'description': 'OK'},
 'terms': [{'index': 118, 'list_id': 0, 'original_index': 118, 'term': 'crap'}],
 'tracking_id': 'b253515c-e713-4316-a016-8397662a3f1a'}
```

## Next steps

In this quickstart, you've developed a simple Python script that uses the Content Moderator service to return relevant information about a given text sample. Next, learn more about what the different flags and classifications mean so you can decide which data you need and how your app should handle it.

> [!div class="nextstepaction"]
> [Text moderation guide](text-moderation-api.md)
