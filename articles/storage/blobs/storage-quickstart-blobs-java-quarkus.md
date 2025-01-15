---
title: "Quickstart: Quarkus extension for Azure Blob Storage"
description: In this quickstart, you learn how to use the Quarkus extension for Azure Blob Storage to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: KarlErickson
ms.author: jiangma
ms.custom: devx-track-java, mode-api, passwordless-java, devx-track-extended-java, devx-track-extended-azdevcli, devx-track-javaee-quarkus, devx-track-javaee-quarkus-storage-blob
ms.date: 01/15/2025
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: java
---

# Quickstart: Quarkus extension for Azure Blob Storage

Get started with the Quarkus extension for Azure Blob Storage to manage blobs and containers. In this article, you follow steps to try out example code for basic tasks.

[Reference documentation](https://docs.quarkiverse.io/quarkus-azure-services/dev/quarkus-azure-storage-blob.html) | [Library source code](https://github.com/quarkiverse/quarkus-azure-services/tree/main/services/azure-storage-blob) | [Package (Maven)](https://mvnrepository.com/artifact/io.quarkiverse.azureservices/quarkus-azure-storage-blob) | [Sample](https://github.com/quarkiverse/quarkus-azure-services/tree/main/integration-tests/azure-storage-blob)

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- Azure Storage account - [create a storage account](../common/storage-account-create.md).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or above
- [Apache Maven](https://maven.apache.org/download.cgi)

## Setting up

This section walks you through preparing a project to work with the Quarkus extensions for Azure Blob Storage.

### Download the sample application

The [sample application](https://github.com/Azure-Samples/quarkus-azure/tree/2025-01-16/storage-blob-quarkus) used in this quickstart is a basic Quarkus application.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment, and navigate to the `storage-blob-quarkus` directory.

```bash
git clone https://github.com/Azure-Samples/quarkus-azure.git
cd quarkus-azure
git checkout 2025-01-16
cd storage-blob-quarkus
```

## Authenticate to Azure and authorize access to blob data

Application requests to Azure Blob Storage must be authorized. Using `DefaultAzureCredential` and the Azure Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code, including Blob Storage. The Quarkus extension for Azure services supports this approach.

`DefaultAzureCredential` is a credential chain implementation provided by the Azure Identity client library for Java. `DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/java/api/overview/azure/identity-readme#defaultazurecredential).

In this quickstart, your app authenticates using your Azure CLI sign-in credentials when running locally. Once it's deployed to Azure, your app can then use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). This transition between environments doesn't require any code changes.

### Assign roles to your Microsoft Entra user account

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### Sign-in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Microsoft Entra account you assigned the role to on your storage account. The following example shows how to authenticate via the Azure CLI:

   ```azurecli
   az login
   ```

2. Make sure you provide the endpoint of your Azure Blob Storage account. The following example shows how to set the endpoint using the environment variable `QUARKUS_AZURE_STORAGE_BLOB_ENDPOINT` via the Azure CLI. Replace `<RESOURCE_GROUP_NAME>` and `<STORAGE_ACCOUNT_NAME>` with your resource group and storage account names before running the command:

   ```azurecli 
   export QUARKUS_AZURE_STORAGE_BLOB_ENDPOINT=$(az storage account show \
       --resource-group <RESOURCE_GROUP_NAME> \
       --name <STORAGE_ACCOUNT_NAME> \
       --query 'primaryEndpoints.blob' \
       --output tsv)
   ```

> [!NOTE]
> When deployed to Azure, you'll need to enable managed identity on your app, and configure your storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/azure/developer/java/sdk/identity-azure-hosted-auth) tutorial.

## Run the sample

The code example performs the following actions:

- Injects a client object that is already authorized for data access via `DefaultAzureCredential` using the Quarkus extension for Azure Blob Storage
- Creates a container in a storage account
- Uploads a blob to the container
- Lists the blobs in the container
- Downloads the blob data to the local file system
- Deletes the blob and container resources created by the app

Run the application using the following command:

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

## Understand the sample code

Next, you walk through the sample code to understand how it works.

## Next step

> [!div class="nextstepaction"]
> [Azure Storage samples and developer guides for Java](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json)
