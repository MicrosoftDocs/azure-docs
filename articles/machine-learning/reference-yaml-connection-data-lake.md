---
title: 'CLI (v2) Data Lake Store Gen 2 connection YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Data Lake Store Gen 2 connections YAML schema.
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

# CLI (v2) Azure Data Lake Store Gen 2 connection YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `name` | string | **Required.** The connection name. | | |
| `description` | string | The connection description. | | |
| `tags` | object | The connection tag dictionary. | | |
| `type` | string | **Required.** The connection type. | `azure_data_lake_gen2` | `azure_data_lake_gen2` |
| `is_shared` | boolean | `true` if the connection is shared across other projects in the hub; otherwise, `false`. | | `true` |
| `target` | string | **Required.** The URL of the blob container. | | |
| `credentials` | object | Credential-based authentication to access Azure Data Lake Store Gen 2. A service principal can be used. Don't specify `credentials` when using credential-less authentication, set to `None`. | | |
| `credentials.type` | string | The type of credential. | `service_principal` | |
| `credentials.client_id` | string | Microsoft Entra ID application ID. | | |
| `credentials.client_secret` | string | Secret or key. | | |
| `credentials.tenant_id` | string | Microsoft Entra ID tenant ID. | | |


## Remarks

While the `az ml connection` commands can be used to manage both Azure Machine Learning and Azure AI Studio connections, the Azure Data Lake Store Gen 2 connection is specific to Azure AI Studio.

## Examples

Visit [this GitHub resource]() for examples. Several are shown here. These examples would be in the form of YAML files and used from the CLI. For example, `az ml connection create -f <file-name>.yaml`. 

### YAML: service principal

```yml
#Connection.yml

name: myadlsgen2_sp
type: azure_data_lake_gen2

target: https://contoso.core.windows.net/contosocontainer

credentials:
  type: service_principal
  tenant_id: "XXXXXXXXXX"
  client_id: "XXXXXXXXXX"
  client_secret: "XXXXXXXXXX"
```

### YAML: credential-less

```yml
#Connection.yml

name: myadlsgen2_cl
type: azure_data_lake_gen2

target: https://contoso.core.windows.net/contosocontainer
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
