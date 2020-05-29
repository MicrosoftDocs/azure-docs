---
title: Speech service containers frequently asked questions (FAQ)
titleSuffix: Azure Cognitive Services
description: Install and run speech containers. speech-to-text transcribes audio streams to text in real time that your applications, tools, or devices can consume or display. Text-to-speech converts input text into human-like synthesized speech.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: aahi
---

# Speech service containers frequently asked questions (FAQ)

When using the Speech service with containers, rely on this collection of frequently asked questions before escalating to support. This article captures questions varying degree, from general to technical. To expand an answer, click on the question.

## General questions

<details>
<summary>
<b>How do Speech containers work and how do I set them up?</b>
</summary>

**Answer:** When setting up the production cluster, there are several things to consider. First, setting up single language, multiple containers, on the same machine, should not be a large issue. If you are experiencing problems, it may be a hardware-related issue - so we would first look at resource, that is; CPU and memory specifications.

Consider for a moment, the `ja-JP` container and latest model. The acoustic model is the most demanding piece CPU-wise, while the language model demands the most memory. When we benchmarked the use, it takes about 0.6 CPU cores to process a single speech-to-text request when audio is flowing in at real-time (like from the microphone). If you are feeding audio faster than real-time (like from a file), that usage can double (1.2x cores). Meanwhile, the memory listed below is operating memory for decoding speech. It does *not* take into account the actual full size of the language model, which will reside in file cache. For `ja-JP` that's an additional 2 GB; for `en-US`, it may be more (6-7 GB).

If you have a machine where memory is scarce, and you are trying to deploy multiple languages on it, it is possible that file cache is full, and the OS is forced to page models in and out. For a running transcription, that could be disastrous, and may lead to slowdowns and other performance implications.

Furthermore, we pre-package executables for machines with the [advanced vector extension (AVX2)](speech-container-howto.md#advanced-vector-extension-support) instruction set. A machine with the AVX512 instruction set will require code generation for that target, and starting 10 containers for 10 languages may temporarily exhaust CPU. A message like this one will appear in the docker logs:

```console
2020-01-16 16:46:54.981118943 
[W:onnxruntime:Default, tvm_utils.cc:276 LoadTVMPackedFuncFromCache]
Cannot find Scan4_llvm__mcpu_skylake_avx512 in cache, using JIT...
```

Finally, you can set the number of decoders you want inside a *single* container using `DECODER MAX_COUNT` variable. So, basically, we should start with your SKU (CPU/memory), and we can suggest how to get the best out of it. A great starting point is referring to the recommended host machine resource specifications.

<br>
</details>

<details>
<summary>
<b>Could you help with capacity planning and cost estimation of on-prem Speech containers?</b>
</summary>

**Answer:** For container capacity in batch processing mode, each decoder could handle 2-3x in real time, with two CPU cores, for a single recognition. We do not recommend keeping more than two concurrent recognitions per container instance, but recommend running more instances of containers for reliability/availability reasons, behind a load balancer.

Though we could have each container instance running with more decoders. For example, we may be able to set up 7 decoders per container instance on an eight core machine (at at more than 2x each), yielding 15x throughput. There is a param `DECODER_MAX_COUNT` to be aware of. For the extreme case, reliability and latency issues arise, with throughput increased significantly. For a microphone, it will be at 1x real time. The overall usage should be at about one core for a single recognition.

For scenario of processing 1 K hours/day in batch processing mode, in an extreme case, 3 VMs could handle it within 24 hours but not guaranteed. To handle spike days, failover, update, and to provide minimum backup/BCP, we recommend 4-5 machines instead of 3 per cluster, and with 2+ clusters.

For hardware, we use standard Azure VM `DS13_v2` as a reference (each core must be 2.6 GHz or better, with AVX2 instruction set enabled).

| Instance  | vCPU(s) | RAM    | Temp storage | Pay-as-you-go with AHB | 1-year reserve with AHB (% Savings) | 3-year reserved with AHB (% Savings) |
|-----------|---------|--------|--------------|------------------------|-------------------------------------|--------------------------------------|
| `DS13 v2` | 8       | 56 GiB | 112 GiB      | $0.598/hour            | $0.3528/hour (~41%)                 | $0.2333/hour (~61%)                  |

Based on the design reference (two clusters of 5 VMs to handle 1 K hours/day audio batch processing), 1-year hardware cost will be:

> 2 (clusters) * 5 (VMs per cluster) * $0.3528/hour * 365 (days) * 24 (hours) = $31K / year

When mapping to physical machine, a general estimation is 1 vCPU = 1 Physical CPU Core. In reality, 1vCPU is more powerful than a single core.

For on-prem, all of these additional factors come into play:

- On what type the physical CPU is and how many cores on it
- How many CPUs running together on the same box/machine
- How VMs are set up
- How hyper-threading / multi-threading is used
- How memory is shared
- The OS, etc.

Normally it is not as well tuned as Azure the environment. Considering other overhead, I would say a safe estimation is 10 physical CPU cores = 8 Azure vCPU. Though popular CPUs only have eight cores. With on-prem deployment, the cost will be higher than using Azure VMs. Also, consider the depreciation rate.

Service cost is the same as the online service: $1/hour for speech-to-text. The Speech service cost is:

> $1 * 1000 * 365 = $365K

Maintenance cost paid to Microsoft depends on the service level and content of the service. It various from $29.99/month for basic level to hundreds of thousands if onsite service involved. A rough number is $300/hour for service/maintain. People cost is not included. Other infrastructure costs (such as storage, networks, and load balancers) are not included.

<br>
</details>

<details>
<summary>
<b>Why is punctuation missing from the transcription?</b>
</summary>

**Answer:** The `speech_recognition_language=<YOUR_LANGUAGE>` should be explicitly configured in the request if they are using Carbon client.

For example:

```python
if not recognize_once(
    speechsdk.SpeechRecognizer(
        speech_config=speechsdk.SpeechConfig(
            endpoint=template.format("interactive"),
            speech_recognition_language="ja-JP"),
            audio_config=audio_config)):

    print("Failed interactive endpoint")
    exit(1)
```
Here is the output:

```cmd
RECOGNIZED: SpeechRecognitionResult(
    result_id=2111117c8700404a84f521b7b805c4e7, 
    text="まだ早いまだ早いは猫である名前はまだないどこで生まれたかとんと見当を検討をなつかぬ。
    何でも薄暗いじめじめした所でながら泣いていた事だけは記憶している。
    まだは今ここで初めて人間と言うものを見た。
    しかも後で聞くと、それは書生という人間中で一番同額同額。",
    reason=ResultReason.RecognizedSpeech)
```

<br>
</details>

<details>
<summary>
<b>Can I use a custom acoustic model and language model with Speech container?</b>
</summary>

We are currently only able to pass one model ID, either custom language model or custom acoustic model.

**Answer:** The decision to *not* support both acoustic and language models concurrently was made. This will remain in effect, until a unified identifier is created to reduce API breaks. So, unfortunately this is not supported right now.

<br>
</details>

<details>
<summary>
<b>Could you explain these errors from the custom speech-to-text container?</b>
</summary>

**Error 1:**

```cmd
Failed to fetch manifest: Status: 400 Bad Request Body:
{
    "code": "InvalidModel",
    "message": "The specified model is not supported for endpoint manifests."
}
```

**Answer 1:** If you're training with the latest custom model, we currently don't support that. If you train with an older version, it should be possible to use. We are still working on supporting the latest versions.

Essentially, the custom containers do not support Halide or ONNX-based acoustic models (which is the default in the custom training portal). This is due to custom models not being encrypted and we don't want to expose ONNX models, however; language models are fine. The customer will need to explicitly select an older non-ONNX model for custom training. Accuracy will not be affected. The model size may be larger (by 100 MB).

> Support model > 20190220 (v4.5 Unified)

**Error 2:**

```cmd
HTTPAPI result code = HTTPAPI_OK.
HTTP status code = 400.
Reason:  Synthesis failed.
StatusCode: InvalidArgument,
Details: Voice does not match.
```

**Answer 2:** You need to provide the correct voice name in the request, which is case-sensitive. Refer to the full service name mapping. You have to use `en-US-JessaRUS`, as `en-US-JessaNeural` is not available right now in container version of text-to-speech.

**Error 3:**

```json
{
    "code": "InvalidProductId",
    "message": "The subscription SKU \"CognitiveServices.S0\" is not supported in this service instance."
}
```

**Answer 3:** You reed to create a Speech resource, not a Cognitive Services resource.


<br>
</details>

<details>
<summary>
<b>What API protocols are supported, REST or WS?</b>
</summary>

**Answer:** For speech-to-text and custom speech-to-text containers, we currently only support the websocket based protocol. The SDK only supports calling in WS but not REST. There's a plan to add REST support, but not ETA for the moment. Always refer to the official documentation, see [query prediction endpoints](speech-container-howto.md#query-the-containers-prediction-endpoint).

<br>
</details>

<details>
<summary>
<b>Is CentOS supported for Speech containers?</b>
</summary>

**Answer:** CentOS 7 is not supported by Python SDK yet, also Ubuntu 19.04 is not supported.

The Python Speech SDK package is available for these operating systems:
- **Windows** - x64 and x86
- **Mac** - macOS X version 10.12 or later
- **Linux** - Ubuntu 16.04, Ubuntu 18.04, Debian 9 on x64

For more information on environment setup, see [Python platform setup](quickstarts/setup-platform.md?pivots=programming-language-python). For now, Ubuntu 18.04 is the recommended version.

<br>
</details>

<details>
<summary>
<b>Why am I getting errors when attempting to call LUIS prediction endpoints?</b>
</summary>

I am using the LUIS container in an IoT Edge deployment and am attempting to call the LUIS prediction endpoint from another container. The LUIS container is listening on port 5001, and the URL I'm using is this:

```csharp
var luisEndpoint =
    $"ws://192.168.1.91:5001/luis/prediction/v3.0/apps/{luisAppId}/slots/production/predict";
var config = SpeechConfig.FromEndpoint(new Uri(luisEndpoint));
```

The error I'm getting is:

```cmd
WebSocket Upgrade failed with HTTP status code: 404 SessionId: 3cfe2509ef4e49919e594abf639ccfeb
```

I see the request in the LUIS container logs and the message says:

```cmd
The request path /luis//predict" does not match a supported file type.
```

What does this mean? What am I missing? I was following the example for the Speech SDK, from [here](https://github.com/Azure-Samples/cognitive-services-speech-sdk). The scenario is that we are detecting the audio directly from the PC microphone and trying to determine the intent, based on the LUIS app we trained. The example I linked to does exactly that. And it works well with the LUIS cloud-based service. Using the Speech SDK seemed to save us from having to make a separate explicit call to the speech-to-text API and then a second call to LUIS.

So, all I am attempting to do is switch from the scenario of using LUIS in the cloud to using the LUIS container. I can't imagine if the Speech SDK works for one, it won't work for the other.

**Answer:**
The Speech SDK should not be used against a LUIS container. For using the LUIS container, the LUIS SDK or LUIS REST API should be used. Speech SDK should be used against a speech container.

A cloud is different than a container. A cloud can be composed of multiple aggregated containers (sometimes called micro services). So there is a LUIS container and then there is a Speech container - Two separate containers. The Speech container only does speech. The LUIS container only does LUIS. In the cloud, because both containers are known to be deployed, and it is bad performance for a remote client to go to the cloud, do speech, come back, then go to the cloud again and do LUIS, we provide a feature that allows the client to go to Speech, stay in the cloud, go to LUIS then come back to the client. Thus even in this scenario the Speech SDK goes to Speech cloud container with audio, and then Speech cloud container talks to LUIS cloud container with text. The LUIS container has no concept of accepting audio (it would not make sense for LUIS container to accept streaming audio - LUIS is a text-based service). With on-prem, we have no certainty our customer has deployed both containers, we don't presume to orchestrate between containers in our customers' premises, and if both containers are deployed on-prem, given they are more local to the client, it is not a burden to go the SR first, back to client, and have the customer then take that text and go to LUIS.

<br>
</details>

<details>
<summary>
<b>Why are we getting errors with macOS, Speech container and the Python SDK?</b>
</summary>

When we send a *.wav* file to be transcribed, the result comes back with:

```cmd
recognition is running....
Speech Recognition canceled: CancellationReason.Error
Error details: Timeout: no recognition result received.
When creating a websocket connection from the browser a test, we get:
wb = new WebSocket("ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1")
WebSocket
{
    url: "ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1",
    readyState: 0,
    bufferedAmount: 0,
    onopen: null,
    onerror: null,
    ...
}
```

We know the websocket is set up correctly.

**Answer:**
If that is the case, then see [this GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/310). We have a work-around, [proposed here](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/310#issuecomment-527542722).

Carbon fixed this at version 1.8.


<br>
</details>

<details>
<summary>
<b>What are the differences in the Speech container endpoints?</b>
</summary>

Could you help fill the following test metrics, including what functions to test, and how to test the SDK and REST APIs? Especially, differences in "interactive" and "conversation", which I did not see from existing doc/sample.

| Endpoint                                                | Functional test                                                   | SDK | REST API |
|---------------------------------------------------------|-------------------------------------------------------------------|-----|----------|
| `/speech/synthesize/cognitiveservices/v1`               | Synthesize Text (text-to-speech)                                  |     | Yes      |
| `/speech/recognition/dictation/cognitiveservices/v1`    | Cognitive Services on-prem dictation v1 websocket endpoint        | Yes | No       |
| `/speech/recognition/interactive/cognitiveservices/v1`  | The Cognitive Services on-prem interactive v1 websocket endpoint  |     |          |
| `/speech/recognition/conversation/cognitiveservices/v1` | The cognitive services on-prem conversation v1 websocket endpoint |     |          |

**Answer:**
This is a fusion of:
- People trying the dictation endpoint for containers, (I'm not sure how they got that URL)
- The 1<sup>st</sup> party endpoint being the one in a container.
- The 1<sup>st</sup> party endpoint returning speech.fragment messages instead of the `speech.hypothesis` messages the 3<sup>rd</sup> part endpoints return for the dictation endpoint.
- The Carbon quickstarts all use `RecognizeOnce` (interactive mode)
- Carbon having an assert that for `speech.fragment` messages requiring they aren't returned in interactive mode.
- Carbon having the asserts fire in release builds (killing the process).

The workaround is either switch to using continuous recognition in your code, or (quicker) connect to either the interactive or continuous endpoints in the container.
For your code, set the endpoint to <host:port>/speech/recognition/interactive/cognitiveservices/v1

For the various modes, see Speech modes - see below:

[!INCLUDE [speech-modes](includes/speech-modes.md)]

The proper fix is coming with SDK 1.8, which has on-prem support (will pick the right endpoint, so we will be no worse than online service). In the meantime, there is a sample for continuous recognition, why don't we point to it?

https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/6805d96bf69d9e95c9137fe129bc5d81e35f6309/samples/python/console/speech_sample.py#L196

<br>
</details>

<details>
<summary>
<b>Which mode should I use for various audio files?</b>
</summary>

**Answer:** Here's a [quickstart using Python](quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-python). You can find the other languages linked on the docs site.

Just to clarify for the interactive, conversation, and dictation; this is an advanced way of specifying the particular way in which our service will handle the speech request. Unfortunately, for the on-prem containers we have to specify the full URI (since it includes local machine), so this information leaked from the abstraction. We are working with the SDK team to make this more usable in the future.

<br>
</details>

<details>
<summary>
<b>How can we benchmark a rough measure of transactions/second/core?</b>
</summary>

**Answer:** Here are some of the rough numbers to expect from existing model (will change for the better in the one we will ship in GA):

- For files, the throttling will be in the speech SDK, at 2x. First five seconds of audio are not throttled. Decoder is capable of doing about 3x real time. For this, the overall CPU usage will be close to 2 cores for a single recognition.
- For mic, it will be at 1x real time. The overall usage should be at about 1 core for a single recognition.

This can all be verified from the docker logs. We actually dump the line with session and phrase/utterance statistics, and that includes the RTF numbers.


<br>
</details>

<details>
<summary>
<b>Is it common to split audio files into chucks for Speech container usage?</b>
</summary>

My current plan is to take an existing audio file and split it up into 10 second chunks and send those through the container. Is that an acceptable scenario?  Is there a better way to process larger audio files with the container?

**Answer:** Just use the speech SDK and give it the file, it will do the right thing. Why do you need to chunk the file?


<br>
</details>

<details>
<summary>
<b>How do I make multiple containers run on the same host?</b>
</summary>

The doc says to expose a different port, which I do, but the LUIS container is still listening on port 5000?

**Answer:** Try `-p <outside_unique_port>:5000`. For example, `-p 5001:5000`.


<br>
</details>

## Technical questions

<details>
<summary>
<b>How can I get non-batch APIs to handle audio &lt;15 seconds long?</b>
</summary>

**Answer:** `RecognizeOnce()` in interactive mode only processes up to 15 seconds of audio, as the mode is intended for Speech Commanding where utterances are expected to be short. If you use `StartContinuousRecognition()` for dictation or conversation, there is no 15 second limit.


<br>
</details>

<details>
<summary>
<b>What are the recommended resources, CPU and RAM; for 50 concurrent requests?</b>
</summary>

How many concurrent requests will a 4 core, 4 GB RAM handle? If we have to serve for example, 50 concurrent requests, how many Core and RAM is recommended?

**Answer:** 
At real time, 8 with our latest `en-US`, so we recommend using more docker containers beyond 6 concurrent requests. It gets crazier beyond 16 cores, and it becomes non-uniform memory access (NUMA) node sensitive. The following table describes the minimum and recommended allocation of resources for each Speech container.

# [Speech-to-text](#tab/stt)

| Container      | Minimum             | Recommended         |
|----------------|---------------------|---------------------|
| Speech-to-text | 2 core, 2-GB memory | 4 core, 4-GB memory |

# [Custom Speech-to-text](#tab/cstt)

| Container             | Minimum             | Recommended         |
|-----------------------|---------------------|---------------------|
| Custom Speech-to-text | 2 core, 2-GB memory | 4 core, 4-GB memory |

# [Text-to-speech](#tab/tts)

| Container      | Minimum             | Recommended         |
|----------------|---------------------|---------------------|
| Text-to-speech | 1 core, 2-GB memory | 2 core, 3-GB memory |

# [Custom Text-to-speech](#tab/ctts)

| Container             | Minimum             | Recommended         |
|-----------------------|---------------------|---------------------|
| Custom Text-to-speech | 1 core, 2-GB memory | 2 core, 3-GB memory |

***

- Each core must be at least 2.6 GHz or faster.
- For files, the throttling will be in the Speech SDK, at 2x (first 5 seconds of audio are not throttled).
- The decoder is capable of doing about 2-3x real time. For this, the overall CPU usage will be close to two cores for a single recognition. That's why we do not recommend keeping more than two active connections, per container instance. The extreme side would be to put about 10 decoders at 2x real time in an eight core machine like `DS13_V2`. For the container version 1.3 and later, there's a param you could try setting `DECODER_MAX_COUNT=20`.
- For microphone, it will be at 1x real time. The overall usage should be at about one core for a single recognition.

Consider the total number of hours of audio you have. If the number is large, to improve reliability/availability, we suggest running more instances of containers, either on a single box or on multiple boxes, behind a load balancer. Orchestration could be done using Kubernetes (K8S) and Helm, or with Docker compose.

As an example, to handle 1000 hours/24 hours, we have tried setting up 3-4 VMs, with 10 instances/decoders per VM.

<br>
</details>

<details>
<summary>
<b>Does the Speech container support punctuation?</b>
</summary>

**Answer:** We have capitalization (ITN) available in the on-prem container. Punctuation is language-dependent, and not supported for some languages, including Chinese and Japanese.

We *do* have implicit and basic punctuation support for the existing containers, but it is `off` by default. What that means is that you can get the `.` character in your example, but not the `。` character. To enable this implicit logic, here's an example of how to do so in Python using our Speech SDK (it would be similar in other languages):

```python
speech_config.set_service_property(
    name='punctuation',
    value='implicit',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
```

<br>
</details>

<details>
<summary>
<b>Why am I getting 404 errors when attempting to POST data to speech-to-text container?</b>
</summary>

Here is an example HTTP POST:

```http
POST /speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000
Transfer-Encoding: chunked
User-Agent: PostmanRuntime/7.18.0
Cache-Control: no-cache
Postman-Token: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Host: 10.0.75.2:5000
Accept-Encoding: gzip, deflate
Content-Length: 360044
Connection: keep-alive
HTTP/1.1 404 Not Found
Date: Tue, 22 Oct 2019 15:42:56 GMT
Server: Kestrel
Content-Length: 0
```

**Answer:** We do not support REST API in either speech-to-text container, we only support WebSockets through the Speech SDK. Always refer to the official documentation, see [query prediction endpoints](speech-container-howto.md#query-the-containers-prediction-endpoint).

<br>
</details>

<details>
<summary>
<b>When using the speech-to-text service, why am I getting this error?</b>
</summary>

```cmd
Error in STT call for file 9136835610040002161_413008000252496:
{
    "reason": "ResultReason.Canceled",
    "error_details": "Due to service inactivity the client buffer size exceeded. Resetting the buffer. SessionId: xxxxx..."
}
```

**Answer:** This typically happens when you feed the audio faster than the Speech recognition container can take it. Client buffers fill up, and the cancellation is triggered. You need to control the concurrency and the RTF at which you send the audio.

<br>
</details>

<details>
<summary>
<b>Could you explain these text-to-speech container errors from the C++ examples?</b>
</summary>

**Answer:** If the container version is older than 1.3, then this code should be used:

```cpp
const auto endpoint = "http://localhost:5000/speech/synthesize/cognitiveservices/v1";
auto config = SpeechConfig::FromEndpoint(endpoint);
auto synthesizer = SpeechSynthesizer::FromConfig(config);
auto result = synthesizer->SpeakTextAsync("{{{text1}}}").get();
```

Older containers don't have the required endpoint for Carbon to work with the `FromHost` API. If the containers used for version 1.3, then this code should be used:

```cpp
const auto host = "http://localhost:5000";
auto config = SpeechConfig::FromHost(host);
config->SetSpeechSynthesisVoiceName(
    "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)");
auto synthesizer = SpeechSynthesizer::FromConfig(config);
auto result = synthesizer->SpeakTextAsync("{{{text1}}}").get();
```

Below is an example of using the `FromEndpoint` API:

```cpp
const auto endpoint = "http://localhost:5000/cognitiveservices/v1";
auto config = SpeechConfig::FromEndpoint(endpoint);
config->SetSpeechSynthesisVoiceName(
    "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)");
auto synthesizer = SpeechSynthesizer::FromConfig(config);
auto result = synthesizer->SpeakTextAsync("{{{text2}}}").get();
```

 The `SetSpeechSynthesisVoiceName` function is called because the containers with an updated text-to-speech engine require the voice name.

<br>
</details>

<details>
<summary>
<b>How can I use v1.7 of the Speech SDK with a Speech container?</b>
</summary>

**Answer:** There are three endpoints on the Speech container for different usages, they're defined as Speech modes - see below:

[!INCLUDE [speech-modes](includes/speech-modes.md)]

They are for different purposes and are used differently.

Python [samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py):
- For single recognition (interactive mode) with a custom endpoint (that is; `SpeechConfig` with an endpoint parameter), see `speech_recognize_once_from_file_with_custom_endpoint_parameters()`.
- For continuous recognition (conversation mode), and just modify to use a custom endpoint as above, see `speech_recognize_continuous_from_file()`.
- To enable dictation in samples like above (only if you really need it), right after you create `speech_config`, add code `speech_config.enable_dictation()`.

In C# to enable dictation, invoke the `SpeechConfig.EnableDictation()` function.

### `FromEndpoint` APIs
| Language | API details |
|----------|:------------|
| C++ | <a href="https://docs.microsoft.com/en-us/cpp/cognitive-services/speech/speechconfig#fromendpoint" target="_blank">`SpeechConfig::FromEndpoint` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| C# | <a href="https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromendpoint?view=azure-dotnet" target="_blank">`SpeechConfig.FromEndpoint` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Java | <a href="https://docs.microsoft.com/java/api/com.microsoft.cognitiveservices.speech.speechconfig.fromendpoint?view=azure-java-stable" target="_blank">`SpeechConfig.fromendpoint` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Objective-C | <a href="https://docs.microsoft.com/en-us/objectivec/cognitive-services/speech/spxspeechconfiguration#initwithendpoint" target="_blank">`SPXSpeechConfiguration:initWithEndpoint;` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Python | <a href="https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python" target="_blank">`SpeechConfig;` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| JavaScript | Not currently supported, nor is it planned. |

<br>
</details>

<details>
<summary>
<b>How can I use v1.8 of the Speech SDK with a Speech container?</b>
</summary>

**Answer:** There's a new `FromHost` API. This does not replace or modify any existing APIs. It just adds an alternative way to create a speech config using a custom host.

### `FromHost` APIs

| Language | API details |
|--|:-|
| C# | <a href="https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromhost?view=azure-dotnet" target="_blank">`SpeechConfig.FromHost` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| C++ | <a href="https://docs.microsoft.com/en-us/cpp/cognitive-services/speech/speechconfig#fromhost" target="_blank">`SpeechConfig::FromHost` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Java | <a href="https://docs.microsoft.com/java/api/com.microsoft.cognitiveservices.speech.speechconfig.fromhost?view=azure-java-stable" target="_blank">`SpeechConfig.fromHost` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Objective-C | <a href="https://docs.microsoft.com/en-us/objectivec/cognitive-services/speech/spxspeechconfiguration#initwithhost" target="_blank">`SPXSpeechConfiguration:initWithHost;` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| Python | <a href="https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python" target="_blank">`SpeechConfig;` <span class="docon docon-navigate-external x-hidden-focus"></span></a> |
| JavaScript | Not currently supported |

> Parameters: host (mandatory), subscription key (optional, if you can use the service without it).

Format for host is `protocol://hostname:port` where `:port` is optional (see below):
- If the container is running locally, the hostname is `localhost`.
- If the container is running on a remote server, use the hostname or IPv4 address of that server.

Host parameter examples for speech-to-text:
- `ws://localhost:5000` - non-secure connection to a local container using port 5000
- `ws://some.host.com:5000` - non-secure connection to a container running on a remote server

Python samples from above, but use `host` parameter instead of `endpoint`:

```python
speech_config = speechsdk.SpeechConfig(host="ws://localhost:5000")
```

<br>
</details>

## Next steps

> [!div class="nextstepaction"]
> [Cognitive Services containers](speech-container-howto.md)
