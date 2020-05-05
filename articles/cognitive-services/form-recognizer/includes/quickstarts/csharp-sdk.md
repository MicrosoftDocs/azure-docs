---
title: "Quickstart: Form Recognizer client library for .NET"
description: In this quickstart, get started with the Form Recognizer client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 05/05/2020
ms.author: pafarley
---

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/1.0.0-preview.1/api/index.html) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../includes/create-resource.md)]

### Create environment variables

Using your key and endpoint from the resource you created, create two environment variables for authentication:

* `FORM_RECOGNIZER_KEY` - The resource key for authenticating your requests.
* `FORM_RECOGNIZER_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Use the following instructions to set environment variables on your operating system.

#### [Windows](#tab/windows)

```console
setx FORM_RECOGNIZER_KEY <replace-with-your-form-recognizer-key>
setx FORM_RECOGNIZER_ENDPOINT <replace-with-your-form-recognizer-endpoint>
```

After you add the environment variables, close and reopen the console window.

#### [Linux](#tab/linux)

```bash
export FORM_RECOGNIZER_KEY=<replace-with-your-product-name-key>
export FORM_RECOGNIZER_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export FORM_RECOGNIZER_KEY=<replace-with-your-product-name-key>
export FORM_RECOGNIZER_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variables, run `source .bash_profile` from your console window to make the changes effective.
***

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `formrecognizer-quickstart`. This command creates a simple "Hello World" C# project with a single source file: _Program.cs_. 

```console
dotnet new console -n formrecognizer-quickstart
```

Change your directory to the newly created app folder. Then build the application with:

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

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Add the following `using` directives:

```csharp
using Azure.AI.FormRecognizer;
using Azure.AI.FormRecognizer.Models;

using System;
using System.IO;
using System.Threading.Tasks;
```

Then add the following code in the application's **Main** method. You'll define this asynchronous task later on. 

```csharp
static void Main(string[] args)
{
    var t1 = RunFormRecognizerClient();

    Task.WaitAll(t1);
}
```

### Install the client library

Within the application directory, install the Form Recognizer client library for .NET with the following command:

```console
dotnet add package Azure.AI.FormRecognizer --version 1.0.0-preview.1
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


<!-- Objet model TBD -->



## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Recognize form contents](#detect-contents)
* [Recognize receipts](#receipts)
* [Train a custom Form Recognizer model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-custom-models)


## Authenticate the client

Below the `Main` method, define the task that is referenced in `Main`. Here, you'll authenticate two client objects using the subscription variables you defined above. You'll use an **AzureKeyCredential** object, so that if needed, you'll be able to update the API key without creating new client objects. You'll define the other methods later on.

TBD this uses your blob storage container. get the SAS URL.

```csharp
static async Task RunFormRecognizerClient()
{ 
    string endpoint = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_ENDPOINT");
    string apiKey = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_SUBSCRIPTION_KEY");
    var credential = new AzureKeyCredential(apiKey);
    
    var trainingClient = new FormTrainingClient(new Uri(endpoint), credential);
    var recognizerClient = new FormRecognizerClient(new Uri(endpoint), credential);

    // Call Form Recognizer scenarios:
    Console.WriteLine("Get form contents...");
    await GetContents(recognizerClient, formUrl);

    Console.WriteLine("Analyze receipt...");
    await AnalyzeReceipt(recognizerClient, receiptUrl);

    Console.WriteLine("Train Model with training data...");
    Guid modelId = await TrainModelAsync(formClient, trainingDataUrl);

    Console.WriteLine("Analyze PDF form...");
    await AnalyzePdfForm(recognizerClient, modelId, formUrl);

    Console.WriteLine("Manage models...");
    await ManageModels(formClient, trainingDataUrl) ;
}
```

## Recognize form contents

You can use Form Recognizer to recognize tables, lines, and words in documents, without needing to train a model.

To recognize the content from a given file at a URI, use the **StartRecognizeContentFromUri** method.

```csharp
private static async Task<Guid> GetContents(
    FormRecognizerClient recognizerClient, string invoiceUri)
{
    Response<IReadOnlyList<FormPage>> formPages = await recognizerClient
        .StartRecognizeContentFromUri(new Uri(invoiceUri))
        .WaitForCompletionAsync();
```

The returned value is a collection of **FormPage** objects: one for each page in the submitted document. The following code iterates through these and prints the extracted key/value pairs and table data.

```csharp
    foreach (FormPage page in formPages.Value)
    {
        Console.WriteLine($"Form Page {page.PageNumber} has {page.Lines.Count} lines.");
    
        for (int i = 0; i < page.Lines.Count; i++)
        {
            FormLine line = page.Lines[i];
            Console.WriteLine($"    Line {i} has {line.Words.Count} word{(line.Words.Count > 1 ? "s" : "")}, and text: '{line.Text}'.");
        }
    
        for (int i = 0; i < page.Tables.Count; i++)
        {
            FormTable table = page.Tables[i];
            Console.WriteLine($"Table {i} has {table.RowCount} rows and {table.ColumnCount} columns.");
            foreach (FormTableCell cell in table.Cells)
            {
                Console.WriteLine($"    Cell ({cell.RowIndex}, {cell.ColumnIndex}) contains text: '{cell.Text}'.");
            }
        }
    }
}
```

## Recognize receipts

This section demonstrates how to recognize and extract common fields from US receipts, using a pre-trained receipt model.

To recognize receipts from a URI, use the **StartRecognizeReceiptsFromUri** method. The returned value is a collection of **RecognizedReceipt** objects: one for each page in the submitted document. The following code processes a receipt at the given URI and prints the major fields and values to the console.

```csharp
private static async Task<Guid> AnalyzeReceipt(
    FormRecognizerClient recognizerClient, string receiptUri)
{
    Response<IReadOnlyList<RecognizedReceipt>> receipts = await recognizerClient.StartRecognizeReceiptsFromUri(new Uri(receiptUri)).WaitForCompletionAsync();
    foreach (var receipt in receipts.Value)
    {
        USReceipt usReceipt = receipt.AsUSReceipt();
    
        string merchantName = usReceipt.MerchantName?.Value ?? default;
        DateTime transactionDate = usReceipt.TransactionDate?.Value ?? default;
        IReadOnlyList<USReceiptItem> items = usReceipt.Items ?? default;
    
        Console.WriteLine($"Recognized USReceipt fields:");
        Console.WriteLine($"    Merchant Name: '{merchantName}', with confidence {usReceipt.MerchantName.Confidence}");
        Console.WriteLine($"    Transaction Date: '{transactionDate}', with confidence {usReceipt.TransactionDate.Confidence}");
```

The next block of code iterates through the individual items detected on the receipt and prints their details to the console.

```csharp
        for (int i = 0; i < items.Count; i++)
        {
            USReceiptItem item = usReceipt.Items[i];
            Console.WriteLine($"    Item {i}:  Name: '{item.Name.Value}', Quantity: '{item.Quantity?.Value}', Price: '{item.Price?.Value}'");
            Console.WriteLine($"    TotalPrice: '{item.TotalPrice.Value}'");
        }
```

Finally, the last block of code prints the rest of the major receipt details.

```csharp
        float subtotal = usReceipt.Subtotal?.Value ?? default;
        float tax = usReceipt.Tax?.Value ?? default;
        float tip = usReceipt.Tip?.Value ?? default;
        float total = usReceipt.Total?.Value ?? default;
    
        Console.WriteLine($"    Subtotal: '{subtotal}', with confidence '{usReceipt.Subtotal.Confidence}'");
        Console.WriteLine($"    Tax: '{tax}', with confidence '{usReceipt.Tax.Confidence}'");
        Console.WriteLine($"    Tip: '{tip}', with confidence '{usReceipt.Tip?.Confidence ?? 0.0f}'");
        Console.WriteLine($"    Total: '{total}', with confidence '{usReceipt.Total.Confidence}'");
    }
}
```

## Train a custom Form Recognizer model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

Please note that models can also be trained using a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to recognize all fields and values found in your custom forms without manually labeling the training documents.

The following method trains a model on a given set of documents and prints the model's status to the console. 

```csharp
private static async Task<Guid> TrainModelAsync(
    FormRecognizerClient trainingClient, string trainingDataUrl)
{
    CustomFormModel model = await trainingClient.StartTrainingAsync(new Uri(trainingDataUrl)).WaitForCompletionAsync();
    
    Console.WriteLine($"Custom Model Info:");
    Console.WriteLine($"    Model Id: {model.ModelId}");
    Console.WriteLine($"    Model Status: {model.Status}");
    Console.WriteLine($"    Created On: {model.CreatedOn}");
    Console.WriteLine($"    Last Modified: {model.LastModified}");
```

The returned **CustomFormModel** indicates the form types the model can recognize and the fields it can extract from each form type. The following code block prints this information to the console.

```csharp
    foreach (CustomFormSubModel subModel in model.Models)
    {
        Console.WriteLine($"SubModel Form Type: {subModel.FormType}");
        foreach (CustomFormModelField field in subModel.Fields.Values)
        {
            Console.Write($"    FieldName: {field.Name}");
            if (field.Label != null)
            {
                Console.Write($", FieldLabel: {field.Label}");
            }
            Console.WriteLine("");
        }
    }
```

Finally, return the model ID.

```csharp
    return model.ModelId;
}
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. This leads to better performance in some scenarios. In order to train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these files.

```csharp

private static async Task<Guid> TrainModelWithLabelsAsync(
    FormRecognizerClient trainingClient, string trainingDataUrl)
{
    CustomFormModel model = await trainingClient.StartTrainingAsync(new Uri(trainingDataUrl), useLabels: true).WaitForCompletionAsync();
    
    Console.WriteLine($"Custom Model Info:");
    Console.WriteLine($"    Model Id: {model.ModelId}");
    Console.WriteLine($"    Model Status: {model.Status}");
    Console.WriteLine($"    Created On: {model.CreatedOn}");
    Console.WriteLine($"    Last Modified: {model.LastModified}");
```

The returned **CustomFormModel** indicates the fields the model can extract, as well as the estimated accuracy for each field.

```csharp
    foreach (CustomFormSubModel subModel in model.Models)
    {
        Console.WriteLine($"SubModel Form Type: {subModel.FormType}");
        foreach (CustomFormModelField field in subModel.Fields.Values)
        {
            Console.Write($"    FieldName: {field.Name}");
            if (field.Accuracy != null)
            {
                Console.Write($", Accuracy: {field.Accuracy}");
            }
            Console.WriteLine("");
        }
    }
}
```

## Analyze forms with a custom model

This sample demonstrates how to recognize form fields and other content from your custom form types, using models you trained with your own forms. For more information on how to do the training, see train a model.

You'll use the **StartRecognizeCustomFormsFromUri** method. The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model and passed its ID into the method below. See the [Train a model](#Train-a-model-without-labels) section.

```csharp
// Analyze PDF form data
private static async Task AnalyzeForm(
    FormRecognizerClient formClient, Guid modelId, string pdfFormFile)
{    
    Response<IReadOnlyList<RecognizedForm>> forms = await recognizerClient.StartRecognizeCustomFormsFromUri(modelId, new Uri(formUri)).WaitForCompletionAsync();
```

tbd print
```csharp
    foreach (RecognizedForm form in forms.Value)
    {
        Console.WriteLine($"Form of type: {form.FormType}");
        foreach (FormField field in form.Fields.Values)
        {
            Console.WriteLine($"Field '{field.Name}: ");
    
            if (field.LabelText != null)
            {
                Console.WriteLine($"    Label: '{field.LabelText.Text}");
            }
    
            Console.WriteLine($"    Value: '{field.ValueText.Text}");
            Console.WriteLine($"    Confidence: '{field.Confidence}");
        }
    }
}
```

## Manage your custom models

This section demonstrates how to manage the custom models stored in your account. The following code does all the model management tasks in a single method. Start by copying the method signature below:

```csharp
private static async Task ManageModels(FormRecognizerClient formClient, string trainingFileUrl)
{
```

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

```csharp
    // Check number of models in the FormRecognizer account, and the maximum number of models that can be stored.
    AccountProperties accountProperties = trainingClient.GetAccountProperties();
    Console.WriteLine($"Account has {accountProperties.CustomModelCount} models.");
    Console.WriteLine($"It can have at most {accountProperties.CustomModelLimit} models.");
```

### List the models currently stored in the resource account

The following code blocks lists the current models in your account and prints their details to the command line.

```csharp
    // List the first ten or fewer models currently stored in the account.
    Pageable<CustomFormModelInfo> models = trainingClient.GetModelInfos();
    
    foreach (CustomFormModelInfo modelInfo in models.Take(10))
    {
        Console.WriteLine($"Custom Model Info:");
        Console.WriteLine($"    Model Id: {modelInfo.ModelId}");
        Console.WriteLine($"    Model Status: {modelInfo.Status}");
        Console.WriteLine($"    Created On: {modelInfo.CreatedOn}");
        Console.WriteLine($"    Last Modified: {modelInfo.LastModified}");
    }
```

### Get a specific model using the model's ID

The following code block trains a new model (just like in the [Train a model](#Train-a-model-without-labels) section) and then retrieves a reference to it using its ID.

```csharp
    // Create a new model to store in the account
    CustomFormModel model = await trainingClient.StartTrainingAsync(new Uri(trainingFileUrl)).WaitForCompletionAsync();
    
    // Get the model that was just created
    CustomFormModel modelCopy = trainingClient.GetCustomModel(model.ModelId);
    
    Console.WriteLine($"Custom Model {modelCopy.ModelId} recognizes the following form types:");
    
    foreach (CustomFormSubModel subModel in modelCopy.Models)
    {
        Console.WriteLine($"SubModel Form Type: {subModel.FormType}");
        foreach (CustomFormModelField field in subModel.Fields.Values)
        {
            Console.Write($"    FieldName: {field.Name}");
            if (field.Label != null)
            {
                Console.Write($", FieldLabel: {field.Label}");
            }
            Console.WriteLine("");
        }
    }
```

### Delete a model from the resource account

You can also delete a model from your account by referencing it by ID.

```csharp
    // Delete the model from the account.
    trainingClient.DeleteModel(model.ModelId);
}
```

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

When you interact with the Cognitive Services Form Recognizer client library using the .NET SDK, errors returned by the service will result in a `RequestFailedException` with the same HTTP status code returned by the [REST API][formreco_rest_api] request.

For example, if you submit a receipt image with an invalid `Uri`, a `400` error is returned, indicating "Bad Request".

```csharp Snippet:FormRecognizerBadRequest
try
{
    Response<IReadOnlyList<RecognizedReceipt>> receipts = await client.StartRecognizeReceiptsFromUri(new Uri("http://invalid.uri")).WaitForCompletionAsync();
}
catch (RequestFailedException e)
{
    Console.WriteLine(e.ToString());
}
```

You will notice that additional information is logged, like the client request ID of the operation.

```
Message:
    Azure.RequestFailedException: Service request failed.
    Status: 400 (Bad Request)

Content:
    {"error":{"code":"FailedToDownloadImage","innerError":{"requestId":"8ca04feb-86db-4552-857c-fde903251518"},"message":"Failed to download image from input URL."}}

Headers:
    Transfer-Encoding: chunked
    x-envoy-upstream-service-time: REDACTED
    apim-request-id: REDACTED
    Strict-Transport-Security: REDACTED
    X-Content-Type-Options: REDACTED
    Date: Mon, 20 Apr 2020 22:48:35 GMT
    Content-Type: application/json; charset=utf-8
```

## Next steps

In this quickstart, you used the Form Recognizer .NET client library to train models and analyze forms in a variety of ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../build-training-data-set.md)

* [What is Form Recognizer?](../overview.md)
