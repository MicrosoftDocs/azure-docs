---
title: 'CLI (v2) OpenAI connection YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) OpenAI connections YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - build-2024
ms.topic: reference

author: AmarBadal
ms.author: ambadal
ms.date: 05/09/2024
ms.reviewer: larryfr
---

# CLI (v2) OpenAI connection YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `name` | string | **Required.** The connection name. | | |
| `description` | string | The connection description. | | |
| `tags` | object | The connection tag dictionary. | | |
| `type` | string | **Required.** The connection type. | `open_ai` | `open_ai` |
| `is_shared` | boolean | `true` if the connection is shared across other projects in the hub; otherwise, `false`. | | `true` |
| `api_key` | string | **Required.** The API key used to authenticate the connection. | | |

## Remarks

This schema is used to create a connection to the non-Microsoft OpenAI service. For information on the schema used to connect to Azure OpenAI, see the [Azure OpenAI connection schema](reference-yaml-connection-azure-openai.md).

While the `az ml connection` commands can be used to manage both Azure Machine Learning and Azure AI Studio connections, the OpenAI connection is specific to Azure AI Studio.

## Examples

Visit [this GitHub resource]() for examples. Several are shown here. These examples would be in the form of YAML files and used from the CLI. For example, `az ml connection create -f <file-name>.yaml`. 

### YAML: API key

```yml
name: open_ai_conn
type: open_ai
api_key: "1234467"
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
