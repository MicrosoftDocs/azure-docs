---
title: Transition from OMS portal to Azure portal for Log Analytics users | Microsoft Docs
description: Answers to common questions for Log Analytics users transitioning from the OMS portal to the Azure portal.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/06/2018
ms.author: bwren

---
# Transition from OMS portal to Azure portal for Log Analytics users
Today, the Azure portal is a hub for all Azure services and offers a rich management experience with capabilities such as dashboards for pinning resources, intelligent search for finding resources, and tagging for resource management. But certain Log Analytics monitoring capabilities were only available in the OMS portal, and as a result, you often had to go back and forth between the Azure portal and the OMS portal. To provide a single streamlined workflow and a unified management and monitoring experience, we started integrating the OMS portal capabilities into the Azure portal. We are happy to announce that most of the features of OMS portal are now part of the Azure portal. As a result, most customers will be able to accomplish everything you were doing in the OMS portal using the Azure portal and more. If you haven’t already done so, we recommend that you start using the Azure portal today!  

We expect to close down the remaining gaps between the two portals soon, and we plan to sunset OMS portal in the next six months. We are excited to move to the Azure portal and expect the transition to be easy. But we understand that changes are difficult and can be disruptive- If you need any help, have questions, feedback, or concerns, please don’t hesitate to reach out to us at LAUpgradeFeedback@microsoft.com.  The rest of this article goes over the key scenarios, the current gaps and the roadmap for this transition.  

## What will change? 
We are planning to introduce the following changes: 

- Alert extension was already announced and is-on going ([see more]) 
- User role assignment in OMS Portal will be auto extended to Azure portal ([see more]) 
- Existing OMS Portal will be deprecated in the next six months – customers are advised to use [equivalent experiences in Azure Portal](log-analytics-oms-portal-faq.md).
- OMS Mobile App will be deprecated ([see more]()) 


## Known gaps  
We are aware of several functional gaps that may necessitate usage of the OMS Portal. We are working on closing these gaps and we will continue to keep this document up to date as we are enabling these capabilities. You should also use Azure Updates <<link>> for on-going announcements about extensions and changes. 

1. Update schedules that were created using the OMS portal may not be reflected in the scheduled update deployments or update job history of the Update management dashboard in the Azure portal. We are targeting to address this gap by the end of June 2018. Following solutions are not yet fully functional in the Azure portal. We are targeting to address this gap soon, but in the meantime we recommend using these solutions in the classic portal.

    - Windows Analytics Solutions (Upgrade Readiness, Device Health, and Update Compliance) 
    - DNS Analytics  
    - Surface Hub 

1. Custom logs preview feature is only available in classic OMS Portal. By end of June 2018, this will be auto enabled for all work spaces.
1. New Alert Management experience is now available and will replace Alert Management solution. (see below) Existing Alert Management solution deployed will continue to function.
1. AI/OMS Connector and solution are no longer required– same functionality can be enabled through cross-app/cross-workspace queries (reference below).
1. NSG Solution is being replaced with enhanced functionality available via Traffic Analytics solution. (see below) 

 
## What should I do now?  

- We’d like to encourage you to start experiencing Log Analytics under Azure Portal and explore new capabilities enabled by it. Refer this document to learn more about Azure portal. 
- If the gaps described above are not applicable for your environment, you should consider starting using Azure Portal as your primary experience. 

Please use the following email - LAUpgradeFeedback@microsoft.com - to notify us of any feedback, questions or concerns.

## Detailed information 

### Alert extension  
Customers who use the Microsoft Operations Management Suite portal (OMS portal) can now manage log query–based alerts for Azure Log Analytics in the OMS portal and in the Azure portal. The alerts experience in Azure has a fresh look and updated functionality. The new alerts experience gives you a unified authoring experience for metric, activity and log alert rules. You can manage, enumerate and view all your alert types, not only Log Analytics alerts.

One can extend alerts created in the OMS portal into Azure alerts without affected Monitoring and with no downtime. Since April 2018, customer can manually extend your alerts from the OMS portal into Azure by using the wizard in the OMS portal or a REST API. Microsoft is extending all alerts still in OMS portal-based workspaces from May 14, 2018 onwards – in a region by region manner. Users whose alerts are not yet extended to Azure, can still manually extend from wizard in OMS portal or REST API. 

After this update, alerts will continue to be listed in the OMS portal. But, for all management actions, you will be transparently taken to Azure alerts. If you access alerts programmatically by using the [Log Analytics Alert REST API](../log-analytics/log-analytics-api-alerts.md) or [Log Analytics Alert Resource Template](../monitoring/monitoring-solutions-resources-searches-alerts.md); you'll need to use action groups instead of actions in your API calls, Azure Resource Manager templates and PowerShell commands. 

For more information, see [Extend alerts from the OMS portal into Azure](../monitoring-and-diagnostics/monitoring-alerts-extend.md).

### Alert management solution
Customer using the OMS portal's alert management visualization solution can now start using Azure Monitor's unified alerting interface to visualize and manage their alerts. This new experience aggregates alerts from multiple sources within Azure including log alerts from OMS. Users can see distributions of their alerts, take advantage of automated grouping of related alerts via Smartgroups or view alerts across multiple subscriptions while applying rich filters. All these features are available in preview starting Jun 4, 2018 and can be accessed from [unified alerting experience in Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-unified-alerts.md). The alert management visualization solution will be deprecated going forward, in favor of Azure Monitor's unified alert management functionality. However, users can continue to build custom visualizations within Azure Log Analytics using queries for Alert logs and objects.

## User access and role migration

Azure Portal access management is richer and more powerful than the access management that existed in OMS classic portal. But, it has some learning curve and it require some conversions. 

Here is an article that explains about Azure access management in general: [https://docs.microsoft.com/azure/role-based-access-control/overview](../role-based-access-control/overview.md) 

Here is a document that explains the details of Log Analytics access management: [https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-access](log-analytics-manage-access.md)

During July and August, the systems will automatically convert the access control permissions from the OMS classic portal to Azure portal permissions. Once the conversion will happen, the OMS portal access management will not be functional anymore and all actions should take place via the Azure Portal access management. 

During the conversion, the system will perform the following logic for each user or security group that have permission in the classic portal:

-	Check if the user or security group have same level or permissions in Azure
-	Only if permissions are missing, it will assign the following roles for the relevant workspaces and solutions:

    | Classic portal | permission level	Azure Role |
    |:---|:---|
    | ReadOnly | Log Analytics Reader |
    | Contributor | Log Analytics Contributor |
    | Administrator | Owner |

To make sure that no excessive permissions will be assigned to users, the system will not automatically assign these permissions on the resource group level. As a result, workspace administrators must manually assign themselves owner or contributor roles at resource group or subscription level to:

-	Add or remove solutions
-	Define new custom views
-	Manage alerts (see alerts section for more details)

Please note that in some cases, the automatic conversion cannot apply permission and will prompt the administrator to manually assign permissions.

### OMS Mobile App deprecation
The OMS mobile app ([Android](https://play.google.com/store/apps/details?id=com.microsoft.operations.AndroidPhone&hl=en_US), [iOS](https://www.microsoft.com/en-us/store/p/microsoft-operations-management-suite/9wzdncrfjz2r)) provides access to information about your IT infrastructure, dashboards and lets you execute saved searches. With the deprecation of OMS app, you can have access to these still, but in Azure portal view. At current state, Azure app Push notification supports ServiceHealth alerts, but alert notifications to your mobile can be achieved by using [Azure Action Groups](../monitoring-and-diagnostics/monitoring-action-groups.md), which handle notifications and actions for alerts. You can use Action Group to send [SMS](../monitoring-and-diagnostics/monitoring-sms-alert-behavior.md) to a mobile number, call Webhook to Slack app or trigger Logic App to their app connectors.

### AI/OMS Connector and solution
Application Insights connector (Preview) provides a way to connect applications Insights resources to a Log Analytics workspace. Having infrastructure and application data in one place, enables you to investigate problems across your stack:
- Send your applications logs to Log Analytics and explore, visualize Applications data in Log Analytics solution view and investigate problem across your infrastructure and applications.
- Retain your data in Log Analytics for up to 2 years.
With the support of cross-resource (Log Analytics and Application Insights), there is no need to duplicate your data and incur additional costs – you can query across Log Analytics workspaces and Application Insights apps in the same resource group, another resource group, or another subscription. This provides you with a system-wide view of your data. [Learn more](../log-analytics/log-analytics-cross-workspace-search.md).

### Azure Network Security Group Analytics - @Ajay
We are replacing Azure Network Security Group Analytics with the recently launched [Traffic Analytics](https://azure.microsoft.com/blog/traffic-analytics-in-preview/). Traffic Analytics provides visibility into user and application activity on your cloud networks.  The solution analyzes NSG Flow logs and provides insights into:

- traffic flows across your networks between Azure and Internet, public cloud regions, VNETs and subnets
- applications and protocols on your network, without the need for sniffers or dedicated flow collection appliances
- top talkers, chatty applications, VM conversations in the cloud, traffic hotspots
- sources and destinations of traffic across VNETs, inter-relationships between critical business services and applications
- security – malicious traffic, ports open to the Internet, applications or VMs attempting Internet access
- capacity utilization – helps you eliminate issues of over provisioning or underutilization
Traffic Analytics is the most comprehensive solution in the market and helps you audit your organization's network activity, secure applications and data, optimize workload performance and stay compliant. [Check it out](../network-watcher/traffic-analytics.md) today.
