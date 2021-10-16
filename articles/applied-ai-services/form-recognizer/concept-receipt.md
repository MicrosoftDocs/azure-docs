---
title: Form Recognizer receipt model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using the prebuilt receipt model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/16/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer receipt model

The receipt model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from sales receipts. Receipts can be of various formats and quality including printed and handwritten receipts. The API extracts key information such as merchant name, merchant phone number, transaction date, tax, and transaction total and returns a structured JSON data representation.

##### Sample receipt processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

## Try Form Recognizer Studio (Preview)

* Form Recognizer studio is available with the preview (v3.0) API.

* Extract time and date of transactions, merchant information, amount totals, and more with our Form Recognizer Studio Receipt feature:

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)

## Try it: Sample Labeling tool

You can see how receipt data is extracted by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* A receipt document. You can use our [sample receipt document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-receipt.png).

> [!div class="nextstepaction"]
  > [Try it](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

In the Form Recognizer UI:

  1. Select **Use prebuilt model to get data**.
  1. Select **Receipt** from the **Form Type** dropdown menu:

  :::image type="content" source="media/try-receipt.png" alt-text="Screenshot: sample labeling tool dropdown prebuilt model selection menu.":::

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

## Supported languages and locales v2.1

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Receipt| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li></ul>  | Autodetected |

## Key-value pair extraction

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:----|
| ReceiptType | string | Type of sales receipt |  Itemized |
| MerchantName | string | Name of the merchant issuing the receipt |  |
| MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx |
| MerchantAddress | string | Listed address of merchant |   |
| TransactionDate | date | Date the receipt was issued | yyyy-mm-dd |
| TransactionTime | time | Time the receipt was issued | hh-mm-ss (24-hour)  |
| Total | number (USD)| Full transaction total of receipt | Two-decimal float|
| Subtotal | number (USD) | Subtotal of receipt, often before taxes are applied | Two-decimal float|
| Tax | number (USD) | Tax on receipt (often sales tax or equivalent) | Two-decimal float |
| Tip | number (USD) | Tip included by buyer | Two-decimal float|
| Items | array of objects | Extracted line items, with name, quantity, unit price, and total price extracted | |
| Name | string | Item name | |
| Quantity | number | Quantity of each item | integer |
| Price | number | Individual price of each item unit| Two-decimal float |
| Total Price | number | Total price of line item | Two-decimal float |

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities:

* **Receipt** model supports single-page hotel receipt processing.

    ### Hotel receipt key-value pair extraction

    |Name| Type | Description | Standardized output |
    |:-----|:----|:----|:----|
    | ArrivalDate | date | Date of arrival | yyyy-mm-dd |
    | Currency | currency | Currency unit of receipt amounts. For example USD, EUR, or MIXED if multiple values are found ||
    | DepartureDate | date | Date of departure | yyyy-mm-dd |
    | Items | array | | |
    | Items.*.Category | string | Item category, e.g. Room, Tax, etc. |  |
    | Items.*.Date | date | Item date | yyyy-mm-dd |
    | Items.*.Description | string | Item description | |
    | Items.*.TotalPrice |  number | Item total price | integer |
    | Locale | string | Locale of the receipt, for example, en-US. | ISO language-county code   |
    | MerchantAddress | string | Listed address of merchant | |
    | MerchantAliases | array| | |
    | MerchantAliases.* | string | Alternative name of merchant |  |
    | MerchantName | string | Name of the merchant issuing the receipt | |
    | MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx|
    | ReceiptType | string | Type of receipt, e.g. Hotel, Itemized | |
    | Total | number | Full transaction total of receipt | Two-decimal float |

    ### Hotel receipt supported languages and locales

    | Model | Language—Locale code | Default |
    |--------|:----------------------|:---------|
    |Receipt (hotel) | <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeReceiptAsync)
