---
title: 'Manage Models in the Repository| Microsoft Docs'
description: Manage Models in the Repository
author: YasinMSFT
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: conceptual
ms.date: 07/12/2019
ms.author: yahajiza
---

# Manage Models in the Repository
The Plug and Play Model Repository is a store that contains device capability models and interfaces and makes them available to be discovered and consumed by solution developers. A Device Capability Model is used to describe a complete entity, such as a physical device and defines the set of interfaces implemented by the entity. . You can share models from your company repository to the public repository; where it be consumed by others.

There are three mechanisms to manage capability models in repositories. These include the Azure Certified for IoT portal, Azure CLI, and Visual Studio Code.

## Azure Certified for IoT Portal

In the IoT portal you can do the following.

## Azure CLI

Command Group: `az iot pnp interface`

PnP provides concepts such as interfaces and capability models to define behavior and functionality of a device. This command group provides interface management capabilities.

az iot pnp interface create

Examples:

• Create an Interface on the PnP Model Repository

`az iot pnp interface create --definition [Path to PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]`

az iot pnp interface update

Examples:

• Update an Interface on the PnP Model Repository

`az iot pnp interface update --definition [Path to updated PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]`

az iot pnp interface show

Examples:

• Show an Interface on the PnP Model Repository

`az iot pnp interface show --interface [Interface Id] --repository [Model repo name OR connection string]`

az iot pnp interface list

Examples:

• List Interfaces on the PnP Model Repository

`az iot pnp interface list --repository [Model repo name OR connection string]`

az iot pnp interface publish

Examples:

• Publish an Interface on the PnP Model Repository. This operation makes the interface immutable.

`az iot pnp interface publish --interface [Interface Id] --repository [Model repo name OR connection string]`

az iot pnp interface delete

Examples:

• Delete an Interface

`az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string]`

• Delete a published Interface with the --force switch

`az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string] --force`

## Visual Studio Code

Models in a repository can also be managed using Visual Studio Code.

## Next steps
