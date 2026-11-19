---
title: 'Configure customer-controlled maintenance for your Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn how to configure customer-controlled maintenance for your Virtual WAN using Azure portal or PowerShell.
author: cfields475
ms.service: azure-virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 11/04/2026
ms.author: cfields
---
# Configure customer-controlled maintenance for Virtual WAN

This article helps you configure customer-controlled maintenance windows for Virtual WAN Hub router, site-to-site VPN gateways, Virtual WAN user VPN (or point-to-site VPN) gateways, and Virtual WAN ExpressRoute gateways. Learn how to schedule customer-controlled maintenance for your gateways by using the Azure portal or PowerShell.

>[!NOTE]
> You can also configure customer-controlled maintenance windows for Azure Firewall in secured hubs. For more information, see [Configure customer-controlled maintenance for Azure Firewall](../firewall/customer-controlled-maintenance.md).

The Virtual WAN will undergo regular updates aimed at enhancing functionality, reliability, performance, and security. These updates encompass a wide range of activities, including patching software components, upgrading networking components, and decommissioning hardware.

In most cases, these updates are carefully planned to minimize their impact on customer operations. Factors such as Azure scheduling updates during nonbusiness hours in the gateway region, and customers having robust architecture, help ensure that most updates don't disrupt normal business activities. However, there might be instances where customers are affected by these updates. To mitigate any potential impact on operations, you can configure maintenance windows during non-business hours. This allows you to avoid disruptions and maintain a smooth operation.

For more information on limitations and frequently asked questions related to customer-controlled maintenance, see the [Virtual WAN FAQ](virtual-wan-faq.md).

## Azure portal steps

Use the following steps to create a maintenance configuration.

1. In the Azure portal, search for **Maintenance Configurations**.

1. On the **Maintenance Configurations** page, select **+ Create** to open the **create a maintenance configuration** page.

   :::image type="content" source="./media/customer-controlled-maintenance/maintenance.png" alt-text="Screenshot of Maintenance Configurations page." lightbox="./media/customer-controlled-maintenance/maintenance.png":::

1. On the **Basics** page, input the relevant values.

   * **Subscription:** Your subscription.
   * **Resource Group:** The resource group your resources reside in.
   * **Configuration name:** Use an intuitive name by which you can identify this maintenance configuration.
   * **Region:** The region needs to be the same region as your gateway resources.
   * **Maintenance scope:** Select **Resource** from the dropdown.
   * **Maintenance subscope:** Select **Network gateways** from the dropdown.

1. Click **Add a schedule** to define the maintenance schedule. The maintenance window needs to be a minimum of 5 Hours.
1. After you specify the schedule, select **Save**.
1. Next, select the resources. On the **Resources** page, select **+ Add resources**. You can add resources to the maintenance configuration when creating the configuration, or you can add the resources after the maintenance configuration is created. For this exercise, add resources at the same time you create a maintenance configuration.
1. On the **Select resources** page you should see your resources. If you don't, go back and make sure that you selected the correct region and maintenance scope. Select the resources you want to include in this maintenance configuration, and then select **OK**.

   Values for **Type** are:

   * **Virtual WAN hub:** Virtual WAN hub router
   * **VPN Gateways:** Virtual WAN site-to-site VPN gateways
   * **ExpressRoute Gateways:** Virtual WAN ExpressRoute gateways
   * **Virtual network gateways** VPN and ExpressRoute Virtual network gateways

1. Select **Review + Create** to validate. When validation finishes, select **Create**.

[!INCLUDE [View add remove](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-view-add-remove.md)]

## Azure PowerShell steps

[!INCLUDE [PowerShell steps](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-powershell.md)]
6. Create the maintenance configuration assignment by using the [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) cmdlet. The maintenance policy is applied to the resource within 24 hours.

   ```azurepowershell-interactive
   New-AzConfigurationAssignment -ResourceGroupName <rgName> -ProviderName "Microsoft.Network" -ResourceType "<your resource's resource type per ARM. For example, expressRouteGateways or vpnSites>" -ResourceName "<your resource's name>" -ConfigurationAssignmentName "<assignment name>" -ResourceId $serviceResource.Id -MaintenanceConfigurationId $config.Id -Location "<arm location of resource>"
   ```

### To remove a configuration assignment

[!INCLUDE [Remove assignment](../../includes/vpn-gateway-customer-controlled-gateway-maintenance-article-remove-assignment.md)]

## Next steps

For more information, see the [Virtual WAN FAQ](virtual-wan-faq.md).
