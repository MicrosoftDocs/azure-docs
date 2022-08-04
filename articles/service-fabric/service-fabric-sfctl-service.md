---
title: Azure Service Fabric CLI- sfctl service
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing services, service types, and service packages.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# sfctl service
Create, delete and manage service, service types and service packages.

## Commands

|Command|Description|
| --- | --- |
| app-name | Gets the name of the Service Fabric application for a service. |
| code-package-list | Gets the list of code packages deployed on a Service Fabric node. |
| create | Creates the specified Service Fabric service. |
| delete | Deletes an existing Service Fabric service. |
| deployed-type | Gets the information about a specified service type of the application deployed on a node in a Service Fabric cluster. |
| deployed-type-list | Gets the list containing the information about service types from the applications deployed on a node in a Service Fabric cluster. |
| description | Gets the description of an existing Service Fabric service. |
| get-container-logs | Gets the container logs for container deployed on a Service Fabric node. |
| health | Gets the health of the specified Service Fabric service. |
| info | Gets the information about the specific service belonging to the Service Fabric application. |
| list | Gets the information about all services belonging to the application specified by the application ID. |
| manifest | Gets the manifest describing a service type. |
| package-deploy | Downloads packages associated with specified service manifest to the image cache on specified node. |
| package-health | Gets the information about health of a service package for a specific application deployed for a Service Fabric node and application. |
| package-info | Gets the list of service packages deployed on a Service Fabric node matching exactly the specified name. |
| package-list | Gets the list of service packages deployed on a Service Fabric node. |
| recover | Indicates to the Service Fabric cluster that it should attempt to recover the specified service that is currently stuck in quorum loss. |
| report-health | Sends a health report on the Service Fabric service. |
| resolve | Resolve a Service Fabric partition. |
| type-list | Gets the list containing the information about service types that are supported by a provisioned application type in a Service Fabric cluster. |
| update | Updates the specified service using the given update description. |

## sfctl service app-name
Gets the name of the Service Fabric application for a service.

Gets the name of the application for the specified service. A 404 FABRIC_E_SERVICE_DOES_NOT_EXIST error is returned if a service with the provided service ID does not exist.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service code-package-list
Gets the list of code packages deployed on a Service Fabric node.

Gets the list of code packages deployed on a Service Fabric node for the given application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name      [Required] | The name of the node. |
| --code-package-name | The name of code package specified in service manifest registered as part of an application type in a Service Fabric cluster. |
| --service-manifest-name | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service create
Creates the specified Service Fabric service.

### Arguments

|Argument|Description|
| --- | --- |
| --app-id       [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '\~' character. For example, if the application name is 'fabric\:/myapp/app1', the application identity would be 'myapp\~app1' in 6.0+ and 'myapp/app1' in previous versions. |
| --name         [Required] | Name of the service. This should be a child of the application ID. This is the full name including the `fabric\:` URI. For example service `fabric\:/A/B` is a child of application `fabric\:/A`. |
| --service-type [Required] | Name of the service type. |
| --activation-mode | The activation mode for the service package. |
| --constraints | The placement constraints as a string. Placement constraints are boolean expressions on node properties and allow for restricting a service to particular nodes based on the service requirements. For example, to place a service on nodes where NodeType is blue specify the following\:"NodeColor == blue". |
| --correlated-service | Name of the target service to correlate with. |
| --correlation | Correlate the service with an existing service using an alignment affinity. |
| --dns-name | The DNS name of the service to be created. The Service Fabric DNS system service must be enabled for this setting. |
| --instance-count | The instance count. This applies to stateless services only. |
| --int-scheme | Indicates the service should be uniformly partitioned across a range of unsigned integers. |
| --int-scheme-count | The number of partitions inside the integer key range to create, if using a uniform integer partition scheme. |
| --int-scheme-high | The end of the key integer range, if using an uniform integer partition scheme. |
| --int-scheme-low | The start of the key integer range, if using an uniform integer partition scheme. |
| --load-metrics | JSON encoded list of metrics used when load balancing services across nodes. |
| --min-replica-set-size | The minimum replica set size as a number. This applies to stateful services only. |
| --move-cost | Specifies the move cost for the service. Possible values are\: 'Zero', 'Low', 'Medium', 'High', 'VeryHigh'. |
| --named-scheme | Indicates the service should have multiple named partitions. |
| --named-scheme-list | JSON encoded list of names to partition the service across, if using the named partition scheme. |
| --no-persisted-state | If true, this indicates the service has no persistent state stored on the local disk, or it only stores state in memory. |
| --placement-policy-list | JSON encoded list of placement policies for the service, and any associated domain names. Policies can be one or more of\: `NonPartiallyPlaceService`, `PreferPrimaryDomain`, `RequireDomain`, `RequireDomainDistribution`. |
| --quorum-loss-wait | The maximum duration, in seconds, for which a partition is allowed to be in a state of quorum loss. This applies to stateful services only. |
| --replica-restart-wait | The duration, in seconds, between when a replica goes down and when a new replica is created. This applies to stateful services only. |
| --scaling-policies | JSON encoded list of scaling policies for this service. |
| --service-placement-time | The duration for which replicas can stay InBuild before reporting that build is stuck. This applies to stateful services only. |
| --singleton-scheme | Indicates the service should have a single partition or be a non-partitioned service. |
| --stand-by-replica-keep | The maximum duration, in seconds,  for which StandBy replicas will be maintained before being removed. This applies to stateful services only. |
| --stateful | Indicates the service is a stateful service. |
| --stateless | Indicates the service is a stateless service. |
| --target-replica-set-size | The target replica set size as a number. This applies to stateful services only. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service delete
Deletes an existing Service Fabric service.

A service must be created before it can be deleted. By default, Service Fabric will try to close service replicas in a graceful manner and then delete the service. However, if the service is having issues closing the replica gracefully, the delete operation may take a long time or get stuck. Use the optional ForceRemove flag to skip the graceful close sequence and forcefully delete the service.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --force-remove | Remove a Service Fabric application or service forcefully without going through the graceful shutdown sequence. This parameter can be used to forcefully delete an application or service for which delete is timing out due to issues in the service code that prevents graceful close of replicas. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service deployed-type
Gets the information about a specified service type of the application deployed on a node in a Service Fabric cluster.

Gets the list containing the information about a specific service type from the applications deployed on a node in a Service Fabric cluster. The response includes the name of the service type, its registration status, the code package that registered it and activation ID of the service package. Each entry represents one activation of a service type, differentiated by the activation ID.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id    [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name         [Required] | The name of the node. |
| --service-type-name [Required] | Specifies the name of a Service Fabric service type. |
| --service-manifest-name | The name of the service manifest to filter the list of deployed service type information. If specified, the response will only contain the information about service types that are defined in this service manifest. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service deployed-type-list
Gets the list containing the information about service types from the applications deployed on a node in a Service Fabric cluster.

Gets the list containing the information about service types from the applications deployed on a node in a Service Fabric cluster. The response includes the name of the service type, its registration status, the code package that registered it and activation ID of the service package.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name      [Required] | The name of the node. |
| --service-manifest-name | The name of the service manifest to filter the list of deployed service type information. If specified, the response will only contain the information about service types that are defined in this service manifest. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service description
Gets the description of an existing Service Fabric service.

Gets the description of an existing Service Fabric service. A service must be created before its description can be obtained.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service get-container-logs
Gets the container logs for container deployed on a Service Fabric node.

Gets the container logs for container deployed on a Service Fabric node for the given code package.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id        [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --code-package-name     [Required] | The name of code package specified in service manifest registered as part of an application type in a Service Fabric cluster. |
| --node-name             [Required] | The name of the node. |
| --service-manifest-name [Required] | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --previous | Specifies whether to get container logs from exited/dead containers of the code package instance. |
| --tail | Number of lines to show from the end of the logs. Default is 100. 'all' to show the complete logs. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service health
Gets the health of the specified Service Fabric service.

Gets the health information of the specified service. Use EventsHealthStateFilter to filter the collection of health events reported on the service based on the health state. Use PartitionsHealthStateFilter to filter the collection of partitions returned. If you specify a service that does not exist in the health store, this request returns an error.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id          [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --exclude-health-statistics | Indicates whether the health statistics should be returned as part of the query result. False by default. The statistics show the number of children entities in health state Ok, Warning, and Error. |
| --partitions-health-state-filter | Allows filtering of the partitions health state objects returned in the result of service health query based on their health state. The possible values for this parameter include integer value of one of the following health states. Only partitions that match the filter are returned. All partitions are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these value obtained using bitwise 'OR' operator. For example, if the provided value is 6 then health state of partitions with HealthState value of OK (2) and Warning (4) will be returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service info
Gets the information about the specific service belonging to the Service Fabric application.

Returns the information about the specified service belonging to the specified Service Fabric application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
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

## sfctl service list
Gets the information about all services belonging to the application specified by the application ID.

Returns the information about all services belonging to the application specified by the application ID.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --service-type-name | The service type name used to filter the services to query for. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service manifest
Gets the manifest describing a service type.

Gets the manifest describing a service type. The response contains the service manifest XML as a string.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required] | The name of the application type. |
| --application-type-version [Required] | The version of the application type. |
| --service-manifest-name    [Required] | The name of a service manifest registered as part of an application type in a Service Fabric cluster. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service package-deploy
Downloads packages associated with specified service manifest to the image cache on specified node.

### Arguments

|Argument|Description|
| --- | --- |
| --app-type-name         [Required] | The name of the application manifest for the corresponding requested service manifest. |
| --app-type-version      [Required] | The version of the application manifest for the corresponding requested service manifest. |
| --node-name             [Required] | The name of the node. |
| --service-manifest-name [Required] | The name of service manifest associated with the packages that will be downloaded. |
| --share-policy | JSON encoded list of sharing policies. Each sharing policy element is composed of a 'name' and 'scope'. The name corresponds to the name of the code, configuration, or data package that is to be shared. The scope can be either 'None', 'All', 'Code', 'Config' or 'Data'. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service package-health
Gets the information about health of a service package for a specific application deployed for a Service Fabric node and application.

Gets the information about health of a service package for a specific application deployed on a Service Fabric node. Use EventsHealthStateFilter to optionally filter for the collection of HealthEvent objects reported on the deployed service package based on health state.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id       [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name            [Required] | The name of the node. |
| --service-package-name [Required] | The name of the service package. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service package-info
Gets the list of service packages deployed on a Service Fabric node matching exactly the specified name.

Returns the information about the service packages deployed on a Service Fabric node for the given application. These results are of service packages whose name match exactly the service package name specified as the parameter.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id       [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name            [Required] | The name of the node. |
| --service-package-name [Required] | The name of the service package. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service package-list
Gets the list of service packages deployed on a Service Fabric node.

Returns the information about the service packages deployed on a Service Fabric node for the given application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name      [Required] | The name of the node. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service recover
Indicates to the Service Fabric cluster that it should attempt to recover the specified service that is currently stuck in quorum loss.

Indicates to the Service Fabric cluster that it should attempt to recover the specified service that is currently stuck in quorum loss. This operation should only be performed if it is known that the replicas that are down cannot be recovered. Incorrect use of this API can cause potential data loss.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service report-health
Sends a health report on the Service Fabric service.

Reports health state of the specified Service Fabric service. The report must contain the information about the source of the health report and property on which it is reported. The report is sent to a Service Fabric gateway Service, which forwards to the health store. The report may be accepted by the gateway, but rejected by the health store after extra validation. For example, the health store may reject the report because of an invalid parameter, like a stale sequence number. To see whether the report was applied in the health store, check that the report appears in the health events of the service.

### Arguments

|Argument|Description|
| --- | --- |
| --health-property [Required] | The property of the health information. <br><br> An entity can have health reports for different properties. The property is a string and not a fixed enumeration to allow the reporter flexibility to categorize the state condition that triggers the report. For example, a reporter with SourceId "LocalWatchdog" can monitor the state of the available disk on a node, so it can report "AvailableDisk" property on that node. The same reporter can monitor the node connectivity, so it can report a property "Connectivity" on the same node. In the health store, these reports are treated as separate health events for the specified node. Together with the SourceId, the property uniquely identifies the health information. |
| --health-state    [Required] | Possible values include\: 'Invalid', 'Ok', 'Warning', 'Error', 'Unknown'. |
| --service-id      [Required] | The identity of the service. <br><br> This is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '\~' character. For example, if the service name is 'fabric\:/myapp/app1/svc1', the service identity would be 'myapp\~app1\~svc1' in 6.0+ and 'myapp/app1/svc1' in previous versions. |
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

## sfctl service resolve
Resolve a Service Fabric partition.

Resolve a Service Fabric service partition to get the endpoints of the service replicas.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --partition-key-type | Key type for the partition. This parameter is required if the partition scheme for the service is Int64Range or Named. The possible values are following. - None (1) - Indicates that the PartitionKeyValue parameter is not specified. This is valid for the partitions with partitioning scheme as Singleton. This is the default value. The value is 1. - Int64Range (2) - Indicates that the PartitionKeyValue parameter is an int64 partition key. This is valid for the partitions with partitioning scheme as Int64Range. The value is 2. - Named (3) - Indicates that the PartitionKeyValue parameter is a name of the partition. This is valid for the partitions with partitioning scheme as Named. The value is 3. |
| --partition-key-value | Partition key. This is required if the partition scheme for the service is Int64Range or Named. This is not the partition ID, but rather, either the integer key value, or the name of the partition ID. For example, if your service is using ranged partitions from 0 to 10, then they PartitionKeyValue would be an integer in that range. Query service description to see the range or name. |
| --previous-rsp-version | The value in the Version field of the response that was received previously. This is required if the user knows that the result that was gotten previously is stale. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service type-list
Gets the list containing the information about service types that are supported by a provisioned application type in a Service Fabric cluster.

Gets the list containing the information about service types that are supported by a provisioned application type in a Service Fabric cluster. The provided application type must exist. Otherwise, a 404 status is returned.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required] | The name of the application type. |
| --application-type-version [Required] | The version of the application type. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl service update
Updates the specified service using the given update description.

### Arguments

|Argument|Description|
| --- | --- |
| --service-id   [Required] | The identity of the service. This is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is 'fabric\:/myapp/app1/svc1', the service identity would be 'myapp\~app1\~svc1' in 6.0+ and 'myapp/app1/svc1' in previous versions. |
| --constraints | The placement constraints as a string. Placement constraints are boolean expressions on node properties and allow for restricting a service to particular nodes based on the service requirements. For example, to place a service on nodes where NodeType is blue specify the following\: "NodeColor == blue". |
| --correlated-service | Name of the target service to correlate with. |
| --correlation | Correlate the service with an existing service using an alignment affinity. |
| --instance-count | The instance count. This applies to stateless services only. |
| --load-metrics | JSON encoded list of metrics used when load balancing across nodes. |
| --min-replica-set-size | The minimum replica set size as a number. This applies to stateful services only. |
| --move-cost | Specifies the move cost for the service. Possible values are\: 'Zero', 'Low', 'Medium', 'High', 'VeryHigh'. |
| --placement-policy-list | JSON encoded list of placement policies for the service, and any associated domain names. Policies can be one or more of\: `NonPartiallyPlaceService`, `PreferPrimaryDomain`, `RequireDomain`, `RequireDomainDistribution`. |
| --quorum-loss-wait | The maximum duration, in seconds, for which a partition is allowed to be in a state of quorum loss. This applies to stateful services only. |
| --replica-restart-wait | The duration, in seconds, between when a replica goes down and when a new replica is created. This applies to stateful services only. |
| --scaling-policies | JSON encoded list of scaling policies for this service. |
| --service-placement-time | The duration for which replicas can stay InBuild before reporting that build is stuck. This applies to stateful services only. |
| --stand-by-replica-keep | The maximum duration, in seconds,  for which StandBy replicas will be maintained before being removed. This applies to stateful services only. |
| --stateful | Indicates the target service is a stateful service. |
| --stateless | Indicates the target service is a stateless service. |
| --target-replica-set-size | The target replica set size as a number. This applies to stateful services only. |
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
