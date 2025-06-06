---
title: High availability for Service Connector 
description: This article covers availability zones, zone redundancy, disaster recovery, and cross-region failover for Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: conceptual
ms.date: 10/05/2023
ms.custom: references_regions
#Customer intent: As an Azure developer, I want to understand the availability of my connection created with Service Connector.
---

# High availability for Service Connector

Service Connector supports Azure availability zones to help you achieve resiliency and reliability for your business-critical workloads. The goal of the high availability architecture in Service Connector is to guarantee that your service connections are up and running at least 99.9% of time, so that you don't have to worry about the effects of potential maintenance operations and outages. Service Connector is designed to provide high availability support for all types of applications you're running in Azure.

Users can distribute Azure compute services across availability zones in many regions. Service Connector is an extension resource provider to these compute services. When you create a service connection in a compute service with availability zones enabled, Azure will also automatically set up the corresponding service connection availability zone for your service connection. Microsoft is responsible for setting up availability zones and disaster recovery for your service connections.

## Zone redundancy in Service Connector

Service Connector is an Azure extension resource provider. It extends Azure App Service, Azure Spring Apps and Azure Container Apps. When you create a new service connection in one of these compute services with Service Connector, a connection resource is provisioned as part of your top-level parent compute service.

To enable zone redundancy for your connection, you must enable zone redundancy for your compute service. Once the compute service has been configured with zone redundancy, your service connections will also automatically become zone-redundant. For example, if you have an app service with zone redundancy enabled, the platform automatically spreads your app service instances across three zones in the selected region. When you create a service connection in this app service with Service Connector, the service connection resource is also automatically created in the three corresponding zones in the selected region. Traffic is routed to all of your available connection resources. When a zone goes down, the platform detects the lost instances, automatically attempts to find new replacement instances, and spreads the traffic as needed.

> [!NOTE]
> To create, update, validate and list service connections, Service Connector calls APIs from a compute service and a target service. As Service Connector relies on the responses from both the compute service and the target service, requests to Service Connector in a zone-down scenario might not succeed if the target service can't be reached. This limitation applies to App Service, Azure Container Apps and Azure Spring Apps.

## How to create a zone-redundant service connection with Service Connector

Follow the instructions below to create a zone-redundant service connection in App Service using the Azure CLI or the Azure portal. The same process can be used to create a zone-redundant connection for Azure Spring Apps and Azure Container Apps compute services.

### [Azure CLI](#tab/azure-cli)

To enable zone redundancy for a service connection using the Azure CLI, start by creating a zone-redundant App Service.

1. Create an App Service plan and include a `--zone-redundant` parameter. Optionally include the `--number-of-workers` parameter to specify capacity. Learn more details in [How to deploy a zone-redundant App Service](../app-service/environment/overview-zone-redundancy.md).

    ```azurecli
    az appservice plan create --resource-group MyResourceGroup --name MyPlan --zone-redundant --number-of-workers 6
    ```

1. Create an application in App Service and a connection to your Blob Storage account or another target service of your choice.

    ```azurecli
    az webapp create --name MyApp --plan MyPlan resource-group MyResourceGroup
    az webapp connection create storage-blob 
    ```

### [Portal](#tab/azure-portal)

To enable zone redundancy for a service connection in App Service using the Azure portal, follow the process below:

1. In the Azure portal, in the **Search resources, services, and docs (G+/)**, enter **App Services** and select **App Services**.
1. Select **Create** and fill out the form. In the first tab, under **Zone redundancy**, select **Enabled**.

    :::image type="content" source="media/enable-zone-redundancy.png" alt-text="Screenshot of the Azure portal, enabling zone redundancy in App Services.":::

1. Select **Review + create** and then **Create**.
1. In the App Service instance, select **Service Connector** from the left menu and select **Create**.
1. Fill out the form to create the connection.

---

As you enabled zone redundancy for your App Service, the service connection is also zone redundant.

> [!TIP]
> Enabling zone redundancy for your target service is recommended. In a zone-down scenario, traffic to your connection will automatically be spread to other zones. However, creating, validating and updating connections rely on management APIs from the target service. If  a target service doesn’t support zone redundancy or doesn’t have zone redundancy enabled, these operations will fail.

## Understand disaster recovery and resiliency in Service Connector

Disaster recovery is the process of restoring application functionality after a catastrophic loss.

In the cloud, we acknowledge upfront that failures will certainly happen. Instead of trying to prevent failures altogether, the goal is to minimize the effects of a single failing component. If there's a disaster, Service Connector will fail over to the paired region. Customers don’t need to do anything if the outage is decided/declared by the Service Connector team.

We'll use the terms *RTO (Recovery Time Objective)*, to indicate the time between the beginning of an outage impacting Service Connector and the recovery to full availability. We'll use *RPO (Recovery Point Objective)*, to indicate the time between the last operation correctly restored and the time of the start of the outage affecting Service Connector. Expected and maximum RPO is 24 hours and RTO is 24 hours.

Operations against Service Connector might fail during the disaster time, before the failover happens. Once the failover is completed, data will be restored and the customer isn't required to take any action.

Service connector handles business continuity and disaster recovery (BCRD) for storage and compute. The platform strives to have as minimal of an impact as possible in case of issues in storage/compute, in any region. The data layer design prioritizes availability over latency in the event of a disaster – meaning that if a region goes down, Service Connector will attempt to serve the end-user request from its paired region.

During the failover action, Service Connector handles the DNS remapping to the available regions. All data and action from customer view serves as usual after failover.
Service Connector will change its DNS in about one hour. Performing a manual failover would take more time. As Service Connector is a resource provider built on top of other Azure services, the actual time depends on the failover time of the underlying services.

## Disaster recovery region support

Service Connector currently supports the following region pairs. In the event of a primary region outage, failover to the secondary region starts automatically.

| Primary         | Secondary         |
|-----------------|-------------------|
| East US 2 EUAP  | East US           |
| West Central US | West Central US 2 |
| West Europe     | North Europe      |
| North Europe    | West Europe       |
| East US         | West US 2         |
| West US 2       | East US           |

## Cross-region failover

Microsoft is responsible for handling cross-region failovers. Service Connector runs health checks every 10 minutes and regional failovers are detected and handled in the Service Connector backend. The failover process doesn’t require any changes in the customer’s applications or compute service configurations. Service Connector uses an active-passive cluster configuration with automatic failover. After a disaster recovery, customers can use the full functionalities provided by Service Connector.

The health check that runs every 10 minutes simulates user behavior by creating, validating, and updating connections to target services in each of the compute services supported by Service Connector. Microsoft will start to analyze and launch a Service Connector failover if we meet any of the following conditions:

- The service health check fails three times in a row
- Service Connector’s dependent services declare an outage
- Customers report a region outage

Requests to service connections are impacted during a failover. Once the failover is complete, service connection data is restored. You can check the [Azure status page](https://azure.status.microsoft/en-us/status) to check the status of all Azure services.

## Next steps

Go the concept article below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
