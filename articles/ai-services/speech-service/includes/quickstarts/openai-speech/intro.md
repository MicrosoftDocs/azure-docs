---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/28/2023
ms.author: eur
---

> [!IMPORTANT]
> To complete the steps in this guide, access must be granted to Microsoft Azure OpenAI Service in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access).

In this how-to guide, you can use [Azure AI Speech](../../../overview.md) to converse with [Azure OpenAI Service](/azure/ai-services/openai/overview.md). The text recognized by the Speech service is sent to Azure OpenAI. The text response from Azure OpenAI is then synthesized by the Speech service.

Speak into the microphone to start a conversation with Azure OpenAI.
- The Speech service recognizes your speech and converts it into text (speech to text).
- Your request as text is sent to Azure OpenAI.
- The Speech service text to speech (TTS) feature synthesizes the response from Azure OpenAI to the default speaker.

Although the experience of this example is a back-and-forth exchange, Azure OpenAI doesn't remember the context of your conversation.
