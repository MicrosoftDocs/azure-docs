---
title: Azure Firewall Management NIC
description: You can configure a Management NIC to support the Forced Tunneling and Packet Capture features.
services: firewall
author: vhorne
ms.date: 09/10/2024
ms.service: azure-firewall
ms.topic: concept-article
ms.author: victorh
---

# Azure Firewall Management NIC

> [!NOTE]
> This feature was previously called Forced Tunneling. Originally, a Management NIC was required only for Forced Tunneling. However, now Packet capture (preview) also requires a Management NIC, so it has been decoupled from Forced Tunneling. All relevant documentation has been updated to reflect this.

An Azure Firewall Management NIC separates firewall management traffic from customer traffic. The Firewall Management NIC helps support two features today: Forced Tunneling and Packet Capture (preview). To support either of these capabilities, you must create an Azure Firewall with the Firewall Management NIC enabled. This is a mandatory requirement to avoid service disruption.

## What happens when you enable the Management NIC

If you enable a Management NIC, the firewall routes its management traffic via the AzureFirewallManagementSubnet (minimum subnet size /26) with its associated public IP address. You assign this public IP address for the firewall to manage traffic. It's used exclusively by the Azure platform and can't be used for any other purpose. All traffic required for firewall operational purposes is incorporated into the Management subnet. By default, the service associates a system-provided route table to the Management subnet. The only route allowed on this subnet is a default route to the Internet and *Propagate gateway routes* must be disabled. Avoid associating customer route tables to the Management subnet, as this can cause service disruptions if configured incorrectly. If you do associate a route table, then ensure it has a default route to the Internet to avoid service disruptions.

:::image type="content" source="media/management-nic/firewall-management-nic.png" alt-text="Screenshot showing the firewall management NIC dialog.":::

## Enable the Management NIC

The Firewall Management NIC can be enabled during the firewall create process. For Standard and Premium firewall versions, the Firewall Management NIC must be enabled during the create process, but all Basic Firewall versions and all Secured Hub firewalls always have a Management NIC enabled. For a pre-existing firewall, you must stop the firewall and then restart it with the Firewall Management NIC enabled to support Forced tunneling and Packet capture (preview). Stopping/starting the firewall can be used to enable the Firewall Management NIC without the need to redeploy a new firewall. You should always start/stop the firewall during maintenance hours to avoid disruptions, including when attempting to enable the Firewall Management NIC. 

Use the following steps:

1. Stop the existing firewall:
   ```azurepowershell
    $azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
    $azfw.Deallocate()
    Set-AzFirewall -AzureFirewall $azfw
   ```
1. Create a new subnet with AzureFirewallManagementSubnet and create a management Public IP address.
   - Use the portal to create a virtual network subnet named **AzureFirewallManagementSubnet**.
   - Create a separate public IP address for the new Management public IP address.
1. Start the firewall with the Management IP address and subnet:
   ```azurepowershell
      $azfw = Get-AzFirewall -Name "FW Name" -ResourceGroupName "RG Name"
      $vnet = Get-AzVirtualNetwork -ResourceGroupName "RG Name" -Name "VNet Name"
      $pip= Get-AzPublicIpAddress -ResourceGroupName "RG Name" -Name "azfwpublicip"
      $mgmtPip2 = Get-AzPublicIpAddress -ResourceGroupName "RG Name" -Name "mgmtpip"
      $azfw.Allocate($vnet, $pip, $mgmtPip2)
      $azfw | Set-AzFirewall
   ```
   

> [!NOTE]
> If you remove all other IP address configurations on your firewall, the management IP address configuration is removed as well, and the firewall is deallocated. The public IP address assigned to the management IP address configuration can't be removed, but you can assign a different public IP address.

## Related content

- [Azure Firewall forced tunneling](forced-tunneling.md)