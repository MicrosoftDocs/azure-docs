---
title: Secure network communication
titleSuffix: Azure Machine Learning
description: Learn how network communication flows between components when your Azure Machine Learning workspace is in a secured virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 08/18/2021
---

# blah

When your Azure Machine Learning workspace and associated resources are secured in an Azure Virtual Network, it changes how network communication flows between resources. Without a virtual network, network traffic flows over the public internet or within an Azure data center. Once a virtual network (VNet) is introduced, it may restrict traffic and cause errors or unexpected behavior.

This article explains how network communication works with Azure Machine Learning when your workspace is in a VNet. It covers the following scenarios commonly used with Azure Machine Learning:

* Using Azure Machine Learning studio to work with:

    * Your workspace
    * AutoML
    * Designer
    * Datasets and datastores

* Using Azure Machine Learning studio, SDK, CLI, or REST API to work with:

    * Compute instances and clusters
    * Azure Kubernetes Service
    * Docker images managed by Azure Machine Learning

> [!NOTE]
> This article assumes you are using the following configuration:
> * Azure Machine Learning workspace using a private endpoint to communicate with the VNet.
> * The Azure Storage Account, Key Vault, and Container Registry used by the workspace also use a private endpoint to communicate with the VNet.
> * A VPN gateway or Express Route is used by the client workstations to access the VNet.


## Inbound and outbound requirements

TODO: Figure out how to represent the table in the limited width of a doc.

## Scenario: Access workspace from studio

The network communication pattern for accessing your workspace is different depending on whether you are using the Azure Machine Learning studio or using the SDK (including the CLI or REST API).

## Scenario: Use AutoML, designer, dataset, and datastore from studio

## Scenario: Use compute instance and compute cluster

## Scenario: Use Azure Kubernetes Service

## Scenario: Use Docker images managed by Azure ML

Azure Machine Learning provides Docker images that can be used to train models or perform inference. If you don't specify your own images, the ones provided by Azure Machine Learning are used. These images are hosted on the Microsoft Container Registry (MCR). They are also hosted on a geo-replicated Azure Container Registry named Vienna Global.


