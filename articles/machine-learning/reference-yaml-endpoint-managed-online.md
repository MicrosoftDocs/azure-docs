---
title: 'Online endpoints (preview) YAML reference'
titleSuffix: Azure Machine Learning
description: Learn about the YAML files used to deploy models as online endpoints
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: rsethur
ms.author: seramasu
ms.date: 09/20/2021
ms.reviewer: laobri
---

# CLI (v2) online endpoint YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

> [!NOTE]
> A fully specified sample YAML for managed online endpoints is available for [reference](https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.template.yaml)

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the endpoint. Needs to be unique at the Azure region level. <br><br> Naming rules are defined [here](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview).| | |
| `description` | string | Description of the endpoint. | | |
| `tags` | object | Dictionary of tags for the endpoint. | | |
| `auth_mode` | string | The authentication method for the endpoint. Key-based authentication and Azure ML token-based authentication are supported. Key-based authentication doesn't expire but Azure ML token-based authentication does. | `key`, `aml_token` | `key` |
| `allow_public_access` | boolean | Whether to allow public access when Private Link is enabled. | | `true` |
| `identity` | object | The managed identity configuration for accessing Azure resources for endpoint provisioning and inference. | | |
| `identity.type` | string | The type of managed identity. If the type is `user_assigned`, the `identity.user_assigned_identities` property must also be specified. | `system_assigned`, `user_assigned` | |
| `identity.user_assigned_identities` | array | List of fully qualified resource IDs of the user-assigned identities. | | |

## Remarks

The `az ml online-endpoint` commands can be used for managing Azure Machine Learning online endpoints.

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-cli-preview/cli/.schemas/jsons/latest/managedOnlineEndpoint.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/.schemas/yamls/latest/managedOnlineEndpoint.schema.yml":::

---

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- Learn how to [deploy a model with a managed online endpoint](how-to-deploy-managed-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md)
