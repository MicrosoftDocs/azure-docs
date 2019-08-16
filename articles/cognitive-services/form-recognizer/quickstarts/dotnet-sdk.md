---
title: "Quickstart: Form Recognizer client library for .NET | Microsoft Docs"
description: Get started with the Form Recognizer client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 07/12/2019
ms.author: pafarley
---

# Quickstart: Form Recognizer client library for .NET

Get started with the Form Recognizer client library for .NET. Form Recognizer is a Cognitive Service that uses machine learning technology to identify and extract key/value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. Follow these steps to install the SDK package and try out the example code for basic tasks.

Use the Form Recognizer client library for .NET to:

* Train a custom Form Recognizer model
* Analyze forms with a custom model
* Get a list of custom models

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/formrecognizer?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.FormRecognizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.FormRecognizer/)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../build-training-data-set.md) for tips and options for putting together your training data. 

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../includes/create-resource.md)]

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `FORM_RECOGNIZER_KEY`.

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

From the project directory, open the _Program.cs_ file in your preferred editor or IDE. Add the following `using` statements:

```csharp
using Microsoft.Azure.CognitiveServices.FormRecognizer;
using Microsoft.Azure.CognitiveServices.FormRecognizer.Models;

using System;
using System.IO;
using System.Threading.Tasks;
```

Then add the following code in the application's **Main** method. You'll define this asynchronous task later on.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_main)]

### Install the client library

Within the application directory, install the Form Recognizer client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.FormRecognizer --version 0.8.0-preview
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The following classes handle the main functionality of the Form Recognizer SDK.

|Name|Description|
|---|---|
|[FormRecognizerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.formrecognizerclient?view=azure-dotnet-preview)|This class is needed for all Form Recognizer functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[TrainRequest](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.trainrequest?view=azure-dotnet-preview)| You use this class to train a custom Form Recognizer model using your own training input data. |
|[TrainResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.trainresult?view=azure-dotnet-preview)| This class delivers the results of a custom model Train operation, including the model ID, which you can then use to analyze forms. |
|[AnalyzeResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.analyzeresult?view=azure-dotnet-preview)| This class delivers the results of a custom model Analyze operation. It includes a list of **ExtractedPage** instances. |
|[ExtractedPage](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.extractedpage?view=azure-dotnet-preview)| This class represents all of the data extracted from a single form document.|

## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first time
-->

These code snippets show you how to do the following tasks with the Form Recognizer client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Train a custom Form Recognizer model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Get a list of custom models](#get-a-list-of-custom-models)

### Define variables

Before you define any methods, add the following variable definitions to the top of your **Program** class. You'll need to fill in some of the variables yourself. 

* You can find your service's Endpoint value in the **Overview** section in the Azure portal. 
* To retrieve the SAS URL for your training data, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_variables)]

### Authenticate the client

Below the `Main` method, define the task that is referenced in `Main`. Here, you'll authenticate the client object using the subscription variables you defined above. You'll define the other methods later on.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_maintask)]

### Train a custom model

The following method uses your Form Recognizer client object to train a new recognition model on the documents stored in your Azure blob container. It uses a helper method to display information about the newly trained model (represented by a [ModelResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.modelresult?view=azure-dotnet-preview) object), and it returns the model ID.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_train)]

The following helper method displays information about a Form Recognizer model.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_displaymodel)]

### Analyze forms with a custom model

This method uses the Form Recognizer client and a model ID to analyze a PDF form document and extract key/value data. It uses a helper method to display the results (represented by a [AnalyzeResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.analyzeresult?view=azure-dotnet-preview) object).

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_analyzepdf)]

The following helper method displays information about an Analyze operation.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_displayanalyze)]

### Get a list of custom models

You can return a list of all the trained models that belong to your account, and you can retrieve information about when they were created. The list of models is represented by a [ModelsResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.modelsresult?view=azure-dotnet-preview) object.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/FormRecognizer/Program.cs?name=snippet_getmodellist)]

## Run the application

Run the application by calling the `dotnet run` command from your application directory.

```console
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you used the Form Recognizer .NET client library to train a custom model and analyze forms. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
>[Build a training data set](../build-training-data-set.md)

* [What is Form Recognizer?](../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/FormRecognizer).
