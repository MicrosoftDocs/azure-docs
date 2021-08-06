---
title: az postgres arc-server reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az postgres arc-server commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az postgres arc-server
## Commands
| Command | Description|
| --- | --- |
[az postgres arc-server create](#az-postgres-arc-server-create) | Create an Azure Arc–enabled PostgreSQL Hyperscale server group.
[az postgres arc-server edit](#az-postgres-arc-server-edit) | Edit the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group.
[az postgres arc-server delete](#az-postgres-arc-server-delete) | Delete an Azure Arc–enabled PostgreSQL Hyperscale server group.
[az postgres arc-server show](#az-postgres-arc-server-show) | Show the details of an Azure Arc–enabled PostgreSQL Hyperscale server group.
[az postgres arc-server list](#az-postgres-arc-server-list) | List Azure Arc–enabled PostgreSQL Hyperscale server groups.
[az postgres arc-server endpoint](reference-az-postgres-arc-server-endpoint.md) | Manage Azure Arc–enabled PostgreSQL Hyperscale server group endpoints.
## az postgres arc-server create
To set the password of the server group, please set the environment variable AZDATA_PASSWORD
```bash
az postgres arc-server create --name -n 
                              [--path]  
                              
[--k8s-namespace -k]  
                              
[--cores-limit]  
                              
[--cores-request]  
                              
[--memory-limit]  
                              
[--memory-request]  
                              
[--storage-class-data]  
                              
[--storage-class-logs]  
                              
[--storage-class-backups]  
                              
[--volume-claim-mounts]  
                              
[--extensions]  
                              
[--volume-size-data]  
                              
[--volume-size-logs]  
                              
[--volume-size-backups]  
                              
[--workers -w]  
                              
[--engine-version]  
                              
[--no-external-endpoint]  
                              
[--port]  
                              
[--no-wait]  
                              
[--engine-settings]  
                              
[--coordinator-settings]  
                              
[--worker-settings]  
                              
[--use-k8s]
```
### Examples
Create an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server create -n pg1 --k8s-namespace namespace --use-k8s
```
Create an Azure Arc–enabled PostgreSQL Hyperscale server group with engine settings. Both below examples are valid.
```bash
az postgres arc-server create -n pg1 --engine-settings "key1=val1" --k8s-namespace namespace 
az postgres arc-server create -n pg1 --engine-settings "key2=val2" --k8s-namespace namespace --use-k8s
```
Create a PostgreSQL server group with volume claim mounts.
```bash
az postgres arc-server create -n pg1 --volume-claim-mounts backup-pvc:backup 
```
Create a PostgreSQL server group with specific memory-limit for different node roles.
```bash
az postgres arc-server create -n pg1 --memory-limit "coordinator=2Gi,w=1Gi" --workers 1 --k8s-namespace namespace --use-k8s
```
### Required Parameters
#### `--name -n`
Name of the Azure Arc–enabled PostgreSQL Hyperscale server group.
### Optional Parameters
#### `--path`
The path to the source json file for the Azure Arc–enabled PostgreSQL Hyperscale server group. This is optional.
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server group is deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--cores-limit`
The maximum number of CPU cores for Azure Arc–enabled PostgreSQL Hyperscale server group that can be used per node. Fractional cores are supported. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--cores-request`
The minimum number of CPU cores that must be available per node to schedule the service. Fractional cores are supported. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--memory-limit`
The memory limit of the Azure Arc–enabled PostgreSQL Hyperscale server group as a number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes). Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--memory-request`
The memory request of the Azure Arc–enabled PostgreSQL Hyperscale server group as a number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes). Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--storage-class-data`
The storage class to be used for data persistent volumes.
#### `--storage-class-logs`
The storage class to be used for logs persistent volumes.
#### `--storage-class-backups`
The storage class to be used for backup persistent volumes.
#### `--volume-claim-mounts`
A comma-separated list of volume claim mounts. A volume claim mount is a pair of an existing persistent volume claim (in the same namespace) and volume type (and optional metadata depending on the volume type) separated by colon.The persistent volume will be mounted in each pod for the PostgreSQL server group. The mount path may depend on the volume type.
#### `--extensions`
A comma-separated list of the Postgres extensions that should be loaded on startup. Please refer to the postgres documentation for supported values.
#### `--volume-size-data`
The size of the storage volume to be used for data as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--volume-size-logs`
The size of the storage volume to be used for logs as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--volume-size-backups`
The size of the storage volume to be used for backups as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--workers -w`
The number of worker nodes to provision in a server group. In Preview, reducing the number of worker nodes is not supported. Refer to documentation for additional details.
#### `--engine-version`
Must be 11 or 12. The default value is 12.
`12`
#### `--no-external-endpoint`
If specified, no external service will be created. Otherwise, an external service will be created using the same service type as the data controller.
#### `--port`
Optional.
#### `--no-wait`
If given, the command will not wait for the instance to be in a ready state before returning.
#### `--engine-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2'.
#### `--coordinator-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2' to be applied to 'coordinator' node role. When node role specific settings are specified, default settings will be ignored and overridden with the settings provided here.
#### `--worker-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2' to be applied to 'worker' node role. When node role specific settings are specified, default settings will be ignored and overridden with the settings provided here.
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
## az postgres arc-server edit
Edit the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server edit --name -n 
                            [--k8s-namespace -k]  
                            
[--path]  
                            
[--workers -w]  
                            
[--cores-limit]  
                            
[--cores-request]  
                            
[--memory-limit]  
                            
[--memory-request]  
                            
[--extensions]  
                            
[--port]  
                            
[--no-wait]  
                            
[--engine-settings]  
                            
[--replace-settings]  
                            
[--coordinator-settings]  
                            
[--worker-settings]  
                            
[--admin-password]  
                            
[--use-k8s]
```
### Examples
Edit the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server edit --path ./spec.json -n pg1 --k8s-namespace namespace --use-k8s
```
Edit an Azure Arc–enabled PostgreSQL Hyperscale server group with engine settings for the coordinator node.
```bash
az postgres arc-server edit -n pg1 --coordinator-settings "key2=val2" --k8s-namespace namespace
```
Edits an Azure Arc–enabled PostgreSQL Hyperscale server group and replaces existing engine settings with new setting key1=val1.
```bash
az postgres arc-server edit -n pg1 --engine-settings "key1=val1" --replace-settings --k8s-namespace namespace
```
### Required Parameters
#### `--name -n`
Name of the Azure Arc–enabled PostgreSQL Hyperscale server group that is being edited. The name under which your instance is deployed cannot be changed.
### Optional Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server group is deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--path`
The path to the source json file for the Azure Arc–enabled PostgreSQL Hyperscale server group. This is optional.
#### `--workers -w`
The number of worker nodes to provision in a server group. In Preview, reducing the number of worker nodes is not supported. Refer to documentation for additional details.
#### `--cores-limit`
The maximum number of CPU cores for Azure Arc–enabled PostgreSQL Hyperscale server group that can be used per node, fractional cores are supported. To remove the cores_limit, specify its value as empty string. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--cores-request`
The minimum number of CPU cores that must be available per node to schedule the service, fractional cores are supported. To remove the cores_request, specify its value as empty string. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--memory-limit`
The memory limit for Azure Arc–enabled PostgreSQL Hyperscale server group as a number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes). To remove the memory_limit, specify its value as empty string. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--memory-request`
The memory request for Azure Arc–enabled PostgreSQL Hyperscale server group as a number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes). To remove the memory_request, specify its value as empty string. Optionally a comma-separated list of roles with values can be specified in format <role>=<value>. Valid roles are: "coordinator" or "c", "worker" or "w". If no roles are specified, settings will apply to all nodes of the PostgreSQL Hyperscale server group.
#### `--extensions`
A comma-separated list of the Postgres extensions that should be loaded on startup. Please refer to the postgres documentation for supported values.
#### `--port`
Optional.
#### `--no-wait`
If given, the command will not wait for the instance to be in a ready state before returning.
#### `--engine-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2'. The provided settings will be merged with the existing settings. To remove a setting, provide an empty value like 'removedKey='. If you change an engine setting that requires a restart, the service will be restarted to apply the settings immediately.
#### `--replace-settings`
When specified with --engine-settings, will replace all existing custom engine settings with new set of settings and values.
#### `--coordinator-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2' to be applied to 'coordinator' node role. When node role specific settings are specified, default settings will be ignored and overridden with the settings provided here.
#### `--worker-settings`
A comma separated list of Postgres engine settings in the format 'key1=val1, key2=val2' to be applied to 'worker' node role. When node role specific settings are specified, default settings will be ignored and overridden with the settings provided here.
#### `--admin-password`
If given, the Azure Arc–enabled PostgreSQL Hyperscale server group's admin password will be set to the value of the AZDATA_PASSWORD environment variable if present and a prompted value otherwise.
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
## az postgres arc-server delete
Delete an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server delete --name -n 
                              [--k8s-namespace -k]  
                              
[--force -f]  
                              
[--use-k8s]
```
### Examples
Delete an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server delete -n pg1 --k8s-namespace namespace --use-k8s
```
### Required Parameters
#### `--name -n`
Name of the Azure Arc–enabled PostgreSQL Hyperscale server group.
### Optional Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server group is deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--force -f`
Force delete the Azure Arc–enabled PostgreSQL Hyperscale server group without confirmation.
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
## az postgres arc-server show
Show the details of an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server show --name -n 
                            [--k8s-namespace -k]  
                            
[--path]  
                            
[--use-k8s]
```
### Examples
Show the details of an Azure Arc–enabled PostgreSQL Hyperscale server group.
```bash
az postgres arc-server show -n pg1 --k8s-namespace namespace --use-k8s
```
### Required Parameters
#### `--name -n`
Name of the Azure Arc–enabled PostgreSQL Hyperscale server group.
### Optional Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server group is deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--path`
A path where the full specification for the Azure Arc–enabled PostgreSQL Hyperscale server group should be written. If omitted, the specification will be written to standard output.
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
## az postgres arc-server list
List Azure Arc–enabled PostgreSQL Hyperscale server groups.
```bash
az postgres arc-server list [--k8s-namespace -k] 
                            [--use-k8s]
```
### Examples
List Azure Arc–enabled PostgreSQL Hyperscale server groups.
```bash
az postgres arc-server list --k8s-namespace namespace --use-k8s
```
### Optional Parameters
#### `--k8s-namespace -k`
The Kubernetes namespace where the Azure Arc–enabled PostgreSQL Hyperscale server groups are deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
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
