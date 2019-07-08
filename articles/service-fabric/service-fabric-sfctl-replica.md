---
title: Azure Service Fabric CLI- sfctl replica| Microsoft Docs
description: Describes the Service Fabric CLI sfctl replica commands.
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

# sfctl replica
Manage the replicas that belong to service partitions.

## Commands

|Command|Description|
| --- | --- |
| deployed | Gets the details of replica deployed on a Service Fabric node. |
| deployed-list | Gets the list of replicas deployed on a Service Fabric node. |
| health | Gets the health of a Service Fabric stateful service replica or stateless service instance. |
| info | Gets the information about a replica of a Service Fabric partition. |
| list | Gets the information about replicas of a Service Fabric service partition. |
| remove | Removes a service replica running on a node. |
| report-health | Sends a health report on the Service Fabric replica. |
| restart | Restarts a service replica of a persisted service running on a node. |

## sfctl replica deployed
Gets the details of replica deployed on a Service Fabric node.

Gets the details of the replica deployed on a Service Fabric node. The information includes service kind, service name, current service operation, current service operation start date time, partition ID, replica/instance ID, reported load, and other information.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required] | The name of the node. |
| --partition-id [Required] | The identity of the partition. |
| --replica-id   [Required] | The identifier of the replica. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica deployed-list
Gets the list of replicas deployed on a Service Fabric node.

Gets the list containing the information about replicas deployed on a Service Fabric node. The information include partition ID, replica ID, status of the replica, name of the service, name of the service type, and other information. Use PartitionId or ServiceManifestName query parameters to return information about the deployed replicas matching the specified values for those parameters.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name      [Required] | The name of the node. |
| --partition-id | The identity of the partition. |
| --service-manifest-name | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica health
Gets the health of a Service Fabric stateful service replica or stateless service instance.

Gets the health of a Service Fabric replica. Use EventsHealthStateFilter to filter the collection of health events reported on the replica based on the health state.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id    [Required] | The identity of the partition. |
| --replica-id      [Required] | The identifier of the replica. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica info
Gets the information about a replica of a Service Fabric partition.

The response includes the ID, role, status, health, node name, uptime, and other details about the replica.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --replica-id   [Required] | The identifier of the replica. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica list
Gets the information about replicas of a Service Fabric service partition.

The GetReplicas endpoint returns information about the replicas of the specified partition. The response includes the ID, role, status, health, node name, uptime, and other details about the replica.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica remove
Removes a service replica running on a node.

This API simulates a Service Fabric replica failure by removing a replica from a Service Fabric cluster. The removal closes the replica, transitions the replica to the role None, and then removes all of the state information of the replica from the cluster. This API tests the replica state removal path, and simulates the report fault permanent path through client APIs. Warning - There are no safety checks performed when this API is used. Incorrect use of this API can lead to data loss for stateful services. In addition, the forceRemove flag impacts all other replicas hosted in the same process.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required] | The name of the node. |
| --partition-id [Required] | The identity of the partition. |
| --replica-id   [Required] | The identifier of the replica. |
| --force-remove | Remove a Service Fabric application or service forcefully without going through the graceful shutdown sequence. This parameter can be used to forcefully delete an application or service for which delete is timing out due to issues in the service code that prevents graceful close of replicas. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica report-health
Sends a health report on the Service Fabric replica.

Reports health state of the specified Service Fabric replica. The report must contain the information about the source of the health report and property on which it is reported. The report is sent to a Service Fabric gateway Replica, which forwards to the health store. The report may be accepted by the gateway, but rejected by the health store after extra validation. For example, the health store may reject the report because of an invalid parameter, like a stale sequence number. To see whether the report was applied in the health store, run get replica health and check that the report appears in the HealthEvents section.

### Arguments

|Argument|Description|
| --- | --- |
| --health-property [Required] | The property of the health information. <br><br> An entity can have health reports for different properties. The property is a string and not a fixed enumeration to allow the reporter flexibility to categorize the state condition that triggers the report. For example, a reporter with SourceId "LocalWatchdog" can monitor the state of the available disk on a node, so it can report "AvailableDisk" property on that node. The same reporter can monitor the node connectivity, so it can report a property "Connectivity" on the same node. In the health store, these reports are treated as separate health events for the specified node. Together with the SourceId, the property uniquely identifies the health information. |
| --health-state    [Required] | Possible values include\: 'Invalid', 'Ok', 'Warning', 'Error', 'Unknown'. |
| --partition-id    [Required] | The identity of the partition. |
| --replica-id      [Required] | The identity of the partition. |
| --source-id       [Required] | The source name that identifies the client/watchdog/system component that generated the health information. |
| --description | The description of the health information. <br><br> It represents free text used to add human readable information about the report. The maximum string length for the description is 4096 characters. If the provided string is longer, it will be automatically truncated. When truncated, the last characters of the description contain a marker "[Truncated]", and total string size is 4096 characters. The presence of the marker indicates to users that truncation occurred. Note that when truncated, the description has less than 4096 characters from the original string. |
| --immediate | A flag that indicates whether the report should be sent immediately. <br><br> A health report is sent to a Service Fabric gateway Application, which forwards to the health store. If Immediate is set to true, the report is sent immediately from HTTP Gateway to the health store, regardless of the fabric client settings that the HTTP Gateway Application is using. This is useful for critical reports that should be sent as soon as possible. Depending on timing and other conditions, sending the report may still fail, for example if the HTTP Gateway is closed or the message doesn't reach the Gateway. If Immediate is set to false, the report is sent based on the health client settings from the HTTP Gateway. Therefore, it will be batched according to the HealthReportSendInterval configuration. This is the recommended setting because it allows the health client to optimize health reporting messages to health store as well as health report processing. By default, reports are not sent immediately. |
| --remove-when-expired | Value that indicates whether the report is removed from health store when it expires. <br><br> If set to true, the report is removed from the health store after it expires. If set to false, the report is treated as an error when expired. The value of this property is false by default. When clients report periodically, they should set RemoveWhenExpired false (default). This way, is the reporter has issues (e.g. deadlock) and can't report, the entity is evaluated at error when the health report expires. This flags the entity as being in Error health state. |
| --sequence-number | The sequence number for this health report as a numeric string. <br><br> The report sequence number is used by the health store to detect stale reports. If not specified, a sequence number is auto-generated by the health client when a report is added. |
| --service-kind | The kind of service replica (stateless or stateful) for which the health is being reported. Following are the possible values\: 'Stateless', 'Stateful'.  Default\: Stateful. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |
| --ttl | The duration for which this health report is valid. This field uses ISO8601 format for specifying the duration. <br><br> When clients report periodically, they should send reports with higher frequency than time to live. If clients report on transition, they can set the time to live to infinite. When time to live expires, the health event that contains the health information is either removed from health store, if RemoveWhenExpired is true, or evaluated at error, if RemoveWhenExpired false. If not specified, time to live defaults to infinite value. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl replica restart
Restarts a service replica of a persisted service running on a node.

Restarts a service replica of a persisted service running on a node. Warning - There are no safety checks performed when this API is used. Incorrect use of this API can lead to availability loss for stateful services.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required] | The name of the node. |
| --partition-id [Required] | The identity of the partition. |
| --replica-id   [Required] | The identifier of the replica. |
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
