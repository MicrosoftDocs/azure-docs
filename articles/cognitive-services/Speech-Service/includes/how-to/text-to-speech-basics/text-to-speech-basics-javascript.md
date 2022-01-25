---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/15/2022
ms.author: eur
ms.custom: devx-track-js
---

In this quickstart, you learn common design patterns for doing text-to-speech synthesis by using the Speech SDK. You start by doing basic configuration and synthesis. You then move on to more advanced examples for custom application development, including:

* Getting responses as in-memory streams.
* Customizing output sample rate and bit rate.
* Submitting synthesis requests by using Speech Synthesis Markup Language (SSML).

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [JavaScript quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node/text-to-speech) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and a Speech service resource. If you don't have an account and a resource, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

### Install the Speech SDK

Before you can do anything, you need to install the <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">Speech SDK for JavaScript</a>. See the [instructions](../../../speech-sdk.md?tabs=browser#get-the-speech-sdk).

Additionally, depending on the target environment, use one of the following elements:

# [script](#tab/script)

Download and extract the <a href="https://aka.ms/csspeech/jsbrowserpackage" target="_blank">Speech SDK for JavaScript </a> *microsoft.cognitiveservices.speech.sdk.bundle.js* file. Place it in a folder that your HTML file can access.

```html
<script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser and using the `<script>` tag, the `sdk` prefix is not needed. The `sdk` prefix is an alias that's used to name the `require` module.

# [import](#tab/import)

```javascript
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
```

For more information on `import`, see <a href="https://javascript.info/import-export" target="_blank">Export and Import</a> on the JavaScript website.

# [require](#tab/require)

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see <a href="https://nodejs.org/en/knowledge/getting-started/what-is-require/" target="_blank">What is require?</a> on the Node.js website.

---


## Create a speech configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechConfig`](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig) instance. This class includes information about your resource, like your speech key and associated location/region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

You can initialize `SpeechConfig` in a few ways:

* With a resource: pass in a speech key and the associated location/region.
* With an endpoint: pass in a Speech service endpoint. A speech key or authorization token is optional.
* With a host: pass in a host address. A speech key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated location/region.

In this example, you create a `SpeechConfig` instance by using a speech key and location/region. Get these credentials by following the steps in [Try the Speech service for free](../../../overview.md#try-the-speech-service-for-free). You also create some basic boilerplate code to use for the rest of this article, which you modify for different customizations.

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
}

synthesizeSpeech();
```

## Select synthesis language and voice

The text-to-speech feature in the Azure Speech service supports more than 270 voices and more than 110 languages and variants. You can get the [full list](../../../language-support.md#prebuilt-neural-voices) or try them in a [text-to-speech demo](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

Specify the language or voice of `SpeechConfig` to match your input text and use the wanted voice:

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    // Note: if only language is set, the default voice of that language is chosen.
    speechConfig.speechSynthesisLanguage = "<your-synthesis-language>"; // For example, "de-DE"
    // The voice setting will overwrite the language setting.
    // The voice setting will not overwrite the voice element in input SSML.
    speechConfig.speechSynthesisVoiceName = "<your-wanted-voice>";
}

synthesizeSpeech();
```

## Synthesize to speaker output

In some cases, you might want to output synthesized speech directly to a speaker. To do this, instantiate `AudioConfig` by using the `fromDefaultSpeakerOutput()` static function. This action outputs to the current active output device.

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(
        "Synthesizing directly to speaker output.",
        result => {
            if (result) {
                synthesizer.close();
                return result.audioData;
            }
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}
```

Run the program. A synthesized audio is played from the speaker. This is a good example of the most basic usage. Next, you look at customizing output and handling the output response as an in-memory stream for working with custom scenarios.

## Get a result as an in-memory stream

For many scenarios in speech application development, you likely need the resulting audio data as an in-memory stream rather than directly writing to a file. This will allow you to build custom behavior, including:

* Abstract the resulting byte array as a seekable stream for custom downstream services.
* Integrate the result with other APIs or services.
* Modify the audio data, write custom `.wav` headers, and do related tasks.

It's simple to make this change from the previous example. First, remove the `AudioConfig` block, because you'll manage the output behavior manually from this point onward for increased control. Then pass `null` for `AudioConfig` in the `SpeechSynthesizer` constructor.

> [!NOTE]
> Passing `null` for `AudioConfig`, rather than omitting it as you did in the previous speaker output example, will not play the audio by default on the current active output device.

This time, you save the result to a [`SpeechSynthesisResult`](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisresult) variable. The `SpeechSynthesisResult.audioData` property returns an `ArrayBuffer` value of the output data, the default browser stream type. For server-side code, convert `ArrayBuffer` to a buffer stream.

The following code works for the client side:

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
        "Getting the response as an in-memory stream.",
        result => {
            synthesizer.close();
            return result.audioData;
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}
```

From here, you can implement any custom behavior by using the resulting `ArrayBuffer` object. `ArrayBuffer` is a common type to receive in a browser and play from this format.

For any server-based code, if you need to work with the data as a stream, you need to convert the `ArrayBuffer` object into a stream:

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
        "Getting the response as an in-memory stream.",
        result => {
            const { audioData } = result;

            synthesizer.close();

            // convert arrayBuffer to stream
            // return stream
            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            return bufferStream;
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}
```

## Customize audio format

You can customize audio output attributes, including:

* Audio file type
* Sample rate
* Bit depth

To change the audio format, you use the `speechSynthesisOutputFormat` property on the `SpeechConfig` object. This property expects an `enum` instance of type [`SpeechSynthesisOutputFormat`](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat), which you use to select the output format. See the [list of audio formats](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechsynthesisoutputformat) that are available.

There are various options for different file types, depending on your requirements. By definition, raw formats like `Raw24Khz16BitMonoPcm` don't include audio headers. Use raw formats only in one of these situations:

- You know that your downstream implementation can decode a raw bitstream.
- You plan to manually build headers based on factors like bit depth, sample rate, and number of channels.

In this example, you specify the high-fidelity RIFF format `Riff24Khz16BitMonoPcm` by setting `speechSynthesisOutputFormat` on the `SpeechConfig` object. Similar to the example in the previous section, get the audio `ArrayBuffer` data and interact with it.

```javascript
function synthesizeSpeech() {
    const speechConfig = SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");

    // Set the output format
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);
    synthesizer.speakTextAsync(
        "Customizing audio output format.",
        result => {
            // Interact with the audio ArrayBuffer data
            const audioData = result.audioData;
            console.log(`Audio data byte size: ${audioData.byteLength}.`)

            synthesizer.close();
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}
```

## Use SSML to customize speech characteristics

You can use SSML to fine-tune the pitch, pronunciation, speaking rate, volume, and more in the text-to-speech output by submitting your requests from an XML schema. This section shows an example of changing the voice. For a more detailed guide, see the [SSML how-to article](../../../speech-synthesis-markup.md).

To start using SSML for customization, you make a simple change that switches the voice.

First, create a new XML file for the SSML configuration in your root project directory. In this example, it's `ssml.xml`. The root element is always `<speak>`. Wrapping the text in a `<voice>` element allows you to change the voice by using the `name` parameter. See the [full list](../../../language-support.md#prebuilt-neural-voices) of supported *neural* voices.

```xml
<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    When you're on the freeway, it's a good idea to use a GPS.
  </voice>
</speak>
```

Next, you need to change the speech synthesis request to reference your XML file. The request is mostly the same, but instead of using the `speakTextAsync()` function, you use `speakSsmlAsync()`. This function expects an XML string, so first you create a function to load an XML file and return it as a string:

```javascript
function xmlToString(filePath) {
    const xml = readFileSync(filePath, "utf8");
    return xml;
}
```

For more information on `readFileSync`, see <a href="https://nodejs.org/api/fs.html#fs_fs_readlinksync_path_options" target="_blank">Node.js file system</a>. From here, the result object is exactly the same as previous examples:

```javascript
function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    const ssml = xmlToString("ssml.xml");
    synthesizer.speakSsmlAsync(
        ssml,
        result => {
            if (result.errorDetails) {
                console.error(result.errorDetails);
            } else {
                console.log(JSON.stringify(result));
            }

            synthesizer.close();
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
}
```

> [!NOTE]
> To change the voice without using SSML, you can set the property on `SpeechConfig` by using `SpeechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";`.

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions. [Visemes](../../../how-to-speech-synthesis-viseme.md) are often used to represent the key poses in observed speech. Key poses include the position of the lips, jaw, and tongue in producing a particular phoneme.

You can subscribe to viseme events in the Speech SDK. Then, you can apply viseme events to animate the face of a character as speech audio plays. Learn [how to get viseme events](../../../how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).
