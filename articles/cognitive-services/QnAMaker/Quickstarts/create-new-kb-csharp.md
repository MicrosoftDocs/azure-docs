---
title: Create a new knowledge base - quickstart C# - for Microsoft QnA Maker API (V4) - Azure Cognitive Services | Microsoft Docs
description: Create a knowledge base in C# to hold your FAQs or product manuals, so you can get started with QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/15/2018
ms.author: nolachar
---

# Create a new knowledge base in C#

## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to run this code on Windows. (The free Community Edition will work.)

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft QnA Maker API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Create knowledge base

The following code creates a new knowledge base, using the [Create](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

// NOTE: Install the Newtonsoft.Json NuGet package.
using Newtonsoft.Json;

namespace QnAMaker
{
    class Program
    {
        static string host = "https://westus.api.cognitive.microsoft.com";
        static string service = "/qnamaker/v4.0";
        static string method = "/knowledgebases/create";

        // NOTE: Replace this with a valid subscription key.
        static string key = "ENTER KEY HERE";

        static string kb = @"
{
  'name': 'QnA Maker FAQ',
  'qnaList': [
    {
      'id': 0,
      'answer': 'You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa',
      'source': 'Custom Editorial',
      'questions': [
        'How do I programmatically update my Knowledge Base?'
      ],
      'metadata': [
        {
          'name': 'category',
          'value': 'api'
        }
      ]
    }
  ],
  'urls': [
    'https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs',
    'https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq'
  ],
  'files': []
}
";

        public struct Response
        {
            public HttpResponseHeaders headers;
            public string response;

            public Response(HttpResponseHeaders headers, string response)
            {
                this.headers = headers;
                this.response = response;
            }
        }

        static string PrettyPrint(string s)
        {
            return JsonConvert.SerializeObject(JsonConvert.DeserializeObject(s), Formatting.Indented);
        }

        async static Task<Response> Post(string uri, string body)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(body, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                return new Response(response.Headers, responseBody);
            }
        }

        async static Task<Response> Get(string uri)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Get;
                request.RequestUri = new Uri(uri);
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);

                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                return new Response(response.Headers, responseBody);
            }
        }

        async static Task<Response> PostCreateKB(string kb)
        {
            string uri = host + service + method;
            Console.WriteLine("Calling " + uri + ".");
            return await Post(uri, kb);
        }

        async static Task<Response> GetStatus(string operation)
        {
            string uri = host + service + operation;
            Console.WriteLine("Calling " + uri + ".");
            return await Get(uri);
        }

        async static void CreateKB()
        {      
            var response = await PostCreateKB(kb);
            var operation = response.headers.GetValues("Location").First();
            Console.WriteLine(PrettyPrint(response.response));

            var done = false;
            while (true != done)
            {
                response = await GetStatus(operation);
                Console.WriteLine(PrettyPrint(response.response));

                var fields = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.response);

                String state = fields["operationState"];
                if (state.CompareTo("Running") == 0 || state.CompareTo("NotStarted") == 0)
                {
                    var wait = response.headers.GetValues("Retry-After").First();
                    Console.WriteLine("Waiting " + wait + " seconds...");
                    Thread.Sleep(Int32.Parse(wait) * 1000);
                }
                else
                {
                    Console.WriteLine("Press any key to continue.");
                    done = true;
                }
            }
        }

        static void Main(string[] args)
        {
            CreateKB();
            Console.ReadLine();
        }
    }
}

```

## The create knowledge base response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Running",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:46Z",
  "resourceLocation": "/knowledgebases/b0288f33-27b9-4258-a304-8b9f63427dad",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
