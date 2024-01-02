---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/29/2022
ms.author: eur
---

> [!IMPORTANT]
> You can use a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create an Azure AI services resource"  target="_blank">multi-service</a> resource or separate <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> and <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resources. In either case, the `--languageKey` and `--languageEndpoint` values must correspond to a resource that's in one of the regions supported by the [conversation summarization API](https://aka.ms/convsumregions): `eastus`, `northeurope`, and `uksouth`.  

Connection options include:

- `--speechKey KEY`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create an Azure AI services resource"  target="_blank">Azure AI services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resource key. Required for audio transcriptions with the `--input` from URL option.
- `--speechRegion REGION`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create an Azure AI services resource"  target="_blank">Azure AI services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resource region. Required for audio transcriptions with the `--input` from URL option. Examples: `eastus`, `northeurope`

- `--languageKey KEY`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create an Azure AI services resource"  target="_blank">Azure AI services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> resource key. Required.
- `--languageEndpoint ENDPOINT`: Your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create an Azure AI services resource"  target="_blank">Azure AI services</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> resource endpoint. Required. Example: `https://YourResourceName.cognitiveservices.azure.com`

Input options include:

- `--input URL`: Input audio from URL. You must set either the `--input` or `--jsonInput` option. 
- `--jsonInput FILE`: Input an existing batch transcription JSON result from FILE. With this option, you only need a Language resource to process a transcription that you already have. With this option, you don't need an audio file or a Speech resource. Overrides `--input`. You must set either the `--input` or `--jsonInput` option.
- `--stereo`: Indicates that the audio via ```input URL` should be in stereo format. If stereo isn't specified, then mono 16khz 16 bit PCM wav files are assumed. Diarization of mono files is used to separate multiple speakers. Diarization of stereo files isn't supported, since 2-channel stereo files should already have one speaker per channel.
- `--certificate`: The PEM certificate file. Required for C++. 

Language options include:

- `--language LANGUAGE`: The language to use for sentiment analysis and conversation analysis. This value should be a two-letter ISO 639-1 code. The default value is `en`.
- `--locale LOCALE`: The locale to use for batch transcription of audio. The default value is `en-US`.

Output options include:

- `--help`: Show the usage help and stop
- `--output FILE`: Output the transcription, sentiment, conversation PII, and conversation summaries in JSON format to a text file. For more information, see [output examples](../../../call-center-quickstart.md#check-results).
