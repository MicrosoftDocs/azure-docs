---
title: Threat intelligence in Azure Security Center | Microsoft Docs
description: Learn how to use the threat intelligence capability in Azure Security Center to identify potential threats in your VMs and computers.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: a771a3a1-2925-46ca-8e27-6f6a0746f58b
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/13/2017
ms.author: yurid

---
# Threat intelligence in Azure Security Center
This article helps you to use Azure Security Center threat intelligence to address security-related issues.

## What is threat intelligence?
By using the threat intelligence option available in Security Center, IT administrators can identify security threats against the environment. For example, they can identify whether a particular computer is part of a botnet. Computers can become nodes in a botnet when attackers illicitly install malware that secretly connects the computer to the command and control. Threat intelligence can also identify potential threats coming from underground communication channels, such as the dark web.

To build this threat intelligence, Security Center uses data that comes from multiple sources within Microsoft. Security Center uses this data to identify potential threats against your environment. The **Threat intelligence** pane is composed of three major options:

- Detected threat types
- Threat origin
- Threat intelligence map


## When should you use threat intelligence?
One of the steps of a [security incident response process](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide#incident-response) is to identify the severity of the compromised system(s). In this phase, you should perform the following tasks:

- Determine the nature of the attack.
- Determine the attack point of origin.
- Determine the intent of the attack. Was the attack directed at your organization to acquire specific information, or was it random?
- Identify the systems that were compromised.
- Identify the files that were accessed and determine the sensitivity of those files.

You can use threat intelligence information in Security Center to help with these tasks. 

## Access the threat intelligence
To visualize the current threat intelligence for your environment, you must first select the workspace where your information resides. If you don't have multiple workspaces, you bypass the workspace selector and go directly to the **Threat intelligence** dashboard. To access the dashboard:

1. Open the **Security Center** dashboard.

2. In the left pane, under **Detection** select **Threat intelligence**. The **Threat intelligence** dashboard appears.

	![Threat intelligence dashboard](./media/security-center-threat-intel/security-center-threat-intel-fig1.png)

	> [!NOTE]
	> If the far-right column shows **UPGRADE PLAN**, this workspace is using the free subscription. Upgrade to Standard to use this feature. If the far-right column shows **REQUIRES UPDATE**, update [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) to use this feature. For more information about the pricing plan, read Azure Security Center pricing. 
	> 
3. If you have more than one workspace to investigate, prioritize the investigation according to the **Malicious IP** column. It shows the current number of malicious IPs in this workspace. Select the workspace that you want to use, and the **Threat intelligence** dashboard appears.

	![Threat intelligence information](./media/security-center-threat-intel/security-center-threat-intel-fig5.png)

4. The dashboard is divided into four tiles:

	a.  **Threat types**. Summarizes the type of threats that were detected in the selected workspace.

	b.  **Origin country**. Aggregates the amount of traffic according to its source location.

	c.  **Threat location**. Helps you to identify the current locations around the globe that communicate with your environment. In the map shown, orange (incoming) and red (outgoing) arrows identify the traffic directions. If you select one of these arrows, the type of threat and the traffic direction appears.

	d.  **Threat details**. Shows more details about the threat that you selected in the map.

Regardless of which tile you select, the dashboard that appears is based on the [Log Search](https://docs.microsoft.com/azure/security-center/security-center-search) query. The only difference is the type of query and the result.

### Threat types
Select the **Threat types** tile to open the **Log Search** dashboard. Filter options appear on the left, and query results appear on the right.

![Log Search](./media/security-center-threat-intel/security-center-threat-intel-fig3.png)

The query result shows the threats by name. You can use the left pane to select the attribute that you want to filter. For example, to see only the threats that are currently connected to the machines, in **SESSIONSTATE**, select **Connected** > **Apply**.

![Session State](./media/security-center-threat-intel/security-center-threat-intel-fig4.png)

For Azure VMs, only the network data that flows through the agent appears in the **Threat intelligence** dashboard. The following data types also are used by threat intelligence:

- CEF Data (Type=CommonSecurityLog)
- WireData (Type= WireData)
- IIS Logs (Type=W3CIISLog)
- Windows Firewall (Type=WindowsFirewall)
- DNS Events (Type=DnsEvents)


## See also
In this article, you learned how to use threat intelligence in Security Center to assist you in identifying suspicious activity. To learn more about Security Center, see the following articles:

* [Manage and respond to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understand security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center troubleshooting guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center. 
* [Azure Security Center FAQ](security-center-faq.md). Find answers to frequently asked questions about using the service.
* [Azure security blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.

