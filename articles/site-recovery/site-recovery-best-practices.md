<properties
	pageTitle="Best practices for Site Recovery deployment"
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines located on on-premises servers to Azure or a secondary datacenter."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="08/05/2015"
	ms.author="raynew"/>

# Best practices for Site Recovery deployment


<a id="overview" name="overview" href="#overview"></a>

## About this article

The article including best practices that you should read and implement before deploying Azure Site Recovery. If you're looking for an introduction to Site Recovery and related deployment scenarios read the [Site Recovery Overview](site-recovery-overview.md).

If you have any questions after reading this article post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Preparing Azure

- **Azure account**: You'll need an [Microsoft Azure](http://azure.microsoft.com/) account. If you don't have one, start with a [free trial](pricing/free-trial/).
- Read about [pricing](pricing/details/site-recovery/) for the Site Recovery 
- **Azure storage**: If you deploy Site Recovery with replication to Azure you'll need an Azure storage account. You can set one up during deployment or prepare one before you start. The account should have geo-replication enabled. It should be in the same region as the Azure Site Recovery vault and be associated with the same subscription. Read [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md). 

## Virtual machines

If you want to replicate to Azure storage note the following:

- **Supported operating system**: You can deploy Site Recovery to orchestrate protect of virtual machines running any operating system that's supported by Azure. This includes most versions of Windows and Linux.
- **VHDX support**: Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
- **Azure requirements**: Make sure any virtual machines you want to protect conform with Azure requirements.

**Virtual machine feature** | **Support** | **Details**
---|---|---
Host operating system | Windows Server 2012 R2 | Prerequisites check will fail if unsupported
Guest operating system |  <p>Windows Server 2008 R2 or later</p><p>Linux: Centos, openSUSE, SUSE, Ubuntu</p> | Prerequisites check will fail if unsupported. Update the value in the VMM console.
Guest operating system architecture | 64-bit | Prerequisites check will fail if unsupported
Operating system disk size |  Upto 1023 GB | Prerequisites check will fail if unsupported
Operating system disk count | 1 | Prerequisites check will fail if unsupported. Update the value in the VMM console
Data disk count | 16 or less (maximum value is a function of the size of the virtual machine being created. 16 = XL) | Prerequisites check will fail if unsupported
Data disk VHD size | Upto 1023 GB | Prerequisites check will fail if unsupported
Network adapters | Multiple adapters are supported |
Static IP address | Supported | If the primary virtual machine is using a static IP address you can pecify the static IP address for the virtual machine that will be created in Azure
iSCSI disk | Not supported | Prerequisites check will fail if unsupported
Shared VHD | Not supported | Prerequisites check will fail if unsupported
FC disk | Not supported | Prerequisites check will fail if unsupported
Hard disk format| <p>VHD</p><p>VHDX</p> |
Virtual machine name| Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. Should start and end with a letter or number | Update the value in the virtual machine properties in Site Recovery
Virtual machine type | <p>Generation 1</p> <p>Generation 2 - Windows</p> |  Generation 2 virtual machine with OS disk type of Basic Disk which includes 1 or 2 Data volumes with disk format as VHDX which is less than 300GB is supported. Linux Generation 2 virtual machines are not supported. [Read more information](http://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/) 


## VMM servers

Site Recovery can orchestrate replication for virtual machines located on Hyper-V host servers in System Center Virtual Machine Manager (VMM) clouds as follows:
	- Replicate from an on-site VMM server to Azure (using Hyper-V Replica)
	- Replicate to a secondary on-premises site (using Hyper-V Replica). We recommend you deploy with a VMM server in the primary site and one in the secondary site. However if you need to you can [deploy a single VMM server](site-recovery-single-vmm.md) for both sites.
	- Replicate to a secondary on-premises site (using SAN). You'll need a need a primary and secondary datacenter with a VMM server in each site.
If you want to deploy VMM with Site Recovery you'll need to set up your VMM infrastructure. If you don't have a VMM server read more [here](site-recovery-hyper-v-site-to-azure.md).


### Verify VMM version

**Supported VMM version** | **Supported Site Recovery scenario** | **Supported Hyper-V host (source/target)** | **Supported provider/agent**
---|---|---|---
VMM on System Center 2012 R2 with at least Update Rollup 5 (virtual in cluster only) | On-premises to on-premises protection with SAN replication | At least Windows Server 2012 with latest updates | Latest version of Azure Site Recovery Provider (install on VMM servers) |
VMM on System Center 2012 R2 (recommended) (cluster or standalone) | <p>On-premises to on-premises protection with Hyper-V replication</p> <p>On-premises to Azure protection with Hyper-V replication</p> | <p>At least Windows Server 2012 with latest updates</p><p>Windows Server 2012 R2 (source, not applicable for target)</p> | <p>Latest version of Azure Site Recovery Provider (install on VMM servers)</p> <p>Latest version of Azure Recovery Services Agent (install on Hyper-V host servers for replication to Azure only)</p>
VMM on System Center 2012 SP1 with latest cumulative update (cluster or standalone) | On-premises to on-premises protection | Windows Server 2012 with latest updates | Latest version of Azure Site Recovery Provider (install on VMM servers) |

### Set up VMM cloud infrastructure

Whichever VMM scenario you want to deploy with Site Recovery you'll need to create at least two private clouds (one on the source VMM server and one on the target) in VMM to gain the advantages of the private cloud model while defining, managing, and accessing the cloud and its underlying resources using the VMM console. A VMM cloud collects and presents an aggregate set of resources, whose usage is limited by cloud capacity settings and by user role quotas. Self-service users can manage and use a cloud’s resources without fully understanding its underlying infrastructure. Resources can be added easily in order to shrink or grow cloud elasticity. Use the following resources if you need to set up clouds:


- [What’s New in Private Cloud with System Center 2012 R2 VMM](http://channel9.msdn.com/Events/TechEd/NorthAmerica/2013/MDC-B357#fbid=)
- [VMM 2012 and the clouds](http://www.server-log.com/blog/2011/8/26/vmm-2012-and-the-clouds.html).
- [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric)
- [Creating a private cloud in VMM](https://technet.microsoft.com/en-us/library/jj860425.aspx)
- [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://blogs.technet.com/b/keithmayer/archive/2013/04/18/walkthrough-creating-private-clouds-with-system-center-2012-sp1-virtual-machine-manager-build-your-private-cloud-in-a-month.aspx).




## Providers and agents

Providers and agents are installed on on-premises servers so that they can connect to Site Recovery in Azure. They connect over the Internet using an encrypted HTTPS connection.

- **Provider requirements**: During deployment you'll install a couple of components on your on-premises servers:
	- **On VMM servers**: You'll install the Azure Site Recovery Provider on VMM servers you want to register in the vault.
	- **On Hyper-V host servers located in a VMM cloud**: You'll install the Azure Recovery Services agent.
	- **On Hyper-V host servers with no VMM server**: You'll install the Azure Site Recovery Provider and the Azure Recovery Services agent on each Hyper-V host server or cluster node.
-  **Provider installation**: As you install the Provider and agents note that:
	-  You should install the same version of the Provider all servers in a Site Recovery vault. Using different versions within a single vault isn’t supported.
	-  If you want to replicate to Azure from Hyper-V servers located in a VMM cloud the VMM server should be running System Center 2012 R2. If you want to replicate to a secondary datacenter VMM should be running System Center 2012 with SP1 or R2.
- **Proxy**: You don't need to add firewall exceptions or create a specific proxy. If you do want to use a custom proxy for the Provider connection here's what you need to do before you begin deployment:

	- Set up the custom proxy server before installing the Provider.
	- Allow these URLs through the firewall:
		- *.hypervrecoverymanager.windowsazure.com
		- *.accesscontrol.windows.net
		- *.backup.windowsazure.com
		- *.blob.core.windows.net
		- *.store.core.windows.net

	- If you're deploying Site Recovery with VMM and you use a custom proxy, a VMM RunAs account (DRAProxyAccount) will be created automatically using the proxy credentials you specify in the custom proxy settings in the Site Recovery portal. You'll need to set up the proxy server so that this account can authenticate successfully.



## On-premises connectivity

- **Provider connectivity**: Providers and agents are installed on on-premises servers so that they can connect to Site Recovery. They connect to Site Recovery over the Internet using an encrypted HTTPS connection. You don't need to add firewall exceptions or create a specific proxy.
- **Internet connectivity**: You'll need server internet connectivity as follows:
	- If you're protecting virtual machines on Hyper-V host servers in a VMM cloud, only the VMM Server needs an connection to the Internet.
	- If you're protecting virtual machines on Hyper-V host servers without a VMM server, only the Hyper-V host servers need a connection to the Internet.
	- You don't need any internet connectivity from  the virtual machines you want to protect.
- **VPN site-to-site**: You don't need a VPN site-to-site connection to connect to Site Recovery. However if you have a site-to-site connection you're be able to access failed over virtual machines as you did before the failover. Note that when replicating to Azure you'll set up a VPN site-to-site network between your on-premises site and a specific Azure network. It's not used for encrypted replication traffic. They goes over the internet to the Azure storage account in your subscription.
- **Connectivity after failover**: To make sure users can connect to virtual machines after failover to Azure do the following:
	- Enable RDP for the virtual machines before failover.
	- After failover use a site-to-site connection so that you connect to them as you did previously, or enable the RDP endpoint for the machine.

## Storage

- **Azure storage account**: If you're replicating to Azure you'll need an Azure storage account. The account should have geo-replication enabled. It should be in the same region as the Azure Site Recovery vault and be associated with the same subscription. To learn more read [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).
- **Storage mapping**: If you're replicating virtual machines on on-premises VMM servers you can set up storage mapping to make sure that virtual machines are optimally connected to storage after failover. When you replicate between two on-premises VMM sites, by default the replica virtual machine will be stored on the located indicated on the target Hyper-V host server. You can configure mapping between VMM storage classifications on source and target VMM servers. If you want to use this feature make sure you have storage classifications set up before you begin deployment. [Read more](site-recovery-storage-mapping.md) about storage mapping.
- **SAN**: If you want to replicate between two on-premises sites with SAN replication note that:
	- You can only replicate Hyper-V virtual machines to a secondary datacenter using SAN replication. You can't replicate to Azure.
	- You can use your existing SAN environment. You don't need to make any changes on SAN arrays.
	- You'll need to check that your SAN array is [supported](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx).
	- You'll need two VMM servers in the source and target sites for SAN deployment.
	- Make sure your Hyper-V host clusters are running Windows Server 2012 or 2012 R2 if you want to deploy SAN replication. [Read about](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx) guest operating systems supported by different versions of Hyper-V.
	- You'll need to discover and classify SAN storage in VMM,
	- If you not already replicating, after discovery you'll need to create LUNs and allocate storage in the VMM console. If you're already replicating you can skip this step.
	- Full instructions are available in this [article](site-recovery-vmm-san.md).


## Networks

- **Learn about networking considerations**: [Read more](http://azure.microsoft.com/blog/2014/09/04/networking-infrastructure-setup-for-microsoft-azure-as-a-disaster-recovery-site/) about networking considerations and best practices.

- **Set up network mapping**: Network mapping is an important element when you deploy VMM and Site Recovery. It optimally places replicated virtual machines on target Hyper-V host servers, and ensures your replicated virtual machines are connected to appropriate networks after failover. You can configure network mapping when you're replicating to Azure or to a secondary datacenter:
	- **Network mapping to Azure**: If you're replicating to Azure network mapping ensures that all machines that fail over on the same network can connect to each other, irrespective of which recovery plan they are in. In addition if a network gateway is configure on the target Azure network virtual machines can connect to other on-premises virtual machines. If you don't set up network mapping only machines that fail over in the same recovery plan can connect.
	- **Network mapping to secondary site**: If you're replicating to a secondary VMM site network mapping ensures that virtual machines are connected to appropriate networks after failover and that replica virtual machines are optimally placed on Hyper-V host servers. If you don't configure network mapping replicated machines won't be connected to any VM network.
	- [Read more](site-recovery-network-mapping) about network mapping.
- **Set up VMM networks**:
	- Configure logical and VM networks correctly in VMM. Read about [logical networks](http://blogs.technet.com/b/scvmm/archive/2013/02/14/networking-in-vmm-2012-sp1-logical-networks-part-i.aspx) and [VM networks](https://technet.microsoft.com/library/jj721575.aspx).
	- Make sure that all virtual machines on the source VMM server are connected to a VM network.
	- Check that VM networks are linked to a logical network associated with the cloud.
	- If you're replicating to Azure create virtual networks in Azure. Note that multiple VM networks can be mapped to a single Azure network. Read [Virtual network configuration tasks](../vpn-gateway/vpn-gateway-site-to-site-create.md).

## Optimizing performance

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 32 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~32 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: For guidance use the [Capacity Planner for Hyper-V Replica](http://www.microsoft.com/en-in/download/details.aspx?id=39057).
- **Replication bandwidth**: If you're short on replication bandwidth note that:
	- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed. [Read more](http://blogs.technet.com/b/virtualization/archive/2014/07/20/expressroute-and-azure-site-recovery.aspx) about ExpressRoute.
	- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
	- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition if you're replicating to Azure Site Recovery using the Azure Backup agent. You can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: If you want to measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwith between your datacenter and Azure.

## Failing over
- **Outage on primary**: If you're replicating from one on-premises datacenter to another and both datacenters experience an outage on your primary site, run an unplanned failover from the Site Recovery portal. Connectivity from the primary datacenter isn't needed to run the failover.
- **Retain IP address after failover to secondary site**: If you want to retain the IP address of a source virtual machine after it fails over to a secondary datacenter, follow the steps [here](http://blogs.technet.com/b/scvmm/archive/2014/04/04/retaining-ip-address-after-failover-using-hyper-v-recovery-manager.aspx).
- **Retain IP address after failover to Azure**: You can specify the IP to be given to failed over VM in Configure tab of the virtual machine. For details look at how to [configure network properties of the virtual machine](site-recovery-vmm-to-azure.md#step-8-enable-protection-for-virtual-machines)
- **Retain public IP address**: If you want to retain a public IP address after failover to a secondary site Site Recovery doesn't prevent you from doing that if your ISP supports it. You can't retain a public IP address after failover to Azure.
- **Retain non-RFC internal addresses in Azure**: You can retain non-RFC 1918 address spacees after failover to Azure.
- **Partial failover to secondary datacenter**: If you fail over a partial site to your secondary datacenter and want to connect back to the primary site, you can use site-to-site VPN to connect a failed over application on the secondary site to infrastructure components running on the primary site. Note that if the entire subnet fails over you can retain the virtual machine IP address. If you fail over a partial subnet you can't retain the virtual machine IP address because subnets can't be split between sites.
- **Partial failover to Azure**: If you fail over a partial site to Azure and want to connect back to the primary site, you can use a site-to-site VPN to connect a failed over application in Azure to infrastructure components running on the primary site. Note that if the entire subnet fails over you can retain the virtual machine IP address. If you fail over a partial subnet you can't retain the virtual machine IP address because subnets can't be split between sites.
- **Retain drive letter**: If you want to retain drive letter on virtual machines after failover you can set the SAN policy for the virtual machine to **On**.  [Read more](https://support.microsoft.com/kb/3031135).
- **Routing client requests after failover to Azure**: Site Recovery works with Azure Traffic Manager to route client requests to your application after failover. You can use scripts in recovery plans (with Azure Automation) to perform DNS updates.

## Integration

- **Integration with other BCDR technologies**: Site Recovery integrates with other business continuity and disaster recovery (BCDR) technologies. For application-based replication we recommend you use SQL Sever AlwaysOn to replicate virtual machines running the database, and Hyper-V Replica for front-end virtual machines. AlwaysOn requires SQL Server Enterprise licenses in your primary and secondary site, and a running Azure virtual machine in your subscription. sing Site Recovery in-built replication is useful where applications can handle some downtime and in this case we recommend Site Recovery to orchestrate replication of database, application, and front-end virtual machines. This approach saves money on the SQL Server version you'll need, the number of licenses, and the cost of keeping virtual machines running in Azure at all times.

## Next steps

After reviewing these best practices you can start deploying Site Recovery:

- [Set up protection between an on-premises VMM site and Azure](site-recovery-vmm-to-azure.md)
- [Set up protection between an on-premises Hyper-V site and Azure](site-recovery-hyper-v-site-to-azure.md)
- [Set up protection between two on-premises VMM sites](site-recovery-vmm-to-vmm.md)
- [Set up protection between two on-premises VMM sites with SAN](site-recovery-vmm-san.md)
- [Set up protection with a single VMM server](site-recovery-single-vmm.md)
 
