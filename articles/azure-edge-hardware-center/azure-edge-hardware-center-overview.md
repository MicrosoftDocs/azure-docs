---
title: Azure Edge Hardware Center overview
description: Describes Azure Edge Hardware Center - an Azure service that lets you order all Azure hardware and manage and track those orders
services: Azure Edge Hardware Center
author: alkohli
ms.service: azure-edge-hardware-center
ms.topic: overview
ms.date: 01/03/2022
ms.author: alkohli
ms.custom: references_regions
# Customer intent: As an IT admin, I need to understand how I can discover and order all first party Azure hardware and manage and track those orders.
---

# What is Azure Edge Hardware Center?

Azure Edge Hardware Center is a new Azure service that lets you order a variety of hardware or devices from the Azure hybrid portfolio. You can also use this service to see and track all your order related information at one place. The first party hardware that you order can then be used to build and run hybrid apps across datacenters, edge locations, remote offices, and the cloud.

## Benefits

Edge Hardware Center offers the following benefits:

- **Place bulk orders of hardware** - You can order multiple units of a particular type of device or hardware at once by putting a quantity while placing your order.
- **Ship multiple devices or hardware to different locations at the same time** - You can now ship hardware to multiple locations (within one country/region) through just one order. Add multiple addresses in the "Shipping + Quantity" tab to achieve this.
- **Save addresses for future orders** - You can save your frequently used addresses while placing an order. For subsequent orders, you can then select a shipping address from your address book.
- **Stay updated with your order status** - You can view the order status updates for each of the order items. You can also choose to get notified through email when your order moves to next stage. You can add one or more people in the notification list.

<!--## Available hardware

Use the Edge Hardware Center to browse through and order SKUs from the following product families:  

|Hardware  |Configuration  |
|---------|---------|
| Azure Stack Edge Pro - GPU |Azure Stack Edge Pro - 1 GPU <br> Azure Stack Edge Pro - 2 GPU    |  
| Azure Stack Edge Pro R<sup>1</sup>  |Azure Stack Edge Pro R - single node <br> Azure Stack Edge Pro R - single node with UPS   | 
| Azure Stack Edge Mini R<sup>2</sup>  |One configuration, selected automatically.    |      

<sup>1,2</sup> R denotes rugged SKUs targeted for defense applications.-->

## Resource provider

Edge Hardware Center has its own independent resource provider (RP). This RP creates the following resource type when you place an order: **Microsoft.EdgeOrder**.  

Before you use this RP to create orders, your Azure subscription must be registered for this RP. Registration configures your subscription to work with the Edge Hardware Center RP. To register with this RP, you must have an *owner* or *contributor* access to the subscription.

For more information, see [Register with an Azure Resource Provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

### Create orders

You can create an Edge Hardware Center order via the Azure portal or via the SDK. To create an order via Azure portal, see [Create an Edge Hardware Center order in the Azure portal](azure-edge-hardware-center-create-order.md).  

The independent Edge Hardware Center RP decouples the ordering process from that of the resource creation for the service that manages the device or the hardware. For example, you'll create an order for Azure Stack Edge using the Edge Hardware Center service. You'll then create a separate resource for Azure Stack Edge using the Azure Stack Edge service to manage and activate the device.

For more information, see [Create an Azure Stack Edge resource after you place the order via the Edge Hardware Center](../databox-online/azure-stack-edge-gpu-deploy-prep.md?tabs=azure-edge-hardware-center#create-a-management-resource-for-each-device).

### Track orders

You can track the status of your order by going to the order item resource within Edge Hardware Center. For more information, see [Track the Edge Hardware Center order](azure-edge-hardware-center-manage-order.md#track-order). 

You can also [Cancel the order](azure-edge-hardware-center-manage-order.md#cancel-order) or [Return hardware](azure-edge-hardware-center-manage-order.md#return-hardware) once you are done.

You can also enable alerts to receive email notifications if the order status changes. The email notifications are enabled when the order is placed.


<!--## Region availability

The Edge Hardware Center service is available in East US, West Europe, and South East Asia for Azure public cloud. The orders created by Edge Hardware Center can also be used to deploy devices in Azure Government, Azure Government Secret, and Azure Government Top Secret.-->

## Data residency

Data residency norms apply for the orders created using the Edge Hardware Center service. When placing an order in Southeast Asia region, data related to your order resides only within Southeast Asia (Singapore) and is not replicated outside this region. Orders created in Southeast Asia region will not be resilient to region wide outages.

For more information, see [Data residency for Azure Stack Edge](../databox-online/azure-stack-edge-gpu-data-residency.md#azure-edge-hardware-center-ordering-and-management-resource).


## Billing and pricing

You will be billed against the resource from where you have placed the order. If you place the order through the Edge Hardware Center, your bill is reflected against the resource created in the process. For each order item resource that you create, you are billed for the respective hardware unit.

For specific information on pricing for the orders you created, go to the pricing page for the corresponding product. For Azure Stack Edge, see [Azure Stack Edge Pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/).


## Next steps

Learn how to:

- [Create an Azure Edge Hardware Center order](azure-edge-hardware-center-create-order.md).
- [Manage Azure Edge Hardware Center orders](azure-edge-hardware-center-manage-order.md).
- [Troubleshoot ordering issues with Azure Edge Hardware Center](azure-edge-hardware-center-troubleshoot-order.md).
