---
title:  Azure Quickstart - Transfer objects to/from Azure Blob storage using Ruby | Microsoft Docs 
description: Quickly learn to transfer objects to/from Azure Blob storage using Ruby
services: storage
author: ruthogunnnaike
manager: jeconnoc

ms.service: storage
ms.tgt_pltfrm: na
ms.devlang: ruby
ms.topic: quickstart
ms.date: 12/7/2017
ms.author: v-ruogun
---

#  Transfer objects to/from Azure Blob storage using Ruby
In this quickstart, you learn how to use Ruby to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

To complete this quickstart: 
* Install [Ruby](https://www.ruby-lang.org/en/downloads/)
* Install the [Azure Storage library for Ruby](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-ruby-how-to-use-blob-storage#configure-your-application-to-access-storage) using the rubygem package. 

```
gem install azure-storage
```

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application
The [sample application](https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git) used in this quickstart is a basic Ruby application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-ruby-quickstart.git 
```

This command clones the repository to your local git folder. To open the Ruby sample application, look for the storage-blobs-ruby-quickstart folder, and open the example.rb file.  

## Configure your storage connection string
In the application, you must provide your storage account name and account key to create the `Client` instance for your application. Open the `example.rb` file from the Solution Explorer in your IDE. Replace the **accountname** and **accountkey** values with your account name and key. 

```ruby 
client = Azure::Storage.client(storage_account_name: account_name, storage_access_key: account_key)
```

## Run the sample
This sample creates a test file in the 'Documents' folder. The sample program uploads the test file to Blob storage, lists the blobs in the container, and downloads the file with a new name. 

Run the sample. The following output is an example of the output returned when running the application:
  
```
Temp file = C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Uploading to Blob storage as blobQuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

List blobs in the container
         Blob name: QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Downloading blob to C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078_DOWNLOADED.txt
```
When you press any key to continue, the sample program deletes the storage container and the files. Before you continue, check your 'Documents' folder for the two files. You can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the example.rb file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects
The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other, and each is used by the next one in the list.

* Create an instance of the Azure storage **Client** object to set up connection credentials. 
* Create the **BlobService** object that points to the Blob service in your storage account. 
* Create the **Container** object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the Cloud Blob container, you can create the **Block** blob object that points to the specific blob in which you are interested, and perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you set up an instance of Azure storage client, instantiate the blob service object, create a new container, and then set permissions on the container so the blobs are public. The container is called **quickstartblobs**. 

```ruby 
# Setup a specific instance of an Azure::Storage::Client
client = Azure::Storage.client(storage_account_name: account_name, storage_access_key: account_key)

# Create the BlobService that represents the Blob service for the storage account
blob_service = client.blob_client

# Create a container called 'quickstartblobs'.
container_name ='quickstartblobs'
container = blob_service.create_container(container_name)   

# Set the permission so the blobs are public.
blob_service.set_container_acl(container_name, "container")
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.  

To upload a file to a blob, get the full path of the file by joining the directory name and the file name on your local drive. You can then upload the file to the specified path using the **create\_block\_blob()** method. 

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **file\_path\_to\_file** and the name of the blob as **local\_file\_name**. The following example uploads the file to your container called **quickstartblobs**.

```ruby
# Create a file in Documents to test the upload and download.
local_path=File.expand_path("~/Documents")
local_file_name ="QuickStart_" + SecureRandom.uuid + ".txt"
full_path_to_file =File.join(local_path, local_file_name)

# Write text to the file.
file = File.open(full_path_to_file,  'w')
file.write("Hello, World!")
file.close()

puts "Temp file = " + full_path_to_file
puts "\nUploading to Blob storage as blob" + local_file_name

# Upload the created file, using local_file_name for the blob name
blob_service.create_block_blob(container.name, local_file_name, full_path_to_file)
```

To perform a partial update of the content of a block blob, use the **create\_block\_list()** method. Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Append blob should be used in a single writer model. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of files in the container using the **list\_blobs()** method. The following code retrieves the list of blobs, then loops through them, showing the names of the blobs found in a container.  

```ruby
# List the blobs in the container
puts "\n List blobs in the container"
blobs = blob_service.list_blobs(container_name)
blobs.each do |blob|
    puts "\t Blob name #{blob.name}"   
end  
```

### Download the blobs

Download blobs to your local disk using the **get\_blob()** method. The following code downloads the blob uploaded in a previous section. "_DOWNLOADED" is added as a suffix to the blob name so you can see both files on local disk. 

```ruby
# Download the blob(s).
# Add '_DOWNLOADED' as prefix to '.txt' so you can see both files in Documents.
full_path_to_file2 = File.join(local_path, local_file_name.gsub('.txt', '_DOWNLOADED.txt'))

puts "\n Downloading blob to " + full_path_to_file2
blob, content = blob_service.get_blob(container_name,local_file_name)
File.open(full_path_to_file2,"wb") {|f| f.write(content)}
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **delete\_container()** method. If the files created are no longer needed, you use the **delete\_blob()** method to delete the files.

```ruby
# Clean up resources. This includes the container and the temp files
blob_service.delete_container(container_name)
File.delete(full_path_to_file)
File.delete(full_path_to_file2)    
```

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Ruby. To learn more about working with blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](./storage-ruby-how-to-use-blob-storage.md)


For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
