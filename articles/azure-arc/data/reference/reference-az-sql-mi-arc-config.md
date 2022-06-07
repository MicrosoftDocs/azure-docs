---
title: az sql mi-arc config reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az sql mi-arc config commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc config

Configuration commands.
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc config init](#az-sql-mi-arc-config-init) | Initialize the CRD and specification files for a SQL managed instance.
[az sql mi-arc config add](#az-sql-mi-arc-config-add) | Add a value for a json path in a config file.
[az sql mi-arc config remove](#az-sql-mi-arc-config-remove) | Remove a value for a json path in a config file.
[az sql mi-arc config replace](#az-sql-mi-arc-config-replace) | Replace a value for a json path in a config file.
[az sql mi-arc config patch](#az-sql-mi-arc-config-patch) | Patch a config file based on a json patch file.
## az sql mi-arc config init
Initialize the CRD and specification files for a SQL managed instance.
```azurecli
az sql mi-arc config init 
```
### Examples
Initialize the CRD and specification files for a SQL managed instance.
```azurecli
az sql mi-arc config init --path ./template
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
## az sql mi-arc config add
Add the value at the json path in the config file.  All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```azurecli
az sql mi-arc config add 
```
### Examples
Ex 1 - Add storage.
```azurecli
az sql mi-arc config add --path custom/spec.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
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
## az sql mi-arc config remove
Remove the value at the json path in the config file. All examples below are given in Bash. If using another command line, you may need to escape quotations appropriately. Alternatively, you may use the patch file functionality.
```azurecli
az sql mi-arc config remove 
```
### Examples
Ex 1 - Remove storage.
```azurecli
az sql mi-arc config remove --path custom/spec.json --json-path ".spec.storage"
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
## az sql mi-arc config replace
Replace the value at the json path in the config file.  All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```azurecli
az sql mi-arc config replace 
```
### Examples
Ex 1 - Replace the port of a single endpoint.
```azurecli
az sql mi-arc config replace --path custom/spec.json --json-values "$.spec.endpoints[?(@.name=="Controller")].port=30080"
```
Ex 2 - Replace storage.
```azurecli
az sql mi-arc config replace --path custom/spec.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
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
## az sql mi-arc config patch
Patch the config file according to the given patch file. Consult http://jsonpatch.com/ for a better understanding of how the paths should be composed. The replace operation can use conditionals in its path due to the jsonpath library https://jsonpath.com/. All patch json files must start with a key of `patch` that has an array of patches with their corresponding op (add, replace, remove), path, and value. The `remove` op does not require a value, just a path. See the examples below.
```azurecli
az sql mi-arc config patch 
```
### Examples
Ex 1 - Replace the port of a single endpoint with patch file.
```azurecli
az sql mi-arc config patch --path custom/spec.json --patch ./patch.json
```
Patch File Example (patch.json):
```json
{"patch":[{"op":"replace","path":"$.spec.endpoints[?(@.name=="Controller")].port","value":30080}]}
```
Ex 2 - Replace storage with patch file.
```azurecli
az sql mi-arc config patch --path custom/spec.json --patch ./patch.json
```
Patch File Example (patch.json):
```json
{"patch":[{"op":"replace","path":".spec.storage","value":{"accessMode":"ReadWriteMany","className":"managed-premium","size":"10Gi"}}]}
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
