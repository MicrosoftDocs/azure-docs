---
title: Migrate Microsoft SQL Server Always On Availability Group to Azure VMware Solution
description: Learn how to migrate Microsoft SQL Server Always On Availability Group to Azure VMware Solution.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: how-to
ms.service: azure-vmware
ms.date: 01/08/2025
ms.custom: engagement-fy23
---
# Migrate a SQL Server Always On Availability Group to Azure VMware Solution

In this article, you learn how to migrate a SQL Server Always On Availability Group  to Azure VMware Solution. For VMware HCX, you can follow the VMware vMotion migration procedure.

:::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-architecture.png" alt-text="Diagram showing the architecture of Always On SQL Server for  Azure VMware Solution." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-architecture.png":::

Microsoft SQL Server (2019 and 2022) was tested with Windows Server (2019 and 2022) Data Center edition with the virtual machines deployed in the on-premises environment. Windows Server and SQL Server are configured following best practices and recommendations from Microsoft and VMware. The on-premises source infrastructure was VMware vSphere 7.0 Update 3 and VMware vSAN running on Dell PowerEdge servers and Intel Optane P4800X SSD NVMe devices.

## Prerequisites

The following are the prerequisites to migrating your SQL Server instance to Azure VMware Solution.

- Review and record the storage and network configuration of every node in the cluster.
- Maintain backups of all the SQL Server databases.
- Back up the virtual machine or virtual machines hosting SQL Server.
- Remove the virtual machine from any VMware vSphere Distributed Resource Scheduler (DRS) groups and rules.
- VMware HCX must be configured between your on-premises datacenter and the Azure VMware Solution private cloud that runs the migrated workloads. For more information on how to configure HCX, see [Azure VMware Solution documentation](install-vmware-hcx.md).
- Ensure that all the network segments in use by SQL Server and workloads using it are extended into your Azure VMware Solution private cloud. To verify this step, see [Configure VMware HCX network extension](configure-hcx-network-extension.md).

Either VMware HCX over VPN or ExpressRoute connectivity can be used as the networking configuration for the migration.

With VMware HCX over VPN, due to its limited bandwidth, is typically suited for workloads that can sustain longer periods of downtime (such as nonproduction environments).

For any of the following instances, ExpressRoute connectivity is recommended for a migration:

- Production environments
- Workloads with large database sizes
- Scenarios in which there's a need to minimize downtime the ExpressRoute connectivity is recommended for the migration.

Further downtime considerations are discussed in the next section.


## Downtime considerations

Downtime during a migration depends upon the size of the database to be migrated and the speed of the private network connection to Azure cloud.
While SQL Server Availability Group migrations can be executed with minimal solution downtime, it's optimal to conduct the migration during off-peak hours within a preapproved change window.

The following table indicates the estimated downtime for migration of each SQL Server topology.

| **Scenario** | **Downtime expected** | **Notes** |
|:---|:-----|:-----|
| **SQL Server standalone instance** | Low | Migration is done using VMware vMotion, the database is available during migration time, but it isn't recommended to commit any critical data during it. |
| **SQL Server Always On Availability Group** | Low | The primary replica will always be available during the migration of the first secondary replica and the secondary replica will become the primary after the initial failover to Azure. |
| **SQL Server Always On Failover Cluster Instance** | High | All nodes of the cluster are shut down and migrated using VMware HCX Cold Migration. Downtime duration depends upon database size and private network speed to Azure cloud. |

## Windows Server Failover Cluster quorum considerations

Microsoft SQL Server Always On Availability Groups rely on Windows Server Failover Cluster, which requires a quorum voting mechanism to maintain the coherence of the cluster.

An odd number of voting elements is required, which is achieved by an odd number of nodes in the cluster or by using a witness. Witness can be configured in three different ways:

- Disk witness
- File share witness
- Cloud witness

If the cluster uses **Disk witness**, then the disk must be migrated with the rest of cluster shared storage using the procedure described in this document. 

If the cluster uses a **File share witness** running on-premises, then the type of witness for your migrated cluster depends upon the Azure VMware Solution scenario, there are several options to consider.

- **Datacenter Extension**: Maintain the file share witness on-premises. Your workloads are distributed across your datacenter and Azure. Therefore the connectivity between your datacenter and Azure should always be available. In any case, take into consideration bandwidth constraints and plan accordingly. 
- **Datacenter Exit**: For this scenario, there are two options. In both options, you can maintain the file share witness on-premises during the migration in case you need to do roll back during the process.
  - Deploy a new **File share witness** in your Azure VMware Solution private cloud. 
  - Deploy a **Cloud witness** running in Azure Blob Storage in the same region as the Azure VMware Solution private cloud. 
- **Disaster Recovery and Business Continuity**: For a disaster recovery scenario, the best and most reliable option is to create a **Cloud Witness** running in Azure Storage.
- **Application Modernization**: For this use case, the best option is to deploy a **Cloud Witness**.

For details about configuring and managing the quorum, see [Failover Clustering documentation](/windows-server/failover-clustering/manage-cluster-quorum). For information  about deployment of Cloud witness in Azure Blob Storage, see [Manage a cluster quorum for a Failover Cluster](/windows-server/failover-clustering/deploy-cloud-witness).

## Migrate SQL Server Always On Availability Group

1. Access your Always On Availability Group with SQL Server Management Studio using administration credentials.
   - Select your primary replica and open **Availability Group** **Properties**.
          :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-1.png" alt-text="Diagram showing Always On Availability Group properties." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-1.png":::
   - Change **Availability Mode** to **Asynchronous commit** only for the replica to be migrated.
   - Change **Failover Mode** to **Manual** for every member of the availability group.
1. Access the on-premises vCenter Server and proceed to HCX area.
1. Under **Services**, select **Migration** > **Migrate**. 
   - Select one virtual machine running the secondary replica of the database the is going to be migrated.
   - Set the vSphere cluster in the remote private cloud, which now hosts the migrated SQL Server VM or VMs as the **Compute Container**.
   - Select the **vSAN Datastore** as remote storage.
   - Select a folder. It's not mandatory, but is recommended to separate the different workloads in your Azure VMware Solution private cloud.
   - Keep **Same format as source**.
   - Select **vMotion** as **Migration profile**. 
   - In **Extended Options** select **Migrate Custom Attributes**.
   - Verify that on-premises network segments have the correct remote stretched segment in Azure.
   - Select **Validate** and ensure that all checks are completed with pass status. The most common error is related to the storage configuration. Verify again that there are no virtual SCSI controllers have the physical sharing setting. 
   - Select **Go** to start the migration. 
1. Once the migration is completed, access the migrated replica and verify connectivity with the rest of the members in the availability group.
1. In SQL Server Management Studio, open the **Availability Group Dashboard** and verify that the replica appears as **Online**. 
      :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-2.png" alt-text="Diagram showing Always On Availability Group Dashboard." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-2.png":::
 
   - **Data Loss** status in the **Failover Readiness** column is expected since the replica is out-of-sync with the primary during the migration. 
1. Edit the **Availability Group** **Properties** again and set **Availability Mode** back to **Synchronous commit**.
   - The secondary replica starts to synchronize back all the changes made to the primary replica during the migration. Wait until it appears in Synchronized state. 
1. From the **Availability Group Dashboard**, in SSMS, select **Start Failover Wizard**.
1. Select the migrated replica and select **Next**.

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-3.png" alt-text="Diagram showing new primary replica selection for Always On." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-3.png":::

1. Connect to the replica in the next screen with your DB admin credentials.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-4.png" alt-text="Diagram showing new primary replica admin credentials connection." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-4.png":::
  
1. Review the changes and select **Finish** to start the failover operation.

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-5.png" alt-text="Diagram showing Availability Group Always On operation review." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-5.png":::

 
1. Monitor the progress of the failover in the next screen, select **Close** when the operation is finished.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-6.png" alt-text="Diagram showing that SQL Server Always On cluster successfully finished." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-6.png"::: 


1. Refresh the **Object Explorer** view in SQL Server Management Studio (SSMS), verify that the migrated instance is now the primary replica.
1. Repeat steps 1 to 6 for the rest of the replicas of the availability group.
   
    >[!Note]
    > Migrate one replica at a time and verify that all changes are synchronized back to the replica after each migration. Do not migrate all the replicas at the same time using **HCX Bulk Migration**. 
1. After the migration of all the replicas is completed, access your Always On availability group with **SQL Server Management Studio**.
   - Open the Dashboard and verify there's no data loss in any of the replicas and that all are in a     **Synchronized** state.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-7.png" alt-text="Diagram showing availability Group Dashboard with new primary replica and all migrated secondary replicas in synchronized state." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-7.png":::
   - Edit the **Properties** of the availability group and set **Failover Mode** to **Automatic** in all replicas.
    
       :::image type="content" source="media/sql-server-hybrid-benefit/sql-always-on-8.png" alt-text="Diagram showing a setting for failover back to Automatic for all replicas." border="false" lightbox="media/sql-server-hybrid-benefit/sql-always-on-8.png":::

## Next steps 

- [Enable SQL Azure hybrid benefit for Azure VMware Solution](enable-sql-azure-hybrid-benefit.md).  
- [Create a placement policy in Azure VMware Solution](create-placement-policy.md)   
- [Windows Server Failover Clustering Documentation](/windows-server/failover-clustering/failover-clustering-overview) 
- [Microsoft SQL Server 2019 Documentation](/sql/sql-server/) 
- [Microsoft SQL Server 2022 Documentation](/sql/sql-server/) 
- [Windows Server Technical Documentation](/windows-server/) 
- [Planning Highly Available, Mission Critical SQL Server Deployments with VMware vSphere](https://www.vmware.com/docs/architecting-mssql-server-for-ha-on-vmware-vsphere-platform-final-0)
- [VMware KB 100 2951 – Tips for configuring Microsoft SQL Server in a virtual machine](https://knowledge.broadcom.com/external/article?legacyId=1002951)
- [Microsoft SQL Server 2019 in VMware vSphere 7.0 Performance Study](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/performance/vsphere7-sql-server-perf.pdf)
- [Architecting Microsoft SQL Server on VMware vSphere – Best Practices Guide](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-best-practices-guide.pdf)
- [Setup for Windows Server Failover Cluster in VMware vSphere 7.0](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/setup-for-windows-server-failover-clustering.html)
