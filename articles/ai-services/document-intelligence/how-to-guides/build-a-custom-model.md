---
title: "Build and train a custom model - Document Intelligence (formerly Form Recognizer)"
titleSuffix: Azure AI services
description: Learn how to build, label, and train a custom model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---


# Build and train a custom model

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](../includes/applies-to-v3-1-v3-0.md)]
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"
Document Intelligence models require as few as five training documents to get started. If you have at least five documents, you can get started training a custom model. You can train either a [custom template model (custom form)](../concept-custom-template.md) or a [custom neural model (custom document)](../concept-custom-neural.md). The training process is identical for both models and this document walks you through the process of training either model.

## Custom model input requirements

First, make sure your training data set follows the input requirements for Document Intelligence.

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [input requirements](../includes/input-requirements.md)]
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Training data tips

Follow these tips to further optimize your data set for training:

* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
* For forms with input fields, use examples that have all of the fields completed.
* Use forms with different values in each field.
* If your form images are of lower quality, use a larger data set (10-15 images, for example).

## Upload your training data

Once you've put together the set of forms or documents for training, you need to upload it to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, following the [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

## Video: Train your custom model

* Once you've gathered and uploaded your training dataset, you're ready to train your custom model. In the following video, we create a project and explore some of the fundamentals for successfully labeling and training a model.</br></br>

  > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fX1c]

## Create a project in the Document Intelligence Studio

The Document Intelligence Studio provides and orchestrates all the API calls required to complete your dataset and train your model.

1. Start by navigating to the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio). The first time you use the Studio, you need to [initialize your subscription, resource group, and resource](../quickstarts/try-document-intelligence-studio.md). Then, follow the [prerequisites for custom projects](../quickstarts/try-document-intelligence-studio.md#added-prerequisites-for-custom-projects) to configure the Studio to access your training dataset.

1. In the Studio, select the **Custom models** tile, on the custom models page and select the **Create a project** button.

    :::image type="content" source="../media/how-to/studio-create-project.png" alt-text="Screenshot of Create a project in the Document Intelligence Studio.":::

    1. On the create project dialog, provide a name for your project, optionally a description, and select continue.

    1. On the next step in the workflow, choose or create a Document Intelligence resource before you select continue.

    > [!IMPORTANT]
    > Custom neural models models are only available in a few regions. If you plan on training a neural model, please select or create a resource in one of [these supported regions](../concept-custom-neural.md#supported-regions).

    :::image type="content" source="../media/how-to/studio-select-resource.png" alt-text="Screenshot of Select the Document Intelligence resource.":::

1. Next select the storage account you used to upload your custom model training dataset. The **Folder path** should be empty if your training documents are in the root of the container. If your documents are in a subfolder, enter the relative path from the container root in the **Folder path** field. Once your storage account is configured, select continue.

    :::image type="content" source="../media/how-to/studio-select-storage.png" alt-text="Screenshot of Select the storage account.":::

1. Finally, review your project settings and select **Create Project** to create a new project. You should now be in the labeling window and see the files in your dataset listed.

## Label your data

In your project, your first task is to label your dataset with the fields you wish to extract.

The files you uploaded to storage are listed on the left of your screen, with the first file ready to be labeled.

1. To start labeling your dataset, create your first field by selecting the plus (➕) button on the top-right of the screen to select a field type.

    :::image type="content" source="../media/how-to/studio-create-label.png" alt-text="Screenshot of Create a label.":::

1. Enter a name for the field.

1. To assign a value to the field, choose a word or words in the document and select the field in either the dropdown or the field list on the right navigation bar. The labeled value is below the field name in the list of fields.

1. Repeat the process for all the fields you wish to label for your dataset.

1. Label the remaining documents in your dataset by selecting each document and selecting the text to be labeled.

You now have all the documents in your dataset labeled. The *.labels.json* and *.ocr.json* files correspond to each document in your training dataset and a new fields.json file. This training dataset is submitted to train the model.

## Train your model

With your dataset labeled, you're now ready to train your model. Select the train button in the upper-right corner.

1. On the train model dialog, provide a unique model ID and, optionally, a description. The model ID accepts a string data type.

1. For the build mode, select the type of model you want to train. Learn more about the [model types and capabilities](../concept-custom.md).

    :::image type="content" source="../media/how-to/studio-train-model.png" alt-text="Screenshot of Train model dialog":::

1. Select **Train** to initiate the training process.

1. Template models train in a few minutes. Neural models can take up to 30 minutes to train.

1. Navigate to the *Models* menu to view the status of the train operation.

## Test the model

Once the model training is complete, you can test your model by selecting the model on the models list page.

1. Select the model and select on the **Test** button.

1. Select the `+ Add` button to select a file to test the model.

1. With a file selected, choose the **Analyze** button to test the model.

1. The model results are displayed in the main window and the fields extracted are listed in the right navigation bar.

1. Validate your model by evaluating the results for each field.

1. The right navigation bar also has the sample code to invoke your model and the JSON results from the API.

Congratulations you've trained a custom model in the Document Intelligence Studio! Your model is ready for use with the REST API or the SDK to analyze documents.

## Next steps

> [!div class="nextstepaction"]
> [Learn about custom model types](../concept-custom.md)

> [!div class="nextstepaction"]
> [Learn about accuracy and confidence with custom models](../concept-accuracy-confidence.md)

::: moniker-end

::: moniker range="doc-intel-2.1.0"

**Applies to:** ![Document Intelligence v2.1 checkmark](../media/yes-icon.png) **Document Intelligence v2.1**. **Other versions:** [Document Intelligence v3.0](../how-to-guides/build-a-custom-model.md?view=doc-intel-3.0.0&preserve-view=true?view=doc-intel-3.0.0&preserve-view=true)

When you use the Document Intelligence custom model, you provide your own training data to the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync) operation, so that the model can train to your industry-specific forms. Follow this guide to learn how to collect and prepare data to train the model effectively.

You need at least five filled-in forms of the same type.

If you want to use manually labeled training data, you must start with at least five filled-in forms of the same type. You can still use unlabeled forms in addition to the required data set.

## Custom model input requirements

First, make sure your training data set follows the input requirements for Document Intelligence.

::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [input requirements](../includes/input-requirements.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"

## Training data tips

Follow these tips to further optimize your data set for training.

* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
* For filled-in forms, use examples that have all of their fields filled in.
* Use forms with different values in each field.
* If your form images are of lower quality, use a larger data set (10-15 images, for example).

## Upload your training data

When you've put together the set of documents for training, you need to upload it to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, follow the [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md). Use the standard performance tier.

If you want to use manually labeled data, upload the *.labels.json* and *.ocr.json* files that correspond to your training documents. You can use the [Sample Labeling tool](../label-tool.md) (or your own UI) to generate these files.

### Organize your data in subfolders (optional)

By default, the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync) API only uses documents that are located at the root of your storage container. However, you can train with data in subfolders if you specify it in the API call. Normally, the body of the [Train Custom Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync) call has the following format, where `<SAS URL>` is the Shared access signature URL of your container:

```json
{
  "source":"<SAS URL>"
}
```

If you add the following content to the request body, the API trains with documents located in subfolders. The `"prefix"` field is optional and limits the training data set to files whose paths begin with the given string. So a value of `"Test"`, for example, causes the API to look at only the files or folders that begin with the word *Test*.

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

Now that you've learned how to build a training data set, follow a quickstart to train a custom Document Intelligence model and start using it on your forms.

* [Train a model and extract document data using the client library or REST API](../quickstarts/get-started-sdks-rest-api.md)
* [Train with labels using the Sample Labeling tool](../label-tool.md)

## See also

* [What is Document Intelligence?](../overview.md)

::: moniker-end
