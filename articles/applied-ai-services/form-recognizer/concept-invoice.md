---
title: Form Recognizer invoice model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt invoice model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/07/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer invoice model

 The invoice model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key fields and line items from sales invoices.  Invoices can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes invoice text; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation.

##### Sample invoice processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="media/overview-invoices.jpg" alt-text="sample invoice" lightbox="media/overview-invoices-big.jpg":::

## Try Form Recognizer Studio (Preview)

* Form Recognizer studio is available with the preview (v3.0) API.

* Extract customer and vendor details, line items, and more with our Form Recognizer Studio Invoice feature:

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Try it: Sample labeling tool

You can see how invoice data is extracted by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* An invoice document. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf).

> [!div class="nextstepaction"]
  > [Try it](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

  In the Form Recognizer UI:

  1. Select **Use prebuilt model to get data**.
  1. Select **Invoice** from the **Form Type** dropdown menu:

  :::image type="content" source="media/try-invoice.png" alt-text="Screenshot: sample labeling tool dropdown prebuilt model selection menu.":::

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * data must contain keys and values.
  * keys must appear above or to the left of the values; they can't appear below or to the right.

> [!NOTE]
> The [sample labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Invoice| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|

## Key-value pair extraction

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:---:|
| CustomerName | string | Invoiced customer| |
| CustomerId | string | Customer reference ID | |
| PurchaseOrder | string | Purchase order reference number | |
| InvoiceId | string | ID for this specific invoice (often "Invoice Number") | |
| InvoiceDate | date | Date the invoice was issued | yyyy-mm-dd|
| DueDate | date | Date payment for this invoice is due | yyyy-mm-dd|
| VendorName | string | Vendor name |  |
| VendorAddress | string |  Vendor mailing address|  |
| VendorAddressRecipient | string | Name associated with the VendorAddress |  |
| CustomerAddress | string | Mailing address for the Customer | |
| CustomerAddressRecipient | string | Name associated with the CustomerAddress | |
| BillingAddress | string | Explicit billing address for the customer |  |
| BillingAddressRecipient | string | Name associated with the BillingAddress | |
| ShippingAddress | string | Explicit shipping address for the customer | |
| ShippingAddressRecipient | string | Name associated with the ShippingAddress |  |
| SubTotal | number | Subtotal field identified on this invoice | integer |
| TotalTax | number | Total tax field identified on this invoice | integer |
| InvoiceTotal | number (USD) | Total new charges associated with this invoice | integer |
| AmountDue |  number (USD) | Total Amount Due to the vendor | integer |
| ServiceAddress | string | Explicit service address or property address for the customer | |
| ServiceAddressRecipient | string | Name associated with the ServiceAddress |  |
| RemittanceAddress | string | Explicit remittance or payment address for the customer |   |
| RemittanceAddressRecipient | string | Name associated with the RemittanceAddress |  |
| ServiceStartDate | date | First date for the service period (for example, a utility bill service period) | yyyy-mm-dd |
| ServiceEndDate | date | End date for the service period (for example, a utility bill service period) | yyyy-mm-dd|
| PreviousUnpaidBalance | number | Explicit previously unpaid balance | integer |

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities.

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291)
