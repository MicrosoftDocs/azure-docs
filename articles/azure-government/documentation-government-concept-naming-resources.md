---
title: Considerations for naming Azure resources | Microsoft Docs
description: This article contains guidance on how customers should consider naming their Azure resources to prevent attribution to business/mission sensitive workloads.
services: azure-government
cloud: gov

ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.service: azure-government
ms.workload: Azure-government
ms.date: 4/6/2020

---
# Considerations for naming Azure resources
Customers should not include sensitive or restricted information in Azure Resource Names because they may be stored or accessed outside the compliance boundary to facilitate support and troubleshooting.
Azure Resource Names include information provided by you, or on your behalf, that is used to identify or configure Online Service resources, such as software, systems, or containers, but does **not** include customer-created content or metadata inside the resource (for example, database column/table names).  Azure Resource Names include the names a customer assigns to Azure Resource Manager level objects and resources deployed in Azure.  Examples include the names of resources such as:
*    VNets (Virtual Networks)
*    Virtual Hard Disks (VHDs)
*    Database Servers & Databases
*    Virtual Network Interface
*    Network Security Groups
*    Key Vaults

>[!NOTE]
>The above examples are but a subset of the types of resources customers can name. This list is not meant to be fully exhaustive and the types of resources could change in the future as new cloud services are added.
>

## Naming convention
The names of Azure resources are part of a larger resource ID as follows:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/<ResourceProvider>/<ResourceType>/<ResourceName>`

An example of a virtual machine resource ID is:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<virtualMachineName>`


## Naming considerations
For all names that meet the criteria above, from the name of the larger resource group to the name of the end resources within it, customers should avoid names that are sensitive to business/mission functions.  Customers should also avoid names that indicate customer regulatory requirements (e.g., [ITAR](https://docs.microsoft.com/microsoft-365/compliance/offering-itar?view=o365-worldwide), [CJIS](https://docs.microsoft.com/microsoft-365/compliance/offering-cjis?view=o365-worldwide), etc.), as applicable.

>[!NOTE]
>Also consider naming of resource tags when reviewing the [Resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/>azure-resource-manager/management/toc.json).
>

Customers should understand and take into account the resource naming convention to help ensure  operational security, as Microsoft personnel could use the full resource ID in the following example scenarios:

*    Microsoft support personnel may use the full resource ID of resources during support events to ensure we're identifying the right resource within a customer's subscription to provide support for.
*    Microsoft product engineering personnel could use full resource IDs during routine monitoring of telemetry data to identify deviance from baseline/average system performance.
*    Proactive communication to customers about impacted resources during internally discovered incidents.

