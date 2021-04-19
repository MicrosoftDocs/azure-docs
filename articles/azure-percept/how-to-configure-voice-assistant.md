---
title: Configure voice assistant application using Azure IoT Hub
description: Configure voice assistant application using Azure IoT Hub
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/15/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Configure voice assistant application using Azure IoT Hub

This article describes how to configure your voice assistant application using IoT Hub. For a step-by-step tutorial that guides you through the process of creating a voice assistant using demo template, see [Build a no-code voice assistant with Azure Percept Studio and Azure Percept Audio](./tutorial-no-code-speech.md).

## Update your voice assistant configuration

1. Open the [Azure portal](https://portal.azure.com) and type **IoT Hub** into the search bar. Click on the icon to open the IoT Hub page.

1. On the IoT Hub page, select the IoT Hub to which your device was provisioned.

1. Select **IoT Edge** under **Automatic Device Management** in the left navigation menu to view all devices connected to your IoT Hub.

1. Select the device to which your voice assistant application was deployed.

1. Click on **Set Modules**.

    :::image type="content" source="./media/manage-voice-assistant-using-iot-hub/set-modules.png" alt-text="Screenshot of device page with Set Modules highlighted.":::

1. Verify that the following entry is present under the **Container Registry Credentials** section. Add credentials if required.

    |Name|Address|Username|Password|
    |----|-------|--------|--------|
    |azureedgedevices|azureedgedevices.azurecr.io|devkitprivatepreviewpull|

1. In the **IoT Edge Modules** section, select **azureearspeechclientmodule**.

    :::image type="content" source="./media/manage-voice-assistant-using-iot-hub/modules.png" alt-text="Screenshot showing list of all IoT Edge modules on the device.":::

1. Click on the **Module Settings** tab. Verify the following configuration:

    Image URI|Restart Policy|Desired Status
    ---------|--------------|--------------
    mcr.microsoft.com/azureedgedevices/azureearspeechclientmodule:preload-devkit|always|running

    If your settings do not match, edit them and click **Update**.

1. Click on the **Environment Variables** tab. Verify that there are no environment variables defined.

1. Click on the **Module Twin Settings** tab. Update the **speechConfigs** section as follows:

    ```
    "speechConfigs": {
        "appId": "<Application id for custom command project>",
        "key": "<Speech Resource key for custom command project>",
        "region": "<Region for the speech service>",
        "keywordModelUrl": "https://aedsamples.blob.core.windows.net/speech/keyword-tables/computer.table",
        "keyword": "computer"
    }
    ```

    > [!NOTE]
    > The keyword used above is a default publicly available keyword. If you wish to use your own, you can add your own custom keyword by uploading a created table file to blob storage. Blob storage needs to be configured with either anonymous container access or anonymous blob access.

## How to find out appId, key and region

To locate your **appID**, **key**, and **region**, go to [Speech Studio](https://speech.microsoft.com/):

1. Sign in and select the appropriate speech resource.
1. On the **Speech Studio** home page, click on **Custom Commands** under **Voice Assistants**.
1. Select your target project.

    :::image type="content" source="./media/manage-voice-assistant-using-iot-hub/project.png" alt-text="Screenshot of project page in Speech Studio.":::

1. Click on **Settings** on the left-hand menu panel.
1. The **appID** and **key** will be located under the **General** settings tab.

    :::image type="content" source="./media/manage-voice-assistant-using-iot-hub/general-settings.png" alt-text="Screenshot of speech project general settings.":::

1. To find your **region**, open the **LUIS resources** tab within the settings. The **Authoring resource** selection will contain region information.

    :::image type="content" source="./media/manage-voice-assistant-using-iot-hub/luis-resources.png" alt-text="Screenshot of speech project LUIS resources.":::

1. After entering your **speechConfigs** information, click **Update**.

1. Click on the **Routes** tab at the top of the **Set modules** page. Ensure you have a route with the following value:

    ```
    FROM /messages/modules/azureearspeechclientmodule/outputs/* INTO $upstream
    ```

    Add the route if it does not exist.

1. Click **Review + Create**.

1. Click **Create**.


## Next steps

After updating your voice assistant configuration, return to the demo in Azure Percept Studio to interact with the application.

