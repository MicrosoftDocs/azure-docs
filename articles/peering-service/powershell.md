---
title: 'Register a Peering Service connection - Azure PowerShell '
description: In this tutorial learn how to register a Peering Service connection with PowerShell.
services: peering-service
author: derekolo
ms.service: peering-service
ms.topic: tutorial
ms.date: 05/18/2020
ms.author: derekol
Customer intent: Customer wants to measure their connection telemetry per prefix to Microsoft services with Azure Peering Service .
---

# Tutorial: Register a Peering Service connection using Azure PowerShell

In this tutorial, you'll learn how to register Peering Service using Azure PowerShell.

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Office 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. In this article, you'll learn how to register a Peering Service connection by using Azure PowerShell.

If you don't have an Azure subscription, create an [account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this quickstart requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. For installation and upgrade information, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

Use the Azure PowerShell module to register and manage Peering Service. You can register or manage Peering Service from the PowerShell command line or in scripts.


## Prerequisites  
You must have the following:

### Azure account

You must have a valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Service is a resource within Azure subscriptions.

### Connectivity provider

You can work with an internet service provider or internet exchange partner to obtain Peering Service to connect your network with the Microsoft network.

Make sure that the connectivity providers are partnered with Microsoft.

### Register a subscription with the resource provider and feature flag

Before you proceed to the steps of registering Peering Service, register your subscription with the resource provider and feature flag by using Azure PowerShell. The Azure PowerShell commands are specified here:

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName AllowPeeringService ProviderNamespace Microsoft.Peering 

Register-AzResourceProvider -ProviderNamespace Microsoft.Peering 

```

### Fetch the location and service provider 

Run the following commands in Azure PowerShell to acquire the location and service provider to which the Peering Service should be enabled. 

Get Peering Service locations:

```azurepowershell-interactive
# Gets a list of available countries
Get-AzPeeringServiceCountry 
# Gets a list of metro locations serviced by country
Get-AzPeeringServiceLocation -Country "United States"
```

Get Peering Service providers:
              
```azurepowershell-interactive
Get-AzPeeringServiceProvider
```

### Register the Peering Service connection

Register the Peering Service connection by using the following set of commands via Azure PowerShell. This example registers the Peering Service named myPeeringService.

```azurepowershell-interactive
$loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "MyResourceGroup"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider
```

### Register the Peering Service prefix

Register the prefix that's provided by the connectivity provider by executing the following commands via Azure PowerShell. This example registers the prefix named myPrefix.

```azurepowershell-interactive
$loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "MyResourceGroup"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider
$prefixName = "myPrefix"
$prefix = “192.168.1.0/24”
$serviceKey = "6f48cdd6-2c2e-4722-af89-47e27b2513af"
$prefixService = $peeringService | New-AzPeeringServicePrefix -Name $prefixName -Prefix $prefix -ServiceKey $serviceKey
```

### List all the Peering Services connections

To view the list of all Peering Services, run the following command:

```azurepowershell-interactive
$peeringService = Get-AzPeeringService
```

### List all the Peering Service prefixes

To view the list of all Peering Service prefixes, run the following command:

```azurepowershell-interactive
 $prefixName = "myPrefix"
```

```azurepowershell-interactive
$prefix = Get-AzPeeringServicePrefix -PeeringServiceName "myPeeringService" -ResourceGroupName "MyResourceGroup" -Name "myPrefix"
```

### Remove the Peering Service prefix

To remove the Peering Service prefix, run the following command:

```azurepowershell-interactive
Remove-AzPeeringServicePrefix -ResourceGroupName  "MyResourceGroup" -Name "myPrefix" -PeeringServiceName "myPeeringService"
```

## Next steps

- To learn about Peering Service connection, see [Peering Service connection](connection.md).
- To learn about Peering Service connection telemetry, see [Peering Service connection telemetry](connection-telemetry.md).
- To register a Peering Service connection by using the Azure portal, see [Register a Peering Service connection - Azure portal](azure-portal.md).
- To register a Peering Service connection by using the Azure CLI, see [Register a Peering Service connection - Azure CLI](cli.md).
