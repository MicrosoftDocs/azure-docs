---
title: Document Intelligence (formerly Form Recognizer) US tax documents data extraction
titleSuffix: Azure AI services
description: Automate US tax document data extraction with Document Intelligence US tax document models.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 08/07/2024
ms.author: lajanuar
monikerRange: ">=doc-intel-3.0.0"
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

* `Unified tax US`
* W-2
* 1098
* 1098-E
* 1098-T
* 1099 and variations (A, B, C, CAP, `Combo`, DIV, G, H, INT, K, LS, LTC, MISC,  NEC, OID, PATR, Q, QA, R, S, SA, SB​)
* 1040 and variations (`Schedule 1, Schedule 2, Schedule 3, Schedule 8812, Schedule A, Schedule B, Schedule C, Schedule D, Schedule E, Schedule EIC, Schedule F, Schedule H, Schedule J, Schedule R, Schedule SE, and Schedule Senior`)

## Automated tax document processing

Automated tax document processing is the process of extracting key fields from tax documents. Historically, tax documents were processed manually. This model allows for the easy automation of tax scenarios.

## Unified Tax US

This preview introduces the `Unified US Tax` prebuilt model, which automatically detects and extracts data from `W2`, `1098`, 1`040`, and `1099`  tax forms in submitted documents. These documents can be composed of many tax or non-tax-related documents. The model only processes the forms it supports.

:::image type="content" source="media/us-unified-tax-diagram.png" alt-text="Screenshot of a Unified Tax processing diagram.":::

:::image type="content" source="media/us-unified-tax.png" alt-text="Screenshot of unified tax model document processing.":::

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-07-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**US tax form models**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**&bullet; prebuilt-tax.us</br>&bullet; prebuilt-tax.us.W-2</br>&bullet; prebuilt-tax.us.1098</br>&bullet; prebuilt-tax.us.1098E</br>&bullet; prebuilt-tax.us.1098T</br>&bullet; prebuilt-tax.us.1099A</br>&bullet; prebuilt-tax.us.1099B</br>&bullet; prebuilt-tax.us.1099C</br>&bullet; prebuilt-tax.us.1099CAP</br>&bullet; prebuilt-tax.us.1099Combo</br>&bullet; prebuilt-tax.us.1099DIV</br>&bullet; prebuilt-tax.us.1099G</br>&bullet; prebuilt-tax.us.1099H</br>&bullet; prebuilt-tax.us.1099INT</br>&bullet; prebuilt-tax.us.1099K</br>&bullet; prebuilt-tax.us.1099LS</br>&bullet; prebuilt-tax.us.1099LTC</br>&bullet; prebuilt-tax.us.1099MISC</br>&bullet; prebuilt-tax.us.1099NEC</br>&bullet; prebuilt-tax.us.1099OID</br>&bullet; prebuilt-tax.us.1099PATR</br>&bullet; prebuilt-tax.us.1099Q</br>&bullet; prebuilt-tax.us.1099QA</br>&bullet; prebuilt-tax.us.1099R</br>&bullet; prebuilt-tax.us.1099S</br>&bullet; prebuilt-tax.us.1099SA</br>&bullet; prebuilt-tax.us.1099SB</br>&bullet; prebuilt-tax.us.1040</br>&bullet; prebuilt-tax.us.1040Schedule1</br>&bullet; prebuilt-tax.us.1040Schedule2</br>&bullet; prebuilt-tax.us.1040Schedule3</br>&bullet; prebuilt-tax.us.1040Schedule8812</br>&bullet; prebuilt-tax.us.1040ScheduleA</br>&bullet; prebuilt-tax.us.1040ScheduleB</br>&bullet; prebuilt-tax.us.1040ScheduleC</br>&bullet; prebuilt-tax.us.1040ScheduleD</br>&bullet; prebuilt-tax.us.1040ScheduleE</br>&bullet; prebuilt-tax.us.1040ScheduleEIC</br>&bullet; prebuilt-tax.us.1040ScheduleF</br>&bullet; prebuilt-tax.us.1040ScheduleH</br>&bullet; prebuilt-tax.us.1040ScheduleJ</br>&bullet; prebuilt-tax.us.1040ScheduleR</br>&bullet; prebuilt-tax.us.1040ScheduleSE</br>&bullet; prebuilt-tax.us.1040Senior**|
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

| Name   | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`W2FormVariant`|`string`|IRS W2 tax form variant. This field can have the one of the following values: `W-2`, `W-2AS`, `W-2CM`, `W-2GU`, or `W-2VI`|W-2|
|`TaxYear`|`string`|Form tax year|2021|
|`W2Copy`|`string`|W2 tax form copy version along with printed instruction related to this copy|Copy A—For Social Security Administration|
|`Employee`|`object`|Object that contains social security number, name, and address||
|`Employee.SocialSecurityNumber`|`string`|Employee social security number. IRS W2 tax field `A`, for example, `123-45-6789`|123-45-6789|
|`Employee.Name`|`string`|Employee first name, middle full/initials name, surname, and suffix. IRS W2 tax field e|John Contoso|
|`Employee.Address`|`address`|Employee address. Part of IRS W2 tax field f|123 Microsoft way, Redmond Washington, 98123|
|`ControlNumber`|`string`|W2 tax form control number. IRS W2 tax field d|0AB12 D345 7890|
|`Employer`|`object`|Object that contains employer identification number, name, and address||
|`Employer.IdNumber`|`string`|Employer identification number. IRS W2 tax field b|12-3456789|
|`Employer.Name`|`string`|Employer name. Part of IRS W2 tax field c|Fabrikam|
|`Employer.Address`|`address`|Employer address. Part of IRS W2 tax field c|321 Microsoft way, Redmond Washington, 98123|
|`WagesTipsAndOtherCompensation`|`number`|Wages, tips, and other compensation amount in USD. IRS W2 tax field 1|1234567.89|
|`FederalIncomeTaxWithheld`|`number`|Federal income tax withheld amount in USD. IRS W2 tax field 2|1234567.89|
|`SocialSecurityWages`|`number`|Social security wages amount in USD. IRS W2 tax field 3|1234567.89|
|`SocialSecurityTaxWithheld`|`number`|Social security tax withheld amount in USD. IRS W2 tax field 4|1234567.89|
|`MedicareWagesAndTips`|`number`|Medicare wages and tips amount in USD. IRS W2 tax field 5|1234567.89|
|`MedicareTaxWithheld`|`number`|Medicare tax withheld amount in USD. IRS W2 tax field 6|1234567.89|
|`SocialSecurityTips`|`number`|Social security tips amount in USD. IRS W2 tax field 7|1234567.89|
|`AllocatedTips`|`number`|Allocated tips in USD. IRS W2 tax field 8|1234567.89|
|`VerificationCode`|`string`|W2 tax form verification code. IRS W2 tax field 9|AB123456|
|`DependentCareBenefits`|`number`|Dependent care benefits amount in USD. IRS W2 tax field 10|1234567.89|
|`NonQualifiedPlans`|`number`|Nonqualified plans amount in USD. IRS W2 tax field 11|1234567.89|
|`AdditionalInfo`|`array`|Array holding W2 Codes. IRS W2 tax field 12||
|`AdditionalInfo.*`|`object`|||
|`AdditionalInfo.*.LetterCode`|`string`|For more information about on IRS W2 box 12 letter code, *see* [IRS letter codes](https://www.irs.gov/pub/irs-pdf/iw2w3.pdf)|A|
|`AdditionalInfo.*.Amount`|`number`|Code amount in USD|1234567.89|
|`IsStatutoryEmployee`|`string`|Part of IRS W2 tax field 13. Can be `true` or `false`|true|
|`IsRetirementPlan`|`string`|Part of IRS W2 tax field 13. Can be `true` or `false`|true|
|`IsThirdPartySickPay`|`string`|Part of IRS W2 tax field 13. Can be `true` or `false`|true|
|`Other`|`string`|Content of IRS W2 tax field 14|SICK LV WAGES SBJT TO $511/DAY LIMIT 1356|
|`StateTaxInfos`|`array`|State tax-related information. content of IRS W2 tax field 15 to 17||
|`StateTaxInfos.*`|`object`|||
|`StateTaxInfos.*.State`|`string`|Two letter state code. Part of IRS W2 tax field 15|`WA`|
|`StateTaxInfos.*.EmployerStateIdNumber`|`string`|Employer state ID number. Part of IRS W2 tax field 15|1234567|
|`StateTaxInfos.*.StateWagesTipsEtc`|`number`|State wages, tips, amount in USD. IRS W2 tax field 16|1234567.89|
|`StateTaxInfos.*.StateIncomeTax`|`number`|State income tax amount in USD. IRS W2 tax field 17|1234567.89|
|`LocalTaxInfos`|`array`|Local tax-related information. Content of IRS W2 tax field 18 to 20||
|`LocalTaxInfos.*`|`object`|||
|`LocalTaxInfos.*.LocalWagesTipsEtc`|`number`|Local wages, tips, amount in USD. Part of IRS W2 tax field 18|1234567.89|
|`LocalTaxInfos.*.LocalIncomeTax`|`number`|Local income tax amount in USD. Part of IRS W2 tax field 19|1234567.89|
|`LocalTaxInfos.*.LocalityName`|`string`|Locality name. Part of IRS W2 tax field 20|Redmond|

::: moniker range="doc-intel-3.1.0"

> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/v3.1(2023-07-31-GA)/Python(v3.1)/Prebuilt_model/sample_analyze_tax_us_w2.py)

::: moniker-end

::: moniker range="doc-intel-4.0.0"

> [!div class="nextstepaction"]
> [View samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/Python(v4.0)/Prebuilt_model/sample_analyze_tax_us_w2.py)

::: moniker-end

## Field extraction 1098

The following are the fields extracted from a 1098 tax form in the JSON output response. The 1098-T and 1098-E forms are also supported.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`TaxYear`|`number`|Form tax year|2021|
|`Borrower`|`object`|An object that contains the borrower TIN, Name, Address, and AccountNumber||
|`Borrower.TIN`|`string`|Borrower tax identification number|123-45-6789|
|`Borrower.Name`|`string`|Borrower full name as written on the form|John Smith|
|`Borrower.Address`|`address`|Borrower address|123 Microsoft Way, Redmond Washington 98052|
|`Borrower.AccountNumber`|`string`|Borrower account number|55123456789|
|`Lender`|`object`|An object that contains the lender TIN, Name, Address, and Telephone||
|`Lender.TIN`|`string`|Lender tax identification number|12-3456789|
|`Lender.Name`|`string`|Lender name|Woodgrove Bank|
|`Lender.Address`|`address`|Lender address|321 Microsoft Way, Redmond Washington 98052|
|`Lender.Telephone`|`string`|Lender telephone number|(987) 654-3210|
|`MortgageInterest`|`number`|Mortgage interest amount received from payers/borrower(s) (box 1)|1,234,567.89|
|`OutstandingMortgagePrincipal`|`number`|Outstanding mortgage principal (box 2)|1,234,567.89|
|`MortgageOriginationDate`|`date`|Origination date of the mortgage (box 3)|2022-01-01|
|`OverpaidInterestRefund`|`number`|Refund amount of overpaid interest (box 4)|1,234,567.89|
|`MortgageInsurancePremium`|`number`|Mortgage insurance premium amount (box 5)|1,234,567.89|
|`PointsPaid`|`number`|Points paid on purchase of principal residence (box 6)|1,234,567.89|
|`IsPropertyAddressSameAsBorrower`|`string`|Is the address of the property securing the mortgage the same as the payer / borrower mailing address (box 7)|true|
|`PropertyAddress`|`string`|Address or description of the property securing the mortgage (box 8)|123 Main St., Redmond Washington 98052|
|`MortgagedPropertiesCount`|`number`|Number of mortgaged properties (box 9)|1|
|`Other`|`string`|Additional information to report to payer (box 10)||
|`RealEstateTax`|`number`|Real estate tax (box 10)|1,234,567.89|
|`AdditionalAssessment`|`string`|Other assessments made on the property (box 10)|Structural damage observed|
|`MortgageAcquisitionDate`|`date`|Mortgage acquisition date (box 11)|2022-01-01|
|`IsCorrected`|`string`|Indicates whether form is a corrective filing.|true|

## Field extraction 1099-NEC

The following are the fields extracted from a 1099-nec tax form in the JSON output response. The other variations of 1099 are also supported.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`TaxYear`|`string`|Tax Year extracted from 1099-NEC.|2022|
|`Payer`|`object`| An object that contains the payer TIN, Name, Address, and PhoneNumber||
|`Payer.TIN`|`string`|Payer tax identification number.|123-45-6789|
|`Payer.Name`|`string`|Payer full name as written on the form.|John Smith|
|`Payer.Address`|`address`|Payer address.|123 Microsoft Way, Redmond Washington 98052|
|`Payer.PhoneNumber`|`phoneNumber`|Payer Phone Number.|+19876543210|
|`Recipient`|`object`|An object that contains the recipient TIN, Name, Address, and AccountNumber||
|`Recipient.TIN`|`string`|Recipient tax identification number.|123-45-6789|
|`Recipient.Name`|`string`|Recipient full name as written on the form.|John Smith|
|`Recipient.Address`|`address`|Recipient address.|123 Microsoft Way, Redmond Washington 98052|
|`Recipient.AccountNumber`|`string`|Recipient account number.|55123456789|
|`Box1`|`number`|Box 1 extracted from 1099-NEC.|123456|
|`Box2`|`boolean`|Box 2 extracted from 1099-NEC.|:selected:|
|`Box4`|`number`|Box 4 extracted from 1099-NEC.|123456|
|`StateTaxesWithheld`|`array`|State Taxes Withheld extracted from 1099-NEC||
|`StateTaxesWithheld.*`|`object`|An object that contains State Taxes details||
|`StateTaxesWithheld.*.Box5`|`number`|Box 5 extracted from 1099-NEC.|123456|
|`StateTaxesWithheld.*.Box6`|`string`|Box 6 extracted from 1099-NEC.|12-3456789|
|`StateTaxesWithheld.*.Box7`|`number`|Box 7 extracted from 1099-NEC.|123456|

## Field extraction 1099-Combo

The following are the fields extracted from a 1099-Combo tax form in the JSON output response. The other variations of 1099 are also supported:

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`TaxYear`|`string`|Tax Year extracted from 1099-COMBO.|2022|
|`Payer`|`object`|An object that contains the payer TIN, Name, Address, and PhoneNumber||
|`Payer.TIN`|`string`|Payer tax identification number.|123-45-6789|
|`Payer.Name`|`string`|Payer full name as written on the form.|John Smith|
|`Payer.Address`|`address`|Payer address.|123 Microsoft Way, Redmond Washington 98052|
|`Payer.AccountNumber`|`phoneNumber`|Payer Phone Number.|+19876543210|
|`Recipient`|`object`|An object that contains the recipient TIN, Name, Address, and AccountNumber||
|`Recipient.TIN`|`string`|Recipient tax identification number.|123-45-6789|
|`Recipient.Name`|`string`|Recipient full name as written on the form.|John Smith|
|`Recipient.Address`|`address`|Recipient address.|123 Microsoft Way, Redmond Washington 98052|
|`Recipient.AccountNumber`|`string`|Recipient account number.|55123456789|
|`1099-B`|`object`|||
|`1099-B.Summary`|`array`|List of transactions summary reported in `1099-B`||
|`1099-B.Summary.*`|`object`|||
|`1099-B.Summary.*.Category`|`string`|Can be one for the following categories: `shortTermBasisReportedToIRS`, `shortTermBasisNotReportedToIRS`, `shortTerm1099BNotReceived`, `longTermBasisReportedToIRS`, `longTermBasisNotReportedToIRS`, `longTerm1099BNotReceived`, `underterminedTermBasisReportedToIRS`, `undertinedTermBasisNotReportedToIRS`, `undertined1099BNotReceived`.|shortTermBasisReportedToIRS|
|`1099-B.Summary.*.TotalProceeds`|`number`|Total proceeds summary extracted from `1099-B`|123456|
|`1099-B.Summary.*.TotalCostBasis`|`string`|Total cost basis summary extracted from `1099-B`|123456|
|`1099-B.Summary.*.TotalMarketDiscount`|`string`|Total market discount summary extracted from `1099-B`|123456|
|`1099-B.Summary.*.TotalWashSales`|`string`|Total wash sales summary extracted from `1099-B`|123456|
|`1099-B.Summary.*.TotalRealizedGainOrLoss`|`string`|Total realized gain or loss summary extracted from `1099-B`|123456|
|`1099-B.Summary.*.TotalFederalIncomeTaxWithheld`|`string`|Total federal income tax withheld summary extracted from `1099-B`|123456|
|`1099-B.Transactions`|`array`|List of transactions reported in the `1099-B` ||
|`1099-B.Transactions.*`|`object`|||
|`1099-B.Transactions.*.CusipNumber`|`string`|`Cusip` Number extracted from `1099-B`|981276345|
|`1099-B.Transactions.*.IsFactaFilingRequired`|`boolean`|Is Facta Filing Required extracted from `1099-B`|:selected:|
|`1099-B.Transactions.*.ApplicableForm8949Checkbox`|`string`|Applicable Form 8949 Checkbox extracted from `1099-B`|A|
|`1099-B.Transactions.*.BasisStatus`|`selectionGroup`|Value is a list containing at least one of the following codes: `basisReportedToIRS`, `basisNotReportedToIRS`, `1099BNotReceived`.|basisReportedToIRS:unselected: basisNotReportedToIRS:unselected: undetermined:unselected:|
|`1099-B.Transactions.*.Box1a`|`string`|Box `1a` extracted from `1099-B`|100 sh. XYZ Co.|
|`1099-B.Transactions.*.Box1b`|`date`|Box `1b` extracted from `1099-B`|2022-12-31|
|`1099-B.Transactions.*.Box1c`|`date`|Box `1c` extracted from `1099-B`|2022-12-31|
|`1099-B.Transactions.*.Box1d`|`number`|Box `1d` extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box1e`|`number`|Box `1e` extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box1f`|`number`|Box `1f` extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box1g`|`number`|Box `1g` extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box2`|`selectionGroup`|Value is a list containing at least one of the following codes: `shortTermGainOrLoss`, `longTermGainOrLoss`, `ordinary`, `undertermined`.|shortTermGainOrLoss:unselected: longTermGainOrLoss:unselected: ordinary:unselected:|
|`1099-B.Transactions.*.Box3`|`selectionGroup`|Value is a list containing at least one of the following codes: `collectible`, `qof`.|collectible:unselected: `qof`:unselected:|
|`1099-B.Transactions.*.Box4`|`number`|Box 4 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box5`|`boolean`|Box 5 extracted from `1099-B`|:selected:|
|`1099-B.Transactions.*.Box6`|`selectionGroup`|Value is a list containing at least one of the following codes: `grossProceeds`, `netProceeds`.|grossProceeds:unselected: netProceeds:unselected:|
|`1099-B.Transactions.*.Box7`|`boolean`|Box 7 extracted from `1099-B`|:selected:|
|`1099-B.Transactions.*.Box8`|`number`|Box 8 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box9`|`number`|Box 9 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box10`|`number`|Box 10 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box11`|`number`|Box 11 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.Box12`|`boolean`|Box 12 extracted from `1099-B`|:selected:|
|`1099-B.Transactions.*.Box13`|`number`|Box 13 extracted from `1099-B`|123456|
|`1099-B.Transactions.*.StateTaxesWithheld`|`array`|State Taxes Withheld extracted from `1099-B` ||
|`1099-B.Transactions.*.StateTaxesWithheld.*`|`object`|||
|`1099-B.Transactions.*.StateTaxesWithheld.*.Box14`|`string`|Box 14 extracted from `1099-B`|Washington|
|`1099-B.Transactions.*.StateTaxesWithheld.*.Box15`|`string`|Box 15 extracted from `1099-B`|12-3456789|
|`1099-B.Transactions.*.StateTaxesWithheld.*.Box16`|`number`|Box 16 extracted from `1099-B`|123456|
|`1099-DIV`|`object`|||
|`1099-DIV.Box1a`|`number`|Box 1a extracted from 1099-DIV.|123456|
|`1099-DIV.Box1b`|`number`|Box 1b extracted from 1099-DIV.|123456|
|`1099-DIV.Box2a`|`number`|Box 2a extracted from 1099-DIV.|123456|
|`1099-DIV.Box2b`|`number`|Box 2b extracted from 1099-DIV.|123456|
|`1099-DIV.Box2c`|`number`|Box 2c extracted from 1099-DIV.|123456|
|`1099-DIV.Box2d`|`number`|Box 2d extracted from 1099-DIV.|123456|
|`1099-DIV.Box2e`|`number`|Box 2e extracted from 1099-DIV.|123456|
|`1099-DIV.Box2f`|`number`|Box 2f extracted from 1099-DIV.|123456|
|`1099-DIV.Box3`|`number`|Box 3 extracted from 1099-DIV.|123456|
|`1099-DIV.Box4`|`number`|Box 4 extracted from 1099-DIV.|123456|
|`1099-DIV.Box5`|`number`|Box 5 extracted from 1099-DIV.|123456|
|`1099-DIV.Box6`|`number`|Box 6 extracted from 1099-DIV.|123456|
|`1099-DIV.Box7`|`number`|Box 7 extracted from 1099-DIV.|123456|
|`1099-DIV.Box8`|`string`|Box 8 extracted from 1099-DIV.|Foreign|
|`1099-DIV.Box9`|`number`|Box 9 extracted from 1099-DIV.|123456|
|`1099-DIV.Box10`|`number`|Box 10 extracted from 1099-DIV.|123456|
|`1099-DIV.Box11`|`boolean`|Box 11 extracted from 1099-DIV.|:selected:|
|`1099-DIV.Box12`|`number`|Box 12 extracted from 1099-DIV.|123456|
|`1099-DIV.Box13`|`number`|Box 13 extracted from 1099-DIV.|123456|
|`1099-DIV.StateTaxesWithheld`|`array`|State Taxes Withheld extracted from 1099-DIV||
|`1099-DIV.StateTaxesWithheld.*`|`object`|||
|`1099-DIV.StateTaxesWithheld.*.Box14`|`string`|Box 14 extracted from 1099-DIV.|Washington|
|`1099-DIV.StateTaxesWithheld.*.Box15`|`string`|Box 15 extracted from 1099-DIV.|12-3456789|
|`1099-DIV.StateTaxesWithheld.*.Box16`|`number`|Box 16 extracted from 1099-DIV.|123456|
|`1099-INT`|`object`|||
|`1099-INT.IsFactaFilingRequired`|`boolean`|Is Facta Filing Required extracted from 1099-INT|:selected:|
|`1099-INT.Box1`|`number`|Box 1 extracted from 1099-INT.|123456|
|`1099-INT.Box2`|`number`|Box 2 extracted from 1099-INT.|123456|
|`1099-INT.Box3`|`number`|Box 3 extracted from 1099-INT.|123456|
|`1099-INT.Box4`|`number`|Box 4 extracted from 1099-INT.|123456|
|`1099-INT.Box5`|`number`|Box 5 extracted from 1099-INT.|123456|
|`1099-INT.Box6`|`number`|Box 6 extracted from 1099-INT.|123456|
|`1099-INT.Box7`|`string`|Box 7 extracted from 1099-INT.|Foreign|
|`1099-INT.Box8`|`number`|Box 8 extracted from 1099-INT.|123456|
|`1099-INT.Box9`|`number`|Box 9 extracted from 1099-INT.|123456|
|`1099-INT.Box10`|`number`|Box 10 extracted from 1099-INT.|123456|
|`1099-INT.Box11`|`number`|Box 11 extracted from 1099-INT.|123456|
|`1099-INT.Box12`|`number`|Box 12 extracted from 1099-INT.|123456|
|`1099-INT.Box13`|`number`|Box 13 extracted from 1099-INT.|123456|
|`1099-INT.Box14`|`string`|Box 14 extracted from 1099-INT.|123456789|
|`1099-INT.StateTaxesWithheld`|`array`|State Taxes Withheld extracted from 1099-INT||
|`1099-INT.StateTaxesWithheld.*`|`object`|||
|`1099-INT.StateTaxesWithheld.*.Box15`|`string`|Box 15 extracted from 1099-INT.|Washington|
|`1099-INT.StateTaxesWithheld.*.Box16`|`string`|Box 16 extracted from 1099-INT.|12-3456789|
|`1099-INT.StateTaxesWithheld.*.Box17`|`number`|Box 17 extracted from 1099-INT.|123456|

## Field extraction 1040 tax form

The following are the fields extracted from a 1040 tax form in the JSON output response. The other variations of 1040 are also supported.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`TaxYear`|`string`|Tax Year extracted from Form 1040.|2022|
|`Taxpayer`|`object`|An object that contains the taxpayer information such as SSN, Last Name, and Address||
|`Taxpayer.SSN`|`string`|Taxpayer tax social security number.|123-45-6789|
|`Taxpayer.LastName`|`string`|Taxpayer surname as written on the form.|Smith|
|`Taxpayer.FirstNameAndInitials`|`string`|Taxpayer first name and middle initials as written on the form.|John T|
|`Taxpayer.Address`|`address`|Taxpayer address.|123 Main Street, Seattle Washington 98122|
|`Taxpayer.ForeignCountryName`|`string`|Taxpayer foreign country name.|Germany|
|`Taxpayer.ForeignProvinceStateOrCounty`|`string`|Taxpayer foreign province state or county name.|Hamburg|
|`Taxpayer.ForeignPostalCode`|`string`|Taxpayer foreign postal code.|20095|
|`Spouse`|`object`|An object that contains the spouse information such as SSN, surname, and first name and initials Name||
|`Spouse.SSN`|`string`|Spouse tax social security number.|123-45-6789|
|`Spouse.LastName`|`string`|Spouse surname as written on the form.|Smith|
|`Spouse.FirstNameAndInitials`|`string`|Spouse first name and middle initials as written on the form.|John T|
|`Dependents`|`array`|Dependents extracted from Form 1040||
|`Dependents.*`|`object`|An array that contains a list of dependents including information such as Name, SSN, and Credit Type||
|`Dependents.*.Name`|`string`|Dependent full name as written on the form.|John Smith|
|`Dependents.*.SSN`|`string`|Dependent tax social security number.|123-45-6789|
|`Dependents.*.RelationshipToFiler`|`string`|Dependent full name as written on the form.|John Smith|
|`Dependents.*.CreditType`|`selectionGroup`|Value is a list containing at least one of the following codes: `childTaxCredit`, `creditForOtherDependents`.|childTaxCredit: selected creditForOtherDependents:unselected:|
|`ThirdPartyDesignee`|`object`|An object that contains information about the third-party designee||
|`ThirdPartyDesignee.PhoneNumber`|`phoneNumber`|Third party designee phone number.|1-123-456-7890|
|`ThirdPartyDesignee.Name`|`string`|Third party designee name as written on the form.|John Smith|
|`ThirdPartyDesignee.PersonalIdentificationNumber`|`string`|Third party designee PIN.|123456|
|`SignatureDetails`|`object`|An object that contains information about the signee such as phone numbers and emails||
|`SignatureDetails.TaxpayerOccupation`|`string`|Taxpayer Occupation.|Software|
|`SignatureDetails.TaxpayerPIN`|`string`|Taxpayer PIN.|123456|
|`SignatureDetails.TaxpayerPhoneNumber`|`phoneNumber`|Taxpayer phone number.|1-123-456-7890|
|`SignatureDetails.TaxpayerEmail`|`string`|Taxpayer email.|`johnsmith@contoso.com`|
|`SignatureDetails.SpouseOccupation`|`string`|Spouse Occupation.|Software|
|`SignatureDetails.SpousePIN`|`string`|Spouse PIN.|123456|
|`PaidPreparer`|`object`|An object that contains information about the preparer.||
|`PaidPreparer.PreparerName`|`date`|Preparer name.|John Smith|
|`PaidPreparer.PreparerPTIN`|`string`|Preparer PIN.|123456|
|`PaidPreparer.IsPreparerSelfEmployed`|`boolean`|Is preparer self-employed|:selected:|
|`PaidPreparer.PreparerFirmName`|`string`|Taxpayer firm name.|Contoso|
|`PaidPreparer.PreparerFirmPhoneNumber`|`phoneNumber`|Preparer firm phone number|1-123-456-7890|
|`PaidPreparer.PreparerFirmAddress`|`address`|Prepare Firm Address.|123 First street, Seattle Washington 98001|
|`PaidPreparer.PreparerFirmEIN`|`string`|Prepare Firm EIN.|98-7654321|
|`FilingStatus`|`selectionGroup`|Value is a list containing at least one of the following codes: `single`, `marriedFilingJointly`, `marriedFillingSeparately`, `headOfHousehold`, `qualifyingSurvivingSpouse`.|single:unselected: marriedFilingJointly:unselected: marriedFillingSeparately:unselected: headOfHousehold:unselected: qualifyingSurvivingSpouse:unselected:|
|`NameOfSpouseOrQualifyingPerson`|`string`|Name Of Spouse Or Qualifying Person extracted from Form 1040.|Pascale Weyderth|
|`PresidentialElectionCampaign`|`selectionGroup`|Value is a list containing at least one of the following codes: `taxpayer`, `spouse`.|taxpayer:unselected: spouse:unselected:|
|`DigitalAssets`|`selectionGroup`|Value is a list containing at least one of the following codes: `yes`, `no`.|yes:unselected: no:unselected:|
|`ClaimStatus`|`selectionGroup`|Value is a list containing at least one of the following codes: `taxpayerAsDependent`, `spouseAsDependent`, `spouseItemizesSeparatelyOrDualStatusAlien`.|taxpayerAsDependent:unselected: spouseAsDependent:unselected: spouseItemizesSeparatelyOrDualStatusAlien:unselected:|
|`TaxpayerAgeBlindeness`|`selectionGroup`|Value is a list containing at least one of the following codes: `above64`, `blind`.|above64:unselected: blind:unselected:|
|`SpouseAgeBlindeness`|`selectionGroup`|Value is a list containing at least one of the following codes: `above64`, `blind`.|above64:unselected: blind:unselected:|
|`MoreThanFourDependents`|`boolean`|More Than Four Dependents extracted from Form 1040.|:selected:|
|`Box1a`|`number`|Box `1a` extracted from Form 1040.|123456|
|`Box1b`|`number`|Box `1b` extracted from Form 1040.|123456|
|`Box1c`|`number`|Box `1c` extracted from Form 1040.|123456|
|`Box1d`|`number`|Box `1d` extracted from Form 1040.|123456|
|`Box1e`|`number`|Box `1e` extracted from Form 1040.|123456|
|`Box1f`|`number`|Box `1f` extracted from Form 1040.|123456|
|`Box1g`|`number`|Box `1g` extracted from Form 1040.|123456|
|`Box1h`|`number`|Box `1h` extracted from Form 1040.|123456|
|`Box1i`|`number`|Box 1i extracted from Form 1040.|123456|
|`Box1z`|`number`|Box 1z extracted from Form 1040.|123456|
|`Box2a`|`number`|Box 2a extracted from Form 1040.|123456|
|`Box2b`|`number`|Box 2b extracted from Form 1040.|123456|
|`Box3a`|`number`|Box 3a extracted from Form 1040.|123456|
|`Box3b`|`number`|Box 3b extracted from Form 1040.|123456|
|`Box4a`|`number`|Box 4a extracted from Form 1040.|123456|
|`Box4b`|`number`|Box 4b extracted from Form 1040.|123456|
|`Box5a`|`number`|Box 5a extracted from Form 1040.|123456|
|`Box5b`|`number`|Box 5b extracted from Form 1040.|123456|
|`Box6a`|`number`|Box 6a extracted from Form 1040.|123456|
|`Box6b`|`number`|Box 6b extracted from Form 1040.|123456|
|`Box6cCheckbox`|`boolean`|Box 6c Checkbox extracted from Form 1040.|:selected:|
|`Box7Checkbox`|`boolean`|Box 7 Checkbox extracted from Form 1040.|:selected:|
|`Box7`|`number`|Box 7 extracted from Form 1040.|123456|
|`Box8`|`number`|Box 8 extracted from Form 1040.|123456|
|`Box9`|`number`|Box 9 extracted from Form 1040.|123456|
|`Box10`|`number`|Box 10 extracted from Form 1040.|123456|
|`Box11`|`number`|Box 11 extracted from Form 1040.|123456|
|`Box12`|`number`|Box 12 extracted from Form 1040.|123456|
|`Box13`|`number`|Box 13 extracted from Form 1040.|123456|
|`Box14`|`number`|Box 14 extracted from Form 1040.|123456|
|`Box15`|`number`|Box 15 extracted from Form 1040.|123456|
|`Box16FromForm`|`selectionGroup`|Value is a list containing at least one of the following codes: `8814`, `4972`, `other`.|8814:unselected: 4972:unselected: other:unselected:|
|`Box16OtherFormNumber`|`string`|Box 16 Other Form Number extracted from Form 1040.|8888|
|`Box16`|`number`|Box 16 extracted from Form 1040.|123456|
|`Box17`|`number`|Box 17 extracted from Form 1040.|123456|
|`Box18`|`number`|Box 18 extracted from Form 1040.|123456|
|`Box19`|`number`|Box 19 extracted from Form 1040.|123456|
|`Box20`|`number`|Box 20 extracted from Form 1040.|123456|
|`Box21`|`number`|Box 21 extracted from Form 1040.|123456|
|`Box22`|`number`|Box 22 extracted from Form 1040.|123456|
|`Box23`|`number`|Box 23 extracted from Form 1040.|123456|
|`Box24`|`number`|Box 24 extracted from Form 1040.|123456|
|`Box25a`|`number`|Box 25a extracted from Form 1040.|123456|
|`Box25b`|`number`|Box 25b extracted from Form 1040.|123456|
|`Box25c`|`number`|Box 25c extracted from Form 1040.|123456|
|`Box25d`|`number`|Box 25d extracted from Form 1040.|123456|
|`Box26`|`number`|Box 26 extracted from Form 1040.|123456|
|`Box27`|`number`|Box 27 extracted from Form 1040.|123456|
|`Box28`|`number`|Box 28 extracted from Form 1040.|123456|
|`Box29`|`number`|Box 29 extracted from Form 1040.|123456|
|`Box31`|`number`|Box 31 extracted from Form 1040.|123456|
|`Box32`|`number`|Box 32 extracted from Form 1040.|123456|
|`Box33`|`number`|Box 33 extracted from Form 1040.|123456|
|`Box34`|`number`|Box 34 extracted from Form 1040.|123456|
|`Box35Checkbox`|`boolean`|Box 35 Checkbox extracted from Form 1040.|:selected:|
|`Box35a`|`number`|Box 35a extracted from Form 1040.|123456|
|`Box35b`|`number`|Box 35b extracted from Form 1040.|123456|
|`Box35c`|`selectionGroup`|Value is a list containing at least one of the following codes: `checking`, `saving`.|checking:unselected: saving:unselected:|
|`Box35d`|`number`|Box 35d extracted from Form 1040.|123456|
|`Box36`|`number`|Box 36 extracted from Form 1040.|123456|
|`Box37`|`number`|Box 37 extracted from Form 1040.|123456|
|`Box38`|`number`|Box 38 extracted from Form 1040.|123456|
|`HasAssignedThirdPartyDesignee`|`selectionGroup`|Value is a list containing at least one of the following codes: `yes`, `no`.|yes:unselected: no:unselected:|  

The tax documents key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker range="doc-intel-4.0.0"

[Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/main/Python(v4.0)/Prebuilt_model)
:::moniker-end

::: moniker range="doc-intel-3.1.0"

[Find more samples on GitHub.](https://github.com/Azure-Samples/document-intelligence-code-samples/tree/v3.1(2023-07-31-GA)/Python(v3.1)/Prebuilt_model)
:::moniker-end