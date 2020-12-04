---
title: "Quickstart: Azure Blob Storage client library - Ruby"
description: Create a storage account and a container in Azure Blob Storage. Use the storage client library for Ruby to create a blob, download a blob, and list the blobs in a container.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 12/03/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Azure Blob Storage client library for Ruby

In this quickstart, you learn how to use Ruby to create, download, and list block blobs in a container in Microsoft Azure Blob Storage.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Make sure you have the following additional prerequisites installed:

* [Ruby](https://www.ruby-lang.org/en/downloads/)
* [Azure Storage library for Ruby](https://github.com/azure/azure-storage-ruby), using the rubygem package:

    ```console
    gem install azure-storage-blob
    ```

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git) used in this quickstart is a basic Ruby application.

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git
```

This command clones the repository to your local git folder. To open the Ruby sample application, look for the storage-blobs-ruby-quickstart folder, and open the example.rb file.

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string

In the application, you must provide your storage account name and account key to create a [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) instance for your application. Open the *example.rb* file in your IDE. Replace the *accountname* and *accountkey* values with your account name and key.

```ruby
blob_client = Azure::Storage::Blob::BlobService.create(
            storage_account_name: account_name,
            storage_access_key: account_key
          )
```

## Run the sample

This sample creates a container in Blob Storage, creates a new blob in the container, lists the blobs in the container, and downloads the blob to a local file.

Run the sample. The following output is an example of the output returned when running the application:

```console
Creating a container: quickstartblobs4c3bbac6-d379-462a-a2e1-e974c4c2e0f2

List blobs in the container following continuation token
        Blob name QuickStart_170e7d73-54ac-486e-914a-c676b9baa0e6.txt

Downloading blob to C:/Users/azureuser/Documents/QuickStart_170e7d73-54ac-486e-914a-c676b9baa0e6.txt
Sample finished running. Hit <any key>, to delete resources created by the sample and exit the application
```

When you press any key to continue, the sample program deletes the storage container and the local file. Before you continue, check your 'Documents' folder for the downloaded file.

You can also use [Azure Storage Explorer](https://storageexplorer.com) to view the files in your storage account. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the *example.rb* file to look at the code.

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects

The first thing to do is create the references to the objects used to access and manage Blob Storage. These objects build on each other. Each is used by the next one in the list.

* Create an instance of the Azure storage [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) object to set up connection credentials.
* Create the [Container](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container/Container) object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the container client, you can create the [Block](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Block) blob object that points to the specific blob in which you are interested, and perform operations such as create, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you instantiate a new [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) object, create a new container, then set permissions on the container so the blobs are public. The container is called *quickstartblobs* with a unique ID appended.

```ruby
# Create a BlobService object
blob_client = Azure::Storage::Blob::BlobService.create(
    storage_account_name: account_name,
    storage_access_key: account_key
)

# Create a container called 'quickstartblobs'
container_name = 'quickstartblobs' + SecureRandom.uuid
puts "Creating a container: " + container_name
container = blob_client.create_container(container_name)

# Set the permission so the blobs are public
blob_client.set_container_acl(container_name, "container")
```

### Create a blob in the container

Blob Storage supports block blobs, append blobs, and page blobs. To create a blob, call the [create_block_blob](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob#create_block_blob-instance_method) method passing in the data for the blob. The following example creates a blob in your container called *quickstartblobs* with a unique ID and a *.txt* file extension.

```ruby
blob_name = "QuickStart_" + SecureRandom.uuid + ".txt"
blob_contents = "Hello, World!"

# Create a new block blob containing 'Hello, World!'
blob_client.create_block_blob(container.name, blob_name, blob_contents)
```

Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. Page blobs are primarily used for the VHD files that back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Append blob should be used in a single writer model. Most objects stored in Blob Storage are block blobs.

### List the blobs in a container

You can get a list of files in the container using the [list_blobs](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container#list_blobs-instance_method) method. The following code retrieves the list of blobs, then loops through them, showing the names of the blobs found in a container.

```ruby
# List the blobs in the container
puts "\nList blobs in the container following continuation token"
nextMarker = nil
loop do
    blobs = blob_client.list_blobs(container_name, { marker: nextMarker })
    blobs.each do |blob|
        puts "\tBlob name #{blob.name}"
    end
    nextMarker = blobs.continuation_token
    break unless nextMarker && !nextMarker.empty?
end
```

### Download a blob

Download a blob to your local disk using the [get_blob](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob#get_blob-instance_method) method. The following code downloads the blob created in a previous section.

```ruby
# Download the blob

# Set the path to the local folder for downloading
if(is_windows)
    local_path = File.expand_path("~/Documents")
else 
    local_path = File.expand_path("~/")
end

# Create the full path to the downloaded file
full_path_to_file = File.join(local_path, blob_name)

puts "\nDownloading blob to " + full_path_to_file
blob, content = blob_client.get_blob(container_name, blob_name)
File.open(full_path_to_file,"wb") {|f| f.write(content)}
```

### Clean up resources

If you no longer need the blob created in this quickstart, delete the entire container using the [delete_container](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container#delete_container-instance_method) method. If the blob is no longer needed, use the [delete_blob](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob#delete_blob-instance_method) method.

```ruby
# Clean up resources, including the container and the downloaded file
blob_client.delete_container(container_name)
File.delete(full_path_to_file)
```
## Resources for developing Ruby applications with blobs

See these additional resources for Ruby development with Blob Storage:

- View and download the [Ruby client library source code](https://github.com/Azure/azure-storage-ruby) for Azure Storage on GitHub.
- Explore [Blob Storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=ruby&term=blob) written using the Ruby client library.

## Next steps

In this quickstart, you learned how to transfer files between Azure Blob Storage and a local disk using Ruby. To learn more about working with Blob Storage, continue to the Storage account overview.

> [!div class="nextstepaction"]
> [Storage account overview](storage-account-overview.md)


For more information about the Storage Explorer and Blobs, see [Manage Azure Blob Storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).