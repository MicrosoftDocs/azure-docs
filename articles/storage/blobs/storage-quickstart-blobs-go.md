---
title:  Azure Quickstart - Transfer objects to/from Azure Blob storage using Go | Microsoft Docs 
description: Quickly learn to transfer objects to/from Azure Blob storage using Go lang
services: storage  
author: seguler
manager: jahogg 

ms.service: storage
ms.tgt_pltfrm: na
ms.devlang: go
ms.topic: quickstart
ms.date: 01/29/2018
ms.author: seguler
---

#  Transfer objects to/from Azure Blob storage using Python
In this quickstart, you learn how to use Go language to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

To complete this quickstart: 
* Install [Go 1.8 or above](https://golang.org/)
* Download and install [Azure Storage Blob SDK for Go](https://github.com/azure/azure-storage-blob-go/) using `go get -u github.com/azure/azure-storage-blob-go/2016-05-31/azblob`. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application
The [sample application](https://github.com/Azure-Samples/storage-blobs-go-quickstart.git) used in this quickstart is a basic Go application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-go-quickstart 
```

This command clones the repository to your local git folder. To open the Go program, look for storage-quickstart.go file.  

## Configure your storage connection string
This solution requires Storage account name and key to be stored in an environment variable securely on the machine running the sample. Follow one of the examples below depending on your Operating System to create the environment variable.

# [Linux](#tab/Linux)

```
export AZURE_STORAGE_ACCOUNT="<youraccountname>"
export AZURE_STORAGE_ACCESS_KEY="<youraccountkey>"
```

# [Windows](#tab/Windows)

```
setx AZURE_STORAGE_ACCOUNT "<yourconnectionstring>"
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
Creating a container named quickstart-4138666957683782978
Creating a dummy file to test the upload and download
Uploading the file with blob name: 3410038522975410115
Blob name: 3410038522975410115
Read 27 of 27 bytes.
Downloaded the blob: hello world
this is a blob
```
When you press any key to continue, the sample program deletes the storage container and the files. 

> [!TIP]
> You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 
>

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Create ContainerURL and BlobURL objects
The first thing to do is to create the references to the ContainerURL and BlobURL objects used to access and manage Blob storage. These objects offer low-level APIs such as Create, PutBlob, and GetBlob to issue REST APIs.

* Create a **SharedKeyCredential** struct with your credentials. 

* Create a **Pipeline** using the credentials and options. The pipeline specifies things like retry policies, logging, deserializaiton of HTTP response payloads, and more.  

* Instantiate a new ContainerURL, and a new BlobURL object to run operations on container (Create) and blobs (PutBlob and GetBlob).


Once you have the ContainerURL, you can instantiate the **BlobURL** object that points to the specific blob in which you are interested, and perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you create a new container. The container is called **quickstartblobs-<random number>**. 

```go 
accountName, accountKey := os.Getenv("AZURE_STORAGE_ACCOUNT"), os.Getenv("AZURE_STORAGE_ACCESS_KEY")
if len(accountName) == 0 || len(accountKey) == 0 {
	log.Fatal("AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY environment variables are not set")
}

// Create a request pipeline using your Storage account's name and account key.
credential := azblob.NewSharedKeyCredential(accountName, accountKey)
p := azblob.NewPipeline(credential, azblob.PipelineOptions{})

// Create a random string for the quick start container
containerName := fmt.Sprintf("%s%s", "quickstart-", randomString())

// From the Azure portal, get your Storage account blob service URL endpoint.
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

The following example uploads the file to your container called **quickstartblobs-<random number>**.

```go
// Here's how to upload a blob.
blobURL := containerURL.NewBlockBlobURL(fileName)
file, err := os.Open(fileName)
handleErrors(err)

// Use the PutBlob API to upload the file
// Note that PutBlob can upload up to 256MB data in one shot. Details: https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
fmt.Printf("Uploading the file with blob name: %s\n", fileName)
_, err = blobURL.PutBlob(ctx, file, azblob.BlobHTTPHeaders{}, azblob.Metadata{}, azblob.BlobAccessConditions{})
handleErrors(err)

// Alternatively you can use the high level API UploadFileToBlockBlob function to upload blocks in parallel.
// This function calls PutBlock/PutBlockLlist for files larger 256 MBs, and calls PutBlob for any file smaller
// Note this will overwrite the file uploaded by PutBlob in the previous line
_, err = azblob.UploadFileToBlockBlob(ctx, file, blobURL, azblob.UploadToBlockBlobOptions{
	BlockSize:   4 * 1024 * 1024,
	Parallelism: 16})
handleErrors(err)
```

### List the blobs in a container

Get a list of files in the container using the **ListBlobs** method on a **ContainerURL**. ListBlobs returns a single segment of blobs (up to 5000) starting from the specified **Marker**. Use an empty Marker to start enumeration from the beginning. Blob names are returned in lexicographic order. After getting a segment, process it, and then call ListBlobs again passing the previously-returned Marker.  

```go
// List the blobs in the container
marker := azblob.Marker{}
for marker.NotDone() {
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

### Download the blobs with progress report

Download blobs using the **GetBlob** low-level method on a BlobURL. Alternatively you can create a Stream and read ranges from it using **NewDownloadStream** high-level API provided in [highlevel.go](https://github.com/Azure/azure-storage-blob-go/blob/master/2016-05-31/azblob/highlevel.go).
The following code downloads the blob uploaded in a previous section and shows progress of downloaded bytes. The contents of the blob is written into a buffer and shown on the console.

```go
// Here's how to download the blob
get, err := blobURL.GetBlob(ctx, azblob.BlobRange{}, azblob.BlobAccessConditions{}, false)
handleErrors(err)

// Wrap the response body in a ResponseBodyProgress and pass a callback function
// for progress reporting.
responseBody := pipeline.NewResponseBodyProgress(get.Body(),
	func(bytesTransferred int64) {
		fmt.Printf("Read %d of %d bytes.\n", bytesTransferred, get.ContentLength())
	})
downloadedData := &bytes.Buffer{}
downloadedData.ReadFrom(responseBody)
// The downloaded blob data is in downloadData's buffer. :Let's print it
fmt.Printf("Downloaded the blob: " + downloadedData.String())
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **Delete** method. 

```go
// Cleaning up the quick start by deleting the container and the file created locally
fmt.Printf("Press a key to delete the sample files, example container, and exit the application.\n")
bufio.NewReader(os.Stdin).ReadBytes('\n')
fmt.Printf("Cleaning up.\n")
containerURL.Delete(ctx, azblob.ContainerAccessConditions{})
file.Close()
os.Remove(fileName)
```

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Go. For more information about the Azure Storage Blob SDK, view the [Source Code](https://github.com/Azure/azure-storage-blob-go/) and [API Reference](https://godoc.org/github.com/Azure/azure-storage-blob-go/2016-05-31/azblob).
