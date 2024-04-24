---
title: How to administrate data authentication
titleSuffix: Azure Machine Learning
description: Learn how to manage data access and how to authenticate in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: xunwan
author: SturgeonMi
ms.reviewer: franksolomon
ms.date: 09/26/2023
ms.custom: engagement-fy23

# Customer intent: As an administrator, I need to administrate data access and set up authentication method for data scientists.
---

# Data administration

Learn how to manage data access and how to authenticate in Azure Machine Learning
[!INCLUDE [sdk/cli v2](includes/machine-learning-dev-v2.md)]

> [!IMPORTANT]
> This article is intended for Azure administrators who want to create the required infrastructure for an Azure Machine Learning solution.

## Credential-based data authentication
In general, credential-based data authentication involves these checks:
* Does the user who is accessing data from the credential-based datastore have been assigned an RBAC role containing `Microsoft.MachineLearningServices/workspaces/datastores/listsecrets/action`?
    - This permission is required to retrieve credentials from the datastore on behalf of the user.
    - Built in roles that contain this permission already is the [Contributor](../role-based-access-control/built-in-roles/general.md#contributor), the Azure AI Developer or the [AML Data Scientist](../role-based-access-control/built-in-roles/ai-machine-learning.md#azureml-data-scientist) roles. Alternatively, if a custom role is being applied then we need to ensure that this permission is added to that custom role.
    - You must know *which* specific user is trying to access the data. It can be a real user with user identity or a compute with compute MSI etc., you can check the section [Scenarios and authentication options](#scenarios-and-authentication-options) to identify what is the identity that you need to add permission for.

* Does the stored credential (service principal, account key, or sas token) have access to the data resource?


## Identity-based data authentication
In general, identity-based data authentication involves these checks:

* Which user wants to access the resources?
    - Depending on the conext when the data is being accessed, different types of authentication are available, for example
      -  user identity
      -  compute managed identity
      -  workspace managed identity
    - Jobs, including the dataset "Generate Profile" option, run on a compute resource in __your subscription__, and access the data from that location. The compute managed identity needs permission to the storage resource, instead of the identity of the user that submitted the job.
    - For authentication based on a user identity, you must know *which* specific user tried to access the storage resource. For more information about _user_ authentication, see [authentication for Azure Machine Learning](how-to-setup-authentication.md). For more information about service-level authentication, see [authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).
* Does this user have permission for reading?
    - Does the user identity or the compute managed identity, etc., have the necessary permissions for that storage resource? Permissions are granted using Azure role-based access controls (Azure RBAC).
    - The storage account [Reader](../role-based-access-control/built-in-roles.md#reader) reads the storage metadata.
    - The [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) reads and lists Blob storage containers and blobs.
    - Please find more [Azure built-in roles for storage here](../role-based-access-control/built-in-roles/storage.md).
* Does this user have permission for writing?
    - Does the user identity or the compute managed identity, etc., have the necessary permissions for that storage resource? Permissions are granted using Azure role-based access controls (Azure RBAC).
    - The storage account [Reader](../role-based-access-control/built-in-roles.md#reader) reads the storage metadata.
    - The [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) reads, writes, and deletes Azure Storage containers and blobs. 
    - Please find more [Azure built-in roles for storage here](../role-based-access-control/built-in-roles/storage.md).


## Other general checks for authentication
* Where does the access come from?
    - User: Is the client IP address in the VNet/subnet range?
    - Workspace: Is the workspace public, or does it have a private endpoint in a VNet/subnet?
    - Storage: Does the storage allow public access, or does it restrict access through a service endpoint or a private endpoint?
* What operation will be performed?
    - Azure Machine Learning handles create, read, update, and delete (CRUD) operations on a data store/dataset.
    - Archive operations on data assets in the studio require this RBAC operation: `Microsoft.MachineLearningServices/workspaces/datasets/registered/delete`
    - Data Access calls (for example, preview or schema) go to the underlying storage, and need extra permissions.
* Will this operation run in your Azure subscription compute resources, or resources hosted in a Microsoft subscription?
    - All calls to dataset and datastore services (except the "Generate Profile" option) use resources hosted in a __Microsoft subscription__ to run the operations.
    - Jobs, including the dataset "Generate Profile" option, run on a compute resource in __your subscription__, and access the data from that location. The compute identity needs permission to the storage resource, instead of the identity of the user that submitted the job.

This diagram shows the general flow of a data access call. Here, a user tries to make a data access call through a machine learning workspace, without using a compute resource.

:::image type="content" source="./media/concept-network-data-access/data-access-flow.svg" alt-text="Diagram of the logic flow when accessing data.":::

## Scenarios and authentication options

This table lists the identities to use for specific scenarios:

| Configuration | SDK Local/Notebook VM | Job | Dataset Preview | Datastore Browse |
| -- | -- | -- | -- | -- |
| Credential + Workspace MSI | Credential | Credential | Workspace MSI | Credential (Only Account key and SAS token) |
| No Credential + Workspace MSI | Compute MSI/User Identity | Compute MSI/User identity | Workspace MSI | User identity |
| Credential + No Workspace MSI | Credential | Credential | Credential(Not supported for Dataset Preview under private network) | Credential (Only Account key and SAS token) |
| No Credential + No Workspace MSI | Compute MSI/User Identity | Compute MSI/User identity | User Identity | User Identity |

For SDK V1, data authentication in a job is always using compute MSI. And for SDK V2, data authentication in a job depends on the job setting: can be user identity or compute MSI based on your setting.


> [!TIP]
> To access data from outside Azure Machine Learning, for example with Azure Storage Explorer, that access probably relies on the *user* identity. For specific information, review the documentation for the tool or service you're using. For more information about how Azure Machine Learning works with data, see [Setup authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).


## VNET specific requirements

The following will help you set up data authentication to access data behind VNET from an Azure Machine Learning workspace.

### Add permissions of Azure Storage Account to Azure Machine Learning workspace managed identity 

When you use an Azure Storage Account from Azure Machine Learning studio, if you want to see Dataset Preview, you must enable "Use workspace managed identity for data preview and profiling in Azure Machine Learning studio" in datastore setting, and add these Azure RBAC roles of the storage account to the workspace managed identity:

* [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader)
* If the storage account uses a private endpoint to connect to the VNet, you must grant the [Reader](../role-based-access-control/built-in-roles.md#reader) role for the storage account private endpoint to the managed identity.

For more information, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).

The following sections explain the limitations of using an Azure Storage Account, with your workspace, in a VNet.

### Secure communication with Azure Storage Account

To secure communication between Azure Machine Learning and Azure Storage Accounts, configure the storage to [Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

### Azure Storage firewall

When an Azure Storage account is located behind a virtual network, the storage firewall can normally be used to allow your client to directly connect over the internet. However, when using studio, your client doesn't connect to the storage account. The Azure Machine Learning service that makes the request connect to the storage account. The IP address of the service isn't documented, and it changes frequently. __Enabling the storage firewall will not allow studio to access the storage account in a VNet configuration__.

### Azure Storage endpoint type

When the workspace uses a private endpoint, and the storage account is also in the VNet, extra validation requirements arise when using studio:

* If the storage account uses a __service endpoint__, the workspace private endpoint and storage service endpoint must be located in the same subnet of the VNet.
* If the storage account uses a __private endpoint__, the workspace private endpoint and storage private endpoint must be in located in the same VNet. In this case, they can be in different subnets.

## Azure Data Lake Storage Gen1

When using Azure Data Lake Storage Gen1 as a datastore, you can only use POSIX-style access control lists. You can assign the workspace's managed identity access to resources, just like any other security principal. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

## Azure Data Lake Storage Gen2

When using Azure Data Lake Storage Gen2 as a datastore, you can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

__To use Azure RBAC__, follow the steps described in this [Datastore: Azure Storage Account](how-to-enable-studio-virtual-network.md#datastore-azure-storage-account) article section. Data Lake Storage Gen2 is based on Azure Storage, so the same steps apply when using Azure RBAC.

__To use ACLs__, the managed identity of the workspace can be assigned access just like any other security principal. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

## Next steps

For information about enabling studio in a network, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).
