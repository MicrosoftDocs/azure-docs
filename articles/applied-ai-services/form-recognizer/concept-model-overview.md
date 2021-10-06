---
title: Form Recognizer models
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt models
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/05/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer prebuilt models

 Azure Form Recognizer prebuilt models enable you to add intelligent form processing to your apps and flows without have to train and build your own models. Prebuilt models use optical character recognition (OCR) combined with deep learning models to identify and extract predefined text and data fields common to specific form and document types. Form Recognizer extracts analyzes form and document data then  returns an organized, structured JSON response. Form Recognizer v2.1 supports invoice, receipt, ID document, and business card models.

## Model overview

| **Model**   | **Description**   |
| --- | --- |
| [Layout](#layout)  | Extracts text and layout information from documents.  |
| [Invoice](#invoice)  | Extract key information from English invoices.  |
| [Receipt](#receipt)  | Extract key information from English receipts.  |
| [ID document](#id-document)  | Extract key information from US driver licenses and international passports.  |
| [Business card](#business-card)  | Extract key information from English business cards.  |
| 🆕[General document (preview)](#general-document) | Extract text, tables, structure, key-value pairs and named entities.  |

### Layout

The Layout API analyzes and extracts text, tables and headers, selection marks, and structure information from documents and returns a structured JSON data representation.

##### Sample form processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/)  layout feature:

:::image type="content" source="media/overview-layout.png" alt-text="{alt-text}":::

### Invoice

The invoice model analyzes and extracts key information from sales invoices. The API analyzes invoices in various formats; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation.

##### Sample invoice processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

The receipt model analyzes and extracts key information from sales receipts. The API analyzes printed and handwritten receipts; extracts key information such as merchant name, merchant phone number, transaction date, tax, and transaction total; and returns a structured JSON data representation.

##### Sample receipt processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### ID document

The ID document model analyzes and extracts key information from U.S. Driver's Licenses (all 50 states and District of Columbia) and international passport biographical pages (excluding visa and other travel documents). The API analyzes identity documents; extracts key information such as first name, last name, address, and date of birth; and returns a structured JSON data representation.

##### Sample U.S. Driver's License processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

The business card model analyzes and extracts key information from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.

##### Sample business card processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### General document

* The general document API supports most form types and will analyze your documents and associate values to keys and entries to tables that it discovers. It is ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to [training a custom model without labels](concept-custom.md#train-without-labels).

* The general document is a pre-trained model and can be directly invoked via the REST API.

* The general document model supports named entity recognition (NER) for several entity categories. NER is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization. Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted from the entire content.

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-general-document.md)

## Data extraction

| **Model ID**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   | **Entitites**|
| --- | :---: |:---:| :---: | :---: | :---: |
| Invoice  | ✓ | ✓  | ✓  | ✓  | |
| Receipt  | ✓  |   ✓ |   |  | |
| ID document  | ✓  |   ✓  |   |   | |
| Business Card  | ✓  |   ✓ |   |   | |

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * data must contain keys and values.
  * keys must appear above or to the left of the values; they can't appear below or to the right.

> [!NOTE]
> The [sample labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Form Recognizer preview v3.0

  Form Recognizer v3.0 (preview) introduces several new features and capabilities:

* [**General document (preview)**](concept-general-document.md) model is a new API that uses a pre-trained model to extract text, tables, structure, key-value pairs, and named entities from forms and documents.
* [**Receipt (preview)**](concept-receipt.md) model supports single-page hotel receipt processing.
* [**ID document (preview)**](concept-id-document.md) model supports endorsements, restrictions, and vehicle classification extraction from US driver's licenses.
* [**Custom model API (preview)**](concept-custom.md) supports signature detection for custom forms.

  #### Prebuilt model data extraction

  | **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |**Entities** |
  | --- | :---: |:---:| :---: | :---: |:---: |
  |🆕General document  | ✓  |  ✓ | ✓  | ✓  | ✓  |
  | Layout  | ✓  |   | ✓  | ✓  |   |
  | Invoice  | ✓ | ✓  | ✓  | ✓ ||
  |Receipt  | ✓  |   ✓ |   |  ||
  | ID document | ✓  |   ✓  |   |   ||
  | Business card    | ✓  |   ✓ |   |   ||

### Version migration

Learn how to use Form Recognizer v3.0 in your applications by following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md)

## Next steps

* [Learn how to process your own forms and documents](quickstarts/try-sample-label-tool.md) with our [Form Recognizer sample tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md) and get started creating a form processing app in the development language of your choice.


## Key-value pair extraction

### [Invoice](#tab/invoice)

|Name| Type | Description | Standardized output |
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

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:----|
| ReceiptType | string | Type of sales receipt |  Itemized |
| MerchantName | string | Name of the merchant issuing the receipt |  |
| MerchantPhoneNumber | phoneNumber | Listed phone number of merchant | +1 xxx xxx xxxx |
| MerchantAddress | string | Listed address of merchant |   |
| TransactionDate | date | Date the receipt was issued | yyyy-mm-dd |
| TransactionTime | time | Time the receipt was issued | hh-mm-ss (24-hour)  |
| Total | number (USD)| Full transaction total of receipt | Two-decimal float|
| Subtotal | number (USD) | Subtotal of receipt, often before taxes are applied | Two-decimal float|
| Tax | number (USD) | Tax on receipt (often sales tax or equivalent) | Two-decimal float |
| Tip | number (USD) | Tip included by buyer | Two-decimal float|
| Items | array of objects | Extracted line items, with name, quantity, unit price, and total price extracted | |
| Name | string | Item name | |
| Quantity | number | Quantity of each item | integer |
| Price | number | Individual price of each item unit| Two-decimal float |
| Total Price | number | Total price of line item | Two-decimal float |

### [ID document](#tab/id)

|Name| Type | Description | Standardized output |
|:-----|:----|:----|:----|
|  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  DateOfBirth | date | DOB | yyyy-mm-dd |
|  DateOfExpiration | date | Expiration date DOB | yyyy-mm-dd |
|  DocumentNumber | string | Passport number, driver's license number, etc. |  |
|  FirstName | string | Extracted given name and middle initial if applicable |  |
|  LastName | string | Extracted surname |  |
|  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  Sex | string | Possible extracted values include "M", "F" and "X" | |
|  MachineReadableZone | object | Extracted Passport MRZ including two lines of 44 characters each | |
|  DocumentType | string | Document type, for example, Passport, Driver's License | |
|  Address | string | Extracted address (Driver's License only) ||
|  Region | string | Extracted region, state, province, etc. (Driver's License only) |  |

### [Business card](#tab/businesscard)

|Name| Type | Description |Standardized output |
|:-----|:----|:----|:----:|
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

