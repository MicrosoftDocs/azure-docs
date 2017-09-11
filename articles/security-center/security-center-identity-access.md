---
title: Monitoring Identity and Access in Azure Security Center | Microsoft Docs
description: This document helps you to use identity and access capability in Azure Security Center to monitor your user's access activity and identity related issues.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 9f04e730-4cfa-4078-8eec-905a443133da
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: yurid

---
# Monitoring Identity and Access in Azure Security Center
This document helps you use Azure Security Center to monitor user’s identity, and access activity.

## Why monitor identity and access?
Identity should be the control plane for your enterprise, protecting your identity should be your top priority. While in the past there were perimeters around organizations and those perimeters were one of the primary defensive boundaries, nowadays with more data and more apps moving to the cloud the identity becomes the new perimeter.

By monitoring your identity activities you will be able to take proactive actions before an incident takes place or reactive actions to stop an attack attempt. The Identity and Access dashboard provides you an overview of your identity state, including the number of failed attempts to log on, the user’s account that were used during those attempts, accounts that were locked out, accounts with changed or reset password and currently number of accounts that are logged in.

## How to monitor identity and access activities?
Follow the steps below to visualize the current activities related identity and access, you need to access the **Identity & Access** dashboard:

1.	Open **Security Center** dashboard.
2.	In the left pane, under **Prevention** click **Identity & Access**. If you have multiple workspaces, the workspace selector appears.

	![workspace selection](./media/security-center-identity-access\security-center-identity-access-fig1.png)

	> [!NOTE]
	> If the last column shows **UPGRADE PLAN** is because this workspace is using the free subscription, and you need to upgrade to standard to use this feature. If it shows REQUIRES UPDATE is because you need to update the [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) in order to use this feature. For more information about the pricing plan, read Azure Security Center pricing. 
	> 
3. If you have more than one workspace to investigate, you may prioritize the investigation according to the **FAILED LOGONS** column that shows the current number unsuccessful logons attempts in this workspace. Select the workspace that you want to use, and then the **Identity & Access** dashboard appears.

	![identity and access](./media/security-center-identity-access\security-center-identity-access-fig2.png)

4. The information available in this dashboard can immediately assist you to identify a potential suspicious activity. This dashboard is divided three major areas:
	* **Identity posture**: summarizes the identity related activities that are taking place in this workspace.
	* **Failed logons**: helps you to quickly identify the main cause for failed logon attempt, and shows a list of the top ten accounts that most failed attempting to logon.
	* **Logons overtime**: helps you to quick identify the amount of logon overtime, and shows a list of the top computer accounts logon attempts.
	
Regardless of which tile you select, the dashboard that will appear is based on the Log Search  query, the only difference is the type of query, and the result. You can still select an item, for example a computer, click on it and see relevant data. 

## See also
In this document, you learned how to monitor identity and access in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Managing and responding to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts, and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understanding security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center Troubleshooting Guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center. 
* [Azure Security Center FAQ](security-center-faq.md). Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.

