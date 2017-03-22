---
title: Replicate a multi-tier Dynamics AX deployment using Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate and protect Dynamics AX using Azure Site Recovery 
services: site-recovery
documentationcenter: ''
author: asgang
manager: rochakm
editor: ''

ms.assetid: 9126f5e8-e9ed-4c31-b6b4-bf969c12c184
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/10/2017
ms.author: asgang

---
# Replicate a multi-tier Dynamics AX application using Azure Site Recovery

## Overview


Microsoft Dynamics AX is one of the most popular ERP solution among enterprises to standardized process across locations, manage resources and simplifying compliance. Considering the application is business critical to an organization it is very important to be sure that in case of any disaster, application should be up and running in minimum time.

Today, Microsoft Dynamics AX  does not provide any out-of-the-box disaster recovery capabilities. Regardless of the type and scale of a disaster, recovery involves the use of a standby data center that you can recover the complete application to. Standby data centers are required for scenarios where local redundant systems and backups cannot recover from the outage at the primary data center. Microsoft Dynamics AX consists of many server components like Application Object Server, Active Directory (AD), SQL Database Server, SharePoint Server, Reporting Server etc. To manage the disaster recovery of each of these components manually is not only expensive but also error-prone. 

This article explains in detail about how you can create a disaster recovery solution for your Dynamics AX application using [Azure Site Recovery](site-recovery-overview.md). It will also cover planned/unplanned/test failovers using one-click recovery plan, supported configurations and prerequisites.

> [!NOTE]
> Azure Site Recovery based disaster recovery solution is fully tested, certified and recommended by Microsoft Dynamics AX.
 
## Prerequisites

Before you start, make sure you understand the following:

1. [Replicating a virtual machine to Azure](site-recovery-vmware-to-azure.md)
1. How to [design a recovery network](site-recovery-network-design.md)
1. [Doing a test failover to Azure](site-recovery-test-failover-azure.md)
1. [Doing a failover to Azure](site-recovery-failover.md)
1. How to [replicate a domain controller](site-recovery-active-directory.md)
1. How to [replicate SQL Server](site-recovery-sql.md)

## Deployment patterns

Dynamics AX can be deployed on one or more servers using tiered topologies and server roles to implement a design that meets specific goals and objectives. Dynamics AX consists of many server components like Application Object Server, Active Directory (AD), SQL Database Server, SharePoint Server, Reporting Server etc. 
For this article we have choose a simple deployment topology to keep it simple 

* **Deployment pattern 1** - This deployment pattern will show a catchy picture with a link to an [external resource](external-resource.md)

![Deployment Pattern 1](./media/site-recovery-iis/DeploymentPattern.png)


* **Deployment pattern 2**


## Site Recovery support

For the purpose of creating this article VMware virtual machines with Dynamics AX 2012 R3 on Windows Server 2012 R2 Enterprise were used. As site recovery replication is application agnostic, the recommendations provided here are expected to hold on following scenarios as well. 

### Source and target

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes



### Things to keep in mind

If you are using a shared disk based cluster as the middle tier in your application then you will not be able to use site recovery replication to replicate those virtual machines. You can use native replication provided by the application and then use a [recovery plan](site-recovery-recovery-plan.md) to failover all tiers. [This section](site-recovery.md#section-link) below covers it in detail.

## Enable DR of Dynamics AX application using ASR

### Protect your Dynamics AX application 
Each component of the Dynamics AX needs to be protected to enable the complete application replication and recovery. This section covers:

* Protection of Active Directory
* Protection of SQL Tier
* Protection of App and Web Tiers
* Networking configuration

### Setup AD and DNS replication
Active Directory is required on the DR site for Dynamics AX application to function. There are two recommended choices based on the complexity of the customer’s on-premises environment

#####Option 1
If the customer has a small number of applications and a single domain controller for his entire on-premises site and will be failing over the entire site together, then we recommend using ASR-Replication to replicate the DC machine to secondary site (applicable for both Site to Site and Site to Azure)

#####Option 2
If the customer has a large number of applications and is running an Active Directory forest and will failover few applications at a time, then we recommend setting up an additional domain controller on the DR site (secondary site or in Azure). 

Please refer to companion guide  on making a domain controller available on DR site. For remainder of this document we will assume a DC is available on DR site.

###Setup SQL Server replication
Please refer to companion guide  for detailed technical guidance on the recommended option for protecting SQL tier.

###Enable protection for Dynamics AX client and AOS VMs
Enable protection of AX client and AOS VMs in ASR. Perform relevant Azure Site Recovery configuration based on whether the VMs are deployed on Hyper-V or on VMware.

Follow [this guidance](site-recovery-vmware-to-azure.md) to start replicating the virtual machine to Azure. 

> [!NOTE]
> Recommended Crash consistent frequency to configure is 15minutes.
The below snapshot shows the protection status of Dynamics component VMs in ‘VMware site to Azure’ protection scenario.
![Protecteditems](./media/site-recovery-dynamicsax/Protecteditems.png)

### Configure VM settings

For the AX client and AOS VMs configure traget VM properties network settings in ASR so that the VM networks get attached to the right DR network after failover. Ensure the DR network for these tiers is routable to the SQL tier.
You can select the VM in the replicated items to configure the network settings as shown in the snapshot below.

![VMProperties](./media/site-recovery-dynamicsax/VMpropertiesAOS.png)

* Once the replication is complete, make sure you go to each virtual machine of the front end and [select same availability set](site-recovery-availability-set.md) for each of the virtual machine.
* If you are using a static IP then specify the IP that you want the virtual machine to take in the **Target IP** field 


## Creating a recovery plan
You can create a recovery plan in ASR to automate the failover process. Add app tier and web tier in the Recovery Plan. Order them in different groups so that the front-end shutdown before app tier.

1.	Select the ASR vault in your subscription and click on ‘Recovery Plans’ tile. 
2.	Click on ‘+ Recovery plan and specify a name
3.	Select the ‘Source’ and ‘Target’. The target can be Azure or secondary site. In case you choose Azure, you must specify the deployment model 

![Create Recovery Plan](./media/site-recovery-dynamicsax/Recoveryplancreation1.png)

4.	Select the AOS and client VMs to the recovery plan and pres OK.
![Recovery Plan](./media/site-recovery-dynamicsax/SelectVMs.png)
![Recovery Plan](./media/site-recovery-dynamicsax/RecoveryPlan.png)

You can customize the recovery plan for Dynamics AX application by adding various steps as detailed below. The above snapshot shows the complete recovery plan after adding all the steps.

*Steps:1*	SQL Server failover steps.

Refer to ‘SQL Server DR Solution’ companion guide  for details about recovery steps specific to SQL server.

*Steps:2*	Failover Group 1: Failover the AOS VMs 
 Make sure that the recovery point selected is as close as possible to the database PIT but not ahead. 

*Steps:3*	Script 1: Configure availability set (Only E-A)
Add a script (via Azure automation) after AOS VM group comes up to create an availability set and add the App tier VMs into the availability set. You can use a script to do this task.
*Steps:4*	Failover Group 2: Failover the AX client VMs. 
Failover the web tier VMs as part of the recovery plan.
5.	Script 2: Configure availability set (Only E-A)
Add a script (via Azure automation) after Client VM group comes up to create an availability set and add the Web tier VMs into the availability set. You can use a script to do this task.
6.	Manual step 4: Update the DNS records to point to the new VMs in Azure. 
For internet facing sites, no DNS update should be required post failover. Follow the steps described in the previous section to configure Traffic Manager. If Traffic Manager has been setup as described in the previous section, add a script to open dummy port (800 in the example) on the recovery side. 
For internal facing sites, add a manual step to update the DNS record to point to the new front end VM’s load balancer IP.
7.	Script 4:  Open port 80 (only E-A)
Add an Azure automation script to add HTTP endpoint at Port 80 on the front-end VMs. Repeat the same for the Traffic Manager Port added in the previous section.
Refer to Open Azure endpoints script in Appendix section

### Adding virtual machines to failover groups




### Adding scripts to the recovery plan

1. If you are using static IP for the virtual machine and you have hard-coded that in your application, you can use this [script](scipt-location.md) to change the site bindings. 

	![SSL Binding](./media/site-recovery-iis/SSLBinding.png)

1. You can use this [script](scipt-location.md) to update the DNS with the new IPs of the failed over virtual machines.

1. Use this [script](scipt-location.md) to attach a load balance on the failed over virtual machine


## Doing a test failover

![Recovery Plan](./media/site-recovery-iis/TestFailoverJob.png)

Follow [this guidance](site-recovery-test-failover-to-azure.md) to do a test failover. Make sure you do this and that before you start.

## Doing a failover

Follow [this guidance](site-recovery-failover.md) when you are doing a failover. Make sure you do this and that before you start.


## Next steps
You can [learn more](site-recovery-components.md) about replicating a multi-tier IIS based web application in this white paper. Look at the guidance to [replicate other applications](site-recovery-workload.md) using Site Recovery. 
