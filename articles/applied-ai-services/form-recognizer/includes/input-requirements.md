---
author: laujan
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 08/25/2022
ms.author: lajanuar
---
<!-- markdownlint-disable MD041 -->

* For best results, provide one clear photo or high-quality scan per document.

* Supported file formats: 

    |Model | PDF |Image: </br>JPEG/JPG, PNG, BMP, and TIFF | Microsoft Office: </br> Word (DOCX), Excel (XLS), PowerPoint (PPT), and HTML|
    |--------|:----:|:-----:|:---------------:
    |Read            | ✔    | ✔    | &#x2731; **REST API version**</br> **`2022/06/30-preview`**
    |Layout          | ✔  | ✔ |   |
    |General&nbsp;Document| ✔  | ✔ |   |
    |Prebuilt        |  ✔  | ✔ |   |
    |Custom          |  ✔  | ✔ |   |

    &#x2731; Microsoft Office files are currently not supported for other models or versions.

* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).

* The file size for analyzing documents must be _less than_ 500 MB for paid (S0) tier and 4 MB for free (F0) tier.

* Image dimensions must be between 50 x 50 pixels and 10,000 px x 10,000 pixels.

* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.

* If your PDFs are password-locked, you must remove the lock before submission.

* The minimum height of the text to be extracted is 12 pixels for a 1024 x 768 pixel image. This dimension corresponds to about 8-point text at 150 dots per inch (DPI).

* For custom model training, the maximum number of pages for training data is 500 for the custom template model and 50,000 for the custom neural model.

* For custom model training, the total size of training data is 50 MB for template model and 1G-MB for the neural model.
