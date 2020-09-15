---
title: Secure an Azure Machine Learning workspace with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning workspace and associated resources.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 07/07/2020
ms.topic: conceptual
ms.custom: how-to, contperfq4, tracking-python

---

# Secure an Azure Machine Learning workspace with virtual networks
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to secure an Azure Machine Learning workspace and its associated resources in a virtual network.


This article is part two of a five-part series that walks you through securing an Azure Machine Learning workflow. We highly recommend that you read through [Part one: VNet overview](how-to-network-security-overview.md) to understand the overall architecture first. 

See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > **2. Secure the workspace** > [3. Secure the training environment](how-to-secure-training-vnet.md) > [4. Secure the inferencing environment](how-to-secure-inferencing-vnet.md) > [5. Enable studio functionality](how-to-enable-studio-virtual-network.md)

In this article you learn how to enable the following workspaces resources in a virtual network:
> [!div class="checklist"]
> - Azure Machine Learning workspace
> - Azure Storage accounts
> - Azure Machine Learning datastores and datasets
> - Azure Key Vault
> - Azure Container Registry

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources.

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access controls (RBAC):

    - "Microsoft.Network/virtualNetworks/join/action" on the virtual network resource.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on RBAC with networking, see the [Networking built-in roles](/azure/role-based-access-control/built-in-roles#networking)


## Secure the workspace with private endpoint

Azure Private Link lets you connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. Private Link helps reduce the risk of data exfiltration.

For more information on setting up a Private Link workspace, see [How to configure Private Link](how-to-configure-private-link.md).


## Secure Azure storage accounts

In this section, you learn how to secure an Azure storage account using service endpoints. However, you can also use private endpoints to secure Azure storage. For more information, see [Use private endpoints for Azure Storage](../storage/common/storage-private-endpoints.md).

> [!IMPORTANT]
> You can place the both the _default storage account_ for Azure Machine Learning, or _non-default storage accounts_ in a virtual network.
>
> The default storage account is automatically provisioned when you create a workspace.
>
> For non-default storage accounts, the `storage_account` parameter in the [`Workspace.create()` function](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-) allows you to specify a custom storage account by Azure resource ID.

To use an Azure storage account for the workspace in a virtual network, use the following steps:

1. In the Azure portal, go to the storage service you want to use in your workspace.

   [![The storage that's attached to the Azure Machine Learning workspace](./media/how-to-enable-virtual-network/workspace-storage.png)](./media/how-to-enable-virtual-network/workspace-storage.png#lightbox)

1. On the storage service account page, select __Firewalls and virtual networks__.

   ![The "Firewalls and virtual networks" area on the Azure Storage page in the Azure portal](./media/how-to-enable-virtual-network/storage-firewalls-and-virtual-networks.png)

1. On the __Firewalls and virtual networks__ page, do the following actions:
    1. Select __Selected networks__.
    1. Under __Virtual networks__, select the __Add existing virtual network__ link. This action adds the virtual network where your compute resides (see step 1).

        > [!IMPORTANT]
        > The storage account must be in the same virtual network and subnet as the compute instances or clusters used for training or inference.

    1. Select the __Allow trusted Microsoft services to access this storage account__ check box.

    > [!IMPORTANT]
    > When working with the Azure Machine Learning SDK, your development environment must be able to connect to the Azure Storage Account. When the storage account is inside a virtual network, the firewall must allow access from the development environment's IP address.
    >
    > To enable access to the storage account, visit the __Firewalls and virtual networks__ for the storage account *from a web browser on the development client*. Then use the __Add your client IP address__ check box to add the client's IP address to the __ADDRESS RANGE__. You can also use the __ADDRESS RANGE__ field to manually enter the IP address of the development environment. Once the IP address for the client has been added, it can access the storage account using the SDK.

   [![The "Firewalls and virtual networks" pane in the Azure portal](./media/how-to-enable-virtual-network/storage-firewalls-and-virtual-networks-page.png)](./media/how-to-enable-virtual-network/storage-firewalls-and-virtual-networks-page.png#lightbox)

## Secure datastores and datasets

In this section, you learn how to use datastore and dataset usage for the SDK experience in a virtual network. For more information on the studio experience, see [Use Azure Machine Learning studio in a virtual network](how-to-enable-studio-virtual-network.md).

To access the data using SDK, you must use the authentication method required by the individual service that the data is stored in. For example, if you register a datastore to access Azure Data Lake Store Gen2, you must still use a service principal as documented in [Connect to Azure storage services](how-to-access-data.md#azure-data-lake-storage-generation-2).

### Disable data validation

By default, Azure Machine Learning performs data validity and credential checks when you attempt to access data using the SDK. If the data is behind a virtual network, Azure Machine Learning can't complete these checks. To avoid this, you must create datastores and datasets that skip validation.

### Use datastores

 Azure Data Lake Store Gen1 and Azure Data Lake Store Gen2 skip validation by default, so no further action is necessary. However, for the following services you can use similar syntax to skip datastore validation:

- Azure Blob storage
- Azure fileshare
- PostgreSQL
- Azure SQL Database

The following code sample creates a new Azure Blob datastore and sets `skip_validation=True`.

```python
blob_datastore = Datastore.register_azure_blob_container(workspace=ws,  

                                                         datastore_name=blob_datastore_name,  

                                                         container_name=container_name,  

                                                         account_name=account_name, 

                                                         account_key=account_key, 

                                                         skip_validation=True ) // Set skip_validation to true
```

### Use datasets

The syntax to skip dataset validation is similar for the following dataset types:
- Delimited file
- JSON 
- Parquet
- SQL
- File

The following code creates a new JSON dataset and sets `validate=False`.

```python
json_ds = Dataset.Tabular.from_json_lines_files(path=datastore_paths, 

validate=False) 

```

## Secure Azure Key Vault

Azure Machine Learning uses an associated Key Vault instance to store the following credentials:
* The associated storage account connection string
* Passwords to Azure Container Repository instances
* Connection strings to data stores

To use Azure Machine Learning experimentation capabilities with Azure Key Vault behind a virtual network, use the following steps:

1. Go to the Key Vault that's associated with the workspace.

1. On the __Key Vault__ page, in the left pane, select __Networking__.

1. On the __Firewalls and virtual networks__ tab, do the following actions:
    1. Under __Allow access from__, select __Private endpoint and selected networks__.
    1. Under __Virtual networks__, select __Add existing virtual networks__ to add the virtual network where your experimentation compute resides.
    1. Under __Allow trusted Microsoft services to bypass this firewall?__, select __Yes__.

   [![The "Firewalls and virtual networks" section in the Key Vault pane](./media/how-to-enable-virtual-network/key-vault-firewalls-and-virtual-networks-page.png)](./media/how-to-enable-virtual-network/key-vault-firewalls-and-virtual-networks-page.png#lightbox)

## Enable Azure Container Registry (ACR)

To use Azure Container Registry inside a virtual network, you must meet the following requirements:

* Your Azure Machine Learning workspace must be Enterprise edition. For information on upgrading, see [Upgrade to Enterprise edition](how-to-manage-workspace.md#upgrade).

* Your Azure Container Registry must be Premium version. For more information on upgrading, see [Changing SKUs](/azure/container-registry/container-registry-skus#changing-skus).

* Your Azure Container Registry must be in the same virtual network and subnet as the storage account and compute targets used for training or inference.

* Your Azure Machine Learning workspace must contain an [Azure Machine Learning compute cluster](how-to-create-attach-compute-sdk.md#amlcompute).

    When ACR is behind a virtual network, Azure Machine Learning cannot use it to directly build Docker images. Instead, the compute cluster is used to build the images.

Once those requirements are fulfilled, use the following steps to enable Azure Container Registry.

1. Find the name of the Azure Container Registry for your workspace, using one of the following methods:

    __Azure portal__

    From the overview section of your workspace, the __Registry__ value links to the Azure Container Registry.

    :::image type="content" source="./media/how-to-enable-virtual-network/azure-machine-learning-container-registry.png" alt-text="Azure Container Registry for the workspace" border="true":::

    __Azure CLI__

    If you have [installed the Machine Learning extension for Azure CLI](reference-azure-machine-learning-cli.md), you can use the `az ml workspace show` command to show the workspace information.

    ```azurecli-interactive
    az ml workspace show -w yourworkspacename -g resourcegroupname --query 'containerRegistry'
    ```

    This command returns a value similar to `"/subscriptions/{GUID}/resourceGroups/{resourcegroupname}/providers/Microsoft.ContainerRegistry/registries/{ACRname}"`. The last part of the string is the name of the Azure Container Registry for the workspace.

1. Limit access to your virtual network using the steps in [Configure network access for registry](../container-registry/container-registry-vnet.md#configure-network-access-for-registry). When adding the virtual network, select the virtual network and subnet for your Azure Machine Learning resources.

1. Use the Azure Machine Learning Python SDK to configure a compute cluster to build docker images. The following code snippet demonstrates how to do this:

    ```python
    from azureml.core import Workspace
    # Load workspace from an existing config file
    ws = Workspace.from_config()
    # Update the workspace to use an existing compute cluster
    ws.update(image_build_compute = 'mycomputecluster')
    ```

    > [!IMPORTANT]
    > Your storage account, compute cluster, and Azure Container Registry must all be in the same subnet of the virtual network.
    
    For more information, see the [update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#update-friendly-name-none--description-none--tags-none--image-build-compute-none--enable-data-actions-none-) method reference.

1. Apply the following Azure Resource Manager template. This template enables your workspace to communicate with ACR.

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "keyVaultArmId": {
        "type": "string"
        },
        "workspaceName": {
        "type": "string"
        },
        "containerRegistryArmId": {
        "type": "string"
        },
        "applicationInsightsArmId": {
        "type": "string"
        },
        "storageAccountArmId": {
        "type": "string"
        },
        "location": {
        "type": "string"
        }
    },
    "resources": [
        {
        "type": "Microsoft.MachineLearningServices/workspaces",
        "apiVersion": "2019-11-01",
        "name": "[parameters('workspaceName')]",
        "location": "[parameters('location')]",
        "identity": {
            "type": "SystemAssigned"
        },
        "sku": {
            "tier": "enterprise",
            "name": "enterprise"
        },
        "properties": {
            "sharedPrivateLinkResources":
    [{"Name":"Acr","Properties":{"PrivateLinkResourceId":"[concat(parameters('containerRegistryArmId'), '/privateLinkResources/registry')]","GroupId":"registry","RequestMessage":"Approve","Status":"Pending"}}],
            "keyVault": "[parameters('keyVaultArmId')]",
            "containerRegistry": "[parameters('containerRegistryArmId')]",
            "applicationInsights": "[parameters('applicationInsightsArmId')]",
            "storageAccount": "[parameters('storageAccountArmId')]"
        }
        }
    ]
    }
    ```

## Next steps

This article is part one of a four-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)
* [Part 5:Enable studio functionality](how-to-enable-studio-virtual-network.md)