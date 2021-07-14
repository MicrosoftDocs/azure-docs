---
title: Azure Percept Audio button and LED behavior
description: Learn more about the button and LED states of Azure Percept Audio
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: conceptual
ms.date: 03/25/2021
---

# Azure Percept Audio button and LED behavior

See the following guidance for information on the button and LED states of the Azure Percept Audio device.

## Button behavior

Use the buttons to control the behavior of the device.

|Button State|Behavior|
|------------|----------|
|Mute|Press to mute/unmute the mic array. The button event is release-triggered when pressed.|
|PTT/PTS|Press PTT to bypass the keyword spotting state and activate the command listening state. Press again to stop the agent's active dialogue and revert to the keyword spotting state. The button event is release-triggered when pressed. PTS only works when the button is pressed while the agent is speaking, not when the agent is listening or thinking.|

## LED behavior

Use the LED indicators to understand which state your device is in.

|LED|LED State|Ear SoM Status|
|---|------------|----------------|
|L02|1x white, static on|Power on |
|L02|1x white, 0.5 Hz flashing|Authentication in progress |
|L01 & L02 & L03|3x blue, static on|Waiting for keyword|
|L01 & L02 & L03|LED array flashing, 20fps |Listening or speaking|
|L01 & L02 & L03|LED array racing, 20fps|Thinking|
|L01 & L02 & L03|3x red, static on |Mute|

## Next steps

For troubleshooting tips for your Azure Percept Audio device, see this [guide](./troubleshoot-audio-accessory-speech-module.md).