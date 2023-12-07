---
title: "Quickstart: Image Analysis 4.0 client SDK for .NET"
description: In this quickstart, get started with the Image Analysis 4.0 client SDK for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client SDK for C++ to analyze an image to read text and generate an image caption. This quickstart calls a function `AnalyzeImage()`, which uses the client object to analyze a remote image and print the results to the console.

[Reference documentation](/cpp/cognitive-services/vision) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Vision.ImageAnalysis) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

> [!IMPORTANT]
> The current Image Analysis 4.0 client SDKs are still in private preview. We recommend you use the REST API, which is generally available (GA), until the SDKs are updated to GA.

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* For Windows development, the [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) with workload **Desktop development with C++** enabled.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US, East Asia, East Asia. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. 
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



## Set up application

Create a new C++ application.

#### [Windows](#tab/windows)

Open Visual Studio, and under **Get started** select **Create a new project**. Set the template filters to _C++/Windows/Console_. Select **Console App** and choose **Next**. Update the project name to _ImageAnalysisQuickstart_ and choose **Create** to create the project.

### Install the client SDK 

Once you've created a new project, install the client SDK by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.Vision.ImageAnalysis`. Select **Install**. For more information, see the [SDK installation guide](../../sdk/install-sdk.md?pivots=programming-language-cpp).

#### [Linux](#tab/linux)

Follow the [SDK installation guide](../../sdk/install-sdk.md?pivots=programming-language-csharp) to install the Vision SDK for Linux.

---

[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze Image

From the project directory, open the _ImageAnalysisQuickstart.cpp_ file that was created previously with [your new project](#set-up-application). Clear its contents and paste in the following code:

> [!TIP]
> The code shows analyzing an image URL. You can also analyze a local image file, or an image from a memory buffer. For more information, see the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md).

[!code-cpp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/cpp/image-analysis/quick-start/quick-start.cpp?name=snippet_single)]


Then, compile and run the application by selecting **Start Debugging** from the **Debug** menu at the top of the IDE window (or press **F5**). You should see output similar to the one shown here.



## Output

The console output should show something similar to the following text:

```console
Caption:
   "a person pointing at a screen", Confidence 0.489159
Text:
   Line: "9:35 AM", Bounding polygon {{130,129},{215,130},{215,149},{130,148}}
     Word: "9:35", Bounding polygon {{131,130},{171,130},{171,149},{130,149}}, Confidence 0.993
     Word: "AM", Bounding polygon {{179,130},{204,130},{203,149},{178,149}}, Confidence 0.998
   Line: "E Conference room 154584354", Bounding polygon {{130,153},{224,154},{224,161},{130,161}}
     Word: "E", Bounding polygon {{131,154},{135,154},{135,161},{131,161}}, Confidence 0.104
     Word: "Conference", Bounding polygon {{142,154},{174,154},{173,161},{141,161}}, Confidence 0.902
     Word: "room", Bounding polygon {{175,154},{189,155},{188,161},{175,161}}, Confidence 0.796
     Word: "154584354", Bounding polygon {{192,155},{224,154},{223,162},{191,161}}, Confidence 0.864
   Line: "#: 555-173-4547", Bounding polygon {{130,163},{182,164},{181,171},{130,170}}
     Word: "#:", Bounding polygon {{131,163},{139,164},{139,171},{131,171}}, Confidence 0.036
     Word: "555-173-4547", Bounding polygon {{142,164},{182,165},{181,171},{142,171}}, Confidence 0.597
   Line: "Town Hall", Bounding polygon {{546,180},{590,180},{590,190},{546,190}}
     Word: "Town", Bounding polygon {{547,181},{568,181},{568,190},{546,191}}, Confidence 0.981
     Word: "Hall", Bounding polygon {{570,181},{590,181},{590,191},{570,190}}, Confidence 0.991
   Line: "9:00 AM - 10:00 AM", Bounding polygon {{546,191},{596,192},{596,200},{546,199}}
     Word: "9:00", Bounding polygon {{546,192},{555,192},{555,200},{546,200}}, Confidence 0.09
     Word: "AM", Bounding polygon {{557,192},{565,192},{565,200},{557,200}}, Confidence 0.991
     Word: "-", Bounding polygon {{567,192},{569,192},{569,200},{567,200}}, Confidence 0.691
     Word: "10:00", Bounding polygon {{570,192},{585,193},{584,200},{570,200}}, Confidence 0.885
     Word: "AM", Bounding polygon {{586,193},{593,194},{593,200},{586,200}}, Confidence 0.991
   Line: "Aaron Buaion", Bounding polygon {{543,201},{581,201},{581,208},{543,208}}
     Word: "Aaron", Bounding polygon {{545,202},{560,202},{559,208},{544,208}}, Confidence 0.602
     Word: "Buaion", Bounding polygon {{561,202},{580,202},{579,208},{560,208}}, Confidence 0.291
   Line: "Daily SCRUM", Bounding polygon {{537,259},{575,260},{575,266},{537,265}}
     Word: "Daily", Bounding polygon {{538,259},{551,260},{550,266},{538,265}}, Confidence 0.175
     Word: "SCRUM", Bounding polygon {{552,260},{570,260},{570,266},{551,266}}, Confidence 0.114
   Line: "10:00 AM 11:00 AM", Bounding polygon {{536,266},{590,266},{590,272},{536,272}}
     Word: "10:00", Bounding polygon {{539,267},{553,267},{552,273},{538,272}}, Confidence 0.857
     Word: "AM", Bounding polygon {{554,267},{561,267},{560,273},{553,273}}, Confidence 0.998
     Word: "11:00", Bounding polygon {{564,267},{578,267},{577,273},{563,273}}, Confidence 0.479
     Word: "AM", Bounding polygon {{579,267},{586,267},{585,273},{578,273}}, Confidence 0.994
   Line: "Churlette de Crum", Bounding polygon {{538,273},{584,273},{585,279},{538,279}}
     Word: "Churlette", Bounding polygon {{539,274},{562,274},{561,279},{538,279}}, Confidence 0.464
     Word: "de", Bounding polygon {{563,274},{569,274},{568,279},{562,279}}, Confidence 0.81
     Word: "Crum", Bounding polygon {{570,274},{582,273},{581,279},{569,279}}, Confidence 0.885
   Line: "Quarterly NI Hands", Bounding polygon {{538,295},{588,295},{588,301},{538,302}}
     Word: "Quarterly", Bounding polygon {{540,296},{562,296},{562,302},{539,302}}, Confidence 0.523
     Word: "NI", Bounding polygon {{563,296},{570,296},{570,302},{563,302}}, Confidence 0.303
     Word: "Hands", Bounding polygon {{572,296},{588,296},{588,302},{571,302}}, Confidence 0.613
   Line: "11.00 AM-12:00 PM", Bounding polygon {{536,304},{588,303},{588,309},{536,310}}
     Word: "11.00", Bounding polygon {{538,304},{552,304},{552,310},{538,310}}, Confidence 0.618
     Word: "AM-12:00", Bounding polygon {{554,304},{578,304},{577,310},{553,310}}, Confidence 0.27
     Word: "PM", Bounding polygon {{579,304},{586,304},{586,309},{578,310}}, Confidence 0.662
   Line: "Bebek Shaman", Bounding polygon {{538,310},{577,310},{577,316},{538,316}}
     Word: "Bebek", Bounding polygon {{539,310},{554,310},{554,317},{539,316}}, Confidence 0.611
     Word: "Shaman", Bounding polygon {{555,310},{576,311},{576,317},{555,317}}, Confidence 0.605
   Line: "Weekly stand up", Bounding polygon {{537,332},{582,333},{582,339},{537,338}}
     Word: "Weekly", Bounding polygon {{538,332},{557,333},{556,339},{538,338}}, Confidence 0.606
     Word: "stand", Bounding polygon {{558,333},{572,334},{571,340},{557,339}}, Confidence 0.489
     Word: "up", Bounding polygon {{574,334},{580,334},{580,340},{573,340}}, Confidence 0.815
   Line: "12:00 PM-1:00 PM", Bounding polygon {{537,340},{583,340},{583,347},{536,346}}
     Word: "12:00", Bounding polygon {{539,341},{553,341},{552,347},{538,347}}, Confidence 0.826
     Word: "PM-1:00", Bounding polygon {{554,341},{575,341},{574,347},{553,347}}, Confidence 0.209
     Word: "PM", Bounding polygon {{576,341},{583,341},{582,347},{575,347}}, Confidence 0.039
   Line: "Delle Marckre", Bounding polygon {{538,347},{582,347},{582,352},{538,353}}
     Word: "Delle", Bounding polygon {{540,348},{559,347},{558,353},{539,353}}, Confidence 0.58
     Word: "Marckre", Bounding polygon {{560,347},{582,348},{582,353},{559,353}}, Confidence 0.275
   Line: "Product review", Bounding polygon {{538,370},{577,370},{577,376},{538,375}}
     Word: "Product", Bounding polygon {{539,370},{559,371},{558,376},{539,376}}, Confidence 0.615
     Word: "review", Bounding polygon {{560,371},{576,371},{575,376},{559,376}}, Confidence 0.04
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client SDK and make basic image analysis calls. Next, learn more about the Analysis 4.0 API features.


> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* Sample source code can be found on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk).
