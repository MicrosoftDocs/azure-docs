---
title: Release Notes - Custom Vision Service
titleSuffix: Azure AI services
description: Get the latest information on new releases from the Custom Vision team.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-custom-vision
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: pafarley
---

# Custom Vision Service Release Notes

## May 2, 2019 and May 10, 2019

- Bugfixes and backend improvements

## May 23, 2019

- Improved portal UX experience related to Azure subscriptions, making it easier to select your Azure directories.

## April 18, 2019 

- Added Object Detection export for the Vision AI Dev Kit.
- UI tweaks, including project search.

## April 3, 2019

- Increased limit on number of bounding boxes per image to 200. 
- Bugfixes, including substantial performance update for models exported to TensorFlow. 

## March 26, 2019

- Custom Vision Service has entered General Availability on Azure!
- Added Advanced Training feature with a new machine learning backend for improved performance, especially on challenging datasets and fine-grained classification. With advanced training, you can specify a compute time budget for training and Custom Vision will experimentally identify the best training and augmentation settings. For quick iterations, you can continue to use the existing fast training.
- Introduced 3.0 APIs. Announced coming deprecation of pre-3.0 APIs on October 1, 2019. See the documentation [quickstarts](./quickstarts/image-classification.md) for examples on how to get started.
- Replaced "Default Iterations" with Publish/Unpublish in the 3.0 APIs.
- New model export targets have been added. Dockerfile export has been upgraded to support ARM for Raspberry Pi 3. Export support has been added to the Vision AI Dev Kit.
- Increased limit of Tags per project to 500 for S0 tier. Increased limit of Images per project to 100,000 for S0 tier.
- Removed Adult domain. General domain is recommended instead.
- Announced [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for General Availability.  

## February 25, 2019

- Announced the end of Limited Trial projects (projects not associated with an Azure resource), as Custom Vision nears completion of its move to Azure public preview. Beginning March 25, 2019, the CustomVision.ai site will only support viewing projects associated with an Azure resource, such as the free Custom Vision resource. Through October 1, 2019, you'll still be able to access your existing limited trial projects via the Custom Vision APIs. This will give you time to update API keys for any apps you've written with Custom Vision. After October 1, 2019, any limited trial projects you haven't moved to Azure will be deleted.

## January 22, 2019

- Support added for new Azure regions: West US 2, East US, East US 2, West Europe, North Europe, Southeast Asia, Australia East, Central India, UK South, Japan East, and North Central US. Support continues for South Central US.

## December 12, 2018

- Support export for Object Detection models (introduced Object Detection Compact Domain).
- Fixed a number of accessibility issues for improved screen reader and keyboard navigation support.
- UX updates for image viewer and improved object detection tagging experience for faster tagging.  
- Updated base model for Object Detection Domain for better quality object detection.
- Bug fixes.

## November 6, 2018

- Added support for Logo Domain in Object Detection.

## October 9, 2018

- Object Detection enters paid preview. You can now create Object Detection projects with an Azure resource.
- Added "Move to Azure" feature to website, to make it easier to upgrade a Limited Trial project to link to an Azure. resource linked project (F0 or S0.) You can find this on the Settings page for your product.  
- Added export to ONNX 1.2, to support Windows 2018 October Update version of Windows ML.
Bug fixes, including for ONNX export with special characters.

## August 14, 2018

- Added "Get Started" widget to customvision.ai site to guide users through project training.
- Further improvements to the machine learning pipeline to benefit multilabel projects (new loss layer).

## June 28, 2018

- Bug fixes & backend improvements.
- Enabled multiclass classification, for projects where images have exactly one label. In Predictions for multiclass mode, probabilities will sum to one (all images are classified among your specified Tags).

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

- Entered paid preview and onboarded onto the Azure portal. Projects can now be attached to Azure resources with an F0 (Free) or S0 (Standard) tier. Introduced S0 tier projects, which allow up to 100 tags and 25,000 images.
- Backend changes to the machine learning pipeline/normalization parameter. This will give customers better control of precision-recall tradeoffs when adjusting the Probability Threshold. As a part of these changes, the default Probability Threshold in the CustomVision.ai portal was set to be 50%.

## December 19, 2017

- Export to Android (TensorFlow) added, in addition to previously released export to iOS (CoreML.) This allows export of a trained compact model to be run offline in an application.
- Added Retail and Landmark "compact" domains to enable model export for these domains.
- Released version [1.2 Training API](https://westus2.dev.cognitive.microsoft.com/docs/services/f2d62aa3b93843d79e948fe87fa89554/operations/5a3044ee08fa5e06b890f11f) and [1.1 Prediction API](https://westus2.dev.cognitive.microsoft.com/docs/services/57982f59b5964e36841e22dfbfe78fc1/operations/5a3044f608fa5e06b890f164). Updated APIs support model export, new Prediction operation that does not save images to "Predictions," and introduced batch operations to the Training API.
- UX tweaks, including the ability to see which domain was used to train an iteration.
- Updated [C# SDK and sample](https://github.com/Microsoft/Cognitive-CustomVision-Windows).
