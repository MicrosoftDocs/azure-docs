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

- The Azure CLI

- Visual Studio Code

- The [Azure Certified for IoT portal](https://aka.ms/ACFI)  

## Public and Private models and interfaces

Models and interfaces can be public or private.

Public models and interfaces have been published and are visible to all service principals and users. Some examples of public models are:

- The device capability models and interfaces for devices in the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat).

- The [common interfaces](./concepts-common-interfaces.md) and DCMs and interfaces published by Microsoft Partners.

Private models and interfaces are maintained by your company. Access to these models and interfaces is controlled with role-based access control (RBAC) both on your organization's tenant and on individual models and interfaces. These controls determine who can create, read, and publish interfaces and models in your organization. You can also grant read access on your private models and interfaces to service principals and external users. Some examples of the use of private models and interfaces are:

- Models and interfaces that your company uses during development and test.

- Models and interfaces that you may choose to expose to only a limited audience of your partners.

To learn more about the model repository and RBAC, see [Understand the IoT Plug and Play Preview model repository](concepts-model-repository.md).

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

The suggested next step is to learn how to [Connect to a device in your solution](howto-connect-pnp-device-solution.md).
