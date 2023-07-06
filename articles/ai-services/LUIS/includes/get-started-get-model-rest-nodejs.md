---
title: Get model with REST call in Node.js
titleSuffix: Azure AI services
services: cognitive-services

manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: include
ms.date: 06/03/2020

ms.custom: devx-track-js
---

[Reference documentation](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c45) | [Sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/LUIS/node-model-with-rest/model.js)

## Prerequisites

* [Node.js](https://nodejs.org/) programming language
* [Visual Studio Code](https://code.visualstudio.com/)

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]

## Create the Node.js project

1. Create a new folder to hold your Node.js project, such as `node-model-with-rest`.

1. Open a new Command Prompt, navigate to the folder you created and execute the following command:

    ```console
    npm init
    ```

    Press Enter at each prompt to accept the default settings.

1. Install the request-promise module by entering the following command:

    ```console
    npm install --save request
    npm install --save request-promise
    npm install --save querystring
    ```

## Change model programmatically

1. Create a new file named `model.js`. Add the following code:

    [!code-javascript[Code snippet](~/cognitive-services-quickstart-code/javascript/LUIS/node-model-with-rest/model.js)]

1. Replace the values starting with `YOUR-` with your own values.

    |Information|Purpose|
    |--|--|
    |`YOUR-APP-ID`| Your LUIS app ID. |
    |`YOUR-AUTHORING-KEY`|Your 32 character authoring key.|
    |`YOUR-AUTHORING-ENDPOINT`| Your authoring URL endpoint. For example, `https://replace-with-your-resource-name.api.cognitive.microsoft.com/`. You set your resource name when you created the resource.|

    Assigned keys and resources are visible in the LUIS portal in the Manage section, on the **Azure resources** page. The app ID is available in the same Manage section, on the **Application Settings** page.

    [!INCLUDE [Remember to remove credentials when you're done](app-secrets.md)]

1. At the command prompt, enter the following command to run the project:

    ```console
    node model.js
    ```

1. Review the authoring response:

    ```json
    addUtterance:
    [
      {
        "value": {
          "ExampleId": 1137150691,
          "UtteranceText": "order a pizza"
        },
        "hasError": false
      },
      {
        "value": {
          "ExampleId": 1137150692,
          "UtteranceText": "order a large pepperoni pizza"
        },
        "hasError": false
      },
      {
        "value": {
          "ExampleId": 1137150693,
          "UtteranceText": "i want two large pepperoni pizzas on thin crust"
        },
        "hasError": false
      }
    ]
    train POST:
    {
      "statusId": 9,
      "status": "Queued"
    }
    train GET:
    [
      {
        "modelId": "edb46abf-0000-41ab-beb2-a41a0fe1630f",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      },
      {
        "modelId": "a5030be2-616c-4648-bf2f-380fa9417d37",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      },
      {
        "modelId": "3f2b1f31-a3c3-4fbd-8182-e9d9dbc120b9",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      },
      {
        "modelId": "e4b6704b-1636-474c-9459-fe9ccbeba51c",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      },
      {
        "modelId": "031d3777-2a00-4a7a-9323-9a3280a30000",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      },
      {
        "modelId": "9250e7a1-06eb-4413-9432-ae132ed32583",
        "details": {
          "statusId": 9,
          "status": "Queued",
          "exampleCount": 0
        }
      }
    ]
    done
    ```

## Clean up resources

When you are finished with this quickstart, delete the project folder from the file system.

## Next steps

[Best practices for an app](../faq.md)
