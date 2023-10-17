---
title: Migrate Microsoft SQL Server Standalone to Azure VMware Solution
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to migrate Microsoft SQL Server Standalone to Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/20/2023
ms.custom: engagement-fy23
---

# Migrate a SQL Server standalone instance to Azure VMware Solution

In this article, you learn how to migrate a SQL Server standalone instance to Azure VMware Solution. 

When migrating a SQL Server standalone instance to Azure VMware Solution, VMware HCX offers two migration profiles:

- HCX vMotion
- HCX Cold Migration

In both cases, consider the size and criticality of the database being migrated. 
For this how-to procedure, we have validated VMware HCX vMotion.
VMware HCX Cold Migration is also valid, but it requires a longer downtime period.

This scenario was validated using the following editions and configurations:

- Microsoft SQL Server (2019 and 2022)  
- Windows Server (2019 and 2022) Data Center edition  
- Windows Server and SQL Server were configured following best practices and recommendations from Microsoft and VMware.  
- The on-premises source infrastructure was VMware vSphere 7.0 Update 3 and VMware vSAN running on Dell PowerEdge servers and Intel Optane P4800X SSD NVMe devices.

:::image type="content" source="media/sql-server-hybrid-benefit/migrated-sql-standalone-cluster.png" alt-text="Diagram showing the architecture of Standalone SQL Server for  Azure VMware Solution." border="false" lightbox="media/sql-server-hybrid-benefit/migrated-sql-standalone-cluster.png"::: 

## Prerequisites

- Review and record the storage and network configuration of every node in the cluster.
- Maintain backups of all the databases.
- Back up the virtual machine running the SQL Server instance. 
- Remove all cluster node VMs from any Distributed Resource Scheduler (DRS) groups and rules. 

- Configure VMware HCX between your on-premises datacenter and the Azure VMware Solution private cloud that runs the migrated workloads. For more information about configuring VMware HCX, see [Azure VMware Solution documentation](install-vmware-hcx.md).
- Ensure that all the network segments in use by the SQL Server and workloads using it are extended into your Azure VMware Solution private cloud. To verify this step in the process, see [Configure VMware HCX network extension](configure-hcx-network-extension.md).

Either VMware HCX over VPN or ExpressRoute connectivity can be used as the networking configuration for the migration. 

With VMWare HCX over VPN, due to its limited bandwidth it is typically suited for workloads that can sustain longer periods of downtime (such as non-production environments).

For production environments, or workloads with large database sizes or where there is a need to minimize downtime the ExpressRoute connectivity is recommended for the migration.  

Further downtime considerations are discussed in the next section.

## Downtime considerations

Downtime during a migration depends on the size of the database to be migrated and the speed of the private network connection to Azure cloud.
Migration of a  SQL Server standalone instance using the VMware HCX vMotion mechanism is intended to minimize the solution downtime, however we still recommend the migration take place during off-peak hours within an pre-approved change window.

This table indicates the estimated downtime for migration of each SQL Server topology.

| **Scenario** | **Downtime expected** | **Notes** |
|:---|:-----|:-----|
| **Standalone instance** | Low | Migration is done using VMware vMotion, the database is available during migration time, but it isn't recommended to commit any critical data during it. |
| **Always On SQL Server Availability Group** | Low | The primary replica will always be available during the migration of the first secondary replica and the secondary replica will become the primary after the initial failover to Azure. |
| **Always On SQL Server Failover Cluster Instance** | High | All nodes of the cluster are shutdown and migrated using VMware HCX Cold Migration. Downtime duration depends upon database size and private network speed to Azure cloud. |

## Executing the migration

1. Log into your on-premises **vCenter Server** and access the VMware HCX plugin. 
1. Under **Services**, select **Migration** > **Migrate**.
   1. Select the SQL Server virtual machine.
   2. Set the vSphere cluster in the remote private cloud, which will now host the migrated SQL Server VM or VMs as the **Compute Container**.
   3. Select the vSAN Datastore as remote storage.
   4. Select a folder. This isn't mandatory, but we recommend separating the different workloads in your Azure VMware Solution private cloud.
   5. Keep **Same format as source**.
   6. Select **vMotion** as Migration profile. 
   7. In **Extended Options** select **Migrate Custom Attributes**.
   8. Verify that on-premises network segments have the correct remote stretched segment in Azure VMware Solution.
   9. Select **Validate** and ensure that all checks are completed with pass status. 
   10. Select **Go** to start the migration.
1. After the migration has completed, access the virtual machine using VMware Remote Console in the vSphere Client.
1. Verify the network configuration and check connectivity both with on-premises and Azure VMware Solution resources.
1. Verify your SQL Server and databases are up and accessible. For example, using SQL Server Management Studio verify you can access the database.  

    :::image type="content" source="media/sql-server-hybrid-benefit/sql-standalone-1.png" alt-text="Diagram showing a SQL Server Management Studio connection to the migrated database." border="false" lightbox="media/sql-server-hybrid-benefit/sql-standalone-1.png":::  

Finally, check the connectivity to SQL Server from other systems and applications in your infrastructure and verify that all applications using the database or databases can still access them.

## More information

- [Enable SQL Azure Hybrid Benefit for Azure VMware Solution](enable-sql-azure-hybrid-benefit.md). 
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
