---
title: Pricing of Azure Security Center
description: Azure Security Center is offered in two modes with and without Azure Defender.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 4d1364cd-7847-425a-bb3a-722cb0779f78
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin
---

# Pricing of Azure Security Center
Azure Security Center provides unified security management and advanced threat protection for workloads running in Azure, on-premises, and in other clouds. It delivers visibility and control over hybrid cloud workloads, active defenses that reduce your exposure to threats, and intelligent detection to help you keep pace with rapidly evolving cyber attacks.


## Free option vs Azure Defender enabled

Security Center is offered in two modes:

- **Azure Defender OFF** (Free) - Security Center without Azure Defender is enabled for free on all your Azure subscriptions when you visit the Azure Security Center dashboard in the Azure portal for the first time, or if enabled programmatically via API. Using this free mode provides security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources.

- **Azure Defender ON** - Enabling Azure Defender extends the capabilities of the free mode to workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. Some of the major features of Azure Defender:

    - **Hybrid security** – Get a unified view of security across all of your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
    - **Threat protection alerts** - Advanced behavioral analytics and the Microsoft Intelligent Security Graph provide an edge over evolving cyber-attacks. Leverage built-in behavioral analytics and machine learning to identify attacks and zero-day exploits. Monitor networks, machines, and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
    - **Vulnerability scanning for virtual machines and container registries** - Easily deploy a scanner to all of your virtual machines that provides the industry's most advanced solution for vulnerability management. View, investigate, and remediate the findings directly within Security Center. 
    - **Comprehensive endpoint detection and response (EDR) capabilities** - Azure Defender for servers includes a license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Learn more about the benefits of using Microsoft Defender for Endpoint together with Azure Defender in [Use Security Center's integrated EDR solution](security-center-wdatp.md).
    - **Access and application controls** - Block malware and other unwanted applications by applying machine learning powered recommendations adapted to your specific workloads to create allow and deny lists. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs. This drastically reduces exposure to brute force and other network attacks.
    - **Container security features** - Benefit from vulnerability management and real-time threat protection on your containerized environments. When enabling the **Azure Defender for container registries**, it may take up to 12hrs until all the features are enabled. Charges are based on the number of unique container images pushed to your connected registry. After an image has been scanned once, you won't be charged for it again unless it's modified and pushed once more. 

## Try Azure Defender free for 30 days

Azure Defender is free for the first 30 days. At the end of 30 days, should you choose to continue using the service, we'll automatically start charging for usage.

## Enable Azure Defender

You can protect an entire Azure subscription with Azure Defender and the protections will be inherited by all resources within the subscription.

To enable Azure Defender:

1. From Security Center's main menu, select **Pricing & settings**.
1. Select the subscription that you want to upgrade.
1. Select **Azure Defender on** to upgrade.
1. Select **Save**.

Below is the pricing page for an example subscription. You'll notice that each plan in Azure Defender is priced separately and can be individually set to on or off.

:::image type="content" source="./media/security-center-pricing/pricing-tier-page.png" alt-text="Security Center's pricing page in the portal":::

> [!NOTE]
> To enable all Security Center features including threat protection capabilities, you must enable Azure Defender on the subscription containing the applicable workloads. Enabling it at the workspace level doesn't enable just-in-time VM access, adaptive application controls, and network detections for Azure resources. In addition, the only Azure Defender plans available at the workspace level are Azure Defender for servers and Azure Defender for SQL servers on machines.
>
> You can enable **Azure Defender for Storage accounts** at either the subscription level or resource level.
> You can enable **Azure Defender for SQL** at either the subscription level or resource level.
> You can enable threat protection for **Azure Database for MariaDB/ MySQL/ PostgreSQL** at the resource level only.


## Next steps
In this article, you were introduced to pricing for Security Center. For related material see:

- [How to optimize your Azure workload costs](https://azure.microsoft.com/blog/how-to-optimize-your-azure-workload-costs/)
- [Pricing details in your currency of choice, and according to your region](https://azure.microsoft.com/pricing/details/security-center/)
- You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. [Solution targeting](../operations-management-suite/operations-management-suite-solution-targeting.md) allows you to apply a scope to the solution and target a subset of computers in the workspace. If you are using solution targeting, Security Center lists the workspace as not having a solution.