---
title: Azure Service Fabric CLI- sfctl sa-cluster
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing standalone clusters.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl sa-cluster
Manage stand-alone Service Fabric clusters.

## Commands

|Command|Description|
| --- | --- |
| config | Get the Service Fabric standalone cluster configuration. |
| config-upgrade | Start upgrading the configuration of a Service Fabric standalone cluster. |
| upgrade-status | Get the cluster configuration upgrade status of a Service Fabric standalone cluster. |

## sfctl sa-cluster config
Get the Service Fabric standalone cluster configuration.

The cluster configuration contains properties of the cluster that include different node types on the cluster, security configurations, fault, and upgrade domain topologies, etc.

### Arguments

|Argument|Description|
| --- | --- |
| --configuration-api-version [Required] | The API version of the Standalone cluster json configuration. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl sa-cluster config-upgrade
Start upgrading the configuration of a Service Fabric standalone cluster.

Validate the supplied configuration upgrade parameters and start upgrading the cluster configuration if the parameters are valid.

### Arguments

|Argument|Description|
| --- | --- |
| --cluster-config            [Required] | The cluster configuration. |
| --application-health-policies | JSON encoded dictionary of pairs of application type name and maximum percentage unhealthy before raising error. |
| --delta-unhealthy-nodes | The maximum allowed percentage of delta health degradation during the upgrade. Allowed values are integer values from zero to 100. |
| --health-check-retry | The length of time between attempts to perform health checks if the application or cluster is not healthy.  Default\: PT0H0M0S. |
| --health-check-stable | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain.  Default\: PT0H0M0S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --health-check-wait | The length of time to wait after completing an upgrade domain before starting the health checks process.  Default\: PT0H0M0S. |
| --timeout -t | Default\: 60. |
| --unhealthy-applications | The maximum allowed percentage of unhealthy applications during the upgrade. Allowed values are integer values from zero to 100. |
| --unhealthy-nodes | The maximum allowed percentage of unhealthy nodes during the upgrade. Allowed values are integer values from zero to 100. |
| --upgrade-domain-delta-unhealthy-nodes | The maximum allowed percentage of upgrade domain delta health degradation during the upgrade. Allowed values are integer values from zero to 100. |
| --upgrade-domain-timeout | The amount of time each upgrade domain has to complete before FailureAction is executed.  Default\: PT0H0M0S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --upgrade-timeout | The amount of time the overall upgrade has to complete before FailureAction is executed.  Default\: PT0H0M0S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

### Examples

Start a cluster configuration update
```
sfctl sa-cluster config-upgrade --cluster-config <YOUR CLUSTER CONFIG> --application-health-
policies "{"fabric:/System":{"ConsiderWarningAsError":true}}"
```

## sfctl sa-cluster upgrade-status
Get the cluster configuration upgrade status of a Service Fabric standalone cluster.

Get the cluster configuration upgrade status details of a Service Fabric standalone cluster.

### Arguments

|Argument|Description|
| --- | --- |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |


## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).