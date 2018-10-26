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

The Azure Custom Vision API is a cognitive service that lets you build, deploy and improve custom image classifiers. An image classifier is an AI service that sorts images into classes (tags) according to certain characteristics. Unlike the [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home) service, Custom Vision allows you to determine the classifications that are of interest.

## How it works

The Custom Vision service uses a machine learning algorithm. You, the developer, must submit groups of images that feature and lack the classification(s) in question. You specify the correct tags of the images at the time of submission. Then, the algorithm trains to your data and calculates its accuracy by testing on that data.

### Detection and classification

Custom Vision functionality can be divided into two groups. Image classification assigns to each image a distribution of classifications. Object detection is similar, but it also returns the coordinates in the image where applied tags can be found.

### Optimization

In general, the methods the Custom Vision service uses are robust to differences, which allows you to start prototyping with a small amount of data. 50 images per tag are generally a good start. This means, however, that the service is not optimal for detecting subtle differences in images (for example, detecting minor cracks or dents in quality assurance scenarios).

Additionally, you can choose from several varieties of the Custom Vision algorithm that are optimized for certain subject material, such as landmarks or retail items. See the [Build a classifier](getting-started-build-a-classifier.md) guide for more information on these.

## What it includes
The Custom Vision Service provides a set of native SDKs as well as a web-based interface to upload images and train and test your model.

## Next steps

Follow the [Build a classifier](getting-started-build-a-classifier.md) guide to get started using Custom Vision on the web, or complete an [Image classification tutorial](csharp-tutorial.md) to implement the scenario in code.
