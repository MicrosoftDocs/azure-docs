---
title: Create a blob container with Go
titleSuffix: Azure Storage
description: Learn how to create a blob container in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/22/2024
ms.author: pauljewell
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Create a blob container with Go

[!INCLUDE [storage-dev-guide-selector-create-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-create-container.md)]

This article shows how to create containers with the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container.

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to create a container. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Create Container (REST API)](/rest/api/storageservices/create-container#authorization).

[!INCLUDE [storage-dev-guide-about-container-naming](../../../includes/storage-dev-guides/storage-dev-guide-about-container-naming.md)]

## Create a container

To create a container, call the following method:

- [CreateContainer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.CreateContainer)

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another. An exception is thrown if a container with the same name already exists. 

The following example shows how to create a container:

:::code language="go" source="~/blob-devguide-go/cmd/create-container/create_container.go" id="snippet_create_container":::

## Create the root container

A root container serves as a default container for your storage account. Each storage account can have one root container, which must be named *$root*. The root container must be explicitly created or deleted.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob in the root container as follows:

`https://<storage-account-name>.blob.core.windows.net/default.html`

The following example creates the container if it doesn't already exist in the storage account:

:::code language="go" source="~/blob-devguide-go/cmd/create-container/create_container.go" id="snippet_create_root_container":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about creating a container using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/create-container/create_container.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for creating a container use the following REST API operation:

- [Create Container](/rest/api/storageservices/create-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]