---
title: "Quickstart: Azure Blob Storage client library - Ruby"
description: Create a storage account and a container in Azure Blob Storage. Use the storage client library for Ruby to create a blob, download a blob, and list the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 12/04/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.devlang: ruby
ms.custom: mode-api
---

# Quickstart: Azure Blob Storage client library for Ruby

Learn how to use Ruby to create, download, and list blobs in a container in Microsoft Azure Blob Storage.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Make sure you have the following additional prerequisites installed:

- [Ruby](https://www.ruby-lang.org/en/downloads/)
- [Azure Storage client library for Ruby](https://github.com/azure/azure-storage-ruby), using the [RubyGem package](https://rubygems.org/gems/azure-storage-blob):

    ```console
    gem install azure-storage-blob
    ```

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git) used in this quickstart is a basic Ruby application.

Use [Git](https://git-scm.com/) to download a copy of the application to your development environment. This command clones the repository to your local machine:

```console
git clone https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git
```

Navigate to the *storage-blobs-ruby-quickstart* folder, and open the *example.rb* file in your code editor.

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string

Provide your storage account name and account key to create a [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) instance for your application.

The following code in the *example.rb* file instantiates a new [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) object. Replace the *accountname* and *accountkey* values with your account name and key.

```ruby
# Create a BlobService object
account_name = "accountname"
account_key = "accountkey"

blob_client = Azure::Storage::Blob::BlobService.create(
    storage_account_name: account_name,
    storage_access_key: account_key
)
```

## Run the sample

The sample creates a container in Blob Storage, creates a new blob in the container, lists the blobs in the container, and downloads the blob to a local file.

Run the sample. Here is an example of the output from running the application:

```console
C:\azure-samples\storage-blobs-ruby-quickstart> ruby example.rb

Creating a container: quickstartblobs18cd9ec0-f4ac-4688-a979-75c31a70503e

Creating blob: QuickStart_6f8f29a8-879a-41fb-9db2-0b8595180728.txt

List blobs in the container following continuation token
        Blob name: QuickStart_6f8f29a8-879a-41fb-9db2-0b8595180728.txt

Downloading blob to C:/Users/azureuser/Documents/QuickStart_6f8f29a8-879a-41fb-9db2-0b8595180728.txt

Paused, press the Enter key to delete resources created by the sample and exit the application
```

When you press Enter to continue, the sample program deletes the storage container and the local file. Before you continue, check your *Documents* folder for the downloaded file.

You can also use [Azure Storage Explorer](https://storageexplorer.com) to view the files in your storage account. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.

After you've verified the files, press the Enter key to delete the test files and end the demo. Open the *example.rb* file to look at the code.

## Understand the sample code

Next, we walk through the sample code so you can understand how it works.

### Get references to the storage objects

The first thing to do is create instances of the objects used to access and manage Blob Storage. These objects build on each other. Each is used by the next one in the list.

- Create an instance of the Azure storage [BlobService](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/BlobService) object to set up connection credentials.
- Create the [Container](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container/Container) object, which represents the container you're accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the container object, you can create a [Block](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Block) blob object that points to a specific blob in which you're interested. Use the [Block](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Block) object to create, download, and copy blobs.

> [!IMPORTANT]
> Container names must be lowercase. For more information about container and blob names, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

The following example code:

- Creates a new container
- Sets permissions on the container so the blobs are public. The container is called *quickstartblobs* with a unique ID appended.

```ruby
# Create a container
container_name = "quickstartblobs" + SecureRandom.uuid
puts "\nCreating a container: " + container_name
container = blob_client.create_container(container_name)

# Set the permission so the blobs are public
blob_client.set_container_acl(container_name, "container")
```

### Create a blob in the container

Blob Storage supports block blobs, append blobs, and page blobs. To create a blob, call the [create_block_blob](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob#create_block_blob-instance_method) method passing in the data for the blob.

The following example creates a blob called *QuickStart_* with a unique ID and a *.txt* file extension in the container created earlier.

```ruby
# Create a new block blob containing 'Hello, World!'
blob_name = "QuickStart_" + SecureRandom.uuid + ".txt"
blob_data = "Hello, World!"
puts "\nCreating blob: " + blob_name
blob_client.create_block_blob(container.name, blob_name, blob_data)
```

Block blobs can be as large as 4.7 TB, and can be anything from spreadsheets to large video files. Page blobs are primarily used for the VHD files that back IaaS virtual machines. Append blobs are commonly used for logging, such as when you want to write to a file and then keep adding more information.

### List the blobs in a container

Get a list of files in the container using the [list_blobs](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container#list_blobs-instance_method) method. The following code retrieves the list of blobs, then displays their names.

```ruby
# List the blobs in the container
puts "\nList blobs in the container following continuation token"
nextMarker = nil
loop do
    blobs = blob_client.list_blobs(container_name, { marker: nextMarker })
    blobs.each do |blob|
        puts "\tBlob name: #{blob.name}"
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

If a blob is no longer needed, use [delete_blob](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob#delete_blob-instance_method) to remove it. Delete an entire container using the [delete_container](https://www.rubydoc.info/gems/azure-storage-blob/2.0.1/Azure/Storage/Blob/Container#delete_container-instance_method) method. Deleting a container also deletes any blobs stored in the container.

```ruby
# Clean up resources, including the container and the downloaded file
blob_client.delete_container(container_name)
File.delete(full_path_to_file)
```

## Resources for developing Ruby applications with blobs

See these additional resources for Ruby development:

- View and download the [Ruby client library source code](https://github.com/Azure/azure-storage-ruby) for Azure Storage on GitHub.
- Explore [Azure samples](/samples/browse/?products=azure&languages=ruby) written using the Ruby client library.
- [Sample: Getting Started with Azure Storage in Ruby](https://github.com/Azure-Samples/storage-blob-ruby-getting-started)

## Next steps

In this quickstart, you learned how to transfer files between Azure Blob Storage and a local disk by using Ruby. To learn more about working with Blob Storage, continue to the Storage account overview.

> [!div class="nextstepaction"]
> [Storage account overview](../common/storage-account-overview.md)

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob Storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=/azure/storage/blobs/toc.json).
