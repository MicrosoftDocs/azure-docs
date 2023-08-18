---
title: Integrate Azure Automation Update Management with Microsoft Configuration Manager
description: This article tells how to configure Microsoft Configuration Manager with Update Management to deploy software updates to manager clients.
services: automation
ms.subservice: update-management
ms.date: 07/14/2021
ms.topic: conceptual
---

# Integrate Update Management with Microsoft Configuration Manager

Customers who have invested in Microsoft Configuration Manager to manage PCs, servers, and mobile devices also rely on its strength and maturity in managing software updates as part of their software update management (SUM) cycle.

You can report and update managed Windows servers by creating and pre-staging software update deployments in Microsoft Configuration Manager, and get detailed status of completed update deployments using [Update Management](overview.md). If you use Microsoft Configuration Manager for update compliance reporting, but not for managing update deployments with your Windows servers, you can continue reporting to Microsoft Configuration Manager while security updates are managed with Azure Automation Update Management.

>[!NOTE]
>While Update Management supports update assessment and patching of Windows Server 2008 R2, it does not support clients managed by Microsoft Configuration Manager running this operating system.

## Prerequisites

* You must have [Azure Automation Update Management](overview.md) added to your Automation account.
* Windows servers currently managed by your Microsoft Configuration Manager environment also need to report to the Log Analytics workspace that also has Update Management enabled.
* This feature is enabled in Microsoft Configuration Manager current branch version 1606 and higher. To integrate your Microsoft Configuration Manager central administration site or a standalone primary site with Azure Monitor logs and import collections, review [Connect Configuration Manager to Azure Monitor logs](../../azure-monitor/logs/collect-sccm.md).  
* Windows agents must either be configured to communicate with a Windows Server Update Services (WSUS) server or have access to Microsoft Update if they don't receive security updates from Microsoft Configuration Manager.

How you manage clients hosted in Azure IaaS with your existing Microsoft Configuration Manager environment primarily depends on the connection you have between Azure datacenters and your infrastructure. This connection affects any design changes you may need to make to your Microsoft Configuration Manager infrastructure and related cost to support those necessary changes. To understand what planning considerations you need to evaluate before proceeding, review [Configuration Manager on Azure - Frequently Asked Questions](/configmgr/core/understand/configuration-manager-on-azure#networking).

## Manage software updates from Microsoft Configuration Manager

Perform the following steps if you are going to continue managing update deployments from Microsoft Configuration Manager. Azure Automation connects to Microsoft Configuration Manager to apply updates to the client computers connected to your Log Analytics workspace. Update content is available from the client computer cache as if the deployment were managed by Microsoft Configuration Manager.

1. Create a software update deployment from the top-level site in your Microsoft Configuration Manager hierarchy using the process described in [Deploy software updates](/configmgr/sum/deploy-use/deploy-software-updates). The only setting that must be configured differently from a standard deployment is the **Installation deadline** option in Configuration Manager. It needs to be set to a future date to ensure only Automation Update Management initiates the update deployment. This setting is described under [Step 4, Deploy the software update group](/configmgr/sum/deploy-use/manually-deploy-software-updates#BKMK_4DeployUpdateGroup).

2. In Configuration Manager, configure the **User notifications** option to prevent displaying notifications on the target machines. We recommend setting the **Hide in Software Center and all notifications** option to avoid a logged on user from being notified of a scheduled update deployment and manually deploying those updates. This setting is described under [Step 4, Deploy the software update group](/configmgr/sum/deploy-use/manually-deploy-software-updates#BKMK_4DeployUpdateGroup).

3. In Azure Automation, select **Update Management**. Create a new deployment following the steps described in [Creating an Update Deployment](deploy-updates.md#schedule-an-update-deployment) and select **Imported groups** on the **Type** dropdown to select the appropriate Microsoft Configuration Manager collection. Keep in mind the following important points:

    a. If a maintenance window is defined on the selected Microsoft Configuration Manager device collection, members of the collection honor it instead of the **Duration** setting defined in the scheduled deployment.

    b. Members of the target collection must have a connection to the Internet (either direct, through a proxy server or through the Log Analytics gateway).

After completing the update deployment through Azure Automation, the target computers that are members of the selected computer group will install updates at the scheduled time from their local client cache. You can [view update deployment status](deploy-updates.md#check-deployment-status) to monitor the results of your deployment.

## Manage software updates from Azure Automation

To manage updates for Windows Server VMs that are Microsoft Configuration Manager clients, you need to configure client policy to disable the Software Update Management feature for all clients managed by Update Management. By default, client settings target all devices in the hierarchy. For more information about this policy setting and how to configure it, review [How to configure client settings in Configuration Manager](/configmgr/core/clients/deploy/configure-client-settings).

After performing this configuration change, you create a new deployment following the steps described in [Creating an Update Deployment](deploy-updates.md#schedule-an-update-deployment) and select **Imported groups** on the **Type** drop-down to select the appropriate Microsoft Configuration Manager collection.

## Next steps

To set up an integration schedule, see [Schedule an update deployment](deploy-updates.md#schedule-an-update-deployment).
