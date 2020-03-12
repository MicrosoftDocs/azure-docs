---
title: Get intent with REST call in Node.js
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

* [Node.js](https://nodejs.org/) programming language
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

## Get intent programmatically

Use Node.js to query the [prediction endpoint](https://aka.ms/luis-apim-v3-prediction) and get a prediction result.

1. Copy the following code snippet to a file named `predict.js`:

    ```javascript
    var request = require('request');
    var requestpromise = require('request-promise');
    var querystring = require('querystring');

    // Analyze text
    //
    getPrediction = async () => {

        // YOUR-KEY - Language Understanding runtime key
        var endpointKey = "YOUR-KEY";

        // YOUR-ENDPOINT Language Understanding endpoint URL, an example is your-resource-name.api.cognitive.microsoft.com
        var endpoint = "YOUR-ENDPOINT";

        // Set the LUIS_APP_ID environment variable
        // to df67dcdb-c37d-46af-88e1-8b97951ca1c2, which is the ID
        // of a public sample application.
        var appId = "df67dcdb-c37d-46af-88e1-8b97951ca1c2";

        var utterance = "turn on all lights";

        // Create query string
        var queryParams = {
            "show-all-intents": true,
            "verbose":  true,
            "query": utterance,
            "subscription-key": endpointKey
        }

        // append query string to endpoint URL
        var URI = `https://${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/production/predict?${querystring.stringify(queryParams)}`

        // HTTP Request
        const response = await requestpromise(URI);

        // HTTP Response
        console.log(response);

    }

    // Pass an utterance to the sample LUIS app
    getPrediction().then(()=>console.log("done")).catch((err)=>console.log(err));
    ```

1. Replace the `YOUR-KEY` and `YOUR-ENDPOINT` values with your own prediction **Runtime** key and endpoint.

    |Information|Purpose|
    |--|--|
    |`YOUR-KEY`|Your 32 character prediction **Runtime** key.|
    |`YOUR-ENDPOINT`| Your prediction URL endpoint. For example, `replace-with-your-resource-name.api.cognitive.microsoft.com`.|

1. Install the `request`, `request-promise`, and `querystring` dependencies with this command:

    ```console
    npm install request request-promise querystring
    ```

1. Run your app with this command:

    ```console
    node predict.js
    ```

 1. Review the prediction response, which is returned as JSON:

    ```console
    {"query":"turn on all lights","prediction":{"topIntent":"HomeAutomation.TurnOn","intents":{"HomeAutomation.TurnOn":{"score":0.5375382},"None":{"score":0.08687421},"HomeAutomation.TurnOff":{"score":0.0207554}},"entities":{"HomeAutomation.Operation":["on"],"$instance":{"HomeAutomation.Operation":[{"type":"HomeAutomation.Operation","text":"on","startIndex":5,"length":2,"score":0.724984169,"modelTypeId":-1,"modelType":"Unknown","recognitionSources":["model"]}]}}}}
    ```

    The JSON response formatted for readability:

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