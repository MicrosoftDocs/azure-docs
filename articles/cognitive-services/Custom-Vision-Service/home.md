---
title: Overview of Custom Vision Service machine learning - Cognitive Services | Microsoft Docs
description: The Custom Vision Service is a Microsoft Cognitive Service that lets you build custom image classifiers on the Azure platform.
services: cognitive-services
author: anrothMSFT
manager: corncar
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: overview
ms.date: 05/02/2018
ms.author: anroth
#Customer intent: As a data scientist/developer, I want to understand what the Custom Vision Service provides so that I can determine if it's suitable for my project/solution.
---
# What is the Custom Vision Service?

The Custom Vision Service is a Microsoft Cognitive Service that lets you build custom image classifiers. It makes it easy and fast to build, deploy, and improve an image classifier. Custom Vision Service provides a REST API and a web interface to upload your images and train.

## What does Custom Vision Service do well?

The Custom Vision Service works best when the item you're trying to classify is prominent in your image. It does __image classification__ but not yet __object detection__. It can identify whether an image is of a particular object, but not where that object is within the image.

Few images are required to create a classifier. 30 images per class are enough to start your prototype. The methods Custom Vision Service uses are robust to differences, which allows you to start prototyping with so little data.

> [!IMPORTANT]
> The means Custom Vision Service is not well suited to scenarios where you want to detect subtle differences. For example, minor cracks or dents in quality assurance scenarios.

## Release Notes

### December 19, 2017

- Export to Android (TensorFlow) added, in addition to previously released export to iOS (CoreML.) This allows export of a trained compact model to be run offline in an application.
- Added Retail and Landmark "compact" domains to enable model export for these domains.
- Released version [1.2 Training API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/f2d62aa3b93843d79e948fe87fa89554/operations/5a3044ee08fa5e06b890f11f) and [1.1 Prediction API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/57982f59b5964e36841e22dfbfe78fc1/operations/5a3044f608fa5e06b890f164). Updated APIs support model export, new Prediction operation that does not save images to "Predictions," and introduced batch operations to the Training API.
- UX tweaks, including the ability to see which domain was used to train an iteration.
- Updated [C# SDK and sample](https://github.com/Microsoft/Cognitive-CustomVision-Windows).

## Known issues

- January 3, 2018: The new "Retail - compact" domain model export to iOS (CoreML) generates a faulty model, which will not run, and generates a validation error. The cloud service and Android export should work. A fix is on the way.

## Next steps

[Learn how to build a classifier](getting-started-build-a-classifier.md)
