---
title: Release Notes - Custom Vision Service
titlesuffix: Azure Cognitive Services
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: conceptual
ms.date: 08/28/2018
ms.author: anroth
---

# Custom Vision Service Release Notes

## October 9, 2018
- Object Detection enters paid preview. You can now create Object Detection projects with an Azure resource.
- Added "Move to Azure" feature to website, to make it easier to upgrade a Limited Trial project to link to an Azure. resource linked project (F0 or S0.) You can find this on the Settings page for your product.  
- Added export to ONNX 1.2, to support Windows 2018 October Update version of Windows ML.
Bugfixes, including for ONNX export with special characters. 


## August 14, 2018
- Added "Get Started" widget to customvision.ai site to guide users through project training. 
- Further improvements to the machine learning pipeline to benefit multilabel projects (new loss layer).

## June 28, 2018
- Bugfixes & backend improvements.
- Enabled Multiclass classification, for projects where images have exactly one label. In Predictions for multiclass mode, Probabilities will sum to one (all images are classified among your specified Tags).

## June 13, 2018
- UX refresh, focused on ease of use and accessibility. 
- Improvements to the machine learning pipeline to benefit multilabel projects with a large number of tags.
- Fixed bug in TensorFlow export. Enabled exported model versioning, so iterations can be exported more than once. 

## May 7, 2018
- Introduced preview Object Detection feature for Limited Trial projects.
- Upgrade to 2.0 APIs
- S0 tier expanded to up to 250 tags and 50,000 images. 
- Significant backend improvements to the machine learning pipeline for image classification projects. Projects trained after April 27, 2018 will benefit from these updates.
- Added model export to ONNX, for use with Windows ML.
- Added model export to Dockerfile. This allows you to download the artifacts to build your own Windows or Linux containers, including a DockerFile, TensorFlow model, and service code. 
- For newly trained models exported to TensorFlow in the General (Compact) and Landmark (Compact) Domains, [Mean Values are now (0,0,0)](https://github.com/azure-samples/cognitive-services-android-customvision-sample), for consistency across all projects. 

## March 1, 2018
- Entered paid preview and onboarded onto the Azure Portal. Projects can now be attached to Azure resources with an F0 (Free) or S0 (Standard) tier. Introduced S0 tier projects, which allow up to 100 tags and 25,000 images. 
- Backend changes to the machine learning pipeline/normalization parameter. This will give customers better control of precision-recall tradeoffs when adjusting the Probability Threshold. As a part of these changes, the default Probability Threshold in the CustomVision.ai portal was set to be 50%.

## December 19, 2017

- Export to Android (TensorFlow) added, in addition to previously released export to iOS (CoreML.) This allows export of a trained compact model to be run offline in an application.
- Added Retail and Landmark "compact" domains to enable model export for these domains.
- Released version [1.2 Training API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/f2d62aa3b93843d79e948fe87fa89554/operations/5a3044ee08fa5e06b890f11f) and [1.1 Prediction API](https://southcentralus.dev.cognitive.microsoft.com/docs/services/57982f59b5964e36841e22dfbfe78fc1/operations/5a3044f608fa5e06b890f164). Updated APIs support model export, new Prediction operation that does not save images to "Predictions," and introduced batch operations to the Training API.
- UX tweaks, including the ability to see which domain was used to train an iteration.
- Updated [C# SDK and sample](https://github.com/Microsoft/Cognitive-CustomVision-Windows).

