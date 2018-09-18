---
title: Translator Text API Translate Method
titleSuffix: Azure Cognitive Services
description: Use the Translator Text API Translate method.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: reference
ms.date: 03/29/2018
ms.author: v-jansko
---

# Translator Text API 3.0: Translate

Translates text.

## Request URL

Send a `POST` request to:

```HTTP
https://api.cognitive.microsofttranslator.com/translate?api-version=3.0
```

## Request parameters

Request parameters passed on the query string are:

<table width="100%">
  <th width="20%">Query parameter</th>
  <th>Description</th>
  <tr>
    <td>api-version</td>
    <td>*Required parameter*.<br/>Version of the API requested by the client. Value must be `3.0`.</td>
  </tr>
  <tr>
    <td>from</td>
    <td>*Optional parameter*.<br/>Specifies the language of the input text. Find which languages are available to translate from by looking up [supported languages](.\v3-0-languages.md) using the `translation` scope. If the `from` parameter is not specified, automatic language detection is applied to determine the source language.</td>
  </tr>
  <tr>
    <td>to</td>
    <td>*Required parameter*.<br/>Specifies the language of the output text. The target language must be one of the [supported languages](.\v3-0-languages.md) included in the `translation` scope. For example, use `to=de` to translate to German.<br/>It's possible to translate to multiple languages simultaneously by repeating the parameter in the query string. For example, use `to=de&to=it` to translate to German and Italian.</td>
  </tr>
  <tr>
    <td>textType</td>
    <td>*Optional parameter*.<br/>Defines whether the text being translated is plain text or HTML text. Any HTML needs to be a well-formed, complete element. Possible values are: `plain` (default) or `html`.</td>
  </tr>
  <tr>
    <td>category</td>
    <td>*Optional parameter*.<br/>A string specifying the category (domain) of the translation. This parameter is used to get translations from a customized system built with [Custom Translator](../customization.md). Default value is: `general`.</td>
  </tr>
  <tr>
    <td>profanityAction</td>
    <td>*Optional parameter*.<br/>Specifies how profanities should be treated in translations. Possible values are: `NoAction` (default), `Marked` or `Deleted`. To understand ways to treat profanity, see [Profanity handling](#handle-profanity).</td>
  </tr>
  <tr>
    <td>profanityMarker</td>
    <td>*Optional parameter*.<br/>Specifies how profanities should be marked in translations. Possible values are: `Asterisk` (default) or `Tag`. To understand ways to treat profanity, see [Profanity handling](#handle-profanity).</td>
  </tr>
  <tr>
    <td>includeAlignment</td>
    <td>*Optional parameter*.<br/>Specifies whether to include alignment projection from source text to translated text. Possible values are: `true` or `false` (default). </td>
  </tr>
  <tr>
    <td>includeSentenceLength</td>
    <td>*Optional parameter*.<br/>Specifies whether to include sentence boundaries for the input text and the translated text. Possible values are: `true` or `false` (default).</td>
  </tr>
  <tr>
    <td>suggestedFrom</td>
    <td>*Optional parameter*.<br/>Specifies a fallback language if the language of the input text can't be identified. Language auto-detection is applied when the `from` parameter is omitted. If detection fails, the `suggestedFrom` language will be assumed.</td>
  </tr>
  <tr>
    <td>fromScript</td>
    <td>*Optional parameter*.<br/>Specifies the script of the input text.</td>
  </tr>
  <tr>
    <td>toScript</td>
    <td>*Optional parameter*.<br/>Specifies the script of the translated text.</td>
  </tr>
</table> 

Request headers include:

<table width="100%">
  <th width="20%">Headers</th>
  <th>Description</th>
  <tr>
    <td>_One authorization_<br/>_header_</td>
    <td>*Required request header*.<br/>See [available options for authentication](./v3-0-reference.md#authentication).</td>
  </tr>
  <tr>
    <td>Content-Type</td>
    <td>*Required request header*.<br/>Specifies the content type of the payload. Possible values are: `application/json`.</td>
  </tr>
  <tr>
    <td>Content-Length</td>
    <td>*Required request header*.<br/>The length of the request body.</td>
  </tr>
  <tr>
    <td>X-ClientTraceId</td>
    <td>*Optional*.<br/>A client-generated GUID to uniquely identify the request. You can omit this header if you include the trace ID in the query string using a query parameter named `ClientTraceId`.</td>
  </tr>
</table> 

## Request body

The body of the request is a JSON array. Each array element is a JSON object with a string property named `Text`, which represents the string to translate.

```json
[
    {"Text":"I would really like to drive your car around the block a few times."}
]
```

The following limitations apply:

* The array can have at most 25 elements.
* The entire text included in the request cannot exceed 5,000 characters including spaces.

## Response body

A successful response is a JSON array with one result for each string in the input array. A result object includes the following properties:

  * `detectedLanguage`: An object describing the detected language through the following properties:

      * `language`: A string representing the code of the detected language.

      * `score`: A float value indicating the confidence in the result. The score is between zero and one and a low score indicates a low confidence.

    The `detectedLanguage` property is only present in the result object when language auto-detection is requested.

  * `translations`: An array of translation results. The size of the array matches the number of target languages specified through the `to` query parameter. Each element in the array includes:

    * `to`: A string representing the language code of the target language.

    * `text`: A string giving the translated text.

    * `transliteration`: An object giving the translated text in the script specified by the `toScript` parameter.

      * `script`: A string specifying the target script.   

      * `text`: A string giving the translated text in the target script.

    The `transliteration` object is not included if transliteration does not take place.

    * `alignment`: An object with a single string property named `proj`, which maps input text to translated text. The alignment information is only provided when the request parameter `includeAlignment` is `true`. Alignment is returned as a string value of the following format: `[[SourceTextStartIndex]:[SourceTextEndIndex]–[TgtTextStartIndex]:[TgtTextEndIndex]]`.  The colon separates start and end index, the dash separates the languages, and space separates the words. One word may align with zero, one, or multiple words in the other language, and the aligned words may be non-contiguous. When no alignment information is available, the alignment element will be empty. See [Obtain alignment information](#obtain-alignment-information) for an example and restrictions.

    * `sentLen`: An object returning sentence boundaries in the input and output texts.

      * `srcSentLen`: An integer array representing the lengths of the sentences in the input text. The length of the array is the number of sentences, and the values are the length of each sentence.

      * `transSentLen`:  An integer array representing the lengths of the sentences in the translated text. The length of the array is the number of sentences, and the values are the length of each sentence.

    Sentence boundaries are only included when the request parameter `includeSentenceLength` is `true`.

  * `sourceText`: An object with a single string property named `text`, which gives the input text in the default script of the source language. `sourceText` property is present only when the input is expressed in a script that's not the usual script for the language. For example, if the input were Arabic written in Latin script, then `sourceText.text` would be the same Arabic text converted into Arab script.

Example of JSON responses are provided in the [examples](#examples) section.

## Response status codes

The following are the possible HTTP status codes that a request returns. 

<table width="100%">
  <th width="20%">Status Code</th>
  <th>Description</th>
  <tr>
    <td>200</td>
    <td>Success.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>One of the query parameters is missing or not valid. Correct request parameters before retrying.</td>
  </tr>
  <tr>
    <td>401</td>
    <td>The request could not be authenticated. Check that credentials are specified and valid.</td>
  </tr>
  <tr>
    <td>403</td>
    <td>The request is not authorized. Check the details error message. This often indicates that all free translations provided with a trial subscription have been used up.</td>
  </tr>
  <tr>
    <td>429</td>
    <td>The caller is sending too many requests.</td>
  </tr>
  <tr>
    <td>500</td>
    <td>An unexpected error occurred. If the error persists, report it with: date and time of the failure, request identifier from response header `X-RequestId`, and client identifier from request header `X-ClientTraceId`.</td>
  </tr>
  <tr>
    <td>503</td>
    <td>Server temporarily unavailable. Retry the request. If the error persists, report it with: date and time of the failure, request identifier from response header `X-RequestId`, and client identifier from request header `X-ClientTraceId`.</td>
  </tr>
</table> 

## Examples

### Translate a single input

This example shows how to translate a single sentence from English to Simplified Chinese.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

---

The response body is:

```
[
    {
        "translations":[
            {"text":"你好, 你叫什么名字？","to":"zh-Hans"}
        ]
    }
]
```

The `translations` array includes one element, which provides the translation of the single piece of text in the input.

### Translate a single input with language auto-detection

This example shows how to translate a single sentence from English to Simplified Chinese. The request does not specify the input language. Auto-detection of the source language is used instead.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

---

The response body is:

```
[
    {
        "detectedLanguage": {"language": "en", "score": 1.0},
        "translations":[
            {"text": "你好, 你叫什么名字？", "to": "zh-Hans"}
        ]
    }
]
```
The response is similar to the response from the previous example. Since language auto-detection was requested, the response also includes information about the language detected for the input text. 

### Translate with transliteration

Let's extend the previous example by adding transliteration. The following request asks for a Chinese translation written in Latin script.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=zh-Latn" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

---

The response body is:

```
[
    {
        "detectedLanguage":{"language":"en","score":1.0},
        "translations":[
            {
                "text":"你好, 你叫什么名字？",
                "transliteration":{"text":"nǐ hǎo , nǐ jiào shén me míng zì ？","script":"Latn"},
                "to":"zh-Hans"
            }
        ]
    }
]
```

The translation result now includes a `transliteration` property, which gives the translated text using Latin characters.

### Translate multiple pieces of text

Translating multiple strings at once is simply a matter of specifying an array of strings in the request body.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}, {'Text':'I am fine, thank you.'}]"
```

---

The response body is:

```
[
    {
        "translations":[
            {"text":"你好, 你叫什么名字？","to":"zh-Hans"}
        ]
    },            
    {
        "translations":[
            {"text":"我很好，谢谢你。","to":"zh-Hans"}
        ]
    }
]
```

### Translate to multiple languages

This example shows how to translate the same input to several languages in one request.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans&to=de" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

---

The response body is:

```
[
    {
        "translations":[
            {"text":"你好, 你叫什么名字？","to":"zh-Hans"},
            {"text":"Hallo, was ist dein Name?","to":"de"}
        ]
    }
]
```

### Handle profanity

Normally the Translator service will retain profanity that is present in the source in the translation. The degree of profanity and the context that makes words profane differ between cultures, and as a result the degree of profanity in the target language may be amplified or reduced.

If you want to avoid getting profanity in the translation, regardless of the presence of profanity in the source text, you can use the profanity filtering option. The option allows you to choose whether you want to see profanity deleted, whether you want to mark profanities with appropriate tags (giving you the option to add your own post-processing), or you want no action taken. The accepted values of `ProfanityAction` are `Deleted`, `Marked` and `NoAction` (default).

<table width="100%">
  <th width="20%">ProfanityAction</th>
  <th>Action</th>
  <tr>
    <td>`NoAction`</td>
    <td>This is the default behavior. Profanity will pass from source to target.<br/><br/>
    **Example Source (Japanese)**: 彼はジャッカスです。<br/>
    **Example Translation (English)**: He is a jackass.
    </td>
  </tr>
  <tr>
    <td>`Deleted`</td>
    <td>Profane words will be removed from the output without replacement.<br/><br/>
    **Example Source (Japanese)**: 彼はジャッカスです。<br/>
    **Example Translation (English)**: He is a.
    </td>
  </tr>
  <tr>
    <td>`Marked`</td>
    <td>Profane words are replaced by a marker in the output. The marker depends on the `ProfanityMarker` parameter.<br/><br/>
    For `ProfanityMarker=Asterisk`, profane words are replaced with `***`:<br/>
    **Example Source (Japanese)**: 彼はジャッカスです。<br/>
    **Example Translation (English)**: He is a \*\*\*.<br/><br/>
    For `ProfanityMarker=Tag`, profane words are surrounded by XML tags &lt;profanity&gt; and &lt;/profanity&gt;:<br/>
    **Example Source (Japanese)**: 彼はジャッカスです。<br/>
    **Example Translation (English)**: He is a &lt;profanity&gt;jackass&lt;/profanity&gt;.
  </tr>
</table> 

For example:

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de&profanityAction=Marked" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'This is a fucking good idea.'}]"
```

---

This returns:

```
[
    {
        "translations":[
            {"text":"Das ist eine *** gute Idee.","to":"de"}
        ]
    }
]
```

Compare with:

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de&profanityAction=Marked&profanityMarker=Tag" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'This is a fucking good idea.'}]"
```

---

That last request returns:

```
[
    {
        "translations":[
            {"text":"Das ist eine <profanity>verdammt</profanity> gute Idee.","to":"de"}
        ]
    }
]
```

### Translate content with markup and decide what's translated

It's common to translate content which includes markup such as content from an HTML page or content from an XML document. Include query parameter `textType=html` when translating content with tags. In addition, it's sometimes useful to exclude specific content from translation. You can use the attribute `class=notranslate` to specify content that should remain in its original language. In the following example, the content inside the first `div` element will not be translated, while the content in the second `div` element will be translated.

```
<div class="notranslate">This will not be translated.</div>
<div>This will be translated. </div>
```

Here is a sample request to illustrate.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans&textType=html" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'<div class=\"notranslate\">This will not be translated.</div><div>This will be translated.</div>'}]"
```

---

The response is:

```
[
    {
        "translations":[
            {"text":"<div class=\"notranslate\">This will not be translated.</div><div>这将被翻译。</div>","to":"zh-Hans"}
        ]
    }
]
```

### Obtain alignment information

To receive alignment information, specify `includeAlignment=true` on the query string.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=fr&includeAlignment=true" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'The answer lies in machine translation.'}]"
```

---

The response is:

```
[
    {
        "translations":[
            {
                "text":"La réponse se trouve dans la traduction automatique.",
                "to":"fr",
                "alignment":{"proj":"0:2-0:1 4:9-3:9 11:14-11:19 16:17-21:24 19:25-40:50 27:37-29:38 38:38-51:51"}
            }
        ]
    }
]
```

The alignment information starts with `0:2-0:1`, which means that the first three characters in the source text (`The`) map to the first two characters in the translated text (`La`).

Note the following restrictions:

* Alignment is only returned for a subset of the language pairs:
  - from English to any other language;
  - from any other language to English except for Chinese Simplified, Chinese Traditional, and Latvian to English;
  - from Japanese to Korean or from Korean to Japanese.
* You will not receive alignment if the sentence is a canned translation. Example of a canned translation is "This is a test", "I love you" and other high frequency sentences.

### Obtain sentence boundaries

To receive information about sentence length in the source text and translated text, specify `includeSentenceLength=true` on the query string.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=fr&includeSentenceLength=true" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'The answer lies in machine translation. The best machine translation technology cannot always provide translations tailored to a site or users like a human. Simply copy and paste a code snippet anywhere.'}]"
```

---

The response is:

```
[
    {
        "translations":[
            {
                "text":"La réponse se trouve dans la traduction automatique. La meilleure technologie de traduction automatique ne peut pas toujours fournir des traductions adaptées à un site ou des utilisateurs comme un être humain. Il suffit de copier et coller un extrait de code n’importe où.",
                "to":"fr",
                "sentLen":{"srcSentLen":[40,117,46],"transSentLen":[53,157,62]}
            }
        ]
    }
]
```

### Translate with dynamic dictionary

If you already know the translation you want to apply to a word or a phrase, you can supply it as markup within the request. The dynamic dictionary is only safe for compound nouns like proper names and product names.

The markup to supply uses the following syntax.

``` 
<mstrans:dictionary translation=”translation of phrase”>phrase</mstrans:dictionary>
```

For example, consider the English sentence "The word wordomatic is a dictionary entry." To preserve the word _wordomatic_ in the translation, send the request:

```
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'The word <mstrans:dictionary translation=\"wordomatic\">word or phrase</mstrans:dictionary> is a dictionary entry.'}]"
```

The result is:

```
[
    {
        "translations":[
            {"text":"Das Wort "wordomatic" ist ein Wörterbucheintrag.","to":"de"}
        ]
    }
]
```

This feature works the same way with `textType=text` or with `textType=html`. The feature should be used sparingly. The appropriate and far better way of customizing translation is by using Custom Translator. Custom Translator makes full use of context and statistical probabilities. If you have or can afford to create training data that shows your work or phrase in context, you get much better results. [Learn more about Custom Translator](../customization.md).
 





