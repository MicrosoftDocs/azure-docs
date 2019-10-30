---
title: Upgrade to Security Center's Standard tier for enhanced security | Microsoft Docs
description: This article provides information on pricing for Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 4d1364cd-7847-425a-bb3a-722cb0779f78
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/04/2019
ms.author: memildin
---
# Upgrade to Security Center's Standard tier for enhanced security
Azure Security Center provides unified security management and advanced threat protection for workloads running in Azure, on-premises, and in other clouds. It delivers visibility and control over hybrid cloud workloads, active defenses that reduce your exposure to threats, and intelligent detection to help you keep pace with rapidly evolving cyber attacks.

## Pricing tiers
Security Center is offered in two tiers:

- The **Free** tier is enabled on all your Azure subscriptions once you visit the Azure Security Center dashboard in the Azure portal for the first time, or if enabled programmatically via API. The free tier provides security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources.
- The **Standard** tier extends the capabilities of the Free tier to workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. The Standard tier also adds advanced threat detection capabilities, which use built-in behavioral analytics and machine learning to identify attacks and zero-day exploits, access and application controls to reduce exposure to network attacks and malware, and more. You can try the Standard tier for free. Security Center Standard supports Azure resources including VMs, Virtual machine scale sets, App Service, SQL servers, and Storage accounts. If you have Azure Security Center Standard, you can opt out of support based on resource type. 

Most of the free tier security assessments for VMs, as well many of the Standard tier security alerts, require the installation of the Microsoft Monitoring Agent (MMA) capability. You can enable Auto Provision on Security Center to automatically deploy the agent for your Azure VMs.

## Try Standard free for 30 days
The Standard tier is free for the first 30 days. At the end of 30 days, should you choose to continue using the service, we will automatically start charging for usage.

You can upgrade an entire Azure subscription to the Standard tier, which is inherited by all resources within the subscription.

To get the Standard tier:

1. Select **Pricing & settings** on the **Security Center** main menu.
2. Select the subscription that you want to upgrade to Standard.
3. Select **Pricing tier**.
4. Select **Standard** to upgrade.
5. Click **Save**.

(The prices in the image are provided for illustrative purposes only)
[![Security Center Pricing](media/security-center-pricing/pricing-tier-page.png)](media/security-center-pricing/pricing-tier-page.png#lightbox)

> [!NOTE]
> To enable all Security Center features, you must apply the Standard pricing tier to the subscription containing the applicable virtual machines. Configuring pricing for a workspace does not enable just-in-time VM access, adaptive application controls, and network detections for Azure resources.
>

## Why upgrade to Standard?
Security Center offers enhanced security and threat protection for your hybrid cloud workloads, including:

- **Hybrid security** – Get a unified view of security across all of your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
- **Advanced threat detection** - Use advanced analytics and the Microsoft Intelligent Security Graph to get an edge over evolving cyber-attacks.  Leverage built-in behavioral analytics and machine learning to identify attacks and zero-day exploits. Monitor networks, machines, and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
- **Access and application controls** - Block malware and other unwanted applications by applying machine learning powered whitelisting recommendations adapted to your specific workloads. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs. This drastically reduces exposure to brute force and other network attacks.
- **Container security features** - Benefit from vulnerability management and real-time threat detection on your containerized environments. When enabling the container registries resource, it may take up to 12hrs until all the features are enabled.


## Next steps
In this article, you were introduced to pricing for Security Center. To learn more about the Standard tier’s enhanced security and advanced threat protection, see:

- [Advanced threat detection](security-center-threat-report.md)
- [Just-in-time VM access control](security-center-just-in-time.md)
- [Container security overview](container-security.md)
- [Pricing details in your currency of choice, and according to your region](https://azure.microsoft.com/pricing/details/security-center/)