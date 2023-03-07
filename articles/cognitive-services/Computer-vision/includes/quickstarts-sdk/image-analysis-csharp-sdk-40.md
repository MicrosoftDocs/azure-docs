---
title: "Quickstart: Image Analysis client 4.0 library for .NET"
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

Use the Image Analysis client library for C# to analyze an image to read text and generate captions. This quickstart defines a method, `AnalyzeAsync`, which uses the client object to analyze a remote image and print the results. 

[Reference documentation](/dotnet/api/azure.ai.vision.imageanalysis
) | Packages (NuGet): [Core](https://www.nuget.org/packages/Azure.AI.Vision.Core) [ImageAnalysis](https://www.nuget.org/packages/Azure.AI.Vision.ImageAnalysis) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

> [!TIP]
> You can also analyze a local image. See the [reference documetation](/dotnet/api/azure.ai.vision.imageanalysis) for alternative **Analyze** methods. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/blob/main/samples/csharp/image-analysis/dotnetcore/Samples.cs) for scenarios involving local images.

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource</a> in the Azure portal. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up application

Create a new C# application.

#### [Visual Studio IDE](#tab/visual-studio)

Using Visual Studio, create a new **Console app (.NET Framework)** application. 

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.Vision.ImageAnalysis`. Select **Install**.

#### [CLI](#tab/cli)

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `image-analysis-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -n image-analysis-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
  0 Warning(s)
  0 Error(s)
...
```

### Install the client library

Within the application directory, install the Computer Vision client library for .NET with the following command:

```console
dotnet add package  Azure.AI.Vision.ImageAnalysis --prerelease
```
    
---

[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze Image

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Paste in the following code:

<!--[!code-csharp[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/csharp/image-analysis/2/Program.cs?name=snippet-single)]-->


```csharp
using Azure.AI.Vision.Core.Input;
using Azure.AI.Vision.Core.Options;
using Azure.AI.Vision.ImageAnalysis;

class Program
{
    static void AnalyzeImage()
    {
        var serviceOptions = new VisionServiceOptions(
            Environment.GetEnvironmentVariable("VISION_ENDPOINT"),
            Environment.GetEnvironmentVariable("VISION_KEY"));

        var imageSource = VisionSource.FromUrl(
            new Uri("https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png"));

        var analysisOptions = new ImageAnalysisOptions()
        {
            Features = ImageAnalysisFeature.Caption | ImageAnalysisFeature.Text,

            Language = "en",

            GenderNeutralCaption = true
        };

        using var analyzer = new ImageAnalyzer(serviceOptions, imageSource, analysisOptions);

        var result = analyzer.Analyze();

        if (result.Reason == ImageAnalysisResultReason.Analyzed)
        {
            if (result.Caption != null)
            {
                Console.WriteLine(" Caption:");
                Console.WriteLine($"   \"{result.Caption.Content}\", Confidence {result.Caption.Confidence:0.0000}");
            }

            if (result.Text != null)
            {
                Console.WriteLine($" Text:");
                foreach (var line in result.Text.Lines)
                {
                    string pointsToString = "{" + string.Join(',', line.BoundingPolygon.Select(pointsToString => pointsToString.ToString())) + "}";
                    Console.WriteLine($"   Line: '{line.Content}', Bounding polygon {pointsToString}");

                    foreach (var word in line.Words)
                    {
                        pointsToString = "{" + string.Join(',', word.BoundingPolygon.Select(pointsToString => pointsToString.ToString())) + "}";
                        Console.WriteLine($"     Word: '{word.Content}', Bounding polygon {pointsToString}, Confidence {word.Confidence:0.0000}");
                    }
                }
            }
        }
        else if (result.Reason == ImageAnalysisResultReason.Error)
        {
            var errorDetails = ImageAnalysisErrorDetails.FromResult(result);
            Console.WriteLine(" Analysis failed.");
            Console.WriteLine($"   Error reason : {errorDetails.Reason}");
            Console.WriteLine($"   Error code : {errorDetails.ErrorCode}");
            Console.WriteLine($"   Error message: {errorDetails.Message}");
        }
    }

    static void Main()
    {
        try
        {
            AnalyzeImage();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}
```
Then, run the application

#### [Visual Studio IDE](#tab/visual-studio)

Run the application by clicking the **Debug** button at the top of the IDE window.

#### [CLI](#tab/cli)

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
 Caption:
   "a man pointing at a screen", Confidence 0.4892
 Text:
   Line: '9:35 AM', Bounding polygon {{X=130,Y=129},{X=215,Y=130},{X=215,Y=149},{X=130,Y=148}}
     Word: '9:35', Bounding polygon {{X=131,Y=130},{X=171,Y=130},{X=171,Y=149},{X=130,Y=149}}, Confidence 0.9930
     Word: 'AM', Bounding polygon {{X=179,Y=130},{X=204,Y=130},{X=203,Y=149},{X=178,Y=149}}, Confidence 0.9980
   Line: 'E Conference room 154584354', Bounding polygon {{X=130,Y=153},{X=224,Y=154},{X=224,Y=161},{X=130,Y=161}}
     Word: 'E', Bounding polygon {{X=131,Y=154},{X=135,Y=154},{X=135,Y=161},{X=131,Y=161}}, Confidence 0.1040
     Word: 'Conference', Bounding polygon {{X=142,Y=154},{X=174,Y=154},{X=173,Y=161},{X=141,Y=161}}, Confidence 0.9020
     Word: 'room', Bounding polygon {{X=175,Y=154},{X=189,Y=155},{X=188,Y=161},{X=175,Y=161}}, Confidence 0.7960
     Word: '154584354', Bounding polygon {{X=192,Y=155},{X=224,Y=154},{X=223,Y=162},{X=191,Y=161}}, Confidence 0.8640
   Line: '#: 555-173-4547', Bounding polygon {{X=130,Y=163},{X=182,Y=164},{X=181,Y=171},{X=130,Y=170}}
     Word: '#:', Bounding polygon {{X=131,Y=163},{X=139,Y=164},{X=139,Y=171},{X=131,Y=171}}, Confidence 0.0360
     Word: '555-173-4547', Bounding polygon {{X=142,Y=164},{X=182,Y=165},{X=181,Y=171},{X=142,Y=171}}, Confidence 0.5970
   Line: 'Town Hall', Bounding polygon {{X=546,Y=180},{X=590,Y=180},{X=590,Y=190},{X=546,Y=190}}
     Word: 'Town', Bounding polygon {{X=547,Y=181},{X=568,Y=181},{X=568,Y=190},{X=546,Y=191}}, Confidence 0.9810
     Word: 'Hall', Bounding polygon {{X=570,Y=181},{X=590,Y=181},{X=590,Y=191},{X=570,Y=190}}, Confidence 0.9910
   Line: '9:00 AM - 10:00 AM', Bounding polygon {{X=546,Y=191},{X=596,Y=192},{X=596,Y=200},{X=546,Y=199}}
     Word: '9:00', Bounding polygon {{X=546,Y=192},{X=555,Y=192},{X=555,Y=200},{X=546,Y=200}}, Confidence 0.0900
     Word: 'AM', Bounding polygon {{X=557,Y=192},{X=565,Y=192},{X=565,Y=200},{X=557,Y=200}}, Confidence 0.9910
     Word: '-', Bounding polygon {{X=567,Y=192},{X=569,Y=192},{X=569,Y=200},{X=567,Y=200}}, Confidence 0.6910
     Word: '10:00', Bounding polygon {{X=570,Y=192},{X=585,Y=193},{X=584,Y=200},{X=570,Y=200}}, Confidence 0.8850
     Word: 'AM', Bounding polygon {{X=586,Y=193},{X=593,Y=194},{X=593,Y=200},{X=586,Y=200}}, Confidence 0.9910
   Line: 'Aaron Buaion', Bounding polygon {{X=543,Y=201},{X=581,Y=201},{X=581,Y=208},{X=543,Y=208}}
     Word: 'Aaron', Bounding polygon {{X=545,Y=202},{X=560,Y=202},{X=559,Y=208},{X=544,Y=208}}, Confidence 0.6020
     Word: 'Buaion', Bounding polygon {{X=561,Y=202},{X=580,Y=202},{X=579,Y=208},{X=560,Y=208}}, Confidence 0.2910
   Line: 'Daily SCRUM', Bounding polygon {{X=537,Y=259},{X=575,Y=260},{X=575,Y=266},{X=537,Y=265}}
     Word: 'Daily', Bounding polygon {{X=538,Y=259},{X=551,Y=260},{X=550,Y=266},{X=538,Y=265}}, Confidence 0.1750
     Word: 'SCRUM', Bounding polygon {{X=552,Y=260},{X=570,Y=260},{X=570,Y=266},{X=551,Y=266}}, Confidence 0.1140
   Line: '10:00 AM 11:00 AM', Bounding polygon {{X=536,Y=266},{X=590,Y=266},{X=590,Y=272},{X=536,Y=272}}
     Word: '10:00', Bounding polygon {{X=539,Y=267},{X=553,Y=267},{X=552,Y=273},{X=538,Y=272}}, Confidence 0.8570
     Word: 'AM', Bounding polygon {{X=554,Y=267},{X=561,Y=267},{X=560,Y=273},{X=553,Y=273}}, Confidence 0.9980
     Word: '11:00', Bounding polygon {{X=564,Y=267},{X=578,Y=267},{X=577,Y=273},{X=563,Y=273}}, Confidence 0.4790
     Word: 'AM', Bounding polygon {{X=579,Y=267},{X=586,Y=267},{X=585,Y=273},{X=578,Y=273}}, Confidence 0.9940
   Line: 'Churlette de Crum', Bounding polygon {{X=538,Y=273},{X=584,Y=273},{X=585,Y=279},{X=538,Y=279}}
     Word: 'Churlette', Bounding polygon {{X=539,Y=274},{X=562,Y=274},{X=561,Y=279},{X=538,Y=279}}, Confidence 0.4640
     Word: 'de', Bounding polygon {{X=563,Y=274},{X=569,Y=274},{X=568,Y=279},{X=562,Y=279}}, Confidence 0.8100
     Word: 'Crum', Bounding polygon {{X=570,Y=274},{X=582,Y=273},{X=581,Y=279},{X=569,Y=279}}, Confidence 0.8850
   Line: 'Quarterly NI Hands', Bounding polygon {{X=538,Y=295},{X=588,Y=295},{X=588,Y=301},{X=538,Y=302}}
     Word: 'Quarterly', Bounding polygon {{X=540,Y=296},{X=562,Y=296},{X=562,Y=302},{X=539,Y=302}}, Confidence 0.5230
     Word: 'NI', Bounding polygon {{X=563,Y=296},{X=570,Y=296},{X=570,Y=302},{X=563,Y=302}}, Confidence 0.3030
     Word: 'Hands', Bounding polygon {{X=572,Y=296},{X=588,Y=296},{X=588,Y=302},{X=571,Y=302}}, Confidence 0.6130
   Line: '11.00 AM-12:00 PM', Bounding polygon {{X=536,Y=304},{X=588,Y=303},{X=588,Y=309},{X=536,Y=310}}
     Word: '11.00', Bounding polygon {{X=538,Y=304},{X=552,Y=304},{X=552,Y=310},{X=538,Y=310}}, Confidence 0.6180
     Word: 'AM-12:00', Bounding polygon {{X=554,Y=304},{X=578,Y=304},{X=577,Y=310},{X=553,Y=310}}, Confidence 0.2700
     Word: 'PM', Bounding polygon {{X=579,Y=304},{X=586,Y=304},{X=586,Y=309},{X=578,Y=310}}, Confidence 0.6620
   Line: 'Bebek Shaman', Bounding polygon {{X=538,Y=310},{X=577,Y=310},{X=577,Y=316},{X=538,Y=316}}
     Word: 'Bebek', Bounding polygon {{X=539,Y=310},{X=554,Y=310},{X=554,Y=317},{X=539,Y=316}}, Confidence 0.6110
     Word: 'Shaman', Bounding polygon {{X=555,Y=310},{X=576,Y=311},{X=576,Y=317},{X=555,Y=317}}, Confidence 0.6050
   Line: 'Weekly stand up', Bounding polygon {{X=537,Y=332},{X=582,Y=333},{X=582,Y=339},{X=537,Y=338}}
     Word: 'Weekly', Bounding polygon {{X=538,Y=332},{X=557,Y=333},{X=556,Y=339},{X=538,Y=338}}, Confidence 0.6060
     Word: 'stand', Bounding polygon {{X=558,Y=333},{X=572,Y=334},{X=571,Y=340},{X=557,Y=339}}, Confidence 0.4890
     Word: 'up', Bounding polygon {{X=574,Y=334},{X=580,Y=334},{X=580,Y=340},{X=573,Y=340}}, Confidence 0.8150
   Line: '12:00 PM-1:00 PM', Bounding polygon {{X=537,Y=340},{X=583,Y=340},{X=583,Y=347},{X=536,Y=346}}
     Word: '12:00', Bounding polygon {{X=539,Y=341},{X=553,Y=341},{X=552,Y=347},{X=538,Y=347}}, Confidence 0.8260
     Word: 'PM-1:00', Bounding polygon {{X=554,Y=341},{X=575,Y=341},{X=574,Y=347},{X=553,Y=347}}, Confidence 0.2090
     Word: 'PM', Bounding polygon {{X=576,Y=341},{X=583,Y=341},{X=582,Y=347},{X=575,Y=347}}, Confidence 0.0390
   Line: 'Delle Marckre', Bounding polygon {{X=538,Y=347},{X=582,Y=347},{X=582,Y=352},{X=538,Y=353}}
     Word: 'Delle', Bounding polygon {{X=540,Y=348},{X=559,Y=347},{X=558,Y=353},{X=539,Y=353}}, Confidence 0.5800
     Word: 'Marckre', Bounding polygon {{X=560,Y=347},{X=582,Y=348},{X=582,Y=353},{X=559,Y=353}}, Confidence 0.2750
   Line: 'Product review', Bounding polygon {{X=538,Y=370},{X=577,Y=370},{X=577,Y=376},{X=538,Y=375}}
     Word: 'Product', Bounding polygon {{X=539,Y=370},{X=559,Y=371},{X=558,Y=376},{X=539,Y=376}}, Confidence 0.6150
     Word: 'review', Bounding polygon {{X=560,Y=371},{X=576,Y=371},{X=575,Y=376},{X=559,Y=376}}, Confidence 0.0400
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart4&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analysis 4.0 API features.


> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk/tree/main/samples/csharp/image-analysis/dotnetcore).
