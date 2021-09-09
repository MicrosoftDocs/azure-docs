---
title: "Quickstart: Label forms, train a model, and analyze forms using the sample labeling tool - Form Recognizer"
titleSuffix: Azure Applied AI Services
description: In this quickstart, you'll use the Form Recognizer sample labeling tool to manually label form documents. Then you'll train a custom document processing model with the labeled documents and use the model to extract key/value pairs.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 05/14/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-may-2021
keywords: document processing
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD029 -->
# Get started with Form Recognizer

Get started with the Form Recognizer using the Form Recognizer Sample Tool. Azure Form Recognizer is a cognitive service that lets you build automated data processing software using machine learning technology. Identify and extract text, key/value pairs, selection marks, table data and more from your form documents—the service outputs structured data that includes the relationships in the original file. You can use Form Recognizer via the sample tool or REST API or SDK. Follow these steps to try out Form Recognizer via the sample tool.

Use Form Recognizer to:

* Analyze Layout
* Analyze using a Prebuilt model (invoices, receipts, ID documents)
* Train & Analyze a custom Form

## Prerequisites

To complete this quickstart, you must have:

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer"  title="Create a Form Recognizer resource"  target="_blank">create a Form Recognizer resource </a> in the Azure portal to get your key and endpoint.
  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* (Optional) download and unzip the following quickstart sample documents

## Create a Form Recognizer resource

[!INCLUDE [create resource](../includes/create-resource.md)]

## Analyze Layout

Extract text, tables, selection marks and structure from a document.

1. Go to the [Form Recognizer Sample Tool](https://fott-2-1.azurewebsites.net/)
2. At the sample tool home page select "use layout to get text, tables and selection marks"

     :::image type="content" source="../media/label-tool/layout-1.jpg" alt-text="Connection settings for Layout Form Recognizer tool.":::

3. Replace {need Endpoint} with the endpoint that you obtained with your Form Recognizer subscription.

4. Replace {need apiKey} with the subscription key you obtained from your Form Recognizer resource.

    :::image type="content" source="../media/label-tool/layout-2.jpg" alt-text="Connection settings of Layout Form Recognizer tool.":::

5. Select source url, paste the following url of the sample document `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/layout-page-001.jpg` click the Fetch button.

1. Click "Run Layout"
The Form Recognizer sample labeling tool will call the Analyze Layout API and analyze the document.

1. View the results - see the highlighted text extracted, selection marks detected and tables detected.

    :::image type="content" source="../media/label-tool/layout-3.jpg" alt-text="Connection settings for Form Recognizer tool.":::

1. Download the JSON output file to view the detailed Layout Results.
     * The "readResults" node contains every line of text with its respective bounding box placement on the page.
     * The "selectionMarks" node shows every selection mark (checkbox, radio mark) and whether its status is "selected" or "unselected".
     * The "pageResults" section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.

## Analyze using a Prebuilt model (Invoices, Receipts, IDs ..)

Extract text, tables and key value pairs from invoices, sales receipts, identity documents, or business cards using a Form Recognizer Prebuilt model.

1. Go to the [Form Recognizer Sample Tool](https://fott-2-1.azurewebsites.net/)
2. At the sample tool home page select "use prebuilt model to get data"

    :::image type="content" source="../media/label-tool/prebuilt-1.jpg" alt-text="Analyze results of Form Recognizer Layout":::

3. Select source url

4. Choose the file you would like to analyze from the below options:

    * A URL for an image of an invoice. You can use a [sample invoice document](https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/forms/Invoice_1.pdf) for this quickstart.
    * A URL for an image of a receipt. You can use a [sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/id-license.jpg) for this quickstart.
    * A URL for an image of a receipt. You can use a [sample receipt image](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-allinone.jpg) for this quickstart.
    * A URL for an image of a business card. You can use a [sample business card image](https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/business_cards/business-card-english.jpg) for this quickstart.

5. Replace {need Endpoint} with the endpoint that you obtained with your Form Recognizer subscription.

6. Replace {need apiKey} with the subscription key you obtained from your Form Recognizer resource.

    :::image type="content" source="../media/label-tool/prebuilt-3.jpg" alt-text="Connection settings of Prebuilt Form Recognizer tool.":::

7. Select the Form Type you would like to analyze - invoice, receipt, business cards or ID based on the type of document you want to analyze and selected.

8. Click "Run analysis". The Form Recognizer sample labeling tool will call the Analyze Prebuilt API and analyze the document.
9. View the results - see the key value pairs extracted, line items, highlighted text extracted and tables detected.

    :::image type="content" source="../media/label-tool/prebuilt-2.jpg" alt-text="Analyze Results of Form Recognizer Prebuilt Invoice":::

10. Download the JSON output file to view the detailed results.

    * The "readResults" node contains every line of text with its respective bounding box placement on the page.
    * The "selectionMarks" node shows every selection mark (checkbox, radio mark) and whether its status is "selected" or "unselected".
    * The "pageResults" section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.
    * The "documentResults" field contains key/value pairs information and line items information for the most relevant parts of the document.

## Train a custom form model

Train a custom form model tailored to your documents. Extract text, tables, selection marks and key value pairs from your documents with Form Recognizer Custom.

### Prerequisites for training a custom form model

* An Azure Storage blob container that contains a set of training data. First, make sure all the training documents are of the same format. If you have forms in multiple formats, organize them into subfolders based on common format. For this quickstart, you can use the files under the Train folder of the [sample data set](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/sample_data_without_labels.zip) (download and extract sample_data.zip).
* Configure cross-domain resource sharing (CORS) on the Azure Storage blob
Enable CORS on your storage account. Select your storage account in the Azure portal and then choose the **CORS** tab on the left pane. On the bottom line, fill in the following values. Select **Save** at the top. </br></br>

  * Allowed origins = *
  * Allowed methods = \[select all\]
  * Allowed headers = *
  * Exposed headers = *
  * Max age = 200

> [!div class="mx-imgBorder"]
> ![CORS setup in the Azure portal](../media/label-tool/cors-setup.png)

### Use the sample labeling tool

1. Go to the [Form Recognizer Sample Tool](https://fott-2-1.azurewebsites.net/)

1. At the sample tool home page select "use custom form to train a model with labels and get key value pairs"

    :::image type="content" source="../media/label-tool/custom-1.jpg" alt-text="Train a custom model.":::

2. Select "New Project"

#### Create a new project

Configure the project settings fill in the fields with the following values:

* **Display Name** - the project display name
* **Security Token** - Some project settings can include sensitive values, such as API keys or other shared secrets. Each project will generate a security token that can be used to encrypt/decrypt sensitive project settings. You can find security tokens in the Application Settings by selecting the gear icon at the bottom of the left navigation bar.

* **Source connection** - The sample labeling tool connects to a source (your original uploaded forms) and a target (created labels and output data). Connections can be set up and shared across projects. They use an extensible provider model, so you can easily add new source/target providers. Create a new connection, click the **Add Connection** button. Fill in the fields with the following values:
  * **Display Name** - The connection display name.
  * **Description** - Your project description.
  * **SAS URL** - The shared access signature (SAS) URL of your Azure Blob Storage container.

  * [!INCLUDE [get SAS URL](../includes/sas-instructions.md)]

   :::image type="content" source="../media/quickstarts/get-sas-url.png" alt-text="SAS location.":::

* **Folder Path** -- Optional - If your source forms are located in a folder on the blob container, specify the folder name here
* **Form Recognizer Service Uri** - Your Form Recognizer endpoint URL.
* **API Key** - Your Form Recognizer subscription key.
* **Description** - Optional - Project description

    :::image type="content" source="../media/label-tool/connections.png"  alt-text="Connection settings":::

#### Label your forms

  :::image type="content" source="../media/label-tool/new-project.png"  alt-text="New project page":::

When you create or open a project, the main tag editor window opens. The tag editor consists of three parts:

* A resizable preview pane that contains a scrollable list of forms from the source connection.
* The main editor pane that allows you to apply tags.
* The tags editor pane that allows users to modify, lock, reorder, and delete tags.

##### Identify text and tables

Select **Run OCR on all files** on the left pane to get the text and table layout information for each document. The labeling tool will draw bounding boxes around each text element.

The labeling tool will also show which tables have been automatically extracted. Select the table/grid icon on the left hand of the document to see the extracted table. In this quickstart, because the table content is automatically extracted, we will not be labeling the table content, but rather rely on the automated extraction.

  :::image type="content" source="../media/label-tool/table-extraction.png" alt-text="Table visualization in sample labeling tool.":::

##### Apply labels to text

Next, you will create tags (labels) and apply them to the text elements that you want the model to analyze. Note the sample label data set includes labeled fields already we will add another field.

1. First, use the tags editor pane to create a new tag you'd like to identify.
   1. Select **+** to create a new tag.
   1. Enter the tag name. Add a 'Total' tag
   1. Press Enter to save the tag.
1. In the main editor, select the total value from the highlighted text elements.
1. Select the Total tag you want to apply to the value, or press the corresponding keyboard key. The number keys are assigned as hotkeys for the first 10 tags. You can reorder your tags using the up and down arrow icons in the tag editor pane.

    > [!Tip]
    > Keep the following tips in mind when you're labeling your forms:
    >
    > * You can only apply one tag to each selected text element.
    > * Each tag can only be applied once per page. If a value appears multiple times on the same form, create different tags for each instance. For example: "invoice# 1", "invoice# 2" and so on.
    > * Tags cannot span across pages.
    > * Label values as they appear on the form; don't try to split a value into two parts with two different tags. For example, an address field should be labeled with a single tag even if it spans multiple lines.
    > * Don't include keys in your tagged fields&mdash;only the values.
    > * Table data should be detected automatically and will be available in the final output JSON file in the 'pageResults' section. However, if the model fails to detect all of your table data, you can also label and train a model to detect tables, see How to train and label << route to the how to >>
    > * Use the buttons to the right of the **+** to search, rename, reorder, and delete your tags.
    > * To remove an applied tag without deleting the tag itself, select the tagged rectangle on the document view and press the delete key.
    >

Follow the steps above to label for the five forms in the sample dataset.

  :::image type="content" source="../media/label-tool/custom-1.jpg" alt-text="Label the samples.":::

#### Train a custom model

Choose the Train icon on the left pane to open the Training page. Then select the **Train** button to begin training the model. Once the training process completes, you'll see the following information:

* **Model ID** - The ID of the model that was created and trained. Each training call creates a new model with its own ID. Copy this string to a secure location; you'll need it if you want to do prediction calls through the [REST API](./client-library.md?pivots=programming-language-rest-api) or [client library](./client-library.md).
* **Average Accuracy** - The model's average accuracy. You can improve model accuracy by labeling additional forms and retraining to create a new model. We recommend starting by labeling five forms analyzing and testing the results and then if needed adding more forms as needed.
* The list of tags, and the estimated accuracy per tag.

    :::image type="content" source="../media/label-tool/custom-3.jpg" alt-text="Training view tool.":::

    

#### Analyze a custom form

Select the Analyze (light bulb) icon on the left to test your model. Select source 'Local file'. Browse for a file and select a file from the sample dataset that you unzipped in the test folder. Then choose the **Run analysis** button to get key/value pairs, text and tables predictions for the form. The tool will apply tags in bounding boxes and will report the confidence of each tag.

   :::image type="content" source="../media/analyze.png" alt-text="Training view.":::

## Next steps

In this quickstart, you've learned how to use the Form Recognizer sample tool to try out Layout, Pre-built and train a custom model and analyze a custom form with manually labeled data. Now you can try the client library SDK or REST API to use Form Recognizer.

> [!div class="nextstepaction"]
> [Explore Form Recognizer client library SDK and REST API quickstart](client-library.md)
