---
title: Monitor identity and access in Azure Security Center | Microsoft Docs
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
ms.date: 09/13/2017
ms.author: yurid

---
# Monitor identity and access in Azure Security Center
This document helps you use Azure Security Center to monitor users' identity and access activity.

## Why monitor identity and access?
Identity should be the control plane for your enterprise, and protecting your identity should be your top priority. In the past, there were perimeters around organizations, and those perimeters were one of the primary defensive boundaries. Nowadays, with more data and more apps moving to the cloud, identity becomes the new perimeter.

By monitoring identity activities, you can take proactive actions before an incident takes place or reactive actions to stop an attack attempt. The Identity & Access dashboard provides you with an overview of your identity state, including the:

* Number of failed attempts to log on. 
* The users' accounts that were used during those attempts.
* Accounts that were locked out.
* Accounts with changed or reset passwords. 
* The current number of accounts that are logged in.

## Monitor identity and access activities
To see current activities related to identity and access, you need to access the **Identity & Access** dashboard.

1. Open the **Security Center** dashboard.

2. In the left pane, under **Prevention**, select **Identity & Access**. If you have multiple workspaces, the workspace selector appears.

	![Workspace selection](./media/security-center-identity-access\security-center-identity-access-fig1.png)

	> [!NOTE]
	> If the column on the far right shows **UPGRADE PLAN**, this workspace is using the free subscription. You need to upgrade to the Standard subscription to use this feature. If the  column on the far right shows **REQUIRES UPDATE**, you need to update [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) to use this feature. For more information about the pricing plan, read Security Center pricing. 
	> 
3. If you have more than one workspace to investigate, you can prioritize the investigation according to the **FAILED LOGONS** column. It shows the current number of unsuccessful logon attempts in this workspace. Select the workspace that you want to use, and the **Identity & Access** dashboard appears.

	![Identity & Access](./media/security-center-identity-access\security-center-identity-access-fig2.png)

4. The information available in this dashboard can immediately assist you in identifying potential suspicious activity. The dashboard is divided into three major areas:

	a. **Identity posture**. Summarizes the identity-related activities that take place in this workspace.

	b. **Failed logons**. Helps you to quickly identify the main cause for failed logon attempts. Shows a list of the top 10 accounts that failed the most attempts to log on.

	c. **Logons over time**. Helps you to quickly identify the amount of logons over time. It shows a list of the top computer account logon attempts.
	
Regardless of which tile you select, the dashboard that appears is based on the [log search  query](https://docs.microsoft.com/azure/security-center/security-center-search). The only difference is the type of query and the result. You can still select an item, for example, a computer, and see relevant data. 

## See also
In this document, you learned how to monitor identity and access in Security Center. To learn more about Security Center, see the following:

* [Manage and respond to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understand security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center troubleshooting guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center. 
* [Azure Security Center FAQ](security-center-faq.md). Find frequently asked questions about using Security Center.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.

