---
zone_pivot_groups: programming-languages-set-formre
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer - Invoice model

The invoice model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key fields and line items from sales invoices.  Invoices can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes invoice text; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation. The model currently supports both English and Spanish invoices.


## [2022-08-31](#tab/2022-08-31)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)**:

:::image type="content" source="prebuilt-models/media/prebuilt-invoice.2022-08-31.jpg" alt-text="sample invoice":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/invoice-english.pdf)
- [Example result](prebuilt-models/samples/prebuilt-invoice.2022-08-31.result.json)

### Supported document fields

#### Document type - `invoice`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CustomerName`|`string`|Customer being invoiced|Microsoft Corp|
|`CustomerId`|`string`|Reference ID for the customer|CID-12345|
|`PurchaseOrder`|`string`|A purchase order reference number|PO-3333|
|`InvoiceId`|`string`|ID for this specific invoice (often 'Invoice Number')|INV-100|
|`InvoiceDate`|`date`|Date the invoice was issued|11/15/2019|
|`DueDate`|`date`|Date payment for this invoice is due|12/15/2019|
|`VendorName`|`string`|Vendor who has created this invoice|CONTOSO LTD.|
|`VendorAddress`|`address`|Mailing address for the Vendor|123 456th St New York, NY, 10001|
|`VendorAddressRecipient`|`string`|Name associated with the VendorAddress|Contoso Headquarters|
|`CustomerAddress`|`address`|Mailing address for the Customer|123 Other St, Redmond WA, 98052|
|`CustomerAddressRecipient`|`string`|Name associated with the CustomerAddress|Microsoft Corp|
|`BillingAddress`|`address`|Explicit billing address for the customer|123 Bill St, Redmond WA, 98052|
|`BillingAddressRecipient`|`string`|Name associated with the BillingAddress|Microsoft Services|
|`ShippingAddress`|`address`|Explicit shipping address for the customer|123 Ship St, Redmond WA, 98052|
|`ShippingAddressRecipient`|`string`|Name associated with the ShippingAddress|Microsoft Delivery|
|`SubTotal`|`currency`|Subtotal field identified on this invoice|$100.00|
|`TotalTax`|`currency`|Total tax field identified on this invoice|$10.00|
|`InvoiceTotal`|`currency`|Total new charges associated with this invoice|$110.00|
|`AmountDue`|`currency`|Total Amount Due to the vendor|$610.00|
|`PreviousUnpaidBalance`|`currency`|Explicit previously unpaid balance|$500.00|
|`RemittanceAddress`|`address`|Explicit remittance or payment address for the customer|123 Remit St New York, NY, 10001|
|`RemittanceAddressRecipient`|`string`|Name associated with the RemittanceAddress|Contoso Billing|
|`ServiceAddress`|`string`|Explicit service address or property address for the customer|123 Service St, Redmond WA, 98052|
|`ServiceAddressRecipient`|`address`|Name associated with the ServiceAddress|Microsoft Services|
|`ServiceStartDate`|`date`|First date for the service period (for example, a utility bill service period)|10/14/2019|
|`ServiceEndDate`|`date`|End date for the service period (for example, a utility bill service period)|11/14/2019|
|`VendorTaxId`|`string`|The government ID number associated with the vendor|123456-7|
|`CustomerTaxId`|`string`|The government ID number associated with the customer|765432-1|
|`PaymentTerm`|`string`|The terms under which the payment is meant to be paid|Net90|
|`Items`|`array`|List of line items||
|`Items.*`|`object`|A single line item|3/4/2021<br>A123<br>Consulting Services<br>2 hours<br>$30.00<br>10%<br>$60.00|
|`Items.*.Amount`|`currency`|The amount of the line item|$60.00|
|`Items.*.Date`|`date`|Date corresponding to each line item. Often it is a date the line item was shipped|3/4/2021|
|`Items.*.Description`|`string`|The text description for the invoice line item|Consulting service|
|`Items.*.Quantity`|`number`|The quantity for this invoice line item|2|
|`Items.*.ProductCode`|`string`|Product code, product number, or SKU associated with the specific line item|A123|
|`Items.*.Tax`|`currency`|Tax associated with each line item. Possible values include tax amount, tax %, and tax Y/N|$6.00|
|`Items.*.Unit`|`string`|The unit of the line item, e.g, kg, lb etc.|hours|
|`Items.*.UnitPrice`|`currency`|The net or gross price (depending on the gross invoice setting of the invoice) of one unit of this item|$30.00|

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
<tr><td rowspan=28>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>Spanish</td><td><code>es</code></td></tr>
<tr><td>Spanish (Argentina)</td><td><code>es-AR</code></td></tr>
<tr><td>Spanish (Bolivia)</td><td><code>es-BO</code></td></tr>
<tr><td>Spanish (Chile)</td><td><code>es-CL</code></td></tr>
<tr><td>Spanish (Colombia)</td><td><code>es-CO</code></td></tr>
<tr><td>Northern Sami (Costa Rica)</td><td><code>se-CR</code></td></tr>
<tr><td>Northern Sami (Dominican Republic)</td><td><code>se-DO</code></td></tr>
<tr><td>Spanish (Ecuador)</td><td><code>es-EC</code></td></tr>
<tr><td>Spanish (Spain)</td><td><code>es-ES</code></td></tr>
<tr><td>Spanish (Guatemala)</td><td><code>es-GT</code></td></tr>
<tr><td>Spanish (Honduras)</td><td><code>es-HN</code></td></tr>
<tr><td>Spanish (Mexico)</td><td><code>es-MX</code></td></tr>
<tr><td>Spanish (Nicaragua)</td><td><code>es-NI</code></td></tr>
<tr><td>Spanish (Panama)</td><td><code>es-PA</code></td></tr>
<tr><td>Spanish (Peru)</td><td><code>es-PE</code></td></tr>
<tr><td>Spanish (Puerto Rico)</td><td><code>es-PR</code></td></tr>
<tr><td>Spanish (Paraguay)</td><td><code>es-PY</code></td></tr>
<tr><td>Spanish (El Salvador)</td><td><code>es-SV</code></td></tr>
<tr><td>Spanish (United States)</td><td><code>es-US</code></td></tr>
<tr><td>Spanish (Uruguay)</td><td><code>es-UY</code></td></tr>
<tr><td>Spanish (Venezuela)</td><td><code>es-VE</code></td></tr>
<tr><td>German (Germany)</td><td><code>de-DE</code></td></tr>
<tr><td>French (France)</td><td><code>fr-FR</code></td></tr>
<tr><td>Italian (Italy)</td><td><code>it-IT</code></td></tr>
<tr><td>Portuguese (Portugal)</td><td><code>pt-PT</code></td></tr>
<tr><td>Portuguese (Brazil)</td><td><code>pt-BR</code></td></tr>
<tr><td>Dutch (Netherlands)</td><td><code>nl-NL</code></td></tr>
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

`prebuilt-invoice` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-invoice.2022-08-31.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-invoice.2022-08-31.py" lang="python" :::

::: zone-end



## [2022-06-30-preview](#tab/2022-06-30-preview)

### Example

**Sample processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)**:

:::image type="content" source="prebuilt-models/media/prebuilt-invoice.2022-06-30-preview.jpg" alt-text="sample invoice":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/invoice-english.pdf)
- [Example result](prebuilt-models/samples/prebuilt-invoice.2022-06-30-preview.result.json)

### Supported document fields

#### Document type - `invoice`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CustomerName`|`string`|Customer being invoiced|Microsoft Corp|
|`CustomerId`|`string`|Reference ID for the customer|CID-12345|
|`PurchaseOrder`|`string`|A purchase order reference number|PO-3333|
|`InvoiceId`|`string`|ID for this specific invoice (often 'Invoice Number')|INV-100|
|`InvoiceDate`|`date`|Date the invoice was issued|11/15/2019|
|`DueDate`|`date`|Date payment for this invoice is due|12/15/2019|
|`VendorName`|`string`|Vendor who has created this invoice|CONTOSO LTD.|
|`VendorAddress`|`string`|Mailing address for the Vendor|123 456th St New York, NY, 10001|
|`VendorAddressRecipient`|`string`|Name associated with the VendorAddress|Contoso Headquarters|
|`CustomerAddress`|`string`|Mailing address for the Customer|123 Other St, Redmond WA, 98052|
|`CustomerAddressRecipient`|`string`|Name associated with the CustomerAddress|Microsoft Corp|
|`BillingAddress`|`string`|Explicit billing address for the customer|123 Bill St, Redmond WA, 98052|
|`BillingAddressRecipient`|`string`|Name associated with the BillingAddress|Microsoft Services|
|`ShippingAddress`|`string`|Explicit shipping address for the customer|123 Ship St, Redmond WA, 98052|
|`ShippingAddressRecipient`|`string`|Name associated with the ShippingAddress|Microsoft Delivery|
|`SubTotal`|`currency`|Subtotal field identified on this invoice|$100.00|
|`TotalTax`|`currency`|Total tax field identified on this invoice|$10.00|
|`InvoiceTotal`|`currency`|Total new charges associated with this invoice|$110.00|
|`AmountDue`|`currency`|Total Amount Due to the vendor|$610.00|
|`PreviousUnpaidBalance`|`currency`|Explicit previously unpaid balance|$500.00|
|`RemittanceAddress`|`string`|Explicit remittance or payment address for the customer|123 Remit St New York, NY, 10001|
|`RemittanceAddressRecipient`|`string`|Name associated with the RemittanceAddress|Contoso Billing|
|`ServiceAddress`|`string`|Explicit service address or property address for the customer|123 Service St, Redmond WA, 98052|
|`ServiceAddressRecipient`|`string`|Name associated with the ServiceAddress|Microsoft Services|
|`ServiceStartDate`|`date`|First date for the service period (for example, a utility bill service period)|10/14/2019|
|`ServiceEndDate`|`date`|End date for the service period (for example, a utility bill service period)|11/14/2019|
|`TotalVAT`|`currency`|Total VAT tax amount in document|€10.00|
|`VendorTaxId`|`string`|The government ID number associated with the vendor|123456-7|
|`CustomerTaxId`|`string`|The government ID number associated with the customer|765432-1|
|`PaymentTerm`|`string`|The terms under which the payment is meant to be paid|Net90|
|`Items`|`array`|List of line items||
|`Items.*`|`object`|A single line item|3/4/2021<br>A123<br>Consulting Services<br>2 hours<br>$30.00<br>10%<br>$60.00|
|`Items.*.Amount`|`currency`|The amount of the line item|$60.00|
|`Items.*.Date`|`date`|Date corresponding to each line item. Often it is a date the line item was shipped|3/4/2021|
|`Items.*.Description`|`string`|The text description for the invoice line item|Consulting service|
|`Items.*.Quantity`|`number`|The quantity for this invoice line item|2|
|`Items.*.ProductCode`|`string`|Product code, product number, or SKU associated with the specific line item|A123|
|`Items.*.Tax`|`currency`|Tax associated with each line item. Possible values include tax amount, tax %, and tax Y/N|$6.00|
|`Items.*.Unit`|`string`|The unit of the line item, e.g, kg, lb etc.|hours|
|`Items.*.UnitPrice`|`currency`|The net or gross price (depending on the gross invoice setting of the invoice) of one unit of this item|$30.00|
|`Items.*.VAT`|`currency`|Value added tax: this is the flat tax levied on an item|€10.00|

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
<tr><td rowspan=27>(default)</td><td>English (United States)</td><td><code>en-US</code></td></tr>
<tr><td>Spanish</td><td><code>es</code></td></tr>
<tr><td>Spanish (Argentina)</td><td><code>es-AR</code></td></tr>
<tr><td>Spanish (Bolivia)</td><td><code>es-BO</code></td></tr>
<tr><td>Spanish (Chile)</td><td><code>es-CL</code></td></tr>
<tr><td>Spanish (Colombia)</td><td><code>es-CO</code></td></tr>
<tr><td>Northern Sami (Costa Rica)</td><td><code>se-CR</code></td></tr>
<tr><td>Northern Sami (Dominican Republic)</td><td><code>se-DO</code></td></tr>
<tr><td>Spanish (Ecuador)</td><td><code>es-EC</code></td></tr>
<tr><td>Spanish (Spain)</td><td><code>es-ES</code></td></tr>
<tr><td>Spanish (Guatemala)</td><td><code>es-GT</code></td></tr>
<tr><td>Spanish (Honduras)</td><td><code>es-HN</code></td></tr>
<tr><td>Spanish (Mexico)</td><td><code>es-MX</code></td></tr>
<tr><td>Spanish (Nicaragua)</td><td><code>es-NI</code></td></tr>
<tr><td>Spanish (Panama)</td><td><code>es-PA</code></td></tr>
<tr><td>Spanish (Peru)</td><td><code>es-PE</code></td></tr>
<tr><td>Spanish (Puerto Rico)</td><td><code>es-PR</code></td></tr>
<tr><td>Spanish (Paraguay)</td><td><code>es-PY</code></td></tr>
<tr><td>Spanish (El Salvador)</td><td><code>es-SV</code></td></tr>
<tr><td>Spanish (United States)</td><td><code>es-US</code></td></tr>
<tr><td>Spanish (Uruguay)</td><td><code>es-UY</code></td></tr>
<tr><td>Spanish (Venezuela)</td><td><code>es-VE</code></td></tr>
<tr><td>German (Germany)</td><td><code>de-DE</code></td></tr>
<tr><td>French (France)</td><td><code>fr-FR</code></td></tr>
<tr><td>Italian (Italy)</td><td><code>it-IT</code></td></tr>
<tr><td>Portuguese (Portugal)</td><td><code>pt-PT</code></td></tr>
<tr><td>Dutch (Netherlands)</td><td><code>nl-NL</code></td></tr>
    </tbody >
</table >

### Supported features

`prebuilt-invoice` outputs the following elements in the result JSON:
* `pages.*.words`
* `pages.*.lines`
* `paragraphs`
* `styles`
* `documents`
* `documents.*.fields`


### Sample code

::: zone pivot="programming-language-csharp"

::: code src="prebuilt-models/sample-code/csharp/prebuilt-invoice.2022-06-30-preview.cs" lang="csharp" :::

::: zone-end

::: zone pivot="programming-language-python"

::: code src="prebuilt-models/sample-code/python/prebuilt-invoice.2022-06-30-preview.py" lang="python" :::

::: zone-end



## [2.1](#tab/2.1)

### Example

:::image type="content" source="prebuilt-models/media/prebuilt-invoice.2.1.jpg" alt-text="sample invoice":::
- [Example document](https://formrecognizer.appliedai.azure.com/documents/samples/prebuilt/invoice-english.pdf)
- [Example result](prebuilt-models/samples/prebuilt-invoice.2.1.result.json)

### Supported document fields

#### Document type - `invoice`
| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CustomerName`|`string`|Customer being invoiced|Microsoft Corp|
|`CustomerId`|`string`|Reference ID for the customer|CID-12345|
|`PurchaseOrder`|`string`|A purchase order reference number|PO-3333|
|`InvoiceId`|`string`|ID for this specific invoice (often 'Invoice Number')|INV-100|
|`InvoiceDate`|`date`|Date the invoice was issued|11/15/2019|
|`DueDate`|`date`|Date payment for this invoice is due|12/15/2019|
|`VendorName`|`string`|Vendor who has created this invoice|CONTOSO LTD.|
|`VendorAddress`|`string`|Mailing address for the Vendor|123 456th St New York, NY, 10001|
|`VendorAddressRecipient`|`string`|Name associated with the VendorAddress|Contoso Headquarters|
|`CustomerAddress`|`string`|Mailing address for the Customer|123 Other St, Redmond WA, 98052|
|`CustomerAddressRecipient`|`string`|Name associated with the CustomerAddress|Microsoft Corp|
|`BillingAddress`|`string`|Explicit billing address for the customer|123 Bill St, Redmond WA, 98052|
|`BillingAddressRecipient`|`string`|Name associated with the BillingAddress|Microsoft Services|
|`ShippingAddress`|`string`|Explicit shipping address for the customer|123 Ship St, Redmond WA, 98052|
|`ShippingAddressRecipient`|`string`|Name associated with the ShippingAddress|Microsoft Delivery|
|`SubTotal`|`number`|Subtotal field identified on this invoice|$100.00|
|`TotalTax`|`number`|Total tax field identified on this invoice|$10.00|
|`InvoiceTotal`|`number`|Total new charges associated with this invoice|$110.00|
|`AmountDue`|`number`|Total Amount Due to the vendor|$610.00|
|`PreviousUnpaidBalance`|`number`|Explicit previously unpaid balance|$500.00|
|`RemittanceAddress`|`string`|Explicit remittance or payment address for the customer|123 Remit St New York, NY, 10001|
|`RemittanceAddressRecipient`|`string`|Name associated with the RemittanceAddress|Contoso Billing|
|`ServiceAddress`|`string`|Explicit service address or property address for the customer|123 Service St, Redmond WA, 98052|
|`ServiceAddressRecipient`|`string`|Name associated with the ServiceAddress|Microsoft Services|
|`ServiceStartDate`|`date`|First date for the service period (for example, a utility bill service period)|10/14/2019|
|`ServiceEndDate`|`date`|End date for the service period (for example, a utility bill service period)|11/14/2019|
|`Items`|`array`|List of line items||
|`Items.*`|`object`|A single line item|3/4/2021<br>A123<br>Consulting Services<br>2 hours<br>$30.00<br>10%<br>$60.00|
|`Items.*.Amount`|`number`|The amount of the line item|$60.00|
|`Items.*.Date`|`date`|Date corresponding to each line item. Often it is a date the line item was shipped|3/4/2021|
|`Items.*.Description`|`string`|The text description for the invoice line item|Consulting service|
|`Items.*.Quantity`|`number`|The quantity for this invoice line item|2|
|`Items.*.ProductCode`|`string`|Product code, product number, or SKU associated with the specific line item|A123|
|`Items.*.Tax`|`number`|Tax associated with each line item. Possible values include tax amount, tax %, and tax Y/N|10%|
|`Items.*.Unit`|`string`|The unit of the line item, e.g, kg, lb etc.|hours|
|`Items.*.UnitPrice`|`number`|The net or gross price (depending on the gross invoice setting of the invoice) of one unit of this item|$30.00|

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

`prebuilt-invoice` outputs the following elements in the result JSON:
* `readResults`
* `documentResults`
* `documentResults.*.fields`



