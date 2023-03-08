---
title: Migrate Microsoft SQL Server Always-On cluster to Azure VMware Solution
description: Learn how to migrate Microsoft SQL Server Always-On cluster to Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/7/2023
ms.custom: engagement-fy23
---
# Migrate Microsoft SQL Server Always-On cluster to Azure VMware Solution

In this article, you’ll learn how to migrate Microsoft SQL Server Always-On Cluster to Azure VMware Solution.For VMware HCX, you can use the vMotion migration method. 

:::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-architecture.png" alt-text="Diagram showing the architecture of always on SQL server for  Azure VMware Solution." border="false":::

## Prerequisites

- Review and record the storage and network configuration of every node in the cluster.
- Take a full backup of the database.
- Take a full backup of the virtual machine running the Microsoft SQL Server instance. 
- Remove the virtual machine from any VMware vSphere DRS Groups and rules.

## Windows Server Failover Cluster quorum considerations

Microsoft SQL Server Always-On Availability Groups rely on Windows Server Failover Cluster which requires a quorum voting mechanism to maintain the coherence of the cluster.

An odd number of voting elements is required, which is achieved by an odd number of nodes in the cluster or by using a witness. Witness can be configured in three different forms:

- Disk witness
- File share witness
- Cloud witness

If the cluster uses **Disk witness**, then the disk must be migrated with the rest of cluster shared storage with the procedure described in this document. 

If the cluster uses a **File share witness** running on-premises, then the type of witness for your migrated cluster will depend on the Azure VMware Solution scenario, there are several options to consider.

- Datacenter Extension: Maintain the file share witness on-premises. Your workloads will be distributed across your datacenter and Azure, therefore the connectivity between both should always be available. In any case take into consideration bandwidth constraints and plan accordingly. 
- Datacenter Exit: For this scenario there are two options. In both cases you can maintain the file share witness on-premises during the migration in case you need to do rollback during the process.
  - Deploy a new **File share witness** in your Azure VMware Solution private cloud. 
  - Deploy a **Cloud witness** running in Azure Blob Storage in the same region as the Azure VMware Solution private cloud. 
- Disaster Recovery and Business Continuity: For a disaster recovery scenario the best and most reliable option is to create a **Cloud Witness** running in Azure Storage. 
- Application Modernization: For this use case the best option is to deploy a **Cloud Witness**.

Full details about quorum configuration and management can be consulted in [Failover Clustering documentation](https://learn.microsoft.com/windows-server/failover-clustering/manage-cluster-quorum). Refer to [Manage  a cluster quorum for a Failover Cluster](https://learn.microsoft.com/windows-server/failover-clustering/deploy-cloud-witness) documentation for the details about deployment of Cloud witness in Azure Blob Storage.

## Migrate Microsoft SQL Server Always-On cluster

1. Access your Always-On cluster with SQL Server Management Studio with administration credentials.
    1. Select your primary replica and open **Availability Group** **Properties**.


          :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-1.png" alt-text="Diagram showing how to migrate always on SQL server for  Azure VMware Solution." border="false":::

     1. Change **Availability Mode** to **Asynchronous commit** only for the replica to be migrated.
     1. Change **Failover Mode** to **Manual** for every member of the availability group.
1. Access the on-premises vCenter and proceed to HCX area.
1. Under **Services** select **Migration** > **Migrate**. 
      1. Select one virtual machine running the secondary replica of the database the is going to be migrated.
      1. Set the vSphere cluster in the remote private cloud that will run the migrated SQL cluster as the **Compute Container**.
      1. Select the **vSAN Datastore** as remote storage.
      1. Select a folder if you want to place the virtual machines in specific folder, this not mandatory but is recommended to separate the different workloads in your Azure VMware Solution private cloud.
      1. Keep **Same format as source**.
      1. Select **vMotion** as **Migration profile**. 
      1. In **Extended Options** select **Migrate Custom Attributes**.
      1. Verify that on-premises network segments have the correct remote stretched segment in Azure.
      1. Select **Validate** and ensure that all checks are completed with pass status. The most common error here will be one related to the storage configuration. Verify again that there are no virtual SCSI controllers with physical sharing setting. 
      1. Click **Go** and the migration will initiate. 
1. Once the migration has been completed, access the migrated replica and verify connectivity with the rest of the members in the availability group.
1. In SQL Server Management Studio, open the **Availability Group Dashboard** and verify that the replica appears as **Online**. 
      :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-2.png" alt-text="Diagram showing how to migrate always on SQL server for  Azure VMware Solution." border="false":::
 
   1. **Data Loss** status in the **Failover Readiness** column is expected since the replica has been out-of-sync with the primary during the migration. 
1. Edit the **Availability Group** **Properties** again and set **Availability Mode** back to **Synchronous commit**.
      1. The secondary replica will start to synchronize back all the changes made to the primary replica during the migration. Wait until it appears in Synchronized state. 
1. From the **Availability Group Dashboard** in SSMS click on **Start Failover Wizard**.
1. Select the migrated replica and click **Next**.

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-3.png" alt-text="Diagram showing how to migrate always on SQL server for  Azure VMware Solution." border="false":::

1. Connect to the replica in the next screen with your DB admin credentials.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-4.png" alt-text="Diagram showing how to connect to the replica and migrate always on SQL server for  Azure VMware Solution." border="false":::
  
1. Review the changes and click **Finish** to start the failover operation.

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-5.png" alt-text="Diagram showing how to review changes and migrate always on SQL server for  Azure VMware Solution." border="false":::

 
1. Monitor the progress of the failover in the next screen and click **Close** when the operation is finished.
    :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-6.png" alt-text="Diagram showing how to review results and migrate always on SQL server for  Azure VMware Solution." border="false"::: 


1. Refresh the **Object Explorer** view in SSMS and verify that the migrated instance is now the primary replica.
1. Repeat steps 1 to 6 for the rest of the replicas of the availability group.
  at. 
       1. Do not migrate all the replicas at the same time using **HCX Bulk Migration**. Instead, migrate one replica at a time and verify that all changes are synchronized back to the replica after each migration.
1. Once the migration of all the replicas is completed, access your Always-On availability group with **SQL Server Management Studio**.
    1. Open the Dashboard and verify there is no data loss in any of the replicas and that all are in     **Synchronized** state.
          :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-7.png" alt-text="Diagram showing how to review changes and migrate always on SQL server for  Azure VMware Solution." border="false":::
    1. Edit the **Properties** of the availability group and set **Failover Mode** to **Automatic** in all replicas. 
              :::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-8.png" alt-text="Diagram showing how to edit the properties and  migrate always on SQL server for  Azure VMware Solution." border="false":::

During the process, you will create placement policies that can recreate the Affinity or Anti-Affinity rules previously present on-premises. For more details about placement policies, see [Create a placement policy in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/create-placement-policy) article. 

## Next steps 

[Enable SQL Azure hybrid benefit for Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/enable-sql-azure-hybrid-benefit).  

[Create a placement policy in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/create-placement-policy)   

[Windows Server Failover Clustering Documentation](https://learn.microsoft.com/windows-server/failover-clustering/failover-clustering-overview) 

[Microsoft SQL Server 2019 Documentation](https://learn.microsoft.com/sql/sql-server/) 

[Microsoft SQL Server 2022 Documentation](https://learn.microsoft.com/sql/sql-server/) 

[Windows Server Technical Documentation](https://learn.microsoft.com/windows-server/) 

[Planning Highly Available, Mission Critical SQL Server Deployments with VMware vSphere](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/vmware-vsphere-highly-available-mission-critical-sql-server-deployments.pdf) 

[Microsoft SQL Server on VMware vSphere Availability and Recovery Options](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-availability-and-recovery-options.pdf) 

[VMware KB 100 2951 – Tips for configuring Microsoft SQL Server in a virtual machine](https://kb.vmware.com/s/article/1002951) 

[Microsoft SQL Server 2019 in VMware vSphere 7.0 Performance Study](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/performance/vsphere7-sql-server-perf.pdf) 

[Architecting Microsoft SQL Server on VMware vSphere – Best Practices Guide](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-best-practices-guide.pdf) 

[Setup for Windows Server Failover Cluster in VMware vSphere 7.0](https://docs.vmware.com/en/VMware-vSphere/7.0/vsphere-esxi-vcenter-server-703-setup-wsfc.pdf) 

