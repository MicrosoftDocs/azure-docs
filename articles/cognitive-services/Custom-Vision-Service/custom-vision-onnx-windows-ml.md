---
title: "Use an ONNX model with Windows ML - Custom Vision Service"
titleSuffix: Azure Cognitive Services
description: Learn how to create a Windows UWP app that uses an ONNX model exported from Azure Cognitive Services.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: pafarley
# As a developer, I want to use a custom vision model with Windows ML.
---

# Use an ONNX model from Custom Vision with Windows ML (preview)

Learn how to use an ONNX model exported from the Custom Vision service with Windows ML (preview).

In this guide, you'll learn how to use an ONNX file exported from the Custom Vision Service with Windows ML. You'll use the example UWP application with your own trained image classifier.

## Prerequisites

* Windows 10 version 1809 or higher
* Windows SDK for build 17763 or higher
* Visual Studio 2017 version 15.7 or later with the __Universal Windows Platform development__ workload enabled.
* Developer mode enabled on your PC. For more information, see [Enable your device for development](https://docs.microsoft.com/windows/uwp/get-started/enable-your-device-for-development).

## About the example app

The included application is a generic Windows UWP app. It allows you to select an image from your computer, which is then processed by a locally stored classification model. The tags and scores returned by the model are displayed next to the image.

## Get the example code

The example application is available at the [Cognitive Services ONNX Custom Vision Sample](https://github.com/Azure-Samples/cognitive-services-onnx-customvision-sample) repo on GitHub. Clone it to your local machine and open *SampleOnnxEvaluationApp.sln* in Visual Studio.

## Test the application

1. Use the `F5` key to start the application from Visual Studio. You may be prompted to enable Developer mode.
1. When the application starts, use the button to select an image for scoring. The default ONNX model is trained to classify different types of plankton.

## Use your own model

To use your own image classifier model, follow these steps:

1. Create and train a classifier with the Custom Vision Service. For instructions on how to do this, see [Create and train a classifier](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier). Use one of the **compact** domains such as **General (compact)**. 
   * If you have an existing classifier that uses a different domain, you can convert it to **compact** in the project settings. Then, re-train your project before continuing.
1. Export your model. Switch to the Performance tab and select an iteration that was trained with a **compact** domain. Select the **Export** button that appears. Then select **ONNX**, and then **Export**. Once the file is ready, select the **Download** button. For more information on export options, see [Export your model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model).
1. Open the downloaded *.zip* file and extract the *model.onnx* file from it. This file contains your classifier model.
1. In the Solution Explorer in Visual Studio, right-click the **Assets** Folder and select __Add Existing Item__. Select your ONNX file.
1. In Solution Explorer, right-click the ONNX file and select **Properties**. Change the following properties for the file:
   * __Build Action__ -> __Content__
   * __Copy to Output Directory__ -> __Copy if newer__
1. Then open _MainPage.xaml.cs_ and change the value of `_ourOnnxFileName` to the name of your ONNX file.
1. Use the `F5` to build and run the project.
1. Click button to select image to evaluate.

## Next steps

To discover other ways to export and use a Custom Vision model, see the following documents:

* [Export your model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model)
* [Use exported Tensorflow model in an Android application](https://github.com/Azure-Samples/cognitive-services-android-customvision-sample)
* [Use exported CoreML model in a Swift iOS application](https://go.microsoft.com/fwlink/?linkid=857726)
* [Use exported CoreML model in an iOS application with Xamarin](https://github.com/xamarin/ios-samples/tree/master/ios11/CoreMLAzureModel)

For more information on using ONNX models with Windows ML, see [Integrate a model into your app with Windows ML](/windows/ai/windows-ml/integrate-model).
