---
title: Azure Compute Fleet overview
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - build-2024
ms.date: 06/19/2024
ms.reviewer: jushiman
---

# What is Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Azure Compute Fleet is a building block that gives you accelerated access to Azure's capacity in a given region. Compute Fleet launches a combination of virtual machines (VMs) at the lowest price and highest capacity. There are many ways you can use this product, whether by running a stateless web service, a big data cluster, or a Continuous Integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of concurrent core instances.

## Using Compute Fleet, you can:
- Deploy up to 10,000 VMs with a single API, using [Spot VM](../virtual-machines/spot-vms.md) and [Standard VM](../virtual-machines/overview.md) types together.
- Get superior price-performance ratios by utilizing a blend of diverse pricing models, like Reserved Instances, Savings Plan, Spot instances, and pay-as-you-go (PYG) options.
- Expedite access to Azure capacity by rapidly provisioning instances from a customized SKU list tailored to your preferences.
- Implement personalized Compute Fleet allocation strategies, catering to both Standard and Spot VMs, optimizing for cost, capacity, or a combination of both.
- Embrace the "Fire & Forget-it" model, automating the deployment, management, and monitoring of instances without requiring intricate code frameworks.
    - Streamline the initial setup process, saving valuable time and resources.
    - Alleviate concerns about scripting complexity associated with determining optimal virtual machine (VM) pricing, available capacity, managing Spot evictions, and SKU availability.
- Attempt to maintain your Spot target capacity if your Spot VMs are evicted for price or capacity.

There's no extra charge for using Compute Fleet. You're only charged for the VMs your Compute Fleet launches per hour. For more information on virtual machine billing, see [states and billing status of Azure Virtual Machines](../virtual-machines/states-billing.md).

## Features and benefits
### Multiple VM Series: 
Compute Fleet can launch multiple VM series (such as Dv5, Ev5, and N-series), ensuring it isn't reliant on the availability of any single type. This enhances overall availability within the fleet.
### Distributing VMs Across Availability Zones: 
Compute Fleet can automatically distribute VMs across multiple Availability Zones to ensure high availability and resilience against potential zone failures.
### Diverse Pricing Models: 
Compute Fleets can leverage various purchasing options, including Spot VMs for cost savings and standard Pay-As-You-Go VMs. You can also integrate Azure Reserved Instances and Savings Plans to optimize costs while ensuring consistent capacity.
### Automated Replacement of Spot VMs: 
When using Spot VMs, Compute fleet can automatically replace Spot VMs when evicted due to price fluctuations or capacity constraints.
### Multi-region Deployment: 
Compute Fleet allows you to dynamically distribute workloads across multiple regions.
### Attribute based Vm selection: 
Compute Fleet supports deploying VM types based on user specified attributes (e.g., memory, vCPU, storage) 
 
## Compute Fleet considerations 

- Compute Fleet launches a combination of VM types that have their own considerations. For more information, see [Spot VMs](../virtual-machines/spot-vms.md) and [Virtual Machines](../virtual-machines/overview.md) for details. 
- Compute Fleet is only available through [ARM template](quickstart-create-rest-api.md) and in [Azure portal](quickstart-create-portal.md).
- Compute Fleet can't span across Azure regions. You have to create a separate Compute Fleet for each region.
- Compute Fleet is available in all Azure Public regions.
- Compute Fleet can span across multiple-regions.

## New on Compute Fleet

We invite you to test out 2 new additinal capacibilities on Compute Fleet...

### Multi-Region Compute Fleet
  A new deployment capability that allows users to dynamically distribute workloads across several regions.

### Attribute based VM selection
  A new feature that Enables users to scale fleets based on VM attributes instead of explicitly chosen VM sizes.

## Next steps
> [Create an Azure Compute Fleet with Azure portal.](quickstart-create-portal.md)
