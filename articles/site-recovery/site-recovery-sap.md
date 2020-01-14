---
title: Set up SAP NetWeaver disaster recovery with Azure Site Recovery 
description: Learn how to set up disaster recovery for SAP NetWeaver with Azure Site Recovery.
author: sideeksh
manager: rochakm
ms.topic: how-to
ms.date: 11/27/2018

---
# Set up disaster recovery for a multi-tier SAP NetWeaver app deployment

Most large-size and medium-size SAP deployments use some form of disaster recovery solution. The importance of robust and testable disaster recovery solutions has increased as more core business processes are moved to applications like SAP. Azure Site Recovery has been tested and integrated with SAP applications. Site Recovery exceeds the capabilities of most on-premises disaster recovery solutions, and at a lower total cost of ownership (TCO) than competing solutions.

With Site Recovery, you can:
* **Enable protection of SAP NetWeaver and non-NetWeaver production applications that run on-premises** by replicating components to Azure.
* **Enable protection of SAP NetWeaver and non-NetWeaver production applications that run on Azure** by replicating components to another Azure datacenter.
* **Simplify cloud migration** by using Site Recovery to migrate your SAP deployment to Azure.
* **Simplify SAP project upgrades, testing, and prototyping** by creating a production clone on-demand for testing SAP applications.

This article describes how to protect SAP NetWeaver application deployments by using [Azure Site Recovery](site-recovery-overview.md). The article covers best practices for protecting a three-tier SAP NetWeaver deployment on Azure by replicating to another Azure datacenter by using Site Recovery. It describes supported scenarios and configurations, and how to perform test failovers (disaster recovery drills) and actual failovers.

## Prerequisites
Before you begin, ensure that you know how to do the following tasks:

* [Replicate a virtual machine to Azure](azure-to-azure-walkthrough-enable-replication.md)
* [Design a recovery network](site-recovery-azure-to-azure-networking-guidance.md)
* [Do a test failover to Azure](azure-to-azure-walkthrough-test-failover.md)
* [Do a failover to Azure](site-recovery-failover.md)
* [Replicate a domain controller](site-recovery-active-directory.md)
* [Replicate SQL Server](site-recovery-sql.md)

## Supported scenarios
You can use Site Recovery to implement a disaster recovery solution in the following scenarios:
* SAP systems running in one Azure datacenter that replicate to another Azure datacenter (Azure-to-Azure disaster recovery). For more information, see [Azure-to-Azure replication architecture](https://aka.ms/asr-a2a-architecture).
* SAP systems running on VMware (or physical) servers on-premises that replicate to a disaster recovery site in an Azure datacenter (VMware-to-Azure disaster recovery). This scenario requires some additional components. For more information, see [VMware-to-Azure replication architecture](https://aka.ms/asr-v2a-architecture).
* SAP systems running on Hyper-V on-premises that replicate to a disaster recovery site in an Azure datacenter (Hyper-V-to-Azure disaster recovery). This scenario requires some additional components. For more information, see [Hyper-V-to-Azure replication architecture](https://aka.ms/asr-h2a-architecture).

In this article, we use an **Azure-to-Azure** disaster recovery scenario to demonstrate the SAP disaster recovery capabilities of Site Recovery. Because Site Recovery replication isn't application-specific, the process that's described is expected to also apply to other scenarios.

### Required foundation services
In the scenario we discuss in this article, the following foundation services are deployed:
* Azure ExpressRoute or Azure VPN Gateway
* At least one Active Directory domain controller and DNS server, running in Azure

We recommend that you establish this infrastructure before you deploy Site Recovery.

## Reference SAP application deployment

This reference architecture shows running SAP NetWeaver in a Windows environment on Azure with high availability.  This architecture is deployed with specific virtual machine (VM) sizes that can be changed to accommodate your organization’s needs.

![Diagram of a typical SAP deployment pattern](./media/site-recovery-sap/sap-netweaver_latest.png)

## Disaster Recovery considerations

For disaster recovery (DR), you must be able to fail over to a secondary region. Each tier uses a different strategy to provide disaster recovery (DR) protection.

#### VMs running SAP Web Dispatcher pool 
The Web Dispatcher component is used as a load balancer for SAP traffic among the SAP application servers. To achieve high availability for the Web Dispatcher component, Azure Load Balancer is used to implement the parallel Web Dispatcher setup in a round-robin configuration for HTTP(S) traffic distribution among the available Web Dispatchers in the balancer pool. This will be replicated using Site Recovery and automation scripts will be used to configure load balancer on the disaster recovery region. 

#### VMs running application servers pool
To manage logon groups for ABAP application servers, the SMLG transaction is used. It uses the load balancing function within the message server of the Central Services to distribute workload among SAP application servers pool for SAPGUIs and RFC traffic. This will be replicated using Site Recovery.

#### VMs running SAP Central Services cluster
This reference architecture runs Central Services on VMs in the application tier. The Central Services is a potential single point of failure (SPOF) when deployed to a single VM—typical deployment when high availability is not a requirement.<br>

To implement a high availability solution, either a shared disk cluster or a file share cluster can be used.To configure VMs for a shared disk cluster, use Windows Server Failover Cluster. Cloud Witness is recommended as a quorum witness. 
 > [!NOTE]
 > Site Recovery does not replicate the cloud witness therefore it is recommended to deploy the cloud witness in the disaster recovery region.

To support the failover cluster environment, [SIOS DataKeeper Cluster Edition](https://azuremarketplace.microsoft.com/marketplace/apps/sios_datakeeper.sios-datakeeper-8) performs the cluster shared volume function by replicating independent disks owned by the cluster nodes. Azure does not natively support shared disks and therefore requires solutions provided by SIOS. 

Another way to handle clustering is to implement a file share cluster. [SAP](https://blogs.sap.com/2018/03/19/migration-from-a-shared-disk-cluster-to-a-file-share-cluster) recently modified the Central Services deployment pattern to access the /sapmnt global directories via a UNC path. However, it is still recommended to ensure that the /sapmnt UNC share is highly available. This can be done on the Central Services instance by using Windows Server Failover Cluster with Scale Out File Server (SOFS) and the Storage Spaces Direct (S2D) feature in Windows Server 2016. 
 > [!NOTE]
 > Currently Site Recovery support only crash consistent point replication of virtual machines using storage spaces direct and Passive node of SIOS Datakeeper


## Disaster recovery considerations

You can use Site Recovery to orchestrate the fail over of full SAP deployment across Azure regions.
Below are the steps for setting up the disaster recovery 

1. Replicate virtual machines 
2. Design a recovery network
3.	Replicate a domain controller
4.	Replicate data base tier 
5.	Do a test failover 
6.	Do a failover 

Below is the recommendation for disaster recovery of each tier used in this example. 

 **SAP tiers** | **Recommendation**
 --- | ---
**SAP Web Dispatcher pool** |  Replicate using Site Recovery 
**SAP Application server pool** |  Replicate using Site Recovery 
**SAP Central Services cluster** |  Replicate using Site Recovery 
**Active directory virtual machines** |  Active directory replication 
**SQL database servers** |  SQL always on replication

## Replicate virtual machines

To start replicating all the SAP application virtual machines to the Azure disaster recovery datacenter, follow the guidance in [Replicate a virtual machine to Azure](azure-to-azure-walkthrough-enable-replication.md).


* For guidance on protecting Active Directory and DNS, refer to [Protect Active Directory and DNS](site-recovery-active-directory.md) document.

* For guidance on protecting database tier running on SQL server, refer to [Protect SQL Server](site-recovery-sql.md) document.

## Networking Configuration

If you use a static IP address, you can specify the IP address that you want the virtual machine to take. To set the IP address, go to  **Compute and Network settings** > **Network interface card**.

![Screenshot that shows how to set a private IP address in the Site Recovery Network interface card pane](./media/site-recovery-sap/sap-static-ip.png)


## Creating a recovery plan
A recovery plan supports the sequencing of various tiers in a multi-tier application during a failover. Sequencing helps maintain application consistency. When you create a recovery plan for a multi-tier web application, complete the steps described in [Create a recovery plan by using Site Recovery](site-recovery-create-recovery-plans.md).

### Adding virtual machines to failover groups

1.	Create a recovery plan by adding the application server, web dispatcher  and SAP Central services VMs.
2.	Click on 'Customize' to group the VMs. By default, all VMs are part of 'Group 1'.



### Add scripts to the recovery plan
For your applications to function correctly, you might need to do some operations on the Azure virtual machines after the failover or during a test failover. You can automate some post-failover operations. For example, you can update the DNS entry and change bindings and connections by adding corresponding scripts to the recovery plan.


You can deploy the most commonly used Site Recovery scripts into your Automation account clicking the 'Deploy to Azure' button below. When you are using any published script, ensure you follow the guidance in the script.

[![Deploy to Azure](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/c4803408-340e-49e3-9a1f-0ed3f689813d.png)](https://aka.ms/asr-automationrunbooks-deploy)

1. Add a pre-action script to 'Group 1' to failover SQL Availability group. Use the 'ASR-SQL-FailoverAG' script published in the sample scripts. Ensure you follow the guidance in the script and make the required changes in the script appropriately.
2. Add a post action script to attach a load balancer on the failed over virtual machines of Web tier (Group 1). Use the 'ASR-AddSingleLoadBalancer' script published in the sample scripts. Ensure you follow the guidance in the script and make the required changes in the script appropriately.

![SAP Recovery Plan](./media/site-recovery-sap/sap_recovery_plan.png)


## Run a test failover

1.	In the Azure portal, select your Recovery Services vault.
2.	Select the recovery plan that you created for SAP applications.
3.	Select **Test Failover**.
4.  To start the test failover process, select the recovery point and the Azure virtual network.
5.	When the secondary environment is up, perform validations.
6.	When validations are complete, to clean the failover environment, select **Cleanup test failover**.

For more information, see [Test failover to Azure in Site Recovery](site-recovery-test-failover-to-azure.md).

## Run a failover

1.	In the Azure portal, select your Recovery Services vault.
2.	Select the recovery plan that you created for SAP applications.
3.	Select **Failover**.
4.	To start the failover process, select the recovery point.

For more information, see [Failover in Site Recovery](site-recovery-failover.md).

## Next steps
* To learn more about building a disaster recovery solution for SAP NetWeaver deployments by using Site Recovery, see the downloadable white paper [SAP NetWeaver: Building a Disaster Recovery Solution with Site Recovery](https://aka.ms/asr_sap). The white paper discusses recommendations for various SAP architectures, lists supported applications and VM types for SAP on Azure, and describes testing plan options for your disaster recovery solution.
* Learn more about [replicating other workloads](site-recovery-workload.md) by using Site Recovery.
