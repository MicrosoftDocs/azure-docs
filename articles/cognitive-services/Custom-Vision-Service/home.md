---
title: What is Azure Custom Vision?
titlesuffix: Azure Cognitive Services
description: Learn how to use the Custom Vision service to build custom image classifiers in the Azure cloud.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: overview
ms.date: 10/26/2018
ms.author: anroth
#Customer intent: As a data scientist/developer, I want to understand what the Custom Vision service does so that I can determine if it's suitable for my project.
---
# What is Azure Custom Vision?

The Azure Custom Vision API is a cognitive service that lets you build, deploy and improve custom image classifiers. An image classifier is an AI service that sorts images into classes (tags) according to certain characteristics. Unlike the [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home) service, Custom Vision allows you, the developer, to determine which classifications are of interest.

The Custom Vision Service provides a REST API and a web interface to upload your images and train the classifier.

## What does Custom Vision Service do well?

The Custom Vision Service works best when the item you're trying to classify is prominent in your image. 

Few images are required to create a classifier or detector. 50 images per class are enough to start your prototype. The methods Custom Vision Service uses are robust to differences, which allows you to start prototyping with a small amount of data. This means, however, that Custom Vision Service is not optimal for detecting subtle differences in images (for example, detecting minor cracks or dents in quality assurance scenarios).

## Next steps

[Learn how to build a classifier](getting-started-build-a-classifier.md)
