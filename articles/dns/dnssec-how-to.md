---
title: How to sign your Azure Public DNS zone with DNSSEC (Preview)
description: Learn how to sign your Azure public DNS zone with DNSSEC. 
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 09/23/2024
ms.author: greglin
---

# How to sign your Azure Public DNS zone with DNSSEC (Preview)

This article shows you how to sign your DNS zone with Domain Name System Security Extensions (DNSSEC).

## Prerequisites

* The DNS zone must be hosted by Azure Public DNS. For more information, see [Manage DNS zones](/azure/dns/dns-operations-dnszones-portal).
* The parent DNS zone must be signed with DNSSEC. Most major top level domains (.com, .net, .org) are already signed.

## Sign a zone with DNSSEC

To protect your DNS zone with DNSSEC, you must first sign the zone. The zone signing process creates a delegation signer (DS) record that must then be added to the parent zone.

# [Azure portal](#tab/sign-portal)

To sign your zone with DNSSEC using the Azure portal:

1. On the Azure portal Home page, search for and select **DNS zones**.
2. Select your DNS zone, and then from the zone's **Overview** page, select **DNSSEC**. You can select **DNSSEC** from the menu at the top, or under **DNS Management**.

    ![Screenshot of how to select DNSSEC.](./media/dnssec-how-to/select-dnssec.png)

3. Select the **Enable DNSSEC** checkbox. 

    ![Screenshot of selecting the DNSSEC checkbox.](./media/dnssec-how-to/sign-dnssec.png)

4. When you are prompted to confirm that you wish to enable DNSSEC, select **OK**.<br>
    
    <img src="./media/dnssec-how-to/confirm-dnssec.png" alt="Screenshot of confirming DNSSEC signing." width="60%">

5. Wait for zone signing to complete. After the zone is signed, review the **DNSSEC delegation information** that is displayed. Notice that the status is: **Signed but not delegated**.

    [ ![Screenshot of a signed zone with DS record missing.](./media/dnssec-how-to/ds-missing.png) ](./media/dnssec-how-to/ds-missing.png#lightbox)

6. Copy the delegation information and use it to create a DS record in the parent zone. 

    1. If the parent zone is a top level domain (for example: `.com`) or you don't own the parent zone, you must add the DS record at your registrar. Each registrar has its own process. The registrar might ask for values such as the Key Tag, Algorithm, Digest Type, and Key Digest. In the example shown here, these values are:

        **Key Tag**: 4535<br>
        **Algorithm**: 13<br>
        **Digest Type**: 2<br>
        **Digest**: 7A1C9811A965C46319D94D1D4BC6321762B632133F196F876C65802EC5089001

    2. If you own the parent zone, you can add a DS record directly to the parent yourself. The following example shows how to add a DS record to the DNS zone **adatum.com** for the child zone **secure.adatum.com** when both zones are hosted using Azure Public DNS:

        [ ![Screenshot of adding a DS record to the parent zone.](./media/dnssec-how-to/ds-add.png) ](./media/dnssec-how-to/ds-add.png#lightbox) 
        [ ![Screenshot of a DS record in the parent zone.](./media/dnssec-how-to/ds-added.png) ](./media/dnssec-how-to/ds-added.png#lightbox)

7. When the DS record has been uploaded to the parent zone, select the DNSSEC information page for your zone and verify that **Signed and delegation established** is displayed. Your DNS zone is now fully DNSSEC signed.

    [ ![Screenshot of a fully signed and delegated zone.](./media/dnssec-how-to/delegated.png) ](./media/dnssec-how-to/delegated.png#lightbox)

# [Azure CLI](#tab/sign-cli)

Sign a zone using the Azure CLI:

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

# [PowerShell](#tab/sign-powershell)

Sign a zone using PowerShell:

```PowerShell
# Connect to your Azure account (if not already connected)
Connect-AzAccount

# Select the appropriate subscription
Select-AzSubscription -SubscriptionId "your-subscription-id"

# Enable DNSSEC for the DNS zone
Enable-AzDnsDnssec -ResourceGroupName "your-resource-group" -ZoneName "adatum.com"

# Verify the DNSSEC configuration
Get-AzDnsDnssecConfig -ResourceGroupName "your-resource-group" -ZoneName "adatum.com"
```

## Next steps

- Learn how to [unsign a DNS zone](dnssec-unsign.md).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).