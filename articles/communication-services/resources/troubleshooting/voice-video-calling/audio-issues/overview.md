---
title: Audio issues - Overview
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Overview of audio issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Overview of audio issues
Voice calling is a basic and important function in conference calls, and it's more commonly used compared to video calling.
From an end-to-end perspective, establishing a good voice call requires microphone permission on the sender side, proper functioning of the microphone device,
good network connection both on the sending and receiving ends, and proper functioning of the audio output device on the receiving end.

Device and network issues are considered external problems from the perspective of the ACS Calling SDK.
The application should integrate the [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md)
to monitor device and network issues and display warning messages accordingly, so that the user is aware of the issue and can troubleshoot on their own.

## Common issues in audio calls
Here we list several common audio issues, along with potential causes for each issue:

### The user can't hear sound during the call
* The speaking participant's microphone has a problem.
* The user's speaker has a problem.
* There's a network issue in the call

### The user experiences poor audio quality
* The audio sender has poor network connectivity.
* The receiver has poor network connectivity.

### The user experiences delays during the call
* The round trip time is large between the sender and the receiver.
* Other network issues.

### The user experiences echo during the call
* The browser's acoustic echo canceller isn't able to remove the echo on the audio sender's side.

### The volume of the incoming audio is low
* The volume of the outgoing audio is low on the sender's side.
* There's an issue with the speaker or audio volume settings on the receiver's side
