---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
---

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.1.0) | [Additional samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Language Services API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

## Setting up

### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This will create a "Hello World" project with a single C# source file: *program.cs*.

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Make sure **Include prerelease** is checked. Select version `5.2.0-beta.1`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).


## Code example

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it [on GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/TextAnalytics/program.cs), which contains the code examples in this quickstart. 

Copy the following code into your *program.cs* file. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```csharp
using Azure;
using System;
using Azure.AI.TextAnalytics;

namespace KeyPhraseExtractionExample
{
    class Program
    {
        private static readonly AzureKeyCredential credentials = new AzureKeyCredential("replace-with-your-key-here");
        private static readonly Uri endpoint = new Uri("replace-with-your-endpoint-here");

        // Example method for extracting key phrases from text
        static void KeyPhraseExtractionExample(TextAnalyticsClient client)
        {
            var response = client.ExtractKeyPhrases("My cat might need to see a veterinarian.");

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
        cat
        veterinarian
```