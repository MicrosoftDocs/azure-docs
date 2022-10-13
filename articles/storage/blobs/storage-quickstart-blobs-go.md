---
title: Azure Quickstart - Create a blob in object storage using Go | Microsoft Docs
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library for Go to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 12/10/2021
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.devlang: golang
ms.custom: mode-api
---

# Quickstart: Upload, download, and list blobs using Go

In this quickstart, you learn how to use the Go programming language to upload, download, and list block blobs in a container in Azure Blob storage.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Make sure you have the following more prerequisites installed:

- [Go 1.17 or above](https://go.dev/dl/)
- [Azure Storage Blob SDK for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/), using the following command:

    `go get -u github.com/Azure/azure-sdk-for-go/sdk/storage/azblob`

    > [!NOTE]
    > Make sure that you capitalize `Azure` in the URL to avoid case-related import problems when working with the SDK. Also capitalize `Azure` in your import statements.

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-go-quickstart.git) used in this quickstart is a basic Go application.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-go-quickstart 
```

This command clones the repository to your local git folder. To open the Go sample for Blob storage, look for `storage-quickstart.go` file.

## Sign in with Azure CLI

To support local development, the Azure Identity credential type `DefaultAzureCredential` authenticates users signed into the Azure CLI.

Run the following command to sign into the Azure CLI:

```azurecli
az login
```

Azure CLI authentication isn't recommended for applications running in Azure.

To learn more about different authentication methods, check out [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).


## Assign RBAC permissions to the storage account

Azure storage accounts require explicit permissions to perform read and write operations. In order to use the storage account, you must assign permissions to the account. To do that you'll need to assign an appropriate RBAC role to your account. To get the `objectID` of the currently signed in user, run `az ad signed-in-user show --query objectId`.

Run the following AzureCli command to assign the storage account permissions:

```azurecli
az role assignment create --assignee "<ObjectID>" --role "Storage Blob Data Contributor" --scope "<StorageAccountResourceID>"
```

Learn more about Azure's built-in RBAC roles, check out [Built-in roles](../../role-based-access-control/built-in-roles.md).

> Note: Azure Cli has built in helper fucntions that retrieve the storage access keys when permissions are not detected. That functionally does not transfer to the DefaultAzureCredential, which is the reason for assiging RBAC roles to your account.

## Run the sample

This sample creates an Azure storage container, uploads a blob, lists the blobs in the container, then downloads the blob data into a buffer.

Before you run the sample, open the `storage-quickstart.go` file. Replace `<StorageAccountName>` with the name of your Azure storage account.

Then run the application with the `go run` command:

```azurecli
go run storage-quickstart.go
```

The following output is an example of the output returned when running the application:

```output
Azure Blob storage quick start sample
Creating a container named quickstart-4052363832531531139
Creating a dummy file to test the upload and download
Listing the blobs in the container:
blob-8721479556813186518

hello world this is a blob

Press enter key to delete the blob fils, example container, and exit the application.

Cleaning up.
Deleting the blob blob-8721479556813186518
Deleting the blob quickstart-4052363832531531139
```

When you press the key to continue, the sample program deletes the storage container and the files.

> [!TIP]
> You can also use a tool such as the [Azure Storage Explorer](https://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.
>

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Create ContainerURL and BlobURL objects

First, create the references to the ContainerURL and BlobURL objects used to access and manage Blob storage. These objects offer low-level APIs such as Create, Upload, and Download to issue REST APIs.

- Authenticate to Azure using the [**DefaultAzureCredential**](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#NewDefaultAzureCredential).

- Use [**NewServiceClient**](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewServiceClient) struct to store your credentials.

- Instantiate a new [**ContainerURL**](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#ServiceClient.NewContainerClient), and a new [**BlockBlobClient**](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewBlockBlobClient) object to run operations on container (Create) and blobs (Upload and Download).

Once you have the ContainerURL, you can instantiate the **BlobURL** object that points to a blob, and perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you create a new container. The container is called **quickstartblobs-[random string]**.

```go
url := "https://storageblobsgo.blob.core.windows.net/"
ctx := context.Background()

// Create a default Azure credential
credential, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatal("Invalid credentials with error: " + err.Error())
}

serviceClient, err := azblob.NewServiceClient(url, credential, nil)
if err != nil {
    log.Fatal("Invalid credentials with error: " + err.Error())
}

// Create the container
containerName := fmt.Sprintf("quickstart-%s", randomString())
fmt.Printf("Creating a container named %s\n", containerName)

containerClient := serviceClient.NewContainerClient(containerName)
_, err = containerClient.Create(ctx, nil)

if err != nil {
    log.Fatal(err)
}
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.

The SDK offers [high-level APIs](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/messaging/azeventhubs/internal/blob/highlevel.go) that are built on top of the low-level REST APIs. As an example, ***UploadBufferToBlockBlob*** function uses StageBlock (PutBlock) operations to concurrently upload a file in chunks to optimize the throughput. If the file is less than 256 MB, it uses Upload (PutBlob) instead to complete the transfer in a single transaction.

The following example uploads the file to your container called **quickstartblob-[randomstring]**.

```go
data := []byte("\nhello world this is a blob\n")
blobName := "quickstartblob" + "-" + randomString()

var blockOptions azblob.HighLevelUploadToBlockBlobOption

blobClient, err := azblob.NewBlockBlobClient(url+containerName+"/"+blobName, credential, nil)
if err != nil {
    log.Fatal(err)
}

// Upload to data to blob storage
_, err = blobClient.UploadBufferToBlockBlob(ctx, data, blockOptions)

if err != nil {
    log.Fatalf("Failure to upload to blob: %+v", err)
}
```

### List the blobs in a container

Get a list of files in the container using the **ListBlobs** method on a **ContainerURL**. Blob names are returned in lexicographic order. After getting a segment, process it, and then call ListBlobs again.

```go
	// List the blobs in the container
pager := containerClient.ListBlobsFlat(nil)

for pager.NextPage(ctx) {
    resp := pager.PageResponse()

    for _, v := range resp.ContainerListBlobFlatSegmentResult.Segment.BlobItems {
        fmt.Println(*v.Name)
    }
}

if err = pager.Err(); err != nil {
    log.Fatalf("Failure to list blobs: %+v", err)
}

// Download the blob
get, err := blobClient.Download(ctx, nil)
if err != nil {
    log.Fatal(err)
}
```

### Download the blob

Download blobs using the **Download** low-level function on a BlobURL will return a **DownloadResponse** struct. Run the function **Body** on the struct to get a **RetryReader** stream for reading data. If a connection fails while reading, it will make other requests to re-establish a connection and continue reading. Specifying a RetryReaderOption's with MaxRetryRequests set to 0 (the default), returns the original response body and no retries will be performed. Alternatively, use the high-level APIs **DownloadBlobToBuffer** or **DownloadBlobToFile** to simplify your code.

The following code downloads the blob using the **Download** function. The contents of the blob is written into a buffer and shown on the console.

```go
// Download the blob
get, err := blobClient.Download(ctx, nil)
if err != nil {
    log.Fatal(err)
}

downloadedData := &bytes.Buffer{}
reader := get.Body(azblob.RetryReaderOptions{})
_, err = downloadedData.ReadFrom(reader)
if err != nil {
    log.Fatal(err)
}
err = reader.Close()
if err != nil {
    log.Fatal(err)
}

fmt.Println(downloadedData.String())
```

### Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **Delete** method.

```go
// Cleaning up the quick start by deleting the blob and container
fmt.Printf("Press enter key to delete the blob fils, example container, and exit the application.\n")
bufio.NewReader(os.Stdin).ReadBytes('\n')
fmt.Printf("Cleaning up.\n")

// Delete the blob
fmt.Printf("Deleting the blob " + blobName + "\n")

_, err = blobClient.Delete(ctx, nil)
if err != nil {
    log.Fatalf("Failure: %+v", err)
}

// Delete the container
fmt.Printf("Deleting the blob " + containerName + "\n")
_, err = containerClient.Delete(ctx, nil)

if err != nil {
    log.Fatalf("Failure: %+v", err)
}
```

## Resources for developing Go applications with blobs

See these other resources for Go development with Blob storage:

- View and install the [Go client library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob) for Azure Storage on GitHub.
- Explore [Blob storage samples](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#example-package) written using the Go client library.

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Go. For more information about the Azure Storage Blob SDK, view the [Source Code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob) and [API Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob).
