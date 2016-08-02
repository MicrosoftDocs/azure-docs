<properties 
   pageTitle="Resolution for VMs and Role Instances"
   description="Name Resolution scenarios for Azure IaaS , hybrid solutions, between different cloud services, Active Directory and using your own DNS server "
   services="virtual-network"
   documentationCenter="na"
   authors="GarethBradshawMSFT"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/03/2016"
   ms.author="telmos" />

# Name Resolution for VMs and Role Instances

Depending on how you use Azure to host IaaS, PaaS, and hybrid solutions, you may need to allow the VMs and role instances that you create to communicate with each other. Although this communication can be done by using IP addresses, it is much simpler to use names that can be easily remembered and do not change. 

When role instances and VMs hosted in Azure need to resolve domain names to internal IP addresses, they can use one of two methods:

- [Azure-provided name resolution](#azure-provided-name-resolution)

- [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) (which may forward queries to the Azure-provided DNS servers) 

The type of name resolution you use depends on how your VMs and role instances need to communicate with each other.

**The following table illustrates scenarios and corresponding name resolution solutions:**

| **Scenario** | **Solution** | **Suffix** |
|--------------|--------------|----------|
| Name resolution between role instances or VMs located in the same cloud service or virtual network | [Azure-provided name resolution](#azure-provided-name-resolution)| hostname or FQDN |
| Name resolution between role instances or VMs located in different virtual networks | Customer-managed DNS servers forwarding queries between vnets for resolution by Azure (DNS proxy).  see [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)| FQDN only |
| Resolution of on-premises computer and service names from role instances or VMs in Azure | Customer-managed DNS servers (e.g. on-premise domain controller, local read-only domain controller or a DNS secondary synced using zone transfers).  See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)|FQDN only |
| Resolution of Azure hostnames from on-premise computers | Forward queries to a customer-managed DNS proxy server in the corresponding vnet, the proxy server forwards queries to Azure for resolution. See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)| FQDN only |
| Reverse DNS for internal IPs | [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) | n/a |
| Name resolution between VMs or role instances located in different cloud services, not in a virtual network| Not applicable. Connectivity between VMs and role instances in different cloud services is not supported outside a virtual network.| n/a |



## Azure-provided name resolution

Along with resolution of public DNS names, Azure provides internal name resolution for VMs and role instances that reside within the same virtual network or cloud service.  VMs/instances in a cloud service share the same DNS suffix (so the hostname alone is sufficient) but in classic virtual networks different cloud services have different DNS suffixes so the FQDN is needed to resolve names between different cloud services.  In virtual networks in the Resource Manager deployment model, the DNS suffix is consistent across the virtual network (so the FQDN is not needed) and DNS names can be assigned to both NICs and VMs. Although Azure-provided name resolution does not require any configuration, it is not the appropriate choice for all deployment scenarios, as seen on the table above.

> [AZURE.NOTE] In the case of web and worker roles, you can also access the internal IP addresses of role instances based on the role name and instance number using the Azure Service Management REST API. For more information, see [Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx).

### Features and Considerations

**Features:**

- Ease of use: No configuration is required in order to use Azure-provided name resolution.

- The Azure-provided name resolution service is highly available, saving you the need to create and manage clusters of your own DNS servers.

- Can be used in conjunction with your own DNS servers to resolve both on-premise and Azure hostnames.

- Name resolution is provided between role instances/VMs within the same cloud service without need for a FQDN.

- Name resolution is provided between VMs in virtual networks that use the Resource Manager deployment model, without need for the FQDN. Virtual networks in the classic deployment model require the FQDN when resolving names in different cloud services. 

- You can use hostnames that best describe your deployments, rather than working with auto-generated names.

**Considerations:**

- The Azure-created DNS suffix cannot be modified.

- You cannot manually register your own records.

- WINS and NetBIOS are not supported. (You cannot see your VMs in Windows Explorer.)

- Hostnames must be DNS-compatible (They must use only 0-9, a-z and '-', and cannot start or end with a '-'. See RFC 3696 section 2.)

- DNS query traffic is throttled for each VM. This shouldn't impact most applications.  If request throttling is observed, ensure that client-side caching is enabled.  For more details, see [Getting the most from Azure-provided name resolution](#Getting-the-most-from-Azure-provided-name-resolution).

- Only VMs in the first 180 cloud services are registered for each virtual network in a classic deployment model. This does not apply to virtual networks in Resource Manager deployment models.


### Getting the most from Azure-provided name resolution
**Client-side Caching:**

Not every DNS query needs to be sent across the network.  Client-side caching helps reduce latency and improve resilience to network blips by resolving recurring DNS queries from a local cache.  DNS records contain a Time-To-Live (TTL) which allows the cache to store the record for as long as possible without impacting record freshness, so client-side caching is suitable for most situations.

The default Windows DNS Client has a DNS cache built-in.  Some Linux distros do not include caching by default, it is recommended that one be added to each Linux VM (after checking that there isn't a local cache already).

There are a number of different DNS caching packages available, e.g. dnsmasq, here are the steps to install dnsmasq on the most common distros:

- **Ubuntu (uses resolvconf)**:
	- just install the dnsmasq package (“sudo apt-get install dnsmasq”).
- **SUSE (uses netconf)**:
	- install the dnsmasq package (“sudo zypper install dnsmasq”) 
	- enable the dnsmasq service (“systemctl enable dnsmasq.service”) 
	- start the dnsmasq service (“systemctl start dnsmasq.service”) 
	- edit “/etc/sysconfig/network/config” and change NETCONFIG_DNS_FORWARDER="" to ”dnsmasq”
	- update resolv.conf ("netconfig update") to set the cache as the local DNS resolver
- **OpenLogic (uses NetworkManager)**:
	- install the dnsmasq package (“sudo yum install dnsmasq”)
	- enable the dnsmasq service (“systemctl enable dnsmasq.service”)
	- start the dnsmasq service (“systemctl start dnsmasq.service”)
	- add “prepend domain-name-servers 127.0.0.1;” to “/etc/dhclient-eth0.conf”
	- restart the network service (“service network restart”) to set the cache as the local DNS resolver

> [AZURE.NOTE] The 'dnsmasq' package is only one of the many DNS caches available for Linux.  Before using it, please check its suitability for your particular needs and that no other cache is installed.

**Client-side Retries:**

DNS is primarily a UDP protocol.  As the UDP protocol doesn't guarantee message delivery, retry logic is handled in the DNS protocol itself.  Each DNS client (operating system) can exhibit different retry logic depending on the creators preference:

 - Windows operating systems retry after 1 second and then again after another 2, 4 and another 4 seconds. 
 - The default Linux setup retries after 5 seconds.  It is recommended to change this to retry 5 times at 1 second intervals.  

To check the current settings on a Linux VM, 'cat /etc/resolv.conf' and look at the 'options' line, e.g.:

	options timeout:1 attempts:5

The resolv.conf file is usually auto-generated and should not be edited.  The specific steps for adding the 'options' line vary by distro:

- **Ubuntu** (uses resolvconf):
	- add the options line to '/etc/resolveconf/resolv.conf.d/head' 
	- run 'resolvconf -u' to update
- **SUSE** (uses netconf):
	- add 'timeout:1 attempts:5' to the NETCONFIG_DNS_RESOLVER_OPTIONS="" parameter in '/etc/sysconfig/network/config' 
	- run 'netconfig update' to update
- **OpenLogic** (uses NetworkManager):
	- add 'echo "options timeout:1 attempts:5"' to '/etc/NetworkManager/dispatcher.d/11-dhclient' 
	- run 'service network restart' to update

## Name resolution using your own DNS server
There are a number of situations where your name resolution needs may go beyond the features provided by Azure, for example when using Active Directory domains or when you require DNS resolution between virtual networks (vnets).  To cover these scenarios, Azure provides the ability for you to use your own DNS servers.  

DNS servers within a virtual network can forward DNS queries to Azure's recursive resolvers to resolve hostnames within that virtual network.  For example, a Domain Controller (DC) running in Azure can respond to DNS queries for its domains and forward all other queries to Azure.  This allows VMs to see both your on-premise resources (via the DC) and Azure-provided hostnames (via the forwarder).  Access to Azure's recursive resolvers is provided via the virtual IP 168.63.129.16.

DNS forwarding also enables inter-vnet DNS resolution and allows your on-premise machines to resolve Azure-provided hostnames.  In order to resolve a VM's hostname, the DNS server VM must reside in the same virtual network and be configured to forward hostname queries to Azure.  As the DNS suffix is different in each vnet, you can use conditional forwarding rules to send DNS queries to the correct vnet for resolution.  The following image shows two vnets and an on-premise network doing inter-vnet DNS resolution using this method.  An example DNS forwarder is available in the [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/301-dns-forwarder/) and [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/301-dns-forwarder).

![Inter-vnet DNS](./media/virtual-networks-name-resolution-for-vms-and-role-instances/inter-vnet-dns.png)

When using Azure-provided name resolution, an Internal DNS suffix (*.internal.cloudapp.net) is provided to each VM using DHCP.  This enables hostname resolution as the hostname records are in the internal.cloudapp.net zone.  When using your own name resolution solution, the IDNS suffix is not supplied to VMs because it interferes with other DNS architectures (like domain-joined scenarios).  Instead we provide a non-functioning placeholder (reddog.microsoft.com).  

If needed, the Internal DNS suffix can be determined using PowerShell or the API:

-  For virtual networks in Resource Manager deployment models, the suffix is available via the [network interface card](https://msdn.microsoft.com/library/azure/mt163668.aspx) resource or via the [Get-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619434.aspx) cmdlet.    
-  In classic deployment models, the suffix is available via the [Get Deployment API](https://msdn.microsoft.com/library/azure/ee460804.aspx) call or via the [Get-AzureVM -Debug](https://msdn.microsoft.com/library/azure/dn495236.aspx) cmdlet.


If forwarding queries to Azure doesn't suit your needs, you will need to provide your own DNS solution.  Your DNS solution will need to:

-  Provide appropriate hostname resolution, e.g. via [DDNS](virtual-networks-name-resolution-ddns.md).  Note, if using DDNS you may need to disable DNS record scavenging as Azure's DHCP leases are very long and scavenging may remove DNS records prematurely. 
-  Provide appropriate recursive resolution to allow resolution of external domain names.
-  Be accessible (TCP and UDP on port 53) from the clients it serves and be able to access the internet.
-  Be secured against access from the internet, to mitigate threats posed by external agents.

> [AZURE.NOTE] For best performance, when using Azure VMs as DNS servers, IPv6 should be disabled and an [Instance-Level Public IP](virtual-networks-instance-level-public-ip.md) should be assigned to each DNS server VM.  If you choose to use Windows Server as your DNS server, [this article](http://blogs.technet.com/b/networking/archive/2015/08/19/name-resolution-performance-of-a-recursive-windows-dns-server-2012-r2.aspx) provides additional performance analysis and optimizations.


### Specifying DNS servers

When using your own DNS servers, Azure provides the ability to specify multiple DNS servers per virtual network or per network interface (Resource Manager) / cloud service (classic).  DNS servers specified for a cloud service/network interface get precedence over those specified for the virtual network.

> [AZURE.NOTE] Network connection properties, such as DNS server IPs, should not be edited directly within Windows VMs as they may get erased during service heal when the virtual network adaptor gets replaced. 


When using the Resource Manager deployment model, DNS servers can be specified in the Portal, API/Templates ([vnet](https://msdn.microsoft.com/library/azure/mt163661.aspx), [nic](https://msdn.microsoft.com/library/azure/mt163668.aspx)) or PowerShell ([vnet](https://msdn.microsoft.com/library/mt603657.aspx), [nic](https://msdn.microsoft.com/library/mt619370.aspx)).

When using the classic deployment model, DNS servers for the virtual network can be specified in the Portal or [the *Network Configuration* file](https://msdn.microsoft.com/library/azure/jj157100).  For cloud services, the DNS servers are specified via [the *Service Configuration* file](https://msdn.microsoft.com/library/azure/ee758710) or in PowerShell ([New-AzureVM](https://msdn.microsoft.com/library/azure/dn495254.aspx)).

> [AZURE.NOTE] If you change the DNS settings for a virtual network/virtual machine that is already deployed, you need to restart each affected VM for the changes to take effect.


## Next steps

Resource Manager deployment model:

- [Create or update a virtual network](https://msdn.microsoft.com/library/azure/mt163661.aspx)
- [Create or update a network interface card](https://msdn.microsoft.com/library/azure/mt163668.aspx)
- [New-AzureRmVirtualNetwork](https://msdn.microsoft.com/library/mt603657.aspx)
- [New-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619370.aspx)

 
Classic deployment model:

- [Azure Service Configuration Schema](https://msdn.microsoft.com/library/azure/ee758710)
- [Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100)
- [Configure a Virtual Network by Using a Network Configuration File](virtual-networks-using-network-configuration-file.md) 

