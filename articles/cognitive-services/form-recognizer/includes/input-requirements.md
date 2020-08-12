---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/27/2019
ms.author: pafarley
---

Form Recognizer works on input documents that meet these requirements:

* Format must be JPG, PNG, PDF (text or scanned), or TIFF. Text-embedded PDFs are best because there's no possibility of error in character extraction and location.
* If your PDFs are password-locked, you must remove the lock before submitting them.
* PDF and TIFF documents must be 200 pages or less, and the total size of the training data set must be 500 pages or less.
* For images, dimensions must be between 600 x 100 pixels and 4200 x 4200 pixels.
* If scanned from paper documents, forms should be high-quality scans.
* Text must use the Latin alphabet (English characters).
* For unsupervised learning (without labeled data), data must contain keys and values.
* For unsupervised learning (without labeled data), keys must appear above or to the left of the values; they can't appear below or to the right.

Form Recognizer doesn't currently support these types of input data:

* Complex tables (nested tables, merged headers or cells, and so on).
* Checkboxes or radio buttons.
