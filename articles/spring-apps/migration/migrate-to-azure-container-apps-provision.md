---
title: Provision Azure Container Apps
description: Describes considerations during Azure Container Apps creation.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Provision Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article provides an overview of considerations during Azure Container Apps creation.

In Azure Spring Apps, applications are deployed within a service instance, which provides a fully managed platform. Similarly, in Azure Container Apps, container apps are created within an [Azure Container Apps environment](../../container-apps/environment.md), which serves as the foundational host for applications. While both services provide hosting environments, they differ in various aspects, such as pricing models, maintenance, regional support and management operations. This article explores these differences and provides guidance on creating and managing Azure Container Apps environments.

## Prerequisites

- An active Azure subscription. If you don't have one, you can [create a free Azure account](https://azure.microsoft.com/free).
- [Azure CLI](/cli/azure/install-azure-cli).
- The `Microsoft.App` resource provider is registered in your Azure subscription. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

## Create an Azure Container Apps environment

#### [Azure CLI](#tab/Azure-CLI)

To create an Azure Container Apps environment, use the following command:

```azurecli
az containerapp env create \
    --resource-group $RESOURCE_GROUP \
    --name $ENVIRONMENT \
    --location "$LOCATION"
```

For other configuration options, see [Azure Container Apps CLI commands](/cli/azure/containerapp/env).

#### [Azure portal](#tab/Azure-portal)

In the Azure portal, you can create an Azure Container Apps environment only when you create a container app. Use the following steps to create a new Container Apps environment during the container app creation process:

1. Search for **Container Apps** in the search bar.
1. Select **Container Apps** in the search results.
1. Select **Create**.
1. In the **Basics** tab, select the target **Subscription**
1. In the **Container Apps Environment** section, select **Create new** to create a new container apps environment.

---

After creating the environment, you can deploy a container app within it. For step-by-step guidance, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

> [!NOTE]
> Container app environments are deleted automatically if they meet certain condition - for example, if an environment remains idle for over 90 days. For a full list of conditions, see the [Policies](../../container-apps/environment.md#policies) section of [Azure Container Apps environments](../../container-apps/environment.md).

### Region support

The regions currently supported by Azure Container Apps might not completely align with those regions supported by Azure Spring Apps. Check the latest availability in [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region).

### Pricing

For an Azure Spring Apps instance, the charges are based on one of the available plans: Basic, Standard, or Enterprise. While in Azure Container Apps, pricing depends on your environment type and the workload profiles you choose.

#### Environment type

There are two environment types in Azure Container Apps: `Workload profile` and `Consumption only`. You can specify the environment type using the `--enable-workload-profiles` parameter when creating your Azure Container Apps environment. By default, `--enable-workload-profiles` is set to `true` when creating a `Workload profile` environment. If you set it to `false`, a `Consumption only` environment is created.

`Workload profile` environments enable you to create both consumption and dedicated workload profiles.

`Consumption only` environments don't support the creation of workload profiles.

For billing considerations for different types, you can find more information in the [Types](../../container-apps/environment.md#types) section of [Azure Container Apps environments](../../container-apps/environment.md). If you plan to use your own virtual network, consider the differences outlined in the following table:

| Environment type  | Supported plan types   | Description                                                                                                                                                                 |
|:------------------|:-----------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Workload profiles | Consumption, Dedicated | Supports user defined routes (UDR), egress through NAT Gateway, and creating private endpoints on the container app environment. The minimum required subnet size is `/27`. |
| Consumption only  | Consumption            | Doesn't support user defined routes (UDR), egress through NAT Gateway, peering through a remote gateway, or other custom egress. The minimum required subnet size is `/23`. |

For more information, see [Azure Container Apps environments](../../container-apps/environment.md).

#### Workload profile

If you choose to create a `Workload profile` environment, you can use the default `Consumption` profile or create extra `Dedicated` profiles to meet your specific application requirements. The following table describes these options:

| Profile type                      | Description                                                                                              | Potential use                                                                                                        |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------|
| Consumption                       | Automatically added to any new environment.                                                              | Apps that don't require specific hardware requirements.                                                              |
| Dedicated (General purpose)       | Balances memory and compute resources.                                                                   | Apps that require larger amounts of CPU and/or memory.                                                               |
| Dedicated (Memory optimized)      | Increased memory resources.                                                                              | Apps that need access to large in-memory data, in-memory machine learning models, or other high memory requirements. |
| Dedicated (GPU enabled) (preview) | GPU enabled with increased memory and compute resources available in West US 3 and North Europe regions. | Apps that require GPU.                                                                                               |

For more information on workload profile types and sizes, see the [Profile types](../../container-apps/workload-profiles-overview.md#profile-types) section of [Workload profiles in Azure Container Apps](../../container-apps/workload-profiles-overview.md).

#### Estimating costs

Use the [Azure pricing calculator](../../cost-management-billing/costs/pricing-calculator.md) to estimate costs for both workload profile types based on your application's resource requirements.

Consider scaling configurations and autoscaling triggers, as they significantly affect resource usage.

For more information, see [Workload Profiles in Azure Container Apps](https://chatgpt.com/azure/container-apps/workload-profiles-overview).

## Maintenance

Azure Container Apps ensures graceful application restarts during underlying maintenance. You can set up a maintenance window for your app environment by using the following command:

```azurecli
az containerapp env maintenance-config add \
    --resource-group <RESOURCE_GROUP> \
    --environment <ENVIRONMENT_NAME> \
    --weekday Monday \
    --start-hour-utc 1 \
    --duration 8
```

Similar to the planned maintenance feature in Azure Spring Apps, you can set the days of the week, start time, and duration - at least 8 hours - in Azure Container Apps. Container Apps performs noncritical updates according to your maintenance configuration.

> [!NOTE]
> Times in UTC format are expressed using the 24-hour time format. For instance, if you want your start hour to be 1:00 pm, then the `start-hour-utc` value is 13.
>
> Azure Container Apps guarantees that maintenance starts within the configured maintenance window but doesn't guarantee that maintenance finishes within the time window.
>
> Only noncritical updates follow the configured maintenance window. Critical updates don't.

For more information, see [Azure Container Apps planned maintenance](../../container-apps/planned-maintenance.md).

## Reliability

### Availability zone support

In most regions, Azure Spring Apps and Azure Container Apps use availability zones in regions where they're available. For a list of regions that support availability zones, see [Azure services with availability zone support](../../reliability/availability-zones-service-support.md). Azure Container Apps offers the same reliability support regardless of your plan type.

To enable availability zones in Azure Container Apps, you need to specify a virtual network with an available subnet when creating the container app environment. Both Azure Spring Apps and Azure Container Apps use the same parameter to enable zone redundancy. For more information on how to enable availability zones, see [Reliability in Azure Container Apps](../../reliability/reliability-azure-container-apps.md).

### Disaster recovery

Azure Spring Apps and Azure Container Apps employ a unified strategy for disaster recovery and business continuity. For more information, see the [Cross-region disaster recovery and business continuity](../../reliability/reliability-azure-container-apps.md#cross-region-disaster-recovery-and-business-continuity) section of [Reliability in Azure Container Apps](../../reliability/reliability-azure-container-apps.md).

## Known limitations

- Start/stop: Azure Spring Apps enables you to start or stop the entire service instance or individual apps. In contrast, Azure Container Apps supports start/stop functionality only at the container app level, not for the entire environment.
- Delete: When you delete an Azure Spring Apps service instance, all underlying resources are automatically removed. In contrast, for Azure Container Apps, you must delete subresources first, such as removing all container apps before deleting the container apps environment.
