---
title: Media Streaming overview 
description: Conceptual information about using Media Streaming APIs with Call Automation.
author: Kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/25/2022
ms.author: kpunjabi
ms.custom: private_preview
---

# Media Streaming overview 

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Media Streaming API allows developers to get real-time access to media streams to capture, analyze and process audio content during active calls as we see in todays world consumption of live audio and video is very prevalent, this content could be in the forms of online meetings, online conferences, online schooling, customer support, etc. This consumption has only been exacerbated by the recent events of Covid-19, with many of the worlds work force working remotely from home. Developers can use audio from these media streams to enhance their applications and embed their own AI solutions into these calls in real-time for a more improved recommendations to their contact center agents.

## Common use cases
Audio streams can be used in many ways, below are some examples of how developers may wish to use the audio streams in their applications.

### Real-time call assistance

**Improved AI powered suggestions** - Use real-time audio streams of active interactions between agents and customers to gauge the intent of the call and how your agents can provide a better experience to their customer through active suggestions using your own AI model to analyze the call.

### Authentication
**Biometric authentication** – Use the audio streams to carry out authentication using caller biometrics such as voice recognition.

### Interpretations
**Real-time translation** – Use audio streams to send to human or AI translators who can consume this audio content and provide translations.

## How Media Streaming workflow looks

[IMAGE HERE]

## Supported formats

### Mixed format
Contains mixed audio of all participants on the call.

### Unmixed
Contains audio per participant per channel, up to four channels. 

## Additional information
The table below describes information that will help developers convert the media packets into audible content that can be used by their applications.
- Framerate: 50 frames per second
- Packet stream rate: 20ms rate
- Data packet: 64Kbytes
- Audio metric: 16-bit PCM mono at 16000hz
- Public string data is a base64 string that should be converted into a byte array to create raw pcm file. You can then use the following configuration in Audacity to run the file.



