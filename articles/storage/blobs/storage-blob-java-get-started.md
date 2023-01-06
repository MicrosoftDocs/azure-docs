---
title: Get started with Azure Blob Storage client library for Java
titleSuffix: Azure Storage
description: Get started developing a Java application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.subservice: blobs
ms.custom: devx-track-java, devguide-java
---

# Get started with Azure Blob Storage and Java

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for Java. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference documentation](/java/api/overview/azure/storage-blob-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-storage-blob) | [Samples](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org/download.cgi) is used for project management in this example


## Set up your project

Use Maven to create a new console app, or open an existing project. Open the `pom.xml` file in your text editor.

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

To connect to Blob Storage, create an instance of the [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and its containers. You can create a `BlobServiceClient` object by using an Azure Active Directory (Azure AD) authorization token, an account access key, or a shared access signature (SAS).

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## [Azure AD (Recommended)](#tab/azure-ad)

To authorize with Azure AD, you'll need to use a [security principal](/azure/active-directory/develop/app-objects-and-service-principals). Which type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | In this method, dedicated **application service principal** objects are set up using the App registration process for use during local development. The identity of the service principal is then stored as environment variables to be accessed by the app when it's run in local development.<br><br>This method allows you to assign the specific resource permissions needed by the app to the service principal objects used by developers during local development. This approach ensures the application only has access to the specific resources it needs and replicates the permissions the app will have in production.<br><br>The downside of this approach is the need to create separate service principal objects for each developer that works on an application.<br><br>To learn how to register the app, set up an Azure AD group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). | 
| Local machine (developing and testing) | User identity | In this method, a developer must be signed-in to Azure from either the Azure Tools extension for VS Code, the Azure CLI, or Azure PowerShell on their local workstation. The application then can access the developer's credentials from the credential store and use those credentials to access Azure resources from the app.<br><br>This method has the advantage of easier setup since a developer only needs to sign in to their Azure account from VS Code or the Azure CLI. The disadvantage of this approach is that the developer's account likely has more permissions than required by the application, therefore not properly replicating the permissions the app will run with in production.<br><br>To learn how to set up an Azure AD group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). | 
| Hosted in Azure | Managed identity | Apps hosted in Azure should use a **managed identity service principal**. Managed identities are designed to represent the identity of an app hosted in Azure and can only be used with Azure hosted apps.<br><br>For example, a Java app hosted in Azure App Service would be assigned a managed identity. The managed identity assigned to the app would then be used to authenticate the app to other Azure services.<br><br>To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | Apps hosted outside of Azure (for example on-premises apps) that need to connect to Azure services should use an **application service principal**. An application service principal represents the identity of the app in Azure and is created through the application registration process.<br><br>For example, consider a Java app hosted on-premises that makes use of Azure Blob Storage. You would create an application service principal for the app using the App registration process. The `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` would all be stored as environment variables to be read by the application at runtime and allow the app to authenticate to Azure using the application service principal.<br><br>To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). |

#### Authorize access using DefaultAzureCredential

The easiest way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object.

Make sure you have the correct dependencies in pom.xml and the necessary import directives, as described in [Set up your project](#set-up-your-project).

The following example uses [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object using `DefaultAzureCredential`:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientAzureAD":::

## [SAS token](#tab/sas-token)

Use [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object using a SAS token:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientSAS":::

To generate and manage SAS tokens, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json).

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/java/api/com.azure.storage.common.storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientAccountKey":::

You can also create a `BlobServiceClient` object using a connection string.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/App.java" id="Snippet_GetServiceClientConnectionString":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.
- Containers, which organize the blob data in your storage account.
- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated Java classes. These are the basic classes:

| Class | Description |
|---|---|
| [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/java/api/com.azure.storage.blob.blobclient) | Allows you to manipulate Azure Storage blobs.|
| [AppendBlobClient](/java/api/com.azure.storage.blob.specialized.appendblobclient) | Allows you to perform operations specific to append blobs such as periodically appending log data.|
| [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data.|

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create-java.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete-java.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list-java.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata (containers)](storage-blob-container-properties-metadata-java.md) | Get and set properties and metadata for containers. |
| [Create and manage container leases](storage-blob-container-lease-java.md) | Establish and manage a lock on a container. |
| [Create and manage blob leases](storage-blob-lease-java.md) | Establish and manage a lock on a blob. |
| [Upload blobs](storage-blob-upload-java.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download-java.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy-java.md) | Copy a blob from one location to another. |
| [List blobs](storage-blobs-list-java.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete-java.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags-java.md) | Set and retrieve tags as well as use tags to find blobs. |
| [Manage properties and metadata (blobs)](storage-blob-properties-metadata-java.md) | Get and set properties and metadata for blobs. |