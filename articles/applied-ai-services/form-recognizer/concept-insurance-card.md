---
title: Form Recognizer insurance card prebuilt model
titleSuffix: Azure Applied AI Services
description: Data extraction and analysis extraction using the insurance card model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: lajanuar
recommendations: false
---

# Form Recognizer insurance card model | Preview

A health card is a health insurance identity proof that holds your personal details, policy information and financial coverage under a health insurance plan. It offers cashless payment options to pay for your medical bills arising from hospitalization and other treatment charges. When you present your health insurance card in the hospital, the hospital management will digitally analyze the financial coverage that you can avail to plan for the treatment. They can also get the expenses paid by the insurance provider directly. Health insurance card is a key document used in processes like patient onboarding, insurance claim processing, etc.

Health insurance cards can be presented in various formats and quality including phone-captured images, scanned documents, and digital PDFs. The Health Insurance Card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract insurer, member, prescription, group number and more information from US health insurance cards.

***Sample health insurance card processed using Form Recognizer Studio***

:::image type="content" source="media/studio/health-insurance-card.png" alt-text="Screenshot of sample health insurance card processed in the Form Recognizer Studio.":::

## Development options

The prebuilt health insurance card model is supported by Form Recognizer v3.0 with the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**health insurance card model**|<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-3/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|**prebuilt-healthInsuranceCard.us**|

### Try Form Recognizer

See how data is extracted from health insurance cards using the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio

> [!NOTE]
> Form Recognizer studio is available with v3.0 preview API.

1. On the [Form Recognizer Studio home page](https://formrecognizer.appliedai.azure.com/studio), select **Health insurance cards**.

1. You can analyze the sample insurance card document or select the **➕ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/insurance-card-analyze.png" alt-text="Screenshot: analyze health insurance card window in the Form Recognizer Studio.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=healthInsuranceCard.us)

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|prebuilt-healthInsuranceCard.us| <ul><li>English (United States)</li></ul>|English (United States)—en-US|

## Field extraction

| Name | Type | Description | Standardized output|
|:-----|:----|:----|:----|
| Copays | Array of objects | An array of Amount and Benefit | 123-45-6789 |
| Amount | String | Amount of copay | $1,500 |
| Benefit | String | Benefit of copay | deductible |
| GroupNumber | String | Group number of the insurance plan | 1000000 |
| IdNumber.Number | String | Insurance card holder’s ID number, excluding prefix and suffix. Aka. member ID or insurance ID. | 123456789 |
| Insurer | String | Insurance company name | PREMERA |
| Member.Name | String | Name of the member | ANGEL BROWN |
| PrescriptionInfo.RxBIN | String | RxBIN, available on prescription card only. | 987654 |
| PrescriptionInfo.RxGrp | String | RxGroup, available on prescription card only. | BCAAXYZ |
| PrescriptionInfo.RxPCN | String | RxPCN, available on prescription card only. | HFHMAPD |
| PrescriptionInfo.RxId | String | RxId, available on prescription card only. | 120034567 |
| PrescriptionInfo.RxPlan | String | RxPlan, available on prescription card only. | Express Script |
| IssuerID | String | ID of the card issuer | (80840) 0000000000 |
| EffectiveDate | Date | Date when the insurance coverage becomes active. | 08/01/2013 |


### Migration guide and REST API v3.0

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:
> [!div class="checklist"]
>
> * [**REST API**](quickstarts/try-v3-rest-api.md)
> * [**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)
> * [**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)
> * [**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)
> * [**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>
