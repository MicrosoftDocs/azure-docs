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
ms.date: 08/16/2023
keywords: 
---

Use this guide to get started generating images with the Azure OpenAI SDK for C#.

[Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.OpenAI/) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to Azure OpenAI Service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- The [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Set up

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

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.AI.OpenAI;

namespace Azure.AI.OpenAI.Tests.Samples
{
    public partial class GenerateImages
    {
        // add an async Main method:
        public static async Task Main(string[] args)
        {
            string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
            string key = GetEnvironmentVariable("AZURE_OPENAI_KEY");

            OpenAIClient client = new(new Uri(endpoint), new AzureKeyCredential(key));

            Response<ImageGenerations> imageGenerations = await client.GetImageGenerationsAsync(
                new ImageGenerationOptions()
                {
                    Prompt = "a happy monkey eating a banana, in watercolor",
                    Size = ImageSize.Size256x256,
                });

            // Image Generations responses provide URLs you can use to retrieve requested images
            Uri imageUri = imageGenerations.Value.Data[0].Url;
            
            // Print the image URI to console:
            Console.WriteLine(imageUri);
        }
    }
}
```

Build and run the application from your application directory with these commands:

```dotnet
dotnet build
dotnet run
```

## Output

The URL of the generated image is printed to the console.

```console
https://dalleproduse.blob.core.windows.net/private/images/552c5522-af4a-4877-a19c-400fac04a422/generated_00.png?se=2023-08-17T16%3A54%3A40Z&sig=XGCIx9r0WvWTJ0LL%2FJGymo2WYp4FDbSQNNrGRUnnUzI%3D&ske=2023-08-19T01%3A10%3A14Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-08-12T01%3A10%3A14Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02
```

> [!NOTE]
> The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [Azure OpenAI Overview](../overview.md)
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
