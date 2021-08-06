---
title: az arcdata dc debug reference
titleSuffix: Azure Arc-enabled data services
description: Reference article for az arcdata dc debug commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az arcdata dc debug
## Commands
| Command | Description|
| --- | --- |
[az arcdata dc debug copy-logs](#az-arcdata-dc-debug-copy-logs) | Copy logs.
[az arcdata dc debug dump](#az-arcdata-dc-debug-dump) | Trigger memory dump.
## az arcdata dc debug copy-logs
Copy the debug logs from the data controller - Kubernetes configuration is required on your system.
```bash
az arcdata dc debug copy-logs --k8s-namespace -k 
                              [--container -c]  
                              
[--target-folder -d]  
                              
[--pod]  
                              
[--resource-kind]  
                              
[--resource-name]  
                              
[--timeout -t]  
                              
[--skip-compress]  
                              
[--exclude-dumps]  
                              
[--exclude-system-logs ]  
                              
[--use-k8s]
```
### Required Parameters
#### `--k8s-namespace -k`
Kubernetes namespace of the data controller.
### Optional Parameters
#### `--container -c`
Copy the logs for the containers with similar name, Optional, by default copies logs for all containers. Cannot be specified multiple times. If specified multiple times, last one will be used
#### `--target-folder -d`
Target folder path to copy logs to. Optional, by default creates the result in the local folder.  Cannot be specified multiple times. If specified multiple times, last one will be used
#### `--pod`
Copy the logs for the pods with similar name. Optional, by default copies logs for all pods. Cannot be specified multiple times. If specified multiple times, last one will be used
#### `--resource-kind`
Copy the logs for the resource of a particular kind. Cannot specified multiple times. If specified multiple times, last one will be used. If specified, --resource-name should also be specified to identify the resource.
#### `--resource-name`
Copy the logs for the resource of the specified name. Cannot be specified multiple times. If specified multiple times, last one will be used. If specified, --resource-kind should also be specified to identify the resource.
#### `--timeout -t`
The number of seconds to wait for the command to complete. The default value is 0 which is unlimited
#### `--skip-compress`
Whether or not to skip compressing the result folder. The default value is False which compresses the result folder.
#### `--exclude-dumps`
Whether or not to exclude dumps from result folder. The default value is False which includes dumps.
#### `--exclude-system-logs `
Whether or not to exclude system logs from collection. The default value is False which includes system logs.
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
## az arcdata dc debug dump
Trigger memory dump and copy it out from container - Kubernetes configuration is required on your system.
```bash
az arcdata dc debug dump --k8s-namespace -k 
                         [--container -c]  
                         
[--target-folder -d]  
                         
[--use-k8s]
```
### Required Parameters
#### `--k8s-namespace -k`
Kubernetes namespace of the data controller.
### Optional Parameters
#### `--container -c`
The target container to be triggered for dumping the running processes.
`controller`
#### `--target-folder -d`
Target folder to copy the dump out.
`./output/dump`
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
