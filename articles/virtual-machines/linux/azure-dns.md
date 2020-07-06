---
title: DNS Name resolution options for Linux VMs
description: Name Resolution scenarios for Linux virtual machines in Azure IaaS, including provided DNS services, hybrid external DNS and Bring Your Own DNS server.
author: RicksterCDN
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 10/19/2016
ms.author: rclaus

---
# DNS Name Resolution options for Linux virtual machines in Azure
Azure provides DNS name resolution by default for all virtual machines that are in a single virtual network. You can implement your own DNS name resolution solution by configuring your own DNS services on your virtual machines that Azure hosts. The following scenarios should help you choose the one that works for your situation.

* [Name resolution that Azure provides](#name-resolution-that-azure-provides)
* [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)

The type of name resolution that you use depends on how your virtual machines and role instances need to communicate with each other.

The following table illustrates scenarios and corresponding name resolution solutions:

| **Scenario** | **Solution** | **Suffix** |
| --- | --- | --- |
| Name resolution between role instances or virtual machines in the same virtual network |Name resolution that Azure provides |hostname or fully-qualified domain name (FQDN) |
| Name resolution between role instances or virtual machines in different virtual networks |Customer-managed DNS servers that forward queries between virtual networks for resolution by Azure (DNS proxy). See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server). |FQDN only |
| Resolution of on-premises computers and service names from role instances or virtual machines in Azure |Customer-managed DNS servers (for example, on-premises domain controller, local read-only domain controller, or a DNS secondary synced by using zone transfers). See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server). |FQDN only |
| Resolution of Azure hostnames from on-premises computers |Forward queries to a customer-managed DNS proxy server in the corresponding virtual network. The proxy server forwards queries to Azure for resolution. See [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server). |FQDN only |
| Reverse DNS for internal IPs |[Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server) |n/a |

## Name resolution that Azure provides
Along with resolution of public DNS names, Azure provides internal name resolution for virtual machines and role instances that are in the same virtual network. In virtual networks that are based on Azure Resource Manager, the DNS suffix is consistent across the virtual network; the FQDN is not needed. DNS names can be assigned to both network interface cards (NICs) and virtual machines. Although the name resolution that Azure provides does not require any configuration, it is not the appropriate choice for all deployment scenarios, as seen on the preceding table.

### Features and considerations
**Features:**

* No configuration is required to use name resolution that Azure provides.
* The name resolution service that Azure provides is highly available. You don't need to create and manage clusters of your own DNS servers.
* The name resolution service that Azure provides can be used along with your own DNS servers to resolve both on-premises and Azure hostnames.
* Name resolution is provided between virtual machines in virtual networks without need for the FQDN.
* You can use hostnames that best describe your deployments rather than working with auto-generated names.

**Considerations:**

* The DNS suffix that Azure creates cannot be modified.
* You cannot manually register your own records.
* WINS and NetBIOS are not supported.
* Hostnames must be DNS-compatible.
    Names must use only 0-9, a-z, and '-', and they cannot start or end with a '-'. See RFC 3696 Section 2.
* DNS query traffic is throttled for each virtual machine. Throttling shouldn't impact most applications.  If request throttling is observed, ensure that client-side caching is enabled.  For more information, see [Getting the most from name resolution that Azure provides](#getting-the-most-from-name-resolution-that-azure-provides).

### Getting the most from name resolution that Azure provides
**Client-side caching:**

Some DNS queries are not sent across the network. Client-side caching helps reduce latency and improve resilience to network inconsistencies by resolving recurring DNS queries from a local cache. DNS records contain a Time-To-Live (TTL), which enables the cache to store the record for as long as possible without impacting record freshness. As a result, client-side caching is suitable for most situations.

Some Linux distributions do not include caching by default. We recommend that you add a cache to each Linux virtual machine after you check that there isn't a local cache already.

Several different DNS caching packages, such as dnsmasq, are available. Here are the steps to install dnsmasq on the most common distributions:

**Ubuntu (uses resolvconf)**
  * Install the dnsmasq package (“sudo apt-get install dnsmasq”).

**SUSE (uses netconf)**:
1. Install the dnsmasq package (“sudo zypper install dnsmasq”).
2. Enable the dnsmasq service (“systemctl enable dnsmasq.service”).
3. Start the dnsmasq service (“systemctl start dnsmasq.service”).
4. Edit “/etc/sysconfig/network/config”, and change NETCONFIG_DNS_FORWARDER="" to ”dnsmasq”.
5. Update resolv.conf ("netconfig update") to set the cache as the local DNS resolver.

**CentOS by Rogue Wave Software (formerly OpenLogic; uses NetworkManager)**
1. Install the dnsmasq package (“sudo yum install dnsmasq”).
2. Enable the dnsmasq service (“systemctl enable dnsmasq.service”).
3. Start the dnsmasq service (“systemctl start dnsmasq.service”).
4. Add “prepend domain-name-servers 127.0.0.1;” to “/etc/dhclient-eth0.conf”.
5. Restart the network service (“service network restart”) to set the cache as the local DNS resolver

> [!NOTE]
> : The 'dnsmasq' package is only one of the many DNS caches that are available for Linux. Before you use it, check its suitability for your needs and that no other cache is installed.
>
>

**Client-side retries**

DNS is primarily a UDP protocol. Because the UDP protocol doesn't guarantee message delivery, the DNS protocol itself handles retry logic. Each DNS client (operating system) can exhibit different retry logic depending on the creator's preference:

* Windows operating systems retry after one second and then again after another two, four, and another four seconds.
* The default Linux setup retries after five seconds.  You should change this to retry five times at one-second intervals.  

To check the current settings on a Linux virtual machine, 'cat /etc/resolv.conf', and look at the 'options' line, for example:

    options timeout:1 attempts:5

The resolv.conf file is auto-generated and should not be edited. The specific steps that add the 'options' line vary by distribution:

**Ubuntu** (uses resolvconf)
1. Add the options line to '/etc/resolvconf/resolv.conf.d/head'.
2. Run 'resolvconf -u' to update.

**SUSE** (uses netconf)
1. Add 'timeout:1 attempts:5' to the NETCONFIG_DNS_RESOLVER_OPTIONS="" parameter in '/etc/sysconfig/network/config'.
2. Run 'netconfig update' to update.

**CentOS by Rogue Wave Software (formerly OpenLogic)** (uses NetworkManager)
1. Add 'RES_OPTIONS="timeout:1 attempts:5"' to '/etc/sysconfig/network'.
2. Run 'service network restart' to update.

## Name resolution using your own DNS server
Your name resolution needs may go beyond the features that Azure provides. For example, you might require DNS resolution between virtual networks. To cover this scenario, you can use your own DNS servers.  

DNS servers within a virtual network can forward DNS queries to recursive resolvers of Azure to resolve hostnames that are in the same virtual network. For example, a DNS server that runs in Azure can respond to DNS queries for its own DNS zone files and forward all other queries to Azure. This functionality enables virtual machines to see both your entries in your zone files and hostnames that Azure provides (via the forwarder). Access to the recursive resolvers of Azure is provided via the virtual IP 168.63.129.16.

DNS forwarding also enables DNS resolution between virtual networks and enables your on-premises machines to resolve hostnames that Azure provides. To resolve a virtual machine's hostname, the DNS server virtual machine must reside in the same virtual network and be configured to forward hostname queries to Azure. Because the DNS suffix is different in each virtual network, you can use conditional forwarding rules to send DNS queries to the correct virtual network for resolution. The following image shows two virtual networks and an on-premises network doing DNS resolution between virtual networks by using this method:

![DNS resolution between virtual networks](./media/azure-dns/inter-vnet-dns.png)

When you use name resolution that Azure provides, the internal DNS suffix is provided to each virtual machine by using DHCP. When you use your own name resolution solution, this suffix is not supplied to virtual machines because the suffix interferes with other DNS architectures. To refer to machines by FQDN or to configure the suffix on your virtual machines, you can use PowerShell or the API to determine the suffix:

* For virtual networks that are managed by Azure Resource Manager, the suffix is available via the [network interface card](https://msdn.microsoft.com/library/azure/mt163668.aspx) resource. You can also run the `azure network public-ip show <resource group> <pip name>` command to display the details of your public IP, which includes the FQDN of the NIC.

If forwarding queries to Azure doesn't suit your needs, you need to provide your own DNS solution.  Your DNS solution needs to:

* Provide appropriate hostname resolution, for example via [DDNS](../../virtual-network/virtual-networks-name-resolution-ddns.md). If you use DDNS, you might need to disable DNS record scavenging. DHCP leases of Azure are very long and scavenging may remove DNS records prematurely.
* Provide appropriate recursive resolution to allow resolution of external domain names.
* Be accessible (TCP and UDP on port 53) from the clients it serves and be able to access the Internet.
* Be secured against access from the Internet to mitigate threats posed by external agents.

> [!NOTE]
> For best performance, when you use virtual machines in Azure DNS servers, disable IPv6 and assign an [Instance-Level Public IP](../../virtual-network/virtual-networks-instance-level-public-ip.md) to each DNS server virtual machine.  
>
>
