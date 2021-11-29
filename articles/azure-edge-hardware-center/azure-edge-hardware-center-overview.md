---
title: Azure Edge Hardware Center overview  
description: Describes Azure Edge Hardware Center - an Azure service that lets you order all Azure hardware and manage and track those orders
services: Azure Edge Hardware Center
author: alkohli

ms.service: aehc
ms.topic: overview
ms.date: 11/29/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how I can discover and order all first party Azure hardware and manage and track those orders.
---

# What is Azure Edge Hardware Center?

Azure Edge Hardware Center is a new Azure service that lets you order a variety of hardware or devices from the Azure hybrid portfolio. You can also use this service to see and track all your order related information at one place. The first party hardware that you order can then be used to build and run hybrid apps across datacenters, edge locations, remote offices, and the cloud.

## Available hardware

Use the Azure Edge Hardware Center to browse through and order SKUs from the following product families:  

|Hardware  |Configuration  |
|---------|---------|
| Azure Stack Edge Pro GPU |1 - GPU <br> 2 - GPU    |  
| Azure Stack Edge Pro R<sup>1</sup>  |  | 
| Azure Stack Edge Mini R<sup>2</sup>  |    |      


<sup>1,2</sup> R or ruggedized denotes rugged SKUs targeted for defense applications.

## Benefits

Azure Edge Hardware Center offers the following benefits:

- **Place bulk orders of devices** - You can order multiple units of a particular type of device at once by putting a quantity while placing your order.
- **Ship multiple devices to different locations at the same time** - You can now ship devices to multiple locations (within one country/region) through just one order. Add multiple addresses in the “Shipping + Quantity” tab to achieve this.
- **Save addresses for future orders** - You can save your frequently used addresses while placing an order. For subsequent orders, you can then select a shipping address from your address book.
- **Stay updated with your order status** - You can view the order status updates for each of the order items. You can also choose to get notified through email when your order moves to next stage. You can add one or more people in the notification list.

## Azure Edge Hardware Center 

### Resource provider

Azure Edge Hardware Center has its own independent resource provider (RP). This RP creates the following resource type when you place an order: **Microsoft.EdgeOrder**.  

Before you use this RP to create orders, your Azure subscription must be registered for this RP. Registration configures your subscription to work with the Azure Edge Hardware Center RP. To register with this RP, you must have an *owner* or *contributor* access to the subscription.

### Create orders

You can create an Azure Edge Hardware Center order via the Azure portal or via the Azure PowerShell, Azure CLI, or SDK. 

- To create an order via Azure portal, see [Create an Azure Edge Hardware Center order in the Azure portal]().  
- To create an order via Azure PowerShell, see [Create an Azure Edge Hardware Center order using Azure PowerShell]().
- To create an order via Azure CLI, see [Create an Azure Edge Hardware Center order using Azure CLI](). 

This independent RP decouples the ordering process from that of the resource creation for the service which is managed by the device management RP. For example, you'll create an order for Azure Stack Edge order using the Azure Edge Hardware Center RP. You'll then create a separate resource for Azure Stack Edge using the Azure Stack Edge device management RP. The service resource is used to activate the Azure Stack Edge device.

- See [Create an Azure Stack Edge resource after you place the order via the Azure Edge Hardware Center]().
- See [Create an Azure Stack Hub resource after you place the order via the Azure Edge Hardware Center]().

### Track orders

The Azure Edge Hardware Center RP also integrates with the third-party shipment APIs for the following providers:
- UPS
- DHL
- TMC

You can track the status of the order that you created through its lifecycle.
For more information, see [Track the Azure Edge Hardware Center order](). You can also enable alerts to receive email notifications if the order status changes.


## Region availability

The Azure Edge Hardware Center service is available in East US, West Europe and South East Asia for Azure public cloud. The orders created by Azure Edge Hardware Center can be used to deploy devices in Azure Government, Azure Government Secret, and Azure Government Top Secret as well.

<!--For more information on region availability, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all).--> 

## Data residency

Data residency norms apply for the orders created using the Azure Edge Hardware Center service. When placing an order in Southeast Asia region for an Azure Stack Edge device, you can select the option to have your data reside only within Singapore and not be replicated.

If you have chosen single region data residency, you will not be resilient to region-wide outages. For more information, see [Data residency for Azure Stack Edge](../databox-online/azure-stack-edge-gpu-data-residency.md#azure-edge-hardware-center-ordering-and-management-resource).


## Billing and pricing

The Azure Billing service is integrated with the Azure Edge Hardware Center ordering RP. This integration lets you view your one-time billing charges for the Hardware-as-a-service and recurring billing charges for the data transfer to Azure and Azure Storage usage. 

You will be billed against the resource from where you have placed the order. If you place the order through the Edge Hardware Center, your bill is reflected against the resource created in the process. For each order item resource that you create, you are billed for the respective hardware unit.

For specific information on pricing for the orders you created, go to the pricing page for the corresponding product.

- See [Azure Stack Edge Pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/).
- See [Azure Stack Hub Pricing](https://azure.microsoft.com/pricing/details/azure-stack/hub/).


## Next steps

- [Create an Azure Edge Hardware Center order]().
- [Cancel the Azure Edge Hardware Center order]().
- [Troubleshoot ordering issues with Azure Edge Hardware Center]().