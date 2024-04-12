---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

## Resource types

Azure uses the concept of resource types and IDs to identify everything in a subscription. Azure Monitor similarly organizes core monitoring data into metrics and logs based on resource types, also called *namespaces*. Different metrics and logs are available for different resource types. Your service might be associated with more than one resource type.

Resource types are also part of the resource IDs for every resource running in Azure. For example, one resource type for a virtual machine is `Microsoft.Compute/virtualMachines`. For a list of services and their associated resource types, see [Resource providers](/azure/azure-resource-manager/management/resource-providers-and-types).
