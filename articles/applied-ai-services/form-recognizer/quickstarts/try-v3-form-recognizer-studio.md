---
title: "Quickstart: Form Recognizer Studio | v3.0"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer Studio 
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 10/10/2022
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
---

# Get started: Form Recognizer Studio | v3.0

[!INCLUDE [applies to v3.0](../includes/applies-to-v3-0.md)]

[Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/) is an online tool for visually exploring, understanding, and integrating features from the Form Recognizer service in your applications. You can get started by exploring the pre-trained models with sample or your own documents. You can also create projects to build custom template models and reference the models in your applications using the [Python SDK](get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) and other quickstarts.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE56n49]

## Prerequisites for new users

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Form Recognizer**](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**Cognitive Services multi-service**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

## Prebuilt models

Prebuilt models help you add Form Recognizer features to your apps without having to build, train, and publish your own models. You can choose from several prebuilt models, each of which has its own set of supported data fields. The choice of model to use for the analyze operation depends on the type of document to be analyzed. The following prebuilt models are currently supported by Form Recognizer:

* [**General document**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document): extract text, tables, structure, key-value pairs and named entities.
* [**W-2**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2): extract text and key information from W-2 tax forms.
* [**Read**](https://formrecognizer.appliedai.azure.com/studio/read): extract text lines, words, their locations, detected languages, and handwritten style if detected from documents (PDF, TIFF) and images (JPG, PNG, BMP).
* [**Layout**](https://formrecognizer.appliedai.azure.com/studio/layout): extract text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP).
* [**Invoice**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice): extract text, selection marks, tables, key-value pairs, and key information from invoices.
* [**Receipt**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt): extract text and key information from receipts.
* [**ID document**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument): extract text and key information from driver licenses and international passports.
* [**Business card**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard): extract text and key information from business cards.

After you've completed the prerequisites, navigate to [Form Recognizer Studio General Documents](https://formrecognizer.appliedai.azure.com/studio/document). 

In the following example, we use the General Documents feature. The steps to use other pre-trained features like [W2 tax form](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2), [Read](https://formrecognizer.appliedai.azure.com/studio/read), [Layout](https://formrecognizer.appliedai.azure.com/studio/layout), [Invoice](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice), [Receipt](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt), [Business card](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard), and [ID documents](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument) models are similar.

   :::image border="true" type="content" source="../media/quickstarts/form-recognizer-general-document-demo-preview3.gif" alt-text="Selecting the General Document API to analysis a document in the Form Recognizer Studio.":::

1. Select a Form Recognizer service feature from the Studio home page.

1. This step is a one-time process unless you've already selected the service resource from prior use. Select your Azure subscription, resource group, and resource. (You can change the resources anytime in "Settings" in the top menu.) Review and confirm your selections.

1. Select the Analyze button to run analysis on the sample document or try your document by using the Add command.

1. Use the controls at the bottom of the screen to zoom in and out and rotate the document view.

1. Observe the highlighted extracted content in the document view. Hover your mouse over the keys and values to see details.

1. In the output section's Result tab, browse the JSON output to understand the service response format.

1. In the Code tab, browse the sample code for integration. Copy and download to get started.

## Additional prerequisites for custom projects

In addition to the Azure account and a Form Recognizer or Cognitive Services resource, you'll need:

### Azure Blob Storage container

A **standard performance** [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your training documents within your storage account. If you don't know how to create an Azure storage account with a container, following these quickstarts:

* [**Create a storage account**](../../../storage/common/storage-account-create.md). When creating your storage account, make sure to select **Standard** performance in the **Instance details → Performance** field.
* [**Create a container**](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). When creating your container, set the **Public access level** field to **Container** (anonymous read access for containers and blobs) in the **New Container** window.

### Configure CORS

[CORS (Cross Origin Resource Sharing)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) needs to be configured on your Azure storage account for it to be accessible from the Form Recognizer Studio. To configure CORS in the Azure portal, you'll need access to the CORS tab of your storage account.

1. Select the CORS tab for the storage account.

   :::image type="content" source="../media/quickstarts/cors-setting-menu.png" alt-text="Screenshot of the CORS setting menu in the Azure portal.":::

1. Start by creating a new CORS entry in the Blob service.

1. Set the **Allowed origins** to `https://formrecognizer.appliedai.azure.com`.

   :::image type="content" source="../media/quickstarts/cors-updated-image.png" alt-text="Screenshot that shows CORS configuration for a storage account.":::

    > [!TIP]
    > You can use the wildcard character '*' rather than a specified domain to allow all origin domains to make requests via CORS.

1. Select all the available 8 options for **Allowed methods**.

1. Approve all **Allowed headers** and **Exposed headers** by entering an * in each field.

1. Set the **Max Age** to 120 seconds or any acceptable value.

1. Select the save button at the top of the page to save the changes.

CORS should now be configured to use the storage account from Form Recognizer Studio.

### Sample documents set

1. Go to the [Azure portal](https://portal.azure.com/#home) and navigate as follows:  **Your storage account** → **Data storage** → **Containers**

   :::image border="true" type="content" source="../media/sas-tokens/data-storage-menu.png" alt-text="Screenshot: Data storage menu in the Azure portal.":::

1. Select a **container** from the list.

1. Select **Upload** from the menu at the top of the page.

    :::image border="true" type="content" source="../media/sas-tokens/container-upload-button.png" alt-text="Screenshot: container upload button in the Azure portal.":::

1. The **Upload blob** window will appear.

1. Select your file(s) to upload.

    :::image border="true" type="content" source="../media/sas-tokens/upload-blob-window.png" alt-text="Screenshot: upload blob window in the Azure portal.":::

> [!NOTE]
> By default, the Studio will use form documents that are located at the root of your container. However, you can use data organized in folders by specifying the folder path in the Custom form project creation steps. *See* [**Organize your data in subfolders**](../build-training-data-set.md#organize-your-data-in-subfolders-optional)

## Custom models

To create custom models, you start with configuring your project:

1. From the Studio home, select the Custom model card to open the Custom models page.

1. Use the "Create a project" command to start the new project configuration wizard.

1. Enter project details, select the Azure subscription and resource, and the Azure Blob storage container that contains your data.

1. Review and submit your settings to create the project.

1. From the labeling view, define the labels and their types that you're interested in extracting.

1. Select the text in the document and select the label from the drop-down list or the labels pane.

1. Label four more documents to get at least five documents labeled.

1. Select the Train command and enter model name, select whether you want the custom template (form) or custom neural (document) model to start training your custom model.

1. Once the model is ready, use the Test command to validate it with your test documents and observe the results.

:::image border="true" type="content" source="../media/quickstarts/form-recognizer-custom-model-demo-v3p2.gif" alt-text="Form Recognizer Custom model demo":::

### Labeling as tables

> [!NOTE]
> * With the release of API versions 2022-06-30-preview and later, custom template models will add support for [cross page tabular fields (tables)](../concept-custom-template.md#tabular-fields).
> * With the release of API versions 2022-06-30-preview and later, custom neural models will support [tabular fields (tables)](../concept-custom-template.md#tabular-fields) and models trained with API version 2022-08-31, or later will accept tabular field labels.

1. Use the Delete command to delete models that aren't required.

1. Download model details for offline viewing.

1. Select multiple models and compose them into a new model to be used in your applications.

Using tables as the visual pattern:

For custom form models, while creating your custom models, you may need to extract data collections from your documents. Data collections may appear in a couple of formats. Using tables as the visual pattern:

* Dynamic or variable count of values (rows) for a given set of fields (columns)

* Specific collection of values for a given set of fields (columns and/or rows)

**Label as dynamic table**

Use dynamic tables to extract variable count of values (rows) for a given set of fields (columns):

1. Add a new "Table" type label, select "Dynamic table" type, and name your label.

1. Add the number of columns (fields) and rows (for data) that you need.

1. Select the text in your page and then choose the cell to assign to the text. Repeat for all rows and columns in all pages in all documents.

:::image border="true" type="content" source="../media/quickstarts/custom-tables-dynamic.gif" alt-text="Form Recognizer labeling as dynamic table example":::

**Label as fixed table**

Use fixed tables to extract specific collection of values for a given set of fields (columns and/or rows):

1. Create a new "Table" type label, select "Fixed table" type, and name it.

1. Add the number of columns and rows that you need corresponding to the two sets of fields.

1. Select the text in your page and then choose the cell to assign it to the text. Repeat for other documents.

:::image border="true" type="content" source="../media/quickstarts/custom-tables-fixed.gif" alt-text="Form Recognizer Labeling as fixed table example":::

### Signature detection

>[!NOTE]
> Signature fields are currently only supported for custom template models. When training a custom neural model, labeled signature fields are ignored.

To label for signature detection: (Custom form only)

1. In the labeling view, create a new "Signature" type label and name it.

1. Use the Region command to create a rectangular region at the expected location of the signature.

1. Select the drawn region and choose the Signature type label to assign it to your drawn region. Repeat for other documents.

:::image border="true" type="content" source="../media/quickstarts/custom-signature.gif" alt-text="Form Recognizer labeling for signature detection example":::

## Next steps

* Follow our [**Form Recognizer v3.0 migration guide**](../v3-migration-guide.md) to learn the differences from the previous version of the REST API.
* Explore our [**v3.0 SDK quickstarts**](get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) to try the v3.0 features in your applications using the new SDKs.
* Refer to our [**v3.0 REST API quickstarts**](get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) to try the v3.0 features using the new REST API.

[Get started with the Form Recognizer Studio](https://formrecognizer.appliedai.azure.com).
