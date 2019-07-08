---
title: What is Azure Custom Vision?
titlesuffix: Azure Cognitive Services
description: Learn how to use the Custom Vision service to build custom image classifiers in the Azure cloud.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: overview
ms.date: 07/03/2019
ms.author: pafarley
#Customer intent: As a data scientist/developer, I want to understand what the Custom Vision service does so that I can determine if it's suitable for my project.
---

# What is Azure Custom Vision?

Azure Custom Vision is a cognitive service that lets you build, deploy, and improve your own image classifiers. An image classifier is an AI service that applies labels (which represent _classes_) to images, according to their visual characteristics. Unlike the [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home) service, Custom Vision allows you to determine the labels to apply.

## What it does

The Custom Vision service uses a machine learning algorithm to apply labels to images. You, the developer, must submit groups of images that feature and lack the characteristics in question. You label the images yourself at the time of submission. Then the algorithm trains to this data and calculates its own accuracy by testing itself on those same images. Once the algorithm is trained, you can test, retrain, and eventually use it to classify new images according to the needs of your app. You can also export the model itself for offline use.

### Classification and object detection

Custom Vision functionality can be divided into two features. **Image classification** applies one or more labels to an image. **Object detection** is similar, but it also returns the coordinates in the image where the applied label(s) can be found.

### Optimization

The Custom Vision service is optimized to quickly recognize major differences between images, so you can start prototyping your model with a small amount of data. 50 images per label are generally a good start. However, the service is not optimal for detecting subtle differences in images (for example, detecting minor cracks or dents in quality assurance scenarios).

Additionally, you can choose from several varieties of the Custom Vision algorithm that are optimized for images with certain subject material&mdash;for example, landmarks or retail items. For more information, see the [Build a classifier](getting-started-build-a-classifier.md) guide.

## What it includes

The Custom Vision Service is available as a set of native SDKs as well as through a web-based interface on the [Custom Vision home page](https://customvision.ai/). You can create, test, and train a model through either interface or use both together.

![Custom Vision home page in a Chrome browser window](media/browser-home.png)

## Data privacy and security

As with all of the Cognitive Services, developers using the Custom Vision service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Follow the [Build a classifier](getting-started-build-a-classifier.md) guide to get started using Custom Vision on the web, or complete an [Image classification tutorial](csharp-tutorial.md) to implement a basic scenario in code.
