---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/02/2022
ms.author: eur
---

Connection options include:

- `--speechKey KEY`: Your Speech resource key. Required.
- `--speechRegion REGION`: Your Speech resource region. Required. Examples: `eastus`, `northeurope`

- `--languageKey KEY`: Your Language resource key. Required.
- `--languageEndpoint ENDPOINT`: Your Language resource endpoint. Required. Example: `https://YourResourceName.cognitiveservices.azure.com`, `northeurope`

>[!TIP]
> Instead of managing separate Speech and Language resource keys, you can create one Cognitive Services [multi-service resource](/azure/cognitive-services/cognitive-services-apis-create-account.md?tabs=multiservice#create-a-new-azure-cognitive-services-resource). 
> 
> Whether you use a multi-service resource or a single-service resource, the `--languageKey` and `--languageEndpoint` values must correspond to one of the [regions supported by the conversation summarization API](https://aka.ms/convsumregions). 

Input options include:

- `--input URL`: Input audio from URL. Required. 
- `--stereo`: Use stereo audio format. If this is not specified, mono is assumed. 
- `--certificate`: The PEM certificate file. Required for C++. 

Language options include:

- `--language LANGUAGE`: The language to use for sentiment analysis and conversation analysis. This should be a two-letter ISO 639-1 code. The default value is `en`.
- `--locale LOCALE`: The locale to use for batch transcription of audio. The default value is `en-US`.

Output options include:

- `--help`: Show this help and stop
- `--output FILE`: Output the phrase list and conversation summary to a text file. The default console output is a combination of the JSON responses from the batch transcription (Speech), sentiment (Language), and conversation summarization (Language) APIs. If you specify --output FILE, a better formatted version of the results are written to the file. 
