---
title: Administer data authentication
titleSuffix: Azure Machine Learning
description: Learn how to manage data access and how to authenticate in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: xunwan
author: SturgeonMi
ms.reviewer: franksolomon
ms.date: 09/26/2023
ms.custom: engagement-fy23

# Customer intent: As an administrator, I need to administer data access and set up authentication methods for data scientists.
---

# Data administration

Learn how to manage data access and how to authenticate in Azure Machine Learning.
[!INCLUDE [sdk/cli v2](includes/machine-learning-dev-v2.md)]

> [!IMPORTANT]
> This article is intended for Azure administrators who want to create the required infrastructure for an Azure Machine Learning solution.

## Credential-based data authentication

In general, credential-based data authentication involves these checks:
* Has the user who is accessing data from the credential-based datastore been assigned a role with role-based access control (RBAC) that contains `Microsoft.MachineLearningServices/workspaces/datastores/listsecrets/action`?
    - This permission is required to retrieve credentials from the datastore for the user.
    - Built-in roles that contain this permission already are [Contributor](../role-based-access-control/built-in-roles/general.md#contributor), Azure AI Developer, or [Azure Machine Learning Data Scientist](../role-based-access-control/built-in-roles/ai-machine-learning.md#azureml-data-scientist). Alternatively, if a custom role is applied, you need to ensure that this permission is added to that custom role.
    - You must know *which* specific user is trying to access the data. It can be a real user with a user identity or a computer with compute managed identity (MSI). See the section [Scenarios and authentication options](#scenarios-and-authentication-options) to identify the identity for which you need to add permission.

* Does the stored credential (service principal, account key, or shared access signature token) have access to the data resource?

## Identity-based data authentication

In general, identity-based data authentication involves these checks:

* Which user wants to access the resources?
    - Depending on the context when the data is being accessed, different types of authentication are available, for example:
      -  User identity
      -  Compute managed identity
      -  Workspace managed identity
    - Jobs, including the dataset `Generate Profile` option, run on a compute resource in *your subscription*, and access the data from that location. The compute managed identity needs permission to the storage resource, instead of the identity of the user who submitted the job.
    - For authentication based on a user identity, you must know *which* specific user tried to access the storage resource. For more information about *user* authentication, see [Authentication for Azure Machine Learning](how-to-setup-authentication.md). For more information about service-level authentication, see [Authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).
* Does this user have permission for reading?
    - Does the user identity or the compute managed identity have the necessary permissions for that storage resource? Permissions are granted by using Azure RBAC.
    - The storage account [Reader](../role-based-access-control/built-in-roles.md#reader) reads the storage metadata.
    - The [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) reads and lists storage containers and blobs.
    - For more information, see [Azure built-in roles for storage](../role-based-access-control/built-in-roles/storage.md).
* Does this user have permission for writing?
    - Does the user identity or the compute managed identity have the necessary permissions for that storage resource? Permissions are granted by using Azure RBAC.
    - The storage account [Reader](../role-based-access-control/built-in-roles.md#reader) reads the storage metadata.
    - The [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) reads, writes, and deletes Azure Storage containers and blobs.
    - For more information, see [Azure built-in roles for storage](../role-based-access-control/built-in-roles/storage.md).

## Other general checks for authentication

* Where does the access come from?
    - **User**: Is the client IP address in the virtual network/subnet range?
    - **Workspace**: Is the workspace public, or does it have a private endpoint in a virtual network/subnet?
    - **Storage**: Does the storage allow public access, or does it restrict access through a service endpoint or a private endpoint?
* What operation will be performed?
    - Azure Machine Learning handles create, read, update, and delete (CRUD) operations on a data store/dataset.
    - Archive operations on data assets in Azure Machine Learning studio require this RBAC operation: `Microsoft.MachineLearningServices/workspaces/datasets/registered/delete`
    - Data access calls (for example, preview or schema) go to the underlying storage and need extra permissions.
* Will this operation run in your Azure subscription compute resources or resources hosted in a Microsoft subscription?
    - All calls to dataset and datastore services (except the `Generate Profile` option) use resources hosted in a *Microsoft subscription* to run the operations.
    - Jobs, including the dataset `Generate Profile` option, run on a compute resource in *your subscription* and access the data from that location. The compute identity needs permission to the storage resource, instead of the identity of the user who submitted the job.

This diagram shows the general flow of a data access call. Here, a user tries to make a data access call through a Machine Learning workspace, without using a compute resource.

:::image type="content" source="./media/concept-network-data-access/data-access-flow.svg" alt-text="Diagram that shows the logic flow when accessing data.":::

## Scenarios and authentication options

This table lists the identities to use for specific scenarios.

| Configuration | SDK local/notebook virtual machine | Job | Dataset Preview | Datastore browse |
| -- | -- | -- | -- | -- |
| Credential + Workspace MSI | Credential | Credential | Workspace MSI | Credential (only account key and shared access signature token) |
| No Credential + Workspace MSI | Compute MSI/User identity | Compute MSI/User identity | Workspace MSI | User identity |
| Credential + No Workspace MSI | Credential | Credential | Credential (not supported for Dataset Preview under private network) | Credential (only account key and shared access signature token) |
| No Credential + No Workspace MSI | Compute MSI/User identity | Compute MSI/User identity | User identity | User identity |

For SDK V1, data authentication in a job always uses compute MSI. For SDK V2, data authentication in a job depends on the job setting. It can be user identity or compute MSI based on your setting.

> [!TIP]
> To access data from outside Machine Learning, for example, with Azure Storage Explorer, that access probably relies on the *user* identity. For specific information, review the documentation for the tool or service you're using. For more information about how Machine Learning works with data, see [Set up authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).

## Virtual network specific requirements

The following information helps you set up data authentication to access data behind a virtual network from a Machine Learning workspace.

### Add permissions of a storage account to a Machine Learning workspace managed identity

When you use a storage account from the studio, if you want to see Dataset Preview, you must enable **Use workspace managed identity for data preview and profiling in Azure Machine Learning studio** in the datastore setting. Then add the following Azure RBAC roles of the storage account to the workspace managed identity:

* [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader)
* If the storage account uses a private endpoint to connect to the virtual network, you must grant the [Reader](../role-based-access-control/built-in-roles.md#reader) role for the storage account private endpoint to the managed identity.

For more information, see [Use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md).

The following sections explain the limitations of using a storage account, with your workspace, in a virtual network.

### Secure communication with a storage account

To secure communication between Machine Learning and storage accounts, configure the storage to [grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

### Azure Storage firewall

When a storage account is located behind a virtual network, the storage firewall can normally be used to allow your client to directly connect over the internet. However, when you use the studio, your client doesn't connect to the storage account. The Machine Learning service that makes the request connects to the storage account. The IP address of the service isn't documented, and it changes frequently. Enabling the storage firewall won't allow the studio to access the storage account in a virtual network configuration.

### Azure Storage endpoint type

When the workspace uses a private endpoint, and the storage account is also in the virtual network, extra validation requirements arise when you use the studio:

* If the storage account uses a *service endpoint*, the workspace private endpoint and storage service endpoint must be located in the same subnet of the virtual network.
* If the storage account uses a *private endpoint*, the workspace private endpoint and storage private endpoint must be in located in the same virtual network. In this case, they can be in different subnets.

## Azure Data Lake Storage Gen1

When you use Azure Data Lake Storage Gen1 as a datastore, you can only use POSIX-style access control lists. You can assign the workspace's managed identity access to resources, like any other security principal. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

## Azure Data Lake Storage Gen2

When you use Azure Data Lake Storage Gen2 as a datastore, you can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside a virtual network.

- **To use Azure RBAC**: Follow the steps described in [Datastore: Azure Storage account](how-to-enable-studio-virtual-network.md#datastore-azure-storage-account). Data Lake Storage Gen2 is based on Azure Storage, so the same steps apply when you use Azure RBAC.
- **To use ACLs**: The managed identity of the workspace can be assigned access like any other security principal. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

## Next steps

For information about how to enable the studio in a network, see [Use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md).
