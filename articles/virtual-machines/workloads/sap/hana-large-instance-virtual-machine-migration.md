---
title: Migrating SAP HANA on Azure (Large Instances) to Azure virtual machines| Microsoft Docs
description: How to migrate SAP HANA on Azure (Large Instances) to Azure virtual machines
services: virtual-machines-linux
documentationcenter:
author: bentrin
manager: juergent
editor:

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/11/2020
ms.author: bentrin
ms.custom: H1Hack27Feb2017

---
# SAP HANA on Azure Large Instance migration to Azure Virtual Machines
This article describes possible Azure Large Instance deployment scenarios and offers planning and migration approach with minimized transition downtime

## Overview
Since the announcement of the Azure Large Instances for SAP HANA (HLI) in September 2016, many customers have adopted this hardware as a service offering for their in-memory compute platform.  In recent years, the Azure VM size extension coupled with the support of HANA scale-out deployment has exceeded most enterprise customers’ ERP database capacity demand.  We begin to see customers expressing the interest to migrate their SAP HANA workload from physical servers to Azure VMs.
This guide isn't a step-by-step configuration document. It describes the common deployment models and offers planning and migration advises.  The intent is to call out necessary considerations for preparation to minimize transition downtime.

## Assumptions
This article makes the following assumptions:
- The only interest considered is a homogenous HANA database compute service migration from Hana Large Instance (HLI) to Azure VM without significant software upgrade or patching. These minor updates include the use of a more recent OS version or HANA version explicitly stated as supported by relevant SAP notes. 
- All updates/upgrades activities need to be done before or after the migration.  For example, SAP HANA MCOS converting to MDC deployment. 
- The migration approach that would offer the least downtime is SAP HANA System Replication. Other migration methods aren't part of the scope of this document.
- This guidance is applicable for both Rev3 and Rev4 SKUs of HLI.
- HANA deployment architecture remains primarily unchanged during the migration.  That is, a system with single instance DR will stay the same way at the destination.
- Customers have reviewed and understood the Service Level Agreement (SLA) of the target (to-be) architecture. 
- Commercial terms between HLIs and VMs are different. Customers should monitor the usage of their VMs for cost management.
- Customers understand that HLI is a dedicated compute platform while VMs run on shared yet isolated infrastructure.
- Customers have validated that target VMs support your intended architecture. To see all the supported VM SKUs certified for SAP HANA deployment, see the [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure).
- Customers have validated the design and migration plan.
- Plan for disaster recovery VM along with the primary site.  Customers can't use the HLI as the DR node for the primary site running on VMs after the migration.
- Customers copied the required backup files to target VMs, based on business recoverability and compliance requirements. With VM accessible backups, it allows for point-in-time recovery during the transition period.
- For HSR HA, customers need to set up and configure the STONITH device per SAP HANA HA guides for [SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) and [RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker).  It’s not preconfigured like the HLI case.
- This migration approach doesn't cover the HLI SKUs with Optane configuration.

## Deployment scenarios
Common deployment models with HLI customers are summarized in the following table.  Migration to Azure VMs for all HLI scenarios is possible.  To benefit from complementary Azure services available, minor architectural changes may be required.

| Scenario ID | HLI Scenario | Migrate to VM verbatim? | Remark |
| --- | --- | --- | --- |
| 1 | [Single node with one SID](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-one-sid) | Yes | - |
| 2 | [Single node with MCOS](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-mcos) | Yes | - |
| 3 | [Single node with DR using storage replication](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-using-storage-replication) | No | Storage replication is not available with Azure virtual platform, change current DR solution to either HSR or backup/restore |
| 4 | [Single node with DR (multipurpose) using storage replication](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-multipurpose-using-storage-replication) | No | Storage replication is not available with Azure virtual platform, change current DR solution to either HSR or backup/restore |
| 5 | [HSR with STONITH for high availability](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#hsr-with-stonith-for-high-availability) | Yes | No preconfigured SBD for target VMs.  Select and deploy a STONITH solution.  Possible options: Azure Fencing Agent (supported for both [RHEL](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker), [SLES](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker)), SBD |
| 6 | [HA with HSR, DR with storage replication](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-with-hsr-and-dr-with-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore |
| 7 | [Host auto failover (1+1)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#host-auto-failover-11) | Yes | Use ANF for shared storage with Azure VMs |
| 8 | [Scale-out with standby](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs using ANF for storage only |
| 9 | [Scale-out without standby](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-without-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs (with or without using ANF for storage) |
| 10 | [Scale-out with DR using storage replication](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-dr-using-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore |
| 11 | [Single node with DR using HSR](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-using-hsr) | Yes | - |
| 12 | [Single node HSR to DR (cost optimized)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-hsr-to-dr-cost-optimized) | Yes | - |
| 13 | [HA and DR with HSR](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-and-disaster-recovery-with-hsr) | Yes | - |
| 14 | [HA and DR with HSR (cost optimized)](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-and-disaster-recovery-with-hsr-cost-optimized) | Yes | - |
| 15 | [Scale-out with DR using HSR](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-dr-using-hsr) | Yes | BW/4HANA with M128s. M416s, M416ms VMs (with or without using ANF for storage) |


## Source (HLI) planning
When onboarding an HLI server, both Microsoft Service Management and customers went through the planning of the compute, network, storage, and OS-specific settings for running the SAP HANA database.  Similar planning needs to take place for the migration to Azure VM.

### SAP HANA housekeeping 
It’s a good operational practice to tidy up the database content so unwanted, outdated data, or stale logs aren't migrated to the new database.  Housekeeping generally involves deleting or archiving of old, expired, or inactive data.  These ‘data hygiene’ actions should be tested in non-production systems to validate their data trim validity before production usage.

### Allow network connectivity for new VMs and, or virtual network 
In a customer’s HLI deployment, the network has been set up based on the information described in the article [SAP HANA (Large Instances) network architecture](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture). Also, network traffic routing is done in the manner outlined in the section ‘Routing in Azure’.
- In setting up a new VM as the migration target, If it's placed in the existing virtual network with IP address ranges already permitted to connect to the HLI, no further connectivity update is required.
- If the new Azure VM is placed in a new Microsoft Azure Virtual Network, may be in another region, and peered with the existing virtual network, the ExpressRoute service key and Resource ID from the original HLI provisioning are usable to allow access for this new virtual network IP range.  Coordinate with Microsoft Service Management to enable the virtual network to HLI connectivity.  Note: To minimize network latency between the application and database layers, both the application and database layers must be on the same virtual network.  

### Existing app layer Availability Set, Availability Zones, and Proximity Placement Group (PPG)
The current deployment model is done to satisfy certain service level objectives.  In this move, ensure the target infrastructure will meet or exceed the set goals.  
More likely than not, customers SAP application servers are placed in an availability set.  If the current deployment service level is satisfactory and 
- If the target VM assumes the hostname of the HLI logical name, updating the domain name service (DNS) address resolution pointing to the VM's IP would work without updating any SAP profiles
- If you’re not using PPG, be sure to place all the application and DB servers in the same zone to minimize network latency.
- If you’re using PPG, refer to the section of this document: 'Destination Planning, Availability Set, Availability Zones, and Proximity Placement Group (PPG)'.

### Storage replication discontinuance process (if used)
If storage replication is used as the DR solution, it should be terminated (unscheduled) after the SAP application has been shut down.  In addition, the last SAP HANA catalog, log file, and data Backups have been replicated onto the remote DR HLI storage volumes.  Doing so as a precaution in case a disaster happens during the physical server to Azure VM transition.

### Data backups preservation consideration
After the cut-over to SAP HANA on Azure VM, all the snapshot-based data or log backups on the HLI aren't easily accessible or restorable to a VM if needed. In the early transition period, before the Azure-based backup builds enough history to satisfy Point-in-Time recovery requirements, we recommend taking file level backups in addition to snapshots on the HLI, days or weeks before cut-over.  Have these backups copied to an Azure Storage account accessible by the new SAP HANA VM.
In addition to backing up the HLI content, it’s prudent to have full backups of the SAP landscape readily accessible in case a rollback is needed.

### Adjusting system monitoring 
Customers use many different tools to monitor and send alert notifications for systems within their SAP landscape.  This item is just a call-out for appropriate action to incorporate changes for monitoring and update the alert notification recipients if needed.

### Microsoft Operations team involvement 
Open a ticket from the Azure portal based on the existing HLI instance.  After the support ticket is created, a support engineer will contact you via email.  

### Engage Microsoft account team
Plan migration close to the anniversary renewal time of the HLI contract to minimize unnecessary over expense on compute resource. To decommission the HLI blade, it’s required to coordinate contract termination and actual shut-down of the unit.

## Destination planning
Standing up a new infrastructure to take the place of an existing one deserves some thinking to ensure the new addition will fit in the large scheme of things.  Below are some key points for contemplation.

### Resource availability in the target region 
The current SAP application servers' deployment region typically are in close proximity with the associated HLIs.  However, HLIs are offered in fewer locations than available Azure regions.  When migrating the physical HLI to Azure VM, it's also a good time to ‘fine-tune’ the proximity distance of all related services for performance optimization.  While doing so, one key consideration is to ensure the chosen region has all required resources.  For example, the availability of certain VM family or the offering of Azure Zones for high availability setup.

### Virtual network 
Customers need to choose whether to run the new HANA database in an existing virtual network or to create a new one.  The primary deciding factor is the current networking layout for the SAP landscape.  Also when the infrastructure goes from one-zone to two-zones deployment and uses PPG, it imposes architectural change. For more information, see the article [Azure PPG for optimal network latency with SAP application](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios).   

### Security
Whether the new SAP HANA VM landing on a new or existing vnet/subnet, it represents a new business critical service that requires safeguarding.  Access control compliant with company info security policy ought to be evaluated and deployed for this new class of service.

### VM sizing recommendation
This migration is also an opportunity to right size your HANA compute engine.  One can use HANA [system views](https://help.sap.com/viewer/7c78579ce9b14a669c1f3295b0d8ca16/Cloud/3859e48180bb4cf8a207e15cf25a7e57.html) in conjunction with HANA Studio to understand the system resource consumption, which allows for right sizing to drive spending efficiency.

### Storage 
Storage performance is one of the factors that impacts SAP application user experience.  Base on a given VM SKU, there are minimum storage layout published [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage). We recommend reviewing these minimum specs and comparing against the existing HLI system statistics to ensure adequate IO capacity and performance for the new HANA VM.

If you configure PPG for the new HANA VM and its associated severs, submit a support ticket to inspect and ensure the co-location of the storage and the VM. Since your backup solution may need to change, the storage cost should also be revisited to avoid operational spending surprises.

### Storage replication for disaster recovery
With HLI, storage replication was offered as the default option for the disaster recovery. This feature is not the default option for SAP HANA on Azure VM. Consider HSR, backup/restore or other supported solutions satisfying your business needs.

### Availability Sets, Availability Zones, and Proximity Placement Groups 
To shorten distance between the application layer and SAP HANA to keep network latency at a minimum, the new database VM and the current SAP application servers should be placed in a PPG. Refer to [Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios) to learn how Azure Availability Set and Availability Zones work with PPG for SAP deployments.
If members of the target HANA system are deployed in more than one Azure Zone, customers should have a clear view of the latency profile of the chosen zones. The placement of SAP system components is optimal regarding proximal distance between SAP application and the database.  The public domain [Availability zone latency test tool](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/master/AvZone-Latency-Test) helps make the measurement easier.  


### Backup strategy
Many customers are already using third-party backup solutions for SAP HANA on HLI.  In that case only an additional protected VM and HANA databases need to be configured.  Ongoing HLI backup jobs can now be unscheduled if the machine is being decommissioned after the migration.
Azure Backup for SAP HANA on VM is now generally available.  See these links for detailed information about: [Backup](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database), [Restore](https://docs.microsoft.com/azure/backup/sap-hana-db-restore), [Manage](https://docs.microsoft.com/azure/backup/sap-hana-db-manage) SAP HANA backup in Azure VMs.

### DR strategy
If your service level objectives accommodate a longer recovery time, a simple backup to blob storage and restore in place or restore to a new VM is the simplest and least expensive DR strategy.  
Like the large instance platform where HANA DR typically is done with HSR; On Azure VM, HSR is also the most natural and native SAP HANA DR solution.  Regardless of whether the source deployment is single-instance or clustered, a replica of the source infrastructure is required in the DR region.
This DR replica will be configured after the primary HLI to VM migration is complete.  The DR HANA DB will register to the primary SAP HANA on VM instance as a secondary replication site.  

### SAP application server connectivity destination change
The HSR migration results in a new HANA DB host and hence a new DB hostname for the application layer, SAP profiles need to be modified to reflect the new hostname.  If the switching is done by name resolution preserving the hostname, no profile change is required.

### Operating system
The operating system images for HLI and VM, despite being on the same release level, SLES 12 SP4 for example, aren't identical. Customers must validate the required packages, hot fixes, patches, kernel, and security fixes on the HLI to install the same packages on the target.  It's supported to use HSR to replicate from an older OS onto a VM with a newer OS version.  Verify the specific supported versions by reviewing [SAP note 2763388](https://launchpad.support.sap.com/#/notes/2763388).

### New SAP license request
A simple call-out to request a new SAP license for the new HANA system now that it’s been migrated to VMs.

### Service level agreement (SLA) differences
The authors like to call out the difference of availability SLA between HLI and Azure VM.  For example, clustered HLIs HA pairs offer 99.99% availability. To achieve the same SLA, one must deploy VMs in availability zones. This [article](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/) describes availability with associated deployment architectures so customers can plan their target infrastructure accordingly.


## Migration strategy
In this document, we cover only the HANA System Replication approach for the migration from HLI to Azure VM.  Depends on the target storage solution deployed, the process differs slightly. The high-level steps are described below.

### VM with premium/ultra-disks for data
For VMs that are deployed with premium or ultra-disks, the standard SAP HANA system replication configuration is applicable for setting up HSR.  The [SAP help article](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.04/099caa1959ce4b3fa1144562fa09e163.html) provides an overview of the steps involved in setting up system replication, taking over a secondary system, failing back to the primary, and disabling system replication.  For the purpose of the migration, we will only need the setup, taking over, and disabling replication steps.  

### VM with ANF for data and log volumes
At a high level, the latest HLI storage snapshots of the full data and log volumes need to be copied to Azure Storage where they are accessible and recoverable by the target HANA VM.  The copy process can be done with any native Linux copy tools.  

> [!IMPORTANT]
> Copying and data transfer can take hours depends on the HANA database size and network bandwidth.  The bulk of the copy process should be done in advance of the primary HANA DB downtime.

### MCOS to MDC Conversion
The Multiple Components in One System (MCOS) deployment model was used by some of our HLI customers.  The motivation was to circumvent the Multiple Databases Container (MDC) storage snapshot limitation of earlier SAP HANA versions.  In the MCOS model, several independent SAP HANA instances are stacked up in one HLI blade.  Using HSR for the migration would work fine but resulting in multiple HANA VMs with one tenant DB each.  This end-state makes for a busier landscape than what a customer might have been accustom to.  With SAP HANA 2.0 default deployment being MDC, A viable alternative is to perform [HANA tenant move](https://launchpad.support.sap.com/#/notes/2472478) after the HSR migration.  This process ‘consolidates’ these independent HANA databases into cotenants in one single HANA container.  

### Application layer consideration
The DB server is viewed as the center of an SAP system.  All application servers should be located near the SAP HANA DB.  In some cases when new use of PPG is desired, relocating of existing application servers onto the PPG where the HANA VM is may be required.  Building new application servers may be deemed easier if you already have deployment templates handy.  
If existing application servers and the new HANA VM are optimally located, no new application servers need to be built unless additional capacity is required.  
If a new infrastructure is built to enhance service availability, the existing application servers may become unnecessary and should be shut down and deleted.
If the target VM hostname changed, and differ from the HLI hostname, SAP application server profiles need to be adjusted to point to the new host.  If only the HANA DB IP address has changed, a DNS record update is needed to lead incoming connections to the new HANA VM.

### Acceptance test
Although the migration from HLI to VM makes no material change to the database content as compared to a heterogeneous migration, we still recommend validating key functionalities and performance aspect of the new setup.  

### Cutover plan
Although this migration is straight forward, it however involves the decommissioning of an existing DB.  Careful planning to preserve the source system with its associated content and backup images are critical in case fallback is necessary.  Good planning does offer a speedier reversal.   


## Post migration
The migration job is not done until we have safely decoupled any HLI-dependent services or connectivity to ensure data integrity is preserved.  Also, shut down unnecessary services.  This section calls out a few top-of-mind items.

### Decommissioning the HLI
After a successful migration of the HANA DB to Azure VM, ensure no productive business transactions run on the HLI DB.  However, keeping the HLI running for a period of time equals to its local backup retention window is a safe practice ensuring speedier recovery if needed.  Only then should the HLI blade be decommissioned.  Customers should contractually conclude their HLI commitments with Microsoft by contacting their Microsoft representatives.

### Remove any proxy (ex: Iptables, BIGIP) configured for HLI 
If a proxy service like the IPTables is used to route on-premises traffic to and from the HLI, it is no longer needed after the successful migration to VM.  However, this connectivity service should be kept for as long as the HLI blade is still standing-by.  Only shut down the service after the HLI blade is fully decommissioned.

### Remove Global Reach for HLI 
Global Reach is used to connect customers' ExpressRoute gateway with the HLI ExpressRoute gateway.  It allows customers' on-premises traffic to reach the HLI tenant directly without the use of a proxy service.  This connection is no longer needed in absence of the HLI unit after migration.  Like the case of the IPTables proxy service, GlobalReach should also be kept until the HLI blade is fully decommissioned.

### Operating system subscription – move/reuse
As the VM servers are stood up and the HLI blades are decommissioned, the OS subscriptions can be replaced or reused to avoid double paying of OS licenses.



## Next steps
See these articles:
- [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations).
- [SAP workloads on Azure: planning and deployment checklist](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-deployment-checklist).
