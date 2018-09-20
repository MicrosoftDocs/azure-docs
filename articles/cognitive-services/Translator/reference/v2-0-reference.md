---
title: Translator Text API V2.0
titleSuffix: Azure Cognitive Services
description: Reference documentation for the V2.0 Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: reference
ms.date: 05/15/2018
ms.author: v-jansko
---

# Translator Text API v2.0

> [!IMPORTANT]
> This version of the Translator Text API has been deprecated. [View documentation for v3 of the Translator Text API](v3-0-reference.md).

Translator Text API V2 can be seamlessly integrated into your applications, websites, tools, or other solutions to provide multi-language user experiences. Leveraging industry standards, it can be used on any hardware platform and with any operating system to perform language translation and other language-related operations such as text language detection or text to speech. Click Here for more information about the Microsoft Translator API.

## Getting started
To access the Translator Text API you will need to [sign up for Microsoft Azure](../translator-text-how-to-signup.md).

## Authorization
All calls to Translator Text API require a subscription key to authenticate. The API supports two modes of authentication:

* Using an access token. Use the subscription key referenced in **step** 9 to generate an access token by making a POST request to the authorization service. See the token service documentation for details. Pass the access token to the Translator service using the Authorization header or the access_token query parameter. The access token is valid for 10 minutes. Obtain a new access token every 10 minutes, and keep using the same access token for repeated requests within these 10 minutes.

* Using a subscription key directly. Pass your subscription key as a value in `Ocp-Apim-Subscription-Key` header included with your request to the Translator API. In this mode, you do not have to call the authentication token service to generate an access token.

Consider your subscription key and the access token as secrets that should be hidden from view.

## Profanity handling
Normally the Translator service will retain profanity that is present in the source in the translation. The degree of profanity and the context that makes words profane differ between cultures, and as a result the degree of profanity in the target language may be amplified or reduced.

If you want to avoid getting profanity in the translation, regardless of the presence of profanity in the source text, you can use the profanity filtering option for the methods that support it. The option allows you to choose whether you want to see profanity deleted or marked with appropriate tags, or no action taken. The accepted values of  `ProfanityAction` are `NoAction` (default), Marked and `Deleted`.


|ProfanityAction	|Action	|Example Source (Japanese)	|Example Translation (English)	|
|:--|:--|:--|:--|
|NoAction	|Default. Same as not setting the option. Profanity will pass from source to target.		|彼はジャッカスです。		|He is a jackass.	|
|Marked		|Profane words will be surrounded by XML tags <profanity> and </profanity>.		|彼はジャッカスです。	|He is a <profanity>jackass</profanity>.	|
|Deleted	|Profane words will be removed from the output without replacement.		|彼はジャッカスです。	|He is a.	|

	
## Excluding content from translation
When translating content with tags such as HTML (`contentType=text/html`), it is sometimes useful to exclude specific content from translation. You may use the attribute `class=notranslate` to specify content that should remain in its original language. In the following example, the content inside the first `div` element will not be translated, while the content in the second `div` element will be translated.

```HTML
<div class="notranslate">This will not be translated.</div>
<div>This will be translated. </div>
```

## GET /Translate

### Implementation notes
Translates a text string from one language to another.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Translate`.

**Return value:** A string representing the translated text.

If you previously used `AddTranslation` or `AddTranslationArray` to enter a translation with a rating of 5 or higher for the same source sentence, `Translate` returns only the top choice that is available to your system. The "same source sentence" means the exact same (100% matching), except for capitalization, white space, tag values, and punctuation at the end of a sentence. If no rating is stored with a rating of 5 or above then the returned result will be the automatic translation by Microsoft Translator.

### Response class (Status 200)

string

Response Content Type: application/xml 

### Parameters

|Parameter|Value|Description	|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid	|(empty)	|Required. If the Authorization or  Ocp-Apim-Subscription-Key header is used, leave the appid field empty else include a string containing  "Bearer" + " " + "access_token".|query|string|
|text|(empty)	|Required. A string representing the text to translate. The size of the text must not exceed 10000 characters.|query|string|
|from|(empty)	|Optional. A string representing the language code of the translation text. For example, en for English.|query|string|
|to|(empty)	|Required. A string representing the language code to translate the text into.|query|string|
|contentType|(empty)	|Optional. The format of the text being translated. The supported formats are text/plain (default) and  text/html. Any HTML needs to be a well-formed, complete element.|query|string|
|category|(empty)	|Optional. A string containing the category (domain) of the translation. Defaults to "general".|query|string|
|Authorization|(empty)	|Required if the appid field or  Ocp-Apim-Subscription-Key header is not specified. Authorization token:  "Bearer" + " " + "access_token".|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if the appid field or Authorization header is not specified.|header|string|


### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /TranslateArray

### Implementation notes
Use the `TranslateArray` method to retrieve translations for multiple source texts.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/TranslateArray`.

The format of the request body should be as follows:

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

Elements within the `TranslateArrayRequest` are:


* `appid`: Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing `"Bearer" + " " + "access_token"`.
* `from`: Optional. A string representing the language code to translate the text from. If left empty the response will include the result of language auto-detection.
* `options`: Optional. An `Options` object which contains the values listed below. They are all optional and default to the most common settings. Specified elements must be listed in alphabetical order.
	- `Category`: A string containing the category (domain) of the translation. Defaults to `general`.
	- `ContentType`: The format of the text being translated. The supported formats are `text/plain` (default), `text/xml` and `text/html`. Any HTML needs to be a well-formed, complete element.
	- `ProfanityAction`: Specifies how profanities are handled as explained above. Accepted values of `ProfanityAction` are `NoAction` (default), `Marked` and `Deleted`.
	- `State`: User state to help correlate request and response. The same contents will be returned in the response.
	- `Uri`: Filter results by this URI. Default: `all`.
	- `User`: Filter results by this user. Default: `all`.
* `texts`: Required. An array containing the texts for translation. All strings must be of the same language. The total of all texts to be translated must not exceed 10000 characters. The maximum number of array elements is 2000.
* `to`: Required. A string representing the language code to translate the text into.

Optional elements can be omitted. Elements which are direct children of TranslateArrayRequest must be listed in alphabetical order.

TranslateArray method accepts `application/xml` or `text/xml` for `Content-Type`.

**Return value:** A `TranslateArrayResponse` array. Each `TranslateArrayResponse` has the following elements:

* `Error`: Indicates an error if one has occurred. Otherwise set to null.
* `OriginalSentenceLengths`: An array of integers indicating the length of each sentence in the original source text. The length of the array indicates the number of sentences.
* `TranslatedText`: The translated text.
* `TranslatedSentenceLengths`: An array of integers indicating the length of each sentence in the translated text. The length of the array indicates the number of sentences.
* `State`: User state to help correlate request and response. Returns the same content as in the request.

The format of the response body is as follows.

```
<ArrayOfTranslateArrayResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
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

### Response class (Status 200)
A successful response includes an array of `TranslateArrayResponse` in format described above.

string

Response Content Type: application/xml

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|Authorization|(empty))	|Required if the appid field or  Ocp-Apim-Subscription-Key header is not specified. Authorization token:  "Bearer" + " " + "access_token".|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the appid field or Authorization header is not specified.|header|string|

### Response messages

|HTTP Status Code	|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response. Common errors include: <ul><li>Array element cannot be empty</li><li>Invalid category</li><li>From language is invalid</li><li>To language is invalid</li><li>The request contains too many elements</li><li>The From language is not supported</li><li>The To language is not supported</li><li>Translate Request has too much data</li><li>HTML is not in a correct format</li><li>Too many strings were passed in the Translate Request</li></ul>|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetLanguageNames

### Implementation notes
Retrieves friendly names for the languages passed in as the parameter `languageCodes`, and localized using the passed locale language.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguageNames`.

The request body includes a string array representing the ISO 639-1 language codes to retrieve the friendly names for. For example:

```
<ArrayOfstring xmlns:i="http://www.w3.org/2001/XMLSchema-instance"  xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <string>zh</string>
    <string>en</string>
</ArrayOfstring>
```

**Return value:** A string array containing languages names supported by the Translator Service, localized into the requested language.

### Response class (Status 200)
A string array containing languages names supported by the Translator Service, localized into the requested language.

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|locale|(empty)	|Required. A string representing a combination of an ISO 639 two-letter lowercase culture code associated with a language and an ISO 3166 two-letter uppercase subculture code to localize the language names or an ISO 639 lowercase culture code by itself.|query|string|
|Authorization|(empty)	|Required if the appid field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if the appid field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /GetLanguagesForTranslate

### Implementation notes
Obtain a list of language codes representing languages that are supported by the Translation Service.  `Translate` and `TranslateArray` can translate between any two of these languages.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguagesForTranslate`.

**Return value:** A string array containing the language codes supported by the Translator Services.

### Response class (Status 200)
A string array containing the language codes supported by the Translator Services.

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)	|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /GetLanguagesForSpeak

### Implementation notes
Retrieves the languages available for speech synthesis.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetLanguagesForSpeak`.

**Return value:** A string array containing the language codes supported for speech synthesis by the Translator Service.

### Response class (Status 200)
A string array containing the language codes supported for speech synthesis by the Translator Service.

string

Response Content Type: application/xml

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the `appid` field or `Authorization` header is not specified.|header|string|
 
### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /Speak

### Implementation notes
Returns a wave or mp3 stream of the passed-in text being spoken in the desired language.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Speak`.

**Return value:** A wave or mp3 stream of the passed-in text being spoken in the desired language.

### Response class (Status 200)

binary

Response Content Type: application/xml 

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)	|Required. A string containing a sentence or sentences of the specified language to be spoken for the wave stream. The size of the text to speak must not exceed 2000 characters.|query|string|
|language|(empty)	|Required. A string representing the supported language code to speak the text in. The code must be present in the list of codes returned from the method  `GetLanguagesForSpeak`.|query|string|
|format|(empty)|Optional. A string specifying the content-type ID. Currently,  `audio/wav` and `audio/mp3` are available. The default value is `audio/wav`.|query|string|
|options|(empty)	|<ul><li>Optional. A string specifying properties of the synthesized speech:<li>`MaxQuality` and `MinSize` are available to specify the quality of the audio signals. With `MaxQuality`, you can get voices with the highest quality, and with `MinSize`, you can get the voices with the smallest size. Default is  `MinSize`.</li><li>`female` and `male` are available to specify the desired gender of the voice. Default is `female`. Use the vertical bar `|` to include multiple options. For example  `MaxQuality|Male`.</li></li></ul>	|query|string|
|Authorization|(empty)|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /Detect

### Implementation notes
Use the `Detect` method to identify the language of a selected piece of text.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/Detect`.

**Return value:** A string containing a two-character Language code for the given text. .

### Response class (Status 200)

string

Response Content Type: application/xml

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)	|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)|Required. A string containing some text whose language is to be identified. The size of the text must not exceed 10000 characters.|query|	string|
|Authorization|(empty)|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key	|(empty)	|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|


## POST /DetectArray

### Implementation notes
Use the `DetectArray` method to identify the language of an array of string at once. Performs independent detection of each individual array element and returns a result for each row of the array.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/DetectArray`.

The format of the request body should be as follows.

```
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <string>string-value-1</string>
    <string>string-value-2</string>
</ArrayOfstring>
```

The size of the text must not exceed 10000 characters.

**Return value:** A string array containing a two-character Language codes for each row of the input array.

The format of the response body is as follows.

```
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>language-code-1</string>
  <string>language-code-2</string>
</ArrayOfstring>
```

### Response class (Status 200)
DetectArray was successful. Returns a string array containing a two-character Language codes for each row of the input array.

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|Authorization|(empty)|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the `appid` field or Authorization header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /AddTranslation

### Implementation notes

> [!IMPORTANT]
> **DEPRECATION NOTE:** After January 31, 2018, this method will not accept new sentence submissions, and you will receive an error message. Please refer to this announcement about changes to the Collaborative Translation Functions.

Adds a translation to the translation memory.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/AddTranslation`.

### Response class (Status 200)

string

Response Content Type: application: xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type	|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|originalText|(empty)|Required. A string containing the text to translate from. The string has a maximum length of 1000 characters.|query|string|
|translatedText|(empty)	|Required. A string containing translated text in the target language. The string has a maximum length of 2000 characters.|query|string|
|from|(empty)	|Required. A string representing the language code of the translation text. en = english, de = german etc...|query|string|
|to|(empty)|Required. A string representing the language code to translate the text into.|query|string|
|rating|(empty)	|Optional. An integer representing the quality rating for this string. Value between -10 and 10. Defaults to 1.|query|integer|
|contentType|(empty)	|Optional. The format of the text being translated. The supported formats are "text/plain" and "text/html". Any HTML needs to be a well-formed, complete element.	|query|string|
|category|(empty)|Optional. A string containing the category (domain) of the translation. Defaults to "general".|query|string|
|user|(empty)|Required. A string used to track the originator of the submission.|query|string|
|uri|(empty)|Optional. A string containing the content location of this translation.|query|string|
|Authorization|(empty)|Required if the appid field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.	|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|410|AddTranslation is no longer supported.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /AddTranslationArray

### Implementation notes

> [!IMPORTANT]
> **DEPRECATION NOTE:** After January 31, 2018, this method will not accept new sentence submissions, and you will receive an error message. Please refer to this announcement about changes to the Collaborative Translation Functions.

Adds an array of translations to add translation memory. This is an array version of `AddTranslation`.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/AddTranslationArray`.

The format of the request body is as follows.

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

Elements within the AddtranslationsRequest element are:

* `AppId`: Required. If the `Authorization` or `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing `"Bearer" + " " + "access_token"`.
* `From`: Required. A string containing the language code of the source language. Must be one of the languages returned by the `GetLanguagesForTranslate` method.
* `To`: Required. A string containing the language code of the target language. Must be one of the languages returned by the `GetLanguagesForTranslate` method.
* `Translations`: Required. An array of translations to add to translation memory. Each translation must contain: originalText, translatedText and rating. The size of each originalText and translatedText is limited to 1000 chars. The total of all the originalText(s) and translatedText(s) must not exceed 10000 characters. The maximum number of array elements is 100.
* `Options`: Required. A set of options, including Category, ContentType, Uri, and User. User is required. Category, ContentType and Uri are optional. Specified elements must be listed in alphabetical order.

### Response class (Status 200)
AddTranslationArray method was successful. After January 31, 2018, sentence submissions will not be accepted. The service will respond with error code 410.

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|Authorization|(empty)|Required if the appid field or  Ocp-Apim-Subscription-Key header is not specified. Authorization token:  "Bearer" + " " + "access_token".|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the appid field or Authorization header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|410	|AddTranslation is no longer supported.|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## GET /BreakSentences

### Implementation notes
Breaks a piece of text into sentences and returns an array containing the lengths in each sentence.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/BreakSentences`.

**Return value:** An array of integers representing the lengths of the sentences. The length of the array is the number of sentences, and the values are the length of each sentence.

### Response class (Status 200)
An array of integers representing the lengths of the sentences. The length of the array is the number of sentences, and the values are the length of each sentence.

integer

Response Content Type: application/xml 

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)	|Required. If the Authorization or  Ocp-Apim-Subscription-Key header is used, leave the appid field empty else include a string containing  "Bearer" + " " + "access_token".|query|	string|
|text|(empty)	|Required. A string representing the text to split into sentences. The size of the text must not exceed 10000 characters.|query|string|
|language	|(empty)	|Required. A string representing the language code of input text.|query|string|
|Authorization|(empty)|Required if the appid field or  Ocp-Apim-Subscription-Key header is not specified. Authorization token:  "Bearer" + " " + "access_token".	|header|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the appid field or Authorization header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400|Bad request. Check input parameters and the detailed error response.|
|401|Invalid credentials|
|500|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  X-MS-Trans-Info.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetTranslations

### Implementation notes
Retrieves an array of translations for a given language pair from the store and the MT engine. GetTranslations differs from Translate as it returns all available translations.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetTranslations`.

The body of the request includes the optional TranslationOptions object, which has the following format.

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

The `TranslateOptions` object contains the values listed below. They are all optional and default to the most common settings. Specified elements must be listed in alphabetical order.

* `Category`: A string containing the category (domain) of the translation. Defaults to "general".
* `ContentType`: The only supported, and the default, option is "text/plain".
* `IncludeMultipleMTAlternatives`: boolean flag to determine whether more than one alternatives should be returned from the MT engine. Valid values are true and false (case-sensitive). Default is false and includes only 1 alternative. Setting the flag to true allows for generating artificial alternatives in translation, fully integrated with the collaborative translations framework (CTF). The feature allows for returning alternatives for sentences that have no alternatives in CTF, by adding artificial alternatives from the n-best list of the decoder.
	- Ratings The ratings are applied as follows: 1) The best automatic translation has a rating of 5. 2) The alternatives from CTF reflect the authority of the reviewer, from -10 to +10. 3) The automatically generated (n-best) translation alternatives have a rating of 0, and have a match degree of 100.
	- Number of Alternatives The number of returned alternatives is up to maxTranslations, but may be less.
	- Language pairs This functionality is not available for translations between Simplified and Traditional Chinese, both directions. It is available for all other Microsoft Translator supported language pairs.
* `State`: User state to help correlate request and response. The same contents will be returned in the response.
* `Uri`: Filter results by this URI. If no value is set, the default is all.
* `User`: Filter results by this user. If no value is set, the default is all.

Request `Content-Type` should be `text/xml`.

**Return value:** The format of the response is as follows.

```
<GetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
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

This includes a `GetTranslationsResponse` element containing the following values:

* `Translations`: An array of matches found, stored in TranslationMatch (see below) objects. The translations may include slight variants of the original text (fuzzy matching). The translations will be sorted: 100% matches first, fuzzy matches below.
* `From`: If the method did not specify a From language, this will be the result of auto language detection. Otherwise it will be the given From language.
* `State`: User state to help correlate request and response. Contains the same value as given in the TranslateOptions parameter.

TranslationMatch object consists of the following:

* `Error`: If an error has occurred for a specific input string, the error code is stored. Otherwise the field is empty.
* `MatchDegree`: The system matches input sentences against the store, including inexact matches.  MatchDegree indicates how closely the input text matches the original text found in the store. The value returned ranges from 0 to 100, where 0 is no similarity and 100 is an exact case sensitive match.
MatchedOriginalText: Original text that was matched for this result. Only returned if the matched original text was different than the input text. Used to return the source text of a fuzzy match. Not returned for Microsoft Translator results.
* `Rating`: Indicates the authority of the person making the quality decision. Machine Translation results will have a rating of 5. Anonymously provided translations will generally have a rating of 1 to 4, whilst authoritatively provided translations will generally have a rating of 6 to 10.
* `Count`: The number of times this translation with this rating has been selected. The value will be 0 for the automatically translated response.
* `TranslatedText`: The translated text.

### Response class (Status 200)
A `GetTranslationsResponse` object in the format described above.

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|appid|(empty)|Required. If the `Authorization` or  `Ocp-Apim-Subscription-Key` header is used, leave the appid field empty else include a string containing  `"Bearer" + " " + "access_token"`.|query|string|
|text|(empty)|Required. A string representing the text to translate. The size of the text must not exceed 10000 characters.|query|string|
|from|(empty)|Required. A string representing the language code of the translation text.|query|string|
|to	|(empty)	|Required. A string representing the language code to translate the text into.|query|string|
|maxTranslations|(empty)|Required. An integer representing the maximum number of translations to return.|query|integer|
|Authorization|	(empty)|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|string|	header|
|Ocp-Apim-Subscription-Key|(empty)	|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503|Service temporarily unavailable. Please retry and let us know if the error persists.|

## POST /GetTranslationsArray

### Implementation notes
Use the `GetTranslationsArray` method to retrieve multiple translation candidates for multiple source texts.

The request URI is `https://api.microsofttranslator.com/V2/Http.svc/GetTranslationsArray`.

The format of the request body is as follows.

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

`GetTranslationsArrayRequest` includes the following elements:

* `AppId`: Required. If Authorization header is used, leave the appid field empty else include a string containing `"Bearer" + " " + "access_token"`.
* `From`: Required. A string representing the language code of the translation text.
* `MaxTranslations`: Required. An integer representing the maximum number of translations to return.
* `Options`: Optional. An Options object which contains the values listed below. They are all optional and default to the most common settings. Specified elements must be listed in alphabetical order.
	- Category`: A string containing the category (domain) of the translation. Defaults to general.
	- `ContentType`: The only supported, and the default, option is text/plain.
	- `IncludeMultipleMTAlternatives`: boolean flag to determine whether more than one alternatives should be returned from the MT engine. Valid values are true and false (case-sensitive). Default is false and includes only 1 alternative. Setting the flag to true allows for generating artificial alternatives in translation, fully integrated with the collaborative translations framework (CTF). The feature allows for returning alternatives for sentences that have no alternatives in CTF, by adding artificial alternatives from the n-best list of the decoder.
		- Ratings The ratings are applied as follows: 1) The best automatic translation has a rating of 5. 2) The alternatives from CTF reflect the authority of the reviewer, from -10 to +10. 3) The automatically generated (n-best) translation alternatives have a rating of 0, and have a match degree of 100.
		- Number of Alternatives The number of returned alternatives is up to maxTranslations, but may be less.
		- Language pairs This functionality is not available for translations between Simplified and Traditional Chinese, both directions. It is available for all other Microsoft Translator supported language pairs.
* `State`: User state to help correlate request and response. The same contents will be returned in the response.
* `Uri`: Filter results by this URI. If no value is set, the default is all.
* `User`: Filter results by this user. If no value is set, the default is all.
* `Texts`: Required. An array containing the texts for translation. All strings must be of the same language. The total of all texts to be translated must not exceed 10000 characters. The maximum number of array elements is 10.
* `To`: Required. A string representing the language code to translate the text into.

Optional elements can be omitted. Elements which are direct children of `GetTranslationsArrayRequest` must be listed in alphabetical order.

Request `Content-Type` should be `text/xml`.

**Return value:** The format of the response is as follows.

```
<ArrayOfGetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
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

Each `GetTranslationsResponse` element contains the following values:

* `Translations`: An array of matches found, stored in `TranslationMatch` (see below) objects. The translations may include slight variants of the original text (fuzzy matching). The translations will be sorted: 100% matches first, fuzzy matches below.
* `From`: If the method did not specify a `From` language, this will be the result of auto language detection. Otherwise it will be the given From language.
* `State`: User state to help correlate request and response. Contains the same value as given in the `TranslateOptions` parameter.

`TranslationMatch` object consists of the following:
* `Error`: If an error has occurred for a specific input string, the error code is stored. Otherwise the field is empty.
* `MatchDegree`: The system matches input sentences against the store, including inexact matches.  `MatchDegree` indicates how closely the input text matches the original text found in the store. The value returned ranges from 0 to 100, where 0 is no similarity and 100 is an exact case sensitive match.
* `MatchedOriginalText`: Original text that was matched for this result. Only returned if the matched original text was different than the input text. Used to return the source text of a fuzzy match. Not returned for Microsoft Translator results.
* `Rating`: Indicates the authority of the person making the quality decision. Machine Translation results will have a rating of 5. Anonymously provided translations will generally have a rating of 1 to 4, whilst authoritatively provided translations will generally have a rating of 6 to 10.
* `Count`: The number of times this translation with this rating has been selected. The value will be 0 for the automatically translated response.
* `TranslatedText`: The translated text.


### Response class (Status 200)

string

Response Content Type: application/xml
 
### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:--|:--|:--|:--|:--|
|Authorization	|(empty)	|Required if the `appid` field or  `Ocp-Apim-Subscription-Key` header is not specified. Authorization token:  `"Bearer" + " " + "access_token"`.|header|string|
|Ocp-Apim-Subscription-Key|(empty)	|Required if the `appid` field or `Authorization` header is not specified.|header|string|

### Response messages

|HTTP Status Code|Reason|
|:--|:--|
|400	|Bad request. Check input parameters and the detailed error response.|
|401	|Invalid credentials|
|500	|Server error. If the error persists, let us know. Please provide us with the approximate date & time of the request and with the request ID included in the response header  `X-MS-Trans-Info`.|
|503	|Service temporarily unavailable. Please retry and let us know if the error persists.|

## Next steps

> [!div class="nextstepaction"]
> [Migrate to v3 Translator Text API](../migrate-to-v3.md)










