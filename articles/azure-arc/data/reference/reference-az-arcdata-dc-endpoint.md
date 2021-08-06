---
title: az arcdata dc endpoint reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az arcdata dc endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc endpoint
## Commands
| Command | Description|
| --- | --- |
[az arcdata dc endpoint list](#az-arcdata-dc-endpoint-list) | List the data controller endpoint.
## az arcdata dc endpoint list
List the data controller endpoint.
```bash
az arcdata dc endpoint list --k8s-namespace -k 
                            [--endpoint-name -e]  
                            
[--use-k8s]
```
### Examples
Lists all available data controller endpoints.
```bash
az arcdata dc endpoint list --k8s-namespace namespace
```
### Required Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace in which the data controller exists.
### Optional Parameters
#### `--endpoint-name -e`
Arc data controller endpoint name.
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
