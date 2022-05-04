---
title: az sql mi-arc endpoint reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql mi-arc endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc endpoint

View and manage SQL endpoints.
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc endpoint list](#az-sql-mi-arc-endpoint-list) | List the SQL endpoints.
## az sql mi-arc endpoint list
List the SQL endpoints.
```azurecli
az sql mi-arc endpoint list 
```
### Examples
List the endpoints for a SQL managed instance.
```azurecli
az sql mi-arc endpoint list -n sqlmi1
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
