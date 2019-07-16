---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/27/2019
ms.author: pafarley
---

Form Recognizer works on input documents that meet these requirements:

* Format must be JPG, PNG, or PDF (text or scanned). Text-embedded PDFs are best because there's no possibility of error in character extraction and location.
* File size must be less than 4 megabytes (MB).
* For images, dimensions must be between 50 x 50 pixels and 4200 x 4200 pixels.
* If scanned from paper documents, forms should be high-quality scans.
* Text must use the Latin alphabet (English characters).
* Data must be printed (not handwritten).
* Data must contain keys and values.
* Keys can appear above or to the left of the values, but not below or to the right.

Form Recognizer doesn't currently support these types of input data:

* Complex tables (nested tables, merged headers or cells, and so on).
* Checkboxes or radio buttons.
* PDF documents longer than 50 pages.