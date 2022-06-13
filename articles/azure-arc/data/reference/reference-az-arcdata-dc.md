---
title: az arcdata dc reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 11/04/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc

Create, delete, and manage data controllers.
## Commands
| Command | Description|
| --- | --- |
[az arcdata dc create](#az-arcdata-dc-create) | Create data controller.
[az arcdata dc upgrade](#az-arcdata-dc-upgrade) | Upgrade data controller.
[az arcdata dc update](#az-arcdata-dc-update) | Update data controller.
[az arcdata dc list-upgrades](#az-arcdata-dc-list-upgrades) | List available upgrade versions.
[az arcdata dc delete](#az-arcdata-dc-delete) | Delete data controller.
[az arcdata dc endpoint](reference-az-arcdata-dc-endpoint.md) | Endpoint commands.
[az arcdata dc status](reference-az-arcdata-dc-status.md) | Status commands.
[az arcdata dc config](reference-az-arcdata-dc-config.md) | Configuration commands.
[az arcdata dc debug](reference-az-arcdata-dc-debug.md) | Debug data controller.
[az arcdata dc export](#az-arcdata-dc-export) | Export metrics, logs or usage.
[az arcdata dc upload](#az-arcdata-dc-upload) | Upload exported data file.
## az arcdata dc create
Create data controller - kube config is required on your system along with credentials for the monitoring dashboards provided by the following environment variables - AZDATA_LOGSUI_USERNAME and AZDATA_LOGSUI_PASSWORD for Logs Dashboard, and AZDATA_METRICSUI_USERNAME and AZDATA_METRICSUI_PASSWORD for Metrics Dashboard. Alternatively AZDATA_USERNAME and AZDATA_PASSWORD will be used as a fallback if either sets of environment variables are missing.
```azurecli
az arcdata dc create 
```
### Examples
Deploy an indirectly connected data controller.
```azurecli
az arcdata dc create --name name --k8s-namespace namespace --connectivity-mode indirect --resource-group group  --location location --subscription subscription --use-k8s
```
Deploy a directly connected data controller.
```azurecli
az arcdata dc create --name name  --connectivity-mode direct --resource-group group  --location location --subscription subscription  --custom-location custom-location         
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
## az arcdata dc upgrade
Upgrade data controller to the desired-version specified.  If desired-version is not specified, an attempt to upgrade to the latest version will be made. If you are unsure of the desired version, you may use the list-upgrades command to view available versions, or use the --dry-run argument to show which version would be used
```azurecli
az arcdata dc upgrade 
```
### Examples
Data controller upgrade.
```azurecli
az arcdata dc upgrade --k8s-namespace namespace --use-k8s
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
## az arcdata dc update
Updates the datacontroller to enable/disable auto uploading logs and metrics
```azurecli
az arcdata dc update 
```
### Examples
Data controller upgrade.
```azurecli
az arcdata dc update --auto-upload-logs true --auto-upload-metrics true --name dc-name --resource-group resource-group 
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
## az arcdata dc list-upgrades
Attempts to list versions that are available in the docker image registry for upgrade. - kube config is required on your system along with the following environment variables ['AZDATA_USERNAME', 'AZDATA_PASSWORD'].
```azurecli
az arcdata dc list-upgrades 
```
### Examples
Data controller upgrade.
```azurecli
az arcdata dc list-upgrades --k8s-namespace namespace --use-k8s            
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
## az arcdata dc delete
Delete data controller - kube config is required on your system.
```azurecli
az arcdata dc delete 
```
### Examples
Delete an indirect connected data controller.
```azurecli
az arcdata dc delete --name name --k8s-namespace namespace --use-k8s
```
Delete a directly connected data controller.
```azurecli
az arcdata dc delete --name name --resource-group resource-group            
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
## az arcdata dc export
Export metrics, logs or usage to a file.
```azurecli
az arcdata dc export -t logs --path logs.json --k8s-namespace namespace --use-k8s 
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
## az arcdata dc upload
Upload data file exported from a data controller to Azure.
```azurecli
az arcdata dc upload 
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
