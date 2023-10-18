---
title: "Quickstart: Azure Blob Storage client library for Go"
titleSuffix: Azure Storage
description: In this quickstart, you learn how to use the Azure Blob Storage client library for Go to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 08/29/2023
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: golang
ms.custom: mode-api, passwordless-go, devx-track-go
---

# Quickstart: Azure Blob Storage client library for Go

Get started with the Azure Blob Storage client library for Go to manage blobs and containers. Follow these steps to install the package and try out example code for basic tasks.

[API reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob) | [Package (pkg.go.dev)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Go 1.18+](https://go.dev/dl/)

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library for Go.

### Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-go-quickstart.git) used in this quickstart is a basic Go application.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```console
git clone https://github.com/Azure-Samples/storage-blobs-go-quickstart 
```

This command clones the repository to your local git folder. To open the Go sample for Blob Storage, look for the file named `storage-quickstart.go`.

### Install the packages

To work with blob and container resources in a storage account, install the [azblob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/) package using the following command:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
```
To authenticate with Azure Active Directory (recommended), install the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) module using the following command:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## Authenticate to Azure and authorize access to blob data

Application requests to Azure Blob Storage must be authorized. Using `DefaultAzureCredential` and the Azure Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code, including Blob Storage.

You can also authorize requests to Azure Blob Storage by using the account access key. However, this approach should be used with caution. Developers must be diligent to never expose the access key in an unsecure location. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication. Both options are demonstrated in the following example.

`DefaultAzureCredential` is a credential chain implementation provided by the Azure Identity client library for Go. `DefaultAzureCredential` supports multiple authentication methods and determines which method to use at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

To learn more about the order and locations in which `DefaultAzureCredential` looks for credentials, see [Azure Identity library overview](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential).

For example, your app can authenticate using your Azure CLI sign-in credentials with when developing locally. Once it's deployed to Azure, your app can then use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). This transition between environments doesn't require any code changes.

### Assign roles to your Azure AD user account

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### Sign-in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your storage account. The following example shows how to authenticate via the Azure CLI:

    ```azurecli
    az login
    ```

2. To use `DefaultAzureCredential` in a Go application, install the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) module using the following command::

    ```console
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

Azure CLI authentication isn't recommended for applications running in Azure. When deployed to Azure, you can use the same code to authorize requests to Azure Storage from an application running in Azure. However, you need to enable managed identity on your app in Azure and configure your storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/azure/developer/go/azure-sdk-authentication-managed-identity) tutorial.

To learn more about different authentication methods, check out [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).

## Run the sample

The code example performs the following actions:
- Creates a client object authorized for data access via `DefaultAzureCredential`
- Creates a container in a storage account
- Uploads a blob to the container
- Lists the blobs in the container
- Downloads the blob data into a buffer
- Deletes the blob and container resources created by the app

Before you run the sample, open the *storage-quickstart.go* file. Replace `<storage-account-name>` with the name of your Azure storage account.

Then run the application using the following command:

```console
go run storage-quickstart.go
```

The output of the app is similar to the following example:

```console
Azure Blob storage quick start sample
Creating a container named quickstart-sample-container
Uploading a blob named sample-blob
Listing the blobs in the container:
sample-blob
Blob contents:

Hello, world! This is a blob.

Press enter key to delete resources and exit the application.

Cleaning up.
Deleting the blob sample-blob
Deleting the container quickstart-sample-container
```

When you press the enter key at the prompt, the sample program deletes the blob and container resources created by the app.

> [!TIP]
> You can also use a tool such as the [Azure Storage Explorer](https://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.
>

## Understand the sample code

Next, we walk through the sample code to understand how it works.

### Authorize access and create a client object

Working with any Azure resource using the SDK begins with creating a client object. To create the client object, the code sample calls [azblob.NewClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#NewClient) with the following values:

- **serviceURL** - the URL of the storage account
- **cred** - an Azure AD credential obtained via the `azidentity` module
- **options** - client options; pass nil to accept the default values

The following code example creates a client object to interact with container and blob resources in a storage account:

```go
// TODO: replace <storage-account-name> with your actual storage account name
url := "https://<storage-account-name>.blob.core.windows.net/"
ctx := context.Background()

credential, err := azidentity.NewDefaultAzureCredential(nil)
handleError(err)

client, err := azblob.NewClient(url, credential, nil)
handleError(err)
```

### Create a container
The code sample creates a new container resource in the storage account. If a container with the same name already exists, a `ResourceExistsError` is raised.

> [!IMPORTANT]
> Container names must be lowercase. To learn more about naming requirements for containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

The following code example creates a new container called *quickstart-sample-container* in the storage account:

```go
// Create the container
containerName := "quickstart-sample-container"
fmt.Printf("Creating a container named %s\n", containerName)
_, err = client.CreateContainer(ctx, containerName, nil)
handleError(err)
```

### Upload blobs to the container

The code sample creates a byte array with some data, and uploads the data as a buffer to a new blob resource in the specified container. 

The following code example uploads the blob data to the specified container using the [UploadBuffer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadBuffer) method:

```go
data := []byte("\nHello, world! This is a blob.\n")
blobName := "sample-blob"

// Upload to data to blob storage
fmt.Printf("Uploading a blob named %s\n", blobName)
_, err = client.UploadBuffer(ctx, containerName, blobName, data, &azblob.UploadBufferOptions{})
handleError(err)
```

### List the blobs in a container

The code sample lists the blobs in the specified container. This example uses [NewListBlobsFlatPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.NewListBlobsFlatPager), which returns a pager for blobs starting from the specified Marker. Here, we use an empty Marker to start enumeration from the beginning, and continue paging until there are no more results. This method returns blob names in lexicographic order.

The following code example lists the blobs in the specified container:

```go
// List the blobs in the container
fmt.Println("Listing the blobs in the container:")

pager := client.NewListBlobsFlatPager(containerName, &azblob.ListBlobsFlatOptions{
	Include: azblob.ListBlobsInclude{Snapshots: true, Versions: true},
})

for pager.More() {
	resp, err := pager.NextPage(context.TODO())
	handleError(err)

	for _, blob := range resp.Segment.BlobItems {
		fmt.Println(*blob.Name)
	}
}
```

### Download the blob

The code sample downloads a blob using the [DownloadStream](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadStream) method, and creates a retry reader for reading data. If a connection fails while reading, the retry reader makes other requests to re-establish a connection and continue reading. You can specify retry reader options using the [RetryReaderOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#RetryReaderOptions) struct.

The following code example downloads a blob and writes the contents to the console:

```go
// Download the blob
get, err := client.DownloadStream(ctx, containerName, blobName, nil)
handleError(err)

downloadedData := bytes.Buffer{}
retryReader := get.NewRetryReader(ctx, &azblob.RetryReaderOptions{})
_, err = downloadedData.ReadFrom(retryReader)
handleError(err)

err = retryReader.Close()
handleError(err)

// Print the contents of the blob we created
fmt.Println("Blob contents:")
fmt.Println(downloadedData.String())
```

### Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the individual blob using the [DeleteBlob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DeleteBlob) method, or the entire container and its contents using the [DeleteContainer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DeleteContainer) method.

```go
// Delete the blob
fmt.Printf("Deleting the blob " + blobName + "\n")

_, err = client.DeleteBlob(ctx, containerName, blobName, nil)
handleError(err)

// Delete the container
fmt.Printf("Deleting the container " + containerName + "\n")
_, err = client.DeleteContainer(ctx, containerName, nil)
handleError(err)
```

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Go.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage library for Go samples](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#example-package)

- To learn more, see the [Azure Blob Storage client library for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob).
- For tutorials, samples, quickstarts, and other documentation, visit [Azure for Go Developers](/azure/developer/go/overview).
