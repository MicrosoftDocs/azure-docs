---
title: Security monitoring in Azure Security Center | Microsoft Docs
description: This article helps you to get started with monitoring capabilities in Azure Security Center.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 3bd5b122-1695-495f-ad9a-7c2a4cd1c808
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2017
ms.author: yurid

---
# Security health monitoring in Azure Security Center
This article helps you use the monitoring capabilities in Azure Security Center to monitor compliance with policies.

## What is security health monitoring?
We often think of monitoring as watching and waiting for an event to occur so that we can react to the situation. Security monitoring refers to having a proactive strategy that audits your resources to identify systems that do not meet organizational standards or best practices.

## Monitoring security health
After you enable [security policies](security-center-policies.md) for a subscription’s resources, Security Center analyzes the security of your resources to identify potential vulnerabilities. Information about your network configuration is available instantly. Depending on the number of VMs and computers that you have with the agent installed, it may take an hour or more to collect information about VMs and computer's configuration, such as security update status and operating system configuration, to become available. You can view the security state of your resources and any issues in the **Prevention** section. You can also view a list of those issues on the **Recommendations** tile.

For more information about how to apply recommendations, read [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

Under the **Prevention** section, you can monitor the security state of your resources. In the following example, you can see that in each resource's tile (Compute, Networking, Storage & data, and Application) has the total number of issues that were identified.

![Resources security health tile](./media/security-center-monitoring/security-center-monitoring-fig1-newUI-2017.png)


### Monitor compute
When you click **Compute** tile, you see three tabs:

- **Overview**: monitoring and recommendations.
- **VMs and Computers**: list all virtual machines, computers, and its current security state.
- **Cloud Services**: list of all web and worker roles monitored by Security Center.

![Missing system update by virtual machine](./media/security-center-monitoring/security-center-monitoring-fig1-sep2017.png)

In each tab you can have multiple sections, and in each section, you can select an individual option to see more details about the recommended steps to address that particular issue. 

#### Monitoring recommendations
This section shows the total number of virtual machines and computers that were initialized for automatic provisioning and their current statuses. When you click this entry, the **VM Agent is missing or not responding** opens. 

![Missing system update by virtual machine](./media/security-center-monitoring/security-center-monitoring-fig1-new003-2017.png)


#### Recommendations
This section has a set of [recommendations for each virtual machine and computer](security-center-virtual-machine-recommendations.md) that Azure Security Center monitors. The first column lists the recommendation. The second column shows the total number of virtual machines and computers that are affected by that recommendation. The third column shows the severity of the issue as illustrated in the following screenshot:

![Virtual machine recommendations](./media/security-center-monitoring/security-center-monitoring-fig2-sep2017.png)

> [!NOTE]
> Only virtual machines that have at least one public endpoint are shown in the **Networking Health** in the **Network topology** list.
>

Each recommendation has a set of actions that you can perform after you click it. For example, if you click **Missing system updates**, a list of virtual machines and computers that are missing patches, and the severity of the missing update appears, as shown in the following screenshot:

![Missing system updates for virtual machines](./media/security-center-monitoring/security-center-monitoring-fig3-sep2017.png)

The **Missing system updates** have a summary of critical updates in a graph format, one for Windows, and one for Linux. The second part has a table with the following information:

* **NAME**: Name of the missing update.
* **NO. OF VMs & COMPUTERS**: Total number of VMs and computers that are missing this update.
* **STATE**: The current state of the recommendation:
  * **Open**: The recommendation has not been addressed yet.
  * **In Progress**: The recommendation is currently being applied to those resources, and no action is required by you.
  * **Resolved**: The recommendation was already finished. (When the issue has been resolved, the entry is dimmed).
* **SEVERITY**: Describes the severity of that particular recommendation:
  * **High**: A vulnerability exists with a meaningful resource (application, virtual machine, or network security group) and requires attention.
  * **Medium**: Non-critical or additional steps are required to complete a process or eliminate a vulnerability.
  * **Low**: A vulnerability should be addressed but does not require immediate attention. (By default, low recommendations are not presented, but you can filter on low recommendations if you want to view them.)

To view the recommendation details, click the name of the missing update from the list. 

![Missing system updates for a specific virtual machine](./media/security-center-monitoring/security-center-monitoring-fig4-sep2017.png)

> [!NOTE]
> The security recommendations here are the same as those in the **Recommendations** option. See the [Implementing security recommendations in Azure Security Center](security-center-recommendations.md) article for more information about how to resolve recommendations. This is applicable not only for virtual machines and computers, but also for all resources that are available in the **Resource Health** tile.
>

#### VMs & computers section
The virtual machines and computers section gives you an overview of all virtual machines and computer's recommendations. Each column represents one set of recommendations as shown in the following screenshot:

![Overview of all virtual machines and recommendations](./media/security-center-monitoring/security-center-monitoring-fig5-sep2017.png)

There are four types of icons that are represented in this list, as explained in this list:

![icon1](./media/security-center-monitoring/security-center-monitoring-icon1.png) Non-Azure computer.

![icon2](./media/security-center-monitoring/security-center-monitoring-icon2.png) Azure  Resource Manager VM.

![icon3](./media/security-center-monitoring/security-center-monitoring-icon3.png) Azure  Classic VM.

![icon4](./media/security-center-monitoring/security-center-monitoring-icon4.png) VMs that are identified only from the workspace that is part of the viewed subscription. This includes VMs from other subscriptions that report to the workspace in this subscription, and VMs that were installed with SCOM direct agent, and have no resource ID.

The icon that appears under each recommendation helps you to quickly identify the virtual machine and computer that needs attention, and the type of recommendation. You can also use the **Filter** option to select which options you will see on this screen.

![Filter](./media/security-center-monitoring/security-center-monitoring-fig6-sep2017.png)

In the previous example, one virtual machine has a critical recommendation regarding endpoint protection. To get more information about the virtual machine, click on it:

![Virtual machine security details](./media/security-center-monitoring/security-center-monitoring-fig7-sep2017.png)

Here you see the security details for the virtual machine or computer. At the bottom you can see the recommended action and the severity of each issue.

#### Cloud services section
For cloud services, a recommendation is created when the operating system version is out of date as shown in the following screenshot:

![Health status for cloud services](./media/security-center-monitoring/security-center-monitoring-fig1-new006-2017.png)

In a scenario where you do have recommendation (which is not the case for the previous example), you need to follow the steps in the recommendation to update the operating system version. When an update is available, you will have an alert (red or orange - depends on the severity of the issue). When you click on this alert in the WebRole1 (runs Windows Server with your web app automatically deployed to IIS) or WorkerRole1 (runs Windows Server with your web app automatically deployed to IIS) rows, you see more details about this recommendation as shown in the following screenshot:

![Cloud service details](./media/security-center-monitoring/security-center-monitoring-fig8-new3.png)

To see a more prescriptive explanation about this recommendation, click **Update OS version** under the **DESCRIPTION** column. 

![Cloud services recommendations](./media/security-center-monitoring/security-center-monitoring-fig8-new4.png)  

### Monitor virtual networks
When you click **Networking** tile, the **Networking** blade opens with more details as shown in the following screenshot:

![Networking blade](./media/security-center-monitoring/security-center-monitoring-fig9-new3.png)

#### Networking recommendations
Like the virtual machine's resource health information, here you see a summarized list of issues at the top, and a list of monitored networks on the bottom.

The networking status breakdown section lists potential security issues and offers [recommendations](security-center-network-recommendations.md). Possible issues can include:

* Next-Generation Firewall (NGFW) not installed
* Network security groups on subnets not enabled
* Network security groups on virtual machines not enabled
* Restrict external access through public external endpoint
* Healthy Internet facing endpoints

When you click a recommendation, you see more details about the recommendation as shown in the following example:

![Details for a recommendation in the Networking](./media/security-center-monitoring/security-center-monitoring-fig9-ga.png)

In this example, the **Configure Missing Network Security Groups for Subnets** has a list of subnets and virtual machines that are missing network security group protection. If you click the subnet to which you want to apply the network security group, you see the **Choose network security group**. Here you can select the most appropriate network security group for the subnet, or you can create a new network security group.

#### Internet facing endpoints section
In the **Internet facing endpoints** section, you can see the virtual machines that are currently configured with an Internet facing endpoint and its current status.

![Virtual machines configured with Internet facing endpoint and status](./media/security-center-monitoring/security-center-monitoring-fig10-ga.png)

This table has the endpoint name that represents the virtual machine, the Internet facing IP address, and the current severity status of the network security group and the NGFW. The table is sorted by severity:

* Red (on top): High priority and should be addressed immediately
* Orange: Medium priority and should be addressed as soon as possible
* Green (last one): Healthy state

#### Networking topology section
The **Networking topology** section has a hierarchical view of the resources as shown in the following screenshot:

![Hierarchical view of resources in Networking topology section](./media/security-center-monitoring/security-center-monitoring-fig121-new4.png)

This table is sorted (virtual machines and subnets) by severity:

* Red (on top): High priority and should be addressed immediately
* Orange: Medium priority and should be addressed as soon as possible
* Green (last one): Healthy state

In this topology view, the first level has [virtual networks](../virtual-network/virtual-networks-overview.md), [virtual network gateways](/vpn-gateway/vpn-gateway-site-to-site-create.md), and [virtual networks (classic)](/virtual-network/virtual-networks-create-vnet-classic-pportal.md). The second level has subnets, and the third level has the virtual machines that belong to those subnets. The right column has the current status of the network security group for those resources, as shown in the following example:

![Status of the network security group in Networking topology section](./media/security-center-monitoring/security-center-monitoring-fig12-ga.png)

The bottom part of this blade has the recommendations for this virtual machine, which is similar to what is described previously. You can click a recommendation to learn more or apply the needed security control or configuration.

### Monitor Storage & data

When you click **Storage & data** in the **Prevention** section, the **Data Resources** opens with recommendations for SQL and Storage. It also has [recommendations](security-center-sql-service-recommendations.md) for the general health state of the database. For more information about storage encryption, read [Enable encryption for Azure storage account in Azure Security Center](security-center-enable-encryption-for-storage-account.md).

![Data Resources](./media/security-center-monitoring/security-center-monitoring-fig13-newUI-2017.png)

Under **SQL Recommendations**, You can click any recommendation and get more details about further action to resolve an issue. The following example shows the expansion of the **Database Auditing & Threat detection on SQL databases** recommendation.

![Details about a SQL recommendation](./media/security-center-monitoring/security-center-monitoring-fig14-ga-new.png)

The **Enable Auditing & Threat detection on SQL databases** has the following information:

* A list of SQL databases
* The server on which they are located
* Information about whether this setting was inherited from the server or if it is unique in this database
* The current state
* The severity of the issue

When you click the database to address this recommendation, the **Auditing & Threat detection** opens as shown in the following screen.

![Auditing & Threat detection](./media/security-center-monitoring/security-center-monitoring-fig15-ga.png)

To enable auditing, select **ON** under the **Auditing** option.

### Monitor applications

If your Azure workload has applications located in [virtual machines (created through Azure Resource Manager)](../azure-resource-manager/resource-manager-deployment-model.md) with exposed web ports (TCP ports 80 and 443), Security Center can monitor those to identify potential security issues and recommend remediation steps. When you click the **Applications** tile, the **Applications** opens with a series of recommendations in the **Application recommendations** section. It also shows the application breakdown per host, IP/domain, and if there is a WAF solution installed:

![Applications security health](./media/security-center-monitoring/security-center-monitoring-fig8-sep2017.png)

Just like you did with the other recommendations, you can click in the recommendation to see more details about the issue, and how to remediate. The example shown in the following figure is an application that was identified as an unsecure web application. When you select the application that was considered not secure, the following option is available:

![Details](./media/security-center-monitoring/security-center-monitoring-fig17-ga.png)

Here you have a list of all recommendations for this application. When you click the **Add a web application firewall** recommendation, the **Add a Web Application Firewall** opens with options for you to install a web application firewall (WAF) from a partner as shown in the following screenshot.

![Add Web Application Firewall dialog box](./media/security-center-monitoring/security-center-monitoring-fig18-ga.png)

## See also
In this article, you learned how to use monitoring capabilities in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md): Learn how to configure security settings in Azure Security Center.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.
