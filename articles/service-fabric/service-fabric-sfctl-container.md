---
title: Azure Service Fabric CLI- sfctl container
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for containers.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl container
Run container related commands on a cluster node.

## Commands

|Command|Description|
| --- | --- |
| invoke-api | Invoke container API on a container deployed on a Service Fabric node for the given code package. |
| logs | Gets the container logs for container deployed on a Service Fabric node. |

## sfctl container invoke-api
Invoke container API on a container deployed on a Service Fabric node for the given code package.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id           [Required] | The identity of the application. <br><br> This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --code-package-instance-id [Required] | ID that uniquely identifies a code package instance deployed on a service fabric node. <br><br> Can be retrieved by 'service code-package-list'. |
| --code-package-name        [Required] | The name of code package specified in service manifest registered as part of an application type in a Service Fabric cluster. |
| --container-api-uri-path   [Required] | Container REST API URI path, use '{ID}' in place of container name/id. |
| --node-name                [Required] | The name of the node. |
| --service-manifest-name    [Required] | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --container-api-body | HTTP request body for container REST API. |
| --container-api-content-type | Content type for container REST API, defaults to 'application/json'. |
| --container-api-http-verb | HTTP verb for container REST API, defaults to GET. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl container logs
Gets the container logs for container deployed on a Service Fabric node.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id           [Required] | The identity of the application. <br><br> This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --code-package-instance-id [Required] | Code package instance ID, which can be retrieved by 'service code-package-list'. |
| --code-package-name        [Required] | The name of code package specified in service manifest registered as part of an application type in a Service Fabric cluster. |
| --node-name                [Required] | The name of the node. |
| --service-manifest-name    [Required] | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --tail | Number of lines to show from the end of the logs. Default is 100. 'all' to show the complete logs. |
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
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).