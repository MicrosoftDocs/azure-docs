---
title: Disaster recovery of Dynamics AX with Azure Site Recovery 
description: Learn how to set up disaster recovery for Dynamics AX with Azure Site Recovery
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: site-recovery
manager: rochakm
ms.topic: how-to
ms.date: 11/27/2018

---
# Set up disaster recovery for a multitier Dynamics AX application   




 Dynamics AX is one of the most popular ERP solutions used by enterprises to standardize processes across locations, manage resources, and simplify compliance. Because the application is critical to an organization, in the event of a disaster, the application should be up and running in minimum time.

Today, Dynamics AX doesn't provide any out-of-the-box disaster recovery capabilities. Dynamics AX consists of many server components, such as Windows Application Object Server, Azure Active Directory, Azure SQL Database, SharePoint Server, and Reporting Services. To manage the disaster recovery of each of these components manually is not only expensive but also error prone.

This article explains how you can create a disaster recovery solution for your Dynamics AX application by using [Azure Site Recovery](site-recovery-overview.md). It also covers planned/unplanned test failovers by using a one-click recovery plan, supported configurations, and prerequisites.



## Prerequisites

Implementing disaster recovery for Dynamics AX application by using Site Recovery requires the following prerequisites:

• Set up an on-premises Dynamics AX deployment.

• Create a Site Recovery vault in an Azure subscription.

• If Azure is your recovery site, run the Azure Virtual Machine Readiness Assessment tool on the VMs. They must be compatible with the Azure Virtual Machines and Site Recovery services.

## Site Recovery support

For the purpose of creating this article, we used VMware virtual machines with Dynamics AX 2012 R3 on Windows Server 2012 R2 Enterprise. Because Site Recovery replication is application agnostic, we expect the recommendations provided here to hold for the following scenarios.

### Source and target

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | Yes | Yes

## Enable disaster recovery of the Dynamics AX application by using Site Recovery
### Protect your Dynamics AX application
To enable the complete application replication and recovery, each component of Dynamics AX must be protected.

### 1. Set up Active Directory and DNS replication

Active Directory is required on the disaster recovery site for the Dynamics AX application to function. We recommend the following two choices based on the complexity of the customer’s on-premises environment.

**Option 1**

The customer has a small number of applications and a single domain controller for the entire on-premises site and plans to fail over the entire site together. We recommend that you use Site Recovery replication to replicate the domain controller machine to a secondary site (applicable for both site-to-site and site-to-Azure scenarios).

**Option 2**

The customer has a large number of applications and is running an Active Directory forest and plans to fail over a few applications at a time. We recommend that you set up an additional domain controller on the disaster recovery site (a secondary site or in Azure).

 For more information, see [Make a domain controller available on a disaster recovery site](site-recovery-active-directory.md). For the remainder of this document, we assume that a domain controller is available on the disaster recovery site.

### 2. Set up SQL Server replication
For technical guidance on the recommended option for protecting the SQL tier, see [Replicate applications with SQL Server and Azure Site Recovery](site-recovery-sql.md).

### 3. Enable protection for the Dynamics AX client and Application Object Server VMs
Perform relevant Site Recovery configuration based on whether the VMs are deployed on [Hyper-V](./hyper-v-azure-tutorial.md) or [VMware](./vmware-azure-tutorial.md).

> [!TIP]
> We recommend that you configure the crash-consistent frequency to 15 minutes.
>

The following snapshot shows the protection status of Dynamics-component VMs in a VMware site-to-Azure protection scenario.

![Protected items](./media/site-recovery-dynamics-ax/protecteditems.png)

### 4. Configure networking
**Configure VM compute and network settings**

For the Dynamics AX client and Application Object Server VMs, configure network settings in Site Recovery so that the VM networks get attached to the right disaster recovery network after failover. Ensure that the disaster recovery network for these tiers is routable to the SQL tier.

You can select the VM in the replicated items to configure the network settings, as shown in the following snapshot:

* For Application Object Server servers, select the correct availability set.

* If you're using a static IP, specify the IP that you want the VM to take in the **Target IP** text box.

    ![Network settings](./media/site-recovery-dynamics-ax/vmpropertiesaos1.png)


### 5. Create a recovery plan

You can create a recovery plan in Site Recovery to automate the failover process. Add an app tier and a web tier in the recovery plan. Order them in different groups so that the front-end shuts down before the app tier.

1. Select the Site Recovery vault in your subscription, and select the **Recovery Plans** tile.

2. Select **+ Recovery plan**, and specify a name.

3. Select the **Source** and **Target**. The target can be Azure or a secondary site. If you choose Azure, you must specify the deployment model.

    ![Create recovery plan](./media/site-recovery-dynamics-ax/recoveryplancreation1.png)

4. Select the Application Object Server and the client VMs for the recovery plan, and select the ✓.

    ![Select items](./media/site-recovery-dynamics-ax/selectvms.png)

    Recovery plan example:

    ![Recovery plan details](./media/site-recovery-dynamics-ax/recoveryplan.png)

You can customize the recovery plan for the Dynamics AX application by adding the following steps. The previous snapshot shows the complete recovery plan after you add all the steps.


* **SQL Server failover steps**:
For information about recovery steps specific to SQL server, see [Replication applications with SQL Server and Azure Site Recovery](site-recovery-sql.md).

* **Failover Group 1**: Fail over the Application Object Server VMs.
Make sure that the recovery point selected is as close as possible to the database PIT, but not ahead of it.

* **Script**: Add load balancer (only E-A).
Add a script (via Azure Automation) after the Application Object Server VM group comes up to add a load balancer to it. You can use a script to do this task. For more information, see [How to add a load balancer for multitier application disaster recovery](https://azure.microsoft.com/blog/cloud-migration-and-disaster-recovery-of-load-balanced-multi-tier-applications-using-azure-site-recovery/).

* **Failover Group 2**: Fail over the Dynamics AX client VMs. Fail over the web tier VMs as part of the recovery plan.


### Perform a test failover

For more information specific to Active Directory during test failover, see the "Active Directory disaster recovery solution" companion guide.

For more information specific to SQL server during test failover, see [Replicate applications with SQL Server and Azure Site Recovery](site-recovery-sql.md).

1. Go to the Azure portal, and select your Site Recovery vault.

2. Select the recovery plan created for Dynamics AX.

3. Select **Test Failover**.

4. Select the virtual network to start the test failover process.

5. After the secondary environment is up, you can perform your validations.

6. After the validations are complete, select **Validations complete** and the test failover environment is cleaned.

For more information on performing a test failover, see [Test failover to Azure in Site Recovery](site-recovery-test-failover-to-azure.md).

### Perform a failover

1. Go to the Azure portal, and select your Site Recovery vault.

2. Select the recovery plan created for Dynamics AX.

3. Select **Failover**, and select **Failover**.

4. Select the target network, and select **✓** to start the failover process.

For more information on doing a failover, see [Failover in Site Recovery](site-recovery-failover.md).

### Perform a failback

For considerations specific to SQL Server during failback, see [Replicate applications with SQL Server and Azure Site Recovery](site-recovery-sql.md).

1. Go to the Azure portal, and select your Site Recovery vault.

2. Select the recovery plan created for Dynamics AX.

3. Select **Failover**, and select **Failover**.

4. Select **Change Direction**.

5. Select the appropriate options: data synchronization and VM creation.

6. Select **✓** to start the failback process.


For more information on doing a failback, see [Failback VMware VMs from Azure to on-premises](./vmware-azure-failback.md).

## Summary
By using Site Recovery, you can create a complete automated disaster recovery plan for your Dynamics AX application. In the event of a disruption, you can initiate the failover within seconds from anywhere and get the application up and running in minutes.

## Next steps
To learn more about protecting enterprise workloads with Site Recovery, see [What workloads can I protect?](site-recovery-workload.md).
