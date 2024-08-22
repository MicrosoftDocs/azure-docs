---
title: 'Quickstart: Use Azure OpenAI Service with the C# SDK to generate images'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first image generation call with the C# SDK. 
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: PatrickFarley
ms.author: pafarley
ms.date: 06/26/2024
---

Use this guide to get started generating images with the Azure OpenAI SDK for C#.

[Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.OpenAI/) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- The [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).


## Setup

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


## Create a new .NET Core application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `azure-openai-quickstart`. This command creates a simple "Hello World" project with a single C# source file: *Program.cs*.

```dotnetcli
dotnet new console -n azure-openai-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnetcli
dotnet build
```

The build output should contain no warnings or errors.

```output
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

## Install the OpenAI .NET SDK

Install the client library with:

```dotnetcli
dotnet add package Azure.AI.OpenAI --version 1.0.0-beta.6
```

## Generate images with DALL-E

From the project directory, open the *program.cs* file and replace the contents with the following code:

```csharp
using Azure;
using Azure.AI.OpenAI;
using OpenAI.Images;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string key = GetEnvironmentVariable("AZURE_OPENAI_API_KEY");

AzureOpenAIClient azureClient = new(
    new Uri(endpoint),
    new AzureKeyCredential(key));

// This must match the custom deployment name you chose for your model
ImageClient chatClient = azureClient.GetImageClient("dalle-3");

var imageGeneration = await chatClient.GenerateImageAsync(
        "a happy monkey sitting in a tree, in watercolor",
        new ImageGenerationOptions()
        {
            Size = GeneratedImageSize.W1024xH1024
        }
    );

Console.WriteLine(imageGeneration.Value.ImageUri);
```

Build and run the application from your application directory with these commands:

```dotnet
dotnet build
dotnet run
```

## Output

The URL of the generated image is printed to the console.

```console
https://dalleproduse.blob.core.windows.net/private/images/b7ac5e55-f1f8-497a-8d0e-8f51446bf538/generated_00.png?se=2024-07-12T13%3A47%3A56Z&sig=Zri37iYVTVtc52qzTFBOqPgSHvXwEhcO86Smv2ojB%2FE%3D&ske=2024-07-17T12%3A15%3A44Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2024-07-10T12%3A15%3A44Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02
```

> [!NOTE]
> The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Explore the image generation APIs in more depth with the [DALL-E how-to guide](../how-to/dall-e.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
