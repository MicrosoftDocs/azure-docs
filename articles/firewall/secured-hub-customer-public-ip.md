---
title: Customer provided public IP address support in secured hubs (preview)
description: Learn about customer provided public IP address support in secured hubs.
services: firewall
author: vhorne
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 01/15/2025
ms.author: victorh
---

# Customer provided public IP address support in secured hubs (preview)

> [!IMPORTANT]
> Customer provided public IP address support in secured hubs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual WAN hub deployments can now associate customer tenant public IP addresses with secured hub Azure Firewalls.

The capability is available only to new deployments of secured hub Firewalls. For existing secured virtual WAN hubs, delete the hub firewall and redeploy a new Firewall during scheduled maintenance hours. You can use the Azure portal or Azure PowerShell to configure it.   

The capability has the following benefits: 

- You own and control the lifecycle of the Azure Firewall public IP addresses. 

- Secured hub firewalls can enable enhanced DDoS mitigation features to defend against DDoS attacks. 

- You can allocate Azure Firewall public IP addresses from an IP address prefix pool. 

## Configuration

You can configure this feature using either the Azure portal or Azure PowerShell.

### Azure portal

You can associate a preexisting public IP address with a secured hub firewall. You should allocate public IP addresses from an IP prefix pool to simplify downstream security access control lists (ACLs).  

:::image type="content" source="media/secured-hub-customer-public-ip/new-secured-hub-customer-public-ip.png" alt-text="Screenshot showing new secured virtual hub.":::

### Azure PowerShell

```azurepowershell
$publicip = Get-AzPublicIpAddress -ResourceGroupName $rgName -Name $PIPName
$virtualhub = get-azvirtualhub -ResourceGroupName $rgName -name $vwanhub
New-AzFirewall -Name $azfwname -ResourceGroupName $rgName -Location westcentralus -SkuName AZFW_Hub -SkuTier $Tier -PublicIpAddress $publicip -VirtualHubId $virtualhub.Id
```

## Next steps

- [Tutorial: Secure your virtual hub using Azure Firewall Manager](../firewall-manager/secure-cloud-network.md)