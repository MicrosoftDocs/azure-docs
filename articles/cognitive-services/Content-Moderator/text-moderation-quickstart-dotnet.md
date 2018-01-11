---
title: Azure Content Moderator - Moderate text using .NET | Microsoft Docs
description: How to moderate text using Azure Content Moderator SDK for .NET
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 01/04/2018
ms.author: sajagtap
---

# Moderate text using .NET

This article provides information and code samples to help you get started using 
the Content Moderator SDK for .NET to:
- Detect potential profanity in text
- Detect personally identifiable information (PII) such as US and UK phone numbers, email addresses, and US mailing addresses.
- Normalize text and autocorrect typos

This article assumes that you are already familiar with Visual Studio and C#.

## Sign up for Content Moderator services

Before you can use Content Moderator services through the REST API or the SDK, you need a subscription key.
Refer to the [Quickstart](quick-start.md) to learn how you can obtain the key.

## Create your Visual Studio project

1. Add a new **Console app (.NET Framework)** project to your solution.

   In the sample code, name the project **TextModeration**.

1. Select this project as the single startup project for the solution.

1. Add a reference to the **ModeratorHelper** project assembly that you created 
   in the [Content Moderator client helper quickstart](content-moderator-helper-quickstart-dotnet.md).

### Install required packages

Install the following NuGet packages:

- Microsoft.Azure.CognitiveServices.ContentModerator
- Microsoft.Rest.ClientRuntime
- Newtonsoft.Json


### Update the program's using statements

Modify the program's using statements.

	using Microsoft.CognitiveServices.ContentModerator;
	using Microsoft.CognitiveServices.ContentModerator.Models;
	using ModeratorHelper;
	using Newtonsoft.Json;
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Threading;


### Initialize application-specific settings

Add the following static fields to the **Program** class in Program.cs.

    /// <summary>
    /// The name of the file that contains the text to evaluate.
    /// </summary>
    /// <remarks>You will need to create an input file and update this path
    /// accordingly. Relative paths are ralative the execution directory.</remarks>
    private static string TextFile = "TextFile.txt";

    /// <summary>
    /// The name of the file to contain the output from the evaluation.
    /// </summary>
    /// <remarks>Relative paths are ralative the execution directory.</remarks>
    private static string OutputFile = "TextModerationOutput.txt";

We used the following text to generate the output for this quickstart:

	Is this a grabage email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
	Crap is the profanity here. Is this information PII? phone 3144444444

## Add code to load and evaluate the input text

Add the following code to the **Main** method.

	// Load the input text.
	string text = File.ReadAllText(TextFile);
	text = text.Replace(System.Environment.NewLine, " ");

	// Save the moderation results to a file.
	using (StreamWriter outputWriter = new StreamWriter(OutputFile, false))
	{
    	// Create a Content Moderator client and evaluate the text.
    	using (var client = Clients.NewClient())
    	{
        	// Screen the input text: check for profanity, 
            // do autocorrect text, and check for personally identifying 
            // information (PII)
        	outputWriter.WriteLine("Normalize text and autocorrect typos.");
        		var screenResult =
            client.TextModeration.ScreenText("eng", "text/plain", text, true, false);
        		outputWriter.WriteLine(
            JsonConvert.SerializeObject(screenResult, Formatting.Indented));
    	}
    	outputWriter.Flush();
    	outputWriter.Close();
	}

> [!NOTE]
> Your Content Moderator service key has a requests per second (RPS)
> rate limit, and if you exceed the limit, the SDK throws an exception with a 429 error code.
>
> A free tier key has a one RPS rate limit.

## Run the program and review the output

The sample output for the program, as written to the log file, is:

	Normalize text and autocorrect typos.
	{
		"OriginalText": "\"Is this a grabage email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052. Crap is the profanity here. Is this information PII? phone 3144444444\"",
		"NormalizedText": "\" Is this a garbage email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, Redmond, WA 98052. Crap is the profanity here. Is this information PII? phone 3144444444\"",
		"AutoCorrectedText": "\" Is this a garbage email abide@ abed. com, phone: 6657789887, IP: 255. 255. 255. 255, 1 Microsoft Way, Redmond, WA 98052. Crap is the profanity here. Is this information PII? phone 3144444444\"",
		"Misrepresentation": null,
		"Classification": null,
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
        			"Index": 25
      			}
    		],
    	"IPA": [
      		{
        		"SubType": "IPV4",
        		"Text": "255.255.255.255",
        		"Index": 65
      		}
    		],
    	"Phone": [
      		{
        		"CountryCode": "US",
        		"Text": "6657789887",
        		"Index": 49
      		},
      		{
        		"CountryCode": "US",
        		"Text": "3144444444",
        		"Index": 177
      		}
    		],
    		"Address": [
      		{
        		"Text": "1 Microsoft Way, Redmond, WA 98052",
        		"Index": 82
      		}
    		]
		},
	"Language": "eng",
	"Terms": [
    {
      "Index": 118,
      "OriginalIndex": 118,
      "ListId": 0,
      "Term": "crap"
    }
	],
	"TrackingId": "dd91ede4-de1c-4a8f-9f1e-56381696a527"
	}


## Next steps

[Download the Visual Studio solution](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/ContentModerator) for this and other Content Moderator quickstarts for .NET, and get started on your integration.
