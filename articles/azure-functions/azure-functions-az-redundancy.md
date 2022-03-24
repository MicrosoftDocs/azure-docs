---
title: Azure Functions availability zone support on Elastic Premium plans
description: Learn how to use availability zone redundancy with Azure Functions for high-availability function applications on Elastic Premium plans. 
ms.topic: conceptual
ms.author: johnguo
ms.date: 09/07/2021
ms.custom: references_regions
# Goal: Introduce AZ Redundancy in Azure Functions elastic premium plans to customers + a tutorial on how to get started with ARM templates
---

# Azure Functions support for availability zone redundancy

Availability zone (AZ) support for Azure Functions is now available on Elastic Premium and Dedicated (App Service) plans. A Zone Redundant Azure Function application will automatically balance its instances between availability zones for higher availability. This document focuses on zone redundancy support for Elastic Premium Function plans. For zone redundancy on Dedicated plans, refer [here](../app-service/how-to-zone-redundancy.md).

## Overview

An [availability zone](../availability-zones/az-overview.md#availability-zones) is a high-availability offering that protects your applications and data from datacenter failures. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there&#39;s a minimum of three separate zones in all enabled regions. You can build high availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones.

A zone redundant function app will automatically distribute load the instances that your app runs on between the availability zones in the region. For Zone Redundant Elastic Premium apps, even as the app scales in and out, the instances the app is running on are still evenly distributed between availability zones.

## Requirements

> [!IMPORTANT]
> When selecting a [storage account](storage-considerations.md#storage-account-requirements) for your function app, be sure to use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage). Otherwise, in the case of a zonal outage, Functions may show unexpected behavior due to its dependency on Storage. 

- Both Windows and Linux are supported.
- Must be hosted on an [Elastic Premium](functions-premium-plan.md) or Dedicated hosting plan. Instructions on zone redundancy with Dedicated (App Service) hosting plan can be found [here](../app-service/how-to-zone-redundancy.md).
  - Availability zone (AZ) support isn't currently available for function apps on [Consumption](consumption-plan.md) plans.
- Zone redundant plans must specify a minimum instance count of 3.
- Function apps on an Elastic Premium plan additionally must have a minimum [always ready instances](functions-premium-plan.md#always-ready-instances) count of 3.
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
- At this time, must be created through [ARM template](../azure-resource-manager/templates/index.yml).

## How to deploy a function app on a zone redundant Premium plan

There are currently two publicly available options to deploy a zone redundant premium plan and function app. These options are either through the Azure Portal and through ARM template.

### Via the Portal

1. First, open the Azure Portal and navigate to the "Create Function App" page. Information on creating a function app in the portal can be found [here](functions-create-function-app-portal.md#create-a-function-app).

2. In the "Basics" page, fill out the fields for your function app. Pay special attention to the fields in the table below (also highlighted in the screenshot below), as these fields have additional requirements for zone redundancy.

| Setting      | Suggested value  | Additional Notes for Zone Redundancy |
| ------------ | ---------------- | ----------- |
| **Region** | Preferred region | The subscription under which this new function app is created. Note that you must pick a region that is AZ enabled. This list is referenced above in the article [here](#requirements). |

![Choose HTTP trigger function](./media/functions-az-redundancy\AzureFunctionsBasicsAZ.png)

3. In the "Hosting" page, fill out the fields for your function app hosting plan. Pay special attention to the fields in the table below (also highlighted in the screenshot below), as these fields have additional requirements for zone redundancy.

| Setting      | Suggested value  | Additional Notes for Zone Redundancy |
| ------------ | ---------------- | ----------- |
| **Storage Account** | A [zone-redundant storage account](storage-considerations.md#storage-account-requirements) | As mentioned above in the [requirements](#requirements) section, we strongly recommend using a zone-redundant storage account for your zone redundant function app. |
| **Plan Type** | Functions Premium | This article details how to create a Functions Premium zone redundant app and plan. Zone redundancy is not currently available in Consumption plans. Information on zone redundancy on app service plans can be found [here](../app-service/how-to-zone-redundancy.md). |
| **Zone Redundancy** | Enabled | This field populates the flag which determines if your app is zone redundant or not. Note that you will not be able to select 'Enabled' unless you have chosen a Region supporting Zone Redundancy, as mentioned in step 2. |

![Choose HTTP trigger function](./media/functions-az-redundancy\AzureFunctionsHostingAZ.png)

4. For the rest of the function app creation process, create your function app as normal. There are no fields in the rest of the creation process that impact zone redundancy.

### Using ARM Templates

This section details deploying a zone redundant Functions Premium Plan via [ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md). A guide to hosting Functions on Premium plans can be found [here](functions-infrastructure-as-code.md#deploy-on-premium-plan). Once the zone redundant plan is created and deployed, any function app hosted on your new plan will now be zone redundant.

The only properties to be aware of while creating a zone redundant Function plan are the new **zoneRedundant** property and the Function Plan instance count (**capacity**) fields. The **zoneRedundant** property must be set to **true** and the **capacity** property should be set based on the workload requirement, but no less than 3. Choosing the right capacity varies based on several factors and high availability/fault tolerance strategies. A good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure function Apps hosted on an elastic premium, zone redundant Function plan must have a minimum [always ready instance](functions-premium-plan.md#always-ready-instances) count of 3. This is to enforce that a zone redundant function app always has enough instances to satisfy at least one worker per zone.

Below is an ARM template snippet for a zone redundant, Premium Function Plan, showing the new **zoneRedundant** field and the **capacity** specification.

```
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

To learn more, see [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md).
