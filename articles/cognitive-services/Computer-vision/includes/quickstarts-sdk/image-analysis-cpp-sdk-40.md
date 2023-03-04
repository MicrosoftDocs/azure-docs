---
title: "Quickstart: Image Analysis 4.0 client library for .NET"
description: In this quickstart, get started with the Image Analysis 4.0 client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client library for C++ to analyze an image to read text and generate captions. This quickstart defines a method, `AnalyzeImage`, which uses the client object to analyze a remote image and print the results. 

[Reference documentation](/cpp/api/azure.ai.vision.imageanalysis) | [Library source code](tbd) | Packages (NuGet): [Core](https://www.nuget.org/packages/Azure.AI.Vision.Core/0.8.1-beta.1) [ImageAnalysis](https://www.nuget.org/packages/Azure.AI.Vision.ImageAnalysis/0.8.1-beta.1) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

> [!TIP]
> You can also analyze a local image. See the [reference documentation](/cpp/api/azure.ai.vision.imageanalysis) for alternative **Analyze** methods. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/blob/main/samples/cpp/image-analysis/samples.cpp) for scenarios involving local images.

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource</a> in the Azure portal. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. 
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up application

Create a new C++ application.

In Visual Studio, open the **File** menu and choose **New** -> **Project** to open the **Create a new Project** dialog. Select the **Console App** template that has C++, Windows, and Console tags, and then choose **Next**.

In the **Configure your new project** dialog, enter _ImageAnalysisQuickstart_ in the **Project name** edit box. Choose **Create** to create the project.

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.Vision.ImageAnalysis`. Select **Install**. 

[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze Image

From the project directory, open the _ImageAnalysisQuickstart.cpp_ file in your preferred editor or IDE. Clear its contents and paste in the following code:

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/2/2.cpp?name=snippet-single)]

Then, run the application by clicking the **Debug** button at the top of the IDE window.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
Please wait for image analysis results...
 Caption:
   "a man pointing at a screen", Confidence 0.489159
 Text:
   Line: "9:35 AM"     Word: "9:35", Confidence 0.993
     Word: "AM", Confidence 0.998
   Line: "E Conference room 154584354"     Word: "E", Confidence 0.104
     Word: "Conference", Confidence 0.902
     Word: "room", Confidence 0.796
     Word: "154584354", Confidence 0.864
   Line: "#: 555-173-4547"     Word: "#:", Confidence 0.036
     Word: "555-173-4547", Confidence 0.597
   Line: "Town Hall"     Word: "Town", Confidence 0.981
     Word: "Hall", Confidence 0.991
   Line: "9:00 AM - 10:00 AM"     Word: "9:00", Confidence 0.09
     Word: "AM", Confidence 0.991
     Word: "-", Confidence 0.691
     Word: "10:00", Confidence 0.885
     Word: "AM", Confidence 0.991
   Line: "Aaron Buaion"     Word: "Aaron", Confidence 0.602
     Word: "Buaion", Confidence 0.291
   Line: "Daily SCRUM"     Word: "Daily", Confidence 0.175
     Word: "SCRUM", Confidence 0.114
   Line: "10:00 AM 11:00 AM"     Word: "10:00", Confidence 0.857
     Word: "AM", Confidence 0.998
     Word: "11:00", Confidence 0.479
     Word: "AM", Confidence 0.994
   Line: "Churlette de Crum"     Word: "Churlette", Confidence 0.464
     Word: "de", Confidence 0.81
     Word: "Crum", Confidence 0.885
   Line: "Quarterly NI Hands"     Word: "Quarterly", Confidence 0.523
     Word: "NI", Confidence 0.303
     Word: "Hands", Confidence 0.613
   Line: "11.00 AM-12:00 PM"     Word: "11.00", Confidence 0.618
     Word: "AM-12:00", Confidence 0.27
     Word: "PM", Confidence 0.662
   Line: "Bebek Shaman"     Word: "Bebek", Confidence 0.611
     Word: "Shaman", Confidence 0.605
   Line: "Weekly stand up"     Word: "Weekly", Confidence 0.606
     Word: "stand", Confidence 0.489
     Word: "up", Confidence 0.815
   Line: "12:00 PM-1:00 PM"     Word: "12:00", Confidence 0.826
     Word: "PM-1:00", Confidence 0.209
     Word: "PM", Confidence 0.039
   Line: "Delle Marckre"     Word: "Delle", Confidence 0.58
     Word: "Marckre", Confidence 0.275
   Line: "Product review"     Word: "Product", Confidence 0.615
     Word: "review", Confidence 0.04
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CPP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analysis 4.0 API features.


> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/blob/main/samples/cpp/image-analysis/samples.cpp).
