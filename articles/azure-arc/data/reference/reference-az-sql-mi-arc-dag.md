---
title: az sql mi-arc dag reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql mi-arc dag commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc dag
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc dag create](#az-sql-mi-arc-dag-create) | Create a distributed availability group custom resource
[az sql mi-arc dag delete](#az-sql-mi-arc-dag-delete) | Delete a distributed availability group custom resource on a sqlmi instance.
[az sql mi-arc dag show](#az-sql-mi-arc-dag-show) | show a distributed availability group custom resource.
## az sql mi-arc dag create
Create a distributed availability group custom resource to create a distributed availability group
```azurecli
az sql mi-arc dag create 
```
### Examples
Ex 1 - Create a distributed availability group custom resource dagCr1 to create distributed availability group dagName1 between local sqlmi instance sqlmi1 and remote sqlmi instance sqlmi2. It requires remote sqlmi primary mirror remotePrimary:5022 and remote sqlmi mirror endpoint certificate file ./sqlmi2.cer.
```azurecli
az sql mi-arc dag create --name dagCr1 --dag-name dagName1 --local-instance-name sqlmi1 --local-primary local --remote-instance-name sqlmi2 --remote-mirroring-url remotePrimary:5022 --remote-mirroring-cert-file ./sqlmi2.cer --use-k8s
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
## az sql mi-arc dag delete
Delete a distributed availability group custom resource on a sqlmi instance to delete a distributed availability group. It requires a custom resource name.
```azurecli
az sql mi-arc dag delete 
```
### Examples
Ex 1 - delete distributed availability group resources named dagCr1.
```azurecli
az sql mi-arc dag delete --name dagCr1 --use-k8s
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
## az sql mi-arc dag show
show a distributed availability group custom resource. It requires a custom resource name
```azurecli
az sql mi-arc dag show 
```
### Examples
Ex 1 - show distributed availability group resources named dagCr1.
```azurecli
az sql mi-arc dag show --name dagCr1 --use-k8s
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
