---
title: Azure DDoS Rapid Response
description: Learn how to engage DDoS experts during an active attack for specialized support.
services: ddos-protection
documentationcenter: na
author: yitoh
ms.service: ddos-protection
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2020
ms.author: yitoh

---
# Azure DDoS Rapid Response

During an active access, Azure DDoS Protection Standard customers have access to the DDoS Rapid Response (DRR) team, who can help with attack investigation during an attack as well as post-attack analysis.

## Prerequisites

- Before you can complete the steps in this tutorial, you must first create a [Azure DDoS Standard protection plan](manage-ddos-protection.md).

## When to engage DRR

You should only engage DRR if: 

- During a DDoS attack if you find that the performance of the protected resource is severely degraded, or the resource is not available. Review step 2 above on configuring monitors to detect resource availability and performance issues.
- You think your resource is under DDoS attack, but DDoS Protection service is not mitigating the attack effectively.
- You're planning a viral event that will significantly increase your network traffic.
- For attacks that have a critical business impact.

## Engage DRR during an active attack

1. From Azure portal while creating a new support request, choose **Issue Type** as Technical.
2. Choose **Service** as **DDOS Protection**.
3. Choose a resource in the resource drop down menu. _You must select a DDoS Plan that’s linked to the virtual network being protected by DDoS Protection Standard to engage DRR._

    ![Choose Resource](./media/ddos-rapid-response/choose-resource.png)

4. On the next **Problem** page select the **severity** as A -Critical Impact and **Problem Type** as ‘Under attack.’

    ![PSeverity and Problem Type](./media/ddos-rapid-response/severity-and-problem-type.png)

5. Complete additional details and submit the support request.

DRR follows the Azure Rapid Response support model. Refer to [Support scope and responsiveness](https://azure.microsoft.com/en-us/support/plans/response/) for more information on Rapid Response..

To learn more, read the [DDoS Protection Standard documentation](https://docs.microsoft.com/azure/virtual-network/ddos-protection-overview).

## Next steps

- Learn how to [test through simulations](test-through-simulations.md).
- Learn how to [view and configure DDoS protection telemetry](telemetry-monitoring-alerting.md).
- Learn how to [configure DDoS attack mitigation reports and flow logs](reports-and-flow-logs.md).