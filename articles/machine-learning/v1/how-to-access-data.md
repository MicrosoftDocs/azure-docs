---
title: Connect to storage services with CLI v1
titleSuffix: Azure Machine Learning
description: Learn how to use datastores to securely connect to Azure storage services during training with Azure Machine Learning CLI v1
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: nibaccam
ms.date: 02/27/2024
ms.custom: UpdateFrequency5, data4ml
#Customer intent: As an experienced Python developer, I need to make my data in Azure storage available to my remote compute to train my machine learning models.
---

# Connect to storage services on Azure with datastores

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]
[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

In this article, learn how to connect to data storage services on Azure with Azure Machine Learning datastores and the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).

Datastores securely connect to your storage service on Azure, and they avoid risk to your authentication credentials or the integrity of your original data store. A datastore stores connection information - for example, your subscription ID or token authorization - in the [Key Vault](https://azure.microsoft.com/services/key-vault/) associated with the workspace. With a datastore, you can securely access your storage because you can avoid hard-coding connection information in your scripts. You can create datastores that connect to [these Azure storage solutions](#supported-data-storage-service-types).

For information that describes how datastores fit with the Azure Machine Learning overall data access workflow, visit [Securely access data](concept-data.md#data-workflow) article.

To learn how to connect to a data storage resource with a UI, visit [Connect to data storage with the studio UI](how-to-connect-data-ui.md#create-datastores).

>[!TIP]
> This article assumes that you will connect to your storage service with credential-based authentication credentials - for example, a service principal or a shared access signature (SAS) token. Note that if credentials are registered with datastores, all users with the workspace *Reader* role can retrieve those credentials. For more information, visit [Manage roles in your workspace](../how-to-assign-roles.md#default-roles).
>
> For more information about identity-based data access, visit [Identity-based data access to storage services (v1)](../how-to-identity-based-data-access.md).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/)

- An Azure storage account with a [supported storage type](#supported-data-storage-service-types)

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro)

- An Azure Machine Learning workspace.
  
  [Create an Azure Machine Learning workspace](../quickstart-create-resources.md), or use an existing workspace via the Python SDK

    Import the `Workspace` and `Datastore` class, and load your subscription information from the `config.json` file with the `from_config()` function. By default, the function looks for the JSON file in the current directory, but you can also specify a path parameter to point to the file with `from_config(path="your/file/path")`:

   ```Python
   import azureml.core
   from azureml.core import Workspace, Datastore
        
   ws = Workspace.from_config()
   ```

    Workspace creation automatically registers an Azure blob container and an Azure file share, as datastores, to the workspace. They're named `workspaceblobstore` and `workspacefilestore`, respectively. The `workspaceblobstore` stores workspace artifacts and your machine learning experiment logs. It serves as the **default datastore** and can't be deleted from the workspace. The `workspacefilestore` stores notebooks and R scripts authorized via [compute instance](../concept-compute-instance.md#accessing-files).

    > [!NOTE]
    > Azure Machine Learning designer automatically creates a datastore named **azureml_globaldatasets** when you open a sample in the designer homepage. This datastore only contains sample datasets. Please **do not** use this datastore for any confidential data access.

## Supported data storage service types

Datastores currently support storage of connection information to the storage services listed in this matrix: 

> [!TIP]
> **For unsupported storage solutions** (those not listed in the following table), you might encounter issues as you connect and work with your data. We suggest that you [move your data](#move-data-to-supported-azure-storage-solutions) to a supported Azure storage solution. This can also help with additional scenarios- - for example, reduction of data egress cost during ML experiments.

| Storage&nbsp;type | Authentication&nbsp;type | [Azure&nbsp;Machine&nbsp;Learning studio](https://ml.azure.com/) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; Python SDK](/python/api/overview/azure/ml/intro) |  [Azure&nbsp;Machine&nbsp;Learning CLI](reference-azure-machine-learning-cli.md) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; REST API](/rest/api/azureml/) | VS Code
---|---|---|---|---|---|---
[Azure&nbsp;Blob&nbsp;Storage](../../storage/blobs/storage-blobs-overview.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓ |✓
[Azure&nbsp;File&nbsp;Share](../../storage/files/storage-files-introduction.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓|✓
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;1](../../data-lake-store/index.yml)| Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;2](../../storage/blobs/data-lake-storage-introduction.md)| Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;SQL&nbsp;Database](/azure/azure-sql/database/sql-database-paas-overview)| SQL authentication <br>Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;PostgreSQL](/azure/postgresql/overview) | SQL authentication| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;Database&nbsp;for&nbsp;MySQL](/azure/mysql/overview) | SQL authentication|  | ✓* | ✓* |✓*|
[Databricks&nbsp;File&nbsp;System](/azure/databricks/data/databricks-file-system)| No authentication | | ✓** | ✓ ** |✓** |

* MySQL is only supported for pipeline [DataTransferStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.datatransferstep).
* Databricks is only supported for pipeline [DatabricksStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricks_step.databricksstep).

### Storage guidance

We recommend creation of a datastore for an [Azure Blob container](../../storage/blobs/storage-blobs-introduction.md). Both standard and premium storage are available for blobs. Although premium storage is more expensive, its faster throughput speeds might improve the speed of your training runs, especially if you train against a large dataset. For information about storage account costs, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service).

[Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md) is built on top of Azure Blob storage. It's designed for enterprise big data analytics. As part of Data Lake Storage Gen2, Blob storage features a [hierarchical namespace](../../storage/blobs/data-lake-storage-namespace.md). The hierarchical namespace organizes objects/files into a hierarchy of directories for efficient data access.

## Storage access and permissions

To ensure you securely connect to your Azure storage service, Azure Machine Learning requires that you have permission to access the corresponding data storage container. This access depends on the authentication credentials used to register the datastore.

> [!NOTE]
> This guidance also applies to [datastores created with identity-based data access](../how-to-identity-based-data-access.md).

### Virtual network

To communicate with a storage account located behind a firewall or within a virtual network, Azure Machine Learning requires extra configuration steps. For a storage account located behind a firewall, you can [add your client's IP address to an allowlist](../../storage/common/storage-network-security.md#managing-ip-network-rules) with the Azure portal.

Azure Machine Learning can receive requests from clients outside of the virtual network. To ensure that the entity requesting data from the service is safe, and to enable display of data in your workspace, [use a private endpoint with your workspace](../how-to-configure-private-link.md).

**For Python SDK users**: To access your data on a compute target with your training script, you must locate the compute target inside the same virtual network and subnet of the storage. You can [use a compute instance/cluster in the same virtual network](how-to-secure-training-vnet.md).

**For Azure Machine Learning studio users**: Several features rely on the ability to read data from a dataset - for example, dataset previews, profiles, and automated machine learning. For these features to work with storage behind virtual networks, use a [workspace managed identity in the studio](../how-to-enable-studio-virtual-network.md) to allow Azure Machine Learning to access the storage account from outside the virtual network.

> [!NOTE]
> For data stored in an Azure SQL Database behind a virtual network, set *Deny public access* to **No** with the [Azure portal](https://portal.azure.com/), to allow Azure Machine Learning to access the storage account.

### Access validation

> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If your scenario needs cross tenant access, reach out to the Azure Machine Learning Data Support team alias at  **amldatasupport@microsoft.com** for assistance with a custom code solution.

**As part of the initial datastore creation and registration process**, Azure Machine Learning automatically validates that the underlying storage service exists and that the user-provided principal (username, service principal, or SAS token) can access the specified storage.

**After datastore creation**, this validation is only performed for methods that require access to the underlying storage container, **not** each time datastore objects are retrieved. For example, validation happens if you want to download files from your datastore. However, if you only want to change your default datastore, then validation doesn't happen.

To authenticate your access to the underlying storage service, you can provide either your account key, shared access signatures (SAS) tokens, or service principal in the corresponding `register_azure_*()` method of the datastore type you want to create. The [storage type matrix](#supported-data-storage-service-types) lists the supported authentication types that correspond to each datastore type.

You can find account key, SAS token, and service principal information at your [Azure portal](https://portal.azure.com).

* To use an account key or SAS token for authentication, select **Storage Accounts** on the left pane, and choose the storage account that you want to register
  * The **Overview** page provides account name, file share name, container, etc. information 
      * For account keys, go to **Access keys** on the **Settings** pane
      * For SAS tokens, go to **Shared access signatures** on the **Settings** pane

* To use a service principal for authentication, go to your **App registrations** and select the app you want to use
    * The corresponding **Overview** page of the selected app contains required information - for example, tenant ID and client ID

> [!IMPORTANT]
> To change your access keys for an Azure Storage account (account key or SAS token), sync the new credentials with your workspace and the datastores connected to it. For more information, visit [sync your updated credentials](../how-to-change-storage-access-key.md).

### Permissions

For Azure blob container and Azure Data Lake Gen 2 storage, ensure that your authentication credentials have **Storage Blob Data Reader** access. For more information, visit [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader). An account SAS token defaults to no permissions.

* For data **read access**, your authentication credentials must have a minimum of list and read permissions for containers and objects

* Data **write access** also requires write and add permissions

## Create and register datastores

Registration of an Azure storage solution as a datastore automatically creates and registers that datastore to a specific workspace. Review [storage access & permissions](#storage-access-and-permissions) in this document for guidance about virtual network scenarios, and where to find required authentication credentials.

That section offers examples that describe how to create and register a datastore via the Python SDK for these storage types. The parameters shown these examples are the **required parameters** to create and register a datastore:

* [Azure blob container](#azure-blob-container)
* [Azure file share](#azure-file-share)
* [Azure Data Lake Storage Generation 2](#azure-data-lake-storage-generation-2)

 To create datastores for other supported storage services, visit the [reference documentation for the applicable `register_azure_*` methods](/python/api/azureml-core/azureml.core.datastore.datastore#methods).

To learn how to connect to a data storage resource with a UI, visit [Connect to data with Azure Machine Learning studio](how-to-connect-data-ui.md).

>[!IMPORTANT]
> If you unregister and re-register a datastore with the same name, and the re-registration fails, the Azure Key Vault for your workspace may not have soft-delete enabled. By default, soft-delete is enabled for the key vault instance created by your workspace, but it may not be enabled if you used an existing key vault or have a workspace created before October 2020. For information that describes how to enable soft-delete, see [Turn on Soft Delete for an existing key vault](../../key-vault/general/soft-delete-change.md#turn-on-soft-delete-for-an-existing-key-vault).

> [!NOTE]
> A datastore name should only contain lowercase letters, digits and underscores.

### Azure blob container

To register an Azure blob container as a datastore, use the [`register_azure_blob_container()`](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-blob-container) method.

This code sample creates and registers the `blob_datastore_name` datastore to the `ws` workspace. The datastore uses the provided account access key to access the `my-container-name` blob container on the `my-account-name` storage account. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance about virtual network scenarios, and where to find required authentication credentials.

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

To register an Azure file share as a datastore, use the [`register_azure_file_share()`](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-file-share) method.

This code sample creates and registers the `file_datastore_name` datastore to the `ws` workspace. The datastore uses the `my-fileshare-name` file share on the `my-account-name` storage account, with the provided account access key. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance about virtual network scenarios, and where to find required authentication credentials.

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

For an Azure Data Lake Storage Generation 2 (ADLS Gen 2) datastore, use the[register_azure_data_lake_gen2()](/python/api/azureml-core/azureml.core.datastore%28class%29#azureml-core-datastore-register-azure-data-lake-gen2) method to register a credential datastore connected to an Azure Data Lake Gen 2 storage with [service principal permissions](../../active-directory/develop/howto-create-service-principal-portal.md).  

To use your service principal, you must [register your application](../../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). For more information, visit [access control set up for ADLS Gen 2](../../storage/blobs/data-lake-storage-access-control-model.md).

This code creates and registers the `adlsgen2_datastore_name` datastore to the `ws` workspace. This datastore accesses the file system `test` in the `account_name` storage account, through use of the provided service principal credentials. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials.

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
In addition to datastore creation with the Python SDK and the studio, you can also create datastores with Azure Resource Manager templates or the Azure Machine Learning VS Code extension.

### Azure Resource Manager

You can use several templates at [https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices) to create datastores. For information about these templates, visit [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](../how-to-create-workspace-template.md).

### VS Code extension

For more information about creation and management of datastores with the Azure Machine Learning VS Code extension, visit the [VS Code resource management how-to guide](../how-to-manage-resources-vscode.md#datastores).

## Use data in your datastores

After datastore creation, [create an Azure Machine Learning dataset](how-to-create-register-datasets.md) to interact with your data. A dataset packages your data into a lazily evaluated consumable object for machine learning tasks, like training. With datasets, you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) files of any format from Azure storage services for model training on a compute target. [Learn more about how to train ML models with datasets](how-to-train-with-datasets.md).

## Get datastores from your workspace

To get a specific datastore registered in the current workspace, use the [`get()`](/python/api/azureml-core/azureml.core.datastore%28class%29#get-workspace--datastore-name-) static method on the `Datastore` class:

```Python
# Get a named datastore from the current workspace
datastore = Datastore.get(ws, datastore_name='your datastore name')
```
To get the list of datastores registered with a given workspace, use the [`datastores`](/python/api/azureml-core/azureml.core.workspace%28class%29#datastores) property on a workspace object:

```Python
# List all datastores registered in the current workspace
datastores = ws.datastores
for name, datastore in datastores.items():
    print(name, datastore.datastore_type)
```

This code sample shows how to get the default datastore of the workspace:

```Python
datastore = ws.get_default_datastore()
```
You can also change the default datastore with this code sample. Only the SDK supports this ability:

```Python
 ws.set_default_datastore(new_default_datastore)
```

## Access data during scoring

Azure Machine Learning provides several ways to use your models for scoring. Some of these methods provide no access to datastores. The following table describes which methods allow access to datastores during scoring:

| Method | Datastore access | Description |
| ----- | :-----: | ----- |
| [Batch prediction](../tutorial-pipeline-batch-scoring-classification.md) | ✔ | Make predictions on large quantities of data asynchronously. |
| [Web service](how-to-deploy-and-where.md) | &nbsp; | Deploy models as a web service. |

When the SDK doesn't provide access to datastores, you might be able to create custom code with the relevant Azure SDK to access the data. For example, the [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python) client library can access data stored in blobs or files.

## Move data to supported Azure storage solutions

Azure Machine Learning supports accessing data from

- Azure Blob storage
- Azure Files
- Azure Data Lake Storage Gen1
- Azure Data Lake Storage Gen2
- Azure SQL Database
- Azure Database for PostgreSQL

If you use unsupported storage, we recommend that you use [Azure Data Factory and these steps](../../data-factory/quickstart-hello-world-copy-data-tool.md) to move your data to supported Azure storage solutions. Moving data to supported storage can help you save data egress costs during machine learning experiments.

Azure Data Factory provides efficient and resilient data transfer, with more than 80 prebuilt connectors, at no extra cost. These connectors include Azure data services, on-premises data sources, Amazon S3 and Redshift, and Google BigQuery.

## Next steps

* [Create an Azure Machine Learning dataset](how-to-create-register-datasets.md)
* [Train a model](how-to-set-up-training-targets.md)
* [Deploy a model](how-to-deploy-and-where.md)
