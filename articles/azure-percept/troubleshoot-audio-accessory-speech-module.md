---
title: Troubleshoot issues with Azure Percept Audio and the speech module
description: Get troubleshooting tips for Azure Percept Audio and azureearspeechclientmodule
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 08/03/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Azure Percept Audio and speech module troubleshooting

Use the guidelines below to troubleshoot voice assistant application issues.

## Checking runtime status of the speech module

Check if the runtime status of **azureearspeechclientmodule** shows as **running**. To locate the runtime status of your device modules, open the [Azure portal](https://portal.azure.com/) and navigate to **All resources** -> **[your IoT hub]** -> **IoT Edge** -> **[your device ID]**. Select the **Modules** tab to see the runtime status of all installed modules.

:::image type="content" source="./media/troubleshoot-audio-accessory-speech-module/over-the-air-iot-edge-device-page.png" alt-text="Edge device page in the Azure portal.":::

If the runtime status of **azureearspeechclientmodule** isn't listed as **running**, select **Set modules** -> **azureearspeechclientmodule**. On the **Module Settings** page, set **Desired Status** to **running** and select **Update**.

## Voice assistant application doesn't load
Try [deploying one of the voice assistant templates](./tutorial-no-code-speech.md). Deploying a template ensures that all the supporting resources needed for voice assistant applications get created.

## Voice assistant template doesn't get created
Failure of when creating a voice assistant template is usually an issue with one of the supporting resources.
1. [Delete all previously created voice assistant resources](./delete-voice-assistant-application.md).
1. Deploy a new [voice assistant template](./tutorial-no-code-speech.md).

## Voice assistant was created but doesn't respond to commands
Follow the instructions on the [LED behavior and troubleshooting guide](audio-button-led-behavior.md) to troubleshoot this issue.

## Voice assistant doesn't respond to custom keywords created in Speech Studio
This may occur if the speech module is out of date. Follow these steps to update the speech module to the latest version:

1. Select on **Devices** in the left-hand menu panel of the Azure Percept Studio homepage.
1. Find and select your device.

    :::image type="content" source="./media/tutorial-no-code-speech/devices.png" alt-text="Screenshot of device list in Azure Percept Studio.":::
1. In the device window, select the **Speech** tab.
1. Check the speech module version. If an update is available, you'll see an **Update** button next to the version number.
1. Select **Update** to deploy the speech module update. The update process generally takes 2-3 minutes to complete.

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
- [How to return to a previously crated voice assistant application](return-to-voice-assistant-application-window.md)
