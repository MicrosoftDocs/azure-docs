---
title: Reverse DNS for Azure services | Microsoft Docs
description: Learn how to configure reverse DNS lookups for services hosted in Azure
services: dns
documentationcenter: na
author: vhorne
manager: timlt

ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/29/2017
ms.author: victorh
---

# Configure reverse DNS for services hosted in Azure

This article explains how to configure reverse DNS lookups for services hosted in Azure.

Services in Azure use IP addresses assigned by Azure and owned by Microsoft. These reverse DNS records (PTR records) must be created in the corresponding Microsoft-owned reverse DNS lookup zones. This article explains how to do this.

This scenario should not be confused with the ability to [host the reverse DNS lookup zones for your assigned IP ranges in Azure DNS](dns-reverse-dns-hosting.md). In this case, the IP ranges represented by the reverse lookup zone must be assigned to your organization, typically by your ISP.

Before reading this article, you should be familiar with this [Overview of reverse DNS and support in Azure](dns-reverse-dns-overview.md).

In Azure DNS, compute resources (such as virtual machines, virtual machine scale sets, or Service Fabric clusters) are exposed via a PublicIpAddress resource. Reverse DNS lookups are configured using the 'ReverseFqdn' property of the PublicIpAddress.


Reverse DNS is not currently supported for the Azure App Service.

## Validation of reverse DNS records

A third party should not be able to create reverse DNS records for their Azure service mapping to your DNS domains. To prevent this, Azure only allows the creation of a reverse DNS record where domain name specified in the reverse DNS record is the same as, or resolves to, the DNS name or IP address of a PublicIpAddress or Cloud Service in the same Azure subscription.

This validation is only performed when the reverse DNS record is set or modified. Periodic re-validation is not performed.

For example: suppose the PublicIpAddress resource has the DNS name contosoapp1.northus.cloudapp.azure.com and IP address 23.96.52.53. The ReverseFqdn for the PublicIpAddress can be specified as:
* The DNS name for the PublicIpAddress, contosoapp1.northus.cloudapp.azure.com
* The DNS name for a different PublicIpAddress in the same subscription, such as contosoapp2.westus.cloudapp.azure.com
* A vanity DNS name, such as app1.contoso.com, so long as this name is *first* configured as a CNAME to contosoapp1.northus.cloudapp.azure.com, or to a different PublicIpAddress in the same subscription.
* A vanity DNS name, such as app1.contoso.com, so long as this name is *first* configured as an A record to the IP address 23.96.52.53, or to the IP address of a different PublicIpAddress in the same subscription.

The same constraints apply to reverse DNS for Cloud Services.


## Reverse DNS for PublicIpAddress resources

This section provides detailed instructions for how to configure reverse DNS for PublicIpAddress resources in the Resource Manager deployment model, using either Azure PowerShell, Azure classic CLI, or Azure CLI. Configuring reverse DNS for PublicIpAddress resources is not currently supported via the Azure portal.

Azure currently supports reverse DNS only for IPv4 PublicIpAddress resources. It is not supported for IPv6.

### Add reverse DNS to an existing PublicIpAddresses

#### PowerShell

To add reverse DNS to an existing PublicIpAddress:

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings = New-Object -TypeName "Microsoft.Azure.Commands.Network.Models.PSPublicIpAddressDnsSettings"
$pip.DnsSettings.DomainNameLabel = "contosoapp1"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

#### Azure classic CLI

To add reverse DNS to an existing PublicIpAddress:

```azurecli
azure network public-ip set -n PublicIp -g MyResourceGroup -f contosoapp1.westus.cloudapp.azure.com.
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```azurecli
azure network public-ip set -n PublicIp -g MyResourceGroup -d contosoapp1 -f contosoapp1.westus.cloudapp.azure.com.
```

#### Azure CLI

To add reverse DNS to an existing PublicIpAddress:

```azurecli
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com.
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```azurecli
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com --dns-name contosoapp1
```

### Create a Public IP Address with reverse DNS

To create a new PublicIpAddress with the reverse DNS property already specified:

#### PowerShell

```powershell
New-AzureRmPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup" -Location "WestUS" -AllocationMethod Dynamic -DomainNameLabel "contosoapp2" -ReverseFqdn "contosoapp2.westus.cloudapp.azure.com."
```

#### Azure classic CLI

```azurecli
azure network public-ip create -n PublicIp -g MyResourceGroup -l westus -d contosoapp3 -f contosoapp3.westus.cloudapp.azure.com.
```

#### Azure CLI

```azurecli
az network public-ip create --name PublicIp --resource-group MyResourceGroup --location westcentralus --dns-name contosoapp1 --reverse-fqdn contosoapp1.westcentralus.cloudapp.azure.com
```

### View reverse DNS for an existing PublicIpAddress

To view the configured value for an existing PublicIpAddress:

#### PowerShell

```powershell
Get-AzureRmPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
```

#### Azure classic CLI

```azurecli
azure network public-ip show -n PublicIp -g MyResourceGroup
```

#### Azure CLI

```azurecli
az network public-ip show --name PublicIp --resource-group MyResourceGroup
```

### Remove reverse DNS from existing Public IP Addresses

To remove a reverse DNS property from an existing PublicIpAddress:

#### PowerShell

```powershell
$pip = Get-AzureRmPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings.ReverseFqdn = ""
Set-AzureRmPublicIpAddress -PublicIpAddress $pip
```

#### Azure classic CLI

```azurecli
azure network public-ip set -n PublicIp -g MyResourceGroup –f ""
```

#### Azure CLI

```azurecli
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn ""
```


## Configure reverse DNS for Cloud Services

This section provides detailed instructions for how to configure reverse DNS for Cloud Services in the Classic deployment model, using Azure PowerShell. Configuring reverse DNS for Cloud Services is not supported via the Azure portal, Azure classic CLI, or Azure CLI.

### Add reverse DNS to existing Cloud Services

To add a reverse DNS record to an existing Cloud Service:

```powershell
Set-AzureService –ServiceName "contosoapp1" –Description "App1 with Reverse DNS" –ReverseDnsFqdn "contosoapp1.cloudapp.net."
```

### Create a Cloud Service with reverse DNS

To create a new Cloud Service with the reverse DNS property already specified:

```powershell
New-AzureService –ServiceName "contosoapp1" –Location "West US" –Description "App1 with Reverse DNS" –ReverseDnsFqdn "contosoapp1.cloudapp.net."
```

### View reverse DNS for existing Cloud Services

To view the reverse DNS property for an existing Cloud Service:

```powershell
Get-AzureService "contosoapp1"
```

### Remove reverse DNS from existing Cloud Services

To remove a reverse DNS property from an existing Cloud Service:

```powershell
Set-AzureService –ServiceName "contosoapp1" –Description "App1 with Reverse DNS" –ReverseDnsFqdn ""
```

## FAQ

### How much do reverse DNS records cost?

They're free!  There is no additional cost for reverse DNS records or queries.

### Will my reverse DNS records resolve from the internet?

Yes. Once you set the reverse DNS property for your Azure service, Azure manages all the DNS delegations and DNS zones required to ensure that reverse DNS record resolves for all Internet users.

### Are default reverse DNS records created for my Azure services?

No. Reverse DNS is an opt-in feature. No default reverse DNS records are created if you choose not to configure them.

### What is the format for the fully-qualified domain name (FQDN)?

FQDNs are specified in forward order, and must be terminated by a dot (for example, "app1.contoso.com.").

### What happens if the validation check for the reverse DNS I've specified fails?

Where the reverse DNS validation check fails, the operation to configure the reverse DNS record fails. Correct the reverse DNS value as required, and retry.

### Can I configure reverse DNS for Azure App Service?

No. Reverse DNS is not supported for the Azure App Service.

### Can I configure multiple reverse DNS records for my Azure service?

No. Azure supports a single reverse DNS record for each Azure Cloud Service or PublicIpAddress.

### Can I configure reverse DNS for IPv6 PublicIpAddress resources?

No. Azure currently supports reverse DNS only for IPv4 PublicIpAddress resources and Cloud Services.

### Can I send emails to external domains from my Azure Compute services?

The technical ability to send email directly from an Azure deployment depends on the subscription type. Regardless of subscription type, Microsoft recommends using trusted mail relay services to send outgoing mail. For further details, see [Enhanced Azure Security for sending Emails – November 2017 Update](https://blogs.msdn.microsoft.com/mast/2017/11/15/enhanced-azure-security-for-sending-emails-november-2017-update/).

## Next steps

For more information on reverse DNS, see [reverse DNS lookup on Wikipedia](http://en.wikipedia.org/wiki/Reverse_DNS_lookup).
<br>
Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).

