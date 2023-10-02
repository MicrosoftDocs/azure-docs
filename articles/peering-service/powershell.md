---
title: Create or change a Peering Service connection - Azure PowerShell
description: Learn how to create or change a Peering Service connection using PowerShell.
services: peering-service
author: halkazwini
ms.service: peering-service
ms.topic: how-to
ms.date: 01/19/2023
ms.author: halkazwini 
ms.custom: template-how-to, devx-track-azurepowershell, engagement-fy23
---

# Create or change a Peering Service connection using PowerShell

> [!div class="op_single_selector"]
> * [Portal](azure-portal.md)
> * [PowerShell](powershell.md)
> * [Azure CLI](cli.md)

Azure Peering Service is a networking service that enhances connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you'll learn how to create and change a Peering Service connection using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this article requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. For installation and upgrade information, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

Use the Azure PowerShell module to register and manage Peering Service. You can register or manage Peering Service from the PowerShell command line or in scripts.

## Prerequisites

- An Azure subscription.

- A connectivity provider. For more information, see [Peering Service partners](./location-partners.md).

## Register your subscription with the resource provider and feature flag

Before you proceed to the steps of creating Peering Service, register your subscription with the resource provider and feature flag using [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) and [Register-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature):

```azurepowershell-interactive
# Register Microsoft.Peering provider.
Register-AzResourceProvider -ProviderNamespace Microsoft.Peering
# Register AllowPeeringService feature.
Register-AzProviderFeature -FeatureName AllowPeeringService -ProviderNamespace Microsoft.Peering 
```

## List Peering Service locations and service providers 

Use [Get-AzPeeringServiceCountry](/powershell/module/az.peering/get-azpeeringservicecountry) to list the countries/regions where Peering Service is available and [Get-AzPeeringServiceLocation](/powershell/module/az.peering/get-azpeeringservicelocation) to list the available metro locations in each country/region where you can get the Peering Service: 

```azurepowershell-interactive
# List the countries/regions available for Peering Service.
Get-AzPeeringServiceCountry 
# List metro locations serviced in a country
Get-AzPeeringServiceLocation -Country "United States"
```

Use [Get-AzPeeringServiceProvider](/powershell/module/az.peering/get-azpeeringserviceprovider) to get a list of available [Peering Service providers](location-partners.md):
```azurepowershell-interactive
Get-AzPeeringServiceProvider
```

## Create a Peering Service connection

Create a Peering Service connection using [New-AzPeeringService](/powershell/module/az.peering/new-azpeeringservice):

```azurepowershell-interactive
New-AzPeeringService -ResourceGroupName myResourceGroup -Name myPeeringService -PeeringLocation Virginia -PeeringServiceProvider Contoso
```

## Add the Peering Service prefix

Use [New-AzPeeringServicePrefix](/powershell/module/az.peering/new-azpeeringserviceprefix) to add the prefix provided to you by the connectivity provider:

```azurepowershell-interactive
New-AzPeeringServicePrefix -ResourceGroupName myResourceGroup -PeeringServiceName myPeeringService -Name myPrefix -prefix 240.0.0.0/32 -ServiceKey 00000000-0000-0000-0000-000000000000
```

## List all Peering Services connections

To view the list of all Peering Service connections, use [Get-AzPeeringService](/powershell/module/az.peering/get-azpeeringservice):

```azurepowershell-interactive
Get-AzPeeringService | Format-Table Name, PeeringServiceLocation, PeeringServiceProvider, Location
```

## List all Peering Service prefixes

To view the list of all Peering Service prefixes, use [Get-AzPeeringServicePrefix](/powershell/module/az.peering/get-azpeeringserviceprefix):

```azurepowershell-interactive
Get-AzPeeringServicePrefix -PeeringServiceName myPeeringService -ResourceGroupName myResourceGroup
```

## Remove the Peering Service prefix

To remove the Peering Service prefix, use [Remove-AzPeeringServicePrefix](/powershell/module/az.peering/remove-azpeeringserviceprefix):

```azurepowershell-interactive
Remove-AzPeeringServicePrefix -ResourceGroupName myResourceGroup -Name myPeeringService -PrefixName myPrefix
```

## Next steps

- To learn more about Peering Service connections, see [Peering Service connection](connection.md).
- To learn more about Peering Service connection telemetry, see [Access Peering Service connection telemetry](connection-telemetry.md).