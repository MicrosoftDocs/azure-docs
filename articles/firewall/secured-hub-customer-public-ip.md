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

With this feature, instead of relying on Azure-managed public IP addresses, you can specify your own public IP addresses that are already allocated in your Azure subscription. This is valuable for organizations that need to maintain consistent IP addresses for compliance, security policies, or integration with third-party systems.

This capability is available only for new deployments of secured hub Azure Firewalls. For existing secured Virtual WAN hubs with Azure Firewall already deployed, you must delete the hub firewall and redeploy it during scheduled maintenance hours to take advantage of customer-provided public IP addresses.

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

## Configuration

You can configure this feature using either the Azure portal or Azure PowerShell.

### Azure portal

To configure customer-provided public IP addresses using the Azure portal:

1. Navigate to your Virtual WAN hub in the Azure portal.
2. Select **Security** > **Azure Firewall** from the hub menu.
3. Select **Create Azure Firewall** to start the deployment wizard.
4. In the firewall configuration section, select **Use customer provided public IP addresses**.
5. Choose one or more existing public IP addresses from your subscription.
6. Complete the remaining firewall configuration settings.
7. Review and create the secured hub firewall.

:::image type="content" source="media/secured-hub-customer-public-ip/new-secured-hub-customer-public-ip.png" alt-text="Screenshot showing new secured virtual hub configuration with customer-provided public IP addresses.":::

### Azure PowerShell

Use the following Azure PowerShell commands to configure customer-provided public IP addresses:

```azurepowershell
# Define variables
$rgName = "<resource-group-name>"
$PIPName = "<public-ip-name>"
$vwanhub = "<virtual-wan-hub-name>"
$azfwname = "<azure-firewall-name>"
$location = "<region>"
$Tier = "Standard"  # or "Premium"

# Get the existing public IP address
$publicip = Get-AzPublicIpAddress -ResourceGroupName $rgName -Name $PIPName

# Get the virtual hub
$virtualhub = Get-AzVirtualHub -ResourceGroupName $rgName -Name $vwanhub

# Create the Azure Firewall with customer-provided public IP
New-AzFirewall -Name $azfwname `
               -ResourceGroupName $rgName `
               -Location $location `
               -SkuName AZFW_Hub `
               -SkuTier $Tier `
               -PublicIpAddress $publicip `
               -VirtualHubId $virtualhub.Id
```

**PowerShell prerequisites:**
- Install the Azure PowerShell module: `Install-Module -Name Az -AllowClobber`
- Connect to your Azure subscription: `Connect-AzAccount`
- Ensure you have the latest version of the Az.Network module

## Next steps

Now that you configured customer-provided public IP addresses with your secured hub Azure Firewall, consider these next steps:

- [Configure Azure Firewall policies](../firewall-manager/policy-overview.md)
- [Monitor Azure Firewall logs and metrics](monitor-logs.md)
- [Tutorial: Secure your virtual hub using Azure Firewall Manager](../firewall-manager/secure-cloud-network.md)
- [Configure DDoS protection for your public IP addresses](../ddos-protection/ddos-protection-overview.md)
- [Manage public IP address prefixes](../virtual-network/public-ip-address-prefix.md)