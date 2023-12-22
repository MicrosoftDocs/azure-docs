---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) C# SDK (beta) | v3.1 | v3.0"
titleSuffix: Azure AI services
description: 'Form and document processing, data extraction, and analysis using Document Intelligence C# client library SDKs v3.1 or v3.0 '
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 12/22/2023
ms.author: lajanuar
monikerRange: 'doc-intel-3.1.0 || doc-intel-3.0.0'
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD029 -->

:::moniker range="doc-intel-4.0.0"
[Client library](/dotnet/api/overview/azure/ai.documentintelligence-readme?view=azure-dotnet-preview&preserve-view=true) | [SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.DocumentIntelligence/1.0.0-beta.1/index.html) | [REST API reference](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP) | [Package](https://www.nuget.org/packages/Azure.AI.DocumentIntelligence/1.0.0-beta.1)| [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/documentintelligence/Azure.AI.DocumentIntelligence/samples)|[Supported REST API versions](../../sdk-overview-v4-0.md)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
[Client library](/dotnet/api/overview/azure/ai.formrecognizer-readme?view=azure-dotnet&preserve-view=true) | [SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.1.0/index.html) | [API reference](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.1.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) | [Supported REST API versions](../../sdk-overview-v3-1.md)

:::moniker-end

:::moniker range="doc-intel-3.0.0"
[Client library](/dotnet/api/overview/azure/ai.formrecognizer-readme?view=azure-dotnet&preserve-view=true) | [SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html) | [REST API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples) |[Supported REST API versions](../../sdk-overview-v3-0.md)
:::moniker-end

In this quickstart, you use the following features to analyze and extract data and values from forms and documents:

* [**Layout model**](#layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in documents, without the need to train a model.

* [**Prebuilt model**](#prebuilt-model)—Analyze and extract common fields from specific document types using a prebuilt model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/). <!-- or [.NET Core](https://dotnet.microsoft.com/download). -->

:::moniker range="doc-intel-4.0.0"

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [Azure AI multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal, to get your key and endpoint.

* You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Microsoft Entra authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

:::moniker-end

:::moniker range="doc-intel-3.1.0 || doc-intel-3.0.0"

* An Azure AI services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [Azure AI multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal, to get your key and endpoint.

* You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Microsoft Entra authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

:::moniker-end

## Set up

1. Start Visual Studio.

1. On the start page, choose Create a new project.

    :::image type="content" source="../../media/quickstarts/start-window.png" alt-text="Screenshot of Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="../../media/quickstarts/create-new-project.png" alt-text="Screenshot of Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `form_recognizer_quickstart` in the Project name box. Then choose Next.

    :::image type="content" source="../../media/quickstarts/configure-new-project.png" alt-text="Screenshot of Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../media/quickstarts/additional-information.png" alt-text="Screenshot of Visual Studio's additional information dialog window.":::

### Install the client library with NuGet

:::moniker range="doc-intel-4.0.0"

1. Right-click on your **doc_intel_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/quickstarts/select-doc-intel-nuget-package.png" alt-text="Screenshot of select NuGet prerelease package window in Visual Studio.":::

1. Select the Browse tab and type Azure.AI.DocumentIntelligence. Choose the **Include prerelease** checkbox and select version 1.0.0-beta.1 from the dropdown menu

     :::image type="content" source="../../media/quickstarts/doc-intel-preview-package.png" alt-text="Screenshot of select Document Intelligence prerelease NuGet package in Visual Studio.":::

:::moniker-end

:::moniker range="doc-intel-3.1.0"

 1. Right-click on your **form_recognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/quickstarts/select-nuget-package.png" alt-text="Screenshot of find NuGet package window in Visual Studio.":::

 1. Select the Browse tab and type Azure.AI.FormRecognizer. Select version 4.1.0 from the dropdown menu

     :::image type="content" source="../../media/quickstarts/azure-nuget-package.png" alt-text="Screenshot of select NuGet Form Recognizer package in Visual Studio.":::

:::moniker-end

:::moniker range="doc-intel-3.0.0"

 1. Right-click on your **form_recognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/quickstarts/select-nuget-package.png" alt-text="Screenshot of the NuGet package window in Visual Studio.":::

 1. Select the Browse tab and type Azure.AI.FormRecognizer. Select version 4.0.0 from the dropdown menu

     :::image type="content" source="../../media/quickstarts/nuget-2022-8-31-package.png" alt-text="Screenshot of select NuGet legacy package in Visual Studio.":::

:::moniker-end

 <!-- 1. Choose the Include prerelease checkbox and select version 4.1.0 from the dropdown menu and install the package in your project. -->

<!-- --- -->

## Build your application

:::moniker range="doc-intel-4.0.0"
To interact with the Document Intelligence service, you need to create an instance of the `DocumentIntelligenceClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentIntelligenceClient`  instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.
:::moniker-end

:::moniker range="doc-intel-3.1.0 || doc-intel-3.0.0"

To interact with the Form Recognizer service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient`  instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.
:::moniker-end

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`, and select one of the following code samples to copy and paste into your application's Program.cs file:

    * [**Layout model**](#layout-model)

    * [**Prebuilt model**](#prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

<!-- ### [.NET Command-line interface (CLI)](#tab/cli)

Open your command prompt and go to the directory that contains your project and type the following:

```console
dotnet run formrecognizer-quickstart.dll
```

### [Visual Studio](#tab/vs) -->

## Layout model

Extract text, selection marks, text styles, table structures, and bounding region coordinates from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **document file from a URI**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URI value to the `Uri fileUri` variable at the top of the script.
> * To extract the layout from a given file at a URI, use the `StartAnalyzeDocumentFromUri` method and pass `prebuilt-layout` as the model ID. The returned value is an `AnalyzeResult` object containing data from the submitted document.

:::moniker range="doc-intel-4.0.0"

**Add the following code sample to the Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```csharp

using Azure;
using Azure.AI.DocumentIntelligence;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentIntelligenceClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentIntelligenceClient client = new DocumentIntelligenceClient(new Uri(endpoint), credential);

//sample document
Uri fileUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-layout", fileUri);

AnalyzeResult result = operation.Value;

foreach (DocumentPage page in result.Pages)
{
    Console.WriteLine($"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s)," +
        $" and {page.SelectionMarks.Count} selection mark(s).");

    for (int i = 0; i < page.Lines.Count; i++)
    {
        DocumentLine line = page.Lines[i];

        Console.WriteLine($"  Line {i}:");
        Console.WriteLine($"    Content: '{line.Content}'");

        Console.Write("    Bounding polygon, with points ordered clockwise:");
        for (int j = 0; j < line.Polygon.Count; j += 2)
        {
            Console.Write($" ({line.Polygon[j]}, {line.Polygon[j + 1]})");
        }

        Console.WriteLine();
    }

    for (int i = 0; i < page.SelectionMarks.Count; i++)
    {
        DocumentSelectionMark selectionMark = page.SelectionMarks[i];

        Console.WriteLine($"  Selection Mark {i} is {selectionMark.State}.");
        Console.WriteLine($"    State: {selectionMark.State}");

        Console.Write("    Bounding polygon, with points ordered clockwise:");
        for (int j = 0; j < selectionMark.Polygon.Count; j++)
        {
            Console.Write($" ({selectionMark.Polygon[j]}, {selectionMark.Polygon[j + 1]})");
        }

        Console.WriteLine();
    }
}

for (int i = 0; i < result.Paragraphs.Count; i++)
{
    DocumentParagraph paragraph = result.Paragraphs[i];

    Console.WriteLine($"Paragraph {i}:");
    Console.WriteLine($"  Content: {paragraph.Content}");

    if (paragraph.Role != null)
    {
        Console.WriteLine($"  Role: {paragraph.Role}");
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
            var handwrittenContent = result.Content.Substring(span.Offset, span.Length);
            Console.WriteLine($"  {handwrittenContent}");
        }
    }
}

for (int i = 0; i < result.Tables.Count; i++)
{
    DocumentTable table = result.Tables[i];

    Console.WriteLine($"Table {i} has {table.RowCount} rows and {table.ColumnCount} columns.");

    foreach (DocumentTableCell cell in table.Cells)
    {
        Console.WriteLine($"  Cell ({cell.RowIndex}, {cell.ColumnIndex}) is a '{cell.Kind}' with content: {cell.Content}");
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-visual-studio.png" alt-text="Screenshot of run your Visual Studio program button.":::

:::moniker-end

:::moniker range="doc-intel-3.1.0"

**Add the following code sample to the Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance:**

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample document
Uri fileUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-layout", fileUri);

AnalyzeResult result = operation.Value;

foreach (DocumentPage page in result.Pages)
{
    Console.WriteLine($"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s),");
    Console.WriteLine($"and {page.SelectionMarks.Count} selection mark(s).");

    for (int i = 0; i < page.Lines.Count; i++)
    {
        DocumentLine line = page.Lines[i];
        Console.WriteLine($"  Line {i} has content: '{line.Content}'.");

        Console.WriteLine($"    Its bounding box is:");
        Console.WriteLine($"      Upper left => X: {line.BoundingPolygon[0].X}, Y= {line.BoundingPolygon[0].Y}");
        Console.WriteLine($"      Upper right => X: {line.BoundingPolygon[1].X}, Y= {line.BoundingPolygon[1].Y}");
        Console.WriteLine($"      Lower right => X: {line.BoundingPolygon[2].X}, Y= {line.BoundingPolygon[2].Y}");
        Console.WriteLine($"      Lower left => X: {line.BoundingPolygon[3].X}, Y= {line.BoundingPolygon[3].Y}");
    }

    for (int i = 0; i < page.SelectionMarks.Count; i++)
    {
        DocumentSelectionMark selectionMark = page.SelectionMarks[i];

        Console.WriteLine($"  Selection Mark {i} is {selectionMark.State}.");
        Console.WriteLine($"    Its bounding box is:");
        Console.WriteLine($"      Upper left => X: {selectionMark.BoundingPolygon[0].X}, Y= {selectionMark.BoundingPolygon[0].Y}");
        Console.WriteLine($"      Upper right => X: {selectionMark.BoundingPolygon[1].X}, Y= {selectionMark.BoundingPolygon[1].Y}");
        Console.WriteLine($"      Lower right => X: {selectionMark.BoundingPolygon[2].X}, Y= {selectionMark.BoundingPolygon[2].Y}");
        Console.WriteLine($"      Lower left => X: {selectionMark.BoundingPolygon[3].X}, Y= {selectionMark.BoundingPolygon[3].Y}");
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

Console.WriteLine("The following tables were extracted:");

for (int i = 0; i < result.Tables.Count; i++)
{
    DocumentTable table = result.Tables[i];
    Console.WriteLine($"  Table {i} has {table.RowCount} rows and {table.ColumnCount} columns.");

    foreach (DocumentTableCell cell in table.Cells)
    {
        Console.WriteLine($"    Cell ({cell.RowIndex}, {cell.ColumnIndex}) has kind '{cell.Kind}' and content: '{cell.Content}'.");
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-form-recognizer.png" alt-text="Screenshot of run your Visual Studio program button location.":::

### Layout model output

Here's a snippet of the expected output:

```console
  Document Page 1 has 69 line(s), 425 word(s), and 15 selection mark(s).
  Line 0 has content: 'UNITED STATES'.
    Its bounding box is:
      Upper left => X: 3.4915, Y= 0.6828
      Upper right => X: 5.0116, Y= 0.6828
      Lower right => X: 5.0116, Y= 0.8265
      Lower left => X: 3.4915, Y= 0.8265
  Line 1 has content: 'SECURITIES AND EXCHANGE COMMISSION'.
    Its bounding box is:
      Upper left => X: 2.1937, Y= 0.9061
      Upper right => X: 6.297, Y= 0.9061
      Lower right => X: 6.297, Y= 1.0498
      Lower left => X: 2.1937, Y= 1.0498
```

To view the entire output, visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/v3-csharp-quickstart-layout-output.md).

:::moniker-end

:::moniker range="doc-intel-3.0.0"

**Add the following code sample to the Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance:**

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample document
Uri fileUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-layout", fileUri);

AnalyzeResult result = operation.Value;

foreach (DocumentPage page in result.Pages)
{
    Console.WriteLine($"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s),");
    Console.WriteLine($"and {page.SelectionMarks.Count} selection mark(s).");

    for (int i = 0; i < page.Lines.Count; i++)
    {
        DocumentLine line = page.Lines[i];
        Console.WriteLine($"  Line {i} has content: '{line.Content}'.");

        Console.WriteLine($"    Its bounding polygon (points ordered clockwise):");

        for (int j = 0; j < line.BoundingPolygon.Count; j++)
        {
            Console.WriteLine($"      Point {j} => X: {line.BoundingPolygon[j].X}, Y: {line.BoundingPolygon[j].Y}");
        }
    }

    for (int i = 0; i < page.SelectionMarks.Count; i++)
    {
        DocumentSelectionMark selectionMark = page.SelectionMarks[i];

        Console.WriteLine($"  Selection Mark {i} is {selectionMark.State}.");
        Console.WriteLine($"    Its bounding polygon (points ordered clockwise):");

        for (int j = 0; j < selectionMark.BoundingPolygon.Count; j++)
        {
            Console.WriteLine($"      Point {j} => X: {selectionMark.BoundingPolygon[j].X}, Y: {selectionMark.BoundingPolygon[j].Y}");
        }
    }
}

Console.WriteLine("Paragraphs:");

foreach (DocumentParagraph paragraph in result.Paragraphs)
{
    Console.WriteLine($"  Paragraph content: {paragraph.Content}");

    if (paragraph.Role != null)
    {
        Console.WriteLine($"    Role: {paragraph.Role}");
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

Console.WriteLine("The following tables were extracted:");

for (int i = 0; i < result.Tables.Count; i++)
{
    DocumentTable table = result.Tables[i];
    Console.WriteLine($"  Table {i} has {table.RowCount} rows and {table.ColumnCount} columns.");

    foreach (DocumentTableCell cell in table.Cells)
    {
        Console.WriteLine($"    Cell ({cell.RowIndex}, {cell.ColumnIndex}) has kind '{cell.Kind}' and content: '{cell.Content}'.");
    }
}
Extract the layout of a document from a file stream
To extract the layout from a given file at a file stream, use the AnalyzeDocument method and pass prebuilt-layout as the model ID. The returned value is an AnalyzeResult object containing data about the submitted document.

string filePath = "<filePath>";
using var stream = new FileStream(filePath, FileMode.Open);

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", stream);
AnalyzeResult result = operation.Value;

foreach (DocumentPage page in result.Pages)
{
    Console.WriteLine($"Document Page {page.PageNumber} has {page.Lines.Count} line(s), {page.Words.Count} word(s),");
    Console.WriteLine($"and {page.SelectionMarks.Count} selection mark(s).");

    for (int i = 0; i < page.Lines.Count; i++)
    {
        DocumentLine line = page.Lines[i];
        Console.WriteLine($"  Line {i} has content: '{line.Content}'.");

        Console.WriteLine($"    Its bounding polygon (points ordered clockwise):");

        for (int j = 0; j < line.BoundingPolygon.Count; j++)
        {
            Console.WriteLine($"      Point {j} => X: {line.BoundingPolygon[j].X}, Y: {line.BoundingPolygon[j].Y}");
        }
    }

    for (int i = 0; i < page.SelectionMarks.Count; i++)
    {
        DocumentSelectionMark selectionMark = page.SelectionMarks[i];

        Console.WriteLine($"  Selection Mark {i} is {selectionMark.State}.");
        Console.WriteLine($"    Its bounding polygon (points ordered clockwise):");

        for (int j = 0; j < selectionMark.BoundingPolygon.Count; j++)
        {
            Console.WriteLine($"      Point {j} => X: {selectionMark.BoundingPolygon[j].X}, Y: {selectionMark.BoundingPolygon[j].Y}");
        }
    }
}

Console.WriteLine("Paragraphs:");

foreach (DocumentParagraph paragraph in result.Paragraphs)
{
    Console.WriteLine($"  Paragraph content: {paragraph.Content}");

    if (paragraph.Role != null)
    {
        Console.WriteLine($"    Role: {paragraph.Role}");
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

Console.WriteLine("The following tables were extracted:");

for (int i = 0; i < result.Tables.Count; i++)
{
    DocumentTable table = result.Tables[i];
    Console.WriteLine($"  Table {i} has {table.RowCount} rows and {table.ColumnCount} columns.");

    foreach (DocumentTableCell cell in table.Cells)
    {
        Console.WriteLine($"    Cell ({cell.RowIndex}, {cell.ColumnIndex}) has kind '{cell.Kind}' and content: '{cell.Content}'.");
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-form-recognizer.png" alt-text="Screenshot of run your Visual Studio program.":::

:::moniker-end

## Prebuilt model

Analyze and extract common fields from specific document types using a prebuilt model. In this example, we analyze an invoice using the **prebuilt-invoice** model.

> [!TIP]
> You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. See [**model data extraction**](../../concept-model-overview.md#model-data-extraction).

> [!div class="checklist"]
>
> * Analyze an invoice using the prebuilt-invoice model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URI value to the `Uri invoiceUri` variable at the top of the Program.cs file.
> * To analyze a given file at a URI, use the `StartAnalyzeDocumentFromUri` method and pass `prebuilt-invoice` as the model ID. The returned value is an `AnalyzeResult` object containing data from the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../concept-invoice.md#field-extraction) concept page.

:::moniker range="doc-intel-4.0.0"

**Add the following code sample to your Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```csharp

using Azure;
using Azure.AI.DocumentIntelligence;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `DocumentIntelligenceClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAIntelligenceClient client = new DocumentIntelligenceClient(new Uri(endpoint), credential);

//sample invoice document

Uri invoiceUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-invoice", invoiceUri);

AnalyzeResult result = operation.Value;

for (int i = 0; i < result.Documents.Count; i++)
{
    Console.WriteLine($"Document {i}:");

    AnalyzedDocument document = result.Documents[i];

    if (document.Fields.TryGetValue("VendorName", out DocumentField vendorNameField)
        && vendorNameField.Type == DocumentFieldType.String)
    {
        string vendorName = vendorNameField.ValueString;
        Console.WriteLine($"Vendor Name: '{vendorName}', with confidence {vendorNameField.Confidence}");
    }

    if (document.Fields.TryGetValue("CustomerName", out DocumentField customerNameField)
        && customerNameField.Type == DocumentFieldType.String)
    {
        string customerName = customerNameField.ValueString;
        Console.WriteLine($"Customer Name: '{customerName}', with confidence {customerNameField.Confidence}");
    }

    if (document.Fields.TryGetValue("Items", out DocumentField itemsField)
        && itemsField.Type == DocumentFieldType.Array)
    {
        foreach (DocumentField itemField in itemsField.ValueArray)
        {
            Console.WriteLine("Item:");

            if (itemField.Type == DocumentFieldType.Object)
            {
                IReadOnlyDictionary<string, DocumentField> itemFields = itemField.ValueObject;

                if (itemFields.TryGetValue("Description", out DocumentField itemDescriptionField)
                    && itemDescriptionField.Type == DocumentFieldType.String)
                {
                    string itemDescription = itemDescriptionField.ValueString;
                    Console.WriteLine($"  Description: '{itemDescription}', with confidence {itemDescriptionField.Confidence}");
                }

                if (itemFields.TryGetValue("Amount", out DocumentField itemAmountField)
                    && itemAmountField.Type == DocumentFieldType.Currency)
                {
                    CurrencyValue itemAmount = itemAmountField.ValueCurrency;
                    Console.WriteLine($"  Amount: '{itemAmount.CurrencySymbol}{itemAmount.Amount}', with confidence {itemAmountField.Confidence}");
                }
            }
        }
    }

    if (document.Fields.TryGetValue("SubTotal", out DocumentField subTotalField)
        && subTotalField.Type == DocumentFieldType.Currency)
    {
        CurrencyValue subTotal = subTotalField.ValueCurrency;
        Console.WriteLine($"Sub Total: '{subTotal.CurrencySymbol}{subTotal.Amount}', with confidence {subTotalField.Confidence}");
    }

    if (document.Fields.TryGetValue("TotalTax", out DocumentField totalTaxField)
        && totalTaxField.Type == DocumentFieldType.Currency)
    {
        CurrencyValue totalTax = totalTaxField.ValueCurrency;
        Console.WriteLine($"Total Tax: '{totalTax.CurrencySymbol}{totalTax.Amount}', with confidence {totalTaxField.Confidence}");
    }

    if (document.Fields.TryGetValue("InvoiceTotal", out DocumentField invoiceTotalField)
        && invoiceTotalField.Type == DocumentFieldType.Currency)
    {
        CurrencyValue invoiceTotal = invoiceTotalField.ValueCurrency;
        Console.WriteLine($"Invoice Total: '{invoiceTotal.CurrencySymbol}{invoiceTotal.Amount}', with confidence {invoiceTotalField.Confidence}");
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-visual-studio.png" alt-text="Screenshot of run your Visual Studio program button.":::

:::moniker-end

:::moniker range="doc-intel-3.1.0"

**Add the following code sample to your Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance:**

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `FormRecognizerClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample invoice document

Uri invoiceUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-invoice", invoiceUri);

AnalyzeResult result = operation.Value;

for (int i = 0; i < result.Documents.Count; i++)
{
    Console.WriteLine($"Document {i}:");

    AnalyzedDocument document = result.Documents[i];

    if (document.Fields.TryGetValue("VendorName", out DocumentField vendorNameField))
    {
        if (vendorNameField.FieldType == DocumentFieldType.String)
        {
            string vendorName = vendorNameField.Value.AsString();
            Console.WriteLine($"Vendor Name: '{vendorName}', with confidence {vendorNameField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("CustomerName", out DocumentField customerNameField))
    {
        if (customerNameField.FieldType == DocumentFieldType.String)
        {
            string customerName = customerNameField.Value.AsString();
            Console.WriteLine($"Customer Name: '{customerName}', with confidence {customerNameField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("Items", out DocumentField itemsField))
    {
        if (itemsField.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField itemField in itemsField.Value.AsList())
            {
                Console.WriteLine("Item:");

                if (itemField.FieldType == DocumentFieldType.Dictionary)
                {
                    IReadOnlyDictionary<string, DocumentField> itemFields = itemField.Value.AsDictionary();

                    if (itemFields.TryGetValue("Description", out DocumentField itemDescriptionField))
                    {
                        if (itemDescriptionField.FieldType == DocumentFieldType.String)
                        {
                            string itemDescription = itemDescriptionField.Value.AsString();

                            Console.WriteLine($"  Description: '{itemDescription}', with confidence {itemDescriptionField.Confidence}");
                        }
                    }

                    if (itemFields.TryGetValue("Amount", out DocumentField itemAmountField))
                    {
                        if (itemAmountField.FieldType == DocumentFieldType.Currency)
                        {
                            CurrencyValue itemAmount = itemAmountField.Value.AsCurrency();

                            Console.WriteLine($"  Amount: '{itemAmount.Symbol}{itemAmount.Amount}', with confidence {itemAmountField.Confidence}");
                        }
                    }
                }
            }
        }
    }

    if (document.Fields.TryGetValue("SubTotal", out DocumentField subTotalField))
    {
        if (subTotalField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue subTotal = subTotalField.Value.AsCurrency();
            Console.WriteLine($"Sub Total: '{subTotal.Symbol}{subTotal.Amount}', with confidence {subTotalField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("TotalTax", out DocumentField totalTaxField))
    {
        if (totalTaxField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue totalTax = totalTaxField.Value.AsCurrency();
            Console.WriteLine($"Total Tax: '{totalTax.Symbol}{totalTax.Amount}', with confidence {totalTaxField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("InvoiceTotal", out DocumentField invoiceTotalField))
    {
        if (invoiceTotalField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue invoiceTotal = invoiceTotalField.Value.AsCurrency();
            Console.WriteLine($"Invoice Total: '{invoiceTotal.Symbol}{invoiceTotal.Amount}', with confidence {invoiceTotalField.Confidence}");
        }
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-form-recognizer.png" alt-text="Screenshot of run your Visual Studio program button location.":::

### Prebuilt model output

Here's a snippet of the expected output:

```console
  Document 0:
  Vendor Name: 'CONTOSO LTD.', with confidence 0.962
  Customer Name: 'MICROSOFT CORPORATION', with confidence 0.951
  Item:
    Description: 'Test for 23 fields', with confidence 0.899
    Amount: '100', with confidence 0.902
  Sub Total: '100', with confidence 0.979
```

To view the entire output, visit the Azure samples repository on GitHub to view the [prebuilt invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/v3-csharp-quickstart-prebuilt-invoice-output.md).

:::moniker-end

:::moniker range="doc-intel-3.0.0"

**Add the following code sample to your Program.cs file. Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance:**

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal to create your `AzureKeyCredential` and `FormRecognizerClient` instance
string endpoint = "<your-endpoint>";
string key = "<your-key>";
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample invoice document

Uri invoiceUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-invoice", invoiceUri);

AnalyzeResult result = operation.Value;

for (int i = 0; i < result.Documents.Count; i++)
{
    Console.WriteLine($"Document {i}:");

    AnalyzedDocument document = result.Documents[i];

    if (document.Fields.TryGetValue("VendorName", out DocumentField vendorNameField))
    {
        if (vendorNameField.FieldType == DocumentFieldType.String)
        {
            string vendorName = vendorNameField.Value.AsString();
            Console.WriteLine($"Vendor Name: '{vendorName}', with confidence {vendorNameField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("CustomerName", out DocumentField customerNameField))
    {
        if (customerNameField.FieldType == DocumentFieldType.String)
        {
            string customerName = customerNameField.Value.AsString();
            Console.WriteLine($"Customer Name: '{customerName}', with confidence {customerNameField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("Items", out DocumentField itemsField))
    {
        if (itemsField.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField itemField in itemsField.Value.AsList())
            {
                Console.WriteLine("Item:");

                if (itemField.FieldType == DocumentFieldType.Dictionary)
                {
                    IReadOnlyDictionary<string, DocumentField> itemFields = itemField.Value.AsDictionary();

                    if (itemFields.TryGetValue("Description", out DocumentField itemDescriptionField))
                    {
                        if (itemDescriptionField.FieldType == DocumentFieldType.String)
                        {
                            string itemDescription = itemDescriptionField.Value.AsString();

                            Console.WriteLine($"  Description: '{itemDescription}', with confidence {itemDescriptionField.Confidence}");
                        }
                    }

                    if (itemFields.TryGetValue("Amount", out DocumentField itemAmountField))
                    {
                        if (itemAmountField.FieldType == DocumentFieldType.Currency)
                        {
                            CurrencyValue itemAmount = itemAmountField.Value.AsCurrency();

                            Console.WriteLine($"  Amount: '{itemAmount.Symbol}{itemAmount.Amount}', with confidence {itemAmountField.Confidence}");
                        }
                    }
                }
            }
        }
    }

    if (document.Fields.TryGetValue("SubTotal", out DocumentField subTotalField))
    {
        if (subTotalField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue subTotal = subTotalField.Value.AsCurrency();
            Console.WriteLine($"Sub Total: '{subTotal.Symbol}{subTotal.Amount}', with confidence {subTotalField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("TotalTax", out DocumentField totalTaxField))
    {
        if (totalTaxField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue totalTax = totalTaxField.Value.AsCurrency();
            Console.WriteLine($"Total Tax: '{totalTax.Symbol}{totalTax.Amount}', with confidence {totalTaxField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("InvoiceTotal", out DocumentField invoiceTotalField))
    {
        if (invoiceTotalField.FieldType == DocumentFieldType.Currency)
        {
            CurrencyValue invoiceTotal = invoiceTotalField.Value.AsCurrency();
            Console.WriteLine($"Invoice Total: '{invoiceTotal.Symbol}{invoiceTotal.Amount}', with confidence {invoiceTotalField.Confidence}");
        }
    }
}

```

**Run your application**

Once you add a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../media/quickstarts/run-form-recognizer.png" alt-text="Screenshot of run your Visual Studio program.":::

:::moniker-end
