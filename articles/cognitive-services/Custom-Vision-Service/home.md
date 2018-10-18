---
title: What is the Custom Vision Service?
titlesuffix: Azure Cognitive Services
description: The Custom Vision Service allows you to build custom image classifiers in the Azure cloud.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: overview
ms.date: 05/02/2018
ms.author: anroth
#Customer intent: As a data scientist/developer, I want to understand what the Custom Vision Service provides so that I can determine if it's suitable for my project/solution.
---
# What is the Custom Vision Service?

The Custom Vision Service is an Azure Cognitive Service that lets you build custom image classifiers. It makes it easy and fast to build, deploy, and improve an image classifier. The Custom Vision Service provides a REST API and a web interface to upload your images and train the classifier.

## What does Custom Vision Service do well?

The Custom Vision Service works best when the item you're trying to classify is prominent in your image. 

Few images are required to create a classifier or detector. 50 images per class are enough to start your prototype. The methods Custom Vision Service uses are robust to differences, which allows you to start prototyping with so little data. This means Custom Vision Service is not well suited to scenarios where you want to detect subtle differences. For example, minor cracks or dents in quality assurance scenarios.

## Next steps

[Learn how to build a classifier](getting-started-build-a-classifier.md)
