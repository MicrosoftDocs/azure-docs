---
title: Form Recognizer receipt model
titleSuffix: Azure Applied AI Services
description: Concepts related to data extraction and analysis using the prebuilt receipt model
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

# Form Recognizer receipt model

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

The receipt model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from sales receipts. Receipts can be of various formats and quality including printed and handwritten receipts. The API extracts key information such as merchant name, merchant phone number, transaction date, tax, and transaction total and returns structured JSON data.

***Sample receipt processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)***:

:::image type="content" source="media/studio/overview-receipt.png" alt-text="sample receipt" lightbox="media/overview-receipt.jpg":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Receipt model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-receipt**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Receipt model**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-receipts)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)</li></ul>|

### Try Form Recognizer

See how data, including time and date of transactions, merchant information, and amount totals, is extracted from receipts using the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio 

> [!NOTE]
> Form Recognizer studio is available with the v3.0 API.

1. On the Form Recognizer Studio home page, select **Receipts**

1. You can analyze the sample receipt or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/receipt-analyze.png" alt-text="Screenshot: analyze receipt menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales v2.1

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Receipt| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li></ul>  | Autodetected |

## Field extraction

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:----|
| ReceiptType | String | Type of sales receipt |  Itemized |
| MerchantName | String | Name of the merchant issuing the receipt |  |
| MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx |
| MerchantAddress | String | Listed address of merchant |   |
| TransactionDate | Date | Date the receipt was issued | yyyy-mm-dd |
| TransactionTime | Time | Time the receipt was issued | hh-mm-ss (24-hour)  |
| Total | Number (USD)| Full transaction total of receipt | Two-decimal float|
| Subtotal | Number (USD) | Subtotal of receipt, often before taxes are applied | Two-decimal float|
 | Tax | Number (USD) | Total tax on receipt (often sales tax or equivalent). **Renamed to "TotalTax" in 2022-06-30 version**. | Two-decimal float |
| Tip | Number (USD) | Tip included by buyer | Two-decimal float|
| Items | Array of objects | Extracted line items, with name, quantity, unit price, and total price extracted | |
| Name | String | Item description. **Renamed to "Description" in 2022-06-30 version**. | |
| Quantity | Number | Quantity of each item | Two-decimal float |
| Price | Number | Individual price of each item unit| Two-decimal float |
| TotalPrice | Number | Total price of line item | Two-decimal float |

## Form Recognizer v3.0

 Form Recognizer v3.0 introduces several new features and capabilities. The **Receipt** model supports single-page hotel receipt processing.

### Hotel receipt field extraction

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:----|
| ArrivalDate | Date | Date of arrival | yyyy-mm-dd |
| Currency | Currency | Currency unit of receipt amounts. For example USD, EUR, or MIXED if multiple values are found ||
| DepartureDate | Date | Date of departure | yyyy-mm-dd |
| Items | Array | | |
| Items.*.Category | String | Item category, for example, Room, Tax, etc. |  |
| Items.*.Date | Date | Item date | yyyy-mm-dd |
| Items.*.Description | String | Item description | |
| Items.*.TotalPrice |  Number | Item total price | Two-decimal float |
| MerchantAddress | String | Listed address of merchant | |
| MerchantAliases | Array| | |
| MerchantAliases.* | String | Alternative name of merchant |  |
| MerchantName | String | Name of the merchant issuing the receipt | |
| MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx|
| ReceiptType | String | Type of receipt, for example, Hotel, Itemized | |
| Total | Number | Full transaction total of receipt | Two-decimal float |

### Hotel receipt supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Receipt (hotel) | <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|

### Migration guide and REST API v3.0

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

  > [!div class="nextstepaction"]
  > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
