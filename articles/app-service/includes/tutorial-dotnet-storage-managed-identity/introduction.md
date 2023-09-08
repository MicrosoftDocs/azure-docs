---
services: storage, app-service-web
author: rwike77
manager: CelesteDG
ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 02/16/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: azurecli
ms.custom: azureday1, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps
ms.subservice: web-apps
---
Learn how to access Azure services, _such as Azure Storage_, from a web app (not a signed-in user) running on Azure App Service by using managed identities. This tutorial demonstrates connecting to Azure Storage as an example. 

[Any service](../../../active-directory/managed-identities-azure-resources/managed-identities-status.md) that supports managed identity (_B_ in the following image) can be securely accessed using this tutorial: 

* Azure Storage
* Azure SQL Database
* Azure Key Vault

:::image type="content" alt-text="Diagram that shows how to access storage." source="../../media/scenario-secure-app-access-storage/web-app-access-storage.svg" border="false":::

You want to add secure access to Azure services (Azure Storage, Azure SQL Database, Azure Key Vault, or other services) from your web app. You could use a shared key, but then you have to worry about operational security of who can create, deploy, and manage the secret. It's also possible that the key could be checked into GitHub, which hackers know how to scan for. A safer way to give your web app access to data is to use [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md).

A managed identity from Azure Active Directory (Azure AD) allows App Service to access resources through role-based access control (RBAC), without requiring app credentials. After assigning a managed identity to your web app, Azure takes care of the creation and distribution of a certificate. People don't have to worry about managing secrets or app credentials.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a system-assigned managed identity on a web app.
> * Create a storage account and an Azure Blob Storage container.
> * Access storage from a web app by using managed identities.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service:
    * [.NET quickstart](../../quickstart-dotnetcore.md)
    * [JavaScript quickstart](../../quickstart-nodejs.md)

## Enable managed identity on an app

If you create and publish your web app through Visual Studio, the managed identity was enabled on your app for you. In your app service, select **Identity** in the left pane, and then select **System assigned**. Verify that the **Status** is set to **On**. If not, select **On** and then **Save**. Select **Yes** in the confirmation dialog to enable the system-assigned managed identity. When the managed identity is enabled, the status is set to **On** and the object ID is available.

:::image type="content" alt-text="Screenshot that shows the System assigned identity option." source="../../media/scenario-secure-app-access-storage/create-system-assigned-identity.png":::

This step creates a new object ID, different than the app ID created in the **Authentication/Authorization** pane. Copy the object ID of the system-assigned managed identity. You'll need it later.

## Create a storage account and Blob Storage container

Now you're ready to create a storage account and Blob Storage container.

Every storage account must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group or use an existing resource group. This article shows how to create a new resource group.

A general-purpose v2 storage account provides access to all of the Azure Storage services: blobs, files, queues, tables, and disks. The steps outlined here create a general-purpose v2 storage account, but the steps to create any type of storage account are similar.

Blobs in Azure Storage are organized into containers. Before you can upload a blob later in this tutorial, you must first create a container.

# [Portal](#tab/azure-portal)

To create a general-purpose v2 storage account in the Azure portal, follow these steps.

1. On the Azure portal menu, select **All services**. In the list of resources, enter **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.

1. In the **Storage Accounts** window that appears, select **Create**.

1. Select the subscription in which to create the storage account.

1. Under the **Resource group** field, select the resource group that contains your web app from the drop-down menu.

1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length and can include numbers and lowercase letters only.

1. Select a location (region) for your storage account, or use the default value.

1. Leave these fields set to their default values:

    |Field|Value|
    |--|--|
    |Deployment model|Resource Manager|
    |Performance|Standard|
    |Account kind|StorageV2 (general-purpose v2)|
    |Replication|Read-access geo-redundant storage (RA-GRS)|
    |Access tier|Hot|

1. Select **Review + Create** to review your storage account settings and create the account.

1. Select **Create**.

To create a Blob Storage container in Azure Storage, follow these steps.

1. Go to your new storage account in the Azure portal.

1. In the left menu for the storage account, scroll to the **Data storage** section, and then select **Containers**.

1. Select the **+ Container** button.

1. Type a name for your new container. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

1. Set the level of public access to the container. The default level is **Private (no anonymous access)**.

1. Select **OK** to create the container.

# [PowerShell](#tab/azure-powershell)

To create a general-purpose v2 storage account and Blob Storage container, run the following script. Specify the name of the resource group that contains your web app. Enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length and can include numbers and lowercase letters only.

Specify the location for your storage account. To see a list of locations valid for your subscription, run ```Get-AzLocation | select Location```. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

Remember to replace placeholder values in angle brackets with your own values.

```powershell
Connect-AzAccount

$resourceGroup = "securewebappresourcegroup"
$location = "<location>"
$storageName="securewebappstorage"
$containerName = "securewebappblobcontainer"

$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageName `
  -Location $location `
  -SkuName Standard_RAGRS `
  -Kind StorageV2

$ctx = $storageAccount.Context

New-AzStorageContainer -Name $containerName -Context $ctx -Permission blob
```

# [Azure CLI](#tab/azure-cli)

To create a general-purpose v2 storage account and Blob Storage container, run the following script. Specify the name of the resource group that contains your web app. Enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length and can include numbers and lowercase letters only. 

Specify the location for your storage account. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

The following example uses your Azure AD account to authorize the operation to create the container. Before you create the container, assign the Storage Blob Data Contributor role to yourself. Even if you're the account owner, you need explicit permissions to perform data operations against the storage account.

Remember to replace placeholder values in angle brackets with your own values.

```azurecli-interactive
az login

az storage account create \
    --name securewebappstorage \
    --resource-group securewebappresourcegroup \
    --location <location> \
    --sku Standard_ZRS \
    --encryption-services blob

storageId=$(az storage account show -n securewebappstorage -g securewebappresourcegroup --query id --out tsv)

az ad signed-in-user show --query objectId -o tsv | az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee @- \
    --scope $storageId

az storage container create \
    --account-name securewebappstorage \
    --name securewebappblobcontainer \
    --auth-mode login
```

---

## Grant access to the storage account

You need to grant your web app access to the storage account before you can create, read, or delete blobs. In a previous step, you configured the web app running on App Service with a managed identity. Using Azure RBAC, you can give the managed identity access to another resource, just like any security principal. The Storage Blob Data Contributor role gives the web app (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data.

> [!NOTE]
> Some operations on private blob containers are not supported by Azure RBAC, such as viewing blobs or copying blobs between accounts. A blob container with private access level requires a SAS token for any operation that is not authorized by Azure RBAC.  For more information, see [When to use a shared access signature](/azure/storage/common/storage-sas-overview#when-to-use-a-shared-access-signature).

# [Portal](#tab/azure-portal)

In the [Azure portal](https://portal.azure.com), go into your storage account to grant your web app access. Select **Access control (IAM)** in the left pane, and then select **Role assignments**. You'll see a list of who has access to the storage account. Now you want to add a role assignment to a robot, the app service that needs access to the storage account. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

Assign the **Storage Blob Data Contributor** role to the **App Service** at subscription scope.  For detailed steps, see [Assign Azure roles using the Azure portal](../../../role-based-access-control/role-assignments-portal.md).

Your web app now has access to your storage account.

# [PowerShell](#tab/azure-powershell)

Run the following script to assign your web app (represented by a system-assigned managed identity) the Storage Blob Data Contributor role on your storage account.

```powershell
$resourceGroup = "securewebappresourcegroup"
$webAppName="SecureWebApp20201102125811"
$storageName="securewebappstorage"

$spID = (Get-AzWebApp -ResourceGroupName $resourceGroup -Name $webAppName).identity.principalid
$storageId= (Get-AzStorageAccount -ResourceGroupName $resourceGroup -Name $storageName).Id
New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Storage Blob Data Contributor" -Scope $storageId
```

# [Azure CLI](#tab/azure-cli)

Run the following script to assign your web app (represented by a system-assigned managed identity) the Storage Blob Data Contributor role on your storage account.

```azurecli-interactive
spID=$(az resource list -n SecureWebApp20201102125811 --query [*].identity.principalId --out tsv)

storageId=$(az storage account show -n securewebappstorage -g securewebappresourcegroup --query id --out tsv)

az role assignment create --assignee $spID --role 'Storage Blob Data Contributor' --scope $storageId
```

---