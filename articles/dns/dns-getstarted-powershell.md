---
title: 'Quickstart: Create an Azure DNS zone and record - Azure PowerShell'
titleSuffix: Azure DNS
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step quickstart to create and manage your first DNS zone and record using Azure PowerShell.
services: dns
author: rohinkoul
ms.author: rohink
ms.date: 10/20/2020
ms.topic: quickstart
ms.service: dns
ms.custom:
  - devx-track-azurepowershell
  - mode-api
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS using Azure PowerShell so I can use Azure DNS for my name resolution.
---

# Quickstart: Create an Azure DNS zone and record using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

In this quickstart, you create your first DNS zone and record using Azure PowerShell. You can also perform these steps using the [Azure portal](dns-getstarted-portal.md) or the [Azure CLI](dns-getstarted-cli.md). 

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. Finally, to publish your DNS zone to the Internet, you need to configure the name servers for the domain. Each of these steps is described below.

Azure DNS also supports creating private domains. For step-by-step instructions about how create your first private DNS zone and record, see [Get started with Azure DNS private zones using PowerShell](private-dns-getstarted-powershell.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create the resource group

Before you create the DNS zone, create a resource group to contain the DNS zone:

```powershell
New-AzResourceGroup -name MyResourceGroup -location "eastus"
```

## Create a DNS zone

A DNS zone is created by using the `New-AzDnsZone` cmdlet. The following example creates a DNS zone called *contoso.xyz* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```powershell
New-AzDnsZone -Name contoso.xyz -ResourceGroupName MyResourceGroup
```

## Create a DNS record

You create record sets by using the `New-AzDnsRecordSet` cmdlet. The following example creates a record with the relative name "www" in the DNS Zone "contoso.xyz", in resource group "MyResourceGroup". The fully qualified name of the record set is "www.contoso.xyz". The record type is "A", with IP address "10.10.10.10", and the TTL is 3600 seconds.

```powershell
New-AzDnsRecordSet -Name www -RecordType A -ZoneName contoso.xyz -ResourceGroupName MyResourceGroup -Ttl 3600 -DnsRecords (New-AzDnsRecordConfig -IPv4Address "10.10.10.10")
```

## View records

To list the DNS records in your zone, use:

```powershell
Get-AzDnsRecordSet -ZoneName contoso.xyz -ResourceGroupName MyResourceGroup
```

## Test the name resolution

Now that you have a test DNS zone with a test 'A' record, you can test the name resolution with a tool called *nslookup*. 

**To test DNS name resolution:**

1. Run the following cmdlet to get the list of name servers for your zone:

   ```azurepowershell
   Get-AzDnsRecordSet -ZoneName contoso.xyz -ResourceGroupName MyResourceGroup -RecordType ns
   ```

1. Copy one of the name server names from the output of the previous step.

1. Open a command prompt, and run the following command:

   ```
   nslookup www.contoso.xyz <name server name>
   ```

   For example:

   ```
   nslookup www.contoso.xyz ns1-08.azure-dns.com.
   ```

   You should see something like the following screen:

   ![Screenshot shows a command prompt window with an n s lookup command and values for Server, Address, Name, and Address.](media/dns-getstarted-portal/nslookup.PNG)

The host name **www\.contoso.xyz** resolves to **10.10.10.10**, just as you configured it. This result verifies that name resolution is working correctly.

## Clean up resources

When no longer needed, you can delete all resources created in this quickstart by deleting the resource group:

```powershell
Remove-AzResourceGroup -Name MyResourceGroup
```

## Next steps

Now that you've created your first DNS zone and record using Azure PowerShell, you can create records for a web app in a custom domain.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
