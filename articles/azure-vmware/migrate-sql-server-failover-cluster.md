---
title: Migrate SQL Server Failover cluster to Azure VMware Solution
description: Learn how to migrate SQL Server Failover cluster to Azure VMware Solution
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: how-to
ms.service: azure-vmware
ms.date: 6/20/2023
ms.custom: engagement-fy23
---

#  Migrate a SQL Server Always On Failover Cluster Instance to Azure VMware Solution

In this article, you'll learn how to migrate a SQL Server Failover Cluster Instance to Azure VMware Solution.
Currently Azure VMware Solution service doesn't support VMware Hybrid Linked Mode to connect an on-premises vCenter Server with one running in Azure VMware Solution.
Due to this constraint, this process requires the use of VMware HCX for the migration.
For more details about configuring HCX, see [Install and activate VMware HCX in Azure VMware Solution](install-vmware-hcx.md).

VMware HCX doesn't support migrating virtual machines with SCSI controllers in physical sharing mode attached to a virtual machine.
However, you can overcome this limitation by performing the steps shown in this procedure and by using VMware HCX Cold Migration to move the different virtual machines that make up the cluster.

:::image type="content" source="media/sql-server-hybrid-benefit/migrated-sql-failover-cluster.png" alt-text="Diagram showing the architecture of SQL Server Failover for Azure VMware Solution." border="false" lightbox="media/sql-server-hybrid-benefit/migrated-sql-failover-cluster.png":::

> [!NOTE]
> This procedure requires a full shutdown of the cluster. Since the SQL Server service will be unavailable during the migration, plan accordingly for the downtime period.  

## Prerequisites

- Review and record the storage and network configuration of every node in the cluster.
- Review and record the WSFC configuration.
- Maintain backups of all the SQL Server databases.
- Back up the cluster virtual machines.
- Remove all cluster node VMs from any Distributed Resource Scheduler (DRS) groups and rules they're part of.
- VMware HCX must be configured between your on-premises datacenter and the Azure VMware Solution private cloud that runs the migrated workloads. For more details about installing VMware HCX, see [Azure VMware Solution documentation](install-vmware-hcx.md).
- Ensure that all the network segments in use by SQL Server and workloads using it are extended into your Azure VMware Solution private cloud. To verify this step, see [Configure VMware HCX network extension](configure-hcx-network-extension.md).

VMware HCX over VPN is supported in Azure VMware Solution for workload migration.
However, due to the size of database workloads it isn't recommended for Microsoft SQL Server Failover Cluster Instance and Microsoft SQL Server Always On migrations, especially for production workloads.
ExpressRoute connectivity is recommended as more performant and reliable.
For Microsoft SQL Server Standalone and non-production workloads this can be suitable, depending upon the size of the database, to migrate.

Microsoft SQL Server 2019 and 2022 were tested with Windows Server 2019 and 2022 Data Center edition with the virtual machines deployed in the on-premises environment. 
Windows Server and SQL Server have been configured following best practices and recommendations from Microsoft and VMware. 
The on-premises source infrastructure was VMware vSphere 7.0 Update 3 and VMware vSAN running on Dell PowerEdge servers and Intel Optane P4800X SSD NVMe devices.

## Downtime considerations

Downtime during a migration depends on the size of the database to be migrated and the speed of the private network connection to Azure cloud.
Migration of SQL Server Failover Cluster Instances Always On to Azure VMware Solution requires a full downtime of the database and all cluster nodes, however you should plan for the migration to be executed during off-peak hours with an approved change window.

The table below indicates the downtime for each Microsoft SQL Server topology.

| **Scenario** | **Downtime expected** | **Notes** |
|:---|:-----|:-----|
| **Standalone instance** | Low | Migration will be done using vMotion, the database will be available during migration time, but it isn't recommended to commit any critical data during it. |
| **Always-On SQL Server Availability Group** | Low | The primary replica will always be available during the migration of the first secondary replica and the secondary replica will become the primary after the initial failover to Azure. |
| **Always On SQL Server Failover Cluster Instance** | High | All nodes of the cluster will be shut down and migrated using VMware HCX Cold Migration. Downtime duration will depend upon database size and private network speed to Azure cloud. |

## Windows Server Failover Cluster quorum considerations

Windows Server Failover Cluster requires a quorum mechanism to maintain the cluster. 

Use an odd number of voting elements to achieve by an odd number of nodes in the cluster or by using a witness. Witnesses can be configured in three different forms:

- Disk witness
- File share witness
- Cloud witness

If the cluster uses **Disk witness**, then the disk must be migrated with the cluster shared storage using the [Migrate fail over cluster](#migrate-failover-cluster). 

If the cluster uses a **File** **share witness** running on-premises, then the type of witness for your migrated cluster depends on the Azure VMware Solution scenario:

- **Datacenter Extension**: Maintain the file share witness on-premises. Your workloads are distributed across your datacenter and Azure VMware Solution, therefore connectivity between both should always be available. In any case take into consideration bandwidth constraints and plan accordingly. 
- **Datacenter Exit**: For this scenario, there are two options. In both cases, you can maintain the file share witness on-premises during the migration in case you need to do roll back.
  - Deploy a new **File share witness** in your Azure VMware Solution private cloud. 
  - Deploy a **Cloud witness** running in Azure Blob Storage in the same region as the Azure VMware Solution private cloud. 
- Disaster Recovery and Business Continuity: For a disaster recovery scenario, the best and most reliable option is to create a **Cloud Witness** running in Azure Storage. 
- Application Modernization: For this use case, the best option is to deploy a **Cloud Witness**.

For more information about quorum configuration and management, see [Failover Clustering documentation](/windows-server/failover-clustering/manage-cluster-quorum). For more information about deploying a Cloud witness in Azure Blob Storage, see [Deploy a Cloud Witness for a Failover Cluster](/windows-server/failover-clustering/deploy-cloud-witness) documentation for the details.

## Migrate failover cluster

For illustration purposes, in this document we're using a two-node cluster with Windows Server 2019 Datacenter and SQL Server 2019 Enterprise. Windows Server 2022 and SQL Server 2022 are also supported with this procedure.

1. From vSphere Client shutdown the second node of the cluster.
1. Access the first node of the cluster and open **Failover Cluster Manager**.
   - Verify that the second node is in **Offline** state and that all clustered services and storage are under the control of the first node.
         :::image type="content" source="media/sql-server-hybrid-benefit/sql-failover-1.png" alt-text="Diagram showing Windows Server Failover Cluster Manager cluster storage verification." border="false" lightbox="media/sql-server-hybrid-benefit/sql-failover-1.png"::: 
   - Shut down the cluster.
    
        :::image type="content" source="media/sql-server-hybrid-benefit/sql-failover-2.png" alt-text="Diagram showing a shut down cluster using Windows Server Failover Cluster Manager." border="false" lightbox="media/sql-server-hybrid-benefit/sql-failover-2.png":::
  
   - Check that all cluster services are successfully stopped without errors.
1. Shut down first node of the cluster.
1. From the **vSphere Client**, edit the settings of the second node of the cluster.
   - Remove all shared disks from the virtual machine configuration.
   - Ensure that the **Delete files from datastore** checkbox isn't selected as this will permanently delete the disk from the datastore, and you'll need to recover the cluster from a previous backup.
   - Set **SCSI Bus Sharing** from **Physical** to **None** in the virtual SCSI controllers used for the shared storage. Usually, these controllers are of VMware Paravirtual type.
1. Edit the first node virtual machine settings. Set **SCSI Bus Sharing** from **Physical** to **None** in the SCSI controllers.
 
1. From the **vSphere Client**, go to the HCX plugin area. Under **Services**, select **Migration** > **Migrate**. 
   - Select the second node virtual machine.
   - Set the vSphere cluster in the remote private cloud, which will now host the migrated SQL Server VM or VMs, as the **Compute Container**.
   - Select the **vSAN Datastore** as remote storage.
   - Select a folder if you want to place the virtual machines in specific folder, this not mandatory but is recommended to separate the different workloads in your Azure VMware Solution private cloud.
   - Keep **Same format as source**.
   - Select **Cold migration** as **Migration profile**. 
   - In **Extended** **Options** select **Migrate Custom Attributes**.
   - Verify that on-premises network segments have the correct remote stretched segment in Azure.
   - Select **Validate** and ensure that all checks are completed with pass status. The most common error here is one related to the storage configuration. Verify again that there are no SCSI controllers with physical sharing setting. 
   - Select **Go** and the migration will initiate. 
1. Repeat the same process for the first node.
1. Access **Azure VMware Solution vSphere Client** and edit the first node settings and set back to physical SCSI Bus sharing the SCSI controller or controllers managing the shared disks.

1. Edit node 2 settings in **vSphere Client**.
   - Set SCSI Bus sharing back to physical in the SCSI controller managing shared storage.
   - Add the cluster shared disks to the node as additional storage. Assign them to the second SCSI controller. 
   - Ensure that all the storage configuration is the same as the one recorded before the migration.
1. Power on the first node virtual machine.
1. Access the first node VM with **VMware Remote Console**.
   - Verify virtual machine network configuration and ensure it can reach on-premises and Azure resources. 
   - Open **Failover Cluster Manager** and verify cluster services.

       :::image type="content" source="media/sql-server-hybrid-benefit/sql-failover-3.png" alt-text="Diagram showing a cluster summary in Failover Cluster Manager." border="false" lightbox="media/sql-server-hybrid-benefit/sql-failover-3.png":::

1. Power on the second node virtual machine.
1. Access the second node VM from the **VMware Remote Console**.
   - Verify that Windows Server can reach the storage.
   - In the **Failover Cluster Manager** review that the second node appears as **Online** status.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-failover-4.png"  alt-text="Diagram showing a cluster node status in Failover Cluster Manager." border="false" lightbox="media/sql-server-hybrid-benefit/sql-failover-4.png":::

1. Using the **SQL Server Management Studio** connect to the SQL Server cluster resource network name. Confirm all databases are online and accessible.

:::image type="content" source="media/sql-server-hybrid-benefit/sql-failover-5.png" alt-text="Diagram showing a verification of SQL Server Management Studio connection  to the migrated cluster instance database." border="false" lightbox="media/sql-server-hybrid-benefit/sql-failover-5.png":::

Finally, check the connectivity to SQL Server from other systems and applications in your infrastructure and verify that all applications using the database or databases can still access them. 

## More information

- [Enable Azure Hybrid Benefit for SQL Server in Azure VMware Solution](enable-sql-azure-hybrid-benefit.md). 
- [Create a placement policy in Azure VMware Solution](create-placement-policy.md)  
- [Windows Server Failover Clustering Documentation](/windows-server/failover-clustering/failover-clustering-overview)
- [Microsoft SQL Server 2019 Documentation](/sql/sql-server/?view=sql-server-ver15&preserve-view=true)
- [Microsoft SQL Server 2022 Documentation](/sql/sql-server/?view=sql-server-ver16&preserve-view=true)
- [Windows Server Technical Documentation](/windows-server/)
- [Planning Highly Available, Mission Critical SQL Server Deployments with VMware vSphere](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/vmware-vsphere-highly-available-mission-critical-sql-server-deployments.pdf)
- [Microsoft SQL Server on VMware vSphere Availability and Recovery Options](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-availability-and-recovery-options.pdf)
- [VMware KB 100 2951 – Tips for configuring Microsoft SQL Server in a virtual machine](https://kb.vmware.com/s/article/1002951)
- [Microsoft SQL Server 2019 in VMware vSphere 7.0 Performance Study](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/performance/vsphere7-sql-server-perf.pdf)
- [Architecting Microsoft SQL Server on VMware vSphere – Best Practices Guide](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-best-practices-guide.pdf)
- [Setup for Windows Server Failover Cluster in VMware vSphere 7.0](https://docs.vmware.com/en/VMware-vSphere/7.0/vsphere-esxi-vcenter-server-703-setup-wsfc.pdf)
