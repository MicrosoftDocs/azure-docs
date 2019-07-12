---
title: "Quickstart: Form Recognizer client library for .NET | Microsoft Docs"
description: Get started with the Form Recognizer client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: quickstart
ms.date: 07/12/2019
ms.author: pafarley
---

# Quickstart: Form Recognizer client library for .NET

Get started with the Form Recognizer client library for .NET. Form Recognizer is a cognitive service that uses machine learning technology to identify and extract key-value pairs and table data from form documents. It then outputs structured data that includes the relationships in the original file. Follow these steps to install the SDK package and try out the example code for basic tasks.

Use the Form Recognizer client library for .NET to:

* Train a custom Form Recognizer model
* Analyze forms with a custom model
* Get a list of form models
* Display analysis results

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/formrecognizer?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.FormRecognizer) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.FormRecognizer/)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

<!--
    Walk the reader through preparing their environment for working with the client library. Include instructions for creating the Azure resources required to make calls to the service, obtaining credentials, and setting up their local development environment.

    See the "setting up" section for more details: 
    https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-write-library-quickstart-v2?branch=pr-en-us-2187#setting-up -->

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../includes/create-resource.md)]l

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `FORM_RECOGNIZER_KEY`.

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `(product-name)-quickstart`. This command creates a simple "Hello World" C# project with a single source file: _Program.cs_. 

```console
dotnet new console -n (product-name)-quickstart
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

From the project directory, open the _Program.cs_ file in your preferred editor or IDE. Add the following `using` directives:

```csharp
using Microsoft.Azure.CognitiveServices.FormRecognizer;
using Microsoft.Azure.CognitiveServices.FormRecognizer.Models;

using System;
using System.IO;
using System.Threading.Tasks;
```

In the application's **Main** method, create variables for your resource's Azure location and your subscription key as an environment variable. If you create the environment variable after the application is launched, you'll need to close and reload the editor, IDE, or shell running it. You will define the included method(s) later.

```csharp
static void Main(string[] args){
    var t1 = RunFormRecognizerClient();
    Task.WaitAll(t1);
}
```

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
|[TrainResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.trainresult?view=azure-dotnet-preview)| This class delivers the results of a custom model Train operation, including the model ID which you can then use to analyze forms. |
|[AnalyzeResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.analyzeresult?view=azure-dotnet-preview)| This class delivers the results of a custom model Analyze operation. It includes a list of **ExtractedPage** instances. |
|[ExtractedPage](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.formrecognizer.models.extractedpage?view=azure-dotnet-preview)| This class represents all of the data extracted from a single form document.|
<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.
    Briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first time
-->

These code snippets show you how to do the following with the Form Recognizer client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* Train a custom model
* Analyze forms with a custom model
* Get a list of form models
* Display analysis results

### Authenticate the client

<!-- 
    The authentication section (and its H3) is required and must be the first code example in the section if your library requires authentication for use.
-->


> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Form Recognizer key, named `FORM_RECOGNIZER_KEY`.


In a new method, instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.

```csharp

```

### Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

## Run the application

Run the application by calling the dotnet `run` command from your application directory.

```console
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Build a training data set](../build-training-data-set)

* [What is Form Recognizer?](../overview.md)
* The source code for this sample can be found on [GitHub](TBD).