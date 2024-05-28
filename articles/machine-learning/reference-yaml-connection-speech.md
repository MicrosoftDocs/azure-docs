---
title: 'CLI (v2) AI Speech Services connection YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) AI Speech Services connections YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - build-2024
ms.topic: reference

author: AmarBadal
ms.author: ambadal
ms.date: 04/15/2024
ms.reviewer: larryfr
---

# CLI (v2) Azure AI Speech Services connection YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `name` | string | **Required.** The connection name. | | |
| `description` | string | The connection description. | | |
| `tags` | object | The connection tag dictionary. | | |
| `type` | string | **Required.** The connection type. | `azure_speech_services` | `azure_speech_services` |
| `is_shared` | boolean | `true` if the connection is shared across other projects in the hub; otherwise, `false`. | | `true` |
| `endpoint` | string | **Required.** The Azure AI Services endpoint for this connection. | | |
| `api_key` | string | **Required.** The API key used to authenticate the connection. If not provided, a Microsoft Entra ID (credential-less authentication) is created. | | |

## Remarks

The schema described in this article is used to create a connection to Azure AI Speech Services only. If you would rather create a single connection for Azure AI Services, see the [Azure AI Services connection schema](reference-yaml-connection-ai-services.md).

While the `az ml connection` commands can be used to manage both Azure Machine Learning and Azure AI Studio connections, the Azure AI Speech Services connection is specific to Azure AI Studio.

## Examples

Visit [this GitHub resource]() for examples. Several are shown here. These examples would be in the form of YAML files and used from the CLI. For example, `az ml connection create -f <file-name>.yaml`. 

### YAML: API key

```yml
#AzureContentSafetyConnection.yml

name: myazaics_apk
type: azure_content_safety

endpoint: https://contoso.cognitiveservices.azure.com/
api_key: XXXXXXXXXXXXXXX
```

### YAML: credential-less

```yml
#AzureContentSafetyConnection.yml

name: myazaics_ei
type: azure_content_safety

endpoint: https://contoso.cognitiveservices.azure.com/
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
