---
title: az arcdata dc reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az arcdata dc commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc
## Commands
| Command | Description|
| --- | --- |
[az arcdata dc create](#az-arcdata-dc-create) | Create data controller.
[az arcdata dc delete](#az-arcdata-dc-delete) | Delete data controller.
[az arcdata dc endpoint](reference-az-arcdata-dc-endpoint.md) | Endpoint commands.
[az arcdata dc status](reference-az-arcdata-dc-status.md) | Status commands.
[az arcdata dc config](reference-az-arcdata-dc-config.md) | Configuration commands.
[az arcdata dc debug](reference-az-arcdata-dc-debug.md) | Debug data controller.
[az arcdata dc export](#az-arcdata-dc-export) | Export metrics, logs or usage.
[az arcdata dc upload](#az-arcdata-dc-upload) | Upload exported data file.
## az arcdata dc create
Create data controller - kube config is required on your system along with the following environment variables ['AZDATA_USERNAME', 'AZDATA_PASSWORD'].
```bash
az arcdata dc create --k8s-namespace -k 
                     --name -n  
                     
--connectivity-mode  
                     
--resource-group -g  
                     
--location -l  
                     
[--profile-name]  
                     
[--path -p]  
                     
[--storage-class]  
                     
[--infrastructure]  
                     
[--labels]  
                     
[--annotations]  
                     
[--service-annotations]  
                     
[--service-labels]  
                     
[--storage-labels]  
                     
[--storage-annotations]  
                     
[--use-k8s]
```
### Examples
Data controller deployment.
```bash
az arcdata dc create --name name --k8s-namespace namespace  --connectivity-mode indirect --resource-group group  --location location, --subscription subscription
```
### Required Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace to deploy the data controller into. If it exists already it will be used. If it does not exist, an attempt will be made to create it first.
#### `--name -n`
The name for the data controller.
#### `--connectivity-mode`
The connectivity to Azure - indirect or direct - which the data controller should operate in.
#### `--resource-group -g`
The Azure resource group in which the data controller resource should be added.
#### `--location -l`
The Azure location in which the data controller metadata will be stored (e.g. eastus).
### Optional Parameters
#### `--profile-name`
The name of an existing configuration profile. Run `az arcdata dc config list` to see available options. One of the following: ['azure-arc-gke', 'azure-arc-eks', 'azure-arc-kubeadm', 'azure-arc-aks-default-storage', 'azure-arc-azure-openshift', 'azure-arc-ake', 'azure-arc-openshift', 'azure-arc-aks-hci', 'azure-arc-aks-premium-storage'].
#### `--path -p`
The path to a directory containing a custom configuration profile to use. Run `az arcdata dc config init` to create a custom configuration profile.
#### `--storage-class`
The storage class to be use for all data and logs persistent volumes for all data controller pods that require them.
#### `--infrastructure`
The infrastructure on which the data controller will be running on. Allowed values: ['aws', 'gcp', 'azure', 'alibaba', 'onpremises', 'other', 'auto']
#### `--labels`
Comma-separated list of labels to apply to all data controller resources.
#### `--annotations`
Comma-separated list of annotations to apply all data controller resources.
#### `--service-annotations`
Comma-separated list of annotations to apply to all external data controller services.
#### `--service-labels`
Comma-separated list of labels to apply to all external data controller services.
#### `--storage-labels`
Comma-separated list of labels to apply to all PVCs created by the data controller.
#### `--storage-annotations`
Comma-separated list of annotations to apply to all PVCs created by the data controller.
#### `--use-k8s`
Create data controller using local Kubernetes APIs.
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
## az arcdata dc delete
Delete data controller - kube config is required on your system.
```bash
az arcdata dc delete --name -n 
                     --k8s-namespace -k  
                     
[--force -f]  
                     
[--yes -y]
```
### Examples
Data controller deployment.
```bash
az arcdata dc delete --name name --k8s-namespace namespace
```
### Required Parameters
#### `--name -n`
Data controller name.
#### `--k8s-namespace -k`
The Kubernetes namespace in which the data controller exists.
### Optional Parameters
#### `--force -f`
Force delete data controller and all of its data services.
#### `--yes -y`
Delete data controller without confirmation prompt.
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
## az arcdata dc export
Export metrics, logs or usage to a file.
```bash
az arcdata dc export --type -t 
                     --path -p  
                     
--k8s-namespace -k  
                     
[--force -f]  
                     
[--use-k8s]
```
### Required Parameters
#### `--type -t`
The type of data to be exported. Options: logs, metrics, and usage.
#### `--path -p`
The full or relative path including the file name of the file to be exported.
#### `--k8s-namespace -k`
The Kubernetes namespace in which the data controller exists.
### Optional Parameters
#### `--force -f`
Force create output file. Overwrites any existing file at the same path.
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
## az arcdata dc upload
Upload data file exported from a data controller to Azure.
```bash
az arcdata dc upload --path -p 
                     
```
### Required Parameters
#### `--path -p`
The full or relative path including the file name of the file to be uploaded.
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
