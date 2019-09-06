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
ms.date: 07/15/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SAP workload on Azure: planning and deployment checklist

This checklist is designed for customers moving SAP NetWeaver, S/4HANA, and Hybris applications to Azure infrastructure as a service. The checklist should be reviewed by a customer and/or SAP partner throughout the duration of the project. It's important to note that many of the checks are completed at the beginning of the project and during the planning phase. After the deployment is done, straightforward changes on deployed Azure infrastructure or SAP software releases can become complex.

Review the checklist at key milestones during your project. Doing so will enable you to detect small problems before they become large problems, and you'll have enough time to re-engineer and test any necessary changes. You shouldn't consider this checklist to be complete. Depending on your situation, you might need to perform many more checks.

The checklist doesn't include tasks that are independent of Azure. For example, SAP application interfaces change during a move to the Azure platform or to a hosting provider.

This checklist can also be used for systems that are already deployed. New features, like Write Accelerator and Availability Zones, and new VM types might have been added since you deployed. So it's useful to review the checklist periodically to ensure you're aware of new features in the Azure platform.

## Project preparation and planning phase
During this phase, you plan the migration of your SAP workload onto the Azure platform. At a minimum, during this phase you need to create the following documents and define and discuss the following:

1. High-level design document. This document should contain:
	- The current inventory of SAP components and applications, and a target application inventory for Azure.
	- A responsibility assignment matrix (RACI) that defines the responsibilities and assignments of the parties involved. Start at a high level, and work to more granular levels throughout planning and the first deployments.
	- A high-level solution architecture.
	- A decision about which Azure regions to deploy to. See the [list of Azure regions here](https://azure.microsoft.com/global-infrastructure/regions/). To learn which services are available in each region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).
	- A networking architecture to connect from on-premises into Azure. Start to familiarize yourself with the [Virtual Datacenter blueprint for Azure](https://docs.microsoft.com/azure/architecture/vdc/).
	- Security principles for running high-impact business data in Azure. To learn about data security, start with the [Azure security documentation](https://docs.microsoft.com/azure/security/).
2.	Technical design document. This document should contain:
	- A block diagram for the solution.
	- The sizing of compute, storage, and networking components in Azure. For SAP sizing of Azure VMs, see [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).
	- Business continuity and disaster recovery architecture.
	- Detailed information about OS, DB, kernel, and SAP support pack versions. It's not necessarily true that every OS release supported by SAP NetWeaver or S/4HANA is supported on Azure VMs. The same is true for DBMS releases. You need to check the following sources to align and if necessary upgrade SAP releases, DBMS releases, and OS releases to ensure SAP and Azure support. You need to have release combinations supported by SAP and Azure to get full support from SAP and Microsoft. If necessary, you need to plan for upgrading some software components. More details on supported SAP, OS, and DBMS software are documented at these locations:
		- [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). This note defines the minimum OS releases supported in Azure VMs. It also defines the minimum database releases required for most non-HANA databases. Finally, it provides the SAP sizing for SAP-supported Azure VM types.
		- [SAP support note #2039619](https://launchpad.support.sap.com/#/notes/2039619). This note defines the Oracle support matrix for Azure. Oracle supports only Windows and Oracle Linux as guest operating systems on Azure for SAP workloads. This support statement also applies for the SAP application layer that runs SAP instances. However, Oracle doesn't support high availability for SAP Central Services in Oracle Linux through Pacemaker. If you need high availability for ASCS on Oracle Linux, you need to use SIOS Protection Suite for Linux. For detailed SAP certification data, see SAP support note [#1662610 - Support details for SIOS Protection Suite for Linux](https://launchpad.support.sap.com/#/notes/1662610). For Windows, the SAP-supported Windows Server Failover Clustering solution for SAP Central Services is supported in conjunction with Oracle as the DBMS layer.
		- [SAP support note #2235581](https://launchpad.support.sap.com/#/notes/2235581). This note provides the support matrix for SAP HANA on different OS releases.
		- SAP HANA-supported Azure VMs and [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture) are listed [here](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure).
		- [SAP Product Availability Matrix](https://support.sap.com/en/).
		- SAP notes for other SAP-specific products.	 
	- We recommend strict 3-tier designs for SAP production systems. We don't recommend combining ASCS and app servers on one VM. Using multi-SID cluster configurations for SAP Central Services is supported on Windows guest operating systems on Azure. But this configuration isn't supported for SAP Central Services on Linux operating systems on Azure. Documentation for the Windows guest OS scenario can be found in these articles:
		- [SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and shared disk on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-ascs-ha-multi-sid-wsfc-shared-disk)
		- [SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and file share on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-ascs-ha-multi-sid-wsfc-file-share)
	- High availability and disaster recovery architecture.
		- Based on RTO and RPO, define what the high availability and disaster recovery architecture needs to look like.
		- For high availability within a zone, check what the desired DBMS has to offer in Azure. Most DBMS packages offer synchronous methods of a synchronous hot standby, which we recommend for production systems. Also check the SAP-related documentation for different databases, starting with [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general) and related documents.
			- Using Windows Server Failover Clustering with a shared disk configuration for the DBMS layer as, for example, described for [SQL Server here](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server?view=sql-server-2017), is not supported. Instead, use solutions like:
				- [SQL Server Always On](https://docs.microsoft.com/azure/virtual-machines/windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups) 
				- [Oracle Data Guard](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/configure-oracle-dataguard)
				- [HANA System Replication](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/b74e16a9e09541749a745f41246a065e.html)
		- For disaster recovery across Azure regions, review the solutions offered by different DBMS vendors. Most of them support asynchronous replication or log shipping.
		- For the SAP application layer, determine whether you'll run your business regression test systems, which ideally are replicas of your production deployments, in the same Azure region or in your DR region. In the second case, you can target that business regression system as the DR target for your production deployments.
		- If you decide not to place the non-production systems in the DR site, look into Azure Site Recovery as a viable method for replicating the SAP application layer into the Azure DR region. For more information, see a [Set up disaster recovery for a multi-tier SAP NetWeaver app deployment](https://docs.microsoft.com/azure/site-recovery/site-recovery-sap).
		- If you decide to use a combined HADR configuration by using [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview), familiarize yourself with the Azure regions where Availability Zones are available and with restrictions that can be introduced by increased network latencies between two Availability Zones.  
3.	An inventory of all SAP interfaces (SAP and non-SAP).
4.	Design of foundation services. This design should include the following items:
	- Active Directory and DNS design.
	- Network topology within Azure and assignment of different SAP systems.
	- [Role-based access](https://docs.microsoft.com/azure/role-based-access-control/overview) structure for your teams that manage infrastructure and SAP applications in Azure.
	- Resource group topology.
	- [Tagging strategy](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags#tags-and-billing).
	- Naming conventions for VMs and other infrastructure components and/or logical names.
5.	Microsoft Premier Support contract. Identify your Microsoft Technical Account Manager (TAM). For SAP support requirements, see [SAP support note #2015553](https://launchpad.support.sap.com/#/notes/2015553).
6.	Define the number of Azure subscriptions and core quota for the subscriptions. [Open support requests to increase quotas of Azure subscriptions](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request) as needed.
7.	Data reduction and data migration plan for migrating SAP data into Azure. For SAP NetWeaver systems, SAP has guidelines on how to limit the volume of large amounts of data. See this [SAP guide](https://help.sap.com/http.svc/rc/2eb2fba8f8b1421c9a37a8d7233da545/7.0/en-US/Data_Management_Guide_Version_70E.PDF) about data management in SAP ERP systems. Some of the content does apply to NetWeaver and S/4HANA systems in general.
8.	Define an automated deployment approach. The goal of the automation of infrastructure deployments on Azure is to deploy in a deterministic way and get deterministic results. Many customers use PowerShell or CLI-based scripts. But there are various open-source technologies that you can use to deploy Azure infrastructure for SAP and even install SAP software. You can find examples on GitHub:
	- [Automated SAP Deployments in Azure Cloud](https://github.com/Azure/sap-hana)
	- [SAP HANA Installation](https://github.com/AzureCAT-GSI/SAP-HANA-ARM)
9.	Define a regular design and deployment review cadence between you as the customer, the system integrator, Microsoft, and other involved parties.

 
## Pilot phase (strongly recommended)
 
You can run a pilot before or during project planning and preparation. You can also use the pilot phase to test approaches and designs made during the planning and preparation phase. And you can expand the pilot phase to make it a real proof of concept.

We recommend that you set up and validate a full HADR solution and security design during a pilot deployment. Some customers perform scalability tests during this phase. Other customers use deployments of SAP sandbox systems as a pilot phase. We assume that you've already identified a system that you want to migrate to Azure for the purpose of running a pilot.

1. Optimize data transfer to Azure. The optimal choice is highly dependent on the specific scenario. Transfer from on-premises through [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/) is fastest if the ExpressRoute circuit has enough bandwidth. In other scenarios, transferring through the internet is faster.
2. For a heterogeneous SAP platform migration that involves an export and import of data, test and optimize the export and import phases. For large migrations in which SQL Server is the destination platform, you can find [recommendations here](https://techcommunity.microsoft.com/t5/Running-SAP-Applications-on-the/SAP-OS-DB-Migration-to-SQL-Server-8211-FAQ-v6-2-April-2017/ba-p/368070).
 
   You can use Migration Monitor/SWPM if you don't need a combined release upgrade. You can use the [SAP DMO](https://blogs.sap.com/2013/11/29/database-migration-option-dmo-of-sum-introduction/) process when you combine the migration with an SAP release upgrade and meet certain source and target DBMS platform combination requirements. This process is documented in [Database Migration Option (DMO) of SUM 2.0 SP03](https://launchpad.support.sap.com/#/notes/2631152).
   1.  Export to source, export file upload to Azure, and import performance. Maximize overlap between export and import.
   2.  Evaluate the volume of the database on the target and destination platforms for the purposes of infrastructure sizing.
   3.  Validate and optimize timing.
1. Technical validation.
   1. VM types.
           1.  Review the resources in SAP support notes, in the SAP HANA hardware directory, and in the SAP PAM again. Make sure there are no changes to supported VMs for Azure, supported OS releases for those VM types, and supported SAP and DBMS releases.
           2.  Validate again the sizing of your application and the infrastructure you deploy on Azure. If you're moving existing applications, you can often derive the necessary SAPS from the infrastructure you use and the [SAP benchmark webpage](https://www.sap.com/dmc/exp/2018-benchmark-directory/#/sd) and compare it to the SAPS numbers listed in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). Also keep [this article on SAPS ratings](https://techcommunity.microsoft.com/t5/Running-SAP-Applications-on-the/SAPS-ratings-on-Azure-VMs-8211-where-to-look-and-where-you-can/ba-p/368208) in mind.
           3.  Evaluate and test the sizing of your Azure VMs with regard to maximum storage throughput and network throughput of the VM types you chose during the planning phase. You can find the data here:
                    -  [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). It's important to consider the *max uncached disk throughput* for sizing.
                    -  [Sizes for Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) It's important to consider the *max uncached disk throughput* for sizing.
   2. Storage
           -  At a minimum, use [Azure Standard SSD storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-ssd) for VMs that represent SAP application layers and for DBMS deployment that isn't performance sensitive.
           -  In general, we don't recommend the use of [Azure Standard HDD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-hdd).
           -  Use [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#premium-ssd) for any DBMS VMs that are remotely performance sensitive.
           -  Use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/).
           -  Use Azure Write Accelerator for DBMS log drives with M-Series. Be aware of Write Accelerator limits and usage, as documented in [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator).
           -  For the different DBMS types, check the [generic SAP-related DBMS documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general) and the DBMS-specific documentation that the generic document points to.
           -  For more information about SAP HANA, see [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations).
           - Never mount Azure data disks to an Azure Linux VM by using the device ID. Instead, use the universally unique identifier (UUID). Be careful when you use graphical tools to mount Azure data disks, for example. Double-check the entries in /etc/fstab to make sure the UUID is used to mount the disks. You can find [more details here](https://docs.microsoft.com/azure/virtual-machines/linux/attach-disk-portal#connect-to-the-linux-vm-to-mount-the-new-disk).
   3. Networking
           1.  Test and evaluate your virtual network infrastructure and the distribution of your SAP applications across or within the different Azure virtual networks.
           1.  Evaluate the hub-and-spoke virtual network architecture approach or the microsegmentation approach within a single Azure virtual network. Base this evaluation on:
                    1.  Costs of data exchange between [peered Azure virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview). For costs check [Virtual Network Pricing](https://azure.microsoft.com/pricing/details/virtual-network/)
                    2.  Advantage of fast disconnect of the peering between Azure virtual networks in comparison to change NSG to isolate a subnet within a virtual network for cases where applications or VMs hosted in a subnet of the virtual network became a security risk
                    3.  Central logging and auditing of network traffic between on-premise, outside world, and the virtual datacenter you built up in Azure
           2.  Evaluate and test data path between SAP application layer and SAP DBMS layer. 
                    1.  Any placement of [Azure Network Virtual Appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of an SAP NetWeaver, Hybris, or S/4HANA based SAP systems is not supported at all
                    2.  Placing SAP application layer and SAP DBMS in different Azure virtual networks that are not peered is not supported
                    3.  [Azure ASG and NSG rules](https://docs.microsoft.com/azure/virtual-network/security-overview) are supported for defining routes between the SAP application layer and SAP DBMS layer
           3.  Make sure that [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled on the VMs used on the SAP application layer and the SAP DBMS layer. Keep in mind that different OS levels are needed to support Accelerated Networking in Azure:
                    1.  Windows Server 2012 R2 or newer releases
                    2.  SUSE Linux 12 SP3 or newer releases
                    3.  RHEL 7.4 or newer releases
                    4.  Oracle Linux 7.5. Using the RHCKL kernel, the release needs to be 3.10.0-862.13.1.el7. Using the Oracle UEK kernel release 5 is required
            4.   Test and evaluate the network latency between SAP application layer VM and DBMS VM according to SAP support note [#500235](https://launchpad.support.sap.com/#/notes/500235) and SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against network latency guidance of SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate and good range. Exceptions apply to traffic between VMs and HANA Large Instance units as documented [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance)
            5.   Make sure that ILB deployments are set up to use Direct Server Return. This setting will reduce latency in cases where Azure ILBs are used for high availability configurations on the DBMS layer
            6.   If you are using Azure Load Balancer in conjunction with Linux guest operating systems, check that the Linux network parameter **net.ipv4.tcp_timestamps** is set to **0**. Against the recommendations in older versions of SAP note [#2382421](https://launchpad.support.sap.com/#/notes/2382421). The SAP note meanwhile is updated to reflect the fact that the parameter needs to be set to 0 to work in conjunction with Azure Load Balancers.
            7.   Consider using [Azure Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location) as described in the article [Azure Proximity Placement Groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md) to get the most optimal network latency.
   4. High Availability and disaster recovery deployments.
           1. If you deploy the SAP application layer without defining a specific Azure Availability Zone, make sure that all VMs running SAP dialog instance or middleware instances of a single SAP system are deployed in an [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability). 
              1.   In case you don't require high availability for the SAP Central Services and DBMS, these VMs can be deployed into the same Availability Set as the SAP application layer
           2. If you protect the SAP Central Services and the DBMS layer for high availability with passive replicas, have the two nodes for SAP Central Services in one separate Availability Set and the two DBMS node in another Availability Set
           3. If you deploy into Azure Availability Zones, you can't leverage Availability Sets. However you would need to make sure that you deploy the active and passive Central Services nodes into two different Availability Zones, which show the smallest latency between zones.
              1.   Keep in mind that you need to use [Azure Standard Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones) for the case of establishing Windows or Pacemaker Failover Clusters for the DBMS and SAP Central Services layer across Availability Zones. [Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview#skus) can't be used for zonal deployments 
   5. Timeout settings
           1. Check SAP NetWeaver developer traces of the different SAP instances and make sure that no connection breaks between enqueue server and the SAP work processes are noted. These connection breaks can be avoided by setting these two registry parameters:
              1.   HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveTime = 120000 - see also [this article](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-2000-server/cc957549(v=technet.10))
              2.   HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\KeepAliveInterval = 120000 - see also [this article](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-2000-server/cc957548(v=technet.10)) 
           2. In order to avoid GUI time outs between one-premise deployed SAP GUI interfaces and SAP application layers deployed in Azure, check whether the following parameters are set in the default.pfl or the instance profile:
              1.   rdisp/keepalive_timeout = 3600
              2.   rdisp/keepalive = 20
           3. In order to prevent disruption of established connections between the SAP enqueue process and the SAP workprocesse, the parameter enque/encni/set_so_keepalive needs to be set to "true". Also see [SAP Note #2743751](https://launchpad.support.sap.com/#/notes/2743751)  
           3. If you use a Windows Failover Cluster configuration, make sure that the time to react on non-responsive nodes is set correctly for Azure. The Microsoft article [Tuning Failover Cluster Network Thresholds](https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834) lists parameters and how those impact failover sensitivities. Assuming the cluster nodes are in the same subnet, the following parameters should be changed:
              1.   SameSubNetDelay = 2000
              2.   SameSubNetThreshold = 15
              3.   RoutingHistorylength = 30
1. Test your high availability and disaster recovery procedures
   1. Simulate failover situations by shutting down VMs (Windows guest OS) or putting operating systems in panic mode (Linux guest OS) in order to figure out whether your failover configurations work as designed. 
   2. Measure your times it takes to execute a failover. If the times take too long, consider:
      1.   For SUSE Linux, use SBD devices instead of the Azure Fencing Agent to speed up failover
      2.   For SAP HANA, if the reload of data takes too long consider to provision more storage bandwidth
   3. Test backup/restore sequence and timing and tune if necessary. Make sure that not only backup times are sufficient. Also test restore and take the timing on restore activities. make sure that the restore times are within your RTO SLAs where your RTO relies on a database or VM restore process
   4. Test across region DR functionality and architecture
1. Security checks
   1.  Test the validity of the Azure role based access (RBAC) architecture you implemented. Goal is to separate and limit access and permissions of different teams. As an example, SAP Basis team members should be able to deploy VMs and assign disks from Azure storage into a given Azure virtual network. However the SAP Basis team should not be able to create own virtual networks or change the settings of existing virtual networks. On the other side, members of the network team should not be able to deploy VMs into virtual networks where SAP application and DBMS VMs are running. Nor should members of the network team be able to change attributes of VMs or even delete VMs or disks.  
   2.  Verify [NSG and ASC](https://docs.microsoft.com/azure/virtual-network/security-overview) rules are working as expected and shield the protected resources
   3.  Make sure that all resources that need to be encrypted are encrypted. Define and execute processes to back up certificates, store, and access those certificates and restore the encrypted entities. 
   4.  Use [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption-faq) and/or for OS disks where possible from an OS support point of view
   5.  Check that not too many layers of encryption have been used. It does make limited sense to use Azure Disk encryption and then on top one of the DBMS Transparent Database Encryption methods
1. Performance Testing
   1.  In SAP based on SAP tracing and measurements, compare top 10 online reports to current implementation where applicable 
   2.  In SAP based on SAP tracing and measurements, compare top 10 batch jobs to current implementation where applicable 
   3.  In SAP based on SAP tracing and measurements, compare data transfers through interfaces into the SAP system. Focus on interfaces where you know that the transfer is now going between different locations, like going from on-premises to Azure 


## Non-Production Phase 
In this phase, we assume that after a successful pilot or PoC, you are starting to deploy non-production SAP systems into Azure. All the learnings and experiences out of the proof of concepts should be adapted to such a deployment. All the criteria and steps listed in the PoC do apply in this type of deployments as well. 
In this phase, you usually deploy development systems, unit tests systems, and business regression tests systems into Azure. It is recommended that at least one non-production system in one SAP application line has the full high availability configuration as the future production system is going to have. Additional steps you need to consider during that phase are:  

1.	Before moving systems from the old platform into Azure collect resource consumption data, like CPU usage, storage throughput and IOPS data. Especially from the DBMS layer units, but also from the application layer units. Also measure network and storage latency.
2.	Record the availability usage time patterns of the systems. Goal is to figure out whether non-production systems need to be 7x24 available or whether there are non-production systems that can be shut down during certain phases of a week or month
3.	Test and define whether you want to create own OS images for your VMs in Azure or whether you want to use an image out of the Azure Image gallery. If you are using an image out of the Azure gallery, make sure that you take the correct image that reflects the support contract with your OS vendor. For some OS vendors, Azure galleries offer to bring your own license images. For others OS images, support is included in the price quoted by Azure. If you decide to create your own OS images, you can find documentation in these articles:
	1.	You can build a generalized image of a Windows VM deployed in Azure based on [this documentation](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
	2.	You can build a generalized image of a Linux VM deployed in Azure based on [this documentation](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image)
3.	If you use SUSE and Red Hat Linux images from the Azure VM gallery, you need to use the images for SAP provided by the Linux vendors in the Azure VM gallery
4.	Make sure you fulfill the support requirements SAP has regarding Microsoft support agreements. Information can be found in SAP support note [#2015553](https://launchpad.support.sap.com/#/notes/2015553). For HANA Large Instances, refer to the document [Onboarding requirements](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-onboarding-requirements)
4.	Make sure that the right people get [planned maintenance notifications](https://azure.microsoft.com/blog/a-new-planned-maintenance-experience-for-your-virtual-machines/), so, that you can choose the downtime and a reboot of VMs in time
5.	Steadily check Azure documentation of Microsoft presentations on channels like [Channel9](https://channel9.msdn.com/) for new functionality that might apply to your deployments
6.	Check SAP notes related to Azure, like support note [#1928533](https://launchpad.support.sap.com/#/notes/1928533) for new VM SKUs, or newly supported OS and DBMS release. Compare new VM types against older VM types in pricing, so, that you are able to deploy VMs with the best price/performance ratio
7.	Validate the resources on SAP support notes, SAP HANA hardware directory, and SAP PAM again to make sure that there were no changes in supported VMs for Azure, supported OS releases in those VMs, and supported SAP and DBMS releases
8.	Check [here](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) for new HANA certified SKUs in Azure and compare pricing with the ones you planned and eventually change to get the units with better price performance ration 
9.	Adapt your deployment scripts to leverage new VM types and incorporate new features of Azure you want to use
10.	After deployment of the infrastructure, test and evaluate the network latency between SAP application layer VM and DBMS VM according to SAP support note [#500235](https://launchpad.support.sap.com/#/notes/500235) and SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against network latency guidance of SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate and good range. Exceptions apply to traffic between VMs and HANA Large Instance units as documented [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance). Make sure that none of the restrictions mentioned in [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#azure-network-considerations) and [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations) apply to your deployment
11.	Make sure that the VMs are deployed using the correct [Azure Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location) as described in the article [Azure Proximity Placement Groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md)
11.	Perform all the other checks as listed in the Proof of Concepts phase before applying workload
12.	As workload applies, record the resource consumption of those systems in Azure and compare with the records you got from your old platform. Adjust VM sizing of future deployments if you see that you have larger differences. Keep in mind that in case of downsizing, storage, and network bandwidths of a VM will be reduced as well:
	1.	[Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json). 
	2.	[Sizes for Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) 
13.	Work on system copy functionality and processes. Goal is to make it easy for you to copy a development system or a test system, so, that project teams can get new systems fast. Consider [SAP LaMa](https://wiki.scn.sap.com/wiki/display/ATopics/SAP+Landscape+Management+%28SAP+LaMa%29+at+a+Glance) as a tool performing such tasks.
14.	Optimize and hone your team's Azure role based accesses, permissions, and processes in order to make sure that you have a separation of duty on the one side. On the other side, you want to have all teams enabled to perform their tasks in the Azure infrastructure.
15.	Exercise, test, and document high-availability and disaster recovery procedures to enable your staff to execute such tasks. Identify shortcomings and adapt new Azure functionality that you are integrating into your deployments

 
## Production Preparation Phase 
In this phase, you want to collect all the experiences and learnings of your non-production deployments and apply them in the future production deployments. Additionally to the phases before, you also need to prepare the work of the data transfer between your current hosting location and Azure. 

1.	Work through necessary SAP release upgrades of your production systems before moving into Azure
2.	Agree with the business owners on the functional and business tests that need to be conducted after the migration of the production system
	1.	Make sure that all these tests are executed with the source systems in the current hosting location. You want to avoid tests being conducted for the first time once the system is moved into Azure
2.	Test production migration process into Azure. In case of not moving all production systems to Azure in the same time frame, build groups of production systems that need to be in the same hosting location. Exercise and test data migration. Common methods list like:
	1.	Using DBMS methods like backup/restore in combination with SQL Server AlwaysOn, HANA System Replication or Log shipping to seed and synchronize database content in Azure
	2.	Use Backup/restore for smaller databases
	3.	Use SAP Migration Monitor implemented into SAP SWPM tool to perform heterogeneous migrations
	4.	Use the [SAP DMO](https://blogs.sap.com/2013/11/29/database-migration-option-dmo-of-sum-introduction/) process if you need to combine with an SAP release upgrade. Keep in mind that not all combinations between source and target DBMS are supported. More information can be found in the specific SAP support notes for the different releases of DMO. For example, [Database Migration Option (DMO) of SUM 2.0 SP04](https://launchpad.support.sap.com/#/notes/2644872)
	5.	Test whether data transfer through internet or through ExpressRoute is better in throughput in case you need to move backups or SAP export files. For the case of moving data through internet, you might need to change some of your NSG/ASG security rules that you need to have in place for future production systems
3.	Before moving systems from the old platform into Azure collect resource consumption data, like CPU usage, storage throughput and IOPS data. Especially from the DBMS layer units, but also from the application layer units. Also measure network and storage latency.
4.	Validate the resources on SAP support notes, SAP HANA hardware directory, and SAP PAM again to make sure that there were no changes in supported VMs for Azure, supported OS releases in those VMs, and supported SAP and DBMS releases 
4.	Adapt deployment scripts to the latest changes you decided on VM types and Azure functionality
5.	After deployment of infrastructure and application go through a series of checks in order to validate:
	1.	The correct VM types got deployed with the correct attributes and storage sizes
	2.	Check that the VMs are on the correct and desired OS releases and patches and are uniform
	3.	Check that hardening of the VMs are as required and uniform
	4.	Check that the correct application releases and patches got installed and deployed
	5.	The VMs got deployed into Azure Availability Sets as planned
	6.	Azure Premium Storage was used for the latency sensitive disks or where the [single VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/) is required
	7.	Check for correct deployment of Azure Write Accelerator
		1.	Make sure that within the VM, storage spaces, or stripe sets got built correctly across disks that need Azure Write Accelerator support
			1.	Check [Configure Software RAID on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/configure-raid)
			2.	Check [Configure LVM on a Linux VM in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/configure-lvm)
	8.	[Azure managed disks](https://azure.microsoft.com/services/managed-disks/) were used exclusively
	9.	VMs got deployed into the correct Availability Sets and Availability Zones
	10.	Make sure that [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled on the VMs used on the SAP application layer and the SAP DBMS layer
	11.	No placement of [Azure Network Virtual Appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of an SAP NetWeaver, Hybris, or S/4HANA based SAP systems
	12.	ASG and NSG rules allow communication as desired and planned and block communication where required
	13.	Timeout settings as described earlier have been set correctly
	14.	Make sure that the VMs are deployed using the correct [Azure Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location) as described in the article [Azure Proximity Placement Groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md)
	15.	Test and evaluate the network latency between SAP application layer VM and DBMS VM according to SAP support note [#500235](https://launchpad.support.sap.com/#/notes/500235) and SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). Evaluate the results against network latency guidance of SAP support note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). The network latency should be in the moderate and good range. Exceptions apply to traffic between VMs and HANA Large Instance units as documented [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture#networking-architecture-for-hana-large-instance)
	15.	Check whether encryption got deployed where necessary and with the encryption method necessary
	16.	Check whether interfaces and other applications can connect the newly deployed infrastructure
6.	Create a playbook for reacting to Azure planned maintenance. Define the order of the systems and VMs to be rebooted in case of planned maintenance
 	

## Go Live Phase
For the Go-Live phase, you need to make sure to follow your playbooks you developed in earlier phases. Execute the steps that you tested and trained. Don't accept last-minute changes in configurations and process. Besides that apply the following measures:

1. Verify that Azure portal monitoring and other monitoring tools are working.  Recommended tools are Perfmon (Windows) or SAR (Linux): 
	1.	CPU Counters 
		1.	Average CPU time – Total (all CPU)
		2.	Average CPU time – each individual processor (so 128 processors on m128 VM)
		3.	CPU time kernel – each individual processor
		4.	CPU time user – each individual processor
	5.	Memory 
		1.	Free memory
		2.	Memory Page in/sec
		3.	Memory Page out/sec
	4.	Disk 
		1.	Disk read kb/sec – per individual disk 
		2.	Disk reads/sec  – per individual disk
		3.	Disk read ms/read – per individual disk
		4.	Disk write kb/sec – per individual disk 
		5.	Disk write/sec  – per individual disk
		6.	Disk write ms/read – per individual disk
	5.	Network 
		1.	Network packets in/sec
		2.	Network packets out/sec
		3.	Network kb in/sec
		4.	Network kb out/sec 
2.	After the migration of the data, perform all the validation tests you agreed upon with the business owners. Only accept validation test results where you have results for the original source systems
3.	Check whether interfaces are functioning and whether other applications can communicate with the newly deployed production systems
4.	Check the transport and correction system through SAP transaction STMS
5.	Perform Database backups once the system is released for production
6.	Perform VM backups for the SAP application layer VMs once the system is released for production
7.	For SAP systems that were not part of the current go-live phase, but communicate with the SAP systems that you moved into Azure in this go-live phase, you need to reset the host name buffer in SM51. This step will get rid of the old cached IP addresses associated with the names of the application instances you moved into Azure  


## Post production
In this phase, it is all about monitoring, operating, and administrating the system. From an SAP point of view, the usual tasks that you were required to perform with your old hosting location apply. Azure specific tasks you want to do are:

1. Analyze Azure invoices for high charging systems
2. Optimize price/performance efficiency on VM side and storage side
3. Optimize time systems can be shut down  


## Next Steps
Consult the documentation:

- [Azure Virtual Machines planning and implementation for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide)
- [Azure Virtual Machines deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide)
- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general)

