---
title: az arcdata dc status reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc status commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc status

Status commands.
## Commands
| Command | Description|
| --- | --- |
[az arcdata dc status show](#az-arcdata-dc-status-show) | Show the status of the data controller.
## az arcdata dc status show
Show the status of the data controller.
```azurecli
az arcdata dc status show 
```
### Examples
Show the status of the data controller in a particular kubernetes namespace.
```azurecli
az arcdata dc status show --k8s-namespace namespace --use-k8s
```
Show the status of a directly connected data controller in a particular resource group.
```azurecli
az arcdata dc status show --resource-group resource-group    
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
