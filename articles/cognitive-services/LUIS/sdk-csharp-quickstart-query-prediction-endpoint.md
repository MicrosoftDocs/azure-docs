---
title: "Quickstart: C# SDK query prediction endpoint - LUIS"
titleSuffix: Azure Cognitive Services
description: This quickstart will show you how to use the C# SDK to send a user utterance to the Azure Cognitive Services LUIS application and receive a prediction.
author: diberry
manager: nitinme
ms.service: cognitive-services
services: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 12/09/2019
ms.author: diberry
---

# Quickstart: Query V3 prediction endpoint with C# .NET SDK

Use the .NET SDK, found on [NuGet](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/), to send a user utterance to Language Understanding (LUIS) and receive a prediction of the user's intention.

Use the Language Understanding (LUIS) prediction client library for .NET to:

* Get prediction by slot

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.LUIS.Runtime) | [Prediction runtime Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/LanguageUnderstanding/predict-with-sdk-3x)

## Prerequisites

* Language Understanding (LUIS) portal account - [Create one for free](https://www.luis.ai)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

Looking for more documentation?

 * [SDK reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet)

## Setting up

### Create an environment variable

Using your key, and the name of your resource, create two environment variables for authentication:

* `LUIS_PREDICTION_KEY` - The resource key for authenticating your requests.
* `LUIS_ENDPOINT_NAME` - The resource name associated with your key.

Use the instructions for your operating system.

#### [Windows](#tab/windows)

```console
setx LUIS_PREDICTION_KEY <replace-with-your-resource-key>
setx LUIS_ENDPOINT_NAME <replace-with-your-resource-name>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export LUIS_PREDICTION_KEY=<replace-with-your-resource-key>
export LUIS_ENDPOINT_NAME=<replace-with-your-resource-name>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export LUIS_PREDICTION_KEY=<replace-with-your-resource-key>
export LUIS_ENDPOINT_NAME=<replace-with-your-resource-name>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

1. In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `language-understanding-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.

    ```dotnetcli
    dotnet new console -n language-understanding-quickstart
    ```

1. Change your directory to the newly created app folder.

1. You can build the application with:

    ```dotnetcli
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

### Install the SDK

Within the application directory, install the Language Understanding (LUIS) prediction runtime client library for .NET with the following command:

```dotnetcli
dotnet add package Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime --version 3.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The Language Understanding (LUIS) prediction runtime client is a [LUISRuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.luisruntimeclient?view=azure-dotnet) object that authenticates to Azure, which contains your resource key.

Once the client is created, use this client to access functionality including:

* Prediction by [staging or product slot](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.predictionoperationsextensions.getslotpredictionasync?view=azure-dotnet)
* Prediction by [version](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.predictionoperationsextensions.getversionpredictionasync?view=azure-dotnet)


## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) prediction runtime client library for .NET:

* [Prediction by slot](#get-prediction-from-runtime)

## Add the dependencies

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/predict-with-sdk-3x/Program.cs?name=snippet_using)]

## Authenticate the client

1. Create variables for the key, name and app ID:

    A variables to manage your prediction key pulled from an environment variable named `LUIS_PREDICTION_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

    Create a variable to hold your resource name `LUIS_ENDPOINT_NAME`.

    Create a variable for the app ID as an environment variable named `LUIS_APP_ID`. Set the environment variable to the public IoT app:

    **`df67dcdb-c37d-46af-88e1-8b97951ca1c2`**

    [!code-csharp[Create variables](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/predict-with-sdk-3x/Program.cs?name=snippet_variables)]

1. Create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [LUISRuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.luisruntimeclient?view=azure-dotnet) object.

    [!code-csharp[Create LUIS client object](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/predict-with-sdk-3x/Program.cs?name=snippet_create_client)]

## Get prediction from runtime

Add the following method to create the request to the prediction runtime.

The user utterance is part of the [PredictionRequest](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.models.predictionrequest?view=azure-dotnet) object.

The **GetSlotPredictionAsync** method needs several parameters such as the app ID, the slot name, the prediction request object to fulfill the request. The other options such as verbose, show all intents, and log are optional.

[!code-csharp[Create method to get prediction runtime](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/predict-with-sdk-3x/Program.cs?name=snippet_maintask)]

## Main code for the prediction

Use the following main method to tie the variables and methods together to get the prediction.

[!code-csharp[Create method to get prediction runtime](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/predict-with-sdk-3x/Program.cs?name=snippet_main)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

```dotnetcli
dotnet run
```

## Clean up resources

When you are done with your predictions, clean up the work from this quickstart by deleting the program.cs file and its subdirectories.

## Next steps

Learn more about the [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) and the [.NET reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet).

> [!div class="nextstepaction"]
> [Tutorial: Build LUIS app to determine user intentions](luis-quickstart-intents-only.md)