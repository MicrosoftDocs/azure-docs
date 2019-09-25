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

# Create a Peering Service Connection: Azure Power Shell

Use the **Azure PowerShell** module to create and manage Peering Service. Creating or managing Peering Service can be done from the PowerShell command line or in scripts.

## Prerequisites
To access **Peering Service**, you'll need an Azure subscription. If you don't have a subscription, then create a free account before you begin.

### Sign in

Make sure you install the latest version of the **Resource Manager PowerShell cmdlets. For more information about installing PowerShell cmdlets, see How to install and configure Azure PowerShell. This is important because earlier versions of the cmdlets do not contain the current values that you need for this exercise.

1. Open your PowerShell console with elevated privileges, and sign into your Azure account. This cmdlet prompts you for the sign-in credentials. After signing in, it downloads your account settings so that they are available to Azure PowerShell.

```Powershell
Connect-AzAccount
```

2. Get a list of your Azure subscriptions.

```PowerShellCopy
Get-AzSubscription
```

3. Specify the subscription that you want to use.

```PowerShellCopy
Select-AzSubscription -SubscriptionName "Name of subscription"
```

4. Create resources / Resource Group


```PowerShellCopy
New-AzResourceGroup -Location "West US" -Name "testRG"
```

## Creating a Peering Service

Before creating a Peering Service, execute the following commands in the Azure Power Shell to acquire the location and the Service Provider to which the Peering Service should be enabled.

**Get Peering Service locations**

```
Get-AzPeeringServiceLocation -Country "United States"
```

**Get Peering Service Providers**
              
```
Get-AzPeeringServiceProvider
```

**Create a Peering Service**

To create the Peering Service, execute the below listed commands:

```loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "Building40"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider 
```

**Create a Peering Service Prefix**

To specify the Prefixes through which the networking traffic is originated execute the below set of commands:

```$loc = "Washington"
$provider = "TestPeer1"
$resourceGroup = "Building40"
$name = “myPeeringService”
$peeringService = New-AzPeeringService -ResourceGroupName $resourceGroup -Name $name -PeeringLocation $loc -PeeringServiceProvider $provider
$prefixName = "prefix1"
$prefix = “192.168.1.0/24”
$prefixService = $peeringService | New-AzPeeringServicePrefix -Name $prefixName -Prefix $prefix
```

**List all Peering Services**
To view the Peering Services, execute the following command:

```
$peeringService = Get-AzPeeringService
```

**List all Peering Service Prefixes**
To view the Peering Services Prefixes, execute the following command:
```
 $prefixName = "prefix1"
```

```
$prefix = Get-AzPeeringServicePrefix -PeeringServiceName "myPeeringService" -ResourceGroupName "Building40" -Name "prefix1"
```

**Remove Peering Service Prefix**

To remove a Peering Services Prefix, execute the following command:

```
Remove-AzPeeringServicePrefix -ResourceGroupName  "Building40" -Name "prefix1" -PeeringServiceName "myPeeringService"
```