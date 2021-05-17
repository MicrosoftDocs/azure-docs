---
title: Enable Azure Machine Learning studio in a virtual network
titleSuffix: Azure Machine Learning
description: Learn how to configure Azure Machine Learning studio to access data stored inside of a virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 10/21/2020
ms.custom: contperf-fy20q4, tracking-python

---

# Use Azure Machine Learning studio in an Azure virtual network

In this article, you learn how to use Azure Machine Learning studio in a virtual network. The studio includes features like AutoML, the designer, and data labeling. In order to use those features in a virtual network, you must follow the steps in this article.

In this article, you learn how to:

> [!div class="checklist"]
> - Give the studio access to data stored inside of a virtual network.
> - Access the studio from a resource inside of a virtual network.
> - Understand how the studio impacts storage security.

This article is part five of a five-part series that walks you through securing an Azure Machine Learning workflow. We highly recommend that you read through the previous parts to set up a virtual network environment.

See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > [2. Secure the workspace](how-to-secure-workspace-vnet.md) > [3. Secure the training environment](how-to-secure-training-vnet.md) > [4. Secure the inferencing environment](how-to-secure-inferencing-vnet.md) > **5. Enable studio functionality**


> [!IMPORTANT]
> If your workspace is in a __sovereign cloud__, such as Azure Government or Azure China 21Vianet, integrated notebooks _do not_ support using storage that is in a virtual network. Instead, you can use Jupyter Notebooks from a compute instance. For more information, see the [Access data in a Compute Instance notebook](how-to-secure-training-vnet.md#access-data-in-a-compute-instance-notebook) section.

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) to understand common virtual network scenarios and architecture.

+ A pre-existing virtual network and subnet to use.

+ An existing [Azure Machine Learning workspace with Private Link enabled](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint).

+ An existing [Azure storage account added your virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints).

## Configure data access in the studio

Some of the studio's features are disabled by default in a virtual network. To re-enable these features, you must enable managed identity for storage accounts you intend to use in the studio. 

The following operations are disabled by default in a virtual network:

* Preview data in the studio.
* Visualize data in the designer.
* Deploy a model in the designer ([default storage account](#enable-managed-identity-authentication-for-default-storage-accounts)).
* Submit an AutoML experiment ([default storage account](#enable-managed-identity-authentication-for-default-storage-accounts)).
* Start a labeling project.

The studio supports reading data from the following datastore types in a virtual network:

* Azure Blob
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2
* Azure SQL Database

### Configure datastores to use workspace-managed identity

After you add an Azure storage account to your virtual network with a either a [service endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints) or [private endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-private-endpoints), you must configure your datastore to use [managed identity](../active-directory/managed-identities-azure-resources/overview.md) authentication. Doing so lets the studio access data in your storage account.

Azure Machine Learning uses [datastores](concept-data.md#datastores) to connect to storage accounts. Use the following steps to configure a datastore to use managed identity:

1. In the studio, select __Datastores__.

1. To update an existing datastore, select the datastore and select __Update credentials__.

    To create a new datastore, select __+ New datastore__.

1. In the datastore settings, select __Yes__ for  __Use workspace managed identity for data preview and profiling in Azure Machine Learning studio__.

    ![Screenshot showing how to enable managed workspace identity](./media/how-to-enable-studio-virtual-network/enable-managed-identity.png)

These steps add the workspace-managed identity as a __Reader__ to the storage service using Azure RBAC. __Reader__ access lets the workspace retrieve firewall settings to ensure that data doesn't leave the virtual network. Changes may take up to 10 minutes to take effect.

### Enable managed identity authentication for default storage accounts

Each Azure Machine Learning workspace has two default storage accounts, a default blob storage account and a default file store account, which are defined when you create your workspace. You can also set new defaults in the **Datastore** management page.

![Screenshot showing where default datastores can be found](./media/how-to-enable-studio-virtual-network/default-datastores.png)

The following table describes why you must enable managed identity authentication for your workspace default storage accounts.

|Storage account  | Notes  |
|---------|---------|
|Workspace default blob storage| Stores model assets from the designer. You must enable managed identity authentication on this storage account to deploy models in the designer. <br> <br> You can visualize and run a designer pipeline if it uses a non-default datastore that has been configured to use managed identity. However, if you try to deploy a trained model without managed identity enabled on the default datastore, deployment will fail regardless of any other datastores in use.|
|Workspace default file store| Stores AutoML experiment assets. You must enable managed identity authentication on this storage account to submit AutoML experiments. |

> [!WARNING]
> There's a known issue where the default file store does not automatically create the `azureml-filestore` folder, which is required to submit AutoML experiments. This occurs when users bring an existing filestore to set as the default filestore during workspace creation.
> 
> To avoid this issue, you have two options: 1) Use the default filestore which is automatically created for you doing workspace creation. 2) To bring your own filestore, make sure the filestore is outside of the VNet during workspace creation. After the workspace is created, add the storage account to the virtual network.
>
> To resolve this issue, remove the filestore account from the virtual network then add it back to the virtual network.

### Grant workspace managed identity __Reader__ access to storage private link

If your Azure storage account uses a private endpoint, you must grant the workspace-managed identity **Reader** access to the private link. For more information, see the [Reader](../role-based-access-control/built-in-roles.md#reader) built-in role. 

If your storage account uses a service endpoint, you can skip this step.

## Access the studio from a resource inside the VNet

If you are accessing the studio from a resource inside of a virtual network (for example, a compute instance or virtual machine), you must allow outbound traffic from the virtual network to the studio. 

For example, if you are using network security groups (NSG) to restrict outbound traffic, add a rule to a __service tag__ destination of __AzureFrontDoor.Frontend__.

## Technical notes for managed identity

Using managed identity to access storage services impacts security considerations. This section describes the changes for each storage account type. 

These considerations are unique to the __type of storage account__ you are accessing.

### Azure Blob storage

For __Azure Blob storage__, the workspace-managed identity is also added as a [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) so that it can read data from blob storage.

### Azure Data Lake Storage Gen2 access control

You can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

To use Azure RBAC, add the workspace-managed identity to the [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role. For more information, see [Azure role-based access control](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control).

To use ACLs, the workspace-managed identity can be assigned access just like any other security principle. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

### Azure Data Lake Storage Gen1 access control

Azure Data Lake Storage Gen1 only supports POSIX-style access control lists. You can assign the workspace-managed identity access to resources just like any other security principle. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

### Azure SQL Database contained user

To access data stored in an Azure SQL Database using managed identity, you must create a SQL contained user that maps to the managed identity. For more information on creating a user from an external provider, see [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities).

After you create a SQL contained user, grant permissions to it by using the [GRANT T-SQL command](/sql/t-sql/statements/grant-object-permissions-transact-sql).

### Azure Machine Learning designer intermediate module output

You can specify the output location for any module in the designer. Use this to store intermediate datasets in separate location for security, logging, or auditing purposes. To specify output:

1. Select the module whose output you'd like to specify.
1. In the module settings pane that appears to the right, select **Output settings**.
1. Specify the datastore you want to use for each module output.
 
Make sure that you have access to the intermediate storage accounts in your virtual network. Otherwise, the pipeline will fail.

You should also [enable managed identity authentication](#configure-datastores-to-use-workspace-managed-identity) for intermediate storage accounts to visualize output data.

## Next steps

This article is part five of a five-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)

Also see the article on using [custom DNS](how-to-custom-dns.md) for name resolution.