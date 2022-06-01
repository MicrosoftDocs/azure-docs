---
title: az arcdata ad-connector
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata ad-connector.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 05/02/2022
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata ad-connector

Manage Active Directory authentication for Azure Arc data services.
## Commands
| Command | Description|
| --- | --- |
[az arcdata ad-connector create](#az-arcdata-ad-connector-create) | Create a new Active Directory connector.
[az arcdata ad-connector update](#az-arcdata-ad-connector-update) | Update the settings of an existing Active Directory connector.
[az arcdata ad-connector delete](#az-arcdata-ad-connector-delete) | Delete an existing Active Directory connector.
[az arcdata ad-connector show](#az-arcdata-ad-connector-show) | Get the details of an existing Active Directory connector.
## az arcdata ad-connector create
Create a new Active Directory connector.
```azurecli
az arcdata ad-connector create 
```
### Examples
Ex 1 - Deploy a new Active Directory connector in indirect mode.
```azurecli
az arcdata ad-connector create  --name arcadc  --k8s-namespace arc  --realm CONTOSO.LOCAL  --account-provisioning manual --primary-ad-dc-hostname azdc01.contoso.local  --secondary-ad-dc-hostnames "azdc02.contoso.local, azdc03.contoso.local"  --netbios-domain-name CONTOSO  --dns-domain-name contoso.local  --nameserver-addresses 10.10.10.11,10.10.10.12,10.10.10.13  --dns-replicas 2  --prefer-k8s-dns false  --use-k8s
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
## az arcdata ad-connector update
Update the settings of an existing Active Directory connector.
```azurecli
az arcdata ad-connector update 
```
### Examples
Ex 1 - Update an existing Active Directory connector in indirect mode.
```azurecli
az arcdata ad-connector update  --name arcadc  --k8s-namespace arc  --primary-ad-dc-hostname azdc01.contoso.local --secondary-ad-dc-hostname "azdc02.contoso.local, azdc03.contoso.local"  --nameserver-addresses 10.10.10.11,10.10.10.12,10.10.10.13 --dns-replicas 2  --prefer-k8s-dns false  --use-k8s
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
## az arcdata ad-connector delete
Delete an existing Active Directory connector.
```azurecli
az arcdata ad-connector delete 
```
### Examples
Ex 1 - Delete an existing Active Directory connector in indirect mode.
```azurecli
az arcdata ad-connector delete  --name arcadc  --k8s-namespace arc  --use-k8s
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
## az arcdata ad-connector show
Get the details of an existing Active Directory connector.
```azurecli
az arcdata ad-connector show 
```
### Examples
Ex 1 - Get an existing Active Directory connector in indirect mode.
```azurecli
az arcdata ad-connector show  --name arcadc  --k8s-namespace arc  --use-k8s
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
