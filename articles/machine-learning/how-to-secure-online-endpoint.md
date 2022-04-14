---
title: Secure online endpoints with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: seramasu
author: rsethur
ms.date: 04/14/2022
ms.custom: 

---

# Secure online endpoints with Azure Virtual Network

If your Azure Machine Learning workspace is connected to an Azure Virtual Network (VNet) using a private endpoint, your can configure your online endpoints to use the VNet for secure communications. Securing an online endpoint with a VNet is currently a preview feature.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

When securing an online endpoint with a virtual network, you can secure the inbound communication from clients (scoring requests for example) separately from the outbound communications between the online endpoint and associated resources in the VNet. For example, you may allow scoring requests over the public network while restricting communications between the online endpoint, workspace, Azure Container Registry, etc. to the VNet.

## Prerequisites

* To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace, and the workspace must use a private endpoint to communicate with a virtual network. If you don't have one, use the steps in the [Create a secure workspace using a template](tutorial-create-secure-workspace-template.md) tutorial to create an example workspace and virtual network configuration.

> [!IMPORTANT]
> The sample code in this article is based on the files provided in the __azureml-examples__ GitHub repository. To clone the samples repository and switch to the repository's `cli/` directory: 
>
> ```azurecli
> git clone https://github.com/Azure/azureml-examples
> cd azureml-examples/cli
> ```

## Limitations

Your Azure Machine Learning workspace can be configured to allow public network access, even while participating in a VNet. This behavior is configured using the `public_network_access` flag on the workspace. If this flag is `disabled`, then communication with the workspace is restricted to the VNet.

* If this flag is `disabled`, you can't create online endpoint deployments that communicate with public networks. You can only create deployments that use the VNet.
* If the flag was originally `enabled`, and you switch it to `disabled`, any existing online endpoint deployments that allowed public network communications will start failing.

## Inbound (scoring)

To restrict communications to the online endpoint to the virtual network, set the `public_network_access` flag for the endpoint to `disabled`:

code snippet goes here

When `public_network_access` is `disabled`, inbound scoring requests are received using the private endpoint(s) of the Azure Machine Learning workspace.

## Outbound (resource access)

To restrict communication between the online endpoint and the Azure resources used by the endpoint (Azure Container Registry, Key Vault, Storage Account, and Machine Learning workspace), set the `private_network_connection` flag to `true`:

code snippet goes here

When you configure the `private_network_connection` to `true`, a new private endpoint is created _per deployment_. For example, if you set the flag to `true` for three deployments to an online endpoint, three private endpoints are created.

## Scenarios

The following table lists the supported configurations when configuring inbound and outbound communications for an online endpoint:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Deployment property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled | `private_network_connection` is true   | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | `private_network_connection` is false  | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | `private_network_connection` is true    | Yes |
| public inbound with public outbound | `public_network_access` is enabled | `private_network_connection` is false  | Yes |

## Next steps