---
title: "Quickstart: Image Analysis client library for .NET"
description: In this quickstart, get started with the Image Analysis client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 03/29/2021
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client library for C# to analyze an image for content tags. This quickstart defines a method, `AnalyzeImageUrl`, which uses the client object to analyze a remote image and print the results. 

[Reference documentation](/dotnet/api/overview/azure/computer-vision) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ComputerVision) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) methods, such as **AnalyzeImageInStreamAsync**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ImageAnalysisQuickstart.cs) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze image

1. Create a new C# application.

    #### [Visual Studio IDE](#tab/visual-studio)

    Using Visual Studio, create a new .NET Core application. 

    ### Install the client library 

    Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Microsoft.Azure.CognitiveServices.Vision.ComputerVision`. Select version `7.0.0`, and then **Install**. 

    #### [CLI](#tab/cli)

    In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `computer-vision-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

    ```console
    dotnet new console -n computer-vision-quickstart
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

    Within the application directory, install the Azure AI Vision client library for .NET with the following command:

    ```console
    dotnet add package Microsoft.Azure.CognitiveServices.Vision.ComputerVision --version 7.0.0
    ```

    ---

1. From the project directory, open the *Program.cs* file in your preferred editor or IDE. Paste in the following code:

   [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ImageAnalysisQuickstart-single.cs?name=snippet_single)]


   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

1. Run the application

   #### [Visual Studio IDE](#tab/visual-studio)

   Run the application by clicking the **Debug** button at the top of the IDE window.

   #### [CLI](#tab/cli)

   Run the application from your application directory with the `dotnet run` command.

   ```dotnet
   dotnet run
   ```

   ---



## Output

```console
----------------------------------------------------------
ANALYZE IMAGE - URL

Analyzing the image sample16.png...

Tags:
grass 0.9957543611526489
dog 0.9939157962799072
mammal 0.9928356409072876
animal 0.9918001890182495
dog breed 0.9890419244766235
pet 0.974603533744812
outdoor 0.969241738319397
companion dog 0.906731367111206
small greek domestic dog 0.8965123891830444
golden retriever 0.8877675533294678
labrador retriever 0.8746421337127686
puppy 0.872604250907898
ancient dog breeds 0.8508287668228149
field 0.8017748594284058
retriever 0.6837497353553772
brown 0.6581960916519165
```



## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.


> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ImageAnalysisQuickstart.cs).
