---
title: Overview of the Azure Percept AI vision module
description: An overview of the azureeyemodule, which is the module responsible for running the AI vision workload on the Azure Percept DK.
author: mimcco
ms.author: mimcco
ms.topic: overview 
ms.date: 08/09/2021
ms.custom: template-overview 
---

# What is azureeyemodule?

Azureeyemodule is the name of the edge module responsible for running the AI vision workload on the Azure Percept DK. It's part of the Azure IoT suite of edge modules and is deployed to the Azure Percept DK during the [setup experience](./quickstart-percept-dk-set-up.md). This article provides an overview of the module and its architecture.

## Architecture

:::image type="content" source="media/azureeyemodule-overview/azureeyemodule-architecture.png" alt-text="Diagram showing the architecture of the azureeyemodule.":::

The Azure Percept Workload on the Azure Percept DK is a C++ application that runs inside the azureeyemodule docker container. It uses OpenCV GAPI for image processing and model execution. Azureeyemodule runs on the Mariner operating system as part of the Azure IoT suite of modules that run on the Azure Percept DK.

The Azure Percept Workload is meant to take in images and output images and messages. The output images may be marked up with drawings such as bounding boxes, segmentation masks, joints, labels, and so on. The output messages are a JSON stream of inference results that can be ingested and used by downstream tasks.
The results are served up as an RTSP stream that is available on port 8554 of the device. The results are also shipped over to another module running on the device, which serves the RTSP stream wrapped in an HTTP server, running on port 3000. Either way, they'll be viewable only on the local network.

> [!CAUTION]
> There is *no* encryption or authentication with respect to the RTSP feeds. Anyone on the local network can view exactly what the Azure Percept Vision is seeing by typing in the correct address into a web browser or RTSP media player.

The Azure Percept Workload enables several features that end users can take advantage of:
- A no-code solution for common computer vision use cases, such as object classification and common object detection.
- An advanced solution, where a developer can bring their own (potentially cascaded) trained model to the device and run it, possibly passing results to another IoT module of their own creation running on the device.
- A retraining loop for grabbing images from the device periodically, retraining the model in the cloud, and then pushing the newly trained model back down to the device. Using the device's ability to update and swap models on the fly.

## AI workload details
The Workload application is open-sourced in the Azure Percept Advanced Development [github repository](https://github.com/microsoft/azure-percept-advanced-development/tree/main/azureeyemodule/app) and is made up of many small C++ modules, with some of the more important being:
- [main.cpp](https://github.com/microsoft/azure-percept-advanced-development/blob/main/azureeyemodule/app/main.cpp): Sets up everything and then runs the main loop.
- [iot](https://github.com/microsoft/azure-percept-advanced-development/tree/main/azureeyemodule/app/iot): This folder contains modules that handle incoming and outgoing messages from the Azure IoT Edge Hub, and the twin update method.
- [model](https://github.com/microsoft/azure-percept-advanced-development/tree/main/azureeyemodule/app/model): This folder contains modules for a class hierarchy of computer vision models.
- [kernels](https://github.com/microsoft/azure-percept-advanced-development/tree/main/azureeyemodule/app/kernels): This folder contains modules for G-API kernels, ops, and C++ wrapper functions.

Developers can build custom modules or customize the current azureeyemodule using this workload application. 

## Next steps

- Now that you know more about the azureeyemodule and Azure Percept Workload, try using your own model or pipeline by following one of [these tutorials](https://github.com/microsoft/azure-percept-advanced-development/blob/main/tutorials/README.md)
- Or, try **transfer learning** using one of our ready-made [machine learning notebooks](https://github.com/microsoft/azure-percept-advanced-development/tree/main/machine-learning-notebooks)

