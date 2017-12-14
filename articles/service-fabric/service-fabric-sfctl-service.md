---
title: Azure Service Fabric CLI- sfctl service | Microsoft Docs
description: Describes the Service Fabric CLI sfctl service commands.
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
# sfctl service
Create, delete and manage service, service types and service packages.

## Commands

|Command|Description|
| --- | --- |
|    app-name       | Gets the name of the Service Fabric application for a service.|
|    code-package-list | Gets the list of code packages deployed on a Service Fabric node.|
|    create         | Creates the specified Service Fabric service from the description.|
|    delete         | Deletes an existing Service Fabric service.|
|    deployed-type  | Gets the information about a specified service type of the application    deployed on a node in a Service Fabric cluster.|
|    deployed-type-list| Gets the list containing the information about service types from the    applications deployed on a node in a Service Fabric cluster.|
|    description    | Gets the description of an existing Service Fabric service.|
|    health         | Gets the health of the specified Service Fabric service.|
|    info           | Gets the information about the specific service belonging to a Service    Fabric application.|
|    list           | Gets the information about all services belonging to the application    specified by the application ID.|
|    manifest       | Gets the manifest describing a service type.|
|    package-deploy | Downloads packages associated with specified service manifest to the image    cache on specified node.|
|    package-health | Gets the information about health of a service package for a specific    application deployed for a Service Fabric node and application.|
|    package-info   | Gets the list of service packages deployed on a Service Fabric node matching    exactly the specified name.|
|    package-list   | Gets the list of service packages deployed on a Service Fabric node.|
|    recover        | Indicates to the Service Fabric cluster that it should attempt to recover    the specified service, which is currently stuck in quorum loss.|
|    report-health  | Sends a health report on the Service Fabric service.|
|    resolve        | Resolve a Service Fabric partition.|
|    type-list      | Gets the list containing the information about service types that are    supported by a provisioned application type in a Service Fabric cluster.|
|    update         | Updates the specified service using the given update description.|


## sfctl service create
Creates the specified Service Fabric service from the description.

### Arguments

|Argument|Description|
| --- | --- |
| --app-id       [Required]| The identity of the parent application. This is typically the full ID           of the application without the 'fabric:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '~' character. For example, if the application name is 'fabric://myapp/app1', the         application identity would be 'myapp~app1' in 6.0+ and 'myapp/app1'           in previous versions.|
| --name         [Required]| Name of the service. This should be a child of the application ID.           This is the full name including the `fabric:` URI. For example           service `fabric:/A/B` is a child of application `fabric:/A`.|
| --service-type [Required]| Name of the service type.|
| --activation-mode     | The activation mode for the service package.|
| --constraints         | The placement constraints as a string. Placement constraints are           boolean expressions on node properties and allow for restricting a           service to particular nodes based on the service requirements. For           example, to place a service on nodes where NodeType is blue specify           the following:"NodeColor == blue".|
| --correlated-service  | Name of the target service to correlate with.|
| --correlation         | Correlate the service with an existing service using an alignment           affinity.|
| --dns-name            | The DNS name of the service to be created. The Service Fabric DNS           system service must be enabled for this setting.|
| --instance-count      | The instance count. This applies to stateless services only.|
| --int-scheme          | Indicates the service should be uniformly partitioned across a range           of unsigned integers.|
| --int-scheme-count    | The number of partitions inside the integer key range (for a uniform integer partition scheme) to create.|
| --int-scheme-high     | The end of the key integer range, if using a uniform integer           partition scheme.|
| --int-scheme-low      | The start of the key integer range, if using a uniform integer           partition scheme.|
| --load-metrics        | JSON encoded list of metrics used when load balancing services across           nodes.|
| --min-replica-set-size| The minimum replica set size as a number. This applies to stateful           services only.|
| --move-cost           | Specifies the move cost for the service. Possible values are: 'Zero',           'Low', 'Medium', 'High'.|
| --named-scheme        | Indicates the service should have multiple named partitions.|
| --named-scheme-list   | JSON encoded list of names to partition the service across, if using           the named partition scheme.|
| --no-persisted-state  | If true, this indicates the service has no persistent state stored on           the local disk, or it only stores state in memory.|
| --placement-policy-list  | JSON encoded list of placement policies for the service, and any           associated domain names. Policies can be one or more of:           `NonPartiallyPlaceService`, `PreferPrimaryDomain`, `RequireDomain`,           `RequireDomainDistribution`.|
| --quorum-loss-wait    | The maximum duration, in seconds, for which a partition is allowed to           be in a state of quorum loss. This applies to stateful services only.|
| --replica-restart-wait| The duration, in seconds, between when a replica goes down and when a           new replica is created. This applies to stateful services only.|
| --singleton-scheme    | Indicates the service should have a single partition or be a non-           partitioned service.|
| --stand-by-replica-keep  | The maximum duration, in seconds,  for which StandBy replicas are           maintained before being removed. This applies to stateful services           only.|
| --stateful            | Indicates the service is a stateful service.|
| --stateless           | Indicates the service is a stateless service.|
| --target-replica-set-size| The target replica set size as a number. This applies to stateful           services only.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. For more information           and examples, see http://jmespath.org/.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service delete
Deletes an existing Service Fabric service.

Deletes an existing Service Fabric service. A service must be created before it can be
        deleted. By default Service Fabric tries to close service replicas in a graceful manner
        and then delete the service. However if service is having issues closing the replica
        gracefully, the delete operation may take a long time or get stuck. Use the optional
        ForceRemove flag to skip the graceful close sequence and forcefully delete the service.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required]| The identity of the service. This is typically the full name of the         service without the 'fabric:' URI scheme. Starting from version 6.0,                              hierarchical names are delimited with the "~" character. For example,                             if the service name is fabric://myapp/app1/svc1", the service identity                              would be "myapp~app1~svc1" in 6.0+ and "myapp/app1/svc1" in previous                              versions.|
| --force-remove      | Remove a Service Fabric application or service forcefully without going         through the graceful shutdown sequence. This parameter can be used to         forcefully delete an application or service for which delete is timing         out due to issues in the service code that prevents graceful close of         replicas.|
| --timeout -t        | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug             | Increase logging verbosity to show all debug logs.|
| --help -h           | Show this help message and exit.|
| --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default:         json.|
| --query             | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose           | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service description
Gets the description of an existing Service Fabric service.

Gets the description of an existing Service Fabric service. A service must be created before
        its description can be obtained.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required]| The identity of the service. This is typically the full name of the         service without the 'fabric:' URI scheme. Starting from version 6.0,                              hierarchical names are delimited with the "~" character. For example,                             if the service name is "fabric://myapp/app1/svc1", the service identity                             would be "myapp~app1~svc1" in 6.0+ and "myapp/app1/svc1" in previous                             versions.|
| --timeout -t        | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug             | Increase logging verbosity to show all debug logs.|
| --help -h           | Show this help message and exit.|
| --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default:         json.|
| --query             | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose           | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service health
Gets the health of the specified Service Fabric service.

Gets the health information of the specified service. Use EventsHealthStateFilter to filter
        the collection of health events reported on the service based on the health state. Use
        PartitionsHealthStateFilter to filter the collection of partitions returned. If you specify
        a service that does not exist in the health store, this cmdlet returns an error. .

### Arguments

|Argument|Description|
| --- | --- |
| --service-id          [Required]| The identity of the service. This is typically the full name                  of the service without the 'fabric:' URI scheme. Starting from                                      version 6.0, hierarchical names are delimited with the "~"                                      character. For example, if the service name is                                      "fabric://myapp/app1/svc1", the service identity would be                                      "myapp~app1~svc1" in 6.0+ and "myapp/app1/svc1" in previous                                      versions.|
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects                  returned based on health state. The possible values for this                  parameter include integer value of one of the following health                  states. Only events that match the filter are returned. All                  events are used to evaluate the aggregated health state. If                  not specified, all entries are returned. The state values are                  flag-based enumeration, so the value could be a combination of                  these values obtained using bitwise 'OR' operator. For example,                  If the provided value is 6 then all of the events with                  HealthState value of OK (2) and Warning (4) are returned. -                  Default - Default value. Matches any HealthState. The value is                  zero. - None - Filter that doesn’t match any HealthState                  value. Used in order to return no results on a given                  collection of states. The value is 1. - Ok - Filter that                  matches input with HealthState value Ok. The value is 2. -                  Warning - Filter that matches input with HealthState value                  Warning. The value is 4. - Error - Filter that matches input                  with HealthState value Error. The value is 8. - All - Filter                  that matches input with any HealthState value. The value is                  65535.|
|--exclude-health-statistics     | Indicates whether the health statistics should be returned as                                      part of the query result. False by default. The statistics                                      show the number of children entities in health state Ok,                                      Warning, and Error.|
| --partitions-health-state-filter| Allows filtering of the partitions health state objects                  returned in the result of service health query based on their                  health state. The possible values for this parameter include                  integer value of one of the following health states. Only                  partitions that match the filter are returned. All partitions                  are used to evaluate the aggregated health state. If not                  specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of                  these values obtained using bitwise 'OR' operator. For example,                  if the provided value is "6" then health state of partitions                  with HealthState value of OK (2) and Warning (4) are                  returned. - Default - Default value. Matches any HealthState.                  The value is zero. - None - Filter that doesn't match any                  HealthState value. Used in order to return no results on a                  given collection of states. The value is 1. - Ok - Filter that                  matches input with HealthState value Ok. The value is 2. -                  Warning - Filter that matches input with HealthState value                  Warning. The value is 4. - Error - Filter that matches input                  with HealthState value Error. The value is 8. - All - Filter                  that matches input with any HealthState value. The value is                  65535.|
| --timeout -t                 | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                      | Increase logging verbosity to show all debug logs.|
| --help -h                    | Show this help message and exit.|
| --output -o                  | Output format.  Allowed values: json, jsonc, table, tsv.                  Default: json.|
| --query                      | JMESPath query string. See http://jmespath.org/ for more                  information and examples.|
| --verbose                    | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service info
Gets the information about the specific service belonging to a Service Fabric application.

Returns the information about specified service belonging to the specified Service Fabric
        application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of             the application without the 'fabric:' URI scheme. Starting from                                 version 6.0, hierarchical names are delimited with the "~"                                 character. For example, if the application name is                                 "fabric://myapp/app1", the application identity would be                                 "myapp~app1" in 6.0+ and "myapp/app1" in previous versions.|
| --service-id     [Required]| The identity of the service. This is typically the full name of the             service without the 'fabric:' URI scheme. Starting from version                                 6.0, hierarchical names are delimited with the "~" character. For                                 example, if the service name is "fabric://myapp/app1/svc1", the                                 service identity would be "myapp~app1~svc1" in 6.0+ and                                 "myapp/app1/svc1" in previous versions.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:             json.|
| --query                 | JMESPath query string. For more information           and examples, see http://jmespath.org/.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service list
Gets the information about all services belonging to the application
    specified by the application ID.

Returns the information about all services belonging to the application specified by the
        application ID.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of             the application without the 'fabric:' URI scheme. Starting from                                 version 6.0, hierarchical names are delimited with the "~"                                 character. For example, if the application name is                                 "fabric://myapp/app1", the application identity would be                                 "myapp~app1" in 6.0+ and "myapp/app1" in previous versions.|
| --continuation-token    | The continuation token parameter is used to obtain next set of             results. A continuation token with a non empty value is included in             the response of the API when the results from the system do not fit             in a single response. When this value is passed to the next API             call, the API returns next set of results. If there are no further             results, then the continuation token does not contain a value. The             value of this parameter should not be URL encoded.|
| --service-type-name     | The service type name used to filter the services to query for.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:             json.|
| --query                 | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service manifest
Gets the manifest describing a service type.

Gets the manifest describing a service type. The response contains the service manifest XML
        as a string.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required]| The name of the application type.|
| --application-type-version [Required]| The version of the application type.|
| --service-manifest-name    [Required]| The name of a service manifest registered as part of an                       application type in a Service Fabric cluster.|
| --timeout -t                      | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                           | Increase logging verbosity to show all debug logs.|
| --help -h                         | Show this help message and exit.|
| --output -o                       | Output format.  Allowed values: json, jsonc, table, tsv.                       Default: json.|
| --query                           | JMESPath query string. See http://jmespath.org/ for more                       information and examples.|
| --verbose                         | Increase logging verbosity. Use --debug for full debug                       logs.|

## sfctl service recover
Indicates to the Service Fabric cluster that it should attempt to recover
    the specified service, which is currently stuck in quorum loss.

Indicates to the Service Fabric cluster that it should attempt to recover the specified
        service, which is currently stuck in quorum loss. This operation should only be performed if
        the replicas that are down cannot be recovered. Incorrect use of this API
        can cause potential data loss.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required]| The identity of the service. This is typically the full name of the         service without the 'fabric:' URI scheme. Starting from version 6.0,                              hierarchical names are delimited with the "~" character. For example,                              if the service name is fabric://myapp/app1/svc1", the service identity                              would be "myapp~app1~svc1" in 6.0+ and "myapp/app1/svc1" in previous                              versions.|
| --timeout -t        | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug             | Increase logging verbosity to show all debug logs.|
| --help -h           | Show this help message and exit.|
| --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default:         json.|
| --query             | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose           | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service resolve
Resolve a Service Fabric partition.

Resolve a Service Fabric service partition, to get the endpoints of the service replicas.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required]| The identity of the service. This is typically the full name of the         service without the 'fabric:' URI scheme. Starting from version 6.0,                             hierarchical names are delimited with the "~" character. For example,                             if the service name is "fabric://myapp/app1/svc1", the service identity                             would be "myapp~app1~svc1" in 6.0+ and "myapp/app1/svc1" in previous                             versions.|
| --partition-key-type| Key type for the partition. This parameter is required if the partition         scheme for the service is Int64Range or Named. The possible values are         following. - None (1) - Indicates that the PartitionKeyValue         parameter is not specified. This is valid for the partitions with         partitioning scheme as Singleton. This is the default value. The value         is 1. - Int64Range (2) - Indicates that the PartitionKeyValue         parameter is an int64 partition key. This is valid for the partitions         with partitioning scheme as Int64Range. The value is 2. - Named (3) -         Indicates that the PartitionKeyValue parameter is a name of the         partition. This is valid for the partitions with partitioning scheme as         Named. The value is 3.|
| --partition-key-value  | Partition key. This is required if the partition scheme for the service         is Int64Range or Named.|
| --previous-rsp-version | The value in the Version field of the response that was received         previously. This is required if the user knows that the result that was         got previously is stale.|
| --timeout -t        | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug             | Increase logging verbosity to show all debug logs.|
| --help -h           | Show this help message and exit.|
| --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default:         json.|
| --query             | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose           | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl service update
Updates the specified service using the given update description.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id   [Required]| Target service to update. This is typically the full ID of the           service without the 'fabric:' URI scheme. Starting from version 6.0,                               hierarchical names are delimited with the "~" character. For example,                               if the service name is 'fabric://myapp/app1/svc1', the service                               identity would be 'myapp~app1~svc1' in 6.0+ and 'myapp/app1/svc1' in                               previous versions.|
| --constraints         | The placement constraints as a string. Placement constraints are           boolean expressions on node properties and allow for restricting a           service to particular nodes based on the service requirements. For           example, to place a service on nodes where NodeType is blue specify           the following: "NodeColor == blue".|
| --correlated-service  | Name of the target service to correlate with.|
| --correlation         | Correlate the service with an existing service using an alignment           affinity.|
| --instance-count      | The instance count. This applies to stateless services only.|
| --load-metrics        | JSON encoded list of metrics used when load balancing across nodes.|
| --min-replica-set-size| The minimum replica set size as a number. This applies to stateful           services only.|
| --move-cost           | Specifies the move cost for the service. Possible values are: 'Zero',           'Low', 'Medium', 'High'.|
| --placement-policy-list  | JSON encoded list of placement policies for the service, and any           associated domain names. Policies can be one or more of:           `NonPartiallyPlaceService`, `PreferPrimaryDomain`, `RequireDomain`,           `RequireDomainDistribution`.|
| --quorum-loss-wait    | The maximum duration, in seconds, for which a partition is allowed to           be in a state of quorum loss. This applies to stateful services only.|
| --replica-restart-wait| The duration, in seconds, between when a replica goes down and when a           new replica is created. This applies to stateful services only.|
| --stand-by-replica-keep  | The maximum duration, in seconds,  for which StandBy replicas are           maintained before being removed. This applies to stateful services           only.|
| --stateful            | Indicates the target service is a stateful service.|
| --stateless           | Indicates the target service is a stateless service.|
| --target-replica-set-size| The target replica set size as a number. This applies to stateful           services only.|
| --timeout -t          | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug               | Increase logging verbosity to show all debug logs.|
| --help -h             | Show this help message and exit.|
| --output -o           | Output format.  Allowed values: json, jsonc, table, tsv.  Default:           json.|
| --query               | JMESPath query string. For more information           and examples, see http://jmespath.org/.|
| --verbose             | Increase logging verbosity. Use --debug for full debug logs.|

## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).