---
zone_pivot_groups: programming-languages-set-formre
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer - Receipt model

The receipt model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from sales receipts. Receipts can be of various formats and quality including printed and handwritten receipts. The API extracts key information such as merchant name, merchant phone number, transaction date, tax, and transaction total and returns structured JSON data.


## [2022-08-31](#tab/2022-08-31)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)**:

:::image type="content" source="prebuilt-models/media/prebuilt-receipt.2022-08-31.jpg" alt-text="sample receipt":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/receipt.png)
- [Example result](prebuilt-models/samples/prebuilt-receipt.2022-08-31.result.json)

### Supported document fields

#### Document type - `receipt`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.retailMeal`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.creditCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.gas`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.parking`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.hotel`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`address`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`ArrivalDate`|`date`|Date of arrival|27Mar21|
|`DepartureDate`|`date`|Date of departure|28Mar21|
|`Currency`|`string`|Currency unit of receipt amounts (ISO 4217), or 'MIXED' if multiple values are found|USD|
|`MerchantAliases`|`array`|||
|`MerchantAliases.*`|`string`|Alternative name of merchant|Contoso (R)|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Room Charge|
|`Items.*.Date`|`date`|Item date|27Mar21|
|`Items.*.Category`|`string`|Item category|Room|

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
<tr><td rowspan=10>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>English (Australia)</td><td><code>en-AU</code></td></tr>
<tr><td>English (Canada)</td><td><code>en-CA</code></td></tr>
<tr><td>English (United Kingdom)</td><td><code>en-GB</code></td></tr>
<tr><td>English (India)</td><td><code>en-IN</code></td></tr>
<tr><td>Spanish (Spain)</td><td><code>es-ES</code></td></tr>
<tr><td>German (Germany)</td><td><code>de-DE</code></td></tr>
<tr><td>French (France)</td><td><code>fr-FR</code></td></tr>
<tr><td>Italian (Italy)</td><td><code>it-IT</code></td></tr>
<tr><td>Portuguese (Portugal)</td><td><code>pt-PT</code></td></tr>
<tr><td rowspan=6><code>receipt.hotel</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>Spanish (Spain)</td><td><code>es-ES</code></td></tr>
<tr><td>German (Germany)</td><td><code>de-DE</code></td></tr>
<tr><td>French (France)</td><td><code>fr-FR</code></td></tr>
<tr><td>Italian (Italy)</td><td><code>it-IT</code></td></tr>
<tr><td>Portuguese (Portugal)</td><td><code>pt-PT</code></td></tr>
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

`prebuilt-receipt` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-receipt.2022-08-31.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-receipt.2022-08-31.py" lang="python" :::

::: zone-end



## [2022-06-30-preview](#tab/2022-06-30-preview)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)**:

:::image type="content" source="prebuilt-models/media/prebuilt-receipt.2022-06-30-preview.jpg" alt-text="sample receipt":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/receipt.png)
- [Example result](prebuilt-models/samples/prebuilt-receipt.2022-06-30-preview.result.json)

### Supported document fields

#### Document type - `receipt`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.retailMeal`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.creditCard`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.gas`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.parking`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`TotalTax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|
#### Document type - `receipt.hotel`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`ArrivalDate`|`date`|Date of arrival|27Mar21|
|`DepartureDate`|`date`|Date of departure|28Mar21|
|`Currency`|`string`|Currency unit of receipt amounts (ISO 4217), or 'MIXED' if multiple values are found|USD|
|`MerchantAliases`|`array`|||
|`MerchantAliases.*`|`string`|Alternative name of merchant|Contoso (R)|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Description`|`string`|Item description|Room Charge|
|`Items.*.Date`|`date`|Item date|27Mar21|
|`Items.*.Category`|`string`|Item category|Room|

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
<tr><td rowspan=1><code>receipt.hotel</code></td><td>English (United States)</td><td><code>en-US</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-receipt` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-receipt.2022-06-30-preview.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-receipt.2022-06-30-preview.py" lang="python" :::

::: zone-end



## [2.1](#tab/2.1)

### Example

:::image type="content" source="prebuilt-models/media/prebuilt-receipt.2.1.jpg" alt-text="sample receipt":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/receipt.png)
- [Example result](prebuilt-models/samples/prebuilt-receipt.2.1.result.json)

### Supported document fields

#### Document type - `prebuilt:receipt`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`ReceiptType`|`string`|Type of receipt|Itemized|
|`MerchantName`|`string`|Name of the merchant issuing the receipt|Contoso|
|`MerchantPhoneNumber`|`phoneNumber`|Listed phone number of merchant|987-654-3210|
|`MerchantAddress`|`string`|Listed address of merchant|123 Main St Redmond WA 98052|
|`Total`|`number`|Full transaction total of receipt|$14.34|
|`TransactionDate`|`date`|Date the receipt was issued|June 06, 2019|
|`TransactionTime`|`time`|Time the receipt was issued|4:49 PM|
|`Subtotal`|`number`|Subtotal of receipt, often before taxes are applied|$12.34|
|`Tax`|`number`|Tax on receipt, often sales tax or equivalent|$2.00|
|`Tip`|`number`|Tip included by buyer|$1.00|
|`Items`|`array`|||
|`Items.*`|`object`|Extracted line item|1<br>Surface Pro 6<br>$999.00<br>$999.00|
|`Items.*.TotalPrice`|`number`|Total price of line item|$999.00|
|`Items.*.Name`|`string`|Item name|Surface Pro 6|
|`Items.*.Quantity`|`number`|Quantity of each item|1|
|`Items.*.Price`|`number`|Individual price of each item unit|$999.00|

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

### Supported features

`prebuilt-receipt` outputs the following elements in the result JSON:
* `readResults`
* `documentResults`
* `documentResults.*.fields`



