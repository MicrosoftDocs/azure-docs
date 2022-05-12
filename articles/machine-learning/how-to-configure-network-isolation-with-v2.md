---
title: Network Isolation Change with Our New API Platform on Azure Resource Manager
titleSuffix: Azure Machine Learning
description: 'Explain network isolation changes with our new API platform on Azure Resource Manager and how to maintain network isolation'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 05/09/2022
---

# Network Isolation Change with Our New API Platform on Azure Resource Manager

In this article, you'll learn about network isolation changes with our new v2 API platform on Azure Resource Manager (ARM) and its effect on network isolation.

## What is the New API platform on Azure Resource Manager (ARM)

Our legacy v1 API platform handles two types of operations:
* __Azure Resource Manager (ARM)__ - Create, update, and delete (CRUD) operations on the workspace and compute.
* __Azure Machine Learning workspace__. All other operations.

Our new v2 API platform uses public ARM operations on the following resource types:
* Workspace
* Compute
* Datastore
* Dataset
* Job
* Environment
* Code
* Component
* Endpoints (both batch and online)


The v2 API provides a consistent API in one place, and the following Azure Resource Manager benefits:
* Azure role-based access control (Azure RBAC)
* Azure Policy
* Integration with Azure Resource Graph

The Azure Machine Learning CLI v2 uses our new v2 API platform. New features such as [managed online endpoints](concept-endpoints.md) are only available using the v2 API platform.

## What are the Network Isolation Changes with V2

As mentioned in the previous section, there are two types of operations; with ARM and with the workspace. You can enable network isolation for both types:

| Operation type | Enable network isolation using |
| ----- | ----- |
| Azure Resource Manager | Azure Resource Manager Private Link (preview) |
| Workspace | [Azure Machine Learning workspace private endpoint](how-to-configure-private-link.md) |

With the __legacy v1 API__, most operations used the workspace. Adding a private endpoint to the workspace enabled network isolation for everything except CRUD operations on the workspace or compute resources.

With the __new v2 API__, most operations use ARM. So enabling a private endpoint on your workspace doesn't provide the same level of network isolation that you may be used to with the v1 API.

> [!TIP]
> * Communications between the workspace and other Azure services such as storage, key vault, and container registry are secured by the private endpoint(s) on the services.
> * Even without network isolation, your communication with the workspace and ARM is encrypted using TLS 1.2.

While you can use Azure Private Link for ARM to enable network isolation for ARM communication, it's a preview feature and operates at the tenant level. We understand that this feature may not be acceptable for your organization. 

To enable your security team to configure a network isolated workspace to only accepting v1 legacy APIs, we're introducing the *v1_legacy_mode* parameter.

> [!IMPORTANT]
> Enabling v1_legacy_mode may prevent you from using features provided by the v2 API. For example, some features of Azure Machine Learning studio may be unavailable.

## Scenarios and Required Actions

>[!WARNING]
>The *v1_legacy_mode* parameter is not implemented yet. It will be implemented the week of May 15th, 2022.

We'll provide a new workspace level parameter called v1_legacy_mode. The purpose of this parameter is to allow you to prevent the use of the v2 API with a workspace. For example, if your security policies prevent using a preview or tenant level feature like Azure Resource Manager Private Link.

> [!TIP]
> If you do not plan to enable network isolation for your workspace, you do not need to enable this parameter.

<!-- By default, if you create a workspace _and configure a private endpoint during workspace creation_, this parameter will be enabled. The following are the scenarios that are impacted by this behavior:

* If you have an __existing__ Azure Machine Learning workspace with a private endpoint, which was created before this parameter was implemented, __this parameter will automatically be enabled for your workspace__. So your existing v1 API communications will continue to be secured using the workspace private endpoint.

* If you create a __new__ Azure Machine Learning workspace with a private endpoint, __this parameter will be enabled for your workspace__. Even if you use the v2 API to create the workspace, the v1_legacy_mode will be enabled if the workspace is created with a private endpoint configuration.

* If you create a new __public__ workspace (no private endpoint), then the v1_legacy_mode is disabled. This behavior is for both the v1 and v2 APIs.

This behavior prevents you from being in a situation where only some of the API communications are secured by the workspace private endpoint.

__If you want to use the v2 API with your private endpoint enabled workspace__, you must __disable__ the v1_legacy_mode parameter. -->

## How to update v1_legacy_mode parameter

>[!WARNING]
>This parameter is not implemented yet. It will be implemented the week of May 15th, 2022.

To update v1_legacy_mode, use the following steps:

# [Python](#tab/python)

To disable v1_legacy_mode, use [Workspace.update](/python/api/azureml-core/azureml.core.workspace(class)#update-friendly-name-none--description-none--tags-none--image-build-compute-none--service-managed-resources-settings-none--primary-user-assigned-identity-none--allow-public-access-when-behind-vnet-none-) and set `v1_legacy_mode=Disabled`.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
ws.update(v1_legacy_mode=Enabled)
```

# [Azure CLI extension v1](#tab/azurecliextensionv1)

The Azure CLI [extension v1 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml/workspace#az-ml-workspace-update) command. To enable the parameter for a workspace, add the parameter `--set v1-legacy-mode=true`.

---

## Next steps

* [Use a private endpoint with Azure Machine Learning workspace](how-to-configure-private-link.md).
* [Create private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal).