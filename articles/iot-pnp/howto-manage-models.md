---
title: Manage Plug and Play models in the repository| Microsoft Docs'
description: How to manage device capability models in the repository using the Azure Certified for IoT portal, the Azure CLI, and Visual Studio code.
author: YasinMSFT
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: conceptual
ms.date: 06/12/2019
ms.author: yahajiza
---

# Manage models in the repository

The Plug and Play model repository stores device capability models and interfaces. The repository makes the models and interfaces discoverable and consumable by solution developers.

There are three tools you can use to manage the repository:

- The Azure Certified for IoT portal
- The Azure CLI
- Visual Studio Code

## Azure Certified for IoT portal

In the Azure Certified for IoT portal, you can complete the following tasks:

- Complete the certification process for your IoT device.
- Find IoT Plug and Play device capability models. You can use these models to quickly build IoT ready devices and integrate them with solutions.

## Azure CLI

The Azure CLI provides commands for managing interfaces in the Plug and Play model repository. You can use the CLI commands to:

- Show information about an interface
- List interfaces in the repository
- Create an interface
- Update an interface
- Publish an interface
- Delete an interface

For more information, see [Install and use the Azure IoT extension for Azure CLI](./howto-install-pnp-cli.md).

## Visual Studio Code

To open the **Model Repository** view in VS Code.

1. Open VS Code, use **Ctrl+Alt+P**, type and select **IoT Plug and Play: Open Model Repository**.

1. You can choose to **Open Public Model Repository** or **Open Organizational Model Repository**. For organizational model repository, you need to enter your model repository connection string.

1. A new tab opens the Model Repository view.

    Use this view to add, download, and delete device capability models and interfaces. You can use a filter to find specific items in the list.

1. To switch to another organizational model repository, use **Ctrl+Alt+P**, type and select **IoT Plug and Play: Sign out Model Repository**. Then use open model repository command again.

## Next steps

The suggested next step is to learn how to [submit an IoT Plug and Play device for certification](tutorial-certification-test.md).
