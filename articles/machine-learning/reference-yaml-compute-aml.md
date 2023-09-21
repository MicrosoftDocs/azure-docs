---
title: 'CLI (v2) compute cluster (AmlCompute) YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) compute cluster (AmlCompute) YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: vijetajo
ms.author: vijetaj 
ms.date: 10/21/2021
ms.reviewer: scottpolly
---

# CLI (v2) compute cluster (AmlCompute) YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/amlCompute.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | string | **Required.** The type of compute. | `amlcompute` | |
| `name` | string | **Required.** Name of the compute. | | |
| `description` | string | Description of the compute. | | |
| `location` | string | The location for the compute. If omitted, defaults to the workspace location. | | |
| `size` | string | The VM size to use for the cluster. For more information, see [Supported VM series and sizes](concept-compute-target.md#supported-vm-series-and-sizes). Note that not all sizes are available in all regions. | For the list of supported sizes in a given region, please use `az ml compute list-sizes`.  | `Standard_DS3_v2` |
| `tier` | string | The VM priority tier to use for the cluster. Low-priority VMs are pre-emptible but come at a reduced cost compared to dedicated VMs. | `dedicated`, `low_priority` | `dedicated` |
| `min_instances` | integer | The minimum number of nodes to use on the cluster. Setting the minimum number of nodes to `0` allows Azure Machine Learning to autoscale the cluster down to zero nodes when not in use. Any value larger than `0` will keep that number of nodes running, even if the cluster is not in use. | | `0` |
| `max_instances` | integer | The maximum number of nodes to use on the cluster. | | `1` |
| `idle_time_before_scale_down` | integer | Node idle time in seconds before scaling down the cluster. | | `120` |
| `ssh_public_access_enabled` | boolean | Whether to enable public SSH access on the nodes of the cluster. | | `false` |
| `ssh_settings` | object | SSH settings for connecting to the cluster. | | |
| `ssh_settings.admin_username` | string | The name of the administrator user account that can be used to SSH into nodes. | | |
| `ssh_settings.admin_password` | string | The password of the administrator user account. **One of `admin_password` or `ssh_key_value` is required.** | | |
| `ssh_settings.ssh_key_value` | string | The SSH public key of the administrator user account. **One of `admin_password` or `ssh_key_value` is required.** | | |
| `network_settings` | object | Network security settings. | | |
| `network_settings.vnet_name` | string | Name of the virtual network (VNet) when creating a new one or referencing an existing one. | | |
| `network_settings.subnet` | string | Either the name of the subnet when creating a new VNet or referencing an existing one, or the fully qualified resource ID of a subnet in an existing VNet. Do not specify `network_settings.vnet_name` if the subnet ID is specified. The subnet ID can refer to a VNet/subnet in another resource group. | | |
| `identity` | object | The managed identity configuration to assign to the compute. AmlCompute clusters support only one system-assigned identity or multiple user-assigned identities, not both concurrently. | | |
| `identity.type` | string | The type of managed identity to assign to the compute. If the type is `user_assigned`, the `identity.user_assigned_identities` property must also be specified. | `system_assigned`, `user_assigned` | |
| `identity.user_assigned_identities` | array | List of fully qualified resource IDs of the user-assigned identities. | | |

## Remarks

The `az ml compute` commands can be used for managing Azure Machine Learning compute clusters (AmlCompute).

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/compute). Several are shown below.

## YAML: minimal

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-minimal.yml":::

## YAML: basic

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-basic.yml":::

## YAML: custom location

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-location.yml":::

## YAML: low priority

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-low-priority.yml":::

## YAML: SSH username and password

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-ssh-password.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
