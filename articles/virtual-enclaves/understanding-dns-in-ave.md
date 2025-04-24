---
title: Understanding DNS in AVE
description: Understanding DNS in AVE.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Understanding DNS in Azure Virtual Enclaves

When creating a [community](./what-community.md) using Azure Virtual Enclaves, you also specify a list of DNS servers. This list of DNS servers is then passed down to all [enclaves](./what-enclave.md) created within the community. 

Workloads and resources created in enclaves follow existing [name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

## Common Design Patterns
For some enterprise systems, this level of DNS doesn't fully satisfy all use-cases for a controlled, customer-managed, shared private DNS for all resources living in a community. This is because, by default, the enclave virtual networks wouldn't be able to resolve private endpoints within their own virtual network as they would be configured to use the DNS servers listed in the community. In these use-cases, AVE advises customers to:
1. **Deploy their own DNS solution** as a [workload](./what-workload.md) within an enclave. An example of this would be to deploy an Active Directory Domain Controller [Virtual Machine](https://aka.ms/vm).
   - In the future, AVE offers a [service catalog template](./what-service-catalog.md) for deploying a Domain Controller
2. Specify that Domain Controller VM's private IP address as a DNS server for their community.
3. For every enclave in your community, create DNS workloads where the workload consists of a DNS resolver/forwarder Virtual Machine 
   - In the future, AVE offers a [service catalog template](./what-service-catalog.md) for deploying a DNS forwarder
4. Connect to the DNS resolver Virtual Machine, and manually add conditional forwarder DNS zone records for every private endpoint resource in that enclave where the VM is hosted in. An example of doing so is detailed below.

## Steps to manually add private endpoint DNS records to an Enclave DNS forwarder VM

- Log in to the DNS server, and open a PowerShell Window 
- Run the following commands:

``` PowerShell
$AzureDnsIpAddress = '168.63.129.16'
$dnsZone = '' #Insert the name of your private link
Add-DnsServerConditionalForwarderZone -Name $dnsZone -MasterServers $AzureDnsIpAddress
```

### Verification
Assuming no errors, you can validate by opening the DNS manager on the DNS server and validating the new private link you added shows up under the 'Conditional Forwarders' folder:
You can also ensure that the private link resolves to an IP address by running:

``` PowerShell
nslookup <insert the name of your private link>
```

In your PowerShell window. This should return an IP address (using `privatelink.azurewebsites.us` as the name of the private link).

## References
- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)
