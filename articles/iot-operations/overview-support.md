---
title: Azure IoT Operations versions, support, and licensing
description: Explore supported versions, environments, dependencies, and licensing for Azure IoT Operations deployments.
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 10/08/2025
ms.custom: references_regions

# As an IT admin, you want to know the supported environments for Azure IoT Operations to plan your deployment effectively.
---

# Azure IoT Operations versions, support, and licensing

This article explains the supported versions, environments, and regions for Azure IoT Operations, along with its key dependencies and related resources. Use this guide to ensure compatibility and optimize your deployment. The guide also provides information about licensing for Azure IoT Operations.

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

* [Azure Device Registry](./discover-manage-assets/overview-manage-assets.md#azure-device-registry)
* [Schema registry](./connect-to-cloud/concept-schema-registry.md)
* [Azure Container Storage enabled by Azure Arc (optional)](/azure/azure-arc/container-storage/overview)
* [Azure Key Vault Secret Store extension](/azure/azure-arc/kubernetes/secret-store-extension)
* [Azure Monitor pipeline](/azure/azure-monitor/essentials/edge-pipeline-configure)
* [Workload identity federation in Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/conceptual-workload-identity)

> [!NOTE]
> These features and services, when used as dependencies of or in conjunction with Azure IoT Operations systems, inherit general availability status from the Azure IoT Operations product license.

> [!NOTE]
> For the *Azure Device Registry* service, Azure IoT Operations and Azure IoT Hub are the only products under which this service is licensed for production use. For the *Schema registry* capability, Azure IoT Operations is the only product under which this service is licensed for production use.

> [!NOTE]
> *Azure Container Storage enabled by Azure Arc* is an optional dependency that you must [install](/azure/azure-arc/container-storage/howto-install-edge-volumes) separately. Connectors like the *media connector* and the data flow endpoint *local storage* can use this option to synchronize captured data to cloud storage.

## Licensing

Azure IoT Operations licensing is covered by the terms stated in the [Microsoft Online Service Agreement (MOSA)](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/MOSA). Licensing that's specific to Azure IoT Operations can be found in the *Service Specific Terms* section of the MOSA.

If any of the licensing terms found in these documents block your adoption of Azure IoT Operations in trial, non-production, or production scenarios, contact [azureiotoperationslicensinghelp@microsoft.com](mailto:azureiotoperationslicensinghelp@microsoft.com). Depending on your specific circumstances, there might be solutions to unblock your project.

## Related articles

* [Pricing for Azure IoT Operations](https://azure.microsoft.com/pricing/details/iot-operations/)
* [Overview of Azure IoT Operations](overview-iot-operations.md)
* [Deployment details](deploy-iot-ops/overview-deploy.md)
* [Upgrade to a new version](deploy-iot-ops/howto-upgrade.md)
