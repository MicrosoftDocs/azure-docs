---
title: Migrate Microsoft SQL Server Standalone to Azure VMware Solution
description: Learn how to migrate Microsoft SQL Server Standalone to Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/7/2023
ms.custom: engagement-fy23
---

# Migrate Microsoft SQL Server Standalone to Azure VMware Solution

In this article, you’ll learn to migrate Microsoft SQL Server standalone to Azure VMware Solution. 

When migrating Microsoft SQL Server Standalone to Azure VMware Solution, VMware HCX offers several migration profiles that can be used:

- HCX vMotion
- HCX Cold Migration

In both cases, consider the size and criticality of the database being migrated. For this procedure we have validated VMware HCX vMotion. HCX Cold Migration is also valid, but it will require a longer downtime period. 

:::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-architecture.png" alt-text="Diagram showing the architecture of always on SQL server for  Azure VMware Solution." border="false"::: 

## Prerequisites

- Review and record the storage and network configuration of every node in the cluster.
- Take a full backup of the database.
- Take a full backup of the virtual machine running the Microsoft SQL Server instance. 
- Remove the virtual machine from any VMware vSphere DRS Groups and rules. 

## Migrate Microsoft SQL Server standalone

1. Log into your on-premises vCenter Server and access the VMware HCX plugin. 
1. Under **Services** select **Migration** > **Migrate**. 
   c. Select the Microsoft SQL Server virtual machine.
   a. Set the vSphere cluster in the remote private cloud that will run the migrated SQL cluster as the **Compute Container**.
   a. Select the vSAN Datastore as remote storage.
   a. Select a folder if you want to place the VM in a specific folder, this is not mandatory but is recommended to separate the different workloads in your Azure VMware Solution private cloud.
   a. Keep **Same format as source**.
   a. Select **vMotion** as Migration profile. 
   a. In **Extended Options** select **Migrate Custom Attributes**.
   a. Verify that on-premises network segments have the correct remote stretched segment in Azure VMware Solution.
   a. Select **Validate** and ensure that all checks are completed with pass status. 
   a. Click **Go** and the migration will initiate. 
1. After the migration has completed, access the virtual machine using VMware Remote Console in the vSphere Client.
   n. Verify the network configuration and check connectivity both with on-premises and Azure VMware Solution resources.
   a. Using SQL Server Management Studio verify you can access the database.  

   

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-standalone-1.png" alt-text="Diagram showing the architecture of always on SQL server for  Azure VMware Solution." border="false"::: 

During the process, you will create placement policies that can recreate the Affinity or Anti-Affinity rules previously present on-premises. For detailed information about the placement policies, see [Create a placement policy in Azure VMware Solution](create-placement-policy.md). 

## Next steps

- [Enable SQL Azure hybrid benefit for Azure VMware Solution](https://learn.microsoft.com/en-us/azure/azure-vmware/enable-sql-azure-hybrid-benefit). 
- [Create a placement policy in Azure VMware Solution](https://learn.microsoft.com/en-us/azure/azure-vmware/create-placement-policy)  
- [Windows Server Failover Clustering Documentation](https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-clustering-overview)
- [Microsoft SQL Server 2019 Documentation](https://learn.microsoft.com/en-us/sql/sql-server/?view=sql-server-ver15)
- [Microsoft SQL Server 2022 Documentation](https://learn.microsoft.com/en-us/sql/sql-server/?view=sql-server-ver16)
- [Windows Server Technical Documentation](https://learn.microsoft.com/en-us/windows-server/)
- [Planning Highly Available, Mission Critical SQL Server Deployments with VMware vSphere](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/vmware-vsphere-highly-available-mission-critical-sql-server-deployments.pdf)
- [Microsoft SQL Server on VMware vSphere Availability and Recovery Options](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-availability-and-recovery-options.pdf)
- [VMware KB 100 2951 – Tips for configuring Microsoft SQL Server in a virtual machine](https://kb.vmware.com/s/article/1002951)
- [Microsoft SQL Server 2019 in VMware vSphere 7.0 Performance Study](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/performance/vsphere7-sql-server-perf.pdf)
- [Architecting Microsoft SQL Server on VMware vSphere – Best Practices Guide](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-best-practices-guide.pdf)
- [Setup for Windows Server Failover Cluster in VMware vSphere 7.0](https://docs.vmware.com/en/VMware-vSphere/7.0/vsphere-esxi-vcenter-server-703-setup-wsfc.pdf)

