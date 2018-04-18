---
title: PHP Quickstart for Azure Cognitive Services, Text Analytics API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Text Analytics API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: luiscabrer

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/24/2017
ms.author: luisca

---
# Quickstart for Text Analytics API with PHP 
<a name="HOLTop"></a>

This article shows you how to [detect language](#Detect), [analyze sentiment](#SentimentAnalysis), and [extract key phrases](#KeyPhraseExtraction) using the [Text Analytics APIs](//go.microsoft.com/fwlink/?LinkID=759711) with PHP.

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Text Analytics API**. You can use the **free tier for 5,000 transactions/month** to complete this quickstart.

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign up. 

<a name="Detect"></a>

## Detect language

The Language Detection API detects the language of a text document, using the [Detect Language method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7).

1. Create a new PHP project in your favorite IDE.
2. Add the code provided below.
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Replace the location in `host` (currently `westus`) to the region you signed up for.
5. Run the program.

```php
<?php

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
$accessKey = 'enter key here';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
$host = 'https://westus.api.cognitive.microsoft.com';
$path = '/text/analytics/v2.0/languages';

function DetectLanguage ($host, $path, $key, $data) {

	$headers = "Content-type: text/json\r\n" .
		"Ocp-Apim-Subscription-Key: $key\r\n";

	$data = json_encode ($data);

	// NOTE: Use the key 'http' even if you are making an HTTPS request. See:
	// http://php.net/manual/en/function.stream-context-create.php
	$options = array (
		'http' => array (
			'header' => $headers,
			'method' => 'POST',
			'content' => $data
		)
	);
	$context  = stream_context_create ($options);
	$result = file_get_contents ($host . $path, false, $context);
	return $result;
}

$data = array (
	'documents' => array (
		array ( 'id' => '1', 'text' => 'This is a document written in English.' ),
		array ( 'id' => '2', 'text' => 'Este es un document escrito en Español.' ),
		array ( 'id' => '3', 'text' => '这是一个用中文写的文件')
	)
);

print "Please wait a moment for the results to appear.";

$result = DetectLanguage ($host, $path, $accessKey, $data);

echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
?>
```

**Language detection response**

A successful response is returned in JSON, as shown in the following example: 

```json

{
   "documents": [
      {
         "id": "1",
         "detectedLanguages": [
            {
               "name": "English",
               "iso6391Name": "en",
               "score": 1.0
            }
         ]
      },
      {
         "id": "2",
         "detectedLanguages": [
            {
               "name": "Spanish",
               "iso6391Name": "es",
               "score": 1.0
            }
         ]
      },
      {
         "id": "3",
         "detectedLanguages": [
            {
               "name": "Chinese_Simplified",
               "iso6391Name": "zh_chs",
               "score": 1.0
            }
         ]
      }
   ],
   "errors": [

   ]
}


```
<a name="SentimentAnalysis"></a>

## Analyze sentiment

The Sentiment Analysis API detexts the sentiment of a set of text records, using the [Sentiment method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9). The following example scores two documents, one in English and another in Spanish.

1. Create a new PHP project in your favorite IDE.
2. Add the code provided below.
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Replace the location in `host` (currently `westus`) to the region you signed up for.
5. Run the program.

```php
<?php

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
$accessKey = 'enter key here';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
$host = 'https://westus.api.cognitive.microsoft.com';
$path = '/text/analytics/v2.0/sentiment';

function GetSentiment ($host, $path, $key, $data) {

	$headers = "Content-type: text/json\r\n" .
		"Ocp-Apim-Subscription-Key: $key\r\n";

	$data = json_encode ($data);

	// NOTE: Use the key 'http' even if you are making an HTTPS request. See:
	// http://php.net/manual/en/function.stream-context-create.php
	$options = array (
		'http' => array (
			'header' => $headers,
			'method' => 'POST',
			'content' => $data
		)
	);
	$context  = stream_context_create ($options);
	$result = file_get_contents ($host . $path, false, $context);
	return $result;
}

$data = array (
	'documents' => array (
		array ( 'id' => '1', 'language' => 'en', 'text' => 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' ),
		array ( 'id' => '2', 'language' => 'es', 'text' => 'Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico.' )
	)
);

print "Please wait a moment for the results to appear.";

$result = GetSentiment ($host, $path, $accessKey, $data);

echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
?>
```

**Sentiment analysis response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "documents": [
      {
         "score": 0.99984133243560791,
         "id": "1"
      },
      {
         "score": 0.024017512798309326,
         "id": "2"
      },
   ],
   "errors": [   ]
}
```

<a name="KeyPhraseExtraction"></a>

## Extract key phrases

The Key Phrase Extraction API extracts key-phrases from a text document, using the [Key Phrases method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6). The following example extracts key phrases for both English and Spanish documents.

1. Create a new PHP project in your favorite IDE.
2. Add the code provided below.
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Replace the location in `host` (currently `westus`) to the region you signed up for.
5. Run the program.

```php
<?php

// NOTE: Be sure to uncomment the following line in your php.ini file.
// ;extension=php_openssl.dll

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
$accessKey = 'enter key here';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
$host = 'https://westus.api.cognitive.microsoft.com';
$path = '/text/analytics/v2.0/keyPhrases';

function GetKeyPhrases ($host, $path, $key, $data) {

	$headers = "Content-type: text/json\r\n" .
		"Ocp-Apim-Subscription-Key: $key\r\n";

	$data = json_encode ($data);

	// NOTE: Use the key 'http' even if you are making an HTTPS request. See:
	// http://php.net/manual/en/function.stream-context-create.php
	$options = array (
		'http' => array (
			'header' => $headers,
			'method' => 'POST',
			'content' => $data
		)
	);
	$context  = stream_context_create ($options);
	$result = file_get_contents ($host . $path, false, $context);
	return $result;
}

$data = array (
	'documents' => array (
		array ( 'id' => '1', 'language' => 'en', 'text' => 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' ),
		array ( 'id' => '2', 'language' => 'es', 'text' => 'Si usted quiere comunicarse con Carlos, usted debe de llamarlo a su telefono movil. Carlos es muy responsable, pero necesita recibir una notificacion si hay algun problema.' ),
		array ( 'id' => '3', 'language' => 'en', 'text' => 'The Grand Hotel is a new hotel in the center of Seattle. It earned 5 stars in my review, and has the classiest decor I\'ve ever seen.' )
	)
);

print "Please wait a moment for the results to appear.";

$result = GetKeyPhrases ($host, $path, $accessKey, $data);

echo json_encode (json_decode ($result), JSON_PRETTY_PRINT);
?>

```

**Key phrase extraction response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "documents": [
      {
         "keyPhrases": [
            "HDR resolution",
            "new XBox",
            "clean look"
         ],
         "id": "1"
      },
      {
         "keyPhrases": [
            "Carlos",
            "notificacion",
            "algun problema",
            "telefono movil"
         ],
         "id": "2"
      },
      {
         "keyPhrases": [
            "new hotel",
            "Grand Hotel",
            "review",
            "center of Seattle",
            "classiest decor",
            "stars"
         ],
         "id": "3"
      }
   ],
   "errors": [  ]
}
```


## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
