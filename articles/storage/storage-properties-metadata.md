<properties
	pageTitle="Set and retrieve properties and metadata for objects in Azure Storage | Microsoft Azure"
	description="Store custom metadata on objects in Azure Storage, and set and retrieve system properties."
	services="storage"
	documentationCenter=""
	authors="tamram"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/23/2016"
	ms.author="tamram"/>

# Set and Retrieve Properties and Metadata #

## Overview

Objects in Azure Storage support system properties and user-defined metadata, in addition to the data they contain:

*   **System properties.** System properties exist on each storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure storage client library maintains these for you.  

*   **User-defined metadata.** User-defined metadata is metadata that you specify on a given resource, in the form of a name-value pair. You can use metadata to store additional values with a storage resource; these values are for your own purposes only and do not affect how the resource behaves.  

Retrieving property and metadata values for a storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling the **FetchAttributes** method.

> [AZURE.IMPORTANT] Property and metadata values for a storage resource are not populated unless you call one of the **FetchAttributes** methods. 

## Setting and Retrieving Properties

To retrieve property values, call the **FetchAttributes** method on your blob or container to populate the properties, then read the values.

To set properties on an object, specify the property value, then call the **SetProperties** method.

The following code example creates a container and writes some of its property values to a console window:

    //Parse the connection string for the storage account.
	const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key";
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
	
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

> [AZURE.NOTE] The name of your metadata must conform to the naming conventions for C# identifiers.
 
The following code example sets metadata on a container. One value is set using the collection's **Add** method. The other value is set using implicit key/value syntax. Both are valid.

    public static void AddContainerMetadata(CloudBlobContainer container)
    {
        //Add some metadata to the container.
        container.Metadata.Add("docType", "textDocuments");
        container.Metadata["category"] = "guidance";

        //Set the container's metadata.
        container.SetMetadata();
    }

To retrieve metadata, call the **FetchAttributes** method on your blob or container to populate the **Metadata** collection, then read the values, as shown in the example below.

    public static void ListContainerMetadata(CloudBlobContainer container)
    {
        //Fetch container attributes in order to populate the container's properties and metadata.
        container.FetchAttributes();

        //Enumerate the container's metadata.
        Console.WriteLine("Container metadata:");
        foreach (var metadataItem in container.Metadata)
        {
            Console.WriteLine("\tKey: {0}", metadataItem.Key);
            Console.WriteLine("\tValue: {0}", metadataItem.Value);
        }
    }

## See Also  

- [Azure Storage Client Library for .NET Reference](http://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx)
- [Azure Storage Client Library for .NET package](https://www.nuget.org/packages/WindowsAzure.Storage/) 
