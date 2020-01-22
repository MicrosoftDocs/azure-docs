---
title: SAP workload planning and deployment checklist | Microsoft Docs
description: Checklist for planning SAP workload deployments to Azure and deploying the workloads
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 01/21/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP workloads on Azure: planning and deployment checklist

This checklist is designed for customers moving SAP NetWeaver, S/4HANA, and Hybris applications to Azure infrastructure as a service. Throughout the duration of the project, a customer and/or SAP partner should review the checklist. It's important to note that many of the checks are completed at the beginning of the project and during the planning phase. After the deployment is done, straightforward changes on deployed Azure infrastructure or SAP software releases can become complex.

Review the checklist at key milestones during your project. Doing so will enable you to detect small problems before they become large problems. You'll also have enough time to re-engineer and test any necessary changes. Don't consider this checklist complete. Depending on your situation, you might need to perform many more checks.

The checklist doesn't include tasks that are independent of Azure. For example, SAP application interfaces change during a move to the Azure platform or to a hosting provider.

This checklist can also be used for systems that are already deployed. New features, like Write Accelerator and Availability Zones, and new VM types might have been added since you deployed. So it's useful to review the checklist periodically to ensure you're aware of new features in the Azure platform.

## Project preparation and planning phase
During this phase, you plan the migration of your SAP workload to the Azure platform. At a minimum, during this phase you need to create the following documents and define and discuss the following elements of the migration:

1. High-level design document. This document should contain:
	- The current inventory of SAP components and applications, and a target application inventory for Azure.
	- A responsibility assignment matrix (RACI) that defines the responsibilities and assignments of the parties involved. Start at a high level, and work to more granular levels throughout planning and the first deployments.
	- A high-level solution architecture.
	- A decision about which Azure regions to deploy to. See the [list of Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). To learn which services are available in each region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).
	- A networking architecture to connect from on-premises to Azure. Start to familiarize yourself with the [Virtual Datacenter blueprint for Azure](https://docs.microsoft.com/azure/architecture/vdc/).
	- Security principles for running high-impact business data in Azure. To learn about data security, start with the [Azure security documentation](https://docs.microsoft.com/azure/security/).
2.	Technical design document. This document should contain:
	- A block diagram for the solution.
	- The sizing of compute, storage, and networking components in Azure. For SAP sizing of Azure VMs, see [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).
	- Business continuity and disaster recovery architecture.
	- Detailed information about OS, DB, kernel, and SAP support pack versions. It's not necessarily true that every OS release supported by SAP NetWeaver or S/4HANA is supported on Azure VMs. The same is true for DBMS releases. Check the following sources to align and if necessary upgrade SAP releases, DBMS releases, and OS releases to ensure SAP and Azure support. You need to have release combinations supported by SAP and Azure to get full support from SAP and Microsoft. If necessary, you need to plan for upgrading some software components. More details on supported SAP, OS, and DBMS software are documented here:
		- [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). This note defines the minimum OS releases supported on Azure VMs. It also defines the minimum database releases required for most non-HANA databases. Finally, it provides the SAP sizing for SAP-supported Azure VM types.
		- [SAP support note #2039619](https://launchpad.support.sap.com/#/notes/2039619). This note defines the Oracle support matrix for Azure. Oracle supports only Windows and Oracle Linux as guest operating systems on Azure for SAP workloads. This support statement also applies for the SAP application layer that runs SAP instances. However, Oracle doesn't support high availability for SAP Central Services in Oracle Linux through Pacemaker. If you need high availability for ASCS on Oracle Linux, you need to use SIOS Protection Suite for Linux. For detailed SAP certification data, see SAP support note [#1662610 - Support details for SIOS Protection Suite for Linux](https://launchpad.support.sap.com/#/notes/1662610). For Windows, the SAP-supported Windows Server Failover Clustering solution for SAP Central Services is supported in conjunction with Oracle as the DBMS layer.
		- [SAP support note #2235581](https://launchpad.support.sap.com/#/notes/2235581). This note provides the support matrix for SAP HANA on different OS releases.
		- SAP HANA-supported Azure VMs and [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture) are listed on the [SAP website](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure).
		- [SAP Product Availability Matrix](https://support.sap.com/en/).
		- SAP notes for other SAP-specific products.	 
	- We recommend strict three-tier designs for SAP production systems. We don't recommend combining ASCS and/or DBMS and/or app servers on one VM. Using multi-SID cluster configurations for SAP Central Services is supported on Windows guest operating systems on Azure. But this configuration isn't supported for SAP Central Services on Linux operating systems on Azure. You can find documentation for the Windows guest OS scenario in these articles:
		- [SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and shared disk on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-ascs-ha-multi-sid-wsfc-shared-disk)
		- [SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and file share on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-ascs-ha-multi-sid-wsfc-file-share)
	- High availability and disaster recovery architecture.
		- Based on RTO and RPO, define what the high availability and disaster recovery architecture needs to look like.
		- For high availability within a zone, check what the desired DBMS has to offer in Azure. Most DBMS packages offer synchronous methods of a synchronous hot standby, which we recommend for production systems. Also check the SAP-related documentation for different databases, starting with [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general) and related documents.
		   Using Windows Server Failover Clustering with a shared disk configuration for the DBMS layer as, for example, [described for SQL Server](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server?view=sql-server-2017), isn't supported. Instead, use solutions like:
		   - [SQL Server Always On](https://docs.microsoft.com/azure/virtual-machines/windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups)
		   - [Oracle Data Guard](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/configure-oracle-dataguard)
		   - [HANA System Replication](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/b74e16a9e09541749a745f41246a065e.html)
		- For disaster recovery across Azure regions, review the solutions offered by different DBMS vendors. Most of them support asynchronous replication or log shipping.
		- For the SAP application layer, determine whether you'll run your business regression test systems, which ideally are replicas of your production deployments, in the same Azure region or in your DR region. In the second case, you can target that business regression system as the DR target for your production deployments.
		- If you decide not to place the non-production systems in the DR site, look into Azure Site Recovery as a method for replicating the SAP application layer into the Azure DR region. For more information, see a [Set up disaster recovery for a multi-tier SAP NetWeaver app deployment](https://docs.microsoft.com/azure/site-recovery/site-recovery-sap).
		- If you decide to use a combined HADR configuration by using [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview), familiarize yourself with the Azure regions where Availability Zones are available. Also take into account restrictions that can be introduced by increased network latencies between two Availability Zones.  
3.	An inventory of all SAP interfaces (SAP and non-SAP).
4.	Design of foundation services. This design should include the following items:
	- Active Directory and DNS design.
	- Network topology within Azure and assignment of different SAP systems.
	- [Role-based access](https://docs.microsoft.com/azure/role-based-access-control/overview) structure for teams that manage infrastructure and SAP applications in Azure.
	- Resource group topology.
	- [Tagging strategy](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags#tags-and-billing).
	- Naming conventions for VMs and other infrastructure components and/or logical names.
5.	Microsoft Premier Support contract. Identify your Microsoft Technical Account Manager (TAM). For SAP support requirements, see [SAP support note #2015553](https://launchpad.support.sap.com/#/notes/2015553).
6.	The number of Azure subscriptions and core quota for the subscriptions. [Open support requests to increase quotas of Azure subscriptions](https://docs.microsoft.com/azure/azure-portal/supportability/resource-manager-core-quotas-request) as needed.
7.	Data reduction and data migration plan for migrating SAP data into Azure. For SAP NetWeaver systems, SAP has guidelines on how to limit the volume of large amounts of data. See [this SAP guide](https://wiki.scn.sap.com/wiki/download/attachments/247399467/DVM_%20Guide_7.2.pdf?version=1&modificationDate=1549365516000&api=v2) about data management in SAP ERP systems. Some of the content also applies to NetWeaver and S/4HANA systems in general.
8.	An automated deployment approach. The goal of the automation of infrastructure deployments on Azure is to deploy in a deterministic way and get deterministic results. Many customers use PowerShell or CLI-based scripts. But there are various open-source technologies that you can use to deploy Azure infrastructure for SAP and even install SAP software. You can find examples on GitHub:
	- [Automated SAP Deployments in Azure Cloud](https://github.com/Azure/sap-hana)
	- [SAP HANA Installation](https://github.com/AzureCAT-GSI/SAP-HANA-ARM)
9.	Define a regular design and deployment review cadence between you as the customer, the system integrator, Microsoft, and other involved parties.

 
## Pilot phase (strongly recommended)
 
You can run a pilot before or during project planning and preparation. You can also use the pilot phase to test approaches and designs made during the planning and preparation phase. And you can expand the pilot phase to make it a real proof of concept.

We recommend that you set up and validate a full HADR solution and security design during a pilot deployment. Some customers perform scalability tests during this phase. Other customers use deployments of SAP sandbox systems as a pilot phase. We assume you've already identified a system that you want to migrate to Azure for the pilot.

1. Optimize data transfer to Azure. The optimal choice is highly dependent on the specific scenario. Transfer from on-premises through [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) is fastest if the ExpressRoute circuit has enough bandwidth. In other scenarios, transferring through the internet is faster.
2. For a heterogeneous SAP platform migration that involves an export and import of data, test and optimize the export and import phases. For large migrations in which SQL Server is the destination platform, you can find [recommendations](https://techcommunity.microsoft.com/t5/Running-SAP-Applications-on-the/SAP-OS-DB-Migration-to-SQL-Server-8211-FAQ-v6-2-April-2017/ba-p/368070). You can use Migration Monitor/SWPM if you don't need a combined release upgrade. You can use the [SAP DMO](https://blogs.sap.com/2013/11/29/database-migration-option-dmo-of-sum-introduction/) process when you combine the migration with an SAP release upgrade. To do so, you need to meet certain requirements for the source and target DBMS platform combination. This process is documented in [Database Migration Option (DMO) of SUM 2.0 SP03](https://launchpad.support.sap.com/#/notes/2631152).
   1.  Export to source, export file upload to Azure, and import performance. Maximize overlap between export and import.
   2.  Evaluate the volume of the database on the target and destination platforms for the purposes of infrastructure sizing.
   3.  Validate and optimize timing.
1. Technical validation.
   1. VM types.
        - Review the resources in SAP support notes, in the SAP HANA hardware directory, and in the SAP PAM again. Make sure there are no changes to supported VMs for Azure, supported OS releases for those VM types, and supported SAP and DBMS releases.
        - Validate again the sizing of your application and the infrastructure you deploy on Azure. If you're moving existing applications, you can often derive the necessary SAPS from the infrastructure you use and the [SAP benchmark webpage](https://www.sap.com/dmc/exp/2018-benchmark-directory/#/sd) and compare it to the SAPS numbers listed in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). Also keep [this article on SAPS ratings](https://techcommunity.microsoft.com/t5/Running-SAP-Applications-on-the/SAPS-ratings-on-Azure-VMs-8211-where-to-look-and-where-you-can/ba-p/368208) in mind.
        - Evaluate and test the sizing of your Azure VMs with regard to maximum storage throughput and network throughput of the VM types you chose during the planning phase. You can find the data here:
           -  [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). It's important to consider the *max uncached disk throughput* for sizing.
           -  [Sizes for Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). It's important to consider the *max uncached disk throughput* for sizing.
   2. Storage.
        - At a minimum, use [Azure Standard SSD storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-ssd) for VMs that represent SAP application layers and for deployment of DBMSs that aren't performance sensitive.
        - In general, we don't recommend the use of [Azure Standard HDD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-hdd).
        - Use [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#premium-ssd) for any DBMS VMs that are remotely performance sensitive.
        - Use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/).
        - Use Azure Write Accelerator for DBMS log drives with M-Series. Be aware of Write Accelerator limits and usage, as documented in [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator).
        - For the different DBMS types, check the [generic SAP-related DBMS documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general) and the DBMS-specific documentation that the generic document points to.
        - For more information about SAP HANA, see [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations).
        - Never mount Azure data disks to an Azure Linux VM by using the device ID. Instead, use the universally unique identifier (UUID). Be careful when you use graphical tools to mount Azure data disks, for example. Double-check the entries in /etc/fstab to make sure the UUID is used to mount the disks. You can find more details in [this article](https://docs.microsoft.com/azure/virtual-machines/linux/attach-disk-portal#connect-to-the-linux-vm-to-mount-the-new-disk).
   3. Networking.
        - Test and evaluate your virtual network infrastructure and the distribution of your SAP applications across or within the different Azure virtual networks.
        -  Evaluate the hub-and-spoke virtual network architecture approach or the microsegmentation approach within a single Azure virtual network. Base this evaluation on:
               1. Costs of data exchange between [peered Azure virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview). For information about costs, see [Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
               2. Advantages of a fast disconnection of the peering between Azure virtual networks as opposed to changing the network security group to isolate a subnet within a virtual network. This evaluation is for cases when applications or VMs hosted in a subnet of the virtual network became a security risk.
                3. Central logging and auditing of network traffic between on-premises, the outside world, and the virtual datacenter you built in Azure.
        - Evaluate and test the data path between the SAP application layer and the SAP DBMS layer.
            -  Placement of [Azure network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of SAP systems based on SAP NetWeaver, Hybris, or S/4HANA isn't supported.
            -  Placement of the SAP application layer and SAP DBMS in different Azure virtual networks that aren't peered isn't supported.
            -  You can use [application security group and network security group rules](https://docs.microsoft.com/azure/virtual-network/security-overview) to define routes between the SAP application layer and the SAP DBMS layer.
        - Make sure that [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled on the VMs used in the SAP application layer and the SAP DBMS layer. Keep in mind that different OS levels are needed to support Accelerated Networking in Azure:
            - Windows Server 2012 R2 or later.
            - SUSE Linux 12 SP3 or later.
            - RHEL 7.4 or later.
            - Oracle Linux 7.5. If you're using the RHCKL kernel, release 3.10.0-862.13.1.el7 is required. If you're using the Oracle UEK kernel, release 5 is required.
        - Test and evaluate the network latency between the SAP application layer VMs and DBMS VMs according to SAP support notes [#500235](https://launchpad.support.sap.com/#/notes/500235) and [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against the network latency guidance in [SAP support note #1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate or good range. Exceptions apply to traffic between VMs and HANA Large Instance units, as documented in [this article](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance).
        - Make sure ILB deployments are set up to use Direct Server Return. This setting will reduce latency when Azure ILBs are used for high availability configurations on the DBMS layer.
        - If you're using Azure Load Balancer together with Linux guest operating systems, check that the Linux network parameter **net.ipv4.tcp_timestamps** is set to **0**. This recommendation conflicts with recommendations in older versions of [SAP note #2382421](https://launchpad.support.sap.com/#/notes/2382421). The SAP note is now updated to state that this parameter needs to be set to **0** to work with Azure load balancers.
        - Consider using [Azure proximity placement groups](https://docs.microsoft.com/azure/virtual-machines/linux/co-location) to get optimal network latency. For more information, see [Azure proximity placement groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md).
   4. High availability and disaster recovery deployments.
        - If you deploy the SAP application layer without defining a specific Azure Availability Zone, make sure that all VMs that run SAP dialog instances or middleware instances of a single SAP system are deployed in an [availability set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability).
        - If you don't need high availability for SAP Central Services and the DBMS, you can deploy these VMs into the same availability set as the SAP application layer.
        - If you protect SAP Central Services and the DBMS layer for high availability by using passive replication, place the two nodes for SAP Central Services in one separate availability set and the two DBMS nodes in another availability set.
        - If you deploy into Azure Availability Zones, you can't use availability sets. But you do need to make sure you deploy the active and passive Central Services nodes into two different Availability Zones. Use Availability Zones that have the lowest latency between them.
          Keep in mind that you need to use [Azure Standard Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones) for the use case of establishing Windows or Pacemaker failover clusters for the DBMS and SAP Central Services layer across Availability Zones. You can't use [Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview) for zonal deployments.
   5. Timeout settings.
        - Check the SAP NetWeaver developer traces of the SAP instances to make sure there are no connection breaks between the enqueue server and the SAP work processes. You can avoid these connection breaks by setting these two registry parameters:
            - HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveTime = 120000. For more information, see [KeepAliveTime](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-2000-server/cc957549(v=technet.10)).
            - HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveInterval = 120000. For more information, see [KeepAliveInterval](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-2000-server/cc957548(v=technet.10)).
        - To avoid GUI timeouts between on-premises SAP GUI interfaces and SAP application layers deployed in Azure, check whether these parameters are set in the default.pfl or the instance profile:
            - rdisp/keepalive_timeout = 3600
            - rdisp/keepalive = 20
        - To prevent disruption of established connections between the SAP enqueue process and the SAP work processes, you need to set the **enque/encni/set_so_keepalive** parameter to **true**. See also [SAP note #2743751](https://launchpad.support.sap.com/#/notes/2743751).  
        - If you use a Windows failover cluster configuration, make sure that the time to react on non-responsive nodes is set correctly for Azure. The article [Tuning Failover Cluster Network Thresholds](https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834) lists parameters and how they affect failover sensitivities. Assuming the cluster nodes are in the same subnet, you should change these parameters:
            - SameSubNetDelay = 2000
            - SameSubNetThreshold = 15
            - RoutingHistorylength = 30
1. Test your high availability and disaster recovery procedures.
   1. Simulate failover situations by shutting down VMs (Windows guest operating systems) or putting operating systems in panic mode (Linux guest operating systems). This step will help you figure out whether your failover configurations work as designed.
   1. Measure how long it takes to execute a failover. If the times are too long, consider:
        - For SUSE Linux, use SBD devices instead of the Azure Fence agent to speed up failover.
        - For SAP HANA, if the reload of data takes too long, consider provisioning more storage bandwidth.
   3. Test your backup/restore sequence and timing and make corrections if you need to. Make sure that backup times are sufficient. You also need to test the restore and time restore activities. Make sure that restore times are within your RTO SLAs wherever your RTO relies on a database or VM restore process.
   4. Test cross-region DR functionality and architecture.
1. Security checks.
   1. Test the validity of your Azure role-based access control (RBAC) architecture. The goal is to separate and limit the access and permissions of different teams. For example, SAP Basis team members should be able to deploy VMs and assign disks from Azure Storage into a given Azure virtual network. But the SAP Basis team shouldn't be able to create its own virtual networks or change the settings of existing virtual networks. Members of the network team shouldn't be able to deploy VMs into virtual networks in which SAP application and DBMS VMs are running. Nor should members of this team be able to change attributes of VMs or even delete VMs or disks.  
   1.  Verify that [network security group and ASC](https://docs.microsoft.com/azure/virtual-network/security-overview) rules work as expected and shield the protected resources.
   1.  Make sure that all resources that need to be encrypted are encrypted. Define and implement processes to back up certificates, store and access those certificates, and restore the encrypted entities.
   1.  Use [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption-faq) for OS disks where possible from an OS-support point of view.
   1.  Be sure that you're not using too many layers of encryption. In some cases, it does make sense to use Azure Disk Encryption together with one of the DBMS Transparent Data Encryption methods to protect different disks or components on the same server.  For example on a SAP DBMS server, the Azure Disk Encryption (ADE) can be enabled on the operating system boot disk (if the OS supports ADE) and those data disk(s) not used by the DBMS data persistence files.  An example is to use ADE on the disk holding the DBMS TDE encryption keys.
1. Performance testing. In SAP, based on SAP tracing and measurements, make these comparisons:
   - Where applicable, compare the top 10 online reports to your current implementation.
   - Where applicable, compare the top 10 batch jobs to your current implementation.
   - Compare data transfers through interfaces into the SAP system. Focus on interfaces where you know the transfer is now going between different locations, like from on-premises to Azure.


## Non-production phase 
In this phase, we assume that after a successful pilot or proof of concept (POC), you're starting to deploy non-production SAP systems to Azure. Incorporate everything you learned and experienced during the POC to this deployment. All the criteria and steps listed for POCs apply to this deployment as well.

During this phase, you usually deploy development systems, unit testing systems, and business regression testing systems to Azure. We recommend that at least one non-production system in one SAP application line has the full high availability configuration that the future production system will have. Here are some additional steps that you need to complete during this phase:  

1.	Before you move systems from the old platform to Azure, collect resource consumption data, like CPU usage, storage throughput, and IOPS data. Especially collect this data from the DBMS layer units, but also collect it from the application layer units. Also measure network and storage latency.
2.	Record the availability usage time patterns of your systems. The goal is to figure out whether non-production systems need to be available all day, every day or whether there are non-production systems that can be shut down during certain phases of a week or month.
3.	Test and determine whether you want to create your own OS images for your VMs in Azure or whether you want to use an image from the Azure Shared Image Gallery. If you're using an image from the Shared Image Gallery, make sure to use an image that reflects the support contract with your OS vendor. For some OS vendors, Shared Image Gallery lets you bring your own license images. For other OS images, support is included in the price quoted by Azure. If you decide to create your own OS images, you can find documentation in these articles:
	-	[Build a generalized image of a Windows VM deployed in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
	-	[Build a generalized image of a Linux VM deployed in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image)
3.	If you use SUSE and Red Hat Linux images from the Shared Image Gallery, you need to use the images for SAP provided by the Linux vendors in the Shared Image Gallery.
4.	Make sure to fulfill the SAP support requirements for Microsoft support agreements. See [SAP support note #2015553](https://launchpad.support.sap.com/#/notes/2015553). For HANA Large Instances, see [Onboarding requirements](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-onboarding-requirements).
4.	Make sure the right people get [planned maintenance notifications](https://azure.microsoft.com/blog/a-new-planned-maintenance-experience-for-your-virtual-machines/) so you can choose the best downtimes.
5.	Frequently check for Azure presentations on channels like [Channel 9](https://channel9.msdn.com/) for new functionality that might apply to your deployments.
6.	Check SAP notes related to Azure, like [support note #1928533](https://launchpad.support.sap.com/#/notes/1928533), for new VM SKUs and newly supported OS and DBMS releases. Compare the pricing of new VM types against that of older VM types, so you can deploy VMs with the best price/performance ratio.
7.	Recheck SAP support notes, the SAP HANA hardware directory, and the SAP PAM. Make sure there were no changes in supported VMs for Azure, supported OS releases on those VMs, and supported SAP and DBMS releases.
8.	Check [the SAP website](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) for new HANA-certified SKUs in Azure. Compare the pricing of new SKUs with the ones you planned to use. Eventually, make necessary changes to use the ones that have the best price/performance ratio.
9.	Adapt your deployment scripts to use new VM types and incorporate new Azure features that you want to use.
10.	After deployment of the infrastructure, test and evaluate the network latency between SAP application layer VMs and DBMS VMs, according to SAP support notes [#500235](https://launchpad.support.sap.com/#/notes/500235) and [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against the network latency guidance in [SAP support note #1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate or good range. Exceptions apply to traffic between VMs and HANA Large Instance units, as documented in [this article](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance). Make sure that none of the restrictions mentioned in [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#azure-network-considerations) and [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations) apply to your deployment.
11.	Make sure your VMs are deployed to the correct [Azure proximity placement group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location), as described in [Azure proximity placement groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md).
11.	Perform all the other checks listed for the proof of concept phase before applying the workload.
12.	As the workload applies, record the resource consumption of the systems in Azure. Compare this consumption with records from your old platform. Adjust VM sizing of future deployments if you see that you have large differences. Keep in mind that when you downsize, storage and network bandwidths of VMs will be reduced as well.
	- [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json)
	- [Sizes for Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) 
13.	Experiment with system copy functionality and processes. The goal is to make it easy for you to copy a development system or a test system, so project teams can get new systems quickly. Consider using [SAP LaMa](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+Landscape+Management+%28SAP+LaMa%29+at+a+Glance) for these tasks.
14.	Optimize and hone your team's Azure role-based access, permissions, and processes to make sure you have separation of duties. At the same time, make sure all teams can perform their tasks in the Azure infrastructure.
15.	Exercise, test, and document high-availability and disaster recovery procedures to enable your staff to execute these tasks. Identify shortcomings and adapt new Azure functionality that you're integrating into your deployments.

 
## Production preparation phase 
In this phase, collect what you experienced and learned during your non-production deployments and apply it to future production deployments. You also need to prepare the work of the data transfer between your current hosting location and Azure.

1.	Complete necessary SAP release upgrades of your production systems before moving to Azure.
1.	Agree with the business owners on functional and business tests that need to be conducted after migration of the production system.
1.	Make sure these tests are completed with the source systems in the current hosting location. Avoid conducting tests for the first time after the system is moved to Azure.
1.	Test the process of migrating production systems to Azure. If you're not moving all production systems to Azure during the same time frame, build groups of production systems that need to be at the same hosting location. Test data migration. Here are some common methods:
	- Use DBMS methods like backup/restore in combination with SQL Server Always On, HANA System Replication, or Log shipping to seed and synchronize database content in Azure.
	- Use backup/restore for smaller databases.
	- Use SAP Migration Monitor, which is integrated into SAP SWPM, to perform heterogeneous migrations.
	- Use the [SAP DMO](https://blogs.sap.com/2013/11/29/database-migration-option-dmo-of-sum-introduction/) process if you need to combine your migration with an SAP release upgrade. Keep in mind that not all combinations of source DBMS and target DBMS are supported. You can find more information in the specific SAP support notes for the different releases of DMO. For example, [Database Migration Option (DMO) of SUM 2.0 SP04](https://launchpad.support.sap.com/#/notes/2644872).
	- Test whether data transfer throughput is better through the internet or through ExpressRoute, in case you need to move backups or SAP export files. If you're moving data through the internet, you might need to change some of your network security group/application security group rules that you'll need to have in place for future production systems.
1.	Before moving systems from your old platform to Azure, collect resource consumption data. Useful data includes CPU usage, storage throughput, and IOPS data. Especially collect this data from the DBMS layer units, but also collect it from the application layer units. Also measure network and storage latency.
1.	Recheck SAP support notes, the SAP HANA hardware directory, and the SAP PAM. Make sure there were no changes in supported VMs for Azure, supported OS releases in those VMs, and supported SAP and DBMS releases.
1.	Update deployment scripts to take into account the latest decisions you've made on VM types and Azure functionality.
1.	After deploying infrastructure and applications, validate that:
	- The correct VM types were deployed, with the correct attributes and storage sizes.
	- The VMs are on the correct and desired OS releases and patches and are uniform.
	- VMs are hardened as required and in a uniform way.
	- The correct application releases and patches were installed and deployed.
	- The VMs were deployed into Azure availability sets as planned.
	- Azure Premium Storage is used for latency-sensitive disks or where the [single-VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) is required.
	- Azure Write Accelerator is deployed correctly.
		- Make sure that, within the VMs, storage spaces or stripe sets were built correctly across disks that need Write Accelerator.
		- Check the [configuration of software RAID on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/configure-raid).
		- Check the [configuration of LVM on Linux VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/configure-lvm).
	- [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) are used exclusively.
	- VMs were deployed into the correct availability sets and Availability Zones.
	- [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled on the VMs used in the SAP application layer and the SAP DBMS layer.
	- No [Azure network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) are in the communication path between the SAP application and the DBMS layer of SAP systems based on SAP NetWeaver, Hybris, or S/4HANA.
	- Application security group and network security group rules allow communication as desired and planned and block communication where required.
	- Timeout settings are set correctly, as described earlier.
	- VMs are deployed to the correct [Azure proximity placement group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location), as described in [Azure proximity placement groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md).
	- Network latency between SAP application layer VMs and DBMS VMs is tested and validated as described in SAP support notes [#500235](https://launchpad.support.sap.com/#/notes/500235) and [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against the network latency guidance in [SAP support note #1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate or good range. Exceptions apply to traffic between VMs and HANA Large Instance units, as documented in [this article](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance).
	- Encryption was implemented where necessary and with the appropriate encryption method.
	- Interfaces and other applications can connect the newly deployed infrastructure.
1.	Create a playbook for reacting to planned Azure maintenance. Determine the order in which systems and VMs should be rebooted for planned maintenance.
 	

## Go-live phase
During the go-live phase, be sure to follow the playbooks you developed during earlier phases. Execute the steps that you tested and practiced. Don't accept last-minute changes in configurations and processes. Also complete these steps:

1. Verify that Azure portal monitoring and other monitoring tools are working. We recommend Windows Performance Monitor (perfmon) for Windows and SAR for Linux.
	- CPU counters.
		- Average CPU time, total (all CPUs)
		- Average CPU time, each individual processor (128 processors on M128 VMs)
		- CPU kernel time, each individual processor
		- CPU user time, each individual processor
	- Memory.
		- Free memory
		- Memory page in/second
		- Memory page out/second
	- Disk.
		- Disk read in KBps, per individual disk
		- Disk reads/second, per individual disk
		- Disk read in microseconds/read, per individual disk
		- Disk write in KBps, per individual disk
		- Disk write/second, per individual disk
		- Disk write in microseconds/read, per individual disk
	- Network.
		- Network packets in/second
		- Network packets out/second
		- Network KB in/second
		- Network KB out/second
1.	After data migration, perform all the validation tests you agreed upon with the business owners. Accept validation test results only when you have results for the original source systems.
1.	Check whether interfaces are functioning and whether other applications can communicate with the newly deployed production systems.
1.	Check the transport and correction system through SAP transaction STMS.
1.	Perform database backups after the system is released for production.
1.	Perform VM backups for the SAP application layer VMs after the system is released for production.
1.	For SAP systems that weren't part of the current go-live phase but that communicate with the SAP systems that you moved to Azure during this go-live phase, you need to reset the host name buffer in SM51. Doing so will remove the old cached IP addresses associated with the names of the application instances you moved to Azure.  


## Post production
This phase is about monitoring, operating, and administering the system. From an SAP point of view, the usual tasks that you were required to complete in your old hosting location apply. Complete these Azure-specific tasks as well:

1. Review Azure invoices for high-charging systems.
2. Optimize price/performance efficiency on the VM side and the storage side.
3. Optimize the times when you can shut down systems.  


## Next steps
See these articles:

- [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide)
- [Azure Virtual Machines deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide)
- [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general)

