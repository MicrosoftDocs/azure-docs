---
title: Form Recognizer W-2 form prebuilt model
titleSuffix: Azure Applied AI Services
description: Data extraction and analysis extraction using the prebuilt-tax Form W-2 model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: lajanuar
recommendations: false
---

# Form Recognizer W-2 model | Preview

The Form W-2, Wage and Tax Statement, is a [US Internal Revenue Service (IRS) tax form](https://www.irs.gov/forms-pubs/about-form-w-2). It's used to report employees' salary, wages, compensation, and taxes withheld. Employers send a W-2 form to each employee on or before January 31 each year and employees use the form to prepare their tax returns. W-2 is a key document used in employee's federal and state taxes filing, as well as other processes like mortgage loan and Social Security Administration (SSA).

A W-2 is a multipart form divided into state and federal sections and consisting of more than 14 boxes that details an employee's income from the previous year. The Form Recognizer W-2 model, combines Optical Character Recognition (OCR) with deep learning models to analyze and extract information reported in each box on a W-2 form. The model supports standard and customized forms from 2018 to the present. Both [single and multiple forms](https://en.wikipedia.org/wiki/Form_W-2#Filing_requirements) are also supported.

***Sample W-2 tax form processed using Form Recognizer Studio***

:::image type="content" source="media/studio/w-2.png" alt-text="Screenshot of sample w-2 form processed in the Form Recognizer Studio.":::

## Development options

The prebuilt W-2 form, model is supported by Form Recognizer v3.0 with the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**W-2 model**|<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|**prebuilt-tax.us.w2**|

### Try Form Recognizer

See how data is extracted from W-2 forms using the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio

> [!NOTE]
> Form Recognizer studio is available with v3.0 preview API.

1. On the [Form Recognizer Studio home page](https://formrecognizer.appliedai.azure.com/studio), select **W-2 form**.

1. You can analyze the sample W-2 document or select the **➕ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/w2-analyze.png" alt-text="Screenshot: analyze W-2 window in the Form Recognizer Studio.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)

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
|prebuilt-tax.us.w2| <ul>English (United States)</ul></br>|English (United States)—en-US|

## Field extraction

|Name| Box | Type | Description | Standardized output|
|:-----|:----|:----|:----|:----|
| Employee.SocialSecurityNumber | a | String | Employee's Social Security Number (SSN).  | 123-45-6789 |
| Employer.IdNumber | b | String | Employer's ID number (EIN), the business equivalent of a social security number| 12-1234567 |
| Employer.Name | c | String | Employer's name | Contoso |
| Employer.Address | c | String | Employer's address (with city) | 123 Example Street Sample City, CA |
| Employer.ZipCode | c | String | Employer's zip code | 12345 |
| ControlNumber | d | String | A code identifying the unique W-2 in the records of employer | R3D1 |
| Employee.Name | e | String | Full name of the employee | Henry Ross|
| Employee.Address | f | String | Employee's address (with city) | 123 Example Street Sample City, CA |
| Employee.ZipCode | f | String | Employee's zip code | 12345 |
| WagesTipsAndOtherCompensation | 1 | Number | A summary of your pay, including wages, tips and other compensation | 50000 |
| FederalIncomeTaxWithheld | 2 | Number | Federal income tax withheld | 1111 |
| SocialSecurityWages | 3 | Number | Social security wages | 35000 |
| SocialSecurityTaxWithheld | 4 | Number | Social security tax with held | 1111 |
| MedicareWagesAndTips | 5 | Number | Medicare wages and tips | 45000 |
| MedicareTaxWithheld | 6 | Number | Medicare tax with held | 1111 |
| SocialSecurityTips | 7 | Number | Social security tips | 1111 |
| AllocatedTips | 8 | Number | Allocated tips | 1111 |
| VerificationCode | 9 | String | Verification Code on Form W-2 | A123-B456-C789-DXYZ |
| DependentCareBenefits | 10 | Number | Dependent care benefits | 1111 |
| NonqualifiedPlans | 11 | Number | The non-qualified plan, a type of retirement savings plan that is employer-sponsored and tax-deferred | 1111 |
| AdditionalInfo |  | Array of objects | An array of LetterCode and Amount |  |
| LetterCode | 12a, 12b, 12c, 12d | String | Letter code Refer to [IRS/W-2](https://www.irs.gov/pub/irs-prior/fw2--2014.pdf) for the semantics of the code values. | D |
| Amount | 12a, 12b, 12c, 12d | Number | Amount | 1234 |
| IsStatutoryEmployee | 13 | String | Whether the RetirementPlan box is checked or not | true |
| IsRetirementPlan | 13 | String | Whether the RetirementPlan box is checked or not | true |
| IsThirdPartySickPay | 13 | String | Whether the ThirdPartySickPay box is checked or not | false |
| Other | 14 | String | Other info employers may use this field to report |  |
| StateTaxInfos |  | Array of objects | An array of state tax info including State, EmployerStateIdNumber, StateIncomeTax, StageWagesTipsEtc |  |
| State | 15 | String | State | CA |
| EmployerStateIdNumber | 15 | String | Employer state number | 123-123-1234 |
| StateWagesTipsEtc  | 16 | Number | State wages, tips, etc. | 50000 |
| StateIncomeTax | 17 | Number | State income tax | 1535 |
| LocalTaxInfos |  | Array of objects | An array of local income tax info including LocalWagesTipsEtc, LocalIncomeTax, LocalityName |  |
| LocalWagesTipsEtc | 18 | Number | Local wages, tips, etc. | 50000 |
| LocalIncomeTax | 19 | Number | Local income tax | 750 |
| LocalityName | 20 | Number | Locality name. | CLEVELAND |
 | W2Copy |  | String | Copy of W-2 forms A, B, C, D, 1, or 2 | Copy A For Social Security Administration |
| TaxYear |  | Number | Tax year | 2020 |
| W2FormVariant |  | String | The variants of W-2 forms, including "W-2", "W-2AS", "W-2CM", "W-2GU", "W-2VI" | W-2 |


### Migration guide and REST API v3.0

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

|Programming language | :::image type="content" source="media/form-recognizer-icon.png" alt-text="Form Recognizer icon from the Azure portal."::: |Programming language
|:---:|:---:|:---:|
|[**C#**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)||[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)|
|[**Java**](quickstarts/try-v3-java-sdk.md#prebuilt-model)||[**Python**](quickstarts/try-v3-python-sdk.md#prebuilt-model)|
|[**REST API**](quickstarts/try-v3-rest-api.md)|||
