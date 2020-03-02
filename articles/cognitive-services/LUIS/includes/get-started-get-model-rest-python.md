---
title: Get model with REST call in C#
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 02/14/2020
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

1. Create a new file named `model.py`. Add the following code:

    [!code-python[Add example utterances to Language Understanding in python](~/samples-luis/documentation-samples/quickstarts/change-model/python/3.x/add-utterances-3-6.py)]

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
