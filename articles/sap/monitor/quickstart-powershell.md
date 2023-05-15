---
title: Deploy Azure Monitor for SAP solutions with Azure PowerShell
description: Deploy Azure Monitor for SAP solutions with Azure PowerShell
author: sameeksha91
ms.author: sakhare
ms.topic: quickstart
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.date: 10/19/2022
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell, mode-api
# Customer intent: As a developer, I want to deploy Azure Monitor for SAP solutions with PowerShell so that I can create resources with PowerShell.
---

# Quickstart: deploy Azure Monitor for SAP solutions with PowerShell

Get started with Azure Monitor for SAP solutions by using the [Az.Workloads](/powershell/module/az.workloads) PowerShell module to create Azure Monitor for SAP solutions resources. You create a resource group, set up monitoring, and create a provider instance.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- If you choose to use PowerShell locally, this article requires that you install the Az PowerShell module.Connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-az-ps). Alternately, you can use [Azure Cloud Shell](../../cloud-shell/overview.md).

Install **Az.Workloads** PowerShell module by running command.

```azurepowershell-interactive
Install-Module -Name Az.Workloads
```

- If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources should be billed. Select a specific subscription using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

- Create or Use an existing Virtual Network for Azure Monitor for SAP solutions(AMS), which has access to the Source SAP systems Virtual Network.
- Create a new subnet with address range of IPv4/25 or larger in AMS associated virtual network with subnet delegation assigned to "Microsoft.Web/serverFarms".

   > [!div class="mx-imgBorder"]
   > ![Screenshot that shows Subnet creation for Azure Monitor for SAP solutions.](./media/quickstart-powershell/subnet-creation.png)

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group with the specified name and in the specified location.

```azurepowershell-interactive
New-AzResourceGroup -Name Contoso-AMS-RG -Location <myResourceLocation>
```

## Azure Monitor for SAP: Monitor Creation

To create an SAP monitor, use the [New-AzWorkloadsMonitor](/powershell/module/az.workloads/new-azworkloadsmonitor) cmdlet. The following example creates an SAP monitor for the specified subscription, resource group, and resource name.

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

To retrieve the properties of an SAP monitor, use the [Get-AzWorkloadsMonitor](/powershell/module/az.workloads/get-azworkloadsmonitor) cmdlet. The following example gets properties of an SAP monitor for the specified subscription, resource group, and resource name.

```azurepowershell-interactive
Get-AzWorkloadsMonitor -ResourceGroupName Contoso-AMS-RG -Name Contoso-AMS-Monitor
```

## Azure Monitor for SAP - Provider's Creation

### SAP NetWeaver Provider Creation

To create an SAP NetWeaver provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a NetWeaver provider for the specified subscription, resource group, and resource name.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

> [!NOTE]
>
> - hostname is SAP WebDispatcher or application server hostname/IP address
> - SapHostFileEntry is IP,FQDN,Hostname of every instance that gets listed in [GetSystemInstanceList](./provider-netweaver.md#determine-all-hostname-associated-with-an-sap-system)

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

### SAP HANA Provider Creation

To create an SAP HANA provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a HANA provider for the specified subscription, resource group, and resource name.

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

### Operating System Provider Creation

To create an Operating System provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates an OS provider for the specified subscription, resource group, and resource name.

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

### High Availability Cluster Provider Creation

To create  High Availability Cluster provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a High Availability Cluster provider for the specified subscription, resource group, and resource name.

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

### SQL Database Provider Creation

To create an SQL Database provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a SQL Database provider for the specified subscription, resource group, and resource name.

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

### IBM Db2 Provider Creation

To create an IBM Db2 provider, use the [New-AzWorkloadsProviderInstance](/powershell/module/az.workloads/new-azworkloadsproviderinstance) cmdlet. The following example creates a NetWeaver provider for the specified subscription, resource group, and resource name.

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

To retrieve properties of a provider instance, use the [Get-AzWorkloadsProviderInstance](/powershell/module/az.workloads/get-azworkloadsproviderinstance) cmdlet. The following example gets properties of:

- A provider instance for the specified subscription
- The resource group
- The SapMonitor name
- The resource name

```azurepowershell-interactive
Get-AzWorkloadsProviderInstance -ResourceGroupName Contoso-AMS-RG -SapMonitorName Contoso-AMS-Monitor
```

## Clean up of resources

If the resources created in this article aren't needed, you can delete them by running the following examples.

### Delete the provider instance

To remove a provider instance, use the
[Remove-AzWorkloadsProviderInstance](/powershell/module/az.workloads/remove-azworkloadsproviderinstance) cmdlet. The following example is for IBM DB2 provider instance deletion for the specified subscription, resource group, SapMonitor name, and resource name.

```azurepowershell-interactive
$subscription_id = '00000000-0000-0000-0000-000000000000'
$rg_name = 'Contoso-AMS-RG'
$monitor_name = 'Contoso-AMS-Monitor'
$provider_name = 'Contoso-AMS-Monitor-DB2'

Remove-AzWorkloadsProviderInstance -MonitorName $monitor_name -Name $provider_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id
```

### Delete the SAP monitor

To remove an SAP monitor, use the [Remove-AzWorkloadsMonitor](/powershell/module/az.workloads/remove-azworkloadsmonitor) cmdlet. The following example deletes an SAP monitor for the specified subscription, resource group, and monitor name.

```azurepowershell
$monitor_name = 'Contoso-AMS-Monitor'
$rg_name = 'Contoso-AMS-RG'
$subscription_id = '00000000-0000-0000-0000-000000000000'

Remove-AzWorkloadsMonitor -Name $monitor_name -ResourceGroupName $rg_name -SubscriptionId $subscription_id
```

- ### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name Contoso-AMS-RG
```

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)
