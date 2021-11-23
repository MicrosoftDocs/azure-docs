---
title: "Quickstart: Form Recognizer Studio | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer Studio (preview)
author: sanjeev3
manager: netahw
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 09/14/2021
ms.author: sajagtap
ms.custom: ignite-fall-2021
---

# Get started: Form Recognizer Studio | Preview

>[!NOTE]
> Form Recognizer Studio is currently in public preview. Some features may not be supported or have limited capabilities. 

[Form Recognizer Studio preview](https://formrecognizer.appliedai.azure.com/) is an online tool for visually exploring, understanding, and integrating features from the Form Recognizer service in your applications. Get started with exploring the pre-trained models with sample documents or your own. Create projects to build custom form models and reference the models in your applications using the [Python SDK preview](try-v3-python-sdk.md) and other quickstarts.

## Migrating from the sample labeling tool

If you are a previous user of the [sample labeling tool](try-sample-label-tool.md), skip the prerequisites to [**sign into the Studio preview**](try-v3-form-recognizer-studio.md#sign-into-the-form-recognizer-studio-preview) to use your existing Azure account and Form Recognizer or Cognitive Services resources with the Studio. 

To migrate your existing custom projects to the Studio, jump ahead to the [**Custom model getting started**](try-v3-form-recognizer-studio.md#custom-model-basics) section to create a new project and point it to the same Azure Blob storage location assuming you have access to it in Azure. Once you configure a new project, the Studio will load all documents and interim files for labeling and training.

## Minimum prerequisites for new users

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).
* A [**Form Recognizer**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**Cognitive Services multi-service**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource.

## Additional prerequisites for custom projects

In addition to the Azure account and a Form Recognizer or Cognitive Services resource, you'll need:

### Azure Blob Storage container

A **standard performance** [**Azure Blob Storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You'll create containers to store and organize your blob data within your storage account. If you don't know how to create an Azure storage account with a container, following these quickstarts:

  * [**Create a storage account**](../../../storage/common/storage-account-create.md). When creating your storage account, make sure to select **Standard** performance in the **Instance details → Performance** field.
  * [**Create a container**](../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). When creating your container, set the **Public access level** field to **Container** (anonymous read access for containers and blobs) in the **New Container** window.

### Configure CORS

[CORS (Cross Origin Resource Sharing)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) needs to be configured on your Azure storage account for it to be accessible from the Form Recognizer Studio. To configure CORS in the Azure portal, you will need access to the CORS blade of your storage account.

:::image type="content" source="../media/quickstarts/cors-updated-image.png" alt-text="Screenshot that shows CORS configuration for a storage account.":::

1. Select the CORS blade for the storage account.
2. Start by creating a new CORS entry in the Blob service.
3. Set the **Allowed origins** to **https://formrecognizer.appliedai.azure.com**.
4. Select all the available 8 options for **Allowed methods**.
5. Approve all **Allowed headers** and **Exposed headers** by entering an * in each field.
6. Set the **Max Age** to 120 seconds or any acceptable value.
7. Click the save button at the top of the page to save the changes.

CORS should now be configured to use the storage account from Form Recognizer Studio.

### Sample documents set

1. Go to the [Azure portal](https://ms.portal.azure.com/#home) and navigate as follows:  **Your storage account** → **Data storage** → **Containers**

   :::image border="true" type="content" source="../media/sas-tokens/data-storage-menu.png" alt-text="Screenshot: Data storage menu in the Azure portal.":::

1. Select a **container** from the list.

1. Select **Upload** from the menu at the top of the page.

    :::image border="true" type="content" source="../media/sas-tokens/container-upload-button.png" alt-text="Screenshot: container upload button in the Azure portal.":::

1. The **Upload blob** window will appear.

1. Select your file(s) to upload.

    :::image border="true" type="content" source="../media/sas-tokens/upload-blob-window.png" alt-text="Screenshot: upload blob window in the Azure portal.":::

> [!NOTE]
> By default, the Studio will use form documents that are located at the root of your container. However, you can use data organized in folders if specified in the Custom form project creation steps. *See* [**Organize your data in subfolders**](../build-training-data-set.md#organize-your-data-in-subfolders-optional)

## Sign into the Form Recognizer Studio preview

After you have completed the prerequisites, navigate to the [Form Recognizer Studio preview](https://formrecognizer.appliedai.azure.com).

1. Select a Form Recognizer service feature from the Studio home page.

1. Select your Azure subscription, resource group, and resource. (You can change the resources anytime in "Settings" in the top menu.)

1. Review and confirm your selections.

:::image border="true" type="content" source="../media/quickstarts/form-recognizer-studio-get-started-v2.gif" alt-text="Form Recognizer Studio Getting Started example":::

## Layout

In the Layout view:

1. Select the Analyze command to run Layout analysis on the sample document or try your document by using the Add command.

1. Observe the highlighted extracted text, the table icons showing the extracted table locations, and highlighted selection marks.

1. Use the controls at the bottom of the screen to zoom in and out and rotate the document view.

1. Show and hide the text, tables, and selection marks layers to focus on each one of them at a time.

1. In the output section's Result tab, browse the JSON output to understand the service response format. Copy and download to jumpstart integration.

:::image border="true" type="content" source="../media/quickstarts/layout-get-started-v2.gif" alt-text="Form Recognizer Layout example":::

## Prebuilt models

There are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are prebuilt models currently supported by the Form Recognizer service:

* [🆕 **General document**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document)—Analyze and extract text, tables, structure, key-value pairs and named entities.
* [**Invoice**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice): extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* [**Receipt**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt): extracts text and key information from receipts.
* [**ID document**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument): extracts text and key information from driver licenses and international passports.
* [**Business card**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard): extracts text and key information from business cards.

In the Prebuilt view:

1. From the Studio home, select one of the prebuilt models. In this example, we are using the Invoice model.

1. Select the Analyze command to run analysis on the sample document or try your invoice by using the Add command.

1. In the visualization section, observe the highlighted fields and values and invoice line items. All extracted text and tables are also shown.

1. In the output section's Fields tab, note the listed fields and values, and select the line items to view in a table-like format.

1. In the output section's Result tab, browse the JSON output to understand the service response format. Copy and download to jumpstart integration.

:::image border="true" type="content" source="../media/quickstarts/prebuilt-get-started-v2.gif" alt-text="Form Recognizer Prebuilt example":::

## Custom model basics

### Getting started

To create custom models, you start with configuring your project:

1. From the Studio home, select the [Custom form project](https://formrecognizer.appliedai.azure.com/studio/customform/projects) to open the Custom form home page.

1. Use the "Create a project" command to start the new project configuration wizard.

1. Enter project details, select the Azure subscription and resource, and the Azure Blob storage container that contains your data.

1. Review and submit your settings to create the project.

:::image border="true" type="content" source="../media/quickstarts/1-custom-model-get-started-v2.gif" alt-text="Form Recognizer Custom project Getting Started example":::

### Basic flow

After the project creation step, in the custom model phase:

1. From the labeling view, define the labels and their types that you are interested in extracting.

1. Select the text in the document and select the label from the drop-down list or the labels pane.

1. Label four more documents to get at least five documents labeled.

1. Select the Train command and enter model name and description to start training your custom model.

1. Once the model is ready, use the Test command to validate it with your test documents and observe the results.

:::image border="true" type="content" source="../media/quickstarts/2-custom-model-basic-steps-v2.gif" alt-text="Form Recognizer Custom project basic workflow example":::

### Other features

In addition, view all your models using the Models tab on the left. From the list view, select model(s) to perform the following actions:

1. Test the model from the list view.

1. Use the Delete command to delete models that are not required.

1. Download model details for offline viewing.

1. Select multiple models and compose them into a new model to be used in your applications.

## Labeling as tables

While creating your custom models, you may need to extract data collections from your documents. These may appear in a couple of formats. Using tables as the visual pattern:

* Dynamic or variable count of values (rows) for a given set of fields (columns)

* Specific collection of values for a given set of fields (columns and/or rows)

### Label as dynamic table

Use dynamic tables to extract variable count of values (rows) for a given set of fields (columns):

1. Add a new "Table" type label, select "Dynamic table" type, and name your label.

1. Add the number of columns (fields) and rows (for data) that you need.

1. Select the text in your page and then choose the cell to assign to the text. Repeat for all rows and columns in all pages in all documents.

:::image border="true" type="content" source="../media/quickstarts/custom-tables-dynamic.gif" alt-text="Form Recognizer labeling as dynamic table example":::

### Label as fixed table

Use fixed tables to extract specific collection of values for a given set of fields (columns and/or rows):

1. Create a new "Table" type label, select "Fixed table" type, and name it.

1. Add the number of columns and rows that you need corresponding to the two sets of fields.

1. Select the text in your page and then choose the cell to assign it to the text. Repeat for other documents.

:::image border="true" type="content" source="../media/quickstarts/custom-tables-fixed.gif" alt-text="Form Recognizer Labeling as fixed table example":::

## Labeling for signature detection

To label for signature detection:

1. In the labeling view, create a new "Signature" type label and name it.

1. Use the Region command to create a rectangular region at the expected location of the signature.

1. Select the drawn region and choose the Signature type label to assign it to your drawn region. Repeat for other documents.

:::image border="true" type="content" source="../media/quickstarts/custom-signature.gif" alt-text="Form Recognizer labeling for signature detection example":::

## Next steps

* Follow our [**Form Recognizer v3.0 migration guide**](../v3-migration-guide.md) to learn the differences from the previous version of the REST API.
* Explore our [**preview SDK quickstarts**](try-v3-python-sdk.md) to try the preview features in your applications using the new SDKs.
* Refer to our [**preview REST API quickstarts**](try-v3-rest-api.md) to try the preview features using the new RESt API.

[Get started with the Form Recognizer Studio preview](https://formrecognizer.appliedai.azure.com).
