---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 03/29/2024
ms.author: jboback
---

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [More samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics)

Use this quickstart to create a language detection application with the client library for .NET. In the following example, you create a C# application that can identify the language a text sample was written in.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)


## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]


### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This creates a "Hello World" project with a single C# source file: *program.cs*.

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Select version `5.2.0`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).


## Code example

Copy the following code into your *program.cs* file. Then run the code.  

```csharp
using Azure;
using System;
using Azure.AI.TextAnalytics;

namespace LanguageDetectionExample
{
    class Program
    {
        // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
        static string languageKey = Environment.GetEnvironmentVariable("LANGUAGE_KEY");
        static string languageEndpoint = Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT");

        private static readonly AzureKeyCredential credentials = new AzureKeyCredential(languageKey);
        private static readonly Uri endpoint = new Uri(languageEndpoint);

        // Example method for detecting the language of text
        static void LanguageDetectionExample(TextAnalyticsClient client)
        {
            DetectedLanguage detectedLanguage = client.DetectLanguage("Ce document est rédigé en Français.");
            Console.WriteLine("Language:");
            Console.WriteLine($"\t{detectedLanguage.Name},\tISO-6391: {detectedLanguage.Iso6391Name}\n");
        }

        static void Main(string[] args)
        {
            var client = new TextAnalyticsClient(languageEndpoint, languageKey);
            LanguageDetectionExample(client);

            Console.Write("Press any key to exit.");
            Console.ReadKey();
        }

    }
}

```



### Output

```console
Language:
    French, ISO-6391: fr
```
