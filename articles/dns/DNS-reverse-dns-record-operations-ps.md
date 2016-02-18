<properties 
   pageTitle="How to manage reverse DNS records for your services using PowerShell in Resource Manager | Microsoft Azure"
   description="How to create reverse DNS records for Azure services  using PowerShell in Resource Manager"
   services="DNS"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="DNS"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/16/2016"
   ms.author="joaoma" />

# How to manage reverse DNS records for your services using PowerShell

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-arm-selectors-include.md](../../includes/DNS-reverse-dns-record-operations-arm-selectors-include.md)]


[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](DNS-reverse-dns-record-operations-classic-ps.md).

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-scenario-include.md](../../includes/DNS-reverse-dns-record-operations-scenario-include.md)]

To perform the steps in this article, you'll need to [install the Azure Command-Line Interface for Mac, Linux, and Windows (Azure CLI)](xplat-cli-install.md) and you'll need to [log on to Azure](xplat-cli-connect.md). 

## What are reverse DNS records?
Reverse DNS records are used in a variety of situations to weakly authenticate the caller. For example, reverse DNS records are widely used in combating email spam through by verifying that the sender of an email message did so from a host for which there was a reverse DNS record, and optionally, where that host was recognized as one that was authorized to send email from the originating domain.

Reverse DNS records, or PTR records, are DNS record types that enable the translation of a publically routable IP back to a name. In DNS, names, such as app1.contoso.com, are resolved to IPs in a process that is called forward resolution. With reverse DNS, this process is reversed to enable the resolution of the name given the publically routable IP.

The Internet Assigned Numbers Authority (IANA) is the organization responsible for managing the available publically routable IP space. The IANA allocate contiguous blocks of publically routable IPs to registries who sub-divide those blocks into smaller contiguous blocks that are allocated to other registries, ISPs or to larger companies. The reverse DNS hierarchy models those allocations and sub-allocations through DNS delegations. Those delegations enable the reverse resolution of any given IP by following the delegation chain from the IANA to the delegated authority for that IP.
For more information on Reverse DNS records, please see [here](http://en.wikipedia.org/wiki/Reverse_DNS_lookup).

## How does Azure support reverse DNS records for your Azure services?
Microsoft works with a number of registries to secure an adequate supply of publically routable IP blocks. Each of these blocks is then delegated to Microsoft-owned and operated authoritative DNS servers. Microsoft hosts the reverse DNS zones for all publically routable IP blocks assigned to it; Microsoft does not support the onward delegation of these IP blocks to customers’ own authoritative DNS servers.

Azure enables Azure customers to specify a custom fully-qualified domain name (FQDN) for public routable IPs assigned to that customer. These custom FQDNs will then be returned from and reverse DNS lookup for that IP. 
Azure provides reverse DNS support for all assigned publically routable IPs at no additional cost, and for services deployed using the ASM and newer ARM deployment models.


## Add a reverse DNS record to an existing Public IP address
You can add reverse DNS to an existing Public IP Address using the “Set-AzureRmPublicIpAddress” cmdlet.

	PS C:\> $pip = Get-AzureRmPublicIpAddress -Name PublicIP -ResourceGroupName NRP-DemoRG-PS
	PS C:\> $pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
	PS C:\> Set-AzureRmPublicIpAddress -PublicIpAddress $pip 

## Create a new Public IP Address with reverse DNS record
You can add a new Public IP Address with the reverse DNS property specified using the “New-AzureRmPublicIpAddress” cmdlet.

	PS C:\> New-AzureRmPublicIpAddress -Name PublicIP2 -ResourceGroupName NRP-DemoRG-PS -Location WestUS -AllocationMethod Dynamic -DomainNameLabel "contosoapp2" -ReverseFqdn "contosoapp2.westus.cloudapp.azure.com."
 
## View a reverse DNS record  for an existing Public IP address
You can view the configured value for an existing Public IP Address using the “Get-AzureRmPublicIpAddress” cmdlet.

	PS C:\> Get-AzureRmPublicIpAddress -Name PublicIP2 -ResourceGroupName NRP-DemoRG-PS 

## Remove a reverse DNS record from existing Public IP address
You can remove a reverse DNS property from an existing Public IP Address using the “Set-AzureRmPublicIpAddress” cmdlet. This is done by setting the ReverseFqdn property value to blank.

	PS C:\> $pip = Get-AzureRmPublicIpAddress -Name PublicIP -ResourceGroupName NRP-DemoRG-PS
	PS C:\> $pip.DnsSettings.ReverseFqdn = ""
	PS C:\> Set-AzureRmPublicIpAddress -PublicIpAddress $pip 

## Validation of reverse DNS records 
To ensure a third party can’t create reverse DNS records mapping to your DNS domains, Azure only allows the creation of a reverse DNS record where one of the following is true:

- The “ReverseFqdn” is the same as the “Fqdn” for the Public IP Address resource for which it has been specified, or the “Fqdn” for any Public IP Address within the same subscription e.g., “ReverseFqdn” is “contosoapp1.northus.cloudapp.azure.com.”.

- The “ReverseFqdn” forward resolves to the name or IP of the Public IP Address for which it has been specified, or to any Public IP Address “Fqdn” or IP within the same subscription e.g., “ReverseFqdn” is “app1.contoso.com.” which is a CName alias for “contosoapp1.northus.cloudapp.azure.com.”
Validation checks are only performed when the reverse DNS property for a Public IP Address is set or modified. Periodic re-validation is not performed.


[FAQ](../../includes/DNS-reverse-dns-record-operations-faq-include.md)