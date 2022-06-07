---
title: az postgres arc-server endpoint reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az postgres arc-server endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az postgres arc-server endpoint

Manage Azure Arc enabled PostgreSQL Hyperscale server group endpoints.
## Commands
| Command | Description|
| --- | --- |
[az postgres arc-server endpoint list](#az-postgres-arc-server-endpoint-list) | List Azure Arc enabled PostgreSQL Hyperscale server group endpoints.
## az postgres arc-server endpoint list
List Azure Arc enabled PostgreSQL Hyperscale server group endpoints.
```azurecli
az postgres arc-server endpoint list 
```
### Examples
List Azure Arc enabled PostgreSQL Hyperscale server group endpoints.
```azurecli
az postgres arc-server endpoint list --name postgres01  --k8s-namespace namespace --use-k8s
```
### Global Arguments
#### `--debug`
Increase logging verbosity to show all debug logs.
#### `--help -h`
Show this help message and exit.
#### `--output -o`
Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.
#### `--query -q`
JMESPath query string. See [http://jmespath.org/](http://jmespath.org) for more information and examples.
#### `--verbose`
Increase logging verbosity. Use `--debug` for full debug logs.
