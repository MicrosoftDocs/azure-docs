---
title: Translator Text API v2.0
titleSuffix: Azure Cognitive Services
description: Reference documentation for the Translator Text API v2.0.
services: cognitive-services
author: swmachan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 05/15/2018
ms.author: swmachan
---

# Translator Text API v2.0

> [!IMPORTANT]
> This version of the Translator Text API has been deprecated. [View documentation for version 3 of the Translator Text API](v3-0-reference.md).

Version 2 of the Translator Text API can be seamlessly integrated into your apps, websites, tools, or other solutions to provide multilanguage user experiences. You can use it on any hardware platform and with any operating system to perform language translation and other language-related tasks, like text-language detection and text to speech, according to industry standards. For more information, see [Translator Text API](../translator-info-overview.md).

## Getting started
To access the Translator Text API, you need to [sign up for Microsoft Azure](../translator-text-how-to-signup.md).

## Authentication 
All calls to the Translator Text API require a subscription key for authentication. The API supports three methods of authentication:

- An access token. Use the subscription key referenced in step 9 to create an access token by making a POST request to the authentication service. See the token service documentation for details. Pass the access token to the Translator service by using the `Authorization` header or the `access_token` query parameter. The access token is valid for 10 minutes. Obtain a new access token every 10 minutes, and keep using the same access token for repeated requests during the 10 minutes.
- A subscription key used directly. Pass your subscription key as a value in the `Ocp-Apim-Subscription-Key` header included with your request to the Translator Text API. When you use the subscription key directly, you don't have to call the token authentication service to create an access token.
- An [Azure Cognitive Services multi-service subscription](https://azure.microsoft.com/pricing/details/cognitive-services/). This method allows you to use a single secret key to authenticate requests for multiple services.
When you use a multi-service secret key, you need to include two authentication headers with your request. The first header passes the secret key. The second header specifies the region associated with your subscription:
   - `Ocp-Apim-Subscription-Key`
   - `Ocp-Apim-Subscription-Region`

The region is required for the multi-service Text API subscription. The region you select is the only region you can use for text translation when you use the multi-service subscription key. It needs to be the same region you selected when you signed up for your multi-service subscription on the Azure portal.

The available regions are `australiaeast`, `brazilsouth`, `canadacentral`, `centralindia`, `centraluseuap`, `eastasia`, `eastus`, `eastus2`, `japaneast`, `northeurope`, `southcentralus`, `southeastasia`, `uksouth`, `westcentralus`, `westeurope`, `westus`, and `westus2`.

Your subscription key and access token are secrets that should be hidden from view.

## Profanity handling
Normally, the Translator service will retain profanity that's present in the source. The degree of profanity and the context that makes words profane differ according to culture. So the degree of profanity in the target language could be increased or reduced.

If you want to prevent profanity in the translation even when it's in the source text, you can use the profanity filtering option for the methods that support it. The option allows you to choose whether you want to see profanity deleted or marked with appropriate tags, or whether you want to allow the profanity in the target. The accepted values of `ProfanityAction` are `NoAction` (default), `Marked`, and `Deleted`.


|ProfanityAction	|Action	|Example source (Japanese)	|Example translation (English)	|
|:--|:--|:--|:--|
|NoAction	|Default. Same as not setting the option. Profanity will pass from source to target.		|彼はジャッカスです。		|He is a jackass.	|
|Marked		|Profane words will be surrounded by XML tags \<profanity> and \</profanity>.		|彼はジャッカスです。	|He is a \<profanity>jackass\</profanity>.	|
|Deleted	|Profane words will be removed from the output without replacement.		|彼はジャッカスです。	|He is a.	|

	
## Excluding content from translation
When you translate content with tags, like HTML (`contentType=text/html`), it's sometimes useful to exclude specific content from the translation. You can use the attribute `class=notranslate` to specify content that should remain in its original language. In the following example, the content in the first `div` element won't be translated, but the content in the second `div` element will be translated.

```HTML
<div class="notranslate">This will not be translated.</div>
<div>This will be translated. </div>
```

## GET /Translate

### Implementation notes
Translates a text string from one language to another.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Translate`.

**Return value:** A string that represents the translated text.

If you previously used `AddTranslation` or `AddTranslationArray` to enter a translation with a rating of 5 or higher for the same source sentence, `Translate` returns only the top choice that's available to your system. "Same source sentence" means exactly the same (100% matching), except for capitalization, white space, tag values, and punctuation at the end of a sentence. If no rating is stored with a rating of 5 or above, the returned result will be the automatic translation by Microsoft Translator.

### Response class (status 200)

string

Response content type: application/xml

### Parameters

|Parameter|Value|Description	|Parameter type|data type|
|:--|:--|:--|:--|:--|
|appid	|(empty)	|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)	|Required. A string that represents the text to translate. The text can't contain more than 10,000 characters.|query|string|
|from|(empty)	|Optional. A string that represents the language code of the text being translated. For example, en for English.|query|string|
|to|(empty)	|Required. A string that represents the code of the language to translate the text into.|query|string|
|contentType|(empty)	|Optional. The format of the text being translated. Supported formats are `text/plain` (default) and  `text/html`. Any HTML elements need to be well-formed, complete elements.|query|string|
|category|(empty)	|Optional. A string that contains the category (domain) of the translation. The default is `general`.|query|string|
|Authorization|(empty)	|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|


### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /TranslateArray

### Implementation notes
Retrieves translations for multiple source texts.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/TranslateArray`.

Here's the format of the request body:

```
<TranslateArrayRequest>
  <AppId />
  <From>language-code</From>
  <Options>
    <Category xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" >string-value</Category>
    <ContentType xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">text/plain</ContentType>
    <ReservedFlags xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" />
    <State xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" >int-value</State>
    <Uri xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" >string-value</Uri>
    <User xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" >string-value</User>
  </Options>
  <Texts>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">string-value</string>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">string-value</string>
  </Texts>
  <To>language-code</To>
</TranslateArrayRequest>
```

These elements are in `TranslateArrayRequest`:


* `AppId`: Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `AppId` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.
* `From`: Optional. A string that represents the language code of the text being translated. If this field is left empty, the response will include the result of automatic language detection.
* `Options`: Optional. An `Options` object that contains the following values. They're all optional and default to the most common settings. Specified elements must be listed in alphabetical order.
	- `Category`: A string that contains the category (domain) of the translation. The default is `general`.
	- `ContentType`: The format of the text being translated. The supported formats are `text/plain` (default), `text/xml`, and `text/html`. Any HTML elements need to be well-formed, complete elements.
	- `ProfanityAction`: Specifies how profanities are handled, as explained earlier. Accepted values are `NoAction` (default), `Marked`, and `Deleted`.
	- `State`: User state to help correlate the request and response. The same content will be returned in the response.
	- `Uri`: Filter results by this URI. Default: `all`.
	- `User`: Filter results by this user. Default: `all`.
* `Texts`: Required. An array that contains the text for translation. All strings must be in the same language. The total of all text to be translated can't exceed 10,000 characters. The maximum number of array elements is 2,000.
* `To`: Required. A string that represents the code of the language to translate the text into.

You can omit optional elements. Elements that are direct children of `TranslateArrayRequest` must be listed in alphabetical order.

The `TranslateArray` method accepts `application/xml` or `text/xml` for `Content-Type`.

**Return value:** A `TranslateArrayResponse` array. Each `TranslateArrayResponse` has these elements:

* `Error`: Indicates an error if one occurs. Otherwise set to null.
* `OriginalSentenceLengths`: An array of integers that indicates the length of each sentence in the source text. The length of the array indicates the number of sentences.
* `TranslatedText`: The translated text.
* `TranslatedSentenceLengths`: An array of integers that indicates the length of each sentence in the translated text. The length of the array indicates the number of sentences.
* `State`: User state to help correlate the request and response. Returns the same content as the request.

Here's the format of the response body:

```
<ArrayOfTranslateArrayResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"
  xmlns:i="https://www.w3.org/2001/XMLSchema-instance">
  <TranslateArrayResponse>
    <From>language-code</From>
    <OriginalTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>int-value</a:int>
    </OriginalTextSentenceLengths>
    <State/>
    <TranslatedText>string-value</TranslatedText>
    <TranslatedTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>int-value</a:int>
    </TranslatedTextSentenceLengths>
  </TranslateArrayResponse>
</ArrayOfTranslateArrayResponse>
```

### Response class (status 200)
A successful response includes an array of `TranslateArrayResponse` arrays in the format described earlier.

string

Response content type: application/xml

### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|Authorization|(empty)	|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code	|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response. Common errors include: <ul><li>Array element cannot be empty.</li><li>Invalid category.</li><li>From language is invalid.</li><li>To language is invalid.</li><li>The request contains too many elements.</li><li>The From language is not supported.</li><li>The To language is not supported.</li><li>Translate Request has too much data.</li><li>HTML is not in a correct format.</li><li>Too many strings were passed in the Translate Request.</li></ul>|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetLanguageNames

### Implementation notes
Retrieves friendly names for the languages passed in as the parameter `languageCodes`, localized into the passed `locale` language.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguageNames`.

The request body includes a string array that represents the ISO 639-1 language codes for which to retrieve the friendly names. Here's an example:

```
<ArrayOfstring xmlns:i="https://www.w3.org/2001/XMLSchema-instance"  xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <string>zh</string>
    <string>en</string>
</ArrayOfstring>
```

**Return value:** A string array that contains language names supported by the Translator service, localized into the requested language.

### Response class (status 200)
A string array that contains languages names supported by the Translator service, localized into the requested language.

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|locale|(empty)	|Required. A string that represents one of the following, used to localize the language names: <ul><li>The combination of an ISO 639 two-letter lowercase culture code associated with a language and an ISO 3166 two-letter uppercase subculture code. <li>An ISO 639 lowercase culture code by itself.|query|string|
|Authorization|(empty)	|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /GetLanguagesForTranslate

### Implementation notes
Gets a list of language codes that represent languages supported by the Translation service.  `Translate` and `TranslateArray` can translate between any two of these languages.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguagesForTranslate`.

**Return value:** A string array that contains the language codes supported by the Translator service.

### Response class (status 200)
A string array that contains the language codes supported by the Translator service.

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)	|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /GetLanguagesForSpeak

### Implementation notes
Retrieves the languages available for speech synthesis.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguagesForSpeak`.

**Return value:** A string array that contains the language codes supported for speech synthesis by the Translator service.

### Response class (status 200)
A string array that contains the language codes supported for speech synthesis by the Translator service.

string

Response content type: application/xml

### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|
 
### Response messages

|HTTP status code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /Speak

### Implementation notes
Returns a WAV or MP3 stream of the passed-in text, spoken in the desired language.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Speak`.

**Return value:** A WAV or MP3 stream of the passed-in text, spoken in the desired language.

### Response class (status 200)

binary

Response content type: application/xml

### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)	|Required. A string that contains one or more sentences to be spoken for the stream, in the specified language. The text must not exceed 2,000 characters.|query|string|
|language|(empty)	|Required. A string that represents the supported language code of the language in which to speak the text. The code must be one of the codes returned by the method `GetLanguagesForSpeak`.|query|string|
|format|(empty)|Optional. A string that specifies the content-type ID. Currently,  `audio/wav` and `audio/mp3` are available. The default value is `audio/wav`.|query|string|
|options|(empty)	|Optional. A string that specifies properties of the synthesized speech:<ul><li>`MaxQuality` and `MinSize` specify the quality of the audio signal. `MaxQuality` provides the highest quality. `MinSize` provides the smallest file size. The default is  `MinSize`.</li><li>`female` and `male` specify the desired gender of the voice. The default is `female`. Use the vertical bar (<code>\|</code>) to include multiple options. For example,  `MaxQuality|Male`.</li></li></ul>	|query|string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /Detect

### Implementation notes
Identifies the language of a section of text.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Detect`.

**Return value:** A string that contains a two-character language code for the text.

### Response class (status 200)

string

Response content type: application/xml

### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)	|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)|Required. A string that contains text whose language is to be identified. The text must not exceed 10,000 characters.|query|	string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key	|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|


## POST /DetectArray

### Implementation notes

Identifies the languages in an array of strings. Independently detects the language of each individual array element and returns a result for each row of the array.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/DetectArray`.

Here's the format of the request body:

```
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <string>string-value-1</string>
    <string>string-value-2</string>
</ArrayOfstring>
```

The text can't exceed 10,000 characters.

**Return value:** A string array that contains a two-character language code for each row in the input array.

Here's the format of the response body:

```
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="https://www.w3.org/2001/XMLSchema-instance">
  <string>language-code-1</string>
  <string>language-code-2</string>
</ArrayOfstring>
```

### Response class (status 200)
`DetectArray` was successful. Returns a string array that contains a two-character language code for each row of the input array.

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty.  Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /AddTranslation

### Implementation notes

> [!IMPORTANT]
> **Deprecation note:** After January 31, 2018, this method won't accept new sentence submissions. You'll get an error message. Please see the announcement about changes to the Collaborative Translation Framework (CTF).

Adds a translation to the translation memory.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/AddTranslation`.

### Response class (status 200)

string

Response content type: application: xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type	|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|originalText|(empty)|Required. A string that contains the text to translate. The maximum length of the string is 1,000 characters.|query|string|
|translatedText|(empty)	|Required. A string that contains text translated into the target language. The maximum length of the string is 2,000 characters.|query|string|
|from|(empty)	|Required. A string that represents the language code of the original language of the text. For example, en for English and de for German.|query|string|
|to|(empty)|Required. A string that represents the language code  of the language to translate the text into.|query|string|
|rating|(empty)	|Optional. An integer that represents the quality rating for the string. The value is between -10 and 10. The default is 1.|query|integer|
|contentType|(empty)	|Optional. The format of the text being translated. The supported formats are `text/plain` and `text/html`. Any HTML elements need to be well-formed, complete elements.	|query|string|
|category|(empty)|Optional. A string that contains the category (domain) of the translation. The default is `general`.|query|string|
|user|(empty)|Required. A string that's used to track the originator of the submission.|query|string|
|uri|(empty)|Optional. A string that contains the content location of the translation.|query|string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty.  Authorization token:  `"Bearer" + " " + "access_token"`.	|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|410|`AddTranslation` is no longer supported.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /AddTranslationArray

### Implementation notes

> [!IMPORTANT]
> **Deprecation note:** After January 31, 2018, this method won't accept new sentence submissions. You'll get an error message. Please see the announcement about changes to the Collaborative Translation Framework (CTF).

Adds an array of translations to translation memory. This method is an array version of `AddTranslation`.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/AddTranslationArray`.

Here's the format of the request body:

```
<AddtranslationsRequest>
  <AppId></AppId>
  <From>A string containing the language code of the source language</From>
  <Options>
    <Category xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</Category>
    <ContentType xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">text/plain</ContentType>
    <User xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</User>
    <Uri xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</Uri>
  </Options>
  <To>A string containing the language code of the target language</To>
  <Translations>
    <Translation xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">
      <OriginalText>string-value</OriginalText>
      <Rating>int-value</Rating>
      <Sequence>int-value</Sequence>
      <TranslatedText>string-value</TranslatedText>
    </Translation>
  </Translations>
</AddtranslationsRequest>
```

These elements are in `AddtranslationsRequest`:

* `AppId`: Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `AppId` field empty. Otherwise, include a string that  contains `"Bearer" + " " + "access_token"`.
* `From`: Required. A string that contains the language code of the source language. Must be one of the languages returned by the `GetLanguagesForTranslate` method.
* `To`: Required. A string that contains the language code of the target language. Must be one of the languages returned by the `GetLanguagesForTranslate` method.
* `Translations`: Required. An array of translations to add to translation memory. Each translation must contain `OriginalText`, `TranslatedText`, and `Rating`. The maximum size of each `OriginalText` and `TranslatedText` is 1,000 characters. The total of all `OriginalText` and `TranslatedText` elements can't exceed 10,000 characters. The maximum number of array elements is 100.
* `Options`: Required. A set of options, including `Category`, `ContentType`, `Uri`, and `User`. `User` is required. `Category`, `ContentType`, and `Uri` are optional. Specified elements must be listed in alphabetical order.

### Response class (status 200)
`AddTranslationArray` method succeeded. 

After January 31, 2018, sentence submissions won't be accepted. The service will respond with error code 410.

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty.  Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|410	|`AddTranslation` is no longer supported.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /BreakSentences

### Implementation notes
Breaks a section of text into sentences and returns an array that contains the lengths of each sentence.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/BreakSentences`.

**Return value:** An array of integers that represents the lengths of the sentences. The length of the array represents the number of sentences. The values represent the length of each sentence.

### Response class (status 200)
An array of integers that represents the lengths of the sentences. The length of the array represents the number of sentences. The values represent the length of each sentence.

integer

Response content type: application/xml

### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)	|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|	string|
|text|(empty)	|Required. A string that represents the text to split into sentences. The maximum size of the text is 10,000 characters.|query|string|
|language	|(empty)	|Required. A string that represents the language code of the input text.|query|string|
|Authorization|(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.	|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401|Invalid credentials.|
|500|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetTranslations

### Implementation notes
Retrieves an array of translations for a given language pair from the store and the MT engine. `GetTranslations` differs from `Translate` in that it returns all available translations.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetTranslations`.

The body of the request includes the optional `TranslationOptions` object, which has this format:

```
<TranslateOptions xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">
  <Category>string-value</Category>
  <ContentType>text/plain</ContentType>
  <ReservedFlags></ReservedFlags>
  <State>int-value</State>
  <Uri>string-value</Uri>
  <User>string-value</User>
</TranslateOptions>
```

The `TranslateOptions` object contains the values in the following list. They're all optional and default to the most common settings. Specified elements must be listed in alphabetical order.

* `Category`: A string that contains the category (domain) of the translation. The default is `general`.
* `ContentType`: The only supported option, and the default, is `text/plain`.
* `IncludeMultipleMTAlternatives`: A Boolean flag to specify whether more than one alternative should be returned from the MT engine. Valid values are `true` and `false` (case-sensitive). The default is `false`, which returns only one alternative. Setting the flag to `true` enables the creation of artificial alternatives, fully integrated with the Collaborative Translation Framework (CTF). The feature enables returning alternatives for sentences that have no translations in CTF by adding artificial alternatives from the *n*-best list of the decoder.
	- Ratings. The ratings are applied like this: 
	     - The best automatic translation has a rating of 5.
       - The alternatives from CTF reflect the authority of the reviewer. They range from -10 to +10.
       - The automatically generated (*n*-best) translation alternatives have a rating of 0 and a match degree of 100.
	- Number of alternatives. The number of returned alternatives can be as high as the value specified in `maxTranslations`, but it can be lower.
	- Language pairs. This functionality isn't available for translations between Simplified Chinese and Traditional Chinese, in either direction. It is available for all other language pairs supported by Microsoft Translator.
* `State`: User state to help correlate the request and response. The same content will be returned in the response.
* `Uri`: Filter results by this URI. If no value is set, the default is `all`.
* `User`: Filter results by this user. If no value is set, the default is `all`.

Request `Content-Type` should be `text/xml`.

**Return value:** Here's the format of the response:

```
<GetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"
  xmlns:i="https://www.w3.org/2001/XMLSchema-instance">
  <From>Two character language code</From>
  <State/>
  <Translations>
    <TranslationMatch>
      <Count>int-value</Count>
      <MatchDegree>int-value</MatchDegree>
      <MatchedOriginalText/>
      <Rating>int value</Rating>
      <TranslatedText>string-value</TranslatedText>
    </TranslationMatch>
  </Translations>
</GetTranslationsResponse>
```

This response includes a `GetTranslationsResponse` element that contains the following values:

* `Translations`: An array of the matches found, stored in `TranslationMatch` objects (described in the following section). The translations might include slight variants of the original text (fuzzy matching). The translations will be sorted: 100% matches first, fuzzy matches next.
* `From`: If the method doesn't specify a `From` language, this value will come from automatic language detection. Otherwise, it will be the specified `From` language.
* `State`: User state to help correlate the request and response. Contains the value supplied in the `TranslateOptions` parameter.

The `TranslationMatch` object consists of these values:

* `Error`: The error code, if an error occurs for a specific input string. Otherwise, this field is empty.
* `MatchDegree`: Indicates how closely the input text matches the original text found in the store. The system matches input sentences against the store, including inexact matches. The value returned ranges from 0 to 100, where 0 is no similarity and 100 is an exact, case-sensitive match.
* `MatchedOriginalText`: Original text that was matched for this result. This value is returned only if the matched original text was different from the input text. It's used to return the source text of a fuzzy match. This value isn't returned for Microsoft Translator results.
* `Rating`: Indicates the authority of the person making the quality decision. Machine Translation results have a rating of 5. Anonymously provided translations generally have a rating from 1 through 4. Authoritatively provided translations will generally have a rating from 6 through 10.
* `Count`: The number of times this translation with this rating has been selected. The value is 0 for the automatically translated response.
* `TranslatedText`: The translated text.

### Response class (status 200)
A `GetTranslationsResponse` object in the format described previously.

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the `appid` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)|Required. A string that represents the text to translate. The maximum size of the text is 10,000 characters.|query|string|
|from|(empty)|Required. A string that represents the language code of the text being translated.|query|string|
|to	|(empty)	|Required. A string that represents the language code of the language to translate the text into.|query|string|
|maxTranslations|(empty)|Required. An integer that represents the maximum number of translations to return.|query|integer|
|Authorization|	(empty)|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty. Authorization token:  `"Bearer" + " " + "access_token"`.|string|	header|
|Ocp-Apim-Subscription-Key|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetTranslationsArray

### Implementation notes
Retrieves multiple translation candidates for multiple source texts.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetTranslationsArray`.

Here's the format of the request body:

```
<GetTranslationsArrayRequest>
  <AppId></AppId>
  <From>language-code</From>
  <MaxTranslations>int-value</MaxTranslations>
  <Options>
    <Category xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</Category>
    <ContentType xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">text/plain</ContentType>
    <ReservedFlags xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"/>
    <State xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">int-value</State>
    <Uri xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</Uri>
    <User xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2">string-value</User>
  </Options>
  <Texts>
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">string-value</string>
  </Texts>
  <To>language-code</To>
</GetTranslationsArrayRequest>
```

`GetTranslationsArrayRequest` includes these elements:

* `AppId`: Required. If the `Authorization` header is used, leave the `AppId` field empty. Otherwise, include a string that contains `"Bearer" + " " + "access_token"`.
* `From`: Required. A string that represents the language code of the text being translated.
* `MaxTranslations`: Required. An integer that represents the maximum number of translations to return.
* `Options`: Optional. An `Options` object that contains the following values. They're all optional and default to the most common settings. Specified elements must be listed in alphabetical order.
	- `Category`: A string that contains the category (domain) of the translation. The default is `general`.
	- `ContentType`: The only supported option, and the default, is `text/plain`.
	- `IncludeMultipleMTAlternatives`: A Boolean flag to specify whether more than one alternative should be returned from the MT engine. Valid values are `true` and `false` (case-sensitive). The default is `false`, which returns only one alternative. Setting the flag to `true` enables generation of artificial alternatives in translation, fully integrated with the Collaborative Translations Framework (CTF). The feature enables returning alternatives for sentences that have no alternatives in CTF by adding artificial alternatives from the *n*-best list of the decoder.
		- Ratings The ratings are applied like this:
		  - The best automatic translation has a rating of 5.
		  - The alternatives from CTF reflect the authority of the reviewer. They range from -10 to +10.
		  - The automatically generated (*n*-best) translation alternatives have a rating of 0 and a match degree of 100.
		- Number of alternatives. The number of returned alternatives can be as high as the value specified in `maxTranslations`, but it can be lower.
		- Language pairs. This functionality isn't available for translations between Simplified Chinese and Traditional Chinese, in either direction. It is available for all other language pairs supported by Microsoft Translator.
* `State`: User state to help correlate the request and response. The same content will be returned in the response.
* `Uri`: Filter results by this URI. If no value is set, the default is `all`.
* `User`: Filter results by this user. If no value is set, the default is `all`.
* `Texts`: Required. An array that contains the text for translation. All strings must be in the same language. The total of all text to be translated can't exceed 10,000 characters. The maximum number of array elements is 10.
* `To`: Required. A string that represents the language code of the language to translate the text into.

You can omit optional elements. Elements that are direct children of `GetTranslationsArrayRequest` must be listed in alphabetical order.

Request `Content-Type` should be `text/xml`.

**Return value:** Here's the format of the response:

```
<ArrayOfGetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="https://www.w3.org/2001/XMLSchema-instance">
  <GetTranslationsResponse>
    <From>language-code</From>
    <State/>
    <Translations>
      <TranslationMatch>
        <Count>int-value</Count>
        <MatchDegree>int-value</MatchDegree>
        <MatchedOriginalText>string-value</MatchedOriginalText>
        <Rating>int-value</Rating>
        <TranslatedText>string-value</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>int-value</Count>
        <MatchDegree>int-value</MatchDegree>
        <MatchedOriginalText/>
        <Rating>int-value</Rating>
        <TranslatedText>string-value</TranslatedText>
      </TranslationMatch>
    </Translations>
  </GetTranslationsResponse>
</ArrayOfGetTranslationsResponse>
```

Each `GetTranslationsResponse` element contains these values:

* `Translations`: An array of the matches found, stored in `TranslationMatch` objects (described in the following section). The translations might include slight variants of the original text (fuzzy matching). The translations will be sorted: 100% matches first, fuzzy matches next.
* `From`: If the method doesn't specify a `From` language, this value will come from automatic language detection. Otherwise, it will be the specified `From` language.
* `State`: User state to help correlate the request and response. Contains the value supplied in the `TranslateOptions` parameter.

The `TranslationMatch` object contains the following values:
* `Error`: The error code, if an error occurs for a specific input string. Otherwise, this field is empty.
* `MatchDegree`: Indicates how closely the input text matches the original text found in the store. The system matches input sentences against the store, including inexact matches. The value returned ranges from 0 to 100, where 0 is no similarity and 100 is an exact, case-sensitive match.
* `MatchedOriginalText`: Original text that was matched for this result. This value is returned only if the matched original text was different from the input text. It's used to return the source text of a fuzzy match. This value isn't returned for Microsoft Translator results.
* `Rating`: Indicates the authority of the person making the quality decision. Machine Translation results have a rating of 5. Anonymously provided translations generally have a rating from 1 through 4. Authoritatively provided translations generally have a rating from 6 through 10.
* `Count`: The number of times this translation with this rating has been selected. The value is 0 for the automatically translated response.
* `TranslatedText`: The translated text.


### Response class (status 200)

string

Response content type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter type|Data type|
|:--|:--|:--|:--|:--|
|Authorization	|(empty)	|Required if both the `appid` field and the `Ocp-Apim-Subscription-Key` header are left empty.  Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if both the `appid` field and the `Authorization` header are left empty.|header|string|

### Response messages

|HTTP status code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## Next steps

> [!div class="nextstepaction"]
> [Migrate to Translator Text API v3](../migrate-to-v3.md)


