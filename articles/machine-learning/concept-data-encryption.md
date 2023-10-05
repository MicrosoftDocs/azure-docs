---
title: Data encryption with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how Azure Machine Learning computes and data stores provides data encryption at rest and in transit.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 03/07/2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Data encryption with Azure Machine Learning

Azure Machine Learning relies on a various of Azure data storage services and compute resources when training models and performing inferences. In this article, learn about the data encryption for each service both at rest and in transit.

> [!IMPORTANT]
> For production grade encryption during __training__, Microsoft recommends using Azure Machine Learning compute cluster. For production grade encryption during __inference__, Microsoft recommends using Azure Kubernetes Service.
>
> Azure Machine Learning compute instance is a dev/test environment. When using it, we recommend that you store your files, such as notebooks and scripts, in a file share. Your data should be stored in a datastore.

## Encryption at rest

Azure Machine Learning end to end projects integrates with services like Azure Blob Storage, Azure Cosmos DB, Azure SQL Database etc. The article describes encryption method of such services.

### Azure Blob storage

Azure Machine Learning stores snapshots, output, and logs in the Azure Blob storage account (default storage account) that's tied to the Azure Machine Learning workspace and your subscription. All the data stored in Azure Blob storage is encrypted at rest with Microsoft-managed keys.

For information on how to use your own keys for data stored in Azure Blob storage, see [Azure Storage encryption with customer-managed keys in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

Training data is typically also stored in Azure Blob storage so that it's accessible to training compute targets. This storage isn't managed by Azure Machine Learning but mounted to compute targets as a remote file system.

If you need to __rotate or revoke__ your key, you can do so at any time. When rotating a key, the storage account will start using the new key (latest version) to encrypt data at rest. When revoking (disabling) a key, the storage account takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.

For information on regenerating the access keys, see [Regenerate storage access keys](how-to-change-storage-access-key.md).

### Azure Data Lake Storage

[!INCLUDE [Note](../../includes/data-lake-storage-gen1-rename-note.md)]

**ADLS Gen2**
Azure Data Lake Storage Gen 2 is built on top of Azure Blob Storage and is designed for enterprise big data analytics. ADLS Gen2 is used as a datastore for Azure Machine Learning. Same as Azure Blob Storage the data at rest is encrypted with Microsoft-managed keys.

For information on how to use your own keys for data stored in Azure Data Lake Storage, see [Azure Storage encryption with customer-managed keys in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

### Azure Relational Databases

Azure Machine Learning services support data from different data sources such as Azure SQL Database, Azure PostgreSQL and Azure MYSQL. 

**Azure SQL Database**
Transparent Data Encryption protects Azure SQL Database against threat of malicious offline activity by encrypting data at rest. By default, TDE is enabled for all newly deployed SQL Databases with Microsoft managed keys.

For information on how to use customer managed keys for transparent data encryption, see [Azure SQL Database Transparent Data Encryption](/azure/azure-sql/database/transparent-data-encryption-tde-overview) . 

**Azure Database for PostgreSQL**
Azure PostgreSQL uses Azure Storage encryption to encrypt data at rest by default using Microsoft managed keys. It is similar to Transparent Data Encryption (TDE) in other databases such as SQL Server.

For information on how to use customer managed keys for transparent data encryption, see [Azure Database for PostgreSQL Single server data encryption with a customer-managed key](../postgresql/single-server/concepts-data-encryption-postgresql.md).

**Azure Database for MySQL**
Azure Database for MySQL is a relational database service in the Microsoft cloud based on the MySQL Community Edition database engine. The Azure Database for MySQL service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. 

To encrypt data using customer managed keys, see [Azure Database for MySQL data encryption with a customer-managed key](../mysql/single-server/concepts-data-encryption-mysql.md) .


### Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. This instance is associated with a Microsoft subscription managed by Azure Machine Learning. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

When using your own (customer-managed) keys to encrypt the Azure Cosmos DB instance, a Microsoft managed Azure Cosmos DB instance is created in your subscription. This instance is created in a Microsoft-managed resource group, which is different than the resource group for your workspace. For more information, see [Customer-managed keys](concept-customer-managed-keys.md).

### Azure Container Registry

All container images in your registry (Azure Container Registry) are encrypted at rest. Azure automatically encrypts an image before storing it and decrypts it when Azure Machine Learning pulls the image.

To use customer-managed keys to encrypt your Azure Container Registry, you need to create your own ACR and attach it while provisioning the workspace. You can encrypt the default instance that gets created at the time of workspace provisioning.

> [!IMPORTANT]
> Azure Machine Learning requires the admin account be enabled on your Azure Container Registry. By default, this setting is disabled when you create a container registry. For information on enabling the admin account, see [Admin account](../container-registry/container-registry-authentication.md#admin-account).
>
> Once an Azure Container Registry has been created for a workspace, do not delete it. Doing so will break your Azure Machine Learning workspace.

For an example of creating a workspace using an existing Azure Container Registry, see the following articles:

* [Create a workspace for Azure Machine Learning with Azure CLI](how-to-manage-workspace-cli.md).
* [Create a workspace with Python SDK](how-to-manage-workspace.md?tabs=python#create-a-workspace).
* [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md)

:::moniker range="azureml-api-1"
### Azure Container Instance

> [!IMPORTANT]
> Deployments to ACI rely on the Azure Machine Learning Python SDK and CLI v1.

You may encrypt a deployed Azure Container Instance (ACI) resource using customer-managed keys. The customer-managed key used for ACI can be stored in the Azure Key Vault for your workspace. For information on generating a key, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#generate-a-new-key).

[!INCLUDE [sdk v1](includes/machine-learning-sdk-v1.md)]

To use the key when deploying a model to Azure Container Instance, create a new deployment configuration using `AciWebservice.deploy_configuration()`. Provide the key information using the following parameters:

* `cmk_vault_base_url`: The URL of the key vault that contains the key.
* `cmk_key_name`: The name of the key.
* `cmk_key_version`: The version of the key.

For more information on creating and using a deployment configuration, see the following articles:

* [AciWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-) reference

* [Where and how to deploy](./v1/how-to-deploy-and-where.md)

For more information on using a customer-managed key with ACI, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md).
:::moniker-end

### Azure Kubernetes Service

You may encrypt a deployed Azure Kubernetes Service resource using customer-managed keys at any time. For more information, see [Bring your own keys with Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). 

This process allows you to encrypt both the Data and the OS Disk of the deployed virtual machines in the Kubernetes cluster.

> [!IMPORTANT]
> This process only works with AKS K8s version 1.17 or higher. Azure Machine Learning added support for AKS 1.17 on Jan 13, 2020.

### Machine Learning Compute

**Compute cluster**
The OS disk for each compute node stored in Azure Storage is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. This compute target is ephemeral, and clusters are typically scaled down when no jobs are queued. The underlying virtual machine is de-provisioned, and the OS disk is deleted. Azure Disk Encryption is not enabled for workspaces by default. If the workspace was created with the `hbi_workspace` parameter set to `TRUE`, then the OS disk is encrypted. 

Each virtual machine also has a local temporary disk for OS operations. If you want, you can use the disk to stage training data. If the workspace was created with the `hbi_workspace` parameter set to `TRUE`, the temporary disk is encrypted. This environment is short-lived (only during your job,) and encryption support is limited to system-managed keys only.

Managed online endpoint and batch endpoint use machine learning compute in the backend, and follows the same encryption mechanism.

**Compute instance**
The OS disk for compute instance is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. If the workspace was created with the `hbi_workspace` parameter set to `TRUE`, the local OS and temporary disks on compute instance are encrypted with Microsoft managed keys. Customer managed key encryption is not supported for OS and temporary disks.

For more information, see [Customer-managed keys](concept-customer-managed-keys.md).

### Azure Data Factory

The Azure Data Factory pipeline is used to ingest data for use with Azure Machine Learning. Azure Data Factory encrypts data at rest, including entity definitions and any data cached while runs are in progress. By default, data is encrypted with a randomly generated Microsoft-managed key that is uniquely assigned to your data factory. 

For information on how to use customer managed keys for encryption use [Encrypt Azure Data Factory with customer managed keys](../data-factory/enable-customer-managed-key.md) .


### Azure Databricks

Azure Databricks can be used in Azure Machine Learning pipelines. By default, the Databricks File System (DBFS) used by Azure Databricks is encrypted using a Microsoft-managed key. To configure Azure Databricks to use customer-managed keys, see [Configure customer-managed keys on default (root) DBFS](/azure/databricks/security/customer-managed-keys-dbfs).

### Microsoft-generated data

When using services such as Automated Machine Learning, Microsoft may generate a transient, pre-processed data for training multiple models. This data is stored in a datastore in your workspace, which allows you to enforce access controls and encryption appropriately.

You may also want to encrypt [diagnostic information logged from your deployed endpoint](how-to-enable-app-insights.md) into your Azure Application Insights instance.

## Encryption in transit

Azure Machine Learning uses TLS to secure internal communication between various Azure Machine Learning microservices. All Azure Storage access also occurs over a secure channel.

:::moniker range="azureml-api-1"
To secure external calls made to the scoring endpoint, Azure Machine Learning uses TLS. For more information, see [Use TLS to secure a web service through Azure Machine Learning](./v1/how-to-secure-web-service.md).
:::moniker-end

## Data collection and handling

### Microsoft collected data

Microsoft may collect non-user identifying information like resource names (for example the dataset name, or the machine learning experiment name), or job environment variables for diagnostic purposes. All such data is stored using Microsoft-managed keys in storage hosted in Microsoft owned subscriptions and follows [Microsoft's standard Privacy policy and data handling standards](https://privacy.microsoft.com/privacystatement). This data is kept within the same region as your workspace.

Microsoft also recommends not storing sensitive information (such as account key secrets) in environment variables. Environment variables are logged, encrypted, and stored by us. Similarly when naming your jobs, avoid including sensitive information such as user names or secret project names. This information may appear in telemetry logs accessible to Microsoft Support engineers.

You may opt out from diagnostic data being collected by setting the `hbi_workspace` parameter to `TRUE` while provisioning the workspace. This functionality is supported when using the Azure Machine Learning Python SDK, the Azure CLI, REST APIs, or Azure Resource Manager templates.

## Using Azure Key Vault

Azure Machine Learning uses the Azure Key Vault instance associated with the workspace to store credentials of various kinds:

* The associated storage account connection string
* Passwords to Azure Container Repository instances
* Connection strings to data stores

SSH passwords and keys to compute targets like Azure HDInsight and VMs are stored in a separate key vault that's associated with the Microsoft subscription. Azure Machine Learning doesn't store any passwords or keys provided by users. Instead, it generates, authorizes, and stores its own SSH keys to connect to VMs and HDInsight to run the experiments.

Each workspace has an associated system-assigned managed identity that has the same name as the workspace. This managed identity has access to all keys, secrets, and certificates in the key vault.

## Next steps

:::moniker range="azureml-api-2"
* [Use datastores](how-to-datastore.md)
* [Create data assets](how-to-create-data-assets.md)
* [Access data in a training job](how-to-read-write-data-v2.md)
:::moniker-end
:::moniker range="azureml-api-1"
* [Connect to Azure storage](./v1/how-to-access-data.md)
* [Get data from a datastore](./v1/how-to-create-register-datasets.md)
* [Connect to data](v1/how-to-connect-data-ui.md)
* [Train with datasets](v1/how-to-train-with-datasets.md)
:::moniker-end
* [Customer-managed keys](concept-customer-managed-keys.md)
