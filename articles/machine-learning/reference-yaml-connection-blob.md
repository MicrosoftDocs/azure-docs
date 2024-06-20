---
title: 'CLI (v2) blob store connection YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) blob store connections YAML schema.
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

# CLI (v2) blob store connection YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `name` | string | **Required.** The connection name. | | |
| `description` | string | The connection description. | | |
| `tags` | object | The connection tag dictionary. | | |
| `type` | string | **Required.** The connection type. | `azure_blob` | `azure_blob` |
| `account_name` | string | **Required.** The Azure Storage Account name. | | |
| `container_name` | string | **Required.** The blob container name. | | |
| `is_shared` | boolean | `true` if the connection is shared across other projects in the hub; otherwise, `false`. | | `true` |
| `url` | string | **Required.** The URL to the blob container. | | |
| `credentials` | object | Credential-based authentication to access the storage account. An account key, or shared access signature (SAS) token will work. Do not specify `credentials` when using credential-less authentication. | | |
| `credentials.account_key` | string | The account key used to access the storage account. Don't use `credentials.sas_token` if you are using an account key for authentication. | | |
| `credentials.sas_token` | string | The SAS token to access the storage account. Don't use `credentials.account_key` if you are using a SAS token for authentication.| | |

## Remarks

While the `az ml connection` commands can be used to manage both Azure Machine Learning and Azure AI Studio connections, the blob store connection is specific to Azure AI Studio.

## Examples

Visit [this GitHub resource]() for examples. Several are shown here. These examples would be in the form of YAML files and used from the CLI. For example, `az ml connection create -f <file-name>.yaml`. 

### YAML: account key

```yml
#AzureBlobStoreConnection.yaml

name: my_blobstore_ak
type: azure_blob
url: "myendpoint"
container_name: dummycont
account_name: mystroageacct

credentials:
    account_key: "XXXXXXXXXXX"
```

### YAML: SAS token

```yml
#AzureBlobStoreConnection.yaml

name: my_blobstore_sas
type: azure_blob
url: "myendpoint"
container_name: dummycont
account_name: mystroageacct
credentials:
    sas_token: "XXXXXXX"
```

### YAML: credential-less

```yml
#AzureBlobStoreConnection.yaml

name: my_blobstore_cl
type: azure_blob
url: "myendpoint"
container_name: dummycont
account_name: mystroageacct
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
