---
title: Azure Service Fabric CLI- sfctl mesh service | Microsoft Docs
description: Describes the Service Fabric CLI sfctl mesh service commands.
services: service-fabric
documentationcenter: na
author: Christina-Kang
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 12/06/2018
ms.author: bikang

---

# sfctl mesh service
Get service details and list services of an application resource.

## Commands

|Command|Description|
| --- | --- |
| list | Lists all the service resources. |
| show | Gets the Service resource with the given name. |

## sfctl mesh service list
Lists all the service resources.

Gets the information about all services of an application resource. The information include the description and other properties of the Service.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name --application-name [Required] | The name of the application. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh service show
Gets the Service resource with the given name.

Gets the information about the Service resource with the given name. The information include the description and other properties of the Service.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name --application-name [Required] | The name of the application. |
| --name -n                     [Required] | The name of the service. |

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