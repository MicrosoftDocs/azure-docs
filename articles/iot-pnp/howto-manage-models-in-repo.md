---
title: 'Manage Models in the Repository| Microsoft Docs'
description: Manage Models in the Repository
author: YasinMSFT
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: conceptual
ms.date: 06/12/2019
ms.author: yahajiza
---

# Manage Models in the Repository



The Plug and Play Model Repository is a store that contains device capability models and interfaces and makes them available to be discovered and consumed by solution developers. A Device Capability Model is used to describe a complete entity, such as a physical device and defines the set of interfaces implemented by the entity.

There are three mechanisms. These include the Azure Certified for IoT portal, Azure CLI, and VSC.

## Azure Certified for IoT Portal

In the IoT portal you can do the following.

## Azure CLI

Command Group: az iot pnp interface
PnP provides concepts such as interfaces and capability models to define behavior and functionality of a device. Thiscommand group provides interface management capabilities.
az iot pnp interface create
Examples:
•	Create an Interface on the PnP Model Repository
az iot pnp interface create --definition [Path to PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]
az iot pnp interface update
Examples:
•	Update an Interface on the PnP Model Repository
az iot pnp interface update --definition [Path to updated PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]
az iot pnp interface show
Examples:
•	Show an Interface on the PnP Model Repository
az iot pnp interface show --interface [Interface Id] --repository [Model repo name OR connection string]
az iot pnp interface list
Examples:
•	List Interfaces on the PnP Model Repository
az iot pnp interface list --repository [Model repo name OR connection string]
az iot pnp interface publish
Examples:
•	Publish an Interface on the PnP Model Repository. This operation makes the interface immutable.
az iot pnp interface publish --interface [Interface Id] --repository [Model repo name OR connection string]
az iot pnp interface delete
Examples:
•	Delete an Interface
az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string]
•	Delete a published Interface with the --force switch
az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string] --force




You can use the Azure Certified for IoT portal to:

- Complete the certification process for your IoT device.
- Find IoT Plug and Play device capability models. You can use these models to quickly build IoT ready devices and integrate them with solutions.

##VSC

The third option to manage the models in repo is VSC. Here is how to do it.

## Next steps

The suggested next step is to learn how to [submit a Plug and Play device for certification](tutorial-certification-product.md).
