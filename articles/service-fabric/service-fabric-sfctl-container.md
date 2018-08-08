---
title: Azure Service Fabric CLI- sfctl container | Microsoft Docs
description: Describes the Service Fabric CLI sfctl container commands.
services: service-fabric
documentationcenter: na
author: Christina-Kang
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 07/31/2018
ms.author: bikang

---
# sfctl container
Run container related commands on a cluster node.

## Commands

|Command|Description|
| --- | --- |
| invoke-api | Invoke container REST API. |
| logs | Retrieving container logs. |

## sfctl container invoke-api
Invoke container REST API.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id           [Required] | Application identity. |
| --code-package-instance-id [Required] | Code package instance ID, which can be retrieved by 'service code-package-list'. |
| --code-package-name        [Required] | Code package name. |
| --container-api-uri-path   [Required] | Container REST API URI path, use '{id}' in place of container name/id. |
| --node-name                [Required] | The name of the node. |
| --service-manifest-name    [Required] | Service manifest name. |
| --container-api-body | HTTP request body for container REST API. |
| --container-api-content-type | Content type for container REST API, defaults to 'application/json'. |
| --container-api-http-verb | HTTP verb for container REST API, defaults to GET. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl container logs
Retrieving container logs.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id           [Required] | Application identity. |
| --code-package-instance-id [Required] | Code package instance ID, which can be retrieved by 'service code-package-list'. |
| --code-package-name        [Required] | Code package name. |
| --node-name                [Required] | The name of the node. |
| --service-manifest-name    [Required] | Service manifest name. |
| --tail | Only return this number of log lines from the end of the logs. Specify as an integer or all to output all log lines. Defaults to 'all'. |
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
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).