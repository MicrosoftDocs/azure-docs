---
title: Azure Service Fabric CLI- sfctl is
description: Learn about sfctl, the Azure Service Fabric command-line interface. Includes a list of commands for managing infrastructure.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# sfctl is
Query and send commands to the infrastructure service.

## Commands

|Command|Description|
| --- | --- |
| command | Invokes an administrative command on the given Infrastructure Service instance. |
| query | Invokes a read-only query on the given infrastructure service instance. |

## sfctl is command
Invokes an administrative command on the given Infrastructure Service instance.

For clusters that have one or more instances of the Infrastructure Service configured, this API provides a way to send infrastructure-specific commands to a particular instance of the Infrastructure Service. Available commands and their corresponding response formats vary depending upon the infrastructure on which the cluster is running. This API supports the Service Fabric platform; it is not meant to be used directly from your code.

### Arguments

|Argument|Description|
| --- | --- |
| --command [Required] | The text of the command to be invoked. The content of the command is infrastructure-specific. |
| --service-id | The identity of the infrastructure service. <br><br> This is the full name of the infrastructure service without the 'fabric\:' URI scheme. This parameter required only for the cluster that has more than one instance of infrastructure service running. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl is query
Invokes a read-only query on the given infrastructure service instance.

For clusters that have one or more instances of the Infrastructure Service configured, this API provides a way to send infrastructure-specific queries to a particular instance of the Infrastructure Service. Available commands and their corresponding response formats vary depending upon the infrastructure on which the cluster is running. This API supports the Service Fabric platform; it is not meant to be used directly from your code.

### Arguments

|Argument|Description|
| --- | --- |
| --command [Required] | The text of the command to be invoked. The content of the command is infrastructure-specific. |
| --service-id | The identity of the infrastructure service. <br><br> This is the full name of the infrastructure service without the 'fabric\:' URI scheme. This parameter required only for the cluster that has more than one instance of infrastructure service running. |
| --timeout -t | Default\: 60. |

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
- Learn how to use the Service Fabric CLI using the [sample scripts](./scripts/sfctl-upgrade-application.md).
