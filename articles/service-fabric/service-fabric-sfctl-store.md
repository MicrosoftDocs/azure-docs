---
title: Azure Service Fabric CLI- sfctl store
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for performing file level operations on the cluster image store.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
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
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

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
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

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
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).