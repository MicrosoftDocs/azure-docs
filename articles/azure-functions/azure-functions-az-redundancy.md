---
title: Azure Functions Support 
description: Learn how to use Availability Zone Redundancy with Azure Functions for high-availability Function Applications. 
ms.topic: conceptual
ms.author: johnguo
ms.date: 09/07/2021
# Goal: Introduce AZ Redundancy in Azure Functions to customers + a tutorial on how to get started with ARM templates
---

# Azure Functions Support for Availability Zones

Availability Zone (AZ) support for Azure Functions is now available on Elastic Premium and Dedicated (App Service) plans. A Zone Redundant Azure Function application will automatically balance its instances between Availability Zones for higher availability.

## Overview

An [Availability Zone](../availability-zones/az-overview.md#availability-zones) is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there&#39;s a minimum of three separate zones in all enabled regions. You can build high availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones.

A zone redundant Function App will evenly distribute the instances that your app runs on between the availability zones in the region. On Elastic Premium plans, even as your app scales in and out, the instances your app is running on will still be automatically distributed evenly between Availability Zones.

## Requirements

- Both Windows and Linux are supported.
- Required to be hosted on [Elastic Premium](functions-premium-plan.md) or [Dedicated (App Service)](dedicated-plan.md) hosting plans.
  - Availability Zone (AZ) support isn't currently available for Function Apps on [Consumption](consumption-plan.md) plans.
- Both premium and dedicated zone redundant plans most specify a minimum instance count of 3.
- Function Apps on Premium plans additionally must have a minimum always ready instances count of 3.
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
- Must be created through [ARM templates](../azure-resource-manager/templates/index.yml). Portal and CLI support coming soon.

## How to Deploy a Zone Redundant Premium Functions Plan

Currently, you need to use [ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to create a zone redundant premium Function plan. Once created via an ARM template, the Function Plan can be viewed and interacted with via the Azure Portal and CLI tooling. An ARM template is only needed for the initial creation of the Function Plan. A guide to hosting Functions on Premium plans can be found [here](functions-infrastructure-as-code.md#deploy-on-premium-plan).

The only properties to be aware of while creating a zone redundant Function plan are the new **zoneRedundant** property and the Function Plan instance count (**capacity**) fields. The **zoneRedundant** property must be set to **true** and the **capacity** property should be set based on the workload requirement, but no less than 3. Choosing the right capacity varies based on several factors and high availability/fault tolerance strategies. A good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Function Apps hosted on a premium, zone redundant Function plan must have a minimum [always ready instance](functions-premium-plan.md#always-ready-instances) count of 3. This is to enforce that a zone redundant Function app always has enough instances to satisfy at least one worker per zone.

Below is an ARM template snippet for a zone redundant, Premium Function Plan, showing the new **zoneRedundant** field and the **capacity** specification.

```
    "resources": [
        {
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2021-01-15",
            "name": "[parameters('serverfarms_ASP_johnguo_9401_name')]",
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

For details on how to deploy ARM templates, see this [doc](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md).

## How to Deploy a Zone Redundant Dedicated Functions Plan

Azure Function apps [running on a regular dedicated App Service plan](dedicated-plan.md) are now able to use Availability Zone redundancy.

Information on creating a zone redundant App Service plan can be found [here](https://azure.github.io/AppService/2021/08/25/App-service-support-for-availability-zones.html).

Hosting your Function App on your newly created, zone redundant dedicated plan will ensure that your Function App uses zone redundancy.