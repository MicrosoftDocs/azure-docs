---
title: Create and manage registries
titleSuffix: Azure Machine Learning
description: Learn how create registries with the CLI, REST API, Azure portal and Azure Machine Learning studio 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: kritifaujdar
author: fkriti
ms.reviewer: larryfr
ms.date: 08/24/2023
ms.topic: how-to
ms.custom: ignite-2022, build-2023
---

# Manage Azure Machine Learning registries

Azure Machine Learning entities can be grouped into two broad categories:

* Assets such as __models__, __environments__, __components__, and __datasets__ are durable entities that are _workspace agnostic_. For example, a model can be registered with any workspace and deployed to any endpoint. 
* Resources such as __compute__, __job__, and __endpoints__ are _transient entities that are workspace specific_. For example, an online endpoint has a scoring URI that is unique to a specific instance in a specific workspace. Similarly, a job runs for a known duration and generates logs and metrics each time it's run. 

Assets lend themselves to being stored in a central repository and used in different workspaces, possibly in different regions. Resources are workspace specific. 

Azure Machine Learning registries enable you to create and use those assets in different workspaces. Registries support multi-region replication for low latency access to assets, so you can use assets in workspaces located in different Azure regions. Creating a registry provisions Azure resources required to facilitate replication. First, Azure blob storage accounts in each supported region. Second, a single Azure Container Registry with replication enabled to each supported region. 

:::image type="content" source="./media/how-to-manage-registries/machine-learning-registry-block-diagram.png" alt-text="Diagram of the relationships between assets in workspace and registry.":::

## Prerequisites

[!INCLUDE [CLI v2 preres](includes/machine-learning-cli-prereqs.md)]

[!INCLUDE [CLI v2 update](./includes/new-feature-cli.md)]

## Prepare to create registry

You need to decide the following information carefully before proceeding to create a registry:

### Choose a name

Consider the following factors before picking a name.
* Registries are meant to facilitate sharing of ML assets across teams within your organization across all workspaces. Choose a name that is reflective of the sharing scope. The name should help identify your group, division or organization. 
* Registry name is unique with your organization (Microsoft Entra tenant). It's recommended to prefix your team or organization name and avoid generic names. 
* Registry names can't be changed once created because they're used in IDs of models, environments and components that are referenced in code. 
  * Length can be 2-32 characters. 
  * Alphanumerics, underscore, hyphen are allowed. No other special characters. No spaces - registry names are part of model, environment, and component IDs that can be referenced in code.  
  * Name can contain underscore or hyphen but can't start with an underscore or hyphen. Needs to start with an alphanumeric. 

### Choose Azure regions 

Registries enable sharing of assets across workspaces. To do so, a registry replicates content across multiple Azure regions. You need to define the list of regions that a registry supports when creating the registry. Create a list of all regions in which you have workspaces today and plan to add in near future. This list is a good set of regions to start with. When creating a registry, you define a primary region and a set of additional regions. The primary region can't be changed after registry creation, but the additional regions can be updated at a later point.

### Check permissions

Make sure you're the "Owner" or "Contributor" of the subscription or resource group in which you plan to create the registry. If you don't have one of these built-in roles, review the section on permissions toward the end of this article. 


## Create a registry

# [Azure CLI](#tab/cli)

Create the YAML definition and name it `registry.yml`.

> [!NOTE]
> The primary location is listed twice in the YAML file. In the following example, `eastus` is listed first as the primary location (`location` item) and also in the `replication_locations` list. 

```YAML
name: DemoRegistry1
tags:
  description: Basic registry with one primary region and to additional regions
  foo: bar
location: eastus
replication_locations:
  - location: eastus
  - location: eastus2
  - location: westus
```

For more information on the structure of the YAML file, see the [registry YAML reference](reference-yaml-registry.md) article.

> [!TIP]
> You typically see display names of Azure regions such as 'East US' in the Azure Portal but the registry creation YAML needs names of regions without spaces and lower case letters. Use `az account list-locations -o table` to find the mapping of region display names to the name of the region that can be specified in YAML.

Run the registry create command.

`az ml registry create --file registry.yml`

# [Azure Machine Learning studio](#tab/studio)

You can create registries in Azure Machine Learning studio using the following steps:

1. In the [Azure Machine Learning studio](https://ml.azure.com), select the __Registries__, and then __Manage registries__. Select __+ Create registry__.

    > [!TIP]
    > If you are in a workspace, navigate to the global UI by clicking your organization or tenant name in the navigation pane to find the __Registries__ entry.  You can also go directly there by navigating to [https://ml.azure.com/registries](https://ml.azure.com/registries).

    :::image type="content" source="./media/how-to-manage-registries/studio-create-registry-button.png" lightbox="./media/how-to-manage-registries/studio-create-registry-button.png" alt-text="Screenshot of the create registry screen.":::
    
1. Enter the registry name, select the subscription and resource group and then select __Next__.

    :::image type="content" source="./media/how-to-manage-registries/studio-create-registry-basics.png" alt-text="Screenshot of the registry creation basics tab.":::

1. Select the __Primary region__ and __Additional region__, then select __Next__.

    :::image type="content" source="./media/how-to-manage-registries/studio-registry-select-regions.png" alt-text="Screenshot of the registry region selection":::

1. Review the information you provided, and then select __Create__. You can track the progress of the create operation in the Azure portal. Once the registry is successfully created, you can find it listed in the __Manage Registries__ tab.

    :::image type="content" source="./media/how-to-manage-registries/studio-create-registry-review.png" alt-text="Screenshot of the create + review tab.":::
# [Azure portal](#tab/portal)

1. From the [Azure portal](https://portal.azure.com), navigate to the Azure Machine Learning service. You can get there by searching for __Azure Machine Learning__ in the search bar at the top of the page or going to __All Services__ looking for __Azure Machine Learning__ under the __AI + machine learning__ category. 

1. Select __Create__, and then select __Azure Machine Learning registry__. Enter the registry name, select the subscription, resource group and primary region, then select __Next__.
    
1. Select the additional regions the registry must support, then select __Next__ until you arrive at the __Review + Create__ tab.

    :::image type="content" source="./media/how-to-manage-registries/create-registry-review.png" alt-text="Screenshot of the review + create tab.":::

1. Review the information and select __Create__.



# [REST API](#tab/rest)

> [!TIP]
> You need the **curl** utility to complete this step. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`.  

To authenticate REST API calls, you need an authentication token for your Azure user account. You can use the following command to retrieve a token:

```azurecli
az account get-access-token 
```

The response should provide an access token good for one hour. Make note of the token, as you use it to authenticate all administrative requests. The following JSON is a sample response:

> [!TIP]
> The value of the `access_token` field is the token.

```json
{
    "access_token": "YOUR-ACCESS-TOKEN",
    "expiresOn": "<expiration-time>",
    "subscription": "<subscription-id>",
    "tenant": "your-tenant-id",
    "tokenType": "Bearer"
}
```

To create a registry, use the following command. You can edit the JSON to change the inputs as needed. Replace the `<YOUR-ACCESS-TOKEN>` value with the access token retrieved previously:

> [!TIP]
> We recommend using the latest API version when working with the REST API. For a list of the current REST API versions for Azure Machine Learning, see the [Machine Learning REST API reference](/rest/api/azureml/). The current API versions are listed in the table of contents on the left side of the page.

```bash
```bash
curl -X PUT https://management.azure.com/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>/providers/Microsoft.MachineLearningServices/registries/reg-from-rest?api-version=2023-04-01 -H "Authorization:Bearer <YOUR-ACCESS-TOKEN>" -H 'Content-Type: application/json' -d ' 
{
    "properties":
    {
        "regionDetails": 
        [
            {
                "location": "eastus",
                "storageAccountDetails":
                [
                    {
                        "systemCreatedStorageAccount": 
                        {
                            "storageAccountType": "Standard_LRS"
                        }
                    }
                ],
                "acrDetails": 
                [
                    {
                        "systemCreatedAcrAccount":
                        {
                            "acrAccountSku": "Premium"
                        }
                    }
                ]
            }
        ]
    },
    "identity": {
        "type": "SystemAssigned"
        },
    "location": "eastus"
}
'
```

You should receive a `202 Accepted` response.

---


## Specify storage account type and SKU (optional)

> [!TIP]
> Specifying the Azure Storage Account type and SKU is only available from the Azure CLI.

Azure storage offers several types of storage accounts with different features and pricing. For more information, see the [Types of storage accounts](../storage/common/storage-account-overview.md#types-of-storage-accounts) article. Once you identify the optimal storage account SKU that best suites your needs, [find the value for the appropriate SKU type](/rest/api/storagerp/srp_sku_types). In the YAML file, use your selected SKU type as the value of the `storage_account_type` field. This field is under each `location` in the `replication_locations` list.

Next, decide if you want to use an [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md) account or [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md). To create Azure Data Lake Storage Gen2, set `storage_account_hns` to `true`. To create Azure Blob Storage, set `storage_account_hns` to `false`. The `storage_account_hns` field is under each `location` in the `replication_locations` list.

> [!NOTE]
>The `hns` portion of `storage_account_hns` refers to the [hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md) capability of Azure Data Lake Storage Gen2 accounts.

The following example YAML file demonstrates this advanced storage configuration:

```YAML
name: DemoRegistry2
tags:
  description: Registry with additional configuration for storage accounts
  foo: bar
location: eastus
replication_locations:
  - location: eastus
    storage_config:
      storage_account_hns: False
      storage_account_type: Standard_LRS
  - location: eastus2
    storage_config:
      storage_account_hns: False
      storage_account_type: Standard_LRS
  - location: westus
    storage_config:
      storage_account_hns: False
      storage_account_type: Standard_LRS
```

## Add users to the registry 

Decide if you want to allow users to only use assets (models, environments and components) from the registry or both use and create assets in the registry. Review [steps to assign a role](../role-based-access-control/role-assignments-steps.md) if you aren't familiar how to manage permissions using [Azure role-based access control](../role-based-access-control/overview.md).

### Allow users to use assets from the registry

To let a user only read assets, you can grant the user the built-in __Reader__ role. If you don't want to use the built-in role, create a custom role with the following permissions

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/read | Allows the user to list registries and get registry metadata
Microsoft.MachineLearningServices/registries/assets/read | Allows the user to browse assets and use the assets in a workspace

### Allow users to create and use assets from the registry

To let the user both read and create or delete assets, grant the following write permission in addition to the above read permissions.

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/assets/write | Create assets in registries
Microsoft.MachineLearningServices/registries/assets/delete| Delete assets in registries

> [!WARNING]
> The built-in __Contributor__ and __Owner__ roles allow users to create, update and delete registries. You must create a custom role if you want the user to create and use assets from the registry, but not create or update registries. Review [custom roles](../role-based-access-control/custom-roles.md) to learn how to create custom roles from permissions.

### Allow users to create and manage registries

To let users create, update and delete registries, grant them the built-in __Contributor__ or __Owner__ role. If you don't want to use built in roles, create a custom role with the following permissions, in addition to all the above permissions to read, create and delete assets in registry.

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/write| Allows the user to create or update registries
Microsoft.MachineLearningServices/registries/delete | Allows the user to delete registries


## Next steps

* [Learn how to share models, components and environments across workspaces with registries](./how-to-share-models-pipelines-across-workspaces-with-registries.md)
* [Network isolation with registries](./how-to-registry-network-isolation.md)
