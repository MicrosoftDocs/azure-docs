---
title: Replicate a multi-tier SharePoint application using Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate a multi-tier SharePoint application using Azure Site Recovery capabilities.
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid: 
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2017
ms.author: sutalasi

---
# Replicate a multi-tier SharePoint application using Azure Site Recovery

## Overview


Microsoft SharePoint is a powerful application that can help a group or department organize, collaborate, and share information. SharePoint can provide intranet portals, document and file management, collaboration, social networks, extranets, websites, enterprise search, and business intelligence. It also has system integration, process integration, and workflow automation capabilities. Typically, organizations consider it as an enterprise class Tier-1 application sensitive to downtime and data loss. 
Today, Microsoft SharePoint  does not provide any out-of-the-box disaster recovery capabilities. Regardless of the type and scale of a disaster, recovery involves the use of a standby data center that you can recover the farm to. Standby data centers are required for scenarios where local redundant systems and backups cannot recover from the outage at the primary data center. 


A good disaster recovery solution, should allow modeling of recovery plans around the above complex application architectures and also have the ability to add customized steps to handle application mappings between various tiers hence providing a single-click sure shot solution in the event of a disaster leading to a lower RTO.


This article describes how to protect a SharePoint application using a [Azure Site Recovery](site-recovery-overview.md). This article will cover best practices for replicating a three tier IIS based web application to Azure, how you can do a disaster recovery drill, and how you can failover the application to Azure. 

 
## Prerequisites

Before you start, make sure you understand the following:

1. [Replicating a virtual machine to Azure](site-recovery-vmware-to-azure.md)
1. How to [design a recovery network](site-recovery-network-design.md)
1. [Doing a test failover to Azure](site-recovery-test-failover-to-azure.md)
1. [Doing a failover to Azure](site-recovery-failover.md)
1. How to [replicate a domain controller](site-recovery-active-directory.md)
1. How to [replicate SQL Server](site-recovery-sql.md)

## SharePoint architecture

SharePoint can be deployed on one or more servers using tiered topologies and server roles to implement a farm design that meets specific goals and objectives. A typical large, high-demand SharePoint server farm that supports a high number of concurrent users and a large number of content items use service grouping as part of their scalability strategy. This approach involves running services on dedicated servers, grouping these services together, and then scaling out the servers as a group. The following topology illustrates the service and server grouping for a three tier SharePoint server farm. Please refer to SharePoint documentation and product line architectures for detailed guidance on different SharePoint topologies. You can find more details about SharePoint 2013 deployment in [this document](https://technet.microsoft.com/en-us/library/cc303422.aspx).


![Deployment Pattern 1](./media/site-recovery-sharepoint/SharePointArchitecture.png) 


## Site Recovery support

For the purpose of creating this article VMware virtual machines with with Windows Server 2012 R2 Enterprise were used. SharePoint 2013 Enterprise edition and SQL server 2014 Enterprise edition were used. As site recovery replication is application agnostic, the recommendations provided here are expected to hold on following scenarios as well. 

### Source and target

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes

### SharePoint Versions
The below SharePoint server versions are supported.

* SharePoint server 2013 Standard
* SharePoint server 2013 Enterprise
* SharePoint server 2016 Standard
* SharePoint server 2016 Enterprise

### Things to keep in mind

If you are using a shared disk based cluster as the middle tier in your application then you will not be able to use site recovery replication to replicate those virtual machines. You can use native replication provided by the application and then use a [recovery plan](site-recovery-create-recovery-plans.md) to failover all tiers. [This section](site-recovery.md#section-link) below covers it in detail.

## Replicating virtual machines

Follow [this guidance](site-recovery-vmware-to-azure.md) to start replicating the virtual machine to Azure. 

* Once the replication is complete, make sure you go to each virtual machine of each tier and [select same availability set](site-recovery-availability-set.md) for each of the virtual machine. For example, if your web tier has 3 VMs, ensure all the 3 VMs are configured to be part of same availability set in Azure.

* For guidance on protecting Active Directory and DNS, refer to [Protect Active Directory and DNS](site-recovery-active-directory.md) document.

* For guidance on protecting database tier running on SQL sever, refer to [Protect SQL Server](site-recovery-active-directory.md) document.

## Networking configuration

### Network properties

* For the App and Web tier VMs configure network settings in Azure portal so that the VMs get attached to the right DR network after failover. 


* If you are using a static IP then specify the IP that you want the virtual machine to take in the **Target IP** field 

### DNS and Traffic Routing

For internet facing sites, [create a Traffic Manager profile of 'Priority' type](traffic-manager-create-profile.md) in the Azure subscription. And then configure your DNS and Traffic Manager profile in the following manner.


| **Where**	| **Source** | **Target**|
| --- | --- | --- |
| Public DNS | Public DNS for SharePoint sites <br/><br/> Ex: sharepoint.contoso.com | Traffic Manager <br/><br/> contososharepoint.trafficmanager.net |
| On-premises DNS | sharepointonprem.contoso.com | Public IP on the on-premises farm |


In the Traffic Manager profile, [create the primary and recovery endpoints](traffic-manager-configure-priority-routing-method.md). Use the external endpoint for on-premises endpoint and public IP for Azure endpoint. Ensure that the priority is set higher to on-premises endpoint.

Host a test page on a specific port (e.g. 800) in the SharePoint web tier in order for Traffic Manager to automatically detect availability post failover. This is a workaround in case you cannot enable anonymous authentication on any of your SharePoint sites. 

[Configure the Traffic Manager profile](traffic-manager-configure-priority-routing-method.md) with the below settings.

* Routing method - 'Priority'
* DNS time to live (TTL) - '30 seconds'
* Endpoint monitor settings - If you can enable anonymous authentication, you can give a specific website endpoint. Or, you can use a test page on a specific port (e.g. 800).

## Creating a recovery plan

A recovery plan allows sequencing the failover of various tiers in a multi-tier application, hence, maintaining application consistency. Follow the below steps while creating a recovery plan for a multi-tier web application. [Learn more about creating a recovery plan](site-recovery-runbook-automation#customize-the-recovery-plan).

### Adding virtual machines to failover groups

1. Create a recovery plan by adding the App and Web tier VMs.
2. Click on 'Customize' to group the VMs
3. Create another Group (Group 2) and move the Web tier VMs into the new group. Your App tier VMs should be part of 'Group 1' and Web tier VMs should be part of 'Group 2'. This is to ensure that the App tier VMs boot up first followed by Web tier VMs.


### Adding scripts to the recovery plan

1. Add a pre action to 'Group 1' to failover SQL Availability group.

2. Use this [script](scipt-location.md) to attach a load balancer on the failed over virtual machines ofApp tier (Group 1) and Web tier (Group 2).

3. Add a script to clear SharePoint config cache on Web and App tier VMs. 

4. Add a manual step to update the DNS records to point to the new farm in Azure. For internet facing sites, no DNS update are required post failover. Follow the steps described in the 'Networking guidance' section to configure Traffic Manager. If Traffic Manager has been setup as described in the previous section, add a script to open dummy port (800 in the example) on the Azure VM.

	For internal facing sites, add a manual step to update the DNS record to point to the new Web tier VM’s load balancer IP.

5. Add a manual step to restore search application from a backup or start a new search service.

	####Restore Search Service Application from a backup 

	* This method assumes that a backup of the Search Service Application was performed prior to the catastrophic event and that the backup is available at the DR site. *This can easily be achieved by scheduling the backup (for example, once daily) and using a copy procedure to place the backup at the DR site. Copy procedures could include scripted programs such as AzCopy (Azure Copy) or setting up DFSR (Distributed File Services Replication).
	* Now that the SharePoint farm is running, navigate the Central Administration, Backup and Restore and select Restore. The restore will interrogate the backup location specified (you may need to update the value). Select the Search Service Application backup you would like to restore.
	* Search will be restored. Keep in mind that the restore expect to find the same topology (same number of servers) and same hard drive letters assigned to those servers. For more information refer to ['Restore Search service application in SharePoint 2013'](https://technet.microsoft.com/library/ee748654.aspx) document.
	
	####Start with a new Search Service Application

	* This method assumes that a backup of the “Search Administration” database is available at the DR site.
	* Since the other Search Service Application databases are not replicated, they will need to be re-created. To do so, navigate to Central Administration and delete the Search Service Application. On any servers which host the Search Index, delete the index files.
	* Re-create the Search Service Application, this will re-create the databases. It is strongly recommended to have a prepared script that will re-create this service application since it is not possible to perform all actions via the GUI. For example, setting the index drive location and configuring the search topology are only possible by using SharePoint PowerShell cmdlets. Use the Windows PowerShell cmdlet Restore-SPEnterpriseSearchServiceApplication and specify the log-shipped and replicated Search Administration database, Search_Service__DB. This cmdlet gives the search configuration, schema, managed properties, rules, and sources and creates a default set of the other components.
	* Once the Search Service Application has be re-created, you must start a full crawl for each content source to restore the Search Service. Note that you lose some analytics information from the on-premises farm, such as search recommendations. 


## Doing a test failover
Follow [this guidance](site-recovery-test-failover-to-azure.md) to do a test failover.

1.	Go to Azure portal and select your Recovery Service vault.
2.	Click on the recovery plan created for IIS web farm.
3.	Click on 'Test Failover'.
4.	Select recovery point and Azure virtual network to start the test failover process.
5.	Once the secondary environment is up, you can perform your validations.
6.	Once the validations are complete, you can select ‘Validations complete’ and the test failover environment will be cleaned.

## Doing a failover
Follow [this guidance](site-recovery-failover.md) when you are doing a failover.

1.	Go to Azure portal and select your Recovery Service vault.
2.	Click on the recovery plan created for IIS web farm.
3.	Click on 'Failover'.
4.	Select recovery point to start the failover process.

## Next steps
You can learn more about [replicate other applications](site-recovery-workload.md) using Site Recovery. 

