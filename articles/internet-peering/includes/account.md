---
title: include file
description: include file
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki
---

* Before beginning configuration, install and import the required modules. You will need Administrator privileges to install modules in PowerShell.

#### Install and import Az module
```powershell
Install-Module Az -AllowClobber
Import-Module Az
```

#### Install and import Az.Peering module
```powershell
Install-Module -Name Az.Peering -AllowClobber
Import-Module Az.Peering
```

Verify the modules are imported fine using command below.
```powershell
Get-Module
```

* Sign in to your Azure account using the following command.

```powershell
Connect-AzAccount
```

* Check the subscriptions for the account and select the subscription in which you want to create a peering.

```powershell
Get-AzSubscription
Select-AzSubscription -SubscriptionId "subscription-id"
```

> [!IMPORTANT]
> If you haven't already associated your ASN and subscription, then follow steps for [Associate Peer ASN](../subscription-registration.md). This is required to request a Peering.

* If you don't already have a resource group, you must create one before you create a Peering. You can do so by running the following command:

```powershell
New-AzResourceGroup -Name "PeeringResourceGroup" -Location "Central US"
```

> [!NOTE]
> The location of resource group is independent of the location where you choose to setup a peering.
&nbsp;
