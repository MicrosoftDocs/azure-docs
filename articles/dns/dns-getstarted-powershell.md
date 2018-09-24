---
title: Quickstart - Create an Azure DNS zone and record using Azure PowerShell
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step quickstart to create and manage your first DNS zone and record using Azure PowerShell.
services: dns
author: vhorne
ms.service: dns
ms.topic: quickstart
ms.date: 07/16/2018
ms.author: victorh
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS using Azure PowerShell so I can use Azure DNS for my Internet name resolution.
---

# Quickstart: Create an Azure DNS zone and record using Azure PowerShell

In this quickstart, you create your first DNS zone and record using Azure PowerShell. You can also perform these steps using the [Azure portal](dns-getstarted-portal.md) or the [Azure CLI](dns-getstarted-cli.md). 

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. Finally, to publish your DNS zone to the Internet, you need to configure the name servers for the domain. Each of these steps is described below.

Azure DNS also supports creating private domains. For step-by-step instructions about how create your first private DNS zone and record, see [Get started with Azure DNS private zones using PowerShell](private-dns-getstarted-powershell.md).

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create the resource group

Before you create the DNS zone, create a resource group to contain the DNS zone:

```powershell
New-AzureRMResourceGroup -name MyResourceGroup -location "eastus"
```

## Create a DNS zone

A DNS zone is created by using the `New-AzureRmDnsZone` cmdlet. The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```powershell
New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyResourceGroup
```

## Create a DNS record

You create record sets by using the `New-AzureRmDnsRecordSet` cmdlet. The following example creates a record with the relative name "www" in the DNS Zone "contoso.com", in resource group "MyResourceGroup". The fully qualified name of the record set is "www.contoso.com". The record type is "A", with IP address "1.2.3.4", and the TTL is 3600 seconds.

```powershell
New-AzureRmDnsRecordSet -Name www -RecordType A -ZoneName contoso.com -ResourceGroupName MyResourceGroup -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -IPv4Address "1.2.3.4")
```

## View records

To list the DNS records in your zone, use:

```powershell
Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyResourceGroup
```


## Update name servers

Once you are satisfied that your DNS zone and records have been set up correctly, you need to configure your domain name to use the Azure DNS name servers. This enables other users on the Internet to find your DNS records.

The name servers for your zone are given by the `Get-AzureRmDnsZone` cmdlet:

```powershell
Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyResourceGroup

Name                  : contoso.com
ResourceGroupName     : myresourcegroup
Etag                  : 00000003-0000-0000-b40d-0996b97ed101
Tags                  : {}
NameServers           : {ns1-01.azure-dns.com., ns2-01.azure-dns.net., ns3-01.azure-dns.org., ns4-01.azure-dns.info.}
NumberOfRecordSets    : 3
MaxNumberOfRecordSets : 5000
```

These name servers should be configured with the domain name registrar (where you purchased the domain name). Your registrar will offer the option to set up the name servers for the domain. For more information, see [Delegate your domain to Azure DNS](dns-domain-delegation.md).

## Delete all resources

When no longer needed, you can delete all resources created in this quickstart by deleting the resource group:

```powershell
Remove-AzureRMResourceGroup -Name MyResourceGroup
```

## Next steps

Now that you've created your first DNS zone and record using Azure PowerShell, you can create records for a web app in a custom domain.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

