---
title: C# Quickstart for Azure Cognitive Services, Text Analytics API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Text Analytics API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: luiscabrer

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/24/2017
ms.author: luisca

---
# Quickstart for Text Analytics API with C# 
<a name="HOLTop"></a>

This article shows you how to [detect language](#Detect), [analyze sentiment](#SentimentAnalysis), and [extract key phrases](#KeyPhraseExtraction) using the [Text Analytics APIs](//go.microsoft.com/fwlink/?LinkID=759711) with C#. The code was written to work on a .Net Core application, with minimal references to external libraries, so you could also run it on Linux or MacOS.

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Text Analytics API**. You can use the **free tier for 5,000 transactions/month** to complete this quickstart.

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign up. 

<a name="Detect"></a>

## Detect language

The Language Detection API detects the language of a text document, using the [Detect Language method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7). The following example is written in C# using the Text Analytics API client library.

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the code provided below.
1. Replace the `subscriptionKey` value with an access key valid for your subscription.
1. Replace the location in `uriBase` (currently `westus`) to the region you signed up for.
1. Run the program.

```c#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;

namespace TextAnalyticsCSharpCore
{
    struct Document
    {
        public string id;
        public string text;
    }

    class Program
    {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        const string subscriptionKey = "enter key here";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace 
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        const string uriBase = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages";


        static void Main()
        {
            Console.WriteLine("Getting the language for a record");

            List<Document> documents = new List<Document>();
            documents.Add(new Document() { id = "1", text = "This is a document written in English." });
            documents.Add(new Document() { id = "2", text = "Este es un document escrito en Español." });
            documents.Add(new Document() { id = "3", text = "这是一个用中文写的文件" });

            GetLanguage(documents);

            Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
            Console.ReadLine();
        }

        /// <summary>
        /// Queries the language for a set of document and outputs the information to the console.
        /// </summary>
        static async void GetLanguage(List<Document> documents)
        {
            var client = new HttpClient();

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            HttpResponseMessage response;

            // Compose request.
            string body = "";
            foreach (Document doc in documents)
            {
                if (!string.IsNullOrEmpty(body))
                {
                    body = body + ",";
                }

                body = body + "{ \"id\":\"" + doc.id + "\",  \"text\": \"" + doc.text +"\"   }";
            }

            body = "{  \"documents\": [" + body + "] }";

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes(body);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uriBase, content);
            }

            // Get the JSON response
            string result = await response.Content.ReadAsStringAsync();

            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("\nResponse:\n");
            Console.WriteLine(JsonPrettyPrint(result));
        }


        /// <summary>
        /// Formats the given JSON string by adding line breaks and indents.
        /// </summary>
        /// <param name="json">The raw JSON string to format.</param>
        /// <returns>The formatted JSON string.</returns>
        static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
                else
                {
                    switch (ch)
                    {
                        case '{':
                        case '[':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', ++offset * indentLength));
                            break;
                        case '}':
                        case ']':
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', --offset * indentLength));
                            sb.Append(ch);
                            break;
                        case ',':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', offset * indentLength));
                            break;
                        case ':':
                            sb.Append(ch);
                            sb.Append(' ');
                            break;
                        default:
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
        }


    }
}

```

**Language detection response**

A successful response is returned in JSON, as shown in the following example: 

```json

{
   "documents": [
      {
         "id": "1",
         "detectedLanguages": [
            {
               "name": "English",
               "iso6391Name": "en",
               "score": 1.0
            }
         ]
      },
      {
         "id": "2",
         "detectedLanguages": [
            {
               "name": "Spanish",
               "iso6391Name": "es",
               "score": 1.0
            }
         ]
      },
      {
         "id": "3",
         "detectedLanguages": [
            {
               "name": "Chinese_Simplified",
               "iso6391Name": "zh_chs",
               "score": 1.0
            }
         ]
      }
   ],
   "errors": [

   ]
}


```
<a name="SentimentAnalysis"></a>

## Analyze sentiment

The Sentiment Analysis API detexts the sentiment of a set of text records, using the [Sentiment method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9). The following example is written in C# using the Text Analytics API client library. It scores two documents, one in English and another in Spanish.

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the code provided below.
1. Replace the `subscriptionKey` value with an access key valid for your subscription.
1. Replace the location in `uriBase` (currently `westus`) to the region you signed up for.
1. Run the program.

```c#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;

namespace TextAnalyticsCSharpCore
{
    struct Document
    {
        public string language;
        public string id;
        public string text;
    }

    class Program
    {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        const string subscriptionKey = "enterKeyHere";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace 
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        const string uriBase = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

        static void Main()
        {
            Console.WriteLine("Getting the sentiment for documents..");

            List<Document> documents = new List<Document>();
            documents.Add(new Document() { language="en", id = "1", text = "I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable." });
            documents.Add(new Document() { language="es", id = "2", text = "Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico." });

            GetSentiment(documents);

            Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
            Console.ReadLine();
        }

        /// <summary>
        /// Queries the language for a set of document and outputs the information to the console.
        /// </summary>
        static async void GetSentiment(List<Document> documents)
        {
            var client = new HttpClient();

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            HttpResponseMessage response;

            // Compose request.
            string body = "";
            foreach (Document doc in documents)
            {
                if (!string.IsNullOrEmpty(body))
                {
                    body = body + ",";
                }

                body = body + "{ \"language\": \""+ doc.language + "\", \"id\":\"" + doc.id + "\",  \"text\": \"" + doc.text + "\"   }";
            }

            body = "{  \"documents\": [" + body + "] }";

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes(body);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uriBase, content);
            }

            // Get the JSON response
            string result = await response.Content.ReadAsStringAsync();

            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("\nResponse:\n");
            Console.WriteLine(JsonPrettyPrint(result));
        }


        /// <summary>
		/// Formats the given JSON string by adding line breaks and indents.
		/// </summary>
		/// <param name="json">The raw JSON string to format.</param>
		/// <returns>The formatted JSON string.</returns>
		static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
                else
                {
                    switch (ch)
                    {
                        case '{':
                        case '[':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', ++offset * indentLength));
                            break;
                        case '}':
                        case ']':
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', --offset * indentLength));
                            sb.Append(ch);
                            break;
                        case ',':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', offset * indentLength));
                            break;
                        case ':':
                            sb.Append(ch);
                            sb.Append(' ');
                            break;
                        default:
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
        }
    }
}

```

**Sentiment analysis response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "documents": [
      {
         "score": 0.99984133243560791,
         "id": "1"
      },
      {
         "score": 0.024017512798309326,
         "id": "2"
      },
   ],
   "errors": [   ]
}
```

<a name="KeyPhraseExtraction"></a>

## Extract key phrases

The Key Phrase Extraction API extracts key-phrases from a text document, using the [Key Phrases method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6). The following example is written in C# using the Text Analytics API client library. Key phrases are extracted for both English and Spanish documents.

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the code provided below.
1. Replace the `subscriptionKey` value with an access key valid for your subscription.
1. Replace the location in `uriBase` (currently `westus`) to the region you signed up for.
1. Run the program.


```c#
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;

namespace TextAnalyticsCSharpCore
{
    struct Document
    {
        public string language;
        public string id;
        public string text;
    }

    class Program
    {
        // **********************************************
        // *** Update or verify the following values. ***
        // **********************************************

        // Replace the subscriptionKey string value with your valid subscription key.
        const string subscriptionKey = "enterKeyHere";

        // Replace or verify the region.
        //
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace 
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        const string uriBase = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases";


        static void Main()
        {
            Console.WriteLine("Getting the key phrases for a set of documents..");

            List<Document> documents = new List<Document>();
            documents.Add(new Document() { language = "en", id = "1", text = "I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable." });
            documents.Add(new Document() { language = "es", id = "2", text = "Si usted quiere comunicarse con Carlos, usted debe de llamarlo a su telefono movil. Carlos es muy responsable, pero necesita recibir una notificacion si hay algun problema." });
            documents.Add(new Document() { language = "en", id = "3", text = "The Grand Hotel is a new hotel in the center of Seattle. It earned 5 stars in my review, and has the classiest decor I've ever seen." });

            GetKeyPhrases(documents);

            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
            Console.ReadLine();
        }

        /// <summary>
        /// Queries the language for a set of document and outputs the information to the console.
        /// </summary>
        static async void GetKeyPhrases(List<Document> documents)
        {
            var client = new HttpClient();

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

            HttpResponseMessage response;

            // Compose request.
            string body = "";
            foreach (Document doc in documents)
            {
                if (!string.IsNullOrEmpty(body))
                {
                    body = body + ",";
                }

                body = body + "{ \"language\": \"" + doc.language + "\", \"id\":\"" + doc.id + "\",  \"text\": \"" + doc.text + "\"   }";
            }

            body = "{  \"documents\": [" + body + "] }";

            // Request body
            byte[] byteData = Encoding.UTF8.GetBytes(body);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uriBase, content);
            }

            // Get the JSON response
            string result = await response.Content.ReadAsStringAsync();

            Console.WriteLine("\nResponse:\n");
            Console.WriteLine(JsonPrettyPrint(result));
        }


        /// <summary>
		/// Formats the given JSON string by adding line breaks and indents.
		/// </summary>
		/// <param name="json">The raw JSON string to format.</param>
		/// <returns>The formatted JSON string.</returns>
		static string JsonPrettyPrint(string json)
        {
            if (string.IsNullOrEmpty(json))
                return string.Empty;

            json = json.Replace(Environment.NewLine, "").Replace("\t", "");

            StringBuilder sb = new StringBuilder();
            bool quote = false;
            bool ignore = false;
            int offset = 0;
            int indentLength = 3;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\'':
                        if (quote) ignore = !ignore;
                        break;
                }

                if (quote)
                    sb.Append(ch);
                else
                {
                    switch (ch)
                    {
                        case '{':
                        case '[':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', ++offset * indentLength));
                            break;
                        case '}':
                        case ']':
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', --offset * indentLength));
                            sb.Append(ch);
                            break;
                        case ',':
                            sb.Append(ch);
                            sb.Append(Environment.NewLine);
                            sb.Append(new string(' ', offset * indentLength));
                            break;
                        case ':':
                            sb.Append(ch);
                            sb.Append(' ');
                            break;
                        default:
                            if (ch != ' ') sb.Append(ch);
                            break;
                    }
                }
            }

            return sb.ToString().Trim();
        }


    }
}

```


**Key phrase extraction response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "documents": [
      {
         "keyPhrases": [
            "HDR resolution",
            "new XBox",
            "clean look"
         ],
         "id": "1"
      },
      {
         "keyPhrases": [
            "Carlos",
            "notificacion",
            "algun problema",
            "telefono movil"
         ],
         "id": "2"
      },
      {
         "keyPhrases": [
            "new hotel",
            "Grand Hotel",
            "review",
            "center of Seattle",
            "classiest decor",
            "stars"
         ],
         "id": "3"
      }
   ],
   "errors": [  ]
}
```


## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
