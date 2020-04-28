---
title: "Quickstart: Form Recognizer client library for .NET"
description: In this quickstart, get started with the Form Recognizer client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/28/2020
ms.author: pafarley
---

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/1.0.0-preview.1/api/index.html) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../build-training-data-set.md) for tips and options for putting together your training data. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../includes/create-resource.md)]

### Create environment variables

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:
<!-- replace the below variable names with the names expected in the code sample.-->
* `FORM_RECOGNIZER_KEY` - The resource key for authenticating your requests.
* `FORM_RECOGNIZER_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.
<!-- replace the below endpoint and key examples -->
#### [Windows](#tab/windows)

```console
setx FORM_RECOGNIZER_KEY <replace-with-your-form-recognizer-key>
setx FORM_RECOGNIZER_ENDPOINT <replace-with-your-form-recognizer-endpoint>
```

After you add the environment variables, close and reopen the console window.

#### [Linux](#tab/linux)

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export PRODUCT_NAME_KEY=<replace-with-your-product-name-key>
export PRODUCT_NAME_ENDPOINT=<replace-with-your-product-name-endpoint>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
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

From the project directory, open the *program.cs* file in your preferred editor or IDE. Add the following `using` directives:



In the application's `Main` method, create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable. You will define the methods later.


### Install the client library

Within the application directory, install the Form Recognizer client library for .NET with the following command:

```console
dotnet add package Azure.AI.FormRecognizer --version 1.0.0-preview.1
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.
    Briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first time
-->

These code snippets show you how to do the following tasks with the [Product Name] client library for .NET:

* [Authenticate the client](#)
* [Example task 1 (anchor link)](#)
* [Example task 2 (anchor link)](#)
* [Example task 3 (anchor link)](#)

<!--
    change the environment key variable to something descriptive for your service.
    For example: TEXT_ANALYTICS_KEY
-->

## Authenticate the client

<!-- 
    The authentication section (and its H3) is required and must be the first code example in the section if your library requires authentication for use.
-->

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your [Product Name] key, named `TBD_KEY`.


In a new method, instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.

```csharp

```

## Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

## Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

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

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the [Product Name] API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().
