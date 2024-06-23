---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/30/2024
ms.author: eur
---

In this quickstart, you run an application for speech to text transcription with real-time diarization. Diarization distinguishes between the different speakers who participate in the conversation. The Speech service provides information about which speaker was speaking a particular part of transcribed speech. 

The speaker information is included in the result in the speaker ID field. The speaker ID is a generic identifier assigned to each conversation participant by the service during the recognition as different speakers are being identified from the provided audio content.

> [!TIP]
> You can try real-time speech to text in [Speech Studio](https://aka.ms/speechstudio/speechtotexttool) without signing up or writing any code. However, the Speech Studio doesn't yet support diarization.
