---
zone_pivot_groups: programming-languages-set-formre
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer - W-2 model

The Form W-2, Wage and Tax Statement, is a [US Internal Revenue Service (IRS) tax form](https://www.irs.gov/forms-pubs/about-form-w-2). It's used to report employees' salary, wages, compensation, and taxes withheld. Employers send a W-2 form to each employee on or before January 31 each year and employees use the form to prepare their tax returns. W-2 is a key document used in employee's federal and state taxes filing, as well as other processes like mortgage loan and Social Security Administration (SSA).


## [2022-08-31](#tab/2022-08-31)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)**:

:::image type="content" source="prebuilt-models/media/prebuilt-tax.us.w2.2022-08-31.jpg" alt-text="sample w-2":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/w2-single.png)
- [Example result](prebuilt-models/samples/prebuilt-tax.us.w2.2022-08-31.result.json)

### Supported document fields

#### Document type - `tax.us.w2`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`W2FormVariant`|`string`|IRS W2 Form variant. This field can have the one of the following values: 'W-2', 'W-2AS', 'W-2CM', 'W-2GU' or 'W-2VI'|W-2|
|`TaxYear`|`string`|Form tax year|2021|
|`W2Copy`|`string`|W2 form copy version along with printed instruction realted to this copy|Copy A—For Social Security Administration|
|`Employee`|`object`|||
|`Employee.SocialSecurityNumber`|`string`|Employee social security number. IRS W2 form field a. eg: '123-45-6789'|123-45-6789|
|`Employee.Name`|`string`|Employee's first name, middle full/initials name, last name and suffix. IRS W2 form field e|John Contonso|
|`Employee.Address`|`address`|Employee's address. Part of IRS W2 form field f|123 Microsoft way, Redmond WA, 98123|
|`ControlNumber`|`string`|W2 Form control number. IRS W2 form field d|0AB12 D345 7890|
|`Employer`|`object`|||
|`Employer.IdNumber`|`string`|Employer's identification number. IRS W2 form field b|12-3456789|
|`Employer.Name`|`string`|Employer's name. Part of IRS W2 form field c|Fabrikam|
|`Employer.Address`|`address`|Employer's address. Part of IRS W2 form field c|321 Microsoft way, Redmond WA, 98123|
|`WagesTipsAndOtherCompensation`|`number`|Wages, tips, and other compensation amount in USD. IRS W2 form field 1|1234567.89|
|`FederalIncomeTaxWithheld`|`number`|Federal income tax withheld amount in USD. IRS W2 form field 2|1234567.89|
|`SocialSecurityWages`|`number`|Social security wages amount in USD. IRS W2 form field 3|1234567.89|
|`SocialSecurityTaxWithheld`|`number`|Social security tax withheld amount in USD. IRS W2 form field 4|1234567.89|
|`MedicareWagesAndTips`|`number`|Medicare wages and tips amount in USD. IRS W2 form field 5|1234567.89|
|`MedicareTaxWithheld`|`number`|Medicare tax withheld amount in USD. IRS W2 form field 6|1234567.89|
|`SocialSecurityTips`|`number`|Social security tips amount in USD. IRS W2 form field 7|1234567.89|
|`AllocatedTips`|`number`|Allocated tips in USD. IRS W2 form field 8|1234567.89|
|`VerificationCode`|`string`|W2 form verification code. IRS W2 form field 9|AB123456|
|`DependentCareBenefits`|`number`|Dependent care benefits amount in USD. IRS W2 form field 10|1234567.89|
|`NonQualifiedPlans`|`number`|Non-qualified plans amount in USD. IRS W2 form field 11|1234567.89|
|`AdditionalInfo`|`array`|Array holding W2 Codes. IRS W2 form field 12||
|`AdditionalInfo.*`|`object`|||
|`AdditionalInfo.*.LetterCode`|`string`|Please refer to https://www.irs.gov/pub/irs-pdf/iw2w3.pdf for more details on IRS W2 box 12's letter code|A|
|`AdditionalInfo.*.Amount`|`number`|Code amount in USD|1234567.89|
|`IsStatutoryEmployee`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'|true|
|`IsRetirementPlan`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'|true|
|`IsThirdPartySickPay`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'|true|
|`Other`|`string`|Content of IRS W2 form field 14|SICK LV WAGES SBJT TO $511/DAY LIMIT 1356|
|`StateTaxInfos`|`array`|State tax-related information. content of IRS W2 form field 15 to 17||
|`StateTaxInfos.*`|`object`|||
|`StateTaxInfos.*.State`|`string`|Two letter state code. Part of IRS W2 form field 15|WA|
|`StateTaxInfos.*.EmployerStateIdNumber`|`string`|Employer state ID number. Part of IRS W2 form field 15|1234567|
|`StateTaxInfos.*.StateWagesTipsEtc`|`number`|State wages, tips, etc amount in USD. IRS W2 form field 16|1234567.89|
|`StateTaxInfos.*.StateIncomeTax`|`number`|State income tax amount in USD. IRS W2 form field 17|1234567.89|
|`LocalTaxInfos`|`array`|Local tax-related information. Content of IRS W2 form field 18 to 20||
|`LocalTaxInfos.*`|`object`|||
|`LocalTaxInfos.*.LocalWagesTipsEtc`|`number`|Local wages, tips, etc amount in USD. Part of IRS W2 form field 18|1234567.89|
|`LocalTaxInfos.*.LocalIncomeTax`|`number`|Local income tax amount in USD. Part of IRS W2 form field 19|1234567.89|
|`LocalTaxInfos.*.LocalityName`|`string`|Locality name. Part of IRS W2 form field 20|Redmond|

### Supported languages

<table>
    <thead>
        <tr>
            <th>Document type</th>
            <th>Language</th>
            <th>Code</th>
        </tr>
    </thead>
    <tbody>
<tr><td rowspan=1>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-tax.us.w2` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-tax.us.w2.2022-08-31.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-tax.us.w2.2022-08-31.py" lang="python" :::

::: zone-end



## [2022-06-30-preview](#tab/2022-06-30-preview)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)**:

:::image type="content" source="prebuilt-models/media/prebuilt-tax.us.w2.2022-06-30-preview.jpg" alt-text="sample w-2":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/w2-single.png)
- [Example result](prebuilt-models/samples/prebuilt-tax.us.w2.2022-06-30-preview.result.json)

### Supported document fields

#### Document type - `tax.us.w2`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`W2FormVariant`|`string`|IRS W2 Form variant. This field can have the one of the following values: 'W-2', 'W-2AS', 'W-2CM', 'W-2GU' or 'W-2VI'|W-2|
|`TaxYear`|`string`|Form tax year.|2021|
|`W2Copy`|`string`|W2 form copy version along with printed instruction realted to this copy|Copy A—For Social Security Administration|
|`Employee`|`object`|||
|`Employee.SocialSecurityNumber`|`string`|Employee social security number. IRS W2 form field a. eg: '123-45-6789'.|123-45-6789|
|`Employee.Name`|`string`|Employee's first name, middle full/initials name, last name and suffix. IRS W2 form field e.|John Contonso|
|`Employee.Address`|`address`|Employee's address. Part of IRS W2 form field f.|123 Microsoft way, Redmond WA, 98123|
|`ControlNumber`|`string`|W2 Form control number. IRS W2 form field d.|0AB12 D345 7890|
|`Employer`|`object`|||
|`Employer.IdNumber`|`string`|Employer's identification number. IRS W2 form field b|12-3456789|
|`Employer.Name`|`string`|Employer's name. Part of IRS W2 form field c.|Fabrikam|
|`Employer.Address`|`address`|Employer's address. Part of IRS W2 form field c.|321 Microsoft way, Redmond WA, 98123|
|`WagesTipsAndOtherCompensation`|`number`|Wages, tips, and other compensation amount in USD. IRS W2 form field 1.|1234567.89|
|`FederalIncomeTaxWithheld`|`number`|Federal income tax withheld amount in USD. IRS W2 form field 2.|1234567.89|
|`SocialSecurityWages`|`number`|Social security wages amount in USD. IRS W2 form field 3.|1234567.89|
|`SocialSecurityTaxWithheld`|`number`|Social security tax withheld amount in USD. IRS W2 form field 4.|1234567.89|
|`MedicareWagesAndTips`|`number`|Medicare wages and tips amount in USD. IRS W2 form field 5.|1234567.89|
|`MedicareTaxWithheld`|`number`|Medicare tax withheld amount in USD. IRS W2 form field 6.|1234567.89|
|`SocialSecurityTips`|`number`|Social security tips amount in USD. IRS W2 form field 7.|1234567.89|
|`AllocatedTips`|`number`|Allocated tips in USD. IRS W2 form field 8.|1234567.89|
|`VerificationCode`|`string`|W2 form verification code. IRS W2 form field 9.|AB123456|
|`DependentCareBenefits`|`number`|Dependent care benefits amount in USD. IRS W2 form field 10.|1234567.89|
|`NonQualifiedPlans`|`number`|Non-qualified plans amount in USD. IRS W2 form field 11.|1234567.89|
|`AdditionalInfo`|`array`|Array holding W2 Codes. IRS W2 form field 12.||
|`AdditionalInfo.*`|`object`|||
|`AdditionalInfo.*.LetterCode`|`string`|Please refer to https://www.irs.gov/pub/irs-pdf/iw2w3.pdf for more details on IRS W2 box 12's letter code|A|
|`AdditionalInfo.*.Amount`|`number`|Code amount in USD|1234567.89|
|`IsStatutoryEmployee`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'.|true|
|`IsRetirementPlan`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'.|true|
|`IsThirdPartySickPay`|`string`|Part of IRS W2 form field 13. Can be 'true' or 'false'.|true|
|`Other`|`string`|Content of IRS W2 form field 14.|SICK LV WAGES SBJT TO $511/DAY LIMIT 1356|
|`StateTaxInfos`|`array`|State tax-related information. content of IRS W2 form field 15 to 17.||
|`StateTaxInfos.*`|`object`|||
|`StateTaxInfos.*.State`|`string`|Two letter state code. Part of IRS W2 form field 15.|WA|
|`StateTaxInfos.*.EmployerStateIdNumber`|`string`|Employer state ID number. Part of IRS W2 form field 15.|1234567|
|`StateTaxInfos.*.StateWagesTipsEtc`|`number`|State wages, tips, etc amount in USD. IRS W2 form field 16.|1234567.89|
|`StateTaxInfos.*.StateIncomeTax`|`number`|State income tax amount in USD. IRS W2 form field 17.|1234567.89|
|`LocalTaxInfos`|`array`|Local tax-related information. Content of IRS W2 form field 18 to 20.||
|`LocalTaxInfos.*`|`object`|||
|`LocalTaxInfos.*.LocalWagesTipsEtc`|`number`|Local wages, tips, etc amount in USD. Part of IRS W2 form field 18.|1234567.89|
|`LocalTaxInfos.*.LocalIncomeTax`|`number`|Local income tax amount in USD. Part of IRS W2 form field 19.|1234567.89|
|`LocalTaxInfos.*.LocalityName`|`string`|Locality name. Part of IRS W2 form field 20.|Redmond|

### Supported languages

<table>
    <thead>
        <tr>
            <th>Document type</th>
            <th>Language</th>
            <th>Code</th>
        </tr>
    </thead>
    <tbody>
<tr><td rowspan=1>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-tax.us.w2` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-tax.us.w2.2022-06-30-preview.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-tax.us.w2.2022-06-30-preview.py" lang="python" :::

::: zone-end

