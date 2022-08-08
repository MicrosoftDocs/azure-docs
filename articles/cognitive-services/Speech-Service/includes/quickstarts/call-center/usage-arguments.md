---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/02/2022
ms.author: eur
---

> [!IMPORTANT]
> You can use a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Cognitive Services multi-service</a> resource or separate <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> and <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resources. In either case, the `--languageKey` and `--languageEndpoint` values must correspond to a resource that's in one of the regions supported by the [conversation summarization API](https://aka.ms/convsumregions). 

Connection options include:

- `--speechKey KEY`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Cognitive Services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resource key. Required.
- `--speechRegion REGION`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Cognitive Services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resource region. Required. Examples: `eastus`, `northeurope`

- `--languageKey KEY`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Cognitive Services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> resource key. Required.
- `--languageEndpoint ENDPOINT`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Cognitive Services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> resource endpoint. Required. Example: `https://YourResourceName.cognitiveservices.azure.com`

Input options include:

- `--input URL`: Input audio from URL. Required. 
- `--stereo`: Use stereo audio format. If stereo isn't specified, then mono 16khz 16 bit PCM wav files are assumed. Diarization of mono files is used to separate multiple speakers. Diarization of stereo files is not supported, since 2-channel stereo files should already have one speaker per channel.
- `--certificate`: The PEM certificate file. Required for C++. 

Language options include:

- `--language LANGUAGE`: The language to use for sentiment analysis and conversation analysis. This value should be a two-letter ISO 639-1 code. The default value is `en`.
- `--locale LOCALE`: The locale to use for batch transcription of audio. The default value is `en-US`.

Output options include:

- `--help`: Show the usage help and stop
- `--output FILE`: Output the phrase list and conversation summary to a text file. The default console output is a combination of the JSON responses from the [batch transcription](/azure/cognitive-services/speech-service/batch-transcription) (Speech), [sentiment](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview) (Language), and [conversation summarization](/azure/cognitive-services/language-service/summarization/overview?tabs=conversation-summarization) (Language) APIs. If you specify `--output FILE`, a better formatted version of the results is written to the file. 
