---
title: Azure Service Fabric CLI- sfctl chaos| Microsoft Docs
description: Describes the Service Fabric CLI sfctl chaos commands.
services: service-fabric
documentationcenter: na
author: Christina-Kang
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 07/31/2018
ms.author: bikang

---

# sfctl chaos
Start, stop, and report on the chaos test service.

## Subgroups
|Subgroup|Description|
| --- | --- |
| [schedule](service-fabric-sfctl-chaos-schedule.md) | Get and set the chaos schedule. |
## Commands

|Command|Description|
| --- | --- |
| events | Gets the next segment of the Chaos events based on the continuation token or the time range. |
| get | Get the status of Chaos. |
| start | Starts Chaos in the cluster. |
| stop | Stops Chaos if it is running in the cluster and put the Chaos Schedule in a stopped state. |

## sfctl chaos events
Gets the next segment of the Chaos events based on the continuation token or the time range.

To get the next segment of the Chaos events, you can specify the ContinuationToken. To get the start of a new segment of Chaos events, you can specify the time range through StartTimeUtc and EndTimeUtc. You cannot specify both the ContinuationToken and the time range in the same call. When there are more than 100 Chaos events, the Chaos events are returned in multiple segments where a segment contains no more than 100 Chaos events and to get the next segment you make a call to this API with the continuation token.

### Arguments

|Argument|Description|
| --- | --- |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --end-time-utc | The Windows file time representing the end time of the time range for which a Chaos report is to be generated. Consult [DateTime.ToFileTimeUtc Method](https://docs.microsoft.com/dotnet/api/system.datetime.tofiletimeutc?redirectedfrom=MSDN&view=netframework-4.7.2#System_DateTime_ToFileTimeUtc) for details. |
| --max-results | The maximum number of results to be returned as part of the paged queries. This parameter defines the upper bound on the number of results returned. The results returned can be less than the specified maximum results if they do not fit in the message as per the max message size restrictions defined in the configuration. If this parameter is zero or not specified, the paged query includes as many results as possible that fit in the return message. |
| --start-time-utc | The Windows file time representing the start time of the time range for which a Chaos report is to be generated. Consult [DateTime.ToFileTimeUtc Method](https://docs.microsoft.com/dotnet/api/system.datetime.tofiletimeutc?redirectedfrom=MSDN&view=netframework-4.7.2#System_DateTime_ToFileTimeUtc) for details. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl chaos get
Get the status of Chaos.

Get the status of Chaos indicating whether or not Chaos is running, the Chaos parameters used for running Chaos and the status of the Chaos Schedule.

### Arguments

|Argument|Description|
| --- | --- |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl chaos start
Starts Chaos in the cluster.

If Chaos is not already running in the cluster, it starts Chaos with the passed in Chaos parameters. If Chaos is already running when this call is made, the call fails with the error code FABRIC_E_CHAOS_ALREADY_RUNNING.

### Arguments

|Argument|Description|
| --- | --- |
| --app-type-health-policy-map | JSON encoded list with max percentage unhealthy applications for specific application types. Each entry specifies as a key the application type name and as  a value an integer that represents the MaxPercentUnhealthyApplications percentage used to evaluate the applications of the specified application type. <br><br> Defines a map with max percentage unhealthy applications for specific application types. Each entry specifies as key the application type name and as value an integer that represents the MaxPercentUnhealthyApplications percentage used to evaluate the applications of the specified application type. The application type health policy map can be used during cluster health evaluation to describe special application types. The application types included in the map are evaluated against the percentage specified in the map, and not with the global MaxPercentUnhealthyApplications defined in the cluster health policy. The applications of application types specified in the map are not counted against the global pool of applications. For example, if some applications of a type are critical, the cluster administrator can add an entry to the map for that application type and assign it a value of 0% (that is, do not tolerate any failures). All other applications can be evaluated with MaxPercentUnhealthyApplications set to 20% to tolerate some failures out of the thousands of application instances. The application type health policy map is used only if the cluster manifest enables application type health evaluation using the configuration entry for HealthManager/EnableApplicationTypeHealthEvaluation. |
| --chaos-target-filter | JSON encoded dictionary with two string type keys. The two keys are NodeTypeInclusionList and ApplicationInclusionList. Values for both of these keys are list of string. chaos_target_filter defines all filters for targeted Chaos faults, for example, faulting only certain node types or faulting only certain applications. <br><br> If chaos_target_filter is not used, Chaos faults all cluster entities. If chaos_target_filter is used, Chaos faults only the entities that meet the chaos_target_filter specification. NodeTypeInclusionList and ApplicationInclusionList allow a union semantics only. It is not possible to specify an intersection of NodeTypeInclusionList and ApplicationInclusionList. For example, it is not possible to specify "fault this application only when it is on that node type." Once an entity is included in either NodeTypeInclusionList or ApplicationInclusionList, that entity cannot be excluded using ChaosTargetFilter. Even if applicationX does not appear in ApplicationInclusionList, in some Chaos iteration applicationX can be faulted because it happens to be on a node of nodeTypeY that is included in NodeTypeInclusionList. If both NodeTypeInclusionList and ApplicationInclusionList are empty, an ArgumentException is thrown. All types of faults (restart node, restart code package, remove replica, restart replica, move primary, and move secondary) are enabled for the nodes of these node types. If a node type (say NodeTypeX) does not appear in the NodeTypeInclusionList, then node level faults (like NodeRestart) will never be enabled for the nodes of NodeTypeX, but code package and replica faults can still be enabled for NodeTypeX if an application in the ApplicationInclusionList happens to reside on a node of NodeTypeX. At most 100 node type names can be included in this list, to increase this number, a config upgrade is required for MaxNumberOfNodeTypesInChaosEntityFilter configuration. All replicas belonging to services of these applications are amenable to replica faults (restart replica, remove replica, move primary, and move secondary) by Chaos. Chaos may restart a code package only if the code package hosts replicas of these applications only. If an application does not appear in this list, it can still be faulted in some Chaos iteration if the application ends up on a node of a node type that is included in NodeTypeInclusionList. However if applicationX is tied to nodeTypeY through placement constraints and applicationX is absent from ApplicationInclusionList and nodeTypeY is absent from NodeTypeInclusionList, then applicationX will never be faulted. At most 1000 application names can be included in this list, to increase this number, a config upgrade is required for MaxNumberOfApplicationsInChaosEntityFilter configuration. |
| --context | JSON encoded map of (string, string) type key-value pairs. The map can be used to record information about the Chaos run. There cannot be more than 100 such pairs and each string (key or value) can be at most 4095 characters long. This map is set by the starter of the Chaos run to optionally store the context about the specific run. |
| --disable-move-replica-faults | Disables the move primary and move secondary faults. |
| --max-cluster-stabilization | The maximum amount of time to wait for all cluster entities to become stable and healthy.  Default\: 60. <br><br> Chaos executes in iterations and at the start of each iteration it validates the health of cluster entities. During validation if a cluster entity is not stable and healthy within MaxClusterStabilizationTimeoutInSeconds, Chaos generates a validation failed event. |
| --max-concurrent-faults | The maximum number of concurrent faults induced per iteration. Chaos executes in iterations and two consecutive iterations are separated by a validation phase. The higher the concurrency, the more aggressive the injection of faults -- inducing more complex series of states to uncover bugs. The recommendation is to start with a value of 2 or 3 and to exercise caution while moving up.  Default\: 1. |
| --max-percent-unhealthy-apps | When evaluating cluster health during Chaos, the maximum allowed percentage of unhealthy applications before reporting an error. <br><br> The maximum allowed percentage of unhealthy applications before reporting an error. For example, to allow 10% of applications to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy application, the health is evaluated as Warning. This is calculated by dividing the number of unhealthy applications over the total number of application instances in the cluster, excluding applications of application types that are included in the ApplicationTypeHealthPolicyMap. The computation rounds up to tolerate one failure on small numbers of applications. Default percentage is zero. |
| --max-percent-unhealthy-nodes | When evaluating cluster health during Chaos, the maximum allowed percentage of unhealthy nodes before reporting an error. <br><br> The maximum allowed percentage of unhealthy nodes before reporting an error. For example, to allow 10% of nodes to be unhealthy, this value would be 10. The percentage represents the maximum tolerated percentage of nodes that can be unhealthy before the cluster is considered in error. If the percentage is respected but there is at least one unhealthy node, the health is evaluated as Warning. The percentage is calculated by dividing the number of unhealthy nodes over the total number of nodes in the cluster. The computation rounds up to tolerate one failure on small numbers of nodes. Default percentage is zero. In large clusters, some nodes will always be down or out for repairs, so this percentage should be configured to tolerate that. |
| --time-to-run | Total time (in seconds) for which Chaos will run before automatically stopping. The maximum allowed value is 4,294,967,295 (System.UInt32.MaxValue).  Default\: 4294967295. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |
| --wait-time-between-faults | Wait time (in seconds) between consecutive faults within a single iteration.  Default\: 20. <br><br> The larger the value, the lower the overlapping between faults and the simpler the sequence of state transitions that the cluster goes through. The recommendation is to start with a value between 1 and 5 and exercise caution while moving up. |
| --wait-time-between-iterations | Time-separation (in seconds) between two consecutive iterations of Chaos. The larger the value, the lower the fault injection rate.  Default\: 30. |
| --warning-as-error | Sets the health policy to treat warning as errors. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl chaos stop
Stops Chaos if it is running in the cluster and put the Chaos Schedule in a stopped state.

Stops Chaos from executing new faults. In-flight faults will continue to execute until they are complete. The current Chaos Schedule is put into a stopped state. Once a schedule is stopped, it will stay in the stopped state and not be used to Chaos Schedule new runs of Chaos. A new Chaos Schedule must be set in order to resume scheduling.

### Arguments

|Argument|Description|
| --- | --- |
| --timeout -t | Server timeout in seconds.  Default\: 60. |

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