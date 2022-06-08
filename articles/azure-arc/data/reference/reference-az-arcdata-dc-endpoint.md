---
title: az arcdata dc endpoint reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc endpoint

Endpoint commands.

## Commands
| Command | Description|
| --- | --- |
[az arcdata dc endpoint list](#az-arcdata-dc-endpoint-list) | List the data controller endpoint.
## az arcdata dc endpoint list
List the data controller endpoint.
```azurecli
az arcdata dc endpoint list 
```
### Examples
Lists all available data controller endpoints.
```azurecli
az arcdata dc endpoint list --k8s-namespace namespace
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
