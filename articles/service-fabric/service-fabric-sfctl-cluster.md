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
|    recover-system  | Indicates to the Service Fabric cluster that it should attempt to recover the  system services which are currently stuck in quorum loss.|
|    select       | Connects to a Service Fabric cluster endpoint.|
|    upgrade-status  | Gets the progress of the current cluster upgrade.|


## sfctl cluster health
Gets the health of a Service Fabric cluster.

Gets the health of a Service Fabric cluster. Use EventsHealthStateFilter to filter the
        collection of health events reported on the cluster based on the health state. Similarly,
        use NodesHealthStateFilter and ApplicationsHealthStateFilter to filter the collection of
        nodes and applications returned based on their aggregated health state. 

### Arguments

|Argument|Description|
| --- | --- |
| --applications-health-state-filter| Allows filtering of the application health state objects                    returned in the result of cluster health query based on                    their health state. The possible values for this parameter                    include integer value obtained from members or bitwise                    operations on members of HealthStateFilter enumeration. Only                    applications that match the filter are returned. All                    applications are used to evaluate the aggregated health                    state. If not specified, all entries are returned. The state                    values are flag-based enumeration, so the value could be a                    combination of these values obtained using bitwise 'OR'                    operator. For example, if the provided value is 6 then                    health state of applications with HealthState value of OK                    (2) and Warning (4) are returned. - Default - Default value.                    Matches any HealthState. The value is zero. - None - Filter                    that doesn’t match any HealthState value. Used in order to                    return no results on a given collection of states. The value                    is 1. - Ok - Filter that matches input with HealthState                    value Ok. The value is 2. - Warning - Filter that matches                    input with HealthState value Warning. The value is 4. -                    Error - Filter that matches input with HealthState value                    Error. The value is 8. - All - Filter that matches input                    with any HealthState value. The value is 65535.|
| --events-health-state-filter   | Allows filtering the collection of HealthEvent objects                    returned based on health state. The possible values for this                    parameter include integer value of one of the following                    health states. Only events that match the filter are                    returned. All events are used to evaluate the aggregated                    health state. If not specified, all entries are returned.                    The state values are flag-based enumeration, so the value                    could be a combination of these values obtained using bitwise                    'OR' operator. For example, If the provided value is 6 then                    all of the events with HealthState value of OK (2) and                    Warning (4) are returned. - Default - Default value. Matches                    any HealthState. The value is zero. - None - Filter that                    doesn’t match any HealthState value. Used in order to return                    no results on a given collection of states. The value is 1.                    - Ok - Filter that matches input with HealthState value Ok.                    The value is 2. - Warning - Filter that matches input with                    HealthState value Warning. The value is 4. - Error - Filter                    that matches input with HealthState value Error. The value                    is 8. - All - Filter that matches input with any HealthState                    value. The value is 65535.|
| --nodes-health-state-filter    | Allows filtering of the node health state objects returned                    in the result of cluster health query based on their health                    state. The possible values for this parameter include                    integer value of one of the following health states. Only                    nodes that match the filter are returned. All nodes are used                    to evaluate the aggregated health state. If not specified,                    all entries are returned. The state values are flag-based                    enumeration, so the value could be a combination of these                    values obtained using bitwise 'OR' operator. For example, if                    the provided value is 6 then health state of nodes with                    HealthState value of OK (2) and Warning (4) are returned. -                    Default - Default value. Matches any HealthState. The value                    is zero. - None - Filter that doesn’t match any HealthState                    value. Used in order to return no results on a given                    collection of states. The value is 1. - Ok - Filter that                    matches input with HealthState value Ok. The value is 2. -                    Warning - Filter that matches input with HealthState value                    Warning. The value is 4. - Error - Filter that matches input                    with HealthState value Error. The value is 8. - All - Filter                    that matches input with any HealthState value. The value is                    65535.|
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
        ClusterConfig.JSON file while deploying a stand alone cluster. However, most of the
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

## sfctl cluster operations
Gets a list of user-induced fault operations filtered by provided
    input.

Gets a list of user-induced fault operations filtered by provided input.

### Arguments

|Argument|Description|
| --- | --- |

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

## Next Steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).