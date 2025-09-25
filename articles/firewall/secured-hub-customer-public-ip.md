---
title: Customer provided public IP address support in secured hubs (preview)
description: Learn about customer provided public IP address support in secured hubs.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 01/15/2025
ms.author: duau
# Customer intent: "As a network administrator, I want to associate customer-provided public IP addresses with secured hub firewalls, so that I can maintain control over IP address management and enhance DDoS protection in my virtual WAN deployments."
---

# Customer provided public IP address support in secured hubs (preview)

> [!IMPORTANT]
> Customer provided public IP address support in secured hubs is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual WAN hub deployments can now associate customer tenant public IP addresses with secured hub Azure Firewalls.

The capability has the following benefits: 

- You own and control the lifecycle of the Azure Firewall public IP addresses. 

- Secured hub firewalls can enable enhanced DDoS mitigation features to defend against DDoS attacks. 

- You can allocate Azure Firewall public IP addresses from an IP address prefix pool. 

The capability is available to new as well as existing deployments of secured hub Firewalls. 

## Configure a new Secure Hub Azure Firewall with customer tenant public IP 

You can configure this feature using either the Azure portal or Azure PowerShell.

### [Portal](#tab/portal)

You can associate a preexisting public IP address with a secured hub firewall. You should allocate public IP addresses from an IP prefix pool to simplify downstream security access control lists (ACLs).          
:::image type="content" source="media/secured-hub-customer-public-ip/new-secured-hub-customer-public-ip.png" alt-text="Screenshot showing new secured virtual hub.":::

### [PowerShell](#tab/powershell)
    
```powershell-interactive
    $publicip = Get-AzPublicIpAddress -ResourceGroupName $rgName -Name $PIPName
    $virtualhub = get-azvirtualhub -ResourceGroupName $rgName -name $vwanhub
    New-AzFirewall -Name $azfwname -ResourceGroupName $rgName -Location westcentralus -SkuName AZFW_Hub -SkuTier $Tier -PublicIpAddress $publicip -VirtualHubId $virtualhub.Id
```

***

> [!Note]
> For existing secured virtual WAN hubs, you have to remove all the public IPs assigned to the Hub, stop/deallocate the hub firewall. and allocate the Firewall with your public IP during scheduled maintenance hours.

### Reconfigure an existing Secure Hub Azure Firewall with customer tenant public IP 

To reconfigure an Azure Firewall with a public IP address, follow these steps:

1. **Retrieve the existing firewall**  
    Use the `Get-AzFirewall` cmdlet to retrieve the current Azure Firewall configuration:

    ```powershell-interactive
    $Azfw = Get-AzFirewall -ResourceGroupName rgName -Name azFw
    ```

2. **Set the current count of Firewall Public IPs to 0**  
    Create a new public IP configuration with a count of 0 and update the firewall's hub IP addresses:

    ```powershell-interactive
    $hubIp = New-AzFirewallHubPublicIpAddress -Count 0
    $AzFWHubIPs = New-AzFirewallHubIpAddress -PublicIP $hubIp
    $Azfw.HubIpAddresses = $AzFWHubIPs
    Set-AzFirewall -AzureFirewall $AzFw
    ```

3. **Deallocate the Firewall**  
    Deallocate the firewall to prepare it for reconfiguration:

    ```powershell-interactive
    $AzFw.Deallocate()
    Set-AzFirewall -AzureFirewall $AzFw
    ```

4. **Allocate the firewall with the Public IP**  
    Retrieve the public IP address and virtual hub, then allocate the firewall with the new configuration:

    ```powershell-interactive
    $publicip = Get-AzPublicIpAddress -ResourceGroupName rgName -Name PIPWC2
    $virtualhub = Get-AzVirtualHub -ResourceGroupName rgName -Name "LegacyHUB"
    $AzFw.Allocate($virtualhub.Id, $publicip)

    Set-AzFirewall -AzureFirewall $AzFw
    ```


## Next steps

- [Tutorial: Secure your virtual hub using Azure Firewall Manager](../firewall-manager/secure-cloud-network.md)
