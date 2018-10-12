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
ms.date: 06/19/2018
ms.author: larryfr
# As a developer, I want to use a custom vision model with Windows ML.
---
# Tutorial: Use an ONNX model from Custom Vision with Windows ML (preview)

Learn how to use an ONNX model exported from the Custom Vision service with Windows ML (preview).

The information in this document demonstrates how to use an ONNX file exported from the Custom Vision Service with Windows ML. An example Windows UWP application is provided. A trained model that can recognize dogs and cats is included with the example. Steps are also provided on how you can use your own model with this example.

> [!div class="checklist"]
> * About the example app
> * Get the example code
> * Run the example
> * Use your own model

## Prerequisites

* A Windows 10 device with:

    * A camera.

    * Visual Studio 2017 version 15.7 or later with the __Universal Windows Platform development__ workload enabled.

    * Developer mode enabled. For more information, see the [Enable your device for development](https://docs.microsoft.com/windows/uwp/get-started/enable-your-device-for-development) document.

* (Optional) An ONNX file exported from the Custom Vision service. For more information, see the [Export your model for use with mobile devices](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model) document.

    > [!NOTE]
    > To use your own model, follow the steps in the [Use your own model](#use-your-own-model) section.

## About the example app

The application is a generic Windows UWP application. It uses the camera on your Windows 10 device to supply images to the model. The tags and scores returned by the model are displayed beneath the video preview.

* As data comes in though the camera, [MediaFrameReader](https://docs.microsoft.com/uwp/api/windows.media.capture.frames.mediaframereader) is used to extract individual frames. The frames are sent to the model for scoring.

* The model returns the tags that it was trained on, and a float value that indicates how confident it is that the image contains that item.

### The UI

The UI for the example application is created using __CaptureElement__ and __TextBlock__ controls. The CaptureElement displays a preview of the video from the camera, and the TextBlock displays the results returned from the model. 

### The model

The model (`cat-or-dog.onnx`) supplied with the example was created and trained using the Cognitive Services Custom Vision service. The trained model was then exported as an ONNX model. For more information on using this service, see the [How to build a classifier](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier) and [Export your model for use with mobile devices](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model) documents.

> [!IMPORTANT]
> The model provided with the example was trained with a small set of dog and cat images. So it may not be the world's best at recognizing dogs and cats.

### The model class file

When you add an ONNX file to a Windows UWP application, it creates a .cs file. This file has the same name as the `.onnx` file (`cat-or-dog` in this example) and contains the classes used to work with the model from C#. However, the entities in the generated class may have names like `_x0033_04aa07b_x002D_6c8c_x002D_4641_x002D_93a6_x002D_f3152f8740a1_028da4e3_x002D_9c6e_x002D_480b_x002D_b53c_x002D_c1db13d24d70ModelInput`. You can safely rename these entries (right-click, rename) to a friendly name.

> [!NOTE]
> The example code has refactored the generated class and method names to the following:
>
> * `ModelInput`
> * `ModelOutput`
> * `Model`
> * `CreateModel`

### Camera access

The __Capabilities__ tab in the `Package.appxmanifest` file is configured to allow access to the webcam and microphone.

> [!NOTE]
> Even though this example doesn't use audio, I had to enable the microphone before I was able to access the camera on my device.

The application tries to get the camera on the back of your device if one is available. It uses the [MediaCapture](https://docs.microsoft.com/uwp/api/Windows.Media.Capture.MediaCapture) class to start capturing video from the camera. [MediaFrameReader](https://docs.microsoft.com/uwp/api/Windows.Media.Capture.Frames.MediaFrameReader) is used to capture video frames and send them to the model.

## Get the example code

The example application is available at [https://github.com/Azure-Samples/Custom-Vision-ONNX-UWP](https://github.com/Azure-Samples/Custom-Vision-ONNX-UWP).

## Run the example

1. Use the `F5` key to start the application from Visual Studio. You may be prompted to enable Developer mode. For more information, see the [Enable your device for development](https://docs.microsoft.com/windows/uwp/get-started/enable-your-device-for-development) document.

2. When prompted, allow the application to access the camera and microphone on your device.

3. Point the camera at a dog or cat. The score for whether the image contains a dog or cat is displayed beneath the preview in the application.

    > [!TIP]
    > If you do not have a dog or cat handy, you can use a photo of a dog or cat.

## Use your own model

To use your own model, use the following steps:

> [!IMPORTANT]
> The steps in this section rename the current model (cat-or-dog.cs) and refactor the class and method names of the new model. This is to avoid naming collisions with the example model.

1. Train a model using the Custom Vision service. For information on how to train a model, see the [How to build a classifier](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier).

2. Export the trained model as an ONNX model. For information on how to export a model, see the [Export your model for use with mobile devices](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model) document.

3. In Solution Explorer, right-click the __cat-or-dog.cs__ and rename it to __cat-or-dog.txt__. Renaming it prevents name collisions with the new model.

    > [!TIP]
    > You could also use different names for the class names in the new model, but reusing the existing names is easier.

4. In Solution Explorer, right-click the __VisionApp__ entry and then select __Add__ > __Existing item...__.

5. To generate a class for the model, select the ONNX file to import, and then select the __Add__ button. A new class with the same name as the ONNX file (but a `.cs` extension) is added in Solution Explorer.

6. Open the generated .cs file and find the names of the following items:

    > [!IMPORTANT]
    > Use the example `cat-or-dog.txt` file as a guide to recognize the classes and functions.

    * The class that defines the model input. The generated name may be similar to `_x0033_04aa07b_x002D_6c8c_x002D_4641_x002D_93a6_x002D_f3152f8740a1_028da4e3_x002D_9c6e_x002D_480b_x002D_b53c_x002D_c1db13d24d70ModelInput`. Rename this class to __ModelInput__.
    * The class that defines the model output. The generated name may be similar to `_x0033_04aa07b_x002D_6c8c_x002D_4641_x002D_93a6_x002D_f3152f8740a1_028da4e3_x002D_9c6e_x002D_480b_x002D_b53c_x002D_c1db13d24d70ModelOutput`. Rename this class to __ModelOutput__.
    * The class that defines the model. The generated name may be similar to `_x0033_04aa07b_x002D_6c8c_x002D_4641_x002D_93a6_x002D_f3152f8740a1_028da4e3_x002D_9c6e_x002D_480b_x002D_b53c_x002D_c1db13d24d70Model`. Rename this class to __Model__.
    * The method that creates the model. The generated name may be similar to `Create_x0033_04aa07b_x002D_6c8c_x002D_4641_x002D_93a6_x002D_f3152f8740a1_028da4e3_x002D_9c6e_x002D_480b_x002D_b53c_x002D_c1db13d24d70Model`. Rename this method to __CreateModel__.

7. In Solution Explorer, move the `.onnx` file into the __Assets__ folder. 

8. To include the ONNX file in the application package, select the `.onnx` file and set __Build Action__ to __Content__ in the properties.

9. Open the __MainPage.xaml.cs__ file. Find the following line and change the file name to the new `.onnx` file:

    ```csharp
    var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri($"ms-appx:///Assets/cat-or-dog.onnx"));
    ```

    This change loads the new model at runtime.

10. Build and run the app. It now uses the new model to score images.

## Next steps

To discover other ways to export and use a Custom Vision model, see the following documents:

* [Export your model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/export-your-model)
* [Use exported Tensorflow model in an Android application](https://github.com/Azure-Samples/cognitive-services-android-customvision-sample)
* [Use exported CoreML model in a Swift iOS application](https://go.microsoft.com/fwlink/?linkid=857726)
* [Use exported CoreML model in an iOS application with Xamarin](https://github.com/xamarin/ios-samples/tree/master/ios11/CoreMLAzureModel)

For more information on using ONNX models with Windows ML, see the [Integrate a model into your app with Windows ML](https://docs.microsoft.com/windows/uwp/machine-learning/integrate-model) document.
