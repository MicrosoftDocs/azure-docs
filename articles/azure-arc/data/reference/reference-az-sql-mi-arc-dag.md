---
title: az sql mi-arc dag reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az sql mi-arc dag commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
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
```bash
az sql mi-arc dag create --name -n 
                         --dag-name -d  
                         
--local-instance-name -l  
                         
--local-primary -p  
                         
--remote-instance-name -r  
                         
--remote-mirroring-url -u  
                         
--remote-mirroring-cert-file -f  
                         
[--k8s-namespace -k]  
                         
[--path]  
                         
[--use-k8s]
```
### Examples
Ex 1 - Create a distributed availability group custom resource dagCr1 to create distributed availability group dagName1 between local sqlmi instance sqlmi1 and remote sqlmi instance sqlmi2. It requires remote sqlmi primary mirror remotePrimary:5022 and remote sqlmi mirror endpoint certificate file ./sqlmi2.cer.
```bash
az sql mi-arc dag create --name=dagCr1 --dag-name=dagName1  --local-instance-name=sqlmi1 --local-primary=true --remote-instance-name=sqlmi2  --remote-mirroring-url==remotePrimary:5022 --remote-mirroing-cert-file="./sqlmi2.cer"
```
### Required Parameters
#### `--name -n`
The name of the distributed availability group resource.
#### `--dag-name -d`
The name of the distributed availability group for this SQL managed instance. Both local and remote have to use the same name.
#### `--local-instance-name -l`
The name of the local SQL managed instance
#### `--local-primary -p`
True indicates local SQL managed instance is geo primary. False indicates local SQL managed instance is geo secondary
#### `--remote-instance-name -r`
The name of the remote SQL managed instance or remote SQL availability group
#### `--remote-mirroring-url -u`
The mirroring endpoint URL of the remote SQL managed instance or remote SQL availability group
#### `--remote-mirroring-cert-file -f`
The filename of mirroring endpoint public certificate for the remote SQL managed instance or remote SQL availability group. Only PEM format is supported
### Optional Parameters
#### `--k8s-namespace -k`
Namespace where the SQL managed instance exists. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--path`
Path to the custom resource specification, i.e. custom/spec.json
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
## az sql mi-arc dag delete
Delete a distributed availability group custom resource on a sqlmi instance to delete a distributed availability group. It requires a custom resource name
```bash
az sql mi-arc dag delete --name 
                         [--k8s-namespace -k]  
                         
[--use-k8s]
```
### Examples
Ex 1 - delete distributed availability group resources named dagCr1.
```bash
az sql mi-arc dag delete --name=dagCr1
```
### Required Parameters
#### `--name`
The name of the distributed availability group resource.
### Optional Parameters
#### `--k8s-namespace -k`
Namespace where the SQL managed instance exists. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
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
## az sql mi-arc dag show
show a distributed availability group custom resource. It requires a custom resource name
```bash
az sql mi-arc dag show --name 
                       [--k8s-namespace -k]  
                       
[--use-k8s]
```
### Examples
Ex 1 - show distributed availability group resources named dagCr1.
```bash
az sql mi-arc dag show --name=dagCr1
```
### Required Parameters
#### `--name`
The name of the distributed availability group resource.
### Optional Parameters
#### `--k8s-namespace -k`
Namespace where the SQL managed instance exists. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
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
