---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet) | [More samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics)

Use this quickstart to create a key phrase extraction application with the client library for .NET. In the following example, you create a C# application that can identify key words and phrases found in text.


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

namespace KeyPhraseExtractionExample
{
    class Program
    {
        // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
        static string languageKey = Environment.GetEnvironmentVariable("LANGUAGE_KEY");
        static string languageEndpoint = Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT");

        private static readonly AzureKeyCredential credentials = new AzureKeyCredential(languageKey);
        private static readonly Uri endpoint = new Uri(languageEndpoint);

        // Example method for extracting key phrases from text
        static void KeyPhraseExtractionExample(TextAnalyticsClient client)
        {
            var response = client.ExtractKeyPhrases(@"Dr. Smith has a very modern medical office, and she has great staff.");

            // Printing key phrases
            Console.WriteLine("Key phrases:");

            foreach (string keyphrase in response.Value)
            {
                Console.WriteLine($"\t{keyphrase}");
            }
        }

        static void Main(string[] args)
        {
            var client = new TextAnalyticsClient(endpoint, credentials);
            KeyPhraseExtractionExample(client);

            Console.Write("Press any key to exit.");
            Console.ReadKey();
        }

    }
}
```




### Output

```console
Key phrases:
    modern medical office
    Dr. Smith
    great staff
```
