---
title: C# Quickstart for Azure Cognitive Services, Microsoft Translator Text API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: translator-text
ms.topic: article
ms.date: 09/14/2017
ms.author: v-jaswel

---
# Quickstart for Microsoft Translator Text API with C# 
<a name="HOLTop"></a>

This article shows you how to use the [Microsoft Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview) with C# to do the following.

- [Translate source text from one language to another.](#Translate)
- [Get translations for multiple source texts.](#TranslateArray)
- [Get friendly names for multiple languages.](#GetLanguageNames)
- [Get a list of languages available for translation.](#GetLanguagesForTranslate)
- [Get a list of languages available for speech synthesis.](#GetLanguagesForSpeak)
- [Get a .wav or .mp3 stream of the source text being spoken in the given language.](#Speak)
- [Identify the language of the source text.](#Detect)
- [Identify the languages for multiple source texts.](#DetectArray)
- [Add a translation to the translation memory.](#AddTranslation)
- [Add an array of translations to add translation memory.](#AddTranslationArray)
- [Break the source text into sentences.](#BreakSentences)
- [Get an array of translations for the source text.](#GetTranslations)
- [Get arrays of translations for multiple source texts.](#GetTranslationsArray)

## Prerequisites

You will need [Visual Studio 2017](https://www.visualstudio.com/downloads/) to run this code on Windows. (The free Community Edition will work.)

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/Translate";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void TranslateText()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            List<KeyValuePair<string,string>> list = new List<KeyValuePair<string,string>>() {
                new KeyValuePair<string, string> ("Hello", "fr-fr"),
                new KeyValuePair<string, string> ("Salut", "en-us")
            };

            foreach (KeyValuePair<string, string> i in list)
            {
                string uri = host + path + "?to=" + i.Value + "&text=" + System.Net.WebUtility.UrlEncode(i.Key);

                HttpResponseMessage response = await client.GetAsync(uri);

                string result = await response.Content.ReadAsStringAsync();
                // NOTE: A successful response is returned in XML. You can extract the contents of the XML as follows.
                // var content = XElement.Parse(result).Value;
                Console.WriteLine(result);
            }
        }

        static void Main(string[] args)
        {
            TranslateText();
            Console.ReadLine();
        }
    }
}
```

**Translate response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Salut</string>
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Hello</string>
```

[Back to top](#HOLTop)

<a name="TranslateArray"></a>

## Translate text array

The following code gets translations for multiple soruce texts, using the [TranslateArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_TranslateArray) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/TranslateArray";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void TranslateArray()
        {
            string uri = host + path;

            XNamespace ns = @"http://schemas.microsoft.com/2003/10/Serialization/Arrays";
            XDocument doc = new XDocument(
                new XElement("TranslateArrayRequest",
                    // NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
                    new XElement("AppId"),
                    new XElement("Texts",
                        new XElement(ns + "string", "Hello"),
                        new XElement(ns + "string", "Goodbye")
                    ),
                    new XElement("To", "fr-fr")
                )
            );
            var requestBody = doc.ToString();

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/xml");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);
                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(PrettifyXML(responseBody));
            }
        }

        static string PrettifyXML(string xml)
        {
            var str = new StringBuilder();
            var element = XElement.Parse(xml);
            var settings = new XmlWriterSettings
            {
                OmitXmlDeclaration = true,
                Indent = true,
                NewLineOnAttributes = true
            };
            using (var writer = XmlWriter.Create(str, settings))
            {
                element.Save(writer);
            }
            return str.ToString();
        }

        static void Main(string[] args)
        {
            TranslateArray();
            Console.ReadLine();
        }
    }
}
```

**Translate array response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfTranslateArrayResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <TranslateArrayResponse>
    <From>en</From>
    <OriginalTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>5</a:int>
    </OriginalTextSentenceLengths>
    <TranslatedText>Salut</TranslatedText>
    <TranslatedTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>5</a:int>
    </TranslatedTextSentenceLengths>
  </TranslateArrayResponse>
  <TranslateArrayResponse>
    <From>en</From>
    <OriginalTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>7</a:int>
    </OriginalTextSentenceLengths>
    <TranslatedText>Au revoir</TranslatedText>
    <TranslatedTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>9</a:int>
    </TranslatedTextSentenceLengths>
  </TranslateArrayResponse>
</ArrayOfTranslateArrayResponse>
```

[Back to top](#HOLTop)

<a name="GetLanguageNames"></a>

## Get language names

The following code gets friendly names for multiple languages, using the [GetLanguageNames](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetLanguageNames) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net;
using System.Runtime.Serialization;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string locale = "en";
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/GetLanguageNames?locale=" + locale;

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        static void GetLanguageNames()
        {
            string uri = host + path;

            string[] languageCodes = { "en", "fr", "uk" };

            var request = (HttpWebRequest)WebRequest.Create(uri);
            request.Method = "POST";
            request.ContentType = "text/xml";
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);

            // NOTE: The following code serializes languageCodes as follows.
            /*
            <ArrayOfstring xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                <string>en</string>
                <string>fr</string>
                <string>uk</string>
            </ArrayOfstring>
            */
            DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.String[]"));
            using (Stream stream = request.GetRequestStream())
            {
                dcs.WriteObject(stream, languageCodes);
            }

            using (WebResponse response = request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            {
                using (StreamReader sr = new StreamReader(stream))
                {
                    String line = sr.ReadToEnd();
                    Console.WriteLine(line);
                }

                // NOTE: Use the following code to deserialize the stream contents.
                /*
                string[] languageNames = (string[])dcs.ReadObject(stream);
                foreach (var i in languageNames)
                {
                    Console.WriteLine(i);
                }
                */
            }
        }

        static void Main(string[] args)
        {
            GetLanguageNames();
            Console.ReadLine();
        }
    }
}
```

**Get language names response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>English</string>
  <string>French</string>
  <string>Ukrainian</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="GetLanguagesForTranslate"></a>

## Get supported languages for translation

The following code gets a list of language codes representing languages supported for translation, using the [GetLanguagesForTranslate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_GetLanguagesForTranslate) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/GetLanguagesForTranslate";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void GetLanguagesForTranslate()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string uri = host + path;

            HttpResponseMessage response = await client.GetAsync(uri);

            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);

            // NOTE: Use the following code to deserialize the stream contents.
            /*
            DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.String[]"));
            MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(result));
            string[] languageNames = (string[])dcs.ReadObject(memoryStream);
            foreach (var i in languageNames)
            {
                Console.WriteLine(i);
            }
            */
        }

        static void Main(string[] args)
        {
            GetLanguagesForTranslate();
            Console.ReadLine();
        }
    }
}
```

**Get supported languages for translation response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>af</string>
  <string>ar</string>
  <string>bn</string>
  <string>bs-Latn</string>
  <string>bg</string>
  <string>ca</string>
  <string>zh-CHS</string>
  <string>zh-CHT</string>
  <string>yue</string>
  <string>hr</string>
  <string>cs</string>
  <string>da</string>
  <string>nl</string>
  <string>en</string>
  <string>et</string>
  <string>fj</string>
  <string>fil</string>
  <string>fi</string>
  <string>fr</string>
  <string>de</string>
  <string>el</string>
  <string>ht</string>
  <string>he</string>
  <string>hi</string>
  <string>mww</string>
  <string>hu</string>
  <string>id</string>
  <string>it</string>
  <string>ja</string>
  <string>sw</string>
  <string>tlh</string>
  <string>tlh-Qaak</string>
  <string>ko</string>
  <string>lv</string>
  <string>lt</string>
  <string>mg</string>
  <string>ms</string>
  <string>mt</string>
  <string>yua</string>
  <string>no</string>
  <string>otq</string>
  <string>fa</string>
  <string>pl</string>
  <string>pt</string>
  <string>ro</string>
  <string>ru</string>
  <string>sm</string>
  <string>sr-Cyrl</string>
  <string>sr-Latn</string>
  <string>sk</string>
  <string>sl</string>
  <string>es</string>
  <string>sv</string>
  <string>ty</string>
  <string>ta</string>
  <string>th</string>
  <string>to</string>
  <string>tr</string>
  <string>uk</string>
  <string>ur</string>
  <string>vi</string>
  <string>cy</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="GetLanguagesForSpeak"></a>

## Get supported languages for speech synthesis

The following code gets a list of language codes representing languages supported for speech synthesis, using the [GetLanguagesForSpeak](http://docs.microsofttranslator.com/text-translate.html#!/default/get_GetLanguagesForSpeak) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/GetLanguagesForSpeak";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void GetLanguagesForSpeak()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string uri = host + path;

            HttpResponseMessage response = await client.GetAsync(uri);

            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);

            // NOTE: Use the following code to deserialize the stream contents.
            /*
            DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.String[]"));
            MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(result));
            string[] languageNames = (string[])dcs.ReadObject(memoryStream);
            foreach (var i in languageNames)
            {
                Console.WriteLine(i);
            }
            */
        }

        static void Main(string[] args)
        {
            GetLanguagesForSpeak();
            Console.ReadLine();
        }
    }
}
```

**Get supported languages for speech synthesis response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>ar</string>
  <string>ar-eg</string>
  <string>ca</string>
  <string>ca-es</string>
  <string>da</string>
  <string>da-dk</string>
  <string>de</string>
  <string>de-de</string>
  <string>en</string>
  <string>en-au</string>
  <string>en-ca</string>
  <string>en-gb</string>
  <string>en-in</string>
  <string>en-us</string>
  <string>es</string>
  <string>es-es</string>
  <string>es-mx</string>
  <string>fi</string>
  <string>fi-fi</string>
  <string>fr</string>
  <string>fr-ca</string>
  <string>fr-fr</string>
  <string>hi</string>
  <string>hi-in</string>
  <string>it</string>
  <string>it-it</string>
  <string>ja</string>
  <string>ja-jp</string>
  <string>ko</string>
  <string>ko-kr</string>
  <string>nb-no</string>
  <string>nl</string>
  <string>nl-nl</string>
  <string>no</string>
  <string>pl</string>
  <string>pl-pl</string>
  <string>pt</string>
  <string>pt-br</string>
  <string>pt-pt</string>
  <string>ru</string>
  <string>ru-ru</string>
  <string>sv</string>
  <string>sv-se</string>
  <string>yue</string>
  <string>zh-chs</string>
  <string>zh-cht</string>
  <string>zh-cn</string>
  <string>zh-hk</string>
  <string>zh-tw</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="Speak"></a>

## Get spoken text

The following code gets a stream of the source text being spoken in the given language, using the [Speak](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Speak) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/Speak";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        static void Speak()
        {
            string text = "Hello world";
            string language = "en-US";
            string output_path = "speak.wav";

            string uri = host + path + "?text=" + System.Net.WebUtility.UrlEncode(text) + "&language=" + language;

            WebRequest webRequest = WebRequest.Create(uri);
            webRequest.Headers.Add("Ocp-Apim-Subscription-Key", key);

            using (WebResponse response = webRequest.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (var fileStream = File.Create(output_path))
            {
                stream.CopyTo(fileStream);
                Console.WriteLine("File written.");
            }
        }

        static void Main(string[] args)
        {
            Speak();
            Console.ReadLine();
        }
    }
}
```

**Get spoken text response**

A successful response is returned as a .wav or .mp3 stream.

[Back to top](#HOLTop)

<a name="Detect"></a>

## Detect language

The following code identifies the language of the source text, using the [Detect](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Detect) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Xml.Linq;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/Detect";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void Detect()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string text = "Hello world";

            string uri = host + path + "?text=" + System.Net.WebUtility.UrlEncode(text);

            HttpResponseMessage response = await client.GetAsync(uri);

            string result = await response.Content.ReadAsStringAsync();
            // NOTE: A successful response is returned in XML. You can extract the contents of the XML as follows.
            // var content = XElement.Parse(result).Value;
            Console.WriteLine(result);
        }

        static void Main(string[] args)
        {
            Detect();
            Console.ReadLine();
        }
    }
}
```

**Detect language response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">en</string>
```

[Back to top](#HOLTop)

<a name="DetectArray"></a>

## Detect multiple languages

The following code identifies the languages for multiple source texts, using the [DetectArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_DetectArray) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net;
using System.Runtime.Serialization;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/DetectArray";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        static void DetectArray()
        {
            string uri = host + path;

            string[] texts = { "Hello", "Bonjour", "Guten tag" };

            var request = (HttpWebRequest)WebRequest.Create(uri);
            request.Method = "POST";
            request.ContentType = "text/xml";
            request.Headers.Add("Ocp-Apim-Subscription-Key", key);

            // NOTE: The following code serializes texts as follows.
            /*
            <ArrayOfstring xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                <string>Hello</string>
                <string>Bonjour</string>
                <string>Guten tag</string>
            </ArrayOfstring>
            */
            DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.String[]"));
            using (Stream stream = request.GetRequestStream())
            {
                dcs.WriteObject(stream, texts);
            }

            using (WebResponse response = request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            {
                using (StreamReader sr = new StreamReader(stream))
                {
                    String line = sr.ReadToEnd();
                    Console.WriteLine(line);
                }

                // NOTE: Use the following code to deserialize the stream contents.
                /*
                string[] languageNames = (string[])dcs.ReadObject(stream);
                foreach (var i in languageNames)
                {
                    Console.WriteLine(i);
                }
                */
            }
        }

        static void Main(string[] args)
        {
            DetectArray();
            Console.ReadLine();
        }
    }
}
```

**Detect multiple languages response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>en</string>
  <string>fr</string>
  <string>de</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="AddTranslation"></a>

## Add translation

The following code adds a translation to the translation memory, using the [AddTranslation](http://docs.microsofttranslator.com/text-translate.html#!/default/get_AddTranslation) method. This is useful if you want to tailor the user's experience so they receive a certain translation for a given source text.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net;
using System.Net.Http;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/AddTranslation";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void AddTranslation()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string originalText = "Hi there";
            string translatedText = "Salut";
            string from = "en-US";
            string to = "fr-fr";
            string user = "JohnDoe";

            string uri = host + path +
                "?originalText=" + WebUtility.UrlEncode(originalText) +
                "&translatedText=" + WebUtility.UrlEncode(translatedText) +
                "&from=" + from +
                "&to=" + to +
                "&user=" + WebUtility.UrlEncode(user);

            HttpResponseMessage response = await client.GetAsync(uri);
            Console.WriteLine(response.ToString());
        }

        static void Main(string[] args)
        {
            AddTranslation();
            Console.ReadLine();
        }
    }
}
```

**Add translation response**

A successful response is simply returned as HTTP status code 200 (OK): 

```http
StatusCode: 200, ReasonPhrase: 'OK', Version: 1.1, Content: System.Net.Http.StreamContent, Headers:
{
  X-MS-Trans-Info: 1230.V2_Rest.AddTranslation.46F207D0
  Date: Fri, 27 Oct 2017 07:47:19 GMT
  Content-Length: 0
}
```

[Back to top](#HOLTop)

<a name="AddTranslationArray"></a>

## Add translation array

The following code adds an array of translations to the translation memory, using the [AddTranslationArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_AddTranslationArray) method. This is useful if you want to tailor the user's experience so they receive certain translations for given source texts.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Xml.Linq;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/AddTranslationArray";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void AddTranslationArray()
        {
            string uri = host + path;

            XNamespace ns = @"http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2";
            XDocument doc = new XDocument(
                new XElement("AddtranslationsRequest",
                    // NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
                    new XElement("AppId"),
                    new XElement("From", "en-US"),
                    new XElement("Options",
                        new XElement(ns + "User", "JohnDoe")
                    ),
                    new XElement("To", "fr-fr"),
                    new XElement("Translations",
                        new XElement(ns + "Translation",
                            new XElement(ns + "OriginalText", "Hi there"),
                            new XElement(ns + "Rating", 1),
                            new XElement(ns + "TranslatedText", "Salut")
                        )
                    )
                )
            );
            var requestBody = doc.ToString();

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/xml");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);
                var response = await client.SendAsync(request);
                Console.WriteLine(response.ToString());
            }
        }

        static void Main(string[] args)
        {
            AddTranslationArray();
            Console.ReadLine();
        }
    }
}
```

**Add translation array response**

A successful response is simply returned as HTTP status code 200 (OK): 

```http
StatusCode: 200, ReasonPhrase: 'OK', Version: 1.1, Content: System.Net.Http.StreamContent, Headers:
{
  X-MS-Trans-Info: 0639.V2_Rest.AddTranslationArray.467960AD
  Date: Fri, 27 Oct 2017 02:00:46 GMT
  Content-Length: 0
}
```

[Back to top](#HOLTop)

<a name="BreakSentences"></a>

## Break sentences

The following code breaks the source text into sentences, using the [BreakSentences](http://docs.microsofttranslator.com/text-translate.html#!/default/get_BreakSentences) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Text;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/BreakSentences";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void BreakSentences()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

            string text = "Here is a sentence. Here is another sentence. Here is a third sentence.";
            string language = "en-US";

            string uri = host + path +
                "?text=" + WebUtility.UrlEncode(text) +
                "&language=" + language;

            HttpResponseMessage response = await client.GetAsync(uri);
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);

            // NOTE: Use the following code to deserialize the stream contents.
            /*
            DataContractSerializer dcs = new DataContractSerializer(Type.GetType("System.Int32[]"));
            MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(result));
            int[] languageNames = (int[])dcs.ReadObject(memoryStream);
            foreach (var i in languageNames)
            {
                Console.WriteLine(i);
            }
            */
        }

        static void Main(string[] args)
        {
            BreakSentences();
            Console.ReadLine();
        }
    }
}
```

**Break sentences response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfint xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <int>20</int>
  <int>26</int>
  <int>25</int>
</ArrayOfint>
```

[Back to top](#HOLTop)

<a name="GetTranslations"></a>

## Get translations

The following code gets an array of translation candidates for the source text, using the [GetTranslations](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetTranslations) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/GetTranslations";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void GetTranslations()
        {
            string from = "en-us";
            string to = "fr-fr";
            string text = "Hi there";
            string maxTranslations = "10";
            string uri = host + path + "?from=" + from + "&to=" + to + "&maxTranslations=" + maxTranslations + "&text=" + System.Net.WebUtility.UrlEncode(text);

            // NOTE: Use this if you need to specify options. For more information see:
            // http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetTranslations
            /*
            XNamespace ns = @"http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2";
            XDocument doc = new XDocument(
                new XElement(ns + "TranslateOptions")
            );
            var requestBody = doc.ToString();
            */
            var requestBody = "";

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/xml");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);
                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(PrettifyXML(responseBody));
            }
        }

        static string PrettifyXML(string xml)
        {
            var str = new StringBuilder();
            var element = XElement.Parse(xml);
            var settings = new XmlWriterSettings
            {
                OmitXmlDeclaration = true,
                Indent = true,
                NewLineOnAttributes = true
            };
            using (var writer = XmlWriter.Create(str, settings))
            {
                element.Save(writer);
            }
            return str.ToString();
        }

        static void Main(string[] args)
        {
            GetTranslations();
            Console.ReadLine();
        }
    }
}
```

**Get translations response**

A successful response is returned in XML, as shown in the following example: 

```xml
<GetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <From>en</From>
  <Translations>
    <TranslationMatch>
      <Count>0</Count>
      <MatchDegree>100</MatchDegree>
      <MatchedOriginalText />
      <Rating>5</Rating>
      <TranslatedText>Salut</TranslatedText>
    </TranslationMatch>
    <TranslationMatch>
      <Count>1</Count>
      <MatchDegree>100</MatchDegree>
      <MatchedOriginalText>Hi there</MatchedOriginalText>
      <Rating>1</Rating>
      <TranslatedText>Salut</TranslatedText>
    </TranslationMatch>
  </Translations>
</GetTranslationsResponse>
```

[Back to top](#HOLTop)

<a name="GetTranslationsArray"></a>

## Get translations arrays

The following code gets arrays of translation candidates for multiple source texts, using the [GetTranslationsArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetTranslationsArray) method.

1. Create a new C# project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace TranslateTextQuickStart
{
    class Program
    {
        static string host = "https://api.microsofttranslator.com";
        static string path = "/V2/Http.svc/GetTranslationsArray";

        // NOTE: Replace this example key with a valid subscription key.
        static string key = "ENTER KEY HERE";

        async static void GetTranslationsArray()
        {
            string uri = host + path;

            XNamespace string_ns = @"http://schemas.microsoft.com/2003/10/Serialization/Arrays";
            XDocument doc = new XDocument(
                new XElement("GetTranslationsArrayRequest",
                    // NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
                    new XElement("AppId"),
                    new XElement("From", "en-US"),
                    new XElement("Texts",
                        new XElement(string_ns + "string", "Hello"),
                        new XElement(string_ns + "string", "Goodbye")
                    ),
                    new XElement("To", "fr-fr"),
                    new XElement("MaxTranslations", 10)
                )
            );
            var requestBody = doc.ToString();

            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage())
            {
                request.Method = HttpMethod.Post;
                request.RequestUri = new Uri(uri);
                request.Content = new StringContent(requestBody, Encoding.UTF8, "text/xml");
                request.Headers.Add("Ocp-Apim-Subscription-Key", key);
                var response = await client.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(PrettifyXML(responseBody));
            }
        }

        static string PrettifyXML(string xml)
        {
            var str = new StringBuilder();
            var element = XElement.Parse(xml);
            var settings = new XmlWriterSettings
            {
                OmitXmlDeclaration = true,
                Indent = true,
                NewLineOnAttributes = true
            };
            using (var writer = XmlWriter.Create(str, settings))
            {
                element.Save(writer);
            }
            return str.ToString();
        }

        static void Main(string[] args)
        {
            GetTranslationsArray();
            Console.ReadLine();
        }
    }
}
```

**Get translations arrays response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfGetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <GetTranslationsResponse>
    <From>en</From>
    <Translations>
      <TranslationMatch>
        <Count>0</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText />
        <Rating>5</Rating>
        <TranslatedText>Salut</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>2</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText>Hello</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Bonjour,</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText>Hello</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Bonjour</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello?</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Tu es là ?</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello?</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Vous êtes là ?</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello,</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Salut</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>66</MatchDegree>
        <MatchedOriginalText>&lt;&lt;"Hello!</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>&lt;&lt; "Bonjour !</TranslatedText>
      </TranslationMatch>
    </Translations>
  </GetTranslationsResponse>
  <GetTranslationsResponse>
    <From>en</From>
    <Translations>
      <TranslationMatch>
        <Count>0</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText />
        <Rating>5</Rating>
        <TranslatedText>Au revoir</TranslatedText>
      </TranslationMatch>
    </Translations>
  </GetTranslationsResponse>
</ArrayOfGetTranslationsResponse>
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Translator Text tutorial](../tutorial-wpf-translation-csharp.md)

## See also 

[Translator Text overview](../text-overview.md)
[API Reference](http://docs.microsofttranslator.com/text-translate.html)
