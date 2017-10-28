---
title: Python Quickstart for Azure Cognitive Services, Microsoft Translator Text API | Microsoft Docs
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
# Quickstart for Microsoft Translator Text API with Python 
<a name="HOLTop"></a>

This article shows you how to use the [Microsoft Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview) with Python to do the following.

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

You will need [Python 3.x](https://www.python.org/downloads/) to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/Translate'

target = 'fr-fr'
text = 'Hello'

params = '?to=' + target + '&text=' + urllib.parse.quote (text)

def get_suggestions ():

	headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = get_suggestions ()
print (result.decode("utf-8"))
```

**Translate response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Salut</string>
```

[Back to top](#HOLTop)

<a name="TranslateArray"></a>

## Translate text array

The following code gets translations for multiple soruce texts, using the [TranslateArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_TranslateArray) method.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/TranslateArray'

params = ''

ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
# NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
body = """
<TranslateArrayRequest>
  <AppId />
  <Texts>
    <string xmlns=\"%s\">Hello</string>
    <string xmlns=\"%s\">Goodbye</string>
  </Texts>
  <To>fr-fr</To>
</TranslateArrayRequest>
""" % (ns, ns)

def TranslateArray ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = TranslateArray ()
print (result.decode("utf-8"))

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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/GetLanguageNames'

locale = 'en'
params = '?locale=' + locale

body = """
	<ArrayOfstring xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">
	  <string>en</string>
	  <string>fr</string>
	  <string>uk</string>
	</ArrayOfstring>
"""

def GetLanguageNames ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = GetLanguageNames ()
print (result.decode("utf-8"))
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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/GetLanguagesForTranslate'

params = ''

def GetLanguagesForTranslate ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = GetLanguagesForTranslate ()
print (result.decode("utf-8"))
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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/GetLanguagesForSpeak'

params = ''

def GetLanguagesForSpeak ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = GetLanguagesForSpeak ()
print (result.decode("utf-8"))
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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/Speak'

text = "Hello world"
language = "en-US"
output_path = "speak.wav"
params = "?text=" + urllib.parse.quote (text) + "&language=" + language

def Speak ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = Speak ()

f = open(output_path, 'wb')
f.write (result)
f.close

print ('File written.')
```

**Get spoken text response**

A successful response is returned as a .wav or .mp3 stream.

[Back to top](#HOLTop)

<a name="Detect"></a>

## Detect language

The following code identifies the language of the source text, using the [Detect](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Detect) method.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/Detect'

text = "Hello world"
params = "?text=" + urllib.parse.quote (text)

def Detect ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = Detect ()
print (result.decode("utf-8"))
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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/DetectArray'

params = ''

body = """
	<ArrayOfstring xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">
	  <string>Hello</string>
	  <string>Bonjour</string>
	  <string>Guten tag</string>
	</ArrayOfstring>
"""

def DetectArray ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = DetectArray ()
print (result.decode("utf-8"))

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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/AddTranslation'

originalText = "Hi there"
translatedText = "Salut"
from_language = "en-US"
to_language = "fr-fr"
user = "JohnDoe"

params = "?originalText=" + urllib.parse.quote (originalText) + "&translatedText=" + urllib.parse.quote (translatedText) + "&from=" + from_language + "&to=" + to_language + "&user=" + urllib.parse.quote (user)

def AddTranslation ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = AddTranslation ()
print (result.decode("utf-8"))
```

**Add translation response**

A successful response is simply returned as HTTP status code 200 (OK).

[Back to top](#HOLTop)

<a name="AddTranslationArray"></a>

## Add translation array

The following code adds an array of translations to the translation memory, using the [AddTranslationArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_AddTranslationArray) method. This is useful if you want to tailor the user's experience so they receive certain translations for given source texts.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/AddTranslationArray'

params = ''

from_language = "en-us"
to_language = "fr-fr"
original = "Hi there"
translation = "Salut"
user = "JohnDoe"

ns = "http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2"
# NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
body = """
	<AddtranslationsRequest>
	  <AppId />
	  <From>%s</From>
	  <Options>
	    <User xmlns=\"%s\">%s</User>
	  </Options>
	  <To>%s</To>
	  <Translations>
	    <Translation xmlns=\"%s\">
	      <OriginalText>%s</OriginalText>
	      <Rating>1</Rating>
	      <TranslatedText>%s</TranslatedText>
	    </Translation>
	  </Translations>
	</AddtranslationsRequest>
""" % (from_language, ns, user, to_language, ns, original, translation)

def AddTranslationArray ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = AddTranslationArray ()
print (result.decode("utf-8"))

```

**Add translation array response**

A successful response is simply returned as HTTP status code 200 (OK).

[Back to top](#HOLTop)

<a name="BreakSentences"></a>

## Break sentences

The following code breaks the source text into sentences, using the [BreakSentences](http://docs.microsofttranslator.com/text-translate.html#!/default/get_BreakSentences) method.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/BreakSentences'

text = "Here is a sentence. Here is another sentence. Here is a third sentence.";
language = "en-US";

params = "?text=" + urllib.parse.quote (text) + "&language=" + language

def BreakSentences ():

	headers = { 'Ocp-Apim-Subscription-Key': subscriptionKey }
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path + params, None, headers)
	response = conn.getresponse ()
	return response.read ()

result = BreakSentences ()
print (result.decode("utf-8"))
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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/GetTranslations'

from_language = "en-us"
to_language = "fr-fr"
text = "Hi there"
maxTranslations = "10"
params = "?from=" + from_language + "&to=" + to_language + "&maxTranslations=" + maxTranslations + "&text=" + urllib.parse.quote (text)

body = ''

def GetTranslations ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = GetTranslations ()
print (result.decode("utf-8"))

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

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.microsofttranslator.com'
path = '/V2/Http.svc/GetTranslationsArray'

params = ''

from_language = "en-us";
to_language = "fr-fr";

ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays"
# NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
body = """
	<GetTranslationsArrayRequest>
	  <AppId />
	  <From>%s</From>
	  <Texts>
	    <string xmlns=\"%s\">Hello</string>
	    <string xmlns=\"%s\">Goodbye</string>
	  </Texts>
	  <To>%s</To>
      <MaxTranslations>10</MaxTranslations>
	</GetTranslationsArrayRequest>
""" % (from_language, ns, ns, to_language)

def GetTranslationsArray ():

	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-type': 'text/xml'
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path + params, body, headers)
	response = conn.getresponse ()
	return response.read ()

result = GetTranslationsArray ()
print (result.decode("utf-8"))
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
