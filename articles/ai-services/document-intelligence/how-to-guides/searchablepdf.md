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

Searchable PDF offers converting an analog PDF, such as scanned image files of PDF, into a PDF with embedded text. The embedded text enables deep text search within the PDF's extracted content by overlaying the detected text entities on top of the image files.

 > [!IMPORTANT]
 > Currently, this feature is only supported by Read OCR model `prebuilt-read`. When using this feature, please specify the `modelId` as `prebuilt-read`, as other model types will return error for this preview version.

## Searchable PDF APIs

To use searchable PDF, you can do a `POST` call using our prebuilt `analyze` feature, and specifying the output format as pdf.

```
POST /documentModels/prebuilt-read:analyze?output=pdf
{...}
202
```

Once the analyze operation has been finished, you can do a `GET` call to retrieve the analysis results.

Upon successful completion, the PDF can be retrieved and downloaded as `application/pdf`. This operation allows directly downloading the embedded text form of PDF instead of Base64-encoded JSON.
```
// Monitor the operation until completion.
GET /documentModels/prebuilt-read/analyzeResults/{resultId}
200
{...}

// Upon successful completion, retrieve the PDF as application/pdf.
GET /documentModels/prebuilt-read/analyzeResults/{resultId}/pdf
200 OK
Content-Type: application/pdf
```

## Pricing

Searchable PDF is currently free for all customers. There is no need to pay anything more than the `prebuilt-read` model usage cost for the general PDF consumption.