---
title: Emotion API FAQs | Microsoft Docs
description: Get answers to frequently asked questions about the Emotion API in Cognitive Services.
services: cognitive-services
author: anrothMSFT
manager: corncar
ms.service: cognitive-services
ms.component: emotion-api
ms.topic: article
ms.date: 01/26/2017
ms.author: anroth
---

# Emotion API Frequently Asked Questions
 
> [!IMPORTANT]
> Video API Preview will end on October 30th, 2017. Try the new [Video Indexer API Preview](https://azure.microsoft.com/services/cognitive-services/video-indexer/) to easily extract insights from 
videos and to enhance content discovery experiences, such as search results, by detecting spoken words, faces, characters, and emotions. [Learn more](https://docs.microsoft.com/azure/cognitive-services/video-indexer/video-indexer-overview).

### If you can't find answers to your questions in this FAQ, try asking the Emotion API community on [StackOverflow](https://stackoverflow.com/questions/tagged/project-oxford+or+microsoft-cognitive) or contact Help and Support on [UserVoice](https://cognitive.uservoice.com/).  

-----

**Question**: *What types of images get the best results from Emotion API?*

**Answer**: Use unobstructed, full frontal facial images for best results. Reliability decreases with partial frontal faces and Emotion API may not recognize emotions in images where the face is rotated 45 degrees or more.

-----

**Question**: *How many emotions can Emotion API identify?*

**Answer**: Emotion API recognizes eight different universally-accepted emotions: 
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

**Question**: *I am passing the binary image data in but it gives me: "Invalid face image.**

**Answer**: This implies that the algorithm had an issue parsing the image.  
* The supported input image formats includes JPEG, PNG, GIF(the first frame), BMP. 
* Image file size should be no larger than 4MB
* The detectable face size range is 36x36 to 4096x4096 pixels. Faces out of this range will not be detected
* Some faces may not be detected due to technical challenges, e.g. very large face angles (head-pose), large occlusion. Frontal and near-frontal faces have the best results

-----
