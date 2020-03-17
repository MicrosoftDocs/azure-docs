---
title: Considerations for Naming Azure Resources | Microsoft Docs
description: This article contains guidance on how customers should consider naming their Azure resources to prevent attribution to business/mission sensitive workloads.
services: Azure-government
cloud: gov
author: bernie-msft
manager: zakramer

ms.assetid: 9790239d-b18b-468d-b539-fb868a85a868
ms.service: Azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Azure-government
ms.date: 3/17/2020
ms.author: beellis

---
# Considerations for Naming Azure Resources
Customers should not include sensitive or restricted information in Azure Resource Names because they may be stored or accessed outside the compliance boundary to facilitate support and troubleshooting.
Azure Resource Names are a subset of Object Metadata that includes information provided by you, or on your behalf, that is used to identify or configure Online Service resources, such as software, systems, or containers, but does **not** include customer-created content or object metadata inside the resource (for example, database column/table names).  Azure Resource Names include the names a customer assigns to ARM-level objects and resources deployed in Azure.  Examples include the names of resources such as:
*    vNETs (Virtual Networks)
*    Virtual Hard Disks (VHDs)
*    Database Servers & Databases
*    Virtual Network Interface
*    Network Security Groups

>[!NOTE]
>The above examples are but a subset of the types of resources customers can name. This list is not meant to be fully exhaustive and the types of resources could change in the future as new cloud services are added.
>

## Azure Resource Naming Convention
The names of Azure resources are part of a larger resource ID as follows:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/<ResourceProvider>/<ResourceType>/<ResourceName>`

An example of a virtual machine resource ID is:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<virtualMachineName>`


## Naming Considerations
For all names that meet the criteria above, from the name of the larger resource group to the name of the end resources within it, customers should avoid names that are sensitive to business/mission functions.  Customers should also avoid names that indicate customer regulatory requirements (e.g., [ITAR](https://docs.microsoft.com/en-us/microsoft-365/compliance/offering-itar?view=o365-worldwide), [CJIS](https://docs.microsoft.com/en-us/microsoft-365/compliance/offering-cjis?view=o365-worldwide), etc.), as applicable.

Customers should understand and take into account the resource naming convention to help ensure  operational security, as Microsoft personnel could use the full resource ID in the following example scenarios:

*    Microsoft support personnel may use the full resource ID of resources during support events to ensure we're identifying the right resource within a customer's subscription to provide support for.
*    Microsoft product engineering personnel could use full resource IDs during routine monitoring of telemetry data to identify deviance from baseline/average system performance.
*    Proactive communication to customers about impacted resources during internally discovered incidents.
