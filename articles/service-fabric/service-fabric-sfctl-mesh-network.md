---
title: Azure Service Fabric CLI- sfctl mesh network
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for getting and deleting Service Fabric Mesh network resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh network
Get and delete mesh network resources.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the Network resource. |
| list | Lists all the network resources. |
| show | Gets the Network resource with the given name. |

## sfctl mesh network delete
Deletes the Network resource.

Deletes the Network resource identified by the name.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the network. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh network list
Lists all the network resources.

Gets the information about all network resources in a given resource group. The information include the description and other properties of the Network.

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh network show
Gets the Network resource with the given name.

Gets the information about the Network resource with the given name. The information include the description and other properties of the Network.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the network. |

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