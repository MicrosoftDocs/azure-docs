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
ms.reviewer: larryfr
ms.date: 01/20/2023
ms.custom: engagement-fy23

# Customer intent: As an administrator, I need to administrate data access and set up authentication method for data scientists.
---

# Data administration


Learn how to manage data access and how to authenticate in Azure Machine Learning
[!INCLUDE [sdk/cli v2](includes/machine-learning-dev-v2.md)]

> [!IMPORTANT]
> The information in this article is intended for Azure administrators who are creating the infrastructure required for an Azure Machine Learning solution.

In general, data access from studio involves the following checks:

* Who is accessing?
    - There are multiple different types of authentication depending on the storage type. For example, account key, token, service principal, managed identity, and user identity.
    - If authentication is made using a user identity, then it's important to know *which* user is trying to access storage. For more information on authenticating a _user_, see [authentication for Azure Machine Learning](how-to-setup-authentication.md). For more information on service-level authentication, see [authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).
* Do they have permission?
    - Are the credentials correct? If so, does the service principal, managed identity, etc., have the necessary permissions on the storage? Permissions are granted using Azure role-based access controls (Azure RBAC).
    - [Reader](../role-based-access-control/built-in-roles.md#reader) of the storage account reads metadata of the storage.
    - [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) reads data within a blob container.
    - [Contributor](../role-based-access-control/built-in-roles.md#contributor) allows write access to a storage account.
    - More roles may be required depending on the type of storage.
* Where is access from?
    - User: Is the client IP address in the VNet/subnet range?
    - Workspace: Is the workspace public or does it have a private endpoint in a VNet/subnet?
    - Storage: Does the storage allow public access, or does it restrict access through a service endpoint or a private endpoint?
* What operation is being performed?
    - Create, read, update, and delete (CRUD) operations on a data store/dataset are handled by Azure Machine Learning.
    - Archive operation on data assets in the Studio requires the following RBAC operation: Microsoft.MachineLearningServices/workspaces/datasets/registered/delete
    - Data Access calls (such as preview or schema) go to the underlying storage and need extra permissions.
* Where is this operation being run; compute resources in your Azure subscription or resources hosted in a Microsoft subscription?
    - All calls to dataset and datastore services (except the "Generate Profile" option) use resources hosted in a __Microsoft subscription__ to run the operations.
    - Jobs, including the "Generate Profile" option for datasets, run on a compute resource in __your subscription__, and access the data from there. So the compute identity needs permission to the storage rather than the identity of the user submitting the job.

The following diagram shows the general flow of a data access call. In this example, a user is trying to make a data access call through a machine learning workspace, without using any compute resource.

:::image type="content" source="./media/concept-network-data-access/data-access-flow.svg" alt-text="Diagram of the logic flow when accessing data.":::

## Scenarios and identities

The following table lists what identities should be used for specific scenarios:

| Scenario | Use workspace</br>Managed Service Identity (MSI) | Identity to use |
|--|--|--|
| Access from UI | Yes | Workspace MSI |
| Access from UI | No | User's Identity |
| Access from Job | Yes/No | Compute MSI |
| Access from Notebook | Yes/No | User's identity |


Data access is complex and it's important to recognize that there are many pieces to it. For example, accessing data from Azure Machine Learning studio is different than using the SDK. When using the SDK on your local development environment, you're directly accessing data in the cloud. When using studio, you aren't always directly accessing the data store from your client. Studio relies on the workspace to access data on your behalf.

> [!TIP]
> If you need to access data from outside Azure Machine Learning, such as using Azure Storage Explorer, *user* identity is probably what is used. Consult the documentation for the tool or service you are using for specific information. For more information on how Azure Machine Learning works with data, see [Setup authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).

## Azure Storage Account

When using an Azure Storage Account from Azure Machine Learning studio, you must add the managed identity of the workspace to the following Azure RBAC roles for the storage account:

* [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader)
* If the storage account uses a private endpoint to connect to the VNet, you must grant the managed identity the [Reader](../role-based-access-control/built-in-roles.md#reader) role for the storage account private endpoint.

For more information, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).

See the following sections for information on limitations when using Azure Storage Account with your workspace in a VNet.

### Secure communication with Azure Storage Account 

To secure communication between Azure Machine Learning and Azure Storage Accounts, configure storage to [Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

### Azure Storage firewall

When an Azure Storage account is behind a virtual network, the storage firewall can normally be used to allow your client to directly connect over the internet. However, when using studio it isn't your client that connects to the storage account; it's the Azure Machine Learning service that makes the request. The IP address of the service isn't documented and changes frequently. __Enabling the storage firewall will not allow studio to access the storage account in a VNet configuration__.

### Azure Storage endpoint type

When the workspace uses a private endpoint and the storage account is also in the VNet, there are extra validation requirements when using studio:

* If the storage account uses a __service endpoint__, the workspace private endpoint and storage service endpoint must be in the same subnet of the VNet.
* If the storage account uses a __private endpoint__, the workspace private endpoint and storage private endpoint must be in the same VNet. In this case, they can be in different subnets.

## Azure Data Lake Storage Gen1

When using Azure Data Lake Storage Gen1 as a datastore, you can only use POSIX-style access control lists. You can assign the workspace's managed identity access to resources just like any other security principal. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

## Azure Data Lake Storage Gen2

When using Azure Data Lake Storage Gen2 as a datastore, you can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

__To use Azure RBAC__, follow the steps in the [Datastore: Azure Storage Account](how-to-enable-studio-virtual-network.md#datastore-azure-storage-account) section of the 'Use Azure Machine Learning studio in an Azure Virtual Network' article. Data Lake Storage Gen2 is based on Azure Storage, so the same steps apply when using Azure RBAC.

__To use ACLs__, the managed identity of the workspace can be assigned access just like any other security principal. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).


## Next steps

For information on enabling studio in a network, see [Use Azure Machine Learning studio in an Azure Virtual Network](how-to-enable-studio-virtual-network.md).
