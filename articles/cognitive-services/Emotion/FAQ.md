---
title: Frequently Asked Questions - Emotion API
titlesuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about the Emotion API.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: emotion-api
ms.topic: conceptual
ms.date: 01/26/2017
ms.author: anroth
ROBOTS: NOINDEX
---

# Emotion API Frequently Asked Questions

> [!IMPORTANT]
> The Emotion API will be deprecated on February 15, 2019. The emotion recognition capability is now generally available as part of the [Face API](https://docs.microsoft.com/azure/cognitive-services/face/).

### If you can't find answers to your questions in this FAQ, try asking the Emotion API community on [StackOverflow](https://stackoverflow.com/questions/tagged/project-oxford+or+microsoft-cognitive) or contact Help and Support on [UserVoice](https://cognitive.uservoice.com/).  

-----

**Question**: *What types of images get the best results from Emotion API?*

**Answer**: Use unobstructed, full frontal facial images for best results. Reliability decreases with partial frontal faces and the Emotion API may not recognize emotions in images where the face is rotated more than 45 degrees.

-----

**Question**: *How many emotions can Emotion API identify?*

**Answer**: Emotion API recognizes eight different universally accepted emotions:
* Happiness
* Sadness
* Surprise
* Anger
* Fear
* Contempt
* Disgust
* Neutral

-----

**Question**: *Is there any way to pass a live video stream to the API and get the result simultaneously?*

**Answer**: Use the image based emotion API and call it on each frame or skip frames for performance.  Video Frame-by-Frame Analysis samples are available.

-----

**Question**: *I'm passing the binary image data in but it gives me: "Invalid face image.**

**Answer**: This message implies that the algorithm had an issue parsing the image.  
* The supported input image formats include JPEG, PNG, GIF(the first frame), BMP
* Image file size should be no larger than 4 MB
* The detectable face size range is 36 x 36 to 4096 x 4096 pixels. Faces out of this range won't be detected
* Some faces may not be detected because of technical challenges, for example, large face angles (head-pose), large occlusion. Frontal and near-frontal faces have the best results

-----
