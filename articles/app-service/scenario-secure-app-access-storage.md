---
title: Tutorial - Web app accesses storage using managed identities | Azure
description: In this tutorial you learn how to access Azure storage on behalf of an app using managed identities.
services: storage, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service-web
ms.topic: tutorial
ms.workload: identity
ms.date: 11/04/2020
ms.author: ryanwi
ms.reviewer: stsoneff
#Customer intent: As an application developer, I want to learn how to access Azure storage on behalf of an app using managed identities.
---

# Tutorial: access Azure storage from a web app

Learn how to access Azure storage on behalf of a web app (not a signed-in user) running on Azure App Service using managed identities.

:::image type="content" alt-text="Access storage" source="./media/scenario-secure-app-access-storage/webapp-access-storage.svg" border="false":::

You want to add access to the Azure data plane (Azure Storage, SQL Azure, Azure Key Vault, or other services) from your web app.  You could use a shared key, but then you have to worry about operational security of who can create, deploy, and manage the secret.  It's also possible that the key could be checked into GitHub, which hackers know how to scan for. A safer way to give your web app access to data is to use [managed identities](/azure/active-directory/managed-identities-azure-resources/overview). A managed identity from Azure Active Directory allows App Services to access resources through Role-Based Access Control (RBAC), without requiring app credentials. After assigning a managed identity to your web app, Azure takes care of the creation and distribution of a certificate.  People don't have to worry about managing secrets or app credentials.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a system assigned managed identity on a web app
> * Create a storage account and Blob storage container
> * Access storage from a web app using managed identities

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](scenario-secure-app-authentication-app-service.md).

## Enable managed identity on app

If you create and publish your web app through Visual Studio, the managed identity was enabled on your app for you. In your app service, select **Identity** in the left nav pane and then **System assigned**.  Verify that the **Status** is set to **On**.  If not, click **Save** and then **Yes** to enable the system assigned managed identity.  When the managed identity is enabled, the status is set to *On* and object ID is available.

:::image type="content" alt-text="System assigned identity" source="./media/scenario-secure-app-access-storage/create-system-assigned-identity.png":::

This creates a new object ID, different than the app ID created in the **Authentication/Authorization** blade.  Copy the object ID of the system assigned managed identity, you'll need it later.

## Create a storage account and Blob storage container

Now you are ready to create a storage account and Blob storage container.

Every storage account must belong to an Azure resource group. A resource group is a logical container for grouping your Azure services. When you create a storage account, you have the option to either create a new resource group, or use an existing resource group. This article shows how to create a new resource group.

A general-purpose v2 storage account provides access to all of the Azure Storage services: blobs, files, queues, tables, and disks. The steps outlined here create a general-purpose v2 storage account, but the steps to create any type of storage account are similar.

Blobs in Azure Storage are organized into containers. Before you can upload a blob later in this tutorial, you must first create a container.

# [Portal](#tab/azure-portal)

To create a general-purpose v2 storage account in the Azure portal, follow these steps:

1. On the Azure portal menu, select **All services**. In the list of resources, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.

1. On the **Storage Accounts** window that appears, choose **Add**.

1. Select the subscription in which to create the storage account.

1. Under the **Resource group** field, select the resource group that contains your web app from the dropdown menu.

1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only.

1. Select a location for your storage account, or use the default location.

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

To create a Blob storage container in Azure Storage, follow these steps:

1. Navigate to your new storage account in the Azure portal.

1. In the left menu for the storage account, scroll to the **Blob service** section, then select **Containers**.

1. Select the **+ Container** button.

1. Type a name for your new container. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

1. Set the level of public access to the container. The default level is **Private (no anonymous access)**.

1. Select **OK** to create the container.

# [PowerShell](#tab/azure-powershell)

To create a general-purpose v2 storage account and Blob storage container, run the following script. Specify the name of the resource group that contains your web app. Enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only. Specify the location for your storage account.  To see a list of locations valid for your subscription run ```Get-AzLocation | select Location```. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

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

To create a general-purpose v2 storage account and Blob storage container, run the following script. Specify the name of the resource group that contains your web app. Enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only. Specify the location for your storage account.  The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.

The following example uses your Azure AD account to authorize the operation to create the container. Before you create the container, assign the Storage Blob Data Contributor role to yourself. Even if you are the account owner, you need explicit permissions to perform data operations against the storage account.

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

You need to grant your web app access to the storage account before you can create, read, or delete blobs. In a previous step you configured the web app running on App Service with a managed identity.  Using Azure RBAC you can give the managed identity access to another resource, just like any security principal. The *Storage Blob Data Contributor* role gives the web app (represented by the system assigned managed identity) read, write, and delete access to the blob container and data.

# [Portal](#tab/azure-portal)
In the [Azure portal](https://portal.azure.com), go into your storage account to grant your web app access.  Select **Access control (IAM)** in the left nav and then **Role assignments**.  You'll see a list of who has access to the storage account.  Now you want to add a role assignment to a robot, the app service that needs access to the storage account.  Select **Add**->**Add role assignment**.

In **Role**, select **Storage Blob Data Contributor** to give your web app access to read storage blobs.  In **Assign access to**, select **App Service**.  In **Subscription**, select your subscription.  Then select the App Service you want to proved access to.  Click **Save**.

:::image type="content" alt-text="Add role assignment" source="./media/scenario-secure-app-access-storage/add-role-assignment.png":::

Your web app now has access to your storage account.

# [PowerShell](#tab/azure-powershell)

Run the following script to assign your web app (represented by a system assigned managed identity) the *Storage Blob Data Contributor* role on your storage account.

```powershell
$resourceGroup = "securewebappresourcegroup"
$webAppName="SecureWebApp20201102125811"
$storageName="securewebappstorage"

$spID = (Get-AzWebApp -ResourceGroupName $resourceGroup -Name $webAppName).identity.principalid
$storageId= (Get-AzStorageAccount -ResourceGroupName $resourceGroup -Name $storageName).Id
New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Storage Blob Data Contributor" -Scope $storageId
```

# [Azure CLI](#tab/azure-cli)

Run the following script to assign your web app (represented by a system assigned managed identity) the *Storage Blob Data Contributor* role on your storage account.

```azurecli-interactive
spID=$(az resource list -n SecureWebApp20201102125811 --query [*].identity.principalId --out tsv)

storageId=$(az storage account show -n securewebappstorage -g securewebappresourcegroup --query id --out tsv)

az role assignment create --assignee $spID --role 'Storage Blob Data Contributor' --scope $storageId
```

---

## Access blob storage (.NET)

The [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class is used to get a token credential for your code to authorize requests to Azure Storage.  Create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class, which uses the managed identity to fetch tokens and attach them to the service client. The following code example gets the authenticated token credential and uses it to create a service client object, which uploads a new blob.  

### Install client library packages

Install the [Blob storage NuGet package](https://www.nuget.org/packages/Azure.Storage.Blobs/) to work with the Blob storage service and the [Azure Identity client library for .NET NuGet package](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials.  Install the client libraries using the .NET Core command-line interface or the Package Manager Console in Visual Studio.

# [Command Line](#tab/command-line)

Open a command line and switch to the directory that contains your project file.

Run the install commands:

```dotnetcli
dotnet add package Azure.Storage.Blobs

dotnet add package Azure.Identity
```

# [Package Manager](#tab/package-manager)

Open the project/solution in Visual Studio, and open the console using the **Tools** > **NuGet Package Manager** > **Package Manager Console** command.

Run the install commands:
```powershell
Install-Package Azure.Storage.Blobs

Install-Package Azure.Identity
```

---

### Example

```csharp
using System;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using Azure.Identity;

// Some code omitted for brevity.

static public async Task UploadBlob(string accountName, string containerName, string blobName, string blobContents)
{
    // Construct the blob container endpoint from the arguments.
    string containerEndpoint = string.Format("https://{0}.blob.core.windows.net/{1}",
                                                accountName,
                                                containerName);

    // Get a credential and create a client object for the blob container.
    BlobContainerClient containerClient = new BlobContainerClient(new Uri(containerEndpoint),
                                                                    new DefaultAzureCredential());

    try
    {
        // Create the container if it does not exist.
        await containerClient.CreateIfNotExistsAsync();

        // Upload text to a new block blob.
        byte[] byteArray = Encoding.ASCII.GetBytes(blobContents);

        using (MemoryStream stream = new MemoryStream(byteArray))
        {
            await containerClient.UploadBlobAsync(blobName, stream);
        }
    }
    catch (Exception e)
    {
        throw e;
    }
}
```

## Clean up resources

If you are done with this tutorial and no longer need the web app or associated resources, [clean up the resources you created](scenario-secure-app-clean-up-resources.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create a system assigned managed identity
> * Create a storage account and Blob storage container
> * Access storage from a web app using managed identities

> [!div class="nextstepaction"]
> [App service accesses Microsoft Graph on behalf of the user](scenario-secure-app-access-microsoft-graph-as-user.md)
