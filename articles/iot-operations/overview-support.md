---
title: Azure IoT Operations versions and support
description: Explore supported versions, environments, and dependencies for Azure IoT Operations deployments.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 08/21/2025
ms.custom: references_regions

# As an IT admin, you want to know the supported environments for Azure IoT Operations to plan your deployment effectively.
---

# Azure IoT Operations versions and support

This article explains the supported versions, environments, and regions for Azure IoT Operations, along with its key dependencies and related resources. Use this guide to ensure compatibility and optimize your deployment.

## Supported versions

[!INCLUDE [supported-versions](includes/supported-versions.md)]

## Supported environments

[!INCLUDE [supported-environments-table](includes/supported-environments-table.md)]

## Supported regions

Azure IoT Operations supports Arc-enabled clusters in these regions:

| Region       | CLI value   |
|--------------|-------------|
| East US      | eastus      |
| East US 2    | eastus2     |
| West US      | westus      |
| West US 2    | westus2     |
| West US 3    | westus3     |
| West Europe  | westeurope  |
| North Europe | northeurope |
| Germany West Central | germanywestcentral |

This list applies only to the region you use to connect your cluster to Azure Arc. It doesn't limit you from using your preferred Azure region for cloud resources. Azure IoT Operations components and other resources deployed to clusters in these regions connect to cloud resources in different regions.

## Dependencies

Azure IoT Operations depends on these support services and features:

* [Azure Device Registry](./discover-manage-assets/overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry)
* [Schema registry](./connect-to-cloud/concept-schema-registry.md)
* [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview)
* [Azure Key Vault Secret Store extension](/azure/azure-arc/kubernetes/secret-store-extension)
* [Azure Monitor pipeline](/azure/azure-monitor/essentials/edge-pipeline-configure)
* Workload identity federation in Azure Arc-enabled Kubernetes

>[!NOTE]
>These features and services, used as dependencies by internal Azure IoT Operations systems, inherit general availability status from the Azure IoT Operations product license. For more information about the licensing model, see [Microsoft Online Subscription Agreement](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/MOSA).

## Related articles

* [Overview of Azure IoT Operations](overview-iot-operations.md)
* [Deployment details](deploy-iot-ops/overview-deploy.md)
* [Upgrade to a new version](deploy-iot-ops/howto-upgrade.md)
