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
ms.date: 05/06/2022
---

# Network Isolation Change with Our New API Platform on Azure Resource Manager

In this article, you'll learn about network isolation changes with our new API platform on Azure Resource Manager (ARM). You'll also learn how to maintain network isolation.

## What is the New API platform on Azure Resource Manager (ARM)

Our legacy v1 API platform relies on two services, which are __ARM__ and __Azure Machine Learning workspace__. Workspace and compute create/update/delete (CRUD) operations use ARM, and all other operations use the workspace. 

Our new v2 API platform uses ARM for _all_ operations. It provides a consistent API in one place, and the following Azure Resource Manager benefits:
* Azure role-based access control (Azure RBAC)
* Azure Policy
* Integration with Azure Resource Graph

Azure Machine Learning CLI v2 and SDK v2 use our new v2 API platform. New features such as [managed online endpoints](concept-endpoints.md) are only available using the v2 API platform.

## What are the Network Isolation Changes with V2

Workspace private link works only for workspace operations. Our new API Platform uses ARM, which means the workspace private link can't provide network isolation for our new API Platform.

Metadata such as your resource ID and parameters related to your machine learning operations are included in the ARM communication. For example, the [create or update job](/rest/api/azureml/jobs/create-or-update) api sends metadata, and [parameters](/azure/machine-learning/reference-yaml-job-command).

Azure Machine Learning will provide an additional parameter you can set to limit your workspace to only use the v1 legacy API platform.

## Scenarios and Required Actions

>[!WARNING]
>This parameter is not implemented yet. It will be implemented in **XXXXXXXXXXXXXXXXXX**.

We provide a new workspace level parameter called v1_legacy_mode. If you use a public workspace, no action is required. If you want to use v2 API platform with a private link enabled workspace, you need to disable v1_legacy_mode parameter by yourself. If you enable it, you can't use CLI v2, SDK v2, new features available only on v2 such as managed online endpoint.

|Scenario|v1_legacy_mode parameter default value|Required Actions|
|---|---|---|
|Public Workspace (both new and existing)| disabled | No action required, you can use v2.|
|Private Link Enabled Workspace (both new and existing)| enabled |No action required to keep using V1. You need to disable the parameter to use V2.|

## How to update v1_legacy_mode parameter

>[!WARNING]
>This parameter is not implemented yet. It will be implemented in **XXXXXXXXXXXXXXXXXX**.

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

---
# [Azure CLI extension v1](#tab/azurecliextensionv1)

The Azure CLI [extension v1 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml/workspace#az-ml-workspace-update) command. To enable public access to the workspace, add the parameter `--v1-legacy-mode disabled`.


## Policy Control

You can use (**we need to add link**) built-in policy to control v1_legacy_mode parameter on the workspace.

## ARM Private Link

See [this doc](/azure/azure-resource-manager/management/create-private-link-access-portal).