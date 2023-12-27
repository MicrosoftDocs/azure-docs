---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

[!INCLUDE [SPX Setup](../../spx-setup-quick.md)]

## Recognize speech from a microphone

1. Run the following command to start speech recognition from a microphone:

   ```console
   spx recognize --microphone --source en-US
   ```

1. Speak into the microphone, and you see transcription of your words into text in real-time. The Speech CLI stops after a period of silence, 30 seconds, or when you select **Ctrl**+**C**.

   ```output
   Connection CONNECTED...
   RECOGNIZED: I'm excited to try speech to text.
   ```

## Remarks

Here are some other considerations:

- To recognize speech from an audio file, use `--file` instead of `--microphone`. For compressed audio files such as MP4, install GStreamer and use `--format`. For more information, see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

    # [Terminal](#tab/terminal)

    ```console
    spx recognize --file YourAudioFile.wav
    spx recognize --file YourAudioFile.mp4 --format any
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    spx recognize --file YourAudioFile.wav
    spx --% recognize --file YourAudioFile.mp4 --format any
    ```

    ***

- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/ai-services/speech-service/improve-accuracy-phrase-list.md). You include a phrase list in-line or with a text file along with the recognize command:

    # [Terminal](#tab/terminal)

    ```console
    spx recognize --microphone --phrases "Contoso;Jessie;Rehaan;"
    spx recognize --microphone --phrases @phrases.txt
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    spx --% recognize --microphone --phrases "Contoso;Jessie;Rehaan;"
    spx --% recognize --microphone --phrases @phrases.txt

    ```

    ***

- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, use `es-ES` for Spanish (Spain). If you don't specify a language, the default is `en-US`.

    ```console
    spx recognize --microphone --source es-ES
    ```

- For continuous recognition of audio longer than 30 seconds, append `--continuous`:

    ```console
    spx recognize --microphone --source es-ES --continuous
    ```

- Run this command for information about more speech recognition options such as file input and output:

    ```console
    spx help recognize
    ```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
