---
title: FAQs for the Computer Vision API
titlesuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about the Computer Vision API in Azure Cognitive Services.
services: cognitive-services
author: KellyDF
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 01/26/2017
ms.author: kefre
---

# Computer Vision API Frequently Asked Questions

### If you can't find answers to your questions in this FAQ, try asking the Computer Vision API community on [StackOverflow](https://stackoverflow.com/questions/tagged/project-oxford+or+microsoft-cognitive) or contact [Help and Support on UserVoice](https://cognitive.uservoice.com/)

-----

**Question**: *Can I train Computer Vision API to use custom tags?  For example, I would like to feed in pictures of cat breeds to 'train' the AI, then receive the breed value on an AI request.*

**Answer**: This function is currently not available. However, our engineers are working to bring this functionality to Computer Vision.

-----

**Question**: *Can Computer Vision be used locally without an internet connection?*

**Answer**: We currently do not offer an on-premises or local solution.

-----

**Question**: *Which languages are supported with Computer Vision?*

**Answer**:
Supported languages include:

| | | Supported Languages | | |
|---------------- |------------------ |------------------ |--------------------------- |--------------------
| Danish (da-DK)  | Dutch (nl-NL)     | English           | Finnish (fi-FI)            |French (fr-FR)
| German (de-DE)  | Greek (el-GR)     | Hungarian (hu-HU) | Italian (it-IT)            | Japanese (ja-JP)
| Korean (ko-KR)  | Norwegian (nb-NO) | Polish (pl-PL)    | Portuguese (pt-BR) (pt-PT) | Russian (ru-RU)
| Spanish (es-ES)	| Swedish (sv-SV)	  | Turkish (tr-TR)   |                            |

-----

**Question**: *Can Computer Vision be used to read license plates?*

**Answer**: The Vision API offers good text-detection with OCR, but it is not currently optimized for license plates. We are constantly trying to improve our services and have added OCR for auto license plate recognition to our list of feature requests.

-----

**Question:** *Which languages are supported for handwriting recognition?*

**Answer**: Currently, only English is supported.

-----

**Question**: *What types of writing surfaces are supported for handwriting recognition?*

**Answer**: The technology works with different kinds of surfaces, including whiteboards, white paper, and yellow sticky notes.

-----

**Question**: *How long does the handwriting recognition operation take?*

**Answer**: The amount of time that it takes depends on the length of the text. For longer texts, it can take up to several seconds. Therefore, after the Recognize Handwritten Text operation completes, you may need to wait before you can retrieve the results using the Get Handwritten Text Operation Result operation.

-----

**Question**: *How does the handwriting recognition technology handle text that was inserted using a caret in the middle of a line?*

**Answer**: Such text is returned as a separate line by the handwriting recognition operation.

-----

**Question**: *How does the handwriting recognition technology handle crossed-out words or lines?*

**Answer**: If the words are crossed out with multiple lines to render them unrecognizable, the handwriting recognition operation doesn't pick them up. However, if the words are crossed out using a single line, that crossing is treated as noise, and the words still get picked up by the handwriting recognition operation.

-----

**Question**: *What text orientations are supported for the handwriting recognition technology?*

**Answer**: Text oriented at angles of up to around 30 degrees to 40 degrees may get picked up by the handwriting recognition operation.

-----
