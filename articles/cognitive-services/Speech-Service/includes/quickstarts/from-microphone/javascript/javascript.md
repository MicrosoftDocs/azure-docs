---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 04/03/2020
ms.author: dapine
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create an Azure Speech resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md)
> * Make sure that you have access to a microphone for audio capture

## Create a new Website folder

Create a new, empty folder. In case you want to host the sample on a web server, make sure that the web server can access the folder.

## Unpack the Speech SDK for JavaScript into that folder

Download the Speech SDK as a [.zip package](https://aka.ms/csspeech/jsbrowserpackage) and unpack it into the newly created folder. This results in two files being unpacked, `microsoft.cognitiveservices.speech.sdk.bundle.js` and `microsoft.cognitiveservices.speech.sdk.bundle.js.map`.
The latter file is optional, and is useful for debugging into the SDK code.

## Create an index.html page

Create a new file in the folder, named `index.html` and open this file with a text editor.

1. Create the following HTML skeleton:

 [!code-html [SampleCode](~/samples-cognitive-services-speech-sdk/quickstart/javascript/browser/index-from-mic.html)]

## Create the token source (optional)

In case you want to host the web page on a web server, you can optionally provide a token source for your demo application.
That way, your subscription key will never leave your server while allowing users to use speech capabilities without entering any authorization code themselves.

Create a new file named `token.php`. In this example we assume your web server supports the PHP scripting language. Enter the following code:

```php
<?php
header('Access-Control-Allow-Origin: ' . $_SERVER['SERVER_NAME']);

// Replace with your own subscription key and service region (e.g., "westus").
$subscriptionKey = 'YourSubscriptionKey';
$region = 'YourServiceRegion';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://' . $region . '.api.cognitive.microsoft.com/sts/v1.0/issueToken');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{}');
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Ocp-Apim-Subscription-Key: ' . $subscriptionKey));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
echo curl_exec($ch);
?>
```

> [!NOTE]
> Authorization tokens only have a limited lifetime.
> This simplified example does not show how to refresh authorization tokens automatically. As a user, you can manually reload the page or hit F5 to refresh.

## Build and run the sample locally

To launch the app, double-click on the index.html file or open index.html with your favorite web browser. It will present a simple GUI allowing you to enter your subscription key and [region](../../../../regions.md) and trigger a recognition using the microphone.

> [!NOTE]
> This method doesn't work on the Safari browser.
> On Safari, the sample web page needs to be hosted on a web server; Safari doesn't allow websites loaded from a local file to use the microphone.

## Build and run the sample via a web server

To launch your app, open your favorite web browser and point it to the public URL that you host the folder on, enter your [region](../../../../regions.md), and trigger a recognition using the microphone. If configured, it will acquire a token from your token source.


## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]

