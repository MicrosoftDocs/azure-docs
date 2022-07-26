---
author: laujan
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/14/2022
ms.author: lajanuar
ms.custom: ignite-fall-2021
---
<!-- markdownlint-disable MD041 -->

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location. Additionally, the newest API version `2022-06-30-preview` supports Microsoft Word (DOCX), Excel (XLS), PowerPoint (PPT), and HTML files in Read model.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* * The minimum height of the text to be extracted is 12 pixels for a 1024X768 image. This dimension corresponds to about eight font point text at 150 DPI.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
