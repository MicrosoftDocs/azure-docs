---
title: Get started with Azure Blob Storage client library for Java
titleSuffix: Azure Storage
description: Get started developing a Java application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/18/2024
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Get started with Azure Blob Storage and Java

[!INCLUDE [storage-dev-guide-selector-getting-started](../../../includes/storage-dev-guides/storage-dev-guide-selector-getting-started.md)]

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for Java. Once connected, use the [developer guides](#build-your-app) to learn how your code can operate on containers, blobs, and features of the Blob Storage service.

If you're looking to start with a complete example, see [Quickstart: Azure Blob Storage client library for Java](storage-quickstart-blobs-java.md).

[API reference](/java/api/overview/azure/storage-blob-readme) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob) | [Samples](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org/download.cgi) is used for project management in this example

## Set up your project

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

Add the following dependency elements to the group of dependencies. The **azure-identity** dependency is needed for passwordless connections to Azure services.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
</dependency>
<dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-storage-common</artifactId>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

#### Include a direct dependency

To take dependency on a particular version of the library, add the direct dependency to your project:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>{package_version_to_target}</version>
</dependency>
<dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-storage-common</artifactId>
      <version>{package_version_to_target}</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>{package_version_to_target}</version>
</dependency>
```

### Include import directives

Then open your code file and add the necessary `import` directives. In this example, we add the following directives in the *App.java* file:

```java
import com.azure.core.credential.*;
import com.azure.identity.*;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.blob.specialized.*;
import com.azure.storage.common.*;
```

Blob client library information:

- [com.azure.storage.blob](/java/api/com.azure.storage.blob): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.
- [com.azure.storage.blob.models](/java/api/com.azure.storage.blob.models): Contains utility classes, structures, and enumeration types.
- [com.azure.storage.blob.specialized](/java/api/com.azure.storage.blob.specialized): Contains classes that you can use to perform operations specific to a blob type (For example: append blobs).

## Authorize access and connect to Blob Storage

To connect an app to Blob Storage, create an instance of the [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) class. You can also use the [BlobServiceAsyncClient](/java/api/com.azure.storage.blob.blobserviceasyncclient) class for [asynchronous programming](/azure/developer/java/sdk/async-programming). This object is your starting point to interact with data resources at the storage account level. You can use it to operate on the storage account and its containers. You can also use the service client to create container clients or blob clients, depending on the resource you need to work with.

To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).

You can authorize a `BlobServiceClient` object by using a Microsoft Entra authorization token, an account access key, or a shared access signature (SAS). For optimal security, Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests against blob data. For more information, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

<a name='azure-ad-recommended'></a>

## [Microsoft Entra ID (recommended)](#tab/azure-ad)

To authorize with Microsoft Entra ID, you'll need to use a [security principal](../../active-directory/develop/app-objects-and-service-principals.md). Which type of security principal you need depends on where your app runs. Use the following table as a guide:

| Where the app runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). | 
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object.

Make sure you have the correct dependencies in pom.xml and the necessary import directives, as described in [Set up your project](#set-up-your-project).

The following example uses [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a `BlobServiceClient` object using `DefaultAzureCredential`, and shows how to create container and blob clients, if needed:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientAzureAD":::

## [SAS token](#tab/sas-token)

Use [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object using a SAS token:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientSAS":::

To learn more about generating and managing SAS tokens, see the following articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)
- [Create an account SAS with Java](../common/storage-account-sas-create-java.md)
- [Create a service SAS with Java](sas-service-create-java.md)
- [Create a user delegation SAS with Java](storage-blob-user-delegation-sas-create-java.md)

> [!NOTE]
> For scenarios where shared access signatures (SAS) are used, Microsoft recommends using a user delegation SAS. A user delegation SAS is secured with Microsoft Entra credentials instead of the account key.

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/java/api/com.azure.storage.common.storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientAccountKey":::

You can also create a `BlobServiceClient` object using a connection string.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientConnectionString":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Configure the JVM TTL for DNS name lookups

The Java Virtual Machine (JVM) caches responses from successful DNS name lookups for a specified period of time, known as time-to-live (TTL). The default TTL value for many JVMs is `-1`, which means that the JVM caches the response indefinitely, or until the JVM is restarted.

Because Azure resources use DNS name entries that can change, we recommend that you set the JVM TTL value to 10 seconds. This configuration ensures that an updated IP address for a resource is returned with the next DNS query.

To change the TTL value globally for all applications using the JVM, set the `networkaddress.cache.ttl` property in the `java.security` file.

```plaintext
networkaddress.cache.ttl=10
```

For Java 8, the `java.security` file is located in the `$JAVA_HOME/jre/lib/security` directory. For Java 11 and higher, the file is located in the `$JAVA_HOME/conf/security` directory.

## Build your app

As you build apps to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to access data and perform specific actions using the Azure Storage client library for Java:

| Guide | Description |
|--|---|
| [Configure a retry policy](storage-retry-policy-java.md) | Implement retry policies for client operations. |
| [Copy blobs](storage-blob-copy-java.md) | Copy a blob from one location to another. |
| [Create a container](storage-blob-container-create-java.md) | Create blob containers. |
| [Create a user delegation SAS](storage-blob-user-delegation-sas-create-java.md) | Create a user delegation SAS for a container or blob. |
| [Create and manage blob leases](storage-blob-lease-java.md) | Establish and manage a lock on a blob. |
| [Create and manage container leases](storage-blob-container-lease-java.md) | Establish and manage a lock on a container. |
| [Delete and restore blobs](storage-blob-delete-java.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Delete and restore containers](storage-blob-container-delete-java.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [Download blobs](storage-blob-download-java.md) | Download blobs by using strings, streams, and file paths. |
| [Find blobs using tags](storage-blob-tags-java.md) | Set and retrieve tags as well as use tags to find blobs. |
| [List blobs](storage-blobs-list-java.md) | List blobs in different ways. |
| [List containers](storage-blob-containers-list-java.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata (blobs)](storage-blob-properties-metadata-java.md) | Get and set properties and metadata for blobs. |
| [Manage properties and metadata (containers)](storage-blob-container-properties-metadata-java.md) | Get and set properties and metadata for containers. |
| [Performance tuning for data transfers](storage-blobs-tune-upload-download-java.md) | Optimize performance for data transfer operations. |
| [Set or change a blob's access tier](storage-blob-use-access-tier-java.md) | Set or change the access tier for a block blob. |
| [Upload blobs](storage-blob-upload-java.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
