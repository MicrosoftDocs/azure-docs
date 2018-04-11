---
title: Azure Service Fabric CLI- sfctl node | Microsoft Docs
description: Describes the Service Fabric CLI sfctl node commands.
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
# sfctl node
Manage the nodes that form a cluster.

## Commands

|Command|Description|
| --- | --- |
|    disable       | Deactivate a Service Fabric cluster node with the specified deactivation   intent.|
|    enable        | Activate a Service Fabric cluster node, which is currently deactivated.|
|    health        | Gets the health of a Service Fabric node.|
|    info          | Gets the list of nodes in the Service Fabric cluster.|
|    list          | Gets the list of nodes in the Service Fabric cluster.|
|    load          | Gets the load information of a Service Fabric node.|
|    remove-state  | Notifies Service Fabric that the persisted state on a node has been   permanently removed or lost.|
|    report-health | Sends a health report on the Service Fabric node.|
|    restart       | Restarts a Service Fabric cluster node.|
|    transition    | Starts or stops a cluster node.|
|    transition-status| Gets the progress of an operation started using StartNodeTransition.|


## sfctl node disable
Deactivate a Service Fabric cluster node with the specified deactivation
    intent.

Deactivate a Service Fabric cluster node with the specified deactivation intent. Once the
        deactivation is in progress, the deactivation intent can be increased, but not decreased
        (for example, a node which is deactivated with the Pause intent can be deactivated
        further with Restart, but not the other way around. Nodes may be reactivated using the
        Activate a node operation any time after they are deactivated. If the deactivation is not
        complete this cancels the deactivation. A node that goes down and comes back up while
        deactivated still needs to be reactivated before services can be placed on that node.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required]| The name of the node.|
| --deactivation-intent | Describes the intent or reason for deactivating the node. The possible        values are following. - Pause - Indicates that the node should be        paused. The value is 1. - Restart - Indicates that the intent is for the        node to be restarted after a short period of time. The value is 2. -        RemoveData - Indicates the intent is for the node to remove data. The        value is 3. .|
| --timeout -t       | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug            | Increase logging verbosity to show all debug logs.|
| --help -h          | Show this help message and exit.|
| --output -o        | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query            | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose          | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node enable
Activate a Service Fabric cluster node which is currently deactivated.

Activates a Service Fabric cluster node which is currently deactivated. Once activated, the
        node again becomes a viable target for placing new replicas, and any deactivated
        replicas remaining on the node are reactivated.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required]| The name of the node.|
| --timeout -t       | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug            | Increase logging verbosity to show all debug logs.|
| --help -h          | Show this help message and exit.|
| --output -o        | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query            | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose          | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node health
Gets the health of a Service Fabric node.

Gets the health of a Service Fabric node. Use EventsHealthStateFilter to filter the
        collection of health events reported on the node based on the health state. If the node that
        you specify by name does not exist in the health store, this returns an error.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name       [Required]| The name of the node.|
| --events-health-state-filter| Allows filtering the collection of HealthEvent objects returned              based on health state. The possible values for this parameter              include integer value of one of the following health states. Only              events that match the filter are returned. All events are used to              evaluate the aggregated health state. If not specified, all              entries are returned. The state values are flag-based enumeration,              so the value could be a combination of these values obtained using              bitwise 'OR' operator. For example, If the provided value is 6              then all of the events with HealthState value of OK (2) and              Warning (4) are returned. - Default - Default value. Matches any              HealthState. The value is zero. - None - Filter that doesn’t match              any HealthState value. Used in order to return no results on a              given collection of states. The value is 1. - Ok - Filter that              matches input with HealthState value Ok. The value is 2. - Warning              - Filter that matches input with HealthState value Warning. The              value is 4. - Error - Filter that matches input with HealthState              value Error. The value is 8. - All - Filter that matches input              with any HealthState value. The value is 65535.|
| --timeout -t             | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                  | Increase logging verbosity to show all debug logs.|
| --help -h                | Show this help message and exit.|
| --output -o              | Output format.  Allowed values: json, jsonc, table, tsv.  Default:              json.|
| --query                  | JMESPath query string. See http://jmespath.org/ for more              information and examples.|
| --verbose                | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node info
Gets the list of nodes in the Service Fabric cluster.

Gets the information about a specific node in the Service Fabric cluster. The response include
        the name, status, ID, health, uptime, and other details about the node.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required]| The name of the node.|
| --timeout -t       | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug            | Increase logging verbosity to show all debug logs.|
| --help -h          | Show this help message and exit.|
| --output -o        | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query            | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose          | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node list
Gets the list of nodes in the Service Fabric cluster.

The Nodes endpoint returns information about the nodes in the Service Fabric Cluster. The
        response includes the name, status, ID, health, uptime, and other details about the node.

### Arguments

|Argument|Description|
| --- | --- |
| --continuation-token| The continuation token parameter is used to obtain next set of results. A      continuation token with a non empty value is included in the response of      the API when the results from the system do not fit in a single response.      When this value is passed to the next API call, the API returns next set      of results. If there are no further results, then the continuation token      does not contain a value. The value of this parameter should not be URL      encoded.|
| --node-status-filter| Allows filtering the nodes based on the NodeStatus. Only the nodes that      are matching the specified filter value are returned. The filter value      can be one of the following. - default - This filter value matches all      of the nodes excepts the ones with status as Unknown or Removed. -      all - This filter value matches all of the nodes. - up - This filter      value matches nodes that are Up. - down - This filter value matches      nodes that are Down. - enabling - This filter value matches nodes that      are in the process of being enabled with status as Enabling. - disabling -      This filter value matches nodes that are in the process of being      disabled with status as Disabling. - disabled - This filter value matches nodes that are Disabled. - unknown - This filter value matches      nodes whose status is Unknown. A node would be in Unknown state if Service      Fabric does not have authoritative information about that node. This can      happen if the system learns about a node at runtime. - removed - This      filter value matches nodes whose status is Removed. These are the nodes      that are removed from the cluster using the RemoveNodeState API. .      Default: default.|
| --timeout -t     | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug          | Increase logging verbosity to show all debug logs.|
| --help -h        | Show this help message and exit.|
| --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query          | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node load
Gets the load information of a Service Fabric node.

Gets the load information of a Service Fabric node.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required]| The name of the node.|
| --timeout -t       | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug            | Increase logging verbosity to show all debug logs.|
| --help -h          | Show this help message and exit.|
| --output -o        | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query            | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose          | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node restart
Restarts a Service Fabric cluster node.

Restarts a Service Fabric cluster node that is already started.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required]| The name of the node.|
| --create-fabric-dump  | Specify True to create a dump of the fabric node process. This is case-sensitive.  Default: False.|
| --node-instance-id | The instance ID of the target node. If instance ID is specified the node        is restarted only if it matches with the current instance of the node. A        default value of "0" would match any instance ID. The instance ID can be        obtained using get node query.  Default: 0.|
| --timeout -t       | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug            | Increase logging verbosity to show all debug logs.|
| --help -h          | Show this help message and exit.|
| --output -o        | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query            | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose          | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl node transition
Starts or stops a cluster node.

Starts or stops a cluster node.  A cluster node is a process, not the OS instance itself.
        To start a node, pass in "Start" for the NodeTransitionType parameter. To stop a node, pass
        in "Stop" for the NodeTransitionType parameter. This API starts the operation - when the API
        returns the node may not have finished transitioning yet. Call GetNodeTransitionProgress
        with the same OperationId to get the progress of the operation. .

### Arguments

|Argument|Description|
| --- | --- |
| --node-instance-id         [Required]| The node instance ID of the target node. This can be                       determined through GetNodeInfo API.|
| --node-name                [Required]| The name of the node.|
| --node-transition-type     [Required]| Indicates the type of transition to perform.                       NodeTransitionType.Start starts a stopped node.                       NodeTransitionType.Stop stops a node that is up. -                       Invalid - Reserved.  Do not pass into API. - Start -                       Transition a stopped node to up. - Stop - Transition an                       up node to stopped. .|
| --operation-id             [Required]| A GUID that identifies a call of this API.  This is                       passed into the corresponding GetProgress API.|
| --stop-duration-in-seconds [Required]| The duration, in seconds, to keep the node stopped.  The                       minimum value is 600, the maximum is 14400. After this                       time expires, the node automatically comes back up.|
| --timeout -t                      | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                           | Increase logging verbosity to show all debug logs.|
| --help -h                         | Show this help message and exit.|
| --output -o                       | Output format.  Allowed values: json, jsonc, table, tsv.                       Default: json.|
| --query                           | JMESPath query string. See http://jmespath.org/ for more                       information and examples.|
| --verbose                         | Increase logging verbosity. Use --debug for full debug                       logs.|

## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).