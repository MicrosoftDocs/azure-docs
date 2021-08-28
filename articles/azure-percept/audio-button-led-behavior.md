---
title: Azure Percept Audio button and LED states
description: Learn more about the button and LED states of Azure Percept Audio
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: conceptual
ms.date: 08/03/2021
---

# Azure Percept Audio button and LED states

See the following guidance for information on the button and LED states of the Azure Percept Audio device.

## Button behavior

Use the buttons to control the behavior of the device.

|Button State|Behavior|
|------------|----------|
|Mute|Press to mute/unmute the mic array. The button event is release-triggered when pressed.|
|PTT/PTS|Press PTT to bypass the keyword spotting state and activate the command listening state. Press again to stop the agent's active dialogue and revert to the keyword spotting state. The button event is release-triggered when pressed. PTS only works when the button is pressed while the agent is speaking, not when the agent is listening or thinking.|

## LED states

Use the LED indicators to understand which state your device is in.

|LED|LED State|Ear SoM Status|
|---|------------|----------------|
|L02|1x white, static on|Power on |
|L02|1x white, 0.5 Hz flashing|Authentication in progress |
|L01 & L02 & L03|3x blue, static on|Waiting for keyword|
|L01 & L02 & L03|LED array flashing, 20 fps |Listening or speaking|
|L01 & L02 & L03|LED array racing, 20 fps|Thinking|
|L01 & L02 & L03|3x red, static on |Mute|

## Understanding Ear SoM LED indicators
You can use LED indicators to understand which state your device is in. It takes around 4-5 minutes for the device to power on and the module to fully initialize. As it goes through initialization steps, you'll see:

1. Center white LED on (static): the device is powered on.
1. Center white LED on (blinking): authentication is in progress.
1. Center white LED on (static): the device is authenticated but the keyword isn't configured.​
1. All three LEDs will change to blue once a demo was deployed and the device is ready to use.


## Troubleshooting LED issues
- **If the center LED is solid white**, try [using a template to create a voice assistant](./tutorial-no-code-speech.md).
- **If the center LED is always blinking**, it indicates an authentication issue. Try these troubleshooting steps:
    1. Make sure that your USB-A and micro USB connections are secured 
    1. Check to see if the [speech module is running](./troubleshoot-audio-accessory-speech-module.md#checking-runtime-status-of-the-speech-module)
    1. Restart the device
    1. [Collect logs](./troubleshoot-audio-accessory-speech-module.md#collecting-speech-module-logs) and attach them to a support request
    1. Check to see if your dev kit is running the latest software and apply an update if available.

## Next steps

For troubleshooting tips for your Azure Percept Audio device, see this [guide](./troubleshoot-audio-accessory-speech-module.md).