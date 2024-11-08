---
title: How to filter and view DNS traffic
description: Learn how to filter and view DNS traffic
author: greg-lindsay
ms.service: azure-dns
ms.topic: how-to
ms.date: 11/06/2024
ms.author: greglin
---

# Filter and view DNS traffic

This article shows you how to view and filter DNS traffic at the virtual network level. 

> [!NOTE]
> DNS security policy is in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.<br>
> This DNS security policy preview is offered without a requirement to enroll in a preview. 

## Prerequisites

* If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A virtual network is required. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md).

## Create a security policy

## [Azure portal](#tab/sign-portal)

To create a DNS security policy using the Azure portal:

1. On the Azure portal **Home** page, search for and select **DNS Security Policies**.
2. Select **+ Create** to begin creating a new policy.
3. On the **Basics** tab, select the **Subscription** and **Resource group**, or create a new resource group.
4. Next to **Instance Name**, enter a name for the DNS security policy.
5. Choose the **Region** where the security policy will apply.

    ![Screenshot of the Basics tab for security policy.](./media/dns-traffic-log-how-to/secpol-basics.png)

6. Select **Next: Virtual Networks Link**.
7. Select **+ Add**. VNets in the same region as the security policy are displayed. 
8. Select one or more available VNets and then select **Add**. You can't choose a VNet that is already associated with another security policy.

    ![Screenshot of the Virtual Network Links tab for security policy.](./media/dns-traffic-log-how-to/secpol-vnet-links.png)

9. The chosen VNets are displayed in a list. You can remove VNets from the list if desired.

  > [!NOTE]
  > Virtual network links are created for all VNets displayed in the list, whether or not they are *selected*. Use checkboxes to select VNets for removal from the list.

10. Select Next: **DNS Traffic Rules**.
11. 

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