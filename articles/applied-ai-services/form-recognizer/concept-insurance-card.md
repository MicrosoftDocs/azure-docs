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

# Azure Form Recognizer health insurance card model

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

A health card is a health insurance identity proof that holds your personal details, policy information and financial coverage under a health insurance plan. It offers cashless payment options to pay for your medical bills arising from hospitalization and other treatment charges. When you present your health insurance card in the hospital, the hospital management will digitally analyze the financial coverage that you can avail to plan for the treatment. They can also get the expenses paid by the insurance provider directly. Health insurance card is a key document used in processes like patient onboarding, insurance claim processing, etc.

Health insurance cards can be presented in various formats and quality including phone-captured images, scanned documents, and digital PDFs. The Health Insurance Card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract insurer, member, prescription, group number and more information from US health insurance cards.

***Sample health insurance card processed using Form Recognizer Studio***

:::image type="content" source="media/studio/health-insurance-card.png" alt-text="Screenshot of sample health insurance card processed in the Form Recognizer Studio.":::

## Development options

The prebuilt health insurance card model is supported by Form Recognizer v3.0 with the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**health insurance card model**|<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)</li></ul>|**prebuilt-healthInsuranceCard.us**|

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
[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|prebuilt-healthInsuranceCard.us| <ul><li>English (United States)</li></ul>|English (United States)—en-US|

## Field extraction

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Insurer`|`string`|Health insurance provider name| PREMERA |
|`Member`|`object`|||
|`Member.Name`|`string`|Member name| ANGEL BROWN |
|`Member.BirthDate`|`date`|Member date of birth||
|`Member.Employer`|`string`|Member name employer||
|`Member.Gender`|`string`|Member gender||
|`Member.IdNumberSuffix`|`string`|Identification Number Suffix as it appears on some health insurance cards||
|`Dependents`|`array`|Array holding list of dependents, ordered where possible by membership suffix value||
|`Dependents.*`|`object`|||
|`Dependents.*.Name`|`string`|Dependent name||
|`IdNumber`|`object`|||
|`IdNumber.Prefix`|`string`|Identification Number Prefix as it appears on some health insurance cards||
|`IdNumber.Number`|`string`|Identification Number| 123456789 |
|`GroupNumber`|`string`|Insurance Group Number| 1000000 |
|`PrescriptionInfo`|`object`|||
|`PrescriptionInfo.Issuer`|`string`|ANSI issuer identification number (IIN)||
|`PrescriptionInfo.RxBIN`|`string`|Prescription issued BIN number| 987654 |
|`PrescriptionInfo.RxPCN`|`string`|Prescription processor control number| HFHMAPD |
|`PrescriptionInfo.RxGrp`|`string`|Prescription group number| BCAAXYZ |
|`PrescriptionInfo.RxId`|`string`|Prescription identification number. If not present, will default to membership id number| 120034567 |
|`PrescriptionInfo.RxPlan`|`string`|Prescription Plan number| Express Script |
|`Pbm`|`string`|Pharmacy Benefit Manager for the plan||
|`EffectiveDate`|`date`|Date from which the plan is effective| 08/01/2013 |
|`Copays`|`array`|Array holding list of CoPay Benefits||
|`Copays.*`|`object`|||
|`Copays.*.Benefit`|`string`|Co-Pay Benefit name| $1,500 |
|`Copays.*.Amount`|`currency`|Co-Pay required amount| deductible |
|`Payer`|`object`|||
|`Payer.Id`|`string`|Payer Id Number||
|`Payer.Address`|`address`|Payer address||
|`Payer.PhoneNumber`|`phoneNumber`|Payer phone number||
|`Plan`|`object`|||
|`Plan.Number`|`string`|Plan number||
|`Plan.Name`|`string`|Plan name - If see Medicaid -> then medicaid||
|`Plan.Type`|`string`|Plan type||


### Migration guide and REST API v3.0

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:
> [!div class="checklist"]
>
> * [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)
> * [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)
> * [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)
> * [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)
> * [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true#prebuilt-model)</li></ul>