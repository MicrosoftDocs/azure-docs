---
title: Configure customer-controlled maintenance for Azure Firewall
description: Learn how to configure customer-controlled maintenance for your Azure Firewall using the Azure portal, or PowerShell.
services: firewall
author: varunkalyana
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 07/01/2025
ms.author: varunkalyana
---

# Configure customer-controlled maintenance for Azure Firewall

This article explains how to configure customer-controlled maintenance windows for Azure Firewall. It provides step-by-step guidance for scheduling maintenance using the Azure portal or PowerShell.

Azure Firewall is a managed, cloud-based network security service designed to protect Azure Virtual Network and Azure Virtual WAN resources. Regular upgrades are essential to ensure the service remains effective against emerging cyber threats, complies with regulatory requirements, and incorporates the latest features, security enhancements, and performance improvements.

Upgrades are typically scheduled during off-business hours to minimize disruptions to critical business operations and reduce application downtime. While many modern applications can handle transient network interruptions through autoreconnections, legacy applications such as SAP and Azure Virtual Desktop (AVD) might require persistent connections. These applications are more sensitive to connection drops, which can lead to disruptions during upgrade processes and affect business continuity. To address this, Azure Firewall now supports configurable daily maintenance windows, allowing you to align upgrade schedules with your operational needs.

For more information on limitations and frequently asked questions about customer-controlled maintenance, see the [Azure Firewall FAQ](firewall-faq.yml#customer-controlled-maintenance).

## Maintenance configuration

#### [Azure portal](#tab/portal)
First you need to register the Azure Resource Provider with Microsoft.Maintenance.
Register the Azure Resource Provider.

```powershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Maintenance
```

Then, you can configure customer-controlled maintenance in the Azure portal using two methods: 

- [**From the Azure Firewall resource**](#configure-maintenance-from-the-azure-firewall-resource): This method allows you to configure maintenance directly for a specific Azure Firewall.
- [**From the maintenance configurations page**](#set-up-in-maintenance-configurations): This method enables you to create a maintenance configuration that can be applied to multiple Azure Firewalls, offering greater flexibility and efficiency.

## Configure maintenance from the Azure Firewall resource

Follow these steps to create a maintenance configuration directly from the Azure Firewall resource:

1. In the Azure portal, navigate to the **Firewall** resource for which you want to create a maintenance configuration.
1. On the **Azure Firewall** page, navigate to **Settings** and select **Maintenance**.
1. Select **+ Add a configuration** to open the **Configure maintenance control** page.

    :::image type="content" source="media/customer-controlled-maintenance/maintenance-overview.png" alt-text="Screenshot showing the Maintenance configuration option in an Azure Firewall resource.":::

1. In the configuration panel, choose an existing configuration from the drop-down menu or create a new configuration.
1. Enter a descriptive name for the maintenance configuration and select **Edit schedule**. Define a maintenance    schedule of atleast 5 hours recurring daily and select **Save**.

    :::image type="content" source="media/customer-controlled-maintenance/maintenance-schedule-on-firewall.png" alt-text="Screenshot showing the Maintenance configuration scheduling in an Azure Firewall resource.":::

1. Select **Enable** to apply the maintenance configuration on the Azure Firewall resource.

Complete the configuration as required to align with your operational needs.

## Set up in Maintenance Configurations

Follow these steps to create a maintenance configuration in the Azure portal using the *Maintenance Configurations*
page:

1. In the Azure portal, search for **Maintenance Configurations**.
1. On the **Maintenance Configurations** page, select **+ Create** to open the **Create a maintenance configuration** page.

    :::image type="content" source="media/customer-controlled-maintenance/maintenance-configuration-overview.png" alt-text="Screenshot showing the creation of maintenance configuration.":::

1. On the **Basics** tab, provide the following details:

    - **Subscription**: Select your subscription.
    - **Resource Group**: Choose the resource group where your resources are located.
    - **Configuration name**: Enter a descriptive name for the maintenance configuration.
    - **Region**: Select the same region as your firewall resources.
    - **Maintenance scope**: Choose **Resource** from the dropdown.
    - **Maintenance subscope**: Select **Network Security** from the dropdown.

1. Select **Add a schedule** to define the maintenance schedule. 

    > [!NOTE]
    > The maintenance window must be at least 5 hours in duration.

1. After specifying the schedule, select **Save**.
1. Proceed to the **Resources** tab. Select **+ Add resources** to associate resources with the maintenance configuration. You can add resources during the creation process or later. For this example, you're adding resources during the configuration creation.
1. On the **Select resources** page, verify that your resources are listed. If not, ensure the correct region and maintenance scope are selected. Choose the resources to include in the maintenance configuration, then select **Save**.

    :::image type="content" source="media/customer-controlled-maintenance/maintenance-resource-association.png" alt-text="Screenshot showing the association of resources to the maintenance configuration.":::

1. Select **Review + Create** to validate the configuration. Once validation is successful, select **Create** to finalize the setup.

### View associated resources

Follow these steps to view the resources linked to a maintenance configuration:

1. Navigate to the **Maintenance Configurations** page in the Azure portal.
1. Select the maintenance configuration you want to inspect.
1. In the left-hand menu, navigate to **Settings** and select **Resources**. This opens the **Resources** page, where you can see all resources associated with the selected maintenance configuration.

### Add resources

To add resources to an existing maintenance configuration, follow these steps:

1. Navigate to the **Maintenance Configurations** page in the Azure portal.
1. Select the maintenance configuration you want to modify.
1. In the left-hand menu, go to **Settings** and select **Resources**. This opens the **Resources** page, where you can view all resources associated with the selected maintenance configuration.
1. On the **Resources** page, select **+ Add** to include a new resource in the maintenance configuration.

### Remove resources

To remove resources associated with a maintenance configuration, follow these steps:

1. Navigate to the **Maintenance Configurations** page in the Azure portal.
1. Select the maintenance configuration from which you want to remove resources.
1. In the left-hand menu, navigate to **Settings** and select **Resources** to open the **Resources** page and view the associated resources.
1. On the **Resources** page, select the resource you want to remove, then select **Remove**.
1. In the confirmation dialog, select **Yes** to finalize the removal.

#### [PowerShell](#tab/powershell)

Use the following steps to assign policy to the resources. If you're new to Azure PowerShell, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).

1. Set the Subscription context.

    ```powershell-interactive
    set-AzContext -Subscription 'Subscription ID’
    ```

1. Register the Azure Resource Provider.

    ```powershell-interactive
    Register-AzResourceProvider -ProviderNamespace Microsoft.Maintenance
    ```

1. Create a maintenance configuration using the `New-AzMaintenanceConfiguration` cmdlet.

    - The `-Duration` must be a minimum of a five hour window.
    - The `-RecurEvery` is per day.
    - For TimeZone options, see [Time Zones](/dotnet/api/system.timezoneinfo).
    
    ```powershell-interactive
    New-AzMaintenanceConfiguration -ResourceGroupName <rgName> -Name <configurationName> -Location <arm location of resource> -MaintenanceScope Resource -ExtensionProperty @{"maintenanceSubScope"="NetworkSecurity"} -StartDateTime "<date in YYYY-MM-DD HH:mm format>" -TimeZone "<Selected Time Zone>" -Duration "<Duration in HH:mm format>" -Visibility "Custom" -RecurEvery Day
    ```

1. Save the maintenance configuration as a variable named `$config`.

    ```powershell-interactive
    $config = Get-AzMaintenanceConfiguration -ResourceGroupName <rgName> -Name <configurationName>
    ```

1. Save the service resource as a variable named `$serviceResource`.

1. Create the maintenance configuration assignment using the `New-AzConfigurationAssignment` cmdlet. The maintenance policy is applied to the resource within 24 hours.

    ```powershell-interactive
    New-AzConfigurationAssignment -ResourceGroupName <rgName> -ProviderName "Microsoft.Network" -ResourceType "<your resource's resource type per ARM. For example, azureFirewalls>" -ResourceName "<your resource's name>" -ConfigurationAssignmentName "<assignment name>" -ResourceId $serviceResource.Id -MaintenanceConfigurationId $config.Id -Location "<arm location of resource>"
    ```

1. To remove a configuration assignment:

    - A configuration assignment is removed automatically if the configuration or the resource is deleted.
    - If you want to manually remove a configuration assignment from the maintenance configuration to a resource, use the `Remove-AzConfigurationAssignment` cmdlet.

    ```powershell-interactive
    Remove-AzConfigurationAssignment -ResourceGroupName <rgName> -ProviderName "Microsoft.Network" -ResourceType "<your resource's resource type per ARM. For example, azureFirewalls>" -ResourceName "<your resource's name>" -ConfigurationAssignmentName "<assignment name>"
    ```

#### [CLI](#tab/cli)

Use the following steps to assign policy to the resources. If you're new to Azure CLI, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

1. Set the Subscription context.

    ```azurecli-interactive
    az account set --subscription "<subscription id>"
    ```

1. Register the Azure Resource Provider.

    ```azurecli-interactive
    az provider register --namespace Microsoft.Maintenance
    ```

1. Create a maintenance configuration using the `az maintenance configuration create` command.

    - Sets the `--location` to specify the Azure region for the maintenance configuration.
    - Sets the `--maintenance-scope` to `Resource`.
    - Sets the extension property to `maintenanceSubScope=NetworkSecurity` using `--extension-properties`.
    - Sets the `--maintenance-window-duration` to specify the maintenance window length (must be at least five hours, format: HH:mm).
    - Sets the `--maintenance-window-start-date-time` to specify when the maintenance window begins (format: YYYY-MM-DD HH:MM).
    - Sets the `--maintenance-window-expiration-date-time` to specify when the maintenance window expires (format: YYYY-MM-DD HH:MM).
    - Sets the `--maintenance-window-recur-every` to `Day` for daily recurrence.
    - Sets the `--maintenance-window-time-zone` to specify the time zone for the schedule. For available time zones, see [Time Zones](/dotnet/api/system.timezoneinfo).
    - Sets the `--namespace` to `Microsoft.Maintenance`.
    - Sets the `--visibility` to `Custom`.
    - Sets the `--resource-group` to specify the resource group.
    - Sets the `--resource-name` to specify the name of the maintenance configuration.

    ```azurecli-interactive
    az maintenance configuration create \
        --location "centraluseuap" \
        --maintenance-scope "Resource" \
        --maintenance-window-duration "HH:mm" \
        --maintenance-window-start-date-time "YYYY-MM-DD HH:MM" \
        --maintenance-window-expiration-date-time "YYYY-MM-DD HH:MM" \
        --maintenance-window-recur-every "Day" \
        --maintenance-window-time-zone "Pacific Standard Time" \
        --namespace "Microsoft.Maintenance" \
        --visibility "Custom" \
        --resource-group "<rg name>" \
        --resource-name "<config name>" \
        --extension-properties maintenanceSubScope=NetworkSecurity
    ```

    > [!NOTE]
    > The resource ID for the maintenance configuration is displayed in the output of the above command. Use this value for `--maintenance-configuration-id` in the next step.

1. Create the maintenance configuration assignment using the `az maintenance assignment create` command. The maintenance policy is applied to the resource within 24 hours.

    ```azurecli-interactive
    az maintenance assignment create \
        --maintenance-configuration-id "<config resource id>" \
        --name "<assignment name>" \
        --provider-name "Microsoft.Network" \
        --resource-group "<firewall rg name>" \
        --resource-name "<firewall name>" \
        --resource-type "azureFirewalls"
    ```

### Remove a configuration assignment

To manually remove a configuration assignment from a resource, use the `az maintenance assignment delete` command.

```azurecli-interactive
az maintenance assignment delete \
    --resource-group "<firewall rg name>" \
    --resource-name "<firewall name>" \
    --resource-type "azureFirewalls" \
    --provider-name "Microsoft.Network" \
    --name "<assignment name>"
```

### View a configuration assignment

To view a maintenance configuration assignment using Azure CLI, use the following command:

```azurecli-interactive
az maintenance configuration show \
    --resource-group "<resource-group-name>" \
    --resource-name "<configuration-name>"
```

Replace `<resource-group-name>` with your resource group and `<configuration-name>` with your maintenance configuration name.

---

## Next steps

To explore the latest capabilities in Azure Firewall, see [Azure Firewall preview features](firewall-preview.md).











