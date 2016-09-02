<properties 
   pageTitle="DNS Name resolution options for Linux VMs in Azure"
   description="Name Resolution scenarios for Linux VMs in Azure IaaS, including provided DNS services, Hybrid external DNS and Bring Your Own DNS server."
   services="virtual-machines"
   documentationCenter="na"
   authors="RicksterCDN"
   manager="timlt"
   editor="tysonn" />
<tags 
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/21/2016"
   ms.author="rclaus" />

# DNS Name Resolution Options for Linux VMs in Azure

Azure provides DNS name resolution by default for all VMs contained within a single Virtual Network. You are able to implement your own DNS name resolution solution by configuring your own DNS services on your Azure hosted VMs. The following scenarios should help you choose which one works better for your particular situation.

- [Azure-provided name resolution](#azure-provided-name-resolution)

- [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) 

The type of name resolution you use depends on how your VMs and role instances need to communicate with each other.

**The following table illustrates scenarios and corresponding name resolution solutions:**

| **Scenario** | **Solution** | **Suffix** |
|--------------|--------------|----------|
| Name resolution between role instances or VMs located in the same virtual network | [Azure-provided name resolution](#azure-provided-name-resolution)| hostname or FQDN |
| Name resolution between role instances or VMs located in different virtual networks | Customer-managed DNS servers forwarding queries between vnets for resolution by Azure (DNS proxy).  see [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)| FQDN only |
| Resolution of on-premises computer and service names from role instances or VMs in Azure | Customer-managed DNS servers (e.g. on-premise domain controller, local read-only domain controller or a DNS secondary synced using zone transfers).  See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)|FQDN only |
| Resolution of Azure hostnames from on-premise computers | Forward queries to a customer-managed DNS proxy server in the corresponding vnet, the proxy server forwards queries to Azure for resolution. See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)| FQDN only |
| Reverse DNS for internal IPs | [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) | n/a |

## Azure-provided name resolution

Along with resolution of public DNS names, Azure provides internal name resolution for VMs and role instances that reside within the same virtual network.  In ARM-based virtual networks, the DNS suffix is consistent across the virtual network (so the FQDN is not needed) and DNS names can be assigned to both NICs and VMs. Although Azure-provided name resolution does not require any configuration, it is not the appropriate choice for all deployment scenarios, as seen on the table above.

### Features and Considerations

**Features:**

- Ease of use: No configuration is required in order to use Azure-provided name resolution.

- The Azure-provided name resolution service is highly available, saving you the need to create and manage clusters of your own DNS servers.

- Can be used in conjunction with your own DNS servers to resolve both on-premise and Azure hostnames.

- Name resolution is provided between VMs in virtual networks without need for the FQDN. 

- You can use hostnames that best describe your deployments, rather than working with auto-generated names.

**Considerations:**

- The Azure-created DNS suffix cannot be modified.

- You cannot manually register your own records.

- WINS and NetBIOS are not supported.

- Hostnames must be DNS-compatible (They must use only 0-9, a-z and '-', and cannot start or end with a '-'. See RFC 3696 section 2.)

- DNS query traffic is throttled for each VM. This shouldn't impact most applications.  If request throttling is observed, ensure that client-side caching is enabled.  For more details, see [Getting the most from Azure-provided name resolution](#Getting-the-most-from-Azure-provided-name-resolution).


### Getting the most from Azure-provided name resolution
**Client-side Caching:**

Not every DNS query needs to be sent across the network.  Client-side caching helps reduce latency and improve resilience to network blips by resolving recurring DNS queries from a local cache.  DNS records contain a Time-To-Live (TTL) which allows the cache to store the record for as long as possible without impacting record freshness, so client-side caching is suitable for most situations.

Some Linux distros do not include caching by default, it is recommended that one be added to each Linux VM (after checking that there isn't a local cache already).

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

> [AZURE.NOTE]: The 'dnsmasq' package is only one of the many DNS caches available for Linux.  Before using it, please check its suitability for your particular needs and that no other cache is installed.

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
There are a number of situations where your name resolution needs may go beyond the features provided by Azure, for example when you require DNS resolution between virtual networks (vnets).  To cover this scenario, Azure provides the ability for you to use your own DNS servers.  

DNS servers within a virtual network can forward DNS queries to Azure's recursive resolvers to resolve hostnames within that virtual network.  For example, a DNS server running in Azure can respond to DNS queries for its own DNS zone files and forward all other queries to Azure.  This allows VMs to see both your entries in your zone files as well as Azure-provided hostnames (via the forwarder).  Access to Azure's recursive resolvers is provided via the virtual IP 168.63.129.16.

DNS forwarding also enables inter-vnet DNS resolution and allows your on-premise machines to resolve Azure-provided hostnames.  In order to resolve a VM's hostname, the DNS server VM must reside in the same virtual network and be configured to forward hostname queries to Azure.  As the DNS suffix is different in each vnet, you can use conditional forwarding rules to send DNS queries to the correct vnet for resolution.  The following image shows two vnets and an on-premise network doing inter-vnet DNS resolution using this method:

![Inter-vnet DNS](./media/virtual-machines-linux-azure-dns/inter-vnet-dns.png)

When using Azure-provided name resolution, the Internal DNS suffix is provided to each VM using DHCP.  When using your own name resolution solution, this suffix is not supplied to VMs because it interferes with other DNS architectures.  To refer to machines by FQDN, or to configure the suffix on your VMs, the suffix can be determined using PowerShell or the API:

-  For Azure Resource Management managed vnets, the suffix is available via the [network interface card](https://msdn.microsoft.com/library/azure/mt163668.aspx) resource or you can run the command `azure network public-ip show <resource group> <pip name>` to display the details of your public IP, including the FQDN of the nic.    


If forwarding queries to Azure doesn't suit your needs, you will need to provide your own DNS solution.  Your DNS solution will need to:

-  Provide appropriate hostname resolution, e.g. via [DDNS](../virtual-network/virtual-networks-name-resolution-ddns.md).  Note, if using DDNS you may need to disable DNS record scavenging as Azure's DHCP leases are very long and scavenging may remove DNS records prematurely. 
-  Provide appropriate recursive resolution to allow resolution of external domain names.
-  Be accessible (TCP and UDP on port 53) from the clients it serves and be able to access the internet.
-  Be secured against access from the internet, to mitigate threats posed by external agents.

> [AZURE.NOTE] For best performance, when using Azure VMs as DNS servers, IPv6 should be disabled and an [Instance-Level Public IP](../virtual-network/virtual-networks-instance-level-public-ip.md) should be assigned to each DNS server VM.  

