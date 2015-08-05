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
   ms.date="06/30/2015"
   ms.author="joaoma" />

# Name Resolution for VMs and Role Instances

Depending on how you use Azure to host IaaS, PaaS, and hybrid solutions, you may need to allow VMs and role instances you create to communicate with other VMs and role instances. Although this communication can be done by using IP addresses, it is much simpler to use hostnames that can be easily remembered. However, these hostnames must be resolved to IP addresses in some way to establish communication.

When role instances and VMs hosted in Azure need to resolve hostnames and domain names to internal IP addresses, they can use one of two methods:

- [Azure-provided name resolution](azure-provided-name-resolution)

- [Name resolution using your own DNS server](name-resolution-using-your-own-DNS-server) 

The type of name resolution you use depends on how your VMs and role instances need to communicate within your cloud service and with other cloud services.

**The following table illustrates scenarios and corresponding name resolution solutions:**

| **Scenario**                                                                                         | **Name resolution provided by:**                                                                                                    | **For more information see:**                                                                                                                                                                                                                                                                                               |
|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name resolution between role instances or VMs located in the same cloud service                      | Azure-provided name resolution                                                                                                      | [Azure-provided name resolution](#azure-provided-name-resolution)                                                                                                                                                                                                                          |
| Name resolution between VMs and role instances located in the same virtual network                   | Azure-provided name resolution – using FQDNorName resolution using your own DNS server                                              | - [Azure-provided name resolution](#azure-provided-name-resolution)  - [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)  - [DNS server requirements](#dns-server-requirements) |
| Name resolution between VMs and role instances located in different virtual networks                 | Name resolution using your own DNS server                                                                                           | - [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)  - [DNS server requirements](#dns-server-requirements)                                                                                                       |
| Cross-premises: Name resolution between role instances or VMs in Azure and on-premises computers     | Name resolution using your own DNS server                                                                                           | - [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)  - [DNS server requirements](#dns-server-requirements)                                                                                                       |
| Reverse lookup of internal IPs                                                                       | Name resolution using your own DNS server                                                                                           | - [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)  - [DNS server requirements](#dns-server-requirements)                                                                                                  |
| Name resolution for custom domains (e.g. Active Directory domains, domains you register)             | Name resolution using your own DNS server                                                                                           | - [Name resolution using your own DNS server](#name-resolution-using-your-own-dns-server)  - [DNS server requirements](#dns-server-requirements)                                                                                                       |
| Name resolution between role instances located in different cloud services, not in a virtual network | Not applicable. Connectivity between VMs and role instances in different cloud services is not supported outside a virtual network. | Not applicable.                                                                                                                                                                                                                                                                                                             |

> [AZURE.NOTE] Name resolution between computers on the internet and your public endpoints is automatically provided by Azure, and requires no configuration.

## Azure-provided name resolution

Along with resolution for public internet domains, Azure provides hostname name resolution for VMs and role instances that reside in the same cloud service by using hostnames, and between VMs and role instances in different cloud services that reside on the same virtual network by using FQDNs. Although Azure-provided name resolution does not require any configuration, it is not the appropriate choice for all deployment scenarios, as seen on the table above.

> [AZURE.NOTE] In the case of web and worker roles, you can also access the internal IP addresses of role instances based on the role name and instance number using the Azure Service Management REST API. For more information, see [Service Management REST API Reference](https://msdn.microsoft.com/library/azure/ee460799.aspx).

### Features and Considerations

**Features:**

- Ease of use: No configuration is required in order to use the Azure-provided DNS service.

- Hostname resolution is provided between role instances or VMs within the same cloud service.

- Name resolution is provided between role instances and VMs located on the same virtual network, but in different cloud services, by using the FQDN of the target role instance or VM.

- You can create the hostnames that will best describe your deployments, rather than working with auto-generated names.

- Standard DNS lookups to resolve public domain names are supported.

**Considerations:**

- Name resolution between virtual networks is not available.

- You can only register hostnames and FQDNs for VMs and role instances that reside in the first 180 cloud services added to an Azure virtual network. If you have more than 180 cloud services, independent of the number of VMs and role instances in each service, you need to provide your own DNS server for name resolution.

- Use of multiple hostnames for the same virtual machine or role instance is not supported.

- Cross-premises name resolution is not available.

- The Azure-created DNS suffix cannot be modified.

- You cannot manually register your own records in Azure-provided DNS.

- WINS and NetBIOS are not supported. (You cannot list your virtual machines in the network browser in Windows Explorer.)

- Hostnames must be DNS-compatible (They must use only 0-9, a-z and '-', and cannot start or end with a '-'. See RFC 3696 section 2.)

- DNS query traffic is throttled per VM. If your application performs frequent DNS queries on multiple target names, it is possible that some queries may time out. To avoid that, it is recommended to use client caching.

## Name resolution using your own DNS server

If your name resolution requirements go beyond the features provided by Azure, you have the option of using your own DNS server. When you use your own DNS server, you are responsible for managing the records necessary for your cloud services.

> [AZURE.NOTE] It is recommended to avoid the use of an external DNS server, unless your deployment scenario requires it.

## DNS server requirements

If you plan to use name resolution that is not provided by Azure, the DNS server that you specify must support the following:
The DNS server must accept dynamic DNS registration via Dynamic DNS (DDNS).

- The DNS server must have record scavenging turned off. Azure IP addresses have long leases, which can result in the removal of records on the DNS server during scavenging.

- The DNS server must have recursion enabled to allow resolution for external domain names.

- The DNS server must be accessible (on TCP/UDP port 53) by the clients requesting name resolution and by the services and virtual machines that will register their names.

- It is also recommended to secure the DNS server against access from the internet as many bots scan for open recursive DNS resolvers.


## Specifying DNS servers

You can specify multiple DNS servers to be used by your VMs and role instances. However, when you do so, DNS servers will be used in the order that they are specified in a failover manner (as opposed to round robin). For each DNS query the client will first try the preferred DNS server and only try the alternate servers if the preferred one doesn't respond. For this reason, verify that you have your DNS servers listed in the correct order for your environment.

> [AZURE.NOTE] If you change the DNS settings on a network configuration file for virtual network that is already deployed, you need to restart each VM for the changes to take effect.

### Specifying a DNS server by using the Management Portal

When you create your virtual network by using the Management Portal, you can specify the IP address and name of the DNS server (or servers) that you want to use. Once the virtual network is created, the virtual machines and role instances that you deploy to the virtual network are automatically configured with your specified DNS settings, unless you specify what DNS server(s) to use for the deployment. For more information about configuring settings for Azure Virtual Network, see [About Configuring a Virtual Network in the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx).

> [AZURE.NOTE] You can only use up to 9 DNS servers.

### Specifying a DNS server by using configuration files

You can specify DNS settings by using two different configuration files: the *Network Configuration* file and the *Service Configuration* file.

The network configuration file is created for each virtual network you add to Azure. When you add role instances or VMs to any cloud service in a virtual network, the DNS settings from your network configuration file are applied to the role instance or VM, unless the service configuration file has its own DNS settings.

The service configuration file is created for each cloud service you add the Azure. When you add role instances or VMs to the cloud service, the DNS settings from your service configuration file are applied to the role instance or VM.

> [AZURE.NOTE] Settings in the service configuration file override settings in the network configuration file. For instance, if a VM is added to a cloud service that is part of a virtual network, and both the network configuration file and the service configuration file have DNS settings, the DNS settings in the service configuration file are applied to the VM.


## See Also

[Azure Service Configuration Schema](https://msdn.microsoft.com/library/azure/ee758710)
[Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100)
[About Configuring Virtual Network Settings in the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx) 
[Configure a Virtual Network by Using a Network Configuration File](https://msdn.microsoft.com/library/azure/jj156097.aspx) 
[Azure Virtual Network Configuration Tasks](https://msdn.microsoft.com/library/azure/jj156206.aspx)

