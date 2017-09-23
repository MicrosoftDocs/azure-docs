---
title: sfctl partition| Microsoft Docs
description: Describes the Service Fabric CLI sfctl partition commands.
services: service-fabric
documentationcenter: na
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 09/22/2017
ms.author: ryanwi

---
# sfctl partition
Query and manage partitions for any service.

## Commands

|Command|Description|
| --- | --- |
|    data-loss      | This API will induce data loss for the specified partition.|
|    data-loss-status  | Gets the progress of a partition data loss operation started using the    StartDataLoss API.|
|    health         | Gets the health of the specified Service Fabric partition.|
|    info           | Gets the information about a Service Fabric partition.|
|    list           | Gets the list of partitions of a Service Fabric service.|
|    load           | Gets the load of the specified Service Fabric partition.|
|    load-reset     | Resets the current load of a Service Fabric partition.|
|    quorum-loss    | Induces quorum loss for a given stateful service partition.|
|    quorum-loss-status| Gets the progress of a quorum loss operation on a partition started using    the StartQuorumLoss API.|
|    recover        | Indicates to the Service Fabric cluster that it should attempt to recover a    specific partition which is currently stuck in quorum loss.|
|    recover-all    | Indicates to the Service Fabric cluster that it should attempt to recover    any services (including system services) which are currently stuck in quorum    loss.|
|    report-health  | Sends a health report on the Service Fabric partition.|
|    restart        | This API will restart some or all replicas or instances of the specified    partition.|
|    restart-status | Gets the progress of a PartitionRestart operation started using    StartPartitionRestart.|
|    svc-name       | Gets the name of the Service Fabric service for a partition.|


## sfctl partition health
Gets the health of the specified Service Fabric partition.

Gets the health information of the specified partition. Use EventsHealthStateFilter to
        filter the collection of health events reported on the service based on the health state.
        Use ReplicasHealthStateFilter to filter the collection of ReplicaHealthState objects on the
        partition. If you specify a partition that does not exist in the health store, this cmdlet
        returns an error. .

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id      [Required]| The identity of the partition.|
| --events-health-state-filter  | Allows filtering the collection of HealthEvent objects returned                based on health state. The possible values for this parameter                include integer value of one of the following health states.                Only events that match the filter are returned. All events are                used to evaluate the aggregated health state. If not specified,                all entries are returned. The state values are flag based                enumeration, so the value could be a combination of these value                obtained using bitwise 'OR' operator. For example, If the                provided value is 6 then all of the events with HealthState                value of OK (2) and Warning (4) are returned. - Default -                Default value. Matches any HealthState. The value is zero. -                None - Filter that doesn’t match any HealthState value. Used in                order to return no results on a given collection of states. The                value is 1. - Ok - Filter that matches input with HealthState                value Ok. The value is 2. - Warning - Filter that matches input                with HealthState value Warning. The value is 4. - Error - Filter                that matches input with HealthState value Error. The value is 8.                - All - Filter that matches input with any HealthState value.                The value is 65535.|
| --replicas-health-state-filter| Allows filtering the collection of ReplicaHealthState objects on                the partition. The value can be obtained from members or bitwise                operations on members of HealthStateFilter. Only replicas that                match the filter will be returned. All replicas will be used to                evaluate the aggregated health state. If not specified, all                entries will be returned.The state values are flag based                enumeration, so the value could be a combination of these value                obtained using bitwise 'OR' operator. For example, If the                provided value is 6 then all of the events with HealthState                value of OK (2) and Warning (4) will be returned. The possible                values for this parameter include integer value of one of the                following health states. - Default - Default value. Matches any                HealthState. The value is zero. - None - Filter that doesn’t                match any HealthState value. Used in order to return no results                on a given collection of states. The value is 1. - Ok - Filter                that matches input with HealthState value Ok. The value is 2. -                Warning - Filter that matches input with HealthState value                Warning. The value is 4. - Error - Filter that matches input                with HealthState value Error. The value is 8. - All - Filter                that matches input with any HealthState value. The value is                65535.|
| --timeout -t               | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                    | Increase logging verbosity to show all debug logs.|
| --help -h                  | Show this help message and exit.|
| --output -o                | Output format.  Allowed values: json, jsonc, table, tsv.                Default: json.|
| --query                    | JMESPath query string. See http://jmespath.org/ for more                information and examples.|
| --verbose                  | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl partition info
Gets the information about a Service Fabric partition.

The Partitions endpoint returns information about the specified partition. The response
        include the partition id, partitioning scheme information, keys supported by the partition,
        status, health and other details about the partition.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required]| The identity of the partition.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl partition list
Gets the list of partitions of a Service Fabric service.

Gets the list of partitions of a Service Fabric service. The response include the partition
        id, partitioning scheme information, keys supported by the partition, status, health and
        other details about the partition.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required]| The identity of the service. This is typically the full name of the         service without the 'fabric:' URI scheme.|
| --continuation-token| The continuation token parameter is used to obtain next set of results.         A continuation token with a non empty value is included in the response         of the API when the results from the system do not fit in a single         response. When this value is passed to the next API call, the API         returns next set of results. If there are no further results then the         continuation token does not contain a value. The value of this         parameter should not be URL encoded.|
| --timeout -t        | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug             | Increase logging verbosity to show all debug logs.|
| --help -h           | Show this help message and exit.|
| --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default:         json.|
| --query             | JMESPath query string. See http://jmespath.org/ for more information         and examples.|
| --verbose           | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl partition load
Gets the load of the specified Service Fabric partition.

Returns information about the specified partition. The response includes a list of load
        information. Each information includes load metric name, value and last reported time in
        UTC. .

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required]| The identity of the partition.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl partition recover
Indicates to the Service Fabric cluster that it should attempt to
    recover a specific partition which is currently stuck in quorum loss.

Indicates to the Service Fabric cluster that it should attempt to recover a specific
        partition which is currently stuck in quorum loss. This operation should only be performed
        if it is known that the replicas that are down cannot be recovered. Incorrect use of this
        API can cause potential data loss.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required]| The identity of the partition.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl partition restart
This API will restart some or all replicas or instances of the
    specified partition.

This API is useful for testing failover. If used to target a stateless service partition,
        RestartPartitionMode must be AllReplicasOrInstances. Call the GetPartitionRestartProgress
        API using the same OperationId to get the progress. .

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id           [Required]| A GUID that identifies a call of this API.  This is passed                     into the corresponding GetProgress API.|
| --partition-id           [Required]| The identity of the partition.|
| --restart-partition-mode [Required]| - Invalid - Reserved.  Do not pass into API. -                     AllReplicasOrInstances - All replicas or instances in the                     partition are restarted at once. - OnlyActiveSecondaries -                     Only the secondary replicas are restarted. .|
| --service-id             [Required]| The identity of the service. This is typically the full                     name of the service without the 'fabric:' URI scheme.|
| --timeout -t                    | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                         | Increase logging verbosity to show all debug logs.|
| --help -h                       | Show this help message and exit.|
| --output -o                     | Output format.  Allowed values: json, jsonc, table, tsv.                     Default: json.|
| --query                         | JMESPath query string. See http://jmespath.org/ for more                     information and examples.|
| --verbose                       | Increase logging verbosity. Use --debug for full debug                     logs.|
