---
title: Identity-based data access to storage services (v1)
titleSuffix: Machine Learning
description: Learn how to use identity-based data access to connect to storage services on Azure with Azure Machine Learning datastores and the Machine Learning Python SDK v1.   
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: nibaccam
ms.date: 01/25/2022
ms.custom: contperf-fy21q1, devx-track-python, data4ml

# Customer intent: As an experienced Python developer, I need to make my data in Azure Storage available to my compute for training my machine learning models.
---

# Connect to storage by using identity-based data access with SDK v1

In this article, you learn how to connect to storage services on Azure by using identity-based data access and Azure Machine Learning datastores via the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro).  

Typically, datastores use **credential-based authentication** to confirm you have permission to access the storage service. They keep connection information, like your subscription ID and token authorization, in the [key vault](https://azure.microsoft.com/services/key-vault/) that's associated with the workspace. When you create a datastore that uses **identity-based data access**, your Azure account ([Azure Active Directory token](../../active-directory/fundamentals/active-directory-whatis.md)) is used to confirm you have permission to access the storage service. In the **identity-based data access** scenario, no authentication credentials are saved. Only the storage account information is stored in the datastore. 
 
To create datastores with **identity-based** data access via the Azure Machine Learning studio UI, see [Connect to data with the Azure Machine Learning studio](how-to-connect-data-ui.md#create-datastores).

To create datastores that use **credential-based** authentication, like access keys or service principals, see [Connect to storage services on Azure](how-to-access-data.md).

## Identity-based data access in Azure Machine Learning

There are two scenarios in which you can apply identity-based data access in Azure Machine Learning. These scenarios are a good fit for identity-based access when you're working with confidential data and need more granular data access management:

> [!WARNING]
> Identity-based data access is not supported for [automated ML experiments](../how-to-configure-auto-train.md).

- Accessing storage services
- Training machine learning models with private data

### Accessing storage services

You can connect to storage services via identity-based data access with Azure Machine Learning datastores or [Azure Machine Learning datasets](how-to-create-register-datasets.md). 

Your authentication credentials are usually kept in a datastore, which is used to ensure you have permission to access the storage service. When these credentials are registered via datastores, any user with the workspace Reader role can retrieve them. That scale of access can be a security concern for some organizations. [Learn more about the workspace Reader role.](../how-to-assign-roles.md#default-roles) 

When you use identity-based data access, Azure Machine Learning prompts you for your Azure Active Directory token for data access authentication instead of keeping your credentials in the datastore. That approach allows for data access management at the storage level and keeps credentials confidential. 

The same behavior applies when you:

* [Create a dataset directly from storage URLs](#use-data-in-storage). 
* Work with data interactively via a Jupyter Notebook on your local computer or [compute instance](../concept-compute-instance.md).

> [!NOTE]
> Credentials stored via credential-based authentication include subscription IDs, shared access signature (SAS) tokens, and storage access key and service principal information, like client IDs and tenant IDs.

### Model training on private data

Certain machine learning scenarios involve training models with private data. In such cases, data scientists need to run training workflows without being exposed to the confidential input data. In this scenario, a [managed identity](how-to-use-managed-identities.md) of the training compute is used for data access authentication. This approach allows storage admins to grant Storage Blob Data Reader access to the managed identity that the training compute uses to run the training job. The individual data scientists don't need to be granted access. For more information, see [Set up managed identity on a compute cluster](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

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

When you register a storage service on Azure as a datastore, you automatically create and register that datastore to a specific workspace. See [Storage access permissions](#storage-access-permissions) for guidance on required permission types. You also have the option to manually create the storage you want to connect to without any special permissions, and you just need the name.

See [Work with virtual networks](#work-with-virtual-networks) for details on how to connect to data storage behind virtual networks.

In the following code, notice the absence of authentication parameters like `sas_token`, `account_key`, `subscription_id`, and the service principal `client_id`. This omission indicates that Azure Machine Learning will use identity-based data access for authentication. Creation of datastores typically happens interactively in a notebook or via the studio. So your Azure Active Directory token is used for data access authentication.

> [!NOTE]
> Datastore names should consist only of lowercase letters, numbers, and underscores. 

### Azure blob container

To register an Azure blob container as a datastore, use [`register_azure_blob_container()`](/python/api/azureml-core/azureml.core.datastore%28class%29#register-azure-blob-container-workspace--datastore-name--container-name--account-name--sas-token-none--account-key-none--protocol-none--endpoint-none--overwrite-false--create-if-not-exists-false--skip-validation-false--blob-cache-timeout-none--grant-workspace-access-false--subscription-id-none--resource-group-none-).

The following code creates the `credentialless_blob` datastore, registers it to the `ws` workspace, and assigns it to the `blob_datastore` variable. This datastore accesses the `my_container_name` blob container on the `my-account-name` storage account.

```Python
# Create blob datastore without credentials.
blob_datastore = Datastore.register_azure_blob_container(workspace=ws,
                                                      datastore_name='credentialless_blob',
                                                      container_name='my_container_name',
                                                      account_name='my_account_name')
```

### Azure Data Lake Storage Gen1

Use [register_azure_data_lake()](/python/api/azureml-core/azureml.core.datastore.datastore#register-azure-data-lake-workspace--datastore-name--store-name--tenant-id-none--client-id-none--client-secret-none--resource-url-none--authority-url-none--subscription-id-none--resource-group-none--overwrite-false--grant-workspace-access-false-) to register a datastore that connects to Azure Data Lake Storage Gen1.

The following code creates the `credentialless_adls1` datastore, registers it to the `workspace` workspace, and assigns it to the `adls_dstore` variable. This datastore accesses the `adls_storage` Azure Data Lake Storage account.

```Python
# Create Azure Data Lake Storage Gen1 datastore without credentials.
adls_dstore = Datastore.register_azure_data_lake(workspace = workspace,
                                                 datastore_name='credentialless_adls1',
                                                 store_name='adls_storage')

```

### Azure Data Lake Storage Gen2

Use [register_azure_data_lake_gen2()](/python/api/azureml-core/azureml.core.datastore.datastore#register-azure-data-lake-gen2-workspace--datastore-name--filesystem--account-name--tenant-id--client-id--client-secret--resource-url-none--authority-url-none--protocol-none--endpoint-none--overwrite-false-) to register a datastore that connects to Azure Data Lake Storage Gen2.

The following code creates the `credentialless_adls2` datastore, registers it to the `ws` workspace, and assigns it to the `adls2_dstore` variable. This datastore accesses the file system `tabular` in the `myadls2` storage account.  

```python
# Create Azure Data Lake Storage Gen2 datastore without credentials.
adls2_dstore = Datastore.register_azure_data_lake_gen2(workspace=ws, 
                                                       datastore_name='credentialless_adls2', 
                                                       filesystem='tabular', 
                                                       account_name='myadls2')
```

### Azure SQL database

For an Azure SQL database, use [register_azure_sql_database()](/python/api/azureml-core/azureml.core.datastore.datastore#register-azure-sql-database-workspace--datastore-name--server-name--database-name--tenant-id-none--client-id-none--client-secret-none--resource-url-none--authority-url-none--endpoint-none--overwrite-false--username-none--password-none--subscription-id-none--resource-group-none--grant-workspace-access-false----kwargs-) to register a datastore that connects to an Azure SQL database storage.

The following code creates and registers the `credentialless_sqldb` datastore to the `ws` workspace and assigns it to the variable, `sqldb_dstore`. This datastore accesses the database `mydb` in the `myserver` SQL DB server.  

```python
# Create a sqldatabase datastore without credentials
                                                       
sqldb_dstore = Datastore.register_azure_sql_database(workspace=ws,
                                                       datastore_name='credentialless_sqldb',
                                                       server_name='myserver',
                                                       database_name='mydb')                                                       
                                                   
```


## Storage access permissions

To help ensure that you securely connect to your storage service on Azure, Azure Machine Learning requires that you have permission to access the corresponding data storage. 
> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If cross tenant access is needed for your scenario, please reach out to the AzureML Data Support team alias at  amldatasupport@microsoft.com for assistance with a custom code solution.

Identity-based data access supports connections to **only** the following storage services.

* Azure Blob Storage
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2
* Azure SQL Database

To access these storage services, you must have at least [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../../storage/blobs/assign-azure-role-data-access.md). 

If you prefer to not use your user identity (Azure Active Directory), you also have the option to grant a workspace managed-system identity (MSI) permission to create the datastore. To do so, you must have Owner permissions to the storage account and add the `grant_workspace_access= True` parameter to your data register method. 

If you're training a model on a remote compute target and want to access the data for training, the compute identity must be granted at least the Storage Blob Data Reader role from the storage service. Learn how to [set up managed identity on a compute cluster](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

## Work with virtual networks

By default, Azure Machine Learning can't communicate with a storage account that's behind a firewall or in a virtual network.

You can configure storage accounts to allow access only from within specific virtual networks. This configuration requires additional steps to ensure data isn't leaked outside of the network. This behavior is the same for credential-based data access. For more information, see [How to configure virtual network scenarios](how-to-access-data.md#virtual-network). 

If your storage account has virtual network settings, that dictates what identity type and permissions access is needed. For example for data preview and data profile, the virtual network settings determine what type of identity is used to authenticate data access. 
 
* In scenarios where only certain IPs and subnets are allowed to access the storage, then Azure Machine Learning uses the workspace MSI to accomplish data previews and profiles.

* If your storage is ADLS Gen 2 or Blob and has virtual network settings, customers can use either user identity or workspace MSI depending on the datastore settings defined during creation. 

* If the virtual network setting is “Allow Azure services on the trusted services list to access this storage account”, then Workspace MSI is used. 

## Use data in storage

We recommend that you use [Azure Machine Learning datasets](how-to-create-register-datasets.md) when you interact with your data in storage with Azure Machine Learning.  

> [!IMPORTANT]
> Datasets using identity-based data access are not supported for [automated ML experiments](../how-to-configure-auto-train.md).

Datasets package your data into a lazily evaluated consumable object for machine learning tasks like training. Also, with datasets you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) files of any format from Azure storage services like Azure Blob Storage and Azure Data Lake Storage to a compute target.

To create a dataset, you can reference paths from datastores that also use identity-based data access . 

* If you're underlying storage account type is Blob or ADLS Gen 2, your user identity needs Blob Reader role. 
* If your underlying storage is ADLS Gen 1, permissions need can be set via the storage's Access Control List (ACL). 

In the following example, `blob_datastore` already exists and uses identity-based data access.   

```python
blob_dataset = Dataset.Tabular.from_delimited_files(blob_datastore,'test.csv') 
```

Another option is to skip datastore creation and create datasets directly from storage URLs. This functionality currently supports only Azure blobs and Azure Data Lake Storage Gen1 and Gen2. For creation based on storage URL, only the user identity is needed to authenticate.

```python
blob_dset = Dataset.File.from_files('https://myblob.blob.core.windows.net/may/keras-mnist-fashion/')
```

When you submit a training job that consumes a dataset created with identity-based data access, the managed identity of the training compute is used for data access authentication. Your Azure Active Directory token isn't used. For this scenario, ensure that the managed identity of the compute is granted at least the Storage Blob Data Reader role from the storage service. For more information, see [Set up managed identity on compute clusters](how-to-create-attach-compute-cluster.md#set-up-managed-identity). 

## Access data for training jobs on compute clusters (preview)

[!INCLUDE [cli v2](../../../includes/machine-learning-cli-v2.md)]

When training on [Azure Machine Learning compute clusters](how-to-create-attach-compute-cluster.md#what-is-a-compute-cluster), you can authenticate to storage with your Azure Active Directory token. 

This authentication mode allows you to: 
* Set up fine-grained permissions, where different workspace users can have access to different storage accounts or folders within storage accounts.
* Audit storage access because the storage logs show which identities were used to access data.

> [!IMPORTANT] 
> This functionality has the following limitations
> * Feature is only supported for experiments submitted via the [Azure Machine Learning CLI](../how-to-configure-cli.md)
> * Only CommandJobs, and PipelineJobs with CommandSteps and AutoMLSteps are supported 
> * User identity and compute managed identity cannot be used for authentication within same job.

> [!WARNING]
> This feature is __public preview__ and is __not secure for production workloads__. Ensure that only trusted users have permissions to access your workspace and storage accounts.
>
> Preview features are provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following steps outline how to set up identity-based data access for training jobs on compute clusters. 

1. Grant the user identity access to storage resources. For example,  grant StorageBlobReader access to the specific storage account you want to use or grant ACL-based permission to specific folders or files in Azure Data Lake Gen 2 storage.

1. Create an Azure Machine Learning datastore without cached credentials for the storage account. If a datastore has cached credentials, such as storage account key, those credentials are used instead of user identity.

1. Submit a training job with property **identity** set to **type: user_identity**, as shown in following job specification. During the training job, the authentication to storage happens via  the identity of the user that submits the job.

> [!NOTE] 
> If the **identity** property is left unspecified and datastore does not have cached credentials, then compute managed identity becomes the fallback option. 

```yaml
command: |
  echo "--census-csv: ${{inputs.census_csv}}"
  python hello-census.py --census-csv ${{inputs.census_csv}}
code: src
inputs:
  census_csv:
    type: uri_file 
    path: azureml://datastores/mydata/paths/census.csv
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
identity:
  type: user_identity
```

## Next steps

* [Create an Azure Machine Learning dataset](how-to-create-register-datasets.md)
* [Train with datasets](how-to-train-with-datasets.md)
* [Create a datastore with key-based data access](how-to-access-data.md)