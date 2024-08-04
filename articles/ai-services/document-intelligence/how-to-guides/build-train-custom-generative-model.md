---
title: Use AI Studio to build and train an Azure AI Document Intelligence custom generative model
titleSuffix: Azure AI services
description: How to build and train a custom generative AI model with AI Studio to extract user-specified fields from documents across a wide variety of visual templates.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 08/07/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-4.0.0'
---

# Build and train a custom generative model with AI Studio

In this article, learn to build and train a custom generative model with Azure AI Studio. Document Intelligence custom models require as few as five training documents to get started. Do you have at least five documents? If so,  let's get started training and testing the custom generative model.

## Prerequisites

* You need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* Once you have your Azure subscription A [Document Intelligence](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) instance in the Azure portal. You can use the free pricing tier (`F0`) to try the service.

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * You need the key and endpoint from the resource to connect your application to the Document Intelligence service. You paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page.

### Storage container authorization

You can choose one of the following options to authorize access to your Document resource.

**✔️ Managed Identity**. A managed identity is a service principal that creates a Microsoft Entra identity and specific permissions for an Azure managed resource. Managed identities enable you to run your Document Intelligence application without having to embed credentials in your code. Managed identities are a safer way to grant access to storage data and replace the requirement for you to include shared access signature tokens (SAS) with your source and result URLs.

To learn more, *see* [Managed identities for Document Intelligence](../managed-identities.md).

  :::image type="content" source="../media/managed-identities/rbac-flow.png" alt-text="Screenshot of managed identity flow (role-based access control).":::

> [!IMPORTANT]
>
> * When using managed identities, don't include a SAS token URL with your HTTP requests—your requests will fail. Using managed identities replaces the requirement for you to include shared access signature tokens (SAS).
**✔️ Shared Access Signature (SAS)**. A shared access signature is a URL that grants restricted access for a specified period of time to your Document Intelligence service. To use this method, you need to create Shared Access Signature (SAS) tokens for your source and result containers. The source and result containers must include a Shared Access Signature (SAS) token, appended as a query string. The token can be assigned to your container or specific blobs.

:::image type="content" source="../media/sas-tokens/sas-url-token.png" alt-text="Screenshot of storage URI with SAS token appended.":::

* Your **source** container or blob must designate **read**, **write**, **list**, and **delete** access.
* Your **result** container or blob must designate **write**, **list**, **delete** access.

To learn more, *see* [**Create SAS tokens**](../create-sas-tokens.md).

### Training data

Follow these tips to optimize your data set for training:

* Use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.

* Use examples that have all of the fields completed for forms with input fields.

* Use forms with different values in each field.

* use a larger data set (10-15 images) if your form images are of lower quality.

Once you have your Azure blob storage containers, upload your training data to your source containers. Now you're ready to train your custom generative model.

## Azure AI Studio

1. Navigate to the [Azure AI Studio](https://ai.azure.com/?tid=72f988bf-86f1-41af-91ab-2d7cd011db47). The first time you use the Studio, you need to [initialize your subscription and create a hub](../../../ai-studio/how-to/create-azure-ai-resource.md) before creating a project. Custom generative models are only available in North Central US in preview. Ensure your resource group is set to North Central US during hub creation.

1. Select the Vision + Document tile.

    :::image type="content" source="../media/custom-generative-model/document-intelligence-vision-tile.png" alt-text="Screenshot of the document intelligence / vision tile.":::

1. Then, select the Document field extraction tile, and select the Create document field extraction project button to create a project.

    :::image type="content" source="../media/custom-generative-model/start-document-field-extraction.png" alt-text="Screenshot of the create document field extraction project page.":::

1. Create your project. For more information, *see* [Create a project in Azure AI Studio](../../../ai-studio/how-to/create-projects.md).

1. Create an Azure AI services connection to access Azure Document Intelligence service:

    :::image type="content" source="../media/custom-generative-model/create-document-extraction-project.png" alt-text="Screenshot of the create document extraction project overview page.":::

1. Next, select the storage account you used to upload your custom model training dataset. 

    :::image type="content" source="../media/custom-generative-model/create-document-extraction-data-settings.png" alt-text="Screenshot of the document extraction project data settings page.":::

1. Review your project settings and select **`Create a Project`** to create a new project. Once you select on the project, you should now be in the **`Define schema`** window and see the files in your dataset listed.

### Define the schema

* For your project, the first task is to add the fields to extract and define a schema.

* The files you uploaded are listed and you can use the drop-down option to select files. You can start adding fields by clicking on the **`➕ Add new field`** button.

* Enter a name, description, and type for the field to be extracted. Once all the fields are added, select the **`Save`** button at the bottom of the screen.

### Label data

* Once the schema is saved, all the uploaded training documents are analyzed and field values are automatically extracted. Field values are listed on the screen for review. The autoextracted fields are tagged as **Predicted**.

* Review the predicted values. If the field value is incorrect or isn't extracted, you can hover over the predicted field. Select the edit button to make the changes:

   :::image type="content" source="../media/custom-generative-model/extraction-project-edit-button.png" alt-text="Screenshot of the extraction project edit button.":::

* Once change are made, the predicted tag displays **`Corrected`**:

   :::image type="content" source="../media/custom-generative-model/extraction-project-corrected-indicator.png" alt-text="Screenshot of the extraction project corrected indicator.":::

* Continue reviewing the predicted fields. After the labels are reviewed and corrected for all the training documents, proceed to build your model.

  > [!NOTE]
  > You can always go back and update the schema during model training but, to use the auto label capability, you need to delete and reload the files using **`Upload files`** option.

### Build your model

With your dataset labeled, you're ready to train your model. Select the **`Build model`**. On the Build model dialog page, provide a unique model name and, optionally, a description. The modelID accepts a string data type.

   :::image type="content" source="../media/custom-generative-model/build-extraction-model.png" alt-text="Screenshot of the build an extraction model page.":::

Select **`Build`** to initiate the training process. Generative models train instantly! Refresh the page to select the model once status is changed to **succeeded**.

### Test your model

* Once the model training is complete, you can test your model by selecting **`Test`** button on the CustomGenerative page.

   :::image type="content" source="../media/custom-generative-model/custom-generative-page.png" alt-text="Screenshot of the custom generative page.":::

* Upload your test files and select **`Run Analysis`** to extract field values from the documents. With the **`Analyze`** option, you can choose to run and analysis on the current document or all documents.

* Validate your model accuracy by evaluating the results for each field.

That's it! You learned to train a custom generative model in the Azure AI Studio. Your model is ready for use with the REST API or the SDK to analyze documents.

## Next steps

[Learn more about the custom generative model](../concept-custom-generative.md)

[Learn more about custom model accuracy and confidence](../concept-accuracy-confidence.md)
