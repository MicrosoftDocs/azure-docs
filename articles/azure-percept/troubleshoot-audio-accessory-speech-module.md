---
title: Troubleshoot issues with Azure Percept Audio and the speech module
description: Get troubleshooting tips for Azure Percept Audio and azureearspeechclientmodule
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/25/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Azure Percept Audio and speech module troubleshooting

Use the guidelines below to troubleshoot voice assistant application issues.

## Understanding Ear SoM LED indicators

You can use LED indicators to understand which state your device is in. It takes around 4-5 minutes for the device to power on and the module to fully initialize. As it goes through initialization steps, you will see:

1. Center white LED on (static): the device is powered on.
1. Center white LED on (blinking): authentication is in progress.
1. Center white LED on (static): the device is authenticated but keyword is not configured.​
1. All three LEDs will change to blue once a demo was deployed and the device is ready to use.

For more reference, see this article about [Azure Percept Audio button and LED behavior](./audio-button-led-behavior.md).

### Troubleshooting LED issues
- **If the center LED is solid white**, try [using a template to create a voice assistant](./tutorial-no-code-speech.md).
- **If the center LED is always blinking**, it indicates an authentication issue. Try these troubleshooting steps:
    - Make sure that your USB-A and micro USB connections are secured 
    - Check to see if the [speech module is running](./troubleshoot-audio-accessory-speech-module.md#checking-runtime-status-of-the-speech-module)
    - Restart the device
    - [Collect logs](./troubleshoot-audio-accessory-speech-module.md#collecting-speech-module-logs) and attach them to a support request
    - Check to see if your dev kit is running the latest software and apply an update if available.

## Checking runtime status of the speech module

Check if the runtime status of **azureearspeechclientmodule** shows as **running**. To locate the runtime status of your device modules, open the [Azure portal](https://portal.azure.com/) and navigate to **All resources** -> **[your IoT hub]** -> **IoT Edge** -> **[your device ID]**. Click the **Modules** tab to see the runtime status of all installed modules.

:::image type="content" source="./media/troubleshoot-audio-accessory-speech-module/over-the-air-iot-edge-device-page.png" alt-text="Edge device page in the Azure portal.":::

If the runtime status of **azureearspeechclientmodule** is not listed as **running**, click **Set modules** -> **azureearspeechclientmodule**. On the **Module Settings** page, set **Desired Status** to **running** and click **Update**.

## Collecting speech module logs

To run these commands, [SSH into the dev kit](./how-to-ssh-into-percept-dk.md) and enter the commands into the SSH client prompt.

Collect speech module logs:

```console
sudo iotedge logs azureearspeechclientmodule
```

To redirect output to a .txt file for further analysis, use the following syntax:

```console
sudo [command] > [file name].txt
```

Change the permissions of the .txt file so it can be copied:

```console
sudo chmod 666 [file name].txt
```

After redirecting output to a .txt file, copy the file to your host PC via SCP:

```console
scp [remote username]@[IP address]:[remote file path]/[file name].txt [local host file path]
```

[local host file path] refers to the location on your host PC, which you would like to copy the .txt file to. [remote username] is the SSH username chosen during the [setup experience](./quickstart-percept-dk-set-up.md).

## Known issues
- If using a free trial, the speech model may exceed the free trial price plan. In this case, the model will stop working without an error message.
- If more than 5 IoT Edge devices are connected, the report (the text sent via telemetry to IoT Hub and Speech Studio) may be blocked.
- If the device is in a different region than the resources, the report message may be delayed. 

## Useful links
- [Azure Percept Audio setup](./quickstart-percept-audio-setup.md)
- [Azure Percept Audio button and LED behavior](./audio-button-led-behavior.md)
- [Create a voice assistant with Azure Percept DK and Azure Percept Audio](./tutorial-no-code-speech.md)
- [Azure Percept DK general troubleshooting guide](./troubleshoot-dev-kit.md)
