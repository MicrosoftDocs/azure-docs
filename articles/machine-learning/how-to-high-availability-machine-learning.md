---
title: Failover & disaster recovery
titleSuffix: Azure Machine Learning
description: Learn how to plan for disaster recovery and maintain business continuity for Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: larryfr
author: blackmist
ms.reviewer: andyaviles
ms.date: 04/17/2024
monikerRange: 'azureml-api-2'
---

# Failover for business continuity and disaster recovery

To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery with Azure Machine Learning. 

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might occur. We recommend having a disaster recovery plan in place for handling regional service outages. In this article, you learn how to:

* Plan for a multi-regional deployment of Azure Machine Learning and associated resources.
* Maximize chances to recover logs, notebooks, docker images, and other metadata.
* Design for high availability of your solution.
* Initiate a failover to another region.

> [!IMPORTANT]
> Azure Machine Learning itself does not provide automatic failover or disaster recovery. Backup and restore of workspace metadata such as run history is unavailable.

In case you have accidentally deleted your workspace or corresponding components, this article also provides you with currently supported recovery options.

## Understand Azure services for Azure Machine Learning

Azure Machine Learning depends on multiple Azure services. Some of these services are provisioned in your subscription. You're responsible for the high-availability configuration of these services. Other services are created in a Microsoft subscription and are managed by Microsoft. 

Azure services include:

* **Azure Machine Learning infrastructure**: A Microsoft-managed environment for the Azure Machine Learning workspace.

* **Associated resources**: Resources provisioned in your subscription during Azure Machine Learning workspace creation. These resources include Azure Storage, Azure Key Vault, Azure Container Registry, and Application Insights.
  * Default storage has data such as model, training log data, and references to data assets.
  * Key Vault has credentials for Azure Storage, Container Registry, and data stores.
  * Container Registry has a Docker image for training and inferencing environments.
  * Application Insights is for monitoring Azure Machine Learning.

* **Compute resources**: Resources you create after workspace deployment. For example, you might create a compute instance or compute cluster to train a Machine Learning model.
  * Compute instance and compute cluster: Microsoft-managed model development environments.
  * Other resources: Microsoft computing resources that you can attach to Azure Machine Learning, such as Azure Kubernetes Service (AKS), Azure Databricks, Azure Container Instances, and Azure HDInsight. You're responsible for configuring high-availability settings for these resources.

* **Other data stores**: Azure Machine Learning can mount other data stores such as Azure Storage and Azure Data Lake Storage for training data. These data stores are provisioned within your subscription. You're responsible for configuring their high-availability settings. To see other data store options, see [Create datastores](how-to-datastore.md).

The following table shows the Azure services are managed by Microsoft and which are managed by you. It also indicates the services that are highly available by default.

| Service | Managed by | High availability by default |
| ----- | ----- | ----- |
| **Azure Machine Learning infrastructure** | Microsoft | |
| **Associated resources** |
| Azure Storage | You | |
| Key Vault | You | ✓ |
| Container Registry | You | |
| Application Insights | You | NA |
| **Compute resources** |
| Compute instance | Microsoft |  |
| Compute cluster | Microsoft |  |
| Other compute resources such as AKS, <br>Azure Databricks, Container Instances, HDInsight | You |  |
| **Other data stores** such as Azure Storage, SQL Database,<br> Azure Database for PostgreSQL, Azure Database for MySQL, <br>Azure Databricks File System | You | |

The rest of this article describes the actions you need to take to make each of these services highly available.

## Plan for multi-regional deployment

A multi-regional deployment relies on creation of Azure Machine Learning and other resources (infrastructure) in two Azure regions. If a regional outage occurs, you can switch to the other region. When planning on where to deploy your resources, consider:

* __Regional availability__: If possible, use a region in the same geographic area, not necessarily the one that is closest. To check regional availability for Azure Machine Learning, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/).
* __Azure paired regions__: Paired regions coordinate platform updates and prioritize recovery efforts where needed. However, not all regions support paired regions. For more information, see [Azure paired regions](/azure/reliability/cross-region-replication-azure).
* __Service availability__: Decide whether the resources used by your solution should be hot/hot, hot/warm, or hot/cold.
    
    * __Hot/hot__: Both regions are active at the same time, with one region ready to begin use immediately.
    * __Hot/warm__: Primary region active, secondary region has critical resources (for example, deployed models) ready to start. Non-critical resources would need to be manually deployed in the secondary region.
    * __Hot/cold__: Primary region active, secondary region has Azure Machine Learning and other resources deployed, along with needed data. Resources such as models, model deployments, or pipelines would need to be manually deployed.

> [!TIP]
> Depending on your business requirements, you may decide to treat different Azure Machine Learning resources differently. For example, you may want to use hot/hot for deployed models (inference), and hot/cold for experiments (training).

Azure Machine Learning builds on top of other services. Some services can be configured to replicate to other regions. Others you must manually create in multiple regions. The following table provides a list of services, who is responsible for replication, and an overview of the configuration:

| Azure service | Geo-replicated by | Configuration |
| ----- | ----- | ----- |
| Machine Learning workspace | You | Create a workspace in the selected regions. |
| Machine Learning compute | You | Create the compute resources in the selected regions. For compute resources that can dynamically scale, make sure that both regions provide sufficient compute quota for your needs. |
| Machine Learning registry | You | Create the registry in multiple regions. |
| Key Vault | Microsoft | Use the same Key Vault instance with the Azure Machine Learning workspace and resources in both regions. Key Vault automatically fails over to a secondary region. For more information, see [Azure Key Vault availability and redundancy](/azure/key-vault/general/disaster-recovery-guidance).|
| Container Registry | Microsoft | Configure the Container Registry instance to geo-replicate registries to the paired region for Azure Machine Learning. Use the same instance for both workspace instances. For more information, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication). |
| Storage Account | You | Azure Machine Learning doesn't support __default storage-account__ failover using geo-redundant storage (GRS), geo-zone-redundant storage (GZRS), read-access geo-redundant storage (RA-GRS), or read-access geo-zone-redundant storage (RA-GZRS). Create a separate storage account for the default storage of each workspace. </br>Create separate storage accounts or services for other data storage. For more information, see [Azure Storage redundancy](/azure/storage/common/storage-redundancy). |
| Application Insights | You | Create Application Insights for the workspace in both regions. To adjust the data-retention period and details, see [Data collection, retention, and storage in Application Insights](/azure/azure-monitor/logs/data-retention-archive). |

To enable fast recovery and restart in the secondary region, we recommend the following development practices:

* Use Azure Resource Manager templates. Templates are 'infrastructure-as-code', and allow you to quickly deploy services in both regions.
* To avoid drift between the two regions, update your continuous integration and deployment pipelines to deploy to both regions.
* When automating deployments, include the configuration of workspace attached compute resources such as Azure Kubernetes Service.
* Create role assignments for users in both regions.
* Create network resources such as Azure Virtual Networks and private endpoints for both regions. Make sure that users have access to both network environments. For example, VPN and DNS configurations for both virtual networks.

### Compute and data services

Depending on your needs, you might have more compute or data services that are used by Azure Machine Learning. For example, you might use Azure Kubernetes Services or Azure SQL Database. Use the following information to learn how to configure these services for high availability.

__Compute resources__

* **Azure Kubernetes Service**: See [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](/azure/aks/ha-dr-overview) and [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones). If the AKS cluster was created by using the Azure Machine Learning studio, SDK, or CLI, cross-region high availability isn't supported.
* **Azure Databricks**: See [Regional disaster recovery for Azure Databricks clusters](/azure/databricks/scenarios/howto-regional-disaster-recovery).
* **Container Instances**: An orchestrator is responsible for failover. See [Azure Container Instances and container orchestrators](/azure/container-instances/container-instances-orchestrator-relationship).
* **HDInsight**: See [High availability services supported by Azure HDInsight](/azure/hdinsight/hdinsight-high-availability-components).

__Data services__

* **Azure Blob container / Azure Files / Data Lake Storage Gen2**: See [Azure Storage redundancy](/azure/storage/common/storage-redundancy).
* **Data Lake Storage Gen1**: See [High availability and disaster recovery guidance for Data Lake Storage Gen1](/azure/data-lake-store/data-lake-store-disaster-recovery-guidance).

> [!TIP]
> If you provide your own customer-managed key to deploy an Azure Machine Learning workspace, Azure Cosmos DB is also provisioned within your subscription. In that case, you're responsible for configuring its high-availability settings. See [High availability with Azure Cosmos DB](/azure/cosmos-db/high-availability).

## Design for high availability

### Availability zones

Certain Azure services support availability zones. For regions that support availability zones, if a zone goes down any workload pauses and data should be saved. However, the data is unavailable to refresh until the zone is back online.

For more information, see [Availability zone service and regional support](/azure/reliability/availability-zones-service-support).

### Deploy critical components to multiple regions

Determine the level of business continuity that you're aiming for. The level might differ between the components of your solution. For example, you might want to have a hot/hot configuration for production pipelines or model deployments, and hot/cold for experimentation.

### Manage training data on isolated storage

By keeping your data storage isolated from the default storage the workspace uses for logs, you can:

* Attach the same storage instances as datastores to the primary and secondary workspaces.
* Make use of geo-replication for data storage accounts and maximize your uptime.

### Manage machine learning assets as code

> [!NOTE]
> Backup and restore of workspace metadata such as run history, models and environments is unavailable. Specifying assets and configurations as code using YAML specs, will help you re-recreate assets across workspaces in case of a disaster.

Jobs in Azure Machine Learning are defined by a job specification. This specification includes dependencies on input artifacts that are managed on a workspace-instance level, including environments and compute. For multi-region job submission and deployments, we recommend the following practices:

* Manage your code base locally, backed by a Git repository.
    * Export important notebooks from Azure Machine Learning studio.
    * Export pipelines authored in studio as code.

* Manage configurations as code.

    * Avoid hardcoded references to the workspace. Instead, configure a reference to the workspace instance using a [config file](how-to-configure-environment.md#local-and-dsvm-only-create-a-workspace-configuration-file) and use [MLClient.from_config()](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-from-config) to initialize the workspace.
    * Use a Dockerfile if you use custom Docker images.

## Initiate a failover

### Continue work in the failover workspace

When your primary workspace becomes unavailable, you can switch over the secondary workspace to continue experimentation and development. Azure Machine Learning doesn't automatically submit jobs to the secondary workspace if there's an outage. Update your code configuration to point to the new workspace resource. We recommend to avoiding hardcoding workspace references. Instead, use a [workspace config file](how-to-configure-environment.md#local-and-dsvm-only-create-a-workspace-configuration-file) to minimize manual user steps when changing workspaces. Make sure to also update any automation, such as continuous integration and deployment pipelines to the new workspace.

Azure Machine Learning can't sync or recover artifacts or metadata between workspace instances. Dependent on your application deployment strategy, you might have to move artifacts or recreate experimentation inputs, such as data assets, in the failover workspace in order to continue job submission. In case you have configured your primary workspace and secondary workspace resources to share associated resources with geo-replication enabled, some objects might be directly available to the failover workspace. For example, if both workspaces share the same docker images, configured datastores, and Azure Key Vault resources. The following diagram shows a configuration where two workspaces share the same images (1), datastores (2), and Key Vault (3).

:::image type="content" source="./media/how-to-high-availability-machine-learning/bcdr-resource-configuration-v2.png" alt-text="Diagram of failover between paired regions." lightbox="./media/how-to-high-availability-machine-learning/bcdr-resource-configuration-v2.png":::

> [!NOTE]
> Any jobs that are running when a service outage occurs will not automatically transition to the secondary workspace. It is also unlikely that the jobs will resume and finish successfully in the primary workspace once the outage is resolved. Instead, these jobs must be resubmitted, either in the secondary workspace or in the primary (once the outage is resolved).

### Moving artifacts between workspaces

Depending on your recovery approach, you may need to copy artifacts between the workspaces to continue your work. Currently, the portability of artifacts between workspaces is limited. We recommend managing artifacts as code where possible so that they can be recreated in the failover instance.

The following artifacts can be exported and imported between workspaces by using the [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md):

| Artifact | Export | Import |
| ----- | ----- | ----- |
| Models | [az ml model download --name {NAME} --version {VERSION}](/cli/azure/ml/model#az-ml-model-download) | [az ml model create](/cli/azure/ml/model#az-ml-model-create) |
| Environments | [az ml environment share --name my-environment --version {VERSION} --resource-group {RESOURCE_GROUP} --workspace-name {WORKSPACE} --share-with-name {NEW_NAME_IN_REGISTRY} --share-with-version {NEW_VERSION_IN_REGISTRY} --registry-name {REGISTRY_NAME}](/cli/azure/ml/environment#az-ml-environment-share) | [az ml environment create](/cli/azure/ml/environment#az-ml-environment-create) |
| Azure Machine Learning jobs | [az ml job download -n {NAME} -g {RESOURCE_GROUP} -w {WORKSPACE_NAME}](/cli/azure/ml/job#az-ml-job-download) | [az ml job create -f {FILE} -g {RESOURCE_GROUP} -w {WORKSPACE_NAME}](/cli/azure/ml/job#az-ml-job-create) |
| Data assets | [az ml data share --name {DATA_NAME} --version {VERSION} --resource-group {RESOURCE_GROUP} --workspace-name {WORKSPACE} --share-with-name {NEW_NAME_IN_REGISTRy} --share-with-version {NEW_VERSION_IN_REGISTRY} --registry-name {REGISTRY_NAME}](/cli/azure/ml/data#az-ml-data-create) | [az ml data create -f {FILE} -g {RESOURCE_GROUP} --registry-name {REGISTRY_NAME}]() |


> [!TIP]
> * __Job outputs__ are stored in the default storage account associated with a workspace. While job outputs might become inaccessible from the studio UI in the case of a service outage, you can directly access the data through the storage account. For more information on working with data stored in blobs, see [Create, download, and list blobs with Azure CLI](/azure/storage/blobs/storage-quickstart-blobs-cli).

## Recovery options

### Workspace deletion

If you accidentally deleted your workspace, you might able to recover it. For recovery steps, see [Recover workspace data after accidental deletion with soft delete](concept-soft-delete.md). 

Even if your workspace can't be recovered, you might still be able to retrieve your notebooks from the workspace-associated Azure storage resource by following these steps:
* In the [Azure portal](https://portal.azure.com), navigate to the storage account that was linked to the deleted Azure Machine Learning workspace.
* In the Data storage section on the left, select **File shares**.
* Your notebooks are located on the file share with the name that contains your workspace ID. 

## Next steps

To learn about repeatable infrastructure deployments with Azure Machine Learning, use an [Azure Resource Manager template](tutorial-create-secure-workspace-template.md).