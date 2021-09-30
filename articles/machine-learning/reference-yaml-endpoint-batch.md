---
title: 'CLI (v2) batch endpoint YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) batch endpoint YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: tracychms
ms.author: tracych
ms.date: 09/20/2021
ms.reviewer: laobri
---

# CLI (v2) batch endpoint YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the endpoint. Needs to be unique at the Azure region level. | | |
| `description` | string | Description of the endpoint. | | |
| `tags` | object | Dictionary of tags for the endpoint. | | |
| `auth_mode` | string | The authentication method for the endpoint. Currently only Azure Active Directory (Azure AD) token-based authentication is supported. | `aad_token` | `aad_token` |
| `defaults` | object | Default settings for the endpoint. | | |
| `defaults.deployment_name` | string | Name of the deployment that will serve as the default deployment for the endpoint. | | |

## Remarks

The `az ml batch-endpoint` commands can be used for managing Azure Machine Learning endpoints.

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-cli-preview/cli/.schemas/jsons/latest/batchEndpoint.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/.schemas/yamls/latest/batchEndpoint.schema.yml":::

---

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
