<properties 
	pageTitle="Update Media Services after Rolling Storage Access Keys" 
	description="This articles give you guidance on how to update Media Services after rolling storage access keys." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako"
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="milangada;cenkdin;juliako"/>

#How To: Update Media Services after Rolling Storage Access Keys

When you create a new Azure Media Services account, you are also asked to select an Azure Storage account that is used to store your media content. Note that you can [add more than one storage accounts](meda-services-managing-multiple-storage-accounts.md) to your Media Services account.

When a new storage account is created, Azure generates two 512-bit storage access keys, which are used to authenticate access to your storage account. To keep your storage connections more secure, it is recommended to periodically regenerate and rotate your storage access key. Two access keys (primary and secondary) are provided in order to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. This procedure is also called "rolling access keys".

Media Services depends on a storage key provided to it. Specifically, the locators that are used to stream or download your assets depend on the specified storage access key. When an AMS account is created it takes a dependency on the primary storage access key by default but as a user you can update the storage key that AMS has. You must make sure to let Media Services know which key to use by following steps described in this topic. Also, when rolling storage access keys, you need to make sure to update your locators so there will no interruption in your streaming service (this step is also described in the topic).

>[AZURE.NOTE]If you have multiple storage accounts, you would perform this procedure with each storage account.
>
>Before executing steps described in this topic on a production account, make sure to test them on a pre-production account.


## Step 1: Regenerate secondary storage access key

Start with regenerating secondary storage key. By default, the secondary key is not used by Media Services.  For information on how to roll storage keys, see [How to: View, copy, and regenerate storage access keys](../storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).
  
##<a id="step2"></a>Step 2:  Update Media Services to use the new secondary storage key

Update Media Services to use the secondary storage access key. You can use one of the following two methods to synchronize the regenerated storage key with Media Services.

- Use the Azure Classic Portal: select your Media Service account, and click on the “MANAGE KEYS” icon on the bottom of the portal window. Depending on which storage key you want for the Media Services to synchronize with, select the synchronize primary key or synchronize secondary key button. In this case, use the secondary key.

- Use Media Services management REST API.

The following code example shows how to construct the https://endpoint/*subscriptionId*/services/mediaservices/Accounts/*accountName*/StorageAccounts/*storageAccountName*/Key request in order to synchronize the specified storage key with Media Services. In this case, the secondary storage key value is used. For more information, see [How to: Use Media Services Management REST API](http://msdn.microsoft.com/library/azure/dn167656.aspx).
 
	public void UpdateMediaServicesWithStorageAccountKey(string mediaServicesAccount, string storageAccountName, string storageAccountKey)
	{
	    var clientCert = GetCertificate(CertThumbprint);
	
	    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(string.Format("{0}/{1}/services/mediaservices/Accounts/{2}/StorageAccounts/{3}/Key",
	        Endpoint, SubscriptionId, mediaServicesAccount, storageAccountName));
	    request.Method = "PUT";
	    request.ContentType = "application/json; charset=utf-8";
	    request.Headers.Add("x-ms-version", "2011-10-01");
	    request.Headers.Add("Accept-Encoding: gzip, deflate");
	    request.ClientCertificates.Add(clientCert);
	
	
	    using (var streamWriter = new StreamWriter(request.GetRequestStream()))
	    {
	        streamWriter.Write("\"");
	        streamWriter.Write(storageAccountKey);
	        streamWriter.Write("\"");
	        streamWriter.Flush();
	    }
	
	    using (var response = (HttpWebResponse)request.GetResponse())
	    {
	        string jsonResponse;
	        Stream receiveStream = response.GetResponseStream();
	        Encoding encode = Encoding.GetEncoding("utf-8");
	        if (receiveStream != null)
	        {
	            var readStream = new StreamReader(receiveStream, encode);
	            jsonResponse = readStream.ReadToEnd();
	        }
	    }
	}

After this step, update existing locators (that have dependency on the old storage key) as shown in the following step.

>[AZURE.NOTE]Wait for 30 minutes before performing any operations with Media Services (for example, creating new locators) in order to prevent any impact on pending jobs.

##Step 3: Update locators 

>[AZURE.NOTE]When rolling storage access keys, you need to make sure to update your existing locators so there is no interruption in your streaming service. 

Wait at least 30 minutes after synchronizing the new storage key with AMS. Then, you can recreate your OnDemand locators so they take dependency on the specified storage key and maintain the existing URL.  

Note that when you update (or recreate) a SAS locator, the URL will always change. 

>[AZURE.NOTE] To make sure you preserve the existing URLs of your OnDemand locators, you need to delete the existing locator and create a new one with the same ID. 
 
The .NET example below shows how to recreate a locator with the same ID.
	
	private static ILocator RecreateLocator(CloudMediaContext context, ILocator locator)
	{
	    // Save properties of existing locator.
	    var asset = locator.Asset;
	    var accessPolicy = locator.AccessPolicy;
	    var locatorId = locator.Id;
	    var startDate = locator.StartTime;
	    var locatorType = locator.Type;
	    var locatorName = locator.Name;
	
	    // Delete old locator.
	    locator.Delete();
	
	    if (locator.ExpirationDateTime <= DateTime.UtcNow)
	    {
	        throw new Exception(String.Format(
	            "Cannot recreate locator Id={0} because its locator expiration time is in the past",
	            locator.Id));
	    }
	
	    // Create new locator using saved properties.
	    var newLocator = context.Locators.CreateLocator(
	        locatorId,
	        locatorType,
	        asset,
	        accessPolicy,
	        startDate,
	        locatorName);
	
	
	
	    return newLocator;
	}


##Step 5: Regenerate  primary storage access key

Regenerate the primary storage access key. For information on how to roll storage keys, see [How to: View, copy, and regenerate storage access keys](../storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).

##Step 6: Update Media Services to use the new primary storage key
	
Use the same procedure as described in [step 2](media-services-roll-storage-access-keys.md#step2) only this time synchronize the new primary storage  access key with the Media Services account.

>[AZURE.NOTE]Wait for 30 minutes before performing any operations with Media Services (for example, creating new locators) in order to prevent any impact on pending jobs.

##Step 7: Update locators  

After 30 minutes you can recreate your OnDemand locators so they take dependency on the new primary storage key and maintain the existing URL.

Use the same procedure as described in [step 3](media-services-roll-storage-access-keys.md#step-3-update-locators).


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]



###Acknowledgments 

We would like to acknowledge the following people who contributed towards creating this document: Cenk Dingiloglu, Milan Gada, Seva Titov.
