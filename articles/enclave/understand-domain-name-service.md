---
title: Understanding Domain Name Service in Azure Enclave
description: Understanding DNS in Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 08/07/2026
---

# Understanding DNS in Azure Enclave

New [enclaves](./what-enclave.md) use Azure-provided DNS by default, or you can configure custom DNS servers for them. For instructions, see [Create an enclave in the Azure portal](./create-enclave-portal.md#update-dns-servers).

Workloads and resources created in enclaves follow existing [name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

## Common Design Patterns

Some enterprise systems require more control over DNS resolution and need a custom, customer-managed DNS solution for all resources in a community. This requirement arises when you use a custom DNS server that isn't configured to forward queries about private endpoints to Azure DNS. In these scenarios, Azure Enclave advises you to:

- **Deploy a DNS solution** as a [workload](./what-workload.md) within an enclave. An example solution is deploying an Active Directory Domain Controller [Virtual Machine](https://aka.ms/vm).
- Configure the private IP address of the DNS server that workloads should use as a custom DNS server for each enclave. If you use an enclave-local forwarder, specify the forwarder's private IP address.
- Deploy a DNS resolver or forwarder Virtual Machine in each enclave to handle local private endpoint resolution.
- Connect to each DNS resolver VM and manually add conditional forwarder DNS zone records for private endpoint resources in that enclave. This configuration enables the custom DNS server to forward queries it can't resolve directly to Azure DNS (168.63.129.16).

## Steps to manually add private endpoint DNS records to an enclave DNS forwarder VM

1. Log in to the DNS server, and open a PowerShell Window 
1. Run the following commands:

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

In your PowerShell window. This should return an IP address (using `privatelink.azurewebsites.net` as the name of the private link).

## References
- [Name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances)
