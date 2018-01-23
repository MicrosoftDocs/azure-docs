---
title: Azure Service Fabric CLI- sfctl cluster | Microsoft Docs
description: Describes the Service Fabric CLI sfctl cluster commands.
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
# sfctl cluster
Select, manage, and operate Service Fabric clusters.

## Commands

|Command|Description|
| --- | --- |
|    code-versions| Gets a list of fabric code versions that are provisioned in a Service Fabric  cluster.|
|    config-versions | Gets a list of fabric config versions that are provisioned in a Service Fabric  cluster.|
|    health       | Gets the health of a Service Fabric cluster.|
|    manifest     | Get the Service Fabric cluster manifest.|
|    operation-cancel| Cancels a user-induced fault operation.|
|    operationgit | Gets a list of user-induced fault operations filtered by provided input.|
|    provision     | Provision the code or configuration packages of a Service Fabric cluster.|
|    recover-system  | Indicates to the Service Fabric cluster that it should attempt to recover the  system services which are currently stuck in quorum loss.|
|report-health   | Sends a health report on the Service Fabric cluster.|
|    select       | Connects to a Service Fabric cluster endpoint.|
| unprovision     | Unprovision the code or configuration packages of a Service Fabric cluster.|
|    upgrade         | Start upgrading the code or configuration version of a Service Fabric cluster.|
|    upgrade-resume  | Make the cluster upgrade move on to the next upgrade domain.|
|    upgrade-rollback| Roll back the upgrade of a Service Fabric cluster.|
|    upgrade-status  | Gets the progress of the current cluster upgrade.|
|upgrade-update  | Update the upgrade parameters of a Service Fabric cluster upgrade.|


## sfctl cluster health
Gets the health of a Service Fabric cluster.

Gets the health of a Service Fabric cluster. Use EventsHealthStateFilter to filter the
        collection of health events reported on the cluster based on the health state. Similarly,
        use NodesHealthStateFilter and ApplicationsHealthStateFilter to filter the collection of
        nodes and applications returned based on their aggregated health state. 

### Arguments

|Argument|Description|
| --- | --- |
| --applications-health-state-filter| Allows filtering of the application health state
                                                    objects returned in the result of cluster health
                                                    query based on their health state. The possible
                                                    values for this parameter include integer value
                                                    obtained from members or bitwise operations on
                                                    members of HealthStateFilter enumeration. Only
                                                    applications that match the filter are returned.
                                                    All applications are used to evaluate the
                                                    aggregated health state. If not specified, all
                                                    entries are returned. The state values are flag
                                                    based enumeration, so the value could be a
                                                    combination of these values obtained using
                                                    bitwise 'OR' operator. For example, if the
                                                    provided value is 6 then health state of
                                                    applications with HealthState value of OK (2)
                                                    and Warning (4) are returned. - Default -
                                                    Default value. Matches any HealthState. The
                                                    value is zero. - None - Filter that doesn't
                                                    match any HealthState value. Used in order to
                                                    return no results on a given collection of
                                                    states. The value is 1. - Ok - Filter that
                                                    matches input with HealthState value Ok. The
                                                    value is 2. - Warning - Filter that matches
                                                    input with HealthState value Warning. The value
                                                    is 4. - Error - Filter that matches input with
                                                    HealthState value Error. The value is 8. - All -
                                                    Filter that matches input with any HealthState value. The value is 65535.|
| --events-health-state-filter   | Allows filtering the collection of HealthEvent
                                                    objects returned based on health state. The
                                                    possible values for this parameter include
                                                    integer value of one of the following health
                                                    states. Only events that match the filter are
                                                    returned. All events are used to evaluate the
                                                    aggregated health state. If not specified, all
                                                    entries are returned. The state values are flag-                                                    based enumeration, so the value could be a
                                                    combination of these values obtained using
                                                    bitwise 'OR' operator. For example, If the
                                                    provided value is 6 then all of the events with
                                                    HealthState value of OK (2) and Warning (4) are
                                                    returned. - Default - Default value. Matches any
                                                    HealthState. The value is zero. - None - Filter
                                                    that doesn't match any HealthState value. Used
                                                    in order to return no results on a given
                                                    collection of states. The value is 1. - Ok -
                                                    Filter that matches input with HealthState value
                                                    Ok. The value is 2. - Warning - Filter that
                                                    matches input with HealthState value Warning.
                                                    The value is 4. - Error - Filter that matches
                                                    input with HealthState value Error. The value is
                                                    8. - All - Filter that matches input with any
                                                    HealthState value. The value is 65535.|
|--exclude-health-statistics                   | Indicates whether the health statistics should
                                                    be returned as part of the query result. False
                                                    by default. The statistics show the number of
                                                    children entities in health state Ok, Warning,
                                                    and Error.|
 |   --include-system-application-health-statistics| Indicates whether the health statistics should
                                                    include the fabric:/System application health
                                                    statistics. False by default. If
                                                    IncludeSystemApplicationHealthStatistics is set
                                                    to true, the health statistics include the
                                                    entities that belong to the fabric:/System
                                                    application. Otherwise, the query result
                                                    includes health statistics only for user
                                                    applications. The health statistics must be
                                                    included in the query result for this parameter
                                                    to be applied.|
| --nodes-health-state-filter    | Allows filtering of the node health state
                                                    objects returned in the result of cluster health
                                                    query based on their health state. The possible
                                                    values for this parameter include integer value
                                                    of one of the following health states. Only
                                                    nodes that match the filter are returned. All
                                                    nodes are used to evaluate the aggregated health
                                                    state. If not specified, all entries are
                                                    returned. The state values are flag-based
                                                    enumeration, so the value could be a combination
                                                    of these values obtained using bitwise 'OR'
                                                    operator. For example, if the provided value is
                                                    "6" then health state of nodes with HealthState
                                                    value of OK (2) and Warning (4) are returned. -
                                                    Default - Default value. Matches any
                                                    HealthState. The value is zero. - None - Filter
                                                    that doesn't match any HealthState value. Used
                                                    in order to return no results on a given
                                                    collection of states. The value is 1. - Ok -
                                                    Filter that matches input with HealthState value
                                                    Ok. The value is 2. - Warning - Filter that
                                                    matches input with HealthState value Warning.
                                                    The value is 4. - Error - Filter that matches
                                                    input with HealthState value Error. The value is
                                                    8. - All - Filter that matches input with any
                                                    HealthState value. The value is 65535.|
| --timeout -t                   | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                        | Increase logging verbosity to show all debug logs.|
| --help -h                      | Show this help message and exit.|
| --output -o                    | Output format.  Allowed values: json, jsonc, table, tsv.                    Default: json.|
| --query                        | JMESPath query string. See http://jmespath.org/ for more                    information and examples.|
| --verbose                      | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl cluster manifest
Get the Service Fabric cluster manifest.

Get the Service Fabric cluster manifest. The cluster manifest contains properties of the
        cluster that include different node types on the cluster, security configurations, fault, and
        upgrade domain topologies etc. These properties are specified as part of the
        ClusterConfig.JSON file while deploying a standalone cluster. However, most of the
        information in the cluster manifest is generated internally by service fabric during cluster
        deployment in other deployment scenarios (for example when using the [Azure portal](https://portal.azure.com)). The contents of
        the cluster manifest are for informational purposes only and users are not expected to take
        a dependency on the format of the file contents or its interpretation. 

### Arguments

|Argument|Description|
| --- | --- |
| --timeout -t| Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug  | Increase logging verbosity to show all debug logs.|
| --help -h| Show this help message and exit.|
| --output -o | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query  | JMESPath query string. See http://jmespath.org/ for more information and examples.|
| --verbose| Increase logging verbosity. Use --debug for full debug logs.|

## sfctl cluster provision
Provision the code or configuration packages of a Service Fabric
    cluster.

        Validate and provision the code or configuration packages of a Service Fabric cluster.

### Arguments

|Argument|Description|
| --- | --- |
|--cluster-manifest-file-path| The cluster manifest file path.|
|    --code-file-path            | The cluster code package file path.|
|    --timeout -t                | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs.|
| --help -h  | Show this help message and exit.|
| --output -o| Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query | JMESPath query string. See http://jmespath.org/ for more information and examples.|
| --verbose  | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl cluster select
Connects to a Service Fabric cluster endpoint.

If connecting to secure cluster, specify a cert (.crt) and key file (.key) or a single file
        with both (.pem). Do not specify both. Optionally, if connecting to a secure cluster,
        specify also a path to a CA bundle file or directory of trusted CA certs.

### Arguments

|Argument|Description|
| --- | --- |
| --endpoint [Required]| Cluster endpoint URL, including port and HTTP or HTTPS prefix.|
| --aad             | Use Azure Active Directory for authentication.|
| --ca              | Path to CA certs directory to treat as valid or CA bundle file.|
| --cert            | Path to a client certificate file.|
| --key             | Path to client certificate key file.|
| --no-verify       | Disable verification for certificates when using HTTPS, note: this is an       insecure option and should not be used for production environments.|
| --pem             | Path to client certificate, as a .pem file.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug           | Increase logging verbosity to show all debug logs.|
| --help -h         | Show this help message and exit.|
| --output -o       | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query           | JMESPath query string. See http://jmespath.org/ for more information and       examples.|
| --verbose         | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl cluster unprovision
Unprovision the code or configuration packages of a Service Fabric
    cluster.

        Unprovision the code or configuration packages of a Service Fabric cluster.

### Arguments
|Argument|Description|
| --- | --- |
|--code-version  | The cluster code package version.|
|    --config-version| The cluster manifest version.|
|    --timeout -t    | Server timeout in seconds.  Default: 60.|

### Global Arguments
|Argument|Description|
| --- | --- |
|--debug         | Increase logging verbosity to show all debug logs.|
 |   --help -h       | Show this help message and exit.|
 |   --output -o     | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
 |   --query         | JMESPath query string. See http://jmespath.org/ for more information and
                      examples.|
 |   --verbose       | Increase logging verbosity. Use --debug for full debug logs.|


## sfctl cluster upgrade
Start upgrading the code or configuration version of a Service Fabric
    cluster.

        Validate the supplied upgrade parameters and start upgrading the code or configuration
        version of a Service Fabric cluster if the parameters are valid.

### Arguments
|Argument|Description|
| --- | --- |
|    --app-health-map                      | JSON encoded dictionary of pairs of application name and
                                            maximum percentage unhealthy before raising error.|
 |   --app-type-health-map                 | JSON encoded dictionary of pairs of application type
                                            name and maximum percentage unhealthy before raising
                                            error.|
 |   --code-version                        | The cluster code version.|
 |   --config-version                      | The cluster configuration version.|
 |   --delta-health-evaluation             | Enables delta health evaluation rather than absolute
                                            health evaluation after completion of each upgrade
                                            domain.|
 |   --delta-unhealthy-nodes               | The maximum allowed percentage of nodes health
                                            degradation allowed during cluster upgrades.  Default:
                                            10.
        The delta is measured between the state of the nodes at the beginning of upgrade and the
        state of the nodes at the time of the health evaluation. The check is performed after every
        upgrade domain upgrade completion to make sure the global state of the cluster is within
        tolerated limits.|
 |   --failure-action                      | Possible values include: 'Invalid', 'Rollback',
                                            'Manual'.|
 |   --force-restart                       | Force restart.|
 |   --health-check-retry                  | Health check retry timeout measured in milliseconds.|
 |   --health-check-stable                 | Health check stable duration measured in milliseconds.|
  |  --health-check-wait                   | Health check wait duration measured in milliseconds.|
  |  --replica-set-check-timeout           | Upgrade replica set check timeout measured in seconds.|
 |   --rolling-upgrade-mode                | Possible values include: 'Invalid', 'UnmonitoredAuto',
                                            'UnmonitoredManual', 'Monitored'.  Default:
                                            UnmonitoredAuto.|
  |  --timeout -t                          | Server timeout in seconds.  Default: 60.|
  |  --unhealthy-applications              | The maximum allowed percentage of unhealthy applications
                                            before reporting an error.
        For example, to allow 10% of applications to be unhealthy, this value would be 10. The
        percentage represents the maximum tolerated percentage of applications that can be unhealthy
        before the cluster is considered in error. If the percentage is respected but there is at
        least one unhealthy application, the health is evaluated as Warning. This is calculated by
        dividing the number of unhealthy applications over the total number of application instances
        in the cluster, excluding applications of application types that are included in the
        ApplicationTypeHealthPolicyMap. The computation rounds up to tolerate one failure on small
        numbers of applications.|
 |   --unhealthy-nodes                     | The maximum allowed percentage of unhealthy nodes before
                                            reporting an error.
        For example, to allow 10% of nodes to be unhealthy, this value would be 10. The percentage
        represents the maximum tolerated percentage of nodes that can be unhealthy before the
        cluster is considered in error. If the percentage is respected but there is at least one
        unhealthy node, the health is evaluated as Warning. The percentage is calculated by dividing
        the number of unhealthy nodes over the total number of nodes in the cluster. The computation
        rounds up to tolerate one failure on small numbers of nodes. In large clusters, some nodes
        will always be down or out for repairs, so this percentage should be configured to tolerate
        that.|
 |   --upgrade-domain-delta-unhealthy-nodes| The maximum allowed percentage of upgrade domain nodes
                                            health degradation allowed during cluster upgrades.
                                            Default: 15.
        The delta is measured between the state of the upgrade domain nodes at the beginning of
        upgrade and the state of the upgrade domain nodes at the time of the health evaluation. The
        check is performed after every upgrade domain upgrade completion for all completed upgrade
        domains to make sure the state of the upgrade domains is within tolerated limits.|
 |   --upgrade-domain-timeout              | Upgrade domain timeout measured in milliseconds.|
 |   --upgrade-timeout                     | Upgrade timeout measured in milliseconds.|
 |   --warning-as-error                    | Warnings are treated with the same severity as errors.|

### Global Arguments
    |Argument|Description|
| --- | --- |
|--debug                               | Increase logging verbosity to show all debug logs.|
|    --help -h                             | Show this help message and exit.|
|    --output -o                           | Output format.  Allowed values: json, jsonc, table, tsv.
                                            Default: json.|
|    --query                               | JMESPath query string. See http://jmespath.org/ for more
                                            information and examples.|
|    --verbose                             | Increase logging verbosity. Use --debug for full debug
                                            logs.|

## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).