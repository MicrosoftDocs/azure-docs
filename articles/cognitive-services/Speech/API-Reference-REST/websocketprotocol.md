---
title: Bing Speech WebSocket Protocol | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Protocol documentation for Bing Speech based on WebSockets
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.subservice: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
ROBOTS: NOINDEX,NOFOLLOW
---
# Bing Speech WebSocket protocol

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

Bing Speech is a cloud-based platform that features the most advanced algorithms available for converting spoken audio to text. The Bing Speech protocol defines the [connection setup](#connection-establishment) between client applications and the service and the speech recognition messages exchanged between counterparts ([client-originated Messages](#client-originated-messages) and [service-originated messages](#service-originated-messages)). In addition, [telemetry messages](#telemetry-schema) and [error handling](#error-handling) are described.

## Connection establishment

The Speech Service protocol follows the WebSocket standard specification [IETF RFC 6455](https://tools.ietf.org/html/rfc6455). A WebSocket connection starts out as an HTTP request that contains HTTP headers that indicate the client's desire to upgrade the connection to a WebSocket instead of using HTTP semantics. The server indicates its willingness to participate in the WebSocket connection by returning an HTTP `101 Switching Protocols` response. After the exchange of this handshake, both client and service keep the socket open and begin using a message-based protocol to send and receive information.

To begin the WebSocket handshake, the client application sends an HTTPS GET request to the service. It includes standard WebSocket upgrade headers along with other headers that are specific to speech.

```HTTP
GET /speech/recognition/interactive/cognitiveservices/v1 HTTP/1.1
Host: speech.platform.bing.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Authorization: t=EwCIAgALBAAUWkziSCJKS1VkhugDegv7L0eAAJqBYKKTzpPZOeGk7RfZmdBhYY28jl&p=
X-ConnectionId: A140CAF92F71469FA41C72C7B5849253
Origin: https://speech.platform.bing.com
```

The service responds with:

```HTTP
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: upgrade
Sec-WebSocket-Key: 2PTTXbeeBXlrrUNsY15n01d/Pcc=
Set-Cookie: SpeechServiceToken=AAAAABAAWTC8ncb8COL; expires=Wed, 17 Aug 2016 15:39:06 GMT; domain=bing.com; path="/"
Date: Wed, 17 Aug 2016 15:03:52 GMT
```

All speech requests require the [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) encryption. The use of unencrypted speech requests is not supported. The following TLS version is supported:

* TLS 1.2

### Connection identifier

Speech Service requires that all clients include a unique ID to identify the connection. Clients *must* include the *X-ConnectionId* header when they start a WebSocket handshake. The *X-ConnectionId* header must be a [universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) (UUID) value. WebSocket upgrade requests that do not include the *X-ConnectionId*, do not specify a value for the *X-ConnectionId* header, or do not include a valid UUID value are rejected by the service with an HTTP `400 Bad Request` response.

### Authorization

In addition to the standard WebSocket handshake headers, speech requests require an *Authorization* header. Connection requests without this header are rejected by the service with an HTTP `403 Forbidden` response.

The *Authorization* header must contain a JSON Web Token (JWT) access token.

For information about how to subscribe and obtain API keys that are used to retrieve valid JWT access tokens, see the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page.

The API key is passed to the token service. For example:

``` HTTP
POST https://api.cognitive.microsoft.com/sts/v1.0/issueToken
Content-Length: 0
```

The following header information is required for token access.

| Name | Format | Description |
|----|----|----|
| Ocp-Apim-Subscription-Key | ASCII | Your subscription key |

The token service returns the JWT access token as `text/plain`. Then the JWT is passed as a `Base64 access_token` to the handshake as an *Authorization* header prefixed with the string `Bearer`. For example:

`Authorization: Bearer [Base64 access_token]`

### Cookies

Clients *must* support HTTP cookies as specified in [RFC 6265](https://tools.ietf.org/html/rfc6265).

### HTTP redirection

Clients *must* support the standard redirection mechanisms specified by the [HTTP protocol specification](https://www.w3.org/Protocols/rfc2616/rfc2616.html).

### Speech endpoints

Clients *must* use an appropriate endpoint of Speech Service. The endpoint is based on recognition mode and language. The table shows some examples.

| Mode | Path | Service URI |
| -----|-----|-----|
| Interactive | /speech/recognition/interactive/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| Conversation | /speech/recognition/conversation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US |
| Dictation | /speech/recognition/dictation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR |

For more information, see the [Service URI](../GetStarted/GetStartedREST.md#service-uri) page.

### Report connection problems

Clients should immediately report all problems encountered while making a connection. The message protocol for reporting failed connections is described in [Connection failure telemetry](#connection-failure-telemetry).

### Connection duration limitations

When compared with typical web service HTTP connections, WebSocket connections last a *long* time. Speech Service places limitations on the duration of the WebSocket connections to the service:

 * The maximum duration for any active WebSocket connection is 10 minutes. A connection is active if either the service or the client sends WebSocket messages over that connection. The service terminates the connection without warning when the limit is reached. Clients should develop user scenarios that do not require the connection to remain active at or near the maximum connection lifetime.

 * The maximum duration for any inactive WebSocket connection is 180 seconds. A connection is inactive if neither the service nor the client sent a WebSocket message over the connection. After the maximum inactive lifetime is reached, the service terminates the inactive WebSocket connection.

## Message types

After a WebSocket connection is established between the client and the service, both the client and the service can send messages. This section describes the format of these WebSocket messages.

[IETF RFC 6455](https://tools.ietf.org/html/rfc6455) specifies that WebSocket messages can transmit data by using either a text or a binary encoding. The two encodings use different on-the-wire formats. Each format is optimized for efficient encoding, transmission, and decoding of the message payload.

### Text WebSocket messages

Text WebSocket messages carry a payload of textual information that consists of a section of headers and a body separated by the familiar double-carriage-return newline pair used for HTTP messages. And, like HTTP messages, text WebSocket messages specify headers in *name: value* format separated by a single-carriage-return newline pair. Any text included in a text WebSocket message *must* use [UTF-8](https://tools.ietf.org/html/rfc3629) encoding.

Text WebSocket messages must specify a message path in the header *Path*. The value of this header must be one of the speech protocol message types defined later in this document.

### Binary WebSocket messages

Binary WebSocket messages carry a binary payload. In the Speech Service protocol, audio is transmitted to and received from the service by using binary WebSocket messages. All other messages are text WebSocket messages.

Like text WebSocket messages, binary WebSocket messages consist of a header and a body section. The first 2 bytes of the binary WebSocket message specify, in [big-endian](https://en.wikipedia.org/wiki/Endianness) order, the 16-bit integer size of the header section. The minimum header section size is 0 bytes. The maximum size is 8,192 bytes. The text in the headers of binary WebSocket messages *must* use [US-ASCII](https://tools.ietf.org/html/rfc20) encoding.

Headers in a binary WebSocket message are encoded in the same format as in text WebSocket messages. The *name:value* format is separated by a single-carriage-return newline pair. Binary WebSocket messages must specify a message path in the header *Path*. The value of this header must be one of the speech protocol message types defined later in this document.

Both text and binary WebSocket messages are used in the Speech Service protocol.

## Client-originated messages

After the connection is established, both the client and the service can start to send messages. This section describes the format and payload of messages that client applications send to Speech Service. The section [Service-originated messages](#service-originated-messages) presents the messages that originate in Speech Service and are sent to the client applications.

The main messages sent by the client to the services are `speech.config`, `audio`, and `telemetry` messages. Before we consider each message in detail, the common required message headers for all these messages are described.

### Required message headers

The following headers are required for all client-originated messages.

| Header | Value |
|----|----|
| Path | The message path as specified in this document |
| X-RequestId | UUID in "no-dash" format |
| X-Timestamp | Client UTC clock time stamp in ISO 8601 format |

#### X-RequestId header

Client-originated requests are uniquely identified by the *X-RequestId* message header. This header is required for all client-originated messages. The *X-RequestId* header value must be a UUID in "no-dash" form, for example, *123e4567e89b12d3a456426655440000*. It *cannot* be in the canonical form *123e4567-e89b-12d3-a456-426655440000*. Requests without an *X-RequestId* header or with a header value that uses the wrong format for UUIDs cause the service to terminate the WebSocket connection.

#### X-Timestamp header

Each message sent to Speech Service by a client application *must* include an *X-Timestamp* header. The value for this header is the time when the client sends the message. Requests without an *X-Timestamp* header or with a header value that uses the wrong format cause the service to terminate the WebSocket connection.

The *X-Timestamp* header value must be of the form 'yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffffffZ' where 'fffffff' is a fraction of a second. For example, '12.5' means '12 + 5/10 seconds' and '12.526' means '12 plus 526/1000 seconds'. This format complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and, unlike the standard HTTP *Date* header, it can provide millisecond resolution. Client applications might round time stamps to the nearest millisecond. Client applications need to ensure that the device clock accurately tracks time by using a [Network Time Protocol (NTP) server](https://en.wikipedia.org/wiki/Network_Time_Protocol).

### Message `speech.config`

Speech Service needs to know the characteristics of your application to provide the best possible speech recognition. The required characteristics data includes information about the device and OS that powers your application. You supply this information in the `speech.config` message.

Clients *must* send a `speech.config` message immediately after they establish the connection to Speech Service and before they send any `audio` messages. You need to send a `speech.config` message only once per connection.

| Field | Description |
|----|----|
| WebSocket message encoding | Text |
| Body | The payload as a JSON structure |

#### Required message headers

| Header name | Value |
|----|----|
| Path | `speech.config` |
| X-Timestamp | Client UTC clock time stamp in ISO 8601 format |
| Content-Type | application/json; charset=utf-8 |

As with all client-originated messages in the Speech Service protocol, the `speech.config` message *must* include an *X-Timestamp* header that records the client UTC clock time when the message was sent to the service. The `speech.config` message *does not* require an *X-RequestId* header because this message isn't associated with a particular speech request.

#### Message payload
The payload of the `speech.config` message is a JSON structure that contains information about the application. The following example shows this information. Client and device context information is included in the *context* element of the JSON structure.

```JSON
{
  "context": {
    "system": {
      "version": "2.0.12341",
    },
    "os": {
      "platform": "Linux",
      "name": "Debian",
      "version": "2.14324324"
    },
    "device": {
      "manufacturer": "Contoso",
      "model": "Fabrikan",
      "version": "7.341"
      }
    },
  }
}
```

##### System element

The system.version element of the `speech.config` message contains the version of the speech SDK software used by the client application or device. The value is in the form *major.minor.build.branch*. You can omit the *branch* component if it's not applicable.

##### OS element

| Field | Description | Usage |
|-|-|-|
| os.platform | The OS platform that hosts the application, for example, Windows, Android, iOS, or Linux |Required |
| os.name | The OS product name, for example, Debian or Windows 10 | Required |
| os.version | The version of the OS in the form *major.minor.build.branch* | Required |

##### Device element

| Field | Description | Usage |
|-|-|-|
| device.manufacturer | The device hardware manufacturer | Required |
| device.model | The device model | Required |
| device.version | The device software version provided by the device manufacturer. This value specifies a version of the device that can be tracked by the manufacturer. | Required |

### Message `audio`

Speech-enabled client applications send audio to Speech Service by converting the audio stream into a series of audio chunks. Each chunk of audio carries a segment of the spoken audio that's to be transcribed by the service. The maximum size of a single audio chunk is 8,192 bytes. Audio stream messages are *Binary WebSocket messages*.

Clients use the `audio` message to send an audio chunk to the service. Clients read audio from the microphone in chunks and send these chunks to Speech Service for transcription. The first `audio` message must contain a well-formed header that properly specifies that the audio conforms to one of the encoding formats supported by the service. Additional `audio` messages contain only the binary audio stream data read from the microphone.

Clients might optionally send an `audio` message with a zero-length body. This message tells the service that the client knows that the user stopped speaking, the utterance is finished, and the microphone is turned off.

Speech Service uses the first `audio` message that contains a unique request identifier to signal the start of a new request/response cycle or *turn*. After the service receives an `audio` message with a new request identifier, it discards any queued or unsent messages that are associated with any previous turn.

| Field | Description |
|-------------|----------------|
| WebSocket message encoding | Binary |
| Body | The binary data for the audio chunk. Maximum size is 8,192 bytes. |

#### Required message headers

The following headers are required for all `audio` messages.

| Header         |  Value     |
| ------------- | ---------------- |
| Path | `audio` |
| X-RequestId | UUID in "no-dash" format |
| X-Timestamp | Client UTC clock time stamp in ISO 8601 format |
| Content-Type | The audio content type. The type must be either *audio/x-wav* (PCM) or *audio/silk* (SILK). |

#### Supported audio encodings

This section describes the audio codecs supported by Speech Service.

##### PCM

Speech Service accepts uncompressed pulse code modulation (PCM) audio. Audio is sent to the service in [WAV](https://en.wikipedia.org/wiki/WAV) format, so the first audio chunk *must* contain a valid [Resource Interchange File Format](https://en.wikipedia.org/wiki/Resource_Interchange_File_Format) (RIFF) header. If a client initiates a turn with an audio chunk that does *not* include a valid RIFF header, the service rejects the request and terminates the WebSocket connection.

PCM audio *must* be sampled at 16 kHz with 16 bits per sample and one channel (*riff-16khz-16bit-mono-pcm*). Speech Service doesn't support stereo audio streams and rejects audio streams that do not use the specified bit rate, sample rate, or number of channels.

##### Opus

Opus is an open, royalty-free, highly versatile audio codec. Speech Service supports Opus at a constant bit rate of `32000` or `16000`. Only the `OGG` container for Opus is currently supported that is specified by the `audio/ogg` mime type.

To use Opus, modify the [JavaScript sample](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/master/samples/browser/Sample.html#L101) and change the `RecognizerSetup` method to return.

```javascript
return SDK.CreateRecognizerWithCustomAudioSource(
            recognizerConfig,
            authentication,
            new SDK.MicAudioSource(
                     new SDK.OpusRecorder(
                     {
                         mimeType: "audio/ogg",
                         bitsPerSecond: 32000
                     }
              )
          ));
```

#### Detect end of speech

Humans do not explicitly signal when they're finished speaking. Any application that accepts speech as input has two choices for handling the end of speech in an audio stream: service end-of-speech detection and client end-of-speech detection. Of these two choices, service end-of-speech detection usually provides a better user experience.

##### Service end-of-speech detection

To build the ideal hands-free speech experience, applications allow the service to detect when the user has finished speaking. Clients send audio from the microphone as *audio* chunks until the service detects silence and responds back with a `speech.endDetected` message.

##### Client end-of-speech detection

Client applications that allow the user to signal the end of speech in some way also can give the service that signal. For example, a client application might have a "Stop" or "Mute" button that the user can press. To signal end-of-speech, client applications send an *audio* chunk message with a zero-length body. Speech Service interprets this message as the end of the incoming audio stream.

### Message `telemetry`

Client applications *must* acknowledge the end of each turn by sending telemetry about the turn to Speech Service. Turn-end acknowledgment allows Speech Service to ensure that all messages necessary for completion of the request and its response were properly received by the client. Turn-end acknowledgment also allows Speech Service to verify that the client applications are performing as expected. This information is invaluable if you need help troubleshooting your speech-enabled application.

Clients must acknowledge the end of a turn by sending a `telemetry` message soon after receiving a `turn.end` message. Clients should attempt to acknowledge the `turn.end` as soon as possible. If a client application fails to acknowledge the turn end, Speech Service might terminate the connection with an error. Clients must send only one `telemetry` message for each request and response identified by the *X-RequestId* value.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `telemetry` |
| X-Timestamp | Client UTC clock time stamp in ISO 8601 format |
| Content-Type | `application/json` |
| Body | A JSON structure that contains client information about the turn |

The schema for the body of the `telemetry` message is defined in the [Telemetry schema](#telemetry-schema) section.

#### Telemetry for interrupted connections

If the network connection fails for any reason during a turn and the client does *not* receive a `turn.end` message from the service, the client sends a `telemetry` message. This message describes the failed request the next time the client makes a connection to the service. Clients do not have to immediately attempt a connection to send the `telemetry` message. The message might be buffered on the client and sent over a future user-requested connection. The `telemetry` message for the failed request *must* use the *X-RequestId* value from the failed request. It might be sent to the service as soon as a connection is established, without waiting to send or receive for other messages.

## Service-originated messages

This section describes the messages that originate in Speech Service and are sent to the client. Speech Service maintains a registry of client capabilities and generates the messages required by each client, so not all clients receive all the messages that are described here. For brevity, messages are referenced by the value of the *Path* header. For example, we refer to a WebSocket text message with the *Path* value `speech.hypothesis` as a speech.hypothesis message.

### Message `speech.startDetected`

The `speech.startDetected` message indicates that Speech Service detected speech in the audio stream.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `speech.startDetected` |
| Content-Type | application/json; charset=utf-8 |
| Body | The JSON structure that contains information about the conditions when the start of speech was detected. The *Offset* field in this structure specifies the offset (in 100-nanosecond units) when speech was detected in the audio stream, relative to the start of the stream. |

#### Sample message

```HTML
Path: speech.startDetected
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "Offset": 100000
}
```

### Message `speech.hypothesis`

During speech recognition, Speech Service periodically generates hypotheses about the words the service recognized. Speech Service sends these hypotheses to the client approximately every 300 milliseconds. The `speech.hypothesis` is suitable *only* for enhancing the user speech experience. You must not take any dependency on the content or accuracy of the text in these messages.

 The `speech.hypothesis` message is applicable to those clients that have some text rendering capability and want to provide near-real-time feedback of the in-progress recognition to the person who is speaking.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `speech.hypothesis` |
| X-RequestId | UUID in "no-dash" format |
| Content-Type | application/json |
| Body | The speech hypothesis JSON structure |

#### Sample message

```HTML
Path: speech.hypothesis
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "Text": "this is a speech hypothesis",
  "Offset": 0,
  "Duration": 23600000
}
```

The *Offset* element specifies the offset (in 100-nanosecond units) when the phrase was recognized, relative to the start of the audio stream.

The *Duration* element specifies the duration (in 100-nanosecond units) of this speech phrase.

Clients must not make any assumptions about the frequency, timing, or text contained in a speech hypothesis or the consistency of text in any two speech hypotheses. The hypotheses are just snapshots into the transcription process in the service. They do not represent a stable accumulation of transcription. For example, a first speech hypothesis might contain the words "fine fun," and the second hypothesis might contain the words "find funny." Speech Service doesn't perform any post-processing (for example, capitalization, punctuation) on the text in the speech hypothesis.

### Message `speech.phrase`

When Speech Service determines that it has enough information to produce a recognition result that won't change, the service produces a `speech.phrase` message. Speech Service produces these results after it detects that the user has finished a sentence or phrase.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `speech.phrase` |
| Content-Type | application/json |
| Body | The speech phrase JSON structure |

The speech phrase JSON schema includes the following fields: `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. For more information about these fields, see [Transcription responses](../concepts.md#transcription-responses).

#### Sample message

```HTML
Path: speech.phrase
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": 0,
  "Duration": 12300000
}
```

### Message `speech.endDetected`

The `speech.endDetected` message specifies that the client application should stop streaming audio to the service.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `speech.endDetected` |
| Body | The JSON structure that contains the offset when the end of speech was detected. The offset is represented in 100-nanosecond units offset from the start of audio that's used for recognition. |
| Content-Type | application/json; charset=utf-8 |

#### Sample message

```HTML
Path: speech.endDetected
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "Offset": 0
}
```

The *Offset* element specifies the offset (in 100-nanosecond units) when the phrase was recognized, relative to the start of the audio stream.

### Message `turn.start`

The `turn.start` signals the start of a turn from the perspective of the service. The `turn.start` message is always the first response message you receive for any request. If you don't receive a `turn.start` message, assume that the state of the service connection is invalid.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `turn.start` |
| Content-Type | application/json; charset=utf-8 |
| Body | JSON structure |

#### Sample message

```HTML
Path: turn.start
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "context": {
    "serviceTag": "7B33613B91714B32817815DC89633AFA"
  }
}
```

The body of the `turn.start` message is a JSON structure that contains context for the start of the turn. The *context* element contains a *serviceTag* property. This property specifies a tag value that the service has associated with the turn. This value can be used by Microsoft if you need help troubleshooting failures in your application.

### Message `turn.end`

The `turn.end` signals the end of a turn from the perspective of the service. The `turn.end` message is always the last response message you receive for any request. Clients can use the receipt of this message as a signal for cleanup activities and transitioning to an idle state. If you don't receive a `turn.end` message, assume that the state of the service connection is invalid. In those cases, close the existing connection to the service and reconnect.

| Field | Description |
| ------------- | ---------------- |
| WebSocket message encoding | Text |
| Path | `turn.end` |
| Body | None |

#### Sample message

```HTML
Path: turn.end
X-RequestId: 123e4567e89b12d3a456426655440000
```

## Telemetry schema

The body of the *telemetry* message is a JSON structure that contains client information about a turn or an attempted connection. The structure is made up of client time stamps that record when client events occur. Each time stamp must be in ISO 8601 format as described in the section titled "X-Timestamp header." *Telemetry* messages that do not specify all the required fields in the JSON structure or that do not use the correct time stamp format might cause the service to terminate the connection to the client. Clients *must* supply valid values for all required fields. Clients *should* supply values for optional fields whenever appropriate. The values shown in samples in this section are for illustration only.

Telemetry schema is divided into the following parts: received message time stamps and metrics. The format and usage of each part is specified in the following sections.

### Received message time stamps

Clients must include time-of-receipt values for all messages that they receive after successfully connecting to the service. These values must record the time when the client *received* each message from the network. The value should not record any other time. For example, the client should not record the time when it *acted* on the message. The received message time stamps are specified in an array of *name:value* pairs. The name of the pair specifies the *Path* value of the message. The value of the pair specifies the client time when the message was received. Or, if more than one message of the specified name was received, the value of the pair is an array of time stamps that indicates when those messages were received.

```JSON
  "ReceivedMessages": [
    { "speech.hypothesis": [ "2016-08-16T15:03:48.172Z", "2016-08-16T15:03:48.331Z", "2016-08-16T15:03:48.881Z" ] },
    { "speech.endDetected": "2016-08-16T15:03:49.721Z" },
    { "speech.phrase": "2016-08-16T15:03:50.001Z" },
    { "turn.end": "2016-08-16T15:03:51.021Z" }
  ]
```

Clients *must* acknowledge the receipt of all messages sent by the service by including time stamps for those messages in the JSON body. If a client fails to acknowledge the receipt of a message, the service might terminate the connection.

### Metrics

Clients must include information about events that occurred during the lifetime of a request. The following metrics are supported: `Connection`, `Microphone`, and `ListeningTrigger`.

### Metric `Connection`

The `Connection` metric specifies details about connection attempts by the client. The metric must include time stamps of when the WebSocket connection was started and finished. The `Connection` metric is required *only for the first turn of a connection*. Subsequent turns are not required to include this information. If a client makes multiple connection attempts before a connection is established, information about *all* the connection attempts should be included. For more information, see [Connection failure telemetry](#connection-failure-telemetry).

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | `Connection` | Required |
| Id | The connection identifier value that was used in the *X-ConnectionId* header for this connection request | Required |
| Start | The time when the client sent the connection request | Required |
| End | The time when the client received notification that the connection was established successfully or, in error cases, rejected, refused, or failed | Required |
| Error | A description of the error that occurred, if any. If the connection was successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

The error description should be at most 50 characters and ideally should be one of the values listed in the following table. If the error condition doesn't match one of these values, clients can use a succinct description of the error condition by using [CamelCasing](https://en.wikipedia.org/wiki/Camel_case) without white space. The ability to send a *telemetry* message requires a connection to the service, so only transient or temporary error conditions can be reported in the *telemetry* message. Error conditions that *permanently* block a client from establishing a connection to the service prevent the client from sending any message to the service, including *telemetry* messages.

| Error | Usage |
| ----- | ----- |
| DNSfailure | The client was unable to connect to the service because of a DNS failure in the network stack. |
| NoNetwork | The client attempted a connection, but the network stack reported that no physical network was available. |
| NoAuthorization | The client connection failed while attempting to acquire an authorization token for the connection. |
| NoResources | The client ran out of some local resource (for example, memory) while trying to make a connection. |
| Forbidden | The client was unable to connect to the service because the service returned an HTTP `403 Forbidden` status code on the WebSocket upgrade request. |
| Unauthorized | The client was unable to connect to the service because the service returned an HTTP `401 Unauthorized` status code on the WebSocket upgrade request. |
| BadRequest | The client was unable to connect to the service because the service returned an HTTP `400 Bad Request` status code on the WebSocket upgrade request. |
| ServerUnavailable | The client was unable to connect to the service because the service returned an HTTP `503 Server Unavailable` status code on the WebSocket upgrade request. |
| ServerError | The client was unable to connect to the service because the service returned an `HTTP 500` Internal Error status code on the WebSocket upgrade request. |
| Timeout | The client's connection request timed out without a response from the service. The *End* field contains the time when the client timed out and stopped waiting for the connection. |
| ClientError | The client terminated the connection because of some internal client error. |

### Metric `Microphone`

The `Microphone` metric is required for all speech turns. This metric measures the time on the client during which audio input is being actively used for a speech request.

Use the following examples as guidelines for recording *Start* time values for the `Microphone` metric in your client application:

* A client application requires that a user must press a physical button to start the microphone. After the button press, the client application reads the input from the microphone and sends it to Speech Service. The *Start* value for the `Microphone` metric records the time after the button push when the microphone is initialized and ready to provide input. The *End* value for the `Microphone` metric records the time when the client application stopped streaming audio to the service after it received the `speech.endDetected` message from the service.

* A client application uses a keyword spotter that is "always" listening. Only after the keyword spotter detects a spoken trigger phrase does the client application collect the input from the microphone and send it to Speech Service. The *Start* value for the `Microphone` metric records the time when the keyword spotter notified the client to start using input from the microphone. The *End* value for the `Microphone` metric records the time when the client application stopped streaming audio to the service after it received the `speech.endDetected` message from the service.

* A client application has access to a constant audio stream and performs silence/speech detection on that audio stream in a *speech detection module*. The *Start* value for the `Microphone` metric records the time when the *speech detection module* notified the client to start using input from the audio stream. The *End* value for the `Microphone` metric records the time when the client application stopped streaming audio to the service after it received the `speech.endDetected` message from the service.

* A client application is processing the second turn of a multi-turn request and is informed by a service response message to turn on the microphone to gather input for the second turn. The *Start* value for the `Microphone` metric records the time when the client application enables the microphone and starts using input from that audio source. The *End* value for the `Microphone` metric records the time when the client application stopped streaming audio to the service after it received the `speech.endDetected` message from the service.

The *End* time value for the `Microphone` metric records the time when the client application stopped streaming audio input. In most situations, this event occurs shortly after the client received the `speech.endDetected` message from the service. Client applications might verify that they're properly conforming to the protocol by ensuring that the *End* time value for the `Microphone` metric occurs later than the receipt time value for the `speech.endDetected` message. And, because there is usually a delay between the end of one turn and the start of another turn, clients might verify protocol conformance by ensuring that the *Start* time of the `Microphone` metric for any subsequent turn correctly records the time when the client *started* using the microphone to stream audio input to the service.

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | Microphone | Required |
| Start | The time when the client started using audio input from the microphone or other audio stream or received a trigger from the keyword spotter | Required |
| End | The time when the client stopped using the microphone or audio stream | Required |
| Error | A description of the error that occurred, if any. If the microphone operations were successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

### Metric `ListeningTrigger`
The `ListeningTrigger` metric measures the time when the user executes the action that initiates speech input. The `ListeningTrigger` metric is optional, but clients that can provide this metric are encouraged to do so.

Use the following examples as guidelines for recording *Start* and *End* time values for the `ListeningTrigger` metric in your client application.

* A client application requires that a user must press a physical button to start the microphone. The *Start* value for this metric records the time of the button push. The *End* value records the time when the button push finishes.

* A client application uses a keyword spotter that is "always" listening. After the keyword spotter detects a spoken trigger phrase, the client application reads the input from the microphone and sends it to Speech Service. The *Start* value for this metric records the time when the keyword spotter received audio that was then detected as the trigger phrase. The *End* value records the time when the last word of the trigger phrase was spoken by the user.

* A client application has access to a constant audio stream and performs silence/speech detection on that audio stream in a *speech detection module*. The *Start* value for this metric records the time that the *speech detection module* received audio that was then detected as speech. The *End* value records the time when the *speech detection module* detected speech.

* A client application is processing the second turn of a multi-turn request and is informed by a service response message to turn on the microphone to gather input for the second turn. The client application should *not* include a `ListeningTrigger` metric for this turn.

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | ListeningTrigger | Optional |
| Start | The time when the client listening trigger started | Required |
| End | The time when the client listening trigger finished | Required |
| Error | A description of the error that occurred, if any. If the trigger operation was successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

#### Sample message

The following sample shows a telemetry message with both ReceivedMessages and Metrics parts:

```HTML
Path: telemetry
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000
X-Timestamp: 2016-08-16T15:03:54.183Z

{
  "ReceivedMessages": [
    { "speech.hypothesis": [ "2016-08-16T15:03:48.171Z", "2016-08-16T15:03:48.331Z", "2016-08-16T15:03:48.881Z" ] },
    { "speech.endDetected": "2016-08-16T15:03:49.721Z" },
    { "speech.phrase": "2016-08-16T15:03:50.001Z" },
    { "turn.end": "2016-08-16T15:03:51.021Z" }
  ],
  "Metrics": [
    {
      "Name": "Connection",
      "Id": "A140CAF92F71469FA41C72C7B5849253",
      "Start": "2016-08-16T15:03:47.921Z",
      "End": "2016-08-16T15:03:48.000Z",
    },
    {
      "Name": "ListeningTrigger",
      "Start": "2016-08-16T15:03:48.776Z",
      "End": "2016-08-16T15:03:48.777Z",
    },
    {
      "Name": "Microphone",
      "Start": "2016-08-16T15:03:47.921Z",
      "End": "2016-08-16T15:03:51.921Z",
    },
  ],
}
```

## Error handling

This section describes the kinds of error messages and conditions that your application needs to handle.

### HTTP status codes

During the WebSocket upgrade request, Speech Service might return any of the standard HTTP status codes, such as `400 Bad Request`, etc. Your application must correctly handle these error conditions.

#### Authorization errors

If incorrect authorization is provided during the WebSocket upgrade, Speech Service returns an HTTP `403 Forbidden` status code. Among the conditions that can trigger this error code are:

* Missing *Authorization* header

* Invalid authorization token

* Expired authorization token

The `403 Forbidden` error message doesn't indicate a problem with Speech Service. This error message indicates a problem with the client application.

### Protocol violation errors

If Speech Service detects any protocol violations from a client, the service terminates the WebSocket connection after returning a *status code* and *reason* for the termination. Client applications can use this information to troubleshoot and fix the violations.

#### Incorrect message format

If a client sends a text or binary message to the service that is not encoded in the correct format given in this specification, the service closes the connection with a *1007 Invalid Payload Data* status code.

The service returns this status code for a variety of reasons, as shown in the following examples:

* "Incorrect message format. Binary message has invalid header size prefix." The client sent a binary message that has an invalid header size prefix.

* "Incorrect message format. Binary message has invalid header size." The client sent a binary message that specified an invalid header size.

* "Incorrect message format. Binary message headers decoding into UTF-8 failed." The client sent a binary message that contains headers that were not correctly encoded in UTF-8.

* "Incorrect message format. Text message contains no data." The client sent a text message that contains no body data.

* "Incorrect message format. Text message decoding into UTF-8 failed." The client sent a text message that was not correctly encoded in UTF-8.

* "Incorrect message format. Text message contains no header separator." The client sent a text message that did not contain a header separator or used the wrong header separator.

#### Missing or empty headers

If a client sends a message that doesn't have the required headers *X-RequestId* or *Path*, the service closes the connection with a *1002 Protocol Error* status code. The message is "Missing/Empty header. {Header name}."

#### RequestId values

If a client sends a message that specifies an *X-RequestId* header with an incorrect format, the service closes the connection and returns a *1002 Protocol Error* status. The message is "Invalid request. X-RequestId header value was not specified in no-dash UUID format."

#### Audio encoding errors

If a client sends an audio chunk that initiates a turn and the audio format or encoding doesn't conform to the required specification, the service closes the connection and returns a *1007 Invalid Payload Data* status code. The message indicates the format encoding error source.

#### RequestId reuse

After a turn is finished, if a client sends a message that reuses the request identifier from that turn, the service closes the connection and returns a *1002 Protocol Error* status code. The message is "Invalid request. Reuse of request identifiers is not allowed."

## Connection failure telemetry

To ensure the best possible user experience, clients must inform Speech Service of the time stamps for important checkpoints within a connection by using the *telemetry* message. It's equally important that clients inform the service of connections that were attempted but failed.

For each connection attempt that failed, clients create a *telemetry* message with a unique *X-RequestId* header value. Because the client was unable to establish a connection, the *ReceivedMessages* field in the JSON body can be omitted. Only the `Connection` entry in the *Metrics* field is included. This entry includes the start and end time stamps as well as the error condition that was encountered.

### Connection retries in telemetry

Clients should distinguish *retries* from *multiple connection attempts* by the event that triggers the connection attempt. Connection attempts that are carried out programmatically without any user input are retries. Multiple connection attempts that are carried out in response to user input are multiple connection attempts. Clients give each user-triggered connection attempt a unique *X-RequestId* and *telemetry* message. Clients reuse the *X-RequestId* for programmatic retries. If multiple retries were made for a single connection attempt, each retry attempt is included as a `Connection` entry in the *telemetry* message.

For example, suppose a user speaks the keyword trigger to start a connection and the first connection attempt fails because of DNS errors. However, a second attempt that is made programmatically by the client succeeds. Because the client retried the connection without requiring additional input from the user, the client uses a single *telemetry* message with multiple `Connection` entries to describe the connection.

As another example, suppose a user speaks the keyword trigger to start a connection and this connection attempt fails after three retries. The client then gives up, stops attempting to connect to the service, and informs the user that something went wrong. The user then speaks the keyword trigger again. This time, suppose the client connects to the service. After connecting, the client immediately sends a *telemetry* message to the service that contains three `Connection` entries that describe the connection failures. After receiving the `turn.end` message, the client sends another *telemetry* message that describes the successful connection.

## Error message reference

### HTTP status codes

| HTTP status code | Description | Troubleshooting |
| - | - | - |
| 400 Bad Request | The client sent a WebSocket connection request that was incorrect. | Check that you supplied all the required parameters and HTTP headers and that the values are correct. |
| 401 Unauthorized | The client did not include the required authorization information. | Check that you're sending the *Authorization* header in the WebSocket connection. |
| 403 Forbidden | The client sent authorization information, but it was invalid. | Check that you're not sending an expired or invalid value in the *Authorization* header. |
| 404 Not Found | The client attempted to access a URL path that is not supported. | Check that you're using the correct URL for the WebSocket connection. |
| 500 Server Error | The service encountered an internal error and could not satisfy the request. | In most cases, this error is transient. Retry the request. |
| 503 Service Unavailable | The service was unavailable to handle the request. | In most cases, this error is transient. Retry the request. |

### WebSocket error codes

| WebSocketsStatus code | Description | Troubleshooting |
| - | - | - |
| 1000 Normal Closure | The service closed the WebSocket connection without an error. | If the WebSocket closure was unexpected, reread the documentation to ensure that you understand how and when the service can terminate the WebSocket connection. |
| 1002 Protocol Error | The client failed to adhere to protocol requirements. | Ensure that you understand the protocol documentation and are clear about the requirements. Read the previous documentation about error reasons to see if you're violating protocol requirements. |
| 1007 Invalid Payload Data | The client sent an invalid payload in a protocol message. | Check the last message that you sent to the service for errors. Read the previous documentation about payload errors. |
| 1011 Server Error | The service encountered an internal error and could not satisfy the request. | In most cases, this error is transient. Retry the request. |

## Related topics

See a [JavaScript SDK](https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript) that is an implementation of the WebSocket-based Speech Service protocol.
