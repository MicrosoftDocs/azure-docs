---
title: az sql instance-failover-group-arc
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql instance-failover-group-arc.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 05/02/2022
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql instance-failover-group-arc

Create or Delete a Failover Group.
## Commands
| Command | Description|
| --- | --- |
[az sql instance-failover-group-arc create](#az-sql-instance-failover-group-arc-create) | Create a failover group resource
[az sql instance-failover-group-arc update](#az-sql-instance-failover-group-arc-update) | Update a failover group resource
[az sql instance-failover-group-arc delete](#az-sql-instance-failover-group-arc-delete) | Delete a failover group resource on a SQL managed instance.
[az sql instance-failover-group-arc show](#az-sql-instance-failover-group-arc-show) | show a failover group resource.
## az sql instance-failover-group-arc create
Create a failover group resource to create a distributed availability group
```azurecli
az sql instance-failover-group-arc create 
```
### Examples
Ex 1 - Create a failover group resource fogCr1 to create failover group by using shared name sharedName1 between sqlmi instance sqlmi1 and partner SQL managed instance sqlmi2. It requires partner sqlmi primary mirror partnerPrimary:5022 and partner sqlmi mirror endpoint certificate file ./sqlmi2.cer.
```azurecli
az sql instance-failover-group-arc create --name fogCr1 --shared-name sharedName1 --mi sqlmi1 --role primary --partner-mi sqlmi2 --partner-mirroring-url partnerPrimary:5022 --partner-mirroring-cert-file ./sqlmi2.cer --use-k8s
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
## az sql instance-failover-group-arc update
Update a failover group resource to change the role of distributed availability group
```azurecli
az sql instance-failover-group-arc update 
```
### Examples
Ex 1 - Update a failover group resource fogCr1 to secondary role from primary
```azurecli
az sql instance-failover-group-arc update --name fogCr1 --role secondary --use-k8s
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
## az sql instance-failover-group-arc delete
Delete a failover group resource on a SQL managed instance.
```azurecli
az sql instance-failover-group-arc delete 
```
### Examples
Ex 1 - delete failover group resources named fogCr1.
```azurecli
az sql instance-failover-group-arc delete --name fogCr1 --use-k8s
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
## az sql instance-failover-group-arc show
show a failover group resource.
```azurecli
az sql instance-failover-group-arc show 
```
### Examples
Ex 1 - show failover group resources named fogCr1.
```azurecli
az sql instance-failover-group-arc show --name fogCr1 --use-k8s
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
