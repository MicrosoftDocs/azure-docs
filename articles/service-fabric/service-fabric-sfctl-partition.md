---
title: Azure Service Fabric CLI- sfctl partition
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing partitions for a service.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# sfctl partition
Query and manage partitions for any service.

## Commands

|Command|Description|
| --- | --- |
| data-loss | This API will induce data loss for the specified partition. |
| data-loss-status | Gets the progress of a partition data loss operation started using the StartDataLoss API. |
| health | Gets the health of the specified Service Fabric partition. |
| info | Gets the information about a Service Fabric partition. |
| list | Gets the list of partitions of a Service Fabric service. |
| load | Gets the load information of the specified Service Fabric partition. |
| load-reset | Resets the current load of a Service Fabric partition. |
| quorum-loss | Induces quorum loss for a given stateful service partition. |
| quorum-loss-status | Gets the progress of a quorum loss operation on a partition started using the StartQuorumLoss API. |
| recover | Indicates to the Service Fabric cluster that it should attempt to recover a specific partition that is currently stuck in quorum loss. |
| recover-all | Indicates to the Service Fabric cluster that it should attempt to recover any services (including system services) which are currently stuck in quorum loss. |
| report-health | Sends a health report on the Service Fabric partition. |
| restart | This API will restart some or all replicas or instances of the specified partition. |
| restart-status | Gets the progress of a PartitionRestart operation started using StartPartitionRestart. |
| svc-name | Gets the name of the Service Fabric service for a partition. |

## sfctl partition data-loss
This API will induce data loss for the specified partition.

It will trigger a call to the OnDataLossAsync API of the partition.  This API will induce data loss for the specified partition. It will trigger a call to the OnDataLoss API of the partition. Actual data loss will depend on the specified DataLossMode.
- PartialDataLoss: Only a quorum of replicas are removed and OnDataLoss is triggered for the partition but actual data loss depends on the presence of in-flight replication.  
- FullDataLoss: All replicas are removed hence all data is lost and OnDataLoss is triggered. This API should only be called with a stateful service as the target. Calling this API with a system service as the target is not advised.

> [!NOTE] 	
> Once this API has been called, it cannot be reversed. Calling CancelOperation will only stop execution and clean up internal system state. It will not restore data if the command has progressed far enough to cause data loss. Call the GetDataLossProgress API with the same OperationId to return information on the operation started with this API.

### Arguments

|Argument|Description|
| --- | --- |
| --data-loss-mode [Required] | This enum is passed to the StartDataLoss API to indicate what type of data loss to induce. |
| --operation-id   [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id   [Required] | The identity of the partition. |
| --service-id     [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition data-loss-status
Gets the progress of a partition data loss operation started using the StartDataLoss API.

Gets the progress of a data loss operation started with StartDataLoss, using the OperationId.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id [Required] | The identity of the partition. |
| --service-id   [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition health
Gets the health of the specified Service Fabric partition.

Use EventsHealthStateFilter to filter the collection of health events reported on the service based on the health state. Use ReplicasHealthStateFilter to filter the collection of ReplicaHealthState objects on the partition. If you specify a partition that does not exist in the health store, this request returns an error.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id      [Required] | The identity of the partition. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --exclude-health-statistics | Indicates whether the health statistics should be returned as part of the query result. False by default. The statistics show the number of children entities in health state Ok, Warning, and Error. |
| --replicas-health-state-filter | Allows filtering the collection of ReplicaHealthState objects on the partition. The value can be obtained from members or bitwise operations on members of HealthStateFilter. Only replicas that match the filter will be returned. All replicas will be used to evaluate the aggregated health state. If not specified, all entries will be returned.The state values are flag-based enumeration, so the value could be a combination of these values obtained using bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) will be returned. The possible values for this parameter include integer value of one of the following health states.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition info
Gets the information about a Service Fabric partition.

Gets the information about the specified partition. The response includes the partition ID, partitioning scheme information, keys supported by the partition, status, health, and other details about the partition.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition list
Gets the list of partitions of a Service Fabric service.

The response includes the partition ID, partitioning scheme information, keys supported by the partition, status, health, and other details about the partition.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition load
Gets the load information of the specified Service Fabric partition.

Returns information about the load of a specified partition. The response includes a list of load reports for a Service Fabric partition. Each report includes the load metric name, value, and last reported time in UTC.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition load-reset
Resets the current load of a Service Fabric partition.

Resets the current load of a Service Fabric partition to the default load for the service.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition quorum-loss
Induces quorum loss for a given stateful service partition.

This API is useful for a temporary quorum loss situation on your service. Call the GetQuorumLossProgress API with the same OperationId to return information on the operation started with this API. This can only be called on stateful persisted (HasPersistedState==true) services.  Do not use this API on stateless services or stateful in-memory only services.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id         [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id         [Required] | The identity of the partition. |
| --quorum-loss-duration [Required] | The amount of time for which the partition will be kept in quorum loss.  This must be specified in seconds. |
| --quorum-loss-mode     [Required] | This enum is passed to the StartQuorumLoss API to indicate what type of quorum loss to induce. |
| --service-id           [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition quorum-loss-status
Gets the progress of a quorum loss operation on a partition started using the StartQuorumLoss API.

Gets the progress of a quorum loss operation started with StartQuorumLoss, using the provided OperationId.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id [Required] | The identity of the partition. |
| --service-id   [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition recover
Indicates to the Service Fabric cluster that it should attempt to recover a specific partition that is currently stuck in quorum loss.

This operation should only be performed if it is known that the replicas that are down cannot be recovered. Incorrect use of this API can cause potential data loss.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition recover-all
Indicates to the Service Fabric cluster that it should attempt to recover any services (including system services) which are currently stuck in quorum loss.

This operation should only be performed if it is known that the replicas that are down cannot be recovered. Incorrect use of this API can cause potential data loss.

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

## sfctl partition report-health
Sends a health report on the Service Fabric partition.

Reports health state of the specified Service Fabric partition. The report must contain the information about the source of the health report and property on which it is reported. The report is sent to a Service Fabric gateway Partition, which forwards to the health store. The report may be accepted by the gateway, but rejected by the health store after extra validation. For example, the health store may reject the report because of an invalid parameter, like a stale sequence number. To see whether the report was applied in the health store, check that the report appears in the events section.

### Arguments

|Argument|Description|
| --- | --- |
| --health-property [Required] | The property of the health information. <br><br> An entity can have health reports for different properties. The property is a string and not a fixed enumeration to allow the reporter flexibility to categorize the state condition that triggers the report. For example, a reporter with SourceId "LocalWatchdog" can monitor the state of the available disk on a node, so it can report "AvailableDisk" property on that node. The same reporter can monitor the node connectivity, so it can report a property "Connectivity" on the same node. In the health store, these reports are treated as separate health events for the specified node. Together with the SourceId, the property uniquely identifies the health information. |
| --health-state    [Required] | Possible values include\: 'Invalid', 'Ok', 'Warning', 'Error', 'Unknown'. |
| --partition-id    [Required] | The identity of the partition. |
| --source-id       [Required] | The source name that identifies the client/watchdog/system component that generated the health information. |
| --description | The description of the health information. <br><br> It represents free text used to add human readable information about the report. The maximum string length for the description is 4096 characters. If the provided string is longer, it will be automatically truncated. When truncated, the last characters of the description contain a marker "[Truncated]", and total string size is 4096 characters. The presence of the marker indicates to users that truncation occurred. Note that when truncated, the description has less than 4096 characters from the original string. |
| --immediate | A flag that indicates whether the report should be sent immediately. <br><br> A health report is sent to a Service Fabric gateway Application, which forwards to the health store. If Immediate is set to true, the report is sent immediately from HTTP Gateway to the health store, regardless of the fabric client settings that the HTTP Gateway Application is using. This is useful for critical reports that should be sent as soon as possible. Depending on timing and other conditions, sending the report may still fail, for example if the HTTP Gateway is closed or the message doesn't reach the Gateway. If Immediate is set to false, the report is sent based on the health client settings from the HTTP Gateway. Therefore, it will be batched according to the HealthReportSendInterval configuration. This is the recommended setting because it allows the health client to optimize health reporting messages to health store as well as health report processing. By default, reports are not sent immediately. |
| --remove-when-expired | Value that indicates whether the report is removed from health store when it expires. <br><br> If set to true, the report is removed from the health store after it expires. If set to false, the report is treated as an error when expired. The value of this property is false by default. When clients report periodically, they should set RemoveWhenExpired false (default). This way, is the reporter has issues (e.g. deadlock) and can't report, the entity is evaluated at error when the health report expires. This flags the entity as being in Error health state. |
| --sequence-number | The sequence number for this health report as a numeric string. <br><br> The report sequence number is used by the health store to detect stale reports. If not specified, a sequence number is auto-generated by the health client when a report is added. |
| --timeout -t | Default\: 60. |
| --ttl | The duration for which this health report is valid. This field uses ISO8601 format for specifying the duration. <br><br> When clients report periodically, they should send reports with higher frequency than time to live. If clients report on transition, they can set the time to live to infinite. When time to live expires, the health event that contains the health information is either removed from health store, if RemoveWhenExpired is true, or evaluated at error, if RemoveWhenExpired false. If not specified, time to live defaults to infinite value. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition restart
This API will restart some or all replicas or instances of the specified partition.

This API is useful for testing failover. If used to target a stateless service partition, RestartPartitionMode must be AllReplicasOrInstances. Call the GetPartitionRestartProgress API using the same OperationId to get the progress.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id           [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id           [Required] | The identity of the partition. |
| --restart-partition-mode [Required] | Describe which partitions to restart. |
| --service-id             [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition restart-status
Gets the progress of a PartitionRestart operation started using StartPartitionRestart.

Gets the progress of a PartitionRestart started with StartPartitionRestart using the provided OperationId.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --partition-id [Required] | The identity of the partition. |
| --service-id   [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl partition svc-name
Gets the name of the Service Fabric service for a partition.

Gets name of the service for the specified partition. A 404 error is returned if the partition ID does not exist in the cluster.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required] | The identity of the partition. |
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
- Learn how to use the Service Fabric CLI using the [sample scripts](./scripts/sfctl-upgrade-application.md).
