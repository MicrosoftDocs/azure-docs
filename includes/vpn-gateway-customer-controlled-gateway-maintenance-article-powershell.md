---
author: cherylmc
ms.author: cherylmc
ms.date: 10/24/2023
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: include
## This include is the main part of the article for VPN Gateway, ExpressRoute, and Virtual WAN. If you have changes to make to this include, verify that they apply in context for all 3 services. If not, go to the article page for the specific service and add the information as a separate section there.
---


Use the following steps to assign policy to the resources. If you're new to PowerShell, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).

1. Set the Subscription context.

   ```azurepowershell-interactive
   set-AzContext -Subscription 'Subscription Name’
   ```

1. Register the Azure Resource Provider.

   ```azurepowershell-interactive
   Register-AzResourceProvider -ProviderNamespace Microsoft.Maintenance
   ```

1. Create a maintenance configuration using the [New-AzMaintenanceConfiguration](/powershell/module/az.maintenance/new-azmaintenanceconfiguration) cmdlet.

   * The **-Duration** must be a minimum of a 5 hour window.
   * The **-RecurEvery** is per day.
   * For TimeZone options, see [Time Zones](/rest/api/sql/2020-11-01-preview/time-zones/list-by-location).

   ```azurepowershell-interactive
   New-AzMaintenanceConfiguration -ResourceGroupName <rgName> -Name <configurationName> -Location <arm location of resource> -MaintenanceScope Resource -ExtensionProperty @{"maintenanceSubScope"="NetworkGatewayMaintenance"} -StartDateTime "<date in YYYY-MM-DD HH:mm format>" -TimeZone "<Selected Time Zone>" -Duration "<Duration in HH:mm format>" -Visibility "Custom" -RecurEvery Day
   ```

1. Save the **maintenance configuration** as a variable named `$config`.

   ```azurepowershell-interactive
   $config = Get-AzMaintenanceConfiguration -ResourceGroupName <rgName> -Name <configurationName>
   ```

1. Save the service resource as a variable named `$serviceResource`.
