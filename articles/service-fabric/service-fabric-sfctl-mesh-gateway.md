---
title: Azure Service Fabric CLI- sfctl mesh gateway
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for getting and deleting Service Fabric Mesh gateway resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh gateway
Get and delete mesh gateway resources.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the Gateway resource. |
| list | Lists all the gateway resources. |
| show | Gets the Gateway resource with the given name. |

## sfctl mesh gateway delete
Deletes the Gateway resource.

Deletes the Gateway resource identified by the name.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the gateway resource. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh gateway list
Lists all the gateway resources.

Gets the information about all gateway resources in a given resource group. The information include the description and other properties of the Gateway.

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh gateway show
Gets the Gateway resource with the given name.

Gets the information about the Gateway resource with the given name. The information include the description and other properties of the Gateway.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the gateway resource. |

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