---
title: "Tutorial: Generate alt text for images with Image Analysis"
titleSuffix: Azure Cognitive Services
description: This tutorial demonstrates recommended practices for using Image Analysis to generate alt text for images on web applications.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: tutorial 
ms.date: 07/22/2022
ms.author: pafarley

---

# Tutorial: Generate alt text for images with Image Analysis 

This tutorial demonstrates recommended practices for using [Image Analysis](/azure/cognitive-services/computer-vision/overview-image-analysis) to generate alt text for images on web applications.

In this tutorial, you'll learn: 

- How to preprocess, submit, and postprocess images 
- How to generate image captions
- How to add image captions to the `alt` tag in HTML

## Prerequisites 

- Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
- [Create a Computer Vision resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision) in the Azure portal
- Key and endpoint in Computer Vision resource 
   - Go to Face resource and select **Keys and Endpoint** on the left. You'll need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below. 
   - You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production. 


## Application workflows 

1. Preprocess images to meet format and size requirements 
1. Generate image captions using [Image Description](/azure/cognitive-services/computer-vision/concept-describing-images) API 
1. Postprocess images to find most confident caption and add in HTML 

## Deploy the sample app 

1. Clone the git repository for the [sample app](TBD).
1. To set up your development environment, TBD 
1. Open your preferred text editor such as Visual Studio Code. 
1. Retrieve your Vision API endpoint and key in the Azure portal under the **Overview** tab of your resource. Don't check in your Vision API key in to your remote repository.
1. Run the app using your browser. TBD

## Next steps 

- [Use Computer Vision to generate image metadata in Azure Storage](https://github.com/linndaqun/azure-docs-pr/blob/lilinda-usecase/articles/cognitive-services/Computer-vision/Tutorials/storage-lab-tutorial.md)