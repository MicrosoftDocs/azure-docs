---
title: What is Bing Spell Check API?
titlesuffix: Azure Cognitive Services
description: The Bing Spell Check API uses machine learning and statistical machine translation for contextual spell checking.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-spell-check
ms.topic: overview
ms.date: 05/03/2018
ms.author: nolachar
---
# What is Bing Spell Check API?

The Bing Spell Check API lets you perform contextual grammar and spell checking.

What’s the difference between regular spell-checkers and Bing’s third-generation spell-checker? Current spell-checkers rely on verifying spelling and grammar against dictionary-based rule sets, which get updated and expanded periodically. In other words, the spell-checker is only as strong as the dictionary that supports it, and the editorial staff who supports the dictionary. You know this type of spell-checker from Microsoft Word and other word processors.

In contrast, Bing has developed a web-based spell-checker that leverages machine learning and statistical machine translation to dynamically train a constantly evolving and highly contextual algorithm. The spell-checker is based on a massive corpus of web searches and documents.

This spell-checker can handle any word-processing scenario:

- Recognizes slang and informal language
- Recognizes common name errors in context
- Corrects word breaking issues with a single flag
- Is able to correct homophones in context, and other difficult to spot errors
- Supports new brands, digital entertainment, and popular expressions as they emerge
- Words that sound the same but differ in meaning and spelling, for example “see” and “sea.”

## Spell check modes

The API supports two proofing modes, `Proof` and `Spell`.  Try examples [here](https://azure.microsoft.com/services/cognitive-services/spell-check/).
### Proof - for documents scenario
The default mode is `Proof`. The `Proof` spelling mode provides the most comprehensive checks,  adding capitalization, basic punctuation, and other features to aid document creation. but it is available only in the en-US (English-United States), es-ES(Spanish), pt-BR(Portuguese) markets (Note: only in beta version for Spanish and Portuguese). For all other markets, set the mode query parameter to Spell. 
<br /><br/>**NOTE:**   If the length of query text exceeds 4096, it will be truncated to 4096 characters, then get processed. 
### Spell -  for web searches/queries scenario
`Spell` is more aggressive in order to return better search results. The `Spell` mode finds most spelling mistakes but doesn't find some of the grammar errors that `Proof` catches, for example, capitalization and repeated words.
<br /></br>**NOTE:** The max query length supported is as below. If query exceed the bound, the result appears that the query is not altered.
<ul><li>130 characters for language code of en, de, es, fr, pl, pt, sv, ru, nl, nb, tr-tr, it, zh, ko. </li>
<li>65 characters for others</li></ul>

## Market setting
Market needs to be specified in the query parameter in request URL, otherwise speller will take the default market based on IP address.


## POST vs. GET

The API supports either HTTP POST or HTTP GET. Which you use depends on the length of text you plan to proof. If the strings are always less than 1,500 characters, you'd use a GET. But if you want to support strings up to 10,000 characters, you'd use POST. The text string may include any valid UTF-8 character.

The following example shows a POST request to check the spelling and grammar of a text string. The example includes the [mode](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference#mode) query parameter for completeness (it could have been left out since `mode` defaults to Proof). The [text](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference#text) query parameter contains the string to be proofed.
  
```  
POST https://api.cognitive.microsoft.com/bing/v7.0/spellcheck?mode=proof&mkt=en-us HTTP/1.1  
Content-Type: application/x-www-form-urlencoded  
Content-Length: 47  
Ocp-Apim-Subscription-Key: 123456789ABCDE  
X-MSEdge-ClientIP: 999.999.999.999  
X-Search-Location: lat:47.60357;long:-122.3295;re:100  
X-MSEdge-ClientID: <blobFromPriorResponseGoesHere>  
Host: api.cognitive.microsoft.com  
 
text=when+its+your+turn+turn,+john,+come+runing  
``` 

If you use HTTP GET, you'd include the `text` query parameter in the URL's query string
  
The following shows the response to the previous request. The response contains a [SpellCheck](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference#spellcheck) object. 
  
```  
{  
    "_type" : "SpellCheck",  
    "flaggedTokens" : [{  
        "offset" : 5,  
        "token" : "its",  
        "type" : "UnknownToken",  
        "suggestions" : [{  
            "suggestion" : "it's",  
            "score" : 1  
        }]  
    },  
    {  
        "offset" : 25,  
        "token" : "john",  
        "type" : "UnknownToken",  
        "suggestions" : [{  
            "suggestion" : "John",  
            "score" : 1  
        }]  
    },  
    {  
        "offset" : 19,  
        "token" : "turn",  
        "type" : "RepeatedToken",  
        "suggestions" : [{  
            "suggestion" : "",  
            "score" : 1  
        }]  
    },  
    {  
        "offset" : 35,  
        "token" : "runing",  
        "type" : "UnknownToken",  
        "suggestions" : [{  
            "suggestion" : "running",  
            "score" : 1  
        }]  
    }]  
}  
```  
  
The [flaggedTokens](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference#flaggedtokens) field lists the spelling and grammar errors that the API found in the [text](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference#text) string. The `token` field contains the word to be replaced. You'd use the zero-based offset in the `offset` field to find the token in the `text` string. You'd then replace the word at that location with the word in the `suggestion` field. 

If the `type` field is RepeatedToken, you'd still replace the token with `suggestion` but you'd also likely need to remove the trailing space.

## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../includes/cognitive-services-bing-throttling-requests.md)]

## Next steps

To get started quickly with your first request, see [Making Your First Request](quickstarts/csharp.md).

Familiarize yourself with the [Bing Spell Check API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference). The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results, and the definitions of the response objects. 

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the results.
