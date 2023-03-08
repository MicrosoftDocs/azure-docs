---
title: Migrate SQL Server failover cluster to Azure VMware Solution
description: Learn how to migrate SQL Server failover cluster to Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/7/2023
ms.custom: engagement-fy23
---

#  Migrate SQL Server failover cluster to Azure VMware Solution

In this article, you learn how to migrate a Microsoft SQL Server Failover Cluster Instance to Azure VMware Solution. Currently Azure VMware Solution service doesn't support VMware Hybrid Linked Mode to connect an on-premises vCenter Server with one running in Azure VMware Solution. Due to this constraint, the process requires the use of VMware HCX for the migration. Review the [Install and activate VMware HCX in Azure VMware Solution](https://learn.microsoft.com/en-us/azure/azure-vmware/install-vmware-hcx) article for more details about HCX configuration procedure. 

VMware HCX doesn't support migrating virtual machines with SCSI controllers in physical sharing mode attached to a virtual machine. However, we can overcome this limitation by performing the steps detailed in this procedure and using VMware HCX Cold Migration to move the different virtual machines that make up the cluster. 

:::image type="content" source="media/sql-server-hybrid-benefit/sql-alwayson-architecture.png" alt-text="Diagram showing the architecture of always on SQL server for  Azure VMware Solution." border="false"::: 

> [!NOTE]
> This procedure requires a full shutdown of the cluster. Plan accordingly for the downtime period during the migration since the Microsoft SQL Server service will be unavailable. 

## Prerequisites

- Review and record the storage and network configuration of every node in the cluster.
- Review and record WSFC configuration.
- Take a full backup of the database(s) being executed in the cluster.
- Take a full backup of the cluster virtual machines. 
- Remove all cluster node VMs from any DRS Group and rules they're part of.

## Windows Server Failover Cluster quorum considerations

Windows Server Failover Cluster requires a quorum mechanism to maintain the cluster. 

Use an odd number of voting elements to achieve by an odd number of nodes in the cluster or by using a witness. Witnesses can be configured in three different forms:

- Disk witness
- File share witness
- Cloud witness

If the cluster uses **Disk** **witness**, then the disk must be migrated with the cluster shared storage using the [Migrate fail over cluster] (#migrate failover cluster). 

If the cluster uses a **File** **share witness** running on-premises, then the type of witness for your migrated cluster depends on the Azure VMware Solution scenario:

- **Datacenter Extension**: Maintain the file share witness on-premises. Your workloads are distributed across your datacenter and Azure VMware Solution, therefore connectivity between both should always be available. In any case take into consideration bandwidth constraints and plan accordingly. 
- **Datacenter Exit**: For this scenario, there are two options. In both cases, you can maintain the file share witness on-premises during the migration in case you need to do roll back.
  - Deploy a new **File share witness** in your Azure VMware Solution private cloud. 
  - Deploy a **Cloud witness** running in Azure Blob Storage in the same region as the Azure VMware Solution private cloud. 
- Disaster Recovery and Business Continuity: For a disaster recovery scenario, the best and most reliable option is to create a **Cloud Witness** running in Azure Storage. 
- Application Modernization: For this use case, the best option is to deploy a **Cloud Witness**.

For more information about quorum configuration and management, see [Failover Clustering documentation](https://learn.microsoft.com/en-us/windows-server/failover-clustering/manage-cluster-quorum). For more information about deployment of a Cloud witness in Azure Blob Storage, see [Deploy a Cloud Witness for a Failover Cluster](https://learn.microsoft.com/en-us/windows-server/failover-clustering/deploy-cloud-witness) documentation for the details.

## Migrate fail over cluster

For illustration purposes in this document, we're using a two-node cluster with Windows Server 2019 Datacenter and SQL Server 2019 Enterprise. Windows Server 2022 and SQL Server 2022 are also supported with this procedure.

1. From vSphere Client shutdown the second node of the cluster.
1. Access the first node of the cluster and open Failover Cluster Manager.
    1. Verify that the second node is in **Offline** state and that all clustered services and storage are under control of the first node.
     
         :::image type="content" source="media/sql-server-hybrid-benefit/sqlfci-1.png" alt-text="Diagram showing offline state of failover cluster on SQL server for  Azure VMware Solution." border="false":::
 
    1. Shut down the cluster.
    :::image type="content" source="media/sql-server-hybrid-benefit/sqlfci-2.png" alt-text="Diagram showing offline state of failover cluster on SQL server for  Azure VMware Solution." border="false":::
   

     1. Check that all cluster services are stopped gracefully and without errors.
1. Shut down first node of the cluster.
1. From the vSphere Client, edit the settings of the second node of the cluster.
    1. Remove all shared disks from the virtual machine configuration. Ensure that the **Delete files from datastore** check isn't selected, this will permanently delete the disk from the datastore, and you'll need to recover the cluster from a previous backup.
    1. Set SCSI Bus Sharing from Physical to None in the virtual SCSI controllers used for the shared storage. Usually, these controllers are of VMware Paravirtual type.
1. Edit first node virtual machine settings. Set SCSI Bus Sharing from Physical to None in the SCSI controllers. 
1. From vSphere Client access HCX plugin area. Under **Services** select **Migration** > **Migrate**. 
       1. Select second node virtual machine.
       1. Set the vSphere cluster in the remote private cloud that will run the migrated SQL cluster as the **Compute Container**.
       1. Select the **vSAN Datastore** as remote storage.
       1. Select a folder if you want to place the virtual machines in specific folder, this not mandatory but is recommended to separate the different workloads in your Azure VMware Solution private cloud.
       1. Keep **Same format as source**.
       1. Select **Cold migration** as **Migration profile**. 
       1. In **Extended** **Options** select **Migrate Custom Attributes**.
       1. Verify that on-premises network segments have the correct remote stretched segment in Azure.
       1. Select **Validate** and ensure that all checks are completed with pass status. The most common error here will be one related to the storage configuration. Verify again that there are no SCSI controllers with physical sharing setting. 
       1. Select **Go** and the migration will initiate. 
1. Repeat the same process for the first node.
1. Access Azure VMware Solution vSphere Client and edit first node settings and set back to physical SCSI Bus sharing the SCSI controller(s) managing the shared disks.
1. Edit node 2 settings in vSphere Client.
       1. Set SCSI Bus sharing back to physical in the SCSI controller managing shared storage.
       1. Add the cluster shared disks to the node as additional storage. Assign them to the second SCSI controller. 
       1. Ensure that all storage configuration is the same as the one recorded before the migration.
1. Power on first node virtual machine.
1. Access first node VM with VMware Remote Console.
       1. Verify virtual machine network configuration and ensure it can reach on-premises and Azure resources. 
       1. Open Failover Cluster Manager and verify cluster services.

        :::image type="content" source="media/sql-server-hybrid-benefit/sqlfci-3.png" alt-text="Diagram showing offline state of of failover cluster on SQL server for  Azure VMware Solution." border="false":::

1. Power on second node virtual machine.
1. Access the second node VM with VMware Remote Console.
   1. Verify that Windows Server can see the storage.
   1. In Failover Cluster Manager review that the second node appears as Online status.

    :::image type="content" source="media/sql-server-hybrid-benefit/sqlfci-4.png" alt-text="Diagram showing offline state of failover cluster on SQL server for  Azure VMware Solution." border="false":::

1. Using SQL Server Management Studio connect to the SQL Server cluster resource network name.
        Check the database is online and accessible.
        :::image type="content" source="media/sql-server-hybrid-benefit/sqlfci-5.png" alt-text="Diagram showing offline state of failover cluster on SQL server for  Azure VMware Solution." border="false":::
    
1. Finally check connectivity to SQL from other systems and applications in your infrastructure and verify that all applications using the database(s) can still access it.

During the process, you'll create placement policies that can recreate the Affinity or Anti-Affinity rules previously present on-premises. For details about placement policies, see [Create a placement policy in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/create-placement-policy). 

## Next steps

- [Enable SQL Azure hybrid benefit for Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/enable-sql-azure-hybrid-benefit). 
- [Create a placement policy in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/create-placement-policy)  
- [Windows Server Failover Clustering Documentation](https://learn.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [Microsoft SQL Server 2019 Documentation](https://learn.microsoft.com/sql/sql-server/?view=sql-server-ver15)
- [Microsoft SQL Server 2022 Documentation](https://learn.microsoft.com/sql/sql-server/?view=sql-server-ver16)
- [Windows Server Technical Documentation](https://learn.microsoft.com/en-us/windows-server/)
- [Planning Highly Available, Mission Critical SQL Server Deployments with VMware vSphere](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/vmware-vsphere-highly-available-mission-critical-sql-server-deployments.pdf)
- [Microsoft SQL Server on VMware vSphere Availability and Recovery Options](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-availability-and-recovery-options.pdf)
- [VMware KB 100 2951 – Tips for configuring Microsoft SQL Server in a virtual machine](https://kb.vmware.com/s/article/1002951)
- [Microsoft SQL Server 2019 in VMware vSphere 7.0 Performance Study](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/performance/vsphere7-sql-server-perf.pdf)
- [Architecting Microsoft SQL Server on VMware vSphere – Best Practices Guide](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/solutions/sql-server-on-vmware-best-practices-guide.pdf)
- [Setup for Windows Server Failover Cluster in VMware vSphere 7.0](https://docs.vmware.com/en/VMware-vSphere/7.0/vsphere-esxi-vcenter-server-703-setup-wsfc.pdf)

