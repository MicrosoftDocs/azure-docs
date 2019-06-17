---
title: Azure Service Fabric CLI- sfctl store | Microsoft Docs
description: Describes the Service Fabric CLI sfctl store commands.
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

# sfctl store
Perform basic file level operations on the cluster image store.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes existing image store content. |
| root-info | Gets the content information at the root of the image store. |
| stat | Gets the image store content information. |

## sfctl store delete
Deletes existing image store content.

Deletes existing image store content being found within the given image store relative path. This command can be used to delete uploaded application packages once they are provisioned.

### Arguments

|Argument|Description|
| --- | --- |
| --content-path [Required] | Relative path to file or folder in the image store from its root. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl store root-info
Gets the content information at the root of the image store.

Returns the information about the image store content at the root of the image store.

### Arguments

|Argument|Description|
| --- | --- |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl store stat
Gets the image store content information.

Returns the information about the image store content at the specified contentPath. The contentPath is relative to the root of the image store.

### Arguments

|Argument|Description|
| --- | --- |
| --content-path [Required] | Relative path to file or folder in the image store from its root. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |


## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).