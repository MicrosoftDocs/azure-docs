---
title: "Searchable PDF"
titleSuffix: Azure AI services
description: Learn how to use searchable PDFs
author: ginle
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/22/2024
ms.author: lajanuar
---

# Searchable PDF

Searchable PDF offers converting an analog PDF, such as a scanned image of a PDF page, into a PDF with embedded text. The embedded text enables deep text search within the PDF's extracted content, and allows the PDF content to be used for various applications, such as Large Language Model (LLM) chat scenarios.

 > [!IMPORTANT]
 > Currently, this feature is only supported by Read OCR model `prebuilt-read`. When using this feature, please specify the `modelId` as `prebuilt-read`, as other model types will return error for this preview version.

## How to use Searchable PDF


To use searchable PDF, user can call `analyzeResults` GET operation: 

```bash
GET "{endpoint}/documentintelligence/documentModels/prebuilt-read/analyzeResults/{resultId}"
```


• inod Kurpad
I think you should just frame it a little bit in terms of the scenario, right?
• 
Vinod Kurpad
So just frame it into the same like OK, if you have a a PDF document that is your scanned image of like say a document, ensuring that you can, you can search through the document is required for a lot of like a number of scenarios require that right and with the searchable PDF we we take an input document we run that through the yeah through the private green model extract all the text and generate a PDF output that that overlays the text extracted with the content to ensure that when you search through that that document you.



```bash
POST "{endpoint}/documentintelligence/documentModels/prebuilt-read:analyze?output=pdf"
```




Upon successful completion, the PDF can be retrieved and downloaded as `application/pdf`. This operation allows directly downloading the embedded text form of PDF instead of Base64-encoded JSON.

```bash
GET /documentModels/prebuilt-read/analyzeResults/{resultId}/pdf
200 OK
Content-Type: application/pdf
```

## Languages
English, latin languages

## Pricing

Searchable PDF is currently free for all customers. There is no need to pay anything more than the `prebuilt-read` model usage cost for the general PDF consumption.

```bash
GET "{endpoint}/documentintelligence/documentModels/prebuilt-read/analyzeResults/{resultId}"
```