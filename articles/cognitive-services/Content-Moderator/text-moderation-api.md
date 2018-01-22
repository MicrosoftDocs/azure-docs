---
title: Text Moderation with Azure Content Moderator | Microsoft Docs
description: Use text moderation for potential profanity, PII, and matching against custom lists of terms.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 01/20/2018
ms.author: sajagtap
---

# Text moderation

Use Content Moderator’s machine-assisted text moderation and [human review tool](Review-Tool-User-Guide/human-in-the-loop.md) to moderate text content. The API scans the incoming text (maximum 1024 characters) for profanity, autocorrects text, and detects potential Personally Identifiable Information (PII). It also matches against custom lists of terms. The autocorrection feature helps catch deliberately misspelled words. After content is processed, the service returns a detailed response. You use the response to either create a human review in the review tool or take it down, etc.

The service response includes the following information:

- Profanity: detected profanity terms and their location
- Personally Identifiable Information (PII)
- Auto-corrected text
- Original text
- Language

## Profanity

If any profane terms are detected, those terms are included in the response, along with their starting index (location) within the original text.

	"Terms": [
	{
		"Index": 118,
		"OriginalIndex": 118,
		"ListId": 0,
		"Term": "crap"
	}


## Personally Identifiable Information (PII)

The PII feature detects the potential presence of this information:

- Email address
- US Mailing address
- IP address
- US Phone number
- UK Phone number
- Social Security Number (SSN)

The following example shows a sample response:

	"PII": {
    	"Email": [{
      		"Detected": "abcdef@abcd.com",
      		"SubType": "Regular",
      		"Text": "abcdef@abcd.com",
      		"Index": 32
    		}],
    	"IPA": [{
      		"SubType": "IPV4",
      		"Text": "255.255.255.255",
      		"Index": 72
    		}],
    	"Phone": [{
      		"CountryCode": "US",
      		"Text": "6657789887",
      		"Index": 56
    		}, {
      		"CountryCode": "US",
      		"Text": "870 608 4000",
      		"Index": 212
    		}, {
      		"CountryCode": "UK",
      		"Text": "+44 870 608 4000",
      		"Index": 208
    		}, {
      		"CountryCode": "UK",
      		"Text": "0344 800 2400",
      		"Index": 228
    		}, {
      		"CountryCode": "UK",
      		"Text": "0800 820 3300",
      		"Index": 245
    		}],
    	"Address": [{
      		"Text": "1 Microsoft Way, Redmond, WA 98052",
      		"Index": 89
    		}],
    	"SSN": [{
      		"Text": "665778988",
      		"Index": 56
    		}, {
      		"Text": "544-56-7788",
      		"Index": 267
    		}]
		}

## Auto-correction

Suppose the input text is (the ‘lzay’ and 'f0x' are intentional):

	The qu!ck brown f0x jumps over the lzay dog.

If you ask for auto-correction, the response contains the corrected version of the text:

	The quick brown fox jumps over the lazy dog.

## Creating and managing your custom lists of terms

While the default, global list of terms works great for most cases, you may want to screen against terms that are specific to your business needs. For example, you may want to filter out any competitive brand names from posts by users. Your threshold of permitted text content may be different from the default list.

The following example shows the matching List ID:

	"Terms": [
	{
		"Index": 118,
		"OriginalIndex": 118,
		"ListId": 231.
		"Term": "crap"
	}

The Content Moderator provides a [Term List API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67f) with operations for managing custom term lists. Start with the [Term Lists API Console](try-terms-list-api.md) and use the REST API code samples. Also check out the [Term Lists .NET quickStart](term-lists-quickstart-dotnet.md) if you are familiar with Visual Studio and C#.

## Next steps

Test drive the [Text moderation API console](try-text-api.md) and use the REST API code samples. Also check out the [Text moderation .NET quickStart](text-moderation-quickstart-dotnet.md) if you are familiar with Visual Studio and C#.
