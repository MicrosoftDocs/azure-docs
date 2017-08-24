---
title: 'C# Quickstart for Text Analytics API | Microsoft Docs'
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

This article provides information and code samples to help you quickly get started using the [Text Analytics API](//go.microsoft.com/fwlink/?LinkID=759711) with C# to accomplish the following tasks: 

* [Detect Language](#Detect) 
* [Perform Sentiment Analysis](#SentimentAnalysis)
* [Extract Key Phrases](#KeyPhraseExtraction)

The code was written to work on a .Net Core application, with minimal references to external libraries. You should be able to run it on Windows, Linux, or MacOS.

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites
Obtain a Text Analytics Subscription Key:

1. Navigate to **Cognitive Services** in the [Azure portal](//go.microsoft.com/fwlink/?LinkId=761108) and ensure **Text Analytics** is selected as the 'API type'.
1. Select a plan. You may select the **free tier for 5,000 transactions/month**. As is a free tier, there are no charges for using the service. You need to login to your Azure subscription to sign up for the service. 
1. Complete the other fields and create your account.
1. After you sign up for Text Analytics, find your **API Key**. Copy the primary key, as this will be the subscription key that will you will need to provide to the service.

<a name="Detect"></a>

## Detect Language in Text using C# 

Use the [Detect Language method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to detect the language of a text document.

### Detect language C# example request

The sample is written in C# using the Text Analytics API client library. 

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the following code.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
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

#### Language detection response

A successful response is returned in JSON. Following is an example of a successful response: 

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

## Sentiment analysis using C# 

Use the [Sentiment method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) to detect the sentiment of a set of text records.

### Sentiment analysis C# example request

The sample is written in C# using the Text Analytics API client library. 

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the following code.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
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

#### Sentiment analysis response

A successful response is returned in JSON. Following is an example of a successful response: 

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
      {
         "score": 0.088017612798301751,
         "id": "3"
      }
         

   ],
   "errors": [   ]
}
```

<a name="KeyPhraseExtraction"></a>

## Key phrase extraction using C# 

Use the [Key Phrases method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) to extract key-phrases from a text document.


### Key phrase extraction C# example request

The sample is written in C# using the Text Analytics API client library. 

1. Create a new Console solution in Visual Studio.
1. Replace Program.cs with the following code.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uriBase` value to use the location where you obtained your subscription keys.
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
        const string subscriptionKey = "c8e31cbfed0c4271926edceda8212378";

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


### Key phrase extraction response

A successful response is returned in JSON. Following is an example of a successful response: 

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

+ [Visit API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

+ [Visit this page](text-analytics-resource-external-community.md) for a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also 

 [Text Analytics overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)