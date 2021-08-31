---
title: Availability Zone support for public multi-tenant App Service
description: Learn how to deploy your App Service so that your apps are zone redundant.
author: seligj95
ms.topic: article
ms.date: 08/31/2021
ms.author: jordanselig
---
# Availability Zone support for public multi-tenant App Service

App Services can be deployed into [Availability Zones (AZ)](../availability-zones/az-overview.md) which enables [high availability](https://en.wikipedia.org/wiki/High_availability) for your apps. This architecture is also known as zone redundancy.

An app lives in an App Service plan (ASP). The ASP exists in a single scale unit. When an App Service is configured to be zone redundant, the platform automatically spreads the VM instances in the ASP across all three zones in the selected region. If a capacity larger than three is specified and the number of instances is divisible by three, the instances will be spread evenly. Otherwise, instance counts beyond 3*N will get spread across the remaining one or two zones. For traffic distribution to your zone redundant app, this is all managed by Azure behind the scenes. For more information about highly available architectures and delivering reliability in Azure topic, see the [doc](https://docs.microsoft.com/azure/architecture/high-availability/building-solutions-for-high-availability).

## Requirements

Zone redundancy, is a property of the ASP. The following are the current requirements/limitations for enabling zone redundancy:

- Both Windows and Linux are supported
- Requires either **Premium v2** or **Premium v3** App Service plans
- Minimum instance count of three
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three
- Can be enabled in any of the following regions:
  - West US 2
  - West US 3
  - Central US
  - East US
  - East US 2
  - Canada Central
  - Brazil South
  - North Europe
  - West Europe
  - Germany West Central
  - France Central
  - UK South
  - Japan East
  - Southeast Asia
  - Australia East
- Zone redundancy can only be specified when creating a **new** ASP
  - Currently you can't convert a pre-existing ASP. See next bullet for details on how to create a new ASP that supports zone redundancy.
- AZ is only supported in the newer portion of the App Service footprint
  - Currently if you're running on Pv3, then you're already on the footprint that supports AZ. All you need to do is create a new ASP.
  - If you aren't using Pv3 or a scale unit that supports AZ, are in an unsupported region, or are unsure, follow the steps below:
    - Create a new resource group in a region that is supported
        - This ensures the App Service control plane can find a scale unit in the selected region that supports zone redundancy
    - Create a new ASP (and app) in a region of your choice using the **new** resource group
- Must be created using [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md)

## How to Deploy a Zone Redundant App Service

Currently, you need to use an ARM template to create a zone redundant App Service. Once created via an ARM template, the ASP can be viewed and interacted with via the Azure portal and CLI tooling. An ARM template is only needed for the initial creation of the ASP.

The only changes needed in an ARM template to specify a zone redundant App Service are the new ***zoneRedundant*** property (required) and optionally the ASP instance count (***capacity***) on the [Microsoft.Web/serverfarms](https://docs.microsoft.com/azure/templates/microsoft.web/serverfarms?tabs=json) resource. If you don't specify a capacity, the platform defaults to 3. The ***zoneRedundant*** property should be set to ***true*** and ***capacity*** should be set based on the workload requirement, but no less than three. A good rule of thumb to choose capacity is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!TIP]
> To decide instance capacity, you can use the following calculation:
>
> Since the platform spreads VMs across 3 zones and you need to account for at least the failure of 1 zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires 4 instances, you should provision 6 instances: (2/3 * 6 instances) = 4 instances.
> 

In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances. If you also have autoscale configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances (autoscale behavior is independent of App Service platform behavior). It's important to note there's no guarantee that requests for additional instances in a zone-down scenario will succeed since back filling lost instances occurs on a best-effort basis. The recommended solution is to provision your App Service plans to account for losing a zone as described previously in this article.

The ARM template snippet below shows the new ***zoneRedundant*** property and ***capacity*** specification.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2018-02-01",
    "name": "your-appserviceplan-name-here",
    "location": "West US 3",
    "sku": {
        "name": "P1v3",
        "tier": "PremiumV3",
        "size": "P1v3",
        "family": "Pv3",
        "capacity": 3
    },
    "kind": "app",
    "properties": {
        "zoneRedundant": true
    }
  }
]
```

For details on how to deploy ARM templates, see [this doc](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md). For App Service ARM quickstarts, visit [this](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web) GitHub repo.