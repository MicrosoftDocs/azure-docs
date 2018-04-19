---
title: Ruby Quickstart for Azure Cognitive Services, Microsoft Translator Text API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: Jann-Skotdal
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 09/14/2017
ms.author: v-jansko
---
# Quickstart for Microsoft Translator Text API with Ruby 
<a name="HOLTop"></a>

This article shows you how to use the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method to translate text from one language to another. For information on how to use the other Translator Text APIs, see [this Github repository](https://github.com/MicrosoftTranslator/Translator-Text-API-Quickstarts/tree/master/Ruby).

## Prerequisites

You will need [Ruby 2.4](https://www.ruby-lang.org/en/downloads/) or later to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method.

1. Create a new Ruby project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```ruby
require 'net/https'
require 'uri'
require 'cgi'

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the key string value with your valid subscription key.
key = 'ENTER KEY HERE'

host = 'https://api.microsofttranslator.com'
path = '/V2/Http.svc/Translate'

target = 'fr-fr'
text = 'Hello'

params = '?to=' + target + '&text=' + CGI.escape(text)
uri = URI (host + path + params)

request = Net::HTTP::Get.new(uri)
request['Ocp-Apim-Subscription-Key'] = key

response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
    http.request (request)
end

puts response.body
```

**Translate response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Salut</string>
```

## Next steps

> [!div class="nextstepaction"]
> [Translator Text tutorial](../tutorial-wpf-translation-csharp.md)

## See also 

[Translator Text overview](../translator-info-overview.md)</br>
[API Reference](http://docs.microsofttranslator.com/text-translate.html)
