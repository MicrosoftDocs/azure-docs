---
title: Security monitoring in Azure Security Center | Microsoft Docs
description: This article helps you to get started with monitoring capabilities in Azure Security Center.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: mbaldwin
editor: ''

ms.assetid: 3bd5b122-1695-495f-ad9a-7c2a4cd1c808
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/26/2018
ms.author: terrylan

---
# Security health monitoring in Azure Security Center
This article helps you use the monitoring capabilities in Azure Security Center to monitor compliance with policies.

## What is security health monitoring?
We often think of monitoring as watching and waiting for an event to occur so that we can react to the situation. Security monitoring refers to having a proactive strategy that audits your resources to identify systems that do not meet organizational standards or best practices.

## Monitoring security health
After you enable [security policies](security-center-policies.md) for a subscription’s resources, Security Center analyzes the security of your resources to identify potential vulnerabilities. Information about your network configuration is available instantly. Depending on the number of VMs and computers that you have with the agent installed, it may take an hour or more to collect information about VMs and computer's configuration, such as security update status and operating system configuration, to become available. You can view the security state of your resources and any issues in the **Prevention** section. You can also view a list of those issues on the **Recommendations** tile.

For more information about how to apply recommendations, read [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

Under **Resource health monitoring**, you can monitor the security state of your resources. In the following example, you can see that in each resource's tile (Compute & apps, Networking, Data security, and Identity & access) has the total number of issues that were identified.

![Resources security health tile](./media/security-center-monitoring/security-center-monitoring-fig1-newUI-2017.png)


### Monitor compute & apps
See [Protecting your machines and applications in Azure Security Center](security-center-virtual-machine-recommendations.md) for more information.

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

In this topology view, the first level has [virtual networks](../virtual-network/virtual-networks-overview.md), [virtual network gateways](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md), and [virtual networks (classic)](../virtual-network/virtual-networks-create-vnet-classic-pportal.md). The second level has subnets, and the third level has the virtual machines that belong to those subnets. The right column has the current status of the network security group for those resources, as shown in the following example:

![Status of the network security group in Networking topology section](./media/security-center-monitoring/security-center-monitoring-fig12-ga.png)

The bottom part of this blade has the recommendations for this virtual machine, which is similar to what is described previously. You can click a recommendation to learn more or apply the needed security control or configuration.

### Monitor data security

When you click **Data security** in the **Prevention** section, the **Data Resources** opens with recommendations for SQL and Storage. It also has [recommendations](security-center-sql-service-recommendations.md) for the general health state of the database. For more information about storage encryption, read [Enable encryption for Azure storage account in Azure Security Center](security-center-enable-encryption-for-storage-account.md).

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

### Monitor identity & access

See [Monitor identity and access in Azure Security Center](security-center-identity-access.md) for more information.

## See also
In this article, you learned how to use monitoring capabilities in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md): Learn how to configure security settings in Azure Security Center.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.
