---
title: Tutorial to create an order using Azure Edge Hardware Center
description: The tutorial about creating an Azure Edge Hardware Center via the Azure portal.
services: Azure Edge Hardware Center
author: alkohli
ms.service: azure-edge-hardware-center
ms.topic: tutorial
ms.date: 05/04/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to create an order via the Azure Edge Hardware Center.
---
# Tutorial: Create an Azure Edge Hardware Center 

Azure Edge Hardware Center service lets you explore and order a variety of hardware from the Azure hybrid portfolio including Azure Stack Edge devices. This tutorial describes how to create an order using the Azure Edge Hardware Center via the Azure portal.


In this tutorial, you'll:

> [!div class="checklist"]
> * Review prerequisites
> * Create an order


## Prerequisites

Before you begin: 

- Make sure that the `Microsoft.EdgeOrder` provider is registered. To create an order in the Azure Edge Hardware Center, the `Microsoft.EdgeOrder` provider should be registered against your subscription. 

    For information on how to register, go to [Register resource provider](../databox-online/azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#register-resource-providers).

- Make sure that all the other prerequisites related to the product that you're ordering are met. For example, if ordering Azure Stack Edge device, ensure that all the [Azure Stack Edge prerequisites](../databox-online/azure-stack-edge-gpu-deploy-prep.md#prerequisites) are completed.


## Create an order

When you place an order through the Azure Edge Hardware Center, you can order multiple devices, to be shipped to more than one address, and you can reuse ship to addresses from other orders.

Ordering through Azure Edge Hardware Center will create an Azure resource that will contain all your order-related information. One resource each will be created for each of the units ordered. After you have placed an order for the device, you may need to create a management resource for the device.


[!INCLUDE [Create order in Azure Edge Hardware Center](../../includes/azure-edge-hardware-center-new-order.md)]


## Next steps

In this tutorial, you learned about topics such as:

> [!div class="checklist"]
> * Review prerequisites
> * Create an order

Learn more on how to [Manage Azure Edge Hardware Center orders](azure-edge-hardware-center-manage-order.md)
