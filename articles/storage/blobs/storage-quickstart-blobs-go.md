---
title: Azure Quickstart - Create a blob in object storage using Go | Microsoft Docs
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library for Go to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage  
author: mhopkins-msft

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 11/14/2018
ms.author: mhopkins
ms.reviewer: seguler
---

# Quickstart: Upload, download, and list blobs using Go

In this quickstart, you learn how to use the Go programming language to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Make sure you have the following additional prerequisites installed:
 
* [Go 1.8 or above](https://golang.org/dl/)
* [Azure Storage Blob SDK for Go](https://github.com/azure/azure-storage-blob-go/), using the following command:

    ```
    go get -u github.com/Azure/azure-storage-blob-go/azblob
    ``` 

    > [!NOTE]
    > Make sure that you capitalize `Azure` in the URL to avoid case-related import problems when working with the SDK. Also capitalize `Azure` in your import statements.
    
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

# [Linux](#tab/linux)

```
export AZURE_STORAGE_ACCOUNT="<youraccountname>"
export AZURE_STORAGE_ACCESS_KEY="<youraccountkey>"
```

# [Windows](#tab/windows)

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
> You can also use a tool such as the [Azure Storage Explorer](https://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 
>

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Create ContainerURL and BlobURL objects
The first thing to do is to create the references to the ContainerURL and BlobURL objects used to access and manage Blob storage. These objects offer low-level APIs such as Create, Upload, and Download to issue REST APIs.

* Use [**SharedKeyCredential**](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob#SharedKeyCredential) struct to store your credentials. 

* Create a [**Pipeline**](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob#NewPipeline) using the credentials and options. The pipeline specifies things like retry policies, logging, deserialization of HTTP response payloads, and more.  

* Instantiate a new [**ContainerURL**](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob#ContainerURL), and a new [**BlobURL**](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob#BlobURL) object to run operations on container (Create) and blobs (Upload and Download).


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
credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
if err != nil {
	log.Fatal("Invalid credentials with error: " + err.Error())
}
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
_, err = containerURL.Create(ctx, azblob.Metadata{}, azblob.PublicAccessNone)
handleErrors(err)
```
### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.  

To upload a file to a blob, open the file using **os.Open**. You can then upload the file to the specified path using one of the REST APIs: Upload (PutBlob), StageBlock/CommitBlockList (PutBlock/PutBlockList). 

Alternatively, the SDK offers [high-level APIs](https://github.com/Azure/azure-storage-blob-go/blob/master/azblob/highlevel.go) that are built on top of the low-level REST APIs. As an example, ***UploadFileToBlockBlob*** function uses StageBlock (PutBlock) operations to concurrently upload a file in chunks to optimize the throughput. If the file is less than 256 MB, it uses Upload (PutBlob) instead to complete the transfer in a single transaction.

The following example uploads the file to your container called **quickstartblobs-[randomstring]**.

```go
// Create a file to test the upload and download.
fmt.Printf("Creating a dummy file to test the upload and download\n")
data := []byte("hello world this is a blob\n")
fileName := randomString()
err = ioutil.WriteFile(fileName, data, 0700)
handleErrors(err)

// Here's how to upload a blob.
blobURL := containerURL.NewBlockBlobURL(fileName)
file, err := os.Open(fileName)
handleErrors(err)

// You can use the low-level Upload (PutBlob) API to upload files. Low-level APIs are simple wrappers for the Azure Storage REST APIs.
// Note that Upload can upload up to 256MB data in one shot. Details: https://docs.microsoft.com/rest/api/storageservices/put-blob
// To upload more than 256MB, use StageBlock (PutBlock) and CommitBlockList (PutBlockList) functions. 
// Following is commented out intentionally because we will instead use UploadFileToBlockBlob API to upload the blob
// _, err = blobURL.Upload(ctx, file, azblob.BlobHTTPHeaders{ContentType: "text/plain"}, azblob.Metadata{}, azblob.BlobAccessConditions{})
// handleErrors(err)

// The high-level API UploadFileToBlockBlob function uploads blocks in parallel for optimal performance, and can handle large files as well.
// This function calls StageBlock/CommitBlockList for files larger 256 MBs, and calls Upload for any file smaller
fmt.Printf("Uploading the file with blob name: %s\n", fileName)
_, err = azblob.UploadFileToBlockBlob(ctx, file, blobURL, azblob.UploadToBlockBlobOptions{
	BlockSize:   4 * 1024 * 1024,
	Parallelism: 16})
handleErrors(err)
```

### List the blobs in a container

Get a list of files in the container using the **ListBlobs** method on a **ContainerURL**. ListBlobs returns a single segment of blobs (up to 5000) starting from the specified **Marker**. Use an empty Marker to start enumeration from the beginning. Blob names are returned in lexicographic order. After getting a segment, process it, and then call ListBlobs again passing the previously returned Marker.  

```go
// List the container that we have created above
fmt.Println("Listing the blobs in the container:")
for marker := (azblob.Marker{}); marker.NotDone(); {
	// Get a result segment starting with the blob indicated by the current Marker.
	listBlob, err := containerURL.ListBlobsFlatSegment(ctx, marker, azblob.ListBlobsSegmentOptions{})
	handleErrors(err)

	// ListBlobs returns the start of the next segment; you MUST use this to get
	// the next segment (after processing the current result segment).
	marker = listBlob.NextMarker

	// Process the blobs returned in this result segment (if the segment is empty, the loop body won't execute)
	for _, blobInfo := range listBlob.Segment.BlobItems {
		fmt.Print("	Blob name: " + blobInfo.Name + "\n")
	}
}
```

### Download the blob

Download blobs using the **Download** low-level function on a BlobURL. This will return a **DownloadResponse** struct. Run the function **Body** on the struct to get a **RetryReader** stream for reading data. If a connection fails while reading, it will make additional requests to re-establish a connection and continue reading. Specifying a RetryReaderOption's with MaxRetryRequests set to 0 (the default), returns the original response body and no retries will be performed. Alternatively, use the high-level APIs **DownloadBlobToBuffer** or **DownloadBlobToFile** to simplify your code.

The following code downloads the blob using the **Download** function. The contents of the blob is written into a buffer and shown on the console.

```go
// Here's how to download the blob
downloadResponse, err := blobURL.Download(ctx, 0, azblob.CountToEnd, azblob.BlobAccessConditions{}, false)

// NOTE: automatically retries are performed if the connection fails
bodyStream := downloadResponse.Body(azblob.RetryReaderOptions{MaxRetryRequests: 20})

// read the body into a buffer
downloadedData := bytes.Buffer{}
_, err = downloadedData.ReadFrom(bodyStream)
handleErrors(err)
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **Delete** method. 

```go
// Cleaning up the quick start by deleting the container and the file created locally
fmt.Printf("Press enter key to delete the sample files, example container, and exit the application.\n")
bufio.NewReader(os.Stdin).ReadBytes('\n')
fmt.Printf("Cleaning up.\n")
containerURL.Delete(ctx, azblob.ContainerAccessConditions{})
file.Close()
os.Remove(fileName)
```

## Resources for developing Go applications with blobs

See these additional resources for Go development with Blob storage:

- View and install the [Go client library source code](https://github.com/Azure/azure-storage-blob-go) for Azure Storage on GitHub.
- Explore [Blob storage samples](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob#pkg-examples) written using the Go client library.

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Go. For more information about the Azure Storage Blob SDK, view the [Source Code](https://github.com/Azure/azure-storage-blob-go/) and [API Reference](https://godoc.org/github.com/Azure/azure-storage-blob-go/azblob).
