---
title: "Use Form Recognizer SDK for C# / .NET (REST API v3.0)"
description: 'Use the Form Recognizer SDK for C# / .NET (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Form Recognizer REST API version **3.0**.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html)|[API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) | [Supported REST API versions](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/). <!-- or [.NET Core](https://dotnet.microsoft.com/download). -->

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal, to get your key and endpoint.

* You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* You'll need a document file at a URL. For this project, you can use the sample forms provided in the table below for each feature:

    **Sample documents**

    | **Feature**   | **{modelID}**   | **{document-url}** |
    | --- | --- |--|
    | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
    | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
    | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
    | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
    | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
    | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
    | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
    | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

### Set your environment variables

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Set up your programming environment

1. Start Visual Studio.

1. On the start page, choose Create a new project.

    :::image type="content" source="../../../media/quickstarts/start-window.png" alt-text="Screenshot: Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="../../../media/quickstarts/create-new-project.png" alt-text="Screenshot: Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `formRecognizer_app` in the Project name box. Then choose Next.

    :::image type="content" source="../../../media/quickstarts/configure-new-project.png" alt-text="Screenshot: Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../../media/quickstarts/additional-information.png" alt-text="Screenshot: Visual Studio's additional information dialog window.":::

### Install the client library with NuGet

 1. Right-click on your **formRecognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../../media/quickstarts/select-nuget-package.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

 1. Select the Browse tab and type Azure.AI.FormRecognizer.

     :::image type="content" source="../../../media/quickstarts/azure-nuget-package.png" alt-text="Screenshot of select pre-release NuGet package in Visual Studio.":::

 1. Select version **4.0.0** from the dropdown menu and install the package in your project.
<!-- --- -->

## Build your application

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`, and select one of the following code samples to copy and paste into your application's Program.cs file:

  > * [prebuilt-read](#read-model)
  >
  > * [prebuilt-layout](#layout-model)
  >
  > * [prebuilt-document](#general-document-model)
  >
  > * [prebuilt-tax.us.w2](#w2-model)
  >
  > * [prebuilt-invoice](#invoice-model)
  >
  > * [prebuilt-receipt](#receipt-model)
  >
  > * [prebuilt-idDocument](#id-document-model)
  >
  > * [prebuilt-businessCard](#business-card-model)

1. Once you've added a code sample to your application, choose the green **Start** button next to formRecognizer_quickstart to build and run your program, or press **F5**.

  :::image type="content" source="../../../media/quickstarts/run-visual-studio.png" alt-text="Screenshot: run your Visual Studio program.":::

## Read model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//get your `key` and `endpoint` environment variables and create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

//sample document
Uri fileUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-read", fileUri);
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

### Read Model Output

Visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/csharp-read-model-output.md).

## Layout model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//get your `key` and `endpoint` environment variables and create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri fileUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png");

 operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-layout", fileUri);

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

### Layout model output

Visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/csharp-layout-model-output.md).

## General document model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//get your `key` and `endpoint` environment variables and create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
 fileUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-document", fileUri);

AnalyzeResult result = operation.Value;

Console.WriteLine("Detected key-value pairs:");

foreach (DocumentKeyValuePair kvp in result.KeyValuePairs)
{
    if (kvp.Value == null)
    {
        Console.WriteLine($"  Found key with no value: '{kvp.Key.Content}'");
    }
    else
    {
        Console.WriteLine($"  Found key-value pair: '{kvp.Key.Content}' and '{kvp.Value.Content}'");
    }
}

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

### General document model output

Visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/csharp-general-document-model-output.md).

## W2 model

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//get your `key` and `endpoint` environment variables and create your `AzureKeyCredential` and `DocumentAnalysisClient` instance
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri w2Uri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-tax.us.w2", w2Uri);

AnalyzeResult result = operation.Value;

for (int i = 0; i < result.Documents.Count; i++)
{
    Console.WriteLine($"Document {i}:");

    AnalyzedDocument document = result.Documents[i];

    if (document.Fields.TryGetValue("AdditionalInfo", out DocumentField? additionalInfoField))
    {
        if (additionalInfoField.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField infoField in additionalInfoField.Value.AsList())
            {
                Console.WriteLine("AdditionalInfo:");

                if (infoField.FieldType == DocumentFieldType.Dictionary)
                {
                    IReadOnlyDictionary<string, DocumentField> infoFields = infoField.Value.AsDictionary();

                    if (infoFields.TryGetValue("Amount", out DocumentField? amountField))
                    {
                        if (amountField.FieldType == DocumentFieldType.Double)
                        {
                            double amount = amountField.Value.AsDouble();

                            Console.WriteLine($"  Amount: '{amount}', with confidence {amountField.Confidence}");
                        }
                    }

                    if (infoFields.TryGetValue("LetterCode", out DocumentField? letterCodeField))
                    {
                        if (letterCodeField.FieldType == DocumentFieldType.String)
                        {
                            string letterCode = letterCodeField.Value.AsString();

                            Console.WriteLine($"  LetterCode: '{letterCode}', with confidence {letterCodeField.Confidence}");
                        }
                    }
                }
            }
        }
    }


    if (document.Fields.TryGetValue("AllocatedTips", out DocumentField? allocatedTipsField))
    {
        if (allocatedTipsField.FieldType == DocumentFieldType.Double)
        {
            double allocatedTips = allocatedTipsField.Value.AsDouble();
            Console.WriteLine($"Allocated Tips: '{allocatedTips}', with confidence {allocatedTipsField.Confidence}");
        }
    }

    if (document.Fields.TryGetValue("Employer", out DocumentField? employerField))
    {
        if (employerField.FieldType == DocumentFieldType.Dictionary)
        {
            IReadOnlyDictionary<string, DocumentField> employerFields = employerField.Value.AsDictionary();

            if (employerFields.TryGetValue("Name", out DocumentField? employerNameField))
            {
                if (employerNameField.FieldType == DocumentFieldType.String)
                {
                    string name = employerNameField.Value.AsString();

                    Console.WriteLine($"Employer Name: '{name}', with confidence {employerNameField.Confidence}");
                }
            }

            if (employerFields.TryGetValue("IdNumber", out DocumentField? idNumberField))
            {
                if (idNumberField.FieldType == DocumentFieldType.String)
                {
                    string id = idNumberField.Value.AsString();

                    Console.WriteLine($"Employer ID Number: '{id}', with confidence {idNumberField.Confidence}");
                }
            }

            if (employerFields.TryGetValue("Address", out DocumentField? addressField))
            {
                if (addressField.FieldType == DocumentFieldType.Address)
                {
                    Console.WriteLine($"Employer Address: '{addressField.Content}', with confidence {addressField.Confidence}");
                }
            }
        }
    }
}
```
### W2 model output

Visit the Azure samples repository on GitHub to view the [w2 model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/csharp-w2-model-output.md).


## Invoice model



## Receipt-model



## ID document model



## Business card model

