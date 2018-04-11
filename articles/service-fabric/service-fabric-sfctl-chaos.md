---
title: Azure Service Fabric CLI- sfctl choas| Microsoft Docs
description: Describes the Service Fabric CLI sfctl chaos commands.
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
# sfctl chaos
Start, stop, and report on the chaos test service.

## Commands

|Command|Description|
| --- | --- |
|    report| Gets the next segment of the Chaos report based on the passed-in continuation token or the passed-in time-range.|
|    start | If Chaos is not already running in the cluster, starts running Chaos with the specified in Chaos parameters.|
|    stop  | Stops Chaos in the cluster if it is already running, otherwise it does nothing.|


## sfctl chaos report
Gets the next segment of the Chaos report based on the passed-in
    continuation token or the passed-in time-range.

You can either specify the ContinuationToken to get the next segment of the Chaos report or
        you can specify the time-range through StartTimeUtc and EndTimeUtc, but you cannot specify
        both the ContinuationToken and the time-range in the same call. When there are more than 100
        Chaos events, the Chaos report is returned in segments where a segment contains no more than
        100 Chaos events. 

### Arguments

|Argument|Description|
| --- | --- |
| --continuation-token| The continuation token parameter is used to obtain next set of results. A continuation token with a non empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results then the continuation token does not contain a value. The value of this parameter should not be URL encoded.|
| --end-time-utc   | The count of ticks representing the end time of the time range for which a Chaos report is to be generated. Please consult [DateTime.Ticks Property](https://msdn.microsoft.com/en-us/library/system.datetime.ticks%28v=vs.110%29) for details about tick.|
| --start-time-utc | The count of ticks representing the start time of the time range for which a Chaos report is to be generated. Please consult [DateTime.Ticks Property](https://msdn.microsoft.com/en-us/library/system.datetime.ticks%28v=vs.110%29) for details about tick.|
| --timeout -t     | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug          | Increase logging verbosity to show all debug logs.|
| --help -h        | Show this help message and exit.|
| --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query          | JMESPath query string. See http://jmespath.org/ for more information and examples.|
| --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl chaos start
If Chaos is not already running in the cluster, starts running Chaos with the
    specified in Chaos parameters.

### Arguments

|Argument|Description|
| --- | --- |
| --app-type-health-policy-map  | JSON encoded list with max percentage unhealthy applications for           specific application types. Each entry specifies as a key the           application type name and as  a value an integer that represents           the MaxPercentUnhealthyApplications percentage used to evaluate           the applications of the specified application type.|
| --disable-move-replica-faults | Disables the move primary and move secondary faults.|
| --max-cluster-stabilization| The maximum amount of time to wait for all cluster entities to           become stable and healthy.  Default: 60.|
| --max-concurrent-faults    | The maximum number of concurrent faults induced per iteration.           Default: 1.|
| --max-percent-unhealthy-apps  | When evaluating cluster health during Chaos, the maximum allowed           percentage of unhealthy applications before reporting an error.|
| --max-percent-unhealthy-nodes | When evaluating cluster health during Chaos, the maximum allowed           percentage of unhealthy nodes before reporting an error.|
| --time-to-run              | Total time (in seconds) for which Chaos will run before           automatically stopping. The maximum allowed value is           4,294,967,295 (System.UInt32.MaxValue).  Default: 4294967295.|
| --timeout -t               | Server timeout in seconds.  Default: 60.|
| --wait-time-between-faults | Wait time (in seconds) between consecutive faults within a           single iteration.  Default: 20.|
| --wait-time-between-iterations| Time-separation (in seconds) between two consecutive iterations           of Chaos.  Default: 30.|
| --warning-as-error         | When evaluating cluster health during Chaos, treat warnings with           the same severity as errors.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                    | Increase logging verbosity to show all debug logs.|
| --help -h                  | Show this help message and exit.|
| --output -o                | Output format.  Allowed values: json, jsonc, table, tsv.           Default: json.|
| --query                    | JMESPath query string. See http://jmespath.org/ for more           information and examples.|
| --verbose                  | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl chaos stop
Stops Chaos in the cluster if it is already running, otherwise it does nothing.

Stops Chaos from scheduling further faults; but, the in-flight faults are not affected.

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

## Next steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).