---
title: Customer provided public IP address support in secured hubs
description: Learn how to use customer-provided public IP addresses with Azure Firewall in secured Virtual WAN hubs for enhanced control and DDoS protection.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 10/02/2025
ms.author: duau
# Customer intent: "As a network administrator, I want to associate customer-provided public IP addresses with secured hub firewalls, so that I can maintain control over IP address management and enhance DDoS protection in my virtual WAN deployments."
---

# Customer provided public IP address support in secured hubs


Azure Firewall in Virtual WAN secured hubs now supports the use of customer-provided public IP addresses. This capability enables organizations to bring their own public IP addresses when deploying Azure Firewall in a secured Virtual WAN hub, providing greater flexibility and control over network infrastructure.

With this feature, instead of relying on Azure-managed public IP addresses, you can specify your own public IP addresses that are already allocated in your Azure subscription. This is particularly valuable for organizations that require consistent IP addresses for compliance, security policies, or integration with third-party systems.

You can configure this feature using either the Azure portal or Azure PowerShell.

## Benefits

Using customer-provided public IP addresses with secured hub Azure Firewalls offers several advantages:

- **IP lifecycle management**: You own and control the complete lifecycle of the Azure Firewall public IP addresses, including creation, configuration, and deletion.

- **Enhanced DDoS protection**: Secured hub firewalls can enable enhanced DDoS mitigation features to defend against DDoS attacks when using customer-provided public IPs.

- **IP prefix allocation**: You can allocate Azure Firewall public IP addresses from an IP address prefix pool, enabling better IP address management and simplified routing configurations.

- **Compliance and consistency**: Maintain consistent public IP addresses across deployments to meet regulatory requirements or integrate with existing network security policies.

## Prerequisites

Before you can use customer-provided public IP addresses with secured hub Azure Firewalls, ensure you have the following resources permissions:

- **Azure subscription**: An active Azure subscription with appropriate permissions to create and manage Azure Firewall resources.

- **Virtual WAN and hub**: A Virtual WAN instance with a virtual hub where you plan to deploy the secured hub firewall.

- **Public IP addresses**: One or more public IP addresses already created in your Azure subscription. These public IP addresses must:
  - Be in the same region as your virtual hub
  - Have a Standard SKU
  - Use static allocation method
  - Not be associated with any other Azure resources

- **Resource group**: A resource group to contain your Azure Firewall and related resources.

- **Permissions**: Appropriate Azure RBAC permissions to:
  - Create and configure Azure Firewall resources
  - Manage public IP addresses
  - Modify Virtual WAN hub configurations

- **IP prefix (recommended)**: For better management, allocate your public IP addresses from a public IP address prefix pool.ided public IP address support in secured hubs
description: Learn how to use customer-provided public IP addresses with Azure Firewall in secured Virtual WAN hubs for enhanced control and DDoS protection.

The capability is available for both new and existing deployments of secured hub Firewalls. 

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
