---
title: Playing audio in call
titleSuffix: An Azure Communication Services concept document
description: Conceptual information about playing audio in call using Call Automation.
author: Kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/11/2023
ms.author: kpunjabi
---

# Playing audio in call

The play action provided through the Azure Communication Services Call Automation SDK allows you to play audio prompts to participants in the call. This action can be accessed through the server-side implementation of your application. You can play audio to call participants through one of two methods;
- Providing Azure Communication Services access to prerecorded audio files of WAV format, that Azure Communication Services can access with support for authentication
- Regular text that can be converted into speech output through the integration with Azure AI services.

You can use the newly announced integration between [Azure Communication Services and Azure AI services](./azure-communication-services-azure-cognitive-services-integration.md) to play personalized responses using Azure [Text-To-Speech](../../../../articles/cognitive-services/Speech-Service/text-to-speech.md). You can use human like prebuilt neural voices out of the box or create custom neural voices that are unique to your product or brand. For more information on supported voices, languages and locales see [Language and voice support for the Speech service](../../../../articles/cognitive-services/Speech-Service/language-support.md). (Supported in public preview)

> [!NOTE]
> Azure Communication Services currently supports two file formats, MP3 files and WAV files formatted as 16-bit PCM mono channel audio recorded at 16KHz. You can create your own audio files using [Speech synthesis with Audio Content Creation tool](../../../ai-services/Speech-Service/how-to-audio-content-creation.md). 

## Prebuilt Neural Text to Speech voices
Microsoft uses deep neural networks to overcome the limits of traditional speech synthesis with regard to stress and intonation in spoken language. Prosody prediction and voice synthesis occur simultaneously, resulting in a more fluid and natural sounding output. You can use these neural voices to make interactions with your chatbots and voice assistants more natural and engaging. There are over 100 prebuilt voices to choose from. Learn more about [Azure Text-to-Speech voices](../../../../articles/cognitive-services/Speech-Service/language-support.md).

## Common use cases 

The play action can be used in many ways, some examples of how developers may wish to use the play action in their applications are listed here. 

### Announcements
Your application might want to play some sort of announcement when a participant joins or leaves the call, to notify other users.

### Self-serve customers

In scenarios with IVRs and virtual assistants, you can use your application or bots to play audio prompts to callers, this prompt can be in the form of a menu to guide the caller through their interaction.

### Hold music
The play action can also be used to play hold music for callers. This action can be set up in a loop so that the music keeps playing until an agent is available to assist the caller.

### Playing compliance messages
As part of compliance requirements in various industries, vendors are expected to play legal or compliance messages to callers, for example, “This call is recorded for quality purposes.”.

## Sample architecture for playing audio in call using Text-To-Speech (Public preview)

![Diagram showing sample architecture for Play with AI.](./media/play-ai.png)

## Sample architecture for playing audio in a call

![Screenshot of flow for play action.](./media/play-action.png)

## Known limitations
- Play action isn't enabled to work with Teams Interoperability.

## Next Steps
- Check out our how-to guide to learn [how-to play custom voice prompts](../../how-tos/call-automation/play-action.md) to users.
- Learn about [usage and operational logs](../analytics/logs/call-automation-logs.md) published by call automation.
- Learn about [gathering customer input](./recognize-action.md).
