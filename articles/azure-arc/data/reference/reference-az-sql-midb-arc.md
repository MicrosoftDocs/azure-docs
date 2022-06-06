---
title: az sql midb-arc
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql midb-arc commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql midb-arc

Manage databases for Azure Arc-enabled SQL managed instances.
## Commands
| Command | Description|
| --- | --- |
[az sql midb-arc restore](#az-sql-midb-arc-restore) | Restore a database to an Azure Arc enabled SQL managed instance.
## az sql midb-arc restore

Restore a database to an Azure Arc enabled SQL managed instance.

```azurecli
az sql midb-arc restore 
```
### Examples
Ex 1 - Restore a database using Point in time restore.
```azurecli
az sql midb-arc restore --managed-instance sqlmi1 --name mysourcedb
 --dest-name mynewdb --time "2021-10-20T05:34:22Z" --k8s-namespace
 arc --use-k8s --dry-run
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
