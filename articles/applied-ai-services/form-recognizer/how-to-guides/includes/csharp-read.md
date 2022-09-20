---
title: "How to use the read model with C#/.NET programming language"
description: Use the Form Recognizer prebuilt-read model and C# to extract printed (typeface) and handwritten text from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/09/2022
ms.author: lajanuar
recommendations: false
---

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html)|[API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) | [Supported REST API versions](../../sdk-overview.md)


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/). <!-- or [.NET Core](https://dotnet.microsoft.com/download). -->

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

1. Start Visual Studio.

1. On the start page, choose Create a new project.

    :::image type="content" source="../../media/quickstarts/start-window.png" alt-text="Screenshot: Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="../../media/quickstarts/create-new-project.png" alt-text="Screenshot: Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `formRecognizer_quickstart` in the Project name box. Then choose Next.

    :::image type="content" source="../../media/quickstarts/configure-new-project.png" alt-text="Screenshot: Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../media/quickstarts/additional-information.png" alt-text="Screenshot: Visual Studio's additional information dialog window.":::

### Install the client library with NuGet

 1. Right-click on your **formRecognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/quickstarts/select-nuget-package.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

 1. Select the Browse tab and type Azure.AI.FormRecognizer.

     :::image type="content" source="../../media/quickstarts/azure-nuget-package.png" alt-text="Screenshot of select pre-release NuGet package in Visual Studio.":::

 1. Select version **4.0.0** from the dropdown menu and install the package in your project.
<!-- --- -->

## Read Model

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient`  instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate different code than previous versions.
> * The new output uses recent C# features that simplify the code you need to write for a program.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include the other program elements.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) for this quickstart.
> * We've added the file URI value to the `Uri fileUri` variable at the top of the script.
> * To extract the layout from a given file at a URI, use the `StartAnalyzeDocumentFromUri` method and pass `prebuilt-read` as the model ID. The returned value is an `AnalyzeResult` object containing data from the submitted document.

1. Open the **Program.cs** file.

2. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`, and copy the following code sample to paste into your application. **Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance**:

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample document
Uri fileUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-read", fileUri);
AnalyzeResult result = operation.Value;

foreach (DocumentPage page in result.Pages)
{
    Console.WriteLine($"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s),");

    for (int i = 0; i < page.Lines.Count; i++)
    {
        DocumentLine line = page.Lines[i];
        Console.WriteLine($"  Line {i} has content: '{line.Content}'.");

        Console.WriteLine($"    Its bounding polygon is:");
        Console.WriteLine($"      Upper left => X: {line.BoundingPolygon[0].X}, Y= {line.BoundingPolygon[0].Y}");
        Console.WriteLine($"      Upper right => X: {line.BoundingPolygon[1].X}, Y= {line.BoundingPolygon[1].Y}");
        Console.WriteLine($"      Lower right => X: {line.BoundingPolygon[2].X}, Y= {line.BoundingPolygon[2].Y}");
        Console.WriteLine($"      Lower left => X: {line.BoundingPolygon[3].X}, Y= {line.BoundingPolygon[3].Y}");
    }
}

foreach (DocumentStyle style in result.Styles)
{
    // Check the style and style confidence to see if text is handwritten.
    // Note that value '0.8' is used as an example.

    bool isHandwritten = style.IsHandwritten.HasValue && style.IsHandwritten == true;

    if (isHandwritten && style.Confidence > 0.8)
    {
        Console.WriteLine($"Handwritten content found:");

        foreach (DocumentSpan span in style.Spans)
        {
            Console.WriteLine($"  Content: {result.Content.Substring(span.Index, span.Length)}");
        }
    }
}

Console.WriteLine("Detected languages:");

foreach (DocumentLanguage language in result.Languages)
{
    Console.WriteLine($"  Found language with locale'{language.Locale}' with confidence {language.Confidence}.");
}

```

> [!IMPORTANT]
>
> * Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, *see* Cognitive Services [security](../../../../cognitive-services/cognitive-services-security.md).

3. Once you've added a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

    :::image type="content" source="../../media/quickstarts/run-visual-studio.png" alt-text="Screenshot: run your Visual Studio program.":::

### Read Model Output

Here's a snippet of the expected output:

```console
Document Page 1 has 86 line(s), 697 word(s),
  Line 0 has content: 'While healthcare is still in the early stages of its Al journey, we'.
    Its bounding box is:
      Upper left => X: 259, Y= 55
      Upper right => X: 816, Y= 56
      Lower right => X: 816, Y= 79
      Lower left => X: 259, Y= 77
.
.
.
  Found language 'en' with confidence 0.95.
```

To view the entire output, visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/v3-csharp-sdk-read-output.md).

## Next step
Try the layout model, which can extract selection marks and table structures in addition to what the read model offers.

> [!div class="nextstepaction"]
> [Use the Layout Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
