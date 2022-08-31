---
zone_pivot_groups: programming-languages-set-formre
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer - Business card model

The business card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.


## [2022-08-31](#tab/2022-08-31)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)**:

:::image type="content" source="prebuilt-models/media/prebuilt-businessCard.2022-08-31.jpg" alt-text="sample business card":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/bizcard.jpg)
- [Example result](prebuilt-models/samples/prebuilt-businessCard.2022-08-31.result.json)

### Supported document fields

#### Document type - `businessCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`ContactNames`|`array`|||
|`ContactNames.*`|`object`|Contact name|Chris Smith|
|`ContactNames.*.FirstName`|`string`|First (given) name of contact|Chris|
|`ContactNames.*.LastName`|`string`|Last (family) name of contact|Smith|
|`CompanyNames`|`array`|||
|`CompanyNames.*`|`string`|Company name|CONTOSO|
|`JobTitles`|`array`|||
|`JobTitles.*`|`string`|Job title|Senior Researcher|
|`Departments`|`array`|||
|`Departments.*`|`string`|Department or organization|Cloud & AI Department|
|`Addresses`|`array`|||
|`Addresses.*`|`address`|Address|4001 1st Ave NE Redmond, WA 98052|
|`WorkPhones`|`array`|||
|`WorkPhones.*`|`phoneNumber`|Work phone number|+1 (987) 213-5674|
|`MobilePhones`|`array`|||
|`MobilePhones.*`|`phoneNumber`|Mobile phone number|+1 (987) 123-4567|
|`Faxes`|`array`|||
|`Faxes.*`|`phoneNumber`|Fax number|+1 (987) 312-6745|
|`OtherPhones`|`array`|||
|`OtherPhones.*`|`phoneNumber`|Other phone number|+1 (987) 213-5673|
|`Emails`|`array`|||
|`Emails.*`|`string`|Contact email|chris.smith@contoso.com|
|`Websites`|`array`|||
|`Websites.*`|`string`|Website|https://www.contoso.com|

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
<tr><td rowspan=7>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>English (Australia)</td><td><code>en-AU</code></td></tr>
<tr><td>English (Canada)</td><td><code>en-CA</code></td></tr>
<tr><td>English (United Kingdom)</td><td><code>en-GB</code></td></tr>
<tr><td>English (India)</td><td><code>en-IN</code></td></tr>
<tr><td>English (Japan)</td><td><code>en-JP</code></td></tr>
<tr><td>Japanese (Japan)</td><td><code>ja-JP</code></td></tr>
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

`prebuilt-businessCard` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-businessCard.2022-08-31.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-businessCard.2022-08-31.py" lang="python" :::

::: zone-end



## [2022-06-30-preview](#tab/2022-06-30-preview)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)**:

:::image type="content" source="prebuilt-models/media/prebuilt-businessCard.2022-06-30-preview.jpg" alt-text="sample business card":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/bizcard.jpg)
- [Example result](prebuilt-models/samples/prebuilt-businessCard.2022-06-30-preview.result.json)

### Supported document fields

#### Document type - `businessCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`ContactNames`|`array`|||
|`ContactNames.*`|`object`|Contact name|Chris Smith|
|`ContactNames.*.FirstName`|`string`|First (given) name of contact|Chris|
|`ContactNames.*.LastName`|`string`|Last (family) name of contact|Smith|
|`CompanyNames`|`array`|||
|`CompanyNames.*`|`string`|Company name|CONTOSO|
|`JobTitles`|`array`|||
|`JobTitles.*`|`string`|Job title|Senior Researcher|
|`Departments`|`array`|||
|`Departments.*`|`string`|Department or organization|Cloud & AI Department|
|`Addresses`|`array`|||
|`Addresses.*`|`string`|Address|4001 1st Ave NE Redmond, WA 98052|
|`WorkPhones`|`array`|||
|`WorkPhones.*`|`phoneNumber`|Work phone number|+1 (987) 213-5674|
|`MobilePhones`|`array`|||
|`MobilePhones.*`|`phoneNumber`|Mobile phone number|+1 (987) 123-4567|
|`Faxes`|`array`|||
|`Faxes.*`|`phoneNumber`|Fax number|+1 (987) 312-6745|
|`OtherPhones`|`array`|||
|`OtherPhones.*`|`phoneNumber`|Other phone number|+1 (987) 213-5673|
|`Emails`|`array`|||
|`Emails.*`|`string`|Contact email|chris.smith@contoso.com|
|`Websites`|`array`|||
|`Websites.*`|`string`|Website|https://www.contoso.com|

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
<tr><td rowspan=7>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>English (Australia)</td><td><code>en-AU</code></td></tr>
<tr><td>English (Canada)</td><td><code>en-CA</code></td></tr>
<tr><td>English (United Kingdom)</td><td><code>en-GB</code></td></tr>
<tr><td>English (India)</td><td><code>en-IN</code></td></tr>
<tr><td>English (Japan)</td><td><code>en-JP</code></td></tr>
<tr><td>Japanese (Japan)</td><td><code>ja-JP</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-businessCard` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-businessCard.2022-06-30-preview.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-businessCard.2022-06-30-preview.py" lang="python" :::

::: zone-end



## [2.1](#tab/2.1)

### Example

:::image type="content" source="prebuilt-models/media/prebuilt-businessCard.2.1.jpg" alt-text="sample business card":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/bizcard.jpg)
- [Example result](prebuilt-models/samples/prebuilt-businessCard.2.1.result.json)

### Supported document fields

#### Document type - `businessCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`ContactNames`|`array`|||
|`ContactNames.*`|`object`|Contact name|Chris Smith|
|`ContactNames.*.FirstName`|`string`|First (given) name of contact|Chris|
|`ContactNames.*.LastName`|`string`|Last (family) name of contact|Smith|
|`CompanyNames`|`array`|||
|`CompanyNames.*`|`string`|Company name|CONTOSO|
|`JobTitles`|`array`|||
|`JobTitles.*`|`string`|Job title|Senior Researcher|
|`Departments`|`array`|||
|`Departments.*`|`string`|Department or organization|Cloud & AI Department|
|`Addresses`|`array`|||
|`Addresses.*`|`string`|Address|4001 1st Ave NE Redmond, WA 98052|
|`WorkPhones`|`array`|||
|`WorkPhones.*`|`phoneNumber`|Work phone number|+1 (987) 213-5674|
|`MobilePhones`|`array`|||
|`MobilePhones.*`|`phoneNumber`|Mobile phone number|+1 (987) 123-4567|
|`Faxes`|`array`|||
|`Faxes.*`|`phoneNumber`|Fax number|+1 (987) 312-6745|
|`OtherPhones`|`array`|||
|`OtherPhones.*`|`phoneNumber`|Other phone number|+1 (987) 213-5673|
|`Emails`|`array`|||
|`Emails.*`|`string`|Contact email|chris.smith@contoso.com|
|`Websites`|`array`|||
|`Websites.*`|`string`|Website|https://www.contoso.com|

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
<tr><td rowspan=5>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>English (Australia)</td><td><code>en-AU</code></td></tr>
<tr><td>English (Canada)</td><td><code>en-CA</code></td></tr>
<tr><td>English (United Kingdom)</td><td><code>en-GB</code></td></tr>
<tr><td>English (India)</td><td><code>en-IN</code></td></tr>
    </tbody >
</table >
TODO: Default to en-US if unspecified.

### Supported features

`prebuilt-businessCard` outputs the following elements in the result JSON:
* `readResults`
* `documentResults`
* `documentResults.*.fields`



