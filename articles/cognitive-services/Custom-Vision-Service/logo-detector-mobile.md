---
title: "Tutorial: Use a custom logo detector "
titlesuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: tutorial
ms.date: 12/14/2018
ms.author: pafarley
---
# Tutorial: Recognize Azure service logos and deploy services

In this tutorial, you will step through a sample app that uses Azure Custom Vision as part of a larger scenario. The AI Visual Provision app, a Xamarin.Forms app for mobile platforms, analyzes camera pictures of various Azure service logos and then deploys the actual services to the user's Azure account. Here you will learn how it uses Custom Vision in coordination with other components to deliver a useful end-to-end application.

This tutorial show you how to:

> [!div class="checklist"]
> - Create a custom object detector to recognize Azure service logos
> - Connect your app to Azure Computer Vision and Custom Vision
> - Create an Azure Service Principal to deploy Azure services

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 

## Prerequisites

- [Visual Studio 2017](https://www.visualstudio.com/downloads/).
- Xamarin workload for Visual Studio (see [Installing Xamarin](https://docs.microsoft.com/xamarin/cross-platform/get-started/installation/windows)).

## Get the source code

First, clone or download the app's source code from the [AI Visual Provision](https://github.com/Microsoft/AIVisualProvision) repository on GitHub. Open the *Source/VisualProvision.sln* file in Visual Studio.

## Create an object detector

Sign in to the [Custom Vision website](https://customvision.ai/) and create a new project. Specify an Object Detection project and use the Logo domain; this will cause the service to use an algorithm optimized for logo detection. 

![thing](media/azure-logo-tutorial/new-project.png)

## Train the object detector

Next, you will need to train the logo detection algorithm by uploading images of Azure service logos and tagging them manually. The sample app repository includes the training images. Select the **Add images** button under the **Training Images** tab, and then navigate to the **Documents/Images/Training_DataSet** folder of the repo. 

You will need to manually tag the logos in each image, so if
you are only testing out the project, you may wish to upload only a subset of the images. However, be sure to upload at least 15 instances of each tag you plan to use.

When you've uploaded the training images, select the first one on display. This will bring up the tagging window. Draw boxes and assign tags for each logo in each image. The app is configured to work with specific tag strings; see the definitions in the *MagnetsMobileClient\VisualProvision\AppSettings.cs* file:

[!code-csharp[tag definitions](~/AIVisualProvision/Source/VisualProvision/Services/Recognition/RecognitionService.cs?range=18-33)]

When you are finished tagging an image, navigate to the right to tag the next one. Exit out of the window when you are finished.

![image of logos with tags being applied on the Custom Vision website](media/azure-logo-tutorial/tag-logos.png)

In the left pane, set the **Tags** switch to **Tagged**, and you should see all of your tagged images. Then click the green gear button at the top of the page to train the model.

![image of logos with tags being applied on the Custom Vision website](media/azure-logo-tutorial/tag-logos.png)

## Create a Service Principal

## Computer Vision 

## Add credentials to the app

## Run the app

In etc.

## Next steps

Now you have seen how every step of the image classification process can be done in code. This sample executes a single training iteration, but often you will need to train and test your model multiple times in order to make it more accurate.

> [!div class="nextstepaction"]
> [Test and retrain a model](test-your-model.md)