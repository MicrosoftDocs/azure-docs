---
title: Azure Percept AI models
description: Learn more about the AI models available for prototyping and deployment
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: conceptual
ms.date: 03/23/2021
ms.custom: template-concept
---

# Azure Percept AI models

Azure Percept enables you to develop and deploy AI models directly to your [Azure Percept DK](./overview-azure-percept-dk.md) from [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819). Model deployment utilizes [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) and [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/#iotedge-overview).

## Sample AI models

Azure Percept Studio contains sample models for the following applications:

- people detection
- vehicle detection
- general object detection
- products-on-shelf detection

With pre-trained models, no coding or training data collection is required. Simply [deploy your desired model](./how-to-deploy-model.md) to your Azure Percept DK from the portal and open your devkit’s [video stream](./how-to-view-video-stream.md) to see the model inferencing in action. [Model inferencing telemetry](./how-to-view-telemetry.md) can also be accessed through the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases) tool.

## Reference solutions

A [people counting reference solution](https://github.com/microsoft/Azure-Percept-Reference-Solutions/tree/main/people-detection-app) is also available. This reference solution is an open-source AI application providing edge-based people counting with user-defined zone entry/exit events. Video and AI output from the on-premise edge device is egressed to [Azure Data Lake](https://azure.microsoft.com/solutions/data-lake/), with the user interface running as an Azure website. AI inferencing is provided by an open-source AI model for people detection.

:::image type="content" source="./media/overview-ai-models/people-detector.gif" alt-text="Spatial analytics pre-built solution gif.":::

## Custom no-code solutions

Through Azure Percept Studio, you can develop custom [vision](./tutorial-nocode-vision.md) and [speech](./tutorial-no-code-speech.md) solutions, no coding required.

For custom vision solutions, both object detection and classification AI models are available. Simply upload and tag your training images, which can be taken directly with the Azure Percept Vision SoM of the Azure Percept DK if desired. Model training and evaluation are easily performed in [Custom Vision](https://www.customvision.ai/), which is part of [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/#overview).

</br>

> [!VIDEO https://www.youtube.com/embed/9LvafyazlJM]

For custom speech solutions, voice assistant templates are currently available for the following applications:

- Hospitality: hotel room equipped with voice-controlled smart devices.
- Healthcare: care facility equipped with voice-controlled smart devices.
- Inventory: inventory hub equipped with voice-controlled smart devices.
- Automotive: automotive hub equipped with voice-controlled smart devices.

Pre-built voice assistant keywords and commands are available directly through the portal. Custom keywords and commands may be created and trained in [Speech Studio](https://speech.microsoft.com/), which is also part of Azure Cognitive Services.

## Advanced development

Please see the [Azure Percept DK advanced development GitHub](https://github.com/microsoft/azure-percept-advanced-development) for
up-to-date guidance, tutorials, and examples for things like:

- Deploying a custom AI model to your Azure Percept DK
- Updating a supported model with transfer learning
- And more
