---
title: az arcdata dc config reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az arcdata dc config commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc config
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
```bash
az arcdata dc config init [--path -p] 
                          [--source -s]  
                          
[--force -f]
```
### Examples
Guided data controller config init experience - you will receive prompts for needed values.
```bash
az arcdata dc config init
```
arcdata dc config init with arguments, creates a configuration profile of aks-dev-test in ./custom.
```bash
az arcdata dc config init --source azure-arc-kubeadm --path custom
```
### Optional Parameters
#### `--path -p`
File path of where you would like the config profile placed, defaults to <cwd>/custom.
#### `--source -s`
Config profile source: ['azure-arc-gke', 'azure-arc-eks', 'azure-arc-kubeadm', 'azure-arc-aks-default-storage', 'azure-arc-azure-openshift', 'azure-arc-ake', 'azure-arc-openshift', 'azure-arc-aks-dev-test', 'azure-arc-aks-hci', 'azure-arc-kubeadm-dev-test', 'azure-arc-aks-premium-storage']
#### `--force -f`
Force overwrite of the target file.
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
## az arcdata dc config list
List available configuration profile choices for use in `arcdata dc config init`
```bash
az arcdata dc config list [--config-profile -c] 
                          
```
### Examples
Shows all available configuration profile names.
```bash
az arcdata dc config list
```
Shows json of a specific configuration profile.
```bash
az arcdata dc config list --config-profile aks-dev-test
```
### Optional Parameters
#### `--config-profile -c`
Default config profile: ['azure-arc-gke', 'azure-arc-eks', 'azure-arc-kubeadm', 'azure-arc-aks-default-storage', 'azure-arc-azure-openshift', 'azure-arc-ake', 'azure-arc-openshift', 'azure-arc-aks-dev-test', 'azure-arc-aks-hci', 'azure-arc-kubeadm-dev-test', 'azure-arc-aks-premium-storage']
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
## az arcdata dc config add
Add the value at the json path in the config file. All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```bash
az arcdata dc config add --path -p 
                         --json-values -j
```
### Examples
Add data controller storage.
```bash
az arcdata dc config add --path custom/control.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
```
### Required Parameters
#### `--path -p`
Data controller config file path of the config you would like to set, i.e. custom/control.json
#### `--json-values -j`
A key value pair list of json paths to values: key1.subkey1=value1,key2.subkey2=value2. You may provide inline json values such as: key='{"kind":"cluster","name":"test-cluster"}' or provide a file path, such as key=./values.json. The add command does NOT support conditionals.  If the inline value you are providing is a key value pair itself with "=" and "," escape those characters.  For example, key1="key2\=val2\,key3\=val3". See http://jsonpatch.com/ for examples of how your path should look.  If you would like to access an array, you must do so by indicating the index, such as key.0=value
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
## az arcdata dc config remove
Remove the value at the json path in the config file.  All examples below are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```bash
az arcdata dc config remove --path -p 
                            --json-path -j
```
### Examples
Ex 1 - Remove data controller storage.
```bash
az arcdata dc config remove --path custom/control.json --json-path ".spec.storage"
```
### Required Parameters
#### `--path -p`
Data controller config file path of the config you would like to set, i.e. custom/control.json
#### `--json-path -j`
A list of json paths based on the jsonpatch library that indicates which values you would like removed, such as: key1.subkey1,key2.subkey2. The remove command does NOT support conditionals. See http://jsonpatch.com/ for examples of how your path should look.  If you would like to access an array, you must do so by indicating the index, such as key.0=value
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
## az arcdata dc config replace
Replace the value at the json path in the config file.  All examples below  are given in Bash.  If using another command line, you may need to escape quotations appropriately.  Alternatively, you may use the patch file functionality.
```bash
az arcdata dc config replace --path -p 
                             --json-values -j
```
### Examples
Ex 1 - Replace the port of a single endpoint (Data Controller Endpoint).
```bash
az arcdata dc config replace --path custom/control.json --json-values "$.spec.endpoints[?(@.name=="Controller")].port=30080"
```
Ex 2 - Replace data controller storage.
```bash
az arcdata dc config replace --path custom/control.json --json-values "spec.storage={"accessMode":"ReadWriteOnce","className":"managed-premium","size":"10Gi"}"
```
### Required Parameters
#### `--path -p`
Data controller config file path of the config you would like to set, i.e. custom/control.json
#### `--json-values -j`
A key value pair list of json paths to values: key1.subkey1=value1,key2.subkey2=value2. You may provide inline json values such as: key='{"kind":"cluster","name":"test-cluster"}' or provide a file path, such as key=./values.json. The replace command supports conditionals through the jsonpath library.  To use this, start your path with a $. This will allow you to do a conditional such as -j $.key1.key2[?(@.key3=="someValue"].key4=value. If the inline value you are providing is a key value pair itself with "=" and "," escape those characters.  For example, key1="key2\=val2\,key3\=val3". You may see examples below. For additional help, See: https://jsonpath.com/
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
## az arcdata dc config patch
Patch the config file according to the given patch file. Consult http://jsonpatch.com/ for a better understanding of how the paths should be composed. The replace operation can use conditionals in its path due to the jsonpath library https://jsonpath.com/. All patch json files must start with a key of "patch" that has an array of patches with their corresponding op (add, replace, remove), path, and value. The "remove" op does not require a value, just a path. See the examples below.
```bash
az arcdata dc config patch --path 
                           --patch-file -p
```
### Examples
Ex 1 - Replace the port of a single endpoint (Data Controller Endpoint) with patch file.
```bash
az arcdata dc config patch --path custom/control.json --patch ./patch.json

    Patch File Example (patch.json):
        {"patch":[{"op":"replace","path":"$.spec.endpoints[?(@.name=="Controller")].port","value":30080}]}
```
Ex 2 - Replace data controller storage with patch file.
```bash
az arcdata dc config patch --path custom/control.json --patch ./patch.json

    Patch File Example (patch.json):
        {"patch":[{"op":"replace","path":".spec.storage","value":{"accessMode":"ReadWriteMany","className":"managed-premium","size":"10Gi"}}]}
```
### Required Parameters
#### `--path`
Data controller config file path of the config you would like to set, i.e. custom/control.json
#### `--patch-file -p`
Path to a patch json file that is based off the jsonpatch library: http://jsonpatch.com/. You must start your patch json file with a key called "patch", whose value is an array of patch operations you intend to make. For the path of a patch operation, you may use dot notation, such as key1.key2 for most operations. If you would like to do a replace operation, and you are replacing a value in an array that requires a conditional, please use the jsonpath notation by beginning your path with a $. This will allow you to do a conditional such as $.key1.key2[?(@.key3=="someValue"].key4. See the examples below. For additional help with conditionals, See: https://jsonpath.com/.
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
