---
title: Network data access in studio
titleSuffix: Azure Machine Learning
description: Learn how data access works with Azure Machine Learning studio when your workspace or storage is in a virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 11/08/2021
---


# Network data access with Azure Machine Learning studio

Data access is complex and it's important to recognize that there are many pieces to it. For example, accessing data from Azure Machine Learning studio is different than using the SDK. When using the SDK on your local development environment, you're directly accessing data in the cloud. When using studio, you aren't always directly accessing the data store from your client. Studio relies on the workspace to access data on your behalf.

> [!IMPORTANT]
> The information in this article is intended for Azure administrators who are creating the infrastructure required for an Azure Machine Learning solution.

> [!TIP]
> Studio only supports reading data from the following datastore types in a VNet:
>
> * Azure Storage Account (blob & file)
> * Azure Data Lake Storage Gen1
> * Azure Data Lake Storage Gen2
> * Azure SQL Database

## Data access

In general, data access from studio involves the following checks:

1. Who is accessing?
    - There are multiple different types of authentication depending on the storage type. For example, account key, token, service principal, managed identity, and user identity.
    - If authentication is made using a user identity, then it's important to know *which* user is trying to access storage.
2. Do they have permission?
    - Are the credentials correct? If so, does the service principal, managed identity, etc., have the necessary permissions on the storage? Permissions are granted using Azure role-based access controls (Azure RBAC).
    - [Reader](../role-based-access-control/built-in-roles.md#reader) of the storage account reads metadata of the storage.
    - [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) reads data within a blob container.
    - [Contributor](../role-based-access-control/built-in-roles.md#contributor) allows write access to a storage account.
    - More roles may be required depending on the type of storage.
3. Where is access from?
    - User: Is the client IP address in the VNet/subnet range?
    - Workspace: Is the workspace public or does it have a private endpoint in a VNet/subnet?
    - Storage: Does the storage allow public access, or does it restrict access through a service endpoint or a private endpoint?
4. What operation is being performed?
    - Create, read, update, and delete (CRUD) operations on a data store/dataset are handled by Azure Machine Learning.
    - Data Access calls (such as preview or schema) go to the underlying storage and need extra permissions.
5. Where is this operation being run; compute resources in your Azure subscription or resources hosted in a Microsoft subscription?
    - All calls to dataset and datastore services (except the "Generate Profile" option,) use resources hosted in a __Microsoft subscription__ to run the operations.
    - Jobs, including a the "Generate Profile" option for datasets, run on a compute resource in __your subscription__, and access the data from there. So the compute identity needs permission to the storage rather than the identity of the user submitting the job.

The following diagram shows the general flow of a data access call. In this example, a user is trying to make a data access call through a machine learning workspace, without using any compute resource.

:::image type="content" source="./media/concept-network-data-access/data-access-flow.svg" alt-text="Diagram of the logic flow when accessing data":::

## Azure Storage Account

When using an Azure Storage Account from Azure Machine Learning studio, you must add the managed identity of the workspace to the following Azure RBAC roles for the storage account:

* [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader)
* If the storage account uses a private endpoint to connect to the VNet, you must grant the managed identity the [Reader](../role-based-access-control/built-in-roles.md#reader) role for the storage account private endpoint.

For more information, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).

See the following sections for information on limitations when using Azure Storage Account with your workspace in a VNet.
### Using an existing storage account

If you use an existing storage account as the __default storage__ when creating a workspace, the `azureml-filestore` folder in the file store doesn't automatically get created. This folder is required when submitting [AutoML](concept-automated-ml.md) experiments.

To avoid this issue, you can either allow Azure Machine Learning to create the default storage for you when creating the workspace or make sure the existing storage account  is __not__ in the VNet when creating the workspace. For more information on networking with Azure Storage Account, see [Configure Azure Storage Accounts with virtual networks](../storage/common/storage-network-security.md).

### Azure Storage firewall

When an Azure Storage account is behind a virtual network, the storage firewall can normally be used to allow your client to directly connect over the internet. However, when using studio it isn't  your client that connects to the storage account; it's the Azure Machine Learning service that makes the request. The IP address of the service isn't documented and changes frequently. __Enabling the storage firewall will not allow studio to access the storage account in a VNet configuration__.

## Azure Data Lake Storage Gen1

When using Azure Data Lake Storage Gen1 as a datastore, you can only use POSIX-style access control lists. You can assign the workspace's managed identity access to resources just like any other security principal. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

## Azure Data Lake Storage Gen2

When using Azure Data Lake Storage Gen2 as a datastore, you can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

**To use Azure RBAC**, follow the steps in the [Datastore: Azure Storage Account](how-to-enable-studio-virtual-network.md#datastore-azure-storage-account) section of the 'Use Azure Machine Learning studio in an Azure Virtual Network' article. Data Lake Storage Gen2 is based on Azure Storage, so the same steps apply when using Azure RBAC.

**To use ACLs**, the managed identity of the workspace can be assigned access just like any other security principal. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

## Azure SQL Database

To access data stored in an Azure SQL Database with a managed identity, you must create a SQL contained user that maps to the managed identity. For more information on creating a user from an external provider, see [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities).

After you create a SQL contained user, grant permissions to it by using the [GRANT T-SQL command](/sql/t-sql/statements/grant-object-permissions-transact-sql).

### Deny public network access

In Azure SQL Database, the __Deny public network access__ allows you to block public access to the database. We __do not support__ accessing SQL Database if this option is enabled. When using a SQL Database with Azure Machine Learning studio, the data access is always made through the public endpoint for the SQL Database.

## Next steps

For information on enabling studio in a network, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).