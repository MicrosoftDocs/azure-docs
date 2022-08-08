---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/02/2022
ms.author: eur
---

Now that you've completed the quickstart, here are some additional considerations:

- Azure storage account: For storing telephony data and the transcripts that are returned by the Batch Transcription API. This storage account should use notifications, specifically for when new files are added. These notifications are used to trigger the transcription process. 
- Azure Functions: For creating the shared access signature (SAS) URI for each recording, and triggering the HTTP POST request to start a transcription. Additionally, you use Azure Functions to create requests to retrieve and delete transcriptions by using the Batch Transcription API. 

