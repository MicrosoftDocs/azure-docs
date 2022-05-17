---
title: Connect to storage services on Azure
titleSuffix: Azure Machine Learning
description: Learn how to use datastores to securely connect to Azure storage services during training with Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: xunwan
author: SturgeonMi
ms.reviewer: nibaccam
ms.date: 05/11/2022
ms.custom: contperf-fy21q1, devx-track-python, data4ml


# Customer intent: As an experienced Python developer, I need to make my data in Azure storage available to my remote compute to train my machine learning models.
---

# Connect to storage services with datastores

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](./v1/how-to-access-data.md)
> * [v2 (current version)](how-to-access-data.md)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article, learn how to connect to data storage services on Azure with Azure Machine Learning datastores using the Azure CLI extension for machine learning (v2).

Datastores securely connect to your storage service on Azure without putting your authentication credentials and the integrity of your original data source at risk. They store connection information, like your subscription ID and token authorization in your [Key Vault](https://azure.microsoft.com/services/key-vault/) that's associated with the workspace, so you can securely access your storage without having to hard code them in your scripts. You can create datastores that connect to [these Azure storage solutions](#supported-data-storage-service-types).

To understand where datastores fit in Azure Machine Learning's overall data access workflow, see [Data in Azure Machine Learning](concept-data.md) article.

For a low code experience, see how to use the [Azure Machine Learning studio to create and register datastores](how-to-connect-data-ui.md#create-datastores).

>[!TIP]
> This article assumes you want to connect to your storage service with credential-based authentication credentials, like a service principal or a shared access signature (SAS) token. Keep in mind, if credentials are registered with datastores, all users with workspace *Reader* role are able to retrieve these credentials. [Learn more about workspace *Reader* role.](how-to-assign-roles.md#default-roles) <br><br>If this is a concern, learn how to [Connect to storage services with identity based access](how-to-identity-based-data-access.md).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- An Azure storage account with a [supported storage type](#supported-data-storage-service-types).

- The [Azure Machine Learning CLI V2](how-to-configure-cli.md).

- An Azure Machine Learning workspace. Either [create an Azure Machine Learning workspace](how-to-manage-workspace.md) or use an existing workspace.

    When you create a workspace, an Azure blob container and an Azure file share are automatically registered as datastores to the workspace. They're named `workspaceblobstore` and `workspacefilestore`, respectively. The `workspaceblobstore` is used to store workspace artifacts and your machine learning experiment logs. It's also set as the **default datastore** and can't be deleted from the workspace. The `workspacefilestore` is used to store notebooks and R scripts authorized via [compute instance](./concept-compute-instance.md#accessing-files).


## Supported data storage service types

Datastores currently support storing connection information to the storage services listed in the following matrix. 

> [!TIP]
> **For unsupported storage solutions**, and to save data egress cost during ML experiments, move your data to a supported Azure storage solution. 

| Storage&nbsp;type | Authentication&nbsp;type | [Azure&nbsp;Machine&nbsp;Learning studio](https://ml.azure.com/) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; Python SDK](/python/api/overview/azure/ml/intro) |  [Azure&nbsp;Machine&nbsp;Learning CLI](v1/reference-azure-machine-learning-cli.md) | [Azure&nbsp;Machine&nbsp;Learning&nbsp; REST API](/rest/api/azureml/) | VS Code
---|---|---|---|---|---|---
[Azure&nbsp;Blob&nbsp;Storage](../storage/blobs/storage-blobs-overview.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓ |✓
[Azure&nbsp;File&nbsp;Share](../storage/files/storage-files-introduction.md)| Account key <br> SAS token | ✓ | ✓ | ✓ |✓|✓
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;1](../data-lake-store/index.yml)| Service principal| ✓ | ✓ | ✓ |✓|
[Azure&nbsp;Data Lake&nbsp;Storage Gen&nbsp;2](../storage/blobs/data-lake-storage-introduction.md)| Service principal| ✓ | ✓ | ✓ |✓|


### Storage guidance

We recommend creating a datastore for an [Azure Blob container](../storage/blobs/storage-blobs-introduction.md). Both standard and premium storage are available for blobs. Although premium storage is more expensive, its faster throughput speeds might improve the speed of your training runs, particularly if you train against a large amount of data. For information about the cost of storage accounts, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service).

[Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is built on top of Azure Blob storage and designed for enterprise big data analytics. A fundamental part of Data Lake Storage Gen2 is the addition of a [hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md) to Blob storage. The hierarchical namespace organizes objects/files into a hierarchy of directories for efficient data access.

## Storage access and permissions

To ensure you securely connect to your Azure storage service, Azure Machine Learning  requires that you have permission to access the corresponding data storage container. This access depends on the authentication credentials used to register the datastore. 

> [!NOTE]
> This guidance also applies to [datastores created with identity-based data access](how-to-identity-based-data-access.md). 

### Virtual network 

Azure Machine Learning requires extra configuration steps to communicate with a storage account that is behind a firewall or within a virtual network. If your storage account is behind a firewall, you can [add your client's IP address to an allowlist](../storage/common/storage-network-security.md#managing-ip-network-rules) via the Azure portal.

Azure Machine Learning can receive requests from clients outside of the virtual network. To ensure that the entity requesting data from the service is safe and to enable data being displayed in your workspace, [use a private endpoint with your workspace](how-to-configure-private-link.md).

**For Python SDK users**, to access your data via your training script on a compute target, the compute target needs to be inside the same virtual network and subnet of the storage. You can [use a compute cluster in the same virtual network](how-to-secure-training-vnet.md?tabs=azure-studio%2Cipaddress#compute-cluster) or [use a compute instance in the same virtual network](how-to-secure-training-vnet.md?tabs=azure-studio%2Cipaddress#compute-instance).

**For Azure Machine Learning studio users**, several features rely on the ability to read data, such as data previews, profiles, and automated machine learning. For these features to work with storage behind virtual networks, use a [workspace managed identity in the studio](how-to-enable-studio-virtual-network.md) to allow Azure Machine Learning to access the storage account from outside the virtual network. 

> [!NOTE]
> If your data storage is an Azure SQL Database behind a virtual network, be sure to set *Deny public access* to **No** via the [Azure portal](https://portal.azure.com/) to allow Azure Machine Learning to access the storage account.

### Access validation

> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If cross tenant access is needed for your scenario, please reach out to the AzureML Data Support team alias at  amldatasupport@microsoft.com for assistance with a custom code solution.

**As part of the initial datastore creation and registration process**, Azure Machine Learning automatically validates that the underlying storage service exists and the user provided principal (username, service principal, or SAS token) has access to the specified storage.

**After datastore creation**, this validation is only performed for methods that require access to the underlying storage container, **not** each time datastore objects are retrieved. For example, validation happens if you want to download files from your datastore; but if you just want to change your default datastore, then validation doesn't happen.

To authenticate your access to the underlying storage service, you can provide either your account key, shared access signatures (SAS) tokens, or service principal in the corresponding `register_azure_*()` method of the datastore type you want to create. The [storage type matrix](#supported-data-storage-service-types) lists the supported authentication types that correspond to each datastore type.

You can find account key, SAS token, and service principal information on your [Azure portal](https://portal.azure.com).

* If you plan to use an account key or SAS token for authentication, select **Storage Accounts** on the left pane, and choose the storage account that you want to register. 
  * The **Overview** page provides information such as the account name, container, and file share name. 
      1. For account keys, go to **Access keys** on the **Settings** pane. 
      1. For SAS tokens, go to **Shared access signatures** on the **Settings** pane.

* If you plan to use a service principal for authentication, go to your **App registrations** and select which app you want to use. 
    * Its corresponding **Overview** page will contain required information like tenant ID and client ID.

> [!IMPORTANT]
> If you need to change your access keys for an Azure Storage account (account key or SAS token), be sure to sync the new credentials with your workspace and the datastores connected to it. Learn how to [sync your updated credentials](how-to-change-storage-access-key.md). 

### Permissions

For Azure blob container and Azure Data Lake Gen 2 storage, make sure your authentication credentials have **Storage Blob Data Reader** access. Learn more about [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader). An account SAS token defaults to no permissions. 
* For data **read access**, your authentication credentials must have a minimum of list and read permissions for containers and objects. 

* For data **write access**, write and add permissions also are required.

## Create and register datastores

When you register an Azure storage solution as a datastore, you automatically create and register that datastore to a specific workspace. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

Within this section are examples for how to create and register a datastore via the Python SDK v2 (preview) for the following storage types. The parameters provided in these examples are the **required parameters** to create and register a datastore.

* Azure blob container
* Azure file share
* Azure Data Lake Storage Generation 1
* Azure Data Lake Storage Generation 2


If you prefer a low code experience, see [Connect to data with Azure Machine Learning studio](how-to-connect-data-ui.md).
>[!IMPORTANT]
> If you unregister and re-register a datastore with the same name, and it fails, the Azure Key Vault for your workspace may not have soft-delete enabled. By default, soft-delete is enabled for the key vault instance created by your workspace, but it may not be enabled if you used an existing key vault or have a workspace created prior to October 2020. For information on how to enable soft-delete, see [Turn on Soft Delete for an existing key vault](../key-vault/general/soft-delete-change.md#turn-on-soft-delete-for-an-existing-key-vault).


> [!NOTE]
> Datastore name should only consist of lowercase letters, digits and underscores.

The following Python SDK v2 examples are from the [Create Azure Machine Learning Datastore](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/resources/datastores/datastore.ipynb) notebook in the [Azure Machine Learning examples repository](https://github.com/azure/azureml-examples).

To learn more about the Azure Machine Learning Python SDK v2 preview, see [What is Azure Machine Learning CLI & SDK v2](concept-v2.md).

### Azure blob container - SDK (v2)

The following code creates and registers the `blob_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using account key.

```Python
blob_datastore1 = AzureBlobDatastore(
    name="blob-example",
    description="Datastore pointing to a blob container.",
    account_name="mytestblobstore",
    container_name="data-container",
    credentials={
        "account_key": "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    },
)
ml_client.create_or_update(blob_datastore1)
```

The following code creates and registers the `blob_sas_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using sas token.

```Python
# create a SAS based blob datastore
blob_sas_datastore = AzureBlobDatastore(
    name="blob-sas-example",
    description="Datastore pointing to a blob container using SAS token.",
    account_name="mytestblobstore",
    container_name="data-container",
    credentials={
        "sas_token": "?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX"
    },
)
ml_client.create_or_update(blob_sas_datastore)
```


The following code creates and registers the `blob_protocol_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using wasbs protocol and account key.

```Python
# create a datastore pointing to a blob container using wasbs protocol
blob_wasb_datastore = AzureBlobDatastore(
    name="blob-protocol-example",
    description="Datastore pointing to a blob container using wasbs protocol.",
    account_name="mytestblobstore",
    container_name="data-container",
    protocol="wasbs",
    credentials={
        "account_key": "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    },
)
ml_client.create_or_update(blob_wasb_datastore)
```

The following code creates and registers the `blob_credless_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using the user's identity or other managed identities.

```Python
# create a credential-less datastore pointing to a blob container
blob_credless_datastore = AzureBlobDatastore(
    name="blob-credless-example",
    description="Credential-less datastore pointing to a blob container.",
    account_name="mytestblobstore",
    container_name="data-container",
)
ml_client.create_or_update(blob_credless_datastore)
```

### Azure file share - SDK (v2)

The following code creates and registers the `file_example` datastore to the workspace. This datastore accesses the `my-share` file share on the `mytestfilestore` storage account, by using the provided account access key. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```Python
# Datastore pointing to an Azure File Share
file_datastore = AzureFileDatastore(
    name="file-example",
    description="Datastore pointing to an Azure File Share.",
    account_name="mytestfilestore",
    file_share_name="my-share",
    credentials={
        "account_key": "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    },
)
ml_client.create_or_update(file_datastore)
```


The following code creates and registers the `file_sas_example` datastore to the workspace. This datastore accesses the `my-share` file share on the `mytestfilestore` storage account, by using the provided account sas token. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```Python
# Datastore pointing to an Azure File Share using SAS token
file_sas_datastore = AzureFileDatastore(
    name="file-sas-example",
    description="Datastore pointing to an Azure File Share using SAS token.",
    account_name="mytestfilestore",
    file_share_name="my-share",
    credentials={
        "sas_token": "?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX"
    },
)
ml_client.create_or_update(file_sas_datastore)
```

### Azure Data Lake Storage Generation 1 - SDK (v2)


The following code creates and registers the `adls_gen1_example` datastore to the workspace. This datastore accesses the `mytestdatalakegen1` storage, by using the provided service principal credentials. 
Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

In order to utilize your service principal, you need to [register your application](../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). Learn more about [access control set up for ADLS](../storage/blobs/data-lake-storage-access-control-model.md). 

```python 
adlsg1_datastore = AzureDataLakeGen1Datastore(
    name="adls-gen1-example",
    description="Datastore pointing to an Azure Data Lake Storage Gen1.",
    store_name="mytestdatalakegen1",
    credentials={
        "tenant_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "client_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "client_secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
)
ml_client.create_or_update(adlsg1_datastore)
```


### Azure Data Lake Storage Generation 2 - SDK (v2)


The following code creates and registers the `adls_gen2_example` datastore to the workspace. This datastore accesses the file system `my-gen2-container` in the `mytestdatalakegen2` storage account, by using the provided service principal credentials. 
Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

In order to utilize your service principal, you need to [register your application](../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). Learn more about [access control set up for ADLS Gen 2](../storage/blobs/data-lake-storage-access-control-model.md). 

```python 
adlsg2_datastore = AzureDataLakeGen2Datastore(
    name="adls-gen2-example",
    description="Datastore pointing to an Azure Data Lake Storage Gen2.",
    account_name="mytestdatalakegen2",
    filesystem="my-gen2-container",
    credentials={
        "tenant_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "client_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        "client_secret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
)
ml_client.create_or_update(adlsg2_datastore)
```


## Working with Datastores in Azure Machine Learning CLI (v2)

To create a datastore using the CLI, use the [az ml datastore create](/cli/azure/ml/dataset#az-ml-dataset-create) command and provide a YAML file that defines the dataset.

```cli
az ml datastore create -f <file-name>.yml
```

The YAML files in this section demonstrate how to create and register a datastore. These files are pulled from [https://github.com/Azure/azureml-examples/tree/main/cli/assets/data](https://github.com/Azure/azureml-examples/tree/main/cli/assets/data) in the Azure Machine Learning examples repository. The samples are provided for the following storage types:

- Azure Blob Storage container
- Azure File share
- Azure Data Lake Storage Gen1
- Azure Data Lake Storage Gen2

> [!NOTE]
> The `credentials` property in these sample `YAML` is redacted. Please replace the redacted `account_key`, `sas_token`, `tenant_id`, `client_id` and `client_secret` appropriately in these files.


For more information on the CLI v2, see [Install and configure CLI](/azure/machine-learning/how-to-configure-cli).

### Azure blob container - CLI (v2)


The following code creates and registers the `blob_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using account key.

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_example
type: azure_blob
description: Datastore pointing to a blob container.
account_name: mytestblobstore
container_name: data-container
credentials:
  account_key: XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX
```

The following code creates and registers the `blob_sas_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using sas token.

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_sas_example
type: azure_blob
description: Datastore pointing to a blob container using SAS token.
account_name: mytestblobstore
container_name: data-container
credentials:
  sas_token: ?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX
```


The following code creates and registers the `blob_protocol_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using wasbs protocol and account key.

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_protocol_example
type: azure_blob
description: Datastore pointing to a blob container using wasbs protocol.
account_name: mytestblobstore
protocol: wasbs
container_name: data-container
credentials:
  account_key: XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX
```

The following code creates and registers the `blob_credless_example` datastore to the workspace. This datastore accesses the `data-container` blob container on the `mytestblobstore` storage account, by using the user's identity or other managed identities.

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
name: blob_credless_example
type: azure_blob
description: Credential-less datastore pointing to a blob container.
account_name: mytestblobstore
container_name: data-container
```

### Azure file share - CLI (v2)


The following code creates and registers the `file_example` datastore to the workspace. This datastore accesses the `my-share` file share on the `mytestfilestore` storage account, by using the provided account access key. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureFile.schema.json
name: file_example
type: azure_file
description: Datastore pointing to an Azure File Share.
account_name: mytestfilestore
file_share_name: my-share
credentials:
  account_key: XxXxXxXXXXXXXxXxXxxXxxXXXXXXXXxXxxXXxXXXXXXXxxxXxXXxXXXXXxXXxXXXxXxXxxxXXxXXxXXXXXxXxxXX
```


The following code creates and registers the `file_sas_example` datastore to the workspace. This datastore accesses the `my-share` file share on the `mytestfilestore` storage account, by using the provided account sas token. Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/azureFile.schema.json
name: file_sas_example
type: azure_file
description: Datastore pointing to an Azure File Share using SAS token.
account_name: mytestfilestore
file_share_name: my-share
credentials:
  sas_token: ?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX
```



### Azure Data Lake Storage Generation 1 - CLI (v2)


The following code creates and registers the `adls_gen1_example` datastore to the workspace. This datastore accesses the `mytestdatalakegen1` storage, by using the provided service principal credentials. 
Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

In order to utilize your service principal, you need to [register your application](../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). Learn more about [access control set up for ADLS](../storage/blobs/data-lake-storage-access-control-model.md). 

```YAML 
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json
name: adls_gen1_example
type: azure_data_lake_gen1
description: Datastore pointing to an Azure Data Lake Storage Gen1.
store_name: mytestdatalakegen1 
credentials:
  tenant_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The following code creates and registers the `adls_gen1_credless_example` datastore to the workspace. This datastore accesses the `mytestdatalakegen1` storage, by using the user's identity or other managed identities.

```YAML 
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json
name: alds_gen1_credless_example
type: azure_data_lake_gen1
description: Credential-less datastore pointing to an Azure Data Lake Storage Gen1.
store_name: mytestdatalakegen1 
```


### Azure Data Lake Storage Generation 2 - CLI (v2)


The following code creates and registers the `adls_gen2_example` datastore to the workspace. This datastore accesses the file system `my-gen2-container` in the `mytestdatalakegen2` storage account, by using the provided service principal credentials. 
Review the [storage access & permissions](#storage-access-and-permissions) section for guidance on virtual network scenarios, and where to find required authentication credentials. 

In order to utilize your service principal, you need to [register your application](../active-directory/develop/app-objects-and-service-principals.md) and grant the service principal data access via either Azure role-based access control (Azure RBAC) or access control lists (ACL). Learn more about [access control set up for ADLS Gen 2](../storage/blobs/data-lake-storage-access-control-model.md). 

```YAML 
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json
name: adls_gen2_example
type: azure_data_lake_gen2
description: Datastore pointing to an Azure Data Lake Storage Gen2.
account_name: mytestdatalakegen2
filesystem: my-gen2-container
credentials:
  tenant_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
  client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The following code creates and registers the `adls_gen2_credless_example` datastore to the workspace. This datastore accesses the file system `my-gen2-container` in the `mytestdatalakegen2` storage account, by using the user's identity or other managed identities.

```YAML 
$schema: https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json
name: adls_gen2_credless_example
type: azure_data_lake_gen2
description: Credential-less datastore pointing to an Azure Data Lake Storage Gen2.
account_name: mytestdatalakegen2
filesystem: my-gen2-container
```

## Create datastores with other Azure tools
In addition to creating datastores with the CLI/SDK and the studio, you can also use Azure Resource Manager templates or the Azure Machine Learning VS Code extension. 

### Azure Resource Manager

There are several templates at [https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices) that can be used to create datastores.

For information on using these templates, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

### VS Code extension

If you prefer to create and manage datastores using the Azure Machine Learning VS Code extension, visit the [VS Code resource management how-to guide](how-to-manage-resources-vscode.md#datastores) to learn more.

## Move data to supported Azure storage solutions

Azure Machine Learning supports accessing data from Azure Blob storage, Azure Files, Azure Data Lake Storage Gen1, and Azure Data Lake Storage Gen2. If you're using unsupported storage, we recommend that you move your data to supported Azure storage solutions by using [Azure Data Factory and these steps](/azure/data-factory/quickstart-create-data-factory-copy-data-tool). Moving data to supported storage can help you save data egress costs during machine learning experiments. 

Azure Data Factory provides efficient and resilient data transfer with more than 80 prebuilt connectors at no extra cost. These connectors include Azure data services, on-premises data sources, Amazon S3 and Redshift, and Google BigQuery.

## Next steps

* [Work with data using SDK v2](how-to-use-data.md)
