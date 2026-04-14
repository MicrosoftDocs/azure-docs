---
title: Use the Azurite emulator for local Azure Storage development
description: The Azurite open-source emulator provides a free local environment for testing your Azure storage applications.
author: stevenmatthew
ms.author: shaas
ms.date: 08/25/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.devlang: csharp
ai-usage: ai-assisted
ms.custom:
  - devx-track-csharp
  - ai-video-demo
  - sfi-image-nochange
  - sfi-ropc-nochange
#customer intent: As a developer, I want a lightweight local emulator for Azure Storage so that I can develop and test storage scenarios without provisioning cloud resources.
---

# Use the Azurite emulator for local Azure Storage development

The Azurite open-source emulator provides a free local environment for testing your cloud-based applications. When you're satisfied with how your application is working locally, switch to using an Azure Storage account in the cloud.

Azurite is a lightweight storage emulator written in JavaScript and runs on Node.js that simulates the Azure Storage service for local development. It supports the Blob, Queue, and Table storage services and provides cross-platform support on Windows, Linux, and macOS. For help with installing and running Azurite, see [Install and run Azurite emulator](storage-install-azurite.md).

 Azurite also allows developers to run tests against a local storage environment, simulating Azure's behavior, which is crucial for integration and end-to-end testing. To read more about how to use Azurite for automated testing, see [Use Azurite to run automated tests](../blobs/use-azurite-to-run-automated-tests.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json).
 
Azurite supersedes the [Azure Storage Emulator](storage-use-emulator.md), and continues to be updated to support the latest versions of Azure Storage APIs.

## Differences between Azurite and Azure Storage

There are functional differences between a local instance of Azurite and an Azure Storage account in the cloud.

> [!IMPORTANT]
> Azurite supports only the Blob, Queue, and Table storage services. It doesn't support Azure Files or Azure Data Lake Storage Gen2, but provides cross-platform support on Windows, Linux, and macOS.

### Endpoint and connection URL

The service endpoints for Azurite are different from the endpoints of an Azure Storage account. The local computer doesn't do domain name resolution, requiring Azurite endpoints to be local addresses.

When you address a resource in an Azure Storage account, the account name is part of the URI host name. The resource being addressed is part of the URI path:

`<http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>`

The following URI is a valid address for a blob in an Azure Storage account:

`https://myaccount.blob.core.windows.net/mycontainer/myblob.txt`


#### IP-style URL

Since the local computer doesn't resolve domain names, the account name is part of the URI path instead of the host name. Use the following URI format for a resource in Azurite:

`http://<local-machine-address>:<port>/<account-name>/<resource-path>`

The following address might be used for accessing a blob in Azurite:

`http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt`

#### Production-style URL

Optionally, you could modify your hosts file to access an account with _production-style_ URL.

First, add one or more lines to your hosts file. For example:

```
127.0.0.1 account1.blob.localhost
127.0.0.1 account1.queue.localhost
127.0.0.1 account1.table.localhost
```

Next, set environment variables to enable customized storage accounts and keys:

```
set AZURITE_ACCOUNTS="account1:key1:key2"
```

You could add more accounts. See the [Custom storage accounts and keys](storage-connect-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#use-custom-storage-accounts-and-keys) section of the *Connect to Azurite* article.

Start Azurite and use a customized connection string to access your account. In the following example, the connection string assumes that the default ports are used. 

```
DefaultEndpointsProtocol=http;AccountName=account1;AccountKey=key1;BlobEndpoint=http://account1.blob.localhost:10000;QueueEndpoint=http://account1.queue.localhost:10001;TableEndpoint=http://account1.table.localhost:10002;
```

Don't access default account in this way with Azure Storage Explorer. There's a bug that Storage Explorer is always adding account name in URL path, causing failures.

By default, when using Azurite with a production-style URL, the account name should be the host name in fully qualified domain name such as `http://devstoreaccount1.blob.localhost:10000/container`. To use production-style URL with account name in the URL path such as `http://foo.bar.com:10000/devstoreaccount1/container`, make sure to use the `--disableProductStyleUrl` parameter when you start Azurite.

If you use `host.docker.internal` as request Uri host (For example: `http://host.docker.internal:10000/devstoreaccount1/container`), Azurite gets the account name from the request Uri path. This behavior is true regardless of whether you use the `--disableProductStyleUrl` parameter when you start Azurite. 

### Scaling and performance

Azurite doesn't support large numbers of connected clients. There's no performance guarantee. Azurite is intended for development and testing purposes.

### Error handling

Azurite is aligned with Azure Storage error handling logic, but there are differences. For example, error messages might be different, while error status codes align.

### RA-GRS

Azurite supports read-access geo-redundant replication (RA-GRS). For storage resources, access the secondary location by appending `-secondary` to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in Azurite:

`http://127.0.0.1:10000/devstoreaccount1-secondary/mycontainer/myblob.txt`

### Table support

Support for tables in Azurite is currently in preview. For more information, see the [Azurite V3 Table](https://github.com/Azure/Azurite/wiki/Azurite-V3-Table) project.

Support for durable functions requires tables.

> [!IMPORTANT]
>
> Azurite support for Table Storage is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azurite is open-source

Contributions and suggestions for Azurite are welcome. Go to the Azurite [GitHub project](https://github.com/Azure/Azurite/projects) page or [GitHub issues](https://github.com/Azure/Azurite/issues) for milestones and work items we're tracking for upcoming features and bug fixes. Detailed work items are also tracked in GitHub.

## Workspace structure

The following files and folders might be created in the workspace location when initializing Azurite.

- `__blobstorage__` - Directory containing Azurite blob service persisted binary data
- `__queuestorage__` - Directory containing Azurite queue service persisted binary data
- `__tablestorage__` - Directory containing Azurite table service persisted binary data
- `__azurite_db_blob__.json` - Azurite blob service metadata file
- `__azurite_db_blob_extent__.json` - Azurite blob service extent metadata file
- `__azurite_db_queue__.json` - Azurite queue service metadata file
- `__azurite_db_queue_extent__.json` - Azurite queue service extent metadata file
- `__azurite_db_table__.json` - Azurite table service metadata file
- `__azurite_db_table_extent__.json` - Azurite table service extent metadata file

To clean up Azurite, delete the files and folders and restart the emulator.

## Next steps

- [Install and run Azurite emulator](storage-install-azurite.md) describes how to install and run Azurite on your local machine.
- [Connect to Azurite with SDKs and tools](storage-connect-azurite.md) explains how to connect to Azurite using various Azure Storage SDKs and tools.
- [Use the Azure Storage Emulator for development and testing](storage-use-emulator.md) documents the legacy Azure Storage Emulator, superseded by Azurite.
