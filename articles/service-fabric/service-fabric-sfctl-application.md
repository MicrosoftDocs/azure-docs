---
title: Azure Service Fabric CLI- sfctl application| Microsoft Docs
description: Describes the Service Fabric CLI sfctl application commands.
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

# sfctl application
Create, delete, and manage applications and application types.

## Commands

|Command|Description|
| --- | --- |
| create       | Creates a Service Fabric application using the specified description.|
| delete       | Deletes an existing Service Fabric application.|
| deployed     | Gets the information about an application deployed on a Service Fabric node.|
| deployed-health | Gets the information about health of an application deployed on a Service
                      Fabric node.|
| deployed-list| Gets the list of applications deployed on a Service Fabric node.|
| health       | Gets the health of the service fabric application.|
| info         | Gets information about a Service Fabric application.|
| list         | Gets the list of applications created in the Service Fabric cluster that match
                      filters specified as the parameter.|
| load | Gets load information about a Service Fabric application. |
| manifest     | Gets the manifest describing an application type.|
| provision    | Provisions or registers a Service Fabric application type with the cluster.|
| report-health| Sends a health report on the Service Fabric application.|
| type         | Gets the list of application types in the Service Fabric cluster matching
                      exactly the specified name.|
| type-list    | Gets the list of application types in the Service Fabric cluster.|
| unprovision  | Removes or unregisters a Service Fabric application type from the cluster.|
| upgrade      | Starts upgrading an application in the Service Fabric cluster.|
| upgrade-resume  | Resumes upgrading an application in the Service Fabric cluster.|
| upgrade-rollback| Starts rolling back the currently on-going upgrade of an application in the
                      Service Fabric cluster.|
| upgrade-status  | Gets details for the latest upgrade performed on this application.|
| upload       | Copy a Service Fabric application package to the image store.|

## sfctl application create
Creates a Service Fabric application using the specified description.

### Arguments

|Argument|Description|
| --- | --- |
| --app-name    [Required]| The name of the application, including the 'fabric:' URI scheme.|
| --app-type    [Required]| The application type name found in the application manifest.|
| --app-version [Required]| The version of the application type as defined in the application     manifest.|
| --max-node-count     | The maximum number of nodes that Service Fabric reserves capacity     for this application. This does not mean that the services     of this application are placed on all of those nodes.|
| --metrics            | A JSON encoded list of application capacity metric descriptions. A     metric is defined as a name, associated with a set of capacities for     each node that the application exists on.|
| --min-node-count     | The minimum number of nodes that Service Fabric reserves capacity     for this application. This does not mean that the services     of this application are placed on all of those nodes.|
| --parameters         | A JSON encoded list of application parameter overrides to be applied     when creating the application.|
| --timeout -t         | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug              | Increase logging verbosity to show all debug logs.|
| --help -h            | Show this help message and exit.|
| --output -o          | Output format.  Allowed values: json, jsonc, table, tsv.  Default:     json.|
| --query              | JMESPath query string. See http://jmespath.org/ for more information     and examples.|
| --verbose            | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application delete
Deletes an existing Service Fabric application.

Deletes an existing Service Fabric application. An application must be created before it can be deleted. Deleting an application deletes all services that are part of that application. By default Service Fabric tries to close service replicas in a graceful manner and then delete the service. However if service is having issues closing the replica gracefully, the delete operation may take a long time or get stuck. Use the optional ForceRemove flag to skip the graceful close sequence and forcefully delete the application and all of its services.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of        the application without the 'fabric:' URI scheme. Starting from
                                 version 6.0, hierarchical names are delimited with the "~"
                                 character. For example, if the application name is
                                 "fabric://myapp/app1", the application identity would be
                                 "myapp~app1" in 6.0+ and "myapp/app1" in previous versions.|
| --force-remove          | Remove a Service Fabric application or service forcefully without        going through the graceful shutdown sequence. This parameter can be        used to forcefully delete an application or service for which        delete is timing out due to issues in the service code that        prevents graceful close of replicas.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:        json.|
| --query                 | JMESPath query string. See http://jmespath.org/ for more        information and examples.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application deployed
Gets the information about an application deployed on a Service Fabric node.|
|     
### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of        the application without the 'fabric:' URI scheme. Starting from
                                 version 6.0, hierarchical names are delimited with the "~"
                                 character. For example, if the application name is
                                 "fabric://myapp/app1", the application identity would be
                                 "myapp~app1" in 6.0+ and "myapp/app1" in previous versions.|
| --node-name      [Required]| The name of the node.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:        json.|
| --query                 | JMESPath query string. See http://jmespath.org/ for more        information and examples.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application health
Gets the health of the service fabric application.

Returns the heath state of the service fabric application. The response reports either Ok, Error or Warning health state. If the entity is not found in the health store, it returns Error.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id                 [Required]| The identity of the application. This is typically                        the full name of the application without the                        'fabric:' URI scheme. Starting from version 6.0,
                                                 hierarchical names are delimited with the "~"
                                                 character. For example, if the application name is
                                                 "fabric://myapp/app1", the application identity
                                                 would be "myapp~app1" in 6.0+ and "myapp/app1" in
                                                 previous versions.|
| --deployed-applications-health-state-filter| Allows filtering of the deployed applications                        health state objects returned in the result of                        application health query based on their health                        state. The possible values for this parameter                        include integer value of one of the following                        health states. Only deployed applications that                        match the filter will be returned. All deployed                        applications are used to evaluate the aggregated                        health state. If not specified, all entries are                        returned. The state values are flag-based                        enumeration, so the value could be a combination of                        these values obtained using bitwise 'OR' operator.                        For example, if the provided value is 6 then health                        state of deployed applications with HealthState                        value of OK (2) and Warning (4) are returned. -                        Default - Default value. Matches any HealthState.                        The value is zero. - None - Filter that doesn't                        match any HealthState value. Used in order to                        return no results on a given collection of states.                        The value is 1. - Ok - Filter that matches input                        with HealthState value Ok. The value is 2. -                        Warning - Filter that matches input with                        HealthState value Warning. The value is 4. - Error                        - Filter that matches input with HealthState value                        Error. The value is 8. - All - Filter that matches                        input with any HealthState value. The value is                        65535.|
| --events-health-state-filter            | Allows filtering the collection of HealthEvent                        objects returned based on health state. The                        possible values for this parameter include integer                        value of one of the following health states. Only                        events that match the filter are returned. All                        events are used to evaluate the aggregated health                        state. If not specified, all entries are returned.                        The state values are flag-based enumeration, so the                        value could be a combination of these values                        obtained using bitwise 'OR' operator. For example,                        If the provided value is 6 then all of the events                        with HealthState value of OK (2) and Warning (4)                        are returned. - Default - Default value. Matches                        any HealthState. The value is zero. - None - Filter                        that doesn’t match any HealthState value. Used in                        order to return no results on a given collection of                        states. The value is 1. - Ok - Filter that matches                        input with HealthState value Ok. The value is 2. -                        Warning - Filter that matches input with                        HealthState value Warning. The value is 4. - Error                        - Filter that matches input with HealthState value                        Error. The value is 8. - All - Filter that matches                        input with any HealthState value. The value is                        65535.|
| --exclude-health-statistics | Indicates whether the health statistics should be
                                                 returned as part of the query result. False by
                                                 default. The statistics show the number of children
                                                 entities in health state Ok, Warning, and Error.|
| --services-health-state-filter          | Allows filtering of the services health state                        objects returned in the result of services health                        query based on their health state. The possible                        values for this parameter include integer value of                        one of the following health states. Only services                        that match the filter are returned. All services                        are used to evaluate the aggregated health state.                        If not specified, all entries are returned. The                        state values are flag-based enumeration, so the                        value could be a combination of these values                        obtained using bitwise 'OR' operator. For example,                        if the provided value is 6 then health state of                        services with HealthState value of OK (2) and                        Warning (4) will be returned. - Default - Default                        value. Matches any HealthState. The value is zero.                        - None - Filter that doesn't match any HealthState                        value. Used in order to return no results on a                        given collection of states. The value is 1. - Ok -                        Filter that matches input with HealthState value                        Ok. The value is 2. - Warning - Filter that matches                        input with HealthState value Warning. The value is                        4. - Error - Filter that matches input with                        HealthState value Error. The value is 8. - All -                        Filter that matches input with any HealthState                        value. The value is 65535.|
| --timeout -t                            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                                 | Increase logging verbosity to show all debug logs.|
| --help -h                               | Show this help message and exit.|
| --output -o                             | Output format.  Allowed values: json, jsonc, table,                        tsv.  Default: json.|
| --query                                 | JMESPath query string. See http://jmespath.org/ for                        more information and examples.|
| --verbose                               | Increase logging verbosity. Use --debug for full                        debug logs.|

## sfctl application info
Gets information about a Service Fabric application.

Returns the information about the application that was created or in the process of being created in the Service Fabric cluster and whose name matches the one specified as the parameter. The response includes the name, type, status, parameters, and other details about the application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id      [Required]| The identity of the application. This is typically the full             name of the application without the 'fabric:' URI scheme. Starting from version 6.0, hierarchical names are delimited
                                      with the "~" character. For example, if the application name
                                      is "fabric://myapp/app1", the application identity would be
                                      "myapp~app1" in 6.0+ and "myapp/app1" in previous versions.|
| --exclude-application-parameters| The flag that specifies whether application parameters will be             excluded from the result.|
| --timeout -t                 | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                      | Increase logging verbosity to show all debug logs.|
| --help -h                    | Show this help message and exit.|
| --output -o                  | Output format.  Allowed values: json, jsonc, table, tsv.             Default: json.|
| --query                      | JMESPath query string. See http://jmespath.org/ for more             information and examples.|
| --verbose                    | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application list
Gets the list of applications created in the Service Fabric cluster that
    match filters specified as the parameter.

Gets the information about the applications that were created or in the process of being created in the Service Fabric cluster and match filters specified as the parameter. The response includes the name, type, status, parameters, and other details about the application. If the applications do not fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page.

### Arguments

|Argument|Description|
| --- | --- |
|--application-definition-kind-filter| Used to filter on ApplicationDefinitionKind for
                                          application query operations. - Default - Default value.
                                          Filter that matches input with any
                                          ApplicationDefinitionKind value. The value is 0. - All -
                                          Filter that matches input with any
                                          ApplicationDefinitionKind value. The value is 65535. -
                                          ServiceFabricApplicationDescription - Filter that matches
                                          input with ApplicationDefinitionKind value
                                          ServiceFabricApplicationDescription. The value is 1. -
                                          Compose - Filter that matches input with
                                          ApplicationDefinitionKind value Compose. The value is 2.
                                          Default: 65535.|
| --application-type-name      | The application type name used to filter the applications to             query for. This value should not contain the application type             version.|
| --continuation-token         | The continuation token parameter is used to obtain next set of             results. A continuation token with a non empty value is             included in the response of the API when the results from the             system do not fit in a single response. When this value is             passed to the next API call, the API returns next set of             results. If there are no further results, then the continuation             token does not contain a value. The value of this parameter             should not be URL encoded.|
| --exclude-application-parameters| The flag that specifies whether application parameters are             excluded from the result.|
| --timeout -t                 | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                      | Increase logging verbosity to show all debug logs.|
| --help -h                    | Show this help message and exit.|
| --output -o                  | Output format.  Allowed values: json, jsonc, table, tsv.             Default: json.|
| --query                      | JMESPath query string. See http://jmespath.org/ for more             information and examples.|
| --verbose                    | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application load
Gets load information about a Service Fabric application.

        Returns the load information about the application that was created or in the process of
        being created in the Service Fabric cluster and whose name matches the one specified as the
        parameter. The response includes the name, minimum nodes, maximum nodes, the number of nodes
        the app is occupying currently, and application load metric information about the
        application.

### Arguments
|Argument|Description|
| --- | --- |
|--application-id [Required]| The identity of the application. This is typically the full name of
                                 the application without the 'fabric:' URI scheme. Starting from
                                 version 6.0, hierarchical names are delimited with the "~"
                                 character. For example, if the application name is
                                 "fabric://myapp/app1", the application identity would be
                                 "myapp~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --timeout -t               | Server timeout in seconds.  Default: 60.|

### Global Arguments
|Argument|Description|
| --- | --- |
|--debug                    | Increase logging verbosity to show all debug logs.|
    --help -h                  | Show this help message and exit.|
    --output -o                | Output format.  Allowed values: json, jsonc, table, tsv.  Default:
                                 json.|
    --query                    | JMESPath query string. See http://jmespath.org/ for more
                                 information and examples.|
    --verbose                  | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application manifest
Gets the manifest describing an application type.
        
Gets the manifest describing an application type. The response contains the application manifest XML as a string.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required]| The name of the application type.|
| --application-type-version [Required]| The version of the application type.|
| --timeout -t                      | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                           | Increase logging verbosity to show all debug logs.|
| --help -h                         | Show this help message and exit.|
| --output -o                       | Output format.  Allowed values: json, jsonc, table, tsv.                  Default: json.|
| --query                           | JMESPath query string. See http://jmespath.org/ for more                  information and examples.|
| --verbose                         | Increase logging verbosity. Use --debug for full debug                  logs.|

## sfctl application provision
Provisions or registers a Service Fabric application type with the cluster.
        
Provisions or registers a Service Fabric application type with the cluster. This is required before any new applications can be instantiated.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-build-path [Required]| The relative image store path to the application                     package.|
| --timeout -t                         | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                              | Increase logging verbosity to show all debug logs.|
| --help -h                            | Show this help message and exit.|
| --output -o                          | Output format.  Allowed values: json, jsonc, table,                     tsv.  Default: json.|
| --query                              | JMESPath query string. See http://jmespath.org/ for                     more information and examples.|
| --verbose                            | Increase logging verbosity. Use --debug for full debug                     logs.|

## sfctl application type

Gets the list of application types in the Service Fabric cluster matching exactly the specified name.

Returns the information about the application types that are provisioned or in the process of being provisioned in the Service Fabric cluster. These results are of application types whose name match exactly the one specified as the parameter, and which comply with the given query parameters. All versions of the application type matching the application type name are returned, with each version returned as one application type. The response includes the name, version, status, and other details about the application type. This is a paged query, meaning that if not all of the application types fit in a page, one page of results is returned as well as a continuation token, which can be used to get the next page. For example, if there are 10 application types but a page only fits the first 3 application types, or if max results is set to 3, then 3 is returned. To access the rest of the results, retrieve subsequent pages by using the returned continuation token in the next query. An empty continuation token is returned if there are no subsequent pages.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name [Required]| The name of the application type.|
| --continuation-token           | The continuation token parameter is used to obtain next set               of results. A continuation token with a non empty value is               included in the response of the API when the results from               the system do not fit in a single response. When this value               is passed to the next API call, the API returns next set of               results. If there are no further results, then the               continuation token does not contain a value. The value of               this parameter should not be URL encoded.|
| --exclude-application-parameters  | The flag that specifies whether application parameters will               be excluded from the result.|
| --max-results                  | The maximum number of results to be returned as part of the               paged queries. This parameter defines the upper bound on the               number of results returned. The results returned can be less               than the specified maximum results if they do not fit in the               message as per the max message size restrictions defined in               the configuration. If this parameter is zero or not               specified, the paged query includes as much results as               possible that fit in the return message.|
| --timeout -t                   | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                        | Increase logging verbosity to show all debug logs.|
| --help -h                      | Show this help message and exit.|
| --output -o                    | Output format.  Allowed values: json, jsonc, table, tsv.               Default: json.|
| --query                        | JMESPath query string. See http://jmespath.org/ for more               information and examples.|
| --verbose                      | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application unprovision
Removes or unregisters a Service Fabric application type from the cluster.

Removes or unregisters a Service Fabric application type from the cluster. This operation can only be performed if all application instance of the application type has been deleted. Once the application type is unregistered, no new application instance can be created for this particular application type.

### Arguments

|Argument|Description|
| --- | --- |
| --application-type-name    [Required]| The name of the application type.|
| --application-type-version [Required]| The application type version.|
| --timeout -t                      | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                           | Increase logging verbosity to show all debug logs.|
| --help -h                         | Show this help message and exit.|
| --output -o                       | Output format.  Allowed values: json, jsonc, table, tsv.                  Default: json.|
| --query                           | JMESPath query string. See http://jmespath.org/ for more                  information and examples.|
| --verbose                         | Increase logging verbosity. Use --debug for full debug                  logs.|

## sfctl application upgrade
Starts upgrading an application in the Service Fabric cluster.

Validates the supplied application upgrade parameters and starts upgrading the application if the parameters are valid. Please note that upgrade description replaces the existing application description. This means that if the parameters are not specified, the existing parameters on the applications will be overwritten with the empty parameters list. This results in application using the default value of the parameters from the application manifest.

### Arguments

|Argument|Description|
| --- | --- |
| --app-id             [Required]| The identity of the application. This is typically the full            name of the application without the 'fabric:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the '~' character. For
        example, if the application name is 'fabric://myapp/app1', the application identity would be
        'myapp~app1' in 6.0+ and 'myapp/app1' in previous versions.|
| --app-version        [Required]| Target application version.|
| --parameters         [Required]| A JSON encoded list of application parameter overrides to be            applied when upgrading the application.|
| --default-service-health-policy| JSON encoded specification of the health policy used by default            to evaluate the health of a service type.|
| --failure-action            | The action to perform when a Monitored upgrade encounters            monitoring policy or health policy violations.|
| --force-restart             | Forcefully restart processes during upgrade even when the code            version has not changed.|
| --health-check-retry-timeout| The amount of time to retry health evaluations when the            application or cluster is unhealthy before the failure action            is executed. Measured in milliseconds.  Default: PT0H10M0S.|
| --health-check-stable-duration | The amount of time that the application or cluster must remain            healthy before the upgrade proceeds to the next upgrade domain.            Measured in milliseconds.  Default: PT0H2M0S.|
| --health-check-wait-duration| The amount of time to wait after completing an upgrade domain            before applying health policies. Measured in milliseconds.            Default: 0.|
| --max-unhealthy-apps        | The maximum allowed percentage of unhealthy deployed            applications. Represented as a number between 0 and 100.|
| --mode                      | The mode used to monitor health during a rolling upgrade.            Default: UnmonitoredAuto.|
| --replica-set-check-timeout | The maximum amount of time to block processing of an upgrade            domain and prevent loss of availability when there are            unexpected issues. Measured in seconds.|
| --service-health-policy     | JSON encoded map with service type health policy per service            type name. The map is empty be default.|
| --timeout -t                | Server timeout in seconds.  Default: 60.|
| --upgrade-domain-timeout    | The amount of time each upgrade domain has to complete before            FailureAction is executed. Measured in milliseconds.  Default:            P10675199DT02H48M05.4775807S.|
| --upgrade-timeout           | The amount of time the overall upgrade has to complete before            FailureAction is executed. Measured in milliseconds.  Default:            P10675199DT02H48M05.4775807S.|
| --warning-as-error          | Treat health evaluation warnings with the same severity as            errors.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                     | Increase logging verbosity to show all debug logs.|
| --help -h                   | Show this help message and exit.|
| --output -o                 | Output format.  Allowed values: json, jsonc, table, tsv.            Default: json.|
| --query                     | JMESPath query string. See http://jmespath.org/ for more            information and examples.|
| --verbose                   | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl application upload
Copy a Service Fabric application package to the image store.

Optionally display upload progress for each file in the package. Upload progress is sent to `stderr`.

### Arguments

|Argument|Description|
| --- | --- |
| --path [Required]| Path to local application package.|
|--imagestore-string| Destination image store to upload the application package to.  Default:
                         fabric:ImageStore.|
| --show-progress  | Show file upload progress for large packages.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug       | Increase logging verbosity to show all debug logs.|
| --help -h     | Show this help message and exit.|
| --output -o   | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query       | JMESPath query string. See http://jmespath.org/ for more information and
                       examples.|
| --verbose     | Increase logging verbosity. Use --debug for full debug logs.|

## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).