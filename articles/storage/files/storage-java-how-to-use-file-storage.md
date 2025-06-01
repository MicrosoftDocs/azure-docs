---
title: Develop for Azure Files with Java
description: Learn how to develop Java applications and services that use Azure Files to store file data. Create and delete files, file shares, and directories.
author: pauljewellmsft
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/08/2025
ms.custom: devx-track-java, devx-track-extended-java
ms.author: pauljewell
---

# Develop for Azure Files with Java

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn how to develop Java applications that use Azure Files to store data. Azure Files is a managed file share service in the cloud. It provides fully managed file shares that are accessible via the industry standard Server Message Block (SMB) and Network File System (NFS) protocols. Azure Files also provides a REST API for programmatic access to file shares.

In this article, you learn about the different approaches to developing with Azure Files in Java, and how to choose the approach that best fits the needs of your app. You also learn how to create a basic console app that interacts with Azure Files resources.

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

## About Java app development with Azure Files

Azure Files offers several ways for Java developers to access data and manage resources in Azure Files. The following table lists the approaches, summarizes how they work, and provides guidance on when to use each approach:

| Approach | How it works | When to use |
| --- | --- | --- |
| Standard file I/O libraries | Uses OS-level API calls through Azure file shares mounted using SMB or NFS. When you mount a file share using SMB/NFS, you can use file I/O libraries for a programming language or framework, such as `java.io` and `java.nio` for Java. | You have line-of-business apps with existing code that uses standard file I/O, and you don't want to rewrite code for the app to work with an Azure file share. |
| FileREST API | Directly calls HTTPS endpoints to interact with data stored in Azure Files. Provides programmatic control over file share resources. The Azure SDK provides the File Shares client library (`com.azure.storage.file.share`) that builds on the FileREST API, allowing you interact with FileREST API operations through familiar Java programming language paradigms. | You're building value-added cloud services and apps for customers and you want to use advanced features not available through standard file I/O libraries. |
| Storage resource provider REST API | Uses Azure Resource Manager (ARM) to manage storage accounts and file shares. Calls REST API endpoints for various resource management operations. | Your app or service needs to perform resource management tasks, such as creating, deleting, or updating storage accounts or file shares. |

For general information about these approaches, see [Overview of application development with Azure Files](storage-files-developer-overview.md).

This article focuses on working with Azure Files resources using the following approaches:

- [Work with Azure Files using Java file I/O libraries](#work-with-azure-files-using-java-file-io-libraries): Mount a file share using SMB or NFS and use Java file I/O libraries to work with files and directories in the share.
- [Work with Azure Files using the File Shares client library for Java](#work-with-azure-files-using-the-file-shares-client-library-for-java): Use the Azure Storage File Shares client library for Java to work with files and directories in a file share. This client library builds on the FileREST API.
- [Manage Azure Files resources using the Azure Storage management libraries](#manage-azure-files-resources-using-the-azure-storage-management-libraries): Use the Azure Storage management libraries to manage file shares and other resources in your storage account. The management libraries build on the Azure Storage resource provider REST API.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org/download.cgi) is used for project management in this example

## Set up your environment

> [!NOTE]
> This article uses the Maven build tool to build and run the sample code. Other build tools, such as Gradle, also work with the Azure SDK for Java.

Use Maven to create a new console app, or open an existing project. Follow these steps to install packages and add the necessary `import` directives.

### Install packages

Open the `pom.xml` file in your text editor. Install the packages by [including the BOM file](#include-the-bom-file), or [including a direct dependency](#include-a-direct-dependency).

#### Include the BOM file
 
Add **azure-sdk-bom** to take a dependency on the latest version of the library. In the following snippet, replace the `{bom_version_to_target}` placeholder with the version number. Using **azure-sdk-bom** keeps you from having to specify the version of each individual dependency. To learn more about the BOM, see the [Azure SDK BOM README](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Add the following dependency elements to the group of dependencies. The **azure-identity** dependency is needed for passwordless connections to Azure services. Note that the resource manager artifacts are not included in the BOM file, so you need to add them as direct dependencies.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-file-share</artifactId>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-identity</artifactId>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-management</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager-storage</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
```

#### Include a direct dependency

To take a dependency on a particular version of the library, add the direct dependency to your project:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-file-share</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-identity</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager-storage</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-management</artifactId>
  <version>{package_version_to_target}</version>
</dependency>
```

### Include import directives

Then open your code file and add the necessary `import` directives. In this example, we add the following directives in the *App.java* file:

```java
import com.azure.identity.*;
import com.azure.storage.file.share.*;
import com.azure.resourcemanager.*;
import com.azure.resourcemanager.storage.models.*;
import com.azure.core.management.*;
import com.azure.core.management.profile.*;
```

If you plan to use the Java file I/O libraries, you also need to add the following import directives:

```java
import java.io.*;
import java.nio.file.*;
```

## Work with Azure Files using Java file I/O libraries

Standard file I/O libraries are the most common way to access and work with Azure Files resources. When you mount a file share using SMB or NFS, your operating system redirects API requests for the local file system. This approach allows you to use standard file I/O libraries, such as `java.io` and `java.nio`, to interact with files and directories in the share.

Consider using Java file I/O libraries when your app requires:

- **App compatibility:** Ideal for line-of-business apps with existing code that already uses Java file I/O libraries. You don't need to rewrite code for the app to work with an Azure file share.
- **Ease of use:** Java file I/O libraries are well known by developers and easy to use. A key value proposition of Azure Files is that it exposes native file system APIs through SMB and NFS.

In this section, you learn how to use Java file I/O libraries to work with Azure Files resources.

For more information and examples, see the following resource:

- [Java basic I/O](https://docs.oracle.com/javase/tutorial/essential/io/)

### Mount a file share

To use Java file I/O libraries, you must first mount a file share. See the following resources for guidance on how to mount a file share using SMB or NFS:

- [Mount an SMB file share on Windows](storage-how-to-use-files-windows.md)
- [Mount an SMB file share on Linux](storage-how-to-use-files-linux.md)
- [Mount an NFS file share on Linux](storage-files-how-to-mount-nfs-shares.md)

In this article, we use the following path to refer to a mounted SMB file share on Windows:

```java
String fileSharePath = "Z:\\file-share";
```

### Example: Connect to a file share and enumerate directories using Java file I/O libraries

The following code example shows how to connect to a file share and list the directories in the share:

```java
import java.io.*;
import java.nio.file.*;

// Add the following code to a new or existing function

String fileSharePath = "Z:\\file-share";

try {
    File directory = new File(fileSharePath);
    File[] dirs = directory.listFiles(File::isDirectory);
            
    if (dirs != null) {
        for (File dir : dirs) {
            System.out.println(dir.getName());
        }
        System.out.println(dirs.length + " directories found.");
    }
} catch (Exception e) {
    System.out.println("Error: " + e.getMessage());
}
```

### Example: Write to a file in a file share using Java file I/O libraries

The following code example shows how to write and append text to a file:

```java
import java.io.*;
import java.nio.file.*;
import java.util.Arrays;

// Add the following code to a new or existing function

String fileSharePath = "Z:\\file-share";
String fileName = "test.txt";

try {
    String textToWrite = "First line" + System.lineSeparator();
    Path filePath = Paths.get(fileSharePath, fileName);
        
    // Write initial content to file
    Files.write(filePath, textToWrite.getBytes());
    System.out.println("Initial text written to file");
        
    // Append additional lines to the file
    String[] textToAppend = { "Second line", "Third line" };
    Files.write(filePath, 
                Arrays.asList(textToAppend),
                StandardOpenOption.APPEND);
    System.out.println("Additional lines appended to file");
} catch (IOException ex) {
    System.out.println("Error writing to file: " + ex.getMessage());
}
```

### Example: Lock a file in a file share using Java file I/O libraries

SMB clients that mount file shares can use file system locking mechanisms to manage access to shared files.

The following code example shows how to lock a file in a file share:

```java
import java.io.*;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.file.*;

// Add the following code to a new or existing function

String fileSharePath = "Z:\\file-share";
String fileName = "test.txt";
String filePath = Paths.get(fileSharePath, fileName).toString();

try (
    FileOutputStream fos = new FileOutputStream(filePath);
    FileChannel fileChannel = fos.getChannel()) {

    // Acquire an exclusive lock on this file
    FileLock lock = fileChannel.lock();

    System.out.println("File is locked.");

    // Perform file operations here

    // Release the lock
    lock.release();
    System.out.println("File lock released.");

} catch (Exception e) {
    e.printStackTrace();
}
```

When using both SMB and the FileREST API, keep in mind that the FileREST API uses [leases](#example-lease-a-file-using-the-file-shares-client-library) to manage file locks, while SMB uses file system locks managed by the operating system. To learn more about managing file locking interactions between SMB and the FileREST API, see [Manage file locks](/rest/api/storageservices/managing-file-locks).

### Example: Enumerate file ACLs using Java file I/O libraries

The following code example shows how to enumerate access control lists (ACLs) for a file:

```java
import java.nio.file.*;
import java.nio.file.attribute.AclEntry;
import java.nio.file.attribute.AclFileAttributeView;
import java.util.List;

// Add the following code to a new or existing function

String fileSharePath = "Z:\\file-share";
String fileName = "test.txt";
String filePath = Paths.get(fileSharePath, fileName).toString();

try {
    Path path = Paths.get(filePath);

    // Get the ACL view for the file
    AclFileAttributeView aclView = Files.getFileAttributeView(
            path, AclFileAttributeView.class);

    // Get the ACL entries
    List<AclEntry> aclEntries = aclView.getAcl();

    // List all access rules for the file
    for (AclEntry entry : aclEntries) {
        System.out.println("Identity: " + entry.principal().getName());
        System.out.println("Access Control Type: " + entry.type());
        System.out.println("File System Rights: " + entry.permissions());
        System.out.println();
    }

    System.out.println(aclEntries.size() + " ACL entries found.");
} catch (Exception ex) {
    System.out.println("Error: " + ex.getMessage());
}
```

## Work with Azure Files using the File Shares client library for Java

The FileREST API provides programmatic access to Azure Files. It allows you to call HTTPS endpoints to perform operations on file shares, directories, and files. The FileREST API is designed for high scalability and advanced features that might not be available through native protocols. The Azure SDK provides client libraries, such as the File Shares client library for Java, that build on the FileREST API.

Consider using the FileREST API and the File Share client library if your application requires:

- **Advanced features:** Access operations and features that aren't available through native protocols.
- **Custom cloud integrations:** Build custom value-added services, such as backup, antivirus, or data management, that interact directly with Azure Files.
- **Performance optimization:** Benefit from performance advantages in high-scale scenarios using data plane operations.

The FileREST API models Azure Files as a hierarchy of resources, and is recommended for operations that are performed at the *directory* or *file* level. You should prefer the [Storage resource provider REST API](#manage-azure-files-resources-using-the-azure-storage-management-libraries) for operations that are performed at the *file service* or *file share* level.

In this section, you learn how to use the File Shares client library for Java to work with Azure Files resources.

For more information and examples, see the following resources:

- [Azure Storage File Shares client library for Java](/java/api/overview/azure/storage-file-share-readme)

### Authorize access and create a client

To connect an app to Azure Files, create a `ShareClient` object. This object is your starting point for working with Azure Files resources. The following code examples show how to create a `ShareClient` object using different authorization mechanisms.

## [Microsoft Entra ID (recommended)](#tab/entra-id)

To authorize with Microsoft Entra ID, you'll need to use a security principal. Which type of security principal you need depends on where your app runs. To learn more about authentication scenarios, see [Azure authentication with Java and Azure Identity](/azure/developer/java/sdk/authentication/overview).

To work with the code examples in this article, assign the Azure RBAC built-in role **Storage File Data Privileged Contributor** to the security principal. This role provides full read, write, modify ACLs, and delete access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set. For more information, see [Access Azure file shares using Microsoft Entra ID with Azure Files OAuth over REST](authorize-oauth-rest.md).

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Azure Files is to obtain an OAuth token by creating a [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) instance. You can then use that credential to create a `ShareClient` object.

The following example creates a `ShareClient` object authorized using `DefaultAzureCredential`, then creates a `ShareDirectoryClient` object to work with a directory in the share:

```java
import com.azure.core.credential.TokenCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.file.share.*;

// Add the following code to a new or existing function

String accountName = "<account-name>";
String shareName = "<share-name>";
TokenCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

// Create the ShareClient
ShareClient shareClient = new ShareClientBuilder()
    .endpoint(String.format("https://%s.file.core.windows.net", accountName))
    .shareName(shareName)
    .credential(defaultAzureCredential)
    .buildClient();

// Create a client to interact with a directory in the share
ShareDirectoryClient directoryClient = shareClient.getDirectoryClient("sample-directory");
```

If you know exactly which credential type you use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for Java](/java/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/java/api/com.azure.core.credential.tokencredential) class.

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/java/api/com.azure.storage.common.storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a `ShareClient`.

```java
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.file.share.*;

// Add the following code to a new or existing function

String accountName = "<account-name>";
String accountKey = "<account-key>";
String shareName = "<share-name>";

StorageSharedKeyCredential credential =
    new StorageSharedKeyCredential(accountName, accountKey);

// Create the ShareClient
ShareClient shareClient = new ShareClientBuilder()
    .endpoint(String.format("https://%s.file.core.windows.net", accountName))
    .shareName(shareName)
    .credential(credential)
    .buildClient();

// Create a client to interact with a directory in the share
ShareDirectoryClient directoryClient = shareClient.getDirectoryClient("sample-directory");
```

You can also create a `ShareClient` by using a connection string. 

```java
import com.azure.storage.file.share.*;

// Add the following code to a new or existing function

String connectionString = "<connection-string>";
String shareName = "<share-name>";

// Create the ShareClient
ShareClient shareClient = new ShareClientBuilder()
        .shareName(shareName)
        .connectionString(connectionString)
        .buildClient();

// Create a client to interact with a directory in the share
ShareDirectoryClient directoryClient = shareClient.getDirectoryClient("sample-directory");
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service can become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

To learn more about each of these authorization mechanisms, see [Choose how to authorize access to file data](authorize-data-operations-portal.md).

### Example: Copy files using the File Shares client library

You can copy files within a file share or between file shares by using the following method:

- [beginCopy](/java/api/com.azure.storage.file.share.sharefileclient#method-summary)

You can copy a file to a destination blob by using the following method from a `BlockBlobClient` object:

- [beginCopy](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details)

The following code example shows how to copy a file to a file in another file share:

```java
import java.time.*;
import java.util.*;

import com.azure.core.credential.TokenCredential;
import com.azure.core.util.polling.*;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.file.share.*;
import com.azure.storage.file.share.models.*;

// Add the following code to a new or existing function

String accountName = "<account-name>";
String srcShareName = "src-file-share";
String destShareName = "dest-file-share";
String srcFilePath = "src/path/to/file";
String destFilePath = "dest/path/to/file";

TokenCredential tokenCredential = new DefaultAzureCredentialBuilder().build();

ShareFileClient srcShareFileClient = new ShareFileClientBuilder()
    .endpoint(String.format("https://%s.file.core.windows.net", accountName))
    .shareName(srcShareName)
    .shareTokenIntent(ShareTokenIntent.BACKUP)
    .resourcePath(srcFilePath)
    .credential(defaultAzureCredential)
    .buildFileClient();

ShareFileClient destShareFileClient = new ShareFileClientBuilder()
    .endpoint(String.format("https://%s.file.core.windows.net", accountName))
    .shareName(destShareName)
    .shareTokenIntent(ShareTokenIntent.BACKUP)
    .resourcePath(destFilePath)
    .credential(defaultAzureCredential)
    .buildFileClient();

// Copy the file from the source share to the destination share
SyncPoller<ShareFileCopyInfo, Void> poller = destShareFileClient
        .beginCopy(srcShareFileClient.getFileUrl(),
                Collections.singletonMap("file", "metadata"),
                Duration.ofSeconds(2));

final PollResponse<ShareFileCopyInfo> pollResponse = poller.poll();
final ShareFileCopyInfo value = pollResponse.getValue();
System.out.printf("Copy source: %s. Status: %s.%n", value.getCopySourceUrl(), value.getCopyStatus());
```

### Example: Lease a file using the File Shares client library

A lease creates a lock on a file that's managed by Azure via a lease ID. The lease provides a mechanism to coordinate access to files across multiple clients in a distributed system. A lease on a file provides exclusive write and delete access. To learn more about lease states and actions, see [Lease File](/rest/api/storageservices/lease-file#remarks).

The following code example shows how to create a lease client, acquire an infinite duration lease on a file, and release the lease:

```java
import com.azure.core.credential.TokenCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.file.share.*;
import com.azure.storage.file.share.models.*;
import com.azure.storage.file.share.specialized.*;

// Add the following code to a new or existing function

String accountName = "<account-name>";
String shareName = "sample-file-share";
String filePath = "path/to/file";
        
TokenCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

ShareFileClient fileClient = new ShareFileClientBuilder()
    .endpoint(String.format("https://%s.file.core.windows.net", accountName))
    .shareName(shareName)
    .shareTokenIntent(ShareTokenIntent.BACKUP)
    .resourcePath(filePath)
    .credential(defaultAzureCredential)
    .buildFileClient();

// Get a ShareLeaseClient
ShareLeaseClient fileLeaseClient = new ShareLeaseClientBuilder()
        .fileClient(fileClient)
        .shareTokenIntent(ShareTokenIntent.BACKUP)
        .buildClient();
        
try {
    // Acquire a lease on the file with infinite duration
    fileLeaseClient.acquireLease();
    System.out.println("Lease acquired successfully");
            
    // Do something with the file

} catch (Exception e) {
    System.err.println("Error: " + e.getMessage());
} finally {
    // Release the lease when finished
    try {
        fileLeaseClient.releaseLease();
        System.out.println("Lease released successfully.");
    } catch (Exception e) {
        System.err.println(e.getMessage());
    }
}
```

When using both SMB and the FileREST API, keep in mind that the FileREST API uses [leases](#example-lease-a-file-using-the-file-shares-client-library) to manage file locks, while SMB uses file system locks managed by the operating system. To learn more about managing file locking interactions between SMB and the FileREST API, see [Manage file locks](/rest/api/storageservices/managing-file-locks).

### Example: Create and list share snapshots using the File Shares client library

Share snapshots are read-only copies of a file share at a point in time. You can create a snapshot of a file share, and then use the snapshot to access the data in the share at the time the snapshot was created. You can also list all snapshots in a file share, and delete share snapshots.

The following code example shows how to create a share snapshot, list the snapshots in a file share, and traverse the directory tree in a share snapshot:

```java
import com.azure.storage.file.share.*;
import com.azure.storage.file.share.models.*;

// Add the following code to a new or existing function

public static void main(String[] args) {
    String connectionString = "<connection-string>";

    // Create a ShareServiceClient from which you can create clients for specific shares
    ShareServiceClient shareServiceClient = new ShareServiceClientBuilder()
    .connectionString(connectionString)
        .buildClient();
        
    // Get a client for a specific share
    ShareClient shareClient = shareServiceClient.getShareClient("sample-file-share");

    try {
        // Create a snapshot
        ShareSnapshotInfo snapshotInfo = shareClient.createSnapshot();
        System.out.println("Snapshot created: " + snapshotInfo.getSnapshot());

        // List snapshots in a share
        ListSharesOptions options = new ListSharesOptions()
            .setIncludeSnapshots(true);
                
        for (ShareItem shareItem : shareServiceClient.listShares(options, null, null)) {
            if (shareItem.getSnapshot() != null) {
                System.out.println("Share: " + shareItem.getName() + 
                    " (Snapshot: " + shareItem.getSnapshot() + ")");
            }
        }

        // List directories and files in a share snapshot
        String snapshotTimestamp = snapshotInfo.getSnapshot();
        ShareClient shareSnapshot = shareClient.getSnapshotClient(snapshotTimestamp);
        ShareDirectoryClient rootDir = shareSnapshot.getRootDirectoryClient();

        listDirectoryTree(rootDir);
            
    } catch (Exception e) {
        System.err.println("Error: " + e.getMessage());
    }
 }
    
private static void listDirectoryTree(ShareDirectoryClient directory) {
    // List all files and directories in current directory
    for (ShareFileItem fileItem : directory.listFilesAndDirectories()) {
        if (fileItem.isDirectory()) {
            System.out.println("Directory: " + fileItem.getName());
            // Recursively list subdirectory contents
            listDirectoryTree(directory.getSubdirectoryClient(fileItem.getName()));
        } else {
            System.out.println("File: " + fileItem.getName());
        }
    }
}
```

>[!NOTE]
> OAuth tokens, such as those obtained when using `DefaultAzureCredential`, aren't allowed for data plane operations at the file share level. To work with share snapshots, the client object must be authorized using the account key. The `ShareClient` object created in this code example uses a connection string, which includes the account key.
>
> Storing account keys or connection strings presents a security risk. You should only use them when Microsoft Entra authentication isn't available. To learn more about securely storing account keys in Azure Key Vault, see [About Azure Key Vault managed storage account keys](/azure/key-vault/secrets/about-managed-storage-account-keys).

## Manage Azure Files resources using the Azure Storage management libraries

The Azure Storage management libraries are built on the Azure Storage resource provider REST API. The Azure Storage resource provider is a service based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview), and supports both declarative (templates) and imperative (direct API call) methods. The Azure Storage resource provider REST API provides programmatic access to Azure Storage resources, including file shares. The Azure SDK provides management libraries that build on the Azure Storage resource provider REST API.

The management libraries are recommended for operations that are performed at the *file service* or *file share* level. In this section, you learn how to use the Azure Storage management libraries to manage Azure Files resources.

The Azure Storage management libraries are built on the Azure Storage resource provider REST API. The Azure Storage resource provider is a service based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview), and supports both declarative (templates) and imperative (direct API call) methods. The Azure Storage resource provider REST API provides programmatic access to Azure Storage resources, including file shares. The Azure SDK provides management libraries that build on the Azure Storage resource provider REST API.

The management libraries are recommended for operations that are performed at the *file service* or *file share* level. In this section, you learn how to use the Azure Storage management libraries to manage Azure Files resources.

### Example: Create a file share using the Azure Storage management library

The following code example shows how to create a top-level `AzureResourceManager` object, register the Storage resource provider with a subscription, and create a file share using the Azure Storage management library:

```java
import com.azure.identity.*;
import com.azure.resourcemanager.*;
import com.azure.resourcemanager.storage.fluent.*;
import com.azure.resourcemanager.storage.fluent.models.*;

import com.azure.core.credential.TokenCredential;
import com.azure.core.management.*;
import com.azure.core.management.profile.*;

// Add the following code to a new or existing function

String subscriptionID = "<subscription-id>";
String rgName = "<resource-group-name>";
String saName = "<storage-account-name>";
TokenCredential credential = new DefaultAzureCredentialBuilder().build();
AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

AzureResourceManager armClient = AzureResourceManager
        .configure()
        .authenticate(credential, profile)
        .withSubscription(subscriptionID);

// Check the registration state of the resource provider and register, if needed
if (armClient.providers().getByName("Microsoft.Storage").registrationState() == "NotRegistered")
    armClient.providers().register("Microsoft.Storage");

// Create a new file share

StorageManagementClient storageManagementClient = armClient.storageAccounts().manager().serviceClient();
FileSharesClient fileShare = storageManagementClient.getFileShares();

String shareName = "sample-file-share";
int quotaInGB = 1;
        
// Create the file share
fileShare.create(
    rgName,
    saName,
    shareName,
    new FileShareInner()
        .withShareQuota(quotaInGB)
);
```

You can configure the file share properties using the [FileShareInner](/java/api/com.azure.resourcemanager.storage.fluent.models.fileshareinner) class. The previous example shows how to set the share quota when creating the file share. To update an existing file share, call `fileShare.update()` and pass in the `FileShareInner` object with the properties you want to update.

>[!NOTE]
> To perform the register operation, you need permissions for the following Azure RBAC action: Microsoft.Storage/register/action. This permission is included in the Contributor and Owner built-in roles.

### Example: List file shares and snapshots using the Azure Storage management library

The following code example shows how to list file shares and snapshots in a storage account:

```java
import com.azure.identity.*;
import com.azure.resourcemanager.*;
import com.azure.resourcemanager.storage.fluent.*;
import com.azure.resourcemanager.storage.fluent.models.*;

import com.azure.core.credential.TokenCredential;
import com.azure.core.http.rest.PagedIterable;
import com.azure.core.management.*;
import com.azure.core.management.profile.*;
import com.azure.core.util.Context;

// Add the following code to a new or existing function

String subscriptionID = "<subscription-id>";
String rgName = "<resource-group-name>";
String saName = "<storage-account-name>";
TokenCredential credential = new DefaultAzureCredentialBuilder().build();
AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

AzureResourceManager armClient = AzureResourceManager
        .configure()
        .authenticate(credential, profile)
        .withSubscription(subscriptionID);

// Check the registration state of the resource provider and register, if needed
if (armClient.providers().getByName("Microsoft.Storage").registrationState() == "NotRegistered")
    armClient.providers().register("Microsoft.Storage");

StorageManagementClient storageManagementClient = armClient.storageAccounts().manager().serviceClient();
FileSharesClient fileShare = storageManagementClient.getFileShares();

// List all file shares and include snapshots

PagedIterable<FileShareItemInner> fileShares = fileShare.list(
    rgName,               // resource group name
    saName,               // storage account name
    null,                 // maxpagesize
    null,                 // filter
    "snapshots",          // expand to include snapshots
    Context.NONE);        // context

for (FileShareItemInner fileShareItem : fileShares) {
    System.out.println("File share name: " + fileShareItem.name());
    System.out.println("File share quota: " + fileShareItem.shareQuota());
}
```

## Next steps

For more information about developing with Azure Files, see the following resources:

- [Overview of application development with Azure Files](storage-files-developer-overview.md)
- [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Manage file locks](/rest/api/storageservices/managing-file-locks)
- [Operations on directories](/rest/api/storageservices/operations-on-directories)
- [Operations on files](/rest/api/storageservices/operations-on-files)
