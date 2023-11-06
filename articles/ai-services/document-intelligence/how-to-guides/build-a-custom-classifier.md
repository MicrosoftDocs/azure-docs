---
title: "Build and train a custom classifier -  Document Intelligence (formerly Form Recognizer)"
titleSuffix: Azure AI services
description: Learn how to label, and build a custom document classification model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 11/15/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---


# Build and train a custom classification model

[!INCLUDE [applies to v4.0 v3.1 v3.0](../includes/applies-to-v40-v31-v30.md)]

> [!IMPORTANT]
>
> Custom classification model is currently in public preview. Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.
>

Custom classification models can classify each page in an input file to identify the document(s) within. Classifier models can also identify multiple documents or multiple instances of a single document in the input file. Document Intelligence custom models require as few as five training documents per document class to get started. To get started training a custom classification model, you need at least **five documents** for each class and **two classes** of documents.

## Custom classification model input requirements

Make sure your training data set follows the input requirements for Document Intelligence.

[!INCLUDE [input requirements](../includes/input-requirements.md)]

## Training data tips

Follow these tips to further optimize your data set for training:

* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.

* If your form images are of lower quality, use a larger data set (10-15 images, for example).

## Upload your training data

Once you put together the set of forms or documents for training, you need to upload it to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, follow the [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md). You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production. If your dataset is organized as folders, preserve that structure as the Studio can use your folder names for labels to simplify the labeling process.

## Create a classification project in the Document Intelligence Studio

The Document Intelligence Studio provides and orchestrates all the API calls required to complete your dataset and train your model.

1. Start by navigating to the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio). The first time you use the Studio, you need to [initialize your subscription, resource group, and resource](../quickstarts/try-document-intelligence-studio.md). Then, follow the [prerequisites for custom projects](../quickstarts/try-document-intelligence-studio.md#added-prerequisites-for-custom-projects) to configure the Studio to access your training dataset.

1. In the Studio, select the **Custom classification model** tile, on the custom models section of the page and select the **Create a project** button.

    :::image type="content" source="../media/how-to/studio-create-classifier-project.png" alt-text="Screenshot of how to create a classifier project in the Document Intelligence Studio.":::

    1. On the create project dialog, provide a name for your project, optionally a description, and select continue.

    1. Next, choose or create a Document Intelligence resource before you select continue.

    :::image type="content" source="../media/how-to/studio-select-resource.png" alt-text="Screenshot showing the project setup dialog window.":::

1. Next select the storage account you used to upload your custom model training dataset. The **Folder path** should be empty if your training documents are in the root of the container. If your documents are in a subfolder, enter the relative path from the container root in the **Folder path** field. Once your storage account is configured, select continue.

   > [!IMPORTANT]
   > You can either organize the training dataset by folders where the folder name is the label or class for documents or create a flat list of documents that you can assign a label to in the Studio.

    :::image type="content" source="../media/how-to/studio-select-storage.png" alt-text="Screenshot showing how to select the Document Intelligence resource.":::

1. **Training a custom classifier requires the output from the Layout model for each document in your dataset**. Run layout on all documents prior to the model training process.

1. Finally, review your project settings and select **Create Project** to create a new project. You should now be in the labeling window and see the files in your dataset listed.

## Label your data

In your project, you only need to label each document with the appropriate class label.

:::image type="content" source="../media/how-to/studio-create-label.gif" alt-text="Screenshot showing elect the Document Intelligence resource.":::

You see the files you uploaded to storage in the file list, ready to be labeled. You have a few options to label your dataset.

1. If the documents are organized in folders, the Studio prompts you to use the folder names as labels. This step simplifies your labeling down to a single select.

1. To assign a label to a document, select on the add label selection mark to assign a label.

1. Control select to  multi-select documents to assign a label

You should now have all the documents in your dataset labeled. If you look at the storage account, you find  *.ocr.json* files that correspond to each document in your training dataset and a new **class-name.jsonl** file for each class labeled. This training dataset is submitted to train the model.

## Train your model

With your dataset labeled, you're now ready to train your model. Select the train button in the upper-right corner.

1. On the train model dialog, provide a unique classifier ID and, optionally, a description. The classifier ID accepts a string data type.

1. Select **Train** to initiate the training process.

1. Classifier models train in a few minutes.

1. Navigate to the *Models* menu to view the status of the train operation.

## Test the model

Once the model training is complete, you can test your model by selecting the model on the models list page.

1. Select the model and select on the **Test** button.

1. Add a new file by browsing for a file or dropping a file into the document selector.

1. With a file selected, choose the **Analyze** button to test the model.

1. The model results are displayed with the list of identified documents, a confidence score for each document identified and the page range for each of the documents identified.

1. Validate your model by evaluating the results for each document identified.

## Training a custom classifier using the SDK or API

The Studio orchestrates the API calls for you to train a custom classifier. The classifier training dataset requires the output from the layout API that matches the version of the API for your training model. Using layout results from an older API version can result in a model with lower accuracy.

The Studio generates the layout results for your training dataset if the dataset doesn't contain layout results. When using the API or SDK to train a classifier, you need to add the layout results to the folders containing the individual documents. The layout results should be in the format of the API response when calling layout directly. The SDK object model is different, make sure that the `layout results` are the API results and not the `SDK response`.

## Troubleshoot

The [classification model](../concept-custom-classifier.md) requires results from the [layout model](../concept-layout.md) for each training document. If you don't provide the layout results, the Studio attempts to run the layout model for each document prior to training the classifier. This process is throttled and can result in a 429 response. 

In the Studio, prior to training with the classification model, run the [layout model](https://formrecognizer.appliedai.azure.com/studio/layout) on each document and upload it to the same location as the original document. Once the layout results are added, you can train the classifier model with your documents. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about custom model types](../concept-custom.md)

> [!div class="nextstepaction"]
> [Learn about accuracy and confidence with custom models](../concept-accuracy-confidence.md)
