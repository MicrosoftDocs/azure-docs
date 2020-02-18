---
title: Azure Service Fabric CLI- sfctl application
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing applications.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---
# sfctl application
Create, delete, and manage applications and application types.

## Commands

|Command|Description|
| --- | --- |
| create | Creates a Service Fabric application using the specified description. |
| delete | Deletes an existing Service Fabric application. |
| deployed | Gets the information about an application deployed on a Service Fabric node. |
| deployed-health | Gets the information about health of an application deployed on a Service Fabric node. |
| deployed-list | Gets the list of applications deployed on a Service Fabric node. |
| health | Gets the health of the service fabric application. |
| info | Gets information about a Service Fabric application. |
| list | Gets the list of applications created in the Service Fabric cluster that match the specified filters. |
| load | Gets load information about a Service Fabric application. |
| manifest | Gets the manifest describing an application type. |
| provision | Provisions or registers a Service Fabric application type with the cluster using the '.sfpkg' package in the external store or using the application package in the image store. |
| report-health | Sends a health report on the Service Fabric application. |
| type | Gets the list of application types in the Service Fabric cluster matching exactly the specified name. |
| type-list | Gets the list of application types in the Service Fabric cluster. |
| unprovision | Removes or unregisters a Service Fabric application type from the cluster. |
| upgrade | Starts upgrading an application in the Service Fabric cluster. |
| upgrade-resume | Resumes upgrading an application in the Service Fabric cluster. |
| upgrade-rollback | Starts rolling back the currently on-going upgrade of an application in the Service Fabric cluster. |
| upgrade-status | Gets details for the latest upgrade performed on this application. |
| upload | Copy a Service Fabric application package to the image store. |

## sfctl application create
Creates a Service Fabric application using the specified description.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name    [Required] | The name of the application, including the 'fabric\:' URI scheme. |
| --app-type    [Required] | The application type name found in the application manifest. |
| --app-version [Required] | The version of the application type as defined in the application manifest. |
| --max-node-count | The maximum number of nodes where Service Fabric will reserve capacity for this application. Note that this does not mean that the services of this application will be placed on all of those nodes. |
| --metrics | A JSON encoded list of application capacity metric descriptions. A metric is defined as a name, associated with a set of capacities for each node that the application exists on. |
| --min-node-count | The minimum number of nodes where Service Fabric will reserve capacity for this application. Note that this does not mean that the services of this application will be placed on all of those nodes. |
| --parameters | A JSON encoded list of application parameter overrides to be applied when creating the application. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application delete
Deletes an existing Service Fabric application.

An application must be created before it can be deleted. Deleting an application will delete all services that are part of that application. By default, Service Fabric will try to close service replicas in a graceful manner and then delete the service. However, if a service is having issues closing the replica gracefully, the delete operation may take a long time or get stuck. Use the optional ForceRemove flag to skip the graceful close sequence and forcefully delete the application and all of its services.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
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

## sfctl application deployed
Gets the information about an application deployed on a Service Fabric node.

This query returns system application information if the application ID provided is for system application. Results encompass deployed applications in active, activating, and downloading states. This query requires that the node name corresponds to a node on the cluster. The query fails if the provided node name does not point to any active Service Fabric nodes on the cluster.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name      [Required] | The name of the node. |
| --include-health-state | Include the health state of an entity. If this parameter is false or not specified, then the health state returned is "Unknown". When set to true, the query goes in parallel to the node and the health system service before the results are merged. As a result, the query is more expensive and may take a longer time. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application deployed-health
Gets the information about health of an application deployed on a Service Fabric node.

Gets the information about health of an application deployed on a Service Fabric node. Use EventsHealthStateFilter to optionally filter for the collection of HealthEvent objects reported on the deployed application based on health state. Use DeployedServicePackagesHealthStateFilter to optionally filter for DeployedServicePackageHealth children based on health state.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id                     [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --node-name                          [Required] | The name of the node. |
| --deployed-service-packages-health-state-filter | Allows filtering of the deployed service package health state objects returned in the result of deployed application health query based on their health state. The possible values for this parameter include integer value of one of the following health states. Only deployed service packages that match the filter are returned. All deployed service packages are used to evaluate the aggregated health state of the deployed application. If not specified, all entries are returned. The state values are flag-based enumeration, so the value can be a combination of these values, obtained using the bitwise 'OR' operator. For example, if the provided value is 6 then health state of service packages with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --exclude-health-statistics | Indicates whether the health statistics should be returned as part of the query result. False by default. The statistics show the number of children entities in health state Ok, Warning, and Error. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application deployed-list
Gets the list of applications deployed on a Service Fabric node.

Gets the list of applications deployed on a Service Fabric node. The results do not include information about deployed system applications unless explicitly queried for by ID. Results encompass deployed applications in active, activating, and downloading states. This query requires that the node name corresponds to a node on the cluster. The query fails if the provided node name does not point to any active Service Fabric nodes on the cluster.

### Arguments

|Argument|Description|
| --- | --- |
| --node-name [Required] | The name of the node. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --include-health-state | Include the health state of an entity. If this parameter is false or not specified, then the health state returned is "Unknown". When set to true, the query goes in parallel to the node and the health system service before the results are merged. As a result, the query is more expensive and may take a longer time. |
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

## sfctl application health
Gets the health of the service fabric application.

Returns the heath state of the service fabric application. The response reports either Ok, Error or Warning health state. If the entity is not found in the health store, it will return Error.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id                 [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --deployed-applications-health-state-filter | Allows filtering of the deployed applications health state objects returned in the result of application health query based on their health state. The possible values for this parameter include integer value of one of the following health states. Only deployed applications that match the filter will be returned. All deployed applications are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using bitwise 'OR' operator. For example, if the provided value is 6 then health state of deployed applications with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --exclude-health-statistics | Indicates whether the health statistics should be returned as part of the query result. False by default. The statistics show the number of children entities in health state Ok, Warning, and Error. |
| --services-health-state-filter | Allows filtering of the services health state objects returned in the result of services health query based on their health state. The possible values for this parameter include integer value of one of the following health states. Only services that match the filter are returned. All services are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using bitwise 'OR' operator. For example, if the provided value is 6 then health state of services with HealthState value of OK (2) and Warning (4) will be returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application info
Gets information about a Service Fabric application.

Returns the information about the application that was created or in the process of being created in the Service Fabric cluster and whose name matches the one specified as the parameter. The response includes the name, type, status, parameters, and other details about the application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id      [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --exclude-application-parameters | The flag that specifies whether application parameters will be excluded from the result. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application list
Gets the list of applications created in the Service Fabric cluster that match the specified filters.

Gets the information about the applications that were created or in the process of being created in the Service Fabric cluster and match the specified filters. The response includes the name, type, status, parameters, and other details about the application. If the applications do not fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page. Filters ApplicationTypeName and ApplicationDefinitionKindFilter cannot be specified at the same time.

### Arguments

|Argument|Description|
| --- | --- |
| --application-definition-kind-filter | Used to filter on ApplicationDefinitionKind, which is the mechanism used to define a Service Fabric application.  <br> - Default - Default value, which performs the same function as selecting "All". The value is 0.  <br> - All - Filter that matches input with any ApplicationDefinitionKind value. The value is 65535.  <br> - ServiceFabricApplicationDescription - Filter that matches input with ApplicationDefinitionKind value ServiceFabricApplicationDescription. The value is 1.  <br> - Compose - Filter that matches input with ApplicationDefinitionKind value Compose. The value is 2. |
| --application-type-name | The application type name used to filter the applications to query for. This value should not contain the application type version. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --exclude-application-parameters | The flag that specifies whether application parameters will be excluded from the result. |
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

## sfctl application load
Gets load information about a Service Fabric application.

Returns the load information about the application that was created or in the process of being created in the Service Fabric cluster and whose name matches the one specified as the parameter. The response includes the name, minimum nodes, maximum nodes, the number of nodes the application is occupying currently, and application load metric information about the application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application manifest
Gets the manifest describing an application type.

The response contains the application manifest XML as a string.

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

## sfctl application provision
Provisions or registers a Service Fabric application type with the cluster using the '.sfpkg' package in the external store or using the application package in the image store.

Provisions a Service Fabric application type with the cluster. The provision is required before any new applications can be instantiated. The provision operation can be performed either on the application package specified by the relativePathInImageStore, or by using the URI of the external '.sfpkg'. Unless --external-provision is set, this command will expect image store provision.

### Arguments

|Argument|Description|
| --- | --- |
| --application-package-download-uri | The path to the '.sfpkg' application package from where the application package can be downloaded using HTTP or HTTPS protocols. <br><br> For provision kind external store only. The application package can be stored in an external store that provides GET operation to download the file. Supported protocols are HTTP and HTTPS, and the path must allow READ access. |
| --application-type-build-path | For provision kind image store only. The relative path for the application package in the image store specified during the prior upload operation. |
| --application-type-name | For provision kind external store only. The application type name represents the name of the application type found in the application manifest. |
| --application-type-version | For provision kind external store only. The application type version represents the version of the application type found in the application manifest. |
| --external-provision | The location from where application package can be registered or provisioned. Indicates that the provision is for an application package that was previously uploaded to an external store. The application package ends with the extension *.sfpkg. |
| --no-wait | Indicates whether or not provisioning should occur asynchronously. <br><br> When set to true, the provision operation returns when the request is accepted by the system, and the provision operation continues without any timeout limit. The default value is false. For large application packages, we recommend setting the value to true. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application report-health
Sends a health report on the Service Fabric application.

Reports health state of the specified Service Fabric application. The report must contain the information about the source of the health report and property on which it is reported. The report is sent to a Service Fabric gateway Application, which forwards to the health store. The report may be accepted by the gateway, but rejected by the health store after extra validation. For example, the health store may reject the report because of an invalid parameter, like a stale sequence number. To see whether the report was applied in the health store, get application health and check that the report appears.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id  [Required] | The identity of the application. <br><br> This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '\~' character. For example, if the application name is 'fabric\:/myapp/app1', the application identity would be 'myapp\~app1' in 6.0+ and 'myapp/app1' in previous versions. |
| --health-property [Required] | The property of the health information. <br><br> An entity can have health reports for different properties. The property is a string and not a fixed enumeration to allow the reporter flexibility to categorize the state condition that triggers the report. For example, a reporter with SourceId "LocalWatchdog" can monitor the state of the available disk on a node, so it can report "AvailableDisk" property on that node. The same reporter can monitor the node connectivity, so it can report a property "Connectivity" on the same node. In the health store, these reports are treated as separate health events for the specified node. Together with the SourceId, the property uniquely identifies the health information. |
| --health-state    [Required] | Possible values include\: 'Invalid', 'Ok', 'Warning', 'Error', 'Unknown'. |
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

## sfctl application type
Gets the list of application types in the Service Fabric cluster matching exactly the specified name.

Returns the information about the application types that are provisioned or in the process of being provisioned in the Service Fabric cluster. These results are of application types whose name match exactly the one specified as the parameter, and which comply with the given query parameters. All versions of the application type matching the application type name are returned, with each version returned as one application type. The response includes the name, version, status, and other details about the application type. This is a paged query, meaning that if not all of the application types fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page. For example, if there are 10 application types but a page only fits the first three application types, or if max results is set to 3, then three is returned. To access the rest of the results, retrieve subsequent pages by using the returned continuation token in the next query. An empty continuation token is returned if there are no subsequent pages.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name [Required] | The name of the application type. |
| --application-type-version | The version of the application type. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --exclude-application-parameters | The flag that specifies whether application parameters will be excluded from the result. |
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

## sfctl application type-list
Gets the list of application types in the Service Fabric cluster.

Returns the information about the application types that are provisioned or in the process of being provisioned in the Service Fabric cluster. Each version of an application type is returned as one application type. The response includes the name, version, status, and other details about the application type. This is a paged query, meaning that if not all of the application types fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page. For example, if there are 10 application types but a page only fits the first three application types, or if max results is set to 3, then three is returned. To access the rest of the results, retrieve subsequent pages by using the returned continuation token in the next query. An empty continuation token is returned if there are no subsequent pages.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-definition-kind-filter | Used to filter on ApplicationTypeDefinitionKind which is the mechanism used to define a Service Fabric application type.  <br> - Default - Default value, which performs the same function as selecting "All". The value is 0.  <br> - All - Filter that matches input with any ApplicationTypeDefinitionKind value. The value is 65535.  <br> - ServiceFabricApplicationPackage - Filter that matches input with ApplicationTypeDefinitionKind value ServiceFabricApplicationPackage. The value is 1.  <br> - Compose - Filter that matches input with ApplicationTypeDefinitionKind value Compose. The value is 2. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --exclude-application-parameters | The flag that specifies whether application parameters will be excluded from the result. |
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

## sfctl application unprovision
Removes or unregisters a Service Fabric application type from the cluster.

This operation can only be performed if all application instances of the application type have been deleted. Once the application type is unregistered, no new application instances can be created for this particular application type.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required] | The name of the application type. |
| --application-type-version [Required] | The version of the application type as defined in the application manifest. |
| --async-parameter | The flag indicating whether or not unprovision should occur asynchronously. When set to true, the unprovision operation returns when the request is accepted by the system, and the unprovision operation continues without any timeout limit. The default value is false. However, we recommend setting it to true for large application packages that were provisioned. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application upgrade
Starts upgrading an application in the Service Fabric cluster.

Validates the supplied application upgrade parameters and starts upgrading the application if the parameters are valid. Note that upgrade description replaces the existing application description. This means that if the parameters are not specified, the existing parameters on the applications will be overwritten with the empty parameters list. This would result in the application using the default value of the parameters from the application manifest.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id      [Required] | The identity of the application. <br><br> This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --application-version [Required] | The target application type version (found in the application manifest) for the application upgrade. |
| --parameters          [Required] | A JSON encoded list of application parameter overrides to be applied when upgrading the application. |
| --default-service-health-policy | JSON encoded specification of the health policy used by default to evaluate the health of a service type. |
| --failure-action | The action to perform when a Monitored upgrade encounters monitoring policy or health policy violations. |
| --force-restart | Forcefully restart processes during upgrade even when the code version has not changed. |
| --health-check-retry-timeout | The length of time between attempts to perform health checks if the application or cluster is not healthy.  Default\: PT0H10M0S. |
| --health-check-stable-duration | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain.  Default\: PT0H2M0S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --health-check-wait-duration | The length of time to wait after completing an upgrade domain before starting the health checks process.  Default\: 0. |
| --max-unhealthy-apps | The maximum allowed percentage of unhealthy deployed applications. Represented as a number between 0 and 100. |
| --mode | The mode used to monitor health during a rolling upgrade.  Default\: UnmonitoredAuto. |
| --replica-set-check-timeout | The maximum amount of time to block processing of an upgrade domain and prevent loss of availability when there are unexpected issues. Measured in seconds. |
| --service-health-policy | JSON encoded map with service type health policy per service type name. The map is empty be default. |
| --timeout -t | Default\: 60. |
| --upgrade-domain-timeout | The amount of time each upgrade domain has to complete before FailureAction is executed.  Default\: P10675199DT02H48M05.4775807S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --upgrade-timeout | The amount of time the overall upgrade has to complete before FailureAction is executed.  Default\: P10675199DT02H48M05.4775807S. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --warning-as-error | Indicates whether warnings are treated with the same severity as errors. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application upgrade-resume
Resumes upgrading an application in the Service Fabric cluster.

Resumes an unmonitored manual Service Fabric application upgrade. Service Fabric upgrades one upgrade domain at a time. For unmonitored manual upgrades, after Service Fabric finishes an upgrade domain, it waits for you to call this API before proceeding to the next upgrade domain.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id      [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --upgrade-domain-name [Required] | The name of the upgrade domain in which to resume the upgrade. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application upgrade-rollback
Starts rolling back the currently on-going upgrade of an application in the Service Fabric cluster.

Starts rolling back the current application upgrade to the previous version. This API can only be used to roll back the current in-progress upgrade that is rolling forward to new version. If the application is not currently being upgraded use StartApplicationUpgrade API to upgrade it to desired version, including rolling back to a previous version.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application upgrade-status
Gets details for the latest upgrade performed on this application.

Returns information about the state of the latest application upgrade along with details to aid debugging application health issues.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl application upload
Copy a Service Fabric application package to the image store.

Optionally display upload progress for each file in the package. Upload progress is sent to `stderr`.

### Arguments

|Argument|Description|
| --- | --- |
| --path     [Required] | Path to local application package. |
| --compress | Applicable only to Service Fabric application packages. Create a new folder containing the compressed application package to either the default location, or to the location specified by the compressed-location parameter, and then upload the newly created folder. <br><br> If there is already a compressed file generated by sfctl, it will be overwritten if this flag is set. An error will be returned if the directory is not an application package. If it is already a compressed application package, the folder will be copied over as is. By default, the newly created compressed application package will be deleted after a successful upload. If upload is not successful, please manually clean up the compressed package as needed. The deletion does not remove any empty dirs which may have been created if the compressed location parameter references non-existent directories. |
| --compressed-location | The location to put the compressed application package. <br><br> If no location is provided, the compressed package will be placed under a newly created folder called sfctl_compressed_temp under the parent directory specified in the path argument. For example, if the path argument has value C\:/FolderA/AppPkg, then the compressed package will be added to C\:/FolderA/sfctl_compressed_temp/AppPkg. |
| --imagestore-string | Destination image store to upload the application package to.  Default\: fabric\:ImageStore. <br><br> To upload to a file location, start this parameter with 'file\:'. Otherwise the value should be the image store connection string, such as the default value. |
| --keep-compressed | Whether or not to keep the generated compressed package on successful upload completion. <br><br> If not set, then on successful completion, the compressed app packages will be deleted. If upload was not successful, then the application package will always be kept in the output directory for re-upload. |
| --show-progress | Show file upload progress for large packages. |
| --timeout -t | The total timeout in seconds. Upload will fail and return error after the upload timeout duration has passed. This timeout applies to the entire application package, and individual file timeouts will equal the remaining timeout duration. Timeout does not include the time required to compress the application package.  Default\: 300. |

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
