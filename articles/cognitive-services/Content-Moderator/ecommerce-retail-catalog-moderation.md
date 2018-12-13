---
title: "Tutorial: Moderate e-commerce product images - Content Moderator"
titlesuffix: Azure Cognitive Services
description: Set up an application to analyze and categorize product images with specified labels (using Azure Computer Vision and Custom Vision), and tag objectionable images to be further reviewed.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: tutorial
ms.date: 09/25/2017
ms.author: pafarley
#As a developer at an e-commerce company, I want to use machine learning to both categorize product images and tag objectionable images for further review by my team.
---

# Tutorial: Moderate e-commerce product images with machine learning

In this tutorial you will learn how to use Azure cognitive services, including Content Moderator, to effectively classify and process product images in an e-commerce scenario. You will use Computer Vision and Custom Vision to detect various types of images, and you will create a workflow that combines Content Moderator's machine-learning-based technologies with human review teams to provide an intelligent moderation system.

This tutorial shows you how to:

> [!div class="checklist"]
> * Sign up for Content Moderator and create a review team.
> * Configure moderation tags (labels) for potential celebrity and flag content.
> * Use Content Moderator's image API to scan for potential adult and racy content.
> * Use the Computer Vision API to scan for potential celebrities.
> * Use the Custom Vision service to scan for possible presence of flags.
> * Present the nuanced scan results for human review and final decision making.

![Screenshot of the Content Moderator Review tool with several images and their highlighted tags](images/tutorial-ecommerce-content-moderator.PNG)

The complete sample code is available in the [Samples eCommerce Catalog Moderation](https://github.com/MicrosoftContentModerator/samples-eCommerceCatalogModeration) repository on GitHub.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- A Content Moderator subscription key. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Content Moderator service and get your key.
- A Computer Vision subscription key (same instructions as above).
- A Custom Vision subscription key (same instructions as above).
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).
- A set of images for each label that the Custom Vision classifier will detect (in this case toys, pens, and US flags).

## Project summary

Use machine-assisted technologies to classify and moderate product images in these categories:

1. Adult (Nudity)
2. Racy (Suggestive)
3. Celebrities
4. US Flags
5. Toys
6. Pens

## Create the review team

Refer to the [Get familiar with Content Moderator](quick-start.md) quickstart to sign up for the Content Moderator Review tool and create a review team. Take note of the **Team ID** value on the **Credentials** page.

## Create custom tags

Next, create custom tags in the Review tool (refer to the [Tags](https://docs.microsoft.com/azure/cognitive-services/content-moderator/review-tool-user-guide/tags) article if you need help with this process). In this case, we will add the following tags: **celebrity**, **USA**, **flag**, **toy**, and **pen**. Note that not all of the tags need to be detectable categories in Computer Vision (like **celebrity**). You can add your own custom tags as long as you train the Custom Vision classifier to detect them later on.

![Configure custom tags](images/tutorial-ecommerce-tags2.PNG)

## Create the Visual Studio project

1. In Visual Studio, open the New Project dialog. Expand **Installed**, then **Visual C#**, then select **Console app (.NET Framework)**.
1. Name the application **EcommerceModeration**, then click **OK**.
1. If you are adding this project to an existing solution, select this project as the single startup project.

## List your API keys and endpoints

As mentioned above, this tutorial uses three cognitive services; therefore, it requires three corresponding keys and API endpoints. 

Add the following fields to the **Program** class. You'll need to update the `_Key` fields with the values of your subscription keys, and you may need to change the `_Uri` fields so that they contains the correct region identifiers. You will fill in the final part of the `CustomVisionUri` field later on.

[!code-csharp[define API keys and endpoint URIs](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=21-29)]

## Define the EvaluateAdultRacy method

Add the following method to the **Program** class. This method takes an image URL and an array of key-value pairs as parameters. It calls the Content Moderator's Image API (using REST) to get the Adult and Racy scores of the image. If the score for either is greater than 0.4 (range is from 0 to 1), it sets the corresponding value in the **ReviewTags** array to **True**.
1. The **ReviewTags** array is used to highlight the corresponding tag in the review tool.

[!code-csharp[define EvaluateAdultRacy method](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=73-113)]

## Define the EvaluateCustomVisionTags method

The next method takes an image URL and your Computer Vision subscription information and analyzes the image for the presence of celebrities. If one or more celebrities are found, it sets the corresponding value in the **ReviewTags** array to **True**. 

[!code-csharp[define EvaluateCustomVisionTags method](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=115-146)]

## Define the EvaluateCustomVisionTags method

Classify into flags, toys, and pens

Follow the instructions in the [How to build a classifier](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier) guide to build your custom classifier to detect the potential presence of flags, toys, and pens (or whatever you chose as your custom tags).

![Custom Vision Training Images](images/tutorial-ecommerce-custom-vision.PNG)

1. [Get the prediction endpoint URL](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/use-prediction-api) for your custom classifier.
1. Refer to the project source code to see the function that calls your custom classifier prediction endpoint to scan your image.

[!code-csharp[define EvaluateCustomVisionTags method](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=148-171)]
 
## Reviews for human-in-the-loop

1. In the previous sections, you scanned the incoming images for adult and racy (Content Moderator), celebrities (Computer Vision) and Flags (Custom Vision).
2. Based on our match thresholds for each scan, make the nuanced cases available for human review in the review tool.

[!code-csharp[define CreateReview method](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=173-196)]


## Submit batch of images

1. This tutorial assumes a "C:Test" directory with a text file that has a list of image Urls.
2. The following code in **Main** checks for the existence of the file and reads all Urls into memory.

[!code-csharp[Main: set up test directory, read lines](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=35-51)]

## Initiate all scans

1. This top-level function loops through all image URLs in the text file we mentioned earlier.
2. It scans them with each API and if the match confidence score falls within our criteria, creates a review for human moderators.

[!code-csharp[Main: evaluate each image and create review](~/samples-eCommerceCatalogModeration/Fusion/Program.cs?range=53-70)]

## Next steps

Build and extend the tutorial by using the [project source files](https://github.com/MicrosoftContentModerator/samples-eCommerceCatalogModeration) on GitHub.
