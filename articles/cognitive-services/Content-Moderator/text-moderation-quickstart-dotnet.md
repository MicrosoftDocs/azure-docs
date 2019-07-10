---
title: "Quickstart: Analyze text content in C# - Content Moderator"
titlesuffix: Azure Cognitive Services
description: How to analyze text content for various objectionable materials using the Content Moderator SDK for .NET
services: cognitive-services
author: sanjeev3
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/03/2019
ms.author: sajagtap

#As a C# developer of content management software, I want to analyze text content for offensive or inappropriate material so that I can categorize and handle it accordingly.
---

# Quickstart: Analyze text content for objectionable material in C#

This article provides information and code samples to help you get started using the [Content Moderator SDK for .NET](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/). You'll learn how to execute term-based filtering and classification of text content with the aim of moderating potentially objectionable material.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites
- A Content Moderator subscription key. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Content Moderator and get your key.
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/)

> [!NOTE]
> This guide uses a free-tier Content Moderator subscription. For information on what is provided with each subscription tier, see the [Pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/content-moderator/) page.

## Create the Visual Studio project

1. In Visual Studio, create a new **Console app (.NET Framework)** project and name it **TextModeration**. 
1. If there are other projects in your solution, select this one as the single startup project.
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**; then find and install the following packages:
    - `Microsoft.Azure.CognitiveServices.ContentModerator`
    - `Microsoft.Rest.ClientRuntime`
    - `Newtonsoft.Json`

## Add text moderation code

Next, you'll copy and paste the code from this guide into your project to implement a basic content moderation scenario.

### Include namespaces

Add the following `using` statements to the top of your *Program.cs* file.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/text-moderation-quickstart-dotnet.cs?range=1-8)]

### Create the Content Moderator client

Add the following code to your *Program.cs* file to create a Content Moderator client provider for your subscription. Add the code alongside the **Program** class, in the same namespace. You'll need to update the **AzureRegion** and **CMSubscriptionKey** fields with the values of your region identifier and subscription key.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/text-moderation-quickstart-dotnet.cs?range=54-77)]

### Set up input and output targets

Add the following static fields to the **Program** class in _Program.cs_. These fields specify the files for input text content and output JSON content.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/text-moderation-quickstart-dotnet.cs?range=15-19)]

You will need to create the *TextFile.txt* input file and update its path (paths are relative to the execution directory). Open _TextFile.txt_ and add the text to moderate. This quickstart uses the following sample text:

```
Is this a grabage or crap email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 
0800 820 3300. Also, 999-99-9999 looks like a social security number (SSN).
```

### Load the input text

Add the following code to the **Main** method. The **ScreenText** method is the essential operation. Its parameters specify which content moderation operations will be done. In this example, the method is configured to:
- Detect potential profanity in the text.
- Normalize the text and autocorrect typos.
- Detect personal data such as US and UK phone numbers, email addresses, and US mailing addresses.
- Use machine-learning-based models to classify the text into three categories.

If you want to learn more about what these operations do, follow the link in the [Next steps](#next-steps) section.

[!code-csharp[](~/cognitive-services-content-moderator-samples/documentation-samples/csharp/text-moderation-quickstart-dotnet.cs?range=23-48)]

## Run the program

The program will write JSON string data to the _TextModerationOutput.txt_ file. The sample text used in this quickstart gives the following output:

```json
Autocorrect typos, check for matching terms, PII, and classify.
{
"OriginalText": "\"Is this a grabage or crap email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052. These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300. Also, 999-99-9999 looks like a social security number (SSN).\"",
"NormalizedText": "\" Is this a garbage or crap email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, Redmond, WA 98052. These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300. Also, 999-99-9999 looks like a social security number ( SSN) . \"",
"AutoCorrectedText": "\" Is this a garbage or crap email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, Redmond, WA 98052. These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 0800 820 3300. Also, 999-99-9999 looks like a social security number ( SSN) . \"",
"Misrepresentation": null,
  	
"Classification": {
    	"Category1": {
      	"Score": 1.5113095059859916E-06
    	},
    	"Category2": {
      	"Score": 0.12747249007225037
    	},
    	"Category3": {
      	"Score": 0.98799997568130493
    	},
    	"ReviewRecommended": true
  },
  "Status": {
    "Code": 3000,
    "Description": "OK",
    "Exception": null
  },
  "PII": {
    	"Email": [
      		{
        	"Detected": "abcdef@abcd.com",
        	"SubType": "Regular",
        	"Text": "abcdef@abcd.com",
        	"Index": 33
      		}
    		],
    	"IPA": [
      		{
        	"SubType": "IPV4",
        	"Text": "255.255.255.255",
        	"Index": 73
      		}
    		],
    	"Phone": [
      		{
        	"CountryCode": "US",
        	"Text": "6657789887",
        	"Index": 57
      		},
      		{
        	"CountryCode": "US",
        	"Text": "870 608 4000",
        	"Index": 211
      		},
      		{
        	"CountryCode": "UK",
        	"Text": "+44 870 608 4000",
        	"Index": 207
      		},
      		{
        	"CountryCode": "UK",
        	"Text": "0344 800 2400",
        	"Index": 227
      		},
      		{
        "CountryCode": "UK",
        	"Text": "0800 820 3300",
        	"Index": 244
      		}
    		],
    	 "Address": [{
     		 "Text": "1 Microsoft Way, Redmond, WA 98052",
      		 "Index": 89
    	        }]
  	},
  "Language": "eng",
  "Terms": [
    {
      	"Index": 22,
      	"OriginalIndex": 22,
      	"ListId": 0,
      	"Term": "crap"
    }
  ],
  "TrackingId": "9392c53c-d11a-441d-a874-eb2b93d978d3"
}
```

## Next steps

In this quickstart, you've developed a simple .NET application that uses the Content Moderator service to return relevant information about a given text sample. Next, learn more about what the different flags and classifications mean so you can decide which data you need and how your app should handle it.

> [!div class="nextstepaction"]
> [Text moderation guide](text-moderation-api.md)
