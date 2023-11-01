---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 06/08/2022
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

[!INCLUDE [SPX Setup](../../spx-setup-quick.md)]

## Translate speech from a microphone

Run the following command to translate speech from the microphone from English to Italian:

```shell
spx translate --source en-US --target it --microphone
```

Speak into the microphone, and you see the transcription of your translated speech in real-time. The Speech CLI stops after a period of silence, 30 seconds, or when you press Ctrl+C.

```console
Connection CONNECTED...
TRANSLATING into 'it': Sono (from 'I'm')
TRANSLATING into 'it': Sono entusiasta (from 'I'm excited to')
TRANSLATING into 'it': Sono entusiasta di provare la parola (from 'I'm excited to try speech')
TRANSLATED into 'it': Sono entusiasta di provare la traduzione vocale. (from 'I'm excited to try speech translation.')
```

## Remarks
Now that you've completed the quickstart, here are some additional considerations:

- To get speech from an audio file, use `--file` instead of `--microphone`. For compressed audio files such as MP4, install GStreamer and use `--format`. For more information, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).
    # [Terminal](#tab/terminal)
    ```console
    spx translate --source en-US --target it --file YourAudioFile.wav
    spx translate --source en-US --target it --file YourAudioFile.mp4 --format any
    ```
    # [PowerShell](#tab/powershell)
    ```powershell
    spx translate --source en-US --target it --file YourAudioFile.wav
    spx translate --source en-US --target it --file YourAudioFile.mp4 --format any
    ```
    ***
- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/ai-services/speech-service/improve-accuracy-phrase-list.md). You include a phrase list in-line or with a text file:
    # [Terminal](#tab/terminal)
    ```console
    spx translate --source en-US --target it --microphone --phrases "Contoso;Jessie;Rehaan;"
    spx translate --source en-US --target it --microphone --phrases @phrases.txt
    ```
    # [PowerShell](#tab/powershell)
    ```powershell
    spx --% translate --source en-US --target it --microphone --phrases "Contoso;Jessie;Rehaan;"
    spx --% translate --source en-US --target it --microphone --phrases @phrases.txt
    ```
    ***
- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md?tabs=stt#supported-languages). Specify the full locale with a dash (`-`) separator. For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language.
    ```console
    spx translate --microphone --source es-ES
    ```
- To change the translation target language, replace `it` with another [supported language](~/articles/ai-services/speech-service/language-support.md?tabs=speech-translation#supported-languages). With few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. The default language is `en` if you don't specify a language.
    ```console
    spx translate --microphone --target es
    ```
- For continuous recognition of audio longer than 30 seconds, append `--continuous`:
    ```console
    spx translate --source en-US --target it --microphone --continuous
    ```

Run this command for information about additional speech translation options such as file input and output:
```console
spx help translate
```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
