---
title: az arcdata resource-kind reference
titleSuffix: Azure Arc—enabled data services
description: Reference article for az arcdata resource-kind commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata resource-kind
## Commands
| Command | Description|
| --- | --- |
[az arcdata resource-kind list](#az-arcdata-resource-kind-list) | List the available custom resource kinds for Arc that can be defined and created.
[az arcdata resource-kind get](#az-arcdata-resource-kind-get) | Get the Arc resource-kind's template file.
## az arcdata resource-kind list
List the available custom resource kinds for Arc that can be defined and created. After listing, you can proceed to getting the template file needed to define or create that custom resource.
```bash
az arcdata resource-kind list 
```
### Examples
Example command for listing the available custom resource kinds for Arc.
```bash
az arcdata resource-kind list
```
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
## az arcdata resource-kind get
Get the Arc resource-kind's template file.
```bash
az arcdata resource-kind get --kind -k 
                             [--dest -d]
```
### Examples
Example command for getting an Arc resource-kind's CRD template file.
```bash
az arcdata resource-kind get --kind SqlManagedInstance
```
### Required Parameters
#### `--kind -k`
The kind of arc resource you want the template file for.
### Optional Parameters
#### `--dest -d`
The directory where you"d like to place the template files.
`template`
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
