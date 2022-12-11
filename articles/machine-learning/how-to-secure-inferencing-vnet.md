---
title: Secure inferencing environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning inferencing environment.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 09/06/2022
ms.custom: 
---

# Secure an Azure Machine Learning inferencing environment with virtual networks

> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK or CLI version you are using:"]
> * [SDK/CLI v1](v1/how-to-secure-inferencing-vnet.md)
> * [SDK/CLI v2 (current version)](how-to-secure-inferencing-vnet.md)

In this article, you learn how to secure inferencing environments (online endpoints) with a virtual network in Azure Machine Learning. There are two inference options that can be secured using a VNet:

* Azure Machine Learning managed online endpoints
* Azure Kubernetes Service 

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the training environment](how-to-secure-training-vnet.md)
> * [Enable studio functionality](how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](how-to-custom-dns.md)
> * [Use a firewall](how-to-access-azureml-behind-firewall.md)
>
> For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet, that is used to secure the Azure Machine Learning workspace.

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access control (Azure RBAC):

    - "Microsoft.Network/virtualNetworks/join/action" on the virtual network resource.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking).

+ If using Azure Kubernetes Service (AKS), you must have an existing AKS cluster secured as described in the [Secure Azure Kubernetes Service inference environment](how-to-secure-kubernetes-inferencing-environment.md) article.

## Secure managed online endpoints

For information on securing managed online endpoints, see the [Use network isolation with managed online endpoints (preview)](how-to-secure-online-endpoint.md) article.

## Secure Azure Kubernetes Service

To configure and attach an Azure Kubernetes Service cluster for secure inference, use the following steps:

1. Create or configure a [secure Kubernetes inferencing environment](how-to-secure-kubernetes-inferencing-environment.md).
1. [Attach the Kubernetes cluster to the workspace](how-to-attach-kubernetes-anywhere.md).

Afterwards, you can use the cluster for inference deployments to online endpoints. For more information, see [How to deploy an online endpoint](how-to-deploy-managed-online-endpoints.md).

## Limit outbound connectivity from the virtual network

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, you must allow access to Azure Container Registry. For example, make sure that your Network Security Groups (NSG) contains a rule that allows access to the __AzureContainerRegistry.RegionName__ service tag where `{RegionName} is the name of an Azure region.

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)