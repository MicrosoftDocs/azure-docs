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

The Azure CLI provides the following commands for managing interfaces in the Plug and Play model repository:

### Create an interface

```cli
az iot pnp interface create
```

For example, to create an interface in the Plug and Play model repository

```cli
az iot pnp interface create --definition [Path to PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]
```

### Update an interface

```cli
az iot pnp interface update
```

For example, to update an interface in the Plug and Play model repository:

```cli
az iot pnp interface update --definition [Path to updated PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]
```

### Show information about an interface

```cli
az iot pnp interface show
```

For example, to show an interface in the Plug and Play model repository:

```cli
az iot pnp interface show --interface [Interface Id] --repository [Model repo name OR connection string]
```

### List interfaces in the repository

```cli
az iot pnp interface list
```

For example, to list the interfaces in the Plug and Play model repository:

```cli
az iot pnp interface list --repository [Model repo name OR connection string]
```

### Publish an interface

This operation makes the interface immutable.

```cli
az iot pnp interface publish
```

For example, to publish an interface in the Plug and Play model repository.

```cli
az iot pnp interface publish --interface [Interface Id] --repository [Model repo name OR connection string]
```

### Delete an interface

```cli
az iot pnp interface delete
```

For example, to delete an interface:

```cli
az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string]
```

For example, to delete a published interface with the `--force` switch:

```cli
az iot pnp interface delete --interface [Interface Id] --repository [Model repo name OR connection string] --force
```

## Visual Studio Code

The third option to manage the models in repo is VSC. Here is how to do it.

## Next steps

The suggested next step is to learn how to [submit a Plug and Play device for certification](tutorial-certification-product.md).
