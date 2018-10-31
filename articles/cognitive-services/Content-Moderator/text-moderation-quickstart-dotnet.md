---
title: "Quickstart: Check text content in C# - Content Moderator"
titlesuffix: Azure Cognitive Services
description: How to check text content using the Content Moderator SDK for C#
services: cognitive-services
author: sanjeev3
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: sajagtap
#As a C# developer of content-providing software, I want to analyze text content for offensive or inappropriate material so that I can categorize and handle it accordingly.
---

# Quickstart: Check text content in C# 

This article provides information and code samples to help you get started using the [Content Moderator SDK for .NET](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/) to:

- Detect potential profanity in text with term-based filtering
- Use machine-learning-based models to [classify the text](text-moderation-api.md#classification) into three categories.
- Detect personally identifiable information (PII) such as US and UK phone numbers, email addresses, and US mailing addresses.
- Normalize text and autocorrect typos

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign up for Content Moderator services

Before you can use Content Moderator services through the REST API or the SDK, you'll need a subscription key. Subscribe to the Content Moderator service in the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator) to obtain one.

## Create your Visual Studio project

1. Add a new **Console app (.NET Framework)** project to your solution.

   In the sample code, name the project **TextModeration**.

1. Select this project as the single startup project for the solution.

### Install required packages

Install the following NuGet packages:

- Microsoft.Azure.CognitiveServices.ContentModerator
- Microsoft.Rest.ClientRuntime
- Newtonsoft.Json

### Update the program's using statements

Add the following `using` statements. 

```csharp
using Microsoft.Azure.CognitiveServices.ContentModerator;
using Microsoft.CognitiveServices.ContentModerator;
using Microsoft.CognitiveServices.ContentModerator.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
```

### Create the Content Moderator client

Add the following code to create a Content Moderator client for your subscription.

> [!IMPORTANT]
> Update the **AzureRegion** and **CMSubscriptionKey** fields with 
> the values of your region identifier and subscription key.

```csharp
/// <summary>
/// Wraps the creation and configuration of a Content Moderator client.
/// </summary>
/// <remarks>This class library contains insecure code. If you adapt this 
/// code for use in production, use a secure method of storing and using
/// your Content Moderator subscription key.</remarks>
public static class Clients
{
	/// <summary>
	/// The region/location for your Content Moderator account, 
	/// for example, westus.
	/// </summary>
	private static readonly string AzureRegion = "YOUR API REGION";

	/// <summary>
	/// The base URL fragment for Content Moderator calls.
	/// </summary>
	private static readonly string AzureBaseURL =
		$"https://{AzureRegion}.api.cognitive.microsoft.com";

	/// <summary>
	/// Your Content Moderator subscription key.
	/// </summary>
	private static readonly string CMSubscriptionKey = "YOUR API KEY";

	/// <summary>
	/// Returns a new Content Moderator client for your subscription.
	/// </summary>
	/// <returns>The new client.</returns>
	/// <remarks>The <see cref="ContentModeratorClient"/> is disposable.
	/// When you have finished using the client,
	/// you should dispose of it either directly or indirectly. </remarks>
	public static ContentModeratorClient NewClient()
	{
		// Create and initialize an instance of the Content Moderator API wrapper.
		ContentModeratorClient client = new ContentModeratorClient(new ApiKeyServiceClientCredentials(CMSubscriptionKey));

		client.Endpoint = AzureBaseURL;
		return client;
	}
}
```

### Initialize application-specific settings

Add the following static fields to the **Program** class in Program.cs.

```csharp
/// <summary>
/// The name of the file that contains the text to evaluate.
/// </summary>
/// <remarks>You will need to create an input file and update this path
/// accordingly. Relative paths are relative to the execution directory.</remarks>
private static string TextFile = "TextFile.txt";

/// <summary>
/// The name of the file to contain the output from the evaluation.
/// </summary>
/// <remarks>Relative paths are relative to the execution directory.</remarks>
private static string OutputFile = "TextModerationOutput.txt";
```

We used the following text as input for this quickstart.

> [!NOTE]
> The invalid social security number in the following sample text is intentional. The purpose is to convey the sample input and output format.

```
Is this a grabage or crap email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
These are all UK phone numbers, the last two being Microsoft UK support numbers: +44 870 608 4000 or 0344 800 2400 or 
0800 820 3300. Also, 999-99-9999 looks like a social security number (SSN).
```

## Add code to load and evaluate the input text

Add the following code to the **Main** method.

```csharp
// Load the input text.
string text = File.ReadAllText(TextFile);
Console.WriteLine("Screening {0}", TextFile);

text = text.Replace(System.Environment.NewLine, " ");

// Save the moderation results to a file.
using (StreamWriter outputWriter = new StreamWriter(OutputFile, false))
{
    // Create a Content Moderator client and evaluate the text.
    using (var client = Clients.NewClient())
    {
        // Screen the input text: check for profanity, classify the text into three categories,
		// do autocorrect text, and check for personally identifying
		// information (PII)
		outputWriter.WriteLine("Autocorrect typos, check for matching terms, PII, and classify.");
		var screenResult =
		client.TextModeration.ScreenText("eng", "text/plain", text, true, true, null, true);
		outputWriter.WriteLine(
				JsonConvert.SerializeObject(screenResult, Formatting.Indented));
    }
    outputWriter.Flush();
    outputWriter.Close();
}
```

> [!NOTE]
> Your Content Moderator service key has a requests per second (RPS)
> rate limit, and if you exceed the limit, the SDK throws an exception with a 429 error code. When using a free tier key, the rate of requests is limited to one request per second.

## Run the program and review the output

The sample output for the program, as written to the log file, is:

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

Get the [Content Moderator .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/) and the [Visual Studio solution](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/ContentModerator) for this and other Content Moderator quickstarts for .NET, and get started on your integration.
