---
title: "Quickstart: Optical character recognition client library for .NET"
description: In this quickstart, get started with the Optical character recognition client library for .NET.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
ms.custom: devx-track-csharp, ignite-2022
---
 
<a name="HOLTop"></a>

Use the optical character recognition (OCR) client library to read printed and handwritten text from an image. The OCR service can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [OCR overview](../../overview-ocr.md). The code in this section uses the latest [Azure AI Vision](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/) package.

> [!TIP]
> You can also extract text from a local image. See the [ComputerVisionClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.computervision.computervisionclient) methods, such as **ReadInStreamAsync**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ComputerVisionQuickstart.cs#162) for scenarios involving local images.

[Reference documentation](/dotnet/api/overview/azure/computer-vision) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ComputerVision) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.ComputerVision/) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
- <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision" title="create a Vision resource" target="_blank">An Azure AI Vision resource</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure AI Vision service.

  1. After your Azure Vision resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in the quickstart.

[!INCLUDE [create environment variables](../environment-variables.md)]

## Read printed and handwritten text

1. Create a new C# application.

    #### [Visual Studio IDE](#tab/visual-studio)

    Using Visual Studio, create a **Console App (.NET Framework)** project for **C#, Windows, Console**.

    After you create a new project, install the client library:

    1. Right-click on the project solution in the **Solution Explorer** and select **Manage NuGet Packages for Solution**.
    1. In the package manager that opens, select **Browse**. Select **Include prerelease**.
    1. Search for and select `Microsoft.Azure.CognitiveServices.Vision.ComputerVision`.
    1. In the details dialog box, select your project and select the latest stable version. Then select **Install**.

    #### [CLI](#tab/cli)

    1. In a console window, use the `dotnet new` command to create a new console app with the name `computer-vision-quickstart`.

       ```console
       dotnet new console -n computer-vision-quickstart
       ```

       This command creates a simple Hello World C# project with a single source file: *Program.cs*.

    1. Change directory to the newly created app folder, and then build the application:

       ```console
       dotnet build
       ```

       The build output should contain no warnings or errors.

       ```output
       ...
       Build succeeded.
        0 Warning(s)
        0 Error(s)
       ...
       ```

    1. In the application directory, install the Azure AI Vision client library for .NET by using the following command:

       ```console
       dotnet add package Microsoft.Azure.CognitiveServices.Vision.ComputerVision --version 7.0.0
       ```

    ---

1. From the project directory, open the *Program.cs* file in your preferred editor or IDE. Replace the contents of *Program.cs* with the following code.

   [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ComputerVision/ComputerVisionQuickstart-single.cs?name=snippet_single)]

1. As an optional step, see [Determine how to process the data](../../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, edit the `ReadAsync` call as shown. Skip the parameter or use `"latest"` to use the most recent GA model.

   ```csharp
     // Read text from URL with a specific model version
     var textHeaders = await client.ReadAsync(urlFile,null,null,"2022-04-30");
   ```

1. Run the application.

   #### [Visual Studio IDE](#tab/visual-studio)

   - From the **Debug** menu, select **Start Debugging**.

   #### [CLI](#tab/cli)

   - Use the `dotnet run` command in your project directory.

     ```dotnet
     dotnet run
     ```

   ---

## Output

```output
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

- [Clean up resources with the Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Clean up resources with Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../how-to/call-read-api.md)

- [OCR overview](../../overview-ocr.md)
- The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/ComputerVisionQuickstart.cs).
