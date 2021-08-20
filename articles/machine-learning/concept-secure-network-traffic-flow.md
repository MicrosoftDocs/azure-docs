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

When your Azure Machine Learning workspace and associated resources are secured in an Azure Virtual Network, it changes how network communication flows between resources. Without a virtual network, network traffic flows over the public internet or within an Azure data center. Once a virtual network (VNet) is introduced, you may also want to harden network security. For example, blocking inbound and outbound communications between the VNet and public internet.

However, Azure Machine Learning requires access to some resources on the public internet. For example, Azure Resource Management is used for deployments and management operations.

This article lists the required inbound/outbound communication with the public internet. It also explains how network communication flows between your client development environment and a secured Azure Machine Learning workspace. It covers the following scenarios commonly used with Azure Machine Learning:

* Using Azure Machine Learning studio to work with:

    * Your workspace
    * AutoML
    * Designer
    * Datasets and datastores

    > [!TIP]
    > Azure Machine Learning studio is a web-based UI that runs partially in your web browser, and makes calls to Azure services to perform tasks such as training a model, using designer, or viewing datasets. Some of these calls use a different communication flow than if you are using the SDK, CLI, REST API, or VS Code.

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

> [!NOTE]
> The information in this section is specific to using the workspace from the Azure Machine Learning studio. If you use the Azure Machine Learning SDK, REST API, CLI, or Visual Studio Code, the information in this section does not apply to you.

When accessing your workspace from studio, the communication flows are as follows:

* To authenticate to resources, traffic must be able to reach Azure Active Directory.
* To perform management or deployment operations, traffic must be able to reach Azure Resource Manager.
* To perform Azure Machine Learning specific tasks, traffic must be able to reach the Azure Machine Learning service and Azure Frontdoor.
* For most storage operations, traffic flows through the private endpoint of the default storage for your workspace. Exceptions are discussed in the [Use AutoML, designer, dataset, and datastore]() section.

You will also need a DNS solution that allows you to resolve the names of the resources within the VNet. For more information, see [Use your workspace with a custom DNS](how-to-custom-dns.md).





## Scenario: Use AutoML, designer, dataset, and datastore from studio

## Scenario: Use compute instance and compute cluster

## Scenario: Use Azure Kubernetes Service

## Scenario: Use Docker images managed by Azure ML

Azure Machine Learning provides Docker images that can be used to train models or perform inference. If you don't specify your own images, the ones provided by Azure Machine Learning are used. These images are hosted on the Microsoft Container Registry (MCR). They are also hosted on a geo-replicated Azure Container Registry named Vienna Global.


