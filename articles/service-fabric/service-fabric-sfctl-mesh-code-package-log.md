---
title: Azure Service Fabric CLI- sfctl mesh code-package-log
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for obtaining logs for a specified code package.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl mesh code-package-log
Get the logs for the container of the specified code package for the given service replica.

## Commands

|Command|Description|
| --- | --- |
| get | Gets the logs from the container. |

## sfctl mesh code-package-log get
Gets the logs from the container.

Gets the logs for the container of the specified code package of the service replica.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name --application-name [Required] | The name of the application. |
| --code-package-name           [Required] | The name of code package of the service. |
| --replica-name                [Required] | Service Fabric replica name. |
| --service-name                [Required] | The name of the service. |
| --tail | Number of lines to show from the end of the logs. Default is 100. 'all' to show the complete logs. |

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