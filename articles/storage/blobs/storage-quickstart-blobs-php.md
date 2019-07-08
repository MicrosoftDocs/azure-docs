---
title: Azure Quickstart - Create a blob in object storage using PHP | Microsoft Docs 
description: Quickly learn to transfer objects to/from Azure Blob storage using PHP
services: storage
author: mhopkins-msft

ms.service: storage
ms.devlang: php
ms.topic: quickstart
ms.date: 11/14/2018
ms.author: mhopkins
ms.reviewer: seguler
---

#  Transfer objects to/from Azure Blob storage using PHP
In this quickstart, you learn how to use PHP to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Make sure you have the following additional prerequisites installed:

* [PHP](https://php.net/downloads.php)
* [Azure Storage SDK for PHP](https://github.com/Azure/azure-storage-php)

## Download the sample application
The [sample application](https://github.com/Azure-Samples/storage-blobs-php-quickstart.git) used in this quickstart is a basic PHP application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-php-quickstart.git
```

This command clones the repository to your local git folder. To open the PHP sample application, look for the storage-blobs-php-quickstart folder, and open the phpqs.php file.  

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string
In the application, you must provide your storage account name and account key to create the **BlobRestProxy** instance for your application. It is recommended to store these identifiers within an environment variable on the local machine running the application. Use one of the following examples depending on your Operating System to create the environment variable. Replace the **youraccountname** and **youraccountkey** values with your account name and key.

# [Linux](#tab/linux)

```bash
export ACCOUNT_NAME=<youraccountname>
export ACCOUNT_KEY=<youraccountkey>
```

# [Windows](#tab/windows)

```cmd
setx ACCOUNT_NAME=<youraccountname>
setx ACCOUNT_KEY=<youraccountkey>
```
---

## Configure your environment
Take the folder from your local git folder and place it in a directory served by your PHP server. Then, open a command prompt scoped to that same directory and enter: `php composer.phar install`

## Run the sample
This sample creates a test file in the '.' folder. The sample program uploads the test file to Blob storage, lists the blobs in the container, and downloads the file with a new name. 

Run the sample. The following output is an example of the output returned when running the application:
  
```
Uploading BlockBlob: HelloWorld.txt
These are the blobs present in the container: HelloWorld.txt: https://myexamplesacct.blob.core.windows.net/blockblobsleqvxd/HelloWorld.txt

This is the content of the blob uploaded: Hello Azure!
```
When you press the button displayed, the sample program deletes the storage container and the files. Before you continue, check your server's folder for the two files. You can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](https://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the example.rb file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects
The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other, and each is used by the next one in the list.

* Create an instance of the Azure storage **BlobRestProxy** object to set up connection credentials. 
* Create the **BlobService** object that points to the Blob service in your storage account. 
* Create the **Container** object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the **blobClient** container object, you can create the **Block** blob object that points to the specific blob in which you are interested. Then you can perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you set up an instance of Azure storage client, instantiate the blob service object, create a new container, and set permissions on the container so the blobs are public. The container is called **quickstartblobs**. 

```PHP
    # Setup a specific instance of an Azure::Storage::Client
    $connectionString = "DefaultEndpointsProtocol=https;AccountName=".getenv('account_name').";AccountKey=".getenv('account_key');
    
    // Create blob client.
    $blobClient = BlobRestProxy::createBlobService($connectionString);
    
    # Create the BlobService that represents the Blob service for the storage account
    $createContainerOptions = new CreateContainerOptions();
    
    $createContainerOptions->setPublicAccess(PublicAccessType::CONTAINER_AND_BLOBS);
    
    // Set container metadata.
    $createContainerOptions->addMetaData("key1", "value1");
    $createContainerOptions->addMetaData("key2", "value2");

    $containerName = "blockblobs".generateRandomString();

    try    {
        // Create container.
        $blobClient->createContainer($containerName, $createContainerOptions);
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.  

To upload a file to a blob, get the full path of the file by joining the directory name and the file name on your local drive. You can then upload the file to the specified path using the **createBlockBlob()** method. 

The sample code takes a local file and uploads it to Azure. The file is stored as **myfile** and the name of the blob as **fileToUpload** in the code. The following example uploads the file to your container called **quickstartblobs**.

```PHP
    $myfile = fopen("HelloWorld.txt", "w") or die("Unable to open file!");
    fclose($myfile);

    # Upload file as a block blob
    echo "Uploading BlockBlob: ".PHP_EOL;
    echo $fileToUpload;
    echo "<br />";
    
    $content = fopen($fileToUpload, "r");

    //Upload blob
    $blobClient->createBlockBlob($containerName, $fileToUpload, $content);
```

To perform a partial update of the content of a block blob, use the **createblocklist()** method. Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Append blob should be used in a single writer model. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of files in the container using the **listBlobs()** method. The following code retrieves the list of blobs, then loops through them, showing the names of the blobs found in a container.  

```PHP
    $listBlobsOptions = new ListBlobsOptions();
    $listBlobsOptions->setPrefix("HelloWorld");
    
    echo "These are the blobs present in the container: ";
    
    do{
        $result = $blobClient->listBlobs($containerName, $listBlobsOptions);
        foreach ($result->getBlobs() as $blob)
        {
            echo $blob->getName().": ".$blob->getUrl()."<br />";
        }
        
        $listBlobsOptions->setContinuationToken($result->getContinuationToken());
    } while($result->getContinuationToken());
```

### Get the content of your blobs

Get the contents of your blobs using the **getBlob()** method. The following code displays the contents of the blob uploaded in a previous section.

```PHP
    $blob = $blobClient->getBlob($containerName, $fileToUpload);
    fpassthru($blob->getContentStream());
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **deleteContainer()** method. If the files created are no longer needed, you use the **deleteBlob()** method to delete the files.

```PHP
    // Delete blob.
    echo "Deleting Blob".PHP_EOL;
    echo $fileToUpload;
    echo "<br />";
    $blobClient->deleteBlob($_GET["containerName"], $fileToUpload);

    // Delete container.
    echo "Deleting Container".PHP_EOL;
    echo $_GET["containerName"].PHP_EOL;
    echo "<br />";
    $blobClient->deleteContainer($_GET["containerName"]);

    //Deleting local file
    echo "Deleting file".PHP_EOL;
    echo "<br />";
    unlink($fileToUpload);   
```

## Resources for developing PHP applications with blobs

See these additional resources for PHP development with Blob storage:

- View, download, and install the [PHP client library source code](https://github.com/Azure/azure-storage-php) for Azure Storage on GitHub.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=php&term=blob) written using the PHP client library.

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using PHP. To learn more about working with PHP, continue to our PHP Developer center.

> [!div class="nextstepaction"]
> [PHP Developer Center](https://azure.microsoft.com/develop/php/)


For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
