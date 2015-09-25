<properties 
   pageTitle="Resolution for VMs and Role Instances"
   description="Name Resolution scenarios for Azure IaaS , hybrid solutions, between different cloud services, Active Directory and using your own DNS server "
   services="virtual-network"
   documentationCenter="na"
   authors="GarethBradshawMSFT"
   manager="jdial"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/02/2015"
   ms.author="joaoma" />

# Name Resolution for VMs and Role Instances

Depending on how you use Azure to host IaaS, PaaS, and hybrid solutions, you may need to allow the VMs and role instances that you create to communicate with each other. Although this communication can be done by using IP addresses, it is much simpler to use names that can be easily remembered and do not change. 

When role instances and VMs hosted in Azure need to resolve domain names to internal IP addresses, they can use one of two methods:

- [Azure-provided name resolution](#azure-provided-name-resolution)

- [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) 

The type of name resolution you use depends on how your VMs and role instances need to communicate with each other.

**The following table illustrates scenarios and corresponding name resolution solutions:**

| **Scenario** | **Name resolution provided by:** | **For more information see:** |
|--------------|----------------------------------|-------------------------------|
| Name resolution between role instances or VMs located in the same cloud service | Azure-provided name resolution | [Azure-provided name resolution](#azure-provided-name-resolution)|
| Name resolution between VMs and role instances located in the same virtual network | Azure-provided name resolution (ARM-based deployments only) or Name resolution using your own DNS server | [Azure-provided name resolution](#azure-provided-name-resolution), [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) and [DNS server requirements](#dns-server-requirements) |
| Name resolution between VMs and role instances located in different virtual networks | Name resolution using your own DNS server| [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) and [DNS server requirements](#dns-server-requirements)|
| Cross-premises: Name resolution between role instances or VMs in Azure and on-premises computers| Name resolution using your own DNS server| [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) and [DNS server requirements](#dns-server-requirements)|
| Reverse lookup of internal IPs| Name resolution using your own DNS server| [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) and [DNS server requirements](#dns-server-requirements)|
| Name resolution for non-public domains (e.g. Active Directory domains)| Name resolution using your own DNS server| [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) and [DNS server requirements](#dns-server-requirements)|
| Name resolution between role instances located in different cloud services, not in a virtual network| Not applicable. Connectivity between VMs and role instances in different cloud services is not supported outside a virtual network.| Not applicable.|


## Azure-provided name resolution

Along with resolution of public DNS names, Azure provides internal name resolution for VMs and role instances that reside within the same virtual network or cloud service.  VMs/instances in a cloud service share the same DNS suffix, so the hostname alone is sufficient.  In classic virtual networks, different cloud services have different DNS suffixes, so the FQDN is needed.  In ARM-based virtual networks, the DNS suffix is common across the virtual network so the FQDN is not needed, and the DNS name can be assigned to either the NIC or the virtual machine. 
Although Azure-provided name resolution does not require any configuration, it is not the appropriate choice for all deployment scenarios, as seen on the table above.

> [AZURE.NOTE] In the case of web and worker roles, you can also access the internal IP addresses of role instances based on the role name and instance number using the Azure Service Management REST API. For more information, see [Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx).

### Features and Considerations

**Features:**

- Ease of use: No configuration is required in order to use Azure-provided name resolution.

- The Azure-provided name resolution service is highly available, saving you the need to create and manage clusters of your own DNS servers.

- Name resolution is provided between role instances or VMs within the same cloud service without need for a FQDN.

- Name resolution is provided between VMs in ARM-based virtual networks without need for the FQDN, classic virtual networks require the FQDN when resolving names in different cloud services. 

- You can create the hostnames that will best describe your deployments, rather than working with auto-generated names.

**Considerations:**

- Name resolution between virtual networks and between Azure and on-premise machines is not available.

- The Azure-created DNS suffix cannot be modified.

- You cannot manually register your own records.

- WINS and NetBIOS are not supported. (You cannot list your virtual machines in the network browser in Windows Explorer.)

- Hostnames must be DNS-compatible (They must use only 0-9, a-z and '-', and cannot start or end with a '-'. See RFC 3696 section 2.)

- DNS query traffic is throttled per VM. This shouldn't impact most applications.  If request throttling is observed, ensure that client-side caching is enabled.  For more details, see [Getting the most from Azure-provided name resolution](#Getting-the-most-from-Azure-provided-name-resolution).

- Only VMs in the first 180 cloud services are registered for each classic virtual network.  This does not apply to ARM-based virtual networks.


### Getting the most from Azure-provided name resolution
**Client-side Caching:**

Not every DNS query needs to be sent across the network.  Client-side caching helps reduce latency and improve resilience to network blips by resolving recurring DNS queries from a local cache.  DNS records contain a Time-To-Live (TTL) which allows the cache to store the record for as long as possible without impacting record freshness, so client-side caching is suitable for most situations.

The default Windows DNS Client has a DNS cache built-in.  Some Linux distros do not include caching by default, it is recommended that one be added to each Linux VM.  There are a number of different DNS caching packages available, e.g. dnsmasq, here are the steps to install dnsmasq on the most common distros:

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

[AZURE.NOTE]: The 'dnsmasq' package is only one of the many DNS caches available for Linux.  Before using it, please check its suitability for your particular needs and that no other cache is installed.

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

If your name resolution requirements go beyond the features provided by Azure, you have the option of using your own DNS server(s). When you use your own DNS server(s), you are responsible for managing the DNS records.

> [AZURE.NOTE] It is recommended to avoid the use of an external DNS server, unless your deployment scenario requires it.

## DNS server requirements

If you plan to use name resolution that is not provided by Azure, the DNS server that you specify must support the following:

- The DNS server should accept dynamic DNS registration, via the Dynamic DNS (DDNS) protocol, or you must create the required records.

- If relying on dynamic DNS, the DNS server should have record scavenging turned off. In Azure, IP addresses have long DHCP leases which can result in the removal of records from the DNS server during scavenging.

- The DNS server must have recursion enabled to allow resolution for external domain names.

- The DNS server must be accessible (on TCP/UDP port 53) by the clients requesting name resolution and by the services and virtual machines that will register their names.

- It is also recommended to secure the DNS server against access from the internet as many bots scan for open recursive DNS resolvers.

- For best performance, when using Azure VMs as DNS servers, IPv6 should be disabled and an [Instance-Level Public IP](virtual-networks-instance-level-public-ip.mp) should be assigned to each DNS server VM.

## Specifying DNS servers

You can specify multiple DNS servers to be used by your VMs and role instances.  For each DNS query, the client will first try the preferred DNS server and only try the alternate servers if the preferred one doesn't respond, i.e. DNS queries are not load-balanced across the different DNS servers. For this reason, verify that you have your DNS servers listed in the correct order for your environment.

> [AZURE.NOTE] If you change the DNS settings on a network configuration file for virtual network that is already deployed, you need to restart each VM for the changes to take effect.

### Specifying a DNS server in the Management Portal

When you create a virtual network in the Management Portal, you can specify the IP address and name of the DNS server(s) that you want to use. Once the virtual network is created, the virtual machines and role instances that you deploy to the virtual network are automatically configured with the specified DNS settings.  DNS servers specified for a specific cloud service (Azure classic) or a network interface card (ARM-based deployments) take precedence over those specificed for the virtual network.  See [About Configuring a Virtual Network in the Management Portal](virtual-networks-settings.md).

### Specifying a DNS server by using configuration files (Azure classic)

For classic virtual networks, you can specify DNS settings by using two different configuration files: the *Network Configuration* file and the *Service Configuration* file.

The network configuration file describes the virtual networks in your subscripion. When you add role instances or VMs to a cloud service in a virtual network, the DNS settings from your network configuration file are applied to each role instance or VM unless cloud-service specific DNS servers have been specified.

The service configuration file is created for each cloud service that you add to Azure. When you add role instances or VMs to the cloud service, the DNS settings from your service configuration file are applied to each role instance or VM.

> [AZURE.NOTE] DNS servers in the service configuration file override settings in the network configuration file. 


## Next steps

[Azure Service Configuration Schema](https://msdn.microsoft.com/library/azure/ee758710)

[Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100)

[About Configuring Virtual Network Settings in the Management Portal](virtual-networks-settings.md) 

[Configure a Virtual Network by Using a Network Configuration File](virtual-networks-using-network-configuration-file.md) 


