---
title: Speech Protocol in Microsoft Azure Cognitive Services | Microsoft Docs
description: Protocol documentation for Speech based on websockets
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 02/28/2017
ms.author: prrajan
---
# Speech Protocol

Microsoft's Speech Service uses a [web socket](https://en.wikipedia.org/wiki/WebSocket) to receive audio and return 
transcription responses over a single TCP connection. A web socket connection starts out as an HTTP request that contain
HTTP headers indicating the client's desire to upgrade the connection to a web socket instead of using HTTP semantics;
the server indicates its willingness to participate in the web socket connection by returning an HTTP 101 response.
After the exchange of this handshake, both client and service keep the socket open and begin using a message-based
protocol to send and receive information.

# Connection Protocol

Connections to the Microsoft Speech Service require a web socket that conforms to [IETF RFC 6455](https://tools.ietf.org/html/rfc6455); 
the Microsoft Speech Service connection protocol follows that web socket standard specification. 

Connections require a web socket handshake. To begin this handshake, the client application sends an HTTPS GET request to the 
service and includes standard web socket upgrade headers along with other headers that are specific to speech. 

```HTTP
GET /speech/recognize/interactive/cognitiveservices/v1 HTTP/1.1
Host: speech.platform.bing.com
Upgrade: websocket
Connection: Upgrade
ProtoSec-WebSocket-Key: wPEE5FzwR6mxpsslyRRpgP==
Sec-WebSocket-Version: 13
Authorization: t=EwCIAgALBAAUWkziSCJKS1VkhugDegv7L0eAAJqBYKKTzpPZOeGk7RfZmdBhYY28jl&p=
X-ConnectionId: A140CAF92F71469FA41C72C7B5849253  
Origin: https://speech.platform.bing.com
```
The service responds with
```HTTP
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: upgrade
Sec-WebSocket-Key: 2PTTXbeeBXlrrUNsY15n01d/Pcc=
Set-Cookie: SpeechServiceToken=AAAAABAAWTC8ncb8COL; expires=Wed, 17 Aug 2016 15:39:06 GMT; domain=bing.com; path="/"
Date: Wed, 17 Aug 2016 15:03:52 GMT
```

All speech requests require the [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) encryption; the use of unencrypted speech 
requests is not supported. The following TLS versions are supported:
* TLS 1.2

## Connection Identifier

The Microsoft Speech Service requires that all clients include a unique id to identify the connection. Clients **must** include the *X-ConnectionId* header when
starting a web socket handshake. The *X-ConnectionId* header value must be a [universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier).
Web socket upgrade requests that do not include the *X-ConnectionId*, that do not specify a value for the *X-ConnectionId* header, or that do not 
include a valid [universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) value will be rejected by the service with a 400 Bad Request response.
 
## Authorization 

In addition to the standard web socket handshake headers, speech requests require an *Authorization* header. Connection requests without this header are rejected 
by the service with a 403 Forbidden HTTP response.

## Cookies

Clients **must** support HTTP cookies as specified in [RFC 6265](https://tools.ietf.org/html/rfc6265).

## HTTP Redirection

Clients **must** support the standard redirection mechanisms specified by the [HTTP protocol specification](http://www.w3.org/Protocols/rfc2616/rfc2616.html).

## Speech Endpoint

Clients **must** use a path to the Microsoft Speech Service as outlined in [Endpoints](BingVoiceRecognition.md#endpoints).

## Reporting Connection Errors

Clients should report all problems and error encountered while making a connection immediately after they next successfully establish a connection. The message
protocol for reporting the failed connections is described in the section titled "Connection Failure Telemetry" later in this document.  

## Connection Duration Limitations

When compared with typical web service HTTP connections, web socket connections last a *long* time. The Microsoft Speech Service does, however, place limitations on
the duration of the web socket connections to the service. 
 * The maximum duration for any active web socket connection is 10 minutes. A connection is active if either the service or the client is sending web socket messages over that
 connection. The service will terminate the connection without warning once the limit has been reached. Clients should develop user scenarios that do not require the connection
 to remain active at or near the maximum connection lifetime.
 * The maximum duration for any inactive web socket connection is 180 seconds. A connection is inactive if neither the service nor the client has sent any web socket message over
 the connection. The service will terminate the inactive web socket connection after the maximum inactive lifetime is reached.

# Web Socket Messages

Once a web socket connection is established between the client and the service, both the client and the service may begin 
sending messages. This section describes the format of these web socket messages.

[IETF RFC 6455](https://tools.ietf.org/html/rfc6455) specifies that web socket messages can transmit data using either a text 
or a binary encoding. The two encodings use different on-the-wire formats. Each format is optimized for efficient encoding, 
transmission and decoding of the message payload.

### Text Web Socket Messages
Text web socket messages carry a payload of textual information consisting of a section of headers and a body separated 
by the familiar double carriage-return-newline pair used for HTTP messages. And, like HTTP messages, text web socket messages 
specify headers in *name:value* format separated by a single carriage-return-newline pair. Any text included in a text web socket
message **must** use [UTF-8](https://tools.ietf.org/html/rfc3629) encoding.

Text web socket messages must specify a message path in the header *Path*. The value of this header must be one of 
the speech protocol message types defined later in this document.

### Binary Web Socket Messages
Binary web socket messages carry a binary payload. In the Microsoft Speech Service protocol, audio is transmitted to 
and received from the service using binary web socket messages; all other messages are text web socket messages. 

Like text web socket messages, binary web socket messages consist of a header and a body section. The first two bytes 
of the binary web socket message specify, in [big-endian](https://en.wikipedia.org/wiki/Endianness) order, the 16-bit integer size of the header section. 
The minimum header section size is 0 bytes; the maximum size is 8192 bytes. The text in the headers of binary web socket
messages **must** use [US-ASCII](https://tools.ietf.org/html/rfc20) encoding.

Headers in a binary web socket message are encoded in the same format as in text web socket messages, in *name:value* format 
separated by a single carriage-return-newline pair. Binary web socket messages must specify a message path in the header *Path*.
The value of this header must be one of the speech protocol message types defined later in this document.

#	Speech Protocol
This section describes the web socket message types that make up the protocol for Microsoft Speech Service requests.

# Client-Originated Message Types
The following section describes the format and payload of messages that client applications send to the service. 

## Required Message Headers

The following headers are required for all client-originated messages.

| Header         |  Value     |
| ------------- | ---------------- |
| Path | The message path as specified in this document |
| X-RequestId | [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) in "no-dash" format |
| X-Timestamp | Client UTC clock timestamp in ISO 8601 format |

### X-RequestId Header

Client-originated requests are uniquely identified by the *X-RequestId* message header; this header is required for 
all client-originated messages. The *X-RequestId* header value must be a 
[universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) in "no-dash" form, for example as 
*123e4567e89b12d3a456426655440000* but **not** in the canonical form *123e4567-e89b-12d3-a456-426655440000*. Requests 
without an *X-RequestId* header or with a header value that uses the wrong format for UUIDs will cause the service to terminate the web socket connection.

### X-Timestamp Header

Each message sent to the Microsoft Speech Service by a client application **must** include an *X-Timestamp* header. The value for this header should be the time at which the client
sends the message. Requests without an *X-Timestamp* header or with a header
value that uses the wrong format will cause the service to terminate the web socket connection.  

The *X-Timestamp* header value must be of the form 'yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffffffZ' where 'fffffff' is a fraction of a second. For example, '12.5' means '12 + 5/10 seconds',
'12.526' means '12 plus 526/1000 seconds'. This format complies with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and, unlike the standard HTTP *Date* header,
can provide millisecond resolution. Client applications may round timestamps to the nearest millisecond.
Client applications should ensure that the device clock accurately tracks time by using a [Network Time Protocol (NTP) Server](https://en.wikipedia.org/wiki/Network_Time_Protocol). 

# Audio
Speech-enabled client applications send audio to the Microsoft Speech Service by converting the audio 
stream into a series of audio chunks. Each chunk of audio carries a segment of the spoken audio that 
is to be transcribed by the service. The maximum size of a single audio chunk is 8192 bytes. Audio
stream messages are *Binary Web Socket messages*.

Clients use the *audio* message to send an audio chunk to the service. Clients read audio from the microphone in chunks
and send these chunks to the Microsoft Speech Service for transcription. The first *audio* message must contain a well-formed
header that properly specifies that the audio conforms to one of the encoding formats supported by the service. Additional
*audio* messages contain only the binary audio stream data read from the microphone. 

Clients may optionally send an *audio* message with a zero-length body; this message tells the service that the 
client knows that the user has stopped speaking, that the utterance is complete and that the microphone is turned off.

The Microsoft Speech Service uses the first *audio* message that contains a unique request identifier to signal the start
of a new request/response cycle or *turn*. After receiving an *audio* message with a new request identifier, the service
discards any queued or unsent messages that are associated with any previous turn.


| Field         |  Description     |
| ------------- | ---------------- |
| Web socket message encoding | Binary |
| Body | The binary data for the audio chunk. Maximum size is 8192 bytes |
| Usage | Required |

## Required Message Headers

The following headers are required for all *audio* messages.

| Header         |  Value     |
| ------------- | ---------------- |
| Path | *audio* |
| X-RequestId | [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) in "no-dash" format |
| X-Timestamp | Client UTC clock timestamp in ISO 8601 format |
| Content-Type | The audio content type. Must be one of *audio/x-wav* (PCM) or *audio/silk* (SILK) |

## Supported Audio Encodings

This section describes the audio codecs supported by the Microsoft Speech Service.

### PCM

The Microsoft Speech Service accepts uncompressed pulse code modulation (PCM) audio. Audio is sent to the service in [WAV](https://en.wikipedia.org/wiki/WAV) format, 
so the first audio chunk **must** contain a valid [Resource Interchange File Format](https://en.wikipedia.org/wiki/Resource_Interchange_File_Format) (RIFF) header. 
If a client initiates a turn with an audio chunk that does *not* include a valid RIFF header, the service will reject the request and terminate the web socket connection. 

PCM audio **must** be sampled at 16 kHz with 16 bits per sample and one channel (*riff-16khz-16bit-mono-pcm*). The Microsoft Speech Service does not support
stereo audio streams and will reject audio streams that do not use the specified bit rate, sample rate or number of channels.

## Detecting End of Speech
Since humans do not *explicitly* signal when they are finished speaking, any application that accepts speech as input has two choices for handling the end of speech
in an audio stream -- *service end-of-speech detection* and *client end-of-speech detection*. Of these two choices, *service end-of-speech detection* usually provides
a better user experience.
 
### Service End-of-Speech Detection

To build the ideal hands-free speech experience, applications should allow the service
to detect when the user has finished speaking. Clients send audio from the microphone as *audio*
chunks until the service detects silence and responds back with a *speech.endDetected* message.

### Client End-of-Speech Detection

Client applications that allow the user to signal the end of speech in some way can also give the service
that signal. For example, a client application may have a *stop* or *mute* button that the user
can press. To signal end-of-speech, client applications should send an *audio* chunk message with
a zero-length body; the Microsoft Speech Service interprets this message as the end of the incoming
audio stream.

# Speech Config Message

The Microsoft Speech Service needs to know the characteristics of your application to provide the best possible speech recognition. The required characteristics data
includes information about the device and operating system that powers your application. You supply this information in the *speech.config* message.

Clients **must** send a *speech.config* message immediately after establishing the connection to the Microsoft Speech Service and before sending any *audio* messages.
You only need to send a *speech.config* message *once* per connection.

| Field | Description |
| ----- | ------------|
| Web socket message encoding | Text |
| Body | The payload as a JSON structure |

## Required Message Headers

| Header Name | Value |
| ----- | ------------|
| Path | *speech.config* |
| X-Timestamp | Client UTC clock timestamp in ISO 8601 format |
| Content-Type | application/json; charset=utf-8 |

As with all client-originated messages in the Microsoft Speech Services protocol, the *speech.config* message **must** include an *X-Timestamp* header
that records the client UTC clock time at which the message was sent to the service. The *speech.config* message *does not* require an *X-RequestId* header, since
this message is not associated with a particular speech request.

## Message Payload
The payload of the *speech.config* message is a JSON structure containing information about the application. An example of this information is shown below. Client and
device context information is included in the *context* element of the JSON structure. 

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
### System Element 
The system.version element of the *speech.config* message should contain the version of the speech SDK software used by the client application or device. The value should be in the form
*major.minor.build.branch*. The *branch* component may be omitted if it is not applicable.

### OS Element

| Field | Description | Usage |
| - | - | - |
| os.platform | The operating system platform that hosts the application, e.g. Windows, Android, iOS, Linux | Required | 
| os.name| The operating system product name, e.g. Debian, Windows 10 | Required |
| os.version | The version of the operating system, in the form *major.minor.build.branch* | Required |

### Device Element

| Field | Description | Usage |
| - | - | - |
| device.manufacturer | The device hardware manufacturer | Required |
| device.model | The device model | Required |
| device.version | The device software version provided by the device manufacturer; this value specifies a version of the device that can be tracked by the manufacturer | Required |

# Telemetry

Client applications *must* acknowledge the end of each turn by sending telemetry about the turn to the Microsoft Speech Service. Turn end acknowledgment allows 
the Microsoft Speech Service to ensure that all messages necessary for completion of the request and its response have been properly received by the client. 
Turn end acknowledgment also allows the Microsoft Speech Service to verify that the client applications are performing as expected; this information will be
invaluable if you need help troubleshooting your speech-enabled application.

Clients must acknowledge the end of a turn by sending a *telemetry* message soon after receiving a *turn.end* message. Clients should attempt to
acknowledge the *turn.end* as soon as possible; if a client application fails to acknowledge the turn end, the Microsoft Speech Service may terminate the connection with an error.
Clients must send only one *telemetry* message for each request and response identified by the *X-RequestId* value. 

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *telemetry* |
| X-Timestamp | Client UTC clock timestamp in ISO 8601 format |
| Content-Type | *application/json* |
| Body | A JSON structure containing client information about the turn |

The schema for the body of the *telemetry* message is defined in the section titled "Telemetry Schema" later in this document. 

## Telemetry for Interrupted Connections

If the network connection fails for any reason during a turn and the client does *not* receive a *turn.end* message from the service, the client should send a *telemetry*
message describing the failed request the next time the client makes a connection to the service. Clients do not have to immediately attempt a connection to send the *telemetry*
message; the message may be buffered on the client and sent over a future user-requested connection. The *telemetry* message for the failed request **must** use the
*X-RequestId* value from the failed request and may be sent to the service as soon as a connection is established, without waiting to send or receive for other messages. 

# Service-Originated Messages

This section describes the messages that originate in the Microsoft Speech Service and are sent to the
client. The Microsoft Speech Service maintains a registry of client capabilities and generates the
messages required by each client, so not all clients will receive all messages described here. For brevity, messages
are referenced by the value of the *Path* header; for example, we refer to a web socket text message with *Path* value *speech.hypothesis* as a *"speech.hypothesis message"*. 

## Speech Start Detected

The *speech.startDetected* message indicates that the Microsoft Speech Service has detected speech in the audio stream.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *speech.startDetected* |
| Content-Type | application/json; charset=utf-8 |
| Body | JSON structure containing information about the conditions at which the start of speech was detected. The *Offset* field in this structure is a media time offset in 100 nanosecond units. |

##### Sample Message

```HTML
Path: speech.startDetected
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "Offset": 100000
}
```

The *Offset* element specifies the offset (in 100-nanosecond units) at which speech was detected in the audio stream, relative to the start of the stream.

## Speech Hypothesis

During speech recognition, the Microsoft Speech Service periodically generates
hypotheses about the words the service has recognized. The Microsoft Speech Service sends these
hypotheses to the client approximately every 300 milliseconds. The *speech.hypothesis* is suitable **only** for enhancing the user speech experience; you must not
take any dependency on the content or accuracy of the text in these messages.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *speech.hypothesis* |
| X-RequestId | [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) in "no-dash" format |
| Content-Type | application/json |
| Body | The speech hypothesis JSON structure |
| Usage | The *speech.hypothesis* message is applicable to those clients that have some text rendering capability and wish to provide near-real-time feedback of the in-progress recognition to the person who is speaking |

##### Sample Message

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

The *Offset* element specifies the offset (in 100-nanosecond units) at which the phrase was recognized, relative to the start of the audio stream.
The *Duration* element specifies the duration (in 100-nanosecond units) of this speech phrase.

Clients must not make any assumptions about the frequency, timing or text contained in a speech hypothesis or the 
consistency of text in any two speech hypotheses. The hypotheses are just snapshots into the
transcription process in the service and do not represent a stable accumulation of transcription. For
example, a first speech hypothesis may contain the words "fine fun" and the second hypothesis may
contain the words "find funny". The Microsoft Speech Service does not perform any post-processing (e.g. capitalization, punctuation) on the 
text in the speech hypothesis. 

## Speech Phrase
When the Microsoft Speech Service determines that it has enough information to produce a recognition 
result that will not change, the service produces a *speech.phrase* message. The Microsoft Speech
Service produces these results after it detects that the user has completed a sentence or phrase.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *speech.phrase* |
| Content-Type | application/json |
| Body | The speech phrase JSON structure |

The speech phrase JSON schema includes two fields. The *DisplayText* field represents the recognized phrase after capitalization, punctuation and inverse-text-normalization have been applied and profanity has been masked with asterisks.
The *RecognitionStatus* field specifies the status of the recognition.
 
##### Sample Message

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

The values for the RecognitionStatus are given in the table below. The DisplayText field will be present *only* if the RecognitionStatus field has the value *Success*.

| Status | Description |
| ------------- | ---------------- |
| Success | The recognition was successful and the DisplayText field will be present |
| NoMatch | Speech was detected in the audio stream, but no words from the target language were matched. See below for more details  |
| InitialSilenceTimeout | The start of the audio stream contained only silence, and the service timed out waiting for speech |
| BabbleTimeout | The start of the audio stream contained only noise, and the service timed out waiting for speech |
| Error | The recognition service encountered an internal error and could not continue |

The *Offset* element specifies the offset (in 100-nanosecond units) at which the phrase was recognized, relative to the start of the audio stream.
The *Duration* element specifies the duration (in 100-nanosecond units) of this speech phrase.

### NoMatch Recognition Status
The *NoMatch* condition occurs when the Microsoft Speech Service detects speech in the audio stream but is unable to match that speech to the language grammar
being used for the request. For example, a *NoMatch* condition might occur if a user says something in German when the recognizer expects US English
as the spoken language. The waveform pattern of the utterance would indicate the presence of human speech, but none of the words spoken would match the
US English lexicon being used by the recognizer.

Another *NoMatch* condition occurs when the recognition algorithm is unable to find an accurate match for the sounds contained in the audio stream. When this condition
happens, the Microsoft Speech Service may produce *speech.hypothesis* messages that contain *hypothesized text* but will produce a *speech.phrase* message in which the
*RecognitionStatus* is *NoMatch*. This condition is normal; you must not make any assumptions about the accuracy or fidelity of the text in the *speech.hypothesis* message.
Furthermore, you must not assume that because the Microsoft Speech Service produces *speech.hypothesis* messages that the service will be able to produce a *speech.phrase*
message with *RecognitionStatus* *Success*.

## Control Messages

The Microsoft Speech Service provides control messages that allow client applications to 
offer an optimal user experience while still meeting power requirements and regulations. Control messages are
identified by the *Path* value.

### Speech End Detected

The *speech.endDetected* message specifies that the client application should stop streaming audio to the service.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *speech.endDetected* |
| Body | JSON structure containing the offset at which the end of speech was detected. The offset is represented in 100 nanosecond units offset from the start of audio used for recognition. |
| Content-Type | application/json; charset=utf-8 |

##### Sample Message

```HTML
Path: speech.endDetected
Content-Type: application/json; charset=utf-8
X-RequestId: 123e4567e89b12d3a456426655440000

{
  "Offset": 0
}
```

The *Offset* element specifies the offset (in 100-nanosecond units) at which the phrase was recognized, relative to the start of the audio stream.

## Turn Start
The *turn.start* signals the start of a turn from the perspective of the service. The *turn.start* message is the always the **first** response message you will receive for any request.
If you do not receive a *turn.start* message, you should assume that the state of the service connection is invalid.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *turn.start* |
| Content-Type | application/json; charset=utf-8 |
| Body | JSON structure |

##### Sample Message

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

The body of the *turn.start* message is a JSON structure that contains context for the start of the turn. The *context* element
contains a *serviceTag* property; this property specifies a tag value that the service has associated with the turn. 
This value can be used by Microsoft if you need help troubleshooting failures in your application.

## Turn End
The *turn.end* signals the end of a turn from the perspective of the service. The *turn.end* message is the always the **last** response message you will receive for any request. 
Clients can use the receipt of this message as a signal for cleanup activities and transitioning to an idle state. If you do not receive a *turn.end* message, you should assume that
the state of the service connection is invalid; in those cases, you should close the existing connection to the service and reconnect.

| Field | Description |
| ------------- | ---------------- |
| Web socket message encoding | Text |
| Path | *turn.end* |
| Body | None |

##### Sample Message

```HTML
Path: turn.end
X-RequestId: 123e4567e89b12d3a456426655440000
```

# Telemetry Schema 
The body of the *telemetry* message is a JSON structure that contains client information about a turn or an attempted connection. The structure is made up of client timestamps that record
when client events occur. Each timestamp must be in ISO 8601 format as described in the section titled *X-Timestamp Header*. *Telemetry* messages that do not specify 
all the required fields in the JSON structure or which do not use the correct timestamp format may cause the service to terminate the connection to the client.
Clients **must** supply valid values for *all required fields*. Clients *should* supply values for optional fields whenever appropriate. The values shown in samples in this section are for illustration only. 

Telemetry schema is divided into the following parts: *received message timestamps* and *metrics*. The format and usage of each part is specified below.

## Received Message Timestamps
Clients must include time-of-receipt values for *all* messages that it receives after successfully connecting to the service. These values must record the time at which the client *received* each
message from the network. The value should not record any other time; for example, the client should not record the time at which it *acted* on the message. The received message timestamps
are specified in an array of *name:value* pairs. The name of the pair specifies the *Path* value of the message; the value of the pair specifies the client time 
when the message was *received*, or, if more than one message of the specified name was received, the value of the pair is an array of timestamps indicating when those messages
were received.

```JSON
  "ReceivedMessages": [
    { "speech.hypothesis": [ "2016-08-16T15:03:48.172Z", "2016-08-16T15:03:48.331Z", "2016-08-16T15:03:48.881Z" ] },
    { "speech.endDetected": "2016-08-16T15:03:49.721Z" },
    { "speech.phrase": "2016-08-16T15:03:50.001Z" },
    { "turn.end": "2016-08-16T15:03:51.021Z" }
  ]
```

Clients **must** acknowledge the receipt of **all** messages sent by the service by including timestamps for those messages in the JSON body. If a client
fails to acknowledge the receipt of a message, the service may terminate the connection.

## Metrics
Clients must include information about events that occurred during the lifetime of a request.

### Connection
The *Connection* metric specifies details about connection attempts by the client. The metric must include timestamps of when the web socket connection was started and completed.
The *Connection* metric is required **only for the first turn of a connection**; subsequent turns are not required to include this information. If a client makes multiple connection attempts
before a connection is established, information about *all* the connection attempts should be included; for more details, see the section titled "Connection Retries in Telemetry" later in this document.

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | Connection | Required |
| Id | Connection identifier value that used in the *X-ConnectionId* header for this connection request | Required |
| Start | The time at which the client sent the connection request | Required |
| End | The time at which the client received notification that the connection was established successfully or, in error cases, rejected, refused or failed | Required |
| Error | A description of the error that occurred, if any. If the connection was successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

The error description should be at most 50 characters and should ideally be one of the values listed in the table below. If the error condition does not match one of 
the below values, clients may use a succinct description of the error condition using [CamelCasing](https://en.wikipedia.org/wiki/Camel_case) without whitespace. 
Note that the ability to send a *telemetry* message requires a connection to the service, so only transient or temporary error conditions can be reported in the
*telemetry* message. Error conditions that *permanently* prevent a client from establishing a connection to the service will, of course, prevent the client from 
sending any message to the service, including *telemetry* messages.
 
| Error | Usage |
| ----- | ----- |
| *DNSfailure* | The client was unable to connect to the service because of a DNS failure in the network stack |
| *NoNetwork* | The client attempted a connection, but the network stack reported that there was no physical network available |
| *NoAuthorization* | The client connection failed while attempting to acquire an authorization token for the connection |
| *NoResources* | The client ran out of some local resource (e.g. memory) while trying to make a connection |
| *Forbidden* | The client was unable to connect to the service because the service returned an HTTP 403 Forbidden status code on the web socket upgrade request |
| *Unauthorized* | The client was unable to connect to the service because the service returned an HTTP 401 Unauthorized status code on the web socket upgrade request |
| *BadRequest* | The client was unable to connect to the service because the service returned an HTTP 400 Bad Request status code on the web socket upgrade request |
| *ServerUnavailable* | The client was unable to connect to the service because the service returned an HTTP 503 Server Unavailable status code on the web socket upgrade request |
| *ServerError* | The client was unable to connect to the service because the service returned an HTTP 500 Internal Error status code on the web socket upgrade request |
| *Timeout* | The client's connection request timed out without a response from the service. The End field should contain the time at which the client timed out and stopped waiting for the connection |
| *ClientError* | The client terminated the connection because of some internal client error | 

### Microphone
The *Microphone* metric is required for all speech turns. This metric measures the time on the client during which audio input is being actively used for a speech request.
The following examples should be used as guidelines for recording *Start* time values for the *Microphone* metric in your client application.

* A client application requires that a user press a physical button to start the microphone; after the button press, the client application reads the input from the microphone
and sends it to the Microsoft Speech Service. The *Start* value for the *Microphone* metric records the time after the button push at which the microphone has been initialized and is ready to
provide input. The *End* value for the *Microphone* metric records the time at which the client application stopped streaming audio to the service after receiving the *speech.endDetected*
message from the service.
* A client application uses a keyword spotter that is "always" listening; only after the keyword spotter detects a spoken 
trigger phrase does the client application collect the input from the microphone and send it to the Microsoft Speech Service. The *Start* value for the *Microphone* metric records the 
time at which the keyword spotter notified the client that it should start using input from the microphone. The *End* value for the *Microphone* metric records the time at which the 
client application stopped streaming audio to the service after receiving the *speech.endDetected* message from the service.
* A client application has access to a constant audio stream and performs silence/speech detection on that audio stream in a *speech detection module*. The *Start* value for the *Microphone* metric records the time
that the *speech detection module* notified the client that it should start using input from the audio stream. The *End* value for the *Microphone* metric records the time at which the 
client application stopped streaming audio to the service after receiving the *speech.endDetected* message from the service.
* A client application is processing the second turn of a multi-turn request and has been informed by a service response message that the microphone should be turned on to
gather input for the second turn. The *Start* value for the *Microphone* metric records the time at which the client application has enabled the microphone and has started
using input from that audio source. The *End* value for the *Microphone* metric records the time at which the 
client application stopped streaming audio to the service after receiving the *speech.endDetected* message from the service.

Since the *End* time value for the *Microphone* metric records the time at which the client application stopped streaming audio input, and since in most situations, this event will
occur shortly after the client received the *speech.endDetected* message from the service, client applications may verify that they are properly conforming to the protocol by ensuring
that the *End* time value for the *Microphone* metric occurs later than the receipt time value for the *speech.endDetected* message. And, since there is usually a delay between the 
end of one turn and the start of another turn, clients may verify protocol conformance by ensuring that the *Start* time of the *Microphone* metric for any subsequent turn correctly
records the time at which the client *started* using the microphone to stream audio input to the service.     

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | Microphone | Required |
| Start | The time at which the client started using audio input from the microphone or other audio stream or received a trigger from the keyword spotter | Required |
| End | The time at which the client stopped using the microphone or audio stream | Required |
| Error | A description of the error that occurred, if any. If the microphone operations were successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

### Listening Trigger
The *ListeningTrigger* metric measures the time at which the user executes the action that will initiate speech input. The *ListeningTrigger* metric is optional,
but clients that can provide this metric are encouraged to do so.

The following examples should be used as guidelines for recording *Start* and *End* time values for the *ListeningTrigger* metric in your client application.
* A client application requires that a user press a physical button to start the microphone; The *Start* value for this metric records the time of the button push. The *End*
value records the time at which the button push completes.
* A client application uses a keyword spotter that is "always" listening; after the keyword spotter detects a spoken trigger phrase does the client application read the input from the microphone and send it to the Microsoft Speech Service. The *Start* value for this metric records the time at which the keyword spotter received audio that was then detected as
the trigger phrase. The *End* value records the time at which the last word of the trigger
phrase was spoken by the user.
* A client application has access to a constant audio stream and performs silence/speech detection on that audio stream in a *speech detection module*. The Start value for this metric records the time that the *speech detection module* received audio that was then
detected as speech. The *End* value records the time at which the *speech detection module*
detected speech.
* A client application is processing the second turn of a multi-turn request and has been informed by a service response message that the microphone should be turned on to gather input for the second turn. The client application should *not* include a 
*ListeningTrigger* metric for this turn.

| Field | Description | Usage |
| ----- | ----------- | ----- |
| Name | ListeningTrigger | Optional |
| Start | The time at which the client listening trigger started | Required |
| End | The time at which the client listening trigger completed | Required |
| Error | A description of the error that occurred, if any. If the trigger operation was successful, clients should omit this field. The maximum length of this field is 50 characters. | Required for error cases, omitted otherwise |

##### Sample Message

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

# Error Handling

This section describes the kinds of error messages and conditions that your application will need to handle.

## HTTP Status Codes
During the web socket upgrade request, the Microsoft Speech Service may return any of the standard HTTP status codes, such as 400 Bad Request, etc. You application 
must correctly handle these error conditions.

## Authorization Errors
The Microsoft Speech Service will return a **403 Forbidden** HTTP status code if incorrect authorization is provided
during the web socket upgrade. Among the conditions that can trigger this error code are:

* Missing *Authorization* header
* Invalid authorization token
* Expired authorization token

The 403 Forbidden error does not indicate a problem with the Microsoft Speech Service; this error indicates a 
problem with the client application.

## Protocol Violation Errors

If the Microsoft Speech Service detects any protocol violations from a client, the service will terminate the
web socket connection after returning a **status code** and **reason** for the termination. Client applications
can use this information to troubleshoot and fix the violations.

### Incorrect Message Format

If a client sends a text or binary message to the service that is not encoded in the correct format given
in this specification, the service will close the connection with a *1007 Invalid Payload Data* status code.
The service will return this status code for a variety of reasons; examples are:

* Incorrect message format. Binary message has invalid header size prefix. *The client sent a binary message that has an invalid header size prefix.* 
* Incorrect message format. Binary message has invalid header size. *The client sent a binary message that specified an invalid header size.*
* Incorrect message format. Binary message headers decoding into UTF-8 failed. *The client sent a binary message containing headers that were not correctly encoded in UTF-8.*
* Incorrect message format. Text message contains no data. *The client sent a text message that contains no body data.*
* Incorrect message format. Text message decoding into UTF-8 failed. *The client sent a text message that was not correctly encoded in UTF-8.*
* Incorrect message format. Text message contains no header separator. *The client sent a text message that did not contain a header separator or used the wrong header separator.*

### Missing or Empty Headers

If a client sends a message that does not have the required headers *X-RequestId* or *Path*, the service will close
the connection with a *1002 Protocol Error* status code with the reason *Missing/Empty header. {Header name}*.

### Request Id Values

If a client sends a message that specifies an *X-RequestId* header with incorrect format, the service will close the connection and return *1002 Protocol Error* status
code with reason message *Invalid request. X-RequestId header value was not specified in no-dash UUID format*.

### Audio Encoding Errors

If a client sends an audio chunk that initiates a turn and the audio format or encoding does not conform to the required specification,
the service will close the connection and return a *1007 Invalid Payload Data* status code with a reason message that indicates the format encoding error source.

### Request Id Reuse

Once a turn is complete, if a client sends a message that reuses the request identifier from that turn, the service will close the connection
and return a *1002 Protocol Error* status code with the reasons *Invalid request. Reuse of request identifiers is not allowed*.

# Connection Failure Telemetry

To ensure the best possible user experience, clients must inform the Microsoft Speech Service of the timestamps for important checkpoints within
a connection using the *telemetry* message. It is equally important, however, that clients inform the service of connections that *were attempted but failed*.

For each connection attempt that failed, clients should create a *telemetry* message with a unique *X-RequestId* header value. Since the client was unable
to establish a connection, the *ReceivedMessages* field in the JSON body can be omitted; only the *Connection* entry in the *Metrics* field should be included.
This entry should include the start and end timestamps as well as the error condition that was encountered. 

## Connection Retries in Telemetry

Clients should distinguish *retries* from *multiple connection attempts* by the event that triggers the connection attempt. Connection attempts that are
carried out programmatically without any user input are *retries*. Multiple connection attempts that are carried out in response to user input are 
*multiple connection attempts*. Clients should give each user-triggered connection attempt a unique *X-RequestId* and *telemetry* message; 
clients should reuse the *X-RequestId* for programmatic retries. If multiple retries were made for a single connection attempt, each retry attempt should
be included as a *Connection* entry in the *telemetry* message.

For example, suppose a user speaks the keyword trigger to start a connection and that the first connection attempt
fails because of DNS errors but then succeeds on a second attempt that is made programmatically by the client. Since the client retried the connection
without requiring additional input from the user, the client should use a single *telemetry* message with multiple *Connection* entries to describe
the connection.   

As another example, suppose a user speaks the keyword trigger to start a connection and that this connection attempt fails after three retries, at which
time the client gives up, stops attempting to connect to the service and informs the user that something went wrong. The user then speaks the keyword 
trigger again. This time, suppose the client can connect to the service. After connecting, the client should immediately send a *telemetry* message to
the service containing three *Connection* entries that describe the connection failures. After receiving the *turn.end* message, the client should send
another *telemetry* message that describes the successful connection. 

# Error Message Reference

## HTTP Status Codes

| HTTP Status Code | Description | Troubleshooting |
| - | - | - |
| 400 Bad Request | The client sent a web socket connection request that was incorrect | Check that you have supplied all the required parameters and HTTP headers and that the values are correct |
| 401 Unauthorized | The client did not include the required authorization information | Check that you are sending the Authorization header in the web socket connection |
| 403 Forbidden | The client sent authorization information, but it was invalid | Check that you are not sending an expired or invalid value in the Authorization header |
| 404 Not Found | The client attempted to access an URL path that is not supported | Check that you are using the correct URL for the web socket connection |
| 500 Server Error | The service encountered an internal error and could not satisfy the request | In most cases, this error will be transient. Retry the request. |
| 503 Service Unavailable | The service was unavailable to handle the request | In most cases, this error will be transient. Retry the request. |

## Web Socket Error Codes

| Web Socket Status Code | Description | Troubleshooting |
| - | - | - |
| 1000 Normal Closure | The service closed the web socket connection without an error  | If the web socket closure was unexpected, reread the documentation to ensure that you understand how and when the service can terminate the web socket connection. |
| 1002 Protocol Error | The client failed to adhere to protocol requirements | Ensure that you understand the protocol documentation and are clear about the requirements. Read the documentation above about error reasons to see if you are violating protocol requirements. | 
| 1007 Invalid Payload Data | The client sent an invalid payload in a protocol message | Check the last message that you sent to the service for errors. Read the documentation above about payload errors. |
| 1011 Server Error | The service encountered an internal error and could not satisfy the request | In most cases, this error will be transient. Retry the request. |

# Next Steps
Javascript SDK (https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript)
