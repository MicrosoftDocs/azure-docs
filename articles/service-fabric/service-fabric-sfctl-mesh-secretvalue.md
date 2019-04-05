---
title: Azure Service Fabric CLI- sfctl mesh secretvalue | Microsoft Docs
description: Describes the Service Fabric CLI sfctl mesh secretvalue commands.
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

# sfctl mesh secretvalue
Get and delete mesh secretvalue resources.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the specified  value of the named secret resource. |
| list | List names of all values of the specified secret resource. |
| show | Retrieve the value of a specified version of a secret resource. |

## sfctl mesh secretvalue delete
Deletes the specified  value of the named secret resource.

Deletes the secret value resource identified by the name. The name of the resource is typically the version associated with that value. Deletion will fail if the specified value is in use.

### Arguments

|Argument|Description|
| --- | --- |
| --secret-name -n [Required] | The name of the secret resource. |
| --version -v     [Required] | The name of the secret version. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh secretvalue list
List names of all values of the specified secret resource.

Gets information about all secret value resources of the specified secret resource. The information includes the names of the secret value resources, but not the actual values.

### Arguments

|Argument|Description|
| --- | --- |
| --secret-name -n [Required] | The name of the secret resource. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl mesh secretvalue show
Retrieve the value of a specified version of a secret resource.

### Arguments

|Argument|Description|
| --- | --- |
| --secret-name -n [Required] | The name of the secret resource. |
| --version -v     [Required] | The name of the secret version. |
| --show-value | Show the actual value of the secret version. |

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