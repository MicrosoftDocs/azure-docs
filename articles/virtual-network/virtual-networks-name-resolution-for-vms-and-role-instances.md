<properties 
   pageTitle="Resolution for VMs and Role Instances"
   description="Name Resolution scenarios for Azure IaaS , hybrid solutions, between different cloud services, Active Directory and using your own DNS server "
   services="virtual-network"
   documentationCenter="na"
   authors="joaoma"
   manager="jdial"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/10/2015"
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

- Name resolution is provided between role instances or VMs within the same cloud service without need for a FQDN.

- Name resolution is provided between VMs in ARM-based virtual networks without need for the FQDN, classic networks require the FQDN when resolving names in different cloud services. 

- You can create the hostnames that will best describe your deployments, rather than working with auto-generated names.

**Considerations:**

- Name resolution between virtual networks is not available.

- You can only register hostnames for VMs and role instances that reside in the first 180 cloud services added to an Azure virtual network. If you have more than 180 cloud services, independent of the number of VMs and role instances in each service, you need to provide your own DNS server for name resolution.

- Cross-premises name resolution is not available.

- The Azure-created DNS suffix cannot be modified.

- You cannot manually register your own records.

- WINS and NetBIOS are not supported. (You cannot list your virtual machines in the network browser in Windows Explorer.)

- Hostnames must be DNS-compatible (They must use only 0-9, a-z and '-', and cannot start or end with a '-'. See RFC 3696 section 2.)

- DNS query traffic is throttled per VM. If your application performs frequent DNS queries on multiple target names, it is possible that some queries may time out. To avoid that, it is recommended to enable client caching.  This is enabled by default on Windows but some Linux distros may not have caching enabled.

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

> [AZURE.NOTE] DNS servers in the service configuration file override settings in the network configuration file. 
 
The network configuration file describes the virtual networks in your subscripion. When you add role instances or VMs to a cloud service in a virtual network, the DNS settings from your network configuration file are applied to each role instance or VM unless cloud-service specific DNS servers have been specified.

The service configuration file is created for each cloud service that you add to Azure. When you add role instances or VMs to the cloud service, the DNS settings from your service configuration file are applied to each role instance or VM.



## Next steps

[Azure Service Configuration Schema](https://msdn.microsoft.com/library/azure/ee758710)

[Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100)

[About Configuring Virtual Network Settings in the Management Portal](virtual-networks-settings.md) 

[Configure a Virtual Network by Using a Network Configuration File](virtual-networks-using-network-configuration-file.md) 


