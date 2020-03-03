---
title: Get intent with REST call in Python
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/31/2020
ms.author: diberry
---

## Prerequisites

* [Python 3.6](https://www.python.org/downloads/) or later.
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: `df67dcdb-c37d-46af-88e1-8b97951ca1c2`

## Create LUIS runtime key for predictions

1. Sign into the [Azure portal](https://portal.azure.com)
1. Click [Create **Language Understanding**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne)
1. Enter all required settings for **Runtime** key:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select any nearby and available location|
    |Pricing Tier|`F0` - the minimal pricing tier|
    |Resource Group|Select an available resource group|

1. Click **Create** and wait for the resource to be created. After it is created, navigate to the resource page.
1. Collect configured `endpoint` and a `key`.

## Get intent from the prediction endpoint

Use Python to query the [prediction endpoint](https://aka.ms/luis-apim-v3-prediction) and get a prediction result.

1. Copy this code snippet into a file called `predict.py`:

    ```python
    ########### Python 3.6 #############
    import requests

    try:

        key = 'YOUR-KEY' # your Runtime key
        endpoint = 'YOUR-ENDPOINT' # such as 'your-resource-name.api.cognitive.microsoft.com'
        appId = 'df67dcdb-c37d-46af-88e1-8b97951ca1c2'
        utterance = 'turn on all lights'

        headers = {
        }

        params ={
            'query': utterance,
            'timezoneOffset': '0',
            'verbose': 'true',
            'show-all-intents': 'true',
            'spellCheck': 'false',
            'staging': 'false',
            'subscription-key': key
        }

        r = requests.get(f'https://{endpoint}/luis/prediction/v3.0/apps/{appId}/slots/production/predict',headers=headers, params=params)
        print(r.json())

    except Exception as e:
        print(f'{e}')
    ```

1. Replace the `YOUR-KEY` and `YOUR-ENDPOINT` values with your own prediction **Runtime** key and endpoint.

    |Information|Purpose|
    |--|--|
    |`YOUR-KEY`|Your 32 character prediction **Runtime** key.|
    |`YOUR-ENDPOINT`| Your prediction URL endpoint. For example, `replace-with-your-resource-name.api.cognitive.microsoft.com`.|

1. Install the `requests` dependency. This is used to make HTTP requests:

    ```console
    pip install requests
    ```

1. Run your script with this console command:

    ```console
    python predict.py
    ```

1. Review the prediction response, which is returned as JSON:

    ```console
    {'query': 'turn on all lights', 'prediction': {'topIntent': 'HomeAutomation.TurnOn', 'intents': {'HomeAutomation.TurnOn': {'score': 0.5375382}, 'None': {'score': 0.08687421}, 'HomeAutomation.TurnOff': {'score': 0.0207554}}, 'entities': {'HomeAutomation.Operation': ['on'], '$instance': {'HomeAutomation.Operation': [{'type': 'HomeAutomation.Operation', 'text': 'on', 'startIndex': 5, 'length': 2, 'score': 0.724984169, 'modelTypeId': -1, 'modelType': 'Unknown', 'recognitionSources': ['model']}]}}}}
    ```

    Here's the JSON response formatted for readability:

    ```JSON
    {
        "query": "turn on all lights",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOn",
            "intents": {
                "HomeAutomation.TurnOn": {
                    "score": 0.5375382
                },
                "None": {
                    "score": 0.08687421
                },
                "HomeAutomation.TurnOff": {
                    "score": 0.0207554
                }
            },
            "entities": {
                "HomeAutomation.Operation": [
                    "on"
                ],
                "$instance": {
                    "HomeAutomation.Operation": [
                        {
                            "type": "HomeAutomation.Operation",
                            "text": "on",
                            "startIndex": 5,
                            "length": 2,
                            "score": 0.724984169,
                            "modelTypeId": -1,
                            "modelType": "Unknown",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ]
                }
            }
        }
    }
    ```

## Clean up resources

When you are finished with this quickstart, delete the file from the file system.

## Next steps

> [!div class="nextstepaction"]
> [Add utterances and train](../get-started-get-model-rest-apis.md)