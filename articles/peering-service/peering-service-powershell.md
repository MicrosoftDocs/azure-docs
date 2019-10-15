---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Register a Peering Service connection using PowerShell

Peering Service is a networking service that improves internet access to Microsoft Public services such as Office 365, Dynamics 365, SaaS services running on Azure or any Microsoft services accessible via public IP Azure. In this article, you will learn how to register a Peering Service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use PowerShell locally instead, this quickstart requires you to use Azure PowerShell module version 1.0.0 or later. To find the installed version, run `Get-Module -ListAvailable Az`. See [Install Azure PowerShell module](/powershell/azure/install-az-ps) for install and upgrade info.

Finally, if you're running PowerShell locally, you'll also need to run `Connect-AzAccount`. That command creates a connection with Azure.

Use the **Azure PowerShell** module to register and manage Peering Service. Register or manage Peering Service can be done from the PowerShell command line or in scripts.

## Register the Peering Service

### Pre-processing commands  

Before proceeding to the steps of registering the Peering Service, you need to register your subscription with the resource provider and feature flag.  

### Register your subscription with the resource provider and feature flag  

```PowerShellCopy
Register-AzProviderFeature-FeatureName AllowPeeringService ProviderNamespace Microsoft.Peering 

Register-AzResourceProvider -ProviderNamespace Microsoft.Peering 
```

### Fetch the Location and Service Provider 

Execute the following commands in the Azure Power Shell to acquire location and Service Provider to which the Peering Service should be enabled. 

- Get Peering Service locations

```
Get-AzPeeringServiceLocation -Country "United States"
```

- Get Peering Service Providers
              
```
Get-AzPeeringServiceProvider
```

### Register the Peering Service

To register the Peering Service, execute the below listed commands:

```loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "Building40"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider 
```

### Register the Peering Service Prefix

To specify the prefix through which the networking traffic is originated execute the below set of commands:

```$loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "Building40"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider
$prefixName = "prefix1"
$prefix = “192.168.1.0/24”
$prefixService = $peeringService | New-AzPeeringServicePrefix -Name $prefixName -Prefix $prefix
```

### List all Peering Services

To view all the Peering Services, execute the following command:

```
$peeringService = Get-AzPeeringService
```

### List all Peering Service Prefixes

To view all the Peering Services Prefixes, execute the following command:
```
 $prefixName = "prefix1"
```

```
$prefix = Get-AzPeeringServicePrefix -PeeringServiceName "myPeeringService" -ResourceGroupName "Building40" -Name "prefix1"
```

### Remove a Peering Service Prefix

To remove a Peering Services Prefix, execute the following command:

```
Remove-AzPeeringServicePrefix -ResourceGroupName  "Building40" -Name "prefix1" -PeeringServiceName "myPeeringService"
```

## Next steps

Learn about [Peering Service connection](peering-service-faq.md).

To learn more about Peering Service concepts see [Peering Service Connection](peering-service-connection.md).

To learn more about Peering Service telemetry concepts see [Peering Service Connection Telemetry](peering-service-connection-telemetry.md).
