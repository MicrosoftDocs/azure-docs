---
title: How to unsign your Azure Public DNS zone (Preview)
description: Learn how to remove DNSSEC from your Azure public DNS zone. 
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 10/08/2024
ms.author: greglin
---

# How to unsign your Azure Public DNS zone (Preview)

This article shows you how to remove [Domain Name System Security Extensions (DNSSEC)](dnssec.md) from your Azure Public DNS zone.

To sign a zone with DNSSEC, see [How to sign your Azure Public DNS zone with DNSSEC](dnssec-how-to.md).

## Prerequisites

* The DNS zone must be hosted by Azure Public DNS. For more information, see [Manage DNS zones](/azure/dns/dns-operations-dnszones-portal).
* You must have permission to delete a DS record from the parent DNS zone. Most top level domains (.com, .net, .org) allow you to do this using your registrar.

## Unsign a zone

> [!IMPORTANT]
> Removing DNSSEC from your DNS zone requires that you first remove the delegation signer (DS) record from the parent zone, and wait for the time-to-live (TTL) of the DS record to expire. After the DS record TTL has expired, you can safely unsign the zone.

## [Azure portal](#tab/sign-portal)

To unsign a zone using the Azure portal:

1. On the Azure portal Home page, search for and select **DNS zones**.
2. Select your DNS zone, and then from the zone's **Overview** page, select **DNSSEC**. You can select **DNSSEC** from the menu at the top, or under **DNS Management**.
3. If you have successfully removed the DS record at your registrar for this zone, you see that the DNSSEC status is **Signed but not delegated**. Do not proceed until you see this status.

## [Azure CLI](#tab/sign-cli)

Sign a zone using the Azure CLI:

```azurepowershell-interactive
commands here
```

## [PowerShell](#tab/sign-powershell)

Sign a zone using PowerShell:

```PowerShell
commands here
```

## Next steps

- Learn how to [sign a DNS zone with DNSSEC](dnssec-how-to.md).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).