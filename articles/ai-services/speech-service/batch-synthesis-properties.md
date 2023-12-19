---
title: Batch synthesis properties for text to speech - Speech service
titleSuffix: Azure AI services
description: Learn about the batch synthesis properties for text to speech.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/16/2022
ms.author: eur
---

# Batch synthesis properties for text to speech

> [!IMPORTANT]
> The Batch synthesis API is currently in public preview. Once it's generally available, the Long Audio API will be deprecated. For more information, see [Migrate to batch synthesis API](migrate-to-batch-synthesis.md).

The Batch synthesis API (Preview) can synthesize a large volume of text input (long and short) asynchronously. Publishers and audio content platforms can create long audio content in a batch. For example: audio books, news articles, and documents. The batch synthesis API can create synthesized audio longer than 10 minutes.

Some properties in JSON format are required when you create a new batch synthesis job. Other properties are optional. The batch synthesis response includes other properties to provide information about the synthesis status and results. For example, the `outputs.result` property contains the location of the batch synthesis result files with audio output and logs.

## Batch synthesis properties

Batch synthesis properties are described in the following table.

| Property | Description |
|----------|-------------|
|`createdDateTime`|The date and time when the batch synthesis job was created.<br/><br/>This property is read-only.|
|`customProperties`|A custom set of optional batch synthesis configuration settings.<br/><br/>This property is stored for your convenience to associate the synthesis jobs that you created with the synthesis jobs that you get or list. This property is stored, but isn't used by the Speech service.<br/><br/>You can specify up to 10 custom properties as key and value pairs. The maximum allowed key length is 64 characters, and the maximum allowed value length is 256 characters.|
|`customVoices`|The map of a custom voice name and its deployment ID.<br/><br/>For example: `"customVoices": {"your-custom-voice-name": "502ac834-6537-4bc3-9fd6-140114daa66d"}`<br/><br/>You can use the voice name in your `synthesisConfig.voice` (when the `textType` is set to `"PlainText"`) or within the SSML text of `inputs` (when the `textType` is set to `"SSML"`).<br/><br/>This property is required to use a custom voice. If you try to use a custom voice that isn't defined here, the service returns an error.|
|`description`|The description of the batch synthesis.<br/><br/>This property is optional.|
|`displayName`|The name of the batch synthesis. Choose a name that you can refer to later. The display name doesn't have to be unique.<br/><br/>This property is required.|
|`id`|The batch synthesis job ID.<br/><br/>This property is read-only.|
|`inputs`|The plain text or SSML to be synthesized.<br/><br/>When the `textType` is set to `"PlainText"`, provide plain text as shown here: `"inputs": [{"text": "The rainbow has seven colors."}]`. When the `textType` is set to `"SSML"`, provide text in the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) as shown here: `"inputs": [{"text": "<speak version='\''1.0'\'' xml:lang='\''en-US'\''><voice xml:lang='\''en-US'\'' xml:gender='\''Female'\'' name='\''en-US-JennyNeural'\''>The rainbow has seven colors.</voice></speak>"}]`.<br/><br/>Include up to 1,000 text objects if you want multiple audio output files. Here's example input text that should be synthesized to two audio output files: `"inputs": [{"text": "synthesize this to a file"},{"text": "synthesize this to another file"}]`. However, if the `properties.concatenateResult` property is set to `true`, then each synthesized result will be written to the same audio output file.<br/><br/>You don't need separate text inputs for new paragraphs. Within any of the (up to 1,000) text inputs, you can specify new paragraphs using the "\r\n" (newline) string. Here's example input text with two paragraphs that should be synthesized to the same audio output file: `"inputs": [{"text": "synthesize this to a file\r\nsynthesize this to another paragraph in the same file"}]`<br/><br/>There are no paragraph limits, but keep in mind that the maximum JSON payload size (including all text inputs and other properties) that will be accepted is 500 kilobytes.<br/><br/>This property is required when you create a new batch synthesis job. This property isn't included in the response when you get the synthesis job.|
|`lastActionDateTime`|The most recent date and time when the `status` property value changed.<br/><br/>This property is read-only.|
|`outputs.result`|The location of the batch synthesis result files with audio output and logs.<br/><br/>This property is read-only.|
|`properties`|A defined set of optional batch synthesis configuration settings.|
|`properties.audioSize`|The audio output size in bytes.<br/><br/>This property is read-only.|
|`properties.billingDetails`|The number of words that were processed and billed by `customNeural` versus `neural` (prebuilt) voices.<br/><br/>This property is read-only.|
|`properties.concatenateResult`|Determines whether to concatenate the result. This optional `bool` value ("true" or "false") is "false" by default.|
|`properties.decompressOutputFiles`|Determines whether to unzip the synthesis result files in the destination container. This property can only be set when the `destinationContainerUrl` property is set or BYOS (Bring Your Own Storage) is configured for the Speech resource. This optional `bool` value ("true" or "false") is "false" by default.|
|`properties.destinationContainerUrl`|The batch synthesis results can be stored in a writable Azure container. If you don't specify a container URI with [shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) token, the Speech service stores the results in a container managed by Microsoft. SAS with stored access policies isn't supported. When the synthesis job is deleted, the result data is also deleted.<br/><br/>This optional property isn't included in the response when you get the synthesis job.|
|`properties.duration`|The audio output duration. The value is an ISO 8601 encoded duration.<br/><br/>This property is read-only.|
|`properties.durationInTicks`|The audio output duration in ticks.<br/><br/>This property is read-only.|
|`properties.failedAudioCount`|The count of batch synthesis inputs to audio output failed.<br/><br/>This property is read-only.|
|`properties.outputFormat`|The audio output format.<br/><br/>For information about the accepted values, see [audio output formats](rest-text-to-speech.md#audio-outputs). The default output format is `riff-24khz-16bit-mono-pcm`.|
|`properties.sentenceBoundaryEnabled`|Determines whether to generate sentence boundary data. This optional `bool` value ("true" or "false") is "false" by default.<br/><br/>If sentence boundary data is requested, then a corresponding `[nnnn].sentence.json` file will be included in the results data ZIP file.|
|`properties.succeededAudioCount`|The count of batch synthesis inputs to audio output succeeded.<br/><br/>This property is read-only.|
|`properties.timeToLive`|A duration after the synthesis job is created, when the synthesis results will be automatically deleted. The value is an ISO 8601 encoded duration. For example, specify `PT12H` for 12 hours. This optional setting is `P31D` (31 days) by default. The maximum time to live is 31 days. The date and time of automatic deletion (for synthesis jobs with a status of "Succeeded" or "Failed") is equal to the `lastActionDateTime` + `timeToLive` properties.<br/><br/>Otherwise, you can call the [delete](./batch-synthesis.md#delete-batch-synthesis) synthesis method to remove the job sooner.|
|`properties.wordBoundaryEnabled`|Determines whether to generate word boundary data. This optional `bool` value ("true" or "false") is "false" by default.<br/><br/>If word boundary data is requested, then a corresponding `[nnnn].word.json` file will be included in the results data ZIP file.|
|`status`|The batch synthesis processing status.<br/><br/>The status should progress from "NotStarted" to "Running", and finally to either "Succeeded" or "Failed".<br/><br/>This property is read-only.|
|`synthesisConfig`|The configuration settings to use for batch synthesis of plain text.<br/><br/>This property is only applicable when `textType` is set to `"PlainText"`.|
|`synthesisConfig.pitch`|The pitch of the audio output.<br/><br/>For information about the accepted values, see the [adjust prosody](speech-synthesis-markup-voice.md#adjust-prosody) table in the Speech Synthesis Markup Language (SSML) documentation. Invalid values are ignored.<br/><br/>This optional property is only applicable when `textType` is set to `"PlainText"`.|
|`synthesisConfig.rate`|The rate of the audio output.<br/><br/>For information about the accepted values, see the [adjust prosody](speech-synthesis-markup-voice.md#adjust-prosody) table in the Speech Synthesis Markup Language (SSML) documentation. Invalid values are ignored.<br/><br/>This optional property is only applicable when `textType` is set to `"PlainText"`.|
|`synthesisConfig.style`|For some voices, you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant.<br/><br/>For information about the available styles per voice, see [voice styles and roles](language-support.md?tabs=tts#voice-styles-and-roles).<br/><br/>This optional property is only applicable when `textType` is set to `"PlainText"`.|
|`synthesisConfig.voice`|The voice that speaks the audio output.<br/><br/>For information about the available prebuilt neural voices, see [language and voice support](language-support.md?tabs=tts). To use a custom voice, you must specify a valid custom voice and deployment ID mapping in the `customVoices` property.<br/><br/>This property is required when `textType` is set to `"PlainText"`.|
|`synthesisConfig.volume`|The volume of the audio output.<br/><br/>For information about the accepted values, see the [adjust prosody](speech-synthesis-markup-voice.md#adjust-prosody) table in the Speech Synthesis Markup Language (SSML) documentation. Invalid values are ignored.<br/><br/>This optional property is only applicable when `textType` is set to `"PlainText"`.|
|`textType`|Indicates whether the `inputs` text property should be plain text or SSML. The possible case-insensitive values are "PlainText" and "SSML". When the `textType` is set to `"PlainText"`, you must also set the `synthesisConfig` voice property.<br/><br/>This property is required.|
 
## Batch synthesis latency and best practices

When using batch synthesis for generating synthesized speech, it's important to consider the latency involved and follow best practices for achieving optimal results.

### Latency in batch synthesis

The latency in batch synthesis depends on various factors, including the complexity of the input text, the number of inputs in the batch, and the processing capabilities of the underlying hardware.

The latency for batch synthesis is as follows (approximately):

- The latency of 50% of the synthesized speech outputs is within 10-20 seconds.

- The latency of 95% of the synthesized speech outputs is within 120 seconds.

### Best practices

When considering batch synthesis for your application, it's recommended to assess whether the latency meets your requirements. If the latency aligns with your desired performance, batch synthesis can be a suitable choice. However, if the latency does not meet your needs, you might consider using real-time API.

## HTTP status codes

The section details the HTTP response codes and messages from the batch synthesis API.

### HTTP 200 OK

HTTP 200 OK indicates that the request was successful.

### HTTP 201 Created

HTTP 201 Created indicates that the create batch synthesis request (via HTTP POST) was successful.

### HTTP 204 error

An HTTP 204 error indicates that the request was successful, but the resource doesn't exist. For example:
- You tried to get or delete a synthesis job that doesn't exist. 
- You successfully deleted a synthesis job. 

### HTTP 400 error 

Here are examples that can result in the 400 error:
- The `outputFormat` is unsupported or invalid. Provide a valid format value, or leave `outputFormat` empty to use the default setting.
- The number of requested text inputs exceeded the limit of 1,000.
- The `top` query parameter exceeded the limit of 100.
- You tried to use an invalid deployment ID or a custom voice that isn't successfully deployed. Make sure the Speech resource has access to the custom voice, and the custom voice is successfully deployed. You must also ensure that the mapping of `{"your-custom-voice-name": "your-deployment-ID"}` is correct in your batch synthesis request.
- You tried to delete a batch synthesis job that hasn't started or hasn't completed running. You can only delete batch synthesis jobs that have a status of "Succeeded" or "Failed".
- You tried to use a *F0* Speech resource, but the region only supports the *Standard* Speech resource pricing tier. 
- You tried to create a new batch synthesis job that would exceed the limit of 200 active jobs. Each Speech resource can have up to 200 batch synthesis jobs that don't have a status of "Succeeded" or "Failed".

### HTTP 404 error

The specified entity can't be found. Make sure the synthesis ID is correct.

### HTTP 429 error
 
There are too many recent requests. Each client application can submit up to 50 requests per 5 seconds for each Speech resource. Reduce the number of requests per second.

You can check the rate limit and quota remaining via the HTTP headers as shown in the following example:

```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 2022-11-11T01:49:43Z
```

### HTTP 500 error

HTTP 500 Internal Server Error indicates that the request failed. The response body contains the error message.

### HTTP error example

Here's an example request that results in an HTTP 400 error, because the `top` query parameter is set to a value greater than 100.

```console
curl -v -X GET "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis?skip=0&top=200" -H "Ocp-Apim-Subscription-Key: YourSpeechKey"
```

In this case, the response headers will include `HTTP/1.1 400 Bad Request`.

The response body will resemble the following JSON example:

```json
{
  "code": "InvalidRequest",
  "message": "The top parameter should not be greater than 100.",
  "innerError": {
    "code": "InvalidParameter",
    "message": "The top parameter should not be greater than 100."
  }
}
```

## Next steps

- [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md)
- [Text to speech quickstart](get-started-text-to-speech.md)
- [Migrate to batch synthesis](migrate-to-batch-synthesis.md)
