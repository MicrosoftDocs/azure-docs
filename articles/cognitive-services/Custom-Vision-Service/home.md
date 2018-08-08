---
title: Overview of Custom Vision Service machine learning - Azure Cognitive Services | Microsoft Docs
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

The Custom Vision Service is a Microsoft Cognitive Service that lets you build custom image classifiers. It makes it easy and fast to build, deploy, and improve an image classifier. The Custom Vision Service provides a REST API and a web interface to upload your images and train the classifier.

## What does Custom Vision Service do well?

The Custom Vision Service works best when the item you're trying to classify is prominent in your image. 

Few images are required to create a classifier or detector. 50 images per class are enough to start your prototype. The methods Custom Vision Service uses are robust to differences, which allows you to start prototyping with so little data. This means Custom Vision Service is not well suited to scenarios where you want to detect subtle differences. For example, minor cracks or dents in quality assurance scenarios.

## Release Notes

### May 7, 2018
- Introduced preview Object Detection feature for Limited Trial projects.
- Upgrade to 2.0 APIs
- S0 tier expanded to up to 250 tags and 50,000 images. 
- Significant backend improvements to the machine learning pipeline for image classification projects. Projects trained after April 27, 2018 will benefit from these updates.
- Added model export to ONNX, for use with Windows ML.
- Added model export to Dockerfile. This allows you to download the artifacts to build your own Windows or Linux containers, including a DockerFile, TensorFlow model, and service code. 
- For newly trained models exported to TensorFlow in the General (Compact) and Landmark (Compact) Domains, [Mean Values are now (0,0,0)](https://github.com/azure-samples/cognitive-services-android-customvision-sample), for consistency accross all projects. 

### March 1, 2018
- Entered paid preview and onboarded onto the Azure Portal. Projects can now be attached to Azure resources with an F0 (Free) or S0 (Standard) tier. Introduced S0 tier projects, which allow up to 100 tags and 25,000 images. 
- Backend changes to the machine learning pipeline/normalization parameter. This will give customers better control of precision-recall tradeoffs when adjusting the Probability Threshold. As a part of these changes, the default Probability Threshold in the CustomVision.ai portal was set to be 50%.

### December 19, 2017

- Export to Android (TensorFlow) added, in addition to previously released export to iOS (CoreML.) This allows export of a trained compact model to be run offline in an application.
- Added Retail and Landmark "compact" domains to enable model export for these domains.
- Released version [1.2 Training API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/f2d62aa3b93843d79e948fe87fa89554/operations/5a3044ee08fa5e06b890f11f) and [1.1 Prediction API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/57982f59b5964e36841e22dfbfe78fc1/operations/5a3044f608fa5e06b890f164). Updated APIs support model export, new Prediction operation that does not save images to "Predictions," and introduced batch operations to the Training API.
- UX tweaks, including the ability to see which domain was used to train an iteration.
- Updated [C# SDK and sample](https://github.com/Microsoft/Cognitive-CustomVision-Windows).

## Next steps

[Learn how to build a classifier](getting-started-build-a-classifier.md)
