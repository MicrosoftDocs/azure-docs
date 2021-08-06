---
title: az sql mi-arc endpoint reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az sql mi-arc endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc endpoint
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc endpoint list](#az-sql-mi-arc-endpoint-list) | List the SQL endpoints.
## az sql mi-arc endpoint list
List the SQL endpoints.
```bash
az sql mi-arc endpoint list [--name -n] 
                            [--k8s-namespace -k]  
                            
[--use-k8s]
```
### Examples
List the endpoints for a SQL managed instance.
```bash
az sql mi-arc endpoint list -n sqlmi1
```
### Optional Parameters
#### `--name -n`
The name of the SQL instance to be shown. If omitted, all endpoints for all instances will be shown.
#### `--k8s-namespace -k`
Namespace where the SQL managed instances exist. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--use-k8s`
Use local Kubernetes APIs to perform this action.
### Global Arguments
#### `--debug`
Increase logging verbosity to show all debug logs.
#### `--help -h`
Show this help message and exit.
#### `--output -o`
Output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc.  Default: json.
#### `--query -q`
JMESPath query string. See [http://jmespath.org](http://jmespath.org) for more information and examples.
#### `--subscription`
Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`.
#### `--verbose`
Increase logging verbosity. Use --debug for full debug logs.
