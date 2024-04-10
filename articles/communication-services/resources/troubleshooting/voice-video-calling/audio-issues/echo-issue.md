---
title: Audio issues - The user experiences echo during the call
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the user experiences echo during the call.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 04/09/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The user experiences echo during the call
Acoustic echo happens when the microphone picks up sound from speakers, creating a loop of sound that results in an echo.
Modern browsers have built-in acoustic echo cancellation capabilities in their audio processing modules.
These capabilities are designed to remove near-end echoes, which can improve the overall audio quality of web based Azure Communication Service calls.
However, the browser isn't able to remove all echoes.
For instance, if the delay between the echo and reference signals is beyond the range of the filter, the echoes may persist.
This problem can occur when a user joins an ACS call using a remote desktop client and plays the audio through their speakers.
Other scenarios, such as double talk, or two devices in the same room participating in the same call can also affect the result of echo cancellation.

## How to detect
Currently, if the browser fails to remove echoes, there is no simple way to detect this issue from the information reported by the browser.
When the user reports this issue, it's described as the user hearing their own voice or other sounds repeated back to them, creating a distracting and unpleasant audio experience. 

## How to mitigate or resolve
There are many ways to help remove the potential of an echo being picked up. The fastest solution is to have people that are producing echo to use headphones.
The echo exists because the microphone picks up the sound from the speaker.
Since the sound played from headphone doesn't leak, the microphone doesn't pick up the far-end signal. 

Adjusting the speaker's volume level and the microphone's sensitivity level is another way that may help.
If the volume level is low enough, it can alleviate the echo issue.

Other solutions are to point an external speaker away from the microphone so that the external sound isn't picked up.

