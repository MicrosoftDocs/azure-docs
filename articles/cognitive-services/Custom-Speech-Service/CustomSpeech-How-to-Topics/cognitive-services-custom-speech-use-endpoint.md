---
title: Use a custom speech endpoint with Custom Speech Service on Azure | Microsoft Docs
description: Learn how to use a custom speech-to-text endpoint with the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Using a custom speech-to-text endpoint
Requests can be sent to a Custom Speech Service speech-to-text endpoint in a very similar manner as the default Microsoft Cognitive Services speech endpoint. Note that these endpoints are functionally identical to the default endpoints of the Speech API. Thus, the same functionality available via the client library or REST API for the Speech API is also the available for your custom endpoint.

Please note that the endpoints created via this service can process different numbers of concurrent requests depending on the tier the subscription is associated to. If more recognitions than that are requested, they will return the error code 429 (Too many requests). For more information, please visit the pricing information. In the free tier, there is a monthly limit of requests. If you exceed this limit, the service returns the error code 403 (Forbidden).

The service assumes that data is transmitted in real-time. If it is sent faster, the request is considered running until its audio duration in real-time has passed.

## Sending requests via the client library

To send requests to your custom endpoint using the speech client library, instantiate the recognition client using the Client Speech SDK from [nuget](http://nuget.org/) (search for "speech recognition" and select Microsoft's speech recognition nuget for your platform). Some sample code can be found [here](https://github.com/Microsoft/Cognitive-Speech-STT-Windows). The Client Speech SDK provides a factory class _SpeechRecognitionServiceFactory_ which offers 4 methods:

  *   ```CreateDataClient(...)```: A data recognition client
  *   ```CreateDataClientWithIntent(...)```: A data recognition client with intent
  *   ```CreateMicrophoneClient(...)```: A microphone recognition client
  *   ```CreateMicrophoneClientWithIntent(...)```: A microphone recognition client with intent

For detailed documentation please visit the [Bing Speech API](https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/GetStarted/GetStartedCSharpDesktop) documentation since the Custom Speech Service endpoints support the same SDK.

The data recognition client is appropriate for speech recognition from data, such as a file or other audio source. The microphone recognition client is appropriate for speech recognition from the microphone. The use of intent in either client can return structured intent results from the [Language Understanding Intelligent Service](https://www.luis.ai/) (LUIS) if you have built a LUIS application for your scenario.

All four types of clients can be instantiated in two ways. The first will utilize the standard Microsoft Cognitive Services Speech API, and the second allows you to specify a URL that corresponds to your custom endpoint created with the Custom Speech Service.

For example, a DataRecognitionClient that will send requests to a custom endpoint can be created using the following method.

```
public static DataRecognitionClient CreateDataClient(SpeeechRecognitionMode speechRecognitionMode, string language, string primaryOrSecondaryKey, **string url**);
```

The your_subscriptionId and endpointURL refer to the Subscription Key and the Web Sockets URL shown on the Deployment Information page, respectively.

The authenticationUri is used to receive a token from the authentication service. This Uri must be set separately as provided in the sample code below.

Here is some sample code showing how to use the client SDK:

```
var dataClient = SpeechRecognitionServiceFactory.CreateDataClient(
  SpeechRecognitionMode.LongDictation,
  "en-us",
  "your_subscriptionId",
  "your_subscriptionId",
  "endpointURL");
// set the authorization Uri
dataClient.AuthenticationUri = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
```

> [!NOTE]
> When using Create methods in the SDK you must provide the subscription id twice. This is because of overloading of the Create methods.
>

Also, note that the Custom Speech Service uses two different URLs for short form and long form recognition, both listed on the "Deployments" page. Please use the correct endpoint URL for the specific form you want to use.

More details on invoking the various recognition clients with your custom endpoint can be found on the MSDN page describing the [SpeechRecognitionServiceFactory](https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/GetStarted/GetStartedCSharpDesktop) class. Note that the documentation on this page refers to Acoustic Model adaptation but it applies to all endpoints created via the Custom Speech Service.

## Sending requests via HTTP

Sending a request to your custom endpoint via HTTP post is similar to sending a request by HTTP to the Microsoft Cognitive Services Bing Speech API, except the URL needs to be modified to reflect the address of your custom deployment.

Note that there are some restrictions on requests sent via HTTP for both the Microsoft Cognitive Services Speech endpoint and custom endpoints created with this service. The HTTP request cannot return partial results during the recognition process. Additionally, the duration of the requests is limited to 10 seconds for the audio content and 14 seconds overall.

To create a POST request, the same process used for the Microsoft Cognitive Services Speech API must be followed. It consists of the following two steps:

1.  Obtain an access token using your subscription id. This is required to access the recognition endpoint and can be reused for ten minutes.

```
curl -X POST --header "Ocp-Apim-Subscription-Key:<subscriptionId>" --data "" "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken"
```
  where **subscriptionId** should be set to the Subscription Id you use for this deployment. The response is the plain token you need for the next request.

2.  Post audio to the endpoint using POST again:

```
curl -X POST --data-binary @@example.wav -H "Authorization: Bearer <token>" -H "Content-Type: application/octet-stream" "<https_endpoint>"
```

  where **token** is your access token you have received with the previous call and **https_endpoint** is the full address of your custom speech-to-text endpoint shown in the Deployment Information page.

  Please refer to documentation on the [Microsoft Cognitive Services Bing Speech HTTP API](https://www.microsoft.com/cognitive-services/en-us/speech-api/documentation/API-Reference-REST/BingVoiceRecognition#SampleImplementation) for more information about HTTP post parameters and the response format.

## Next steps
* Improve accuracy with your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md)
* Improve accuracy with a [custom language model](cognitive-services-custom-speech-create-language-model.md)
