---
title: "Read OCR editions"
titleSuffix: "Azure Cognitive Services"
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 09/23/2022
ms.author: pafarley
---

## Read OCR editions

> [!IMPORTANT]
> Select the Read model that is the best fit for your scenario and requirements.
>
> | Input | Examples | Suggested API | Benefits |
> |----------|--------------|-------------------------|-------------------------|
> | General in-the-wild images with single image at a time |  labels, street signs, and posters | [Image&nbsp;Analysis Read&nbsp;(preview)](../concept-ocr.md) | Optimized for general, non-document images with a performance-enhanced synchronous API that makes it easier to embed OCR powered experiences in your workflows.
> | Scanned document images, digital and scanned documents including embedded images| books, reports, and forms | [Form&nbsp;Recognizer Read](../../../applied-ai-services/form-recognizer/concept-read.md) | Optimized for text-heavy scanned and digital document scenarios with asynchronous API to allow processing large documents in your workflows.
>
> **Computer Vision 3.2 GA Read**
>
> If you are looking for the Computer Vision 3.2 GA Read information, please continue reading. Note that all future Read OCR enhancements for image and document scenarios will be part of the two new services listed above. There will be no further updates to the Computer Vision Read version that supports both documents and images today.