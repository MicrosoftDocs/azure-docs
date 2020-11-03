---
title: Enable Azure Machine Learning studio in a virtual network
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning studio to access data stored inside of a virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 10/21/2020
ms.custom: contperfq4, tracking-python

---

# Use Azure Machine Learning studio in an Azure virtual network

In this article, you learn how to use Azure Machine Learning studio in a virtual network. You learn how to:

> [!div class="checklist"]
> - Access the studio from a resource inside of a virtual network.
> - Configure private endpoints for storage accounts.
> - Give the studio access to data stored inside of a virtual network.
> - Understand how the studio impacts storage security.

This article is part five of a five-part series that walks you through securing an Azure Machine Learning workflow. We highly recommend that you read through [Part one: VNet overview](how-to-network-security-overview.md) to understand the overall architecture first. 

See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > [2. Secure the workspace](how-to-secure-workspace-vnet.md) > [3. Secure the training environment](how-to-secure-training-vnet.md) > [4. Secure the inferencing environment](how-to-secure-inferencing-vnet.md) > **5. Enable studio functionality**


> [!IMPORTANT]
> If your workspace is in a __sovereign cloud__, such as Azure Government or Azure China 21Vianet, integrated notebooks _do not_ support using storage that is in a virtual network. Instead, you can use Jupyter Notebooks from a compute instance. For more information, see the [Access data in a Compute Instance notebook](how-to-secure-training-vnet.md#access-data-in-a-compute-instance-notebook) section.


## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) to understand common virtual network scenarios and overall virtual network architecture.

+ A pre-existing virtual network and subnet to use.

+ An existing [Azure Machine Learning workspace with Private Link enabled](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint).

+ An existing [Azure storage account added your virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints).

## Access the studio from a resource inside the VNet

If you are accessing the studio from a resource inside of a virtual network (for example, a compute instance or virtual machine), you must allow outbound traffic from the virtual network to the studio. 

For example, if you are using network security groups (NSG) to restrict outbound traffic, add a rule to a __service tag__ destination of __AzureFrontDoor.Frontend__.

## Access data using the studio

After you add an Azure storage account to your virtual network with a [service endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints) or [private endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-private-endpoints), you must configure your storage account to use [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to grant the studio access to your data.

If you do not enable managed identity, you will receive this error, `Error: Unable to profile this dataset. This might be because your data is stored behind a virtual network or your data does not support profile.` Additionally, the following operations will be disabled:

* Preview data in the studio.
* Visualize data in the designer.
* Submit an AutoML experiment.
* Start a labeling project.

The studio supports reading data from the following datastore types in a virtual network:

* Azure Blob
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2
* Azure SQL Database

### Grant workspace managed identity __Reader__ access to storage private link

This step is only required if you added the Azure storage account to your virtual network with a [private endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-private-endpoints). For more information, see the [Reader](../role-based-access-control/built-in-roles.md#reader) built-in role.

### Configure datastores to use workspace managed identity

Azure Machine Learning uses [datastores](concept-data.md#datastores) to connect to storage accounts. Use the following steps to configure your datastores to use managed identity. 

1. In the studio, select __Datastores__.

1. To create a new datastore, select __+ New datastore__.

    To update an existing datastore, select the datastore and select __Update credentials__.

1. In the datastore settings, select __Yes__ for  __Allow Azure Machine Learning service to access the storage using workspace-managed identity__.


These steps add the workspace-managed identity as a __Reader__ to the storage service using Azure resource-based access control (Azure RBAC). __Reader__ access lets the workspace retrieve firewall settings, and ensure that data doesn't leave the virtual network.

> [!NOTE]
> These changes may take up to 10 minutes to take effect.

## Technical notes for managed identity

Using managed identity to access storage services impacts some security considerations. These considerations are unique to the type of storage account you are accessing. This section describes the changes for each storage account type.

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

### Azure Machine Learning designer default datastore

The designer uses the storage account attached to your workspace to store output by default. However, you can specify it to store output to any datastore that you have access to. If your environment uses virtual networks, you can use these controls to ensure your data remains secure and accessible.

To set a new default storage for a pipeline:

1. In a pipeline draft, select the **Settings gear icon** near the title of your pipeline.
1. Select the **Select default datastore**.
1. Specify a new datastore.

You can also override the default datastore on a per-module basis. This gives you control over the storage location for each individual module.

1. Select the module whose output you want to specify.
1. Expand the **Output settings** section.
1. Select **Override default output settings**.
1. Select **Set output settings**.
1. Specify a new datastore.

## Next steps

This article is an optional part of a four-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)