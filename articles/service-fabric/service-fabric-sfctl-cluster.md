---
title: Azure Service Fabric CLI- sfctl cluster
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for managing clusters.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# sfctl cluster
Select, manage, and operate Service Fabric clusters.

## Commands

|Command|Description|
| --- | --- |
| code-versions | Gets a list of fabric code versions that are provisioned in a Service Fabric cluster. |
| config-versions | Gets a list of fabric config versions that are provisioned in a Service Fabric cluster. |
| health | Gets the health of a Service Fabric cluster. |
| manifest | Get the Service Fabric cluster manifest. |
| operation-cancel | Cancels a user-induced fault operation. |
| operation-list | Gets a list of user-induced fault operations filtered by provided input. |
| provision | Provision the code or configuration packages of a Service Fabric cluster. |
| recover-system | Indicates to the Service Fabric cluster that it should attempt to recover the system services that are currently stuck in quorum loss. |
| report-health | Sends a health report on the Service Fabric cluster. |
| select | Connects to a Service Fabric cluster endpoint. |
| show-connection | Show which Service Fabric cluster this sfctl instance is connected to. |
| unprovision | Unprovision the code or configuration packages of a Service Fabric cluster. |
| upgrade | Start upgrading the code or configuration version of a Service Fabric cluster. |
| upgrade-resume | Make the cluster upgrade move on to the next upgrade domain. |
| upgrade-rollback | Roll back the upgrade of a Service Fabric cluster. |
| upgrade-status | Gets the progress of the current cluster upgrade. |
| upgrade-update | Update the upgrade parameters of a Service Fabric cluster upgrade. |

## sfctl cluster code-versions
Gets a list of fabric code versions that are provisioned in a Service Fabric cluster.

Gets a list of information about fabric code versions that are provisioned in the cluster. The parameter CodeVersion can be used to optionally filter the output to only that particular version.

### Arguments

|Argument|Description|
| --- | --- |
| --code-version | The product version of Service Fabric. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster config-versions
Gets a list of fabric config versions that are provisioned in a Service Fabric cluster.

Gets a list of information about fabric config versions that are provisioned in the cluster. The parameter ConfigVersion can be used to optionally filter the output to only that particular version.

### Arguments

|Argument|Description|
| --- | --- |
| --config-version | The config version of Service Fabric. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster health
Gets the health of a Service Fabric cluster.

Use EventsHealthStateFilter to filter the collection of health events reported on the cluster based on the health state. Similarly, use NodesHealthStateFilter and ApplicationsHealthStateFilter to filter the collection of nodes and applications returned based on their aggregated health state.

### Arguments

|Argument|Description|
| --- | --- |
| --applications-health-state-filter | Allows filtering of the application health state objects returned in the result of cluster health query based on their health state. The possible values for this parameter include integer value obtained from members or bitwise operations on members of HealthStateFilter enumeration. Only applications that match the filter are returned. All applications are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values obtained using bitwise 'OR' operator. For example, if the provided value is 6 then health state of applications with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --events-health-state-filter | Allows filtering the collection of HealthEvent objects returned based on health state. The possible values for this parameter include integer value of one of the following health states. Only events that match the filter are returned. All events are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values, obtained using the bitwise 'OR' operator. For example, If the provided value is 6 then all of the events with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --exclude-health-statistics | Indicates whether the health statistics should be returned as part of the query result. False by default. The statistics show the number of children entities in health state Ok, Warning, and Error. |
| --include-system-application-health-statistics | Indicates whether the health statistics should include the fabric\:/System application health statistics. False by default. If IncludeSystemApplicationHealthStatistics is set to true, the health statistics include the entities that belong to the fabric\:/System application. Otherwise, the query result includes health statistics only for user applications. The health statistics must be included in the query result for this parameter to be applied. |
| --nodes-health-state-filter | Allows filtering of the node health state objects returned in the result of cluster health query based on their health state. The possible values for this parameter include integer value of one of the following health states. Only nodes that match the filter are returned. All nodes are used to evaluate the aggregated health state. If not specified, all entries are returned. The state values are flag-based enumeration, so the value could be a combination of these values obtained using bitwise 'OR' operator. For example, if the provided value is 6 then health state of nodes with HealthState value of OK (2) and Warning (4) are returned.  <br> - Default - Default value. Matches any HealthState. The value is zero.  <br> - None - Filter that doesn't match any HealthState value. Used in order to return no results on a given collection of states. The value is 1.  <br> - Ok - Filter that matches input with HealthState value Ok. The value is 2.  <br> - Warning - Filter that matches input with HealthState value Warning. The value is 4.  <br> - Error - Filter that matches input with HealthState value Error. The value is 8.  <br> - All - Filter that matches input with any HealthState value. The value is 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster manifest
Get the Service Fabric cluster manifest.

Get the Service Fabric cluster manifest. The cluster manifest contains properties of the cluster that include different node types on the cluster, security configurations, fault, and upgrade domain topologies, etc. These properties are specified as part of the ClusterConfig.JSON file while deploying a stand-alone cluster. However, most of the information in the cluster manifest is generated internally by service fabric during cluster deployment in other deployment scenarios (e.g. when using Azure portal). The contents of the cluster manifest are for informational purposes only and users are not expected to take a dependency on the format of the file contents or its interpretation.

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

## sfctl cluster operation-cancel
Cancels a user-induced fault operation.

The following APIs start fault operations that may be canceled by using CancelOperation\: StartDataLoss, StartQuorumLoss, StartPartitionRestart, StartNodeTransition. If force is false, then the specified user-induced operation will be gracefully stopped and cleaned up.  If force is true, the command will be aborted, and some internal state may be left behind.  Specifying force as true should be used with care. Calling this API with force set to true is not allowed until this API has already been called on the same test command with force set to false first, or unless the test command already has an OperationState of OperationState.RollingBack. Clarification\: OperationState.RollingBack means that the system will be/is cleaning up internal system state caused by executing the command.  It will not restore data if the test command was to cause data loss.  For example, if you call StartDataLoss then call this API, the system will only clean up internal state from running the command. It will not restore the target partition's data, if the command progressed far enough to cause data loss. Important note\:  if this API is invoked with force==true, internal state may be left behind.

### Arguments

|Argument|Description|
| --- | --- |
| --operation-id [Required] | A GUID that identifies a call of this API.  This is passed into the corresponding GetProgress API. |
| --force | Indicates whether to gracefully roll back and clean up internal system state modified by executing the user-induced operation. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster operation-list
Gets a list of user-induced fault operations filtered by provided input.

Gets the list of user-induced fault operations filtered by provided input.

### Arguments

|Argument|Description|
| --- | --- |
| --state-filter | Used to filter on OperationState's for user-induced operations. - 65535 - select All - 1 - select Running - 2 - select RollingBack - 8 - select Completed - 16 - select Faulted - 32 - select Cancelled - 64 - select ForceCancelled.  Default\: 65535. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |
| --type-filter | Used to filter on OperationType for user-induced operations. - 65535 - select all - 1 - select PartitionDataLoss. - 2 - select PartitionQuorumLoss. - 4 - select PartitionRestart. - 8 - select NodeTransition.  Default\: 65535. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster provision
Provision the code or configuration packages of a Service Fabric cluster.

Validate and provision the code or configuration packages of a Service Fabric cluster.

### Arguments

|Argument|Description|
| --- | --- |
| --cluster-manifest-file-path | The cluster manifest file path. |
| --code-file-path | The cluster code package file path. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster recover-system
Indicates to the Service Fabric cluster that it should attempt to recover the system services that are currently stuck in quorum loss.

Indicates to the Service Fabric cluster that it should attempt to recover the system services that are currently stuck in quorum loss. This operation should only be performed if it is known that the replicas that are down cannot be recovered. Incorrect use of this API can cause potential data loss.

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

## sfctl cluster report-health
Sends a health report on the Service Fabric cluster.

Sends a health report on a Service Fabric cluster. The report must contain the information about the source of the health report and property on which it is reported. The report is sent to a Service Fabric gateway node, which forwards to the health store. The report may be accepted by the gateway, but rejected by the health store after extra validation. For example, the health store may reject the report because of an invalid parameter, like a stale sequence number. To see whether the report was applied in the health store, run GetClusterHealth and check that the report appears in the HealthEvents section.

### Arguments

|Argument|Description|
| --- | --- |
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

## sfctl cluster select
Connects to a Service Fabric cluster endpoint.

If connecting to secure cluster, specify an absolute path to a cert (.crt) and key file (.key) or a single file with both (.pem). Do not specify both. Optionally, if connecting to a secure cluster, also specify an absolute path to a CA bundle file or directory of trusted CA certs.  There is no connection to a cluster without running this command first, including a connection to localhost. However, no explicit endpoint is required for connecting to a local cluster.  If using a self signed cert, or other certificate not signed by a well known CA, pass in the --ca parameter to ensure that validation passes. If not on a production cluster, to bypass client side validation (useful for self signed or not well known CA signed), use the --no-verify option. While possible, it is not recommended for production clusters. A certificate verification error may result otherwise.

### Arguments

|Argument|Description|
| --- | --- |
| --aad | Use Microsoft Entra ID for authentication. |
| --ca | Absolute path to CA certs directory to treat as valid or CA bundle file. If using a directory of CA certs, `c_rehash <directory>` provided by OpenSSL must be run first to compute the certificate hashes and create the appropriate symbolics links. This is used to verify that the certificate returned by the cluster is valid. |
| --cert | Absolute path to a client certificate file. |
| --endpoint | Cluster endpoint URL, including port and HTTP or HTTPS prefix. Typically, the endpoint will look something like `https\://<your-url>\:19080`. If no endpoint is given, it will default to `http\://localhost\:19080`. |
| --key | Absolute path to client certificate key file. |
| --no-verify | Disable verification for certificates when using HTTPS, note\: this is an insecure option and should not be used for production environments. |
| --pem | Absolute path to client certificate, as a .pem file. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster show-connection
Show which Service Fabric cluster this sfctl instance is connected to.

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster unprovision
Unprovision the code or configuration packages of a Service Fabric cluster.

It is supported to unprovision code and configuration separately.

### Arguments

|Argument|Description|
| --- | --- |
| --code-version | The cluster code package version. |
| --config-version | The cluster manifest version. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster upgrade
Start upgrading the code or configuration version of a Service Fabric cluster.

Validate the supplied upgrade parameters and start upgrading the code or configuration version of a Service Fabric cluster if the parameters are valid.

### Arguments

|Argument|Description|
| --- | --- |
| --app-health-map | JSON encoded dictionary of pairs of application name and maximum percentage unhealthy before raising error. |
| --app-type-health-map | JSON encoded dictionary of pairs of application type name and maximum percentage unhealthy before raising error. |
| --code-version | The cluster code version. |
| --config-version | The cluster configuration version. |
| --delta-health-evaluation | Enables delta health evaluation rather than absolute health evaluation after completion of each upgrade domain. |
| --delta-unhealthy-nodes | The maximum allowed percentage of nodes health degradation allowed during cluster upgrades.  Default\: 10. <br><br> The delta is measured between the state of the nodes at the beginning of upgrade and the state of the nodes at the time of the health evaluation. The check is performed after every upgrade domain upgrade completion to make sure the global state of the cluster is within tolerated limits. |
| --failure-action | Possible values include\: 'Invalid', 'Rollback', 'Manual'. |
| --force-restart | Processes are forcefully restarted during upgrade even when the code version has not changed. <br><br> The upgrade only changes configuration or data. |
| --health-check-retry | The length of time between attempts to perform health checks if the application or cluster is not healthy. |
| --health-check-stable | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --health-check-wait | The length of time to wait after completing an upgrade domain before starting the health checks process. |
| --replica-set-check-timeout | The maximum amount of time to block processing of an upgrade domain and prevent loss of availability when there are unexpected issues. <br><br> When this timeout expires, processing of the upgrade domain will proceed regardless of availability loss issues. The timeout is reset at the start of each upgrade domain. Valid values are between 0 and 42949672925 inclusive. |
| --rolling-upgrade-mode | Possible values include\: 'Invalid', 'UnmonitoredAuto', 'UnmonitoredManual', 'Monitored'.  Default\: UnmonitoredAuto. |
| --timeout -t | Default\: 60. |
| --unhealthy-applications | The maximum allowed percentage of unhealthy applications before reporting an error. <br><br> For example, to allow 10% of applications to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy application, the health is evaluated as Warning. This is calculated by dividing the number of unhealthy applications over the total number of application instances in the cluster, excluding applications of application types that are included in the ApplicationTypeHealthPolicyMap. The computation rounds up to tolerate one failure on small numbers of applications. |
| --unhealthy-nodes | The maximum allowed percentage of unhealthy nodes before reporting an error. <br><br> For example, to allow 10% of nodes to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of nodes that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy node, the health is evaluated as Warning. The percentage is calculated by dividing the number of unhealthy nodes over the total number of nodes in the cluster. The computation rounds up to tolerate one failure on small numbers of nodes. In large clusters, some nodes will always be down or out for repairs, so this percentage should be configured to tolerate that. |
| --upgrade-domain-delta-unhealthy-nodes | The maximum allowed percentage of upgrade domain nodes health degradation allowed during cluster upgrades.  Default\: 15. <br><br> The delta is measured between the state of the upgrade domain nodes at the beginning of upgrade and the state of the upgrade domain nodes at the time of the health evaluation. The check is performed after every upgrade domain upgrade completion for all completed upgrade domains to make sure the state of the upgrade domains is within tolerated limits. |
| --upgrade-domain-timeout | The amount of time each upgrade domain has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --upgrade-timeout | The amount of time the overall upgrade has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --warning-as-error | Indicates whether warnings are treated with the same severity as errors. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster upgrade-resume
Make the cluster upgrade move on to the next upgrade domain.

Make the cluster code or configuration upgrade move on to the next upgrade domain if appropriate.

### Arguments

|Argument|Description|
| --- | --- |
| --upgrade-domain [Required] | The next upgrade domain for this cluster upgrade. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl cluster upgrade-rollback
Roll back the upgrade of a Service Fabric cluster.

Roll back the code or configuration upgrade of a Service Fabric cluster.

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

## sfctl cluster upgrade-status
Gets the progress of the current cluster upgrade.

Gets the current progress of the ongoing cluster upgrade. If no upgrade is currently in progress, get the last state of the previous cluster upgrade.

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

## sfctl cluster upgrade-update
Update the upgrade parameters of a Service Fabric cluster upgrade.

### Arguments

|Argument|Description|
| --- | --- |
| --app-health-map | JSON encoded dictionary of pairs of application name and maximum percentage unhealthy before raising error. |
| --app-type-health-map | JSON encoded dictionary of pairs of application type name and maximum percentage unhealthy before raising error. |
| --delta-health-evaluation | Enables delta health evaluation rather than absolute health evaluation after completion of each upgrade domain. |
| --delta-unhealthy-nodes | The maximum allowed percentage of nodes health degradation allowed during cluster upgrades.  Default\: 10. <br><br> The delta is measured between the state of the nodes at the beginning of upgrade and the state of the nodes at the time of the health evaluation. The check is performed after every upgrade domain upgrade completion to make sure the global state of the cluster is within tolerated limits. |
| --failure-action | Possible values include\: 'Invalid', 'Rollback', 'Manual'. |
| --force-restart | Processes are forcefully restarted during upgrade even when the code version has not changed. <br><br> The upgrade only changes configuration or data. |
| --health-check-retry | The length of time between attempts to perform health checks if the application or cluster is not healthy. |
| --health-check-stable | The amount of time that the application or cluster must remain healthy before the upgrade proceeds to the next upgrade domain. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --health-check-wait | The length of time to wait after completing an upgrade domain before starting the health checks process. |
| --replica-set-check-timeout | The maximum amount of time to block processing of an upgrade domain and prevent loss of availability when there are unexpected issues. <br><br> When this timeout expires, processing of the upgrade domain will proceed regardless of availability loss issues. The timeout is reset at the start of each upgrade domain. Valid values are between 0 and 42949672925 inclusive. |
| --rolling-upgrade-mode | Possible values include\: 'Invalid', 'UnmonitoredAuto', 'UnmonitoredManual', 'Monitored'.  Default\: UnmonitoredAuto. |
| --timeout -t | Default\: 60. |
| --unhealthy-applications | The maximum allowed percentage of unhealthy applications before reporting an error. <br><br> For example, to allow 10% of applications to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy application, the health is evaluated as Warning. This is calculated by dividing the number of unhealthy applications over the total number of application instances in the cluster, excluding applications of application types that are included in the ApplicationTypeHealthPolicyMap. The computation rounds up to tolerate one failure on small numbers of applications. |
| --unhealthy-nodes | The maximum allowed percentage of unhealthy nodes before reporting an error. <br><br> For example, to allow 10% of nodes to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of nodes that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy node, the health is evaluated as Warning. The percentage is calculated by dividing the number of unhealthy nodes over the total number of nodes in the cluster. The computation rounds up to tolerate one failure on small numbers of nodes. In large clusters, some nodes will always be down or out for repairs, so this percentage should be configured to tolerate that. |
| --upgrade-domain-delta-unhealthy-nodes | The maximum allowed percentage of upgrade domain nodes health degradation allowed during cluster upgrades.  Default\: 15. <br><br> The delta is measured between the state of the upgrade domain nodes at the beginning of upgrade and the state of the upgrade domain nodes at the time of the health evaluation. The check is performed after every upgrade domain upgrade completion for all completed upgrade domains to make sure the state of the upgrade domains is within tolerated limits. |
| --upgrade-domain-timeout | The amount of time each upgrade domain has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --upgrade-kind | Possible values include\: 'Invalid', 'Rolling', 'Rolling_ForceRestart'.  Default\: Rolling. |
| --upgrade-timeout | The amount of time the overall upgrade has to complete before FailureAction is executed. <br><br> It is first interpreted as a string representing an ISO 8601 duration. If that fails, then it is interpreted as a number representing the total number of milliseconds. |
| --warning-as-error | Indicates whether warnings are treated with the same severity as errors. |

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
