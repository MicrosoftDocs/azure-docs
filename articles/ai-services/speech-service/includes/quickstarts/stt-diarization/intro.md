---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 05/08/2023
ms.author: eur
---

In this quickstart, you run an application for speech to text transcription with real-time diarization. Here, diarization is distinguishing between the different speakers participating in the conversation. The Speech service provides information about which speaker was speaking a particular part of transcribed speech. 

> [!NOTE]
> Real-time diarization is currently in public preview. 

The speaker information is included in the result in the speaker ID field. The speaker ID is a generic identifier assigned to each conversation participant by the service during the recognition as different speakers are being identified from the provided audio content. 

> [!TIP]
> You can try real-time speech-to-text in [Speech Studio](https://aka.ms/speechstudio/speechtotexttool) without signing up or writing any code. However, the Speech Studio doesn't yet support diarization.