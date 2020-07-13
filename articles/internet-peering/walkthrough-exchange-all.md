---
title: Exchange peering walkthrough
titleSuffix: Azure
description: Exchange peering walkthrough
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: how-to
ms.date: 11/27/2019
ms.author: prmitiki
---


# Exchange peering walkthrough

This section explains the steps you need to follow to set up and manage an Exchange peering.

## Create an Exchange peering
> [!div class="mx-imgBorder"]
> ![Exchange peering workflow and connection states](./media/exchange-peering.png)

The following steps must be followed in order to provision an Exchange peering:
1. Review Microsoft [peering policy](https://peering.azurewebsites.net/peering) to understand requirements for Exchange peering.
1. Find Microsoft peering location and peering facility id in [PeeringDB](https://www.peeringdb.com/net/694)
1. Request Exchange peering for a peering location using the instructions in [Create and modify an Exchange peering using PowerShell](howto-exchange-powershell.md) article for more details.
1. After you submit a peering request, Microsoft will review the request and contact you if required.
1. Once approved, connection state changes to Approved
1. Configure BGP session at your end and notify Microsoft
1. We will provision BGP session with DENY ALL policy and validate end-to-end.
1. If successful, you will receive a notification that peering connection state is Active.
1. Traffic will then be allowed through the new peering.

Note that connection states are not to be confused with standard [BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol) session states.

## Convert a legacy Exchange peering to Azure resource
The following steps must be followed in order to convert a legacy Exchange peering to Azure resource:
1. Follow the instructions in [Convert a legacy Exchange peering to Azure resource](howto-legacy-exchange-powershell.md)
1. After you submit the conversion request, Microsoft will review the request and contact you if required.
1. Once approved, you will see your Exchange peering with connection state as Active.

## Deprovision Exchange peering
Contact [Microsoft peering](mailto:peering@microsoft.com) to deprovision Exchange peering.

When an Exchange peering is set for deprovision, you will see the connection state as **PendingRemove**

> [!NOTE]
> If you run PowerShell cmdlet to delete the Exchange peering when the connection state is ProvisioningStarted or ProvisioningCompleted the operation will fail.

## Next steps

* Learn about [Prerequisites to set up peering with Microsoft](prerequisites.md).
