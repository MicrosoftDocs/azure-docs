---
title: Prebuilt model field detection - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn the supported data extraction fields for Form Recognizer prebuilt models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 09/24/2021
ms.author: lajanuar
---

# Supported prebuilt model data extraction fields

Use this article to identify the data fields that can be extracted using a Form Recognizer prebuilt model. Prebuilt models use optical character recognition (OCR) to identify and extract predefined text and data fields common to specific form and document types. Form Recognizer supports invoice, receipt, identity document and business card prebuilt models.

## Field detection

The fields that can be detected by each model are listed below:

### [Invoice](#tab/invoice)

|Property | Data type | Definition|
|----------|------------| -----------|
|     AmountDue                             |     Amount due as written on the invoice                                                                            |
|     Amount due   (number)                           |     Amount due in standardized number format. Example: 1234.98                                                      |
|     Confidence of   amount due                      |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Billing   address                               |     Billing   address                                                                                               |
|     Confidence of   billing address                 |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Billing   address recipient                     |     Billing   address recipient                                                                                     |
|     Confidence of   billing address recipient       |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Customer   address                              |     Customer address                                                                                                |
|     Confidence of   customer address                |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Customer   address recipient                    |     Customer address recipient                                                                                      |
|     Confidence of   customer address recipient      |     How confident the model is in its prediction. Score between 0 (low confidence) and 1 (high   confidence).       |
|     Customer ID                                     |     Customer ID                                                                                                     |
|     Confidence of   customer ID                     |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Customer name                                   |     Customer name                                                                                                   |
|     Confidence of   customer name                   |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Due date   (text)                               |     Due date as written on the invoice                                                                              |
|     Due date   (date)                               |     Due date in standardized   date format. Example: 2019-05-31                                           |
|     Confidence of   due date                        |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Invoice date   (text)                           |     Invoice date   as written on the invoice                                                                        |
|     Invoice date   (date)                           |     Invoice date   in standardized date format. Example: 2019-05-31                                       |
|     Confidence of   invoice date                    |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Invoice ID                                      |     Invoice ID                                                                                                      |
|     Confidence of   invoice ID                      |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Invoice total   (text)                          |     Invoice total   as written on the invoice                                                                       |
|     Invoice total   (number)                        |     Invoice total   in standardized date format. Example: 2019-05-31                                      |
|     Confidence of   invoice total                   |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Line Items                                      |     The line items extracted from the invoice. Confidence scores are available for each column.  <ul><li>**Line item amount**: Amount for a line item. Returned in text and number format.</li><li>**Line item description**: Description for a line item. Returned in text format.</li><li>**Line item quantity**: Quantity for a line item. Returned in text and number format.</li><li>**Line item unit price**: Unit price for a line item. Returned in text and number format.</li><li>**Line item product code**: Product code for a line item. Returned in text format.</li><li>**Line item unit**: Unit for a line item (for example, kg and lb). Returned in text format.</li><li>**Line item date**: Date for a line item. Returned in text and date format.</li><li>**Line item tax**: Tax for a line item. Returned in text and number format.</li><li>**Line item all columns**: Returns all the columns from the line item as a line of text.</li></ul>                                               |
|     Purchase   order                                |     Purchase   order                                                                                                |
|     Confidence of   purchase order                  |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Remittance   address                            |     Remittance   address                                                                                            |
|     Confidence of   remittance address              |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Remittance   address recipient                  |     Remittance   address recipient                                                                                  |
|     Confidence of   remittance address recipient    |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Service   address                               |     Service   address                                                                                               |
|     Confidence of   service address                 |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Service   address recipient                     |     Service   address recipient                                                                                     |
|     Confidence of   service address recipient       |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Shipping   address                              |     Shipping   address                                                                                              |
|     Confidence of   shipping address                |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Shipping   address recipient                    |     Shipping   address recipient                                                                                    |
|     Confidence of   shipping address recipient      |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Subtotal   (text)                               |     Subtotal as written on the invoice                                                                              |
|     Subtotal   (number)                             |     Subtotal in standardized number format. Example: 1234.98                                                        |
|     Confidence of   subtotal                        |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Total tax   (text)                              |     Total tax as written on the invoice                                                                             |
|     Total tax   (number)                            |     Total tax in standardized number format. Example: 1234.98                                                       |
|     Confidence of   total tax                       |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Vendor   address                                |     Vendor   address                                                                                                |
|     Confidence of   vendor address                  |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Vendor   address recipient                      |     Vendor   address recipient                                                                                      |
|     Confidence of   vendor address recipient        |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Vendor name                                     |     Vendor name                                                                                                     |
|     Confidence of   vendor name                     |     How confident the model is in its prediction. Score between 0 (low confidence)   and 1 (high confidence).       |
|     Detected text                                   |     Line of recognized text from running OCR on an invoice. Returned as a part of a list of text.                   |
|     Page number   of detected text                  |     Page on which the line of recognized text was found. Returned as a part of a list of text.                      |
