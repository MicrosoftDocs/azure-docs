---
title: "Quickstart: Quarkus Extension for Azure Blob Storage"
description: In this quickstart, you learn how to use the Quarkus extension for Azure Blob Storage to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: KarlErickson
ms.author: karler
ms.reviewer: jiangma
ms.custom: devx-track-java, mode-api, passwordless-java, devx-track-extended-azdevcli, devx-track-javaee-quarkus, devx-track-javaee-quarkus-storage-blob
ms.date: 03/18/2025
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: java
# Customer intent: As a Java developer, I want to utilize the Quarkus extension for Azure Blob Storage so that I can efficiently manage blob storage operations like creating containers, uploading, and downloading blobs in my applications.
---

# Quickstart: Quarkus extension for Azure Blob Storage

Get started with the Quarkus extension for Azure Blob Storage to manage blobs and containers. In this article, you follow steps to try out example code for basic tasks.

[Reference documentation](https://docs.quarkiverse.io/quarkus-azure-services/dev/quarkus-azure-storage-blob.html) | [Library source code](https://github.com/quarkiverse/quarkus-azure-services/tree/main/services/azure-storage-blob) | [Package (Maven)](https://mvnrepository.com/artifact/io.quarkiverse.azureservices/quarkus-azure-storage-blob) | [Sample](https://github.com/quarkiverse/quarkus-azure-services/tree/main/integration-tests/azure-storage-blob)

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Azure CLI - [Install the Azure CLI](/cli/azure/install-azure-cli) 2.62.0 or above to run Azure CLI commands.
- Azure Storage account - [create a storage account](../common/storage-account-create.md).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Setting up

This section walks you through preparing a project to work with the Quarkus extensions for Azure Blob Storage.

### Download the sample application

The [sample application](https://github.com/Azure-Samples/quarkus-azure/tree/2025-01-20/storage-blob-quarkus) used in this quickstart is a basic Quarkus application.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment, and navigate to the `storage-blob-quarkus` directory.

```bash
git clone https://github.com/Azure-Samples/quarkus-azure.git
cd quarkus-azure
git checkout 2025-01-20
cd storage-blob-quarkus
```

## Authenticate to Azure and authorize access to blob data

Application requests to Azure Blob Storage must be authorized. Using `DefaultAzureCredential` and the Azure Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code, including Blob Storage. The Quarkus extension for Azure services supports this approach.

`DefaultAzureCredential` is a credential chain implementation provided by the Azure Identity client library for Java. `DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/java/api/overview/azure/identity-readme#defaultazurecredential).

In this quickstart, your app authenticates using your Azure CLI sign-in credentials when running locally. After it's deployed to Azure, your app can then use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). This transition between environments doesn't require any code changes.

### Assign roles to your Microsoft Entra user account

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### Sign-in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Microsoft Entra account you assigned the role to on your storage account. The following example shows how to authenticate via the Azure CLI:

   ```azurecli
   az login
   ```

2. Make sure you provide the endpoint of your Azure Blob Storage account. The following example shows how to set the endpoint using the environment variable `QUARKUS_AZURE_STORAGE_BLOB_ENDPOINT` via the Azure CLI. Replace `<resource-group-name>` and `<storage-account-name>` with your resource group and storage account names before running the command:

   ```azurecli 
   export QUARKUS_AZURE_STORAGE_BLOB_ENDPOINT=$(az storage account show \
       --resource-group <resource-group-name> \
       --name <storage-account-name> \
       --query 'primaryEndpoints.blob' \
       --output tsv)
   ```

> [!NOTE]
> When deployed to Azure, you need to enable managed identity on your app, and configure your storage account to allow that managed identity to connect. For more information on configuring this connection between Azure services, see [Authenticate Azure-hosted Java applications](/azure/developer/java/sdk/identity-azure-hosted-auth).

## Run the sample

The code example performs the following actions:

- Injects a client object that is already authorized for data access via `DefaultAzureCredential` using the Quarkus extension for Azure Blob Storage.
- Creates a container in a storage account.
- Uploads a blob to the container.
- Lists the blobs in the container.
- Downloads the blob data to the local file system.
- Deletes the blob and container resources created by the app.
- Deletes the local source and downloaded files.

Run the application in JVM mode by using the following command:

```bash
mvn package
java -jar ./target/quarkus-app/quarkus-run.jar
```

The output of the app is similar to the following example (UUID values omitted for readability):

```output
Uploading to Blob storage as blob:
        https://mystorageacct.blob.core.windows.net/quickstartblobsUUID/quickstartUUID.txt

Listing blobs...
        quickstartUUID.txt

Downloading blob to
        ./data/quickstartUUIDDOWNLOAD.txt

Press the Enter key to begin clean up

Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the cleanup process, check your data folder for the two files. You can compare them and observe that they're identical.

Optionally, you can run the sample in native mode. To do this, you need to have GraalVM installed, or use a builder image to build the native executable. For more information, see [Building a Native Executable](https://quarkus.io/guides/building-native-image). This quickstart uses Docker as container runtime to build a Linux native executable. If you haven't installed Docker, you can download it from the [Docker website](https://www.docker.com/products/docker-desktop).

Run the following command to build and execute the native executable in a Linux environment:

```bash
mvn package -Dnative -Dquarkus.native.container-build
./target/storage-blob-1.0.0-SNAPSHOT-runner
```

## Understand the sample code

Next, you walk through the sample code to understand how it works.

### Inject a client object with authorized access

Working with any Azure resource using the SDK begins with creating a client object. The Quarkus extension for Azure Blob Storage automatically injects a client object with authorized access using `DefaultAzureCredential`.

To successfully inject a client object, first you need to add the extensions `quarkus-arc` and `quarkus-azure-storage-blob` to your **pom.xml** file as dependencies:

```xml
<properties>
    <quarkus.platform.version>3.17.7</quarkus.platform.version>
    <quarkus.azure.services.version>1.1.1</quarkus.azure.services.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.quarkus.platform</groupId>
            <artifactId>quarkus-bom</artifactId>
            <version>${quarkus.platform.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>io.quarkiverse.azureservices</groupId>
            <artifactId>quarkus-azure-services-bom</artifactId>
            <version>${quarkus.azure.services.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-arc</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkiverse.azureservices</groupId>
        <artifactId>quarkus-azure-storage-blob</artifactId>
    </dependency>
</dependencies>
```

The `quarkus-arc` extension is required to use the `@Inject` annotation to inject the client object into your application code. The `quarkus-bom` and `quarkus-azure-services-bom` dependencies are used to manage the versions of the Quarkus platform and the Quarkus extension for Azure services.

Next, you can inject the client object into your application code using the `@Inject` annotation:

```java
@Inject
BlobServiceClient blobServiceClient;
```

That's all you need to code to get a client object using the Quarkus extension for Azure Blob Storage. To make sure the client object is authorized to access your storage account at runtime, you need to follow steps in the previous section [Authenticate to Azure and authorize access to blob data](#authenticate-to-azure-and-authorize-access-to-blob-data) before running the application.

### Manage blobs and containers

The following code example shows how to create a container, upload a blob, list blobs in a container, and download a blob.

> [!NOTE]
> Writing to the local filesystem is considered a bad practice in cloud native applications. However, the example uses the local filesystem to illustrate the use of blob storage in a way that is easy to for the user to verify. When you take an application to production, review your storage options and choose the best option for your needs. For more information, see [Review your storage options](/azure/architecture/guide/technology-choices/storage-options).

```java
// Create a unique name for the container
String containerName = "quickstartblobs" + java.util.UUID.randomUUID();

// Create the container and return a container client object
BlobContainerClient blobContainerClient = blobServiceClient.createBlobContainer(containerName);

// Create the ./data/ directory and a file for uploading and downloading
String localPath = "./data/";
new File(localPath).mkdirs();
String fileName = "quickstart" + java.util.UUID.randomUUID() + ".txt";

// Get a reference to a blob
BlobClient blobClient = blobContainerClient.getBlobClient(fileName);

// Write text to the file
FileWriter writer = null;
try
{
    writer = new FileWriter(localPath + fileName, true);
    writer.write("Hello, World!");
    writer.close();
}
catch (IOException ex)
{
    System.out.println(ex.getMessage());
}

System.out.println("\nUploading to Blob storage as blob:\n\t" + blobClient.getBlobUrl());

// Upload the blob
blobClient.uploadFromFile(localPath + fileName);

System.out.println("\nListing blobs...");

// List the blob(s) in the container.
for (BlobItem blobItem : blobContainerClient.listBlobs()) {
    System.out.println("\t" + blobItem.getName());
}

// Download the blob to a local file

// Append the string "DOWNLOAD" before the .txt extension for comparison purposes
String downloadFileName = fileName.replace(".txt", "DOWNLOAD.txt");

System.out.println("\nDownloading blob to\n\t " + localPath + downloadFileName);

blobClient.downloadToFile(localPath + downloadFileName);

File downloadedFile = new File(localPath + downloadFileName);
File localFile = new File(localPath + fileName);

// Clean up resources
System.out.println("\nPress the Enter key to begin clean up");
System.console().readLine();

System.out.println("Deleting blob container...");
blobContainerClient.delete();

System.out.println("Deleting the local source and downloaded files...");
localFile.delete();
downloadedFile.delete();

System.out.println("Done");
```

These operations are similar to the ones described in [Quickstart: Azure Blob Storage client library for Java SE](storage-quickstart-blobs-java.md). For more detailed code explanations, see the following sections in that quickstart:

- [Create a container](storage-quickstart-blobs-java.md#create-a-container)
- [Upload blobs to a container](storage-quickstart-blobs-java.md#upload-blobs-to-a-container)
- [List the blobs in a container](storage-quickstart-blobs-java.md#list-the-blobs-in-a-container)
- [Download blobs](storage-quickstart-blobs-java.md#download-blobs)
- [Delete a container](storage-quickstart-blobs-java.md#delete-a-container)

## Clean up

You can choose to follow the links in the **Next steps** section to deploy the Quarkus application to Azure. Or you can clean up the storage account by deleting the resource group. For more information, see [Azure Resource Manager resource group and resource deletion](/azure/azure-resource-manager/management/delete-resource-group).

## Next steps

> [!div class="nextstepaction"]
> [Azure Storage samples and developer guides for Java](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json)
> [Deploy a Java application with Quarkus on an Azure Kubernetes Service cluster](/azure/aks/howto-deploy-java-quarkus-app)
> [Deploy a Java application with Quarkus on Azure Container Apps](/azure/developer/java/ee/deploy-java-quarkus-app)
