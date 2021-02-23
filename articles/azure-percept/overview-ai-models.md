---
title: Azure Percept AI models
description: Learn more about the AI models available for prototyping and deployment
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: concept
ms.date: 02/16/2021
ms.custom: template-concept
---

# Azure Percept AI models

Azure Percept enables you to develop and deploy AI models directly to your Azure Percept DK from [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819). Model deployment utilizes [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) and [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/#iotedge-overview).

## Sample AI models

Azure Percept Studio contains sample models for the following applications:

- face detection
- people detection
- vehicle detection
- general object detection
- products-on-shelf detection

With pre-trained models, no coding or training data collection is required. Simply deploy your desired model to your Azure Percept DK from the portal and open your devkit’s video stream to see the model inferencing in action. Model inferencing telemetry can also be accessed through the [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases) tool.

## Pre-built solutions

A [spatial analytics pre-built solution for people detection](https://github.com/george-moore/Santa-Cruz-AI-App) is also available. The pre-built solution is an open-source AI application providing edge-based people counting with user-defined zone entry/exit events. Video and AI output from the on-premise edge device is egressed to [Azure Data Lake](https://azure.microsoft.com/solutions/data-lake/), with the user interface running as an Azure Website. AI inferencing is provided by an open-source AI model for people detection.

:::image type="content" source="./media/overview-ai-models/people-detector.gif" alt-text="Spatial analytics pre-built solution gif.":::

## Custom no-code solutions

Through Azure Percept Studio, you can develop custom [vision](./tutorial-nocode-vision.md) and speech solutions, no coding required.

For custom vision solutions, both object detection and classification AI models are available. Simply upload and tag your training images, which can be taken directly with the Azure Percept Vision SoM of the Azure Percept DK, if desired. Model training and evaluation are easily performed in [Custom Vision](https://www.customvision.ai/), which is part of [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/#overview).

For custom speech solutions, voice assistant templates are currently available for the following applications:

- Hospitality: hotel room equipped with voice-controlled smart devices.
- Healthcare: care facility equipped with voice-controlled smart devices.
- Inventory: inventory hub equipped with voice-controlled smart devices.
- Automotive: automotive hub equipped with voice-controlled smart devices.

Pre-built voice assistant keywords and commands are available directly through the portal. Custom keywords and commands may be created and trained in [Speech Studio](https://speech.microsoft.com/), which is also part of Azure Cognitive Services.

## Advanced development

For advanced developers, the available [Jupyter notebook](https://github.com/microsoft/Project-Santa-Cruz-Preview/blob/main/Sample-Scripts-and-Notebooks/Official/Machine%20Learning%20Notebooks/Transferlearningusing_SSDLiteV2%20Model.ipynb) performs transfer learning using a pre-trained TensorFlow model (MobileNetSSDV2Lite) in Python with a custom dataset for object detection. The notebook utilizes remote compute instances through [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/#product-overview) and can be run in the cloud using the AzureML portal or locally in [Visual Studio Code](https://code.visualstudio.com/).

Also included are some helpful Python [scripts](https://github.com/microsoft/Project-Santa-Cruz-Preview/tree/main/Sample-Scripts-and-Notebooks/Official/Scripts) for managing datasets and the [Dev Tools Pack Installer](https://github.com/microsoft/Project-Santa-Cruz-Preview/blob/main/Sample-Scripts-and-Notebooks/Official/Machine%20Learning%20Notebooks/dev-tools-installer.md), which installs and configures all of the tools required to develop an advanced AI solution.
