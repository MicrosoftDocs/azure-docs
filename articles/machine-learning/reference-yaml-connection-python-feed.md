---
title: 'CLI (v2) Python feed connection YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Python feed connections YAML schema.
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

# CLI (v2) Python feed connection YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `name` | string | **Required.** The connection name. | | |
| `description` | string | The connection description. | | |
| `tags` | object | The connection tag dictionary. | | |
| `type` | string | **Required.** The connection type. | `python_feed` | `python_feed` |
| `is_shared` | boolean | `true` if the connection is shared across other projects in the hub; otherwise, `false`. | | `true` |
| `target` | string | The URL of the endpoint. | | |
| `credentials` | object | Credential-based authentication to access the storage account. A [personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) or username and password can be used. Do not specify `credentials` when using a public Python feed. | | |
| `credentials.type` | string | The type of authentication to use. | `pat`, `username_password` | |
| `credentials.pat` | string | The personal access token to authenticate with. | | |
| `credentials_username` | string | The username to authenticate with. | | |
| `credentials_password` | string | The password to authenticate with. | | |

## Remarks

While the `az ml connection` commands can be used to manage both Azure Machine Learning and Azure AI Studio connections.

## Examples

Visit [this GitHub resource]() for examples. Several are shown here. These examples would be in the form of YAML files and used from the CLI. For example, `az ml connection create -f <file-name>.yaml`. 

### YAML: Personal access token

```yml
#Connection.yml
name: test_ws_conn_python_pat
type: python_feed
target: https://test-feed.com
credentials:
  type: pat
  pat: dummy_pat

```

### YAML: Username and password

```yml
name: test_ws_conn_python_user_pass
type: python_feed
target: https://test-feed.com
credentials:
  type: username_password
  username: john
  password: pass

```

### YAML: No credentials

```yml
name: test_ws_conn_python_no_cred
type: python_feed
target: https://test-feed.com3
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
