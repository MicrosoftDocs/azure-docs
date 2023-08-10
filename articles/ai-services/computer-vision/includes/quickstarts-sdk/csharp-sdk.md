---
title: "Quickstart: Optical character recognition client library for .NET"
description: In this quickstart, get started with the Optical character recognition client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: include
ms.date: 03/02/2022
ms.author: pafarley
ms.custom: devx-track-csharp, ignite-2022
---
 
<a name="HOLTop"></a>

Use the OCR client library to read printed and handwritten text from a remote image. The OCR service can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [Optical character recognition (OCR)](../../overview-ocr.md) overview. The code in this section uses the latest [Vision SDK release for Read 3.0](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/).

> [!TIP]
> You can also extract text from a local image. See the [ComputerVisionClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) methods, such as **ReadInStreamAsync**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ComputerVisionQuickstart.cs#162) for scenarios involving local images.

[Reference documentation](/dotnet/api/overview/azure/computer-vision) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ComputerVision) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


[!INCLUDE [create environment variables](../environment-variables.md)]


## Read printed and handwritten text

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

1. From the project directory, open the *Program.cs* file in your preferred editor or IDE. Replace the contents of *Program.cs* with the following code.

   [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ComputerVisionQuickstart-single.cs?name=snippet_single)]


1. As an optional step, see [How to specify the model version](../../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, edit the `ReadAsync` call as shown. Skipping the parameter or using `"latest"` automatically uses the most recent GA model.

   ```csharp
     // Read text from URL with a specific model version
     var textHeaders = await client.ReadAsync(urlFile,null,null,"2022-04-30");
   ```

1. Run the application.

   #### [Visual Studio IDE](#tab/visual-studio)

   Select the **Debug** button at the top of the IDE window.

   #### [CLI](#tab/cli)

   Use the `dotnet run` command in your project directory.

   ```dotnet
   dotnet run
   ```

   ---



## Output

```console
Azure AI Vision - .NET quickstart example

----------------------------------------------------------
READ FILE FROM URL

Extracting text from URL file printed_text.jpg...


Nutrition Facts Amount Per Serving
Serving size: 1 bar (40g)
Serving Per Package: 4
Total Fat 13g
Saturated Fat 1.5g
Amount Per Serving
Trans Fat 0g
Calories 190
Cholesterol 0mg
ories from Fat 110
Sodium 20mg
nt Daily Values are based on Vitamin A 50%
calorie diet.
```



## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../how-to/call-read-api.md)

* [OCR overview](../../overview-ocr.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ComputerVisionQuickstart.cs).
