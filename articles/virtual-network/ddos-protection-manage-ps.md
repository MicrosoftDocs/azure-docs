---
title: Manage DDoS Protection using Azure PowerShell | Microsoft Docs
description: Learn how to manage Azure DDoS Protection using Azure PowerShell.
services: virtual-network
documentationcenter: na
author: kumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/15/2017
ms.author: kumud

---
# Manage DDoS Protection using Azure PowerShell

This article shows you how to use Azure PowerShell to enable DDoS Protection, disable DDoS Protection, and use telemetry to mitigate an attack.

>[!IMPORTANT]
>DDoS Protection is currently in preview. A limited number of Azure resources support DDoS Protection, and in a select number of regions. You need to [register for the service](http://aka.ms/ddosprotection) during the limited preview to get the DDoS Protection service enabled for your subscription. You are contacted by the Azure DDoS team upon registration to guide you through the enablement process. Azure DDoS Protection service is available in US East, US West, and US Central regions. During preview, you are not charged for using the service. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. If you need to install or upgrade Azure PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Enable DDoS Protection

### Create a new virtual network and enable DDoS Protection

To create a virtual network with DDoS Protection enabled, run the following example:

```powershell
New-AzureRmResourceGroup -Name <ResourceGroupName> -Location westcentralus 
$frontendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name <frontendSubnet> -AddressPrefix "10.0.1.0/24" 
$backendSubnet = New-AzureRmVirtualNetworkSubnetConfig -Name <backendSubnet> -AddressPrefix "10.0.2.0/24" 
New-AzureRmVirtualNetwork -Name <MyVirtualNetwork> -ResourceGroupName <ResourceGroupName>  -Location westcentralus  -AddressPrefix "10.0.0.0/16" -Subnet $frontendSubnet,$backendSubnet -DnsServer 10.0.1.5,10.0.1.6 -EnableDDoSProtection
```

This example creates a virtual network with two subnets and two DNS servers. The effect of specifying the DNS servers on the virtual network is that the NICs/VMs that are deployed into this virtual network inherit these DNS servers as defaults. DDoS protection is enabled for all the protected resources in the virtual network.

### Enable DDoS Protection on an existing virtual network

To enable DDoS Protection on an existing virtual network, run the following example:

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps.enableDdosProtection = $true
Set-AzureRmResource -PropertyObject $vnetProps -ResourceGroupName "ResourceGroupName" -ResourceName "ResourceName" -ResourceType Microsoft.Network/virtualNetworks
```

## Disable DDoS Protection on a virtual network

To disable DDoS protection on a virtual network, run the following example:

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps.enableDdosProtection = $false
Set-AzureRmResource -PropertyObject $vnetProps -ResourceGroupName <RessourceGroupName> -ResourceName <ResourceName> -ResourceType "Microsoft.Network/virtualNetworks"
```

## Review the DDoS protection status of virtual networks 

```powershell
$vnetProps = (Get-AzureRmResource -ResourceType "Microsoft.Network/virtualNetworks" -ResourceGroup <ResourceGroupName> -ResourceName <ResourceName>).Properties
$vnetProps
```

## Use DDoS Protection telemetry

Learn how to use the Azure DDoS Protection service telemetry while under an attack using the Azure Monitor. 

Telemetry for an attack is provided through Azure Monitor in real time. The telemetry is available only for the duration that a public IP address is under mitigation. You will not see telemetry before or after an attack is mitigated.

### Configure alerts on DDoS Protection metrics

Leveraging the Azure Monitor alert configuration, you can select any of the available DDoS Protection metrics to alert when there’s an active mitigation during an attack.

#### Configure email alert rules via Azure PowerShell

1. Get a list of the subscriptions you have available. Verify that you are working with the right subscription. If not, set it to the right one using the output from Get-AzureRmSubscription. 

    ```powershell
	Get-AzureRmSubscription 
    Get-AzureRmContext 
    Set-AzureRmContext -SubscriptionId <subscriptionid>
	```

2. To list existing rules on a resource group, use the following command: 

    ```powershell
	Get-AzureRmAlertRule -ResourceGroup <myresourcegroup> -DetailedOutput
	```

3. To create a rule, you need to have several important pieces of information first. 

    - The Resource ID for the resource you want to set an alert for.
	- The metric definitions available for that resource. One way to get the Resource ID is to use the Azure portal. Assuming the resource is already created, select it in the Azure portal. Then in the next page, select *Properties* under the *Settings* section. The **RESOURCE ID** is a field in the next page. Another way is to use the [Azure Resource Explorer](https://resources.azure.com/). An example Resource ID for a public IP is: `/subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Network/publicIPAddresses/mypublicip`

    The following example sets up an alert on a Public IP associated to a virtual network. The metric to create an alert on is **Under DDoS attack or not**. This is a boolean value 1 or 0. A **1** means you are under attack. A **0** means you are not under attack. The alert is created when you are under the attack within last 5 minutes.

	To create a webhook or send email when an alert is created, first create the email and/or webhooks. Then immediately create the rule afterwards with the -Actions tag and as shown in the following example. You cannot associate webhook or emails with already created rules using PowerShell.

	```powershell
	$actionEmail = New-AzureRmAlertRuleEmail -CustomEmail myname@company.com 
    Add-AzureRmMetricAlertRule -Name <myMetricRuleWithEmail> -Location "West Central US" -ResourceGroup <myresourcegroup> -TargetResourceId /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroup/providers/Microsoft.Network/publicIPAddresses/mypublicip -MetricName "IfUnderDDoSAttack" -Operator GreaterThan -Threshold 0 -WindowSize 00:05:00 -TimeAggregationOperator Total -Actions $actionEmail-Description "Under DDoS Attack" 
    ```

4. To verify that your alerts have been created properly by looking at the individual rules.

    ```powershell
	Get-AzureRmAlertRule -Name myMetricRuleWithEmail -ResourceGroup myresourcegroup -DetailedOutput 
    Get-AzureRmAlertRule -Name myLogAlertRule -ResourceGroup myresourcegroup -DetailedOutput
	```

You can also learn more about [configuring webhooks](../monitoring-and-diagnostics/insights-webhooks-alerts.md) and [logic apps](../logic-apps/logic-apps-what-are-logic-apps.md) for creating alerts.

## Configure logging on DDoS Protection metrics

Refer to the [PowerShell quick start samples](../monitoring-and-diagnostics/insights-powershell-samples.md) to help you access and configure Azure diagnostic logging via PowerShell.

## Next steps

- [Read more about Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md)
- [Analyze logs from Azure storage with Log Analytics](../log-analytics/log-analytics-azure-storage.md)
- [Get started with Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)