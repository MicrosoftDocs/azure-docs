---
title: 'Quickstart: Using C# to call the Text Analytics API'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started with using the Text Analytics API.
services: cognitive-services
author: ashmaka
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 01/02/2019
ms.author: assafi
---

# Quickstart: Using C# to call the Text Analytics Cognitive Service
<a name="HOLTop"></a>

This article shows you how to detect language, analyze sentiment, and extract key phrases using the [Text Analytics APIs](//go.microsoft.com/fwlink/?LinkID=759711) with C#. The code was written to work on a .NET Core application, with minimal references to external libraries, so you could also run it on Linux or MacOS.

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign-up.

## Install the NuGet SDK Package
1. Create a new Console solution in Visual Studio.
1. Right click on the solution and click **Manage NuGet Packages for Solution**
1. Mark the **Include Prerelease** checkbox.
1. Select the **Browse** tab, and Search for **Microsoft.Azure.CognitiveServices.Language.TextAnalytics**
1. Select the NuGet package and install it. You may need to downgrade to v2.8.0 for now (as of 3-18-2019) until the sample code is updated with v3.0.0.

> [!Tip]
>  While you could call the [HTTP endpoints](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) directly from C#, the Microsoft.Azure.CognitiveServices.Language SDK makes it much easier to call the service without having to worry about serializing and deserializing JSON.
>
> A few useful links:
> - [SDK Nuget page](<https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics>)
> - [SDK code](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/CognitiveServices/dataPlane/Language/TextAnalytics)

## Call the Text Analytics API using the SDK

1. Replace Program.cs with the code provided below. This program demonstrates the capabilities of the Text Analytics API in three sections (language extraction, key-phrase extraction, and sentiment analysis).
1. Replace the `Ocp-Apim-Subscription-Key` header value with an access key valid for your subscription.
1. Replace the region in `Endpoint`. You can find your endpoint in the overview section of your Text Analytics resource in the [Azure portal](<https://ms.portal.azure.com>). Include only this portion of your endpoint: "https://[region].api.cognitive.microsoft.com".
1. Run the program.

```csharp
using System;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics.Models;
using System.Collections.Generic;
using Microsoft.Rest;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        /// <summary>
        /// Container for subscription credentials. Make sure to enter your valid key.
        private const string SubscriptionKey = ""; //Insert your Text Anaytics subscription key

        /// </summary>
        class ApiKeyServiceClientCredentials : ServiceClientCredentials
        {
            public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                request.Headers.Add("Ocp-Apim-Subscription-Key", SubscriptionKey);
                return base.ProcessHttpRequestAsync(request, cancellationToken);
            }
        }

        static void Main(string[] args)
        {

            // Create a client.
            ITextAnalyticsClient client = new TextAnalyticsClient(new ApiKeyServiceClientCredentials())
            {
                Endpoint = "https://westus.api.cognitive.microsoft.com"
            }; //Replace 'westus' with the correct region for your Text Analytics subscription

            Console.OutputEncoding = System.Text.Encoding.UTF8;

            // Extracting language
            Console.WriteLine("===== LANGUAGE EXTRACTION ======");

            var result = client.DetectLanguageAsync(new BatchInput(
                    new List<Input>()
                        {
                          new Input("1", "This is a document written in English."),
                          new Input("2", "Este es un document escrito en Español."),
                          new Input("3", "这是一个用中文写的文件")
                    })).Result;

            // Printing language results.
            foreach (var document in result.Documents)
            {
                Console.WriteLine($"Document ID: {document.Id} , Language: {document.DetectedLanguages[0].Name}");
            }

            // Getting key-phrases
            Console.WriteLine("\n\n===== KEY-PHRASE EXTRACTION ======");

            KeyPhraseBatchResult result2 = client.KeyPhrasesAsync(new MultiLanguageBatchInput(
                        new List<MultiLanguageInput>()
                        {
                          new MultiLanguageInput("ja", "1", "猫は幸せ"),
                          new MultiLanguageInput("de", "2", "Fahrt nach Stuttgart und dann zum Hotel zu Fu."),
                          new MultiLanguageInput("en", "3", "My cat is stiff as a rock."),
                          new MultiLanguageInput("es", "4", "A mi me encanta el fútbol!")
                        })).Result;

            // Printing keyphrases
            foreach (var document in result2.Documents)
            {
                Console.WriteLine($"Document ID: {document.Id} ");

                Console.WriteLine("\t Key phrases:");

                foreach (string keyphrase in document.KeyPhrases)
                {
                    Console.WriteLine($"\t\t{keyphrase}");
                }
            }

            // Extracting sentiment
            Console.WriteLine("\n\n===== SENTIMENT ANALYSIS ======");

            SentimentBatchResult result3 = client.SentimentAsync(
                    new MultiLanguageBatchInput(
                        new List<MultiLanguageInput>()
                        {
                          new MultiLanguageInput("en", "0", "I had the best day of my life."),
                          new MultiLanguageInput("en", "1", "This was a waste of my time. The speaker put me to sleep."),
                          new MultiLanguageInput("es", "2", "No tengo dinero ni nada que dar..."),
                          new MultiLanguageInput("it", "3", "L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."),
                        })).Result;


            // Printing sentiment results
            foreach (var document in result3.Documents)
            {
                Console.WriteLine($"Document ID: {document.Id} , Sentiment Score: {document.Score:0.00}");
            }


            // Identify entities
            Console.WriteLine("\n\n===== ENTITIES ======");

            EntitiesBatchResultV2dot1 result4 = client.EntitiesAsync(
                    new MultiLanguageBatchInput(
                        new List<MultiLanguageInput>()
                        {
                          new MultiLanguageInput("en", "0", "The Great Depression began in 1929. By 1933, the GDP in America fell by 25%.")
                        })).Result;

            // Printing entities results
            foreach (var document in result4.Documents)
            {
                Console.WriteLine($"Document ID: {document.Id} ");

                Console.WriteLine("\t Entities:");

                foreach (EntityRecordV2dot1 entity in document.Entities)
                {
                    Console.WriteLine($"\t\t{entity.Name}\t\t{entity.WikipediaUrl}\t\t{entity.Type}\t\t{entity.SubType}");
                }
            }

            Console.ReadLine();
        }
    }
}
```

## Application output

The application displays the following information:

```console
===== LANGUAGE EXTRACTION ======
Document ID: 1 , Language: English
Document ID: 2 , Language: Spanish
Document ID: 3 , Language: Chinese_Simplified


===== KEY-PHRASE EXTRACTION ======
Document ID: 1
         Key phrases:
                幸せ
Document ID: 2
         Key phrases:
                Stuttgart
                Hotel
Document ID: 3
         Key phrases:
                cat
                rock
Document ID: 4
         Key phrases:
                fútbol

===== SENTIMENT ANALYSIS ======
Document ID: 0 , Sentiment Score: 0.87
Document ID: 1 , Sentiment Score: 0.11
Document ID: 2 , Sentiment Score: 0.44
Document ID: 3 , Sentiment Score: 1.00
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)

