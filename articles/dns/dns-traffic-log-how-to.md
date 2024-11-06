---
title: How to filter and view DNS traffic
description: Learn how to filter and view DNS traffic
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 11/06/2024
ms.author: greglin
---

# How to filter and view DNS traffic

This article shows you how to sign your DNS zone with [Domain Name System Security Extensions (DNSSEC)](dnssec.md). 

To remove DNSSEC signing from a zone, see [How to unsign your Azure Public DNS zone](dnssec-unsign.md).

> [!NOTE]
> DNS security policy is in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.<br>
> This DNS security policy preview is offered without a requirement to enroll in a preview. You can use Cloud Shell to configure security policies with Azure PowerShell or Azure CLI. You can configure security policy by using the Azure portal with the next portal update. 

## Prerequisites

* The DNS zone must be hosted by Azure Public DNS. For more information, see [Manage DNS zones](/azure/dns/dns-operations-dnszones-portal).
* The parent DNS zone must be signed with DNSSEC. Most major top level domains (.com, .net, .org) are already signed.

## Do something

To protect your DNS zone with DNSSEC, you must first sign the zone. The zone signing process creates a delegation signer (DS) record that must then be added to the parent zone.

## [Azure portal](#tab/sign-portal)

To do something using the Azure portal:

1. On the Azure portal Home page, search for and select **DNS zones**.
2. Select your DNS zone, and then from the zone's **Overview** page, select **DNSSEC**. You can select **DNSSEC** from the menu at the top, or under **DNS Management**.

    [ ![Screenshot of how to select DNSSEC.](./media/dnssec-how-to/select-dnssec.png) ](./media/dnssec-how-to/select-dnssec.png#lightbox)

## [Azure CLI](#tab/sign-cli)

1. Sign a zone using the Azure CLI:

```azurepowershell-interactive
# Ensure you are logged in to your Azure account
az login

# Select the appropriate subscription
az account set --subscription "your-subscription-id"

# Enable DNSSEC for the DNS zone
az network dns dnssec-config create --resource-group "your-resource-group" --zone-name "adatum.com"

# Verify the DNSSEC configuration
az network dns dnssec-config show --resource-group "your-resource-group" --zone-name "adatum.com"
```

2. Something



## [PowerShell](#tab/sign-powershell)

1. Something using PowerShell:

```PowerShell
# Connect to your Azure account (if not already connected)
Connect-AzAccount

# Select the appropriate subscription
Select-AzSubscription -SubscriptionId "your-subscription-id"

# Enable DNSSEC for the DNS zone
New-AzDnsDnssecConfig -ResourceGroupName "your-resource-group" -ZoneName "adatum.com"

# Verify the DNSSEC configuration
Get-AzDnsDnssecConfig -ResourceGroupName "your-resource-group" -ZoneName "adatum.com"
```

2. Obtain something


---

## Next steps

- Learn how to [unsign a DNS zone](dnssec-unsign.md).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).