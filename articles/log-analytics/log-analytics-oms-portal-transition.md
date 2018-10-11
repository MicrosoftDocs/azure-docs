---
title: OMS portal moving to Azure | Microsoft Docs
description: The OMS portal is being sunsetted with all functionality moving to the Azure portal. This article provides details on this transition.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/27/2018
ms.author: bwren
ms.component: 
---

# OMS portal moving to Azure

> [!NOTE]
> This article applies to both the Azure public cloud and government cloud except where noted otherwise.

The Azure portal is the hub for all Azure services and offers a rich management experience with capabilities such as dashboards for pinning resources, intelligent search for finding resources, and tagging for resource management. To consolidate and streamline the monitoring and management workflow, we started adding the OMS portal capabilities into the Azure portal. All of the features of the OMS portal are now part of the Azure portal. In fact, some of the new features such as Traffic Analytics are only available in the Azure portal. You will be able to accomplish everything you were doing in the OMS portal with the Azure portal and more. If you haven’t already done so, you should start using the Azure portal today!

**The OMS portal will be officially retired on January 15, 2019.** We are excited to move to the Azure portal and expect the transition to be easy. But we understand changes are difficult and can be disruptive. Send any questions, feedback, or concerns to **LAUpgradeFeedback@microsoft.com**. The rest of this article goes over the key scenarios and the roadmap for this transition.

## What is changing? 
The following changes are being announced with the deprecation of the OMS portal. Each of these changes is described in more detail in the sections below.

- You can create new [workspaces only](#new-workspaces) in the Azure portal.
- The new alert management experience [replaces the Alert Management solution](#changes-to-alerts).
- [User access management](#user-access-and-role-migration) is now done in the Azure portal using Azure role-based access control.
- The [Application Insights Connector is no longer required](#application-insights-connector-and-solution) since the same functionality is enabled through cross-workspace queries.
- The [OMS Mobile App](#oms-mobile-app) is being deprecated. 
- The [NSG solution is being replaced](#azure-network-security-group-analytics) with enhanced functionality available via Traffic Analytics solution.
- New connections from System Center Operations Manager to Log Analytics require [updated management packs](#system-center-operations-manager).
- See [Migrate your OMS Update Deployments to Azure](../automation/migrate-oms-update-deployments.md) for details on changes to [Update Management](../automation/automation-update-management.md).


## What should I do now?
While most features will continue to work without performing any migration, you do need to perform the following tasks:

- You need to [migrate your user permissions](#user-access-and-role-migration) to the Azure portal.
- See [Migrate your OMS Update Deployments to Azure](../automation/migrate-oms-update-deployments.md) for details on transitioning the Update Management solution.

Refer to [Common questions for transition from OMS portal to Azure portal for Log Analytics users](../log-analytics/log-analytics-oms-portal-faq.md) for information about how to transition to the Azure portal. Send any feedback, questions, or concerns to **LAUpgradeFeedback@microsoft.com**.

## User access and role migration
Azure portal access management is richer and more powerful than the access management in the OMS Portal. See [Manage workspaces](log-analytics-manage-access.md#manage-accounts-and-users) for details of access management in Log Analytics.

> [!NOTE]
> Previous versions of this article stated that the permissions would automatically be converted from the OMS portal to the Azure portal. This automatic conversation is no longer planned, and you must perform the conversion yourself.

You may already have appropriate access in the Azure portal in which case you don't need to make any changes. There are a couple of cases where you may not have appropriate access in which case your administrator must assign you permissions.

- You have ReadOnly User permissions in the OMS portal but no permissions in the Azure portal. 
- You have Contributor permissions in the OMS portal but only Reader access in the Azure portal.
 
In both of these cases, your administrator needs to manually assign you the appropriate role from the following table. We recommend that you assign this role at the resource group or subscription level.  More prescriptive guidance will be provided shortly for both these cases.

| OMS portal permission | Azure Role |
|:---|:---|
| ReadOnly | Log Analytics Reader |
| Contributor | Log Analytics Contributor |
| Administrator | Owner | 
 

## New workspaces
You are no longer be able to create new workspaces using the OMS portal. Follow the guidance in [Create a Log Analytics workspace in the Azure portal](log-analytics-quick-create-workspace.md) to create a new workspace in the Azure portal.

## Changes to alerts

### Alert extension  

> [!NOTE]
> Alerts have now been fully extended into the Azure portal for the public cloud. Existing alert rules can be viewed in the OMS portal, but they can only be managed in the Azure portal. Extension of alerts into the Azure portal will start for the Azure government cloud in October, 2018.

Alerts have been [extended into the Azure portal](../monitoring-and-diagnostics/monitoring-alerts-extend.md). Once this is complete, management actions on alerts will only be available in Azure portal. Existing alerts will continue to be listed in the OMS portal. If you access alerts programmatically by using the Log Analytics Alert REST API or Log Analytics Alert Resource Template, you'll need to use action groups instead of actions in your API calls, Azure Resource Manager templates, and PowerShell commands.

### Alert management solution
Instead of the [alert management solution](log-analytics-solution-alert-management.md), you can use [Azure Monitor's unified alerting interface](../monitoring-and-diagnostics/monitoring-overview-unified-alerts.md) to visualize and manage your alerts. This new experience aggregates alerts from multiple sources within Azure including log alerts from Log Analytics. You can see distributions of your alerts, take advantage of automated grouping of related alerts via smart groups, and view alerts across multiple subscriptions while applying rich filters. All these features are available in preview starting June 4, 2018. The alert management solution will not be available in the Azure portal. 

The data collected by the Alert Management solution (records with a type of Alert) continues to be in Log Analytics as long as the solution is installed for the workspace. Starting August 2018, streaming of alerts from unified alerting into workspaces will be enabled, replacing this capability. Some schema changes are expected and will be announced at a later date.

## OMS Mobile App
The OMS mobile app will be sunsetted along with the OMS portal. Instead of the OMS mobile app, to access information about your IT infrastructure, dashboards and saved queries, you can access the Azure portal directly from your browser in your mobile device. To get alerts, you should configure [Azure Action Groups](../monitoring-and-diagnostics/monitoring-action-groups.md) to receive notifications in the form of SMS or a voice call

## Application Insights Connector and solution
[Application Insights Connector](log-analytics-app-insights-connector.md) provides a way to bring Application Insights data into a Log Analytics workspace. This data duplication was required to enable visibility across infrastructure and application data.

With the support of [cross-resource queries](log-analytics-cross-workspace-search.md), there is no longer this need to duplicate data. As such, the existing Application Insights solution will be deprecated. Starting October, you will not be able to link new Application Insights resources to Log Analytics workspaces. Existing links and dashboards will continue to function until January 15, 2019.


## Azure Network Security Group Analytics
The [Azure Network Security Group Analytics solution](log-analytics-azure-networking-analytics.md#azure-network-security-group-analytics-solution-in-log-analytics) will be replaced with the recently launched [Traffic Analytics](https://azure.microsoft.com/en-in/blog/traffic-analytics-in-preview/) which provides visibility into user and application activity on cloud networks. Traffic Analytics helps you audit your organization's network activity, secure applications and data, optimize workload performance and stay compliant. 

This solution analyzes NSG Flow logs and provides insights into the following.

- Traffic flows across your networks between Azure and Internet, public cloud regions, VNETs, and subnets.
- Applications and protocols on your network, without the need for sniffers or dedicated flow collection appliances.
- Top talkers, chatty applications, VM conversations in the cloud, traffic hotspots.
- Sources and destinations of traffic across VNETs, inter-relationships between critical business services and applications.
- Security including malicious traffic, ports open to the Internet, applications or VMs attempting Internet access.
- Capacity utilization, which helps you eliminate issues of over provisioning or underutilization.

You can continue to rely on Diagnostics Settings to send NSG logs to Log Analytics so your existing saved searches, alerts, dashboards will continue to work. Customers who have already installed the solution can continue to use it until further notice. Starting September 5, the Network Security Group Analytics solution will be removed from the marketplace and made available through the community as a [Azure QuickStart Template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Operationalinsights).

## System Center Operations Manager
If you've [connected your Operations Manager management group to Log Analytics](log-analytics-om-agents.md), then it will continue to work with no changes. For new connections though, you must follow the guidance in [Microsoft System Center Operations Manager Management Pack to configure Operations Management Suite](https://blogs.technet.microsoft.com/momteam/2018/07/25/microsoft-system-center-operations-manager-management-pack-to-configure-operations-management-suite/).

## Next steps
- See [Common questions for transition from OMS portal to Azure portal for Log Analytics users](log-analytics-oms-portal-faq.md) for guidance on moving from the OMS portal to the Azure portal.