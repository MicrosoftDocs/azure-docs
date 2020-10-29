---
title: Set ACLs recursively for Azure Data Lake Storage Gen2 | Microsoft Docs
description: You can add, update, and remove access control lists recursively for existing child items of a parent directory.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 10/27/2020
ms.author: normesta
ms.reviewer: prishet
ms.custom: devx-track-csharp
---

# Set access control lists (ACLs) recursively for Azure Data Lake Storage Gen2

ACL inheritance is already available for new child items that are created under a parent directory. You can also now add, update, and remove ACLs recursively for existing child items of a parent directory without having to make these changes individually for each child item.

> [!NOTE]
> The ability to set access lists recursively is in public preview and is available in all regions.  

[Libraries](#libraries) | [Samples](#code-samples) | [Best practices](#best-practice-guidelines) | [Give feedback](#provide-feedback)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.

- The correct permissions to execute the recursive ACL process. The correct permission includes either of the following: 

  - A provisioned Azure Active Directory (AD) [security principal](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the either the target container, parent resource group or subscription.   

  - Owning user of the target container or directory to which you plan to apply the recursive ACL process. This includes all child items in the target container or directory. 

- An understanding of how ACLs are applied to directories and files. See [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control). 

See the **Set up your project** section of this article to view installation guidance for PowerShell, .NET SDK, and Python SDK.

## Set up your project

Install the necessary libraries.

### [PowerShell](#tab/azure-powershell)

1. Ensure that the .NET framework is installed. See [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).
 
2. Verify that the version of PowerShell that have installed is `5.1` or higher by using the following command.    

   ```powershell
   echo $PSVersionTable.PSVersion.ToString() 
   ```
    
   To upgrade your version of PowerShell, see [Upgrading existing Windows PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-windows-powershell)
    
3. Install the latest version of the PowershellGet module.

   ```powershell
   install-Module PowerShellGet –Repository PSGallery –Force  
   ```

4. Close, and then reopen the PowerShell console.

5. Install **Az.Storage** preview module.

   ```powershell
   Install-Module Az.Storage -Repository PsGallery -RequiredVersion 2.5.2-preview -AllowClobber -AllowPrerelease -Force  
   ```

   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps)

### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview), or if you've [installed](https://docs.microsoft.com/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Verify that the version of Azure CLI that have installed is `2.14.0` or higher by using the following command.

   ```azurecli
    az --version
   ```
   If your version of Azure CLI is lower than `2.14.0`, then install a later version. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### [.NET](#tab/dotnet)

1. Open a command window (For example: Windows PowerShell).

2. From your project directory, install the Azure.Storage.Files.DataLake preview package by using the `dotnet add package` command.

   ```console
   dotnet add package Azure.Storage.Files.DataLake -v 12.5.0-preview.1 -s https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json
   ```

3. Add these using statements to the top of your code file.

   ```csharp
   using Azure;
   using Azure.Core;
   using Azure.Storage;
   using Azure.Storage.Files.DataLake;
   using Azure.Storage.Files.DataLake.Models;
   using System.Collections.Generic;
   using System.Threading.Tasks;
    ```

### [Java](#tab/java)

To get started, open [this page](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) and find the latest version of the Java library. Then, open the *pom.xml* file in your text editor. Add a dependency element that references that version.

If you plan to authenticate your client application by using Azure Active Directory (AD), then add a dependency to the Azure Secret Client Library. See  [Adding the Secret Client Library package to your project](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity#adding-the-package-to-your-project).

Next, add these imports statements to your code file.

```java
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.core.http.rest.PagedIterable;
import com.azure.core.http.rest.Response;
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.file.datalake.DataLakeDirectoryClient;
import com.azure.storage.file.datalake.DataLakeFileClient;
import com.azure.storage.file.datalake.DataLakeFileSystemClient;
import com.azure.storage.file.datalake.DataLakeServiceClient;
import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
import com.azure.storage.file.datalake.models.AccessControlChangeResult;
import com.azure.storage.file.datalake.models.AccessControlType;
import com.azure.storage.file.datalake.models.ListPathsOptions;
import com.azure.storage.file.datalake.models.PathAccessControl;
import com.azure.storage.file.datalake.models.PathAccessControlEntry;
import com.azure.storage.file.datalake.models.PathItem;
import com.azure.storage.file.datalake.models.PathPermissions;
import com.azure.storage.file.datalake.models.PathRemoveAccessControlEntry;
import com.azure.storage.file.datalake.models.RolePermissions;
import com.azure.storage.file.datalake.options.PathSetAccessControlRecursiveOptions;
```

### [Python](#tab/python)

1. Download the [Azure Data Lake Storage client library for Python](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Frecursiveaclpr.blob.core.windows.net%2Fprivatedrop%2Fazure_storage_file_datalake-12.1.0b99-py2.py3-none-any.whl%3Fsv%3D2019-02-02%26st%3D2020-08-24T07%253A47%253A01Z%26se%3D2021-08-25T07%253A47%253A00Z%26sr%3Db%26sp%3Dr%26sig%3DH1XYw4FTLJse%252BYQ%252BfamVL21UPVIKRnnh2mfudA%252BfI0I%253D&data=02%7C01%7Cnormesta%40microsoft.com%7C95a5966d938a4902560e08d84912fe32%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637339693209725909&sdata=acv4KWZdzkITw1lP0%2FiA3lZuW7NF5JObjY26IXttfGI%3D&reserved=0).

2. Install the library that you downloaded by using [pip](https://pypi.org/project/pip/).

   ```
   pip install azure_storage_file_datalake-12.1.0b99-py2.py3-none-any.whl
   ```

Add these import statements to the top of your code file.

```python
import os, uuid, sys
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings
```

---

## Connect to your account

You can connect by using Azure Active Directory (AD) or by using an account key. 

### [PowerShell](#tab/azure-powershell)

Open a Windows PowerShell command window, and then sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that you want create and manage directories in. In this example, replace the `<subscription-id>` placeholder value with the ID of your subscription.

```powershell
Select-AzSubscription -SubscriptionId <subscription-id>
```

Next, choose how you want your commands to obtain authorization to the storage account. 

### Option 1: Obtain authorization by using Azure Active Directory (AD)

With this approach, the system ensures that your user account has the appropriate Azure role-based access control (Azure RBAC) assignments and ACL permissions. 

```powershell
$ctx = New-AzStorageContext -StorageAccountName '<storage-account-name>' -UseConnectedAccount
```

The following table shows each of the supported roles and their ACL setting capability.

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

### Option 2: Obtain authorization by using the storage account key

With this approach, the system doesn't check Azure RBAC or ACL permissions.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
$ctx = $storageAccount.Context
```

### [Azure CLI](#tab/azure-cli)

1. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal. Then, sign in with your account credentials in the browser.

   To learn more about different authentication methods, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md).

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

> [!NOTE]
> The example presented in this article show Azure Active Directory (AD) authorization. To learn more about authorization methods, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md).

### [.NET](#tab/dotnet)

To use the snippets in this article, you'll need to create a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that represents the storage account.

#### Connect by using Azure Active Directory (AD)

You can use the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) to authenticate your application with Azure AD.

After you install the package, add this using statement to the top of your code file.

```csharp
using Azure.Identity;
```

Get a client ID, a client secret, and a tenant ID. To do this, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md). As part of that process, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal. 

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using a client ID, a client secret, and a tenant ID.  

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient, 
    String accountName, String clientID, string clientSecret, string tenantID)
{

    TokenCredential credential = new ClientSecretCredential(
        tenantID, clientID, clientSecret, new TokenCredentialOptions());

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), credential);
}

``` 

#### Connect by using an account key

This approach is the easiest way to connect to an account. 

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using an account key.

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient,
    string accountName, string accountKey)
{
    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient
        (new Uri(dfsUri), sharedKeyCredential);
}
```

> [!NOTE]
> For more examples, see the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) documentation.

### [Java](#tab/java)

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account. 

#### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a **DataLakeServiceClient** instance by using an account key.

```java

static public DataLakeServiceClient GetDataLakeServiceClient
(String accountName, String accountKey){

    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    DataLakeServiceClientBuilder builder = new DataLakeServiceClientBuilder();

    builder.credential(sharedKeyCredential);
    builder.endpoint("https://" + accountName + ".dfs.core.windows.net");

    return builder.buildClient();
}      
```

#### Connect by using Azure Active Directory (Azure AD)

You can use the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) to authenticate your application with Azure AD.

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

```java
static public DataLakeServiceClient GetDataLakeServiceClient
    (String accountName, String clientId, String ClientSecret, String tenantID){

    String endpoint = "https://" + accountName + ".dfs.core.windows.net";
        
    ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
    .clientId(clientId)
    .clientSecret(ClientSecret)
    .tenantId(tenantID)
    .build();
           
    DataLakeServiceClientBuilder builder = new DataLakeServiceClientBuilder();
    return builder.credential(clientSecretCredential).endpoint(endpoint).buildClient();
 } 
```

> [!NOTE]
> For more examples, see the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) documentation.

### [Python](#tab/python)

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account. 

### Connect by using Azure Active Directory (AD)

You can use the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) to authenticate your application with Azure AD.

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md). As part of that process, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal. 

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

```python
def initialize_storage_account_ad(storage_account_name, client_id, client_secret, tenant_id):
    
    try:  
        global service_client

        credential = ClientSecretCredential(tenant_id, client_id, client_secret)

        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", storage_account_name), credential=credential)
    
    except Exception as e:
        print(e)
```

> [!NOTE]
> For more examples, see the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) documentation.

### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a **DataLakeServiceClient** instance by using an account key.

```python
try:  
    global service_client
        
    service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
        "https", storage_account_name), credential=storage_account_key)
    
except Exception as e:
    print(e)
```
 
- Replace the `storage_account_name` placeholder value with the name of your storage account.

- Replace the `storage_account_key` placeholder value with your storage account access key.

---

## Set an ACL recursively

When you *set* an ACL, you **replace** the entire ACL including all of it's entries. If you want to change the permission level of a security principal or add a new security principal to the ACL without affecting other existing entries, you should *update* the ACL instead. To update an ACL instead of replace it, see the [Update an ACL recursively](#update-an-acl-recursively) section of this article.   

This section contains examples for how to set an ACL 

### [PowerShell](#tab/azure-powershell)

Set an ACL recursively by using the **Set-AzDataLakeGen2AclRecursive** cmdlet.

This example sets the ACL of a directory named `my-parent-directory`. These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```powershell
$filesystemName = "my-container"
$dirname = "my-parent-directory/"
$userID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rwx 
$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission r-x -InputObject $acl 
$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission "---" -InputObject $acl
$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $userID -Permission r-x -InputObject $acl 

Set-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl

```

> [!NOTE]
> If you want to set a **default** ACL entry, use the **-DefaultScope** parameter when you run the **Set-AzDataLakeGen2ItemAclObject** command. For example: `$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rwx -DefaultScope`.

### [Azure CLI](#tab/azure-cli)

Set an ACL recursively by using the [az storage fs access set-recursive](https://docs.microsoft.com/cli/azure/storage/fs/access#az_storage_fs_access_set_recursive) command.

This example sets the ACL of a directory named `my-parent-directory`. These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```azurecli
az storage fs access set-recursive --acl "user::rwx,group::r-x,other::---,user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to set a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user::rwx` or `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x`. 

### [.NET](#tab/dotnet)

Set an ACL recursively by calling the **DataLakeDirectoryClient.SetAccessControlRecursiveAsync** method. Pass this method a [List](/dotnet/api/system.collections.generic.list-1) of [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem). Each [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) defines an ACL entry. 

If you want to set a **default** ACL entry, then you can set the [PathAccessControlItem.DefaultScope](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem.defaultscope#Azure_Storage_Files_DataLake_Models_PathAccessControlItem_DefaultScope) property of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) to **true**. 

This example sets the ACL of a directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to set the default ACL. That parameter is used in the constructor of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem). The entries of the ACL give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID ""xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```cs
public async void SetACLRecursively(DataLakeServiceClient serviceClient, bool isDefaultScope)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
            GetDirectoryClient("my-parent-directory");

    List<PathAccessControlItem> accessControlList = 
        new List<PathAccessControlItem>() 
    {
        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read | 
            RolePermissions.Write | 
            RolePermissions.Execute, isDefaultScope),
                    
        new PathAccessControlItem(AccessControlType.Group, 
            RolePermissions.Read | 
            RolePermissions.Execute, isDefaultScope),
                    
        new PathAccessControlItem(AccessControlType.Other, 
            RolePermissions.None, isDefaultScope),

        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read | 
            RolePermissions.Execute, isDefaultScope,
            entityId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
    };

    await directoryClient.SetAccessControlRecursiveAsync
        (accessControlList, null);
}

```

### [Java](#tab/java)

Set an ACL recursively by calling the **DataLakeDirectoryClient.setAccessControlRecursive** method. Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry. 

If you want to set a **default** ACL entry, then you can call the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**. 

This example sets the ACL of a directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to set the default ACL. That parameter is used in each call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html). The entries of the ACL give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```java
static public void SetACLRecursively(DataLakeFileSystemClient fileSystemClient, Boolean isDefaultScope){
    
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-parent-directory");

    List<PathAccessControlEntry> pathAccessControlEntries = 
        new ArrayList<PathAccessControlEntry>();

    // Create owner entry.
    PathAccessControlEntry ownerEntry = new PathAccessControlEntry();

    RolePermissions ownerPermission = new RolePermissions();
    ownerPermission.setExecutePermission(true).setReadPermission(true).setWritePermission(true);

    ownerEntry.setDefaultScope(isDefaultScope);
    ownerEntry.setAccessControlType(AccessControlType.USER);
    ownerEntry.setPermissions(ownerPermission);

    pathAccessControlEntries.add(ownerEntry);

    // Create group entry.
    PathAccessControlEntry groupEntry = new PathAccessControlEntry();

    RolePermissions groupPermission = new RolePermissions();
    groupPermission.setExecutePermission(true).setReadPermission(true).setWritePermission(false);

    groupEntry.setDefaultScope(isDefaultScope);
    groupEntry.setAccessControlType(AccessControlType.GROUP);
    groupEntry.setPermissions(groupPermission);

    pathAccessControlEntries.add(groupEntry);

    // Create other entry.
    PathAccessControlEntry otherEntry = new PathAccessControlEntry();

    RolePermissions otherPermission = new RolePermissions();
    otherPermission.setExecutePermission(false).setReadPermission(false).setWritePermission(false);

    otherEntry.setDefaultScope(isDefaultScope);
    otherEntry.setAccessControlType(AccessControlType.OTHER);
    otherEntry.setPermissions(otherPermission);

    pathAccessControlEntries.add(otherEntry);

    // Create named user entry.
    PathAccessControlEntry userEntry = new PathAccessControlEntry();

    RolePermissions userPermission = new RolePermissions();
    userPermission.setExecutePermission(true).setReadPermission(true).setWritePermission(false);

    userEntry.setDefaultScope(isDefaultScope);
    userEntry.setAccessControlType(AccessControlType.USER);
    userEntry.setEntityId("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    userEntry.setPermissions(userPermission);    
    
    pathAccessControlEntries.add(userEntry);
    
    directoryClient.setAccessControlRecursive(pathAccessControlEntries);        

}
```

### [Python](#tab/python)

Set an ACL recursively by calling the **DataLakeDirectoryClient.set_access_control_recursive** method.

If you want to set a **default** ACL entry, then add the string `default:` to the beginning of each ACL entry string. 

This example sets the ACL of a directory named `my-parent-directory`. 

This method accepts a boolean parameter named `is_default_scope` that specifies whether to set the default ACL. if that parameter is `True`, the list of ACL entries are preceded with the string `default:`. 

The entries of the ACL give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID ""xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID ""xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```python
def set_permission_recursively(is_default_scope):
    
    try:
        file_system_client = service_client.get_file_system_client(file_system="my-container")

        directory_client = file_system_client.get_directory_client("my-parent-directory")
              
        acl = 'user::rwx,group::rwx,other::rwx,user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r--'   

        if is_default_scope:
           acl = 'default:user::rwx,default:group::rwx,default:other::rwx,default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r--'

        directory_client.set_access_control_recursive(acl=acl)
        
    except Exception as e:
     print(e)
```

---

## Update an ACL recursively

When you *update* an ACL, you modify the ACL instead of replacing the ACL. For example, you can add a new security principal to the ACL without affecting other security principals listed in the ACL.  To replace the ACL instead of update it, see the [Set an ACL recursively](#set-an-acl-recursively) section of this article. 

To update an ACL, create a new ACL object with the ACL entry that you want to update, and then use that object in update ACL operation. Do not get the existing ACL, just provide ACL entries to be updated.

This section contains examples for how to update an ACL.

### [PowerShell](#tab/azure-powershell)

Update an ACL recursively by using the  **Update-AzDataLakeGen2AclRecursive** cmdlet. 

This example updates an ACL entry with write permission. 

```powershell
$filesystemName = "my-container"
$dirname = "my-parent-directory/"
$userID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $userID -Permission rwx

Update-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl

```

> [!NOTE]
> If you want to update a **default** ACL entry, use the **-DefaultScope** parameter when you run the **Set-AzDataLakeGen2ItemAclObject** command. For example: `$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $userID -Permission rwx -DefaultScope`.

### [Azure CLI](#tab/azure-cli)

Update an ACL recursively by using the  [az storage fs access update-recursive](https://docs.microsoft.com/cli/azure/storage/fs/access#az_storage_fs_access_update_recursive) command. 

This example updates an ACL entry with write permission. 

```azurecli
az storage fs access update-recursive --acl "user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:rwx" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to update a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x`.

### [.NET](#tab/dotnet)

Update an ACL recursively by calling the **DataLakeDirectoryClient.UpdateAccessControlRecursiveAsync** method.  Pass this method a [List](/dotnet/api/system.collections.generic.list-1) of [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem). Each [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) defines an ACL entry. 

If you want to update a **default** ACL entry, then you can set the [PathAccessControlItem.DefaultScope](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem.defaultscope#Azure_Storage_Files_DataLake_Models_PathAccessControlItem_DefaultScope) property of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) to **true**. 

This example updates an ACL entry with write permission. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to update the default ACL. That parameter is used in the constructor of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem).

```cs
public async void UpdateACLsRecursively(DataLakeServiceClient serviceClient, bool isDefaultScope)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
        GetDirectoryClient("my-parent-directory");

    List<PathAccessControlItem> accessControlListUpdate = 
        new List<PathAccessControlItem>()
    {
        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read |
            RolePermissions.Write | 
            RolePermissions.Execute, isDefaultScope, 
            entityId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
    };

    await directoryClient.UpdateAccessControlRecursiveAsync
        (accessControlListUpdate, null);

}
```

### [Java](#tab/java)

Update an ACL recursively by calling the **DataLakeDirectoryClient.updateAccessControlRecursive** method.  Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry. 

If you want to update a **default** ACL entry, then you can the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**. 

This example updates an ACL entry with write permission. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to update the default ACL. That parameter is used in the call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html). 

```java
static public void UpdateACLRecursively(DataLakeFileSystemClient fileSystemClient, Boolean isDefaultScope){

    DataLakeDirectoryClient directoryClient =
    fileSystemClient.getDirectoryClient("my-parent-directory");

    List<PathAccessControlEntry> pathAccessControlEntries = 
        new ArrayList<PathAccessControlEntry>();

    // Create named user entry.
    PathAccessControlEntry userEntry = new PathAccessControlEntry();

    RolePermissions userPermission = new RolePermissions();
    userPermission.setExecutePermission(true).setReadPermission(true).setWritePermission(true);

    userEntry.setDefaultScope(isDefaultScope);
    userEntry.setAccessControlType(AccessControlType.USER);
    userEntry.setEntityId("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    userEntry.setPermissions(userPermission);    
    
    pathAccessControlEntries.add(userEntry);
    
    directoryClient.updateAccessControlRecursive(pathAccessControlEntries);          
}
```

### [Python](#tab/python)

Update an ACL recursively by calling the **DataLakeDirectoryClient.update_access_control_recursive** method. If you want to update a **default** ACL entry, then add the string `default:` to the beginning of each ACL entry string. 

This example updates an ACL entry with write permission.

This example sets the ACL of a directory named `my-parent-directory`. This method accepts a boolean parameter named `is_default_scope` that specifies whether to update the default ACL. if that parameter is `True`, the updated ACL entry is preceded with the string `default:`.  

```python
def update_permission_recursively(is_default_scope):
    
    try:
        file_system_client = service_client.get_file_system_client(file_system="my-container")

        directory_client = file_system_client.get_directory_client("my-parent-directory")

        acl = 'user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:rwx'   

        if is_default_scope:
           acl = 'default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:rwx'

        directory_client.update_access_control_recursive(acl=acl)

        acl_props = directory_client.get_access_control()
        
        print(acl_props['permissions'])

    except Exception as e:
     print(e)
```

---

## Remove ACL entries recursively

You can remove one or more ACL entries recursively. To remove an ACL entry, create a new ACL object for ACL entry to be removed, and then use that object in remove ACL operation. Do not get the existing ACL, just provide the ACL entries to be removed. 

This section contains examples for how to remove an ACL. 

### [PowerShell](#tab/azure-powershell)

Remove ACL entries by using the **Remove-AzDataLakeGen2AclRecursive** cmdlet. 

This example removes an ACL entry from the root directory of the container.  

```powershell
$filesystemName = "my-container"
$userID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

$acl = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $userID -Permission "---" 

Remove-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName  -Acl $acl
```

> [!NOTE]
> If you want to remove a **default** ACL entry, use the **-DefaultScope** parameter when you run the **Set-AzDataLakeGen2ItemAclObject** command. For example: `$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $userID -Permission "---" -DefaultScope`.

### [Azure CLI](#tab/azure-cli)

Remove ACL entries by using the [az storage fs access remove-recursive](https://docs.microsoft.com/cli/azure/storage/fs/access#az_storage_fs_access_remove_recursive) command. 

This example removes an ACL entry from the root directory of the container.  

```azurecli
az storage fs access remove-recursive --acl "user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to remove a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

### [.NET](#tab/dotnet)

Remove ACL entries by calling the **DataLakeDirectoryClient.RemoveAccessControlRecursiveAsync** method. Pass this method a [List](/dotnet/api/system.collections.generic.list-1) of [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem). Each [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) defines an ACL entry. 

If you want to remove a **default** ACL entry, then you can set the [PathAccessControlItem.DefaultScope](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem.defaultscope#Azure_Storage_Files_DataLake_Models_PathAccessControlItem_DefaultScope) property of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) to **true**. 

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to remove the entry from the default ACL. That parameter is used in the constructor of the [PathAccessControlItem](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem).

```cs
public async void RemoveACLsRecursively(DataLakeServiceClient serviceClient, isDefaultScope)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
            GetDirectoryClient("my-parent-directory");

    List<RemovePathAccessControlItem> accessControlListForRemoval = 
        new List<RemovePathAccessControlItem>()
        {
            new RemovePathAccessControlItem(AccessControlType.User, isDefaultScope,
            entityId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
        };

    await directoryClient.RemoveAccessControlRecursiveAsync
        (accessControlListForRemoval, null);

}
```

### [Java](#tab/java)

Remove ACL entries by calling the **DataLakeDirectoryClient.removeAccessControlRecursive** method. Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry. 

If you want to remove a **default** ACL entry, then you can the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**.  

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to remove the entry from the default ACL. That parameter is used in the call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html).


```java
static public void RemoveACLRecursively(DataLakeFileSystemClient fileSystemClient, Boolean isDefaultScope){

    DataLakeDirectoryClient directoryClient =
    fileSystemClient.getDirectoryClient("my-parent-directory");

    List<PathRemoveAccessControlEntry> pathRemoveAccessControlEntries = 
        new ArrayList<PathRemoveAccessControlEntry>();

    // Create named user entry.
    PathRemoveAccessControlEntry userEntry = new PathRemoveAccessControlEntry();

    RolePermissions userPermission = new RolePermissions();
    userPermission.setExecutePermission(true).setReadPermission(true).setWritePermission(true);

    userEntry.setDefaultScope(isDefaultScope);
    userEntry.setAccessControlType(AccessControlType.USER);
    userEntry.setEntityId("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"); 
    
    pathRemoveAccessControlEntries.add(userEntry);
    
    directoryClient.removeAccessControlRecursive(pathRemoveAccessControlEntries);      

}
```

### [Python](#tab/python)

Remove ACL entries by calling the **DataLakeDirectoryClient.remove_access_control_recursive** method. If you want to remove a **default** ACL entry, then add the string `default:` to the beginning of the ACL entry string. 

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. This method accepts a boolean parameter named `is_default_scope` that specifies whether to remove the entry from the default ACL. if that parameter is `True`, the updated ACL entry is preceded with the string `default:`. 

```python
def remove_permission_recursively(is_default_scope):
    
    try:
        file_system_client = service_client.get_file_system_client(file_system="my-container")

        directory_client = file_system_client.get_directory_client("my-parent-directory")
              
        acl = 'user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

        if is_default_scope:
           acl = 'default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

        directory_client.remove_access_control_recursive(acl=acl)

    except Exception as e:
     print(e)
```

---

## Recover from failures

You might encounter runtime or permission errors. For runtime errors, restart the process from the beginning. Permission errors can occur if the security principal doesn't have sufficient permission to modify the ACL of a directory or file that is in the directory hierarchy being modified. Address the permission issue, and then choose to either resume the process from the point of failure by using a continuation token, or restart the process from beginning. You don't have to use the continuation token if you prefer to restart from the beginning. You can reapply ACL entries without any negative impact.

### [PowerShell](#tab/azure-powershell)

Return results to the variable. Pipe failed entries to a formatted table.

```powershell
$result = Set-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl
$result
$result.FailedEntries | ft 
```

Based on the output of the table, you can fix any permission errors, and then resume execution by using the continuation token.

```powershell
$result = Set-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl -ContinuationToken $result.ContinuationToken
$result

```

### [Azure CLI](#tab/azure-cli)

In the event of a failure, you can return a continuation token by setting the `--continue-on-failure` parameter to `true`. After you address the errors, you can resume the process from the point of failure by running the command again, and then setting the `--continuation` parameter to the continuation token. 

```azurecli
az storage fs access set-recursive --acl "user::rw-,group::r-x,other::---" --continue-on-failure true --continuation xxxxxxx -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login  
```

## [.NET](#tab/dotnet)

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of `null` for the continuation token parameter. 

```cs
public async Task<string> ResumeAsync(DataLakeServiceClient serviceClient,
    DataLakeDirectoryClient directoryClient,
    List<PathAccessControlItem> accessControlList, 
    string continuationToken)
{
    try
    {
        var accessControlChangeResult =
            await directoryClient.SetAccessControlRecursiveAsync(
                accessControlList, continuationToken: continuationToken, null);

        if (accessControlChangeResult.Value.Counters.FailedChangesCount > 0)
        {
            continuationToken =
                accessControlChangeResult.Value.ContinuationToken;
        }

        return continuationToken;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
        return continuationToken;
    }

}
```

### [Java](#tab/java)

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of `null` for the continuation token parameter. 

```java
static public String ResumeSetACLRecursively(DataLakeFileSystemClient fileSystemClient,
DataLakeDirectoryClient directoryClient,
List<PathAccessControlEntry> accessControlList, 
String continuationToken){

    try{
        PathSetAccessControlRecursiveOptions options = new PathSetAccessControlRecursiveOptions(accessControlList);
        
        options.setContinuationToken(continuationToken);
    
        Response<AccessControlChangeResult> accessControlChangeResult =  
            directoryClient.setAccessControlRecursiveWithResponse(options, null, null);

        if (accessControlChangeResult.getValue().getCounters().getFailedChangesCount() > 0)
        {
            continuationToken =
                accessControlChangeResult.getValue().getContinuationToken();
        }
    
        return continuationToken;

    }
    catch(Exception ex){
    
        System.out.println(ex.toString());
        return continuationToken;
    }
}
```

### [Python](#tab/python)

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of ``None`` for the continuation token parameter. 

```python
def resume_set_acl_recursive(continuation_token):
    
    try:
        file_system_client = service_client.get_file_system_client(file_system="my-container")

        directory_client = file_system_client.get_directory_client("my-parent-directory")
              
        acl = 'user::rwx,group::rwx,other::rwx,user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x'

        acl_change_result = directory_client.set_access_control_recursive(acl=acl, continuation=continuation_token)

        continuation_token = acl_change_result.continuation

        return continuation_token
        
    except Exception as e:
     print(e) 
     return continuation_token
```

---

## Resources

This section contains links to libraries and code samples.

#### Libraries

- [PowerShell](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.powershellgallery.com%2Fpackages%2FAz.Storage%2F2.5.2-preview&data=02%7C01%7Cnormesta%40microsoft.com%7Ccdabce06132c42132b4008d849a2dfb1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637340311173215017&sdata=FWynO9UKTt7ESMCFgkWaL7J%2F%2BjODaRo5BD6G6yCx9os%3D&reserved=0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/storage/fs/access)
- [.NET](https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json)
- [Java](/java/api/overview/azure/storage-file-datalake-readme)
- [Python](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Frecursiveaclpr.blob.core.windows.net%2Fprivatedrop%2Fazure_storage_file_datalake-12.1.0b99-py2.py3-none-any.whl%3Fsv%3D2019-02-02%26st%3D2020-08-24T07%253A47%253A01Z%26se%3D2021-08-25T07%253A47%253A00Z%26sr%3Db%26sp%3Dr%26sig%3DH1XYw4FTLJse%252BYQ%252BfamVL21UPVIKRnnh2mfudA%252BfI0I%253D&data=02%7C01%7Cnormesta%40microsoft.com%7C95a5966d938a4902560e08d84912fe32%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637339693209725909&sdata=acv4KWZdzkITw1lP0%2FiA3lZuW7NF5JObjY26IXttfGI%3D&reserved=0)

#### Code samples

- PowerShell: [Readme](https://recursiveaclpr.blob.core.windows.net/privatedrop/README.txt?sv=2019-02-02&st=2020-08-24T17%3A03%3A18Z&se=2021-08-25T17%3A03%3A00Z&sr=b&sp=r&sig=sPdKiCSXWExV62sByeOYqBTqpGmV2h9o8BLij3iPkNQ%3D) | [Sample](https://recursiveaclpr.blob.core.windows.net/privatedrop/samplePS.ps1?sv=2019-02-02&st=2020-08-24T17%3A04%3A44Z&se=2021-08-25T17%3A04%3A00Z&sr=b&sp=r&sig=dNNKS%2BZcp%2F1gl6yOx6QLZ6OpmXkN88ZjBeBtym1Mejo%3D)

- Azure CLI: [Sample](https://github.com/Azure/azure-cli/blob/2a55a5350696a3a93a13f364f2104ec8bc82cdd3/src/azure-cli/azure/cli/command_modules/storage/docs/ADLS%20Gen2.md)

- NET: [Readme](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Frecursiveaclpr.blob.core.windows.net%2Fprivatedrop%2FREADME%2520for%2520net%3Fsv%3D2019-02-02%26st%3D2020-08-25T23%253A20%253A42Z%26se%3D2021-08-26T23%253A20%253A00Z%26sr%3Db%26sp%3Dr%26sig%3DKrnHvasHoSoVeUyr2g%252FSc2aDVW3De4A%252Fvx0lFWZs494%253D&data=02%7C01%7Cnormesta%40microsoft.com%7Cda902e4fe6c24e6a07d908d8494fd4bd%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637339954503767961&sdata=gd%2B2LphTtDFVb7pZko9rkGO9OG%2FVvmeXprHB9IOEYXE%3D&reserved=0) | [Sample](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Frecursiveaclpr.blob.core.windows.net%2Fprivatedrop%2FRecursive-Acl-Sample-Net.zip%3Fsv%3D2019-02-02%26st%3D2020-08-24T07%253A45%253A28Z%26se%3D2021-09-25T07%253A45%253A00Z%26sr%3Db%26sp%3Dr%26sig%3D2GI3f0KaKMZbTi89AgtyGg%252BJePgNSsHKCL68V6I5W3s%253D&data=02%7C01%7Cnormesta%40microsoft.com%7C6eae76c57d224fb6de8908d848525330%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637338865714571853&sdata=%2FWom8iI3DSDMSw%2FfYvAaQ69zbAoqXNTQ39Q9yVMnASA%3D&reserved=0)

- Python: [Readme](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Frecursiveaclpr.blob.core.windows.net%2Fprivatedrop%2FREADME%2520for%2520python%3Fsv%3D2019-02-02%26st%3D2020-08-25T23%253A21%253A47Z%26se%3D2021-08-26T23%253A21%253A00Z%26sr%3Db%26sp%3Dr%26sig%3DRq6Bl5lXrtYk79thy8wX7UTbjyd2f%252B6xzVBFFVYbdYg%253D&data=02%7C01%7Cnormesta%40microsoft.com%7Cda902e4fe6c24e6a07d908d8494fd4bd%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637339954503777915&sdata=3e46Lp2miOHj755Gh0odH3M0%2BdTF3loGCCBENrulVTM%3D&reserved=0) | [Sample](https://recursiveaclpr.blob.core.windows.net/privatedrop/datalake_samples_access_control_async.py?sv=2019-02-02&st=2020-08-24T07%3A48%3A10Z&se=2021-08-25T07%3A48%3A00Z&sr=b&sp=r&sig=%2F1c540%2BpXYyNcuTmWPWHg2m9SyClXLIMw7ChLZGsyD0%3D)

## Best practice guidelines

This section provides you some best practice guidelines for setting ACLs recursively. 

#### Handling runtime errors

A runtime error can occur for many reasons (For example: an outage or a client connectivity issue). If you encounter a runtime error, restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Handling permission errors (403)

If you encounter an access control exception while running a recursive ACL process, your AD [security principal](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal) might not have sufficient permission to apply an ACL to one or more of the child items in the directory hierarchy. When a permission error occurs, the process stops and a continuation token is provided. Fix the permission issue, and then use the continuation token to process the remaining dataset. The directories and files that have already been successfully processed won't have to be processed again. You can also choose to restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Credentials 

We recommend that you provision an Azure AD security principal that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the target storage account or container. 

#### Performance 

To reduce latency, we recommend that you run the recursive ACL process in an Azure Virtual Machine (VM) that is located in the same region as your storage account. 

#### ACL limits

The maximum number of ACLs that you can apply to a directory or file is 32 access ACLs and 32 default ACLs. For more information, see [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control).

<a id="provide-feedback"></a>

### Provide feedback or report issues

You can provide your feedback or report an issue at  [recursiveACLfeedback@microsoft.com](mailto:recursiveACLfeedback@microsoft.com).

## See also

- [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control)
- [Known issues](data-lake-storage-known-issues.md)


