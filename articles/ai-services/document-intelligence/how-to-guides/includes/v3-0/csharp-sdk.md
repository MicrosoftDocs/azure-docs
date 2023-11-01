---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for C# / .NET (REST API v3.0)"
description: 'Use the Document Intelligence SDK for C# / .NET (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Document Intelligence REST API version 3.1.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html)|[API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) | [Supported REST API versions](../../../sdk-overview-v3-1.md)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/).
- An Azure AI services or Document Intelligence resource. Create a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a Document Intelligence resource." target="_blank">single-service</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a multiple Document Intelligence resource." target="_blank">multi-service</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure Document Intelligence service.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

- A document file at a URL location. For this project, you can use the sample forms provided in the following table for each feature:

  | Feature   | modelID   | document-url |
  | --- | --- |--|
  | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
  | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
  | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
  | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
  | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
  | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
  | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
  | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Set up your programming environment

1. Start Visual Studio.

1. On the start page, choose **Create a new project**.

   :::image type="content" source="../../../media/quickstarts/start-window.png" alt-text="Screenshot of Visual Studio start window.":::

1. On the **Create a new project** page, enter *console* in the search box. Select the **Console Application** template, then choose **Next**.

   :::image type="content" source="../../../media/quickstarts/create-new-project.png" alt-text="Screenshot of Visual Studio's create new project page.":::

1. In the **Configure your new project** page, under **Project name** enter *formRecognizer_app*. Then select **Next**.

   :::image type="content" source="../../../media/quickstarts/configure-new-project-console.png" alt-text="Screenshot of Visual Studio's configure new project page.":::

1. In the **Additional information** page, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../../media/quickstarts/additional-information.png" alt-text="Screenshot of Visual Studio's additional information page.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=setup) -->

### Install the client library with NuGet

 1. Right-click on your **formRecognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../../media/quickstarts/select-nuget-package-console.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

 1. Select the **Browse** tab and type *Azure.AI.FormRecognizer*.

    :::image type="content" source="../../../media/quickstarts/azure-nuget-package.png" alt-text="Screenshot of select prerelease NuGet package in Visual Studio.":::

 1. Select a version from the dropdown menu and install the package in your project.
<!-- --- -->

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue installing the NuGet package.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=setup) -->

## Build your application

> [!NOTE]
>
> Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions. The new output uses recent C# features that simplify the code you need to write.
>
> When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives. For more information, see [C# console app template generates top-level statements](/dotnet/core/tutorials/top-level-templates).

1. Open the *Program.cs* file.

1. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`.

1. Select one of the following code samples to copy and paste into your application's *Program.cs* file:

   - [prebuilt-read](#use-the-read-model)
   - [prebuilt-layout](#use-the-layout-model)
   - [prebuilt-document](#use-the-general-document-model)
   - [prebuilt-tax.us.w2](#use-the-w-2-tax-model)
   - [prebuilt-invoice](#use-the-invoice-model)
   - [prebuilt-receipt](#use-the-receipt-model)
   - [prebuilt-idDocument](#use-the-id-document-model)
   - [prebuilt-businessCard](#use-the-business-card-model)

1. After you add a code sample to your application, choose the green **Start** button next to the project name to build and run your program, or press **F5**.

    :::image type="content" source="../../../media/quickstarts/run-visual-studio.png" alt-text="Screenshot of run your Visual Studio program.":::

## Use the Read model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
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

> [!div class="nextstepaction"]
<!-- > [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-read) -->

Visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/read-model-output.md).

## Use the Layout model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri fileUri = new Uri ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png");

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

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-layout) -->

Visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/layout-model-output.md).

## Use the General document model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri fileUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf");

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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-general-document) -->

Visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/general-document-model-output.md).

## Use the W-2 tax model

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-w2-tax) -->

Visit the Azure samples repository on GitHub to view the [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/w2-tax-model-output.md).

## Use the Invoice model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri invoiceUri = new Uri("https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf");

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

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-invoice) -->

Visit the Azure samples repository on GitHub to view the [invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/general-document-model-output.md).

## Use the Receipt model

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri receiptUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-receipt", receiptUri);

AnalyzeResult receipts = operation.Value;

foreach (AnalyzedDocument receipt in receipts.Documents)
{
    if (receipt.Fields.TryGetValue("MerchantName", out DocumentField merchantNameField))
    {
        if (merchantNameField.FieldType == DocumentFieldType.String)
        {
            string merchantName = merchantNameField.Value.AsString();

            Console.WriteLine($"Merchant Name: '{merchantName}', with confidence {merchantNameField.Confidence}");
        }
    }

    if (receipt.Fields.TryGetValue("TransactionDate", out DocumentField transactionDateField))
    {
        if (transactionDateField.FieldType == DocumentFieldType.Date)
        {
            DateTimeOffset transactionDate = transactionDateField.Value.AsDate();

            Console.WriteLine($"Transaction Date: '{transactionDate}', with confidence {transactionDateField.Confidence}");
        }
    }

    if (receipt.Fields.TryGetValue("Items", out DocumentField itemsField))
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

                    if (itemFields.TryGetValue("TotalPrice", out DocumentField itemTotalPriceField))
                    {
                        if (itemTotalPriceField.FieldType == DocumentFieldType.Double)
                        {
                            double itemTotalPrice = itemTotalPriceField.Value.AsDouble();

                            Console.WriteLine($"  Total Price: '{itemTotalPrice}', with confidence {itemTotalPriceField.Confidence}");
                        }
                    }
                }
            }
        }
    }

    if (receipt.Fields.TryGetValue("Total", out DocumentField totalField))
    {
        if (totalField.FieldType == DocumentFieldType.Double)
        {
            double total = totalField.Value.AsDouble();

            Console.WriteLine($"Total: '{total}', with confidence '{totalField.Confidence}'");
        }
    }
}

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-reecipt) -->

Visit the Azure samples repository on GitHub to view the [receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/receipt-model-output.md).

## ID document model

```csharp

using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document

Uri idDocumentUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-idDocument", idDocumentUri);

AnalyzeResult identityDocuments = operation.Value;

AnalyzedDocument identityDocument = identityDocuments.Documents.Single();

if (identityDocument.Fields.TryGetValue("Address", out DocumentField addressField))
{
    if (addressField.FieldType == DocumentFieldType.String)
    {
        string address = addressField.Value. AsString();
        Console.WriteLine($"Address: '{address}', with confidence {addressField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("CountryRegion", out DocumentField countryRegionField))
{
    if (countryRegionField.FieldType == DocumentFieldType.CountryRegion)
    {
        string countryRegion = countryRegionField.Value.AsCountryRegion();
        Console.WriteLine($"CountryRegion: '{countryRegion}', with confidence {countryRegionField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("DateOfBirth", out DocumentField dateOfBirthField))
{
    if (dateOfBirthField.FieldType == DocumentFieldType.Date)
    {
        DateTimeOffset dateOfBirth = dateOfBirthField.Value.AsDate();
        Console.WriteLine($"Date Of Birth: '{dateOfBirth}', with confidence {dateOfBirthField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("DateOfExpiration", out DocumentField dateOfExpirationField))
{
    if (dateOfExpirationField.FieldType == DocumentFieldType.Date)
    {
        DateTimeOffset dateOfExpiration = dateOfExpirationField.Value.AsDate();
        Console.WriteLine($"Date Of Expiration: '{dateOfExpiration}', with confidence {dateOfExpirationField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("DocumentNumber", out DocumentField documentNumberField))
{
    if (documentNumberField.FieldType == DocumentFieldType.String)
    {
        string documentNumber = documentNumberField.Value.AsString();
        Console.WriteLine($"Document Number: '{documentNumber}', with confidence {documentNumberField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("FirstName", out DocumentField firstNameField))
{
    if (firstNameField.FieldType == DocumentFieldType.String)
    {
        string firstName = firstNameField.Value.AsString();
        Console.WriteLine($"First Name: '{firstName}', with confidence {firstNameField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("LastName", out DocumentField lastNameField))
{
    if (lastNameField.FieldType == DocumentFieldType.String)
    {
        string lastName = lastNameField.Value.AsString();
        Console.WriteLine($"Last Name: '{lastName}', with confidence {lastNameField.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("Region", out DocumentField regionfield))
{
    if (regionfield.FieldType == DocumentFieldType.String)
    {
        string region = regionfield.Value.AsString();
        Console.WriteLine($"Region: '{region}', with confidence {regionfield.Confidence}");
    }
}

if (identityDocument.Fields.TryGetValue("Sex", out DocumentField sexfield))
{
    if (sexfield.FieldType == DocumentFieldType.String)
    {
        string sex = sexfield.Value.AsString();
        Console.WriteLine($"Sex: '{sex}', with confidence {sexfield.Confidence}");
    }
}

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-id-document) -->

Visit the Azure samples repository on GitHub to view the [id-document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/id-document-model-output.md).

## Use the Business card model

```csharp
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

//use your `key` and `endpoint` environment variables to create your `AzureKeyCredential` and `DocumentAnalysisClient` instances
string key = Environment.GetEnvironmentVariable("FR_KEY");
string endpoint = Environment.GetEnvironmentVariable("FR_ENDPOINT");
AzureKeyCredential credential = new AzureKeyCredential(key);
DocumentAnalysisClient client = new DocumentAnalysisClient(new Uri(endpoint), credential);

// sample document document
Uri businessCardUri = new Uri("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/business-card-english.jpg");

AnalyzeDocumentOperation operation = await client.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-businessCard", businessCardUri);

AnalyzeResult businessCards = operation.Value;

foreach (AnalyzedDocument businessCard in businessCards.Documents)
{
    if (businessCard.Fields.TryGetValue("ContactNames", out DocumentField ContactNamesField))
    {
        if (ContactNamesField.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField contactNameField in ContactNamesField.Value.AsList())
            {
                Console.WriteLine("Contact Name: ");

                if (contactNameField.FieldType == DocumentFieldType.Dictionary)
                {
                    IReadOnlyDictionary<string, DocumentField> contactNameFields = contactNameField.Value.AsDictionary();

                    if (contactNameFields.TryGetValue("FirstName", out DocumentField firstNameField))
                    {
                        if (firstNameField.FieldType == DocumentFieldType.String)
                        {
                            string firstName = firstNameField.Value.AsString();

                            Console.WriteLine($"  First Name: '{firstName}', with confidence {firstNameField.Confidence}");
                        }
                    }

                    if (contactNameFields.TryGetValue("LastName", out DocumentField lastNameField))
                    {
                        if (lastNameField.FieldType == DocumentFieldType.String)
                        {
                            string lastName = lastNameField.Value.AsString();

                            Console.WriteLine($"  Last Name: '{lastName}', with confidence {lastNameField.Confidence}");
                        }
                    }
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("JobTitles", out DocumentField jobTitlesFields))
    {
        if (jobTitlesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField jobTitleField in jobTitlesFields.Value.AsList())
            {
                if (jobTitleField.FieldType == DocumentFieldType.String)
                {
                    string jobTitle = jobTitleField.Value.AsString();

                    Console.WriteLine($"Job Title: '{jobTitle}', with confidence {jobTitleField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("Departments", out DocumentField departmentFields))
    {
        if (departmentFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField departmentField in departmentFields.Value.AsList())
            {
                if (departmentField.FieldType == DocumentFieldType.String)
                {
                    string department = departmentField.Value.AsString();

                    Console.WriteLine($"Department: '{department}', with confidence {departmentField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("Emails", out DocumentField emailFields))
    {
        if (emailFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField emailField in emailFields.Value.AsList())
            {
                if (emailField.FieldType == DocumentFieldType.String)
                {
                    string email = emailField.Value.AsString();

                    Console.WriteLine($"Email: '{email}', with confidence {emailField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("Websites", out DocumentField websiteFields))
    {
        if (websiteFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField websiteField in websiteFields.Value.AsList())
            {
                if (websiteField.FieldType == DocumentFieldType.String)
                {
                    string website = websiteField.Value.AsString();

                    Console.WriteLine($"Website: '{website}', with confidence {websiteField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("MobilePhones", out DocumentField mobilePhonesFields))
    {
        if (mobilePhonesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField mobilePhoneField in mobilePhonesFields.Value.AsList())
            {
                if (mobilePhoneField.FieldType == DocumentFieldType.PhoneNumber)
                {
                    string mobilePhone = mobilePhoneField.Value.AsPhoneNumber();

                    Console.WriteLine($"Mobile phone number: '{mobilePhone}', with confidence {mobilePhoneField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("WorkPhones", out DocumentField workPhonesFields))
    {
        if (workPhonesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField workPhoneField in workPhonesFields.Value.AsList())
            {
                if (workPhoneField.FieldType == DocumentFieldType.PhoneNumber)
                {
                    string workPhone = workPhoneField.Value.AsPhoneNumber();

                    Console.WriteLine($"Work phone number: '{workPhone}', with confidence {workPhoneField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("Faxes", out DocumentField faxesFields))
    {
        if (faxesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField faxField in faxesFields.Value.AsList())
            {
                if (faxField.FieldType == DocumentFieldType.PhoneNumber)
                {
                    string fax = faxField.Value.AsPhoneNumber();

                    Console.WriteLine($"Fax phone number: '{fax}', with confidence {faxField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("Addresses", out DocumentField addressesFields))
    {
        if (addressesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField addressField in addressesFields.Value.AsList())
            {
                if (addressField.FieldType == DocumentFieldType.String)
                {
                    string address = addressField.Value.AsString();

                    Console.WriteLine($"Address: '{address}', with confidence {addressField.Confidence}");
                }
            }
        }
    }

    if (businessCard.Fields.TryGetValue("CompanyNames", out DocumentField companyNamesFields))
    {
        if (companyNamesFields.FieldType == DocumentFieldType.List)
        {
            foreach (DocumentField companyNameField in companyNamesFields.Value.AsList())
            {
                if (companyNameField.FieldType == DocumentFieldType.String)
                {
                    string companyName = companyNameField.Value.AsString();

                    Console.WriteLine($"Company name: '{companyName}', with confidence {companyNameField.Confidence}");
                }
            }
        }
    }
}

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=csharp&Product=FormRecognizer&Page=how-to&Section=run-business-card) -->

Visit the Azure samples repository on GitHub to view the [business card model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/FormRecognizer/how-to-guide/business-card-model-output.md).
