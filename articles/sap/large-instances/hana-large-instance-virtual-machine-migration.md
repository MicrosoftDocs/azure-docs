---
title: Migrating SAP HANA on Azure (Large Instances) to Azure virtual machines| Microsoft Docs
description: How to migrate SAP HANA on Azure (Large Instances) to Azure virtual machines
services: virtual-machines-linux
documentationcenter:
author: bentrin
manager: juergent
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/11/2022
ms.author: bentrin
ms.custom: H1Hack27Feb2017

---
# SAP HANA on Azure Large Instance migration to Azure Virtual Machines
This article describes possible Azure Large Instance deployment scenarios and offers planning and migration approach with minimized transition downtime.

## Overview
Azure Large Instances for SAP HANA (HLI) were first announced in September 2016. Since then, many have adopted this hardware as a service for their in-memory compute platform. Yet in recent years, the Azure virtual machine (VM) size extension and support of HANA scale-out deployment has exceeded most enterprise customers’ ERP database capacity demand. Many are expressing an interest in migrating their SAP HANA workload from physical servers to Azure VMs.

This article isn't a step-by-step configuration document. It describes the common deployment models and offers planning and migration advice. Our intent is to call out necessary considerations for preparation to minimize transition downtime.

## Assumptions
This article makes the following assumptions:
- We'll only consider a homogenous HANA database compute service migration from Hana Large Instance (HLI) to Azure VM without significant software upgrade or patching. These minor updates include the use of a more recent operating system (OS) version or HANA version explicitly stated as supported by relevant SAP notes. 
- You'll do all updates/upgrades activities before or after the migration.  For example, SAP HANA MCOS converting to MDC deployment. 
- The migration approach offering the least downtime is SAP HANA System Replication. Other migration methods aren't part of the scope of this document.
- This guidance is applicable for both Rev3 and Rev4 SKUs of HLI.
- HANA deployment architecture remains primarily unchanged during the migration.  That is, a system with single instance disaster recovery (DR) will stay the same at the destination.
- You've reviewed and understood the Service Level Agreement (SLA) of the target (to-be) architecture. 
- Commercial terms between HLIs and VMs are different. Monitor the usage of your VMs for cost management.
- You understand that HLI is a dedicated compute platform while VMs run on shared yet isolated infrastructure.
- You've validated that target VMs support your intended architecture. For a list of supported VM SKUs certified for SAP HANA deployment, see the [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120).
- You've validated the design and migration plan.
- Plan for disaster recovery VM along with the primary site.  You can't use the HLI as the DR node for the primary site running on VMs after the migration.
- You copied the required backup files to target VMs, based on business recoverability and compliance requirements. With VM accessible backups, it allows for point-in-time recovery during the transition period.
- For SAP HANA system replication (HSR) high availability (HA), you need to set up and configure the fencing device per SAP HANA HA guides for [SLES](../../virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker.md) and [RHEL](../../virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker.md).  It’s not preconfigured like the HLI case.
- This migration approach doesn't cover the HLI SKUs with Optane configuration.

## Deployment scenarios
You can migrate to Azure VMs for all HLI scenarios. Common deployment models for HLI are summarized in the following table. To benefit from complementary Azure services, you may have to make minor architectural changes.

| Scenario ID | HLI Scenario | Migrate to VM verbatim? | Remark |
| --- | --- | --- | --- |
| 1 | [Single node with one SID](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-with-one-sid) | Yes | - |
| 2 | [Single node with Multiple Components in One System (MCOS)](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-mcos) | Yes | - |
| 3 | [Single node with DR using storage replication](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-with-dr-using-storage-replication) | No | Storage replication isn't available with Azure virtual platform; change current DR solution to either HSR or backup/restore. |
| 4 | [Single node with DR (multipurpose) using storage replication](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-with-dr-multipurpose-using-storage-replication) | No | Storage replication isn't available with Azure virtual platform; change current DR solution to either HSR or backup/restore. |
| 5 | [HSR with fencing for high availability](../../virtual-machines/workloads/sap/hana-supported-scenario.md#hsr-with-fencing-for-high-availability.md) | Yes | No preconfigured SBD for target VMs.  Select and deploy a fencing solution.  Possible options: Azure Fencing Agent (supported for both [RHEL](../../virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker.md), [SLES](../../virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker.md), and SBD. |
| 6 | [HA with HSR, DR with storage replication](../../virtual-machines/workloads/sap/hana-supported-scenario.md#high-availability-with-hsr-and-dr-with-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore. |
| 7 | [Host auto failover (1+1)](../../virtual-machines/workloads/sap/hana-supported-scenario.md#host-auto-failover-11) | Yes | Use Azure NetApp Files (ANF) for shared storage with Azure VMs. |
| 8 | [Scale-out with standby](../../virtual-machines/workloads/sap/hana-supported-scenario.md#scale-out-with-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs using ANF for storage only. |
| 9 | [Scale-out without standby](../../virtual-machines/workloads/sap/hana-supported-scenario.md#scale-out-without-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs (with or without using ANF for storage). |
| 10 | [Scale-out with DR using storage replication](../../virtual-machines/workloads/sap/hana-supported-scenario.md#scale-out-with-dr-using-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore. |
| 11 | [Single node with DR using HSR](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-with-dr-using-hsr) | Yes | - |
| 12 | [Single node HSR to DR (cost optimized)](../../virtual-machines/workloads/sap/hana-supported-scenario.md#single-node-hsr-to-dr-cost-optimized) | Yes | - |
| 13 | [HA and DR with HSR](../../virtual-machines/workloads/sap/hana-supported-scenario.md#high-availability-and-disaster-recovery-with-hsr) | Yes | - |
| 14 | [HA and DR with HSR (cost optimized)](../../virtual-machines/workloads/sap/hana-supported-scenario.md#high-availability-and-disaster-recovery-with-hsr-cost-optimized) | Yes | - |
| 15 | [Scale-out with DR using HSR](../../virtual-machines/workloads/sap/hana-supported-scenario.md#scale-out-with-dr-using-hsr) | Yes | BW/4HANA with M128s. M416s, M416ms VMs (with or without using ANF for storage). |


## Source (HLI) planning
When onboarding your HLI server, you and Microsoft Service Management went through the planning of the compute, network, storage, and OS-specific settings for running the SAP HANA database. Similar planning needs to take place for the migration to Azure VM.

### SAP HANA housekeeping 
It’s a good operational practice to tidy up the database content so unwanted, outdated data, or stale logs aren't migrated to the new database.  Housekeeping generally involves deleting or archiving old, expired, or inactive data.  This ‘data hygiene’ should be tested in non-production systems to validate their data trim validity before production usage.

### Allow network connectivity for new VMs and virtual network 
In your HLI deployment, the network was set up based on the information described in the article [SAP HANA (Large Instances) network architecture](./hana-network-architecture.md). Also, network traffic routing is done in the manner outlined in the section [Routing in Azure](./hana-network-architecture.md#routing-in-azure).
- Is the new VM migration target placed in the existing virtual network with IP address ranges already permitted to connect to the HLI? Then no further connectivity update is required.
- Is the new Azure VM placed in a new Microsoft Azure Virtual Network, perhaps in another region, and peered with the existing virtual network? Then you can use the ExpressRoute service key and Resource ID from the original HLI provisioning to allow access for this new virtual network IP range. Coordinate with Microsoft Service Management to enable the virtual network to HLI connectivity.  
    > [!NOTE]
    > To minimize network latency between the application and database layers, both the application and database layers must be on the same virtual network.  

### Existing app layer availability set, availability zones, and proximity placement group (PPG)
We've designed the current deployment model to satisfy certain service level goals. In this move, ensure the target infrastructure will meet or exceed your set goals.  
More likely than not, your SAP application servers are placed in an availability set. If the current deployment service level is satisfactory, and if the target VM assumes the hostname of the HLI logical name, updating the domain name service (DNS) address resolution pointing to the VM's IP will work without updating any SAP profiles.
- If you’re not using PPG, be sure to place all the application and DB servers in the same zone to minimize network latency.
- If you’re using PPG, refer to a later section of this article, [Availability sets, availability zones, and proximity placement groups](#availability-sets-availability-zones-and-proximity-placement-groups).

### Storage replication discontinuance process (if used)
If you used storage replication as your DR solution, terminate it after the SAP application is shut down. Before you do, be sure the last SAP HANA catalog, log file, and data backups are replicated onto the remote DR HLI storage volumes. This replication is important in case a disaster happens during transition from the physical server to the Azure VM.

### Data backups preservation consideration
After transitioning to SAP HANA on your Azure VM, the snapshot-based data and log backups on the HLI won't be easily accessible or restorable to a VM. We recommend taking file-level backups and snapshots on the HLI even weeks before cut-over. Have these backups copied to an Azure Storage account accessible by the new SAP HANA VM. In the early transition period as well, before the Azure-based backup builds enough history to satisfy Point-in-Time recovery requirements, take file-level backups. 

Backing up the HLI content is critical. It's also prudent to have full backups of the SAP landscape readily accessible in case a rollback is needed.

### Adjusting system monitoring 
You may use many different tools to monitor and send alert notifications for systems within your SAP landscape. Remember to take appropriate action to incorporate changes for monitoring and update the alert notification recipients if needed.

### Microsoft Operations team involvement 
Open a ticket from the Azure portal based on the existing HLI instance.  After the support ticket is created, a support engineer will contact you via email.  

### Engage Microsoft account team
Plan migration close to the anniversary renewal time of the HLI contract to minimize unnecessary expense for the compute resource. To decommission the HLI, coordinate contract termination and shut-down of the unit.

## Destination planning
Careful planning is essential in deploying a new infrastructure to take the place of an existing one. Ensure the new addition will fulfill your needs in the larger scheme of things. Here are some key points to consider.

### Resource availability in the target region 
The current SAP application servers' deployment region are typically close to the associated HLIs. However, HLIs are offered in fewer locations than available Azure regions. When migrating the physical HLI to an Azure VM, it's also a good time to fine-tune the proximity distance of all related services for performance optimization.  While doing so, ensure the chosen region has all the required resources. For instance, you may want to check on the availability of a certain VM family or the Azure Zones offering high availability setup.

### Virtual network 
Do you want to run the new HANA database in an existing virtual network or create a new one? The primary deciding factor is the current networking layout for the SAP landscape. Also, when the infrastructure goes from one-zone to two-zones deployment and uses PPG, it imposes architectural change. For more information, see the article [Azure PPG for optimal network latency with SAP application](../workloads/proximity-placement-scenarios.md).   

### Security
Whether the new SAP HANA VM runs on a new or existing vnet/subnet, it's a new service critical to your business. It deserves safeguarding. Ensure access control compliant with your company's security policy.

### VM sizing recommendation
This migration is also an opportunity to right size your HANA compute engine. You can use HANA [system views](https://help.sap.com/viewer/7c78579ce9b14a669c1f3295b0d8ca16/Cloud/3859e48180bb4cf8a207e15cf25a7e57.html) with HANA Studio to understand the system resource consumption, which allows for right sizing to drive spending efficiency.

### Storage 
Storage performance is one of the factors that will affect your SAP application user experience. There are minimum storage layouts published for given VM SKUs. For more information, see [SAP HANA Azure virtual machine storage configurations](../../virtual-machines/workloads/sap/hana-vm-operations-storage.md). We recommend reviewing these specs and comparing against your existing HLI system statistics to ensure adequate IO capacity and performance for your new HANA VM.

Will you configure PPG for the new HANA VM and its associated severs? Then submit a support ticket to inspect and ensure the co-location of the storage and the VM. Since your backup solution may need to change, also revisit the storage cost to avoid operational spending surprises.

### Storage replication for disaster recovery
With HLI, storage replication was the default option for disaster recovery. This feature isn't the default option for SAP HANA on Azure VM. Consider HSR, backup/restore, or other supported solutions that satisfy your business needs.

### Availability sets, availability zones, and proximity placement groups 
You can shorten the distance between the application layer and SAP HANA to keep network latency at a minimum. Place the new database VM and the current SAP application servers in a PPG. For more information on how Azure availability set and availability zones work with PPG for SAP deployments, see [Proximity Placement Group](../workloads/proximity-placement-scenarios.md).

If members of your HANA system are deployed in more than one Azure Zone, you should be aware of the latency profile of the chosen zones. Place SAP system components to lessen distance between the SAP application and the database. The public domain [Availability zone latency test tool](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/master/AvZone-Latency-Test) helps make the measurement easier.  


### Backup strategy
Many of our customers are already using third-party backup solutions for SAP HANA on HLI.  If you are, then only added protected VM and HANA databases need to be configured. Ongoing HLI backup jobs can be unscheduled if the machine is being decommissioned after the migration.

Azure backup for SAP HANA on VM is now generally available.  For more information on SAP HANA backup in Azure VMs, see [Backup](../../backup/backup-azure-sap-hana-database.md), [Restore](../../backup/sap-hana-db-restore.md), and [Manage](../../backup/sap-hana-db-manage.md).

### DR strategy
If your service level goals accommodate a longer recovery time, backup can be easy. A backup to blob storage and restore in place or restore to a new VM is the simplest and least expensive DR strategy.
 
On the large instance platform, HANA DR is typically done with HSR. On an Azure VM, HSR is also the most natural and native SAP HANA DR solution. Whether the source deployment is single-instance or clustered, a replica of the source infrastructure is required in the DR region.
This DR replica will be configured after the primary HLI to VM migration is complete.  The DR HANA DB will register to the primary SAP HANA on VM instance as a secondary replication site.  

### SAP application server connectivity destination change
The HSR migration results in a new HANA database host and also a new database hostname for the application layer. Modify SAP profiles to reflect the new hostname. If the switching is done by name resolution preserving the hostname, no profile change is required.

### Operating system (OS)
The OS images for HLI and VM, despite being on the same release level (SLES 12 SP4 for example), aren't identical. Validate the required packages, hot fixes, patches, kernel, and security fixes on the HLI. Then install the same packages on the target.  You can use HSR to replicate from an older OS onto a VM with a newer OS version.  Verify the supported versions by reviewing [SAP note 2763388](https://launchpad.support.sap.com/#/notes/2763388).

### New SAP license request
A simple call-out to request a new SAP license for the new HANA system now that it’s been migrated to VMs.

### Service level agreement (SLA) differences
The authors like to call out the difference of availability SLA between HLI and Azure VM.  For example, clustered HLIs HA pairs offer 99.99% availability. To achieve the same SLA, you'll need to deploy VMs in availability zones. [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/) describes availability for various VM configurations so customers can plan their target infrastructure.


## Migration strategy
In this document, we cover only the HANA System Replication approach for the migration from HLI to Azure VM.  Depends on the target storage solution deployed, the process differs slightly. The high-level steps are described below.

### VM with premium/ultra-disks for data
For VMs deployed with premium or ultra-disks, the standard SAP HANA system replication configuration is applicable for setting up HSR. For an overview of steps in setting up system replication, see the [SAP help article](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.04/099caa1959ce4b3fa1144562fa09e163.html). The article also covers taking over a secondary system, failing back to the primary, and disabling system replication. For migration, we'll only need the setup, taking over, and disabling replication steps.  

### VM with ANF for data and log volumes
At a high level, the latest HLI storage snapshots of the full data and log volumes need to be copied to Azure storage. From there they're accessible and recoverable by the target HANA VM.  The copy process can be done with any native Linux copy tools.  

> [!IMPORTANT]
> Copying and data transfer can take hours depending on the HANA database size and network bandwidth. The bulk of the copy process should be done in advance of the primary HANA database downtime.

### MCOS to MDC Conversion
The Multiple Components in One System (MCOS) deployment model was used by some of our HLI customers. The motivation was to circumvent the Multiple Databases Container (MDC) storage snapshot limitation of earlier SAP HANA versions.  In the MCOS model, several independent SAP HANA instances are stacked up in one HANA Large Instance. Using HSR for the migration works fine, but results in multiple HANA VMs with one tenant database each. This model makes for a busier landscape than what you might prefer. The default deployment for SAP HANA 2.0 is MDC. An alternative is to do [HANA tenant move](https://launchpad.support.sap.com/#/notes/2472478) after the HSR migration. HANA tenant move combines these independent HANA databases into cotenants in a single HANA container.  

### Application layer consideration
The database server is viewed as the center of an SAP system.  All application servers should be located near the SAP HANA database. In some cases, when you want to use a new PPG, you may have to move existing application servers onto the PPG where the HANA VM is located.  Building new application servers may be deemed easier if you already have deployment templates ready.

Locate existing application servers and the new HANA VM optimally. Then you won't need to build new application servers, unless you want greater capacity.

When you build a new infrastructure to enhance service availability, your existing application servers may become unnecessary. They can be shut down and deleted.
If the target VM hostname changed, and differs from the HLI hostname, adjust SAP application server profiles to point to the new host. If only the HANA database IP address has changed, update the DNS record to lead incoming connections to the new HANA VM.

### Acceptance test
Migration from HLI to VM makes no material change to the database content as compared to a heterogeneous migration. Still, we recommend checking the performance of the new setup.  

### Cutover plan
Although this migration is straightforward, it does involve the decommissioning of an existing database.  Careful planning to preserve the source system with its content and backup images are critical in case fallback is necessary. Good planning does offer a speedier reversal.   

## Post migration
The migration job isn't done until we've safely decoupled any HLI-dependent services and connectivity to ensure data integrity. Also, we recommend shutting down unnecessary services. This section calls out a few of the more important items.

### Decommissioning the HLI
After successfully migrating the HANA database to an Azure VM, ensure no business transactions run on the HLI database.  However, keeping the HLI running for the length of time of its local backup retention window will ensure speedier recovery if needed. Only when the local backup retention window is past, should you decommission the HANA Large Instance. Then conclude your contractual HLI commitments with Microsoft by contacting their Microsoft representatives.

### Remove any proxy (for example, Iptables, BIGIP) configured for HLI 
If a proxy service like the IPTables is used to route on-premises traffic to and from the HLI, you don't need it after the successful migration to VM.  Nonetheless, this connectivity service should be kept for as long as the HLI is standing by.  Only shut down the service once the HLI is fully decommissioned.

### Remove Global Reach for HLI 
Global Reach is used to connect customers' ExpressRoute gateway with the HLI ExpressRoute gateway.  It allows customers' on-premises traffic to reach the HLI tenant directly without the use of a proxy service. This connection is no longer needed in the absence of the HLI unit after migration. Still, like the IPTables proxy service, GlobalReach should also be kept until the HLI is fully decommissioned.

### Operating system subscription – move/reuse
As the VM servers are deployed and the HLIs are decommissioned, the OS subscriptions can be replaced or reused. There's no need to pay double for OS licenses.

## Next steps

Plan your SAP deployment.

> [!div class="nextstepaction"]
> [SAP workloads on Azure: planning and deployment checklist](../workloads/deployment-checklist.md)
