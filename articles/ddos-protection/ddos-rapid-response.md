---
title: Azure DDoS Rapid Response
description: Learn how to engage DDoS experts during an active attack for specialized support.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/12/2022
ms.author: abell
---
# Azure DDoS Rapid Response

During an active attack, Azure DDoS Network Protection customers have access to the DDoS Rapid Response (DRR) team, who can help with attack investigation during an attack and post-attack analysis.

## Prerequisites

- Before you can complete the steps in this tutorial, you must first create a [Azure DDoS Protection plan](manage-ddos-protection.md).

## When to engage DRR

You should only engage DRR if: 

- During a DDoS attack if you find that the performance of the protected resource is severely degraded, or the resource isn't available. 
- You think your resource is under DDoS attack, but DDoS Protection service isn't mitigating the attack effectively.
- You're planning a viral event that will significantly increase your network traffic.
- For attacks that have a critical business impact.

## Engage DRR during an active attack

1. From Azure portal while creating a new support request, choose **Issue Type** as Technical.
2. Choose **Service** as **DDOS Protection**.
3. Choose a resource in the resource drop-down menu. _You must select a DDoS Plan that’s linked to the virtual network being protected by DDoS Protection to engage DRR._

    ![Choose Resource](./media/ddos-rapid-response/choose-resource.png)

4. On the next **Problem** page, select the **severity** as A -Critical Impact and **Problem Type** as ‘Under attack.’

    ![PSeverity and Problem Type](./media/ddos-rapid-response/severity-and-problem-type.png)

5. Complete additional details and submit the support request.

DRR follows the Azure Rapid Response support model. Refer to [Support scope and responsiveness](https://azure.microsoft.com/support/plans/response/) for more information on Rapid Response.

To learn more, read the [DDoS Protection documentation](./ddos-protection-overview.md).

## Next steps

- Learn how to [test through simulations](test-through-simulations.md).
- Learn how to [view and configure DDoS protection telemetry](telemetry.md).
- Learn how to [view and configure DDoS diagnostic logging](diagnostic-logging.md).
