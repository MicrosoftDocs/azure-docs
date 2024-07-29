---
title: US Tax document data extraction – Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Automate US tax document data extraction with Document Intelligence's US tax document models.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 05/23/2024
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
* 1040 and variations (Schedule 1, Schedule 2, Schedule 3, Schedule 8812, Schedule A, Schedule B, Schedule C, Schedule D, Schedule E, Schedule `EIC`, Schedule F, Schedule H, Schedule J, Schedule R, Schedule SE, and Schedule Senior)

## Automated tax document processing

Automated tax document processing is the process of extracting key fields from tax documents. Historically, tax documents were processed manually. This model allows for the easy automation of tax scenarios.

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2023-10-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-02-29-preview&preserve-view=true)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T</br>&bullet; prebuilt-tax.us.1099A</br>&bullet; prebuilt-tax.us.1099B</br>&bullet; prebuilt-tax.us.1099C</br>&bullet; prebuilt-tax.us.1099CAP</br>&bullet; prebuilt-tax.us.1099DIV</br>&bullet; prebuilt-tax.us.1099G</br>&bullet; prebuilt-tax.us.1099H</br>&bullet; prebuilt-tax.us.1099INT</br>&bullet; prebuilt-tax.us.1099K</br>&bullet; prebuilt-tax.us.1099LS</br>&bullet; prebuilt-tax.us.1099LTC</br>&bullet; prebuilt-tax.us.1099MISC</br>&bullet; prebuilt-tax.us.1099NEC</br>&bullet; prebuilt-tax.us.1099OID</br>&bullet; prebuilt-tax.us.1099PATR</br>&bullet; prebuilt-tax.us.1099Q</br>&bullet; prebuilt-tax.us.1099QA</br>&bullet; prebuilt-tax.us.1099R</br>&bullet; prebuilt-tax.us.1099S</br>&bullet; prebuilt-tax.us.1099SA</br>&bullet; prebuilt-tax.us.1099SB</br>&bullet; prebuilt-tax.us.1040</br>&bullet; prebuilt-tax.us.1040Schedule1</br>&bullet; prebuilt-tax.us.1040Schedule2</br>&bullet; prebuilt-tax.us.1040Schedule3</br>&bullet; prebuilt-tax.us.1040Schedule8812</br>&bullet; prebuilt-tax.us.1040ScheduleA</br>&bullet; prebuilt-tax.us.1040ScheduleB</br>&bullet; prebuilt-tax.us.1040ScheduleC</br>&bullet; prebuilt-tax.us.1040ScheduleD</br>&bullet; prebuilt-tax.us.1040ScheduleE</br>&bullet; prebuilt-tax.us.1040ScheduleEIC</br>&bullet; prebuilt-tax.us.1040ScheduleF</br>&bullet; prebuilt-tax.us.1040ScheduleH</br>&bullet; prebuilt-tax.us.1040ScheduleJ</br>&bullet; prebuilt-tax.us.1040ScheduleR</br>&bullet; prebuilt-tax.us.1040ScheduleSE</br>&bullet; prebuilt-tax.us.1040Senior**|
::: moniker-end

::: moniker range="doc-intel-3.1.0"

Document Intelligence v3.1 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T**|
::: moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-v3.0%20(2022-08-31)&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try tax document data extraction

See how data, including customer information, vendor details, and line items, is extracted from invoices. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

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

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction W-2

The following are the fields extracted from a W-2 tax form in the JSON output response.

::: moniker range="doc-intel-3.1.0"

> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Prebuilt_model/sample_analyze_tax_us_w2.py)

::: moniker-end

::: moniker range="doc-intel-4.0.0"

> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_tax_us_w2.py)

::: moniker-end

|Name| Type | Description | Example output |dependents
|:-----|:----|:----|:---:|
| `W-2FormVariant`| String | IR W-2 Form variant. This field can have the one of the following values: `W-2`, `W-2AS`, `W-2CM`, `W-2GU`, or `W-2VI`| W-2 |
| `TaxYear` | Number | Form tax year| 2021 |
| `W2Copy` | String | W-2 tax copy version along with printed instruction related to this copy| Copy A—For Social Security Administration |
| `Employee`| object | Object that contains social security number, name, and address| |
| `ControlNumber` | string | W-2 control number. IRS W-2 field d| 0AB12 D345 7890 |
| `Employer` | Object | Object that contains employer identification number, name, and address|  |
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
| `IsStatutoryEmployee` |String| Part of IRS W-2 field 13. Can be true or false| true |
| `IsRetirementPlan` |String| Part of IRS W-2 field 13. Can be true or false| true |
| `IsThirdPartySickPay` |String| Part of IRS W-2 field 13. Can be true or false| true |
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
| MortgageInterest |Number| Mortgage Interest amount received from  payers/borrower(s) (box 1)| 1,234,567.89
|OutstandingMortgagePrincipal |Number| Outstanding mortgage principal (box 2) |1,234,567.89|
| MortgageOriginationDate |Date| Origination date of the mortgage (box 3) |2022-01-01|
| OverpaidInterestRefund |Number| Refund amount of overpaid interest (box 4)| 1,234,567.89|
| MortgageInsurancePremium |Number| Mortgage insurance premium amount (box 5) | 1,234,567.89|
| PointsPaid |Number| Points paid on purchase of principal residence (Box 6)| 1,234,567.89|
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
| `TaxYear` | String | Tax Year extracted from Form 1099-NEC.| 2021 |
| `Payer` | Object | An object that contains the payer's TIN, Name, Address, and PhoneNumber | |
| `Recipient` | Object | An object that contains the recipient's TIN, Name, Address, and AccountNumber| |
| `Box1` |number|Box 1 extracted from Form 1099-NEC.| 123456 |
| `Box2` |boolean|Box 2 extracted from Form 1099-NEC.| true |
| `Box4` |number|Box 4 extracted from Form 1099-NEC.| 123456 |
| `StateTaxesWithheld` |array| State Taxes Withheld extracted from Form 1099-NEC (boxes 5, 6, and 7)| |

## Field extraction 1040 tax form

The following are the fields extracted from a 1040 tax form in the JSON output response. The other variations of 1040 are also supported.

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| `TaxPayer` | Object | An object that contains the taxpayer's information such as SSN, Last Name, and Address | |
| `Spouse` | Object | An object that contains the spouse's information such as SSN, surname, and first name and initials Name| |
| `Dependents` |array|An array that contains a list of dependents including information such as Name, SSN, and Credit Type |  |
| `ThirdPartyDesignee` |object|An object that contains information about the third-party designee|  |
| `SignatureDetails` |object|An object that contains information about the signee such as phone numbers and emails|  |
| `PaidPreparer` |object|An object that contains information about the preparer. | |
| `FillingStatus` | String |Value can be one of noSelection, single, marriedFilingJointly, marriedFillingSeparately, headOfHousehold, qualifyingSurvivingSpouse or multiSelection.| single |
| `FilingStatusDetails` |object|An object that contains information about the filing status. | |
| `NameOfSpouseOrQualifyingPerson` | String |Name Of Spouse Or Qualifying Person extracted from Form 1040.| John Smith |
| `PresidentialElectionCampaign` | String |Value can be one of noSelection, taxpayer, spouse, or multiSelection.| Taxpayer |
| `PresidentialElectionCampaignDetails` | object | An object that contains details about the presidential election campaign. |  |
| `DigitalAssets` | String |Value can be one of noSelection, yes, no or multiSelection.| yes |
| `DigitalAssetsDetails` | object | An object that contains details about the digital assets. |  |
| `ClaimStatus` | String |Value can be one of noSelection, taxpayerAsDependent, spouseAsDependent, spouseItemizesSeparatelyOrDualStatusAlien or multiSelection.| taxpayerAsDependent |
| `ClaimStatusDetails` | object | An object that contains details about the claim status. |  |
| `TaxpayerAgeBlindness` | String |Value can be one of noSelection, `above64`, blind or multiSelection.| above64 |
| `TaxPayerAgeBlindnessDetails` | object | An object that contains details about the taxpayer age blindness. |  |
| `SpouseAgeBlindness` | String | Value can be one of noSelection, `above64`, blind or multiSelection. | above64 |
| `TaxPayerAgeBlindnessDetails` | object | An object that contains details about the spouse age blindness. |  |
| `MoreThanFourDependents` | boolean | More Than Four Dependents extracted from Form 1040. | true |
| `Box1a` | number | Box `1a` extracted from 1040. | 123456 |
|Based on the provided JSON structure and converting it into the same table format as requested, the result is as follows:||||
| `Box1b`         | number  | Box `1b` extracted from 1040.                      | 123456  |
| `Box1c`         | number  | Box `1c` extracted from 1040.                      | 123456  |
| `Box1d`         | number  | Box `1d` extracted from 1040.                      | 123456  |
| `Box1e`         | number  | Box `1e` extracted from 1040.                      | 123456  |
| `Box1f`         | number  | Box `1f` extracted from 1040.                      | 123456  |
| `Box1g`         | number  | Box `1g` extracted from 1040.                      | 123456  |
| `Box1h`         | number  | Box `1h` extracted from 1040.                      | 123456  |
| `Box1i`         | number  | Box `1i` extracted from 1040.                      | 123456  |
| `Box1z`         | number  | Box `1z` extracted from 1040.                      | 123456  |
| `Box2a`         | number  | Box `2a` extracted from 1040.                      | 123456  |
| `Box2b`         | number  | Box `2b` extracted from 1040.                      | 123456  |
| `Box3a`         | number  | Box `3a` extracted from 1040.                      | 123456  |
| `Box3b`         | number  | Box `3b` extracted from 1040.                      | 123456  |
| `Box4a`         | number  | Box `4a` extracted from 1040.                      | 123456  |
| `Box4b`         | number  | Box `4b` extracted from 1040.                      | 123456  |
| `Box5a`         | number  | Box `5a` extracted from 1040.                      | 123456  |
| `Box5b`         | number  | Box `5b` extracted from 1040.                      | 123456  |
| `Box6a`         | number  | Box `6a` extracted from 1040.                      | 123456  |
| `Box6b`         | number  | Box `6b` extracted from 1040.                      | 123456  |
| `Box6cCheckbox` | boolean | Box `6c` Checkbox extracted from 1040.              | true    |
| `Box7Checkbox`  | boolean | Box 7 Checkbox extracted from 1040.               | true    |
| `Box7`          | number  | Box 7 extracted from 1040.                       | 123456  |
| `Box8`          | number  | Box 8 extracted from 1040.                       | 123456  |
| `Box9`          | number  | Box 9 extracted from 1040.                       | 123456  |
| `Box10`         | number  | Box 10 extracted from 1040.                      | 123456  |
| `Box11`         | number  | Box 11 extracted from 1040.                      | 123456  |
| `Box12`         | number  | Box 12 extracted from 1040.                      | 123456  |
| `Box13`         | number  | Box 13 extracted from 1040.                      | 123456  |
| `Box14`         | number  | Box 14 extracted from 1040.                      | 123456  |
| `Box15`         | number  | Box 15 extracted from 1040.                      | 123456  |
| `Box16FromForm` | string  | Value can be one of noSelection, 8814, 4972, other or multiSelection. | 8814  |
| `Box16FromFormDetails` | object  | Object that contains details about the Box 16 |  |
| `Box16OtherFormNumber` | string  | Box 16 Other Form Number extracted from 1040.       | 8888    |
| `Box16`              | number  | Box 16 extracted from 1040.                        | 123456  |
| `Box17`              | number  | Box 17 extracted from 1040.                        | 123456  |
| `Box18`              | number  | Box 18 extracted from 1040.                        | 123456  |
| `Box19`              | number  | Box 19 extracted from 1040.                        | 123456  |
| `Box20`              | number  | Box 20 extracted from 1040.                        | 123456  |
| `Box21`              | number  | Box 21 extracted from 1040.                        | 123456  |
| `Box22`              | number  | Box 22 extracted from 1040.                        | 123456  |
| `Box23`              | number  | Box 23 extracted from 1040.                        | 123456  |
| `Box24`              | number  | Box 24 extracted from 1040.                        | 123456  |
| `Box25a`             | number  | Box `25a` extracted from 1040.                       | 123456  |
| `Box25b`             | number  | Box `25b` extracted from 1040.                       | 123456  |
| `Box25c`             | number  | Box `25c` extracted from 1040.                       | 123456  |
| `Box25d`             | number  | Box `25d` extracted from 1040.                       | 123456  |
| `Box26`              | number  | Box 26 extracted from 1040.                        | 123456  |
| `Box27`              | number  | Box 27 extracted from 1040.                        | 123456  |
| `Box28`              | number  | Box 28 extracted from 1040.                        | 123456  |
| `Box29`              | number  | Box 29 extracted from 1040.                        | 123456  |
| `Box31`              | number  | Box 31 extracted from 1040.                        | 123456  |
| `Box32`              | number  | Box 32 extracted from 1040.                        | 123456  |
| `Box33`              | number  | Box 33 extracted from 1040.                        | 123456  |
| `Box34`              | number  | Box 34 extracted from 1040.                        | 123456  |
| `Box35Checkbox`      | boolean | Box 35 Checkbox extracted from 1040.                | true    |
| `Box35a`             | number  | Box `35a` extracted from 1040.                       | 123456  |
| `Box35b`             | number  | Box `35b` extracted from 1040.                       | 123456  |
| `Box35c`             | string  | Value can be one of noSelection, checking, savings, or multiSelection. | checking |
| `Box35cDetails` | object  | Object that contains details about Box `35c` |  |
| `Box35d`                     | number  | Box `35d` extracted from 1040.                   | 123456  |
| `Box36`                      | number  | Box 36 extracted from 1040.                    | 123456  |
| `Box37`                      | number  | Box 37 extracted from 1040.                    | 123456  |
| `Box38`                      | number  | Box 38 extracted from 1040.                    | 123456  |
| `HasAssignedThirdPartyDesignee` | string  | Value can be one of noSelection, yes, no or multiSelection. | yes  |
| `HasAssignedThirdPartyDesigneeDetails` | object  | Object that contains information on what was selected for the assigned third-party designee |  |

The tax documents key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker range="doc-intel-4.0.0"
* [Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/main/Python(v4.0)/Prebuilt_model)
:::moniker-end

::: moniker range="doc-intel-3.1.0"
* [Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/v3.1(2023-07-31-GA)/Python(v3.1)/Prebuilt_model)
:::moniker-end
