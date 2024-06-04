---
title: Customer enabled disaster recovery
titleSuffix: Azure AI Studio
description: Learn how to plan for disaster recovery for Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.author: larryfr
author: Blackmist
ms.reviewer: andyaviles
ms.date: 5/21/2024
---

# Customer enabled disaster recovery

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery with Azure AI Studio. Since Azure AI Studio builds on [Azure Machine Learning architecture](/azure/machine-learning/concept-workspace), it's beneficial to reference the foundational architecture.

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might occur. We recommend having a disaster recovery plan in place for handling regional service outages. In this article, you learn how to:

* Plan for a multi-regional deployment of Azure AI Studio and associated resources.
* Maximize chances to recover logs, notebooks, docker images, and other metadata.
* Design for high availability of your solution.
* Initiate a failover to another region.

> [!IMPORTANT]
> Azure AI Studio itself does not provide automatic failover or disaster recovery.

## Understand Azure services for Azure AI Studio

Azure AI Studio depends on multiple Azure services. Some of these services are provisioned in your subscription. You're responsible for the high-availability configuration of these services. Microsoft manages some services, which are created in a Microsoft subscription. 

Azure services include:

* **Azure AI Studio infrastructure**: A Microsoft-managed environment for the Azure AI Studio hub and project. The [underlying architecture](Azure AI Studio architecture doc) is provided by Azure Machine Learning.

* **Required associated resources**: Resources provisioned in your subscription during Azure AI Studio hub and project creation. These resources include Azure Storage and Azure Key Vault.
  * Default storage has data such as model, training log data, and references to data assets.
  * Key Vault has credentials for Azure Storage and connections.

* **Optional associated resources**: Resources you can attach to your Azure AI Studio hub. These resources include Azure Container Registry and Application Insights.
  * Container Registry has a Docker image for training and inferencing environments.
  * Application Insights is for monitoring Azure AI Studio.

* **Compute instance**: Resource you create after hub deployment. Microsoft-managed model development environments.

* **Connections**: Azure AI Studio can connect to various other services. You're responsible for cofiguring their high-availability settings.

The following table shows the Azure services that Microsoft manages and the ones you manage. It also indicates the services that are highly available by default.

| Service | Managed by | High availability by default |
| ----- | ----- | ----- |
| **Azure AI Studio infrastructure** | Microsoft | |
| **Associated resources** |
| Azure Storage | You | |
| Key Vault | You | ✓ |
| Container Registry | You | |
| Application Insights | You | NA |
| **Compute resources** |
| Compute instance | Microsoft |  |
| **Any connection to external services** such as Azure AI Services | You | |

The rest of this article describes the actions you need to take to make each of these services highly available.

## Plan for multi-regional deployment

A multi-regional deployment relies on creation of Azure AI Studio and other resources (infrastructure) in two Azure regions. If a regional outage occurs, you can switch to the other region. When planning on where to deploy your resources, consider:

* __Regional availability__: If possible, use a region in the same geographic area, not necessarily the one that is closest. To check regional availability for Azure AI Studio, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/).
* __Azure paired regions__: Paired regions coordinate platform updates and prioritize recovery efforts where needed. However, not all regions support paired regions. For more information, see [Azure paired regions](/azure/reliability/cross-region-replication-azure).
* __Service availability__: Decide whether the resources used by your solution should be hot/hot, hot/warm, or hot/cold.
    
    * __Hot/hot__: Both regions are active at the same time, with one region ready to begin use immediately.
    * __Hot/warm__: Primary region active, secondary region has critical resources (for example, deployed models) ready to start. Noncritical resources would need to be manually deployed in the secondary region.
    * __Hot/cold__: Primary region active, secondary region has Azure AI Studio and other resources deployed, along with needed data. Resources such as models, model deployments, or pipelines would need to be manually deployed.

> [!TIP]
> Depending on your business requirements, you may decide to treat different Azure AI Studio resources differently.

Azure AI Studio builds on top of other services. Some services can be configured to replicate to other regions. Others you must manually create in multiple regions. The following table provides a list of services, who is responsible for replication, and an overview of the configuration:

| Azure service | Geo-replicated by | Configuration |
| ----- | ----- | ----- |
| AI Studio hub and projects | You | Create a hub/projects in the selected regions. |
| AI Studio compute | You | Create the compute resources in the selected regions. For compute resources that can dynamically scale, make sure that both regions provide sufficient compute quota for your needs. |
| Key Vault | Microsoft | Use the same Key Vault instance with the Azure AI Studio hub and resources in both regions. Key Vault automatically fails over to a secondary region. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).|
| Storage Account | You | Azure Machine Learning doesn't support __default storage-account__ failover using geo-redundant storage (GRS), geo-zone-redundant storage (GZRS), read-access geo-redundant storage (RA-GRS), or read-access geo-zone-redundant storage (RA-GZRS). Configure a storage account according to your needs and then use it for your hub. All subsequent projects use the hub's storage account. For more information, see [Azure Storage redundancy](/azure/storage/common/storage-redundancy). |
| Container Registry | Microsoft | Configure the Container Registry instance to geo-replicate registries to the paired region for Azure AI Studio. Use the same instance for both hub instances. For more information, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication). |
| Application Insights | You | Create Application Insights for the hub in both regions. To adjust the data-retention period and details, see [Data collection, retention, and storage in Application Insights](/azure/azure-monitor/logs/data-retention-archive). |

To enable fast recovery and restart in the secondary region, we recommend the following development practices:

* Use Azure Resource Manager templates. Templates are 'infrastructure-as-code,' and allow you to quickly deploy services in both regions.
* To avoid drift between the two regions, update your continuous integration and deployment pipelines to deploy to both regions.
* Create role assignments for users in both regions.
* Create network resources such as Azure Virtual Networks and private endpoints for both regions. Make sure that users have access to both network environments. For example, VPN and DNS configurations for both virtual networks.

## Design for high availability

### Availability zones

Certain Azure services support availability zones. For regions that support availability zones, if a zone goes down any project pauses and data should be saved. However, the data is unavailable to refresh until the zone is back online.

For more information, see [Availability zone service and regional support](/azure/reliability/availability-zones-service-support).

### Deploy critical components to multiple regions

Determine the level of business continuity that you're aiming for. The level might differ between the components of your solution. For example, you might want to have a hot/hot configuration for production pipelines or model deployments, and hot/cold for development.

Azure AI studio is a regional service and stores data both service-side and on a storage account in your subscription. If a regional disaster occurs, service data can't be recovered. But you can recover the data stored by the service on the storage account in your subscription given storage redundancy is enforced. Service-side stored data is mostly metadata (tags, asset names, descriptions). Stored on your storage account is typically non-metadata, for example, uploaded data. 

For connections, we recommend creating two separate resources in two distinct regions and then create two connections for the hub. For example, if AI Services is a critical resource for business continuity, creating two AI Services resources and two connections for the hub, would be a good strategy for business continuity. With this configuration, if one region goes down there's still one region operational. 

For any hubs that are essential to business continuity, deploy resources in two regions.

### Isolated storage

In the scenario in which you're connecting with data to customize your AI application, typically your datasets could be used in Azure AI but also outside of Azure AI. Dataset volume could be quite large, so for it might be good practice to keep this data in a separate storage account. Evaluate what data replication strategy makes most sense for your use case.

In AI Studio, make a connection to your data. If you have multiple AI Studio instances in different regions, you might still point to the same storage account because connections work across regions. 

## Initiate a failover

### Continue work in the failover hub

When your primary hub becomes unavailable, you can switch over to the secondary hub to continue development. Azure AI Studio doesn't automatically submit jobs to the secondary hub if there's an outage. Update your code configuration to point to the new hub or project resources. We recommend to avoiding hardcoding hub or project references.

Azure AI Studio can't sync or recover artifacts or metadata between hubs. Dependent on your application deployment strategy, you might have to move or recreate artifacts in the failover hub in order to continue. In case you configure your primary hub and secondary hub to share associated resources with geo-replication enabled, some objects might be directly available to the failover hub. For example, if both hubs share the same docker images, configured datastores, and Azure Key Vault resources.

> [!NOTE]
> Any jobs that are running when a service outage occurs will not automatically transition to the secondary hub. It is also unlikely that the jobs will resume and finish successfully in the primary hub once the outage is resolved. Instead, these jobs must be resubmitted, either in the secondary hub or in the primary (once the outage is resolved).

## Recovery options

### Resource deletion

If a hub and its existing resources are accidentally deleted, there are some resources that have soft delete enabled, allowing for resource recovery. Hubs and projects don't support soft delete. A hub or project that is deleted can't be recovered. Some underlying resources might support soft delete, so they could potentially be recovered. See table for which services have a soft delete option.

| Service | soft delete enabled |
| ------- | ------------------- |
| Azure AI Studio hub | Unsupported | 
| Azure AI Studio project | Unsupported | 
| Azure AI Services resource | Yes |
| Azure Storage | See [Recover a deleted storage account](/azure/storage/common/storage-account-recover#recover-a-deleted-account-from-the-azure-portal). |
| Azure Key Vault | Yes |

## Next steps

* To learn about secure infrastructure deployments with Azure AI Studio, see [Create a secure hub](create-secure-ai-hub.md).
* For information about the SLA, see the [Azure service-level agreements](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).
