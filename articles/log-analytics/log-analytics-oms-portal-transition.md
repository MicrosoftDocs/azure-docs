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
Thank you for using the OMS portal. We are encouraged by your support and we continue to invest heavily in our monitoring and management services. One piece of feedback we heard over and over again from customers is the need for a single user experience to monitor and manage both on-premises and Azure workloads. You probably know that the Azure portal is the hub for all Azure services and offers a rich management experience with capabilities such as dashboards for pinning resources, intelligent search for finding resources, and tagging for resource management. To consolidate and streamline the monitoring and management workflow, we had started adding the OMS portal capabilities into the Azure portal. We are happy to announce that most of the features of the OMS portal are now part of the Azure portal. In fact, some of the new features such as Traffic Manager are only available in the Azure portal.  There are only few gaps remaining, the most impactful one is 5 solutions that are still in the process to be moved to Azure Portal (see full list of gaps below). If you are not using these features, you will be able to accomplish everything you were doing in the OMS portal with the Azure portal and more (see the instructions for using Azure portal). If you haven’t already done so, we recommend that you start using the Azure portal today! 

We expect to close down the remaining gaps between the two portals by August 2018. Based on the feedback we receive from customers, we will communicate the timeline for sunsetting the OMS portal. We are excited to move to the Azure portal and expect the transition to be easy. But we understand that changes are difficult and can be disruptive - if you have questions, feedback, or concerns, please don’t hesitate to reach out to us at LAUpgradeFeedback@microsoft.com.  The rest of this article goes over the key scenarios, the current gaps and the roadmap for this transition. 


## What will change? 
Customers are advised to use equivalent experiences in Azure Portal (see more). OMS Mobile App will be deprecated (see more)

In support of the above, we also introduce the following changes:

- Alert extension was already announced and is-on going (see more). New Alert Management experience is now available and will replace Alert Management solution (see below). 
- AI/OMS Connector and solution are no longer required– same functionality can be enabled through cross-app/cross-workspace queries (reference below) 
- NSG Solution is being replaced with enhanced functionality available via Traffic Analytics solution. (see below)



## Known gaps  
We are aware of several functional gaps that may necessitate usage of the OMS Portal. We are working on closing these gaps and we will continue to keep this document up to date as we are enabling these capabilities. You should also use [Azure Updates](https://azure.microsoft.com/en-us/updates/?product=log-analytics) for on-going announcements about extensions and changes.

1.	Following solutions are not yet fully functional in the Azure portal. We are targeting to address this gap soon, but in the meantime we recommend using these solutions in the classic portal:

    - Windows Analytics Solutions (Upgrade Readiness, Device Health, and Update Compliance)
    - DNS Analytics 
    - Surface Hub

2. To access Log Analytics resource in Azure, user must be granted access through Azure role-based access. See below for additional details. below for additional details. below for additional details. below for additional details. 
3. Update schedules that were created using the OMS portal may not be reflected in the scheduled update deployments or update job history of the Update management dashboard in the Azure portal. We are targeting to address this gap by the end of June 2018
4. Custom logs preview feature can only be enabled through OMS Portal. By the end of June 2018, this will be auto enabled for all work spaces.


 
## What should I do now?  

- We’d like to encourage you to start experiencing Log Analytics under Azure Portal and explore new capabilities enabled by it. Refer this document to learn more about Azure portal. 
- If the gaps described above are not applicable for your environment, you should consider starting using Azure Portal as your primary experience. 

Please use the following email - LAUpgradeFeedback@microsoft.com - to notify us of any feedback, questions or concerns.

## Detailed information 

### Alert extension  
We are in the process of completing alert extension, as we communicated in Extend alerts from the OMS portal into Azure. Once completed, management actions on alerts will only be available in Azure Portal. Existing alerts will continue to be listed in the OMS portal. If you access alerts programmatically by using the Log Analytics Alert REST API or Log Analytics Alert Resource Template; you'll need to use action groups instead of actions in your API calls, Azure Resource Manager templates and PowerShell commands.

### Alert management solution
Customer using the OMS portal's alert management visualization solution can now start using Azure Monitor's unified alerting interface to visualize and manage their alerts. This new experience aggregates alerts from multiple sources within Azure including log alerts from OMS. Users can see distributions of their alerts, take advantage of automated grouping of related alerts via Smartgroups or view alerts across multiple subscriptions while applying rich filters. All these features are available in preview starting Jun 4, 2018 and can be accessed from [unified alerting experience in Azure Monitor](http://aka.ms/postalertmgmt). 

Unified alert management will replace the current alert management visualization solution going forward. The existing Alert Management solution continues to be fully functional in the OMS Portal, but will not be available in Azure Portal. As part of OMS Portal sunset, we expect customers to use unified alerting.

The data collected by the Alert Management solution (records with a type of Alert) continues to be made available in Log Analytics, as long as solution is installed for the workspace. Starting Aug 2018, we will enable streaming of alerts from unified alerting into workspaces, replacing the above capability. Some schema changes are expected and will be announced here at a later date.


## User access and role migration
Azure Portal access management is richer and more powerful than the access management that existed in OMS Portal. But, it has some learning curve and it require some conversions.

Here is a document that explains the details of Log Analytics access management: [https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-access](log-analytics-manage-access.md)

Starting June 25th, we will start automatic conversion of the access control permissions from the OMS portal to Azure portal permissions. Once the conversion will happen, the access management in OMS Portal will route users to Azure Portal for access management (access management in OMS Portal will be locked). 

During the conversion, the system will perform the following logic for each user or security group that have permission in the OMS portal:

- Check if the user or security group have same level or permissions in Azure
- Only if permissions are missing, it will assign the following roles for the relevant workspaces and solutions:


    | Classic portal permission level | Azure Role |
    |:---|:---|
    | ReadOnly | Log Analytics Reader |
    | Contributor | Log Analytics Contributor |
    | Administrator | Owner |

To make sure that no excessive permissions will be assigned to users, the system will not automatically assign these permissions on the resource group level. As a result, workspace administrators must manually assign themselves owner or contributor roles at resource group or subscription level to:

- Add or remove solutions
- Define new custom views
- Manage alerts (see alerts section for more details)

Please note that in some cases, the automatic conversion cannot apply permission and will prompt the administrator to manually assign permissions.

### OMS Mobile App deprecation
We will be sunsetting the OMS mobile app along with the OMS portal. Instead of the OMS mobile app, to access information about your IT infrastructure, dashboards and saved queries, we recommend that you access Azure portal directly from your browser in your mobile device. To get alerts, we recommend that you configure [Azure Action Groups](../monitoring-and-diagnostics/monitoring-action-groups.md) and receive notifications  in the form of  SMS  or a voice call

### AI/OMS Connector and solution
Application Insights Connector (Preview) provides a way to bring Application Insights data into Log Analytics workspace. Historically, this data duplication was required to enable visibility across infrastructure and application data.

With the support of cross-resource queries, there is no longer need to duplicate your data – you can query across Log Analytics workspaces and Application Insights apps ([Learn more](../log-analytics/log-analytics-cross-workspace-search.md)) and this method should be used going forward. The existing Application Insights solution is going to be deprecated. Starting July, we will no longer allow linking new Application Insights resources to Log Analytics workspaces. Existing links and dashboards will continue to function until Nov 2018.


### Azure Network Security Group Analytics
We are replacing Azure Network Security Group Analytics with the recently launched Traffic Analytics.  

[Traffic Analytics](https://azure.microsoft.com/blog/traffic-analytics-in-preview/) provides visibility into user and application activity on your cloud networks.  The solution analyzes NSG Flow logs and provides insights into:

- traffic flows across your networks between Azure and Internet, public cloud regions, VNETs and subnets
- applications and protocols on your network, without the need for sniffers or dedicated flow collection appliances
- top talkers, chatty applications, VM conversations in the cloud, traffic hotspots
- sources and destinations of traffic across VNETs, inter-relationships between critical business services and applications
- security – malicious traffic, ports open to the Internet, applications or VMs attempting Internet access
- capacity utilization – helps you eliminate issues of over provisioning or underutilization

Traffic Analytics is the most comprehensive solution in the market and helps you audit your organization's network activity, secure applications and data, optimize workload performance and stay compliant. [Check it out](../network-watcher/traffic-analytics.md) today.

You can continue to rely on Diagnostics Settings to send NSG logs to Log Analytics – hence, your existing saved searches, alerts, dashboards will continue to work. Customers who have already installed the solution can continue to use it, until further notice. Starting June 20th, we will remove the NSG solution from the marketplace, and will make it available, as community contribution, as [Azure QuickStart Template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Operationalinsights).