---
title: Form Recognizer invoice model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt invoice model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/15/2022
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer invoice model

 The invoice model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key fields and line items from sales invoices.  Invoices can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes invoice text; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation. The model currently supports both English and Spanish invoices.

**Sample invoice processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)**:

:::image type="content" source="media/studio/overview-invoices.png" alt-text="sample invoice" lightbox="media/overview-invoices-big.jpg":::

## Development options

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Invoice model**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Invoice model** | <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|**prebuilt-invoice**|

### Try Form Recognizer

See how data, including customer information, vendor details, and line items, is extracted from invoices using  the Form Recognizer Studio or our Sample Labeling tool. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

1. On the Form Recognizer Studio home page, select **Invoices**

1. You can analyze the sample invoice or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/invoice-analyze.png" alt-text="Screenshot: analyze invoice menu.":::

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

#### Sample Labeling tool (API v2.1)
> [!NOTE]
> Unless you must use API v2.1, it is strongly suggested that you use the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com) for testing purposes instead of the sample labeling tool.

You'll need an invoice document. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf).

1. On the Sample Labeling tool home page, select **Use prebuilt model to get data**.

1. Select **Invoice** from the **Form Type** dropdown menu:

    :::image type="content" source="media/try-invoice.png" alt-text="Screenshot: Sample Labeling tool dropdown prebuilt model selection menu.":::

    > [!div class="nextstepaction"]
    > [Try Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Invoice| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|
|Invoice| <ul><li>Spanish—es</li></ul>| Spanish (United States)—es|

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
| TotalVAT | Number | Total VAT field identified on this invoice | Integer |
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
| VAT | Number | Stands for Value added tax. This is a flat tax levied on an item. Common in European countries | &euro;20.00 | |

The invoice key-value pairs and line items extracted are in the `documentResults` section of the JSON output. 

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features, capabilities, and AI quality improvements to underlying technologies.

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:
    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0 (Preview)](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)
    
    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291)
