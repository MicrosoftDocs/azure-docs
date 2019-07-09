---
title: "Quickstart: Detect faces in an image with the Azure Face .NET SDK"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Azure Face SDK with C# to detect faces in an image.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: pafarley
#Customer intent: As a C# developer, I want to implement a simple Face detection scenario with the .NET SDK, so that I can build more complex scenarios later on.
---

# Quickstart: Detect faces in an image using the Face .NET SDK

In this quickstart, you will use the Face service SDK with C# to detect human faces in an image. For a working example of the code in this quickstart, see the Face project in the [Cognitive Services Vision csharp quickstarts](https://github.com/Azure-Samples/cognitive-services-vision-csharp-sdk-quickstarts/tree/master/Face) repo on GitHub.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

- A Face API subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).

## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **FaceDetection**. 
1. If there are other projects in your solution, select this one as the single startup project.
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**. Click the **Browse** tab and select **Include prerelease**; then find and install the following package:
    - [Microsoft.Azure.CognitiveServices.Vision.Face 2.2.0-preview](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.2.0-preview)
1. Make sure you have installed the latest versions of all NuGet packages for your project. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**. Click the **Updates** tab and install the latest versions of any packages that appear.

## Add face detection code

Open the new project's *Program.cs* file. Here, you will add the code needed to load images and detect faces.

### Include namespaces

Add the following `using` statements to the top of your *Program.cs* file.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=1-7)]

### Add essential fields

Add the **Program** class with the following fields. This data specifies how to connect to the Face service and where to get the input data. You'll need to update the `subscriptionKey` field with the value of your subscription key, and you may need to change the `faceEndpoint` string so that it contains the correct region identifier. You'll also need to set the `localImagePath` and/or `remoteImageUrl` values to paths that point to actual image files.

The `faceAttributes` field is simply an array of certain types of attributes. It will specify which information to retrieve about the detected faces.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=9-34)]

### Create and use the Face client

Next, add the **Main** method of the **Program** class with the following code. This sets up a Face API client.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=36-41)]

Also in the **Main** method, add the following code to use the newly created Face client to detect faces in a remote and local image. The detection methods will be defined next. 

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=43-50)]

### Detect faces

Add the following method to the **Program** class. It uses the Face service client to detect faces in a remote image, referenced by a URL. It uses the `faceAttributes` field&mdash;the **DetectedFace** objects added to `faceList` will have the specified attributes (in this case, age and gender).

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=52-74)]

Similarly, add the **DetectLocalAsync** method. It uses the Face service client to detect faces in a local image, referenced by a file path.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=76-101)]

### Retrieve and display face attributes

Next, define the **GetFaceAttributes** method. It returns a string with the relevant attribute information.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=103-116)]

Finally, define the **DisplayAttributes** method to write face attribute data to the console output. You can then close the class and namespace.

[!code-csharp[](~/cognitive-services-vision-csharp-sdk-quickstarts/Face/Program.cs?range=118-125)]

## Run the app

A successful response will display the gender and age for each face in the image. For example:

```
https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg
Male 37   Female 56
```

## Next steps

In this quickstart, you created a simple .NET console application that can use the Face API service to detect faces in both local and remote images. Next, follow a more in-depth tutorial to see how you can present face information to the user in an intuitive way.

> [!div class="nextstepaction"]
> [Tutorial: Create a WPF app to detect and analyze faces in an image](../Tutorials/FaceAPIinCSharpTutorial.md)
