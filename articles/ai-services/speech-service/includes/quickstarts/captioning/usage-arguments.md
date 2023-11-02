---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 05/03/2022
ms.author: eur
---

Connection options include:

- `--key`: Your Speech resource key. 
- `--region REGION`: Your Speech resource region. Examples: `westus`, `northeurope`

Input options include:

- `--input FILE`: Input audio from file. The default input is the microphone. 
- `--format FORMAT`: Use compressed audio format. Valid only with `--file`. Valid values are `alaw`, `any`, `flac`, `mp3`, `mulaw`, and `ogg_opus`. The default value is `any`. To use a `wav` file, don't specify the format. This option is not available with the JavaScript captioning sample. For compressed audio files such as MP4, install GStreamer and see [How to use compressed input audio](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md). 

Language options include:

- `--languages LANG1,LANG2`: Enable language identification for specified languages. For example: `en-US,ja-JP`. This option is only available with the C++, C#, and Python captioning samples. For more information, see [Language identification](~/articles/ai-services/speech-service/language-identification.md).

Recognition options include:

- `--recognizing`: Output `Recognizing` event results. The default output is `Recognized` event results only. These are always written to the console, never to an output file. The `--quiet` option overrides this. For more information, see [Get speech recognition results](~/articles/ai-services/speech-service/get-speech-recognition-results.md).

Accuracy options include:

- `--phrases PHRASE1;PHRASE2`: You can specify a list of phrases to be recognized, such as `Contoso;Jessie;Rehaan`. For more information, see [Improve recognition with phrase list](~/articles/ai-services/speech-service/improve-accuracy-phrase-list.md).

Output options include:

- `--help`: Show this help and stop
- `--output FILE`: Output captions to the specified `file`. This flag is required.
- `--srt`: Output captions in SRT (SubRip Text) format. The default format is WebVTT (Web Video Text Tracks). For more information about SRT and WebVTT caption file formats, see [Caption output format](~/articles/ai-services/speech-service/captioning-concepts.md#caption-output-format).
- `--quiet`: Suppress console output, except errors.
- `--profanity OPTION`: Valid values: raw, remove, mask. For more information, see [Profanity filter](~/articles/ai-services/speech-service/display-text-format.md#profanity-filter) concepts.
- `--threshold NUMBER`: Set stable partial result threshold. The default value is `3`. For more information, see [Get partial results](~/articles/ai-services/speech-service/captioning-concepts.md#get-partial-results) concepts.
