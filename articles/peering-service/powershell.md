---
title: Register Azure Peering Service (Preview) - Azure PowerShell
description: Learn about on how to register Azure Peering Service using Azure PowerShell
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: v-meravi
---

# Register Peering Service (Preview) connection using Azure PowerShell

*Peering Service* is a networking service that aims at enhancing customer connectivity to Microsoft Cloud services such as Office 365, Dynamics 365, SaaS services, Azure or any Microsoft services accessible via public internet. In this article, you will learn how to register *Peering Service* connection using the Azure PowerShell.

If you don't have an Azure subscription, create an [account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this quickstart requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. See [Install Azure PowerShell module](/powershell/azure/install-az-ps) for install and upgrade info.

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

Use the **Azure PowerShell** module to register and manage *Peering Service*. Register or manage *Peering Service* can be done from the PowerShell command line or in scripts.

> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Register Peering Service

## Prerequisites  

### Azure account

A valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Services are resources within Azure subscriptions.  

### Connectivity provider

You can work with an Internet Service provider or Internet Exchange Partner to obtain Peering Service to connect your network with Microsoft network.

Ensure the connectivity providers are partnered with Microsoft.

### Register subscription with the resource provider and feature flag

Before proceeding to the steps of registering *Peering Service*, you need to register your subscription with the resource provider and feature flag. The PowerShell commands are specified below:

```PowerShellCopy
Register-AzProviderFeature-FeatureName AllowPeeringService ProviderNamespace Microsoft.Peering 

Register-AzResourceProvider -ProviderNamespace Microsoft.Peering 

```

### Fetch the location and Service Provider 

Execute the following commands in the Azure PowerShell to acquire location and Service Provider to which the *Peering Service* should be enabled. 

- Get Peering Service locations

```
Get-AzPeeringServiceLocation -Country "United States"
```

- Get Peering Service Providers
              
```
Get-AzPeeringServiceProvider
```

### Register Peering Service

To register *Peering Service*, execute the below listed commands:

```loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "MyResourceGroup"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider 
```

### Register Peering Service Prefix

To specify the prefix through which the networking traffic is originated execute the below set of commands:

```$loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "MyResourceGroup"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider
$prefixName = "prefix1"
$prefix = “192.168.1.0/24”
$prefixService = $peeringService | New-AzPeeringServicePrefix -Name $prefixName -Prefix $prefix
```

### List all Peering Services

To view the list of all *Peering Services*, execute the following command:

```
$peeringService = Get-AzPeeringService
```

### List all Peering Service Prefixes

To view the list of all *Peering Services Prefixes*, execute the following command:
```
 $prefixName = "prefix1"
```

```
$prefix = Get-AzPeeringServicePrefix -PeeringServiceName "myPeeringService" -ResourceGroupName "MyResourceGroup" -Name "prefix1"
```

### Remove Peering Service Prefix

To remove *Peering Services Prefix*, execute the following command:

```
Remove-AzPeeringServicePrefix -ResourceGroupName  "MyResourceGroup" -Name "prefix1" -PeeringServiceName "myPeeringService"
```

## Next steps

To learn about Peering SErvice concepts, see [Peering Service Overview](about.md).

To learn about Peering Service connection, see [Peering Service Connection](connection.md).

To learn about Peering Service telemetry concepts, see [Peering Service Connection Telemetry](connection-telemetry.md).

To register connection using Azure portal, see [Register Peering Service connection - Azure portal](azure-portal.md).

To register connection using Azure CLI, see [Register Peering Service connection - Azure CLI](cli.md).