---
title: Enable CI/CD with Jenkins plugin - Azure IoT Edge | Microsoft Docs
description: The Azure IoT Edge extension for Jenkins enables you to integrate IoT Edge devlopment and deployment tasks into your existing DevOps solution.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 01/22/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Integrate Azure IoT Edge with Jenkins pipelines

Azure IoT Edge has built-in support for Azure DevOps and Azure DevOps Projects, but also provides a plugin to expand DevOps functionality to Jenkins. [Jenkins](https://jenkins.io/) is an open-source automation server that uses plugins to support many types of development and deployment projects, including IoT Edge. 

The Azure IoT Edge plugin for Jenkins focuses on continuous integration and continuous deployment. You can create a build and push pipeline that builds modules and pushes their container images to your container registry. Then, create a release pipeline that deploys modules to your IoT Edge devices. 

Before you start using the IoT Edge plugin for Jenkins, you need an IoT hub in Azure and a container registry to hold your container images. Use an Azure Service Principal to give Jenkins contributor permissions to your IoT hub so that the plugin can create deployments for your IoT Edge devices. 

If you're ready to get started, find installation and use details for the [Azure IoT Edge plugin for Jenkins](https://plugins.jenkins.io/azure-iot-edge).