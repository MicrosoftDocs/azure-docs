---
title: Migrate SAP HANA on Azure Large Instances to Azure virtual machines
description: Learn how to plan and migrate SAP HANA workloads from Azure Large Instances (HLI) to Azure virtual machines, including deployment scenarios and strategies.
services: virtual-machines-linux
author: bentrin
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: concept-article
ms.date: 03/24/2026
ms.author: bentrin
ms.custom: H1Hack27Feb2017
# Customer intent: "As an SAP administrator, I want to migrate SAP HANA workloads from Large Instances to Azure Virtual Machines, so that I can enhance performance, reduce costs, and leverage Azure's scalability for my database needs."
---

# SAP HANA on Azure Large Instance migration to Azure virtual machines

SAP HANA on Azure Large Instances is a dedicated, bare-metal infrastructure service that runs SAP HANA workloads outside of Azure virtual machines (VMs). Because the HLI service is being retired, you need to migrate your SAP HANA workloads to Azure VMs to maintain support and take advantage of the broader Azure ecosystem.

This article helps you evaluate your current HLI deployment scenario, plan the migration to Azure VMs, and prepare for a transition with minimal downtime.

## Assumptions

This article makes the following assumptions:

- This article considers only a homogeneous HANA database compute service migration from HANA Large Instance (HLI) to Azure VM without significant software upgrade or patching. These minor updates include the use of a more recent operating system (OS) version or HANA version explicitly stated as supported by relevant SAP notes.
- You do all update/upgrade activities before or after the migration. For example, SAP HANA MCOS converting to MDC deployment.
- The migration approach offering the least downtime is SAP HANA System Replication. Other migration methods are outside the scope of this article.
- This guidance applies to both Rev3 and Rev4 SKUs of HLI.
- HANA deployment architecture remains primarily unchanged during the migration. That is, a system with single instance disaster recovery (DR) stays the same at the destination.
- The Service Level Agreement (SLA) of the target (to-be) architecture is reviewed and understood.
- Commercial terms between HLIs and VMs are different. Monitor the usage of your VMs for cost management.
- You understand that HLI is a dedicated compute platform while VMs run on shared yet isolated infrastructure.
- You validate that the target VMs support your intended architecture. For a list of supported VM SKUs certified for SAP HANA deployment, see the [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120).
- You validate the design and migration plan.
- Plan for a disaster recovery VM along with the primary site. You can't use the HLI as the DR node for the primary site running on VMs after the migration.
- You copied the required backup files to target VMs, based on business recoverability and compliance requirements. VM-accessible backups allow for point-in-time recovery during the transition period.
- For SAP HANA system replication (HSR) high availability (HA), you need to set up and configure the fencing device according to SAP HANA HA guides for [SLES](/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker) and [RHEL](/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker). It isn't preconfigured like the HLI case.
- This migration approach doesn't cover the HLI SKUs with Optane configuration.

## Deployment scenarios

You can migrate to Azure VMs for all HLI scenarios. The following table summarizes common deployment models for HLI. To benefit from complementary Azure services, you might need to make minor architectural changes.

| Scenario ID | HLI Scenario | Migrate to VM verbatim? | Remark |
| --- | --- | --- | --- |
| 1 | [Single node with one SID](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-one-sid) | Yes | - |
| 2 | [Single node with Multiple Components in One System (MCOS)](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-mcos) | Yes | - |
| 3 | [Single node with DR using storage replication](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-using-storage-replication) | No | Storage replication isn't available with Azure virtual platform; change current DR solution to either HSR or backup/restore. |
| 4 | [Single node with DR (multipurpose) using storage replication](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-multipurpose-using-storage-replication) | No | Storage replication isn't available with Azure virtual platform; change current DR solution to either HSR or backup/restore. |
| 5 | [HSR with fencing for high availability](/azure/virtual-machines/workloads/sap/hana-supported-scenario#hsr-with-fencing-for-high-availability) | Yes | No preconfigured SBD for target VMs. Select and deploy a fencing solution. Possible options: Azure Fencing Agent (supported for both [RHEL](/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker), [SLES](/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker), and SBD.) |
| 6 | [HA with HSR, DR with storage replication](/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-with-hsr-and-dr-with-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore. |
| 7 | [Host auto failover (1+1)](/azure/virtual-machines/workloads/sap/hana-supported-scenario#host-auto-failover-11) | Yes | Use Azure NetApp Files (ANF) for shared storage with Azure VMs. |
| 8 | [Scale-out with standby](/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs using ANF for storage only. |
| 9 | [Scale-out without standby](/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-without-standby) | Yes | BW/4HANA with M128s, M416s, M416ms VMs (with or without using ANF for storage). |
| 10 | [Scale-out with DR using storage replication](/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-dr-using-storage-replication) | No | Replace storage replication for DR needs with either HSR or backup/restore. |
| 11 | [Single node with DR using HSR](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-with-dr-using-hsr) | Yes | - |
| 12 | [Single node HSR to DR (cost optimized)](/azure/virtual-machines/workloads/sap/hana-supported-scenario#single-node-hsr-to-dr-cost-optimized) | Yes | - |
| 13 | [HA and DR with HSR](/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-and-disaster-recovery-with-hsr) | Yes | - |
| 14 | [HA and DR with HSR (cost optimized)](/azure/virtual-machines/workloads/sap/hana-supported-scenario#high-availability-and-disaster-recovery-with-hsr-cost-optimized) | Yes | - |
| 15 | [Scale-out with DR using HSR](/azure/virtual-machines/workloads/sap/hana-supported-scenario#scale-out-with-dr-using-hsr) | Yes | BW/4HANA with M128s, M416s, M416ms VMs (with or without using ANF for storage). |

## Source (HLI) planning

When you onboarded your HLI server, you and Microsoft Service Management planned the compute, network, storage, and OS-specific settings for running the SAP HANA database. You need to do similar planning for the migration to an Azure VM.

### SAP HANA housekeeping

As a good operational practice, tidy up the database content so unwanted, outdated data, or stale logs aren't migrated to the new database. Housekeeping generally involves deleting or archiving old, expired, or inactive data. To validate the data trim validity before production usage, test the data hygiene in non-production systems.

### Allow network connectivity for new VMs and virtual network

In your HLI deployment, the network was set up based on the original SAP HANA Large Instances network architecture. For information about the current state of HLI and migration guidance, see [SAP HANA Large Instance decommission](./decommission-sap-hana.md).

- Is the new VM migration target placed in the existing virtual network with IP address ranges already permitted to connect to the HLI? Then you don't need any further connectivity updates.
- Is the new Azure VM placed in a new Azure virtual network, perhaps in another region, and peered with the existing virtual network? Then you can use the ExpressRoute service key and Resource ID from the original HLI provisioning to allow access for this new virtual network IP range. Coordinate with Microsoft Service Management to enable the virtual network to HLI connectivity.

  > [!NOTE]
  > To minimize network latency between the application and database layers, both the application and database layers must be on the same virtual network.

### Existing app layer availability set, availability zones, and proximity placement group (PPG)

Your current deployment model is designed to satisfy certain service level goals. In this move, ensure the target infrastructure meets or exceeds your goals.
In most cases, your SAP application servers are in an availability set. If the current service level is satisfactory, the target VM can reuse the HLI logical hostname. Update the DNS record to point to the VM's IP address, and no SAP profile changes are needed.

- If you're not using PPG, place every application and database servers in the same zone to minimize network latency.
- If you’re using PPG, refer to a later section of this article, [Availability sets, availability zones, and PPGs](#availability-sets-availability-zones-and-ppgs).

### Storage replication discontinuance process (if used)

If you used storage replication as your DR solution, terminate it after you shut down the SAP application. Before you do, make sure the last SAP HANA catalog, log file, and data backups replicated to the remote DR HLI storage volumes. This replication is important in case a disaster happens during transition from the physical server to the Azure VM.

### Data backups preservation consideration

After you transition to SAP HANA on your Azure VM, the snapshot-based data and log backups on the HLI aren't easily accessible or restorable to a VM. Take file-level backups and snapshots on the HLI even weeks before cutover. Copy these backups to an Azure Storage account accessible by the new SAP HANA VM. In the early transition period, before the Azure-based backup builds enough history to satisfy point-in-time recovery requirements, take file-level backups.

Backing up the HLI content is critical. It's also prudent to have full backups of the SAP landscape readily accessible in case you need a rollback.

### Adjusting system monitoring

You might use many different tools to monitor and send alert notifications for systems within your SAP landscape. Incorporate changes for monitoring and update the alert notification recipients as needed.

### Microsoft Operations team involvement

Open a ticket from the Azure portal based on the existing HLI instance. After you create the support ticket, a support engineer contacts you via email.

### Engage Microsoft account team

Plan migration close to the anniversary renewal time of your HLI contract to minimize unnecessary compute resource expenses. To decommission the HLI, coordinate contract termination and shutdown of the unit.

## Destination planning

Careful planning is essential when you deploy a new infrastructure to replace an existing one. Ensure the new addition fulfills your overall requirements. Here are some key points to consider.

### Resource availability in the target region

The current SAP application servers' deployment region is typically close to the associated HLIs. However, HLIs are available in fewer locations than Azure regions. When you migrate the physical HLI to an Azure VM, it's also a good time to fine-tune the proximity distance of all related services for performance optimization. Also ensure the chosen region has all the required resources. For instance, check the availability of a certain VM family or the availability zones that offer a high-availability setup.

### Virtual network

Do you want to run the new HANA database in an existing virtual network or create a new one? The primary deciding factor is the current networking layout for the SAP landscape. Also, when the infrastructure goes from one-zone to two-zone deployment and uses PPG, it imposes an architectural change. For more information, see the article [Azure PPG for optimal network latency with SAP application](../workloads/proximity-placement-scenarios.md).

### Security

Whether the new SAP HANA VM runs on a new or existing virtual network/subnet, it's a new service critical to your business that requires proper safeguards. Ensure that access control complies with your company's security policy.

### VM sizing recommendation

This migration is also an opportunity to right-size your HANA compute engine. You can use HANA [system views](https://help.sap.com/viewer/7c78579ce9b14a669c1f3295b0d8ca16/Cloud/3859e48180bb4cf8a207e15cf25a7e57.html) with HANA Studio to understand the system resource consumption, which allows for right-sizing to improve spending efficiency.

### Storage

Storage performance is one of the factors that affects your SAP application user experience. Microsoft publishes minimum storage layouts for specific VM SKUs. For more information, see [SAP HANA Azure virtual machine storage configurations](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage). To ensure adequate I/O capacity and performance for your new HANA VM, review these specs and compare them against your existing HLI system statistics.

Does the PPG for the new HANA VM and its associated servers need to be configured? Then submit a support ticket to inspect and ensure the colocation of the storage and the VM. Because your backup solution might need to change, also revisit the storage cost to avoid operational spending surprises.

### Storage replication for disaster recovery

With HLI, storage replication was the default option for disaster recovery. This feature isn't the default option for SAP HANA on Azure VM. Consider HSR, backup/restore, or other supported solutions that satisfy your business needs.

### Availability sets, availability zones, and PPGs

You can shorten the distance between the application layer and SAP HANA to keep network latency at a minimum. Place the new database VM and the current SAP application servers in a PPG. For more information on how Azure availability set and availability zones work with PPG for SAP deployments, see [Proximity Placement Group](../workloads/proximity-placement-scenarios.md).

If members of your HANA system are deployed in more than one availability zone, be aware of the latency profile of the chosen zones. Place SAP system components to minimize the distance between the SAP application and the database. The public domain [Availability zone latency test tool](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/master/AvZone-Latency-Test) helps make the measurement easier.

### Backup strategy

Many customers already use third-party backup solutions for SAP HANA on HLI. If so, you only need to configure the added protected VM and HANA databases. You can unschedule ongoing HLI backup jobs if the machine is being decommissioned after the migration.

Azure Backup for SAP HANA on VM is now generally available. For more information on SAP HANA backup in Azure VMs, see [Backup](../../backup/backup-azure-sap-hana-database.md), [Restore](../../backup/sap-hana-database-restore.md), and [Manage](../../backup/sap-hana-database-manage.md).

### DR strategy

If your service level goals accommodate a longer recovery time, a backup-based approach might be sufficient. A backup to blob storage and restore in place or restore to a new VM is the simplest and least expensive DR strategy.

On the large instance platform, HANA DR typically uses HSR. On an Azure VM, HSR is also the most natural and native SAP HANA DR solution. Whether the source deployment is single-instance or clustered, you need a replica of the source infrastructure in the DR region. Configure this DR replica after you complete the primary HLI to VM migration. The DR HANA database registers to the primary SAP HANA on VM instance as a secondary replication site.

### SAP application server connectivity destination change

The HSR migration results in a new HANA database host and also a new database hostname for the application layer. Modify SAP profiles to reflect the new hostname. If you use name resolution to preserve the hostname, no profile change is required.

### Operating system

The OS images for HLI and VM, despite being on the same release level (SLES 12 SP4 for example), aren't identical. Validate the required packages, hotfixes, patches, kernel, and security fixes on the HLI. Then install the same packages on the target. You can use HSR to replicate from an older OS onto a VM with a newer OS version. Verify the supported versions by reviewing [SAP note 2763388](https://launchpad.support.sap.com/#/notes/2763388).

### New SAP license request

Request a new SAP license for the new HANA system after the migration to VMs.

### SLA differences

Note the difference in availability SLA between HLI and Azure VM. For example, clustered HLI HA pairs offer 99.99% availability. To achieve the same SLA, deploy VMs in availability zones. [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/) describes availability for various VM configurations so you can plan your target infrastructure.

## Migration strategy

This article covers the HANA System Replication approach for the migration from HLI to Azure VM. Depending on the target storage solution deployed, the process differs slightly. The following sections describe the high-level steps.

### VM with Premium or Ultra Disks for data

For VMs deployed with premium or Ultra Disks, the standard SAP HANA system replication configuration applies when you set up HSR. For an overview of steps in setting up system replication, see the [SAP help article](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.04/099caa1959ce4b3fa1144562fa09e163.html). The article also covers taking over a secondary system, failing back to the primary, and disabling system replication. For migration, you only need the setup, takeover, and disabling replication steps.

### VM with ANF for data and log volumes

At a high level, copy the latest HLI storage snapshots of the full data and log volumes to Azure storage. The target HANA VM can then access and recover them. You can use any native Linux copy tools for the copy process.

> [!IMPORTANT]
> Copying and data transfer can take hours depending on the HANA database size and network bandwidth. Do the bulk of the copy process in advance of the primary HANA database downtime.

### MCOS to MDC Conversion

Some HLI customers used the Multiple Components in One System (MCOS) deployment model. This approach worked around the Multiple Databases Container (MDC) storage snapshot limitation of earlier SAP HANA versions. In the MCOS model, several independent SAP HANA instances are stacked in one HANA Large Instance. Using HSR for the migration works fine, but results in multiple HANA VMs with one tenant database each. This end state creates a more complex landscape than you might prefer. The default deployment for SAP HANA 2.0 is MDC. An alternative is to do [HANA tenant move](https://launchpad.support.sap.com/#/notes/2472478) after the HSR migration. HANA tenant move combines these independent HANA databases into cotenants in a single HANA container.

### Application layer consideration

The database server is the center of an SAP system. All application servers should be located near the SAP HANA database. In some cases, when you want to use a new PPG, you might need to move existing application servers onto the PPG where the HANA VM runs. Building new application servers might be easier if you already have deployment templates.

Locate existing application servers and the new HANA VM optimally. Then you don't need to build new application servers, unless you want greater capacity.

When you build a new infrastructure to enhance service availability, your existing application servers might become unnecessary. You can shut them down and delete them. If the target VM hostname changes and differs from the HLI hostname, adjust SAP application server profiles to point to the new host. If only the HANA database IP address changed, update the DNS record to direct incoming connections to the new HANA VM.

### Acceptance test

Migration from HLI to VM makes no material change to the database content compared to a heterogeneous migration. Still, verify the performance of the new setup.

### Cutover plan

Although this migration is straightforward, it does involve the decommissioning of an existing database. Careful planning to preserve the source system with its content and backup images is critical in case you need to fall back. Good planning offers a faster reversal.

## Post migration

The migration job isn't done until you safely decouple any HLI-dependent services and connectivity to ensure data integrity. Also, shut down unnecessary services. This section highlights a few of the more important items.

### Decommissioning the HLI

After successfully migrating the HANA database to an Azure VM, ensure no business transactions run on the HLI database. However, keeping the HLI running for its local backup retention window ensures faster recovery if needed. Only after the local backup retention window passed should you decommission the HANA Large Instance. Then conclude your contractual HLI commitments with Microsoft by contacting your Microsoft representatives.

### Remove any proxy configured for HLI

If you use a proxy service like iptables to route on-premises traffic to and from the HLI, you don't need it after you successfully migrate to a VM. Nonetheless, keep this connectivity service for as long as the HLI is on standby. Only shut down the service after the HLI is fully decommissioned. Examples include iptables and BIGIP.

### Remove Global Reach for HLI

Global Reach is used to connect your ExpressRoute gateway with the HLI ExpressRoute gateway. It allows your on-premises traffic to reach the HLI tenant directly without using a proxy service. This connection is no longer needed after the HLI unit is removed after migration. Still, like the iptables proxy service, keep Global Reach until the HLI is fully decommissioned.

### Operating system subscription (move/reuse)

When you deploy the VM servers and decommission the HLIs, you can replace or reuse the OS subscriptions. You don't need to pay double for OS licenses.

## Next steps

Plan your SAP deployment.

> [!div class="nextstepaction"]
> [SAP workloads on Azure: planning and deployment checklist](../workloads/deployment-checklist.md)
