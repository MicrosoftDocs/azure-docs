---
title: Prebuilt models - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction using prebuilt models
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 09/23/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer prebuilt models

 Form Recognizer prebuilt models enable you to add intelligent form processing to your apps and flows without have to train and build your own models. Prebuilt models use optical character recognition (OCR) to identify and extract predefined text and data fields common to specific form and document types. Form Recognizer then  returns the extracted data in an organized structured JSON response. Form Recognizer v2.1 supports invoice, receipt, ID document, and business card models.

## Model overview

| **Model**   | **Description**   |
| --- | --- |
| Invoice  | Extracts key information from English-text invoices.  |
| Receipt  | Extracts key information from English-text receipts.  |
| ID document  | Extracts key information from US driver licenses and international passports.  |
|Business cards  | Extracts key information from English-text business cards.  |

### Input requirements

* For best results, provide one clear photo or scan per document.
* Supported file formats: JPEG, PNG, PDF, BMP and TIFF.
* For PDF and TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed.
* The file size must be less than 50 MB.
* For images (JPEG, PNG, BMP, TIFF), the dimensions must be at least 50 x 50 pixels and at most 10,000 x 10,000 pixels.
* PDF dimensions cannot exceed 17 x 17 inches (Legal or A3 paper sizes).
* For more guidance, *see*  our [**Overview**](overview.md#input-requirements) documentation.

## Invoice

Azure Form Recognizer invoice model analyzes and extracts key information from sales invoices. The Invoice API enables you to automate invoice processing by taking invoices in various formats and returning structured data. It combines our powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key information such as customer name, billing address, due date, and amount due from English-language invoices.

The Invoice API also powers the [AI Builder invoice processing prebuilt model](/ai-builder/flow-invoice-processing).

##### Sample invoice processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

## Receipt

Azure Form Recognizer receipt model analyzes and extracts key information from sales receipts. It combines our powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key information such as merchant name, merchant phone number, transaction date, tax, and transaction total from English-language receipts.

The Receipt API also powers the [AI Builder receipt processing prebuilt model](/ai-builder/flow-receipt-processing).

##### Sample receipt processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

## ID document

Azure Form Recognizer prebuilt ID document model analyzes and extracts key information from U.S. Driver's Licenses (all 50 states and District of Columbia.) and the biographical page from international passports (excluding visa and other travel documents). It combines our powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key information such as  first name, last name, address, expiration date, and date of birth.

The ID Document API also powers the [AI Builder ID reader prebuilt model](/ai-builder/id-reader).

##### Sample U.S. Driver's License processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

## Business card

Azure Form Recognizer business card model analyzes and extracts key information from business card images . It combines powerful Optical Character Recognition (OCR) capabilities with our business card understanding model to extract key information from business cards in English and is publicly available in the Form Recognizer v2.1.

The Business Card API also powers the [AI Builder Business reader prebuilt model](/ai-builder/prebuilt-business-card).

##### Sample business card processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

### Data extraction

| **Model ID**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |
| --- | :---: |:---:| :---: | :---: |
| Invoice  | ✓ | ✓  | ✓  | ✓  
| Receipt  | ✓  |   ✓ |   |  |
| ID document  | ✓  |   ✓  |   |   |
| Business Card  | ✓  |   ✓ |   |   |

## Key-value pair fields

### [Invoice](#tab/invoice)

|Name| Type | Description | Standardized output <img width=500>|
|:-----|:----|:----|:---:|
| CustomerName | string | Invoiced customer| |
| CustomerId | string | Customer reference ID | |
| PurchaseOrder | string | Purchase order reference number | |
| InvoiceId | string | ID for this specific invoice (often "Invoice Number") | |
| InvoiceDate | date | Date the invoice was issued | yyyy-mm-dd|
| DueDate | date | Date payment for this invoice is due | yyyy-mm-dd|
| VendorName | string | Vendor name |  |
| VendorAddress | string |  Vendor mailing address|  |
| VendorAddressRecipient | string | Name associated with the VendorAddress |  |
| CustomerAddress | string | Mailing address for the Customer | |
| CustomerAddressRecipient | string | Name associated with the CustomerAddress | |
| BillingAddress | string | Explicit billing address for the customer |  |
| BillingAddressRecipient | string | Name associated with the BillingAddress | |
| ShippingAddress | string | Explicit shipping address for the customer | |
| ShippingAddressRecipient | string | Name associated with the ShippingAddress |  |
| SubTotal | number | Subtotal field identified on this invoice | integer |
| TotalTax | number | Total tax field identified on this invoice | integer |
| InvoiceTotal | number (USD) | Total new charges associated with this invoice | integer |
| AmountDue |  number (USD) | Total Amount Due to the vendor | integer |
| ServiceAddress | string | Explicit service address or property address for the customer | |
| ServiceAddressRecipient | string | Name associated with the ServiceAddress |  |
| RemittanceAddress | string | Explicit remittance or payment address for the customer |   |
| RemittanceAddressRecipient | string | Name associated with the RemittanceAddress |  |
| ServiceStartDate | date | First date for the service period (for example, a utility bill service period) | yyyy-mm-dd |
| ServiceEndDate | date | End date for the service period (for example, a utility bill service period) | yyyy-mm-dd|
| PreviousUnpaidBalance | number | Explicit previously unpaid balance | integer |

### [Receipt](#tab/receipt)

|Name| Type | Description | Standardized output <img width=500> |
|:-----|:----|:----|:----|
| ReceiptType | string | Type of sales receipt |  Itemized |
| MerchantName | string | Name of the merchant issuing the receipt |  |
| MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx |
| MerchantAddress | string | Listed address of merchant |   |
| TransactionDate | date | Date the receipt was issued | yyyy-mm-dd |
| TransactionTime | time | Time the receipt was issued | hh-mm-ss (24-hour)  |
| Total | number (USD)| Full transaction total of receipt | Two-decimal float|
| Subtotal | number (USD) | Subtotal of receipt, often before taxes are applied | Two-decimal float|
| Tax | number (USD) | Tax on receipt, often sales tax or equivalent | Two-decimal float |
| Tip | number (USD) | Tip included by buyer | Two-decimal float|
| Items | array of objects | Extracted line items, with name, quantity, unit price, and total price extracted | |
| Name | string | Item name | |
| Quantity | number | Quantity of each item | integer |
| Price | number | Individual price of each item unit| Two-decimal float |
| Total Price | number | Total price of line item | Two-decimal float |

### [ID document](#tab/id)

|Name| Type | Description | Standardized output <img width=500>|
|:-----|:----|:----|:----|
|  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  DateOfBirth | date | DOB | yyyy-mm-dd |
|  DateOfExpiration | date | Expiration date DOB | yyyy-mm-dd |
|  DocumentNumber | string | Relevant passport number, driver's license number, etc. |  |
|  FirstName | string | Extracted given name and middle initial if applicable |  |
|  LastName | string | Extracted surname |  |
|  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  Sex | string | Possible extracted values include "M", "F" and "X" | |
|  MachineReadableZone | object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
|  DocumentType | string | Document type, for example, Passport, Driver's License | "passport" |
|  Address | string | Extracted address (Driver's License only) ||
|  Region | string | Extracted region, state, province, etc. (Driver's License only) |  |

### [Business card](#tab/businesscard)

|Name| Type | Description | Text | Value (standardized output) |
|:-----|:----|:----|:----|:----|
| ContactNames | array of objects | Contact name |  |
| FirstName | string | First (given) name of contact |  |
| LastName | string | Last (family) name of contact |  |
| CompanyNames | array of strings | Company name(s)|  |
| Departments | array of strings | Department(s) or organization(s) of contact |  |
| JobTitles | array of strings | Listed Job title(s) of contact |  |
| Emails | array of strings | Contact email address(es) |  |
| Websites | array of strings | Company website(s) |  |
| Addresses | array of strings | Address(es) extracted from business card | |
| MobilePhones | array of phone numbers | Mobile phone number(s) from business card |+1 xxx xxx xxxx |
| Faxes | array of phone numbers | Fax phone number(s) from business card | +1 xxx xxx xxxx |
| WorkPhones | array of phone numbers | Work phone number(s) from business card | +1 xxx xxx xxxx | 
| OtherPhones     | array of phone numbers | Other phone number(s) from business card | +1 xxx xxx xxxx |

## Supported languages and locales v2.1

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Invoice| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|
|Receipt</br><br>Business card| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li></ul>  | Auto-detected |
 |ID document| <ul><li>English (United States)—en-US (driver's license)</li><li>Biographical pages from international passports</br> (excluding visa and other travel documents)</li></ul></br>|English (United States)—en-US|

## Next steps

* [**Try processing your own forms and documents**](quickstarts/try-sample-label-tool.md) with our [**Form Recognizer sample tool**](https://fott-2-1.azurewebsites.net/)

* Complete a [**Form Recognizer quickstart**](quickstarts/try-sdk-rest-api.md) to get started creating a form processing app with Form Recognizer in the development language of your choice.