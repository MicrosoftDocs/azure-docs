---
title: Target Updates using SCCM Collections in Azure Automation - Update Management
description: This article is intended to help you configure System Center Configuration Manager with this solution to manage updates of SCCM managed computers.
services: automation
ms.service: automation
ms.subservice: update-management
author: bobbytreed
ms.author: robreed
ms.date: 03/19/2018
ms.topic: conceptual
manager: carmonm
---

# Integrate System Center Configuration Manager with Update Management

Customers who have invested in System Center Configuration Manager to manage PCs, servers, and mobile devices also rely on its strength and maturity in managing software updates as part of their software update management (SUM) cycle.

You can report and update managed Windows servers by creating and pre-staging software update deployments in Configuration Manager, and get detailed status of completed update deployments using the [Update Management solution](automation-update-management.md). If you use Configuration Manager for update compliance reporting but not for managing update deployments with your Windows servers, you can continue reporting to Configuration Manager  while security updates are managed with the Update Management solution.

## Prerequisites

* You must have the [Update Management solution](automation-update-management.md) added to your Automation account.
* Windows servers currently managed by your System Center Configuration Manager environment also need to report to the Log Analytics workspace that also has the Update Management solution enabled.
* This feature is enabled in System Center Configuration Manager current branch version 1606 and higher. To integrate your Configuration Manager central administration site or a stand-alone primary site with Azure Monitor logs and import collections, review [Connect Configuration Manager to Azure Monitor logs](../azure-monitor/platform/collect-sccm.md).  
* Windows agents must either be configured to communicate with a Windows Server Update Services (WSUS) server or have access to Microsoft Update if they don't receive security updates from Configuration Manager.   

How you manage clients hosted in Azure IaaS with your existing Configuration Manager environment primarily depends on the connection you have between Azure datacenters and your infrastructure. This connection affects any design changes you may need to make to your Configuration Manager infrastructure and related cost to support those necessary changes. To understand what planning considerations you need to evaluate before proceeding, review [Configuration Manager on Azure - Frequently Asked Questions](/sccm/core/understand/configuration-manager-on-azure#networking).

## Configuration

### Manage software updates from Configuration Manager 

Perform the following steps if you are going to continue managing update deployments from Configuration Manager. Azure Automation connects to Configuration Manager to apply updates to the client computers connected to your Log Analytics workspace. Update content is available from the client computer cache as if the deployment were managed by Configuration Manager.

1. Create a software update deployment from the top-level site in your Configuration Manager hierarchy using the process described in [deploy software update process](/sccm/sum/deploy-use/deploy-software-updates). The only setting that must be configured differently from a standard deployment is the option **Do not install software updates** to control the download behavior of the deployment package. This behavior is managed by the Update Management solution by creating a scheduled update deployment in the next step.

1. In Azure Automation, select **Update Management**. Create a new deployment following the steps described in [Creating an Update Deployment](automation-tutorial-update-management.md#schedule-an-update-deployment) and select **Imported groups** on the **Type** drop-down to select the appropriate Configuration Manager collection. Keep in mind the following important points:
    a. If a maintenance window is defined on the selected Configuration Manager device collection, members of the collection honor it instead of the **Duration** setting defined in the scheduled deployment.
    b. Members of the target collection must have a connection to the Internet (either direct, through a proxy server or through the Log Analytics gateway).

After completing the update deployment through Azure Automation, the target computers that are members of the selected computer group will install updates at the scheduled time from their local client cache. You can [view update deployment status](automation-tutorial-update-management.md#view-results-of-an-update-deployment) to monitor the results of your deployment.

### Manage software updates from Azure Automation

To manage updates for Windows Server VMs that are Configuration Manager clients, you need to configure client policy to disable the Software Update Management feature for all clients managed by this solution. By default, client settings target all devices in the hierarchy. For more information about this policy setting and how to configure it, review [how to configure client settings in System Center Configuration Manager](/sccm/core/clients/deploy/configure-client-settings).

After performing this configuration change, you create a new deployment following the steps described in [Creating an Update Deployment](automation-tutorial-update-management.md#schedule-an-update-deployment) and select **Imported groups** on the **Type** drop-down to select the appropriate Configuration Manager collection.

## Next steps

