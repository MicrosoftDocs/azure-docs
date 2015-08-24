
<properties 
  pageTitle="Set and retrieve Properties and Metadata for Storage Resources | Microsoft Azure" 
  description="Learn how to set and retrieve properties and metadata for Azure Storage resources." 
  services="storage" 
  documentationCenter="" 
  authors="tamram" 
  manager="adinah" 
  editor=""/>

<tags 
  ms.service="storage" 
  ms.workload="storage" 
  ms.tgt_pltfrm="na" 
  ms.devlang="na" 
  ms.topic="article" 
  ms.date="08/04/2015" 
  ms.author="tamram"/>


# Set and Retrieve Properties and Metadata #

## Overview

Objects in Azure Storage support system properties and user-defined metadata, in addition to the data they contain:

*   **System properties.** System properties exist on each storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure storage client library maintains these for you.  

*   **User-defined metadata.** User-defined metadata is metadata that you specify on a given resource, in the form of a name-value pair. You can use metadata to store additional values with a storage resource; these values are for your own purposes only and do not affect how the resource behaves.  

## Setting and Retrieving Properties

Retrieving property and metadata values for a storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling either the **FetchAttributes** or **FetchAttributesAsync** method.

> [AZURE.IMPORTANT] Property and metadata values for a storage resource are not populated unless you call one of the **FetchAttributes** methods. 

To set properties on a blob, specify the property value, then call the **SetProperties** or **SetPropertiesAsync** method.

The following code example creates a container and writes property values to a console window:

    //Parse the connection string for the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));
	
	//Create the service client object for credentialed access to the Blob service.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve a reference to a container. 
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Create the container if it does not already exist.
    container.CreateIfNotExists();

    // Fetch container properties and write out their values.
    container.FetchAttributes();
    Console.WriteLine("Properties for container {0}", container.StorageUri.PrimaryUri.ToString());
    Console.WriteLine("LastModifiedUTC: {0}", container.Properties.LastModified.ToString());
    Console.WriteLine("ETag: {0}", container.Properties.ETag);
    Console.WriteLine();

## Setting and Retrieving Metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to the **Metadata** collection on the resource, then call the **SetMetadata** method to save the values to the service.

> [AZURE.NOTE]: The name of your metadata must conform to the naming conventions for C# identifiers.
 
To retrieve metadata, call the **FetchAttributes** method on your blob or container to populate the **Metadata** collection, then read the values.

The following code example creates a new container and sets metadata for it, then reads the metadata values back out:

         
	// Account name and key.  Modify for your account.
	<span style="color:Blue;">string accountName = <span style="color:#A31515;">"myaccount";
	<span style="color:Blue;">string accountKey = <span style="color:#A31515;">"SzlFqgzqhfkj594cFoveYqCuvo8v9EESAnOLcTBeBIo31p16rJJRZx/5vU/oY3ZsK/VdFNaVpm6G8YSD2K48Nw==";

	// Get a reference to the storage account and client with authentication credentials.
	StorageCredentials credentials = <span style="color:Blue;">new StorageCredentials(accountName, accountKey);
	CloudStorageAccount storageAccount = <span style="color:Blue;">new CloudStorageAccount(credentials, <span style="color:Blue;">true);
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Retrieve a reference to a container. 
	CloudBlobContainer container = blobClient.GetContainerReference(<span style="color:#A31515;">"mycontainer");

	// Create the container if it does not already exist.
	container.CreateIfNotExists();

	// Set metadata for the container.
	container.Metadata[<span style="color:#A31515;">"category"] = <span style="color:#A31515;">"images";
	container.Metadata[<span style="color:#A31515;">"owner"] = <span style="color:#A31515;">"azure";
	container.SetMetadata();

	// Get container metadata.
	container.FetchAttributes();
	<span style="color:Blue;">foreach (<span style="color:Blue;">string key <span style="color:Blue;">in container.Metadata.Keys)
	{
	   Console.WriteLine(<span style="color:#A31515;">"Metadata key: " + key);
	   Console.WriteLine(<span style="color:#A31515;">"Metadata value: " + container.Metadata[key]);
	}

	//Clean up.
	container.Delete();

## See Also  

- [Azure Storage Client Library Reference](http://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx)
- [Get Started with the Blob Storage for .NET](storage-dotnet-how-to-use-blobs.md)  
 