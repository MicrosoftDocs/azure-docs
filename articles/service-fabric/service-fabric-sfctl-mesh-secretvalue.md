---
title: Azure Service Fabric CLI- sfctl mesh secretvalue
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for getting and deleting Service Fabric Mesh secretvalue resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh secretvalue
Get and delete mesh secretvalue resources.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the specified  value of the named secret resource. |
| list | List names of all values of the specified secret resource. |
| show | Lists the specified value of the secret resource. |

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
Lists the specified value of the secret resource.

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