---
title: Configure customer-controlled maintenance for Azure Route Server
description: Learn how to configure and verify a customer-controlled maintenance window for Azure Route Server using the Azure portal or Azure PowerShell.
author: fabferri
ms.author: fabferri
ms.service: azure-route-server
ms.topic: how-to
ms.date: 11/05/2026
ms.custom: devx-track-azurepowershell
---

# Configure customer-controlled maintenance for Azure Route Server

This article helps you configure customer-controlled maintenance windows for Azure Route Server. Learn how to schedule customer-controlled maintenance for your Route Server using the Azure portal or PowerShell.

Route Server undergoes regular updates aimed at enhancing functionality, reliability, performance, and security. These updates encompass a wide range of activities, including patching software components, upgrading networking components, and decommissioning hardware.

In most cases, these updates are carefully planned to minimize their impact on customer operations. Factors such as Azure scheduling updates during nonbusiness hours in the Route Server region, and customers having robust architecture, help ensure that most updates don't disrupt normal business activities. However, there might be instances where customers are affected by these updates. To mitigate any potential impact on operations, you can configure maintenance windows during non-business hours.

## Maintenance coverage and limitations

Customer-controlled maintenance covers guest operating system and service updates. It doesn't cover host updates or critical security updates. Azure can override the configured window to address a high-severity security issue.

A maintenance window controls the timing of eligible updates. It doesn't guarantee disruption-free operation or replace a highly available network design.

## Maintenance window behavior

Consider the following behavior when you configure a maintenance window:

- **Region:** The maintenance configuration must be in the same region as your Route Server.
- **Daily schedule:** Configure a daily window of at least five hours in your preferred time zone.
- **Activation delay:** After you assign a maintenance configuration, Route Server can take up to 24 hours to follow the schedule. The configured start date doesn't bypass this delay.
- **Start date:** The schedule applies only after its configured start date and after the assignment becomes effective. Before then, maintenance can occur outside the selected window.
- **End date:** If you configure an expiration date, maintenance can occur outside the selected window after that date.
- **Timing within the window:** Eligible maintenance must start and finish within the configured window. For example, a five-hour window that starts at 1:30 AM ends at 6:30 AM.
- **Update frequency:** A daily window doesn't mean that updates occur every day. Azure applies an update during the window only when an update is available for the resource.

The host-update and security exceptions described in [Maintenance coverage and limitations](#maintenance-coverage-and-limitations) apply regardless of the schedule.

## Azure portal steps

Use the following steps to create a maintenance configuration.

1. In the [Azure portal](https://portal.azure.com), search for **Maintenance Configurations**.

1. On the **Maintenance Configurations** page, select **+ Create** to open the **Create a maintenance configuration** page.

   :::image type="content" source="./media/configure-customer-controlled-maintenance/maintenance-configurations.png" alt-text="Screenshot of the Basics tab for a maintenance configuration with the Network gateways maintenance scope selected." lightbox="./media/configure-customer-controlled-maintenance/maintenance-configurations.png":::

1. On the **Basics** tab, enter the relevant values.

   - **Subscription:** Your subscription.
   - **Resource group:** The resource group your resources reside in.
   - **Configuration name:** Use an intuitive name by which you can identify this maintenance configuration.
   - **Region:** The region needs to be the same region as your Route Server.
   - **Maintenance scope:** Select **Network gateways** from the dropdown.

1. Select **Add a schedule** to define the maintenance schedule. The maintenance window needs to be a minimum of five hours. Include the start date, start time, and time zone. If you need the schedule to expire, configure an end date.

1. After you specify the schedule, select **Save**.

1. Next, select the resources. On the **Resources** tab, select **+ Add resources**. You can add resources to the maintenance configuration when creating the configuration, or you can add the resources after the maintenance configuration is created. For this exercise, we'll add resources at the same time we create a maintenance configuration.

1. On the **Select resources** page, you should see your resources. If you don't, go back and make sure that you selected the correct region and maintenance scope. Select the Route Server that you want to include in this maintenance configuration, and then select **OK**.

   Values for **Type** are:

   - **VPN Gateways:** Virtual WAN site-to-site VPN gateways
   - **ExpressRoute Gateways:** Virtual WAN ExpressRoute gateways
   - **Virtual network gateways:** VPN and ExpressRoute virtual network gateways
   - **Route Server:** Azure Route Server

1. Select **Review + Create** to validate. After validation completes, select **Create**.

   :::image type="content" source="./media/configure-customer-controlled-maintenance/maintenance-configuration-resources.png" alt-text="Screenshot of the Resources page of a maintenance configuration that shows a Route Server assigned with the Up-to-date maintenance status." lightbox="./media/configure-customer-controlled-maintenance/maintenance-configuration-resources.png":::

### Verify the portal configuration

To verify the schedule and the associated resources for your maintenance configuration, use the following steps:

1. In the portal, go to **Maintenance Configurations** and select the configuration that you created.
1. Review the saved maintenance schedule to confirm the start date, time zone, daily recurrence, and duration.
1. In the left pane, select **Resources** to open the Resources page. Confirm that your Route Server appears in the list of associated resources.

Allow up to 24 hours for Route Server to follow the schedule after assignment.

### Add resources

You can add resources to a maintenance configuration.

1. In the portal, go to the **Maintenance Configurations** page.
1. Select the maintenance configuration that you created.
1. In the left pane, select **Resources** to open the **Resources** page and view the associated resources for this maintenance configuration.
1. On the **Resources** page, select **+ Add** to add a resource.

### Remove resources

You can remove associated resources from a maintenance configuration.

1. In the portal, go to the **Maintenance Configurations** page.
1. Select the maintenance configuration that you created.
1. In the left pane, select **Resources** to open the **Resources** page and view the associated resources for this maintenance configuration.
1. On the **Resources** page, select the resource that you want to remove, and then select **X Remove**.
1. On the **Remove resources** message, select **Yes**.

## Azure PowerShell steps

Use the following steps to create a maintenance configuration and assign it to your Route Server. If you're new to Azure PowerShell, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).

1. Set the subscription context. Replace the subscription name with your own:

   ```azurepowershell-interactive
   Set-AzContext -Subscription '<subscription-name>'
   ```

1. Register the maintenance resource provider:

   ```azurepowershell-interactive
   Register-AzResourceProvider -ProviderNamespace Microsoft.Maintenance
   ```

   Wait until the provider registration completes before you create the maintenance configuration.

1. Define the configuration values. Replace the resource group, Route Server name, and start date and time with your own values. Specify the start date and time in `yyyy-MM-dd HH:mm` format in the selected time zone:

   ```azurepowershell-interactive
   $ResourceGroupName = '<resource-group-name>'
   $RouteServerName = '<route-server-name>'
   $MaintenanceConfigName = "$RouteServerName-maintenance-cfg"
   $StartDateTime = '<yyyy-MM-dd HH:mm>'
   $TimeZone = 'UTC'
   $Duration = '05:00'
   ```

1. Get the Route Server and its region:

   ```azurepowershell-interactive
   $routeServer = Get-AzRouteServer -ResourceGroupName $ResourceGroupName -RouteServerName $RouteServerName
   $location = $routeServer.Location
   ```

1. Define the maintenance configuration parameters. Set `Duration` to at least five hours and `RecurEvery` to `1Day`:

   ```azurepowershell-interactive
   $configParams = @{
       ResourceGroupName = $ResourceGroupName
       Name              = $MaintenanceConfigName
       Location          = $location
       MaintenanceScope  = 'Resource'
       ExtensionProperty = @{ maintenanceSubScope = 'NetworkGatewayMaintenance' }
       StartDateTime     = $StartDateTime
       TimeZone          = $TimeZone
       Duration          = $Duration
       Visibility        = 'Custom'
       RecurEvery        = '1Day'
   }
   ```

1. Create the maintenance configuration with [New-AzMaintenanceConfiguration](/powershell/module/az.maintenance/new-azmaintenanceconfiguration):

   ```azurepowershell-interactive
   $config = New-AzMaintenanceConfiguration @configParams -ErrorAction Stop
   ```

1. Assign the configuration to your Route Server with [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment):

   ```azurepowershell-interactive
   $assignmentName = "$RouteServerName-maintenance"
   New-AzConfigurationAssignment `
       -ResourceGroupName           $ResourceGroupName `
       -ProviderName                'Microsoft.Network' `
       -ResourceType                'virtualHubs' `
       -ResourceName                $RouteServerName `
       -ConfigurationAssignmentName $assignmentName `
       -ResourceId                  $routeServer.Id `
       -MaintenanceConfigurationId  $config.Id `
       -Location                    $location
   ```

   Allow up to 24 hours for Route Server to follow the schedule after assignment.

### Verify the PowerShell configuration

1. Get the maintenance configuration and review its schedule:

   ```azurepowershell-interactive
   Get-AzMaintenanceConfiguration `
       -ResourceGroupName $ResourceGroupName `
       -Name $MaintenanceConfigName |
       Format-List StartDateTime, TimeZone, Duration, RecurEvery, ExtensionProperties
   ```

   Confirm that the start date, time zone, duration, and daily recurrence match your intended schedule.

1. Get the assignments for your Route Server:

   ```azurepowershell-interactive
   Get-AzConfigurationAssignment `
       -ResourceGroupName $ResourceGroupName `
       -ProviderName      'Microsoft.Network' `
       -ResourceType      'virtualHubs' `
       -ResourceName      $RouteServerName | Format-List
   ```

   Confirm that the output includes the assignment you created and that its maintenance configuration ID matches `$config.Id`.


### To remove a configuration assignment

A configuration assignment is removed automatically if the configuration or the resource is deleted.

If you want to manually remove a configuration assignment from the maintenance configuration to a resource, use the [Remove-AzConfigurationAssignment](/powershell/module/az.maintenance/remove-azconfigurationassignment) cmdlet.

## Related content

- [Configure and manage Azure Route Server](configure-route-server.md)
- [Monitor Azure Route Server](monitor-route-server.md)
