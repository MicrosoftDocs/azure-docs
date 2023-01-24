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
ms.date: 03/29/2021
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client library for C# to analyze an image for content tags. This quickstart defines a method, `AnalyzeAsync`, which uses the client object to analyze a remote image and print the results. 

[Reference documentation](tbd) | [Library source code](tbd) | [Package (NuGet)](tbd) | [Samples](tbd)

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClient](tbd) methods, such as **AnalyzeImageInStreamAsync**. Or, see the sample code on [GitHub](tbd) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze image

1. Create a new C# application.

    #### [Visual Studio IDE](#tab/visual-studio)

    Using Visual Studio, create a new .NET Core application. 

    ### Install the client library 

    Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `tbd`. Select version `tbd`, and then **Install**. 

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

    Within the application directory, install the Computer Vision client library for .NET with the following command:

    ```console
    dotnet add package Microsoft.Azure.CognitiveServices.Vision.ComputerVision --version 7.0.0
    ```

    [installation path?](tbd)
    
    ---

1. Find the key and endpoint.

    [!INCLUDE [find key and endpoint](../find-key.md)]

1. From the project directory, open the *Program.cs* file in your preferred editor or IDE. Paste in the following code:

   [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ImageAnalysisQuickstart-single-40.cs?name=snippet_single)]

1. Paste your key and endpoint into the code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

1. Run the application

   #### [Visual Studio IDE](#tab/visual-studio)

   Run the application by clicking the **Debug** button at the top of the IDE window.

   #### [CLI](#tab/cli)

   Run the application from your application directory with the `dotnet run` command.

   ```dotnet
   dotnet run
   ```

   ---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
tbd
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.


> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](tbd).
