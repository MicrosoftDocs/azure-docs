---
title: "Tutorial: Use an ONNX model with Windows ML - Custom Vision Service"
titlesuffix: Azure Cognitive Services
description: Learn how to create a Windows UWP app that uses an ONNX model exported from Azure Cognitive Services.
services: cognitive-services
author: larryfr
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: tutorial
ms.date: 10/16/2018
ms.author: larryfr
# As a developer, I want to use a custom vision model with Windows ML.
---
# Tutorial: Use an ONNX model from Custom Vision with Windows ML (preview)

Learn how to use an ONNX model exported from the Custom Vision service with Windows ML (preview).

The information in this document demonstrates how to use an ONNX file exported from the Custom Vision Service with Windows ML. An example Windows UWP application is provided. A trained model that can recognize is included with the example. Steps are also provided on how you can use your own model with this example.

> [!div class="checklist"]
> * About the example app
> * Get the example code
> * Run the example
> * Use your own model

## Prerequisites

* Windows 10 build 17738 or higher

* Windows SDK for build 17738 or higher

* Visual Studio 2017 version 15.7 or later with the __Universal Windows Platform development__ workload enabled.

* Developer mode enabled. For more information, see the [Enable your device for development](https://docs.microsoft.com/windows/uwp/get-started/enable-your-device-for-development) document.

## About the example app

The application is a generic Windows UWP application. It allows you to select an image from your computer, which is then sent to the model. The tags and scores returned by the model are displayed next to the image.

## Get the example code

The example application is available at [https://github.com/Azure-Samples/cognitive-services-onnx12-customvision-sample/](https://github.com/Azure-Samples/cognitive-services-onnx12-customvision-sample/).

## Run the example

1. Use the `F5` key to start the application from Visual Studio. You may be prompted to enable Developer mode. For more information, see the [Enable your device for development](https://docs.microsoft.com/windows/uwp/get-started/enable-your-device-for-development) document.

2. When the application starts, use the button to select an image for scoring.

## Use your own model

To use your own model, follow the steps at [https://github.com/Azure-Samples/cognitive-services-onnx12-customvision-sample/](https://github.com/Azure-Samples/cognitive-services-onnx12-customvision-sample/).

## Next steps

To discover other ways to export and use a Custom Vision model, see the following documents:

* [Export your model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model)
* [Use exported Tensorflow model in an Android application](https://github.com/Azure-Samples/cognitive-services-android-customvision-sample)
* [Use exported CoreML model in a Swift iOS application](https://go.microsoft.com/fwlink/?linkid=857726)
* [Use exported CoreML model in an iOS application with Xamarin](https://github.com/xamarin/ios-samples/tree/master/ios11/CoreMLAzureModel)

For more information on using ONNX models with Windows ML, see the [Integrate a model into your app with Windows ML](https://docs.microsoft.com/windows/uwp/machine-learning/integrate-model) document.
