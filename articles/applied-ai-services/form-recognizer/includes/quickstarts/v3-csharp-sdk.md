> [!IMPORTANT]
>
> * This quickstart SDK targets REST API version **v3.0**.
>
[Reference documentation](/dotnet/api/overview/azure/ai.formrecognizer-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze form fields, text, and tables in form documents. The C# SDK supports the following models and capabilities:

### Form Recognizer models

* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Custom forms—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**Layout API**](#layout-api-analyze-form-and-document-content)

* [**Invoice model**](#prebuilt-model-analyze-invoice-document-content)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)

* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

* Once you have your Azure subscription, [create a Form Recognizer resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.

  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.

  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  * An **image of or URL for a form document**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.

  * An **image of or URL for an invoice document**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

### Create a FormRecognizerClient

In the sample below you'll use a Form Recognizer API key credential by creating an `AzureKeyCredential` object, will allow you to update the API key without creating a new client.

You can set `endpoint` and `apiKey` based on an environment variable, a configuration setting, or any way that works for your application.

```csharp
string endpoint = "<endpoint>";
string apiKey = "<apiKey>";
var credential = new AzureKeyCredential(apiKey);
var client = new FormRecognizerClient(new Uri(endpoint), credential);
```

## Layout API: analyze form and document content

You can analyze form and document content from a given URI or file. The returned value is a collection of `FormPage` objects -- one for each page in the submitted document.

### Analyze form content from a URI

Copy and paste the full code sample below to recognize the content from a given file at a URI. You'll use the `StartRecognizeContentFromUri` method.

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