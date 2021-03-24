---
title: What's new in Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Understand the latest changes to the Form Recognizer API.
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/15/2021
ms.author: lajanuar

---
<!-- markdownlint-disable MD024 -->
# What's new in Form Recognizer?

The Form Recognizer service is updated on an ongoing basis. Use this article to stay up to date with feature enhancements, fixes, and documentation updates.

## March 2021

**Form Recognizer v2.1 public preview 3 is now available.** v2.1-preview.3 has been released, including the following features:

- **New prebuilt ID model** The new prebuilt ID model enables customers to take IDs and return structured data to automate processing. It combines our powerful Optical Character Recognition (OCR) capabilities with ID understanding models to extract key information from passports and U.S. driver licenses, such as name, date of birth, issue date, expiration date, and more.

  [Learn more about the prebuilt ID model](concept-identification-cards.md)

   :::image type="content" source="./media/id-canada-passport-example.png" alt-text="passport example" lightbox="./media/id-canada-passport-example.png":::

- **Line-item extraction for prebuilt invoice model** - Prebuilt Invoice model now supports line item extraction; it now extracts full items and their parts - description, amount, quantity, product ID, date and more. With a simple API/SDK call you can extract useful data from your invoices - text, table, key-value pairs, and line items.

   [Learn more about the prebuilt invoice model](concept-invoices.md)

- **Supervised table labeling and training, empty-value labeling** - In addition to Form Recognizer's [state-of-the-art deep learning automatic table extraction capabilities](https://techcommunity.microsoft.com/t5/azure-ai/enhanced-table-extraction-from-documents-with-form-recognizer/ba-p/2058011), it now enables customers to label and train on tables. This new release includes the ability to label and train on line items/tables (dynamic and fixed) and train a custom model to extract key-value pairs and line items. Once a model is trained, the model will extract line items as part of the JSON output in the documentResults section.

    :::image type="content" source="./media/table-labeling.png" alt-text="Table labeling" lightbox="./media/table-labeling.png":::

    In addition to labeling tables, you and now label empty values and regions; if some documents in your training set do not have values for certain fields, you can use this so that your model will know to extract values properly  from analyzed documents.

- **Support for 66 new languages** - Form Recognizer's Layout API and Custom Models now support 73 languages.

  [Learn more about Form Recognizer's language support](language-support.md)

- **Natural reading order, handwriting classification, and page selection** - With this update, you can choose to get the text line outputs in the natural reading order instead of the default left-to-right and to-to-bottom ordering. Use the new readingOrder query parameter and set it to "natural" value for a more human-friendly reading order output. In addition, for Latin languages, Form Recognizer will classify text lines as handwritten style or not and give a confidence score.

- **Prebuilt receipt model quality improvements** This update includes a number of quality improvements for the prebuilt Receipt model, especially around line item extraction.

## November 2020

### New features

**Form Recognizer v2.1 public preview 2 is now available.** v2.1-preview.2 has been released, including the following features: 

- **New prebuilt invoice model** - The new prebuilt Invoice model enables customers to take invoices in a variety of formats and return structured data to automate the invoice processing. It combines our powerful Optical Character Recognition (OCR) capabilities with invoice understanding deep learning models to extract key information from invoices in English. It extracts the text, tables, and information such as customer, vendor, invoice ID, invoice due date, total, amount due, tax amount, ship to, bill to, and more.

  > [Learn more about the prebuilt invoice model](concept-invoices.md)

  :::image type="content" source="./media/invoice-example.jpg" alt-text="invoice example" lightbox="./media/invoice-example.jpg":::

- **Enhanced table extraction** - Form Recognizer now provides enhanced table extraction, which combines our powerful Optical Character Recognition (OCR) capabilities with a deep learning table extraction model. Form Recognizer can extract data from tables, including complex tables with merged columns, rows, no borders and more. 
 
  :::image type="content" source="./media/tables-example.jpg" alt-text="tables example" lightbox="./media/tables-example.jpg":::

 
  > [Learn more about Layout extraction](concept-layout.md)

- **Client library update** - The latest versions of the [client libraries](quickstarts/client-library.md) for .NET, Python, Java, and JavaScript support the Form Recognizer 2.1 API.
- **New language supported: Japanese** - The following new languages are now supported: for `AnalyzeLayout` and `AnalyzeCustomForm`: Japanese (`ja`). [Language support](language-support.md)
- **Text line style indication (handwritten/other) (Latin languages only)** - Form Recognizer now outputs an `appearance` object classifying whether each text line is handwritten style or not, along with a confidence score. This feature is supported only for Latin languages.
- **Quality improvements** - Extraction improvements including single digit extraction improvements.
- **New try-it-out feature in the Form Recognizer Sample and Labeling Tool** - Ability to try out prebuilt Invoice, Receipt, and Business Card models and the Layout API using the Form Recognizer Sample Labeling tool. See how your data will be extracted without writing any code.

  > [Try out the Form Recognizer Sample Tool](https://fott-preview.azurewebsites.net/)

  ![FOTT example](./media/ui-preview.jpg)
  
- **Feedback Loop** - When Analyzing files via the sample labeling tool you can now also add it to the training set and adjust the labels if necessary and train to improve the model.
- **Auto Label Documents** - Automatically labels additional documents based on previous labeled documents in the project.

## August 2020

### New features

**Form Recognizer v2.1 public preview is now available.** V2.1-preview.1 has been released, including the following features: 


- **REST API reference is available** - View the [v2.1-preview.1 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-1/operations/AnalyzeBusinessCardAsync) 
- **New languages supported In addition to English**, the following [languages](language-support.md) are now supported: for `Layout` and `Train Custom Model`: English (`en`), Chinese (Simplified) (`zh-Hans`), Dutch (`nl`), French (`fr`), German (`de`), Italian (`it`), Portuguese (`pt`) and Spanish (`es`).
- **Checkbox / Selection Mark detection** – Form Recognizer supports detection and extraction of selection marks such as check boxes and radio buttons. Selection Marks are extracted in `Layout` and you can now also label and train in `Train Custom Model` - _Train with Labels_ to extract key value pairs for selection marks. 
- **Model Compose** - allows multiple models to be composed and called with a single model ID. When a document is submitted to be analyzed with a composed model ID, a classification step is first performed to route it to the correct custom model. Model Compose is available for `Train Custom Model` - _Train with labels_.
- **Model name** - add a friendly name to your custom models for easier management and tracking.
- **[New pre-built model for Business Cards](concept-business-cards.md)** for extracting common fields in English, language business cards.
- **[New locales for pre-built Receipts](concept-receipts.md)** in addition to EN-US, support is now available for EN-AU, EN-CA, EN-GB, EN-IN
- **Quality improvements** for `Layout`, `Train Custom Model` - _Train without Labels_ and _Train with Labels_.

**v2.0** includes the following update:

- The [client libraries](quickstarts/client-library.md) for NET, Python, Java, and JavaScript have entered General Availability. 

**New samples** are available on GitHub. 

- The [Knowledge Extraction Recipes - Forms Playbook](https://github.com/microsoft/knowledge-extraction-recipes-forms) collects best practices from real Form Recognizer customer engagements and provides usable code samples, checklists, and sample pipelines used in developing these projects. 
- The [sample labeling tool](https://github.com/microsoft/OCR-Form-Tools) has been updated to support the new v2.1 functionality. See this [quickstart](quickstarts/label-tool.md) for getting started with the tool. 
- The [Intelligent Kiosk](https://github.com/microsoft/Cognitive-Samples-IntelligentKiosk/blob/master/Documentation/FormRecognizer.md) Form Recognizer sample shows how to integrate `Analyze Receipt` and `Train Custom Model` - _Train without Labels_.

## July 2020

### New features
<!-- markdownlint-disable MD004 -->
* **v2.0 reference available** - View the [v2.0 API Reference](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeWithCustomForm) and the updated SDKs for [.NET](/dotnet/api/overview/azure/ai.formrecognizer-readme), [Python](/python/api/overview/azure/), [Java](/java/api/overview/azure/ai-formrecognizer-readme), and [JavaScript](/javascript/api/overview/azure/).
* **Table enhancements and Extraction enhancements** - includes accuracy improvements and table extractions enhancements, specifically, the capability to learn tables headers and structures in _custom train without labels_. 

* **Currency support** - Detection and extraction of global currency symbols.
* **Azure Gov** - Form Recognizer is now also available in Azure Gov.
* **Enhanced security features**: 
  * **Bring your own key** - Form Recognizer automatically encrypts your data when persisted to the cloud to protect it and to help you to meet your organizational security and compliance commitments. By default, your subscription uses Microsoft-managed encryption keys. You can now also manage your subscription with your own encryption keys. [Customer-managed keys, also known as bring your own key (BYOK)](./form-recognizer-encryption-of-data-at-rest.md), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.  
  * **Private endpoints** – Enables you on a virtual network (VNet) to [securely access data over a Private Link.](../../private-link/private-link-overview.md)

## June 2020

### New features

* **CopyModel API added to client SDKs** - You can now use the client SDKs to copy models from one subscription to another. See [Back up and recover models](./disaster-recovery.md) for general information on this feature.
* **Azure Active Directory integration** - You can now use your Azure AD credentials to authenticate your Form Recognizer client objects in the SDKs.
* **SDK-specific changes** - This includes both minor feature additions and breaking changes. See the SDK changelogs for more information.
  * [C# SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/formrecognizer/Azure.AI.FormRecognizer/CHANGELOG.md)
  * [Python SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)
  * [Java SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/formrecognizer/azure-ai-formrecognizer/CHANGELOG.md)
  * [JavaScript SDK Preview 3 changelog](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_1.0.0-preview.3/sdk/formrecognizer/ai-form-recognizer/CHANGELOG.md)

## April 2020

### New features

* **SDK support for Form Recognizer API v2.0 Public Preview** - This month we expanded our service support to include a preview SDK for Form Recognizer v2.0 (preview) release. Use the links below to get started with your language of choice: 
  * [.NET SDK](/dotnet/api/overview/azure/ai.formrecognizer-readme)
  * [Java SDK](/java/api/overview/azure/ai-formrecognizer-readme)
  * [Python SDK](/python/api/overview/azure/ai-formrecognizer-readme)
  * [JavaScript SDK](/javascript/api/overview/azure/ai-form-recognizer-readme)

  The new SDK supports all the features of the v2.0 REST API for Form Recognizer. For example, you can train a model with or without labels and extract text, key value pairs and tables from your forms, extract data from receipts with the pre-built receipts service and extract text and tables with the layout service from your documents. You can share your feedback on the SDKs through the [SDK Feedback form](https://aka.ms/FR_SDK_v1_feedback).

* **Copy Custom Model** You can now copy models between regions and subscriptions using the new Copy Custom Model feature. Before invoking the Copy Custom Model API, you must first obtain authorization to copy into the target resource by calling the Copy Authorization operation against the target resource endpoint.

  * [Generate a copy authorization](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/CopyCustomFormModelAuthorization) REST API
  * [Copy a custom model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/CopyCustomFormModel) REST API 

### Security improvements

* Customer-Managed Keys are now available for FormRecognizer. For more information, see [Data encryption at rest for Form Recognizer](./encrypt-data-at-rest.md).
* Use Managed Identities for access to Azure resources with Azure Active Directory. For more information, see [Authorize access to managed identities](../authentication.md#authorize-access-to-managed-identities).

## March 2020

### New features

* **Value types for labeling** You can now specify the types of values you're labeling with the Form Recognizer sample labeling tool. The following value types and variations are currently supported:
  * `string`
    * default, `no-whitespaces`, `alphanumeric`
  * `number`
    * default, `currency`
  * `date` 
    * default, `dmy`, `mdy`, `ymd`
  * `time`
  * `integer`

  See the [Sample labeling tool](./quickstarts/label-tool.md#specify-tag-value-types) guide to learn how to use this feature.


* **Table visualization** The sample labeling tool now displays tables that were recognized in the document. This feature lets you view the tables that have been recognized and extracted from the document, prior to labeling and analyzing. This feature can be toggled on/off using the layers option.

  The following image is an example of how tables are recognized and extracted:

  > [!div class="mx-imgBorder"]
  > ![Table visualization using the sample labeling tool](./media/whats-new/table-viz.png)

    The extracted tables are available in the JSON output under `"pageResults"`.

  > [!IMPORTANT]
  > Labeling tables isn't supported. If tables are not recognized and extrated automatically, you can only label them as key/value pairs. When labeling tables as key/value pairs, label each cell as a unique value.

### Extraction enhancements

This release includes extraction enhancements and accuracy improvements, specifically, the capability to label and extract multiple key/value pairs in the same line of text. 
 
### Sample labeling tool is now open-source

The Form Recognizer sample labeling tool is now available as an open-source project. You can integrate it within your solutions and make customer-specific changes to meet your needs.

For more information about the Form Recognizer sample labeling tool, review the documentation available on [GitHub](https://github.com/microsoft/OCR-Form-Tools/blob/master/README.md).

### TLS 1.2 enforcement

TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure Cognitive Services security](../cognitive-services-security.md).

## January 2020

This release introduces the Form Recognizer 2.0 (preview). In the sections below, you'll find more information about new features, enhancements, and changes. 

### New features

* **Custom model**
  * **Train with labels** You can now train a custom model with manually labeled data. This method results in better-performing models and can produce models that work with complex forms or forms containing values without keys.
  * **Asynchronous API** You can use async API calls to train with and analyze large data sets and files.
  * **TIFF file support** You can now train with and extract data from TIFF documents.
  * **Extraction accuracy improvements**

* **Prebuilt receipt model**
  * **Tip amounts** You can now extract tip amounts and other handwritten values.
  * **Line item extraction** You can extract line item values from receipts.
  * **Confidence values** You can view the model's confidence for each extracted value.
  * **Extraction accuracy improvements**

* **Layout extraction** You can now use the Layout API to extract text data and table data from your forms.

### Custom model API changes

All of the APIs for training and using custom models have been renamed, and some synchronous methods are now asynchronous. The following are major changes:

* The process of training a model is now asynchronous. You initiate training through the **/custom/models** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}** to return the training results.
* Key/value extraction is now initiated by the **/custom/models/{modelID}/analyze** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}/analyzeResults/{resultID}** to return the extraction results.
* Operation IDs for the Train operation are now found in the **Location** header of HTTP responses, not the **Operation-Location** header.

### Receipt API changes

The APIs for reading sales receipts have been renamed.

* Receipt data extraction is now initiated by the **/prebuilt/receipt/analyze** API call. This call returns an operation ID, which you can pass into **/prebuilt/receipt/analyzeResults/{resultID}** to return the extraction results.

### Output format changes

The JSON responses for all API calls have new formats. Some keys and values have been added, removed, or renamed. See the quickstarts for examples of the current JSON formats.

## Next steps

Complete a [quickstart](quickstarts/client-library.md) to get started writing a forms processing app with Form Recognizer in the development language of your choice.

## See also

* [What is Form Recognizer?](./overview.md)
