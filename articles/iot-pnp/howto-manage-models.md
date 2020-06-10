---
title: Manage IoT Plug and Play Preview models in the repository| Microsoft Docs'
description: How to manage device capability models in the repository using the Azure Certified for IoT portal, the Azure CLI, and Visual Studio code.
author: Philmea
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: how-to
ms.date: 12/26/2019
ms.author: philmea
---

# Manage models in the repository

The IoT Plug and Play Preview model repository stores device capability models and interfaces. The repository makes the models and interfaces discoverable and consumable by solution developers.

There are three tools you can use to manage the repository:

- The Azure Certified for IoT portal
- The Azure CLI
- Visual Studio Code

## Model repositories

There are two types of model repository for storing device capability models and interfaces:

- There is a single _Public repository_ that stores the device capability models and interfaces for devices in the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat). This repository also stores [common interfaces](./concepts-common-interfaces.md) and [DCMs and interfaces published by Microsoft Partners](./howto-onboard-portal.md). To learn how to certify a device and add its device capability model to the public repository, see the tutorial [Certify your IoT Plug and Play device](./tutorial-certification-test.md).
- There are multiple _Company repositories_. A company repository is automatically created for your organization when you [onboard to the Azure Certified for IoT portal](./howto-onboard-portal.md). You can use your company repository to store your device capability models and interfaces during development and test.

## Azure Certified for IoT portal

In the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com), you can complete the following tasks:

- [Complete the certification process for your IoT device](./tutorial-certification-test.md).
- Find IoT Plug and Play device capability models. You can use these models to [quickly build IoT ready devices and integrate them with solutions](./quickstart-connect-pnp-device-solution-node.md).

## Azure CLI

The Azure CLI provides commands for managing device capability models and interfaces in the IoT Plug and Play public and company model repositories. For more information, see the [Install and use the Azure IoT extension for Azure CLI](./howto-install-pnp-cli.md) how-to guide.

## Visual Studio Code

To open the **Model Repository** view in Visual Studio Code.

1. Open Visual Studio Code, use **Ctrl+Shift+P**, type and select **IoT Plug and Play: Open Model Repository**.

1. You can choose to **Open Public Model Repository** or **Open Organizational Model Repository**. For company model repository, you need to enter your model repository connection string. You can find this connection string in the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com) on the **Connection strings** tab for your **Company repository**.

1. A new tab opens the **Model Repository** view.

    Use this view to add, download, and delete device capability models and interfaces. You can use a filter to find specific items in the list.

1. To switch between your company model repository and the public model repository, use **Ctrl+Shift+P**, type and select **IoT Plug and Play: Sign out Model Repository**. Then use the **IoT Plug and Play: Open Model Repository** command again.

> [!NOTE]
> In VS Code, the public model repository is read-only. Microsoft Partners can update the public repository in the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com).

## Next steps

The suggested next step is to learn how to [submit an IoT Plug and Play device for certification](tutorial-certification-test.md).
