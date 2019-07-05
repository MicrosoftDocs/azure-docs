---
title: Webhooks - Speech Services
titlesuffix: Azure Cognitive Services
description: Webhooks are HTTP call backs ideal for optimizing your solution when dealing with long running processes like imports, adaptation, accuracy tests, or transcriptions of long running files.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: panosper
---

# Webhooks for Speech Services

Webhooks are like HTTP callbacks that allow your application to accept data from the Speech Services when it becomes available. Using webhooks, you can optimize your use of our REST APIs by eliminating the need to continuously poll for a response. In the next few sections, you'll learn how to use webhooks with the Speech Services.

## Supported operations

The Speech Services support webhooks for all long running operations. Each of the operations listed below can trigger an HTTP callback upon completion.

* DataImportCompletion
* ModelAdaptationCompletion
* AccuracyTestCompletion
* TranscriptionCompletion
* EndpointDeploymentCompletion
* EndpointDataCollectionCompletion

Next, let's create a webhook.

## Create a webhook

Let's create a webhook for an offline transcription. The scenario: a user has a long running audio file that they would like to transcribe asynchronously with the Batch Transcription API.

Webhooks can be created by making a
POST request to https://\<region\>.cris.ai/api/speechtotext/v2.1/transcriptions/hooks.

Configuration parameters for the request are provided as JSON:

```json
{
  "configuration": {
    "url": "https://your.callback.url/goes/here",
    "secret": "<my_secret>"
  },
  "events": [
    "TranscriptionCompletion"
  ],
  "active": true,
  "name": "TranscriptionCompletionWebHook",
  "description": "This is a Webhook created to trigger an HTTP POST request when my audio file transcription is completed.",
  "properties": {
      "Active" : "True"
  }

}
```
All POST requests to the Batch Transcription API require a `name`. The `description` and `properties` parameters are optional.

The `Active` property is used to switch calling back into your URL on and off without having to delete and re-create the webhook registration. If you only need to call back once after the process has complete, then delete the webhook and switch the `Active` property to false.

The event type `TranscriptionCompletion` is provided in the events array. It will call back to your endpoint when a transcription gets into a terminal state (`Succeeded` or `Failed`). When calling back to the registered URL, the request will contain an `X-MicrosoftSpeechServices-Event` header containing one of the registered event types. There is one request per registered event type.

There is one event type that you cannot subscribe to. It is the `Ping` event type. A request with this type is sent to the URL when finished creating a webhook when using the ping URL (see below).  

In the configuration, the `url` property is required. POST requests are sent to this URL. The `secret` is used to create a SHA256 hash of the payload, with the secret as an HMAC key. The hash is set as the `X-MicrosoftSpeechServices-Signature` header when calling back to the registered URL. This header is Base64 encoded.

This sample illustrates how to validate a payload using C#:

```csharp

private const string EventTypeHeaderName = "X-MicrosoftSpeechServices-Event";
private const string SignatureHeaderName = "X-MicrosoftSpeechServices-Signature";

[HttpPost]
public async Task<IActionResult> PostAsync([FromHeader(Name = EventTypeHeaderName)]WebHookEventType eventTypeHeader, [FromHeader(Name = SignatureHeaderName)]string signature)
{
    string body = string.Empty;
    using (var streamReader = new StreamReader(this.Request.Body))
    {
        body = await streamReader.ReadToEndAsync().ConfigureAwait(false);
        var secretBytes = Encoding.UTF8.GetBytes("my_secret");
        using (var hmacsha256 = new HMACSHA256(secretBytes))
        {
            var contentBytes = Encoding.UTF8.GetBytes(body);
            var contentHash = hmacsha256.ComputeHash(contentBytes);
            var storedHash = Convert.FromBase64String(signature);
            var validated = contentHash.SequenceEqual(storedHash);
        }
    }

    switch (eventTypeHeader)
    {
        case WebHookEventType.Ping:
            // Do your ping event related stuff here (or ignore this event)
            break;
        case WebHookEventType.TranscriptionCompletion:
            // Do your subscription related stuff here.
            break;
        default:
            break;
    }

    return this.Ok();
}

```
In this code snippet, the `secret` is decoded and validated. You'll also notice that the webhook event type has been switched. Currently there is one event per completed transcription. The code retries five times for each event (with a one second delay) before giving up.

### Other webhook operations

To get all registered webhooks:
GET https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks

To get one specific webhook:
GET https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id

To remove one specific webhook:
DELETE https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id

> [!Note]
> In the example above, the region is 'westus'. This should be replaced by the region where you've created your Speech Services resource in the Azure portal.

POST https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id/ping
Body: empty

Sends a POST request to the registered URL. The request contains an `X-MicrosoftSpeechServices-Event` header with a value ping. If the webhook was registered with a secret, it will contain an `X-MicrosoftSpeechServices-Signature` header with an SHA256 hash of the payload with the secret as HMAC key. The hash is Base64 encoded.

POST https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id/test
Body: empty

Sends a POST request to the registered URL if an entity for the subscribed event type (transcription) is present in the system and is in the appropriate state. The payload will be generated from the last entity that would have invoked the web hook. If no entity is present, the POST will respond with 204. If a test request can be made, it will respond with 200. The request body is of the same shape as in the GET request for a specific entity the web hook has subscribed for (for instance transcription). The request will have the `X-MicrosoftSpeechServices-Event` and `X-MicrosoftSpeechServices-Signature` headers as described before.

### Run a test

A quick test can be done using the website https://bin.webhookrelay.com. From there, you can obtain call back URLs to pass as parameter to the HTTP POST for creating a webhook described earlier in the document.

Click on 'Create Bucket' and follow the on-screen instructions to obtain a hook. Then use the information provided in this page to register the hook with the Speech service. The payload of a relay message – in response to the completion of a transcription – looks as follows:

```json
{
    "results": [],
    "recordingsUrls": [
        "my recording URL"
    ],
    "models": [
        {
            "modelKind": "AcousticAndLanguage",
            "datasets": [],
            "id": "a09c8c8b-1090-443c-895c-3b1cf442dec4",
            "createdDateTime": "2019-03-26T12:48:46Z",
            "lastActionDateTime": "2019-03-26T14:04:47Z",
            "status": "Succeeded",
            "locale": "en-US",
            "name": "v4.13 Unified",
            "description": "Unified",
            "properties": {
                "Purpose": "OnlineTranscription,BatchTranscription,LanguageAdaptation",
                "ModelClass": "unified-v4"
            }
        }
    ],
    "statusMessage": "None.",
    "id": "d41615e1-a60e-444b-b063-129649810b3a",
    "createdDateTime": "2019-04-16T09:35:51Z",
    "lastActionDateTime": "2019-04-16T09:38:09Z",
    "status": "Succeeded",
    "locale": "en-US",
    "name": "Simple transcription",
    "description": "Simple transcription description",
    "properties": {
        "PunctuationMode": "DictatedAndAutomatic",
        "ProfanityFilterMode": "Masked",
        "AddWordLevelTimestamps": "True",
        "AddSentiment": "True",
        "Duration": "00:00:02"
    }
}
```
The message contains the recording URL and models used to transcribe that recording.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
