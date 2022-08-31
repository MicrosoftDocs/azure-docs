---
zone_pivot_groups: programming-languages-set-formre
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer - ID document model

The ID document model combines Optical Character Recognition (OCR) with deep learning models to analyze and extracts key information from US Drivers Licenses (all 50 states and District of Columbia), international passport biographical pages, US state ID, social security card, green card and more. The API analyzes identity documents, extracts key information, and returns a structured JSON data representation.


## [2022-08-31](#tab/2022-08-31)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)**:

:::image type="content" source="prebuilt-models/media/prebuilt-idDocument.2022-08-31.jpg" alt-text="sample id document":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/id-license.png)
- [Example result](prebuilt-models/samples/prebuilt-idDocument.2022-08-31.result.json)

### Supported document fields

#### Document type - `idDocument.driverLicense`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`DocumentDiscriminator`|`string`|Driver license document discriminator|12645646464554646456464544|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`address`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`EyeColor`|`string`|Eye color|BLU|
|`HairColor`|`string`|Hair color|BRO|
|`Height`|`string`|Height|5'11"|
|`Weight`|`string`|Weight|185LB|
|`Sex`|`string`|Sex|M|
|`Endorsements`|`string`|Endorsements|L|
|`Restrictions`|`string`|Restrictions|B|
|`VehicleClassifications`|`string`|Vehicle classification|D|
#### Document type - `idDocument.passport`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`DocumentNumber`|`string`|Passport number|340020013|
|`FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MiddleName`|`string`|Name between given name and surname|REYES|
|`LastName`|`string`|Surname|BROOKS|
|`Aliases`|`array`|||
|`Aliases.*`|`string`|Also known as|MAY LIN|
|`DateOfBirth`|`date`|Date of birth|1980-01-01|
|`DateOfExpiration`|`date`|Date of expiration|2019-05-05|
|`DateOfIssue`|`date`|Date of issue|2014-05-06|
|`Sex`|`string`|Sex|F|
|`CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`DocumentType`|`string`|Document type|P|
|`Nationality`|`countryRegion`|Nationality|USA|
|`PlaceOfBirth`|`string`|Place of birth|MASSACHUSETTS, U.S.A.|
|`PlaceOfIssue`|`string`|Place of issue|LA PAZ|
|`IssuingAuthority`|`string`|Issuing authority|United States Department of State|
|`PersonalNumber`|`string`|Personal Id. No.|A234567893|
|`MachineReadableZone`|`object`|Machine readable zone (MRZ)|P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816|
|`MachineReadableZone.FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MachineReadableZone.LastName`|`string`|Surname|BROOKS|
|`MachineReadableZone.DocumentNumber`|`string`|Passport number|340020013|
|`MachineReadableZone.CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`MachineReadableZone.Nationality`|`countryRegion`|Nationality|USA|
|`MachineReadableZone.DateOfBirth`|`date`|Date of birth|1980-01-01|
|`MachineReadableZone.DateOfExpiration`|`date`|Date of expiration|2019-05-05|
|`MachineReadableZone.Sex`|`string`|Sex|F|
#### Document type - `idDocument.nationalIdentityCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|National identity card number|WDLABCD456DG|
|`DocumentDiscriminator`|`string`|National identity card document discriminator|12645646464554646456464544|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`address`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`EyeColor`|`string`|Eye color|BLU|
|`HairColor`|`string`|Hair color|BRO|
|`Height`|`string`|Height|5'11"|
|`Weight`|`string`|Weight|185LB|
|`Sex`|`string`|Sex|M|
#### Document type - `idDocument.residencePermit`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`DocumentNumber`|`string`|Residence permit number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`Sex`|`string`|Sex|M|
|`PlaceOfBirth`|`string`|Place of birth|Germany|
|`Category`|`string`|Permit category|DV2|
#### Document type - `idDocument.usSocialSecurityCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`DocumentNumber`|`string`|Social security card number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
#### Document type - `idDocument`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|

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
<tr><td>(default)</td><td>All</td><td></td></tr>
<tr><td rowspan=1><code>idDocument.driverLicense</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td rowspan=1><code>idDocument.nationalIdentityCard</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td rowspan=1><code>idDocument.residencePermit</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td rowspan=1><code>idDocument.usSocialSecurityCard</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

#### Preview languages

<table>
    <thead>
        <tr>
            <th>Document type</th>
            <th>Language</th>
            <th>Code</th>
        </tr>
    </thead>
    <tbody>
<tr><td rowspan=1>(default)</td><td>Chinese</td><td><code>zh</code></td></tr>
    </tbody >
</table >

#### Experimental languages

<table>
    <thead>
        <tr>
            <th>Document type</th>
            <th>Language</th>
            <th>Code</th>
        </tr>
    </thead>
    <tbody>
<tr><td rowspan=1>(default)</td><td>Arabic</td><td><code>ar</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-idDocument` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-idDocument.2022-08-31.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-idDocument.2022-08-31.py" lang="python" :::

::: zone-end



## [2022-06-30-preview](#tab/2022-06-30-preview)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)**:

:::image type="content" source="prebuilt-models/media/prebuilt-idDocument.2022-06-30-preview.jpg" alt-text="sample id document":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/id-license.png)
- [Example result](prebuilt-models/samples/prebuilt-idDocument.2022-06-30-preview.result.json)

### Supported document fields

#### Document type - `idDocument.driverLicense`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`DocumentDiscriminator`|`string`|Driver license document discriminator|12645646464554646456464544|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`string`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`EyeColor`|`string`|Eye color|BLU|
|`HairColor`|`string`|Hair color|BRO|
|`Height`|`string`|Height|5'11"|
|`Weight`|`string`|Weight|185LB|
|`Sex`|`string`|Sex|M|
|`Endorsements`|`string`|Endorsements|L|
|`Restrictions`|`string`|Restrictions|B|
|`VehicleClassifications`|`string`|Vehicle classification|D|
#### Document type - `idDocument.passport`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MachineReadableZone`|`object`|Machine readable zone (MRZ)|P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816|
|`MachineReadableZone.FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MachineReadableZone.LastName`|`string`|Surname|BROOKS|
|`MachineReadableZone.DocumentNumber`|`string`|Passport number|340020013|
|`MachineReadableZone.CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`MachineReadableZone.Nationality`|`countryRegion`|Nationality|USA|
|`MachineReadableZone.DateOfBirth`|`date`|Date of birth|1980-01-01|
|`MachineReadableZone.DateOfExpiration`|`date`|Date of expiration|2019-05-05|
|`MachineReadableZone.Sex`|`string`|Sex|F|

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
<tr><td>(default)</td><td>All</td><td></td></tr>
<tr><td rowspan=1><code>idDocument.driverLicense</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-idDocument` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-idDocument.2022-06-30-preview.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-idDocument.2022-06-30-preview.py" lang="python" :::

::: zone-end



## [2.1](#tab/2.1)

### Example

:::image type="content" source="prebuilt-models/media/prebuilt-idDocument.2.1.jpg" alt-text="sample id document":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/id-license.png)
- [Example result](prebuilt-models/samples/prebuilt-idDocument.2.1.result.json)

### Supported document fields

#### Document type - `prebuilt:idDocument:driverLicense`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`string`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth (DOB)|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration (EXP)|08/12/2020|
|`Sex`|`string`|Sex|M|
#### Document type - `prebuilt:idDocument:passport`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MachineReadableZone`|`object`|Machine readable zone (MRZ)|P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816|
|`MachineReadableZone.FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MachineReadableZone.LastName`|`string`|Surname|BROOKS|
|`MachineReadableZone.DocumentNumber`|`string`|Passport number|340020013|
|`MachineReadableZone.CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`MachineReadableZone.Nationality`|`countryRegion`|Nationality|USA|
|`MachineReadableZone.DateOfBirth`|`date`|Date of birth|1980-01-01|
|`MachineReadableZone.DateOfExpiration`|`date`|Date of expiration|201-05-05|
|`MachineReadableZone.Sex`|`string`|Sex|F|

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
<tr><td>(default)</td><td>All</td><td></td></tr>
<tr><td rowspan=1><code>prebuilt:idDocument:driverLicense</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-idDocument` outputs the following elements in the result JSON:
* `readResults`
* `documentResults`
* `documentResults.*.fields`



