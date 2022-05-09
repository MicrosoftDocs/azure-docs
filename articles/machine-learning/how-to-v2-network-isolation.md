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

Our legacy v1 API platform relies on two services, which are __ARM__ and __Azure Machine Learning workspace__. Workspace and compute create/update/delete (CRUD) operations use ARM, and all other operations use the workspace. 

Our new v2 API platform uses ARM for _all_ operations. It provides a consistent API in one place, and the following Azure Resource Manager benefits:
* Azure role-based access control (Azure RBAC)
* Azure Policy
* Integration with Azure Resource Graph

The Azure Machine Learning CLI v2 uses our new v2 API platform. New features such as [managed online endpoints](concept-endpoints.md) are only available using the v2 API platform.

## What are the Network Isolation Changes with V2

When you configure an Azure Machine Learning [workspace with a private endpoint](how-to-configure-private-link.md), network isolation works only for workspace operations. Our new API Platform uses ARM, which means the workspace private endpoint can't provide network isolation for our new API Platform. Metadata such as your resource ID and parameters related to your machine learning operations are included in the ARM communication. For example, the [create or update job](/rest/api/azureml/jobs/create-or-update) api sends metadata, and [parameters](/azure/machine-learning/reference-yaml-job-command).

If you want to use the v2 API, and want to enable network isolation for the ARM communication, use the steps in the [Create private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal) article. Creating a private link for Azure Resource Manager communications, and using a workspace with a private endpoint, provides the same level of network isolate as the v1 API platform.

If you __don't__ want to use the v2 API, Azure Machine Learning will provide a *v1_legacy_mode* parameter you can set to limit your workspace to only use the v1 legacy API platform.

## Scenarios and Required Actions

>[!WARNING]
>This parameter is not implemented yet. It will be implemented on May 26th, 2022.

We provide a new workspace level parameter called v1_legacy_mode. By default, if you create a workspace and configure a private endpoint during workspace creation, this parameter will be enabled. The following are the scenarios that are impacted by this behavior:

* If you have an __existing__Azure Machine Learning workspace with a private endpoint, which was created before this parameter was implemented, __this parameter will automatically be enabled for your workspace__. So your existing v1 API communications will continue to be secured using the workspace private endpoint.

* If you create a __new__ Azure Machine Learning workspace with a private endpoint, __this parameter will be enabled for your workspace__. Even if you use the v2 API to create the workspace, the v1_legacy_mode will be enabled if the workspace is created with a private endpoint configuration.

* If you create a new __public__ workspace (no private endpoint), then the v1_legacy_mode is disabled. This behavior is for both the v1 and v2 APIs.

This behavior prevents you from being in a situation where only some of the API communications are secured by the workspace private endpoint.

__If you want to use the v2 API with your private endpoint enabled workspace__, you must __disable__ the v1_legacy_mode parameter.

## How to update v1_legacy_mode parameter

>[!WARNING]
>This parameter is not implemented yet. It will be implemented on May 26th, 2022.

To update v1_legacy_mode, use the following steps:

# [Python](#tab/python)

To disable v1_legacy_mode, use [Workspace.update](/python/api/azureml-core/azureml.core.workspace(class)#update-friendly-name-none--description-none--tags-none--image-build-compute-none--service-managed-resources-settings-none--primary-user-assigned-identity-none--allow-public-access-when-behind-vnet-none-) and set `v1_legacy_mode=Disabled`.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
ws.update(v1_legacy_mode=Enabled)
```


# [Azure CLI extension v2 preview](#tab/azurecliextensionv2)

When using the Azure CLI [extension v2 CLI preview for machine learning](how-to-configure-cli.md), create a YAML document that sets the `v1_legacy_mode` property to `Disabled`. Then use the `az ml update` command to update the workspace:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/workspace.schema.json
name: mlw-privatelink-prod
location: eastus
display_name: Private Link endpoint workspace-example
description: When using private link, you must set the image_build_compute property to a cluster name to use for Docker image environment building. You can also specify whether the workspace should be accessible over the internet.
image_build_compute: cpu-compute
v1_legacy_mode: Enabled
tags:
  purpose: demonstration
```

```azurecli
az ml workspace update -f workspace.yml
```

# [Azure CLI extension v1](#tab/azurecliextensionv1)

The Azure CLI [extension v1 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml/workspace#az-ml-workspace-update) command. To enable public access to the workspace, add the parameter `--v1-legacy-mode disabled`.

---

## Next steps

* [Use a private endpoint with Azure Machine Learning workspace](how-to-configure-private-link.md).
* [Create private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal).