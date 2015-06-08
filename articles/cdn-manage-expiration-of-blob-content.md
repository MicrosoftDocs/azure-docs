<properties 
 pageTitle="How to Manage Expiration of Blob Content in the Azure Content Delivery Network (CDN)" 
 description="" 
 services="cdn" 
 documentationCenter=".NET" 
 authors="zhangmanling" 
 manager="dwrede" 
 editor=""/>
<tags 
 ms.service="cdn" 
 ms.workload="media" 
 ms.tgt_pltfrm="na" 
 ms.devlang="dotnet" 
 ms.topic="article" 
 ms.date="04/25/2015" 
 ms.author="mazha"/>


#How to Manage Expiration of Blob Content in the Azure Content Delivery Network (CDN)  

Blobs that benefit the most from Azure CDN caching are those that are accessed frequently during their time-to-live (TTL) period. A blob stays in the cache for the TTL period and then is refreshed by the blob service after that time is elapsed. Then the process repeats.  

You have two options for controlling the TTL.  

1.	Do not set cache values thus using the default TTL of 7 days. 
2.	Explicitly set the *x-ms-blob-cache-control* property on a **Put Blob**, **Put Block List**, or **Set Blob Properties** request, or use the Azure Managed Library to set the [BlobProperties.CacheControl](http://msdn.microsoft.com/library/microsoft.windowsazure.storageclient.blobproperties.cachecontrol.aspx) property. Setting this property sets the value of the *Cache-Control* header for the blob. The value of the header or property should specify the appropriate value in seconds. For example, to set the maximum caching period to one year, you can specify the request header as `x-ms-blob-cache-control: public, max-age=31556926`. For details on setting caching headers, see the [HTTP/1.1 specification](http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html).  

Any content that you wish to cache via the CDN must be stored in your Azure storage account as a publicly accessible blob. For more details on the Azure Blob service, see **Blob Service Concepts**.  

There are a few different ways that you can work with content in the Blob service:  

-	By using the managed API provided by the **Azure Managed Library Reference**.
-	By using a third-party storage management tool.
-	By using the Azure Storage Services REST API.  

The following code example is a console application that uses the Azure Managed Library to create a container, set its permissions for public access, and create a blob within the container. It also explicitly specifies a desired refresh interval by setting the Cache-Control header on the blob.   

Assuming you have enabled the CDN as shown above, the blob that is created will be cached by the CDN. Be sure to specify your account credentials using your own storage account and access key:  

	using System;
	using Microsoft.WindowsAzure;
	using Microsoft.WindowsAzure.StorageClient;
	
	namespace BlobsInCDN
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            //Specify storage credentials.
	            StorageCredentialsAccountAndKey credentials = new StorageCredentialsAccountAndKey("storagesample",
	                "m4AHAkXjfhlt2rE2BN/hcUR4U2lkGdCmj2/1ISutZKl+OqlrZN98Mhzq/U2AHYJT992tLmrkFW+mQgw9loIVCg==");
	            
	            //Create a reference to your storage account, passing in your credentials.
	            CloudStorageAccount storageAccount = new CloudStorageAccount(credentials, true);
	            
	            //Create a new client object, which will provide access to Blob service resources.
	            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
	
	            //Create a new container.
	            CloudBlobContainer container = blobClient.GetContainerReference("cdncontent");
	            container.CreateIfNotExist();
	
	            //Specify that the container is publicly accessible.
	            BlobContainerPermissions containerAccess = new BlobContainerPermissions();
	            containerAccess.PublicAccess = BlobContainerPublicAccessType.Container;
	            container.SetPermissions(containerAccess);
	
	            //Create a new blob and write some text to it.
	            CloudBlob blob = blobClient.GetBlobReference("cdncontent/testblob.txt");
	            blob.UploadText("This is a test blob.");
	
	            //Set the Cache-Control header on the blob to specify your desired refresh interval.
	            blob.SetCacheControl("public, max-age=31536000");
	        }
	    }
	
	    public static class BlobExtensions
	    {
	        //A convenience method to set the Cache-Control header.
	        public static void SetCacheControl(this CloudBlob blob, string value)
	        {
	            blob.Properties.CacheControl = value;
	            blob.SetProperties();
	        }
	    }
	}

Test that your blob is available via the CDN-specific URL. For the blob shown above, the URL would be similar to the following:  

	http://az1234.vo.msecnd.net/cdncontent/testblob.txt  

If desired, you can use a tool like **wget** or Fiddler to examine the details of the request and response.

##See Also

[How to Manage Expiration of Cloud Service Content in the Azure Content Delivery Network (CDN)](./cdn-manage-expiration-of-cloud-service-content.md
)