---
title: "How to build a training data set for a custom model - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to ensure your training data set is optimized for training a Form Recognizer model.
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: lajanuar
#Customer intent: As a user of the Form Recognizer custom model service, I want to ensure I'm training my model in the best way.
---

# Build a training data set for a custom model

When you use the Form Recognizer custom model, you provide your own training data to the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/TrainCustomModelAsync) operation, so that the model can train to your industry-specific forms. Follow this guide to learn how to collect and prepare data to train the model effectively.

You need at least five filled-in forms of the same type.

If you want to use manually labeled training data, you must start with at least five filled-in forms of the same type. You can still use unlabeled forms in addition to the required data set.

## Custom model input requirements

First, make sure your training data set follows the input requirements for Form Recognizer.

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Training data tips

Follow these additional tips to further optimize your data set for training.

* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
* For filled-in forms, use examples that have all of their fields filled in.
* Use forms with different values in each field.
* If your form images are of lower quality, use a larger data set (10-15 images, for example).

## Upload your training data

When you've put together the set of form documents that you'll use for training, you need to upload it to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, following the [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). Use the standard performance tier.

If you want to use manually labeled data, you'll also have to upload the *.labels.json* and *.ocr.json* files that correspond to your training documents. You can use the [Sample labeling tool](./quickstarts/label-tool.md) (or your own UI) to generate these files.

### Organize your data in subfolders (optional)

By default, the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/TrainCustomModelAsync) API will only use form documents that are located at the root of your storage container. However, you can train with data in subfolders if you specify it in the API call. Normally, the body of the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/TrainCustomModelAsync) call has the following format, where `<SAS URL>` is the Shared access signature URL of your container:

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
  },
  "useLabelFile": false
}
```

## Next steps

Now that you've learned how to build a training data set, follow a quickstart to train a custom Form Recognizer model and start using it on your forms.

* [Train a model and extract form data using the client library or REST API](./quickstarts/client-library.md)
* [Train with labels using the sample labeling tool](./quickstarts/label-tool.md)

## See also

* [What is Form Recognizer?](./overview.md)