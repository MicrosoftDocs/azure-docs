---
title: Resiliency & high availability
titleSuffix: Azure Machine Learning
description: Learn how to make your Azure Machine Learning resources more resilient to outages by using a high-availability configuration.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/16/2020
---

# Increase Azure Machine Learning resiliency

[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you'll learn how to make your Microsoft Azure Machine Learning resources more resilient by using high-availability configurations. You can configure the Azure services that Azure Machine Learning depends on for high availability. This article identifies the services you can configure for high availability, and links to additional information on configuring these resources.

> [!NOTE]
> Azure Machine Learning itself does not offer a disaster recovery option.

## Understand Azure services for Azure Machine Learning

Azure Machine Learning depends on multiple Azure services and has several layers. Some of these services are provisioned in your (customer) subscription. You're responsible for the high-availability configuration of these services. Other services are created in a Microsoft subscription and  managed by Microsoft. 

Azure services include:

* **Azure Machine Learning infrastructure**: A Microsoft-managed environment for the Azure Machine Learning workspace.

* **Associated resources**: Resources provisioned in your subscription during Azure Machine Learning workspace creation. These resources include Azure Storage, Azure Key Vault, Azure Container Registry, and Application Insights. You're responsible for configuring high-availability settings for these resources.
  * Default storage has data such as model, training log data, and dataset.
  * Key Vault has credentials for Azure Storage, Container Registry, and data stores.
  * Container Registry has a Docker image for training and inferencing environments.
  * Application Insights is for monitoring Azure Machine Learning.

* **Compute resources**: Resources you create after workspace deployment. For example, you might create a compute instance or compute cluster to train a Machine Learning model.
  * Compute instance and compute cluster: Microsoft-managed model development environments.
  * Other resources: Microsoft computing resources that you can attach to Azure Machine Learning, such as Azure Kubernetes Service (AKS), Azure Databricks, Azure Container Instances, and Azure HDInsight. You're responsible for configuring high-availability settings for these resources.

* **Additional data stores**: Azure Machine Learning can mount additional data stores such as Azure Storage, Azure Data Lake Storage, and Azure SQL Database for training data.  These data stores are provisioned within your subscription. You're responsible for configuring their high-availability settings.

The following table shows which Azure services are managed by Microsoft, which are managed by you, and which are highly available by default.

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
| **Additional data stores** such as Azure Storage, SQL Database,<br> Azure Database for PostgreSQL, Azure Database for MySQL, <br>Azure Databricks File System | You | |

The rest of this article describes the actions you need to take to make each of these services highly available.

## Associated resources

> [!IMPORTANT]
> Azure Machine Learning does not support default storage-account failover using geo-redundant storage (GRS), geo-zone-redundant storage (GZRS), read-access geo-redundant storage (RA-GRS), or read-access geo-zone-redundant storage (RA-GZRS).

Make sure to configure the high-availability settings of each resource by referring to the following documentation:

* **Azure Storage**: To configure high-availability settings, see [Azure Storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy).
* **Key Vault**: Key Vault provides high availability by default and requires no user action.  See [Azure Key Vault availability and redundancy](https://docs.microsoft.com/azure/key-vault/general/disaster-recovery-guidance).
* **Container Registry**: Choose the Premium registry option for geo-replication. See [Geo-replication in Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-geo-replication).
* **Application Insights**: Application Insights doesn't provide high-availability settings. To adjust the data-retention period and details, see [Data collection, retention, and storage in Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/data-retention-privacy#how-long-is-the-data-kept).

## Compute resources

Make sure to configure the high-availability settings of each resource by referring to the following documentation:

* **Azure Kubernetes Service**: See [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region) and [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](https://docs.microsoft.com/azure/aks/availability-zones). If the AKS cluster was created by using the Azure Machine Learning Studio, SDK, or CLI, cross-region high availability is not supported.
* **Azure Databricks**: See [Regional disaster recovery for Azure Databricks clusters](https://docs.microsoft.com/azure/azure-databricks/howto-regional-disaster-recovery).
* **Container Instances**: An orchestrator is responsible for failover. See [Azure Container Instances and container orchestrators](https://docs.microsoft.com/azure/container-instances/container-instances-orchestrator-relationship).
* **HDInsight**: See [High availability services supported by Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-high-availability-components).

## Additional data stores

Make sure to configure the high-availability settings of each resource by referring to the following documentation:

* **Azure Blob container / Azure Files / Data Lake Storage Gen2**: Same as default storage.
* **Data Lake Storage Gen1**: See [High availability and disaster recovery guidance for Data Lake Storage Gen1](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-disaster-recovery-guidance).
* **SQL Database**: See [High availability for Azure SQL Database and SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-high-availability).
* **Azure Database for PostgreSQL**: See [High availability concepts in Azure Database for PostgreSQL - Single Server](https://docs.microsoft.com/azure/postgresql/concepts-high-availability).
* **Azure Database for MySQL**: See [Understand business continuity in Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/concepts-business-continuity).
* **Azure Databricks File System**: See [Regional disaster recovery for Azure Databricks clusters](https://docs.microsoft.com/azure/azure-databricks/howto-regional-disaster-recovery).

## Azure Cosmos DB

If you provide your own customer-managed key to deploy an Azure Machine Learning workspace, Azure Cosmos DB is also provisioned within your subscription. In that case, you're responsible for configuring its high-availability settings. See [High availability with Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/high-availability).

## Next steps

To deploy Azure Machine Learning with associated resources with your high-availability settings, use an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced).
