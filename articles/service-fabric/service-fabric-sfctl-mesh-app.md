---
title: Azure Service Fabric CLI- sfctl mesh app 
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing Service Fabric mesh application resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh app
Get and delete application resources.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the Application resource. |
| list | Lists all the application resources. |
| show | Gets the Application resource with the given name. |

## sfctl mesh app delete
Deletes the Application resource.

Deletes the Application resource identified by the name.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the application. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh app list
Lists all the application resources.

Gets the information about all application resources in a given resource group. The information include the description and other properties of the Application.

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh app show
Gets the Application resource with the given name.

Gets the information about the Application resource with the given name. The information include the description and other properties of the Application.

### Arguments

|Argument|Description|
| --- | --- |
| --name -n [Required] | The name of the application. |

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