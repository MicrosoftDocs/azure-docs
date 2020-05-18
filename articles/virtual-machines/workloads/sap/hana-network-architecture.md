---
title: Network architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Network architecture of how to deploy SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: msjuergent
manager: bburns
editor: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/15/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---
# SAP HANA (Large Instances) network architecture

The architecture of Azure network services is a key component of the successful deployment of SAP applications on HANA Large Instance. Typically, SAP HANA on Azure (Large Instances) deployments have a larger SAP landscape with several different SAP solutions with varying sizes of databases, CPU resource consumption, and memory utilization. It's likely that not all IT systems are located in Azure already. Your SAP landscape is often hybrid as well from a DBMS point and SAP application point of view using a mixture of NetWeaver, and S/4HANA and SAP HANA and other DBMS. Azure offers different services that allow you to run the different DBMS, NetWeaver, and S/4HANA systems in Azure. Azure also offers you network technology to make Azure look like a virtual data center to your on-premises software deployments

Unless your complete IT systems are hosted in Azure. Azure networking functionality is used to connect the on-premises world with your Azure assets to make Azure look like a virtual datacenter of yours. The Azure network functionality used is: 

- Azure virtual networks are connected to the [ExpressRoute](https://azure.microsoft.com/services/expressroute/) circuit that connects to your on-premises network assets.
- An ExpressRoute circuit that connects on-premises to Azure should have a minimum bandwidth of [1 Gbps or higher](https://azure.microsoft.com/pricing/details/expressroute/). This minimal bandwidth allows adequate bandwidth for the transfer of data between on-premises systems and systems that run on VMs. It also allows adequate bandwidth for connection to Azure systems from on-premises users.
- All SAP systems in Azure are set up in virtual networks to communicate with each other.
- Active Directory and DNS hosted on-premises are extended into Azure through ExpressRoute from on-premises, or are running complete in Azure.

For the specific case of integrating HANA Large Instances into the Azure data center network fabric, Azure ExpressRoute technology is used as well


> [!NOTE] 
> Only one Azure subscription can be linked to only one tenant in a HANA Large Instance stamp in a specific Azure region. Conversely, a single HANA Large Instance stamp tenant can be linked to only one Azure subscription. This requirement is consistent with other billable objects in Azure.

If SAP HANA on Azure (Large Instances) is deployed in multiple different Azure regions, a separate tenant is deployed in the HANA Large Instance stamp. You can run both under the same Azure subscription as long as these instances are part of the same SAP landscape. 

> [!IMPORTANT] 
> Only the Azure Resource Manager deployment method is supported with SAP HANA on Azure (Large Instances).

 

## Additional virtual network information

To connect a virtual network to ExpressRoute, an Azure ExpressRoute gateway must be created. For more information, see [About Expressroute gateways for ExpressRoute](../../../expressroute/expressroute-about-virtual-network-gateways.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

An Azure ExpressRoute gateway is used with ExpressRoute to an infrastructure outside of Azure or to an Azure Large Instance stamp. You can connect the Azure ExpressRoute gateway to a maximum of four different ExpressRoute circuits as long as those connections come from different Microsoft enterprise edge routers. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

> [!NOTE] 
> The maximum throughput you can achieve with a ExpressRoute gateway is 10 Gbps by using an ExpressRoute connection. Copying files between a VM that resides in a virtual network and a system on-premises (as a single copy stream) doesn't achieve the full throughput of the different gateway SKUs. To leverage the complete bandwidth of the ExpressRoute gateway, use multiple streams. Or you must copy different files in parallel streams of a single file.


## Networking architecture for HANA Large Instance
The networking architecture for HANA Large Instance can be separated into four different parts:

- On-premises networking and ExpressRoute connection to Azure. This part is the customer's domain and is connected to Azure through ExpressRoute. This Expressroute circuit is fully paid by you as a customer. The bandwidth should be large enough to handle the network traffic between your on-premises assets and the Azure region you are connecting against. See the lower right in the following figure.
- Azure network services, as previously discussed, with virtual networks, which again need ExpressRoute gateways added. This part is an area where you need to find the appropriate designs for your application requirements, security, and compliance requirements. Whether you use HANA Large Instance is another point to consider in terms of the number of virtual networks and Azure gateway SKUs to choose from. See the upper right in the figure.
- Connectivity of HANA Large Instance through ExpressRoute technology into Azure. This part is deployed and handled by Microsoft. All you need to do is provide some IP address ranges after the deployment of your assets in HANA Large Instance connect the ExpressRoute circuit to the virtual networks. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). There is no additional fee for you as a customer for the connectivity between the Azure data center network fabric and HANA Large Instance units.
- Networking within the HANA Large Instance stamp, which is mostly transparent for you.

![Virtual network connected to SAP HANA on Azure (Large Instances) and on-premises](./media/hana-overview-architecture/image1-architecture.png)

The requirement that your on-premises assets must connect through ExpressRoute to Azure doesn't change because you use HANA Large Instance. The requirement to have one or multiple virtual networks that run the VMs, which host the application layer that connects to the HANA instances hosted in HANA Large Instance units, also doesn't change. 

The differences to SAP deployments in Azure are:

- The HANA Large Instance units of your customer tenant are connected through another ExpressRoute circuit into your virtual networks. To separate load conditions, the on-premises to Azure virtual network ExpressRoute circuits and the circuits between Azure virtual networks and HANA Large Instances don't share the same routers.
- The workload profile between the SAP application layer and the HANA Large Instance is of a different nature, with many small requests and bursts like data transfers (result sets) from SAP HANA into the application layer.
- The SAP application architecture is more sensitive to network latency than typical scenarios where data is exchanged between on-premises and Azure.
- The Azure ExpressRoute gateway has at least two ExpressRoute connections. One circuit that is connected from on-premises and one that is connected from HANA Large Instances. This leaves only room for another two additional circuits from different MSEEs to connect to on ExpressRoute Gateway. This restriction is independent of the usage of ExpressRoute Fast Path. All the connected circuits share the maximum bandwidth for incoming data of the ExpressRoute gateway.

With Revision 3 of HANA Large Instance stamps, the network latency experienced between VMs and HANA Large Instance units can be higher than a typical VM-to-VM network round-trip latency. Dependent on the Azure region, the values measured can exceed the 0.7-ms round-trip latency classified as below average in [SAP Note #1100926 - FAQ: Network performance](https://launchpad.support.sap.com/#/notes/1100926/E). Dependent on Azure Region and tool to measure network round-trip latency between an Azure VM and HANA Large Instance unit, the measured latency can be up to and around 2 milliseconds. Nevertheless, customers deploy SAP HANA-based production SAP applications successfully on SAP HANA Large Instance. Make sure you test your business processes thoroughly in Azure HANA Large Instance. A new functionality, called ExpressRoute Fast Path, is able to reduce the network latency between HANA Large Instances and application layer VMs in Azure substantially (see below). 

With Revision 4 of HANA Large Instance stamps, the network latency between Azure VMs that are deployed in proximity to the HANA Large Instance stamp, is experienced to meet the average or better than average classification as documented in [SAP Note #1100926 - FAQ: Network performance](https://launchpad.support.sap.com/#/notes/1100926/E) if Azure ExpressRoute Fast Path is configured (see below). In order to deploy Azure VMs in close proximity to HANA Large Instance units of Revision 4, you need to leverage [Azure Proximity Placement Groups](https://docs.microsoft.com/azure/virtual-machines/linux/co-location). The way how proximity placement groups can be used to locate the SAP application layer in the same Azure datacenter as Revision 4 hosted HANA Large Instance units is described in [Azure Proximity Placement Groups for optimal network latency with SAP applications](sap-proximity-placement-scenarios.md).

To provide deterministic network latency between VMs and HANA Large Instance, the choice of the ExpressRoute gateway SKU is essential. Unlike the traffic patterns between on-premises and VMs, the traffic pattern between VMs and HANA Large Instance can develop small but high bursts of requests and data volumes to be transmitted. To handle such bursts well, we highly recommend the use of the UltraPerformance gateway SKU. For the Type II class of HANA Large Instance SKUs, the use of the UltraPerformance gateway SKU as a ExpressRoute gateway is mandatory.

> [!IMPORTANT] 
> Given the overall network traffic between the SAP application and database layers, only the HighPerformance or UltraPerformance gateway SKUs for virtual networks are supported for connecting to SAP HANA on Azure (Large Instances). For HANA Large Instance Type II SKUs, only the UltraPerformance gateway SKU is supported as a ExpressRoute gateway. Exceptions apply when using ExpressRoute Fast Path (see below)

### ExpressRoute Fast Path
To lower the latency, ExpressRoute Fast Path got introduced and released in May 2019 for the specific connectivity of HANA Large Instances to Azure virtual networks that host the SAP application VMs. The major difference to the solution rolled out so far, is, that the data flows between VMs and HANA Large Instances are not routed through the ExpressRoute gateway anymore. Instead the VMs assigned in the subnet(s) of the Azure virtual network are directly communicating with the dedicated enterprise edge router. 

> [!IMPORTANT] 
> The ExpressRoute Fast Path functionality requires that the subnets running the SAP application VMs are in the same Azure virtual network that got connected to the HANA Large Instances. VMs located in Azure virtual networks that are peered with the Azure virtual network connected directly to the HANA Large Instance units are not benefiting from ExpressRoute Fast Path. As a result typical hub and spoke virtual network designs, where the ExpressRoute circuits are connecting against a hub virtual network and virtual networks containing the SAP application layer (spokes) are getting peered, the optimization by ExpressRoute Fast Path will not work. In addtion, ExpressRoute Fast Path does not support user defined routing rules (UDR) today. For more information, see [ExpressRoute virtual network gateway and FastPath](https://docs.microsoft.com/azure/expressroute/expressroute-about-virtual-network-gateways). 


For more details on how to configure ExpressRoute Fast Path, read the document [Connect a virtual network to HANA large instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-connect-vnet-express-route).    

> [!NOTE]
> An UltraPerformance ExpressRoute gateway is required to have ExpressRoute Fast Path working


## Single SAP system

The on-premises infrastructure previously shown is connected through ExpressRoute into Azure. The ExpressRoute circuit connects into a Microsoft enterprise edge router (MSEE). For more information, see [ExpressRoute technical overview](../../../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). After the route is established, it connects into the Azure backbone.

> [!NOTE] 
> To run SAP landscapes in Azure, connect to the enterprise edge router closest to the Azure region in the SAP landscape. HANA Large Instance stamps are connected through dedicated enterprise edge router devices to minimize network latency between VMs in Azure IaaS and HANA Large Instance stamps.

The ExpressRoute gateway for the VMs that host SAP application instances are connected to one ExpressRoute circuit that connects to on-premises. The same virtual network is connected to a separate enterprise edge router dedicated to connecting to Large Instance stamps. Using ExpressRoute Fast Path, the data flow from HANA Large Instances to the SAP application layer VMs are not routed through the ExpressRoute gateway anymore and with that reduce the network round-trip latency.

This system is a straightforward example of a single SAP system. The SAP application layer is hosted in Azure. The SAP HANA database runs on SAP HANA on Azure (Large Instances). The assumption is that the ExpressRoute gateway bandwidth of 2-Gbps or 10-Gbps throughput doesn't represent a bottleneck.

## Multiple SAP systems or large SAP systems

If multiple SAP systems or large SAP systems are deployed to connect to SAP HANA on Azure (Large Instances), the throughput of the ExpressRoute gateway might become a bottleneck. Or you want to isolate production and non-production systems in different Azure virtual networks. In such a case, split the application layers into multiple virtual networks. You also might create a special virtual network that connects to HANA Large Instance for cases such as:

- Performing backups directly from the HANA instances in HANA Large Instance to a VM in Azure that hosts NFS shares.
- Copying large backups or other files from HANA Large Instance units to disk space managed in Azure.

Use a separate virtual network to host VMs that manage storage for mass transfer of data between HANA Large Instances and Azure. This arrangement avoids the effects of large file or data transfer from HANA Large Instance to Azure on the ExpressRoute gateway that serves the VMs that run the SAP application layer. 

For a more scalable network architecture:

- Leverage multiple virtual networks for a single, larger SAP application layer.
- Deploy one separate virtual network for each SAP system deployed, compared to combining these SAP systems in separate subnets under the same virtual network.

  A more scalable networking architecture for SAP HANA on Azure (Large Instances):

![Deploy SAP application layer over multiple virtual networks](./media/hana-overview-architecture/image4-networking-architecture.png)

Dependent on the rules and restrictions, you want to apply between the different virtual networks hosting VMs of different SAP systems, you should peer those virtual networks. For more information about virtual network peering, see [Virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview).


## Routing in Azure

By default deployment, three network routing considerations are important for SAP HANA on Azure (Large Instances):

* SAP HANA on Azure (Large Instances) can be accessed only through Azure VMs and the dedicated ExpressRoute connection, not directly from on-premises. Direct access from on-premises to the HANA Large Instance units, as delivered by Microsoft to you, isn't possible immediately. The transitive routing restrictions are due to the current Azure network architecture used for SAP HANA Large Instance. Some administration clients and any applications that need direct access, such as SAP Solution Manager running on-premises, can't connect to the SAP HANA database. For exceptions check the section 'Direct Routing to HANA Large Instances'.

* If you have HANA Large Instance units deployed in two different Azure regions for disaster recovery, the same transient routing restrictions applied in the past. In other words, IP addresses of a HANA Large Instance unit in one region (for example, US West) were not routed to a HANA Large Instance unit deployed in another region (for example, US East). This restriction was independent of the use of Azure network peering across regions or cross-connecting the ExpressRoute circuits that connect HANA Large Instance units to virtual networks. For a graphic representation, see the figure in the section "Use HANA Large Instance units in multiple regions." This restriction, which came with the deployed architecture, prohibited the immediate use of HANA System Replication as disaster recovery functionality. For recent changes, look up the section 'Use HANA Large Instance units in multiple regions'. 

* SAP HANA on Azure (Large Instances) units have an assigned IP address from the server IP pool address range that you submitted when requesting the HANA Large Instance deployment. For more information, see [SAP HANA (Large Instances) infrastructure and connectivity on Azure](hana-overview-infrastructure-connectivity.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). This IP address is accessible through the Azure subscriptions and circuit  that connects Azure virtual networks to HANA Large Instances. The IP address assigned out of that server IP pool address range is directly assigned to the hardware unit. It's *not* assigned through NAT anymore, as was the case in the first deployments of this solution. 

### Direct Routing to HANA Large Instances

By default, the transitive routing does not work in these scenarios:

* Between HANA Large Instance units and an on-premises deployment.

* Between HANA Large Instance routing that are deployed in two different regions.

There are three ways to enable transitive routing in those scenarios:

- A reverse-proxy to route data, to and from. For example, F5 BIG-IP, NGINX with Traffic Manager deployed in the Azure virtual network that connects to HANA Large Instances and to on-premises as a virtual firewall/traffic routing solution.
- Using [IPTables rules](http://www.linuxhomenetworking.com/wiki/index.php/Quick_HOWTO_%3a_Ch14_%3a_Linux_Firewalls_Using_iptables#.Wkv6tI3rtaQ) in a Linux VM to enable routing between on-premises locations and HANA Large Instance units, or between HANA Large Instance units in different regions. The VM running IPTables needs to be deployed in the Azure virtual network that connects to HANA Large Instances and to on-premises. The VM needs to be sized accordingly, so, that the network throughput of the VM is sufficient for the expected network traffic. For details on VM network bandwidth, check the article [Sizes of Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json).
- [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/) would be another solution to enable direct traffic between on-premises and HANA Large instance units. 

All the traffic of these solutions would be routed through an Azure virtual network and as such the traffic could be additionally restricted by the soft appliances used or by Azure Network Security Groups, so, that certain IP addresses or IP address ranges from on-premises could be blocked or explicitly allowed accessing HANA Large Instances. 

> [!NOTE]  
> Be aware that implementation and support for custom solutions involving third-party network appliances or IPTables isn't provided by Microsoft. Support must be provided by the vendor of the component used or the integrator. 

#### Express Route Global Reach
Microsoft introduced a new functionality called [ExpressRoute Global Reach](https://docs.microsoft.com/azure/expressroute/expressroute-global-reach). Global Reach can be used for HANA Large Instances in two scenarios:

- Enable direct access from on-premises to your HANA Large Instance units deployed in different regions
- Enable direct communication between your HANA Large Instance units deployed in different regions


##### Direct Access from on-premises
In the Azure regions where Global Reach is offered, you can request enabling the Global Reach functionality for your ExpressRoute circuit that connects your on-premises network to the Azure virtual network that connects to your HANA Large Instance units as well. There are some cost implications for the on-premises side of your ExpressRoute circuit. For prices, check the prices for [Global Reach Add-On](https://azure.microsoft.com/pricing/details/expressroute/). There are no additional costs for you related to the circuit that connects the HANA Large Instance unit(s) to Azure. 

> [!IMPORTANT]  
> In case of using Global Reach for enabling direct access between your HANA Large Instance units and on-premises assets, the network data and control flow is **not routed through Azure virtual networks**, but directly between the Microsoft enterprise exchange routers. As a result any NSG or ASG rules, or any type of firewall, NVA, or proxy you deployed in an Azure virtual network, are not getting touched. **If you use ExpressRoute Global Reach to enable direct access from on-premises to HANA Large instance units restrictions and permissions to access HANA large Instance units need to be defined in firewalls on the on-premises side** 

##### Connecting HANA Large Instances in different Azure regions
In the same way, as ExpressRoute Global Reach can be used for connecting on-premises to HANA Large Instance units, it can be used to connect two HANA Large Instance tenants that are deployed for you in two different regions. The isolation is the ExpressRoute circuits that your HANA Large Instance tenants are using to connect to Azure in both regions. There are no additional charges for connecting two HANA Large Instance tenants that are deployed in two different regions. 

> [!IMPORTANT]  
> The data flow and control flow of the network traffic between the different HANA Large instance tenants will not be routed through azure networks. As a result you can't use Azure functionality or NVAs to enforce communication restrictions between your two HANA Large Instances tenants. 

For more details on how to get ExpressRoute Global Reach enabled, read the document [Connect a virtual network to HANA large instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-connect-vnet-express-route).


## Internet connectivity of HANA Large Instance
HANA Large Instance does *not* have direct internet connectivity. As an example, this limitation might restrict your ability to register the OS image directly with the OS vendor. You might need to work with your local SUSE Linux Enterprise Server Subscription Management Tool server or Red Hat Enterprise Linux Subscription Manager.

## Data encryption between VMs and HANA Large Instance
Data transferred between HANA Large Instance and VMs is not encrypted. However, purely for the exchange between the HANA DBMS side and JDBC/ODBC-based applications, you can enable encryption of traffic. For more information, see [this documentation by SAP](https://help.sap.com/viewer/102d9916bf77407ea3942fef93a47da8/1.0.11/en-US/dbd3d887bb571014bf05ca887f897b99.html).

## Use HANA Large Instance units in multiple regions

To realize disaster recovery set ups, you need to have SHANA Large Instance units in multiple Azure regions. Even with using Azure [Global Vnet Peering], the transitive routing by default is not working between HANA Large Instance tenants in two different regions. However, Global Reach opens up the communication path between the HANA Large Instance units you have provisioned in two different regions. This usage scenario of ExpressRoute Global Reach enables:

 - HANA System Replication without any additional proxies or firewalls
 - Copying backups between HANA Large Instance units in two different regions to perform system copies or system refreshes


![Virtual network connected to Azure Large Instance stamps in different Azure regions](./media/hana-overview-architecture/image8-multiple-regions.png)

The figure shows how the different virtual networks in both regions are connected to two different ExpressRoute circuits that are used to connect to SAP HANA on Azure (Large Instances) in both Azure regions (grey lines). Reason for this two cross connections is to protect from an outage of the MSEEs on either side. The communication flow between the two virtual networks in the two Azure regions is supposed to be handled over the [global peering](https://blogs.msdn.microsoft.com/azureedu/2018/04/24/how-to-setup-global-vnet-peering-in-azure/) of the two virtual networks in the two different regions (blue dotted line). The thick red line describes the ExpressRoute Global Reach connection, which allows the HANA Large Instance units of your tenants in two different regions to communicate with each other. 

> [!IMPORTANT] 
> If you used multiple ExpressRoute circuits, AS Path prepending and Local Preference BGP settings should be used to ensure proper routing of traffic.

**Next steps**
- Refer [SAP HANA (Large Instances) storage architecture](hana-storage-architecture.md)
