---
title: Azure Service Fabric CLI- sfctl mesh service-replica 
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for getting replica details for an application resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh service-replica
Get replica details and list replicas of a given service in an application resource.

## Commands

|Command|Description|
| --- | --- |
| list | Lists all the replicas of a service. |
| show | Gets the given replica of the service of an application. |

## sfctl mesh service-replica list
Lists all the replicas of a service.

Gets the information about all replicas of a service. The information include the description and other properties of the service replica.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name --application-name [Required] | The name of the application. |
| --service-name                [Required] | The name of the service. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh service-replica show
Gets the given replica of the service of an application.

Gets the information about the service replica with the given name. The information include the description and other properties of the service replica.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name --application-name [Required] | The name of the application. |
| --name -n                     [Required] | The name of the service replica. |
| --service-name                [Required] | The name of the service. |

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