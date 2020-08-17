---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki
---

Before you begin configuration, install and import the required modules. You need Administrator privileges to install modules in PowerShell.

1. Install and import the Az module.
    ```powershell
    Install-Module Az -AllowClobber
    Import-Module Az
    ```
1. Install and import the Az.Peering module.
    ```powershell
    Install-Module -Name Az.Peering -AllowClobber
    Import-Module Az.Peering
    ```
1. Verify that the modules imported properly by using this command:
    ```powershell
    Get-Module
    ```
1. Sign in to your Azure account by using this command:
    ```powershell
    Connect-AzAccount
    ```
1. Check the subscriptions for the account, and select the subscription in which you want to create a peering.
    ```powershell
    Get-AzSubscription
    Select-AzSubscription -SubscriptionId "subscription-id"
    ```
1. If you don't already have a resource group, you must create one before you create a peering. You can do so by running the following command:

    ```powershell
    New-AzResourceGroup -Name "PeeringResourceGroup" -Location "Central US"
    ```
> [!IMPORTANT]
> If you haven't already associated your ASN and subscription, follow the steps in [Associate Peer ASN](../howto-subscription-association-powershell.md). This action is required to request a peering.

> [!NOTE]
> The location of a resource group is independent of the location where you choose to set up a peering.
&nbsp;
