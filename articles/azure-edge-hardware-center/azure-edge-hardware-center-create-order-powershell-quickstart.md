---
title: Quickstart to create an order via Azure PowerShell using Azure Edge Hardware Center
description: The quickstart contains steps to create an Azure Edge Hardware Center order via Azure PowerShell.
services: Azure Edge Hardware Center
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: quickstart
ms.date: 03/01/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to create an order via the Azure Edge Hardware Center using Azure PowerShell. 
---
# Quickstart: Create an Azure Edge Hardware Center order using Azure PowerShell

Azure Edge Hardware Center service lets you explore and order a variety of hardware from the Azure hybrid portfolio including Azure Stack Edge devices. This tutorial describes how to create an order using the Azure Edge Hardware Center via the Azure PowerShell. With Azure PowerShell, you can easily create multiple orders at the same time.


In this tutorial, you'll:

> [!div class="checklist"]
> * Review prerequisites
> * Create an order
> * Delete an order


## Prerequisites

Before you begin: 

- Make sure that the `Microsoft.EdgeOrder` provider is registered. To create an order in the Azure Edge Hardware Center, the `Microsoft.EdgeOrder` provider should be registered against your subscription. 

    For information on how to register, go to [Register resource provider](../databox-online/azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#register-resource-providers).

- Make sure that all the other prerequisites related to the product that you are ordering are met. For example, if ordering Azure Stack Edge device, ensure that all the [Azure Stack Edge prerequisites](../databox-online/azure-stack-edge-gpu-deploy-prep.md#prerequisites) are completed.


- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.


## Open Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create an order

When you place an order through the Azure Edge Hardware Center, you can order multiple devices, to be shipped to more than one address, and you can reuse ship to addresses from other orders.

Ordering through Azure Edge Hardware Center will create an Azure resource that will contain all your order-related information. One resource each will be created for each of the units ordered. After you have placed an order for the device, you may need to create a management resource for the device.


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 8. Next steps
Required: A single link in the blue box format. Point to the next logical quickstart 
or tutorial in a series, or, if there are no other quickstarts or tutorials, to some 
other cool thing the customer can do. 
-->

## Next steps

Advance to the next article to learn how to [Manage Azure Edge Hardware Center orders](azure-edge-hardware-center-manage-order.md).


