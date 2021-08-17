---
title: Enable Azure Machine Learning studio in a virtual network
titleSuffix: Azure Machine Learning
description: Learn how to configure Azure Machine Learning studio to access data stored inside of a virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 07/13/2021
ms.custom: contperf-fy20q4, tracking-python, security

---

# Use Azure Machine Learning studio in an Azure virtual network

In this article, you learn how to use Azure Machine Learning studio in a virtual network. The studio includes features like AutoML, the designer, and data labeling. 

Some of the studio's features are disabled by default in a virtual network. To re-enable these features, you must enable managed identity for storage accounts you intend to use in the studio. 

The following operations are disabled by default in a virtual network:

* Preview data in the studio.
* Visualize data in the designer.
* Deploy a model in the designer.
* Submit an AutoML experiment.
* Start a labeling project.

The studio supports reading data from the following datastore types in a virtual network:

* Azure Storage Account (blob & file)
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2
* Azure SQL Database

In this article, you learn how to:

> [!div class="checklist"]
> - Give the studio access to data stored inside of a virtual network.
> - Access the studio from a resource inside of a virtual network.
> - Understand how the studio impacts storage security.

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the training environment](how-to-secure-training-vnet.md)
> * [Secure the inference environment](how-to-secure-inferencing-vnet.md)
> * [Use custom DNS](how-to-custom-dns.md)
> * [Use a firewall](how-to-access-azureml-behind-firewall.md)


## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) to understand common virtual network scenarios and architecture.

+ A pre-existing virtual network and subnet to use.

+ An existing [Azure Machine Learning workspace with a private endpoint](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint).

+ An existing [Azure storage account added your virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints).

## Limitations

### Azure Storage Account

There's a known issue where the default file store does not automatically create the `azureml-filestore` folder, which is required to submit AutoML experiments. This occurs when users bring an existing filestore to set as the default filestore during workspace creation.

To avoid this issue, you have two options: 1) Use the default filestore which is automatically created for you doing workspace creation. 2) To bring your own filestore, make sure the filestore is outside of the VNet during workspace creation. After the workspace is created, add the storage account to the virtual network.

To resolve this issue, remove the filestore account from the virtual network then add it back to the virtual network.
## Datastore: Azure Storage Account

Use the following steps to enable access to data stored in Azure Blob and File storage:

> [!TIP]
> The first step is not required for the default storage account for the workspace. All other steps are required for *any* storage account behind the VNet and used by the workspace, including the default storage account.

1. **If the storage account is the *default* storage for your workspace, skip this step**. If it is not the default, **Grant the workspace managed identity the 'Storage Blob Data Reader' role** for the Azure storage account so that it can read data from blob storage.

    For more information, see the [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) built-in role.

1. **Grant the workspace managed identity the 'Reader' role for storage private endpoints**. If your storage service uses a __private endpoint__, grant the workspace-managed identity **Reader** access to the private endpoint. The workspace-managed identity in Azure AD has the same name as your Azure Machine Learning workspace.

    > [!TIP]
    > Your storage account may have multiple private endpoints. For example, one storage account may have separate private endpoint for blob and file storage. Add the managed identity to both endpoints.

    For more information, see the [Reader](../role-based-access-control/built-in-roles.md#reader) built-in role.

   <a id='enable-managed-identity'></a>
1. **Enable managed identity authentication for default storage accounts**. Each Azure Machine Learning workspace has two default storage accounts, a default blob storage account and a default file store account, which are defined when you create your workspace. You can also set new defaults in the **Datastore** management page.

    ![Screenshot showing where default datastores can be found](./media/how-to-enable-studio-virtual-network/default-datastores.png)

    The following table describes why managed identity authentication is used for your workspace default storage accounts.

    |Storage account  | Notes  |
    |---------|---------|
    |Workspace default blob storage| Stores model assets from the designer. Enable managed identity authentication on this storage account to deploy models in the designer. <br> <br> You can visualize and run a designer pipeline if it uses a non-default datastore that has been configured to use managed identity. However, if you try to deploy a trained model without managed identity enabled on the default datastore, deployment will fail regardless of any other datastores in use.|
    |Workspace default file store| Stores AutoML experiment assets. Enable managed identity authentication on this storage account to submit AutoML experiments. |

1. **Configure datastores to use managed identity authentication**. After you add an Azure storage account to your virtual network with a either a [service endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-service-endpoints) or [private endpoint](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts-with-private-endpoints), you must configure your datastore to use [managed identity](../active-directory/managed-identities-azure-resources/overview.md) authentication. Doing so lets the studio access data in your storage account.

    Azure Machine Learning uses [datastores](concept-data.md#datastores) to connect to storage accounts. When creating a new datastore, use the following steps to configure a datastore to use managed identity authentication:

    1. In the studio, select __Datastores__.

    1. To update an existing datastore, select the datastore and select __Update credentials__.

        To create a new datastore, select __+ New datastore__.

    1. In the datastore settings, select __Yes__ for  __Use workspace managed identity for data preview and profiling in Azure Machine Learning studio__.

        ![Screenshot showing how to enable managed workspace identity](./media/how-to-enable-studio-virtual-network/enable-managed-identity.png)

    These steps add the workspace-managed identity as a __Reader__ to the new storage service using Azure RBAC. __Reader__ access allows the workspace to view the resource, but not make changes.

## Datastore: Azure Data Lake Storage Gen1

When using Azure Data Lake Storage Gen1 as a datastore, you can only use POSIX-style access control lists. You can assign the workspace-managed identity access to resources just like any other security principal. For more information, see [Access control in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md).

## Datastore: Azure Data Lake Storage Gen2

When using Azure Data Lake Storage Gen2 as a datastore, you can use both Azure RBAC and POSIX-style access control lists (ACLs) to control data access inside of a virtual network.

**To use Azure RBAC**, add the workspace-managed identity to the [Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role. For more information, see [Azure role-based access control](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control).

**To use ACLs**, the workspace-managed identity can be assigned access just like any other security principal. For more information, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

## Datastore: Azure SQL Database

To access data stored in an Azure SQL Database with a managed identity, you must create a SQL contained user that maps to the managed identity. For more information on creating a user from an external provider, see [Create contained users mapped to Azure AD identities](../azure-sql/database/authentication-aad-configure.md#create-contained-users-mapped-to-azure-ad-identities).

After you create a SQL contained user, grant permissions to it by using the [GRANT T-SQL command](/sql/t-sql/statements/grant-object-permissions-transact-sql).

## Intermediate module output

When using the Azure Machine Learning designer intermediate module output, you can specify the output location for any module in the designer. Use this to store intermediate datasets in separate location for security, logging, or auditing purposes. To specify output, use the following steps:

1. Select the module whose output you'd like to specify.
1. In the module settings pane that appears to the right, select **Output settings**.
1. Specify the datastore you want to use for each module output.

Make sure that you have access to the intermediate storage accounts in your virtual network. Otherwise, the pipeline will fail.

[Enable managed identity authentication](#enable-managed-identity) for intermediate storage accounts to visualize output data.
## Access the studio from a resource inside the VNet

If you are accessing the studio from a resource inside of a virtual network (for example, a compute instance or virtual machine), you must allow outbound traffic from the virtual network to the studio. 

For example, if you are using network security groups (NSG) to restrict outbound traffic, add a rule to a __service tag__ destination of __AzureFrontDoor.Frontend__.

## Firewall settings

Some storage services, such as Azure Storage Account, have firewall settings that apply to the public endpoint for that specific service instance. Usually this setting allows you to allow/disallow access from specific IP addresses from the public internet. __This is not supported__ when using Azure Machine Learning studio. It is supported when using the Azure Machine Learning SDK or CLI.

> [!TIP]
> Azure Machine Learning studio is supported when using the Azure Firewall service. For more information, see [Use your workspace behind a firewall](how-to-access-azureml-behind-firewall.md).
## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
