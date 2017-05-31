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

# Use a custom speech-to-text endpoint
You can send requests to a Custom Speech Service speech-to-text endpoint, in a similar way as you can to the default Microsoft Cognitive Services speech endpoint. These endpoints are functionally identical to the default endpoints of the Speech API. Thus, the same functionality available via the client library or REST API for the Speech API is also the available for your custom endpoint.

The endpoints you create by using this service can process different numbers of concurrent requests, depending on the pricing tier your subscription is associated with. If too many requests are received, an error occurs. Note that in the free tier, there is a monthly limit of requests.

The service assumes that data is transmitted in real time. If it is sent faster, the request is considered running until its audio duration in real time has passed.

> [!NOTE]
> We **do not** support the [new Web Socket](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/api-reference-rest/websocketprotocol) yet. Please follow the instructions below in case you plan to use Web Sockets with custom speech endpoint.
>
> The new [REST API](https://docs.microsoft.com/en-us/azure/cognitive-services/speech/getstarted/getstartedrest) support is coming soon! If you plan to call your custom speech endpoint via HTTP follow the instructions below, please.
>

## Send requests by using the speech client library

To send requests to your custom endpoint by using the speech client library, start the recognition client. Use the Client Speech SDK from [nuget](http://nuget.org/). Search for "speech recognition" and select the speech recognition nuget from Microsoft for your platform. Some sample code can be found on [GitHub](https://github.com/Microsoft/Cognitive-Speech-STT-Windows). The Client Speech SDK provides a factory class _SpeechRecognitionServiceFactory_, which offers the following methods:

  *   ```CreateDataClient(...)```: A data recognition client.
  *   ```CreateDataClientWithIntent(...)```: A data recognition client with intent.
  *   ```CreateMicrophoneClient(...)```: A microphone recognition client.
  *   ```CreateMicrophoneClientWithIntent(...)```: A microphone recognition client with intent.

For detailed documentation, see the [Bing Speech API](https://www.microsoft.com/cognitive-services/Speech-api/documentation/GetStarted/GetStartedCSharpDesktop). The Custom Speech Service endpoints support the same SDK.

The data recognition client is appropriate for speech recognition from data, such as a file or other audio source. The microphone recognition client is appropriate for speech recognition from the microphone. The use of intent in either client can return structured intent results from the [Language Understanding Intelligent Service](https://www.luis.ai/) (LUIS), if you have built a LUIS application for your scenario.

All four types of clients can be instantiated in two ways. The first way uses the standard Cognitive Services Speech API. The second way allows you to specify a URL that corresponds to your custom endpoint created with the Custom Speech Service.

For example, you can create a **DataRecognitionClient** that sends requests to a custom endpoint by using the following method:

```csharp
public static DataRecognitionClient CreateDataClient(SpeeechRecognitionMode speechRecognitionMode, string language, string primaryOrSecondaryKey, **string url**);
```

The **your_subscriptionId** and **endpointURL** refer to the Subscription Key and the Web Sockets URL, respectively, on the **Deployment Information** page.

The **authenticationUri** is used to receive a token from the authentication service. This URI must be set separately, as shown in the following sample code.

This sample code shows how to use the client SDK:

```csharp
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
> When using **Create** methods in the SDK, you must provide the subscription ID twice. This is because of overloading of the **Create** methods.
>

The Custom Speech Service uses two different URLs for short form and long form recognition. Both are listed on the **Deployments** page. Use the correct endpoint URL for the specific form you want to use.

For more details about invoking the various recognition clients with your custom endpoint, see the [SpeechRecognitionServiceFactory](https://www.microsoft.com/cognitive-services/Speech-api/documentation/GetStarted/GetStartedCSharpDesktop) class. Note that the documentation on this page refers to acoustic model adaptation, but it applies to all endpoints created by using the Custom Speech Service.

## Send requests by using HTTP

Sending a request to your custom endpoint by using an HTTP post is similar to sending a request by HTTP to the Cognitive Services Bing Speech API. Modify the URL to reflect the address of your custom deployment.

There are some restrictions on requests sent via HTTP for both the Cognitive Services Speech endpoint, and the custom endpoints created with this service. The HTTP request cannot return partial results during the recognition process. Additionally, the duration of the requests is limited to 10 seconds for the audio content, and 14 seconds overall.

To create a post request, follow the same process you use for the Cognitive Services Speech API:

1.  Obtain an access token using your subscription ID. This is required to access the recognition endpoint, and can be reused for 10 minutes.

    ```
    curl -X POST --header "Ocp-Apim-Subscription-Key:<subscriptionId>" --data "" "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken"
    ```
      **subscriptionId** should be set to the Subscription ID you use for this deployment. The response is the plain token you need for the next request.

2.  Post audio to the endpoint by using POST again.

    ```
    curl -X POST --data-binary @example.wav -H "Authorization: Bearer <token>" -H "Content-Type: application/octet-stream" "<https_endpoint>"
    ```

    **token** is your access token you received with the previous call. **https_endpoint** is the full address of your custom speech-to-text endpoint, shown in the **Deployment Information** page.

For more information about HTTP post parameters and the response format, see the [Microsoft Cognitive Services Bing Speech HTTP API](https://www.microsoft.com/cognitive-services/speech-api/documentation/API-Reference-REST/BingVoiceRecognition#SampleImplementation).

## Next steps
* Improve accuracy with your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md).
* Improve accuracy with a [custom language model](cognitive-services-custom-speech-create-language-model.md).
