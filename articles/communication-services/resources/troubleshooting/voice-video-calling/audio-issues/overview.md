---
title: Audio issues - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of audio issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of audio issues
Audio quality is important in conference calls. If any participants on a call can’t hear each other well enough, then the participants likely leave the call.
To establish a voice call with good quality, several factors must be considered. These factors include:

- The users granted the microphone permission
- The users microphone is working properly
- The network conditions are good enough on sending and receiving ends
- The audio output level is functioning properly

All of these factors are important from an end-to-end perspective.

Device and network issues are considered external problems from the perspective of the ACS Calling SDK. Your application should integrate the [User Facing Diagnostics API](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) to monitor device and network issues and display warning messages accordingly. In this way, users are aware of the issue and can troubleshoot on their own.

## Common issues in audio calls
Here we list several common audio issues, along with potential causes for each issue:

### The user can't hear sound during the call
* There's a problem on the microphone of the speaking participant.
* There's a problem on the audio output device of the user.
* There's a network issue in the call

### The user experiences poor audio quality
* The audio sender has poor network connectivity.
* The receiver has poor network connectivity.

### The user experiences delays during the call
* The round trip time is large between the sender and the receiver.
* Other network issues.

### The user experiences echo during the call
* The browser's acoustic echo canceler isn't able to remove the echo on the audio sender's side.

### The volume of the incoming audio is low
* There's a low volume of outgoing audio on the sender's side.
* There's an issue with the speaker or audio volume settings on the receiver's side
