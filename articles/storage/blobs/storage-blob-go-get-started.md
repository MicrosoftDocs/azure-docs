---
title: Get started with Azure Blob Storage and Go
titleSuffix: Azure Storage
description: Get started developing a Go application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/22/2024
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Get started with Azure Blob Storage and Go

[!INCLUDE [storage-dev-guide-selector-getting-started](../../../includes/storage-dev-guides/storage-dev-guide-selector-getting-started.md)]

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client module for Go. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob) | [Package (pkg.go.dev)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Go 1.18+](https://go.dev/doc/install)

## Set up your project

This section walks you through preparing a project to work with the Azure Blob Storage client module for Go.

From your GOPATH, install the [azblob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/) module using the following command:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
```

To authenticate with Microsoft Entra ID (recommended), install the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) module using the following command:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

Then open your code file and add the necessary import paths. In this example, we add the following to our *.go* file:

```go
import (
    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)
```

Blob client module information:

- [azblob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section_documentation): Contains the methods that you can use to operate on the service, containers, and blobs.


## Authorize access and connect to Blob Storage

To connect an application to Blob Storage, create a client object using [azblob.NewClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewClient). This object is your starting point to interact with data resources at the storage account level. You can use it to operate on the storage account and its containers.

To learn more about creating and managing client objects, including best practices, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).

You can authorize a client object using a Microsoft Entra authorization token (recommended), an account access key, or a shared access signature (SAS).

<a name='azure-ad'></a>

## [Microsoft Entra ID](#tab/azure-ad)

To authorize with Microsoft Entra ID, you need to use a [security principal](../../active-directory/develop/app-objects-and-service-principals.md). The following articles provide guidance on different authentication scenarios:

- [Authentication in development environments](/azure/developer/go/azure-sdk-authentication)
- [Authentication in Azure-hosted apps](/azure/developer/go/azure-sdk-authentication-managed-identity)
- [Authentication with a service principal](/azure/developer/go/azure-sdk-authentication-service-principal)

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) instance. You can then use that credential to create the client object using [azblob.NewClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewClient).

:::code language="go" source="~/blob-devguide-go/cmd/client-auth/client_auth.go" id="snippet_get_service_client_DAC":::

## [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, append the token to the account URL string and create the client object using [azblob.NewClientWithNoCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewClientWithNoCredential).

:::code language="go" source="~/blob-devguide-go/cmd/client-auth/client_auth.go" id="snippet_get_service_client_SAS":::

> [!NOTE]
> A user delegation SAS offers superior security to a SAS that is signed with the storage account key. Microsoft recommends using a user delegation SAS when possible. For more information, see [Grant limited access to data with shared access signatures (SAS)](../common/storage-sas-overview.md).

## [Account key](#tab/account-key)

To use a storage account shared key, provide the key as a string and initialize a client object using [azblob.NewClientWithSharedKeyCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewClientWithSharedKeyCredential).

:::code language="go" source="~/blob-devguide-go/cmd/client-auth/client_auth.go" id="snippet_get_service_client_shared_key":::

You can also create a client object using a connection string.

:::code language="go" source="~/blob-devguide-go/cmd/client-auth/client_auth.go" id="Snippet_get_service_client_connection_string":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Build your application

As you build applications to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to work with data resources and perform specific actions using the Azure Blob Storage client module for Go:

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create-go.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete-go.md) | Delete containers, and if soft-delete is enabled, restore deleted containers. |
| [List containers](storage-blob-containers-list-go.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata (containers)](storage-blob-container-properties-metadata-go.md) | Manage container properties and metadata. |
| [Upload blobs](storage-blob-upload-go.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download-go.md) | Download blobs by using strings, streams, and file paths. |
| [List blobs](storage-blobs-list-go.md) | List blobs in different ways. |
| [Delete and restore blobs](storage-blob-delete-go.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs. |
| [Manage properties and metadata (blobs)](storage-blob-properties-metadata-go.md) | Manage container properties and metadata. |

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]
