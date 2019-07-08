---
title: "Quickstart: Analyze text content in Python - Content Moderator"
titlesuffix: Azure Cognitive Services
description: How to analyze text content for various objectionable material using the Content Moderator SDK for Python
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley

#As a Python developer of content management software, I want to analyze text content for offensive or inappropriate material so that I can categorize and handle it accordingly.
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

Create a new Python script named _ContentModeratorQS.py_ and add the following code to import the necessary parts of the SDK.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=1-10)]

Also import the "pretty print" function to handle the final output.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=12)]


## Initialize variables

Next, add variables for your Content Moderator subscription key and endpoint URL. You will need to replace `<your subscription key>` with the value of your key. You may also need to change the value of `endpoint_url` to use the region identifier that corresponds to your subscription key. Free trial subscription keys are generated in the **westus** region.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=14-16)]


For the sake of simplicity, you will analyze text directly from the script. Define a new string of text content to moderate:

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=18-21)]


## Query the Moderator service

Create a **ContentModeratorClient** instance using your subscription key and endpoint URL. Then, use its member **TextModerationOperations** instance to call the moderation API. See the **[screen_text](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.textmoderationoperations?view=azure-python)** reference documentation for more information on how to call it.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=23-36)]

## Print the response

Finally, check that the call completed successfully and returned a **Screen** instance. Then print the returned data to the console.

[!code-python[](~/cognitive-services-content-moderator-samples/documentation-samples/python/text-moderation-quickstart-python.py?range=38-39)]


The sample text used in this quickstart results in the following output:

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
