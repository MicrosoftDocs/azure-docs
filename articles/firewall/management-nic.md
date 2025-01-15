---
title: Azure Firewall Management NIC
description: You can configure a Management NIC to support the Forced Tunneling and Packet Capture features.
services: firewall
author: vhorne
ms.date: 11/6/2024
ms.service: azure-firewall
ms.topic: concept-article
ms.author: victorh
---

# Azure Firewall Management NIC

> [!NOTE]
> This feature was previously called Forced Tunneling. Originally, a Management NIC was required only for Forced Tunneling. However, certain upcoming Firewall features will also require a Management NIC, so it has been decoupled from Forced Tunneling. All relevant documentation has been updated to reflect this.

An Azure Firewall Management NIC separates firewall management traffic from customer traffic. Certain upcoming Firewall features will also require a Management NIC. To support any of these capabilities, you must create an Azure Firewall with the Firewall Management NIC enabled or enable it on an existing Azure Firewall to avoid service disruption.

## What happens when you enable the Management NIC

If you enable a Management NIC, the firewall routes its management traffic via the AzureFirewallManagementSubnet (minimum subnet size /26) with its associated public IP address. You assign this public IP address for the firewall to manage traffic. All traffic required for firewall operational purposes is incorporated into the AzureFirewallManagementSubnet. 

By default, the service associates a system-provided route table to the Management subnet. The only route allowed on this subnet is a default route to the Internet and *Propagate gateway routes* must be disabled. Avoid associating customer route tables to the Management subnet, as this can cause service disruptions if configured incorrectly. If you do associate a route table, then ensure it has a default route to the Internet to avoid service disruptions.

:::image type="content" source="media/management-nic/firewall-management-nic.png" alt-text="Screenshot showing the firewall management NIC dialog.":::

## Enable the Management NIC on existing firewalls

For Standard and Premium firewall versions, the Firewall Management NIC must be manually enabled during the create process as shown previously, but all Basic Firewall versions and all Secured Hub firewalls always have a Management NIC enabled. 

For a pre-existing firewall, you must stop the firewall and then restart it with the Firewall Management NIC enabled to support Forced tunneling. Stopping/starting the firewall can be used to enable the Firewall Management NIC without the need to delete an existing firewall and redeploy a new one. You should always start/stop the firewall during maintenance hours to avoid disruptions, including when attempting to enable the Firewall Management NIC. 

Use the following steps:

1. Create the `AzureFirewallManagementSubnet` on the Azure portal and use the appropriate IP address range for the virtual network.

   :::image type="content" source="media/management-nic/firewall-management-subnet.png" alt-text="Screenshot showing add a subnet.":::
1. Create the new management public IP address with the same properties as the existing firewall public IP address: SKU, Tier, and Location.

   :::image type="content" source="media/management-nic/firewall-management-ip.png" lightbox="media/management-nic/firewall-management-ip.png" alt-text="Screenshot showing the public IP address creation.":::
   
1. Stop the firewall

   Use the information in [Azure Firewall FAQ](firewall-faq.yml#how-can-i-stop-and-start-azure-firewall) to stop the firewall:
   
   ```azurepowershell
   $azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
   $azfw.Deallocate()
   Set-AzFirewall -AzureFirewall $azfw
   ```
   
   
1. Start the firewall with the management public IP address and subnet.

   Start a firewall with one public IP address and a Management public IP address:
   
   ```azurepowershell
   $azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
   $vnet = Get-AzVirtualNetwork -Name "VNet Name" -ResourceGroupName "RG Name" 
   $pip = Get-AzPublicIpAddress -Name "azfwpublicip" -ResourceGroupName "RG Name"
   $mgmtPip = Get-AzPublicIpAddress -Name "mgmtpip" -ResourceGroupName "RG Name" 
   $azfw.Allocate($vnet, $pip, $mgmtPip)
   $azfw | Set-AzFirewall
   ```
   
   Start a firewall with two public IP addresses and a Management public IP address:
   
   ```azurepowershell
   $azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
   $vnet = Get-AzVirtualNetwork -Name "VNet Name" -ResourceGroupName "RG Name" 
   $pip1 = Get-AzPublicIpAddress -Name "azfwpublicip" -ResourceGroupName "RG Name"
   $pip2 = Get-AzPublicIpAddress -Name "azfwpublicip2" -ResourceGroupName "RG Name"
   $mgmtPip = Get-AzPublicIpAddress -Name "mgmtpip" -ResourceGroupName "RG Name" 
   $azfw.Allocate($vnet,@($pip1,$pip2), $mgmtPip)
   $azfw | Set-AzFirewall
   ```
   
   > [!NOTE]
   > You must reallocate a firewall and public IP to the original resource group and subscription. When stop/start is performed, the private IP address of the firewall may change to a different IP address within the subnet. This can affect the connectivity of previously configured route tables.

Now when you view the firewall in the Azure portal, you see the assigned Management public IP address:

:::image type="content" source="media/management-nic/firewall-with-management-ip.png" lightbox="media/management-nic/firewall-with-management-ip.png" alt-text="Screenshot showing the firewall with a management IP address.":::


> [!NOTE]
> If you remove all other IP address configurations on your firewall, the management IP address configuration is removed as well, and the firewall is deallocated. The public IP address assigned to the management IP address configuration can't be removed, but you can assign a different public IP address.

## Deploying a New Azure Firewall with Management NIC for Forced Tunneling

If you prefer to deploy a new Azure Firewall instead of the Stop/Start method, make sure to include a Management Subnet and Management NIC as part of your configuration.

**Important Note**
* **Single Firewall per Virtual Network (VNET)**: Since two firewalls can't exist within the same virtual network, it's recommended to delete the old firewall before starting the new deployment if you plan to reuse the same virtual network.
* **Pre-create Subnet**: Ensure the **AzureFirewallManagementSubnet** is created in advance to avoid deployment issues when using an existing virtual network.

**Prerequisites**
* Create the **AzureFirewallManagementSubnet**:
    * Minimum subnet size: /26
    * Example: 10.0.1.0/26

**Deployment Steps**
1. Go to **Create a Resource** in the Azure portal.
1.	Search for **Firewall** and select **Create**.
1.	On the Create a Firewall page, configure the following settings:
    * **Subscription**: Select your subscription.
    * **Resource Group**: Select or create a new resource group.
    * **Name**: Enter a name for the firewall.
    * **Region**: Choose your region.
    * **Firewall SKU**: Select Basic, Standard, or Premium.
    * **Virtual Network**: Create a new virtual network or use an existing one.
         * Address space: for example, 10.0.0.0/16
         * Subnet for AzureFirewallSubnet: for example, 10.0.0.0/26
    * **Public IP Address**: Add new Public IP
         * Name: for example, FW-PIP
1.	Firewall Management NIC
    * Select **Enable Firewall Management NIC**
         * Subnet for AzureFirewallManagementSubnet: for example, 10.0.1.0/24
         * Create Management public IP address: for example, Mgmt-PIP
1.	Select **Review + Create** to validate and deploy the firewall. This takes a few minutes to deploy. 


## Related content

- [Azure Firewall forced tunneling](forced-tunneling.md)
