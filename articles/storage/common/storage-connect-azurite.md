---
title: Connect to Azurite emulator with Azure SDKs and tools
description: The Azurite open-source emulator provides a free local environment for developing and testing your Azure storage applications.
author: stevenmatthew
ms.author: shaas
ms.date: 06/24/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, ai-video-demo
ai-usage: ai-assisted
# Customer intent: "As a developer, I want to use the Azurite emulator for local Azure Storage development, so that I can test my Blob, Queue, and Table Storage applications in a free and controlled environment before deployment."
---

# Connect to Azurite with SDKs and tools

You can connect to Azurite from Azure Storage SDKs, or tools like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). Authentication is required, and Azurite supports authorization with OAuth, Shared Key, and shared access signatures (SAS). Azurite also supports anonymous access to public containers.

This article describes how to connect to the Azurite emulator using the Azure Storage SDKs and tools. For information on how to install and run Azurite, see [Install and run Azurite](../common/storage-install-azurite.md).To learn more about using Azurite with the Azure SDKs, see [Azure SDKs](../common/storage-connect-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#connect-using-azure-sdks).

## Connect your applications or tools to Azurite

To connect your applications or tools to Azurite, you can use the following methods:

### Use a well-known storage account and key

Azurite accepts the same well-known account and key used by the legacy Azure Storage Emulator.

- Account name: `devstoreaccount1`
- Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

### Use custom storage accounts and keys

Azurite supports custom storage account names and keys by setting the `AZURITE_ACCOUNTS` environment variable in the following format: `account1:key1[:key2];account2:key1[:key2];...`. 

For example, use a custom storage account that has one key:

```cmd
set AZURITE_ACCOUNTS="account1:key1"
```

```bash
export AZURITE_ACCOUNTS="account1:key1"
```

> [!NOTE]
> The account keys must be a base64 encoded string.

Or use multiple storage accounts with two keys each:

```cmd
set AZURITE_ACCOUNTS="account1:key1:key2;account2:key1:key2"
```

```bash
export AZURITE_ACCOUNTS="account1:key1:key2;account2:key1:key2"
```

Azurite refreshes custom account names and keys from the environment variable every minute by default. With this feature, you can dynamically rotate the account key, or add new storage accounts without restarting Azurite.

> [!NOTE]
> The default `devstoreaccount1` storage account is disabled when you set custom storage accounts. If you want to continue using `devstoreaccount1` after enabling custom storage accounts, you need to add it to the list of custom accounts and keys in the `AZURITE_ACCOUNTS` environment variable. 

The account keys must be a base64 encoded string.

### Use connection strings

The easiest way to connect to Azurite from your application is to configure a connection string in your application's configuration file that references the shortcut *UseDevelopmentStorage=true*. Here's an example of a connection string in an *app.config* file:

```xml
<appSettings>
  <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
</appSettings>
```

##### HTTP connection strings

You can pass the following connection strings to the [Azure SDKs](https://aka.ms/azsdk) or tools, like Azure CLI 2.0 or Storage Explorer.

The full connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`

To connect to a specific service, you can use the following connection strings:

##### [Blob Storage](#tab/blob-storage)

To connect to Blob Storage only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`

##### [Queue Storage](#tab/queue-storage)

To connect to Queue Storage only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;`

##### [Table Storage](#tab/table-storage)

To connect to Table Storage only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`

---

##### HTTPS connection strings

The full HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;`

To connect to a specific service, you can use the following connection strings:

##### [Blob Storage](#tab/blob-storage)

To use the blob service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;`

##### [Queue Storage](#tab/queue-storage)

To use the queue service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;`

##### [Table Storage](#tab/table-storage)

To use the table service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;`

---

If you used `dotnet dev-certs` to generate your self-signed certificate, use the following connection string.

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://localhost:10000/devstoreaccount1;QueueEndpoint=https://localhost:10001/devstoreaccount1;TableEndpoint=https://localhost:10002/devstoreaccount1;`

Update the connection string when using [custom storage accounts and keys](#use-custom-storage-accounts-and-keys).

For more information, see [Configure Azure Storage connection strings](#use-connection-strings).

## Connect using Azure SDKs

To connect to Azurite with the [Azure SDKs](https://aka.ms/azsdk), follow these steps:

- Enable OAuth authentication for Azurite via the `--oauth` switch. To learn more, see [OAuth configuration](storage-install-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#oauth-configuration).
- Enable HTTPS by using a self-signed certificate via the `--cert` and `--key`/`--pwd` options. To learn more about generating certificates, see [Certificate configuration (HTTPS)](storage-install-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#certificate-configuration-https) and [HTTPS setup](storage-install-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#https-setup).

After the certificates are in place, start Azurite with the following command line options:

```console
azurite --oauth basic --cert cert-name.pem --key cert-name-key.pem
```

Replace `cert-name.pem` and `certname-key.pem` with the names of your certificate and key files. If you're using a PFX certificate, use the `--pwd` option instead of the `--key` option.

### [Blob Storage](#tab/blob-storage)

To interact with Blob Storage resources, you can instantiate a `BlobContainerClient`, `BlobServiceClient`, or `BlobClient`. 

The following examples show how to authorize a `BlobContainerClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With container URL and DefaultAzureCredential
var client = new BlobContainerClient(
    new Uri("https://127.0.0.1:10000/devstoreaccount1/container-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new BlobContainerClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;", "container-name"
  );

// With account name and key
var client = new BlobContainerClient(
    new Uri("https://127.0.0.1:10000/devstoreaccount1/container-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

### [Queue Storage](#tab/queue-storage)

To interact with Queue Storage resources, you can instantiate a `QueueClient` or `QueueServiceClient`. 

The following examples show how to create and authorize a `QueueClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With queue URL and DefaultAzureCredential
var client = new QueueClient(
    new Uri("https://127.0.0.1:10001/devstoreaccount1/queue-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new QueueClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;", "queue-name"
  );

// With account name and key
var client = new QueueClient(
    new Uri("https://127.0.0.1:10001/devstoreaccount1/queue-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

### [Table Storage](#tab/table-storage)

To interact with Table Storage resources, you can instantiate a `TableClient` or `TableServiceClient`. 

The following examples show how to create and authorize a `TableClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With table URL and DefaultAzureCredential
var client = new Client(
    new Uri("https://127.0.0.1:10002/devstoreaccount1/table-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new TableClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;", "table-name"
  );

// With account name and key
var client = new TableClient(
    new Uri("https://127.0.0.1:10002/devstoreaccount1/table-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

---

## Connect the Azure Storage Explorer

You can use Storage Explorer to view the data stored in Azurite using either the HTTP or HTTPS protocols.

### Connect to Azurite using HTTP

In Storage Explorer, connect to Azurite by following these steps:

 1. Select the **Manage Accounts** icon
 1. Select **Add an account**
 1. Select **Attach to a local emulator**
 1. Select **Next**
 1. Edit the **Display name** field to a name of your choice
 1. Select **Next** again
 1. Select **Connect**

### Connect to Azurite using HTTPS

By default, Storage Explorer doesn't open an HTTPS endpoint that uses a self-signed certificate. If you're running Azurite with HTTPS, you're likely using a self-signed certificate. In Storage Explorer, import SSL certificates via the **Edit** -> **SSL Certificates** -> **Import Certificates** dialog.

#### Import Certificate to Storage Explorer

1. Find the certificate on your local machine.
1. In Storage Explorer, go to **Edit** -> **SSL Certificates** -> **Import Certificates** and import your certificate.

If you don't import a certificate, you get an error:

`unable to verify the first certificate` or `self signed certificate in chain`

#### Add Azurite via HTTPS connection string

Follow these steps to add Azurite HTTPS to Storage Explorer:

1. Select **Toggle Explorer**
1. Select **Local & Attached**
1. Right-click on **Storage Accounts** and select **Connect to Azure Storage**.
1. Select **Use a connection string**
1. Select **Next**.
1. Enter a value in the **Display name** field.
1. Enter the [HTTPS connection string](#https-connection-strings) from the previous section of this document
1. Select **Next**
1. Select **Connect**



## Next steps

- [Configure Azure Storage connection strings](storage-configure-connection-string.md) explains how to assemble a valid Azure Storage connection string.
- [Use Azurite to run automated tests](../blobs/use-azurite-to-run-automated-tests.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) describes how to write automated tests using the Azurite storage emulator.
- [Use the Azure Storage Emulator for development and testing](storage-use-emulator.md) documents the legacy Azure Storage Emulator, which is superseded by Azurite.
