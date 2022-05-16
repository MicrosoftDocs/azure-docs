---
title: "Upload training and testing datasets for Custom Speech - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn about how to upload data to test or train a Custom Speech model.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
---

# Upload training and testing datasets for Custom Speech 

You need audio or text data for testing the accuracy of Microsoft speech recognition or training your custom models. For information about the data types supported for testing or training your model, see [Training and testing datasets](how-to-custom-speech-test-and-train.md).

## Upload datasets in Speech Studio

To upload your own datasets in Speech Studio, follow these steps:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Speech datasets** > **Upload data**.
1. Select the **Training data** or **Testing data** tab.
1. Select a dataset type, and then select **Next**.
1. Specify the dataset location, and then select **Next**. You can choose a local file or enter a remote location such as Azure Blob public access URL.
1. Enter the dataset name and description, and then select **Next**.
1. Review your settings, and then select **Save and close**.

After your dataset is uploaded, go to the **Train custom models** page to [train a custom model](how-to-custom-speech-train-model.md)

### Upload datasets via REST API

You can use [Speech-to-text REST API v3.0](rest-speech-to-text.md) to upload a dataset by using the [CreateDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) request.

To connect the dataset to an existing project, fill out the request body according to the following format:

```json
{
  "kind": "Acoustic",
  "contentUrl": "https://contoso.com/mydatasetlocation",
  "locale": "en-US",
  "displayName": "My speech dataset name",
  "description": "My speech dataset description",
  "project": {
    "self": "https://westeurope.api.cognitive.microsoft.com/speechtotext/v3.0/projects/c1c643ae-7da5-4e38-9853-e56e840efcb2"
  }
}
```

You can get a list of existing project URLs that can be used in the `project` element by using the [GetProjects](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProjects) request.

> [!NOTE] 
> Connecting a dataset to a Custom Speech project isn't required to train and test a custom model using the REST API or Speech CLI. But if the dataset is not connected to any project, you won't be able to train or test a model in the [Speech Studio](https://aka.ms/speechstudio/customspeech). 

## Next steps

* [Test recognition quality](how-to-custom-speech-inspect-data.md)
* [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
* [Train a custom model](how-to-custom-speech-train-model.md)
