---
title: Running Windows VMs for an N-tier architecture | Microsoft Docs
description: How to implement a multi-tier architecture on Azure, paying particular attention to availability, security, scalability, and manageability security.
services: ''
documentationcenter: na
author: MikeWasson
manager: christb
editor: ''
tags: ''

ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/20/2016
ms.author: mwasson

---
# Running Windows VMs for an N-tier architecture on Azure
> [!INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]
> 
> [!div class="op_single_selector"]
> * [Running Linux VMs for an N-tier architecture on Azure](guidance-compute-n-tier-vm-linux.md)
> * [Running Windows VMs for an N-tier architecture on Azure](guidance-compute-n-tier-vm.md)
> 
> 

This article outlines a set of proven practices for running Windows virtual machines (VMs) for an application with an N-tier architecture. It builds on the article [Running multiple VMs on Azure][multi-vm].

> [!NOTE]
> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

## Architecture diagram
There are variations of N-tier architectures. For the most part, the differences shouldn't matter for the purposes of these recommendations. This article assumes a typical 3-tier web app:

* **Web tier.** Handles incoming HTTP requests. Responses are returned through this tier.
* **Business tier.** Implements business processes and other functional logic for the system.
* **Database tier.** Provides persistent data storage, using [SQL Server Always On Availability Groups][sql-alwayson] for high availability.

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Compute - multi tier (Windows) page.
> 
> 

![[0]][0]

* **Availability Sets.** Create an [Availability Set][azure-availability-sets] for each tier, and provision at least two VMs in each tier. This approach is required to reach the availability [SLA][vm-sla] for VMs.
* **Subnets.** Create a separate subnet for each tier. Specify the address range and subnet mask using [CIDR] notation. 
* **Load balancers.** Use an [Internet-facing load balancer][load-balancer-external] to distribute incoming Internet traffic to the web tier, and an [internal load balancer][load-balancer-internal] to distribute network traffic from the web tier to the business tier.
* **Jumpbox**. A *jumpbox*, also called a [bastion host], is a VM on the network that administrators use to connect to the other VMs. The jumpbox has an NSG that allows remote traffic only from whitelisted public IP addresses. The NSG should permit remote desktop (RDP) traffic.
* **Monitoring**. Monitoring software such as [Nagios], [Zabbix], or [Icinga] can give you insight into response time, VM uptime, and the overall health of your system. Install the monitoring software on a VM that's placed in a separate management subnet.
* **NSGs**. Use [network security groups][nsg] (NSGs) to restrict network traffic within the VNet. For example, in the 3-tier architecture shown here, the database tier does not accept traffic from the web front end, only from the business tier and the management subnet.
* **SQL Server Always On Availability Group.** Provides high availability at the data tier, by enabling replication and failover.
* **Active Directory Domain Services (AD DS) Servers**. Active Directory Domain Services (AD DS) stores directory data and manages communication between users and domains, including user logon processes, authentication, and directory searches. An Active Directory domain controller is a server that is running AD DS. Prior to Windows Server 2016, Always On Availability Groups must be joined to a domain. This is because Availability Groups depend on Windows Server Failover Cluster (WSFC) technology. Windows Server 2016 introduces the ability to create a Failover Cluster without Active Directory. For more information, see [What's new in Failover Clustering in Windows Server 2016][wsfc-whats-new]

## Recommendations
Azure offers many different resources and resource types, so this reference architecture can be provisioned many different ways. We have provided an Azure Resource Manager template to install the reference architecture that follows these recommendations. If you choose to create your own reference architecture follow these recommendations unless you have a specific requirement that a recommendation does not fit.

### VNet / Subnets
When you create the VNet, allocate enough address space for the subnets you will need. Specify the VNet address range and subnet mask using [CIDR] notation. Use an address space that falls within the standard [private IP address blocks][private-ip-space], which are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.

Choose an address range that does not overlap with your on-premise network, in case you need to set up a gateway between the VNet and your on-premise network later. Once you create the VNet, you can't change the address range.

Design subnets with functionality and security requirements in mind. All VMs within the same tier or role should go into the same subnet, which can be a security boundary. For more information about designing VNets and subnets, see [Plan and design Azure Virtual Networks][plan-network].

For each subnet, specify the address space for the subnet in CIDR notation. For example, '10.0.0.0/24' creates a range of 256 IP addresses. (VMs can use 251 of these; five are reserved. See the [Virtual Network FAQ][vnet faq].) Make sure the address ranges don't overlap across subnets.

### Network Security Groups
Use NSG rules to restrict traffic between tiers. For example, in the 3-tier architecture shown above, the web tier does not communicate directly with the database tier. To enforce this, the database tier should block incoming traffic from the web tier subnet.  

1. Create an NSG and associate it to the database tier subnet.
2. Add a rule that denies all inbound traffic from the VNet. (Use the `VIRTUAL_NETWORK` tag in the rule.) 
3. Add a rule with a higher priority that allows inbound traffic from the business tier subnet. This rule overrides the previous rule, and allows the business tier to talk to the database tier.
4. Add a rule that allows inbound traffic from within the database tier subnet itself. This rule allows communication between VMs in the database tier, which is needed for database replication and failover.
5. Add a rule that allows RDP traffic from the jumpbox subnet. This rule lets administrators connect to the database tier from the jumpbox.
   
   > [!NOTE]
   > An NSG has [default rules][nsg-rules] that allow any inbound traffic from within the VNet. These rules can't be deleted, but you can override them by creating higher-priority rules.
   > 
   > 

### Load balancers
The external load balancer distributes Internet traffic to the web tier. Create a public IP address for this load balancer. See [Creating an Internet-facing load balancer][lb-external-create].

The internal load balancer distributes network traffic from the web tier to the business tier. To give this load balancer a private IP address, create a frontend IP configuration and associate it with the subnet for the business tier. See [Get started creating an Internal load balancer][lb-internal-create].

### SQL Server Always On Availability Groups
We recommend [Always On Availability Groups][sql-alwayson] for SQL Server high availability. Always On Availability Groups require a domain controller. All nodes in the Availability Group must be in the same AD domain.

Other tiers connect to the database through an [availability group listener][sql-alwayson-listeners]. The listener enables a SQL client to connect without knowing the name of the physical instance of SQL Server. VMs that access the database must be joined to the domain. The client (in this case, another tier) uses DNS to resolve the listener's virtual network name into IP addresses.

Configure SQL Server Always On as follows:

* Create a Windows Server Failover Clustering (WSFC) cluster and a SQL Server Always On availability group. For more information, see [Getting Started with Always On Availability Groups][sql-alwayson-getting-started].
* Create an internal load balancer with a static private IP address.
* Create an availability group listener, and map the listener's DNS name to the IP address of an internal load balancer. 
* Create a load balancer rule for the SQL Server listening port (TCP port 1433 by default). The load balancer rule must enable *floating IP*, also called Direct Server Return. This causes the VM to reply directly to the client, which enables a direct connection to the primary replica.
  
  > [!NOTE]
  > When floating IP is enabled, the front-end port number must be the same as the back-end port number in the load balancer rule.
  > 
  > 

When a SQL client tries to connect, the load balancer routes the connection request to the replica that is the current primary. If there is a failover to another replica, the load balancer automatically routes subsequent requests to the new primary replica. For more information, see [Configure load balancer for SQL always on][sql-alwayson-ilb].

During a failover, existing client connections are closed. After the failover completes, new connections will be routed to the new primary replica.

If your app makes significantly more reads than writes, you can offload some of the read-only queries to a secondary replica. See [Using a Listener to Connect to a Read-Only Secondary Replica (Read-Only Routing)][sql-alwayson-read-only-routing].

Test your deployment by [forcing a manual failover][sql-alwayson-force-failover].

### Jumpbox
Do not allow RDP access from the public Internet to the VMs that run the application workload. Instead, all RDP/SSH access to these VMs must come through the jumpbox. An administrator logs into the jumpbox, and then logs into the other VM from the jumpbox. The jumpbox allows RDP traffic from the Internet, but only from known, whitelisted IP addresses.

Place the jumpbox in the same VNet as the other VMs, but in a separate management subnet.

Create a [public IP address] for the jumpbox.

Use a small VM size for the jumpbox, such as Standard A1.

Configure the NSGs for the web tier, business tier, and database tier subnets to allow administrative (RDP) traffic to pass through from the management subnet.

To secure the jumpbox, create an NSG and apply it to the jumpbox subnet. Add an NSG rule that allows RDP connections only from a whitelisted set of public IP addresses.

The NSG can be attached either to the subnet or to the jumpbox NIC. In this case, we recommend attaching it to the NIC, so RDP traffic is permitted only to the jumpbox, even if you add other VMs to the same subnet.

## Availability considerations
Put each tier or VM role into a separate availability set. Don't put VMs from different tiers into the same availability set. 

At the database tier, having multiple VMs does not automatically translate into a highly available database. For a relational database, you will typically need to use replication and failover to achieve high availability. For SQL Server, we recommend using [Always On Availability Groups][sql-alwayson]. 

If you need higher availability than the [Azure SLA for VMs][vm-sla] provides, replicate the application across two regions and use Azure Traffic Manager for failover. For more information, see [Running Windows VMs in multiple regions for high availability][multi-dc].   

## Security considerations
Encrypt data at rest. Use [Azure Key Vault][azure-key-vault] to manage the database encryption keys. Key Vault can store encryption keys in hardware security modules (HSMs). For more information, see [Configure Azure Key Vault Integration for SQL Server on Azure VMs][sql-keyvault] It's also recommended to store application secrets, such as database connection strings, in Key Vault.

Consider adding a network virtual appliance (NVA) to create a DMZ between the public Internet and the Azure virtual network. NVA is a generic term for a virtual appliance that can perform network-related tasks such as firewall, packet inspection, auditing, custom routing, or a variety of other operations. For more information, see [Implementing a DMZ between Azure and the Internet][dmz].

## Scalability considerations
The load balancers distribute network traffic to the web and business tiers. Scale horizontally by adding new VM instances. Note that you can scale the web and business tiers independently, based on load. To reduce possible complications caused by the need to maintain client affinity, the VMs in the web tier should be stateless. The VMs hosting the business logic should also be stateless.

## Manageability considerations
Simplify management of the entire system by using centralized administration tools such as [Azure Automation][azure-administration], [Microsoft Operations Management Suite][operations-management-suite], [Chef][chef], or [Puppet][puppet]. These tools can consolidate diagnostic and health information captured from multiple VMs to provide an overall view of the system.

## Solution deployment
A deployment for a reference architecture that implements these recommendations is available on [Github][github-folder]. This reference architecture includes a web tier, business tier, a data tier, as well as a jumpbox VM and Active Directory domain controllers.

The reference architecture can be deployed by following the directions below: 

1. Click the button below.  
   [!["Deploy To Azure"][1]][2]
2. Once the link has opened in the Azure portal, enter the follow values: 
   
   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-ntier-sql-network-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click on the **Purchase** button.
3. Check Azure portal notification for a message the deployment is complete.
4. Click the button below.  
   [!["Deploy To Azure"][1]][3]
5. Once the link has opened in the Azure portal, enter the follow values: 
   
   * The **Resource group** name is already defined in the parameter file, so select **Use Existing** and enter `ra-ntier-sql-workload-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click on the **Purchase** button.
6. Check Azure portal notification for a message the deployment is complete.
7. Click the button below.  
   [!["Deploy To Azure"][1]][4]
8. Once the link has opened in the Azure portal, enter the follow values: 
   
   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-ntier-sql-network-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click on the **Purchase** button.
9. Check Azure portal notification for a message the deployment is complete.
10. The parameter files include a hard-coded administrator user names and passwords, and it is strongly recommended that you immediately change both on all the VMs. Click on each VM in the Azure Portal then click on **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** dropdown box, then select a new **User name** and **Password**. Click the **Update** button to persist the new user name and password. 

For information on additional ways to deploy this reference architecture, see the readme file in the [guidance-single-vm][github-folder] Github folder. 

## Next steps
To achieve high availability for this reference architecture, we recommend [deploying to multiple regions][multi-dc].

<!-- links -->

[arm-templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
[azure-administration]: ../automation/automation-intro.md
[azure-audit-logs]: ../resource-group-audit.md
[azure-availability-sets]: ../virtual-machines/virtual-machines-windows-manage-availability.md#configure-each-application-tier-into-separate-availability-sets
[azure-cli]: ../virtual-machines-command-line-tools.md
[azure-key-vault]: https://azure.microsoft.com/services/key-vault.md
[azure-load-balancer]: ../load-balancer/load-balancer-overview.md
[bastion host]: https://en.wikipedia.org/wiki/Bastion_host
[cidr]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
[chef]: https://www.chef.io/solutions/azure/
[dmz]: guidance-iaas-ra-secure-vnet-dmz.md
[github-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier-sql
[lb-external-create]: ../load-balancer/load-balancer-get-started-internet-portal.md
[lb-internal-create]: ../load-balancer/load-balancer-get-started-ilb-arm-portal.md
[load-balancer-external]: ../load-balancer/load-balancer-internet-overview.md
[load-balancer-internal]: ../load-balancer/load-balancer-internal-overview.md
[multi-dc]: guidance-compute-multiple-datacenters.md
[multi-vm]: guidance-compute-multi-vm.md
[n-tier]: guidance-compute-n-tier-vm.md
[naming conventions]: guidance-naming-conventions.md
[nsg]: ../virtual-network/virtual-networks-nsg.md
[nsg-rules]: ../best-practices-resource-manager-security.md#network-security-groups
[operations-management-suite]: https://www.microsoft.com/en-us/server-cloud/operations-management-suite/overview.aspx
[plan-network]: ../virtual-network/virtual-network-vnet-plan-design-arm.md
[private-ip-space]: https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
[public IP address]: ../virtual-network/virtual-network-ip-addresses-overview-arm.md
[puppet]: https://puppetlabs.com/blog/managing-azure-virtual-machines-puppet
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[sql-alwayson]: https://msdn.microsoft.com/en-us/library/hh510230.aspx
[sql-alwayson-force-failover]: https://msdn.microsoft.com/en-us/library/ff877957.aspx
[sql-alwayson-getting-started]: https://msdn.microsoft.com/en-us/library/gg509118.aspx
[sql-alwayson-ilb]: https://blogs.msdn.microsoft.com/igorpag/2016/01/25/configure-an-ilb-listener-for-sql-server-alwayson-availability-groups-in-azure-arm/
[sql-alwayson-listeners]: https://msdn.microsoft.com/en-us/library/hh213417.aspx
[sql-alwayson-read-only-routing]: https://technet.microsoft.com/en-us/library/hh213417.aspx#ConnectToSecondary
[sql-keyvault]: ../virtual-machines/virtual-machines-windows-ps-sql-keyvault.md
[vm-planned-maintenance]: ../virtual-machines/virtual-machines-windows-planned-maintenance.md
[vm-sla]: https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines
[vnet faq]: ../virtual-network/virtual-networks-faq.md
[wsfc-whats-new]: https://technet.microsoft.com/windows-server-docs/failover-clustering/whats-new-in-failover-clustering
[Nagios]: https://www.nagios.org/
[Zabbix]: http://www.zabbix.com/
[Icinga]: http://www.icinga.org/
[VM-sizes]: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-sizes/
[solution-script]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/Deploy-ReferenceArchitecture.ps1
[solution-script-bash]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/deploy-reference-architecture.sh
[vnet-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/virtualNetwork.parameters.json
[vnet-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/virtualNetwork.parameters.json
[nsg-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/networkSecurityGroups.parameters.json
[nsg-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/networkSecurityGroups.parameters.json
[webtier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/webTier.parameters.json
[webtier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/webTier.parameters.json
[businesstier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/businessTier.parameters.json
[businesstier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/businessTier.parameters.json
[datatier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/dataTier.parameters.json
[datatier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/dataTier.parameters.json
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[0]: ./media/blueprints/compute-n-tier.png "N-tier architecture using Microsoft Azure"
[1]: ./media/blueprints/deploybutton.png 
[2]: https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-compute-n-tier-sql%2FvirtualNetwork.azuredeploy.json
[3]: https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-compute-n-tier-sql%2Fworkload.azuredeploy.json
[4]: https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-compute-n-tier-sql%2Fsecurity.azuredeploy.json