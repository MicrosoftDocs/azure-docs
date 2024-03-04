---
title: Data encryption with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how Azure Machine Learning computes and datastores provide data encryption at rest and in transit.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 01/16/2024
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Data encryption with Azure Machine Learning

Azure Machine Learning relies on various Azure data storage services and compute resources when you're training models and performing inferences. In this article, learn about the data encryption for each service both at rest and in transit.

For production-grade encryption during training, we recommend that you use an Azure Machine Learning compute cluster. For production-grade encryption during inference, we recommend that you use Azure Kubernetes Service (AKS).

An Azure Machine Learning compute instance is a dev/test environment. When you use it, we recommend that you store your files, such as notebooks and scripts, in a file share. Store your data in a datastore.

## Encryption at rest

Azure Machine Learning end-to-end projects integrate with services like Azure Blob Storage, Azure Cosmos DB, and Azure SQL Database. This article describes encryption methods for such services.

### Azure Blob Storage

Azure Machine Learning stores snapshots, output, and logs in the Azure Blob Storage account (default storage account) that's tied to the Azure Machine Learning workspace and your subscription. All the data stored in Azure Blob Storage is encrypted at rest with Microsoft-managed keys.

For information on how to use your own keys for data stored in Azure Blob Storage, see [Azure Storage encryption with customer-managed keys in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

Training data is typically also stored in Azure Blob Storage so that training compute targets can access it. Azure Machine Learning doesn't manage this storage. This storage is mounted to compute targets as a remote file system.

If you need to _rotate or revoke_ your key, you can do so at any time. When you rotate a key, the storage account starts using the new key (latest version) to encrypt data at rest. When you revoke (disable) a key, the storage account takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.

For information on regenerating the access keys, see [Regenerate storage account access keys](how-to-change-storage-access-key.md).

### Azure Data Lake Storage

[!INCLUDE [Note](../../includes/data-lake-storage-gen1-rename-note.md)]

Azure Data Lake Storage Gen2 is built on top of Azure Blob Storage and is designed for big data analytics in enterprises. Data Lake Storage Gen2 is used as a datastore for Azure Machine Learning. Like Azure Blob Storage, the data at rest is encrypted with Microsoft-managed keys.

For information on how to use your own keys for data stored in Azure Data Lake Storage, see [Azure Storage encryption with customer-managed keys in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

### Azure relational databases

The Azure Machine Learning service supports data from the following data sources.

#### Azure SQL Database

Transparent data encryption helps protect Azure SQL Database against the threat of malicious offline activity by encrypting data at rest. By default, transparent data encryption is enabled for all newly deployed SQL databases that use Microsoft-managed keys.

For information on how to use customer-managed keys for transparent data encryption, see [Azure SQL Database transparent data encryption](/azure/azure-sql/database/transparent-data-encryption-tde-overview).

#### Azure Database for PostgreSQL

By default, Azure Database for PostgreSQL uses Azure Storage encryption to encrypt data at rest by using Microsoft-managed keys. It's similar to transparent data encryption in other databases, such as SQL Server.

For information on how to use customer-managed keys for transparent data encryption, see [Azure Database for PostgreSQL Single Server data encryption with a customer-managed key](../postgresql/single-server/concepts-data-encryption-postgresql.md).

#### Azure Database for MySQL

Azure Database for MySQL is a relational database service in the Microsoft Cloud. It's based on the MySQL Community Edition database engine. The Azure Database for MySQL service uses the FIPS 140-2 validated cryptographic module for Azure Storage encryption of data at rest.

To encrypt data by using customer-managed keys, see [Azure Database for MySQL data encryption with a customer-managed key](../mysql/single-server/concepts-data-encryption-mysql.md).

### Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. This instance is associated with a Microsoft subscription that Azure Machine Learning manages. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

When you're using your own (customer-managed) keys to encrypt the Azure Cosmos DB instance, a Microsoft-managed Azure Cosmos DB instance is created in your subscription. This instance is created in a Microsoft-managed resource group, which is different from the resource group for your workspace. For more information, see [Customer-managed keys for Azure Machine Learning](concept-customer-managed-keys.md).

### Azure Container Registry

All container images in your container registry (an instance of Azure Container Registry) are encrypted at rest. Azure automatically encrypts an image before storing it and decrypts it when Azure Machine Learning pulls the image.

To use customer-managed keys to encrypt your container registry, you need to create and attach the container registry while you're provisioning the workspace. You can encrypt the default instance that's created at the time of workspace provisioning.

> [!IMPORTANT]
> Azure Machine Learning requires you to enable the admin account on your container registry. By default, this setting is disabled when you create a container registry. For information on enabling the admin account, see [Admin account](../container-registry/container-registry-authentication.md#admin-account) later in this article.
>
> After you create a container registry for a workspace, don't delete it. Doing so will break your Azure Machine Learning workspace.

For examples of creating a workspace by using an existing container registry, see the following articles:

* [Create a workspace for Azure Machine Learning by using the Azure CLI](how-to-manage-workspace-cli.md)
* [Create a workspace with the Python SDK](how-to-manage-workspace.md?tabs=python#create-a-workspace)
* [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md)

:::moniker range="azureml-api-1"

### Azure Container Instances

> [!IMPORTANT]
> Deployments to Azure Container Instances rely on the Azure Machine Learning Python SDK and CLI v1.

You can encrypt a deployed Azure Container Instances resource by using customer-managed keys. The customer-managed keys that you use for Container Instances can be stored in the key vault for your workspace.

[!INCLUDE [sdk v1](includes/machine-learning-sdk-v1.md)]

To use the key when you're deploying a model to Container Instances, create a new deployment configuration by using `AciWebservice.deploy_configuration()`. Provide the key information by using the following parameters:

* `cmk_vault_base_url`: The URL of the key vault that contains the key.
* `cmk_key_name`: The name of the key.
* `cmk_key_version`: The version of the key.

For more information on creating and using a deployment configuration, see the following articles:

* [AciWebservice class reference](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-)
* [Deploy machine learning models to Azure](./v1/how-to-deploy-and-where.md)

For more information on using a customer-managed key with Container Instances, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md).
:::moniker-end

### Azure Kubernetes Service

You can encrypt a deployed Azure Kubernetes Service resource by using customer-managed keys at any time. For more information, see [Bring your own keys with Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md).

This process allows you to encrypt both the data and the OS disk of the deployed virtual machines in the Kubernetes cluster.

> [!IMPORTANT]
> This process works with only AKS version 1.17 or later. Azure Machine Learning added support for AKS 1.17 on Jan 13, 2020.

### Machine Learning compute

#### Compute cluster

The OS disk for each compute node stored in Azure Storage is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. This compute target is ephemeral, and clusters are typically scaled down when no jobs are queued. The underlying virtual machine is deprovisioned, and the OS disk is deleted.

Azure Disk Encryption is not enabled for workspaces by default. If you create the workspace with the `hbi_workspace` parameter set to `TRUE`, the OS disk is encrypted.

Each virtual machine also has a local temporary disk for OS operations. If you want, you can use the disk to stage training data. If you create the workspace with the `hbi_workspace` parameter set to `TRUE`, the temporary disk is encrypted. This environment is short lived (only during your job), and encryption support is limited to system-managed keys only.

Managed online endpoints and batch endpoints use Azure Machine Learning compute in the back end, and they follow the same encryption mechanism.

#### Compute instance

The OS disk for a compute instance is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. If you create the workspace with the `hbi_workspace` parameter set to `TRUE`, the local OS and temporary disks on a compute instance are encrypted with Microsoft-managed keys. Customer-managed key encryption is not supported for OS and temporary disks.

For more information, see [Customer-managed keys for Azure Machine Learning](concept-customer-managed-keys.md).

### Azure Data Factory

The Azure Data Factory pipeline ingests data for use with Azure Machine Learning. Azure Data Factory encrypts data at rest, including entity definitions and any data that's cached while runs are in progress. By default, data is encrypted with a randomly generated Microsoft-managed key that's uniquely assigned to your data factory.

For information on how to use customer-managed keys for encryption, see [Encrypt Azure Data Factory with customer-managed keys](../data-factory/enable-customer-managed-key.md).

### Azure Databricks

You can use Azure Databricks in Azure Machine Learning pipelines. By default, the Databricks File System (DBFS) that Azure Databricks uses is encrypted through a Microsoft-managed key. To configure Azure Databricks to use customer-managed keys, see [Configure customer-managed keys on default (root) DBFS](/azure/databricks/security/customer-managed-keys-dbfs).

### Microsoft-generated data

When you use services like Azure Machine Learning, Microsoft might generate transient, pre-processed data for training multiple models. This data is stored in a datastore in your workspace, so you can enforce access controls and encryption appropriately.

You might also want to encrypt [diagnostic information that's logged from your deployed endpoint](how-to-enable-app-insights.md) into Application Insights.

## Encryption in transit

Azure Machine Learning uses Transport Layer Security (TLS) to help secure internal communication between various Azure Machine Learning microservices. All Azure Storage access also occurs over a secure channel.

:::moniker range="azureml-api-1"
To help secure external calls made to the scoring endpoint, Azure Machine Learning uses TLS. For more information, see [Use TLS to secure a web service through Azure Machine Learning](./v1/how-to-secure-web-service.md).
:::moniker-end

## Data collection and handling

For diagnostic purposes, Microsoft might collect information that doesn't identify users. For example, Microsoft might collect resource names (for example, the dataset name or the machine learning experiment name) or job environment variables. All such data is stored through Microsoft-managed keys in storage hosted in Microsoft-owned subscriptions. The storage follows [Microsoft's standard privacy policy and data-handling standards](https://privacy.microsoft.com/privacystatement). This data stays within the same region as your workspace.

We recommend not storing sensitive information (such as account key secrets) in environment variables. Microsoft logs, encrypts, and stores environment variables. Similarly, when you name your jobs, avoid including sensitive information such as user names or secret project names. This information might appear in telemetry logs that Microsoft support engineers can access.

You can opt out from the collection of diagnostic data by setting the `hbi_workspace` parameter to `TRUE` while provisioning the workspace. This functionality is supported when you use the Azure Machine Learning Python SDK, the Azure CLI, REST APIs, or Azure Resource Manager templates.

## Credential storage in Azure Key Vault

Azure Machine Learning uses the Azure Key Vault instance that's associated with the workspace to store credentials of various kinds:

* The associated connection string for the storage account
* Passwords to Azure Container Registry instances
* Connection strings to datastores

Secure Shell (SSH) passwords and keys to compute targets like Azure HDInsight and virtual machines are stored in a separate key vault that's associated with the Microsoft subscription. Azure Machine Learning doesn't store any passwords or keys that users provide. Instead, it generates, authorizes, and stores its own SSH keys to connect to virtual machines and HDInsight to run the experiments.

Each workspace has an associated system-assigned managed identity that has the same name as the workspace. This managed identity has access to all keys, secrets, and certificates in the key vault.

## Next steps

:::moniker range="azureml-api-2"
* [Create datastores](how-to-datastore.md)
* [Create data assets](how-to-create-data-assets.md)
* [Access data in a training job](how-to-read-write-data-v2.md)
* [Use customer-managed keys](concept-customer-managed-keys.md)
:::moniker-end
:::moniker range="azureml-api-1"
* [Connect to Azure storage services](./v1/how-to-access-data.md)
* [Get data from a datastore](./v1/how-to-create-register-datasets.md)
* [Connect to data](v1/how-to-connect-data-ui.md)
* [Train with datasets](v1/how-to-train-with-datasets.md)
* [Use customer-managed keys](concept-customer-managed-keys.md)
:::moniker-end
