---
title: az postgres arc-server reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az postgres arc-server commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az postgres arc-server

Manage Azure Arc enabled PostgreSQL Hyperscale server groups.
## Commands
| Command | Description|
| --- | --- |
[az postgres arc-server create](#az-postgres-arc-server-create) | Create an Azure Arc enabled PostgreSQL Hyperscale server group.
[az postgres arc-server edit](#az-postgres-arc-server-edit) | Edit the configuration of an Azure Arc enabled PostgreSQL Hyperscale server group.
[az postgres arc-server delete](#az-postgres-arc-server-delete) | Delete an Azure Arc enabled PostgreSQL Hyperscale server group.
[az postgres arc-server show](#az-postgres-arc-server-show) | Show the details of an Azure Arc enabled PostgreSQL Hyperscale server group.
[az postgres arc-server list](#az-postgres-arc-server-list) | List Azure Arc enabled PostgreSQL Hyperscale server groups.
[az postgres arc-server endpoint](reference-az-postgres-arc-server-endpoint.md) | Manage Azure Arc enabled PostgreSQL Hyperscale server group endpoints.
## az postgres arc-server create
To set the password of the server group, please set the environment variable AZDATA_PASSWORD
```azurecli
az postgres arc-server create 
```
### Examples
Create an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server create -n pg1 --k8s-namespace namespace --use-k8s
```
Create an Azure Arc enabled PostgreSQL Hyperscale server group with engine settings. Both below examples are valid.
```azurecli
az postgres arc-server create -n pg1 --engine-settings "key1=val1" --k8s-namespace namespace 
az postgres arc-server create -n pg1 --engine-settings "key2=val2" --k8s-namespace namespace --use-k8s
```
Create a PostgreSQL server group with volume claim mounts.
```azurecli
az postgres arc-server create -n pg1 --volume-claim-mounts backup-pvc:backup 
```
Create a PostgreSQL server group with specific memory-limit for different node roles.
```azurecli
az postgres arc-server create -n pg1 --memory-limit "coordinator=2Gi,w=1Gi" --workers 1 --k8s-namespace namespace --use-k8s
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
## az postgres arc-server edit
Edit the configuration of an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server edit 
```
### Examples
Edit the configuration of an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server edit --path ./spec.json -n pg1 --k8s-namespace namespace --use-k8s
```
Edit an Azure Arc enabled PostgreSQL Hyperscale server group with engine settings for the coordinator node.
```azurecli
az postgres arc-server edit -n pg1 --coordinator-settings "key2=val2" --k8s-namespace namespace
```
Edits an Azure Arc enabled PostgreSQL Hyperscale server group and replaces existing engine settings with new setting key1=val1.
```azurecli
az postgres arc-server edit -n pg1 --engine-settings "key1=val1" --replace-settings --k8s-namespace namespace
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
## az postgres arc-server delete
Delete an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server delete 
```
### Examples
Delete an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server delete -n pg1 --k8s-namespace namespace --use-k8s
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
## az postgres arc-server show
Show the details of an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server show 
```
### Examples
Show the details of an Azure Arc enabled PostgreSQL Hyperscale server group.
```azurecli
az postgres arc-server show -n pg1 --k8s-namespace namespace --use-k8s
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
## az postgres arc-server list
List Azure Arc enabled PostgreSQL Hyperscale server groups.
```azurecli
az postgres arc-server list 
```
### Examples
List Azure Arc enabled PostgreSQL Hyperscale server groups.
```azurecli
az postgres arc-server list --k8s-namespace namespace --use-k8s
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
