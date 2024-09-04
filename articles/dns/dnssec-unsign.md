---
title: How to unsign your Azure Public DNS zone (Preview)
description: Learn how to remove DNSSEC from your Azure public DNS zone. 
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 09/04/2024
ms.author: greglin
---

# How to unsign your Azure Public DNS zone (Preview)

This article shows you how to remove Domain Name System Security Extensions (DNSSEC) from your Azure Public DNS zone.

## Prerequisites

* The DNS zone must be hosted by Azure Public DNS. For more information, see [Manage DNS zones](/azure/dns/dns-operations-dnszones-portal).
* You must have permission to delete a DS record from the parent DNS zone. Most top level domains (.com, .net, .org) allow you to do this using your registrar.

## Unsign a zone

> [!IMPORTANT]
> Removing DNSSEC from your DNS zone requires that you first remove the delegation signer (DS) record from the parent zone, and wait for the time-to-live (TTL) of the DS record to expire. After the DS record TTL has expired, you can safely unsign the zone.

# [Azure portal](#tab/sign-portal)

To unsign your zone using the Azure portal:

1. 

# [Azure CLI](#tab/sign-cli)

Sign a zone using the Azure CLI:

```azurepowershell-interactive
commands here
```

# [PowerShell](#tab/sign-powershell)

Sign a zone using PowerShell:

```PowerShell
commands here
```

## Unsign a zone



## Next steps

To learn more about alias records, see the following articles:

- [Tutorial: Configure an alias record to refer to an Azure public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](./dns-faq.yml)

To learn how to migrate an active DNS name, see [Migrate an active DNS name to Azure App Service](../app-service/manage-custom-dns-migrate-domain.md).