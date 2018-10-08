---
title: "Quickstart: Project URL Preview, C#"
titlesuffix: Azure Cognitive Services
description: Get started using Project URL Preview with C#.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: project-url-preview
ms.topic: quickstart
ms.date: 03/16/2018
ms.author: rosh
---

# Quickstart: URL Preview query in C#

The following C# example creates a Url Preview for the SwiftKey Web site: https://swiftkey.com/en.

## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to run this code on Windows. (The free Community Edition will work.)

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

## Code scenario

The following C# code creates a URL Preview of the SwiftKey Web site: https://swiftkey.com/en. 

It is implemented in the following steps:
1. Declare variables to specify the endpoint and a query URL to preview.  
2. Create the request.
3. Add the *Ocp-Apim-Subscription-Key* header. 
4. Run the Web request asynchronously. 
5. Read the response.
6. Print the headers and JSON results to the console.

**Source code**

```
using System;
using System.IO;
using System.Net;
using System.Text;

namespace UrlPrevCshp
{
    class Program
    {
        static void Main(string[] args)
        {
            String uriBase = "https://api.labs.cognitive.microsoft.com/urlpreview/v7.0/search";
            String searchQuery = "https://swiftkey.com/en"; 
            var uriQuery = uriBase + "?q=" + Uri.EscapeDataString(searchQuery);

            // Do the Web request and get response
            WebRequest request = HttpWebRequest.Create(uriQuery);
            request.Headers["Ocp-Apim-Subscription-Key"] = "YOUR-SUBSCRIPTION-KEY";
            HttpWebResponse response = (HttpWebResponse)request.GetResponseAsync().Result;
            string json = new StreamReader(response.GetResponseStream()).ReadToEnd();

            Console.WriteLine("\nHTTP Headers:\n");
            foreach (String header in response.Headers)
            {
                if (header.StartsWith("BingAPIs-") || header.StartsWith("X-MSEdge-"))
                    Console.WriteLine(header + ": " + response.Headers[header]);
            }

            Console.WriteLine(JsonPrettyPrint(json));
            

            Console.ReadKey();
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
            char last = ' ';
            int offset = 0;
            int indentLength = 2;

            foreach (char ch in json)
            {
                switch (ch)
                {
                    case '"':
                        if (!ignore) quote = !quote;
                        break;
                    case '\\':
                        if (quote && last != '\\') ignore = true;
                        break;
                }

                if (quote)
                {
                    sb.Append(ch);
                    if (last == '\\' && ignore) ignore = false;
                }
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
                            if (quote || ch != ' ') sb.Append(ch);
                            break;
                    }
                }
                last = ch;
            }

            return sb.ToString().Trim();
        }

    }
}

```
## Running the application

To run the application:

1. Create a new Console solution in Visual Studio.
2. Replace `Program.cs` with the provided code.
3. Replace the `YOUR-ACCESS-KEY` value with a valid access key for your subscription.
4. Run the program.

## Next steps
- [Java quickstart](java-quickstart.md)
- [JavaScript quickstart](javascript.md)
- [Node quickstart](node-quickstart.md)
- [Python quickstart](python-quickstart.md)