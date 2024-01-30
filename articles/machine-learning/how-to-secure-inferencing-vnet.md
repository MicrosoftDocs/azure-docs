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
---

# Secure an Azure Machine Learning inferencing environment with virtual networks

In this article, you learn how to secure inferencing environments (online endpoints) with a virtual network in Azure Machine Learning. There are two inference options that can be secured using a VNet:

* Azure Machine Learning managed online endpoints

   > [!TIP]
   > Microsoft recommends using an Azure Machine Learning **managed virtual networks** (preview) instead of the steps in this article when securing managed online endpoints. With a managed virtual network, Azure Machine Learning handles the job of network isolation for your workspace and managed computes. You can also add private endpoints for resources needed by the workspace, such as Azure Storage Account. For more information, see [Workspace managed network isolation](how-to-managed-network.md).

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

+ An existing virtual network and subnet that is used to secure the Azure Machine Learning workspace.

[!INCLUDE [network-rbac](includes/network-rbac.md)]

+ If using Azure Kubernetes Service (AKS), you must have an existing AKS cluster secured as described in the [Secure Azure Kubernetes Service inference environment](how-to-secure-kubernetes-inferencing-environment.md) article.

## Secure managed online endpoints

For information on securing managed online endpoints, see the [Use network isolation with managed online endpoints](how-to-secure-online-endpoint.md) article.

## Secure Azure Kubernetes Service online endpoints

To use Azure Kubernetes Service cluster for secure inference, use the following steps:

1. Create or configure a [secure Kubernetes inferencing environment](how-to-secure-kubernetes-inferencing-environment.md).
2. Deploy [Azure Machine Learning extension](how-to-deploy-kubernetes-extension.md).
3. [Attach the Kubernetes cluster to the workspace](how-to-attach-kubernetes-anywhere.md).
4. Model deployment with Kubernetes online endpoint can be done using CLI v2, Python SDK v2 and Studio UI.
 
   * CLI v2 - https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes
   * Python SDK V2 - https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/kubernetes
   * Studio UI - Follow the steps in [managed online endpoint deployment](how-to-use-managed-online-endpoint-studio.md) through the Studio. After you enter the __Endpoint name__, select __Kubernetes__ as the compute type instead of __Managed__.


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
