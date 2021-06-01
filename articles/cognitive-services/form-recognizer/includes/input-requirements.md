---
author: laujan
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/27/2019
ms.author: lajanuar
---

Form Recognizer works on input documents that meet these requirements:

* Format must be JPG, PNG, PDF (text or scanned), or TIFF. Text-embedded PDFs are best because there's no possibility of error in character extraction and location.
* File size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions must be at most 17 x 17 inches, corresponding to Legal or A3 paper sizes and smaller.
* For PDF and TIFF, only the first 200 pages are processed (with a free tier subscription, only the first two pages are processed).
* The total size of the training data set must be 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submitting them.
* If scanned from paper documents, forms should be high-quality scans.
* For unsupervised learning (without labeled data), data must contain keys and values.
* For unsupervised learning (without labeled data), keys must appear above or to the left of the values; they can't appear below or to the right.
