---
title: Reverse DNS for Azure services - Azure DNS
description: With this learning path, get started configuring reverse DNS lookups for services hosted in Azure.
services: dns
documentationcenter: na
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/27/2022
ms.author: greglin 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure reverse DNS for services hosted in Azure

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This article explains how to configure reverse DNS lookups for services hosted in Azure.

Services in Azure use IP addresses assigned by Azure and owned by Microsoft. These reverse DNS records (PTR records) must be created in the corresponding Microsoft-owned reverse DNS lookup zones.

This scenario differs from the ability to [host the reverse DNS lookup zones](dns-reverse-dns-hosting.md) for your assigned IP ranges in Azure DNS. In this case, the IP ranges represented by the reverse lookup zone must be assigned to your organization, typically by your ISP.

Before reading this article, you should familiarize yourself with [reverse DNS in Azure DNS](dns-reverse-dns-overview.md).

In Azure DNS, compute resources such as virtual machines, virtual machine scale sets, and Service Fabric clusters have Public IP addresses. Reverse DNS lookups are configured using the 'ReverseFqdn' property of the Public IP address.

Reverse DNS is currently not supported for the Azure App Service and Application Gateway.

## Validation of reverse DNS records

A third party shouldn't have access to create reverse DNS records for Azure service mapping to your DNS domains. That's why Azure only allows you to create a reverse DNS record if the domain name is the same or resolves to a Public IP address in the same subscription. This restriction also applies to Cloud Service.

This validation is only done when the reverse DNS record is set or modified. Periodic revalidation isn't done.

For example, suppose the Public Ip address resource has the DNS name `contosoapp1.northus.cloudapp.azure.com` and IP address `23.96.52.53`. The reverse FQDN for the Public IP address can be specified as:

* The DNS name for the Public IP address: `contosoapp1.northus.cloudapp.azure.com`.
* The DNS name for a different PublicIpAddress in the same subscription, such as: `contosoapp2.westus.cloudapp.azure.com`.
* A vanity DNS name, such as: `app1.contoso.com`. As long as the name is *first* configured as a CNAME pointing to `contosoapp1.northus.cloudapp.azure.com`. The name can also be pointed to a different Public IP address in the same subscription.
* A vanity DNS name, such as: `app1.contoso.com`. As long as this name is *first* configured as an A record pointing to the IP address 23.96.52.53. The name can also be pointed to another IP address in the same subscription.

The same constraints apply to reverse DNS for Cloud Services.

## Reverse DNS for Public IP address resources

This section provides detailed instructions for how to configure reverse DNS for Public IP address resources in the Resource Manager deployment model. You can use either Azure PowerShell, Azure classic CLI, or Azure CLI to accomplish this task. Configuring reverse DNS for a Public IP address resource is currently not supported in the Azure portal.

Azure currently supports reverse DNS only for Public IPv4 address resources.

### Add reverse DNS to an existing PublicIpAddresses

#### Azure PowerShell

To update reverse DNS to an existing PublicIpAddress:

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzPublicIpAddress -PublicIpAddress $pip
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings = New-Object -TypeName "Microsoft.Azure.Commands.Network.Models.PSPublicIpAddressDnsSettings"
$pip.DnsSettings.DomainNameLabel = "contosoapp1"
$pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
Set-AzPublicIpAddress -PublicIpAddress $pip
```

#### Azure Classic CLI

To add reverse DNS to an existing PublicIpAddress:

```azurecli
azure network public-ip set -n PublicIp -g MyResourceGroup -f contosoapp1.westus.cloudapp.azure.com.
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```azurecli-interactive
azure network public-ip set -n PublicIp -g MyResourceGroup -d contosoapp1 -f contosoapp1.westus.cloudapp.azure.com.
```

#### Azure CLI

To add reverse DNS to an existing PublicIpAddress:

```azurecli-interacgive
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com.
```

To add reverse DNS to an existing PublicIpAddress that doesn't already have a DNS name, you must also specify a DNS name:

```azurecli-interactive
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn contosoapp1.westus.cloudapp.azure.com --dns-name contosoapp1
```

### Create a Public IP Address with reverse DNS

To create a new PublicIpAddress with the reverse DNS property already specified:

#### Azure PowerShell

```azurepowershell-interactive
New-AzPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup" -Location "WestUS" -AllocationMethod Dynamic -DomainNameLabel "contosoapp2" -ReverseFqdn "contosoapp2.westus.cloudapp.azure.com."
```

#### Azure Classic CLI

```azurecli
azure network public-ip create -n PublicIp -g MyResourceGroup -l westus -d contosoapp3 -f contosoapp3.westus.cloudapp.azure.com.
```

#### Azure CLI

```azurecli-interactive
az network public-ip create --name PublicIp --resource-group MyResourceGroup --location westcentralus --dns-name contosoapp1 --reverse-fqdn contosoapp1.westcentralus.cloudapp.azure.com
```

### View reverse DNS for an existing PublicIpAddress

To view the configured value for an existing PublicIpAddress:

#### Azure PowerShell

```azurepowershell-interactive
Get-AzPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
```

#### Azure Classic CLI

```azurecli
azure network public-ip show -n PublicIp -g MyResourceGroup
```

#### Azure CLI

```azurecli-interactive
az network public-ip show --name PublicIp --resource-group MyResourceGroup
```

### Remove reverse DNS from existing Public IP Addresses

To remove a reverse DNS property from an existing PublicIpAddress:

#### Azure PowerShell

```azurepowershell-interactive
$pip = Get-AzPublicIpAddress -Name "PublicIp" -ResourceGroupName "MyResourceGroup"
$pip.DnsSettings.ReverseFqdn = ""
Set-AzPublicIpAddress -PublicIpAddress $pip
```

#### Azure Classic CLI

```azurecli
azure network public-ip set -n PublicIp -g MyResourceGroup –f ""
```

#### Azure CLI

```azurecli-interactive
az network public-ip update --resource-group MyResourceGroup --name PublicIp --reverse-fqdn ""
```

## Configure reverse DNS for Cloud Services

This section provides detailed instructions for how to configure reverse DNS for Cloud Services in the Classic deployment model, using Azure PowerShell. Configuring reverse DNS for Cloud Services isn't supported via the Azure portal, Azure classic CLI, or Azure CLI.

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

They're free! There's no extra cost for reverse DNS records or queries.

### Will my reverse DNS records resolve from the internet?

Yes. Once you set the reverse DNS property for your Azure service, Azure manages all the DNS delegations and DNS zones needed to ensure it resolves for all internet users.

### Are default reverse DNS records created for my Azure services?

No. Reverse DNS is an opt-in feature. No default reverse DNS records are created if you choose not to configure them.

### What is the format for the fully qualified domain name (FQDN)?

FQDNs are specified in forward order, and must be terminated by a dot (for example, "app1.contoso.com.").

### What happens if the validation check for the reverse DNS I've specified fails?

Where the reverse DNS validation check fails, the operation to configure the reverse DNS record fails. Correct the reverse DNS value as required, and retry.

### Can I configure reverse DNS for Azure App Service?

No. Reverse DNS isn't supported for the Azure App Service.

### Can I configure multiple reverse DNS records for my Azure service?

No. Azure supports a single reverse DNS record for each Azure Cloud Service or PublicIpAddress.

### Can I configure reverse DNS for IPv6 PublicIpAddress resources?

No. Azure currently supports reverse DNS only for IPv4 PublicIpAddress resources and Cloud Services.

### Can I send emails to external domains from my Azure Compute services?

The technical ability to send email directly from an Azure deployment depends on the subscription type. No matter the subscription type, Microsoft recommends using trusted mail relay services to send outgoing mail. For more information, see [Enhanced Azure Security for sending Emails – November 2017 Update](../virtual-network/troubleshoot-outbound-smtp-connectivity.md).

## Next steps

* For more information on reverse DNS, see [reverse DNS lookup on Wikipedia](https://en.wikipedia.org/wiki/Reverse_DNS_lookup).
* Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-hosting.md).
