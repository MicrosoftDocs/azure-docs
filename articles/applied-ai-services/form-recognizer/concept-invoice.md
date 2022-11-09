---
title: Invoice data extraction – Form Recognizer
titleSuffix: Azure Applied AI Services
description: Automate invoice data extraction with Form Recognizer’s invoice model to extract accounts payable data including invoice line items.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2022
ms.author: lajanuar
monikerRange: '>=form-recog-2.1.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Automated invoice processing

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

## What is automated invoice processing?

Automated invoice processing is the process of extracting key accounts payable fields from including invoice line items from invoices and integrating it with your accounts payable (AP) workflows for reviews and payments. Historically, the accounts payable process has been very manual and time consuming. Accurate extraction of key data from invoices is typically the first and one of the most critical steps in the invoice automation process.

## Form Recognizer Invoice model

The machine learning based invoice model combines powerful Optical Character Recognition (OCR) capabilities with invoice understanding models to analyze and extract key fields and line items from sales invoices. Invoices can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes invoice text; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation. The model currently supports both English and Spanish invoices.

**Sample invoice processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)**:

:::image type="content" source="media/studio/overview-invoices.png" alt-text="sample invoice" lightbox="media/overview-invoices-big.jpg":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Invoice model** | <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-invoice**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Invoice model**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](/azure/applied-ai-services/form-recognizer/how-to-guides/use-sdk-rest-api?view=form-recog-2.1.0&preserve-view=true&tabs=windows&pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|


### Try invoice data extraction

See how data, including customer information, vendor details, and line items, is extracted from invoices using  the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio 

1. On the Form Recognizer Studio home page, select **Invoices**

1. You can analyze the sample invoice or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/invoice-analyze.png" alt-text="Screenshot: analyze invoice menu.":::

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Invoice| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|
|Invoice| <ul><li>Spanish—es</li></ul>| Spanish (United States)—es|
|Invoice | <ul><li>German—de</li></ul>| German (Germany)-de|
|Invoice | <ul><li>French—fr</li></ul>| French (France)—fr|
|Invoice | <ul><li>Italian—it</li></ul>| Italian (Italy)—it|
|Invoice | <ul><li>Portuguese—pt</li></ul>| Portuguese (Portugal)—pt|
|Invoice | <ul><li>Dutch—nl</li></ul>| Dutch (Netherlands)—nl|

## Field extraction

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:---:|
| CustomerName | String | Invoiced customer| |
| CustomerId | String | Customer reference ID | |
| PurchaseOrder | String | Purchase order reference number | |
| InvoiceId | String | ID for this specific invoice (often "Invoice Number") | |
| InvoiceDate | Date | Date the invoice was issued | yyyy-mm-dd|
| DueDate | Date | Date payment for this invoice is due | yyyy-mm-dd|
| VendorName | String | Vendor name |  |
| VendorTaxId | String | The taxpayer number associated with the vendor | |
| VendorAddress | String |  Vendor mailing address|  |
| VendorAddressRecipient | String | Name associated with the VendorAddress |  |
| CustomerAddress | String | Mailing address for the Customer | |
| CustomerTaxId | String | The taxpayer number associated with the customer | |
| CustomerAddressRecipient | String | Name associated with the CustomerAddress | |
| BillingAddress | String | Explicit billing address for the customer |  |
| BillingAddressRecipient | String | Name associated with the BillingAddress | |
| ShippingAddress | String | Explicit shipping address for the customer | |
| ShippingAddressRecipient | String | Name associated with the ShippingAddress |  |
| PaymentTerm | String | The terms of payment for the invoice | |
| SubTotal | Number | Subtotal field identified on this invoice | Integer |
| TotalTax | Number | Total tax field identified on this invoice | Integer |
| InvoiceTotal | Number (USD) | Total new charges associated with this invoice | Integer |
| AmountDue |  Number (USD) | Total Amount Due to the vendor | Integer |
| ServiceAddress | String | Explicit service address or property address for the customer | |
| ServiceAddressRecipient | String | Name associated with the ServiceAddress |  |
| RemittanceAddress | String | Explicit remittance or payment address for the customer |   |
| RemittanceAddressRecipient | String | Name associated with the RemittanceAddress |  |
| ServiceStartDate | Date | First date for the service period (for example, a utility bill service period) | yyyy-mm-dd |
| ServiceEndDate | Date | End date for the service period (for example, a utility bill service period) | yyyy-mm-dd|
| PreviousUnpaidBalance | Number | Explicit previously unpaid balance | Integer |

### Line items

Following are the line items extracted from an invoice in the JSON output response (the output below uses this [sample invoice](media/sample-invoice.jpg))

|Name| Type | Description | Text (line item #1) | Value (standardized output) |
|:-----|:----|:----|:----| :----|
| Items | String | Full string text line of the line item | 3/4/2021 A123 Consulting Services 2 hours $30.00 10% $60.00 | |
| Amount | Number | The amount of the line item | $60.00 | 100 |
| Description | String | The text description for the invoice line item | Consulting service | Consulting service |
| Quantity | Number | The quantity for this invoice line item | 2 | 2 |
| UnitPrice | Number | The net or gross price (depending on the gross invoice setting of the invoice) of one unit of this item | $30.00 | 30 |
| ProductCode | String| Product code, product number, or SKU associated with the specific line item | A123 | |
| Unit | String| The unit of the line item, e.g,  kg, lb etc. | Hours | |
| Date | Date| Date corresponding to each line item. Often it's a date the line item was shipped | 3/4/2021| 2021-03-04 |
| Tax | Number | Tax associated with each line item. Possible values include tax amount, tax %, and tax Y/N | 10% | |

The invoice key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

### Key-value pairs 

The prebuilt invoice **2022-06-30** and later releases support returns key-value pairs at no extra cost. Key-value pairs are specific spans within the invoice that identify a label or key and its associated response or value. In an invoice, these pairs could be the label and the value the user entered for that field or telephone number. The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field may be left blank on a form in some instances. key-value pairs are always spans of text contained in the document. For documents where the same value is described in different ways, for example, customer/user, the associated key will be either customer or user (based on context).

## Form Recognizer v3.0

 The Form Recognizer v3.0 introduces several new features, capabilities, and AI quality improvements to underlying technologies.

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)

* Explore our REST API:
    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0 ](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291)
