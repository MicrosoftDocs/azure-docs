titlesuffix: Azure Cognitive Services
description: Webhooks are HTTP call backs ideal for optimizing your solution when dealing with long running processes like imports, adaptation, accuracy tests or transcritpion of long running files.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 4/11/2019
ms.author: panosper
ms.custom: seodec18
---

# Web hooks

Web hooks are essentially http call backs which can be used to optimize the use of our REST APIs. In this page we explain how to use them.

## Supported Operations

Our service supports web hooks for all long running operations. Each of the operations listed below can trigger an http call back upon completion. The respective operations (event types) are:

        DataImportCompletion
        ModelAdaptationCompletion
        AccuracyTestCompletion
        TranscriptionCompletion
        EndpointDeploymentCompletion
        EndpointDataCollectionCompletion

Let's see how you create a web hook.

## Creating a web hook

Let's see how you create a web hook for an offline transcription. The scenario being the end user has a long audio file to asynchronously transcribe using our Batch Transcritpion API.

Configuration parameters are provided as JSON:

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
  "description": "This is a Web hook created to trigger an HTTP POST request when my audio file transcription is completed.",
  "properties": {
      "Active" : "True"
  }

}
```
As in all our HTTP POST requests the name is compulsory while description and properties are optional. 

The 'Active' property is used to switch calling back into your URL on and off without having to delete and re-create the web hook registration. IF you are looking to be called once when the is completed then Delete the webhook and switch the 'Active' property to false.

The event type TranscriptionCompletion is provided in the events arrray. It will call your Endpoint back when a transcription gets into a terminal state (Succeeded or Failed). When calling back into the registered URL, the request will contain a X-MicrosoftSpeechServices-Event header containing one of the registered event types. There will be one request per registered event type. 

There is one additional event type that you cannot subscribe to. It is the Ping event type and a request with that type is sent to the URL when finishing to create the web hook and when using the ping URL (see below). 

In the configuration the url property is required. It is the URL, the POST requests will be sent to, once the event triggers. The secret will be used to create a SHA256 hash of the payload with the secret as HMAC key. This hash will be set as X-MicrosoftSpeechServices-Signature header when calling back into the registered URL. It is Base64 encoded. 

Look at the sample C# code that shows how to validate the payload. 

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
In the above code snippet we decode the secret and validate it. In addition we switch on the web hook event type.

Currently there is one event per completed transcription.

We are retrying 5 times for each event (with a delay of 1s) before we give up.

### Other Web Hook operations

To get all registered web hooks
GET https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks

To get one specific web hook
GET https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id

To remove one specific web hook
DELETE https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id

Note that in the example above the region is 'westus'. This should be replaced by the region for which your create your Speech resource in the Azure portal.

POST https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id/ping
Body: empty

Sends a POST request to the registered URL. The request will contain a X-MicrosoftSpeechServices-Event header with the value ping. If the web hook was registered with a secret it will contain a X-MicrosoftSpeechServices-Signature header with an SHA256 hash of the payload with the secret as HMAC key. The hash is base64 encoded. The request body is of the same shape as in the GET request for a specific hook.

POST https://westus.cris.ai/api/speechtotext/v2.1/transcriptions/hooks/:id/test
Body: empty

Sends a POST request to the registered URL, if an entity for the subscribed event type (transcription) is present in the system and in the appropriate state. The payload will be generated from the last entity that would have invoked the web hook. If no entity is present, the POST will respond with 204. If a test request can be made, it will respond with 200. The request body is of the same shape as in the GET request for a specific entity the web hook has subscribed for (for instance transcription). The request will have the X-MicrosoftSpeechServices-Event and X-MicrosoftSpeechServices-Signature headers as described before.

### Testing

A quick test can be done using the website https://bin.webhookrelay.com. From there you can obtain call back URLs to pass as parameter to the HTTP POST for creating a web hook described earlier in the document.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
