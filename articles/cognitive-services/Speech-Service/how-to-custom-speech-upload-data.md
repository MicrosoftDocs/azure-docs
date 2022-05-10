---
title: "Upload data for Custom Speech - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn about how to upload data to test or train a Custom Speech model.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 03/03/2022
ms.author: eur
---

# Upload data for Custom Speech

You need audio or text data for testing the accuracy of Microsoft speech recognition or training your custom models. For information about the data types supported for testing or training your model, see [Prepare data for Custom Speech](how-to-custom-speech-test-and-train.md).

## Upload data in Speech Studio

To upload your data:

1. Go to [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. After you create a project, go to the **Speech datasets** tab. Select **Upload data** to start the wizard and create your first dataset. 
1. Select a speech data type for your dataset, and upload your data.

1. Specify whether the dataset will be used for **Training** or **Testing**. 

   There are many types of data that can be uploaded and used for **Training** or **Testing**. Each dataset that you upload must be correctly formatted before uploading, and it must meet the requirements for the data type that you choose. Requirements are listed in the following sections.

1. After your dataset is uploaded, you can either:

   * Go to the **Train custom models** tab to train a custom model.
   * Go to the **Test models** tab to visually inspect quality with audio-only data or evaluate accuracy with audio + human-labeled transcription data.

### Upload data by using Speech-to-text REST API v3.0

You can use [Speech-to-text REST API v3.0](rest-speech-to-text.md) to automate any operations related to your custom models. In particular, you can use the REST API to upload a dataset.

To create and upload a dataset, use a [Create Dataset](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) request.

A dataset that you create by using the Speech-to-text REST API v3.0 won't be connected to any of the Speech Studio projects, unless you specify a special parameter in the request body (see the code block later in this section). Connection with a Speech Studio project isn't required for any model customization operations, if you perform them by using the REST API.

When you log on to Speech Studio, its user interface will notify you when any unconnected object is found (like datasets uploaded through the REST API without any project reference). The interface will also offer to connect such objects to an existing project. 

To connect the new dataset to an existing project in Speech Studio during its upload, use [Create Dataset](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset) and fill out the request body according to the following format:

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

You can obtain the project URL that's required for the `project` element by using the [Get Projects](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProjects) request.

## Next steps

* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train a custom model](how-to-custom-speech-train-model.md)
