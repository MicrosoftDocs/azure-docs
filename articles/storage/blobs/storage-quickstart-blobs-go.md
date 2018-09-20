---
title: Azure Quickstart - Create a blob in object storage using Go | Microsoft Docs
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library for Go to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage  
author: seguler
 

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 04/09/2018
ms.author: seguler
---

# Quickstart: Upload, download, and list blobs using Go

In this quickstart, you learn how to use the Go programming language to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

To complete this quickstart: 
* Install [Go 1.8 or above](https://golang.org/dl/)
* Download and install [Azure Storage Blob SDK for Go](https://github.com/azure/azure-storage-blob-go/) using `go get -u github.com/Azure/azure-storage-blob-go/2016-05-31/azblob`. 

> [!WARNING]
> Make sure that you capitalize Azure in the URL. Doing otherwise can cause case-related import problems when working with the SDK. You also need to capitalize Azure in your import statements.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

## Download the sample application
The [sample application](https://github.com/Azure-Samples/storage-blobs-go-quickstart.git) used in this quickstart is a basic Go application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-go-quickstart 
```

This command clones the repository to your local git folder. To open the Go sample for Blob storage, look for storage-quickstart.go file.  

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string
This solution requires your storage account name and key to be securely stored in environment variables local to the machine running the sample. Follow one of the examples below depending on your operating System to create the environment variables.

# [Linux](#tab/Linux)

```
export AZURE_STORAGE_ACCOUNT="<youraccountname>"
export AZURE_STORAGE_ACCESS_KEY="<youraccountkey>"
```

# [Windows](#tab/Windows)

```
setx AZURE_STORAGE_ACCOUNT "<youraccountname>"
setx AZURE_STORAGE_ACCESS_KEY "<youraccountkey>"
```

---

## Run the sample
This sample creates a test file in the current folder, uploads the test file to Blob storage, lists the blobs in the container, and downloads the file into a buffer. 

To run the sample, issue the following command: 

```go run storage-quickstart.go```

The following output is an example of the output returned when running the application:
  
```
Azure Blob storage quick start sample
Creating a container named quickstart-5568059279520899415
Creating a dummy file to test the upload and download
Uploading the file with blob name: 630910657703031215
Blob name: 630910657703031215
Downloaded the blob: hello world
this is a blob
Press the enter key to delete the sample files, example container, and exit the application.
```
When you press the key to continue, the sample program deletes the storage container and the files. 

> [!TIP]
> You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 
>

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Create ContainerURL and BlobURL objects
The first thing to do is to create the references to the ContainerURL and BlobURL objects used to access and manage Blob storage. These objects offer low-level APIs such as Create, PutBlob, and GetBlob to issue REST APIs.

* Use **SharedKeyCredential** struct to store your credentials. 

* Create a **Pipeline** using the credentials and options. The pipeline specifies things like retry policies, logging, deserialization of HTTP response payloads, and more.  

* Instantiate a new ContainerURL, and a new BlobURL object to run operations on container (Create) and blobs (PutBlob and GetBlob).


Once you have the ContainerURL, you can instantiate the **BlobURL** object that points to a blob, and perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you create a new container. The container is called **quickstartblobs-[random string]**. 

```go 
// From the Azure portal, get your storage account name and key and set environment variables.
accountName, accountKey := os.Getenv("AZURE_STORAGE_ACCOUNT"), os.Getenv("AZURE_STORAGE_ACCESS_KEY")
if len(accountName) == 0 || len(accountKey) == 0 {
	log.Fatal("Either the AZURE_STORAGE_ACCOUNT or AZURE_STORAGE_ACCESS_KEY environment variable is not set")
}

// Create a default request pipeline using your storage account name and account key.
credential := azblob.NewSharedKeyCredential(accountName, accountKey)
p := azblob.NewPipeline(credential, azblob.PipelineOptions{})

// Create a random string for the quick start container
containerName := fmt.Sprintf("quickstart-%s", randomString())

// From the Azure portal, get your storage account blob service URL endpoint.
URL, _ := url.Parse(
	fmt.Sprintf("https://%s.blob.core.windows.net/%s", accountName, containerName))

// Create a ContainerURL object that wraps the container URL and a request
// pipeline to make requests.
containerURL := azblob.NewContainerURL(*URL, p)

// Create the container
fmt.Printf("Creating a container named %s\n", containerName)
ctx := context.Background() // This example uses a never-expiring context
_, err := containerURL.Create(ctx, azblob.Metadata{}, azblob.PublicAccessNone)
handleErrors(err)
```
### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.  

To upload a file to a blob, open the file using **os.Open**. You can then upload the file to the specified path using one of the REST APIs: PutBlob, PutBlock/PutBlockList. 

Alternatively, the SDK offers [high-level APIs](https://github.com/Azure/azure-storage-blob-go/blob/master/2016-05-31/azblob/highlevel.go) that are built on top of the low-level REST APIs. As an example, ***UploadFileToBlockBlob*** function uses PutBlock operations to concurrently upload a file in chunks to optimize the throughput. If the file is less than 256 MB, it uses PutBlob instead to complete the transfer in a single transaction.

The following example uploads the file to your container called **quickstartblobs-[randomstring]**.

```go
// Here's how to upload a blob.
blobURL := containerURL.NewBlockBlobURL(fileName)
file, err := os.Open(fileName)
handleErrors(err)

// You can use the low-level PutBlob API to upload files. Low-level APIs are simple wrappers for the Azure Storage REST APIs.
// Note that PutBlob can upload up to 256MB data in one shot. Details: https://docs.microsoft.com/rest/api/storageservices/put-blob
// Following is commented out intentionally because we will instead use UploadFileToBlockBlob API to upload the blob
// _, err = blobURL.PutBlob(ctx, file, azblob.BlobHTTPHeaders{}, azblob.Metadata{}, azblob.BlobAccessConditions{})
// handleErrors(err)

// The high-level API UploadFileToBlockBlob function uploads blocks in parallel for optimal performance, and can handle large files as well.
// This function calls PutBlock/PutBlockList for files larger 256 MBs, and calls PutBlob for any file smaller
fmt.Printf("Uploading the file with blob name: %s\n", fileName)
_, err = azblob.UploadFileToBlockBlob(ctx, file, blobURL, azblob.UploadToBlockBlobOptions{
	BlockSize:   4 * 1024 * 1024,
	Parallelism: 16})
handleErrors(err)
```

### List the blobs in a container

Get a list of files in the container using the **ListBlobs** method on a **ContainerURL**. ListBlobs returns a single segment of blobs (up to 5000) starting from the specified **Marker**. Use an empty Marker to start enumeration from the beginning. Blob names are returned in lexicographic order. After getting a segment, process it, and then call ListBlobs again passing the previously returned Marker.  

```go
// List the blobs in the container
for marker := (azblob.Marker{}); marker.NotDone(); {
	// Get a result segment starting with the blob indicated by the current Marker.
	listBlob, err := containerURL.ListBlobs(ctx, marker, azblob.ListBlobsOptions{})
	handleErrors(err)

	// ListBlobs returns the start of the next segment; you MUST use this to get
	// the next segment (after processing the current result segment).
	marker = listBlob.NextMarker

	// Process the blobs returned in this result segment (if the segment is empty, the loop body won't execute)
	for _, blobInfo := range listBlob.Blobs.Blob {
		fmt.Print("Blob name: " + blobInfo.Name + "\n")
	}
}
```

### Download the blob

Download blobs using the **GetBlob** low-level method on a BlobURL. Alternatively you can create a Stream and read ranges from it using **NewDownloadStream** high-level API provided in [highlevel.go](https://github.com/Azure/azure-storage-blob-go/blob/master/2016-05-31/azblob/highlevel.go). NewDownloadStream function retries in the event of a connection failure, whereas Get Blob API only retries on HTTP status codes such as 503 (Server Busy). 
The following code downloads the blob using the **NewDownloadStream** function. The contents of the blob is written into a buffer and shown on the console.

```go
// Here's how to download the blob. NOTE: This method automatically retries if the connection fails
// during download (the low-level GetBlob function does NOT retry errors when reading from its stream).
stream := azblob.NewDownloadStream(ctx, blobURL.GetBlob, azblob.DownloadStreamOptions{})
downloadedData := &bytes.Buffer{}
_, err = downloadedData.ReadFrom(stream)
handleErrors(err)
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **Delete** method. 

```go
// Cleaning up the quick start by deleting the container and the file created locally
fmt.Printf("Press the enter key to delete the sample files, example container, and exit the application.\n")
bufio.NewReader(os.Stdin).ReadBytes('\n')
fmt.Printf("Cleaning up.\n")
containerURL.Delete(ctx, azblob.ContainerAccessConditions{})
file.Close()
os.Remove(fileName)
```

## Resources for developing Go applications with blobs

See these additional resources for Go development with Blob storage:

- View and install the [Go client library source code](https://github.com/Azure/azure-storage-blob-go) for Azure Storage on GitHub.
- Explore [Blob storage samples](https://godoc.org/github.com/Azure/azure-storage-blob-go/2016-05-31/azblob#pkg-examples) written using the Go client library.

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Go. For more information about the Azure Storage Blob SDK, view the [Source Code](https://github.com/Azure/azure-storage-blob-go/) and [API Reference](https://godoc.org/github.com/Azure/azure-storage-blob-go/2016-05-31/azblob).
