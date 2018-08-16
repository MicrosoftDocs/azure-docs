---
title: Azure network security group flow log changes | Microsoft Docs
description: Learn about Azure network security group flow log changes.
services: network-watcher
documentationcenter: na
author: jimdial
manager: jeconnoc
editor:

ms.assetid: 
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 08/16/2018
ms.author: jdial
---

# Network security group flow logs -Version 2 – Upcoming changes

The network security group flow logs format is changing, beginning September 15, 2018. Added fields provide you with information on the flow state, and incremental counts of bytes and packets transferred in each direction. Applications that parse flow logs will be affected by this change, and need to be updated accordingly. This article outlines the details of the change.

## What is changing?

The version of network security group flow logs will change from "Version": 1 to "Version": 2, with additional fields added to the *flowTuples* property in the logs. Details on the format are provided in [How a flow is modeled in version 2](#how-is-a-flow-modeled-in-version-2).

### Version 1 flow tuple format

```
"1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,D"
```

### Version 2 flow tuple format

```
"1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,A,C,1,103,1,186"
```

## When will this change take place?

This change will go into effect beginning **September 15, 2018** in the West Central US region. Rollout of the change in public cloud regions will complete by November 31, 2018, after which only version 2 logs will be available.

## Am I affected by the change?

You may be affected by this change if you build or use an application that processes network security group flow log data.

### If I use Traffic Analytics?

No. Traffic Analytics won't be impacted during the transition from version 1 to version 2 flow logging. Enhancements coming soon will take advantage of the additional session and bandwidth information provided in version 2 flow logs.

### If I’m using third party tooling?

The change in log format has been communicated in advance with all [Network Watcher partners](https://azure.microsoft.com/services/network-watcher). Reach out to your vendor for details.

### If I have built a custom application or integration?

**Yes**, you will need to modify your application to process NSG Flow Logs in the new format.

## What is the new flow logging format?

Flow logs version 2 contains flow tuples in the following format:

```
"1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,A,C,1,103,1,186".
```

The table that follows provides property names and descriptions for the network security group version 2 flow tuple. Complete sample records can be found in [Version 2 sample event](#version2sampleevent).

| Property name                        | Value           | Description                                                                                                                                                 |
| ------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Time stamp                           | 1493763938      | Timestamp corresponding to the flow entry. UNIX EPOCH format is used.                                                                                       |
| Source IP address                    | 185.170.185.105 |                                                                                                                                                             |
| Destination IP address               | 10.2.0.4        |                                                                                                                                                             |
| Source port                          | 35370           |                                                                                                                                                             |
| Destination port                     | 23              |                                                                                                                                                             |
| Traffic protocol                     | T               | **T**: TCP and **U**: UDP.                                                                                                                                  |
| Traffic flow direction               | I               | **I**: Inbound traffic and **O**: Outbound traffic.                                                                                                         |
| Traffic decision                     | A               | **A**: Flow was allowed and **D**: Flow was denied.                                                                                                         |
| Flow state                           | C               | **B**: Begin, when a flow is created. Statistics aren't provided. **C**: Continuing for an ongoing flow. Statistics are provided at 5-minute intervals. **E**: End, when a flow is terminated. Statistics are provided.                                                                                                                                                        |
| Packets - Source to destination      | 1               | The total number of TCP and UDP packets sent from source to destination since last update.                                                                  |
| Bytes sent - Source to destination   | 103             | The total number of TCP and UDP packet bytes sent from source to destination since last update. Packet bytes include the packet header and payload.         |
| Packets sent - Destination to source | 1               | The total number of TCP and UDP packets sent from destination to source since last update.                                                                  |
| Bytes sent - Destination to source   | 186             | The total number of TCP and UDP packet bytes sent from destination to source since last update. Packet bytes include packet header and payload.             |

## How is a flow modeled in version 2?

Version 2 of the logs introduces flow state. Flow state *B* is recorded when a flow is initiated. Flow state *C* and flow state *E* are states that mark the continuation of a flow and flow termination, respectively. Both *C* and *E* states contain traffic bandwidth information.

**Example**: Flow tuples from a TCP conversation between 185.170.185.105:35370 and 10.2.0.4:23:

"1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,A,B,,,,"
"1493695838,185.170.185.105,10.2.0.4,35370,23,T,I,A,C,1021,588096,8005,4610880"
"1493696138,185.170.185.105,10.2.0.4,35370,23,T,I,A,E,52,29952,47,27072"

### How does the format differ from version 1?

In version 1, a flow tuple ["1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,D"] is created every time a flow is established or attempted to be established (deny case).

### How are bytes and packets accounted for?

For continuation *C* and end *E* flow states, byte and packet counts are aggregate counts from the time of the previous flow tuple record. Referencing the previous example conversation, the total number of packets transferred is 1021+52+8005+47 = 9125. The total number of bytes transferred is 588096+29952+4610880+27072 = 5256000.

### If my application doesn’t understand the traffic bandwidth fields, how does version 2 affect the application?

Applications using version 1 network security group flow logging typically count the number of unique flows. If no change in parsing is made to account for flow state, you may see an inaccurate increase in the number of flows reported. Counting unique flows can be accomplished by ignoring flow tuples in *C* and *E* flow states.

## Can I control the version format I receive?

No. Enabling and disabling flow logs won't affect the output format of the logs. The change from version 1 to version 2 logs will occur on a region by region basis. When a region is upgrading from version 1 to version 2, you may see NSG flow logs in both formats. After the rollout completes, only version 2 logs will be available.

## While the change occurs, can I see both formats for the same network security group?

Yes. Within a region, the transition will occur on a per-mac address basis. Since a network security group can be applied to many machines, you may see logs in both formats written to storage. Logs will either be version 1 or version 2.

## Will I see duplicate data?

There won't be duplication of flow logging data across formats. A flow will be recorded in either Version 1 or Version 2 format, while the change occurs.

## How can I test the new format ahead of time?

Yes. You can [download](https://aka.ms/nsgflowlogsv2blobsample) a sample version 2 flow log file to use for testing your solution.

## Are there changes to configuration and management of network security group flow logging?

No. Support for Azure Storage accounts across subscriptions that share the same Azure Active Directory tenant was [released](https://azure.microsoft.com/blog/new-azure-network-watcher-integrations-and-network-security-group-flow-logging-updates/) earlier this year. This change helps you reduce the number of storage accounts
needed when managing network security group flow logs.

## Questions or feedback?

We look forward to hearing about your experience with network security group flow logs and Network Watcher. You can provide feedback or suggestions online, or by email at AzureNetworkWatcher@microsoft.com.

## Version 2 sample

```json
{

"records": [

{

"time": "2018-08-03T17:00:54.5657764Z",

"systemId": "bbd48473-8ce0-4834-99bb-2e13b9b23ff8",

"category": "NetworkSecurityGroupFlowEvent",

"resourceId":
"/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FLOWLOGSV2DEMO/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MULTITIERAPP2-NSG",

"operationName": "NetworkSecurityGroupFlowEvents",

"properties": {

"Version": 2,

"flows": [

{

"rule": "DefaultRule_AllowInternetOutBound",

"flows": [

{

"mac": "002248034CC3",

"flowTuples": [

"1533315592,10.1.1.6,204.79.197.200,62375,80,T,O,A,B,,,,",

"1533315595,10.1.1.6,204.79.197.200,62373,80,T,O,A,E,30,1784,92,123631",

"1533315597,10.1.1.6,204.79.197.200,62376,80,T,O,A,B,,,,",

"1533315601,10.1.1.6,204.79.197.200,62374,80,T,O,A,E,13,866,87,123079",

"1533315603,10.1.1.6,204.79.197.200,62377,80,T,O,A,B,,,,",

"1533315604,10.1.1.6,204.79.197.200,62375,80,T,O,A,E,33,1946,90,123247",

"1533315608,10.1.1.6,204.79.197.200,62378,80,T,O,A,B,,,,",

"1533315610,10.1.1.6,204.79.197.200,62376,80,T,O,A,E,20,1244,92,123355",

"1533315613,10.1.1.6,204.79.197.200,62379,80,T,O,A,B,,,,",

"1533315616,10.1.1.6,204.79.197.200,62377,80,T,O,A,E,24,1460,92,123355",

"1533315619,10.1.1.6,204.79.197.200,62380,80,T,O,A,B,,,,",

"1533315622,10.1.1.6,204.79.197.200,62378,80,T,O,A,E,23,1406,93,123409",

"1533315624,10.1.1.6,204.79.197.200,62381,80,T,O,A,B,,,,",

"1533315628,10.1.1.6,204.79.197.200,62379,80,T,O,A,E,16,1028,88,123133",

"1533315630,10.1.1.6,204.79.197.200,62382,80,T,O,A,B,,,,",

"1533315631,10.1.1.6,204.79.197.200,62380,80,T,O,A,E,13,866,87,123079",

"1533315635,10.1.1.6,204.79.197.200,62384,80,T,O,A,B,,,,",

"1533315637,10.1.1.6,204.79.197.200,62381,80,T,O,A,E,15,974,86,123025",

"1533315640,10.1.1.6,204.79.197.200,62385,80,T,O,A,B,,,,",

"1533315643,10.1.1.6,204.79.197.200,62382,80,T,O,A,E,16,1028,88,123139",

"1533315646,10.1.1.6,204.79.197.200,62386,80,T,O,A,B,,,,",

"1533315649,10.1.1.6,204.79.197.200,62384,80,T,O,A,E,21,1298,92,123355",

"1533315651,10.1.1.6,204.79.197.200,62387,80,T,O,A,B,,,,"

]

}

]

}

]

}

},

{

"time": "2018-08-03T17:01:54.5668880Z",

"systemId": "bbd48473-8ce0-4834-99bb-2e13b9b23ff8",

"category": "NetworkSecurityGroupFlowEvent",

"resourceId":
"/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FLOWLOGSV2DEMO/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/MULTITIERAPP2-NSG",

"operationName": "NetworkSecurityGroupFlowEvents",

"properties": {

"Version": 2,

"flows": [

{

"rule": "DefaultRule_DenyAllInBound",

"flows": [

{

"mac": "002248034CC3",

"flowTuples": [

"1533315685,80.211.83.37,10.1.1.6,45321,81,T,I,D,B,,,,"

]

}

]

},

{

"rule": "DefaultRule_AllowInternetOutBound",

"flows": [

{

"mac": "002248034CC3",

"flowTuples": [

"1533315655,10.1.1.6,204.79.197.200,62385,80,T,O,A,E,20,1244,87,123079",

"1533315657,10.1.1.6,204.79.197.200,62388,80,T,O,A,B,,,,",

"1533315658,10.1.1.6,204.79.197.200,62386,80,T,O,A,E,26,1568,92,123355",

"1533315662,10.1.1.6,204.79.197.200,62389,80,T,O,A,B,,,,",

"1533315664,10.1.1.6,204.79.197.200,62387,80,T,O,A,E,15,974,88,123133",

"1533315667,10.1.1.6,204.79.197.200,62390,80,T,O,A,B,,,,",

"1533315670,10.1.1.6,204.79.197.200,62388,80,T,O,A,E,18,1136,88,123139",

"1533315673,10.1.1.6,204.79.197.200,62391,80,T,O,A,B,,,,",

"1533315676,10.1.1.6,204.79.197.200,62389,80,T,O,A,E,14,920,87,123079",

"1533315678,10.1.1.6,204.79.197.200,62392,80,T,O,A,B,,,,",

"1533315679,10.1.1.6,204.79.197.200,62390,80,T,O,A,E,31,1838,94,123739",

"1533315684,10.1.1.6,204.79.197.200,62393,80,T,O,A,B,,,,",

"1533315685,10.1.1.6,204.79.197.200,62391,80,T,O,A,E,28,1676,101,141199",

"1533315689,10.1.1.6,204.79.197.200,62394,80,T,O,A,B,,,,",

"1533315691,10.1.1.6,204.79.197.200,62392,80,T,O,A,E,21,1298,93,123409",

"1533315694,10.1.1.6,204.79.197.200,62395,80,T,O,A,B,,,,",

"1533315697,10.1.1.6,204.79.197.200,62393,80,T,O,A,E,26,1568,91,123393",

"1533315700,10.1.1.6,204.79.197.200,62396,80,T,O,A,B,,,,",

"1533315703,10.1.1.6,204.79.197.200,62394,80,T,O,A,E,14,920,89,123187",

"1533315705,10.1.1.6,204.79.197.200,62397,80,T,O,A,B,,,,",

"1533315706,10.1.1.6,204.79.197.200,62395,80,T,O,A,E,13,866,87,123079",

"1533315711,10.1.1.6,204.79.197.200,62398,80,T,O,A,B,,,,"

]

}

]

}

]

}

}

]

}
```

## Version 1 sample

```json
{ 

    "records": [ 

        { 

            "time": "2017-02-16T22:00:32.8950000Z", 

            "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434", 

            "category": "NetworkSecurityGroupFlowEvent", 

            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG", 

            "operationName": "NetworkSecurityGroupFlowEvents", 

            "properties": { 

                "Version": 1, 

                "flows": [ 

                    { 

                        "rule": "DefaultRule_DenyAllInBound", 

                        "flows": [ 

                            { 

                                "mac": "000D3AF8801A", 

                                "flowTuples": [ 

                                    "1487282421,42.119.146.95,10.1.0.4,51529,5358,T,I,D" 

                                ] 

                            } 

                        ] 

                    }, 

                    { 

                        "rule": "UserRule_default-allow-rdp", 

                        "flows": [ 

                            { 

                                "mac": "000D3AF8801A", 

                                "flowTuples": [ 

                                    "1487282370,163.28.66.17,10.1.0.4,61771,3389,T,I,A", 

                                    "1487282393,5.39.218.34,10.1.0.4,58596,3389,T,I,A", 

                                    "1487282393,91.224.160.154,10.1.0.4,61540,3389,T,I,A", 

                                    "1487282423,13.76.89.229,10.1.0.4,53163,3389,T,I,A" 

                                ] 

                            } 

                        ] 

                    } 

                ] 

            } 

        }, 

        { 

            "time": "2017-02-16T22:01:32.8960000Z", 

            "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434", 

            "category": "NetworkSecurityGroupFlowEvent", 

            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG", 

            "operationName": "NetworkSecurityGroupFlowEvents", 

            "properties": { 

                "Version": 1, 

                "flows": [ 

                    { 

                        "rule": "DefaultRule_DenyAllInBound", 

                        "flows": [ 

                            { 

                                "mac": "000D3AF8801A", 

                                "flowTuples": [ 

                                    "1487282481,195.78.210.194,10.1.0.4,53,1732,U,I,D" 

                                ] 

                            } 

                        ] 

                    }, 

                    { 

                        "rule": "UserRule_default-allow-rdp", 

                        "flows": [ 

                            { 

                                "mac": "000D3AF8801A", 

                                "flowTuples": [ 

                                    "1487282435,61.129.251.68,10.1.0.4,57776,3389,T,I,A",

                                    "1487282454,84.25.174.170,10.1.0.4,59085,3389,T,I,A",

                                    "1487282477,77.68.9.50,10.1.0.4,65078,3389,T,I,A"

                                ] 

                            } 

                        ] 

                    } 

                ] 

            } 

        } 

    ] 
}
```