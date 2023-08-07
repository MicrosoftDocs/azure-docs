---
title: 'CLI (v2) Attached Kubernetes cluster (KubernetesCompute) YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Attached Azure Arc-enabled Kubernetes cluster (KubernetesCompute) YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022
ms.topic: reference

author: Bozhong68
ms.author: bozhlin
ms.date: 03/31/2022
ms.reviewer: ssalgado
---

# CLI (v2) Attached Azure Arc-enabled Kubernetes cluster (KubernetesCompute) YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at `https://azuremlschemas.azureedge.net/latest/kubernetesCompute.schema.json`.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | string | **Required.** The type of compute. | `kubernetes` | |
| `name` | string | **Required.** Name of the compute. | | |
| `description` | string | Description of the compute. | | |
| `resource_id` | string | Fully qualified resource ID of the Azure Arc-enabled Kubernetes cluster to attach to the workspace as a compute target. | | |
| `namespace` | string | The Kubernetes namespace to use for the compute target. The namespace must be created in the Kubernetes cluster before the cluster can be attached to the workspace as a compute target. All Azure Machine Learning workloads running on this compute target will run under the namespace specified in this field. | | |
| `identity` | object | The managed identity configuration to assign to the compute. KubernetesCompute clusters support only one system-assigned identity or multiple user-assigned identities, not both concurrently. | | |
| `identity.type` | string | The type of managed identity to assign to the compute. If the type is `user_assigned`, the `identity.user_assigned_identities` property must also be specified. | `system_assigned`, `user_assigned` | |
| `identity.user_assigned_identities` | array | List of fully qualified resource IDs of the user-assigned identities. | | |

## Remarks

The `az ml compute` commands can be used for managing Azure Arc-enabled Kubernetes clusters (KubernetesCompute) attached to an Azure Machine Learning workspace.

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Configure and attach Kubernetes clusters anywhere](how-to-attach-kubernetes-anywhere.md)
