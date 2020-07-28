---
title: How to increase resiliency
titleSuffix: Azure Machine Learning
description: Learn how to make your Azure Machine Learning related resources more resilient to outages by using a high availability configuration.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 07/16/2020
---

# Increase the resiliency of Azure Machine Learning

[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to make your Azure Machine Learning related resources more resilient by using high availability configurations. The Azure services that Azure Machine Learning depends on can be configured for high availability. This article provides information on what services can be configured for high availability, and links to information on configuring these resources.

> [!NOTE]
> Azure Machine Learning itself does not offer a disaster recovery option.

## Understand Azure Services for Azure Machine Learning

Azure Machine Learning depends on multiple Azure services and has several layers. Some of them are provisioned in your (customer) subscription. You are responsible for the high availability configuration of these services. Some are created in a Microsoft subscription, and are managed by Microsoft.

* **Azure Machine Learning Infrastructure**: Microsoft-managed environment for Azure Machine Learning workspace.

* **Associated Resources**: Resources provisioned in your subscription during Azure Machine Learning workspace creation. They include Azure Storage, Azure Key Vault, Azure Container Registry (ACR), and App Insights. You are responsible for high availability settings for these resources.
  * Default storage has data such as model, training log data, and dataset.
  * Key Vault has credentials for storage, ACR, data stores.
  * ACR has docker image for training and inferencing environment.
  * App Insights is for monitoring Azure Machine Learning.

* **Compute Resources**: Resources you create after workspace deployment. For example, you might create a compute instance or compute cluster to train a machine learning model.
  * Compute Instance and Compute Cluster: Microsoft-managed model development environment.
  * Other Resources: They are the computing resources can be attached to Azure Machine Learning such as Azure Kubernetes Service (AKS), Azure Databricks, Azure Container Instances (ACI), and HDInsight. You are responsible for high availability setting.

* **Additional Data Stores**: Azure Machine Learning can mount additional data stores such as Azure Storage, Azure Data Lake Storage, and Azure SQL Database for training data.  They are within your subscription and you are responsible for high availability setting.

The following table shows which services are managed by Microsoft, which are managed by you, and which are highly available by default:

| Service | Managed by | HA by default |
| ----- | ----- | ----- |
| **Azure Machine Learning Infrastructure** | Microsoft | |
| **Associated Resources** |
| Azure Storage | You | |
| Azure Key Vault | You | ✓ |
| Azure Container Registry | You | |
| Application Insights | You | NA |
| **Compute Resources** |
| Compute Instance | Microsoft |  |
| Compute Cluster | Microsoft |  |
| Other resources such as Azure Kubernetes Service, <br>Azure Databricks, Azure Container Instance, Azure HDInsight | You |  |
| **Additional Data Stores** such as Azure Storage, Azure SQL Database,<br> Azure Database for PostgreSQL, Azure Database for MySQL, <br>Azure Databricks file system | You | |

Use the information in the rest of this document to learn the actions needed to take to make each of these services highly available.

## Associated Resources

> [!IMPORTANT]
> Azure Machine Learning does not support default storage account failover using Geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS) or Read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).

Make sure high availability setting of each resource with below information.

* **Azure Storage**: To configure high availability setting, see [Azure Storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy).
* **Azure Key Vault**: It provides default high availability service and no user action required.  See [Azure Key Vault availability and redundancy](https://docs.microsoft.com/azure/key-vault/general/disaster-recovery-guidance).
* **Azure Container Registry**: Choose Premium SKU for geo-replication. See [Geo-replication in Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-geo-replication).
* **Application Insights**: It does not provide high availability setting. You can tweak data retention period and details in [Data collection, retention, and storage in Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/data-retention-privacy#how-long-is-the-data-kept).

## Compute Resources

Make sure high availability setting of each resource with below documentation.

* **Azure Kubernetes Service**: See [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region) and [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](https://docs.microsoft.com/azure/aks/availability-zones). If the AKS cluster was created by Azure Machine Learning (using studio, SDK, or ML CLI), cross-region high availability is not supported.
* **Azure Databricks**: See [Regional disaster recovery for Azure Databricks clusters](https://docs.microsoft.com/azure/azure-databricks/howto-regional-disaster-recovery).
* **Azure Container Instance**: ACI orchestrator is responsible for failover. See [Azure Container Instances and container orchestrators](https://docs.microsoft.com/azure/container-instances/container-instances-orchestrator-relationship).
* **Azure HDInsight**: See [High availability services supported by Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-high-availability-components).

## Additional Data Stores

Make sure high availability setting of each resource with below documentation.

* **Azure Blob Container / Azure File Share / Azure Data Lake Gen2**: Same as default storage.
* **Azure Data Lake Gen1**: See[Disaster recovery guidance for data in Azure Data Lake Storage Gen1](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-disaster-recovery-guidance).
* **Azure SQL Database**: See [High-availability and Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-high-availability).
* **Azure Database for PostgreSQL**: See [High availability concepts in Azure Database for PostgreSQL - Single Server](https://docs.microsoft.com/azure/postgresql/concepts-high-availability).
* **Azure Database for MySQL**: See [Understand business continuity in Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/concepts-business-continuity).
* **Databricks File System**: See [Regional disaster recovery for Azure Databricks clusters](https://docs.microsoft.com/azure/azure-databricks/howto-regional-disaster-recovery).

## Azure Cosmos DB

If you provide your own key (customer-managed key) to deploy Azure Machine Learning workspace, Cosmos DB is also provisioned within your subscription. In that case, you are responsible for its high availability. See [High availability with Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/high-availability)

## Next steps

To deploy Azure Machine Learning with associated resources with your high availability Settings, use an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced).