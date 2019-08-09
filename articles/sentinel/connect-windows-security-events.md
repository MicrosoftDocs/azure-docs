---
title: Connect Windows security event data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Windows security event data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: d51d2e09-a073-41c8-b396-91d60b057e6a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2019
ms.author: rkarlin

---
# Connect Windows security events 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream all security events from the Windows Servers connected to your Azure Sentinel workspace. This connection enables you to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities.  You can select which events to stream:

- **All events** - All Windows security and AppLocker events.
- **Common** - A standard set of events for auditing purposes. A full user audit trail is included in this set. For example, this set contains both user sign in and user sign out events (event ID 4634). We include auditing actions like security group changes, key domain controller Kerberos operations, and other events that are recommended by industry organizations.

Events that have very low volume were included in the Common set as the main motivation to choose it over all the events is to reduce the volume and not to filter out specific events.
- **Minimal** - A small set of events that might indicate potential threats. By enabling this option, you won't be able to have a full audit trail.  This set covers only events that might indicate a successful breach and important events that have a very low volume. For example, this set contains user successful and failed login (event IDs 4624, 4625), but it doesn’t contain sign out information which is important for auditing but not meaningful for detection and has relatively high volume. Most of the data volume of this set is the sign in events and process creation event (event ID 4688).
- **None** - No security or AppLocker events.

> [!NOTE]
> 
> - Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

The following list provides a complete breakdown of the Security and App Locker event IDs for each set:

| Data tier | Collected event indicators |
| --- | --- |
| Minimal | 1102,4624,4625,4657,4663,4688,4700,4702,4719,4720,4722,4723,4724,4727,4728,4732,4735,4737,4739,4740,4754,4755, |
| | 4756,4767,4799,4825,4946,4948,4956,5024,5033,8001,8002,8003,8004,8005,8006,8007,8222 |
| Common | 1,299,300,324,340,403,404,410,411,412,413,431,500,501,1100,1102,1107,1108,4608,4610,4611,4614,4622, |
| |  4624,4625,4634,4647,4648,4649,4657,4661,4662,4663,4665,4666,4667,4688,4670,4672,4673,4674,4675,4689,4697, |
| | 4700,4702,4704,4705,4716,4717,4718,4719,4720,4722,4723,4724,4725,4726,4727,4728,4729,4733,4732,4735,4737, |
| | 4738,4739,4740,4742,4744,4745,4746,4750,4751,4752,4754,4755,4756,4757,4760,4761,4762,4764,4767,4768,4771, |
| | 4774,4778,4779,4781,4793,4797,4798,4799,4800,4801,4802,4803,4825,4826,4870,4886,4887,4888,4893,4898,4902, |
| | 4904,4905,4907,4931,4932,4933,4946,4948,4956,4985,5024,5033,5059,5136,5137,5140,5145,5632,6144,6145,6272, |
| | 6273,6278,6416,6423,6424,8001,8002,8003,8004,8005,8006,8007,8222,26401,30004 |

## Set up the Windows security events connector

To fully integrate your Windows security events with Azure Sentinel:

1. In the Azure Sentinel portal, select **Data connectors** and then click on the **Windows security events** tile. 
1. Select which data types you want to stream.
1. Click **Update**.
6. To use the relevant schema in Log Analytics for the Windows security events, search for **SecurityEvent**.

## Validate connectivity

It may take around 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Windows security events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

