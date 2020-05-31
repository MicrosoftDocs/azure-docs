---
title: Name resolution for resources in Azure virtual networks
titlesuffix: Azure Virtual Network
description: Name resolution scenarios for Azure IaaS, hybrid solutions, between different cloud services, Active Directory, and using your own DNS server.
services: virtual-network
documentationcenter: na
author: rohinkoul
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 3/2/2020
ms.author: rohink
ms.custom: fasttrack-edit
---

# Name resolution for resources in Azure virtual networks

Depending on how you use Azure to host IaaS, PaaS, and hybrid solutions, you might need to allow the virtual machines (VMs), and other resources deployed in a virtual network to communicate with each other. Although you can enable communication by using IP addresses, it is much simpler to use names that can be easily remembered, and do not change. 

When resources deployed in virtual networks need to resolve domain names to internal IP addresses, they can use one of three methods:

* [Azure DNS private zones](../dns/private-dns-overview.md)
* [Azure-provided name resolution](#azure-provided-name-resolution)
* [Name resolution that uses your own DNS server](#name-resolution-that-uses-your-own-dns-server) (which might forward queries to the Azure-provided DNS servers)

The type of name resolution you use depends on how your resources need to communicate with each other. The following table illustrates scenarios and corresponding name resolution solutions:

> [!NOTE]
> Azure DNS private zones is the preferred solution and gives you flexibility in managing your DNS zones and records. For more information, see [Using Azure DNS for private domains](../dns/private-dns-overview.md).

> [!NOTE]
> If you use Azure Provided DNS then appropriate DNS suffix will be automatically applied to your virtual machines. 
> For all other options you must either use Fully Qualified Domain Names (FQDN) or manually apply appropriate DNS suffix to your virtual machines.

| **Scenario** | **Solution** | **DNS Suffix** |
| --- | --- | --- |
| Name resolution between VMs located in the same virtual network, or Azure Cloud Services role instances in the same cloud service. | [Azure DNS private zones](../dns/private-dns-overview.md) or [Azure-provided name resolution](#azure-provided-name-resolution) |Hostname or FQDN |
| Name resolution between VMs in different virtual networks or role instances in different cloud services. |[Azure DNS private zones](../dns/private-dns-overview.md) or, Customer-managed DNS servers forwarding queries between virtual networks for resolution by Azure (DNS proxy). See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Name resolution from an Azure App Service (Web App, Function, or Bot) using virtual network integration to role instances or VMs in the same virtual network. |Customer-managed DNS servers forwarding queries between virtual networks for resolution by Azure (DNS proxy). See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Name resolution from App Service Web Apps to VMs in the same virtual network. |Customer-managed DNS servers forwarding queries between virtual networks for resolution by Azure (DNS proxy). See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Name resolution from App Service Web Apps in one virtual network to VMs in a different virtual network. |Customer-managed DNS servers forwarding queries between virtual networks for resolution by Azure (DNS proxy). See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Resolution of on-premises computer and service names from VMs or role instances in Azure. |Customer-managed DNS servers (on-premises domain controller, local read-only domain controller, or a DNS secondary synced using zone transfers, for example). See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Resolution of Azure hostnames from on-premises computers. |Forward queries to a customer-managed DNS proxy server in the corresponding virtual network, the proxy server forwards queries to Azure for resolution. See [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |FQDN only |
| Reverse DNS for internal IPs. |[Azure DNS private zones](../dns/private-dns-overview.md) or [Azure-provided name resolution](#azure-provided-name-resolution) or [Name resolution using your own DNS server](#name-resolution-that-uses-your-own-dns-server). |Not applicable |
| Name resolution between VMs or role instances located in different cloud services, not in a virtual network. |Not applicable. Connectivity between VMs and role instances in different cloud services is not supported outside a virtual network. |Not applicable|

## Azure-provided name resolution

Azure provided name resolution provides only basic authoritative DNS capabilities. If you use this option the DNS zone names and records will be automatically managed by Azure and you will not be able to control the DNS zone names or the life cycle of DNS records. If you need a fully featured DNS solution for your virtual networks you must use [Azure DNS private zones](../dns/private-dns-overview.md) or [Customer-managed DNS servers](#name-resolution-that-uses-your-own-dns-server).

Along with resolution of public DNS names, Azure provides internal name resolution for VMs and role instances that reside within the same virtual network or cloud service. VMs and instances in a cloud service share the same DNS suffix, so the host name alone is sufficient. But in virtual networks deployed using the classic deployment model, different cloud services have different DNS suffixes. In this situation, you need the FQDN to resolve names between different cloud services. In virtual networks deployed using the Azure Resource Manager deployment model, the DNS suffix is consistent across the all virtual machines within a virtual network, so the FQDN is not needed. DNS names can be assigned to both VMs and network interfaces. Although Azure-provided name resolution does not require any configuration, it is not the appropriate choice for all deployment scenarios, as detailed in the previous table.

> [!NOTE]
> When using cloud services web and worker roles, you can also access the internal IP addresses of role instances using the Azure Service Management REST API. For more information, see the [Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx). The address is based on the role name and instance number. 
>

### Features

Azure-provided name resolution includes the following features:
* Ease of use. No configuration is required.
* High availability. You don't need to create and manage clusters of your own DNS servers.
* You can use the service in conjunction with your own DNS servers, to resolve both on-premises and Azure host names.
* You can use name resolution between VMs and role instances within the same cloud service, without the need for an FQDN.
* You can use name resolution between VMs in virtual networks that use the Azure Resource Manager deployment model, without need for an FQDN. Virtual networks in the classic deployment model require an FQDN when you are resolving names in different cloud services. 
* You can use host names that best describe your deployments, rather than working with auto-generated names.

### Considerations

Points to consider when you are using Azure-provided name resolution:
* The Azure-created DNS suffix cannot be modified.
* DNS lookup is scoped to a virtual network. DNS names created for one virtual networks can't be resolved from other virtual networks.
* You cannot manually register your own records.
* WINS and NetBIOS are not supported. You cannot see your VMs in Windows Explorer.
* Host names must be DNS-compatible. Names must use only 0-9, a-z, and '-', and cannot start or end with a '-'.
* DNS query traffic is throttled for each VM. Throttling shouldn't impact most applications. If request throttling is observed, ensure that client-side caching is enabled. For more information, see [DNS client configuration](#dns-client-configuration).
* Only VMs in the first 180 cloud services are registered for each virtual network in a classic deployment model. This limit does not apply to virtual networks in Azure Resource Manager.
* The Azure DNS IP address is 168.63.129.16. This is a static IP address and will not change.

### Reverse DNS Considerations
Reverse DNS is supported in all ARM based virtual networks. You can issue reverse DNS queries (PTR queries) to map IP addresses of virtual machines to FQDNs of virtual machines.
* All PTR queries for IP addresses of virtual machines will return FQDNs of form \[vmname\].internal.cloudapp.net
* Forward lookup on FQDNs of form \[vmname\].internal.cloudapp.net will resolve to IP address assigned to the virtual machine.
* If the virtual network is linked to an [Azure DNS private zones](../dns/private-dns-overview.md) as a registration virtual network, the reverse DNS queries will return two records. One record will the of the form \[vmname\].[privatednszonename] and other would be of the form \[vmname\].internal.cloudapp.net
* Reverse DNS lookup is scoped to a given virtual network even if it is peered to other virtual networks. Reverse DNS queries (PTR queries) for IP addresses of virtual machines located in peered virtual networks will return NXDOMAIN.
* If you want to turn off reverse DNS function in a virtual network you can do so by creating a reverse lookup zone using [Azure DNS private zones](../dns/private-dns-overview.md) and link this zone to your virtual network. For example if the IP address space of your virtual network is 10.20.0.0/16 then you can create a empty private DNS zone 20.10.in-addr.arpa and link it to the virtual network. While linking the zone to your virtual network you should disable auto registration on the link. This zone will override the default reverse lookup zones for the virtual network and since this zone is empty you will get NXDOMAIN for your reverse DNS queries. See our [Quickstart guide](https://docs.microsoft.com/azure/dns/private-dns-getstarted-portal) for details on how to create a private DNS zone and link it to a virtual network.

> [!NOTE]
> If you want reverse DNS lookup to span across virtual network you can create a reverse lookup zone (in-addr.arpa) [Azure DNS private zones](../dns/private-dns-overview.md) and links it to multiple virtual networks. You'll however have to manually manage the reverse DNS records for the virtual machines.
>


## DNS client configuration

This section covers client-side caching and client-side retries.

### Client-side caching

Not every DNS query needs to be sent across the network. Client-side caching helps reduce latency and improve resilience to network blips, by resolving recurring DNS queries from a local cache. DNS records contain a time-to-live (TTL) mechanism, which allows the cache to store the record for as long as possible without impacting record freshness. Thus, client-side caching is suitable for most situations.

The default Windows DNS client has a DNS cache built-in. Some Linux distributions do not include caching by default. If you find that there isn't a local cache already, add a DNS cache to each Linux VM.

There are a number of different DNS caching packages available (such as dnsmasq). Here's how to install dnsmasq on the most common distributions:

* **Ubuntu (uses resolvconf)**:
  * Install the dnsmasq package with `sudo apt-get install dnsmasq`.
* **SUSE (uses netconf)**:
  * Install the dnsmasq package with `sudo zypper install dnsmasq`.
  * Enable the dnsmasq service with `systemctl enable dnsmasq.service`. 
  * Start the dnsmasq service with `systemctl start dnsmasq.service`. 
  * Edit **/etc/sysconfig/network/config**, and change *NETCONFIG_DNS_FORWARDER=""* to *dnsmasq*.
  * Update resolv.conf with `netconfig update`, to set the cache as the local DNS resolver.
* **CentOS (uses NetworkManager)**:
  * Install the dnsmasq package with `sudo yum install dnsmasq`.
  * Enable the dnsmasq service with `systemctl enable dnsmasq.service`.
  * Start the dnsmasq service with `systemctl start dnsmasq.service`.
  * Add *prepend domain-name-servers 127.0.0.1;* to **/etc/dhclient-eth0.conf**.
  * Restart the network service with `service network restart`, to set the cache as the local DNS resolver.

> [!NOTE]
> The dnsmasq package is only one of many DNS caches available for Linux. Before using it, check its suitability for your particular needs, and check that no other cache is installed.

    
### Client-side retries

DNS is primarily a UDP protocol. Because the UDP protocol doesn't guarantee message delivery, retry logic is handled in the DNS protocol itself. Each DNS client (operating system) can exhibit different retry logic, depending on the creator's preference:

* Windows operating systems retry after one second, and then again after another two seconds, four seconds, and another four seconds. 
* The default Linux setup retries after five seconds. We recommend changing the retry specifications to five times, at one-second intervals.

Check the current settings on a Linux VM with `cat /etc/resolv.conf`. Look at the *options* line, for example:

```bash
options timeout:1 attempts:5
```

The resolv.conf file is usually auto-generated, and should not be edited. The specific steps for adding the *options* line vary by distribution:

* **Ubuntu** (uses resolvconf):
  1. Add the *options* line to **/etc/resolvconf/resolv.conf.d/tail**.
  2. Run `resolvconf -u` to update.
* **SUSE** (uses netconf):
  1. Add *timeout:1 attempts:5* to the **NETCONFIG_DNS_RESOLVER_OPTIONS=""** parameter in **/etc/sysconfig/network/config**.
  2. Run `netconfig update` to update.
* **CentOS** (uses NetworkManager):
  1. Add *echo "options timeout:1 attempts:5"* to **/etc/NetworkManager/dispatcher.d/11-dhclient**.
  2. Update with `service network restart`.

## Name resolution that uses your own DNS server

This section covers VMs, role instances, and web apps.

### VMs and role instances

Your name resolution needs might go beyond the features provided by Azure. For example, you might need to use Microsoft Windows Server Active Directory domains, resolve DNS names between virtual networks. To cover these scenarios, Azure provides the ability for you to use your own DNS servers.

DNS servers within a virtual network can forward DNS queries to the recursive resolvers in Azure. This enables you to resolve host names within that virtual network. For example, a domain controller (DC) running in Azure can respond to DNS queries for its domains, and forward all other queries to Azure. Forwarding queries allows VMs to see both your on-premises resources (via the DC) and Azure-provided host names (via the forwarder). Access to the recursive resolvers in Azure is provided via the virtual IP 168.63.129.16.

DNS forwarding also enables DNS resolution between virtual networks, and allows your on-premises machines to resolve Azure-provided host names. In order to resolve a VM's host name, the DNS server VM must reside in the same virtual network, and be configured to forward host name queries to Azure. Because the DNS suffix is different in each virtual network, you can use conditional forwarding rules to send DNS queries to the correct virtual network for resolution. The following image shows two virtual networks and an on-premises network doing DNS resolution between virtual networks, by using this method. An example DNS forwarder is available in the [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/301-dns-forwarder/) and [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/301-dns-forwarder).

> [!NOTE]
> A role instance can perform name resolution of VMs within the same virtual network. It does so by using the FQDN, which consists of the VM's host name and **internal.cloudapp.net** DNS suffix. However, in this case, name resolution is only successful if the role instance has the VM name defined in the [Role Schema (.cscfg file)](https://msdn.microsoft.com/library/azure/jj156212.aspx).
> `<Role name="<role-name>" vmName="<vm-name>">`
>
> Role instances that need to perform name resolution of VMs in another virtual network (FQDN by using the **internal.cloudapp.net** suffix) have to do so by using the method described in this section (custom DNS servers forwarding between the two virtual networks).
>

![Diagram of DNS between virtual networks](./media/virtual-networks-name-resolution-for-vms-and-role-instances/inter-vnet-dns.png)

When you are using Azure-provided name resolution, Azure Dynamic Host Configuration Protocol (DHCP) provides an internal DNS suffix (**.internal.cloudapp.net**) to each VM. This suffix enables host name resolution because the host name records are in the **internal.cloudapp.net** zone. When you are using your own name resolution solution, this suffix is not supplied to VMs because it interferes with other DNS architectures (like domain-joined scenarios). Instead, Azure provides a non-functioning placeholder (*reddog.microsoft.com*).

If necessary, you can determine the internal DNS suffix by using PowerShell or the API:

* For virtual networks in Azure Resource Manager deployment models, the suffix is available via the [network interface REST API](https://docs.microsoft.com/rest/api/virtualnetwork/networkinterfaces), the [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) PowerShell cmdlet, and the [az network nic show](/cli/azure/network/nic#az-network-nic-show) Azure CLI command.
* In classic deployment models, the suffix is available via the [Get Deployment API](https://msdn.microsoft.com/library/azure/ee460804.aspx) call or the [Get-AzureVM -Debug](/powershell/module/servicemanagement/azure/get-azurevm) cmdlet.

If forwarding queries to Azure doesn't suit your needs, you should provide your own DNS solution. Your DNS solution needs to:

* Provide appropriate host name resolution, via [DDNS](virtual-networks-name-resolution-ddns.md), for example. If you are using DDNS, you might need to disable DNS record scavenging. Azure DHCP leases are long, and scavenging might remove DNS records prematurely. 
* Provide appropriate recursive resolution to allow resolution of external domain names.
* Be accessible (TCP and UDP on port 53) from the clients it serves, and be able to access the internet.
* Be secured against access from the internet, to mitigate threats posed by external agents.

> [!NOTE]
> For best performance, when you are using Azure VMs as DNS servers, IPv6 should be disabled.

### Web apps
Suppose you need to perform name resolution from your web app built by using App Service, linked to a virtual network, to VMs in the same virtual network. In addition to setting up a custom DNS server that has a DNS forwarder that forwards queries to Azure (virtual IP 168.63.129.16), perform the following steps:
1. Enable virtual network integration for your web app, if not done already, as described in [Integrate your app with a virtual network](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. In the Azure portal, for the App Service plan hosting the web app, select **Sync Network** under **Networking**, **Virtual Network Integration**.

    ![Screenshot of virtual network name resolution](./media/virtual-networks-name-resolution-for-vms-and-role-instances/webapps-dns.png)

If you need to perform name resolution from your web app built by using App Service, linked to a virtual network, to VMs in a different virtual network, you have to use custom DNS servers on both virtual networks, as follows:

* Set up a DNS server in your target virtual network, on a VM that can also forward queries to the recursive resolver in Azure (virtual IP 168.63.129.16). An example DNS forwarder is available in the [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/301-dns-forwarder) and [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/301-dns-forwarder). 
* Set up a DNS forwarder in the source virtual network on a VM. Configure this DNS forwarder to forward queries to the DNS server in your target virtual network.
* Configure your source DNS server in your source virtual network's settings.
* Enable virtual network integration for your web app to link to the source virtual network, following the instructions in [Integrate your app with a virtual network](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
* In the Azure portal, for the App Service plan hosting the web app, select **Sync Network** under **Networking**, **Virtual Network Integration**.

## Specify DNS servers
When you are using your own DNS servers, Azure provides the ability to specify multiple DNS servers per virtual network. You can also specify multiple DNS servers per network interface (for Azure Resource Manager), or per cloud service (for the classic deployment model). DNS servers specified for a network interface or cloud service get precedence over DNS servers specified for the virtual network.

> [!NOTE]
> Network connection properties, such as DNS server IPs, should not be edited directly within VMs. This is because they might get erased during service heal when the virtual network adaptor gets replaced. This applies to both Windows and Linux VMs.

When you are using the Azure Resource Manager deployment model, you can specify DNS servers for a virtual network and a network interface. For details, see [Manage a virtual network](manage-virtual-network.md) and [Manage a network interface](virtual-network-network-interface.md).

> [!NOTE]
> If you opt for custom DNS server for your virtual network, you must specify at least one DNS server IP address; otherwise, virtual network will ignore the configuration and use Azure-provided DNS instead.

When you are using the classic deployment model, you can specify DNS servers for the virtual network in the Azure portal or the [Network Configuration file](https://msdn.microsoft.com/library/azure/jj157100). For cloud services, you can specify DNS servers via the [Service Configuration file](https://msdn.microsoft.com/library/azure/ee758710) or by using PowerShell, with [New-AzureVM](/powershell/module/servicemanagement/azure/new-azurevm).

> [!NOTE]
> If you change the DNS settings for a virtual network or virtual machine that is already deployed, for the new DNS settings to take effect, you must perform a DHCP lease renewal on all affected VMs in the virtual network. For VMs running the Windows OS, you can do this by typing `ipconfig /renew` directly in the VM. The steps vary depending on the OS. See the relevant documentation for your OS type.

## Next steps

Azure Resource Manager deployment model:

* [Manage a virtual network](manage-virtual-network.md)
* [Manage a network interface](virtual-network-network-interface.md)

Classic deployment model:

* [Azure Service Configuration Schema](https://msdn.microsoft.com/library/azure/ee758710)
* [Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100)
* [Configure a Virtual Network by using a network configuration file](virtual-networks-using-network-configuration-file.md)
