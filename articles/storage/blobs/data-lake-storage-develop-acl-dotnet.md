---
title: Manage file and directory level permissions in Azure Storage by using code
description: Use code to manage file and directory level permissions in Azure Blob storage accounts that have a hierarchical namespace.
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage file and directory level permissions in Azure Storage by using code

This article shows you how to use code to get and set the access control lists (ACLs) of directories and files in storage accounts that have a hierarchical namespace. 

To learn more about ACLs, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Connect to the storage account

# [.NET](#tab/dotnet)

First, parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

Then, create an object that represents Blob storage in your storage account by calling the [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method.

```cs
public bool GetBlobClient(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
{
    if (CloudStorageAccount.TryParse
        (storageConnectionString, out CloudStorageAccount storageAccount))
        {
            cloudBlobClient = storageAccount.CreateCloudBlobClient();

            return true;
        }
        else
        {
            return false;
        }
    }
}
```

# [Java](#tab/java)

First, parse the connection string by calling the [CloudStorageAccount.parse](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.parse?view=azure-java-legacy) method. 

Then, create an object that represents Blob storage in your storage account by calling the [createCloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.createcloudblobclient?view=azure-java-legacy) method.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account.   

# [Python](#tab/python)

Create an object that represents Blob storage in your storage account by creating an instance of a [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python). 

```python
def initialize_storage_account(storage_account_name, storage_account_key):
    try:
       global block_blob_service

       block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_key)

    except Exception as e:
        print(e)
```

---

## Get the ACL of a directory

# [.NET](#tab/dotnet)

Get the ACL of a directory by calling the **cloudBlobDirectory.FetchAccessControlsAsync** method. 

This populates the **CloudBlobDirectory.PathProperties** property with the ACL of the directory. 

You can use the **CloudBlobDirectory.PathProperties.ACL** property to get a collection of ACL entries. 

This example gets the ACL of a directory named `my-directory`, and then prints the short form of ACL to the console.

```cs
public async Task GetDirectoryACLs(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.FetchAccessControlsAsync();

            string ACL = "";

            foreach (PathAccessControlEntry entry in cloudBlobDirectory.PathProperties.ACL)
            {
                ACL = ACL + entry.ToString() + " ";
            }

            Console.WriteLine(ACL);
        }
    }
}
```

# [Java](#tab/java)

Get the ACL of a directory by calling the **CloudBlobDirectory.downloadSecurityInfo** method.

Call the **CloudBlobDirectory.getAccessControlList** method to return a collection of ACL entries.

This example gets the ACL of a directory named `my-directory` directory, and then prints the short form of the ACL to the console.

```java
static void GetDirectoryACL(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

            cloudBlobDirectory.downloadSecurityInfo();

            if (cloudBlobDirectory != null){

                String ACL = "";

                for (PathAccessControlEntry entry :cloudBlobDirectory.getAccessControlList()) {
                     ACL = ACL + entry.toString();
                }

                 System.out.println(ACL);
            }
    }
}

```

# [Python](#tab/python)

Get the access permissions of a directory by calling the **BlockBlobService.get_path_access_control** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory.

This example gets the ACL of a directory named `my-directory`, and then prints the short form of ACL to the console.

```python
def get_directory_permissions(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory")
        
        print(path_properties.acl)

        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

---

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions.

## Get the ACL of a file

# [.NET](#tab/dotnet)

Get the ACL of a file by calling the **CloudBlockBlob.FetchAccessControlsAsync** method. 

This populates the **CloudBlockBlob.PathProperties** property with the ACL of the file. 

You can use the **CloudBlockBlob.PathProperties.ACL** property to get a list of ACL entries. 

This example gets the ACL of a file and then prints the short form of ACL to the console.

```cs
public async Task GetFileACL(CloudBlobClient cloudBlobClient,
    string containerName, string blobName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.FetchAccessControlsAsync();

            string ACL = "";

            foreach (PathAccessControlEntry entry in cloudBlockBlob.PathProperties.ACL)
            {
                ACL = ACL + entry.ToString() + " ";
            }

            Console.WriteLine(ACL);
        }
    }

}
```

# [Java](#tab/java)

Get the ACL of a file by calling the **CloudBlockBlob.downloadSecurityInfo** method.

Call the **CloudBlockBlob.getAccessControlList** method to return a collection of ACL entries.

This example gets the ACL of a file and then prints the short form of the ACL to the console.

```java
static void GetFileACL(CloudBlobClient cloudBlobClient, String containerName,
String blobName) throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

            if (cloudBlobDirectory != null){

                CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.getBlockBlobReference(blobName);

                cloudBlockBlob.downloadSecurityInfo();

                if (cloudBlockBlob != null){

                    String ACL = "";

                    for (PathAccessControlEntry entry :cloudBlockBlob.getAccessControlList()) {
                        ACL = ACL + entry.toString();
                     }

                     System.out.println(ACL);
                }

            }
    }
}
``` 

# [Python](#tab/python)

Get the access permissions of a file by calling the **BlockBlobService.get_path_access_control** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the file.

This example gets the ACL of a file named `my-file.txt`, and then prints the short form of ACL to the console.

```python
def get_file_ACL(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory/my-file.txt")

        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

---

## Set the ACL of a directory

# [.NET](#tab/dotnet)

Set the **Execute**, **Read**, and **Write** property for the owning user, owning group, or other users. Then, call the **CloudBlobDirectory.SetAcl** method to commit the setting. 

This example gives read access to all users.

```cs
public async Task SetDirectoryACLs(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.FetchAccessControlsAsync();


            foreach (PathAccessControlEntry entry in cloudBlobDirectory.PathProperties.ACL)
            {
                switch (entry.AccessControlType)
                {
                    case AccessControlType.Other:
                        entry.Permissions.Read = true;
                        break;

                    case AccessControlType.Group:
                        // set permissions for the owning group.
                        break;

                    case AccessControlType.User:
                        // set permissions for the owning user.
                        break;
                }
  
            }

            cloudBlobDirectory.SetAcl();
        }
    }
}
```

# [Java](#tab/java)

Set the ACL of a directory by setting the permission of an existing entry in the access control list or by adding a new entry to the access control list.

This example gets the ACL of a directory named `my-directory` directory, and locates the entry for all users other than the owning group and owning user. Then, it modifies that entry to grant read access to those users.

```java
static void SetDirectoryACL(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);


    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            cloudBlobDirectory.downloadSecurityInfo();

            RolePermissions perms = new RolePermissions();
            perms.setRead(true);

            for (PathAccessControlEntry entry :cloudBlobDirectory.getAccessControlList()) {
                if (entry.getAccessControlType() == AccessControlType.OTHER){
                    entry.setPermissions(perms);
                }
           }
            cloudBlobDirectory.uploadACL();
        }
     }
}
``` 

# [Python](#tab/python)

Set the access permissions of a directory by calling the **BlockBlobService.set_directory_permissions** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory.
- The short form of the desired ACL.

This example gives read access to all users.

```python
def set_directory_permissions(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory", acl='other::r--')
        
    except Exception as e:
        print(e)
```

---

## Set the ACL of a file

# [.NET](#tab/dotnet)

Set the **Execute**, **Read**, and **Write** property for the owning user, owning group, or other users. Then, call the **CloudBlockBlob.SetAcl** method to commit the setting. 

This example gives read access to all users.

```cs
public async Task SetFileACL(CloudBlobClient cloudBlobClient,
    string containerName, string blobName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.FetchAccessControlsAsync();


            foreach (PathAccessControlEntry entry in cloudBlockBlob.PathProperties.ACL)
            {
                switch (entry.AccessControlType)
                {
                    case AccessControlType.Other:
                        entry.Permissions.Read = true;
                        break;

                    case AccessControlType.Group:
                        // set permissions for the owning group.
                        break;

                    case AccessControlType.User:
                        // set permissions for the owning user.
                        break;
                }

            }

            cloudBlockBlob.SetAcl();

        }
    }

}
```

# [Java](#tab/java)

Set the ACL of a file by setting the permission of an existing entry in the access control list or by adding a new entry to the access control list.

This example gets the ACL of a file, and locates the entry for all users other than the owning group and owning user. Then, it modifies that entry to grant read access to those users.

```java
static void SetFileACL(CloudBlobClient cloudBlobClient, String containerName, String blobName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
            cloudBlobDirectory.getBlockBlobReference(blobName);

            if (cloudBlockBlob != null){

                cloudBlockBlob.downloadSecurityInfo();

                RolePermissions perms = new RolePermissions();
                perms.setRead(true);

                for (PathAccessControlEntry entry :cloudBlockBlob.getAccessControlList()) {
                    if (entry.getAccessControlType() == AccessControlType.OTHER){
                        entry.setPermissions(perms);
                    }
                }

                cloudBlockBlob.uploadACL();
            }
        }
     }
}
``` 

# [Python](#tab/python)

Set the access permissions of a file by calling the **BlockBlobService.set_directory_permissions** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the file.
- The short form of the desired ACL.

This example gives read access to all users.

```python
def set_file_ACL(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory/my-file.txt", acl='other::r--')
        
    except Exception as e:
        print(e)
```

---

## Next steps

Learn to create, rename, list, move, and delete directories. See [Create and manage directories in Azure Storage by using code](data-lake-storage-develop-manage-directories.md).

Explore more APIs.

# [.NET](#tab/dotnet)

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

# [Java](#tab/java)

See the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs. 

# [Python](#tab/python)

See the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.

