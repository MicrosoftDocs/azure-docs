---
title: High availability for Service Connector 
description: Learn about availability zones, zone redundancy, disaster recovery, and cross-region failover for Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: concept-article
ms.date: 03/27/2026
ms.custom: references_regions
#Customer intent: As an Azure developer, I want to understand Service Connector availability concepts so I can take advantage of these features in my Service Connector connections.
---

# High availability for Service Connector

Service Connector can provide high availability support for all types of applications you run in Azure. This article describes Service Connector high availability features like availability zones, zone redundancy, disaster recovery, and cross-region failover.

The goal of the high availability architecture in Service Connector is to guarantee that service connections are up and running at least 99.9% of time. This high availability means you don't have to worry about the effects of maintenance operations and outages on your service connections.

## Availability zones

Service Connector supports Azure availability zones to help you achieve resiliency and reliability for your business-critical workloads. You can distribute Azure compute services across availability zones in many regions. Service Connector is an extension resource provider to these compute services.

Microsoft is responsible for setting up availability zones and disaster recovery for your service connections. When you create a service connection in a compute service with availability zones enabled, Azure automatically sets up the corresponding availability zones for your service connection.

## Zone redundancy

Service Connector is an Azure extension resource provider that extends Azure App Service, Azure Spring Apps, and Azure Container Apps. When you use Service Connector to create a new service connection in one of these compute services, Azure provisions a connection resource as part of the top-level parent compute service.

To enable zone redundancy for the service connection, you must enable zone redundancy for the compute service. Your service connection then also automatically becomes zone-redundant.

For example, if you have an app service that has zone redundancy enabled with three instances, the platform automatically spreads your app service instances across three zones in the selected region. When you use Service Connector to create a service connection in this app service, the service connection resource is also automatically created in the three corresponding zones in the selected region.

Traffic is routed to all of your available connection resources. When a zone goes down, the platform detects the lost instances, automatically attempts to find new replacement instances, and spreads the traffic as needed.

To create a zone-redundant service connection using Service Connector, see [Create a zone-redundant service connection](#create-a-zone-redundant-service-connection).

> [!NOTE]
> To create, update, validate, and list service connections, Service Connector calls APIs from the compute service and the target service. Because Service Connector relies on the responses from both the compute service and the target service, requests to Service Connector might not succeed if the target service can't be reached in a zone-down scenario. This limitation applies to App Service, Azure Container Apps, and Azure Spring Apps.

## Disaster recovery and resiliency

Disaster recovery is the process of restoring application functionality after a catastrophic loss. Instead of trying to prevent failures altogether, the goal of disaster recovery is to minimize the effects of a single failing component.

Service Connector handles *business continuity and disaster recovery (BCDR)* for storage and compute. The goal is for issues in storage or compute in any region to have the minimum possible business impact. In a disaster, Service Connector fails over to the paired region. Once the Service Connector team identifies and declares an outage, customers don't need to do anything more.

*Recovery Time Objective (RTO)* indicates the duration between the beginning of an outage that impacts Service Connector and the recovery to full availability. *Recovery Point Objective (RPO)* indicates the duration between the start of the outage that affects Service Connector and the last operation correctly restored. Expected and maximum RPO is 24 hours and RTO is 24 hours.

The data layer design prioritizes availability over latency during a disaster. If a region goes down, Service Connector attempts to serve end-user requests from its paired region.

During a disaster, operations against Service Connector might fail before the failover happens. After failover, all data and actions serve as usual from the customer viewpoint. Data is restored, and customers don't need to take any action.

During the failover action, Service Connector handles DNS remapping to the available regions. Service Connector changes its DNS in about one hour. Performing a manual failover would take more time. Because Service Connector is a resource provider built on top of other Azure services, the actual time depends on the failover time of the underlying services.

### Disaster recovery region support

Service Connector currently supports the following region pairs. In a primary region outage, failover to the secondary region starts automatically.

| Primary         | Secondary         |
|-----------------|-------------------|
| East US 2 Early Updates Access Program (EUAP)  | East US           |
| West Central US | West Central US 2 |
| West Europe     | North Europe      |
| North Europe    | West Europe       |
| East US         | West US 2         |
| West US 2       | East US           |

## Cross-region failover

Microsoft is responsible for handling cross-region failovers. The failover process doesn't require any changes in the customer's applications or compute service configurations. Service Connector uses an active-passive cluster configuration with automatic failover. After a disaster recovery, customers can use the full functionalities of Service Connector.

Service Connector runs health checks every 10 minutes, and regional failovers are detected and handled in the Service Connector backend. The health checks that run every 10 minutes simulate user behavior by creating, validating, and updating connections to target services in each of the compute services Service Connector supports.

Microsoft starts to analyze and launch a Service Connector failover under any of the following conditions:

- The service health check fails three times in a row.
- The Service Connector dependent services declare an outage.
- Customers report a region outage.

Requests to service connections are impacted during a failover. Once the failover is complete, service connection data is restored. You can check the [Azure status page](https://azure.status.microsoft/en-us/status) to check the status of all Azure services.

## Create a zone-redundant service connection

You can create a Service Connector zone-redundant service connection to a target resource of your choice by using Azure CLI or the Azure portal. You use the same process to create zone-redundant connections for Azure Spring Apps and Azure Container Apps compute services.

The following steps create a zone-redundant service connection to an Azure Storage blob for Azure App Service. To enable zone redundancy for an App Service service connection, you first create a zone-redundant App Service. Because you enable zone redundancy for your App Service, the service connection is also zone redundant.

> [!IMPORTANT]
> Zone redundancy is supported only in the PremiumV2-PremiumV4 and Isolated SKU tiers of App Service. Basic and Free SKU tiers don't support zone redundancy. For more information, see [Reliability in Azure App Service](/azure/reliability/reliability-app-service#resilience-to-availability-zone-failures).

### [Azure CLI](#tab/azure-cli)

The following steps create a zone-redundant service connection for a PremiumV3 App Service Plan called `MyPlan` in an existing resource group called `MyResourceGroup`. This example creates a service connection to an Azure Storage blob. To create web app service connections to other target resources, see [az webapp connection create](/cli/azure/webapp/connection/create).

1. Create the App Service plan and include a `--zone-redundant` parameter. You can also optionally include the `--number-of-workers` parameter to specify capacity. For more information, see [How to deploy a zone-redundant App Service](/azure/app-service/environment/overview-zone-redundancy).

   ```azurecli
   az appservice plan create --resource-group MyResourceGroup --name MyPlan --sku P1V3 --zone-redundant --number-of-workers 6
   ```

1. Create a web app in the App Service plan. New web app names must be globally unique in Azure. In the following code, replace the `<unique_app_name>` placeholder with your globally unique web app name.

   ```azurecli
   az webapp create --name <unique_app_name> --plan MyPlan --resource-group MyResourceGroup
   ```
   
1. Create a service connection to an existing Azure Storage blob using system-assigned identity authorization. In the following code, replace the `<unique_app_name>`, `<storage_account_resource_group>`, and `<storage_account_name>` placeholders with the values for your resources. For more information, see [az webapp connection create storage-blob](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob).

   ```azurecli
   az webapp connection create storage-blob \
     --resource-group MyResourceGroup -name <unique_app_name> \
     --target-resource-group <storage_account_resource_group> \
     --account <storage_account_name> --system-identity
   ```

### [Portal](#tab/azure-portal)

The following steps create a zone-redundant service connection for a PremiumV3 App Service Plan to an existing Azure Storage blob.

1. In the Azure portal, search for and select **App Services**.
1. Select **Create** > **Web App**.
1. Complete the **Create Web App** form, providing a globally unique web app name and selecting a PremiumV3 or other Premium or Isolated pricing plan. At the bottom of the **Basics** tab, select **Enabled** under **Zone redundancy**.

   :::image type="content" source="media/enable-zone-redundancy.png" alt-text="Screenshot of the Azure portal, enabling zone redundancy in App Services.":::

1. After completing the form, select **Review + create** and then select **Create**.
1. When the deployment completes, go to the web app and select **Service Connector** under **Settings** in the left navigation menu.
1. Select **Create**, and complete the **Create connection** form. Under **Service type**, select **Storage - Blob** or another service of your choice.
1. After you complete the form, select **Review + Create**, and then select **Create**.

---

> [!TIP]
> Enabling zone redundancy for your target service is recommended. In a zone-down scenario, traffic to your connection is automatically spread to other zones. However, creating, validating, and updating connections relies on target service management APIs. If the target service doesn't support or enable zone redundancy, these operations fail.

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Service Connector region support](concept-region-support.md)
- [Service Connector FAQ](faq.yml)
