---
title: Azure Compute Fleet overview
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rrajeesh
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/10/2024
ms.reviewer: jushiman
---

# What is Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Azure Compute Fleet is a building block that gives you accelerated access to Azure's capacity in a given region. Compute Fleet launches a combination of virtual machines (VMs) at the lowest price and highest capacity. You can use this product in many ways, whether by running a stateless web service, a big data cluster, or a Continuous Integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of concurrent core instances.

## Capabilities 

Using Azure Compute Fleet, you can:

- Deploy up to 10,000 VMs with a single API, using [Spot VM](../virtual-machines/spot-vms.md) and [Standard VM](../virtual-machines/overview.md) types together.
- Get superior price-performance ratios by utilizing a blend of diverse pricing models, like Reserved Instances, Savings Plans, Spot instances, and pay-as-you-go (PYG) options.
- Expedite access to Azure capacity by rapidly provisioning instances from a customized SKU list tailored to your preferences.
- Implement personalized Compute Fleet allocation strategies, catering to both Standard and Spot VMs, optimizing for cost, capacity, or a combination of both.
- Embrace the "Fire & Forget-it" model, automating the deployment, management, and monitoring of instances without requiring intricate code frameworks.
    - Streamline the initial setup process, saving valuable time and resources.
    - Alleviate concerns about scripting complexity associated with determining optimal virtual machine (VM) pricing, available capacity, managing Spot evictions, and SKU availability.
- Attempt to maintain your Spot target capacity if your Spot VMs are evicted for price or capacity.

## Features and benefits

- **Multiple VM series:** Compute Fleet launches multiple VM series within a given fleet. Overall availablity in the fleet is enhanced by ensuring it isn't reliant on any single VM type.
- **Distributing VMs across Availability Zones:** Compute Fleet automatically distributes VMs across multiple Availability Zones to ensure high availability and resilience against potential zone failures.
- **Diverse pricing models:** Compute Fleet leverages various purchasing options, including Spot VMs for cost savings and standard pay-as-you-go VMs. You can also integrate Azure Reserved Instances and Savings Plans to optimize costs while ensuring consistent capacity. There's no extra charge for using Azure Compute Fleet. You're only charged for the VMs your Compute Fleet launches per hour. For more information, see [states and billing status of Azure VMs](../virtual-machines/states-billing.md).
- **Automated Replacement of Spot VMs:** When using Spot VMs, Compute Fleet can automatically replace Spot VMs when evicted due to price fluctuations or capacity constraints.
- **Multi-Region deployment:** Compute Fleet allows you to dynamically distribute workloads across multiple regions. For more information, see [Multi-Region Compute Fleet (Preview)](multi-region-compute-fleet.md).
- **Attribute based VM selection:** Compute Fleet supports deploying VM types based on user specified attributes, such as memory, vCPU, and storage. For more information, see [Attribute based VM selection for Azure Compute Fleet (Preview)](attribute-based-vm-selection.md).
 
## Considerations 

- Compute Fleet launches a combination of VM types that have their own considerations. For more information, see [Spot VMs](../virtual-machines/spot-vms.md) and [Virtual Machines](../virtual-machines/overview.md) for details. 
- Compute Fleet is currently available through [ARM template](quickstart-create-rest-api.md) and in [Azure portal](quickstart-create-portal.md).
- Compute Fleet is available in all Azure public regions, expect those located in the China.
- Compute Fleet can span across multiple-regions.

## SDK - Compute Fleet

| SDK | Documentation |
|-----|---------------|
| [Java](https://github.com/Azure/azure-sdk-for-java/tree/azure-resourcemanager-computefleet_1.0.0/sdk/computefleet/azure-resourcemanager-computefleet/) | [Java SDK documentation](https://docs.microsoft.com/javascript/api/overview/azure/arm-computefleet-readme) |
| [[Java-Script](https://github.com/Azure/azure-sdk-for-js/tree/@azure/arm-computefleet_1.0.0/sdk/computefleet/arm-computefleet/) | [Java-Script SDK documentation](https://docs.microsoft.com/javascript/api/overview/azure/arm-computefleet-readme) |
| [Python](https://github.com/Azure/azure-sdk-for-python/tree/azure-mgmt-computefleet_1.0.0/sdk/computefleet/azure-mgmt-computefleet/) | [Python SDK documentation](https://docs.microsoft.com/javascript/api/overview/azure/arm-computefleet-readme) |
| [Java](https://github.com/Azure/azure-sdk-for-java/tree/azure-resourcemanager-computefleet_1.0.0/sdk/computefleet/azure-resourcemanager-computefleet/) | [Java SDK documentation](https://docs.microsoft.com/javascript/api/overview/azure/arm-computefleet-readme) |

## Next steps

> [!div class="nextstepaction"]
> [Create a Compute Fleet with Azure portal](quickstart-create-portal.md)
