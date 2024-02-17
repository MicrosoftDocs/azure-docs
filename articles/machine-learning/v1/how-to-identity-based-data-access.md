---
title: Identity-based data access to storage services (v1)
titleSuffix: Machine Learning
description: Learn how to use identity-based data access to connect to storage services on Azure with Azure Machine Learning datastores and the Machine Learning Python SDK v1.
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 02/16/2024
ms.custom: UpdateFrequency5, devx-track-python, data4ml
# Customer intent: As an experienced Python developer, I need to make my data in Azure Storage available to my compute for training my machine learning models.
---

# Connect to storage by using identity-based data access with SDK v1

In this article, you'll learn how to connect to storage services on Azure with identity-based data access and Azure Machine Learning datastores, via the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro).  

Typically, datastores use **credential-based authentication** to verify that you have permission to access the storage service. Datastores keep connection information, like your subscription ID and token authorization, in the [key vault](https://azure.microsoft.com/services/key-vault/) associated with the workspace. When you create a datastore that uses **identity-based data access**, your Azure account ([Microsoft Entra token](../../active-directory/fundamentals/active-directory-whatis.md)) is used to confirm that you have permission to access the storage service. In the **identity-based data access** scenario, no authentication credentials are saved. Only the storage account information is stored in the datastore.

To create datastores with **identity-based** data access via the Azure Machine Learning studio UI, see [Connect to data with the Azure Machine Learning studio](how-to-connect-data-ui.md#create-datastores).

To create datastores that use **credential-based** authentication, like access keys or service principals, see [Connect to storage services on Azure](how-to-access-data.md).

## Identity-based data access in Azure Machine Learning

You can apply identity-based data access in Azure Machine Learning in two scenarios. These scenarios are a good fit for identity-based access when you work with confidential data, and you need more granular data access management:

> [!WARNING]
> Identity-based data access is not supported for [automated ML experiments](../how-to-configure-auto-train.md).

- Accessing storage services
- Training machine learning models with private data

### Accessing storage services

You can connect to storage services via identity-based data access with Azure Machine Learning datastores or [Azure Machine Learning datasets](how-to-create-register-datasets.md).

Your authentication credentials are kept in a datastore, which ensures that you have permission to access the storage service. When these credentials are registered via datastores, any user with the workspace Reader role can retrieve them. That scale of access can be a security concern for some organizations. [Learn more about the workspace Reader role](../how-to-assign-roles.md#default-roles).

When you use identity-based data access, Azure Machine Learning prompts you for your Microsoft Entra token for data access authentication, instead of keeping your credentials in the datastore. That approach allows for data access management at the storage level, and maintains credential security.

The same behavior applies when you:

* [Create a dataset directly from storage URLs](#use-data-in-storage). 
* Work with data interactively via a Jupyter Notebook on your local computer or [compute instance](../concept-compute-instance.md).

> [!NOTE]
> Credentials stored via credential-based authentication include subscription IDs, shared access signature (SAS) tokens, and storage access key and service principal information, like client IDs and tenant IDs.

### Model training on private data

Certain machine learning scenarios involve training models with private data. In such cases, data scientists need to run training workflows without exposure to the confidential input data. In this scenario, a [managed identity](how-to-use-managed-identities.md) of the training compute authenticates data access. This approach allows storage admins to grant Storage Blob Data Reader access to the managed identity that the training compute uses to run the training job. The individual data scientists don't need to be granted access. For more information, visit [Set up managed identity on a compute cluster](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- An Azure storage account with a supported storage type. These storage types are supported:
    - [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md)
    - [Azure Data Lake Storage Gen1](../../data-lake-store/index.yml)
    - [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)
    - [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install).

- An Azure Machine Learning workspace.
  
  Either [create an Azure Machine Learning workspace](../how-to-manage-workspace.md) or use an [existing one via the Python SDK](../how-to-manage-workspace.md#connect-to-a-workspace).

## Create and register datastores

When you register a storage service on Azure as a datastore, you automatically create and register that datastore to a specific workspace. See [Storage access permissions](#storage-access-permissions) for guidance on required permission types. You can also manually create the storage to which you want to connect without any special permissions, and you just need the name.

See [Work with virtual networks](#work-with-virtual-networks) for details on how to connect to data storage behind virtual networks.

In the following code, notice the absence of authentication parameters like `sas_token`, `account_key`, `subscription_id`, and the service principal `client_id`. This omission indicates that Azure Machine Learning uses identity-based data access for authentication. Creation of datastores typically happens interactively in a notebook or via the studio. The data access authentication uses your Microsoft Entra token.

> [!NOTE]
> Datastore names should consist only of lowercase letters, numbers, and underscores.

### Azure blob container

To register an Azure blob container as a datastore, use [`register_azure_blob_container()`](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-blob-container).

The following code creates the `credentialless_blob` datastore, registers it to the `ws` workspace, and assigns it to the `blob_datastore` variable. This datastore accesses the `my_container_name` blob container on the `my-account-name` storage account.

```Python
# Create blob datastore without credentials.
blob_datastore = Datastore.register_azure_blob_container(workspace=ws,
                                                      datastore_name='credentialless_blob',
                                                      container_name='my_container_name',
                                                      account_name='my_account_name')
```

### Azure Data Lake Storage Gen1

Use [register_azure_data_lake()](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-data-lake) to register a datastore that connects to Azure Data Lake Storage Gen1.

The following code creates the `credentialless_adls1` datastore, registers it to the `workspace` workspace, and assigns it to the `adls_dstore` variable. This datastore accesses the `adls_storage` Azure Data Lake Storage account.

```Python
# Create Azure Data Lake Storage Gen1 datastore without credentials.
adls_dstore = Datastore.register_azure_data_lake(workspace = workspace,
                                                 datastore_name='credentialless_adls1',
                                                 store_name='adls_storage')

```

### Azure Data Lake Storage Gen2

Use [register_azure_data_lake_gen2()](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-data-lake-gen2) to register a datastore that connects to Azure Data Lake Storage Gen2.

The following code creates the `credentialless_adls2` datastore, registers it to the `ws` workspace, and assigns it to the `adls2_dstore` variable. This datastore accesses the file system `tabular` in the `myadls2` storage account.  

```python
# Create Azure Data Lake Storage Gen2 datastore without credentials.
adls2_dstore = Datastore.register_azure_data_lake_gen2(workspace=ws, 
                                                       datastore_name='credentialless_adls2', 
                                                       filesystem='tabular', 
                                                       account_name='myadls2')
```

### Azure SQL database

For an Azure SQL database, use [register_azure_sql_database()](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-sql-database) to register a datastore that connects to an Azure SQL database storage.

The following code creates and registers the `credentialless_sqldb` datastore to the `ws` workspace and assigns it to the variable, `sqldb_dstore`. This datastore accesses the database `mydb` in the `myserver` SQL DB server.  

```python
# Create a sqldatabase datastore without credentials
                                                       
sqldb_dstore = Datastore.register_azure_sql_database(workspace=ws,
                                                       datastore_name='credentialless_sqldb',
                                                       server_name='myserver',
                                                       database_name='mydb')                                                       
                                                   
```

## Storage access permissions

To ensure that you securely connect to your storage service on Azure, Azure Machine Learning requires that you have permission to access the corresponding data storage. 
> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If cross tenant access is needed for your scenario, please reach out to the Azure Machine Learning Data Support team alias at  amldatasupport@microsoft.com for assistance with a custom code solution.

Identity-based data access supports connections to **only** the following storage services.

* Azure Blob Storage
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2
* Azure SQL Database

To access these storage services, you must have at least [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../../storage/blobs/assign-azure-role-data-access.md).

If you prefer to not use your user identity (Microsoft Entra ID), you can also grant a workspace managed-system identity (MSI) permission to create the datastore. To do so, you must have Owner permissions to the storage account, and you must add the `grant_workspace_access= True` parameter to your data register method.

If you train a model on a remote compute target and you want to access the data for training, the compute identity must be granted at least the Storage Blob Data Reader role from the storage service. Learn how to [set up managed identity on a compute cluster](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

## Work with virtual networks

By default, Azure Machine Learning can't communicate with a storage account located behind a firewall, or in a virtual network.

You can configure storage accounts to allow access only from within specific virtual networks. This configuration requires more steps, to ensure that data doesn't leak outside of the network. This behavior is the same for credential-based data access. For more information, see [How to configure virtual network scenarios](how-to-access-data.md#virtual-network).

If your storage account has virtual network settings, they dictate the needed identity type and permissions access. For example for data preview and data profile, the virtual network settings determine what type of identity is used to authenticate data access.

* In scenarios where only certain IPs and subnets are allowed to access the storage, then Azure Machine Learning uses the workspace MSI to accomplish data previews and profiles.

* If your storage is ADLS Gen 2 or Blob and has virtual network settings, customers can use either user identity or workspace MSI depending on the datastore settings defined during creation.

* If the virtual network setting is “Allow Azure services on the trusted services list to access this storage account”, then Workspace MSI is used.

## Use data in storage

We recommend that you use [Azure Machine Learning datasets](how-to-create-register-datasets.md) when you interact with your data in storage with Azure Machine Learning.  

> [!IMPORTANT]
> Datasets using identity-based data access are not supported for [automated ML experiments](../how-to-configure-auto-train.md).

Datasets package your data into a lazily evaluated consumable object for machine learning tasks like training. Also, with datasets you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) files of any format from Azure storage services like Azure Blob Storage and Azure Data Lake Storage to a compute target.

To create a dataset, you can reference paths from datastores that also use identity-based data access.

* If your underlying storage account type is Blob or ADLS Gen 2, your user identity needs the Blob Reader role.
* If your underlying storage is ADLS Gen 1, you can set permissions via the storage's Access Control List (ACL).

In the following example, `blob_datastore` already exists and uses identity-based data access.

```python
blob_dataset = Dataset.Tabular.from_delimited_files(blob_datastore,'test.csv') 
```

You can also skip datastore creation, and create datasets directly from storage URLs. This functionality currently supports only Azure blobs and Azure Data Lake Storage Gen1 and Gen2. For creation based on storage URL, only the user identity is needed to authenticate.

```python
blob_dset = Dataset.File.from_files('https://myblob.blob.core.windows.net/may/keras-mnist-fashion/')
```

When you submit a training job that consumes a dataset created with identity-based data access, the training compute managed identity is used for data access authentication. Your Microsoft Entra token isn't used. For this scenario, ensure that the managed identity of the compute is granted at least the Storage Blob Data Reader role from the storage service. For more information, see [Set up managed identity on compute clusters](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

## Next steps

* [Create an Azure Machine Learning dataset](how-to-create-register-datasets.md)
* [Train with datasets](how-to-train-with-datasets.md)
* [Create a datastore with key-based data access](how-to-access-data.md)