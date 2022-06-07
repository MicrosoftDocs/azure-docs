---
title: az sql mi-arc reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql mi-arc commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc

Manage Azure Arc-enabled SQL managed instances.
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc endpoint](reference-az-sql-mi-arc-endpoint.md) | View and manage SQL endpoints.
[az sql mi-arc create](#az-sql-mi-arc-create) | Create a SQL managed instance.
[az sql mi-arc update](#az-sql-mi-arc-update) | Update the configuration of a SQL managed instance.
[az sql mi-arc delete](#az-sql-mi-arc-delete) | Delete a SQL managed instance.
[az sql mi-arc show](#az-sql-mi-arc-show) | Show the details of a SQL managed instance.
[az sql mi-arc get-mirroring-cert](#az-sql-mi-arc-get-mirroring-cert) | Retrieve certificate of availability group mirroring endpoint from sql mi and store in a file.
[az sql mi-arc upgrade](#az-sql-mi-arc-upgrade) | Upgrade SQL managed instance.
[az sql mi-arc list](#az-sql-mi-arc-list) | List SQL managed instances.
[az sql mi-arc config](reference-az-sql-mi-arc-config.md) | Configuration commands.
## az sql mi-arc create
To set the password of the SQL managed instance, set the environment variable AZDATA_PASSWORD
```azurecli
az sql mi-arc create 
```
### Examples
Create an indirectly connected SQL managed instance.
```azurecli
az sql mi-arc create -n sqlmi1 --k8s-namespace namespace --use-k8s
```
Create an indirectly connected SQL managed instance with 3 replicas in HA scenario.
```azurecli
az sql mi-arc create -n sqlmi2 --replicas 3  --k8s-namespace namespace --use-k8s
```
Create a directly connected SQL managed instance.
```azurecli
az sql mi-arc create --name name --resource-group group  --location location --subscription subscription   --custom-location custom-location
```
Create an indirectly connected SQL managed instance with Active Directory authentication.
```azurecli
az sql mi-arc create --name contososqlmi --k8s-namespace arc --ad-connector-name arcadc --ad-connector-namespace arc --keytab-secret arcuser-keytab-secret --ad-account-name arcuser --primary-dns-name contososqlmi-primary.contoso.local --primary-port-number 81433 --use-k8s
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
## az sql mi-arc update
Update the configuration of a SQL managed instance.
```azurecli
az sql mi-arc update 
```
### Examples
Update the configuration of a SQL managed instance.
```azurecli
az sql mi-arc update --path ./spec.json -n sqlmi1 --use-k8s
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
## az sql mi-arc delete
Delete a SQL managed instance.
```azurecli
az sql mi-arc delete 
```
### Examples
Delete a SQL managed instance using provided namespace.
```azurecli
az sql mi-arc delete --name sqlmi1 --k8s-namespace namespace --use-k8s
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
## az sql mi-arc show
Show the details of a SQL managed instance.
```azurecli
az sql mi-arc show 
```
### Examples
Show the details of an indirect connected SQL managed instance.
```azurecli
az sql mi-arc show --name sqlmi1 --k8s-namespace namespace --use-k8s
```
Show the details of a directly connected SQL managed instance.
```azurecli
az sql mi-arc show --name sqlmi1 --resource-group resource-group            
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
## az sql mi-arc get-mirroring-cert
Retrieve certificate of availability group mirroring endpoint from sql mi and store in a file.
```azurecli
az sql mi-arc get-mirroring-cert 
```
### Examples
Retrieve certificate of availability group mirroring endpoint from sqlmi1 and store in file fileName1
```azurecli
az sql mi-arc get-mirroring-cert -n sqlmi1 --cert-file fileName1
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
## az sql mi-arc upgrade
Upgrade SQL managed instance to the desired-version specified.  If desired-version is not specified, the data controller version will be used.
```azurecli
az sql mi-arc upgrade 
```
### Examples
Upgrade SQL managed instance.
```azurecli
az sql mi-arc upgrade -n sqlmi1 -k arc --desired-version v1.1.0 --use-k8s
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
## az sql mi-arc list
List SQL managed instances.
```azurecli
az sql mi-arc list 
```
### Examples
List SQL managed instances.
```azurecli
az sql mi-arc list --use-k8s
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
