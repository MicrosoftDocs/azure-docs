---
title: Azure Service Fabric CLI- sfctl replica| Microsoft Docs
description: Describes the Service Fabric CLI sfctl replica commands.
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
# sfctl replica
Manage the replicas that belong to service partitions.

## Commands

|Command|Description|
| --- | --- |
|    deployed  | Gets the details of replica deployed on a Service Fabric node.|
|    deployed-list| Gets the list of replicas deployed on a Service Fabric node.|
|    health    | Gets the health of a Service Fabric stateful service replica or stateless service instance.|
|    info      | Gets the information about a replica of a Service Fabric partition.|
|    list      | Gets the information about replicas of a Service Fabric service partition.|
|    remove    | Removes a service replica running on a node.|
|    report-health| Sends a health report on the Service Fabric replica.|
|    restart   | Restarts a service replica of a persisted service running on a node.|


## sfctl replica deployed
Gets the details of replica deployed on a Service Fabric node.

Gets the details of the replica deployed on a Service Fabric node. The information includes
        service kind, service name, current service operation, current service operation start date
        time, partition ID, replica/instance ID, reported load and other information.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required]| The name of the node.|
| --partition-id [Required]| The identity of the partition.|
| --replica-id   [Required]| The identifier of the replica.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. For more information           and examples, see http://jmespath.org/.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl replica health
Gets the health of a Service Fabric stateful service replica or stateless
    service instance.

Gets the health of a Service Fabric replica. Use EventsHealthStateFilter to filter the
        collection of health events reported on the replica based on the health state. .

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id    [Required]| The identity of the partition.|
| --replica-id      [Required]| The identifier of the replica.|
| --events-health-state-filter| Allows filtering the collection of HealthEvent objects returned              based on health state. The possible values for this parameter              include integer value of one of the following health states. Only              events that match the filter are returned. All events are used to              evaluate the aggregated health state. If not specified, all              entries are returned. The state values are flag-based enumeration,              so the value could be a combination of these value obtained using              bitwise 'OR' operator. For example, If the provided value is 6              then all of the events with HealthState value of OK (2) and              Warning (4) are returned. - Default - Default value. Matches any              HealthState. The value is zero. - None - Filter that doesn’t match              any HealthState value. Used in order to return no results on a              given collection of states. The value is 1. - Ok - Filter that              matches input with HealthState value Ok. The value is 2. - Warning              - Filter that matches input with HealthState value Warning. The              value is 4. - Error - Filter that matches input with HealthState              value Error. The value is 8. - All - Filter that matches input              with any HealthState value. The value is 65535.|
| --timeout -t             | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                  | Increase logging verbosity to show all debug logs.|
| --help -h                | Show this help message and exit.|
| --output -o              | Output format.  Allowed values: json, jsonc, table, tsv.  Default:              json.|
| --query                  | JMESPath query string. See http://jmespath.org/ for more              information and examples.|
| --verbose                | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl replica info
Gets the information about a replica of a Service Fabric partition.

The respons include the ID, role, status, health, node name, uptime, and other details about
        the replica.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required]| The identity of the partition.|
| --replica-id   [Required]| The identifier of the replica.|
| --continuation-token  | The continuation token parameter is used to obtain next set of           results. A continuation token with a non empty value is included in           the response of the API when the results from the system do not fit           in a single response. When this value is passed to the next API call,           the API returns next set of results. If there are no further results           then the continuation token does not contain a value. The value of           this parameter should not be URL encoded.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl replica list
Gets the information about replicas of a Service Fabric service partition.

The GetReplicas endpoint returns information about the replicas of the specified partition.
        The respons include the ID, role, status, health, node name, uptime, and other details about
        the replica.

### Arguments

|Argument|Description|
| --- | --- |
| --partition-id [Required]| The identity of the partition.|
| --continuation-token  | The continuation token parameter is used to obtain next set of           results. A continuation token with a non empty value is included in           the response of the API when the results from the system do not fit           in a single response. When this value is passed to the next API call,           the API returns next set of results. If there are no further results           then the continuation token does not contain a value. The value of           this parameter should not be URL encoded.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl replica remove
Removes a service replica running on a node.

This API simulates a Service Fabric replica failure by removing a replica from a Service
        Fabric cluster. The removal closes the replica, transitions the replica to the role None,
        and then removes all of the state information of the replica from the cluster. This API
        tests the replica state removal path, and simulates the report fault permanent path through
        client APIs. Warning - There are no safety checks performed when this API is used. Incorrect
        use of this API can lead to data loss for stateful services.In addition, the forceRemove
        flag impacts all other replicas hosted in the same process.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required]| The name of the node.|
| --partition-id [Required]| The identity of the partition.|
| --replica-id   [Required]| The identifier of the replica.|
| --force-remove        | Remove a Service Fabric application or service forcefully without           going through the graceful shutdown sequence. This parameter can be           used to forcefully delete an application or service for which delete           is timing out due to issues in the service code that prevents           graceful close of replicas.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl replica restart
Restarts a service replica of a persisted service running on a node.

Restarts a service replica of a persisted service running on a node. Warning - There are no
        safety checks performed when this API is used. Incorrect use of this API can lead to
        availability loss for stateful services.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name    [Required]| The name of the node.|
| --partition-id [Required]| The identity of the partition.|
| --replica-id   [Required]| The identifier of the replica.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. See http://jmespath.org/ for more information           and examples.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).
