---
title: Azure Compute Fleet overview
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rrajeesh
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# What is Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Azure Compute Fleet is a building block that gives you accelerated access to Azure's capacity in a given region. Compute Fleet launches a combination of virtual machines (VMs) at the lowest price and highest capacity. You can use this product in many ways, whether by running a stateless web service, a big data cluster, or a Continuous Integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of concurrent core instances.

## Capabilities 

Using Azure Compute Fleet, you can:

- Deploy up to 10,000 VMs with a single API, using [Spot VM](/azure/virtual-machines/spot-vms) and [Standard VM](/azure/virtual-machines/overview) types together.
- Get superior price-performance ratios by utilizing a blend of diverse pricing models, like Reserved Instances, Savings Plans, Spot instances, and pay-as-you-go (PYG) options.
- Expedite access to Azure capacity by rapidly provisioning instances from a customized SKU list tailored to your preferences.
- Implement personalized Compute Fleet allocation strategies, catering to both Standard and Spot VMs, optimizing for cost, capacity, or a combination of both.
- Embrace the "Fire & Forget-it" model, automating the deployment, management, and monitoring of instances without requiring intricate code frameworks.
    - Streamline the initial setup process, saving valuable time and resources.
    - Alleviate concerns about scripting complexity associated with determining optimal virtual machine (VM) pricing, available capacity, managing Spot evictions, and SKU availability.
- Attempt to maintain your Spot target capacity if your Spot VMs are evicted for price or capacity.

## Features and benefits

- **Multiple VM series:** Compute Fleet launches multiple VM series within a given fleet. Overall availability in the fleet is enhanced by ensuring it isn't reliant on any single VM type.
- **Distributing VMs across Availability Zones:** Compute Fleet automatically distributes VMs across multiple Availability Zones to ensure high availability and resilience against potential zone failures.
- **Diverse pricing models:** Compute Fleet leverages various purchasing options, including Spot VMs for cost savings and standard pay-as-you-go VMs. You can also integrate Azure Reserved Instances and Savings Plans to optimize costs while ensuring consistent capacity. There's no extra charge for using Azure Compute Fleet. You're only charged for the VMs your Compute Fleet launches per hour. For more information, see [states and billing status of Azure VMs](/azure/virtual-machines/states-billing).
- **Automated Replacement of Spot VMs:** When using Spot VMs, Compute Fleet can automatically replace Spot VMs when evicted due to price fluctuations or capacity constraints.
- **Multi-Region deployment:** Compute Fleet allows you to dynamically distribute workloads across multiple regions. For more information, see [Multi-Region Compute Fleet (Preview)](multi-region-compute-fleet.md).
- **Attribute based VM selection:** Compute Fleet supports deploying VM types based on user specified attributes, such as memory, vCPU, and storage. For more information, see [Attribute based VM selection for Azure Compute Fleet (Preview)](attribute-based-vm-selection.md).
 
## Considerations 

- Compute Fleet launches a combination of VM types that have their own considerations. For more information, see [Spot VMs](/azure/virtual-machines/spot-vms) and [Virtual Machines](/azure/virtual-machines/overview) for details. 
- Compute Fleet is currently available through [ARM template](quickstart-create-rest-api.md) and in [Azure portal](quickstart-create-portal.md).
- Compute Fleet is available in all Azure public regions, expect those located in the China.
- Compute Fleet can span across multiple-regions.

## Configure your Compute Fleet 

We recommend you consider the following configuration options when creating your Compute Fleet.

| Configuration option | Description |
|----------------------|-------------|
| [Spot VM](spot-vm-configuration.md) | Compute Fleet will submit a one-time request for a desired capacity or a fleet that maintains target capacity over time. |
| [Compute Fleet allocation strategies](allocation-strategies.md) | Choose an allocation strategy for Spot and Standard VMs to optimize your Compute Fleet for the lowest price, capacity, or a combination of both. |
| [Attribute based VM selection](attribute-based-vm-selection.md) | Specify your VM sizes and types for your fleet or let Azure Compute Fleet decide based on your application requirements. |

## Compute Fleet quota 

Azure Compute Fleet has applicable Standard and Spot VM quotas. The following table outlines quota limits, depending on your scenario.

| Scenario | Quota |
| -------- | ----- |
| The number of **Compute Fleets** per Region in `active`, `deleted_running` | 500 fleets |
| The **target capacity** per Compute Fleet | 10,000 VMs |
| The **target capacity** across all Compute Fleets in a given Region | 100,000 VMs |
| A Compute Fleet can span across multiple **Regions** | 3 regions |

## Target capacity 

Set individual target capacity for Spot and pay-as-you-go VM types with Compute Fleet. This capacity could be managed individually based on your workloads or application requirement. You specify target capacity using VM instances. 

Compute Fleet allows you to modify the target capacity for Spot and pay-as-you-go VMs based on your Compute Fleet configuration. For more information, see [Modify your Compute Fleet](modify-fleet.md). 

### Minimum starting capacity 

You can set your Compute Fleet to deploy Spot VMs, pay-as-you-go VMs, or a combination of both only if the Compute Fleet can deploy the minimum starting capacity requested against the actual target capacity. The deployment fails if capacity becomes unavailable to fulfill the minimum starting capacity. 

If your requested target capacity is 100 VM instances and minimum starting capacity is set to 20 VM instances, the deployment succeeds only if Compute Fleet can fulfill the starting capacity ask of 20 VM instances. Otherwise, the request fails. 

You are unable to set the minimum starting capacity if you choose to configure the Compute Fleet with **capacity preference** type as *Maintain capacity*. 

## Software Development Kits

Compute Fleet provides a powerful and flexible way to manage compute resources. It can be seamlessly integrated into your applications using Software Development Kits (SDKs) across multiple programming languages, such as Java, JavaScript, Go, or Python. Each SDK provides robust tools and APIs to interact with your fleet. Using multiple SDKs allows you to integrate Compute Fleet functionalities into a wide range of applications, from backend systems and web services, to data pipelines and real-time applications. Each SDK is designed to align with the conventions of its respective language, ensuring a consistent yet idiomatic development experience.

### Benefits of Compute Fleet SDKs

- **Language flexibility:** Different teams can use the SDK in their preferred programming language, enhancing collaboration across diverse development environments.
- **Seamless integration:** SDKs provide prebuilt functions to interact with Compute Fleet, reducing the need to write low-level API calls and speeding up development.
- **Cross-platform compatibility:** Whether building server-side applications, browser-based solutions, or embedded systems - Compute Fleet SDKs cater to a variety of platforms and use cases.
- **Scalability and automation:** SDKs support automated provisioning and scaling of compute resources, making it easy to manage workloads dynamically across various environments.

### Use Compute Fleet SDKs

To access documentation on how to use Compute Fleet SDKS, follow these steps:
1. Go to [Azure SDKs](https://azure.github.io/azure-sdk/releases/latest/index.html).
2. In the search bar located at the top center of the page, type *Compute Fleet*.
3. Available SDKs for Compute Fleet show up under the various programming languages, such as Java, JavaScript, Go, or Python.

## Next steps

> [!div class="nextstepaction"]
> [Create a Compute Fleet with Azure portal](quickstart-create-portal.md)
