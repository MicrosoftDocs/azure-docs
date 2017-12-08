---
title: Deploy an Azure Machine Learning model to an Azure IoT Edge device | Microsoft Docs
description: This document describes how Azure Machine Learning models can be deployed to Azure IoT Edge devices.
services: machine-learning
author: tedway
ms.author: tedway
manager: mwinkle
ms.reviewer: garyericson, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 11/10/2017
---
# Deploy an Azure Machine Learning model to an Azure IoT Edge device

All Azure Machine Learning models containerized as Docker-based web services can also run on Azure IoT Edge devices. Additional scripts and instructions can be found in the [AI Toolkit for Azure IoT Edge](http://aka.ms/AI-toolkit).

## Operationalize the model
Operationalize your model by following the instructions in [Azure Machine Learning Model Management Web Service Deployment](https://docs.microsoft.com/azure/machine-learning/preview/model-management-service-deploy) to create a Docker image with your model.

## Deploy to Azure IoT Edge
Azure IoT Edge moves cloud analytics and custom business logic to devices. All Machine Learning models can run on IoT Edge devices. The documentation to set up an IoT Edge device and create a deployment can be found at [aka.ms/azure-iot-edge-doc](https://aka.ms/azure-iot-edge-doc).

The following are additional things to note.

### Add registry credentials to the Edge runtime on your Edge device
On the machine where you're running IoT Edge, add the credentials of your registry so the runtime can have access to pull the container.

For Windows, run the following command:
```cmd/sh
iotedgectl login --address <docker-registry-address> --username <docker-username> --password <docker-password>
```
For Linux, run the following command:
```cmd/sh
sudo iotedgectl login --address <docker-registry-address> --username <docker-username> --password <docker-password>
```

### Find the Machine Learning container image location
You need the location of your Machine Learning container image. To find the container image location:

1. Log into the [Azure portal](http://portal.azure.com/).
2. In the **Azure Container Registry**, select the registry you wish to inspect.
3. In the registry, click **Repositories** to see a list of all the repositories and their images.













