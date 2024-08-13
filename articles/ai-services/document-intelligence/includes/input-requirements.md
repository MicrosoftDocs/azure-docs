---
author: laujan
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/13/2024
ms.author: lajanuar
---
<!-- markdownlint-disable MD041 -->


* Supported file formats:

    |Model | PDF |Image: </br>JPEG/JPG, PNG, BMP, TIFF, HEIF | Microsoft Office: </br> Word (DOCX), Excel (XLSX), PowerPoint (PPTX), HTML|
    |--------|:----:|:-----:|:---------------:|
    |Read            | ✔    | ✔    | ✔  |
    |Layout          | ✔  | ✔ | ✔ (2024-07-31-preview, 2024-02-29-preview, 2023-10-31-preview)  |
    |General&nbsp;Document| ✔  | ✔ |   |
    |Prebuilt        |  ✔  | ✔ |   |
    |Custom extraction |  ✔  | ✔ |   |
    |Custom classification  |  ✔  | ✔ | ✔ (2024-07-31-preview, 2024-02-29-preview)  |

* For best results, provide one clear photo or high-quality scan per document.

* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).

* The file size for analyzing documents is 500 MB for paid (S0) tier and 4 MB for free (F0) tier.

* Image dimensions must be between 50 pixels x 50 pixels and 10,000 pixels x 10,000 pixels.

* If your PDFs are password-locked, you must remove the lock before submission.

* The minimum height of the text to be extracted is 12 pixels for a 1024 x 768 pixel image. This dimension corresponds to about `8`-point text at 150 dots per inch (DPI).

* For custom model training, the maximum number of pages for training data is 500 for the custom template model and 50,000 for the custom neural model.

  * For custom extraction model training, the total size of training data is 50 MB for template model and 1G-MB for the neural model.

  * For custom classification model training, the total size of training data is `1GB`  with a maximum of 10,000 pages. For 2024-07-31-preview and later, the total size of training data is 2GB with a maximum of 10,000 pages.
