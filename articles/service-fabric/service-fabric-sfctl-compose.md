---
title: Azure Service Fabric CLI- sfctl compose
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for Docker Compose applications.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl compose
Create, delete, and manage Docker Compose applications.

## Commands

|Command|Description|
| --- | --- |
| create | Creates a Service Fabric compose deployment. |
| list | Gets the list of compose deployments created in the Service Fabric cluster. |
| remove | Deletes an existing Service Fabric compose deployment from cluster. |
| status | Gets information about a Service Fabric compose deployment. |
| upgrade | Starts upgrading a compose deployment in the Service Fabric cluster. |
| upgrade-rollback | Starts rolling back a compose deployment upgrade in the Service Fabric cluster. |
| upgrade-status | Gets details for the latest upgrade performed on this Service Fabric compose deployment. |

## sfctl compose create
Creates a Service Fabric compose deployment.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name [Required] | The name of the deployment. |
| --file-path       [Required] | Path to the target Docker Compose file. |
| --encrypted-pass | Rather than prompting for a container registry password, use an already encrypted pass-phrase. |
| --has-pass | Will prompt for a password to the container registry. |
| --timeout -t | Default\: 60. |
| --user | User name to connect to container registry. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose list
Gets the list of compose deployments created in the Service Fabric cluster.

Gets the status about the compose deployments that were created or in the process of being created in the Service Fabric cluster. The response includes the name, status, and other details about the compose deployments. If the list of deployments do not fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page.

### Arguments

|Argument|Description|
| --- | --- |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --max-results | The maximum number of results to be returned as part of the paged queries. This parameter defines the upper bound on the number of results returned. The results returned can be less than the specified maximum results if they do not fit in the message as per the max message size restrictions defined in the configuration. If this parameter is zero or not specified, the paged query includes as many results as possible that fit in the return message. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose remove
Deletes an existing Service Fabric compose deployment from cluster.

Deletes an existing Service Fabric compose deployment.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name [Required] | The identity of the deployment. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose status
Gets information about a Service Fabric compose deployment.

Returns the status of the compose deployment that was created or in the process of being created in the Service Fabric cluster and whose name matches the one specified as the parameter. The response includes the name, status, and other details about the deployment.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name [Required] | The identity of the deployment. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose upgrade
Starts upgrading a compose deployment in the Service Fabric cluster.

Validates the supplied upgrade parameters and starts upgrading the deployment if the parameters are valid.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name  [Required] | The name of the deployment. |
| --file-path        [Required] | Path to the target Docker compose file. |
| --default-svc-type-health-map | JSON encoded dictionary that describe the health policy used to evaluate the health of services. |
| --encrypted-pass | Rather than prompting for a container registry password, use an already encrypted pass-phrase. |
| --failure-action | Possible values include\: 'Invalid', 'Rollback', 'Manual'. |
| --force-restart | Processes are forcefully restarted during upgrade even when the code version has not changed. <br><br> The upgrade only changes configuration or data. |
| --has-pass | Will prompt for a password to the container registry. |
| --health-check-retry | The length of time between attempts to perform health checks if the application or cluster is not healthy. |
| --health-check-stable | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --health-check-wait | The length of time to wait after completing an upgrade domain before starting the health checks process. |
| --replica-set-check | The maximum amount of time to block processing of an upgrade domain and prevent loss of availability when there are unexpected issues. <br><br> When this timeout expires, processing of the upgrade domain will proceed regardless of availability loss issues. The timeout is reset at the start of each upgrade domain. Valid values are between 0 and 42949672925 inclusive. |
| --svc-type-health-map | JSON encoded list of objects that describe the health policies used to evaluate the health of different service types. |
| --timeout -t | Default\: 60. |
| --unhealthy-app | The maximum allowed percentage of unhealthy applications before reporting an error. <br><br> For example, to allow 10% of applications to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy application, the health is evaluated as Warning. This is calculated by dividing the number of unhealthy applications over the total number of application instances in the cluster. |
| --upgrade-domain-timeout | The amount of time each upgrade domain has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --upgrade-kind | Default\: Rolling. |
| --upgrade-mode | Possible values include\: 'Invalid', 'UnmonitoredAuto', 'UnmonitoredManual', 'Monitored'.  Default\: UnmonitoredAuto. |
| --upgrade-timeout | The amount of time the overall upgrade has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --user | User name to connect to container registry. |
| --warning-as-error | Indicates whether warnings are treated with the same severity as errors. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose upgrade-rollback
Starts rolling back a compose deployment upgrade in the Service Fabric cluster.

Rollback a service fabric compose deployment upgrade.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name [Required] | The identity of the deployment. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl compose upgrade-status
Gets details for the latest upgrade performed on this Service Fabric compose deployment.

Returns the information about the state of the compose deployment upgrade along with details to aid debugging application health issues.

### Arguments

|Argument|Description|
| --- | --- |
| --deployment-name [Required] | The identity of the deployment. |
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
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).