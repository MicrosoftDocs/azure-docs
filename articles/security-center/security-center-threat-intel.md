---
title: Threat intelligence and Security alert map in Azure Security Center | Microsoft Docs
description: Learn how to use the security alert map and threat intelligence capability in Azure Security Center to identify potential threats in your VMs and computers.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: a771a3a1-2925-46ca-8e27-6f6a0746f58b
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/3/2018
ms.author: rkarlin

---
# Security alerts map and threat intelligence
This article helps you to use the Azure Security Center security alerts map and security event-based threat intelligence map to address security-related issues.

> [!NOTE]
> The Security *events* map button has been retired on July 31st, 2019. For more information and alternative services, see [Retirement of Security Center features (July 2019)](security-center-features-retirement-july2019.md#menu_securityeventsmap).


## How the security alerts map works
Security Center provides you with a map that helps you identify security threats against the environment. For example, you can identify whether a particular computer is part of a botnet, and where the threat is coming from. Computers can become nodes in a botnet when attackers illicitly install malware that secretly interacts with command and control that manage the botnet. 

To build this map, Security Center uses data that comes from multiple sources within Microsoft. Security Center uses this data to map potential threats against your environment. 

One of the steps of a [security incident response process](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide#incident-response) is to identify the severity of the compromised system(s). In this phase, you should perform the following tasks:

- Determine the nature of the attack.
- Determine the point of origin of the attack.
- Determine the intent of the attack. Was the attack directed at your organization to acquire specific information, or was it random?
- Identify the systems that were compromised.
- Identify the files that were accessed and determine the sensitivity of those files.

You can use the Security alerts map in Security Center to help with these tasks.

## Access the Security alerts map
To visualize the current threats on your environment, open the Security alerts map:

1. Open the **Security Center** dashboard.
2. In the left pane, under **Threat Protection** select **Security alerts map**. The map opens.
3. To get more information about the alert and receive remediation steps, click on the Alert dot on the map and follow the instructions. 
 
The security alerts map is based on alerts. These alerts are based on activities for which network communication was associated with an IP address that was successfully resolved, whether or not the IP address is a known risky IP address (for example, a known cryptominer) or an IP address that is not recognized previously as risky. 
The map provides alerts across any subscriptions you previously selected in Azure. 

The alerts on the map are displayed according to the geographical location where they are detected as originating from, and they are color coded by severity. 
 	![Threat intelligence information](./media/security-center-threat-intel/security-center-alert-map.png)



## See also
In this article, you learned how to use threat intelligence in Security Center to assist you in identifying suspicious activity. To learn more about Security Center, see the following articles:

* [Manage and respond to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understand security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center troubleshooting guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center.
* [Azure Security Center FAQ](security-center-faq.md). Find answers to frequently asked questions about using the service.
* [Azure security blog](https://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
