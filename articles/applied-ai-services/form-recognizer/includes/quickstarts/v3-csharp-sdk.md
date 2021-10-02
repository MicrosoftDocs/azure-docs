> [!IMPORTANT]
>
> * This quickstart SDK targets REST API version **v3.0**.
>
[Reference documentation](/dotnet/api/overview/azure/ai.formrecognizer-readme?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze form fields, text, and tables in form documents. The C# SDK supports the following models and capabilities:

### Form Recognizer models

* 🆕General document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Custom—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**General document**](#try-the-general-document-model)

* [**Layout**](#try-the-layout-model)

* [**Prebuilt Invoice**](#try-the-prebuilt-invoice-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)

* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download).

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you will need a single-service resource if you intend to use [Azure Active Directory authentication](#create-formrecognizerclient-with-azure-active-directory-credential).

* After your resource deploys, click **Go to resource**.

  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `formrecognizer-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -n formrecognizer-quickstart
```

Open a command line and switch to the directory that contains your project file. Build the application with:

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

### Install the client library with NuGet

In the directory that contains your project, install the Form Recognizer client library for .NET with the following command:

```console
dotnet add package Azure.AI.FormRecognizer
```

This version of the client library defaults to the 2021-09-30-preview version of the service.

1. In the directory that contains your project, open the **Program.cs** file.
1. At the top of the file, include the following using directives:

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.AI.FormRecognizer;
    ```

1. At the top of the program class set your  `endpoint` and `apiKey`  environment variables:

    ```csharp
    string endpoint = "<your-endpoint>";
    string apiKey = "<your-apiKey>";
    var credential = new AzureKeyCredential(apiKey);
    var client = new DocumentAnalysisClient(new Uri(endpoint), credential);
    ```
    
1. Delete the line that says, `Console.Writeline("Hello World!");`.

    :::image type="content" source="../../media/quickstarts/csharp-console-hello-world.png" alt-text="Screenshot: Program.cs Hello World code in the Visual Studio code editor.":::

1. In it's place add the following code:

```csharp
string fileUri = "<fileUri>";

AnalyzeDocumentOperation operation = await client.StartAnalyzeDocumentFromUriAsync("prebuilt-document", fileUri);

await operation.WaitForCompletionAsync();

AnalyzeResult result = operation.Value;

Console.WriteLine("Detected entities:");

foreach (DocumentEntity entity in result.Entities)
{
    if (entity.SubCategory == null)
    {
        Console.WriteLine($"  Found entity '{entity.Content}' with category '{entity.Category}'.");
    }
    else
    {
        Console.WriteLine($"  Found entity '{entity.Content}' with category '{entity.Category}' and sub-category '{entity.SubCategory}'.");
    }
}

Console.WriteLine("Detected key-value pairs:");

foreach (DocumentKeyValuePair kvp in result.KeyValuePairs)
{
    if (kvp.Value.Content == null)
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

        Console.WriteLine($"    Its bounding box is:");
        Console.WriteLine($"      Upper left => X: {line.BoundingBox[0].X}, Y= {line.BoundingBox[0].Y}");
        Console.WriteLine($"      Upper right => X: {line.BoundingBox[1].X}, Y= {line.BoundingBox[1].Y}");
        Console.WriteLine($"      Lower right => X: {line.BoundingBox[2].X}, Y= {line.BoundingBox[2].Y}");
        Console.WriteLine($"      Lower left => X: {line.BoundingBox[3].X}, Y= {line.BoundingBox[3].Y}");
    }

    for (int i = 0; i < page.SelectionMarks.Count; i++)
    {
        DocumentSelectionMark selectionMark = page.SelectionMarks[i];

        Console.WriteLine($"  Selection Mark {i} is {selectionMark.State}.");
        Console.WriteLine($"    Its bounding box is:");
        Console.WriteLine($"      Upper left => X: {selectionMark.BoundingBox[0].X}, Y= {selectionMark.BoundingBox[0].Y}");
        Console.WriteLine($"      Upper right => X: {selectionMark.BoundingBox[1].X}, Y= {selectionMark.BoundingBox[1].Y}");
        Console.WriteLine($"      Lower right => X: {selectionMark.BoundingBox[2].X}, Y= {selectionMark.BoundingBox[2].Y}");
        Console.WriteLine($"      Lower left => X: {selectionMark.BoundingBox[3].X}, Y= {selectionMark.BoundingBox[3].Y}");
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
            Console.WriteLine($"  Content: {result.Content.Substring(span.Offset, span.Length)}");
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

Open your command prompt and go to the directory that contains your project and type the following:

```console
dotnet run formrecognizer-quickstart.dll
```

### Create DocumentAnalysisClient with AzureKeyCredential

* In order to interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. Once you have the value for the API key, create an `AzureKeyCredential`. With the endpoint and key credential, you can create the DocumentAnalysisClient:

You can set `endpoint` and `apiKey` based on an environment variable, a configuration setting, or any way that works for your application.

```
## Try the General Document model

> [!div class="checklist"]
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `StartAnalyzeDocumentFromUri` method. The returned value is an `AnalyzeResult` object containing data about the submitted document.



## Try the Layout model

Extract text, selection marks, text styles, and table structures, along with their bounding region coordinates from documents.


Copy and paste the full code sample below

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

TODO

### Analyze form content from a file stream

Copy and paste the full code sample below to recognize content from a file stream. You'll use the `StartRecognizeContent` method.

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

TODO
```

## Prebuilt model: analyze invoice document content

 * An **image of or URL for an invoice document**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

 To analyze the content from a given invoice at a URI, use the `StartRecognizeInvoicesFromUriAsync` method. See our invoice model documentation for a list of [all supported fields](../../concept-v3-prebuilt.md) returned by the service and corresponding types.

### Analyze invoices from a URI

Copy and paste the full code sample below to recognize the content from a give invoice at a URI. You'll use the `StartRecognizeInvoicesFromUriAsync` method.

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

TODO
```

### Analyze invoices from a given file

 Copy and paste the full code sample below to recognize invoice content from a given file. You'll use the `StartRecognizeInvoicesAsync` method.

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

TODO
```

In this quickstart, you used the Form Recognizer C# SDK to analyze forms in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

## Next steps

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)