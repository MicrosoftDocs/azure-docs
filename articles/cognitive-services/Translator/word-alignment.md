---
title: Word alignment information with the Microsoft Translator Text API | Microsoft Docs
description: Receive word alignment information from the Microsoft Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 12/14/2017
ms.author: v-jansko
---

# How to receive word alignment information

## Receiving word alignment information
To receive alignment information, use the TranslateArray2() method. TranslateArray2() works just like the regular TranslateArray() method, except it has an additional element in the response structure, called "Alignment".

## Alignment information format
"Alignment" is returned as a string value of the following format for every word of the source. The information for each word is separated by a space, including for non-space-separated languages (scripts) like Chinese: 

[[SourceTextStartIndex]:[SourceTextEndIndex]–[TgtTextStartIndex]:[TgtTextEndIndex]] *

Example alignment string: "0:0-7:10 1:2-11:20 3:4-0:3 3:4-4:6 5:5-21:21".

In other words, the colon separates start and end index, the dash separates the languages, and space separates the words. One word may align with zero, one, or multiple words in the other language, and the aligned words may be non-contiguous. When no alignment information is available, the Alignment element will be empty. The method returns no error in that case. 

## Restrictions
Alignment is only returned for a subset of the language pairs at this point:
* from English to any other language;
* from any other language to English except for Chinese Simplified, Chinese Traditional, and Latvian to English
* from Japanese to Korean or from Korean to Japanese

You will not receive alignment information in the following cases:
* if the translation comes from CTF (added under your account with AddTranslation()).
* if the sentence is a canned translation. Example of a canned translation is "This is a test", "I love you" and other high frequency sentences.
* by any method other than TranslateArray2(). Specifically, the Translate() method does not expose alignment. TranslateArray2() is a true superset of Translate().



```csharp

 

using System;
using System.Text;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Web;
using System.ServiceModel.Channels;
using System.ServiceModel;
using System.Threading;


namespace MicrosoftTranslatorSdk.SoapSamples
{
    class Program
    {
        static void Main(string[] args)
        {
            AdmAccessToken admToken;
            string headerValue;
            //Get Client Id and Client Secret from https://datamarket.azure.com/developer/applications/
            //Refer obtaining AccessToken (http://msdn.microsoft.com/library/hh454950.aspx) 
            AdmAuthentication admAuth = new AdmAuthentication("clientId", "client secret");
            try
            {
                admToken = admAuth.GetAccessToken();
                DateTime tokenReceived = DateTime.Now;
                // Create a header with the access_token property of the returned token
                headerValue = "Bearer " + admToken.access_token;
               TranslateArray2Method(headerValue);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine("Press any key to continue...");
                Console.ReadKey(true);
            }
        }
     
        private static void TranslateArray2Method(string authToken)
        {
            // Add TranslatorService as a service reference, Address:http://api.microsofttranslator.com/V2/Soap.svc
            TranslatorService.LanguageServiceClient client = new TranslatorService.LanguageServiceClient();
            //Set Authorization header before sending the request
            HttpRequestMessageProperty httpRequestProperty = new HttpRequestMessageProperty();
            httpRequestProperty.Method = "POST";
            httpRequestProperty.Headers.Add("Authorization", authToken);

            // Creates a block within which an OperationContext object is in scope.
            using (OperationContextScope scope = new OperationContextScope(client.InnerChannel))
            {
                OperationContext.Current.OutgoingMessageProperties[HttpRequestMessageProperty.Name] = httpRequestProperty;
                string[] translateArraySourceTexts = { "The answer lies in machine translation.", "the best machine translation technology cannot always provide translations tailored to a site or users like a human ", "Simply copy and paste a code snippet anywhere " };
                MicrosoftTranslatorSdk.SoapSamples.TranslatorService.TranslateOptions translateArrayOptions = new MicrosoftTranslatorSdk.SoapSamples.TranslatorService.TranslateOptions(); // Use the default options
                //Keep appId parameter blank as we are sending access token in authorization header.
                MicrosoftTranslatorSdk.SoapSamples.TranslatorService.TranslateArray2Response[] translatedTexts = client.TranslateArray2("", translateArraySourceTexts, "en", "fr", translateArrayOptions);

                Console.WriteLine("The translated texts with alignment info from en to fr are: ");
                for (int i = 0; i < translatedTexts.Length; i++)
                {
                    Console.WriteLine("Source text:{0}{1}Translated Text:{2}{1}Alignment info:{3}{1}", translateArraySourceTexts[i], Environment.NewLine, translatedTexts[i].TranslatedText, translatedTexts[i].Alignment);
                }

                Console.WriteLine("Press any key to continue...");
                Console.ReadKey(true);
            }
        }
    }
}
```
