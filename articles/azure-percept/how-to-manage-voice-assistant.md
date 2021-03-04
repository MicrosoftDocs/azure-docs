---
title: Configure voice assistant application within Azure Percept Studio
description: Configure voice assistant application within Azure Percept Studio
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/15/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Managing your voice assistant

This article describes how to configure the keyword and commands of your voice assistant application within [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819). For guidance on configuring your keyword within IoT Hub instead of the portal, please see this [how-to article](./how-to-configure-voice-assistant.md).

If you have not yet created a voice assistant application, please see [Build a no-code voice assistant with Azure Percept Studio and Azure Percept Audio](./tutorial-no-code-speech.md).

## Keyword configuration

A keyword is a word or short phrase used to activate a voice assistant. For example, "Hey Cortana" is the keyword for the Cortana assistant. Voice activation allows your users to start interacting with your product completely hands-free by simply speaking the keyword. As your product continuously listens for the keyword, all audio is processed locally on the device until a detection occurs to ensure user data stays as private as possible.

### Configuration within the voice assistant demo window

1. Click **change** next to **Custom Keyword** on the demo page.

    :::image type="content" source="./media/manage-voice-assistant/hospitality-demo.png" alt-text="Screenshot of hospitality demo window.":::

    If you do not have the demo page open, navigate to the device page (see below) and click **Test your voice assistant** under **Actions** to access the demo.

1. Select one of the available keywords and click **Save** to apply changes.

1. The three LED lights on the Azure Percept Audio device will change to bright blue (no flashing) when configuration is complete and your voice assistant is ready to use.

### Configuration within the device page

1. On the overview page of the [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819), click on **Devices** on the left menu pane.

    :::image type="content" source="./media/manage-voice-assistant/portal-overview-devices.png" alt-text="Screenshot of Azure Percept Studio overview page with Devices highlighted.":::

1. Select the device to which your voice assistant application was deployed.

1. Open the **Speech** tab.

    :::image type="content" source="./media/manage-voice-assistant/device-page.png" alt-text="Screenshot of the edge device page with the Speech tab highlighted.":::

1. Click **Change** next to **Keyword**.

    :::image type="content" source="./media/manage-voice-assistant/change-keyword-device.png" alt-text="Screenshot of the available speech solution actions.":::

1. Select one of the available keywords and click **Save** to apply changes.

1. The three LED lights on the Azure Percept Audio device will change to bright blue (no flashing) when configuration is complete and your voice assistant is ready to use.

## Create a custom keyword

With [Speech Studio](https://speech.microsoft.com/), you can create a custom keyword for your voice assistant. It takes up to 30 minutes to train a basic custom keyword model.

Follow the [Speech Studio documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-create-kws) for guidance on creating a custom keyword. Once configured, your new keyword will be available in the Project Santa Cruz portal for use with your voice assistant application.

## Commands configuration

Custom commands make it easy to build rich voice commanding apps optimized for voice-first interaction experiences. Custom commands are best suited for task completion or command-and-control scenarios.

### Configuration within the voice assistant demo window

1. Click **Change** next to **Custom Command** on the demo page. If you do not have the demo page open, navigate to the device page (see below) and click **Test your voice assistant** under **Actions** to access the demo.

1. Select one of the available custom commands and click **Save** to apply changes.

### Configuration within the device page

1. On the overview page of the [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819), click on **Devices** on the left menu pane.

1. Select the device to which your voice assistant application was deployed.

1. Open the **Speech** tab.

1. Click **Change** next to **Command**.

1. Select one of the available custom commands and click **Save** to apply changes.

## Create custom commands

With [Speech Studio](https://speech.microsoft.com/), you can create custom commands for your voice assistant to execute.

Follow the [Speech Studio documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-custom-commands-application) for guidance on creating custom commands. Once configured, your new commands will be available in Azure Percept Studio for use with your voice assistant application.

## Next steps

After building a voice assistant application, try developing a [no-code vision solution](./tutorial-nocode-vision.md) with your Azure Percept DK.