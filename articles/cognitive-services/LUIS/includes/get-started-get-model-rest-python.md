---
title: Get model with REST call in C#
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

* Azure Language Understanding - Authoring resource 32 character key and authoring endpoint URL. Create with the [Azure portal](../luis-how-to-azure-subscription.md#create-resources-in-the-azure-portal) or [Azure CLI](../luis-how-to-azure-subscription.md#create-resources-in-azure-cli).
* Import the [TravelAgent](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/quickstarts/change-model/TravelAgent.json) app from the cognitive-services-language-understanding GitHub repository.
* The LUIS application ID for the imported TravelAgent app. The application ID is shown in the application dashboard.
* The version ID within the application that receives the utterances. The default ID is "0.1".
* [Python 3.6](https://www.python.org/downloads/) or later.
* [Visual Studio Code](https://code.visualstudio.com/)

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]


## Change model programmatically

Use Go to add a machine-learned entity [API](https://aka.ms/luis-apim-v3-authoring) to the application.

1. Create a new file named `model.py`. Add the following code:

    ```python
    ########### Python 3.6 #############
    import requests

    # 32 character Authoring key
    LUIS_authoringKey  = "YOUR-KEY"

    LUIS_APP_ID = "YOUR-APP-ID"

    # Authoring endpoint, example: your-resource-name.api.cognitive.microsoft.com
    LUIS_ENDPOINT = "YOUR-ENDPOINT"

    # The version number of your LUIS app
    LUIS_APP_VERSION = "0.1"

    URI_AddUtterances = f'https://{LUIS_ENDPOINT}/luis/authoring/v3.0-preview/apps/{LUIS_APP_ID}/versions/{LUIS_APP_VERSION}/examples'
    URI_Train = f'https://{LUIS_ENDPOINT}/luis/authoring/v3.0-preview/apps/{LUIS_APP_ID}/versions/{LUIS_APP_VERSION}/train'

    HEADERS = {'Ocp-Apim-Subscription-Key': LUIS_authoringKey}

    def addUtterances():
        r = requests.post(URI_AddUtterances,headers=HEADERS)
        print(r.json())

    def train():
        r = requests.post(URI_Train,headers=HEADERS)
        print(r.json())

    def trainStatus():
        r = requests.get(URI_Train,headers=HEADERS)
        print(r.json())

    addUtterances()
    train()
    trainStatus()
    ```

1. Replace the values starting with `YOUR-` with your own values.

    |Information|Purpose|
    |--|--|
    |`YOUR-KEY`|Your 32 character authoring key.|
    |`YOUR-ENDPOINT`| Your authoring URL endpoint. For example, `replace-with-your-resource-name.api.cognitive.microsoft.com`. You set your resource name when you created the resource.|
    |`YOUR-APP-ID`| Your LUIS app ID. |

    Assigned keys and resources are visible in the LUIS portal in the Manage section, on the **Azure resources** page. The app ID is available in the same Manage section, on the **Application Settings** page.

1. With a command prompt in the same directory as where you created the file, enter the following command to run the file:

    ```console
    python model.py
    ```

## Clean up resources

When you are finished with this quickstart, delete the file from the file system.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for an app](../luis-concept-best-practices.md)
