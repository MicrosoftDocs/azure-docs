---
title: US Tax document data extraction – Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Automate US tax document data extraction with Document Intelligence's US tax document models
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence US tax document models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous versions:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true)
:::moniker-end

The Document Intelligence contract model uses powerful Optical Character Recognition (OCR) capabilities to analyze and extract key fields and line items from a select group of tax documents. Tax documents can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes document text; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation. The model currently supports certain English tax document formats.

**Supported document types:**

* W-2
* 1098
* 1098-E
* 1098-T
* 1099 and variations (A, B, C, CAP, DIV, G, H, INT, K, LS, LTC, MISC,  NEC, OID, PATR, Q, QA, R, S, SA, SB​)

## Automated tax document processing

Automated tax document processing is the process of extracting key fields from tax documents. Historically, tax documents have been done manually this model allows for the easy automation of tax scenarios

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2023-10-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/document-intelligence-api-2023-10-31-preview/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T**|
::: moniker-end

::: moniker range="doc-intel-3.1.0"

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try tax document data extraction

See how data, including customer information, vendor details, and line items, is extracted from invoices. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the [Document Intelligence Studio home page](https://formrecognizer.appliedai.azure.com/studio), select the supported tax document model.

1. You can analyze a sample tax document or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

>[!NOTE]
> Document Intelligence auto-detects language and locale data.

| Supported languages | Details |
|:----------------------|:---------|
| English (en) | United States (us)|

## Field extraction W-2

The following are the fields extracted from a W-2 tax form in the JSON output response.

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| `W-2FormVariant`| String | IR W-2 Form variant. This field can have the one of the following values: `W-2`, `W-2AS`, `W-2CM`, `W-2GU`, or `W-2VI`| W-2 |
| `TaxYear` | Number | Form tax year| 2021 |
| `W2Copy` | String | W-2 tax copy version along with printed instruction related to this copy| Copy A—For Social Security Administration |
| `Employee`| object | Object that contains social security number, name, and address| |
| `ControlNumber` | string | W-2 control number. IRS W-2 field d| 0AB12 D345 7890 |
| `Employer` | Object | Object that contains employer identification number, name and address|  |
| `WagesTipsAndOtherCompensation` | Number | Wages, tips, and other compensation amount in USD. IRS W-2 field 1| 1234567.89 |
| `FederalIncomeTaxWithheld` | Number | Federal income tax withheld amount in USD. IRS W-2 field 2| 1234567.89 |
| `SocialSecurityWages` | Number | Social security wages amount in USD. IRS W-2 field 3| 1234567.89 |
| `SocialSecurityTaxWithheld` | Number | Social security tax withheld amount in USD. IRS W-2 field 4| 1234567.89 |
| `MedicareWagesAndTips` | Number | Medicare wages and tips amount in USD. IRS W-2 field 5| 1234567.89 |
| `MedicareTaxWithheld` | Number | Medicare tax withheld amount in USD. IRS W-2 field 6| 1234567.89 |
| `SocialSecurityTips` | Number | Social security tips amount in USD. IRS W-2 field 7| 1234567.89 |
| `AllocatedTips` | Number | Allocated tips in USD. IRS W-2 field 8| 1234567.89 |
| `VerificationCode` | Number |W-2 verification code. IRS W-2 field 9| 1234567.89 |
| `DependentCareBenefits` | Number | Dependent care benefits amount in USD. IRS W-2 field 10| 1234567.89 |
| `NonQualifiedPlans` | Number | Non qualified plans amount in USD. IRS W-2 field 11| 1234567.89 |
| `IsStatutoryEmployee` |String| Part of IRS W-2 field 13. Can be 'true' or 'false'| true |
| `IsRetirementPlan` |String| Part of IRS W-2 field 13. Can be 'true' or 'false'| true |
| `IsThirdPartySickPay` |String| Part of IRS W-2 field 13. Can be 'true' or 'false'| true |
| `Other` | String | Content of IRS W-2 field 14| SICK LV WAGES SBJT TO $511/DAY LIMIT 1356 |
| `StateTaxInfos` | Array | State tax-related information. content of IRS W-2 field 15 to 17| |
| `LocaleTaxInfos` | Array |Local tax-related information. Content of IRS W-2 field 18 to 20| |

## Field extraction 1098

The following are the fields extracted from a 1098 tax form in the JSON output response. The 1098-T and 1098-E forms are also supported. 

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| TaxYear | Number | Form tax year| 2021 |
| Borrower | Object | An object that contains the borrower's TIN, Name, Address, and AccountNumber | |
| Lender | Object | An object that contains the lender's TIN, Name, Address, and Telephone| |
| MortgageInterest |Number| Mortgage Interest amount received from  payer(s)/borrower(s) (box 1)| 1,234,567.89
|OutstandingMortgagePrincipal |Number| Outstanding mortgage principal (box 2) |1,234,567.89|
| MortgageOriginationDate |Date| Origination date of the mortgage (box 3) |2022-01-01|
| OverpaidInterestRefund |Number| Refund amount of overpaid interest (box 4)| 1,234,567.89
| MortgageInsurancePremium |Number| Mortgage insurance premium amount (box 5) | 1,234,567.89
| PointsPaid |Number| Points paid on purchase of principal residence (Box 6)| 1,234,567.89
| IsPropertyAddressSameAsBorrower |String| Is the address of the property securing the mortgage the same as the payer's/borrower's mailing address (box 7)| true|
| PropertyAddress |String| Address or description of the property securing the mortgage (box 8) | 123 Main St., Redmond WA 98052 |
| MortgagedPropertiesCount |Number| Number of mortgaged properties (box 9)| 1|
| Other |String| Additional information to report to payer (box 10)| |
| RealEstateTax |Number|Real estate tax (box 1)| 1,234,567.89|
| AdditionalAssessment |String| Added assessments made on the property  (box 10)| 1,234,567.89|
| MortgageAcquisitionDate |date | Mortgage acquisition date (box 11)| 2022-01-01|

## Field extraction 1099-NEC

The following are the fields extracted from a 1099-nec tax form in the JSON output response. The other variations of 1099 are also supported. 

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| TaxYear | String | Tax Year extracted from Form 1099-NEC.| 2021 |
| Payer | Object | An object that contains the payers's TIN, Name, Address, and PhoneNumber | |
| Recipient | Object | An object that contains the recipient's TIN, Name, Address, and AccountNumber| |
| Box1 |number|Box 1 extracted from Form 1099-NEC.| 123456 |
| Box2 |boolean|Box 2 extracted from Form 1099-NEC.| true |
| Box4 |number|Box 4 extracted from Form 1099-NEC.| 123456 |
| StateTaxesWithheld |array| State Taxes Withheld extracted from Form 1099-NEC (boxes 5,6, and 7)| |

The tax documents key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
