---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/28/2023
ms.author: eur
---

You can run this Python script to converse with Azure OpenAI. Although the experience is a back-and-forth exchange, Azure OpenAI doesn't remember the context of your conversation.

Speak into the microphone to start a conversation with OpenAI.
- Azure Cognitive Services Speech recognizes your speech and converts it into text (speech-to-text).
- Your request as text is sent to the Azure OpenAI service.
- Azure Cognitive Services Speech synthesizes (text-to-speech) the response from Azure OpenAI to the default speaker.

> [!IMPORTANT]
> To complete the steps in this guide, access must be granted to the Azure OpenAI service in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.