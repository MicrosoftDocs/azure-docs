---
title: Azure Service Fabric CLI- sfctl chaos schedule | Microsoft Docs
description: Describes the Service Fabric CLI sfctl chaos schedule commands.
services: service-fabric
documentationcenter: na
author: Christina-Kang
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 12/06/2018
ms.author: bikang

---

# sfctl chaos schedule
Get and set the chaos schedule.

## Commands

|Command|Description|
| --- | --- |
| get | Get the Chaos Schedule defining when and how to run Chaos. |
| set | Set the schedule used by Chaos. |

## sfctl chaos schedule get
Get the Chaos Schedule defining when and how to run Chaos.

Gets the version of the Chaos Schedule in use and the Chaos Schedule that defines when and how to run Chaos.

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

## sfctl chaos schedule set
Set the schedule used by Chaos.

Chaos will automatically schedule runs based on the Chaos Schedule. The version in the provided input schedule must match the version of the Chaos Schedule on the server. If the version provided does not match the version on the server, the Chaos Schedule is not updated. If the version provided matches the version on the server, then the Chaos Schedule is updated and the version of the Chaos Schedule on the server is incremented up by one and wraps back to 0 after 2,147,483,647. If Chaos is running when this call is made, the call will fail.

### Arguments

|Argument|Description|
| --- | --- |
| --chaos-parameters-dictionary | JSON encoded list representing a mapping of string names to ChaosParameters to be used by Jobs. |
| --expiry-date-utc | The date and time for when to stop using the Schedule to schedule Chaos.  Default\: 9999-12-31T23\:59\:59.999Z. |
| --jobs | JSON encoded list of ChaosScheduleJobs representing when to run Chaos and with what parameters to run Chaos with. |
| --start-date-utc | The date and time for when to start using the Schedule to schedule Chaos.  Default\: 1601-01-01T00\:00\:00.000Z. |
| --timeout -t | Server timeout in seconds.  Default\: 60. |
| --version | The version number of the Schedule. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

### Examples

The following command sets a schedule (assuming the current schedule has version 0) that starts on 2016-01-01 and expires on 2038-01-01 that runs Chaos 24 hours of the day, 7 days a week. Chaos will be scheduled on the cluster for that time.

    sfctl chaos schedule set --version 0 --start-date-utc "2016-01-01T00:00:00.000Z" --expiry-date-utc "2038-01-01T00:00:00.000Z"
    --chaos-parameters-dictionary
    [
    {
        "Key":"adhoc",
        "Value":{
            "MaxConcurrentFaults":3,
            "EnableMoveReplicaFaults":true,
            "ChaosTargetFilter":{
                "NodeTypeInclusionList":[
                "N0010Ref",
                "N0020Ref",
                "N0030Ref",
                "N0040Ref",
                "N0050Ref"
                ]
            },
            "MaxClusterStabilizationTimeoutInSeconds":60,
            "WaitTimeBetweenIterationsInSeconds":15,
            "WaitTimeBetweenFaultsInSeconds":30,
            "TimeToRunInSeconds":"600",
            "Context":{
                "Map":{
                "test":"value"
                }
            },
            "ClusterHealthPolicy":{
                "MaxPercentUnhealthyNodes":0,
                "ConsiderWarningAsError":true,
                "MaxPercentUnhealthyApplications":0
            }
        }
    }
    ]
    --jobs
    [
    {
        "ChaosParameters":"adhoc",
        "Days":{
            "Sunday":true,
            "Monday":true,
            "Tuesday":true,
            "Wednesday":true,
            "Thursday":true,
            "Friday":true,
            "Saturday":true
        },
        "Times":[
            {
                "StartTime":{
                "Hour":0,
                "Minute":0
                },
                "EndTime":{
                "Hour":23,
                "Minute":59
                }
            }
        ]
    }
    ]


## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).
