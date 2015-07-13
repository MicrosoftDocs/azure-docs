#####Create a container
Just as files live in folders, storage blobs live in containers. You can use a **CloudBlobClient** object to reference an existing container, or you can call the CreateCloudBlobClient() method to create a new container.

The following code shows how to create a new blob storage container. The code first creates a **BlobClient** object so that you can access the object's functions, such as creating a storage container. Then, the code tries to reference a storage container named “mycontainer.” If it can’t find a container with that name, it creates one.

	// Create a blob client.
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Get a reference to a container named “mycontainer.”
	CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

	// If “mycontainer” doesn’t exist, create it.
	container.CreateIfNotExists();

By default, the new container is private and you must specify your storage access key to download blobs from this container. If you want to make the files within the container available to everyone, you can set the container to be public by using the following code.

	container.SetPermissions(
    	new BlobContainerPermissions { PublicAccess = 
	    BlobContainerPublicAccessType.Blob }); 


**NOTE:** Use this code block in front of the code in the following sections.

#####Upload a blob into a container
To upload a blob file into a container, get a container reference and use it to get a blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the **UploadFromStream()** method. This operation will create the blob if it’s not already there, or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

	// Get a reference to a blob named "myblob".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");
	
	// Create or overwrite the "myblob" blob with the contents of a local file
	// named “myfile”.
	using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
	{
    	blockBlob.UploadFromStream(fileStream);
	}

#####List the blobs in a container
To list the blobs in a container, first get a container reference. You can then call the container's **ListBlobs()** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, **CloudPageBlob**, or **CloudBlobDirectory** object. If you don’t know the blob type, you can use a type check to determine which to cast it to. The following code demonstrates how to retrieve and output the URI of each item in a container named “photos”.

	// Get a reference to a previously created container.
	CloudBlobContainer container = blobClient.GetContainerReference("photos");

	// Loop through items in the container and output the length and URI for each 
	// item.
	foreach (IListBlobItem item in container.ListBlobs(null, false))
	{
    	if (item.GetType() == typeof(CloudBlockBlob))
    	{
        	CloudBlockBlob blob = (CloudBlockBlob)item;

        	Console.WriteLine("Block blob of length {0}: {1}", blob.Properties.Length, blob.Uri);

    	}
    	else if (item.GetType() == typeof(CloudPageBlob))
    	{
        	CloudPageBlob pageBlob = (CloudPageBlob)item;

        	Console.WriteLine("Page blob of length {0}: {1}", pageBlob.Properties.Length, pageBlob.Uri);

    	}
    	else if (item.GetType() == typeof(CloudBlobDirectory))
    	{
        	CloudBlobDirectory directory = (CloudBlobDirectory)item;

        	Console.WriteLine("Directory: {0}", directory.Uri);
    	}
	}

There are others ways to list the contents of a blob container. See [How to use Blob Storage from .NET](../articles/storage/storage-dotnet-how-to-use-blobs.md/#list-blob) for more information.

#####Download a blob
To download a blob, first get a reference to the blob and then call the DownloadToStream() method. The following example uses the DownloadToStream() method to transfer the blob contents to a stream object that you can then save as a local file.

	// Get a reference to a blob named "photo1.jpg".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

	// Save the blob contents to a file named “myfile”.
	using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
	{
    	blockBlob.DownloadToStream(fileStream);
	}

There are other ways to save blobs as files. See [How to use Blob Storage from .NET](../articles/storage/storage-dotnet-how-to-use-blobs.md/#download-blobs) for more information.

#####Delete a blob
To delete a blob, first get a reference to the blob and then call the Delete() method on it.

	// Get a reference to a blob named "myblob.txt".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

	// Delete the blob.
	blockBlob.Delete();

[Learn more about Azure Storage](http://azure.microsoft.com/documentation/services/storage/)
See also [Browsing Storage Resources in Server Explorer](http://msdn.microsoft.com/library/azure/ff683677.aspx).