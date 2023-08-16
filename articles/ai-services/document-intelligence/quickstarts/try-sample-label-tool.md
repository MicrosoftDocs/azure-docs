---
title: "Quickstart: Label forms, train a model, and analyze forms using the Sample Labeling tool - Document Intelligence (formerly Form Recognizer)"
titleSuffix: Azure AI services
description: In this quickstart, you'll learn to use the Document Intelligence Sample Labeling tool to manually label form documents. Then you'll train a custom document processing model with the labeled documents and use the model to extract key/value pairs.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: 'doc-intel-2.1.0'
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD029 -->
# Get started with the Document Intelligence Sample Labeling tool

**This article applies to:** ![Document Intelligence v2.1 checkmark](../media/yes-icon.png) **Document Intelligence v2.1**.

>[!TIP]
>
> * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
> * The v3.0 Studio supports any model trained with v2.1 labeled data.
> * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.
> * *See* our [**REST API**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [Python](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with the v3.0 version.

The Azure AI Document Intelligence Sample Labeling tool is an open source tool that enables you to test the latest features of Document Intelligence and Optical Character Recognition (OCR) services:

* [Analyze documents with the Layout API](#analyze-layout). Try the Layout API to extract text, tables, selection marks, and structure from documents.

* [Analyze documents using a prebuilt model](#analyze-using-a-prebuilt-model). Start with a prebuilt model to extract data from invoices, receipts, identity documents, or business cards.

* [Train and analyze a custom Form](#train-a-custom-form-model). Use a custom model to extract data from documents specific to distinct business data and use cases.

## Prerequisites

You'll need the following to get started:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer), or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

## Create a Document Intelligence resource

[!INCLUDE [create resource](../includes/create-resource.md)]

 :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Analyze using a Prebuilt model

Document Intelligence offers several prebuilt models to choose from. Each model has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the prebuilt models currently supported by the Document Intelligence service:

* [**Invoice**](../concept-invoice.md): extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* [**Receipt**](../concept-receipt.md): extracts text and key information from receipts.
* [**ID document**](../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**Business-card**](../concept-business-card.md): extracts text and key information from business cards.

1. Navigate to the [Document Intelligence Sample Tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select the **Use prebuilt model to get data** tile.

    :::image type="content" source="../media/label-tool/prebuilt-1.jpg" alt-text="Screenshot of the layout model analyze results operation.":::

1. Select the **Form Type**  to analyze from the dropdown menu.

1. Choose a URL for the file you would like to analyze from the below options:

    * [**Sample invoice document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice_sample.jpg).
    * [**Sample ID document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/DriverLicense.png).
    * [**Sample receipt image**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-allinone.jpg).
    * [**Sample business card image**](https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/business_cards/business-card-english.jpg).

1. In the **Source** field, select **URL** from the dropdown menu, paste the selected URL, and select the **Fetch** button.

    :::image type="content" source="../media/label-tool/fott-select-url.png" alt-text="Screenshot of source location dropdown menu.":::

1. In the **Document Intelligence service endpoint** field, paste the endpoint that you obtained with your Document Intelligence subscription.

1. In the **key** field, paste  the key you obtained from your Document Intelligence resource.

    :::image type="content" source="../media/fott-select-form-type.png" alt-text="Screenshot of the 'select-form-type' dropdown menu.":::

1. Select **Run analysis**. The Document Intelligence Sample Labeling tool will call the Analyze Prebuilt API and analyze the document.

1. View the results - see the key-value pairs extracted, line items, highlighted text extracted and tables detected.

    :::image type="content" source="../media/label-tool/prebuilt-2.jpg" alt-text="Analyze Results of Document Intelligence invoice model":::

1. Download the JSON output file to view the detailed results.

    * The "readResults" node contains every line of text with its respective bounding box placement on the page.
    * The "selectionMarks" node shows every selection mark (checkbox, radio mark) and whether its status is "selected" or "unselected".
    * The "pageResults" section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.
    * The "documentResults" field contains key/value pairs information and line items information for the most relevant parts of the document.

## Analyze Layout

Azure the Document Intelligence Layout API extracts text, tables, selection marks, and structure information from documents (PDF, TIFF) and images (JPG, PNG, BMP).

1. Navigate to the [Document Intelligence Sample Tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select **Use Layout to get text, tables and selection marks**.

     :::image type="content" source="../media/label-tool/layout-1.jpg" alt-text="Connection settings for Layout Document Intelligence tool.":::

1. In the **Document Intelligence service endpoint** field, paste the endpoint that you obtained with your Document Intelligence subscription.

1. In the **key** field, paste  the key you obtained from your Document Intelligence resource.

1. In the **Source** field, select **URL** from the dropdown menu, paste the following URL `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/layout-page-001.jpg`, and select the **Fetch** button.

1. Select **Run Layout**. The Document Intelligence Sample Labeling tool will call the Analyze Layout API and analyze the document.

    :::image type="content" source="../media/fott-layout.png" alt-text="Screenshot of Layout dropdown menu.":::

1. View the results - see the highlighted text extracted, selection marks detected and tables detected.

    :::image type="content" source="../media/label-tool/layout-3.jpg" alt-text="Connection settings for Document Intelligence tool.":::

1. Download the JSON output file to view the detailed Layout Results.
     * The `readResults` node contains every line of text with its respective bounding box placement on the page.
     * The `selectionMarks` node shows every selection mark (checkbox, radio mark) and whether its status is `selected` or `unselected`.
     * The `pageResults` section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.

## Train a custom form model

Train a custom model to analyze and extract data from forms and documents specific to your business. The API is a machine-learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You'll need at least five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

### Prerequisites for training a custom form model

* An Azure Storage blob container that contains a set of training data. Make sure all the training documents are of the same format. If you have forms in multiple formats, organize them into subfolders based on common format. For this project, you can use our [sample data set](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/sample_data_without_labels.zip). 

* If you don't know how to create an Azure storage account with a container, follow the [Azure Storage quickstart for Azure portal](../../../storage/blobs/storage-quickstart-blobs-portal.md).

* Configure CORS

    [CORS (Cross Origin Resource Sharing)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) needs to be configured on your Azure storage account for it to be accessible from the Document Intelligence Studio. To configure CORS in the Azure portal, you'll need access to the CORS tab of your storage account.

    1. Select the CORS tab for the storage account.

       :::image type="content" source="../media/quickstarts/cors-setting-menu.png" alt-text="Screenshot of the CORS setting menu in the Azure portal.":::

    1. Start by creating a new CORS entry in the Blob service.

    1. Set the **Allowed origins** to `https://fott-2-1.azurewebsites.net`.

       :::image type="content" source="../media/quickstarts/storage-cors-example.png" alt-text="Screenshot that shows CORS configuration for a storage account.":::

       > [!TIP]
       > You can use the wildcard character '*' rather than a specified domain to allow all origin domains to make requests via CORS.

    1. Select all the available 8 options for **Allowed methods**.

    1. Approve all **Allowed headers** and **Exposed headers** by entering an * in each field.

    1. Set the **Max Age** to 120 seconds or any acceptable value.

    1. Select the save button at the top of the page to save the changes.

### Use the Sample Labeling tool

1. Navigate to the [Document Intelligence Sample Tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select **Use custom form to train a model with labels and get key-value pairs**.

    :::image type="content" source="../media/label-tool/custom-1.jpg" alt-text="Train a custom model.":::

1. Select **New project**

    :::image type="content" source="../media/fott-new-project.png" alt-text="Screenshot of select a new project prompt.":::

#### Create a new project

Configure the **Project Settings** fields with the following values:

1. **Display Name**. Name your project.

1. **Security Token**. Each project will auto-generate a security token that can be used to encrypt/decrypt sensitive project settings. You can find security tokens in the Application Settings by selecting the gear icon at the bottom of the left navigation bar.

1. **Source connection**. The Sample Labeling tool connects to a source (your original uploaded forms) and a target (created labels and output data). Connections can be set up and shared across projects. They use an extensible provider model, so you can easily add new source/target providers.

    * Create a new connection, select the **Add Connection** button. Complete the fields with the following values:

    > [!div class="checklist"]
    >
    > * **Display Name**. Name the connection.
    > * **Description**. Add a brief description.
    > * **SAS URL**. Paste the shared access signature (SAS) URL for your Azure Blob Storage container.

    * To retrieve the SAS URL for your custom model training data, go to your storage resource in the Azure portal and select the **Storage Explorer** tab. Navigate to your container, right-click, and select **Get shared access signature**. It's important to get the SAS for your container, not for the storage account itself. Make sure the **Read**, **Write**, **Delete** and **List** permissions are checked, and select **Create**. Then copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

       :::image type="content" source="../media/quickstarts/get-sas-url.png" alt-text="SAS location.":::

1. **Folder Path** (optional).  If your source forms are located within a folder in the blob container, specify the folder name.

1. **Document Intelligence Service Uri** - Your Document Intelligence endpoint URL.

1. **Key**. Your Document Intelligence key.

1. **API  version**. Keep the v2.1 (default) value.

1. **Description** (optional). Describe your project.

    :::image type="content" source="../media/label-tool/connections.png"  alt-text="Connection settings":::

#### Label your forms

  :::image type="content" source="../media/label-tool/new-project.png"  alt-text="New project page":::

When you create or open a project, the main tag editor window opens. The tag editor consists of three parts:

* A resizable preview pane that contains a scrollable list of forms from the source connection.
* The main editor pane that allows you to apply tags.
* The tags editor pane that allows users to modify, lock, reorder, and delete tags.

##### Identify text and tables

Select **Run Layout on unvisited documents** on the left pane to get the text and table layout information for each document. The labeling tool will draw bounding boxes around each text element.

The labeling tool will also show which tables have been automatically extracted. Select the table/grid icon on the left hand of the document to see the extracted table. Because the table content is automatically extracted, we won't label the table content, but rather rely on the automated extraction.

  :::image type="content" source="../media/label-tool/table-extraction.png" alt-text="Table visualization in Sample Labeling tool.":::

##### Apply labels to text

Next, you'll create tags (labels) and apply them to the text elements that you want the model to analyze. Note the Sample Label data set includes already labeled fields; we'll add another field.

Use the tags editor pane to create a new tag you'd like to identify:

1. Select **+**  plus sign to create a new tag.

1. Enter the tag "Total" name.

1. Select **Enter** to save the tag.

1. In the main editor, select the total value from the highlighted text elements.

1. Select the Total tag to apply to the value, or press the corresponding keyboard key. The number keys are assigned as hotkeys for the first 10 tags. You can reorder your tags using the up and down arrow icons in the tag editor pane. Follow these steps to label all five forms in the sample dataset:

    > [!Tip]
    > Keep the following tips in mind when you're labeling your forms:
    >
    > * You can only apply one tag to each selected text element.
    >
    > * Each tag can only be applied once per page. If a value appears multiple times on the same form, create different tags for each instance. For example: "invoice# 1", "invoice# 2" and so on.
    > * Tags cannot span across pages.
    > * Label values as they appear on the form; don't try to split a value into two parts with two different tags. For example, an address field should be labeled with a single tag even if it spans multiple lines.
    > * Don't include keys in your tagged fields&mdash;only the values.
    > * Table data should be detected automatically and will be available in the final output JSON file in the 'pageResults' section. However, if the model fails to detect all of your table data, you can also label and train a model to detect tables, see [Train a custom model | Label your forms](../label-tool.md#label-your-forms)
    > * Use the buttons to the right of the **+** to search, rename, reorder, and delete your tags.
    > * To remove an applied tag without deleting the tag itself, select the tagged rectangle on the document view and press the delete key.
    >

  :::image type="content" source="../media/label-tool/custom-1.jpg" alt-text="Label the samples.":::

#### Train a custom model

Choose the Train icon on the left pane to open the Training page. Then select the **Train** button to begin training the model. Once the training process completes, you'll see the following information:

* **Model ID** - The ID of the model that was created and trained. Each training call creates a new model with its own ID. Copy this string to a secure location; you'll need it if you want to do prediction calls through the [REST API](./get-started-sdks-rest-api.md?pivots=programming-language-rest-api) or [client library](./get-started-sdks-rest-api.md).

* **Average Accuracy** - The model's average accuracy. You can improve model accuracy by labeling more forms and retraining to create a new model. We recommend starting by labeling five forms analyzing and testing the results and then if needed adding more forms as needed.
* The list of tags, and the estimated accuracy per tag. For more information, _see_ [Interpret and improve accuracy and confidence](../concept-accuracy-confidence.md).

    :::image type="content" source="../media/label-tool/custom-3.jpg" alt-text="Training view tool.":::

#### Analyze a custom form

1. Select the **Analyze** icon from the navigation bar to test your model.

1. Select source **Local file** and  browse for a file to select from the sample dataset that you unzipped in the test folder.

1. Choose the **Run analysis** button to get key/value pairs, text and tables predictions for the form. The tool will apply tags in bounding boxes and will report the confidence of each tag.

   :::image type="content" source="../media/analyze.png" alt-text="Training view.":::

That's it! You've learned how to use the Document Intelligence sample tool for Document Intelligence prebuilt, layout and custom models. You've also learned to analyze a custom form with manually labeled data.

## Next steps

>[!div class="nextstepaction"]
> [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio)
