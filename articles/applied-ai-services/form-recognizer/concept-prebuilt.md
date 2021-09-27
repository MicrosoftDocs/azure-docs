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
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer prebuilt models

 Form Recognizer prebuilt models enable you to add intelligent form processing to your apps and flows without have to train and build your own models. Prebuilt models use optical character recognition (OCR) to identify and extract predefined text and data fields common to specific form and document types. Form Recognizer then  returns the extracted data in an organized structured JSON response. Form Recognizer v2.1 supports invoice, receipt, identity document, and business card models:

## Models

| **Prebuilt model**   | **Description**   |
| --- | --- |
| Invoice  | Extracts key information from English-text invoices.  |
| Receipt  | Extracts key information from English-text receipts.  |
| Identity document  | Extracts key information from US driver licenses and international passports.  |
|Business cards  | Extracts key information from English-text business cards.  |

## Data extraction

| **Model ID**   | **Text**    | **Document Analysis**   |**Selection Marks**   | **Tables**   | 
| --- | :---: |:---:| :---: | :---: |
| Invoice  | **✓**  | **✓**  | **✓**  |  **✓**  |
| Receipt  | **✓**  |   **✓** |   |  |
| Identity document  | **✓**  |   **✓**  |   |   |
| Business Card  | **✓**  |   **✓** |   |   |

## Supported languages and locales

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Invoice| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|
|Receipt</br><br>Business card| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li></ul>  | Auto-detected |
 |Identity document| <ul><li>English (United States)—en-US (driver's license)</li><li>Biographical pages from international passports</br> (excluding visa and other travel documents)</li></ul></br>|English (United States)—en-US|

## Invoice model

Azure Form Recognizer prebuilt invoice model analyzes and extracts information from sales invoices using its prebuilt invoice models. The Invoice API enables customers to take invoices in various formats and return structured data to automate the invoice processing. It combines our powerful Optical Character Recognition (OCR) capabilities with invoice understanding deep learning models to extract key information from invoices written in English. The prebuilt Invoice API is publicly available in the Form Recognizer v2.

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

## Receipt model

Azure Form Recognizer can analyze and extract information from sales receipts using its prebuilt receipt model. It combines our powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key information such as merchant name, merchant phone number, transaction date, transaction total, and more from receipts written in English.

The Prebuilt Receipt model is used for reading English sales receipts from Australia, Canada, Great Britain, India, and the United States&mdash;the type used by restaurants, gas stations, retail, and so on. This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes, line items, totals and more. In addition, the prebuilt receipt model is trained to analyze and return all of the text on a receipt.

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

## Identity document model

Azure Form Recognizer can analyze and extract information from government-issued identification documents (IDs) using its prebuilt IDs model. It combines our powerful Optical Character Recognition (OCR) capabilities with ID recognition capabilities to extract key information from Worldwide Passports and U.S. Driver's Licenses (all 50 states and D.C.). The IDs API extracts key information from these identity documents, such as first name, last name, date of birth, document number, and more. This API is available in the Form Recognizer v2.1 as a cloud service.

The Identity documents  (ID) model enables you to extract key information from world-wide passports and US driver licenses. It extracts data such as the document ID, expiration date of birth, date of expiration, name, country, region, machine-readable zone and more.

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

## Business card model

Azure Form Recognizer can analyze and extract contact information from business cards using its prebuilt business cards model. It combines powerful Optical Character Recognition (OCR) capabilities with our business card understanding model to extract key information from business cards in English and is publicly available in the Form Recognizer v2.1.

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

