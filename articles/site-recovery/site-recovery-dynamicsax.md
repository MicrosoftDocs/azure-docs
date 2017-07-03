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

Today, Microsoft Dynamics AX  does not provide any out-of-the-box disaster recovery capabilities. Microsoft Dynamics AX consists of many server components like Application Object Server, Active Directory (AD), SQL Database Server, SharePoint Server, Reporting Server etc. To manage the disaster recovery of each of these components manually is not only expensive but also error-prone. 

This article explains in detail about how you can create a disaster recovery solution for your Dynamics AX application using [Azure Site Recovery](site-recovery-overview.md). It will also cover planned/unplanned/test failovers using one-click recovery plan, supported configurations and prerequisites.
Azure Site Recovery based disaster recovery solution is fully tested, certified and recommended by Microsoft Dynamics AX. 


 
## Prerequisites

Implementing disaster recovery for Dynamics AX application using Azure Site Recovery requires the following pre-requisites completed.

•	An on-premises Dynamics AX deployment has been setup

•	Azure Site Recovery Services vault has been created in Microsoft Azure subscription 

•	If Azure is your recovery site, run the Azure Virtual Machine Readiness Assessment tool  on VMs to ensure that they are compatible with Azure VMs and Azure Site Recovery Services


## Site Recovery support

For the purpose of creating this article VMware virtual machines with Dynamics AX  2012R3 on Windows Server 2012 R2 Enterprise were used. As site recovery replication is application agnostic, the recommendations provided here are expected to hold on following scenarios as well. 

### Source and target

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes

## Enable DR of Dynamics AX application using ASR
### Protect your Dynamics AX application 
Each component of the Dynamics AX needs to be protected to enable the complete application replication and recovery. This section covers:

**1. Protection of Active Directory**

**2. Protection of SQL Tier**

**3. Protection of App and Web Tiers**

**4. Networking configuration**

**5. Recovery Plan**

### 1. Setup AD and DNS replication

Active Directory is required on the DR site for Dynamics AX application to function. There are two recommended choices based on the complexity of the customer’s on-premises environment.

**Option 1**

If the customer has a small number of applications and a single domain controller for his entire on-premises site and will be failing over the entire site together, then we recommend using ASR-Replication to replicate the DC machine to secondary site (applicable for both Site to Site and Site to Azure).

**Option 2**

If the customer has a large number of applications and is running an Active Directory forest and will fail-over few applications at a time, then we recommend setting up an additional domain controller on the DR site (secondary site or in Azure). 

Please refer to [companion guide on making a domain controller available on DR site](site-recovery-active-directory.md). For remainder of this document we will assume a DC is available on DR site.

### 2. Setup SQL Server replication
Please refer to companion guide  for detailed technical guidance on the recommended option for protecting [SQL tier](site-recovery-sql.md).

### 3. Enable protection for Dynamics AX client and AOS VMs
Perform relevant Azure Site Recovery configuration based on whether the VMs are deployed on [Hyper-V](site-recovery-hyper-v-site-to-azure.md) or on [VMware](site-recovery-vmware-to-azure.md).
 
> [!TIP]
> Recommended Crash consistent frequency to configure is 15 minutes.
>

The below snapshot shows the protection status of Dynamics component VMs in ‘VMware site to Azure’ protection scenario.
![Protected items ](./media/site-recovery-dynamics-ax/protecteditems.png)

### 4. Configure Networking
Configure VM Compute and Network Settings

For the AX client and AOS VMs configure network settings in ASR so that the VM networks get attached to the right DR network after failover. Ensure the DR network for these tiers is routable to the SQL tier.

You can select the VM in the replicated items to configure the network settings as shown in the snapshot below.

* For AOS servers select the correct availability set.

* If you are using a static IP then specify the IP that you want the virtual machine to take in the **Target IP** field 
![Network Settings ](./media/site-recovery-dynamics-ax/vmpropertiesaos1.png)



### 5. Creating a recovery plan

You can create a recovery plan in ASR to automate the failover process. Add app tier and web tier in the Recovery Plan. Order them in different groups so that the front-end shutdown before app tier.

1)	Select the ASR vault in your subscription and click on ‘Recovery Plans’ tile. 

2)	Click on ‘+ Recovery plan and specify a name.

3)	Select the ‘Source’ and ‘Target’. The target can be Azure or secondary site. In case you choose Azure, you must specify the deployment model 
	
![Create Recovery Plan](./media/site-recovery-dynamics-ax/recoveryplancreation1.png)

4)	Select the AOS and client VMs to the recovery plan and click ✓.
![Create Recovery Plan](./media/site-recovery-dynamics-ax/selectvms.png)


![Recovery Plan](./media/site-recovery-dynamics-ax/recoveryplan.png)

You can customize the recovery plan for Dynamics AX application by adding various steps as detailed below. The above snapshot shows the complete recovery plan after adding all the steps.

*Steps:*

*1.	SQL Server failover steps*

Refer to [‘SQL Server DR Solution’](site-recovery-sql.md) companion guide  for details about recovery steps specific to SQL server.

*2.	Failover Group 1: Failover the AOS VMs*

Make sure that the recovery point selected is as close as possible to the database PIT but not ahead. 

*3.	Script: Add load balancer (Only E-A)*
Add a script (via Azure automation) after AOS VM group comes up to add a load balancer to it. You can use a script to do this task. Refer article [how to add load balancer for multi-tier application DR](https://azure.microsoft.com/blog/cloud-migration-and-disaster-recovery-of-load-balanced-multi-tier-applications-using-azure-site-recovery/)

*4.	Failover Group 2: Failover the AX client VMs.*
Failover the web tier VMs as part of the recovery plan.


### Doing a test failover

Refer to ‘AD DR Solution ’ and ‘SQL Server DR solution ’ companion guides for considerations specific to AD and SQL server respectively during Test Failover.

1.	Go to Azure  portal and select your Site Recovery vault.
2.	Click on the recovery plan created for Dynamics AX.
3.	Click on ‘Test Failover’.
4.	Select the virtual network to start the test fail-over process.
5.	Once the secondary environment is up, you can perform your validations.
6.	Once the validations are complete, you can select ‘Validations complete’ and the test failover environment will be cleaned.

Follow [this guidance](site-recovery-test-failover-to-azure.md) to do a test failover.

### Doing a failover

1.	Go to Azure  portal and select your Site Recovery vault.
2.	Click on the recovery plan created for Dynamics AX.
3.	Click on ‘Failover’ and select ‘ Failover’.
4.	Select the target network and click ✓ to start the failover process.

Follow [this guidance](site-recovery-failover.md) when you are doing a failover.

### Perform a Failback

Refer to ‘SQL Server DR Solution ’ companion guide for considerations specific to SQL server during Failback.

1.	Go to Azure  portal and select your Site Recovery vault.
2.	Click on the recovery plan created for Dynamics AX.
3.	Click on ‘Failover’ and select failover.
4.	Click on ‘Change Direction’.
5.	Select the appropriate options - data synchronization and VM creation options
6.	Click ✓ to start the ‘Failback’ process.


Follow [this guidance](site-recovery-failback-azure-to-vmware.md) when you are doing a failback.

##Summary
Using Azure Site Recovery, you can create a complete automated disaster recovery plan for your Dynamics AX application. You can initiate the failover within seconds from anywhere in the event of a disruption and get the application up and running in minutes.

## Next steps
Read [What workloads can I protect?](site-recovery-workload.md) to learn more about protecting enterprise workloads with Azure Site Recovery.
 
