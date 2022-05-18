---
title: az arcdata dc config reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc config commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc config

Configuration commands.

## Commands
| Command | Description|
| --- | --- |
[az arcdata dc config init](#az-arcdata-dc-config-init) | Initialize a data controller configuration profile that can be used with `az arcdata dc create`.
[az arcdata dc config list](#az-arcdata-dc-config-list) | List available configuration profile choices.
[az arcdata dc config add](#az-arcdata-dc-config-add) | Add a value for a json path in a config file.
[az arcdata dc config remove](#az-arcdata-dc-config-remove) | Remove a value for a json path in a config file.
[az arcdata dc config replace](#az-arcdata-dc-config-replace) | Replace a value for a json path in a config file.
[az arcdata dc config patch](#az-arcdata-dc-config-patch) | Patch a config file based on a json patch file.
## az arcdata dc config init
Initialize a data controller configuration profile that can be used with `az arcdata dc create`. The specific source of the configuration profile can be specified in the arguments.
```azurecli
az arcdata dc config init 
```
### Examples
Guided data controller config init experience - you will receive prompts for needed values.
```azurecli
az arcdata dc config init
```
arcdata dc config init with arguments, creates a configuration profile of aks-dev-test in ./custom.
```azurecli
az arcdata dc config init --source azure-arc-kubeadm --path custom
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
## az arcdata dc config list
List available configuration profile choices for use in `arcdata dc config init`
```azurecli
az arcdata dc config list 
```
### Examples
Shows all available configuration profile names.
```azurecli
az arcdata dc config list
```
Shows json of a specific configuration profile.
```azurecli
az arcdata dc config list --config-profile aks-dev-test
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
## az arcdata dc config add
Add the value at the json path in the config file. All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```azurecli
az arcdata dc config add 
```
### Examples
Add data controller storage.
```azurecli
az arcdata dc config add --path custom/control.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
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
## az arcdata dc config remove
Remove the value at the json path in the config file.  All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```azurecli
az arcdata dc config remove 
```
### Examples
Ex 1 - Remove data controller storage.
```azurecli
az arcdata dc config remove --path custom/control.json --json-path ".spec.storage"
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
## az arcdata dc config replace
Replace the value at the json path in the config file.  All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```azurecli
az arcdata dc config replace 
```
### Examples
Ex 1 - Replace the port of a single endpoint (Data Controller Endpoint).
```azurecli
az arcdata dc config replace --path custom/control.json --json-values "$.spec.endpoints[?(@.name=="Controller")].port=30080"
```
Ex 2 - Replace data controller storage.
```azurecli
az arcdata dc config replace --path custom/control.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
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
## az arcdata dc config patch
Patch the config file according to the given patch file. Consult http://jsonpatch.com/ for a better understanding of how the paths should be composed. The replace operation can use conditionals in its path due to the jsonpath library https://jsonpath.com/. All patch json files must start with a key of "patch" that has an array of patches with their corresponding op (add, replace, remove), path, and value. The "remove" op does not require a value, just a path. See the examples below.
```azurecli
az arcdata dc config patch 
```
### Examples
Ex 1 - Replace the port of a single endpoint (Data Controller Endpoint) with patch file.
```azurecli
az arcdata dc config patch --path custom/control.json --patch ./patch.json
```
Patch File Example (patch.json):
```json
{"patch":[{"op":"replace","path":"$.spec.endpoints[?(@.name=="Controller")].port","value":30080}]}
```
Ex 2 - Replace data controller storage with patch file.
```azurecli
az arcdata dc config patch --path custom/control.json --patch ./patch.json
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
