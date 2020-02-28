---
title: Azure Service Fabric CLI- sfctl chaos schedule
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for chaos scheduling.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
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
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

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

Chaos will automatically schedule runs based on the Chaos Schedule. The Chaos Schedule will be updated if the provided version matches the version on the server. When updating the Chaos Schedule, the version on the server is incremented by 1. The version on the server will wrap back to 0 after reaching a large number. If Chaos is running when this call is made, the call will fail.

### Arguments

|Argument|Description|
| --- | --- |
| --chaos-parameters-dictionary | JSON encoded list representing a mapping of string names to ChaosParameters to be used by Jobs. |
| --expiry-date-utc | The date and time for when to stop using the Schedule to schedule Chaos.  Default\: 9999-12-31T23\:59\:59.999Z. |
| --jobs | JSON encoded list of ChaosScheduleJobs representing when to run Chaos and with what parameters to run Chaos with. |
| --start-date-utc | The date and time for when to start using the Schedule to schedule Chaos.  Default\: 1601-01-01T00\:00\:00.000Z. |
| --timeout -t | Default\: 60. |
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

The following command sets a schedule (assuming the current schedule has version 0) that starts
on 2016-01-01 and expires on 2038-01-01 that runs Chaos 24 hours of the day, 7 days a week.
Chaos will be scheduled on the cluster for that time.
```
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
```



## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).
