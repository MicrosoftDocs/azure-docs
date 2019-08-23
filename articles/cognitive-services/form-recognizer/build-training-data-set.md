---
title: "How to build a training data set for a custom model - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to ensure your training data set is optimized for training a Form Recognizer model.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: pafarley
#Customer intent: As a user of the Form Recognizer custom model service, I want to ensure I'm training my model in the best way.
---

# Build a training data set for a custom model

When you use the Form Recognizer custom model, you provide your own training data so the model can train to your industry-specific forms. You can train a model with five filled-in forms or an empty form (you must include the word "empty" in the file name) plus two filled-in forms. Even if you have enough filled-in forms to train with, adding an empty form to your training data set can improve the accuracy of the model.

## Training data tips

It's important to use a data set that's optimized for training. Use the following tips to ensure you get the best results from the [Train Model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/TrainCustomModel) operation:

* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
* Use one empty form and two filled-in forms if you have them available.
* For filled-in forms, use examples that have all of their fields filled in.
* Use forms with different values in each field.
* If your form images are of lower quality, use a larger data set (10-15 images, for example).

## General input requirements

Make sure your training data set also follows the input requirements for all Form Recognizer content. 

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Upload your training data

When you've put together the set of form documents that you'll use for training, you need to upload it to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, following the [Azure Storage quickstart for Azure portal](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal).

### Organize your data in subfolders (optional)

By default, the [Train Model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/TrainCustomModel) API will only use form documents that are located at the root of your storage container. However, you can train with data in subfolders if you specify it in the API call. Normally, the body of the [Train Model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/TrainCustomModel) call has the following form, where `<SAS URL>` is the Shared access signature URL of your container:

```json
{
  "source":"<SAS URL>"
}
```

If you add the following content to the request body, the API will train with documents located in subfolders. The `"prefix"` field is optional and will limit the training data set to files whose paths begin with the given string. So a value of `"Test"`, for example, will cause the API to look at only the files or folders that begin with the word "Test".

```json
{
  "source": "<SAS URL>",
  "sourceFilter": {
    "prefix": "<prefix string>",
    "includeSubFolders": true
  }
}
```

## Next steps

Now that you've learned how to build a training data set, follow a quickstart to train a custom Form Recognizer model and start using it on your forms.

* [Quickstart: Train a model and extract form data by using cURL](./quickstarts/curl-train-extract.md)
* [Quickstart: Train a model and extract form data using the REST API with Python](./quickstarts/python-train-extract.md)

