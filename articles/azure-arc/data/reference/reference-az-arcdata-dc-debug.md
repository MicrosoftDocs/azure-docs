---
title: az arcdata dc debug reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc debug commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc debug

Debug data controller.

## Commands
| Command | Description|
| --- | --- |
[az arcdata dc debug copy-logs](#az-arcdata-dc-debug-copy-logs) | Copy logs.
[az arcdata dc debug dump](#az-arcdata-dc-debug-dump) | Trigger memory dump.
## az arcdata dc debug copy-logs
Copy the debug logs from the data controller - Kubernetes configuration is required on your system.
```azurecli
az arcdata dc debug copy-logs 
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
## az arcdata dc debug dump
Trigger memory dump and copy it out from container - Kubernetes configuration is required on your system.
```azurecli
az arcdata dc debug dump 
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
