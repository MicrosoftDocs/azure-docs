---
title: Network isolation change with our new API platform on Azure Resource Manager
titleSuffix: Azure Machine Learning
description: 'Explain network isolation changes with our new API platform on Azure Resource Manager and how to maintain network isolation'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/13/2023
---

# Network Isolation Change with Our New API Platform on Azure Resource Manager

In this article, you'll learn about network isolation changes with our new v2 API platform on Azure Resource Manager (ARM) and its effect on network isolation.
 
## What is the new API platform on Azure Resource Manager (ARM)

There are two types of operations used by the v1 and v2 APIs, __Azure Resource Manager (ARM)__ and __Azure Machine Learning workspace__.

With the v1 API, most operations used the workspace. For v2, we've moved most operations to use public ARM.

| API version | Public ARM | Inside workspace virtual network |
| ----- | ----- | ----- |
| v1 | Workspace and compute create, update, and delete (CRUD) operations. | Other operations such as experiments. |
| v2 | Most operations such as workspace, compute, datastore, dataset, job, environment, code, component, endpoints. | Remaining operations. |


The v2 API provides a consistent API in one place. You can more easily use Azure role-based access control and Azure Policy for resources with the v2 API because it's based on Azure Resource Manager.

The Azure Machine Learning CLI v2 uses our new v2 API platform. New features such as [managed online endpoints](concept-endpoints.md) are only available using the v2 API platform.

## What are the network isolation changes with V2

As mentioned in the previous section, there are two types of operations; with ARM and with the workspace. With the __legacy v1 API__, most operations used the workspace. With the v1 API, adding a private endpoint to the workspace provided network isolation for everything except CRUD operations on the workspace or compute resources.

With the __new v2 API__, most operations use ARM. So enabling a private endpoint on your workspace doesn't provide the same level of network isolation. Operations that use ARM communicate  over public networks, and include any metadata (such as your resource IDs) or parameters used by the operation. For example, the [parameters](./reference-yaml-job-command.md).

> [!IMPORTANT]
> For most people, using the public ARM communications is OK:
> * Public ARM communications is the standard for management operations with Azure services. For example, creating an Azure Storage Account or Azure Virtual Network uses ARM.
> * The Azure Machine Learning operations do not expose data in your storage account (or other storage in the VNet) on public networks. For example, a training job that runs on a compute cluster in the VNet, and uses data from a storage account in the VNet, would securely access the data directly using the VNet.
> * All communication with public ARM is encrypted using TLS 1.2.

If you need time to evaluate the new v2 API before adopting it in your enterprise solutions, or have a company policy that prohibits sending communication over public networks, you can enable the *v1_legacy_mode* parameter. When enabled, this parameter disables the v2 API for your workspace.

> [!WARNING]
> Enabling v1_legacy_mode may prevent you from using features provided by the v2 API. For example, some features of Azure Machine Learning studio may be unavailable.

## Scenarios and Required Actions

> [!WARNING]
> The *v1_legacy_mode* parameter is available now, but the v2 API blocking functionality will be enforced starting the week of May 15th, 2022.

* If you don't plan on using a private endpoint with your workspace, you don't need to enable parameter.

* If you're OK with operations communicating with public ARM, you don't need to enable the parameter.

* You only need to enable the parameter if you're using a private endpoint with the workspace _and_ don't want to allow operations with ARM over public networks.

Once we implement the parameter, it will be retroactively applied to existing workspaces using the following logic:

* If you have __an existing workspace with a private endpoint__, the flag will be __true__.

* If you have __an existing workspace without a private endpoint__ (public workspace), the flag will be __false__.

After the parameter has been implemented, the default value of the flag depends on the underlying REST API version used when you create a workspace (with a private endpoint):

* If the API version is __older__ than `2022-05-01`, then the flag is __true__ by default. 
* If the API version is `2022-05-01` or __newer__, then the flag is __false__ by default.

> [!IMPORTANT]
> If you want to use the v2 API with your workspace, you must set the v1_legacy_mode parameter to __false__.

## How to update v1_legacy_mode parameter

> [!WARNING]
> The *v1_legacy_mode* parameter is available now, but the v2 API blocking functionality will be enforced starting the week of May 15th, 2022.

To update v1_legacy_mode, use the following steps:

# [Python SDK](#tab/python)


> [!IMPORTANT]
> If you want to disable the v2 API, use the [Azure Machine Learning Python SDK v1](/python/api/overview/azure/ml/install).

To disable v1_legacy_mode, use [Workspace.update](/python/api/azureml-core/azureml.core.workspace(class)#update-friendly-name-none--description-none--tags-none--image-build-compute-none--service-managed-resources-settings-none--primary-user-assigned-identity-none--allow-public-access-when-behind-vnet-none-) and set `v1_legacy_mode=false`.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
ws.update(v1_legacy_mode=False)
```

# [Azure CLI extension v1](#tab/azurecliextensionv1)

The Azure CLI [extension v1 for machine learning](./v1/reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml(v1)/workspace#az-ml(v1)-workspace-update) command. To disable the parameter for a workspace, add the parameter `--v1-legacy-mode False`.

> [!IMPORTANT]
> The `v1-legacy-mode` parameter is only available in version 1.41.0 or newer of the Azure CLI extension for machine learning v1 (`azure-cli-ml`). Use the `az version` command to view version information.

```azurecli
az ml workspace update -g <myresourcegroup> -n <myworkspace> --v1-legacy-mode False
```

The return value of the `az ml workspace update` command may not show the updated value. To view the current state of the parameter, use the following command:
 
```azurecli
az ml workspace show -g <myresourcegroup> -n <myworkspace> --query v1LegacyMode
```

---
    
> [!IMPORTANT]
> Note that it takes about 30 minutes to an hour or more for changing v1_legacy_mode parameter from __true__ to __false__ to be reflected in the workspace. Therefore, if you set the parameter to __false__ but receive an error that the parameter is __true__ in a subsequent operation, please try after a few more minutes.

## Next steps

* [Use a private endpoint with Azure Machine Learning workspace](how-to-configure-private-link.md).
* [Create private link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md).
