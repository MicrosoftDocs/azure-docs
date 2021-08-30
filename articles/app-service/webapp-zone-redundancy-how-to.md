---
title: Availability Zone support for public multi-tenant App Service
description: Learn how to deploy your App Service so that your apps are zone redundant.
author: seligj95
ms.topic: article
ms.date: 08/30/2021
ms.author: jordanselig
---
# Availability Zone support for public multi-tenant App Service

App Services can be deployed into Availability Zones (AZ). AZ support for App Service Environments (ASEs) is also available, see [Availability Zone support for App Service Environments](./environment/overview.md).    

## Availability Zone Overview

An [Availability Zone](../availability-zones/az-overview.md) is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. Build high-availability into your application architecture by colocating your compute, storage, networking, and data resources within a zone and replicating in other zones. To learn more about Availability Zones, continue reading [here](https://azure.microsoft.com/global-infrastructure/availability-zones/#overview).

## Requirements

AZ support, otherwise known as zone redundancy, is a property of the App Service Plan (ASP). The following are the current requirements/limitations for enabling zone redundancy:

- Both Windows and Linux are supported
- Requires either **Premium v2** or **Premium v3** App Service Plans
- Minimum instance count of three
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three. This enforcement is due to the platform automatically spreading these VMs across three zones when zone redundancy is enabled.
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
- Zone redundancy can only be specified when creating a **new** App Service Plan
  - Currently you can't convert a pre-existing App Service Plan. See next bullet for details on how to create a new App Service Plan that supports zone redundancy.
- AZ is only supported in the newer portion of the App Service footprint
  - Currently if you're running on Pv3, then you're already on the footprint that supports AZ. All you need to do is create a new App Service Plan.
  - If you aren't using Pv3 or a scale unit that supports AZ, are in an unsupported region, or are unsure, follow the steps below:
    - Create a new resource group in a region that is supported
    - Create a new App Service Plan (and app) in a region of your choice using the **new** resource group
- Must be created using [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md)

## How to Deploy a Zone Redundant App Service

Currently, you need to use an ARM template to create a zone redundant App Service. Once created via an ARM template, the App Service Plan can be viewed and interacted with via the Azure portal and CLI tooling. An ARM template is only needed for the initial creation of the App Service Plan.

The only changes needed in an ARM template to specify a zone redundant App Service are the new ***zoneRedundant*** property (required) and optionally the App Service Plan instance count (***capacity***) on the [Microsoft.Web/serverfarms](https://docs.microsoft.com/azure/templates/microsoft.web/serverfarms?tabs=json) resource. If you don't specify a capacity, the platform defaults to 3. The ***zoneRedundant*** property should be set to ***true*** and ***capacity*** should be set based on the workload requirement, but no less than three. The "optimal" capacity varies based on many factors and high availability and fault tolerance strategies, however a good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!TIP]
> To decide instance capacity, you can use the following calculation:
>
> Since the platform spreads VMs across 3 zones and you need to account for at least the failure of 1 zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires 4 instances, you should provision 6 instances: (2/3 * 6 instances) = 4 instances.
> 

In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances. If you also have autoscale configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances (autoscale behavior is independent of App Service platform behavior). It's important to note there's no guarantee that requests for additional instances in a zone-down scenario will succeed since back filling lost instances occurs on a best-effort basis. The recommended solution is to provision your App Service Plans to account for losing a zone as described previously in this article.

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

## In Region Data Residency ##

App Services deployed in an availability zone will only store customer data within the region where the App Service has been deployed. Both website file content as well as customer supplied settings and secrets stored in App Service remain within the region where the App Service is deployed.

Customers ensure single region data residency by following the steps outlined earlier in the section "How to Deploy a Zone Redundant App Service". By configuring an App Service according to these steps, an App Service deployed in an availability zone satisfies in region data residency requirements including those specified in the [Azure Trust Center](https://azuredatacentermap.azurewebsites.net/).