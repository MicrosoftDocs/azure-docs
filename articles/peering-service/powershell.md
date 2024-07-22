---
title: Create or change a Peering Service connection - Azure PowerShell
description: Learn how to create or change a Peering Service connection using PowerShell.
author: halkazwini
ms.author: halkazwini 
ms.service: peering-service
ms.topic: how-to
ms.date: 02/08/2024
ms.custom: devx-track-azurepowershell

#CustomerIntent: As an administrator, I want to learn how to create and manage a Peering Service connection using Azure PowerShell so I can enhance the connectivity to Microsoft services over the public internet.
---

# Create or change a Peering Service connection using PowerShell

Azure Peering Service is a networking service that enhances connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you learn how to create and change a Peering Service connection using Azure PowerShell. To learn how to manage a Peering Service connection using the Azure portal or Azure CLI, see [Create, change, or delete a Peering Service connection using the Azure portal](azure-portal.md) or [Create, change, or delete a Peering Service connection using the Azure CLI](cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell installed locally.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

- A connectivity provider. For more information, see [Peering Service partners](location-partners.md).

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

## Related content

- To learn more about Peering Service connections, see [Peering Service connection](connection.md).
- To learn more about Peering Service connection telemetry, see [Access Peering Service connection telemetry](connection-telemetry.md).