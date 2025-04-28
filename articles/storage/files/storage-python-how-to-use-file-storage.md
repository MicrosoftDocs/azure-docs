---
title: Develop for Azure Files with Python
titleSuffix: Azure Storage
description: Learn how to develop Python applications and services that use Azure Files to store file data. Create and delete files, file shares, and directories.
author: pauljewellmsft
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/08/2025
ms.author: pauljewell
ms.custom: devx-track-python, py-fresh-zinc
---

# Develop for Azure Files with Python

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn how to develop Python applications that use Azure Files to store data. Azure Files is a managed file share service in the cloud. It provides fully managed file shares that are accessible via the industry standard Server Message Block (SMB) and Network File System (NFS) protocols. Azure Files also provides a REST API for programmatic access to file shares.

In this article, you learn about the different approaches to developing with Azure Files in Python, and how to choose the approach that best fits the needs of your app. You also learn how to create a basic console app that interacts with Azure Files resources.

## Applies to

| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## About Python app development with Azure Files

Azure Files offers several ways for Python developers to access data and manage resources in Azure Files. The following table lists the approaches, summarizes how they work, and provides guidance on when to use each approach:

| Approach | How it works | When to use |
| --- | --- | --- |
| Standard file I/O libraries | Uses OS-level API calls through Azure file shares mounted using SMB or NFS. When you mount a file share using SMB/NFS, you can use file I/O libraries for a programming language or framework, such as `os` and `io` for Python. | You have line-of-business apps with existing code that uses standard file I/O, and you don't want to rewrite code for the app to work with an Azure file share. |
| FileREST API | Directly calls HTTPS endpoints to interact with data stored in Azure Files. Provides programmatic control over file share resources. The Azure SDK provides the File Shares client library (`azure-storage-file-share`) that builds on the FileREST API, allowing you interact with FileREST API operations through familiar Python programming language paradigms. | You're building value-added cloud services and apps for customers and you want to use advanced features not available through Python file I/O libraries. |
| Storage resource provider REST API | Uses Azure Resource Manager (ARM) to manage storage accounts and file shares. Calls REST API endpoints for various resource management operations. | Your app or service needs to perform resource management tasks, such as creating, deleting, or updating storage accounts or file shares. |

For general information about these approaches, see [Overview of application development with Azure Files](storage-files-developer-overview.md).

This article focuses on working with Azure Files resources using the following approaches:

- [Work with Azure Files using Python file I/O libraries](#work-with-azure-files-using-python-file-io-libraries): Mount a file share using SMB or NFS and use the Python file I/O libraries to work with files and directories in the share.
- [Work with Azure Files using the File Shares client library for Python](#work-with-azure-files-data-using-the-file-shares-client-library-for-python): Use the Azure Storage File Shares client library for Python to work with files and directories in a file share. This client library builds on the FileREST API.
- [Manage Azure Files resources using the Azure Storage management libraries](#manage-azure-files-resources-using-the-azure-storage-management-libraries): Use the Azure Storage management libraries to manage file shares and other resources in your storage account. The management libraries build on the Azure Storage resource provider REST API.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Python](https://www.python.org/downloads/) 3.8+

## Set up your project

This section walks you through preparing a project to work with the Azure Files.

From your project directory, install packages based on the needs of your app using the `pip install` command. The following example shows how to install the Azure File Shares client library, the Storage management client library, and the Azure Identity library. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-identity
pip install azure-storage-file-share
pip install azure-mgmt-resource
pip install azure-mgmt-storage
```

Open your code file and add the necessary import statements. 

If you plan to use the Python `os` and `io` libraries, add the following to your *.py* file:

```python
import os
import io
```
If you plan to use the Azure Storage File Shares client library, add the following to your *.py* file:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.fileshare import ShareClient, ShareDirectoryClient, ShareFileClient
```

If you plan to use the Azure Storage management libraries, add the following to your *.py* file:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.storage import StorageManagementClient
```

## Work with Azure Files using Python file I/O libraries

Standard file I/O libraries are the most common way to access and work with Azure Files resources. When you mount a file share using SMB or NFS, your operating system redirects API requests for the local file system. This approach allows you to use standard file I/O libraries, such as `os` or `io`, to interact with files and directories in the share.

Consider using Python file I/O libraries when your app requires:

- **App compatibility:** Ideal for line-of-business apps with existing code that already uses Python file I/O libraries. You don't need to rewrite code for the app to work with an Azure file share.
- **Ease of use:** Python file I/O libraries are well known by developers and easy to use. A key value proposition of Azure Files is that it exposes native file system APIs through SMB and NFS.

In this section, you learn how to use Python file I/O libraries to work with Azure Files resources.

For more information and examples, see the following resources:

- Python libraries for file I/O: [os](https://docs.python.org/3/library/os.html) and [io](https://docs.python.org/3/library/io.html)

### Mount a file share

To use Python file I/O libraries, you must first mount a file share. See the following resources for guidance on how to mount a file share using SMB or NFS:

- [Mount an SMB file share on Windows](storage-how-to-use-files-windows.md)
- [Mount an SMB file share on Linux](storage-how-to-use-files-linux.md)
- [Mount an NFS file share on Linux](storage-files-how-to-mount-nfs-shares.md)

In this article, we use the following path to refer to a mounted SMB file share on Windows:

```python
file_share_path = "Z:\\file-share"
```

### Example: Connect to a file share and enumerate directories using Python file I/O libraries

The following code example shows how to connect to a file share and list the directories in the share:

```python
import os

def enumerate_directories(path):
    try:
        # Get all directories in the specified path
        dirs = [d for d in os.listdir(path) if os.path.isdir(os.path.join(path, d))]
        
        # Print each directory name
        for dir_name in dirs:
            print(f"{dir_name}")
            
        print(f"{len(dirs)} directories found.")
    except (PermissionError, FileNotFoundError, OSError) as ex:
        print(f"Error: {ex}")

#Example usage
file_share_path = "Z:\\file-share"
enumerate_directories(file_share_path)
```

### Example: Write to a file in a file share using Python file I/O libraries

The following code example shows how to write and append text to a file:

```python
import os

def write_to_file(file_share_path, file_name):
    # First line of text with platform-appropriate line ending
    text_to_write = "First line" + os.linesep
    
    # Combine the file share path and filename
    file_path = os.path.join(file_share_path, file_name)
    
    # Write initial text to file (overwrites if file exists)
    with open(file_path, 'w') as file:
        file.write(text_to_write)
    
    # Text to append
    text_to_append = ["Second line", "Third line"]
    
    # Append lines to the file
    with open(file_path, 'a') as file:
        file.write(os.linesep.join(text_to_append) + os.linesep)

# Example usage
file_share_path = "Z:\\file-share"
write_to_file(file_share_path, "test.txt")
```

### Example: Enumerate file ACLs using Python file I/O libraries

The following code example shows how to enumerate basic access control lists (ACLs) for a file:

```python
import os
import stat

def enumerate_file_acls(file_path):
    try:
        # Get file stats
        file_stat = os.stat(file_path)
        
        # Get permissions in octal format
        permissions_octal = oct(stat.S_IMODE(file_stat.st_mode))
        
        print(f"File: {file_path}")
        print(f"Permissions (octal): {permissions_octal}")
        
        # Interpret permissions in a human-readable format
        permissions = ""
        permissions += "r" if file_stat.st_mode & stat.S_IRUSR else "-"
        permissions += "w" if file_stat.st_mode & stat.S_IWUSR else "-"
        permissions += "x" if file_stat.st_mode & stat.S_IXUSR else "-"
        permissions += "r" if file_stat.st_mode & stat.S_IRGRP else "-"
        permissions += "w" if file_stat.st_mode & stat.S_IWGRP else "-" 
        permissions += "x" if file_stat.st_mode & stat.S_IXGRP else "-"
        permissions += "r" if file_stat.st_mode & stat.S_IROTH else "-"
        permissions += "w" if file_stat.st_mode & stat.S_IWOTH else "-"
        permissions += "x" if file_stat.st_mode & stat.S_IXOTH else "-"
        
        print(f"Permissions (symbolic): {permissions}")
        
        print(f"Owner ID: {file_stat.st_uid}")
        print(f"Group ID: {file_stat.st_gid}")
        print("Note: For detailed Windows ACLs, you may need a specialized library.")
        
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except PermissionError:
        print(f"Error: Permission denied for '{file_path}'.")
    except Exception as e:
        print(f"Error: {e}")

# Example usage
file_share_path = "Z:\\file-share"
file_name = "test.txt"
file_path = os.path.join(file_share_path, file_name)

enumerate_file_acls(file_path)
```

## Work with Azure Files data using the File Shares client library for Python

The FileREST API provides programmatic access to Azure Files. It allows you to call HTTPS endpoints to perform operations on file shares, directories, and files. The FileREST API is designed for high scalability and advanced features that might not be available through native protocols. The Azure SDK provides client libraries, such as the File Shares client library for Python, that build on the FileREST API.

Consider using the FileREST API and the File Share client library if your application requires:

- **Advanced features:** Access operations and features that aren't available through native protocols.
- **Custom cloud integrations:** Build custom value-added services, such as backup, antivirus, or data management, that interact directly with Azure Files.
- **Performance optimization:** Benefit from performance advantages in high-scale scenarios using data plane operations.

The FileREST API models Azure Files as a hierarchy of resources, and is recommended for operations that are performed at the *directory* or *file* level. You should prefer the [Storage resource provider REST API](#manage-azure-files-resources-using-the-azure-storage-management-libraries) for operations that are performed at the *file service* or *file share* level.

In this section, you learn how to use the File Shares client library to work with Azure Files resources.

For more information and examples, see the following resources:

- [Azure Storage File Shares client library for Python](/python/api/overview/azure/storage-file-share-readme)
- [Azure Storage File Shares client library for Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-file-share/samples)

### Authorize access and create a client

To connect an app to Azure Files, create a `ShareClient` object. This object is your starting point for working with Azure Files resources. The following code examples show how to create a `ShareClient` object using different authorization mechanisms.

## [Microsoft Entra ID (recommended)](#tab/entra-id)

To authorize with Microsoft Entra ID, you need to use a security principal. The type of security principal you need depends on where your app runs. Use this table as a guide.

| Where the app runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/azure/developer/python/sdk/authentication-local-development-service-principal) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/azure/developer/python/sdk/authentication-local-development-dev-accounts) | 
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/azure/developer/python/sdk/authentication-azure-hosted-apps) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/azure/developer/python/sdk/authentication-on-premises-apps) |

To work with the code examples in this article, assign the Azure RBAC built-in role **Storage File Data Privileged Contributor** to the security principal. This role provides full read, write, modify ACLs, and delete access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set. For more information, see [Access Azure file shares using Microsoft Entra ID with Azure Files OAuth over REST](authorize-oauth-rest.md).

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Azure Files is to obtain an OAuth token by creating a [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) instance. You can then use that credential to create a `ShareClient` object.

The following example creates a `ShareClient` object authorized using `DefaultAzureCredential`, then creates a `ShareDirectoryClient` object to work with a directory in the share:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.fileshare import ShareClient

account_name = "<account-name>"
share_name = "<share-name>"

# Create the share client using DefaultAzureCredential
share_client = ShareClient(
    account_url=f"https://{account_name}.file.core.windows.net",
    share_name=share_name,
    credential=DefaultAzureCredential(),
    # When using a token credential, you MUST specify a token_intent
    token_intent='backup'
)

# Get a reference to a directory in the share
directory_client = share_client.get_directory_client("sample-directory")
```

If you know exactly which credential type you use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/python/api/azure-core/azure.core.credentials.tokencredential) class.

## [Account key](#tab/account-key)

To use a storage account shared key, provide the key as a string and initialize a `ShareClient` object.

```python
from azure.storage.fileshare import ShareClient

account_name = "<account-name>"
account_key = "<account-key>"
share_name = "<share-name>"
credential = account_key

# Create a share client using the account key
share_client = ShareClient(
    account_url=f"https://{account_name}.file.core.windows.net",
    share_name=share_name,
    credential=credential
)

# Get a reference to a directory in the share
directory_client = share_client.get_directory_client("sample-directory")
```

You can also create a `ShareClient` by using a connection string. 

```python
from azure.storage.fileshare import ShareClient

connection_string = "<connection-string>"
share_name = "<share-name>"

# Create a share client using the connection string
share_client = ShareClient.from_connection_string(connection_string, share_name)

# Get a reference to a directory in the share
directory_client = share_client.get_directory_client("sample-directory")
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service can become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

To learn more about each of these authorization mechanisms, see [Choose how to authorize access to file data](authorize-data-operations-portal.md).

### Example: Copy files using the File Shares client library

You can copy files within a file share or between file shares by using the following method:

- [start_copy_from_url](/python/api/azure-storage-file-share/azure.storage.fileshare.sharefileclient#azure-storage-fileshare-sharefileclient-start-copy-from-url)

You can copy a file to a destination blob by using the following method from a `BlobClient` object:

- [start_copy_from_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-start-copy-from-url)

The following code example shows how to copy a file to a file in another file share:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.fileshare import ShareFileClient

# Define storage account parameters
account_name = "<account-name>"
src_share_name = "src-file-share"
dest_share_name = "dest-file-share"
src_file_path = "src/path/to/file"
dest_file_path = "dest/path/to/file"

# Create token credential
token_credential = DefaultAzureCredential()

# Create source file client
src_file_client = ShareFileClient(
    account_url=f"https://{account_name}.file.core.windows.net",
    share_name=src_share_name,
    file_path=src_file_path,
    credential=token_credential,
    token_intent='backup'
)

# Create destination file client
dest_file_client = ShareFileClient(
    account_url=f"https://{account_name}.file.core.windows.net",
    share_name=dest_share_name,
    file_path=dest_file_path,
    credential=token_credential,
    token_intent='backup'
)

# Copy the file from the source share to the destination share
copy_operation = dest_file_client.start_copy_from_url(src_file_client.url)
```

### Example: Lease a file using the File Shares client library

A lease creates a lock on a file that's managed by Azure via a lease ID. The lease provides a mechanism to coordinate access to files across multiple clients in a distributed system. A lease on a file provides exclusive write and delete access. To learn more about lease states and actions, see [Lease File](/rest/api/storageservices/lease-file#remarks).

The following code example shows how to create a lease client, acquire an infinite duration lease on a file, and release the lease:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.fileshare import ShareFileClient, ShareLeaseClient

# Define storage account parameters
account_name = "<account-name>"
share_name = "sample-file-share"
file_path = "path/to/file"

# Create a DefaultAzureCredential for authentication
token_credential = DefaultAzureCredential()

# Create a ShareFileClient
file_client = ShareFileClient(
    account_url=f"https://{account_name}.file.core.windows.net",
    share_name=share_name,
    file_path=file_path,
    credential=token_credential,
    token_intent='backup'
)

# Get a lease client for the file
lease_client = ShareLeaseClient(file_client)

# Acquire an infinite duration lease on the file
lease_info = lease_client.acquire()

# Do something with the file while it's leased
# ...

# Release the lease
lease_client.release()
```

When using both SMB and the FileREST API, keep in mind that the FileREST API uses [leases](#example-lease-a-file-using-the-file-shares-client-library) to manage file locks, while SMB uses file system locks managed by the operating system. To learn more about managing file locking interactions between SMB and the FileREST API, see [Manage file locks](/rest/api/storageservices/managing-file-locks).

### Example: Create and list share snapshots using the File Shares client library

Share snapshots are read-only copies of a file share at a point in time. You can create a snapshot of a file share, and then use the snapshot to access the data in the share at the time the snapshot was created. You can also list all snapshots in a file share, and delete share snapshots.

The following code example shows how to create a share snapshot, list the snapshots in a file share, and traverse the root directory in a share snapshot:

```python
from azure.storage.fileshare import ShareServiceClient, ShareDirectoryClient

def list_root_directory_snapshot(root_dir: ShareDirectoryClient):
    for item in root_dir.list_directories_and_files():
        if item["is_directory"]:
            print(f"Directory in snapshot: {item['name']}")
        else:
            print(f"File in snapshot: {item['name']}")

# Connection string with account key (required for share snapshots)
connection_string = "<connection-string>"

# Create service and share clients
share_service_client = ShareServiceClient.from_connection_string(connection_string)
share_name = "sample-file-share"
share_client = share_service_client.get_share_client(share_name)

# Create a snapshot
snapshot_info = share_client.create_snapshot()
print(f"Snapshot created: {snapshot_info['snapshot']}")

# List snapshots in a share
for share_item in share_service_client.list_shares(include_snapshots=True):
    if share_item["snapshot"]:
        print(f"Share: {share_item['name']} (Snapshot: {share_item['snapshot']})")

# List directories and files in a share snapshot
snapshot_timestamp = snapshot_info["snapshot"]
share_snapshot = share_service_client.get_share_client(share_name, snapshot=snapshot_timestamp)
root_dir = share_snapshot.get_directory_client("")

list_root_directory_snapshot(root_dir)
```

>[!NOTE]
> OAuth tokens, such as those obtained when using `DefaultAzureCredential`, aren't allowed for data plane operations at the file share level. To work with share snapshots, the client object must be authorized using the account key. The `ShareClient` object created in this code example uses a connection string, which includes the account key.
>
> Storing account keys or connection strings presents a security risk. You should only use them when Microsoft Entra authentication isn't available. To learn more about securely storing account keys in Azure Key Vault, see [About Azure Key Vault managed storage account keys](/azure/key-vault/secrets/about-managed-storage-account-keys).

## Manage Azure Files resources using the Azure Storage management libraries

The Azure Storage management libraries are built on the Azure Storage resource provider REST API. The Azure Storage resource provider is a service based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview), and supports both declarative (templates) and imperative (direct API call) methods. The Azure Storage resource provider REST API provides programmatic access to Azure Storage resources, including file shares. The Azure SDK provides management libraries that build on the Azure Storage resource provider REST API.

The management libraries are recommended for operations that are performed at the *file service* or *file share* level. In this section, you learn how to use the Azure Storage management libraries to manage Azure Files resources.

### Example: Create a file share using the Azure Storage management library

The following code example shows how to create a top-level `ArmClient` object, register the Storage resource provider with a subscription, and create a file share using the Azure Storage management library:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient, SubscriptionClient
from azure.mgmt.storage import StorageManagementClient
from azure.mgmt.storage.models import FileShare

# Create the credential for authentication
credential = DefaultAzureCredential()

# Define variables
subscription_id = "<subscription-id>"
resource_group_name = "<resource-group-name>"
storage_account_name = "<storage-account-name>"
share_name = "sample-file-share"

# Create clients
resource_client = ResourceManagementClient(credential, subscription_id)
subscription_client = SubscriptionClient(credential)
storage_client = StorageManagementClient(credential, subscription_id)

# Register Microsoft.Storage resource provider, if not already registered
provider = resource_client.providers.get('Microsoft.Storage')
if provider.registration_state == "NotRegistered":
    resource_client.providers.register('Microsoft.Storage')

# Create a file share
file_share = storage_client.file_shares.create(
    resource_group_name=resource_group_name,
    account_name=storage_account_name,
    share_name=share_name,
    file_share=FileShare(
        share_quota=1  # Share size in GiB
        # Add other file share properties here
    )
)
```

You can configure the file share properties using the `FileShare` class. The previous example shows how to set the `share_quota` property. To learn more, see the [StorageManagementClient](/python/api/azure-mgmt-storage/azure.mgmt.storage.storagemanagementclient) class reference.

>[!NOTE]
> To perform the register operation, you need permissions for the following Azure RBAC action: Microsoft.Storage/register/action. This permission is included in the Contributor and Owner built-in roles.

### Example: List file shares and snapshots using the Azure Storage management library

The following code example shows how to list file shares and snapshots in a storage account:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.storage import StorageManagementClient

# Create the credential for authentication
credential = DefaultAzureCredential()

# Define variables
subscription_id = "<subscription-id>"
resource_group_name = "<resource-group-name>"
storage_account_name = "<storage-account-name>"
expand = "snapshots"  # Include snapshots in the response

# Create storage management client
storage_client = StorageManagementClient(credential, subscription_id)

# List all file shares with their snapshots
file_shares = storage_client.file_shares.list(
    resource_group_name=resource_group_name,
    account_name=storage_account_name,
    expand=expand
)

# Iterate over the file shares and print them along with any snapshots
for share in file_shares:
    print(f"Resource name: {share.name}")
    if share.snapshot_time:
        print(f"Snapshot: {share.snapshot_time}")
```

## Related content

For more information about developing with Azure Files, see the following resources:

- [Overview of application development with Azure Files](storage-files-developer-overview.md)
- [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Manage file locks](/rest/api/storageservices/managing-file-locks)
- [Operations on directories](/rest/api/storageservices/operations-on-directories)
- [Operations on files](/rest/api/storageservices/operations-on-files)