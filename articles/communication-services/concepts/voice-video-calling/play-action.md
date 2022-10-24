---
title: Play action
description: Conceptual information about using Play action with Call Automation.
author: Kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: kpunjabi
ms.custom: private_preview
---
# Play Action Overview

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

The play action provided through the call automation SDK allows you to play audio prompts to participants in the call. This action can be accessed through the server-side implementation of your application. The play action allows you to provide ACS access to your pre-recorded audio files with support for authentication. 

> [!NOTE]
> ACS currently only supports WAV files formatted as mono channel audio recorded at 16KHz.

The Play action allows you to provide access to a pre-recorded audio file of WAV format that ACS can access with support for authentication.

## Common use cases 

The play action can be used in many ways, below are some examples of how developers may wish to use the play action in their applications. 

### Announcements
Your application might want to play some sort of announcement when a participant joins or leaves the call, to notify other users.

### Self-serve customers

In scenarios with IVRs and virtual assistants, you can use your application or bots to play audio prompts to callers, this prompt can be in the form of a menu to guide the caller through their interaction.

### Hold music
The play action can also be used to play hold music for callers. This action can be set up in a loop so that the music keeps playing until an agent is available to assist the caller.

### Playing compliance messages
As part of compliance requirements in various industries, vendors are expected to play legal or compliance messages to callers, for example, “This call will be recorded for quality purposes”.

## How the play action workflow looks

![Screenshot of flow for play action.](./media/play-action-flow.png)

## Known Issues/Limitations
- Play action isn't enabled to work with Teams Interoperability.
- Play won't support loop for targeted playing.

## What's coming up next for Play action
As we invest more into this functionality, we recommend developers sign up to our TAP program that allows you to get early access to the newest feature releases. Over the coming months the play action will add new capabilities that use our integration with Azure Cognitive Services to provide AI capabilities such as Text-to-Speech and fine tuning Text-to-Speech with SSML. With these capabilities, you can improve customer interactions to create more personalized messages.

## Next Steps
Check out the [Play action quickstart](../../quickstarts/voice-video-calling/Play-Action.md) to learn more.
