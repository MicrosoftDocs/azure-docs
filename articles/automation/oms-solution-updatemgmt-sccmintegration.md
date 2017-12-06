---
title: Target Updates using SCCM Collections in OMS Update Management | Microsoft Docs
description: This article is intended to help you configure System Center Configuration Manager with this solution to manage updates of SCCM managed computers.
services: operations-management-suite
documentationcenter: ''
author: eslesar
manager: carmonm
editor: ''

ms.assetid: 
ms.service: operations-management-suite
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/25/2017
ms.author: eslesar

---

# Integrate System Center Configuration Manager with OMS Update Management

Customers who have invested in System Center Configuration Manager to manage PCs, servers, and mobile devices also rely on its strength and maturity in managing software updates as part of their software update management (SUM) cycle.  

Building on the existing integration today between OMS and Configuration Manager, you can report and update managed Windows servers by creating and pre-staging software update deployments in Configuration Manager, and get detailed status of completed update deployments using the [Update Management solution](../operations-management-suite/oms-solution-update-management.md). If you use Configuration Manager for update compliance reporting but not for managing update deployments with your Windows servers, you can continue reporting to Configuration Manager  while security updates are managed with the OMS Update Management solution.

## Prerequisites

* You must have the [Update Management solution](../operations-management-suite/oms-solution-update-management.md) added to your Log Analytics workspace and linked together with your Automation account in the same resource group and region.   
* Windows servers currently managed by your System Center Configuration Manager environment also need to report to the Log Analytics workspace that also has the Update Management solution enabled.  
* This feature supports System Center Configuration Manager current branch version 1606 and higher.  To integrate your Configuration Manager central administration site or a stand-alone primary site with Log Analytics and import collections, review [Connect Configuration Manager to Log Analytics](../log-analytics/log-analytics-sccm.md).  
* Windows agents must either be configured to communicate with a Windows Server Update Services (WSUS) server or have access to Microsoft Update if they don't receive security updates from Configuration Manager.   

How you manage clients hosted in Azure IaaS with your existing Configuration Manager environment primarily depends on the connection you have between Azure datacenters and your infrastructure. This connection affects any design changes you may need to make to your Configuration Manager infrastructure and related cost to support those necessary changes.  To understand what planning considerations you need to evaluate before proceeding, review [Configuration Manager on Azure - Frequently Asked Questions](https://docs.microsoft.com/sccm/core/understand/configuration-manager-on-azure#networking).    

## Configuration

### Manage software updates from Configuration Manager 

Perform the following steps if you are going to continue managing update deployments from Configuration Manager.  OMS connects to Configuration Manager to apply updates to the client computers connected to your Log Analytics workspace. Update content is available from the client computer cache as if the deployment were managed by Configuration Manager.  

1. Create a software update deployment from the top-level site in your Configuration Manager hierarchy using the process described in [deploy software update process](https://docs.microsoft.com/en-us/sccm/sum/deploy-use/deploy-software-updates).  The only setting that must be configured differently from a standard deployment is the option **Do not install software updates** to control the download behavior of the deployment package. This behavior is managed by the OMS Update Management solution by creating a scheduled update deployment in the next step.  

1. In the OMS portal, open the Update Management dashboard.  Create a new deployment following the steps described in [Creating an Update Deployment](../operations-management-suite/oms-solution-update-management.md#creating-an-update-deployment) and select the appropriate Configuration Manager collection represented as an OMS computer group from the drop-down list.  Keep in mind the following important points:
    1. If a maintenance window is defined on the selected Configuration Manager device collection, members of the collection honors it instead of the **Duration** setting defined in the scheduled deployment in OMS.
    1. Members of the target collection must have a connection to the Internet (either direct, through a proxy server or through the OMS Gateway).  

After completing the update deployment with the OMS solution, the target computers that are members of the selected computer group will install updates at the scheduled time from their local client cache.  You can [view update deployment status](../operations-management-suite/oms-solution-update-management.md#viewing-update-deployments) to monitor the results of your deployment.  


### Manage software updates from OMS

To manage updates for Windows Server VMs that are Configuration Manager clients, you need to configure client policy to disable the Software Update Management feature for all clients managed by this solution.  By default, client settings target all devices in the hierarchy.  For more information about this policy setting and how to configure it, review [how to configure client settings in System Center Configuration Manager](https://docs.microsoft.com/sccm/core/clients/deploy/configure-client-settings).  

After performing this configuration change, you create a new deployment following the steps described in [Creating an Update Deployment](../operations-management-suite/oms-solution-update-management.md#creating-an-update-deployment) and select the appropriate Configuration Manager collection represented as an OMS computer group from the drop-down list. 

