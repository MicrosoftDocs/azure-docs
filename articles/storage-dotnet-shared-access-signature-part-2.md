<properties 
	pageTitle="Create and use a SAS with the Blob Service | Microsoft Azure" 
	description="Explore generating and using shared access signatures with the Blob service" 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor="cgronlun"/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/06/2015" 
	ms.author="tamram"/>


# Shared Access Signatures, Part 2: Create and Use a SAS with the Blob Service

## Overview

[Part 1](storage-dotnet-shared-access-signature-part-1.md) of this tutorial explored shared access signatures (SAS) and explained best practices for using them. Part 2 shows you how to generate and then use shared access signatures with the Azure Blob service. The examples are written in C# and use the Azure Storage Client Library for .NET. The scenarios covered include these aspects of working with shared access signatures:

- Generating a shared access signature on a container
- Generating a shared access signature on a blob
- Creating a stored access policy to manage signatures on a container's resources
- Testing the shared access signatures from a client application

## About this Tutorial
In this tutorial, we'll focus on creating shared access signatures for containers and blobs by creating two console applications. The first console application generates shared access signatures on a container and on a blob. This application has knowledge of the storage account keys. The second console application, which will act as a client application, accesses container and blob resources using the shared access signatures created with the first application. This application uses the shared access signatures only to authenticate its access to the container and blob resources - it does not have knowledge of the account keys.

## Part 1: Create a Console Application to Generate Shared Access Signatures

First, ensure that you have the Azure Storage Client Library for .NET installed. You can install the [NuGet package](http://nuget.org/packages/WindowsAzure.Storage/ "NuGet package") containing the most up-to-date assemblies for the client library; this is the recommended method for ensuring that you have the most recent fixes. You can also download the client library as part of the most recent version of the [Azure SDK for .NET](http://azure.microsoft.com/downloads/).

In Visual Studio, create a new Windows console application and name it **GenerateSharedAccessSignatures**. Add references to  **Microsoft.WindowsAzure.Configuration.dll** and **Microsoft.WindowsAzure.Storage.dll**, using either of the following approaches:

- 	If you want to install the NuGet package, first install the [NuGet Package Manager Extension for Visual Studio](http://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c). In Visual Studio, select **Project | Manage NuGet Packages**, search online for **Azure Storage**, and follow the instructions to install.
- 	Alternatively, locate the assemblies in your installation of the Azure SDK and add references to them.
 
At the top of the Program.cs file, add the following **using** statements:

    using System.IO;    
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;

Edit the app.config file so that it contains a configuration setting with a connection string that points to your storage account. Your app.config file should look similar to this one:

    <configuration>
      <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
      </startup>
      <appSettings>
        <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey"/>
      </appSettings> 
    </configuration>

### Generate a Shared Access Signature URI for a Container

To begin with, we'll add a method to generate a shared access signature on a new container. In this case the signature is not associated with a stored access policy, so it carries on the URI the information indicating its expiry time and the permissions that it grants.

First, add code to the **Main()** method to authenticate access to your storage account and create a new container:

    static void Main(string[] args)
    {
	    //Parse the connection string and return a reference to the storage account.
	    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));
	    
	    //Create the blob client object.
	    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
	    
	    //Get a reference to a container to use for the sample code, and create it if it does not exist.
	    CloudBlobContainer container = blobClient.GetContainerReference("sascontainer");
	    container.CreateIfNotExists();
	    
	    //Insert calls to the methods created below here...
	    
	    //Require user input before closing the console window.
	    Console.ReadLine();
    }

Next, add a new method that generates the shared access signature for the container and returns the signature URI:

    static string GetContainerSasUri(CloudBlobContainer container)
    {
	    //Set the expiry time and permissions for the container.
	    //In this case no start time is specified, so the shared access signature becomes valid immediately.
	    SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
	    sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(4);
	    sasConstraints.Permissions = SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List;
	    
	    //Generate the shared access signature on the container, setting the constraints directly on the signature.
	    string sasContainerToken = container.GetSharedAccessSignature(sasConstraints);
	    
	    //Return the URI string for the container, including the SAS token.
	    return container.Uri + sasContainerToken;
    }

Add the following lines at the bottom of the **Main()** method, before the call to **Console.ReadLine()**, to call **GetContainerSasUri()** and write the signature URI to the console window:

    //Generate a SAS URI for the container, without a stored access policy.
    Console.WriteLine("Container SAS URI: " + GetContainerSasUri(container));
    Console.WriteLine();

Compile and run to output the shared access signature URI for the new container. The URI will be similar to the following URI:       

https://storageaccount.blob.core.windows.net/sascontainer?sv=2012-02-12&se=2013-04-13T00%3A12%3A08Z&sr=c&sp=wl&sig=t%2BbzU9%2B7ry4okULN9S0wst%2F8MCUhTjrHyV9rDNLSe8g%3D

Once you have run the code, the shared access signature that you created on the container will be valid for the next four hours. The signature grants a client permission to list blobs in the container and to write a new blob to the container.

### Generate a Shared Access Signature URI for a Blob

Next, we'll write similar code to create a new blob within the container and generate a shared access signature for it. This shared access signature is not associated with a stored access policy, so it includes the start time, expiry time, and permission information on the URI.

Add a new method that creates a new blob and write some text to it, then generates a shared access signature and returns the signature URI:

    static string GetBlobSasUri(CloudBlobContainer container)
    {
	    //Get a reference to a blob within the container.
	    CloudBlockBlob blob = container.GetBlockBlobReference("sasblob.txt");
	    
	    //Upload text to the blob. If the blob does not yet exist, it will be created. 
	    //If the blob does exist, its existing content will be overwritten.
	    string blobContent = "This blob will be accessible to clients via a Shared Access Signature.";
	    MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(blobContent));
	    ms.Position = 0;
	    using (ms)
	    {
		    blob.UploadFromStream(ms);
	    }
	    
	    //Set the expiry time and permissions for the blob.
	    //In this case the start time is specified as a few minutes in the past, to mitigate clock skew.
	    //The shared access signature will be valid immediately.
	    SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
	    sasConstraints.SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-5);
	    sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(4);
	    sasConstraints.Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.Write;
	    
	    //Generate the shared access signature on the blob, setting the constraints directly on the signature.
	    string sasBlobToken = blob.GetSharedAccessSignature(sasConstraints);
	    
	    //Return the URI string for the container, including the SAS token.
	    return blob.Uri + sasBlobToken;
    }

At the bottom of the **Main()** method, add the following lines to call **GetBlobSasUri()**, before the call to **Console.ReadLine()**, and write the shared access signature URI to the console window:    
    
    //Generate a SAS URI for a blob within the container, without a stored access policy.
    Console.WriteLine("Blob SAS URI: " + GetBlobSasUri(container));
    Console.WriteLine();
    

Compile and run to output the shared access signature URI for the new blob. The URI will be similar to the following URI:

https://storageaccount.blob.core.windows.net/sascontainer/sasblob.txt?sv=2012-02-12&st=2013-04-12T23%3A37%3A08Z&se=2013-04-13T00%3A12%3A08Z&sr=b&sp=rw&sig=dF2064yHtc8RusQLvkQFPItYdeOz3zR8zHsDMBi4S30%3D

### Create a Stored Access Policy on the Container

Now let's create a stored access policy on the container, which will define the constraints for any shared access signatures that are associated with it.

In the previous examples, we specified the start time (implicitly or explicitly), the expiry time, and the permissions on the shared access signature URI itself. In the following examples, we will specify these on the stored access policy and not on the shared access signature. Doing so enables us to change these constraints without reissuing the shared access signature.

Note that it's possible to have one or more of the constraints on the shared access signature and the remainder on the stored access policy. However, you can only specify the start time, expiry time, and permissions in one place or the other; for example, you can't specify permissions on the shared access signature and also specify them on the stored access policy.

Add a new method that creates a new stored access policy and returns the name of the policy:

    static void CreateSharedAccessPolicy(CloudBlobClient blobClient, CloudBlobContainer container, string policyName)
    {
	    //Create a new stored access policy and define its constraints.
	    SharedAccessBlobPolicy sharedPolicy = new SharedAccessBlobPolicy()
	    {
		    SharedAccessExpiryTime = DateTime.UtcNow.AddHours(10),
		    Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List
	    };
	    
	    //Get the container's existing permissions.
	    BlobContainerPermissions permissions = new BlobContainerPermissions();
	    
	    //Add the new policy to the container's permissions.
	    permissions.SharedAccessPolicies.Clear();
	    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
	    container.SetPermissions(permissions);
    }

At the bottom of the **Main()** method, before the call to **Console.ReadLine()**, add the following lines to call the **CreateSharedAccessPolicy()** method:    

    //Create an access policy on the container, which may be optionally used to provide constraints for 
    //shared access signatures on the container and the blob.
    string sharedAccessPolicyName = "tutorialpolicy";
    CreateSharedAccessPolicy(blobClient, container, sharedAccessPolicyName);

### Generate a Shared Access Signature URI on the Container That Uses an Access Policy

Next, we'll create another shared access signature on the container that we created earlier, but this time we'll associate the signature with the access policy that we created in the previous example.

Add a new method to generate another shared access signature on the container:

    static string GetContainerSasUriWithPolicy(CloudBlobContainer container, string policyName)
    {
	    //Generate the shared access signature on the container. In this case, all of the constraints for the 
	    //shared access signature are specified on the stored access policy.
	    string sasContainerToken = container.GetSharedAccessSignature(null, policyName);
	    
	    //Return the URI string for the container, including the SAS token.
	    return container.Uri + sasContainerToken;
    }
    
At the bottom of the **Main()** method, before the call to **Console.ReadLine()**, add the following lines to call the **GetContainerSasUriWithPolicy** method:

    //Generate a SAS URI for the container, using a stored access policy to set constraints on the SAS.
    Console.WriteLine("Container SAS URI using stored access policy: " + GetContainerSasUriWithPolicy(container, sharedAccessPolicyName));
    Console.WriteLine();

### Generate a Shared Access Signature URI on the Blob That Uses an Access Policy

Finally, we'll add a similar method to create another blob and generate a shared access signature that's associated with an access policy.

Add a new method to create a blob and generate a shared access signature:

    static string GetBlobSasUriWithPolicy(CloudBlobContainer container, string policyName)
    {
	    //Get a reference to a blob within the container.
	    CloudBlockBlob blob = container.GetBlockBlobReference("sasblobpolicy.txt");
	    
	    //Upload text to the blob. If the blob does not yet exist, it will be created. 
	    //If the blob does exist, its existing content will be overwritten.
	    string blobContent = "This blob will be accessible to clients via a shared access signature. " + 
	    "A stored access policy defines the constraints for the signature.";
	    MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(blobContent));
	    ms.Position = 0;
	    using (ms)
	    {
		    blob.UploadFromStream(ms);
	    }
	    
	    //Generate the shared access signature on the blob.
	    string sasBlobToken = blob.GetSharedAccessSignature(null, policyName);
	    
	    //Return the URI string for the container, including the SAS token.
	    return blob.Uri + sasBlobToken;
    }

At the bottom of the **Main()** method, before the call to **Console.ReadLine()**, add the following lines to call the **GetBlobSasUriWithPolicy** method:    

    //Generate a SAS URI for a blob within the container, using a stored access policy to set constraints on the SAS.
    Console.WriteLine("Blob SAS URI using stored access policy: " + GetBlobSasUriWithPolicy(container, sharedAccessPolicyName));
    Console.WriteLine();

The **Main()** method should now look like this in its entirety. Run it to write the shared access signature URIs to the console window, then copy and paste them into a text file for use in the second part of this tutorial.    

    static void Main(string[] args)
    {
	    //Parse the connection string and return a reference to the storage account.
	    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));
	    
	    //Create the blob client object.
	    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
	    
	    //Get a reference to a container to use for the sample code, and create it if it does not exist.
	    CloudBlobContainer container = blobClient.GetContainerReference("sascontainer");
	    container.CreateIfNotExists();
	    
	    //Generate a SAS URI for the container, without a stored access policy.
	    Console.WriteLine("Container SAS URI: " + GetContainerSasUri(container));
	    Console.WriteLine();
	    
	    //Generate a SAS URI for a blob within the container, without a stored access policy.
	    Console.WriteLine("Blob SAS URI: " + GetBlobSasUri(container));
	    Console.WriteLine();
	    
	    //Create an access policy on the container, which may be optionally used to provide constraints for 
	    //shared access signatures on the container and the blob.
	    string sharedAccessPolicyName = "tutorialpolicy";
	    CreateSharedAccessPolicy(blobClient, container, sharedAccessPolicyName);
	    
	    //Generate a SAS URI for the container, using a stored access policy to set constraints on the SAS.
	    Console.WriteLine("Container SAS URI using stored access policy: " + GetContainerSasUriWithPolicy(container, sharedAccessPolicyName));
	    Console.WriteLine();
	    
	    //Generate a SAS URI for a blob within the container, using a stored access policy to set constraints on the SAS.
	    Console.WriteLine("Blob SAS URI using stored access policy: " + GetBlobSasUriWithPolicy(container, sharedAccessPolicyName));
	    Console.WriteLine();
	    
	    Console.ReadLine();
    }

When you run the GenerateSharedAccessSignatures console application, you'll see output similar to the following in the console window. These are the shared access signatures that you'll use in Part 2 of the tutorial.

![sas-console-output-1][sas-console-output-1]

## Part 2: Create a Console Application to Test the Shared Access Signatures

To test the shared access signatures created in the previous examples, we'll create a second console application that uses the signatures to perform operations on the container and on a blob.

Note that if more than four hours have passed since you completed the first part of the tutorial, the signatures you generated where the expiry time was set to four hours will no longer be valid. Similarly, the signatures associated with the stored access policy expire after 10 hours. If one or both of these intervals have passed, you should run the code in the first console application to generate fresh shared access signatures for use in the second part of the tutorial.

In Visual Studio, create a new Windows console application and name it **ConsumeSharedAccessSignatures**. Add references to **Microsoft.WindowsAzure.Configuration.dll** and **Microsoft.WindowsAzure.Storage.dll**, as you did previously.

At the top of the Program.cs file, add the following **using** statements:

    using System.IO;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    
In the body of the **Main()** method, add the following constants, and update their values to the shared access signatures that you generated in part 1 of the tutorial.

    static void Main(string[] args)
    {
	    string containerSAS = "<your container SAS>";
	    string blobSAS = "<your blob SAS>";
	    string containerSASWithAccessPolicy = "<your container SAS with access policy>";
	    string blobSASWithAccessPolicy = "<your blob SAS with access policy>";
    }
    
### Add a Method to Try Container Operations Using a Shared Access Signature

Next, we'll add a method that tests some representative container operations using a shared access signature on the container. Note that the shared access signature is used to return a reference to the container, authenticating access to the container based on the signature alone.

Add the following method to Program.cs:


	static void UseContainerSAS(string sas)
	{
	    //Try performing container operations with the SAS provided.
	
	    //Return a reference to the container using the SAS URI.
	    CloudBlobContainer container = new CloudBlobContainer(new Uri(sas));
	
	    //Create a list to store blob URIs returned by a listing operation on the container.
	    List<Uri> blobUris = new List<Uri>();
	
	    try
	    {
	        //Write operation: write a new blob to the container. 
	        CloudBlockBlob blob = container.GetBlockBlobReference("blobCreatedViaSAS.txt");
	        string blobContent = "This blob was created with a shared access signature granting write permissions to the container. ";
	        MemoryStream msWrite = new MemoryStream(Encoding.UTF8.GetBytes(blobContent));
	        msWrite.Position = 0;
	        using (msWrite)
	        {
	            blob.UploadFromStream(msWrite);
	        }
	        Console.WriteLine("Write operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Write operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }
	
	    try
	    {
	        //List operation: List the blobs in the container, including the one just added.
	        foreach (ICloudBlob blobListing in container.ListBlobs())
	        {
	            blobUris.Add(blobListing.Uri);
	        }
	        Console.WriteLine("List operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("List operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }
	
	    try
	    {
	        //Read operation: Get a reference to one of the blobs in the container and read it. 
	        CloudBlockBlob blob = container.GetBlockBlobReference(blobUris[0].ToString());
	        MemoryStream msRead = new MemoryStream();
	        msRead.Position = 0;
	        using (msRead)
	        {
	            blob.DownloadToStream(msRead);
	            Console.WriteLine(msRead.Length);
	        }
	        Console.WriteLine("Read operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Read operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }
	    Console.WriteLine();
	
	    try
	    {
	        //Delete operation: Delete a blob in the container.
	        CloudBlockBlob blob = container.GetBlockBlobReference(blobUris[0].ToString());
	        blob.Delete();
	        Console.WriteLine("Delete operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Delete operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }        
	}


Update the **Main()** method to call **UseContainerSAS()** with both of the shared access signatures that you created on the container:


	static void Main(string[] args)
	{
	    string containerSAS = "<your container SAS>";
	    string blobSAS = "<your blob SAS>";
	    string containerSASWithAccessPolicy = "<your container SAS with access policy>";
	    string blobSASWithAccessPolicy = "<your blob SAS with access policy>";
	
	    //Call the test methods with the shared access signatures created on the container, with and without the access policy.
	    UseContainerSAS(containerSAS);
	    UseContainerSAS(containerSASWithAccessPolicy); 
	    
	    //Call the test methods with the shared access signatures created on the blob, with and without the access policy.
	    UseBlobSAS(blobSAS);
	    UseBlobSAS(blobSASWithAccessPolicy);
	
	    Console.ReadLine();
	}


### Add a Method to Try Blob Operations Using a Shared Access Signature

Finally, we'll add a method that tests some representative blob operations using a shared access signature on the blob. In this case we use the constructor **CloudBlockBlob(String)**, passing in the shared access signature, to return a reference to the blob. No other authentication is required; it's based on the signature alone.

Add the following method to Program.cs:


	static void UseBlobSAS(string sas)
	{
	    //Try performing blob operations using the SAS provided.
	
	    //Return a reference to the blob using the SAS URI.
	    CloudBlockBlob blob = new CloudBlockBlob(new Uri(sas));
	
	    try
	    {
	        //Write operation: write a new blob to the container. 
	        string blobContent = "This blob was created with a shared access signature granting write permissions to the blob. ";
	        MemoryStream msWrite = new MemoryStream(Encoding.UTF8.GetBytes(blobContent));
	        msWrite.Position = 0;
	        using (msWrite)
	        {
	            blob.UploadFromStream(msWrite);
	        }
	        Console.WriteLine("Write operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Write operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }
	
	    try
	    {
	        //Read operation: Read the contents of the blob.
	        MemoryStream msRead = new MemoryStream();
	        using (msRead)
	        {
	            blob.DownloadToStream(msRead);
	            msRead.Position = 0;
	            using (StreamReader reader = new StreamReader(msRead, true))
	            {
	                string line;
	                while ((line = reader.ReadLine()) != null)
	                {
	                    Console.WriteLine(line);
	                }
	            }
	        }
	        Console.WriteLine("Read operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Read operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }
	
	    try
	    {
	        //Delete operation: Delete the blob.
	        blob.Delete();
	        Console.WriteLine("Delete operation succeeded for SAS " + sas);
	        Console.WriteLine();
	    }
	    catch (StorageException e)
	    {
	        Console.WriteLine("Delete operation failed for SAS " + sas);
	        Console.WriteLine("Additional error information: " + e.Message);
	        Console.WriteLine();
	    }        
	}


Update the **Main()** method to call **UseBlobSAS()** with both of the shared access signatures that you created on the blob:

	static void Main(string[] args)
	{
	    string containerSAS = "<your container SAS>";
	    string blobSAS = "<your blob SAS>";
	    string containerSASWithAccessPolicy = "<your container SAS with access policy>";
	    string blobSASWithAccessPolicy = "<your blob SAS with access policy>";
	
	    //Call the test methods with the shared access signatures created on the container, with and without the access policy.
	    UseContainerSAS(containerSAS);
	    UseContainerSAS(containerSASWithAccessPolicy); 
	    
	    //Call the test methods with the shared access signatures created on the blob, with and without the access policy.
	    UseBlobSAS(blobSAS);
	    UseBlobSAS(blobSASWithAccessPolicy);
	
	    Console.ReadLine();
	}

Run the console application and observe the output to see which operations are permitted for which signatures. The output in the console window will look similar to the following:

![sas-console-output-2][sas-console-output-2]

## Next Steps

[Shared Access Signatures, Part 1: Understanding the SAS Model](../storage-dotnet-shared-access-signature-part-1/)

[Manage Access to Azure Storage Resources](http://msdn.microsoft.com/library/azure/ee393343.aspx)

[Delegating Access with a Shared Access Signature (REST API)](http://msdn.microsoft.com/library/azure/ee395415.aspx)

[Introducing Table and Queue SAS](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-table-sas-shared-access-signature-queue-sas-and-update-to-blob-sas.aspx)

[sas-console-output-1]: ./media/storage-dotnet-shared-access-signature-part-2/sas-console-output-1.PNG
[sas-console-output-2]: ./media/storage-dotnet-shared-access-signature-part-2/sas-console-output-2.PNG

