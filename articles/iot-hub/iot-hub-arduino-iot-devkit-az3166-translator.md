---
title: Create an IoT DevKit translator using Azure Functions and Cognitive Services | Microsoft Docs
description: Use the microphone on an IoT DevKit to receive a voice message and then use Azure Cognitive Services for processing it into translated text in English
author: liydu
manager: jeffya
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 02/28/2018
ms.author: liydu
---

# Use IoT DevKit AZ3166 with Azure Functions and Cognitive Services to make a language translator

In this article, you learn how to make IoT DevKit as a language translator by using [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/). It records your voice and translates it to English text shown on the DevKit screen.

The [MXChip IoT DevKit](https://aka.ms/iot-devkit) is an all-in-one Arduino compatible board with rich peripherals and sensors. You can develop for it using [Visual Studio Code extension for Arduino](https://aka.ms/arduino). And it comes with a growing [projects catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/) to guide you through prototype Internet of Things (IoT) solutions that take advantage of Microsoft Azure services.

## What you need

Finish the [Getting Started Guide](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) to:

* Have your DevKit connected to Wi-Fi
* Prepare the development environment

An active Azure subscription. If you do not have one, you can register via one of these two methods:

* Activate a [free 30-day trial Microsoft Azure account](https://azure.microsoft.com/free/)
* Claim your [Azure credit](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) if you are MSDN or Visual Studio subscriber

## Open the project folder

First, open the project folder. 

### Start VS Code

- Make sure your DevKit is connected to your PC.

- Start VS Code.

- Connect the DevKit to your computer.

### Open the Arduino Examples folder

Expand left side **ARDUINO EXAMPLES > Examples for MXCHIP AZ3166 > AzureIoT**, and select **DevKitTranslator**. A new VS Code window opens, displaying the project folder. If you can't see the Examples for MXCHIP AZ3166 section, make sure your device is properly connected and restart VS Code.  

![IoT DevKit samples](media/iot-hub-arduino-iot-devkit-az3166-translator/vscode_examples.png)

You can also open the example from the command palette. Use `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) to open the command palette, type **Arduino**, and then find and select **Arduino: Examples**.

## Provision Azure services

In the solution window, type `Ctrl+P` (macOS: `Cmd+P`) and enter `task cloud-provision`.

In the VS Code terminal, an interactive command line will guide you to provision all necessary Azure services:

![Cloud provision task](media/iot-hub-arduino-iot-devkit-az3166-translator/cloud-provision.png)

## Deploy the Azure Function

Use `Ctrl+P` (macOS: `Cmd+P`) to run `task cloud-deploy` to deploy the Azure Functions code. This process usually takes 2 to 5 minutes to complete.

![Cloud deploy task](media/iot-hub-arduino-iot-devkit-az3166-translator/cloud-deploy.png)

After the Azure Function deploys successfully, fill in the azure_config.h file with function app name. You can navigate to [Azure portal](https://portal.azure.com/) to find it:

![Find Azure Function app name](media/iot-hub-arduino-iot-devkit-az3166-translator/azure-function.png)

> [!NOTE]
> If the Azure Function does not work properly, check the ["complication error for Azure Function" page in the IoT DevKit FAQ](https://microsoft.github.io/azure-iot-developer-kit/docs/faq#compilation-error-for-azure-function) to resolve it.

## Build and upload the device code

1. Use `Ctrl+P` (macOS: `Cmd+P`) to run `task config-device-connection`.

2. The terminal will ask you whether you want to use connection string that retrieves from `task cloud-provision` step. You can also input your own device connection string by selecting **'Create New...'**

3. The terminal prompts you to enter configuration mode. To do so, hold down button A, then push and release the reset button. The screen displays the DevKit ID and 'Configuration'.

   ![Verification and upload of the Arduino sketch](media/iot-hub-arduino-iot-devkit-az3166-translator/config-device-connection.png)

4. After `task config-device-connection` finished, click `F1` to load VS Code commands and select `Arduino: Upload`, then VS Code starts verifying and uploading the Arduino sketch.

   ![Verification and upload of the Arduino sketch](media/iot-hub-arduino-iot-devkit-az3166-translator/arduino-upload.png)

The DevKit reboots and starts running the code.

## Test the project

After app initialization, follow the instructions on the DevKit screen. The default source language is Chinese.

To select another language for translation:

1. Press button A to enter setup mode.

2. Press button B to scroll all supported source languages.

3. Press button A to confirm your choice of source language.

4. Press and hold button B while speaking, then release button B to initiate the translation.

5. The translated text in English shows on the screen.

![Scroll to select language](media/iot-hub-arduino-iot-devkit-az3166-translator/select-language.jpg)

![Translation result](media/iot-hub-arduino-iot-devkit-az3166-translator/translation-result.jpg)

On the translation result screen, you can:

- Press buttons A and B to scroll and select the source language.

- Press the B button to talk. To send the voice and get the translation text, release the B button.

## How it works

![mini-solution-voice-to-tweet-diagram](media/iot-hub-arduino-iot-devkit-az3166-translator/diagram.png)

The Arduino sketch records your voice then posts an HTTP request to trigger an Azure Function. The Azure Function calls the cognitive service speech translator API to do the translation. After the Azure Function gets the translation text, it sends a C2D (cloud-to-device) message to the device. Then the translation is displayed on the screen.

## Problems and feedback

If you encounter problems, refer to the [IoT DevKit FAQ](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us using the following channels:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next Steps

You have learned how to use the IoT DevKit as a translator by using Azure Functions and Cognitive Services. In this how-to, you learned how to:

> [!div class="checklist"]
> * Use Visual Studio Code task to automate cloud provisions
> * Configure Azure IoT device connection string
> * Deploy the Azure Function
> * Test the voice message translation

Advance to the other tutorials to learn:

> [!div class="nextstepaction"]
> [Connect IoT DevKit AZ3166 to Azure IoT Remote Monitoring solution accelerator](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-devkit-remote-monitoring)
