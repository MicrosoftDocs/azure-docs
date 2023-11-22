---
title: Health insurance card processing - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Data extraction and analysis extraction using the health insurance card model
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: lajanuar
monikerRange: 'doc-intel-4.0.0 || >=doc-intel-3.0.0'
---


# Document Intelligence health insurance card model

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:**![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru) ![blue-checkmark](media/blue-yes-icon.png) [**v3.0 (GA)**](?view=doc-intel-3.0.0&preserve-view=tru)
::: moniker-end

::: moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.0**](?view=doc-intel-3.0.0&preserve-view=true)
::: moniker-end

::: moniker range="doc-intel-3.0.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.0 (GA)** | **Latest versions:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true) ![purple-checkmark](media/purple-yes-icon.png) [**v3.1 (preview)**](?view=doc-intel-3.1.0&preserve-view=true)
::: moniker-end

The Document Intelligence health insurance card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from US health insurance cards. A health insurance card is a key document for care processing and can be digitally analyzed for patient onboarding, financial coverage information, cashless payments, and insurance claim processing. The health insurance card model analyzes health card images; extracts key information such as insurer, member, prescription, and group number; and returns a structured JSON representation.  Health insurance cards can be presented in various formats and quality including phone-captured images, scanned documents, and digital PDFs.

***Sample health insurance card processed using Document Intelligence Studio***

:::image type="content" source="media/studio/health-insurance-card.png" alt-text="Screenshot of sample health insurance card processed in the Document Intelligence Studio.":::

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2023-10-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Health insurance card model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**prebuilt-healthInsuranceCard.us**|
::: moniker-end

::: moniker range="doc-intel-3.1.0"

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Health insurance card model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**prebuilt-healthInsuranceCard.us**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Health insurance card model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**prebuilt-healthInsuranceCard.us**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

### Try Document Intelligence Studio

See how data is extracted from health insurance cards using the Document Intelligence Studio. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

> [!NOTE]
> Document Intelligence Studio is available with API version v3.0.

1. On the [Document Intelligence Studio home page](https://formrecognizer.appliedai.azure.com/studio), select **Health insurance cards**.

1. You can analyze the sample insurance card document or select the **➕ Add** button to upload your own sample.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=healthInsuranceCard.us)

## Supported languages and locales

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Insurer`|`string`|Health insurance provider name|PREMERA<br>BLUE CROSS|
|`Member`|`object`|||
|`Member.Name`|`string`|Member name|ANGEL BROWN|
|`Member.BirthDate`|`date`|Member date of birth|01/06/1958|
|`Member.Employer`|`string`|Member name employer|Microsoft|
|`Member.Gender`|`string`|Member gender|M|
|`Member.IdNumberSuffix`|`string`|Identification Number Suffix as it appears on some health insurance cards|01|
|`Dependents`|`array`|Array holding list of dependents, ordered where possible by membership suffix value||
|`Dependents.*`|`object`|||
|`Dependents.*.Name`|`string`|Dependent name|01|
|`IdNumber`|`object`|||
|`IdNumber.Prefix`|`string`|Identification Number Prefix as it appears on some health insurance cards|ABC|
|`IdNumber.Number`|`string`|Identification Number|123456789|
|`GroupNumber`|`string`|Insurance Group Number|1000000|
|`PrescriptionInfo`|`object`|||
|`PrescriptionInfo.Issuer`|`string`|ANSI issuer identification number (IIN)|(80840) 300-11908-77|
|`PrescriptionInfo.RxBIN`|`string`|Prescription issued BIN number|987654|
|`PrescriptionInfo.RxPCN`|`string`|Prescription processor control number|63200305|
|`PrescriptionInfo.RxGrp`|`string`|Prescription group number|BCAAXYZ|
|`PrescriptionInfo.RxId`|`string`|Prescription identification number. If not present, defaults to membership ID number|P97020065|
|`PrescriptionInfo.RxPlan`|`string`|Prescription Plan number|A1|
|`Pbm`|`string`|Pharmacy Benefit Manager for the plan|CVS CAREMARK|
|`EffectiveDate`|`date`|Date from which the plan is effective|08/12/2012|
|`Copays`|`array`|Array holding list of Co-Pay Benefits||
|`Copays.*`|`object`|||
|`Copays.*.Benefit`|`string`|Co-Pay Benefit name|Deductible|
|`Copays.*.Amount`|`currency`|Co-Pay required amount|$1,500|
|`Payer`|`object`|||
|`Payer.Id`|`string`|Payer ID Number|89063|
|`Payer.Address`|`address`|Payer address|123 Service St., Redmond WA, 98052|
|`Payer.PhoneNumber`|`phoneNumber`|Payer phone number|+1 (987) 213-5674|
|`Plan`|`object`|||
|`Plan.Number`|`string`|Plan number|456|
|`Plan.Name`|`string`|Plan name - If Medicaid -> then `medicaid` (all lower case).|HEALTH SAVINGS PLAN|
|`Plan.Type`|`string`|Plan type|PPO|
|`MedicareMedicaidInfo`|`object`|||
|`MedicareMedicaidInfo.Id`|`string`|Medicare or Medicaid number|1AB2-CD3-EF45|
|`MedicareMedicaidInfo.PartAEffectiveDate`|`date`|Effective date of Medicare Part A|01-01-2023|
|`MedicareMedicaidInfo.PartBEffectiveDate`|`date`|Effective date of Medicare Part B|01-01-2023|

### Migration guide and REST API v3.1

* Follow our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md) to learn how to use the v3.1 version in your applications and workflows.

* Explore our [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) to learn more about the v3.1 version and new capabilities.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
