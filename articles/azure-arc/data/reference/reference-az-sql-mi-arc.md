---
title: az sql mi-arc reference
titleSuffix: Azure Arc–enabled data services
description: Reference article for az sql mi-arc commands.
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: seanw
ms.date: 07/30/2021
ms.topic: reference
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# az sql mi-arc
## Commands
| Command | Description|
| --- | --- |
[az sql mi-arc endpoint](reference-az-sql-mi-arc-endpoint.md) | View and manage SQL endpoints.
[az sql mi-arc create](#az-sql-mi-arc-create) | Create a SQL managed instance.
[az sql mi-arc edit](#az-sql-mi-arc-edit) | Edit the configuration of a SQL managed instance.
[az sql mi-arc delete](#az-sql-mi-arc-delete) | Delete a SQL managed instance.
[az sql mi-arc show](#az-sql-mi-arc-show) | Show the details of a SQL managed instance.
[az sql mi-arc get-mirroring-cert](#az-sql-mi-arc-get-mirroring-cert) | Retrieve certificate of availability group mirroring endpoint from sql mi and store in a file.
[az sql mi-arc list](#az-sql-mi-arc-list) | List SQL managed instances.
[az sql mi-arc config](reference-az-sql-mi-arc-config.md) | Configuration commands.
[az sql mi-arc dag](reference-az-sql-mi-arc-dag.md) | Create or Delete a Distributed Availability Group.
## az sql mi-arc create
To set the password of the SQL managed instance, set the environment variable AZDATA_PASSWORD
```bash
az sql mi-arc create --name -n 
                     --k8s-namespace -k  
                     
[--path]  
                     
[--replicas]  
                     
[--cores-limit -c]  
                     
[--cores-request]  
                     
[--memory-limit -m]  
                     
[--memory-request]  
                     
[--storage-class-data -d]  
                     
[--storage-class-logs -g]  
                     
[--storage-class-datalogs]  
                     
[--storage-class-backups]  
                     
[--volume-size-data]  
                     
[--volume-size-logs]  
                     
[--volume-size-datalogs]  
                     
[--volume-size-backups]  
                     
[--no-wait]  
                     
[--no-external-endpoint]  
                     
[--cert-public-key-file]  
                     
[--cert-private-key-file]  
                     
[--service-cert-secret]  
                     
[--admin-login-secret]  
                     
[--license-type -l]  
                     
[--tier -t]  
                     
[--dev]  
                     
[--labels]  
                     
[--annotations]  
                     
[--service-labels]  
                     
[--service-annotations]  
                     
[--storage-labels]  
                     
[--storage-annotations]  
                     
[--use-k8s]  
                     
[--collation]  
                     
[--language]  
                     
[--agent-enabled]  
                     
[--trace-flags]
```
### Examples
Create a SQL managed instance.
```bash
az sql mi-arc create -n sqlmi1 --k8s-namespace namespace
```
Create a SQL managed instance with 3 replicas in HA scenario.
```bash
az sql mi-arc create -n sqlmi2 --replicas 3 --k8s-namespace namespace
```
### Required Parameters
#### `--name -n`
The name of the SQL managed instance.
#### `--k8s-namespace -k`
Namespace where the SQL managed instance is to be deployed. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
### Optional Parameters
#### `--path`
The path to the azext_arcdata file for the SQL managed instance json file.
#### `--replicas`
This option specifies the number of SQL Managed Instance replicas that will be deployed in your Kubernetes cluster for high availability purpose. Allowed values are '3' or '1' with default of '1'.
#### `--cores-limit -c`
The cores limit of the managed instance as an integer.
#### `--cores-request`
The request for cores of the managed instance as an integer.
#### `--memory-limit -m`
The limit of the capacity of the managed instance as an integer number followed by Gi (gigabytes). Example: 4Gi
#### `--memory-request`
The request for the capacity of the managed instance as an integer number followed by Gi (gigabytes). Example: 4Gi
#### `--storage-class-data -d`
The storage class to be used for data files (.mdf, .ndf). If no value is specified, then no storage class will be specified, which will result in Kubernetes using the default storage class.
#### `--storage-class-logs -g`
The storage class to be used for logs (/var/log). If no value is specified, then no storage class will be specified, which will result in Kubernetes using the default storage class.
#### `--storage-class-datalogs`
The storage class to be used for database logs (.ldf). If no value is specified, then no storage class will be specified, which will result in Kubernetes using the default storage class.
#### `--storage-class-backups`
The storage class to be used for backups (/var/opt/mssql/backups). If no value is specified, then no storage class will be specified, which will result in Kubernetes using the default storage class.
#### `--volume-size-data`
The size of the storage volume to be used for data as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--volume-size-logs`
The size of the storage volume to be used for logs as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--volume-size-datalogs`
The size of the storage volume to be used for data logs as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--volume-size-backups`
The size of the storage volume to be used for backups as a positive number followed by Ki (kilobytes), Mi (megabytes), or Gi (gigabytes).
#### `--no-wait`
If given, the command will not wait for the instance to be in a ready state before returning.
#### `--no-external-endpoint`
If specified, no external service will be created. Otherwise, an external service will be created using the same service type as the data controller.
#### `--cert-public-key-file`
Path to the file containing a PEM formatted certificate public key to be used for SQL Server.
#### `--cert-private-key-file`
Path to the file containing a PEM formatted certificate private key to be used for SQL Server.
#### `--service-cert-secret`
Name of the Kubernetes secret to generate that hosts or will host SQL service certificate.
#### `--admin-login-secret`
Name of the Kubernetes secret to generate that hosts or will host user admin login account credential.
#### `--license-type -l`
The license type to apply for this managed instance. Allowed values are: BasePrice, LicenseIncluded. Default is LicenseIncluded. The license type cannot be changed.
#### `--tier -t`
The pricing tier for the instance. Allowed values: BusinessCritical (bc for short) or GeneralPurpose (gp for short). Default is GeneralPurpose. The price tier cannot be changed.
#### `--dev`
If this is specified, then it is considered a dev instance and will not be billed for.
#### `--labels`
Comma-separated list of labels of the SQL managed instance.
#### `--annotations`
Comma-separated list of annotations of the SQL managed instance.
#### `--service-labels`
Comma-separated list of labels to apply to all external services.
#### `--service-annotations`
Comma-separated list of annotations to apply to all external services.
#### `--storage-labels`
Comma-separated list of labels to apply to all PVCs.
#### `--storage-annotations`
Comma-separated list of annotations to apply to all PVCs.
#### `--use-k8s`
Create SQL managed instance using local Kubernetes APIs.
#### `--collation`
The SQL Server collation for the instance.
#### `--language`
The SQL Server locale to any supported language identifier (LCID) for the instance.
#### `--agent-enabled`
Enable SQL Server agent for the instance. Default is disabled. Allowed values are 'true' or 'false'.
#### `--trace-flags`
Comma separated list of traceflags. No flags by default.
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
## az sql mi-arc edit
Edit the configuration of a SQL managed instance.
```bash
az sql mi-arc edit --name -n 
                   [--k8s-namespace -k]  
                   
[--path]  
                   
[--cores-limit -c]  
                   
[--cores-request]  
                   
[--memory-limit -m]  
                   
[--memory-request]  
                   
[--no-wait]  
                   
[--dev]  
                   
[--labels]  
                   
[--annotations]  
                   
[--service-labels]  
                   
[--service-annotations]  
                   
[--agent-enabled]  
                   
[--trace-flags]  
                   
[--use-k8s]
```
### Examples
Edit the configuration of a SQL managed instance.
```bash
az sql mi-arc edit --path ./spec.json -n sqlmi1
```
### Required Parameters
#### `--name -n`
The name of the SQL managed instance that is being edited. The name under which your instance is deployed cannot be changed.
### Optional Parameters
#### `--k8s-namespace -k`
Namespace where the SQL managed instance exists. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
#### `--path`
The path to the azext_arcdata file for the SQL managed instance json file.
#### `--cores-limit -c`
The cores limit of the managed instance as an integer.
#### `--cores-request`
The request for cores of the managed instance as an integer.
#### `--memory-limit -m`
The limit of the capacity of the managed instance as an integer number followed by Gi (gigabytes). Example: 4Gi
#### `--memory-request`
The request for the capacity of the managed instance as an integer number followed by Gi (gigabytes). Example: 4Gi
#### `--no-wait`
If given, the command will not wait for the instance to be in a ready state before returning.
#### `--dev`
If this is specified, then it is considered a dev instance and will not be billed for.
#### `--labels`
Comma-separated list of labels of the SQL managed instance.
#### `--annotations`
Comma-separated list of annotations of the SQL managed instance.
#### `--service-labels`
Comma-separated list of labels to apply to all external services.
#### `--service-annotations`
Comma-separated list of annotations to apply to all external services.
#### `--agent-enabled`
Enable SQL Server agent for the instance. Default is disabled.
#### `--trace-flags`
Comma separated list of traceflags. No flags by default.
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
## az sql mi-arc delete
Delete a SQL managed instance.
```bash
az sql mi-arc delete --name -n 
                     [--k8s-namespace -k]  
                     
[--use-k8s]
```
### Examples
Delete a SQL managed instance.
```bash
az sql mi-arc delete -n sqlmi1
```
### Required Parameters
#### `--name -n`
The name of the SQL managed instance to be deleted.
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
## az sql mi-arc show
Show the details of a SQL managed instance.
```bash
az sql mi-arc show --name -n 
                   [--path -p]  
                   
[--k8s-namespace -k]  
                   
[--use-k8s]
```
### Examples
Show the details of a SQL managed instance.
```bash
az sql mi-arc show -n sqlmi1
```
### Required Parameters
#### `--name -n`
The name of the SQL managed instance to be shown.
### Optional Parameters
#### `--path -p`
A path where the full specification for the SQL managed instance should be written. If omitted, the specification will be written to standard output.
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
## az sql mi-arc get-mirroring-cert
Retrieve certificate of availability group mirroring endpoint from sql mi and store in a file.
```bash
az sql mi-arc get-mirroring-cert --name -n 
                                 --cert-file  
                                 
[--k8s-namespace -k]  
                                 
[--use-k8s]
```
### Examples
Retrieve certificate of availability group mirroring endpoint from sqlmi1 and store in file fileName1
```bash
az sql mi-arc get-mirroring-cert -n sqlmi1 --cert-file fileName1
```
### Required Parameters
#### `--name -n`
The name of the SQL managed instance.
#### `--cert-file`
The local filename to store the retrieved certificate in PEM format.
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
## az sql mi-arc list
List SQL managed instances.
```bash
az sql mi-arc list [--k8s-namespace -k] 
                   [--use-k8s]
```
### Examples
List SQL managed instances.
```bash
az sql mi-arc list
```
### Optional Parameters
#### `--k8s-namespace -k`
Namespace where the SQL managed instances exist. If no namespace is specified, then the namespace defined in the kubeconfig will be used.
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
