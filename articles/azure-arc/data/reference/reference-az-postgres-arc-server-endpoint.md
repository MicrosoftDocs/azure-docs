---
title: az postgres arc-server endpoint reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az postgres arc-server endpoint commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az postgres arc-server endpoint
## Commands
| Command | Description|
| --- | --- |
[az postgres arc-server endpoint list](#az-postgres-arc-server-endpoint-list) | List Azure Arc–enabled PostgreSQL Hyperscale server group endpoints.
## az postgres arc-server endpoint list
List Azure Arc–enabled PostgreSQL Hyperscale server group endpoints.
```bash
az postgres arc-server endpoint list [--name -n] 
                                     [--k8s-namespace -k]  
                                     
[--use-k8s]
```
### Examples
List Azure Arc–enabled PostgreSQL Hyperscale server group endpoints.
```bash
az postgres arc-server endpoint list --name postgres01  --k8s-namespace namespace --use-k8s
```
### Optional Parameters
#### `--name -n`
Name of the Azure Arc–enabled PostgreSQL Hyperscale server group.
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server group is deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
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
