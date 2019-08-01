---
title: "Quickstart: Get list of supported languages, C# - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you get a list of languages supported for translation, transliteration, and dictionary lookup using the Translator Text API.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/04/2019
ms.author: swmachan
---

# Quickstart: Use the Translator Text API to get a list of supported languages using C#

In this quickstart, you get a list of languages supported for translation, transliteration, and dictionary lookup using the Translator Text API.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-C-Sharp).

## Prerequisites

* [.NET SDK](https://www.microsoft.com/net/learn/dotnet/hello-world-tutorial)
* [Json.NET NuGet Package](https://www.nuget.org/packages/Newtonsoft.Json/)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o languages-sample
cd languages-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `languages-sample`. The second command changes to the directory for your project.

Next, you'll need to install Json.Net. From your project's directory, run:

```console
dotnet add package Newtonsoft.Json --version 11.0.2
```

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, including `Program.cs`. This file is where you'll put your application code. Open `Program.cs`, and replace the existing using statements. These statements ensure that you have access to all the types required to build and run the sample app.

```csharp
using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
```

## Create a function to get a list of languages

Within the `Program` class, create a function called `GetLanguages`. This class encapsulates the code used to call the Languages resource and prints the result to console.

```csharp
static void GetLanguages()
{
  /*
   * The code for your call to the translation service will be added to this
   * function in the next few sections.
   */
}
```

## Set the host name, and path

Add these lines to the `GetLanguages` function.

```csharp
string host = "https://api.cognitive.microsofttranslator.com";
string route = "/languages?api-version=3.0";
```

## Instantiate the client and make a request

These lines instantiate the `HttpClient` and the `HttpRequestMessage`:

```csharp
using (var client = new HttpClient())
using (var request = new HttpRequestMessage())
{
  // In the next few sections you'll add code to construct the request.
}
```

## Construct the request and print the response

Inside the `HttpRequestMessage` you'll:

* Declare the HTTP method
* Construct the request URI
* Add required headers
* Make an asynchronous request
* Print the response

Add this code to the `HttpRequestMessage`:

```csharp
// Set the method to GET
request.Method = HttpMethod.Get;
// Construct the full URI
request.RequestUri = new Uri(host + route);
// Send request, get response
var response = client.SendAsync(request).Result;
var jsonResponse = response.Content.ReadAsStringAsync().Result;
// Pretty print the response
Console.WriteLine(PrettyPrint(jsonResponse));
Console.WriteLine("Press any key to continue.");
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

To print the response with "Pretty Print" (formatting for the response), add this function to your Program class:
```
static string PrettyPrint(string s)
{
    return JsonConvert.SerializeObject(JsonConvert.DeserializeObject(s), Formatting.Indented);
}
```

## Put it all together

The last step is to call `GetLanguages()` in the `Main` function. Locate `static void Main(string[] args)` and add these lines:

```csharp
GetLanguages();
Console.ReadLine();
```

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
dotnet run
```

## Sample response

Find the country/region abbreviation in this [list of languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support).

```json
{
    "translation": {
        "af": {
            "name": "Afrikaans",
            "nativeName": "Afrikaans",
            "dir": "ltr"
        },
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "dir": "rtl"
        },
        ...
    },
    "transliteration": {
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "scripts": [
                {
                    "code": "Arab",
                    "name": "Arabic",
                    "nativeName": "العربية",
                    "dir": "rtl",
                    "toScripts": [
                        {
                            "code": "Latn",
                            "name": "Latin",
                            "nativeName": "اللاتينية",
                            "dir": "ltr"
                        }
                    ]
                },
                {
                    "code": "Latn",
                    "name": "Latin",
                    "nativeName": "اللاتينية",
                    "dir": "ltr",
                    "toScripts": [
                        {
                            "code": "Arab",
                            "name": "Arabic",
                            "nativeName": "العربية",
                            "dir": "rtl"
                        }
                    ]
                }
            ]
        },
      ...
    },
    "dictionary": {
        "af": {
            "name": "Afrikaans",
            "nativeName": "Afrikaans",
            "dir": "ltr",
            "translations": [
                {
                    "name": "English",
                    "nativeName": "English",
                    "dir": "ltr",
                    "code": "en"
                }
            ]
        },
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "dir": "rtl",
            "translations": [
                {
                    "name": "English",
                    "nativeName": "English",
                    "dir": "ltr",
                    "code": "en"
                }
            ]
        },
      ...
    }
}
```

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

* [Translate text](quickstart-csharp-translate.md)
* [Transliterate text](quickstart-csharp-transliterate.md)
* [Identify the language by input](quickstart-csharp-detect.md)
* [Get alternate translations](quickstart-csharp-dictionary.md)
* [Determine sentence lengths from an input](quickstart-csharp-sentences.md)
