---
title: Azure Functions availability zone support on Elastic Premium plans
description: Learn how to use availability zone redundancy with Azure Functions for high-availability function applications on Elastic Premium plans. 
ms.topic: conceptual
ms.author: johnguo
ms.date: 03/24/2022
ms.custom: references_regions
# Goal: Introduce AZ Redundancy in Azure Functions elastic premium plans to customers + a tutorial on how to get started with ARM templates
---

# Azure Functions support for availability zone redundancy

Availability zone (AZ) support for Azure Functions is now available on Premium (Elastic Premium) and Dedicated (App Service) plans. A zone-redundant Functions application automatically balances its instances between availability zones for higher availability. This article focuses on zone redundancy support for Premium plans. For zone redundancy on Dedicated plans, refer [here](../app-service/how-to-zone-redundancy.md).

[!INCLUDE [functions-premium-plan-note](../../includes/functions-premium-plan-note.md)] 

## Overview

An [availability zone](../availability-zones/az-overview.md#availability-zones) is a high-availability offering that protects your applications and data from datacenter failures. Availability zones are unique physical locations within an Azure region. Each zone comprises one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. You can build high-availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating into other zones.

A zone redundant function app automatically distributes the instances your app runs on between the availability zones in the region. For apps running in a zone-redundant Premium plan, even as the app scales in and out, the instances the app is running on are still evenly distributed between availability zones.

## Requirements

When hosting in a zone-redundant Premium plan, the following requirements must be met.  

- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [storage account](storage-considerations.md#storage-account-requirements). If you use a different type of storage account, Functions may show unexpected behavior during a zonal outage.
- Both Windows and Linux are supported.
- Must be hosted on an [Elastic Premium](functions-premium-plan.md) or Dedicated hosting plan. Instructions on zone redundancy with Dedicated (App Service) hosting plan can be found [in this article](../app-service/how-to-zone-redundancy.md).
  - Availability zone (AZ) support isn't currently available for function apps on [Consumption](consumption-plan.md) plans.
- Zone redundant plans must specify a minimum instance count of three.
- Function apps hosted on a Premium plan must also have a minimum [always ready instances](functions-premium-plan.md#always-ready-instances) count of three.

Zone-redundant Premium plans can currently be enabled in any of the following regions:
  - West US 2
  - West US 3
  - Central US
  - South Central US 
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

## How to deploy a function app on a zone redundant Premium plan

There are currently two ways to deploy a zone-redundant premium plan and function app. You can use either the [Azure portal](https://portal.azure.com) or an ARM template. 

# [Azure portal](#tab/azure-portal)

1. Open the Azure portal and navigate to the **Create Function App** page. Information on creating a function app in the portal can be found [here](functions-create-function-app-portal.md#create-a-function-app).

1. In the **Basics** page, fill out the fields for your function app. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Region** | Preferred region | The subscription under which this new function app is created. You must pick a region that is AZ enabled from the [list above](#requirements). |

    ![Screenshot of Basics tab of function app create page](./media/functions-az-redundancy\azure-functions-basics-az.png)

1. In the **Hosting** page, fill out the fields for your function app hosting plan. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Storage Account** | A [zone-redundant storage account](storage-considerations.md#storage-account-requirements) | As mentioned above in the [requirements](#requirements) section, we strongly recommend using a zone-redundant storage account for your zone redundant function app. |
    | **Plan Type** | Functions Premium | This article details how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. Information on zone redundancy on app service plans can be found [in this article](../app-service/how-to-zone-redundancy.md). |
    | **Zone Redundancy** | Enabled | This field populates the flag that determines if your app is zone redundant or not. You won't be able to select `Enabled` unless you have chosen a region supporting zone redundancy, as mentioned in step 2. |

    ![Screenshot of Hosting tab of function app create page](./media/functions-az-redundancy\azure-functions-hosting-az.png)

1. For the rest of the function app creation process, create your function app as normal. There are no fields in the rest of the creation process that affect zone redundancy.

# [ARM template](#tab/arm-template)

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. A guide to hosting Functions on Premium plans can be found [here](functions-infrastructure-as-code.md#deploy-on-premium-plan). 

The only properties to be aware of while creating a zone-redundant hosting plan are the new `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability/fault tolerance strategies. A good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an elastic premium, zone-redundant plan must have a minimum [always ready instance](functions-premium-plan.md#always-ready-instances) count of 3. This make sure that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Below is an ARM template snippet for a zone-redundant, Premium plan showing the `zoneRedundant` field and the `capacity` specification.

```json
"resources": [
    {
        "type": "Microsoft.Web/serverfarms",
        "apiVersion": "2021-01-15",
        "name": "your_plan_name_here",
        "location": "Central US",
        "sku": {
            "name": "EP3",
            "tier": "ElasticPremium",
            "size": "EP3",
            "family": "EP", 
            "capacity": 3
        },
        "kind": "elastic",
        "properties": {
            "perSiteScaling": false,
            "elasticScaleEnabled": true,
            "maximumElasticWorkerCount": 20,
            "isSpot": false,
            "reserved": false,
            "isXenon": false,
            "hyperV": false,
            "targetWorkerCount": 0,
            "targetWorkerSizeId": 0, 
            "zoneRedundant": true
        }
    }
]
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](functions-infrastructure-as-code.md).

---

After the zone-redundant plan is created and deployed, any function app hosted on your new plan is considered zone-redundant.

## Next steps

> [!div class="nextstepaction"]
> [Improve the performance and reliability of Azure Functions](performance-reliability.md)


