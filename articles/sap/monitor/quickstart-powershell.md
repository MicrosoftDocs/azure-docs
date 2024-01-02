---
title: Deploy Azure Monitor for SAP solutions by using Azure PowerShell
description: Learn how to use Azure PowerShell to deploy Azure Monitor for SAP solutions.
author: sameeksha91
ms.author: sakhare
ms.topic: quickstart
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.date: 10/19/2022
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell, mode-api
# Customer intent: As a developer, I want to deploy Azure Monitor for SAP solutions by using PowerShell so that I can create resources by using PowerShell.
---

# Quickstart: Deploy Azure Monitor for SAP solutions by using PowerShell

In this quickstart, get started with Azure Monitor for SAP solutions by using the [Az.Workloads](/powershell/module/az.workloads) PowerShell module to create Azure Monitor for SAP solutions resources. You create a resource group, set up monitoring, and create a provider instance.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you choose to use PowerShell locally, this article requires that you install the Az PowerShell module. Connect to your Azure account by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-az-ps). Alternately, you can use [Azure Cloud Shell](../../cloud-shell/overview.md).

  Install the **Az.Workloads** PowerShell module by running this command:

  ```azurepowershell-interactive
  Install-Module -Name Az.Workloads
  ```

- If you have multiple Azure subscriptions, select the subscription in which the resources should be billed by using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet:

  ```azurepowershell-interactive
  Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
  ```

- Create or choose a virtual network for Azure Monitor for SAP solutions that has access to the source SAP system's virtual network.
- Create a subnet with an address range of IPv4/25 or larger in the virtual network that's associated with Azure Monitor for SAP solutions, with subnet delegation assigned to **Microsoft.Web/serverFarms**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot that shows subnet creation for Azure Monitor for SAP solutions.](./media/quickstart-powershell/subnet-creation.png)

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group with the specified name and in the specified location:

```azurepowershell-interactive
New-AzResourceGroup -Name Contoso-AMS-RG -Location <myResourceLocation>
```

## Create an SAP monitor

To create an SAP monitor, use the [New-AzWorkloadsMonitor](/powershell/module/az.workloads/new-azworkloadsmonitor) cmdlet. The following example creates an SAP monitor for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$monitor_name = 'Contoso-AMS-Monitor'
$rg_name = 'Contoso-AMS-RG'
$subscription_id = '00000000-0000-0000-0000-000000000000'
$location = 'eastus'
$managed_rg_name = 'MRG_Contoso-AMS-Monitor'
$subnet_id = '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ams-vnet-rg/providers/Microsoft.Network/virtualNetworks/ams-vnet-eus/subnets/Contoso-AMS-Monitor'
$route_all = 'RouteAll'

New-AzWorkloadsMonitor -Name $monitor_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -Location $location -AppLocation $location -ManagedResourceGroupName $managed_rg_name -MonitorSubnet $subnet_id -RoutingPreference $route_all
```

To get the properties of an SAP monitor, use the [Get-AzWorkloadsMonitor](/powershell/module/az.workloads/get-azworkloadsmonitor) cmdlet. The following example gets the properties of an SAP monitor for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
Get-AzWorkloadsMonitor -ResourceGroupName Contoso-AMS-RG -Name Contoso-AMS-Monitor
```

## Create a provider

### Create an SAP NetWeaver provider

To create an SAP NetWeaver provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a NetWeaver provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

In the following code, `hostname` is the host name or IP address for SAP Web Dispatcher or the application server. `SapHostFileEntry` is the IP address, fully qualified domain name, or host name of every instance that's listed in [GetSystemInstanceList](./provider-netweaver.md#adding-netweaver-provider) point 6 (xi).

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-NW'

$SapClientId = '000'
$SapHostFileEntry = '["10.0.0.0 x01scscl1.ams.azure.com x01scscl1,10.0.0.0 x01erscl1.ams.azure.com x01erscl1,10.0.0.1 x01appvm1.ams.azure.com x01appvm1,10.0.0.2 x01appvm2.ams.azure.com x01appvm2"]'
$hostname = 'x01appvm0'
$instance_number = '00'
$password = 'Password@123'
$sapportNumber = '8000'
$sap_sid = 'X01'
$sap_username = 'AMS_NW'
$providerSetting = New-AzWorkloadsProviderSapNetWeaverInstanceObject -SapClientId $SapClientId -SapHostFileEntry $SapHostFileEntry -SapHostname $hostname -SapInstanceNr $instance_number -SapPassword $password -SapPortNumber $sapportNumber -SapSid $sap_sid -SapUsername $sap_username -SslPreference Disabled

New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting

```

### Create an SAP HANA provider

To create an SAP HANA provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a HANA provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-HANA'

$hostname = '10.0.0.0'
$sap_sid = 'X01'
$username = 'SYSTEM'
$password = 'password@123'
$dbName = 'SYSTEMDB'
$instance_number = '00'

$providerSetting = New-AzWorkloadsProviderHanaDbInstanceObject -Name $dbName -Password $password  -Username SYSTEM -Hostname $hostname -InstanceNumber $instance_number -SapSid $sap_sid -SqlPort 1433 -SslPreference Disabled
New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting
```

### Create an operating system provider

To create an operating system provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates an operating system provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-OS'

$hostname = 'http://10.0.0.0:9100/metrics'
$sap_sid = 'X01'

$providerSetting = New-AzWorkloadsProviderPrometheusOSInstanceObject -PrometheusUrl $hostname -SapSid $sap_sid -SslPreference Disabled
New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting
```

### Create a high-availability cluster provider

To create a high-availability cluster provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a high-availability cluster provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-HA'

$PrometheusHa_Url = 'http://10.0.0.0:44322/metrics'
$sap_sid = 'X01'
$cluster_name = 'haCluster'
$hostname = '10.0.0.0'
$providerSetting = New-AzWorkloadsProviderPrometheusHaClusterInstanceObject -ClusterName $cluster_name -Hostname $hostname -PrometheusUrl $PrometheusHa_Url -Sid $sap_sid -SslPreference Disabled

New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting
```

### Create a Microsoft SQL Server provider

To create a Microsoft SQL Server provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a SQL Server provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-SQL'

$hostname = '10.0.0.0'
$sap_sid = 'X01'
$username = 'AMS_SQL'
$password = 'Password@123'
$port = '1433'

$providerSetting = New-AzWorkloadsProviderSqlServerInstanceObject -Password $password -Port $port -Username $username -Hostname $hostname -SapSid $sap_sid -SslPreference Disabled
New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting
```

### Create an IBM Db2 provider

To create an IBM Db2 provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates an IBM Db2 provider for the specified subscription, resource group, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-DB2'

$hostname = '10.0.0.0'
$sap_sid = 'X01'
$username = 'AMS_DB2'
$password = 'password@123'
$dbName = 'X01'
$port = '5912'

$providerSetting = New-AzWorkloadsProviderDB2InstanceObject -Name $dbName -Password $password -Port $port -Username $username -Hostname $hostname -SapSid $sap_sid -SslPreference Disabled

New-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id -ProviderSetting $providerSetting
```

### Get properties of a provider instance

To get the properties of a provider instance, use the [Get-AzWorkloadsProviderInstance](/powershell/module/az.workloads/get-azworkloadsproviderinstance) cmdlet. The following example gets the properties of:

- A provider instance for the specified subscription.
- The resource group.
- The SAP monitor name.
- The resource name.

```azurepowershell-interactive
Get-AzWorkloadsProviderInstance -ResourceGroupName Contoso-AMS-RG -SapMonitorName Contoso-AMS-Monitor
```

## Clean up resources

If you don't need the resources that you created in this article, you can delete them by using the following examples.

### Delete the provider instance

To remove a provider instance, use the
[Remove-AzWorkloadsProviderInstance](/powershell/module/az.workloads/remove-azworkloadsproviderinstance) cmdlet. The following example deletes an IBM DB2 provider instance for the specified subscription, resource group, SAP monitor name, and resource name:

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-DB2'

Remove-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id
```

### Delete the SAP monitor

To remove an SAP monitor, use the [Remove-AzWorkloadsMonitor](/powershell/module/az.workloads/remove-azworkloadsmonitor) cmdlet. The following example deletes an SAP monitor for the specified subscription, resource group, and monitor name:

```azurepowershell
$monitor_name = 'Contoso-AMS-Monitor'
$rg_name = 'Contoso-AMS-RG'
$subscription_id = '00000000-0000-0000-0000-000000000000'

Remove-AzWorkloadsMonitor -Name $monitor_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id
```

### Delete the resource group

The following example deletes the specified resource group and all the resources in it.

> [!CAUTION]
> If resources outside the scope of this article exist in the specified resource group, they'll also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name Contoso-AMS-RG
```

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)
