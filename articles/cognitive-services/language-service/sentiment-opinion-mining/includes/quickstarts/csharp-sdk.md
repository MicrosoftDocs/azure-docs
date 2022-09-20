---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 09/15/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet) | [Additional samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics)

Use this quickstart to create a sentiment analysis application with the client library for .NET. In the following example, you will create a C# application that can identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.


[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Setting up

### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This will create a "Hello World" project with a single C# source file: *program.cs*.

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Select version `5.2.0`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Code example

Copy the following code into your *program.cs* file. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```csharp
using Azure;
using System;
using Azure.AI.TextAnalytics;
using System.Collections.Generic;

namespace Example
{
    class Program
    {
        private static readonly AzureKeyCredential credentials = new AzureKeyCredential("replace-with-your-key-here");
        private static readonly Uri endpoint = new Uri("replace-with-your-endpoint-here");

        // Example method for detecting opinions text. 
        static void SentimentAnalysisWithOpinionMiningExample(TextAnalyticsClient client)
        {
            var documents = new List<string>
            {
                "The food and service were unacceptable. The concierge was nice, however."
            };

            AnalyzeSentimentResultCollection reviews = client.AnalyzeSentimentBatch(documents, options: new AnalyzeSentimentOptions()
            {
                IncludeOpinionMining = true
            });

            foreach (AnalyzeSentimentResult review in reviews)
            {
                Console.WriteLine($"Document sentiment: {review.DocumentSentiment.Sentiment}\n");
                Console.WriteLine($"\tPositive score: {review.DocumentSentiment.ConfidenceScores.Positive:0.00}");
                Console.WriteLine($"\tNegative score: {review.DocumentSentiment.ConfidenceScores.Negative:0.00}");
                Console.WriteLine($"\tNeutral score: {review.DocumentSentiment.ConfidenceScores.Neutral:0.00}\n");
                foreach (SentenceSentiment sentence in review.DocumentSentiment.Sentences)
                {
                    Console.WriteLine($"\tText: \"{sentence.Text}\"");
                    Console.WriteLine($"\tSentence sentiment: {sentence.Sentiment}");
                    Console.WriteLine($"\tSentence positive score: {sentence.ConfidenceScores.Positive:0.00}");
                    Console.WriteLine($"\tSentence negative score: {sentence.ConfidenceScores.Negative:0.00}");
                    Console.WriteLine($"\tSentence neutral score: {sentence.ConfidenceScores.Neutral:0.00}\n");

                    foreach (SentenceOpinion sentenceOpinion in sentence.Opinions)
                    {
                        Console.WriteLine($"\tTarget: {sentenceOpinion.Target.Text}, Value: {sentenceOpinion.Target.Sentiment}");
                        Console.WriteLine($"\tTarget positive score: {sentenceOpinion.Target.ConfidenceScores.Positive:0.00}");
                        Console.WriteLine($"\tTarget negative score: {sentenceOpinion.Target.ConfidenceScores.Negative:0.00}");
                        foreach (AssessmentSentiment assessment in sentenceOpinion.Assessments)
                        {
                            Console.WriteLine($"\t\tRelated Assessment: {assessment.Text}, Value: {assessment.Sentiment}");
                            Console.WriteLine($"\t\tRelated Assessment positive score: {assessment.ConfidenceScores.Positive:0.00}");
                            Console.WriteLine($"\t\tRelated Assessment negative score: {assessment.ConfidenceScores.Negative:0.00}");
                        }
                    }
                }
                Console.WriteLine($"\n");
            }
        }

        static void Main(string[] args)
        {
            var client = new TextAnalyticsClient(endpoint, credentials);
            SentimentAnalysisWithOpinionMiningExample(client);

            Console.Write("Press any key to exit.");
            Console.ReadKey();
        }

    }
}
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CSHARP&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>


## Output

```console
Document sentiment: Mixed

    Positive score: 0.47
    Negative score: 0.52
    Neutral score: 0.00

    Text: "The food and service were unacceptable. "
    Sentence sentiment: Negative
    Sentence positive score: 0.00
    Sentence negative score: 0.99
    Sentence neutral score: 0.00

    Target: food, Value: Negative
    Target positive score: 0.00
    Target negative score: 1.00
            Related Assessment: unacceptable, Value: Negative
            Related Assessment positive score: 0.00
            Related Assessment negative score: 1.00
    Target: service, Value: Negative
    Target positive score: 0.00
    Target negative score: 1.00
            Related Assessment: unacceptable, Value: Negative
            Related Assessment positive score: 0.00
            Related Assessment negative score: 1.00
    Text: "The concierge was nice, however."
    Sentence sentiment: Positive
    Sentence positive score: 0.94
    Sentence negative score: 0.05
    Sentence neutral score: 0.01

    Target: concierge, Value: Positive
    Target positive score: 1.00
    Target negative score: 0.00
            Related Assessment: nice, Value: Positive
            Related Assessment positive score: 1.00
            Related Assessment negative score: 0.00
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Entity-linking&Page=quickstart&Section=Clean-up-resources" target="_target">I ran into an issue</a>

## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet)
* [Additional samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)