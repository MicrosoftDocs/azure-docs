---
title: SAP workload planning and deployment checklist
description: Checklist for planning SAP workload deployments to Azure and deploying the workloads
author: msjuergent
manager: bburns
tags: azure-resource-manager
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 06/14/2023
ms.author: juergent
---

# SAP workloads on Azure: planning and deployment checklist

This checklist is designed for customers moving SAP applications to Azure infrastructure as a service. SAP applications in this document represent SAP products running the SAP kernel, including SAP NetWeaver, S/4HANA, BW and BW/4 and others. Throughout the duration of the project, a customer and/or SAP partner should review the checklist. It's important to note that many of the checks are completed at the beginning of the project and during the planning phase. After the deployment is done, straightforward changes on deployed Azure infrastructure or SAP software releases can become complex.

Review the checklist at key milestones during your project. Doing so will enable you to detect small problems before they become large problems. You'll also have enough time to re-engineer and test any necessary changes. Don't consider this checklist complete. Depending on your situation, you might need to perform additional more checks.

The checklist doesn't include tasks that are independent of Azure. For example, SAP application interfaces change during a move to the Azure platform or to a hosting provider. SAP documentation and support notes will also contain further tasks, which are not Azure specific but need to be part of your overall planning checklist.

This checklist can also be used for systems that are already deployed. New features or changed recommendations might apply to your environment. It's useful to review the checklist periodically to ensure you're aware of new features in the Azure platform.

Main content in this document is organized in tabs, in a typical project's chronological order. See content of each tab and consider each next tab to build on top of actions done and learnings obtained in the previous phase. For production migration, the content of **all** tabs should be considered and not just production tab only. To help you map typical project phases with the phase definition used in this article, consult the below table.

| Deployment checklist phases    | Example project phases or milestones                                                  |
|:-------------------------------|:--------------------------------------------------------------------------------------|
| Preparation and planning phase | Project kick-off / design and definition phase                                        |
| Pilot phase                    | Early validation / proof of concept / pilot                                           |
| Non-production phase           | Completion of the detailed design / non-production environment builds / testing phase |
| Production preparation phase   | Dress rehearsal / user acceptance testing / mock cut-over / go-live checks            |
| Go-live phase                  | Production cut-over and go-live                                                       |
| Post-production phase          | Hypercare / transition to business as usual                                           |

## [Planning phase](#tab/planning)

### Project preparation and planning phase

During this phase, you plan the migration of your SAP workload to the Azure platform. Documents such as [planning guide for SAP](./planning-guide.md) in Azure and [Cloud Adoption Framework for SAP](/azure/cloud-adoption-framework/scenarios/sap/plan) cover many topics and help as information in your preparation. At a minimum, during this phase you need to create the following documents, define, and discuss the following elements of the migration:

#### High-level design document

This document should contain:

- The current inventory of SAP components and applications, and a target application inventory for Azure.
- A responsibility assignment matrix (RACI) that defines the responsibilities and assignments of the parties involved. Start at a high level, and work to more granular levels throughout planning and the first deployments.
- A high-level solution architecture. Best practices and example architectures from [Azure Architecture Center](/azure/architecture/reference-architectures/sap/sap-overview) should be consulted.
- A decision about which Azure regions to deploy to. See the [list of Azure regions](https://azure.microsoft.com/global-infrastructure/regions/), and list of [regions with availability zone support](../../reliability/availability-zones-service-support.md). To learn which services are available in each region, see [products available by region](https://azure.microsoft.com/global-infrastructure/services/).
- A networking architecture to connect from on-premises to Azure. Start to familiarize yourself with the [Azure enterprise scale landing zone](/azure/cloud-adoption-framework/ready/enterprise-scale/) concept.
- Security principles for running high-impact business data in Azure. To learn about data security, start with the Azure security documentation.
- Storage strategy to cover block devices (Managed Disk) and shared filesystems (such as Azure Files or Azure NetApp Files) that should be further refined to file-system sizes and layouts in the technical design document.

#### Technical design document

This document should contain:

- A block diagram for the solution showing the SAP and non-SAP applications and services
- An [SAP Quicksizer project](http://www.sap.com/sizing) based on business document volumes. The output of the Quicksizer is then mapped to compute, storage, and networking components in Azure. Alternatively to SAP Quicksizer, diligent sizing based on current workload of source SAP systems. Taking into account the available information, such as DBMS workload reports, SAP EarlyWatch Reports, compute and storage performance indicators.
- Business continuity and disaster recovery architecture.
- Detailed information about OS, DB, kernel, and SAP support pack versions. It's not necessarily true that every OS release supported by SAP NetWeaver or S/4HANA is supported on Azure VMs. The same is true for DBMS releases. Check the following sources to align and if necessary, upgrade SAP releases, DBMS releases, and OS releases to ensure SAP and Azure support. You need to have release combinations supported by SAP and Azure to get full support from SAP and Microsoft. If necessary, you need to plan for upgrading some software components. More details on supported SAP, OS, and DBMS software are documented here:
  - [What SAP software is supported for Azure deployments](./supported-product-on-azure.md)
  - [SAP note 1928533 - SAP Applications on Microsoft Azure: Supported Products and Azure VM types](https://launchpad.support.sap.com/#/notes/1928533). This note defines the minimum OS and DBMS releases supported on Azure VMs. Note also provides the SAP sizing for SAP-supported Azure VMs.
  - [SAP note 2015553 - SAP on Microsoft Azure: Support prerequisites](https://launchpad.support.sap.com/#/notes/2015553). This note defines prerequisites around Azure storage. networking, monitoring, and support relationship needed with Microsoft.
  - [SAP note 2039619](https://launchpad.support.sap.com/#/notes/2039619). This note defines the Oracle support matrix for Azure. Oracle supports only Windows and Oracle Linux as guest operating systems on Azure for SAP workloads. This support statement also applies for the SAP application layer that runs SAP instances, as long they contain Oracle Client.
  - SAP HANA-supported Azure VMs are listed on the [SAP website](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120).  Details for each entry contain specifics and requirements, including supported OS version. This might not match latest OS version as per [SAP note 2235581](https://launchpad.support.sap.com/#/notes/2235581).
  - [SAP Product Availability Matrix](https://userapps.support.sap.com/sap/support/pam).

Further included in same technical document(s) should be:

- Storage Architecture high level decisions based on [Azure storage types for SAP workload](./planning-guide-storage.md)
  - Managed Disks attached to each VM
  - Filesystem layouts and sizing
  - SMB and/or NFS volume layout and sizes, mount points where applicable
- High availability, backup and disaster recovery architecture
  - Based on RTO and RPO, define what the high availability and disaster recovery architecture needs to look like.
  - Understand the use of [different deployment types](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) for optimal protection.
  - Considerations for Azure Virtual Machines DBMS deployment for SAP workloads and related documents. In Azure, using a shared disk configuration for the DBMS layer as, for example, [described for SQL Server](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server), isn't supported. Instead, use solutions like:
    - [SQL Server Always On](/previous-versions/azure/virtual-machines/windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups)
    - [HANA System Replication](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/b74e16a9e09541749a745f41246a065e.html)
    - [Oracle Data Guard](./dbms-guide-oracle.md#high-availability)
    - [IBM Db2 HADR](./high-availability-guide-rhel-ibm-db2-luw.md)
  - For disaster recovery across Azure regions, review the solutions offered by different DBMS vendors. Most of them support asynchronous replication or log shipping.
  - For the SAP application layer, determine whether you'll run your business regression test systems, which ideally are replicas of your production deployments, in the same Azure region or in your DR region. In the second case, you can target that business regression system as the DR target for your production deployments.
  - Look into Azure Site Recovery as a method for replicating the SAP application layer into the Azure DR region. For more information, see a [set-up disaster recovery for a multi-tier SAP NetWeaver app deployment](../../site-recovery/site-recovery-sap.md).
  - For projects required to remain in a single region for compliance reasons, consider a combined HADR configuration by using [Azure Availability Zones](./high-availability-zones.md#combined-high-availability-and-disaster-recovery-configuration).
- An inventory of all SAP interfaces and the connected systems (SAP and non-SAP).
- Design of foundation services. This design should include the following items, many of which are covered by the [landing zone accelerator for SAP](/azure/cloud-adoption-framework/scenarios/sap/):
  - Network topology within Azure and assignment of different SAP environment
  - Active Directory and DNS design.
  - Identity management solution for both end users and administration
  - [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) structure for teams that manage infrastructure and SAP applications in Azure.
  - Azure resource naming strategy
  - Security operations for Azure resources and workloads within
- Security concept for protecting your SAP workload. This should include all aspects – networking and perimeter monitoring, application and database security, operating systems securing, and any infrastructure measures required, such as encryption. Identify the requirements with your compliance and security teams.
- Microsoft recommends either Professional Direct, Premier or Unified Support contract. Identify your escalation paths and contacts for support with Microsoft. For SAP support requirements, see [SAP note 2015553](https://launchpad.support.sap.com/#/notes/2015553).
- The number of Azure subscriptions and core quota for the subscriptions. [Open support requests to increase quotas of Azure subscriptions](../../azure-portal/supportability/regional-quota-requests.md) as needed.
- Data reduction and data migration plan for migrating SAP data into Azure. For SAP NetWeaver systems, SAP has guidelines on how to limit the volume of large amounts of data. See [this SAP guide](https://wiki.scn.sap.com/wiki/download/attachments/247399467/DVM_%20Guide_7.2.pdf?version=1&modificationDate=1549365516000&api=v2) about data management in SAP ERP systems. Some of the content also applies to NetWeaver and S/4HANA systems in general.
- An automated deployment approach. Many customers start with scripts, using a combination of PowerShell, CLI, Ansible and Terraform. 
Microsoft developed solutions for SAP deployment automation are:
  - [Azure Center for SAP solutions](../index.yml) – Azure service to deploy and operate a SAP system’s infrastructure
  - [SAP on Azure Deployment Automation](../automation/deployment-framework.md), an open-source orchestration tool for deploying and maintaining SAP environments

> [!NOTE]
> Define a regular design and deployment review cadence between you as the customer, the system integrator, Microsoft, and other involved parties.

## [Pilot phase](#tab/pilot)

### Pilot phase (strongly recommended)

You can run a pilot before or during project planning and preparation. You can also use the pilot phase to test approaches and designs made during the planning and preparation phase. And you can expand the pilot phase to make it a real proof of concept.

We recommend that you set up and validate a full HADR solution and security design during a pilot deployment. Some customers perform scalability tests during this phase. Other customers use deployments of SAP sandbox systems as a pilot phase. We assume you've already identified a system that you want to migrate to Azure for the pilot.

- Optimize data transfer to Azure. The optimal choice is highly dependent on the specific scenario. If private connectivity is required for database replication, [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) is fastest if the ExpressRoute circuit has enough bandwidth. In any other scenario, transferring through the internet is faster. Optionally use a dedicated migration VPN for private connectivity to Azure. Any migration network path during pilot should mirror the use for future production systems, eliminating any impact to workloads – SAP or non-SAP - already running in Azure.
- For a heterogeneous SAP migration that involves an export and import of data, test and optimize the export and import phases. For migration of large SAP environments, go through available best practices. Use the appropriate tool for the migration scenario, depending on your source and target SAP releases, DBMS and if combining migration with other tasks such as release upgrade or even Unicode or S/4HANA conversion. SAP provides Migration Monitor/SWPM, [SAP DMO](https://blogs.sap.com/2013/11/29/database-migration-option-dmo-of-sum-introduction/) or DMO with system move, besides other approaches to minimize downtime available as separate service from SAP. In the latest releases of SAP DMO with system move, the use of azcopy for data transfer over the internet is supported as well, enabling the quickest network path natively.
   [Migrate very large databases (VLDB) to Azure for SAP](/training/modules/migrate-very-large-databases-to-azure/)  

### Technical validation

- **Compute / VM types**
  - Review the resources in SAP support notes, in the SAP HANA hardware directory, and in the SAP PAM again. Make sure to match supported VMs for Azure, supported OS releases for those VM types, and supported SAP and DBMS releases.
  - Validate again the sizing of your application and the infrastructure you deploy on Azure. If you're moving existing applications, you can often derive the necessary SAPS from the infrastructure you use and the [SAP benchmark webpage](https://www.sap.com/dmc/exp/2018-benchmark-directory/#/sd) and compare it to the SAPS numbers listed in [SAP note 1928533](https://launchpad.support.sap.com/#/notes/1928533). Also keep [this article on SAPS ratings](https://techcommunity.microsoft.com/t5/Running-SAP-Applications-on-the/SAPS-ratings-on-Azure-VMs-8211-where-to-look-and-where-you-can/ba-p/368208) in mind.
  - Evaluate and test the sizing of your Azure VMs for maximum storage and network throughput of the VM types you chose during the planning phase. Details of [VM performance limits](../../virtual-machines/sizes.md) are available, for storage it’s important to consider the limit of max uncached disk throughput for sizing. Carefully consider sizing and temporary effects of [disk and VM level bursting](../../virtual-machines/disk-bursting.md).
  - Test and determine whether you want to create your own OS images for your VMs in Azure or whether you want to use an image from the Azure compute gallery (formerly known as shared image gallery). If you're using an image from the Azure compute gallery, make sure to use an image that reflects the support contract with your OS vendor. For some OS vendors, Azure Compute Gallery lets you bring your own license images. For other OS images, support is included in the price quoted by Azure.
  - Using own OS images allows you to store required enterprise dependencies, such as security agents, hardening and customizations directly in the image. This way they are deployed immediately with every VM. If you decide to create your own OS images, you can find documentation in these articles:
    - [Build a generalized image of a Windows VM deployed in Azure](../../virtual-machines/windows/capture-image-resource.md)
    - [Build a generalized image of a Linux VM deployed in Azure](../../virtual-machines/linux/capture-image.md)
  - If you use Linux images from the Azure compute gallery and add hardening as part of your deployment pipeline, you need to use the images suitable for SAP provided by the Linux vendors.
    - [Red Hat Enterprise Linux for SAP Offerings on Microsoft Azure FAQ](https://access.redhat.com/articles/5456301)
    - [SUSE public cloud information tracker - OS Images for SAP](https://pint.suse.com/?resource=images&csp=microsoft&search=sap)
    - [Oracle Linux](https://www.oracle.com/cloud/azure/interconnect/faq/)
  - Choosing an OS image determines the type of Azure VM’s generation. Azure supports both [Hyper-V generation 1 and 2 VMs](../../virtual-machines/generation-2.md). Some VM families are available as [generation 2 only](../../virtual-machines/generation-2.md#generation-2-vm-sizes), some VM families are certified for SAP use as generation 2 only ([SAP note 1928533](https://launchpad.support.sap.com/#/notes/1928533)) even if Azure allows both generations. **It is recommended to use generation 2 VM for every VM of SAP landscape.** 

- **Storage**
  - Read the document [Azure storage types for SAP workload](./planning-guide-storage.md)
  - Use [Azure premium storage](../../virtual-machines/disks-types.md#premium-ssds), [premium storage v2](../../virtual-machines/disks-types.md#premium-ssd-v2) for all production grade SAP environments and when ensuring high SLA. For some DBMS, Azure NetApp Files can be used for [large parts of the overall storage requirements](planning-guide-storage.md#azure-netapp-files-anf).
  - At a minimum, use [Azure standard SSD](../../virtual-machines/disks-types.md#standard-ssds) storage for VMs that represent SAP application layers and for deployment of DBMSs that aren't performance sensitive. Keep in mind different Azure storage types influence the [single VM availability SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines).
  - In general, we don't recommend the use of [Azure standard HDD](./planning-guide-storage.md#azure-standard-hdd-storage) disks for SAP.
  - For the different DBMS types, check the [generic SAP-related DBMS documentation](./dbms-guide-general.md) and DBMS-specific documentation that the first document points to. Use disk striping over multiple disks with premium storage (v1 or v2) for database data and log area. Verify lvm disk striping is active and with correct stripe size with command 'lvs -a -o+lv_layout,lv_role,stripes,stripe_size,devices' on Linux, see storage spaces properties on Windows. 
  - For optimal storage configuration with SAP HANA, see [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md).
  - Use LVM for all disks on Linux VMs, as it allows easier management and online expansion. This includes volumes on single disks, for example /usr/sap.

- **Networking**
  - Test and evaluate your virtual network infrastructure and the distribution of your SAP applications across or within the different Azure virtual networks.
  - Evaluate the hub-and-spoke or virtual WAN virtual network architecture approach with discrete virtual network(s) spokes for SAP workload. For smaller scale, micro-segmentation approach within a single Azure virtual network. Base this evaluation on:  
    - Costs of data exchange [between peered Azure virtual networks](../../virtual-network/virtual-network-peering-overview.md)  
    - Advantages of a fast disconnection of the peering between Azure virtual networks as opposed to changing the network security group to isolate a subnet within a virtual network. This evaluation is for cases when applications or VMs hosted in a subnet of the virtual network became a security risk.
    - Central logging and auditing of network traffic between on-premises, the outside world, and the virtual datacenter you built in Azure.
  - Evaluate and test the data path between the SAP application layer and the SAP DBMS layer.
    - Placement of [Azure network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of SAP systems  running the SAP kernel isn't supported.
    - Placement of the SAP application layer and SAP DBMS in different Azure virtual networks that aren't peered isn't supported.
    - You can use [application security group and network security group rules](../../virtual-network/network-security-groups-overview.md) to secure communication paths to and between the SAP application layer and the SAP DBMS layer.
  - Make sure that [accelerated networking](../../virtual-network/accelerated-networking-overview.md) is enabled on every VM used for SAP.
  - Test and evaluate the network latency between the SAP application layer VMs and DBMS VMs according to SAP notes [500235](https://launchpad.support.sap.com/#/notes/500235) and [1100926](https://launchpad.support.sap.com/#/notes/1100926). In addition to SAP’s niping, you can use tools such as [sockperf](https://github.com/Mellanox/sockperf) or [ethr](https://github.com/microsoft/ethr) for tcp latency measurement. Evaluate the results against the network latency guidance in [SAP note 1100926](https://launchpad.support.sap.com/#/notes/1100926). The network latency should be in the moderate or good range.
  - Optimize network throughput on high vCPU VMs, typically used for database servers. Particularly important for HANA scale-out and any large SAP system. Follow recommendations in [this article](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/optimizing-network-throughput-on-azure-m-series-vms/ba-p/3581129) for optimization.
  - For optimal network latency, consider following the guidance in the article [proximity placement scenarios](./proximity-placement-scenarios.md). No usage of proximity placement groups for zonal or cross-zonal deployment patterns.
  - Verify correct availability, routing and secure access from the SAP landscape to any needed Internet endpoint, such as OS patch repositories, deployment tooling or service endpoint. Similarly, if your SAP environment provides a publicly accessible service such as SAP Fiori or SAProuter, verify it is reachable and secured.

- **High availability and disaster recovery deployments**
  - Always use standard load balancer for clustered environments. Basic load balancer will be [retired](../../load-balancer/skus.md).
  - Select the suitable [deployment options](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) depending on your preferred system configuration within an Azure region, whether it involves spanning across zones, residing within a single zone, or operating in a zone-less region.
  - In regional deployment, to protect SAP central services and DBMS layers for high availability by using passive replication, place the two nodes for SAP Central Services in one separate availability set and the two DBMS nodes in another availability set. Do not mix application VM roles inside an availability set.
  - For cross zonal deployment, configure system using [flexible scale set](./virtual-machine-scale-set-sap-deployment-guide.md) with FD=1 and deploy the active and passive central services nodes and DBMS layer into two different availability zones. Use two availability zones that have the lowest latency between them.
  - For cross zonal deployment, it is advised to use [flexible scale set](./virtual-machine-scale-set-sap-deployment-guide.md) with FD=1 over standard availability zone deployment.
  - If you're using Azure Load Balancer together with Linux guest operating systems, check that the Linux network parameter net.ipv4.tcp_timestamps is set to 0. This recommendation conflicts with recommendations in older versions of [SAP note 2382421](https://launchpad.support.sap.com/#/notes/2382421). The SAP note is now updated to state that this parameter needs to be set to 0 to work with Azure load balancers.

- **Timeout settings**
  - Check the SAP NetWeaver developer traces of the SAP instances to make sure there are no connection breaks between the enqueue server and the SAP work processes. You can avoid these connection breaks by setting these two registry parameters:
    - HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveTime = 120000. For more information, see [KeepAliveTime](/previous-versions/windows/it-pro/windows-2000-server/cc957549(v=technet.10)).
    - HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveInterval = 120000. For more information, see [KeepAliveInterval](/previous-versions/windows/it-pro/windows-2000-server/cc957548(v=technet.10)).
  - To avoid GUI timeouts between on-premises SAP GUI interfaces and SAP application layers deployed in Azure, check whether these parameters are set in the default.pfl or the instance profile:
    - rdisp/keepalive_timeout = 3600
    - rdisp/keepalive = 20
  - To prevent disruption of established connections between the SAP enqueue process and the SAP work processes, you need to set the enque/encni/set_so_keepalive parameter to true. See also [SAP note 2743751](https://launchpad.support.sap.com/#/notes/2743751).
  - If you use a Windows failover cluster configuration, make sure that the time to react on non-responsive nodes is set correctly for Azure. The article [Tuning Failover Cluster Network Thresholds](https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834) lists parameters and how they affect failover sensitivities. Assuming the cluster nodes are in the same subnet, you should change these parameters:
    - SameSubNetDelay = 2000 (number of milliseconds between “heartbeats”)
    - SameSubNetThreshold = 15 (maximum number of consecutive missed heartbeats)
    - RoutingHistorylength = 30 (seconds, 2000 ms * 15 heartbeats = 30s)

- **OS Settings or Patches**
  - For running HANA on SAP, read these notes and documentations, in addition to SAP' non-Azure specific documentation and other support notes:
    - [Azure specific SAP notes](https://launchpad.support.sap.com/#/mynotes?tab=Search&sortBy=Relevance&filters=themk%25253Aeq~'BC-OP-NT-AZR'~'BC-OP-LNX-AZR'%25252BreleaseStatus%25253Aeq~'NotRestricted'%25252BsecurityPatchDay%25253Aeq~'NotRestricted'%25252BfuzzyThreshold%25253Aeq~'0.9') linked to SAP support components BC-OP-NT-AZR or BC-OP-LNX-AZR. Go through the notes in detail as they contain updated solutions
    - [SAP note 2382421 - Optimizing the Network Configuration on HANA- and OS-Level](https://launchpad.support.sap.com/#/notes/2382421)
    - [SAP note 2235581 – SAP HANA: Supported Operating Systems](https://launchpad.support.sap.com/#/notes/2235581)

### Additional checks for the pilot phase

- **Test your high availability and disaster recovery procedures**
  - Simulate failover situations by using a tool such as [NotMyFault](/sysinternals/downloads/notmyfault) (Windows) or putting operating systems in panic mode or disabling network interface with ifdown (Linux). This step will help you figure out whether your failover configurations work as designed.
  - Measure how long it takes to execute a failover. If the times are too long, consider:
  - For SUSE Linux, use SBD devices instead of the Azure Fence agent to speed up failover.
  - For SAP HANA, if the reload of data takes too long, consider provisioning more storage bandwidth.
  - Test your backup/restore sequence and timing and make corrections if you need to. Make sure that backup times are sufficient. You also need to test the restore and time restore activities. Make sure that restore times are within your RTO SLAs wherever your RTO relies on a database or VM restore process.
  - Test cross-region DR functionality and architecture, verify the RPO and RTO match your expectations

- **Security checks**
  - Test the validity of your Azure role-based access control (Azure RBAC) architecture. Segregation of duties requires to separate and limit the access and permissions of different teams. For example, SAP Basis team members should be able to deploy VMs and assign disks from Azure Storage into a given Azure virtual machine. But the SAP Basis team shouldn't be able to create its own virtual networks or change the settings of existing virtual networks. Members of the network team shouldn't be able to deploy VMs into virtual networks in which SAP application and DBMS VMs are running. Nor should members of this team be able to change attributes of VMs or even delete VMs or disks.
  - Verify that [network security group and ASG rules](../../virtual-network/network-security-groups-overview.md) work as expected and shield the protected resources.
  - Make sure that all resources that need to be encrypted are encrypted. Define and implement processes to back up certificates, store and access those certificates, and restore the encrypted entities.
  - For storage encryption, server-side encryption with platform managed key (SSE-PMK) is enabled for every storage service used for SAP in Azure by default, including managed disks, Azure Files and Azure NetApp Files. [Key management](../../virtual-machines/disk-encryption.md) with customer managed keys can be considered, if required for customer owned key rotation.
  - [Host based server-side encryption](../../virtual-machines/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data) should not be enabled for performance reasons on M-series family Linux VMs.
  - Do not use Azure Disk Encryption on Linux with SAP as [OS images ‘for SAP’](../../virtual-machines/linux/disk-encryption-overview.md#supported-operating-systems) are not supported.
  - Database native encryption is deployed by most SAP on Azure customers to protect DBMS data and backups. Transparent Data Encryption (TDE) typically has no noticeable performance overhead, greatly increases security, and should be considered. Encryption key management and location must be secured. Database encryption occurs inside the VM and is independent of any storage encryption such as SSE.

- **Performance testing**
In SAP, based on SAP tracing and measurements, make these comparisons:
  - Inventory and baseline the current on-premises system.
    - SAR reports / perfmon.
    - STAT trace top 10 online reports.
    - Collect batch job history.
  - Focus testing to verify business processes performance. Do not compare hardware KPIs initially and in a vacuum, only when troubleshooting any performance differences.
  - Where applicable, compare the top 10 online reports to your current implementation.
  - Where applicable, compare the top 10 batch jobs to your current implementation.
  - Compare data transfers through interfaces into the SAP system. Focus on interfaces where you know the transfer is going between different locations, like from on-premises to Azure.

## [Non-production phase](#tab/non-prod)

### Non-production phase

In this phase, we assume that after a successful pilot or proof of concept (POC), you're starting to deploy non-production SAP systems to Azure. Incorporate everything you learned and experienced during the POC to this deployment. All the criteria and steps listed for POCs apply to this deployment as well.

During this phase, you usually deploy development systems, unit testing systems, and business regression testing systems to Azure. We recommend that at least one non-production system in one SAP application line has the full high availability configuration that the future production system will have. Here are some tasks that you need to complete during this phase:

- Before you move systems from the old platform to Azure, collect resource consumption data, like CPU usage, storage throughput, and IOPS data. Especially collect this data from the DBMS layer units, but also collect it from the application layer units. Also measure network and storage latency. Adapt your sizing and design with the captured data.  Tools such as syststat, KSAR, [nmon](https://nmon.sourceforge.net/) and [nmon analyzer for Excel](https://nmon.sourceforge.net/pmwiki.php?n=Site.Nmon-Analyser) should be used to capture and present resource utilization over peak periods. 
- Record the availability usage time patterns of your systems. The goal is to figure out whether non-production systems need to be available all day, every day or whether there are non-production systems that can be shut down during certain phases of a week or month.
- Reevaluate your OS image choice, VM generation (Generation 2 throughout the SAP landscape), and OS patch strategy.
- Make sure to fulfill the SAP support requirements for Microsoft support agreements. See [SAP note 2015553](https://launchpad.support.sap.com/#/notes/2015553). 
- Check SAP notes related to Azure, like [note 1928533](https://launchpad.support.sap.com/#/notes/1928533), for new VM SKUs and newly supported OS and DBMS releases. Compare the pricing of new VM types against that of older VM types, so you can deploy VMs with the best price/performance ratio.
- Recheck SAP support notes, the SAP HANA hardware directory, and the SAP PAM. Make sure there were no changes in supported VMs for Azure, supported OS releases on those VMs, and supported SAP and DBMS releases.
- Check the [SAP website](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120) for new HANA-certified SKUs in Azure. Compare the pricing of new SKUs with the ones you planned to use. Eventually, make necessary changes to use the ones that have the best price/performance ratio.
- Adapt your deployment automation to use new VM types and incorporate new Azure features that you want to use.
- After deployment of the infrastructure, test and evaluate the network latency between SAP application layer VMs and DBMS VMs, according to SAP notes [500235](https://launchpad.support.sap.com/#/notes/500235). Evaluate the results against the network latency guidance in [SAP note 1100926](https://launchpad.support.sap.com/#/notes/1100926). The network latency should be in the moderate or good range. In addition to using tools such as niping, [sockperf](https://github.com/Mellanox/sockperf) or [ethr](https://github.com/microsoft/ethr), use SAP’s HCMT tool for network measurements between HANA VMs for scale-out or system replication.
- Make sure that none of the restrictions mentioned in [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](./dbms-guide-general.md#azure-network-considerations) and [SAP HANA infrastructure configurations and operations on Azure](./hana-vm-operations.md) apply to your deployment.
- If you are seeing higher than expected latency between VMs, consider following the guidance in the article [proximity placement scenarios](./proximity-placement-scenarios.md).
- Perform all the other checks listed for the proof-of-concept phase before applying the workload.
- As the workload applies, record the resource consumption of the systems in Azure. Compare this consumption with records from your old platform. Adjust VM sizing of future deployments if you see that you have large differences. Keep in mind that when you downsize, storage, and network bandwidth of VMs will be reduced as well.
  - [Sizes for Azure virtual machines](../../virtual-machines/sizes.md)
- Experiment with system copy functionality and processes. The goal is to make it easy for you to copy a development system or a test system, so project teams can get new systems quickly.
- Optimize and hone your team's Azure role-based access, permissions, and processes to make sure you have separation of duties. At the same time, make sure all teams can perform their tasks in the Azure infrastructure.
- Exercise, test, and document high-availability and disaster recovery procedures to enable your staff to execute these tasks. Identify shortcomings and adapt new Azure functionality that you're integrating into your deployments.

## [Production phase](#tab/production)

### Production preparation phase

In this phase, collect what you experienced and learned during your non-production deployments and apply it to future production deployments.

- Complete any necessary SAP release upgrades of your production systems before moving to Azure.
- Agree with the business owners on functional and business tests that need to be conducted after migration of the production system.
- Make sure these tests are completed with the source systems in the current hosting location. Avoid conducting tests for the first time after the system is moved to Azure.
- Test the process of migrating production systems to Azure. If you're not moving all production systems to Azure during the same time frame, build groups of production systems that need to be at the same hosting location. Test data migration including connected non-SAP applications and interfaces.
Here are some common methods:
  - Use DBMS methods like backup/restore in combination with SQL Server Always On, HANA System Replication, or log shipping to seed and synchronize database content in Azure.  
  - Use backup/restore for smaller databases.  
  - Use the [SAP DMO](https://support.sap.com/en/tools/software-logistics-tools/software-update-manager/database-migration-option-dmo.html) process for supported scenarios to either move or if you need to combine your migration with an SAP release upgrade and/or move to HANA. Keep in mind that not all combinations of source DBMS and target DBMS are supported. You can find more information in the specific SAP support notes for the different releases of DMO. For example, [Database Migration Option (DMO) of SUM 2.0 SP15](https://launchpad.support.sap.com/#/notes/3206747).  
  - Test whether data transfer throughput is better through the internet or through ExpressRoute, in case you need to move backups or SAP export files. If you're moving data through the internet, you might need to change some of your network security group/application security group rules that you'll need to have in place for future production systems.  
- Before moving systems from your old platform to Azure, collect resource consumption data. Useful data includes CPU usage, storage throughput, and IOPS data. Especially collect this data from the DBMS layer units, but also collect it from the application layer units. Also measure network and storage latency.
- Recheck SAP notes and the required OS settings, the SAP HANA hardware directory, and the SAP PAM. Make sure there were no changes in supported VMs for Azure, supported OS releases in those VMs, and supported SAP and DBMS releases.
- Update your deployment automation to consider the latest decisions you've made on VM types and Azure functionality.
- Create a playbook for reacting to planned Azure maintenance events. Determine the order in which systems and VMs should be rebooted for planned maintenance. 
- Exercise, test, and document high-availability and disaster recovery procedures to enable your staff to execute these tasks during migration and immediately after go-live decision.

### Go-live phase

During the go-live phase, be sure to follow the playbooks you developed during earlier phases. Execute the steps that you tested and practiced. Don't accept last-minute changes in configurations and processes. Also complete these steps:

- Verify that Azure portal monitoring and other monitoring tools are working. Use Azure tools such as [Azure Monitor](../../azure-monitor/overview.md) for infrastructure monitoring. [Azure Monitor for SAP](../monitor/about-azure-monitor-sap-solutions.md) for a combination of OS and application KPIs, allowing you to integrate all in one dashboard for visibility during and after go-live.  
For operating system key performance indicators:  
  - [SAP note 1286256 - How-to: Using Windows LogMan tool to collect performance data on Windows Platforms](https://launchpad.support.sap.com/#/notes/1286256)  
  - On Linux ensure sysstat tool is installed and capturing details at regular intervals
- After data migration, perform all the validation tests you agreed upon with the business owners. Accept validation test results only when you have results for the original source systems.
- Check whether interfaces are functioning and whether other applications can communicate with the newly deployed production systems.
- Check the transport and correction system through SAP transaction STMS.
- Perform database backups after the system is released for production.
- Perform VM backups for the SAP application layer VMs after the system is released for production.
- For SAP systems that weren't part of the current go-live phase but that communicate with the SAP systems that you moved to Azure during this go-live phase, you need to reset the host name buffer in SM51. Doing so will remove the old cached IP addresses associated with the names of the application instances you moved to Azure.

### Post production

This phase is about monitoring, operating, and administering the system. From an SAP point of view, the usual tasks that you were required to complete in your old hosting location apply. Complete these Azure-specific tasks as well:

- Review Azure invoices for high-charging systems. Install a culture of finOps and build an Azure cost optimization capability in your organization.
- Optimize price/performance efficiency on the VM side and the storage side.
- Once your SAP on Azure has stabilized, your focus needs to shift to a culture of continuous sizing and capacity reviews. Unlike on-premises, where we size for a long period, right-sizing is a key benefit of running SAP on Azure workload, and diligent capacity planning will be key.
- Optimize the times when you can shut down systems.
- Once your solution has stabilized in Azure, consider moving away from a Pay-As-You-Go commercial model and leverage Azure Reserved Instances.
- Plan and execute regular disaster recovery drills.
- Define and implement your strategy around ‘ever-greeneing’, to align your own roadmap with Microsoft’s SAP on Azure roadmap to gain benefit from the advancement of technology.

## [Checklist](#tab/checklist)

### SAP on Azure Infrastructure Checklist

After deploying infrastructure and applications and before each migration starts, validate that:

1. The correct VM types were deployed, with the correct attributes and storage configuration.
2. The VMs are on an up to date OS, DBMS and SAP Kernel release and patch and the OS, DB and SAP Kernel uniform throughout the landscape
3. VMs are secured and hardened as required and in a uniform way across the respective environment.
4. VMs were deployed into [flexible scale set](./virtual-machine-scale-set-sap-deployment-guide.md) with FD=1 across availability zones or in an [availability set](../../virtual-machines/windows/tutorial-availability-sets.md).
5. Generation 2 VMs have been deployed. Generation 1 VMs should not be used for new deployments.
6. Azure Premium Storage or Premium Storage v2 is used for latency-sensitive disks or where the [single-VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) is required.
7. Make sure that, within the VMs, storage spaces, or [stripe sets were built correctly](./planning-guide-storage.md#striping-or-not-striping) across filesystems which require more than disk, such as DBMS data and log areas.
8. Correct stripe size and filesystem blocksize are used, if noted in respective DBMS guides
9. Azure VM storage and caching are used appropriately
   - Make sure that only disks holding DBMS online logs are cached with None+ Write Accelerator.  
   - Other disks with premium storage are using cache settings none or ReadOnly, depending on use  
   - Check the [configuration of LVM on Linux VMs in Azure](/azure/virtual-machines/linux/configure-lvm).  
10. [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-solution-architectures.md#sap-on-azure-solutions) NFS volumes are used exclusively for DBMS VMs.
11. For Azure NetApp Files, [correct mount options are used](../../azure-netapp-files/performance-linux-mount-options.md) and volumes are sized appropriately on correct storage tier.
12. Using Azure services – Azure Files or Azure NetApp Files – for any SMB or NFS volumes or shares. NFS volumes or SMB shares are reachable by the respective SAP environment or individual SAP system(s). Network routing to the NFS/SMB server goes through private network address space, using private endpoint if needed.
13. [Azure accelerated networking](../../virtual-network/accelerated-networking-overview.md) is enabled on every network interface for all SAP VMs.
14. No [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) are in the communication path between the SAP application and the DBMS layer of SAP systems based on SAP NetWeaver or ABAP Platform.
15. All load balancers for SAP high-available components use standard load balancer with floating IP and HA ports enabled.
16. SAP application and DBMS VM(s) are placed in same or different subnets of one virtual network or in virtual networks directly peered.
17. Application and network security group rules allow communication as desired and planned, and block communication where required.
18. Timeout settings are set correctly, as described earlier.
19. If using proximity placement groups, check whether the availability sets and their VMs are deployed to the [correct PPG](./proximity-placement-scenarios.md).
20. Network latency between SAP application layer VMs and DBMS VMs is tested and validated as described in SAP notes [500235](https://launchpad.support.sap.com/#/notes/500235) and [1100926](https://launchpad.support.sap.com/#/notes/1100926). Evaluate the results against the network latency guidance in [SAP note 1100926](https://launchpad.support.sap.com/#/notes/1100926). The network latency should be in the moderate or good range.
21. Encryption was implemented where necessary and with the appropriate encryption method.
22. Own encryption keys are protected against loss, destruction, or malicious use.
23. Interfaces and other applications can connect to the newly deployed infrastructure.

---

## Automated checks and insights in SAP landscape

Several of the checks above are checked in automated way with [SAP on Azure Quality Check Tool](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/QualityCheck). These checks can be executed automated with the provided open-source project. While no automatic remediation of issues found is performed, the tool will warn about  configuration against Microsoft recommendations.

> [!TIP]
> Same [quality checks and additional insights](../center-sap-solutions/get-quality-checks-insights.md) are executed regularly when SAP systems are deployed or registered with [Azure Center for SAP solution](../index.yml) as well and are part of the service.  

Further tools to allow easier deployment checks and document findings, plan next remediation steps and generally optimize your SAP on Azure landscape are:

- [Azure Well-Architected Framework review](/assessments/?id=azure-architecture-review&mode=pre-assessment) An assessment of your workload focusing on the five main pillars of reliability, security, cost optimization, operation excellence and performance efficiency. Supports SAP workloads and recommended to running a review at start and after every project phase.
- [Azure Inventory Checks for SAP](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Tools%26Framework/InventoryChecksForSAP) An open source Azure Monitor workbook, which shows your Azure inventory with intelligence to highlight configuration drift and improve quality.

## Next steps

See these articles:

> [!div class="checklist"]
>
> - [Azure planning and implementation for SAP NetWeaver](./planning-guide.md)
> - [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](./dbms-guide-general.md)
> - [Azure Virtual Machines deployment for SAP NetWeaver](./deployment-guide.md)
