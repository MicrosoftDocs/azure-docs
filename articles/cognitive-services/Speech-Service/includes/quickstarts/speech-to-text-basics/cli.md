---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CLI&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

[!INCLUDE [SPX Setup](../../spx-setup.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CLI&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Recognize speech from a microphone

Run the following command to start speech recognition from a microphone:

```console
spx recognize --microphone --source en-US
```

Speak into the microphone, and you see transcription of your words into text in real time. The Speech CLI stops after a period of silence, or when you press Ctrl+C.

```console
Connection CONNECTED...
RECOGNIZED: Text=I'm excited to try speech to text.
```

This example uses the `RecognizeOnceAsync` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/cognitive-services/speech-service/how-to-recognize-speech.md).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=CLI&Pillar=Speech&Product=speech-to-text&Page=quickstart&Section=Recognize-speech-from-a-microphone" target="_target">I ran into an issue</a>

Now that you've transcribed speech to text, here are some suggested modifications to try out:
- To recognize speech from an audio file, use `--file` instead of `--microphone`:
    ```console
    spx recognize --file YourAudioFile.wav
    ```
- To improve recognition accuracy of specific words or utterances, use a [phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md). You include a phrase list in-line or with a text file along with the recognize command:
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
- To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language.
    ```csharp
    spx recognize --microphone --source es-ES
    ```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
