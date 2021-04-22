---
title: Connect to  storage services on Azure
titleSuffix: Azure Machine Learning
description: Learn how to use datastores to securely connect to Azure storage services during training with Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: sihhu
author: MayMSFT
ms.reviewer: nibaccam
ms.date: 11/03/2020
ms.custom: how-to, contperf-fy21q1, devx-track-python, data4ml


# Customer intent: As an experienced Python developer, I need to make my data in Azure storage available to my remote compute to train my machine learning models.
---

# Connect to storage services on Azure

In this article, learn how to connect to data storage services on Azure with Azure Machine Learning datastores and the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).

Datastores securely connect to your storage service on Azure without putting your authentication credentials and the integrity of your original data source at risk. They store connection information, like your subscription ID and token authorization in your [Key Vault](https://azure.microsoft.com/services/key-vault/) that's associated with the workspace, so you can securely access your storage without having to hard code them in your scripts. You can create datastores that connect to [these Azure storage solutions](#matrix).

To understand where datastores fit in Azure Machine Learning's overall data access workflow, see  the [Securely access data](concept-data.md#data-workflow) article.

For a low code experience, see how to use the [Azure Machine Learning studio to create and register datastores](how-to-connect-data-ui.md#create-datastores).

>[!TIP]
> This article assumes you want to connect to your storage service with credential-based authentication credentials, like a service principal or a shared access signature (SAS) token. Keep in mind, if credentials are registered with datastores, all users with workspace *Reader* role are able to retrieve these credentials. [Learn more about workspace *Reader* role.](how-to-assign-roles.md#default-roles) <br><br>If this is a concern, learn how to [Connect to storage services with identity based access](how-to-identity-based-data-access.md). <br><br>This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time. 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

- An Azure storage account with a [supported storage type](#matrix).

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro).

- An Azure Machine Learning workspace.
  
  Either [create an Azure Machine Learning workspace](how-to-manage-workspace.md) or use an existing one via the Python SDK. 

    Import the `Workspace` and `Datastore` class, and load your subscription information from the file `config.json` using the function `from_config()`. This looks for the JSON file in the current directory by default, but you can also specify a path parameter to point to the file using `from_config(path="your/file/path")`.

   ```Python
   import azureml.core
   from azureml.core import Workspace, Datastore
        
   ws = Workspace.from_config()
   ```

    When you create a workspace, an Azure blob container and an Azure file share are automatically registered as datastores to the workspace. They're named `workspaceblobstore` and `workspacefilestore`, respectively. The `workspaceblobstore` is used to store workspace artifacts and your machine learning experiment logs. It's also set as the **default datastore** and can't be deleted from the workspace. The `workspacefilestore` is used to store notebooks and R scripts authorized via [compute instance](./concept-compute-instance.md#accessing-files).
    
    > [!NOTE]
    > Azure Machine Learning designer will create a datastore named **azureml_globaldatasets** automatically when you open a sample in the designer homepage. This datastore only contains sample datasets. Please **do not** use this datastore for any confidential data access.

<a name="matrix"></a>

## Supported data storage service types

Datastores currently support storing connection information to the storage services listed in the following matrix. 

> [!TIP]
> **For unsupported storage solutions**, and to save data egress cost during ML experiments, [move your data](#move) to a supported Azure storage solution. 

| Storage&nbsp;type | Authentication&nbsp;type | [Azure&nbsp;Machine&nbsp;Learning studio](https://ml.azure.com/) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; Python SDK](/python/api/overview/azure/ml/intro) |  [Azure&nbsp;Machine&nbsp;Learning CLI](reference-azure-machine-learning-cli.md) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; Rest API](/rest/api/azureml/) | VS Code
---|---|---|---|---|---|---
[Azure&nbsp;Blob&nbsp;Storage](../storage/blobs/storage-blobs-overview.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓ |✓
[Azure&nbsp;File&nbsp;Share](../storage/files/storage-files-introduction.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓|✓
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;1](../data-lake-store/index.yml)| Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;2](../storage/blobs/data-lake-storage-introduction.md)| Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;SQL&nbsp;Database](../azure-sql/database/sql-database-paas-overview.md)| SQL authentication <br>Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;PostgreSQL](../postgresql/overview.md) | SQL authentication| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;Database&nbsp;for&nbsp;MySQL](../mysql/overview.md) | SQL authentication|  | ✓* | ✓* |✓*|
[Databricks&nbsp;File&nbsp;System](/azure/databricks/data/databricks-file-system)| No authentication | | ✓** | ✓ ** |✓** |

\* MySQL is only supported for pipeline [DataTransferStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.datatransferstep)<br />
\*\* Databricks is only supported for pipeline [DatabricksStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricks_step.databricksstep)


### Storage guidance

We recommend creating a datastore for an [Azure Blob container](../storage/blobs/storage-blobs-introduction.md). Both standard and premium storage are available for blobs. Although premium storage is more expensive, its faster throughput speeds might improve the speed of your training runs, particularly if you train against a large dataset. For information about the cost of storage accounts, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service).

[Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is built on top of Azure Blob storage and designed for enterprise big data analytics. A fundamental part of Data Lake Storage Gen2 is the addition of a [hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md) to Blob storage. The hierarchical namespace organizes objects/files into a hierarchy of directories for efficient data access.

## Storage access and permissions

To ensure you securely connect to your Azure storage service, Azure Machine Learning  requires that you have permission to access the corresponding data storage container. This access depends on the authentication credentials used to register the datastore. 

### Virtual network 

By default, Azure Machine Learning cannot communicate with a storage account that is behind a firewall or within a virtual network. If your data storage account is in a **virtual network**, additional configuration steps are required to ensure Azure Machine Learning has access to your data. 

> [!NOTE]
> This guidance also applies to [datastores created with identity-based data access (preview)](how-to-identity-based-data-access.md). 

**For Python SDK users**, to access your data via your training script on a compute target, the compute target needs to be inside the same virtual network and subnet of the storage.  

**For Azure Machine Learning studio users**, several features rely on the ability to read data from a dataset; such as dataset previews, profiles and automated machine learning. For these features to work with storage behind virtual networks, use a [workspace managed identity in the studio](how-to-enable-studio-virtual-network.md) to allow Azure Machine Learning to access the storage account from outside the virtual network. 

Azure Machine Learning can receive requests from clients outside of the virtual network. To ensure that the entity requesting data from the service is safe, [set up Azure Private Link for your workspace](how-to-configure-private-link.md).

### Access validation

**As part of the initial datastore creation and registration process**, Azure Machine Learning automatically validates that the underlying storage service exists and the user provided principal (username, service principal, or SAS token) has access to the specified storage.

**After datastore creation**, this validation is only performed for methods that require access to the underlying storage container, **not** each time datastore objects are retrieved. For example, validation happens if you want to download files from your datastore; but if you just want to change your default datastore, then validation does not happen.

To authenticate your access to the underlying storage service, you can provide either your account key, shared access signatures (SAS) tokens, or service principal in the corresponding `register_azure_*()` method of the datastore type you want to create. The [storage type matrix](#matrix) lists the supported authentication types that correspond to each datastore type.

You can find account key, SAS token, and service principal information on your [Azure portal](https://portal.azure.com).

* If you plan to use an account key or SAS token for authentication, select **Storage Accounts** on the left pane, and choose the storage account that you want to register. 
  * The **Overview** page provides information such as the account name, container, and file share name. 
      1. For account keys, go to **Access keys** on the **Settings** pane. 
      1. For SAS tokens, go to **Shared access signatures** on the **Settings** pane.

* If you plan to use a service principal for authentication, go to your **App registrations** and select which app you want to use. 
    * Its corresponding **Overview** page will contain required information like tenant ID and client ID.

> [!IMPORTANT]
> * If you need to change your access keys for an Azure Storage account (account key or SAS token), be sure to sync the new credentials with your workspace and the datastores connected to it. Learn how to [sync your updated credentials](how-to-change-storage-access-key.md). 
### Permissions

For Azure blob container and Azure Data Lake Gen 2 storage, make sure your authentication credentials have **Storage Blob Data Reader** access. Learn more about [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader). An account SAS token defaults to no permissions. 
* For data **read access**, your authentication credentials must have a minimum of list and read permissions for containers and objects. 

* For data **write access**, write and add permissions also are required.

<a name="python"></a>

## Create and register datastores

When you register an Azure storage solution as a datastore, you automatically create and register that datastore to a specific workspace. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

Within this section are examples for how to create and register a datastore via the Python SDK for the following storage types. The parameters provided in these examples are the **required parameters** to create and register a datastore.

* [Azure blob container](#azure-blob-container)
* [Azure file share](#azure-file-share)
* [Azure Data Lake Storage Generation 2](#azure-data-lake-storage-generation-2)

 To create datastores for other supported storage services, see the [reference documentation for the applicable `register_azure_*` methods](/python/api/azureml-core/azureml.core.datastore.datastore#methods).

If you prefer a low code experience, see [Connect to data with Azure Machine Learning studio](how-to-connect-data-ui.md).
>[!IMPORTANT]
> If you unregister and re-register a datastore with the same name, and it fails, the Azure Key Vault for your workspace may not have soft-delete enabled. By default, soft-delete is enabled for the key vault instance created by your workspace, but it may not be enabled if you used an existing key vault or have a workspace created prior to October 2020. For information on how to enable soft-delete, see [Turn on Soft Delete for an existing key vault]( https://docs.microsoft.com/azure/key-vault/general/soft-delete-change#turn-on-soft-delete-for-an-existing-key-vault).”

> [!NOTE]
> Datastore name should only consist of lowercase letters, digits and underscores. 

### Azure blob container

To register an Azure blob container as a datastore, use [`register_azure_blob_container()`](/python/api/azureml-core/azureml.core.datastore%28class%29#register-azure-blob-container-workspace--datastore-name--container-name--account-name--sas-token-none--account-key-none--protocol-none--endpoint-none--overwrite-false--create-if-not-exists-false--skip-validation-false--blob-cache-timeout-none--grant-workspace-access-false--subscription-id-none--resource-group-none-).

The following code creates and registers the `blob_datastore_name` datastore to the `ws` workspace. This datastore accesses the `my-container-name` blob container on the `my-account-name` storage account, by using the provided account access key. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```Python
blob_datastore_name='azblobsdk' # Name of the datastore to workspace
container_name=os.getenv("BLOB_CONTAINER", "<my-container-name>") # Name of Azure blob container
account_name=os.getenv("BLOB_ACCOUNTNAME", "<my-account-name>") # Storage account name
account_key=os.getenv("BLOB_ACCOUNT_KEY", "<my-account-key>") # Storage account access key

blob_datastore = Datastore.register_azure_blob_container(workspace=ws, 
                                                         datastore_name=blob_datastore_name, 
                                                         container_name=container_name, 
                                                         account_name=account_name,
                                                         account_key=account_key)
```

### Azure file share

To register an Azure file share as a datastore, use [`register_azure_file_share()`](/python/api/azureml-core/azureml.core.datastore%28class%29#register-azure-file-share-workspace--datastore-name--file-share-name--account-name--sas-token-none--account-key-none--protocol-none--endpoint-none--overwrite-false--create-if-not-exists-false--skip-validation-false-). 

The following code creates and registers the `file_datastore_name` datastore to the `ws` workspace. This datastore accesses the `my-fileshare-name` file share on the `my-account-name` storage account, by using the provided account access key. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```Python
file_datastore_name='azfilesharesdk' # Name of the datastore to workspace
file_share_name=os.getenv("FILE_SHARE_CONTAINER", "<my-fileshare-name>") # Name of Azure file share container
account_name=os.getenv("FILE_SHARE_ACCOUNTNAME", "<my-account-name>") # Storage account name
account_key=os.getenv("FILE_SHARE_ACCOUNT_KEY", "<my-account-key>") # Storage account access key

file_datastore = Datastore.register_azure_file_share(workspace=ws,
                                                     datastore_name=file_datastore_name, 
                                                     file_share_name=file_share_name, 
                                                     account_name=account_name,
                                                     account_key=account_key)
```

### Azure Data Lake Storage Generation 2

For an Azure Data Lake Storage Generation 2 (ADLS Gen 2) datastore, use [register_azure_data_lake_gen2()](/python/api/azureml-core/azureml.core.datastore.datastore#register-azure-data-lake-gen2-workspace--datastore-name--filesystem--account-name--tenant-id--client-id--client-secret--resource-url-none--authority-url-none--protocol-none--endpoint-none--overwrite-false-) to register a credential datastore connected to an Azure DataLake Gen 2 storage with [service principal permissions](../active-directory/develop/howto-create-service-principal-portal.md).  

In order to utilize your service principal, you need to [register your application](../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). Learn more about [access control set up for ADLS Gen 2](../storage/blobs/data-lake-storage-access-control-model.md). 

The following code creates and registers the `adlsgen2_datastore_name` datastore to the `ws` workspace. This datastore accesses the file system `test` in the `account_name` storage account, by using the provided service principal credentials. 
Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```python 
adlsgen2_datastore_name = 'adlsgen2datastore'

subscription_id=os.getenv("ADL_SUBSCRIPTION", "<my_subscription_id>") # subscription id of ADLS account
resource_group=os.getenv("ADL_RESOURCE_GROUP", "<my_resource_group>") # resource group of ADLS account

account_name=os.getenv("ADLSGEN2_ACCOUNTNAME", "<my_account_name>") # ADLS Gen2 account name
tenant_id=os.getenv("ADLSGEN2_TENANT", "<my_tenant_id>") # tenant id of service principal
client_id=os.getenv("ADLSGEN2_CLIENTID", "<my_client_id>") # client id of service principal
client_secret=os.getenv("ADLSGEN2_CLIENT_SECRET", "<my_client_secret>") # the secret of service principal

adlsgen2_datastore = Datastore.register_azure_data_lake_gen2(workspace=ws,
                                                             datastore_name=adlsgen2_datastore_name,
                                                             account_name=account_name, # ADLS Gen2 account name
                                                             filesystem='test', # ADLS Gen2 filesystem
                                                             tenant_id=tenant_id, # tenant id of service principal
                                                             client_id=client_id, # client id of service principal
                                                             client_secret=client_secret) # the secret of service principal
```



## Create datastores with other Azure tools
In addition to creating datastores with the Python SDK and the studio, you can also use Azure Resource Manager templates or the Azure Machine Learning VS Code extension. 

<a name="arm"></a>
### Azure Resource Manager

There are a number of templates at [https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-datastore-create-*](https://github.com/Azure/azure-quickstart-templates/tree/master/) that can be used to create datastores.

For information on using these templates, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

### VS Code extension

If you prefer to create and manage datastores using the Azure Machine Learning VS Code extension, visit the [VS Code resource management how-to guide](how-to-manage-resources-vscode.md#datastores) to learn more.
<a name="train"></a>
## Use data in your datastores

After you create a datastore, [create an Azure Machine Learning dataset](how-to-create-register-datasets.md) to interact with your data. Datasets package your data into a lazily evaluated consumable object for machine learning tasks, like training. 

With datasets, you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) files of any format from Azure storage services for model training on a compute target. [Learn more about how to train ML models with datasets](how-to-train-with-datasets.md).

<a name="get"></a>

## Get datastores from your workspace

To get a specific datastore registered in the current workspace, use the [`get()`](/python/api/azureml-core/azureml.core.datastore%28class%29#get-workspace--datastore-name-) static method on the `Datastore` class:

```Python
# Get a named datastore from the current workspace
datastore = Datastore.get(ws, datastore_name='your datastore name')
```
To get the list of datastores registered with a given workspace, you can use the [`datastores`](/python/api/azureml-core/azureml.core.workspace%28class%29#datastores) property on a workspace object:

```Python
# List all datastores registered in the current workspace
datastores = ws.datastores
for name, datastore in datastores.items():
    print(name, datastore.datastore_type)
```

To get the workspace's default datastore, use this line:

```Python
datastore = ws.get_default_datastore()
```
You can also change the default datastore with the following code. This ability is only supported via the SDK. 

```Python
 ws.set_default_datastore(new_default_datastore)
```

## Access data during scoring

Azure Machine Learning provides several ways to use your models for scoring. Some of these methods don't provide access to datastores. Use the following table to understand which methods allow you to access datastores during scoring:

| Method | Datastore access | Description |
| ----- | :-----: | ----- |
| [Batch prediction](./tutorial-pipeline-batch-scoring-classification.md) | ✔ | Make predictions on large quantities of data asynchronously. |
| [Web service](how-to-deploy-and-where.md) | &nbsp; | Deploy models as a web service. |
| [Azure IoT Edge module](how-to-deploy-and-where.md) | &nbsp; | Deploy models to IoT Edge devices. |

For situations where the SDK doesn't provide access to datastores, you might be able to create custom code by using the relevant Azure SDK to access the data. For example, the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python) is a client library that you can use to access data stored in blobs or files.

<a name="move"></a>

## Move data to supported Azure storage solutions

Azure Machine Learning supports accessing data from Azure Blob storage, Azure Files, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, Azure SQL Database, and Azure Database for PostgreSQL. If you're using unsupported storage, we recommend that you move your data to supported Azure storage solutions by using [Azure Data Factory and these steps](../data-factory/quickstart-create-data-factory-copy-data-tool.md). Moving data to supported storage can help you save data egress costs during machine learning experiments. 

Azure Data Factory provides efficient and resilient data transfer with more than 80 prebuilt connectors at no additional cost. These connectors include Azure data services, on-premises data sources, Amazon S3 and Redshift, and Google BigQuery.

## Next steps

* [Create an Azure machine learning dataset](how-to-create-register-datasets.md)
* [Train a model](how-to-set-up-training-targets.md)
* [Deploy a model](how-to-deploy-and-where.md)