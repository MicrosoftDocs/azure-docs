<properties
    pageTitle="How to use Azure Blob storage from iOS | Microsoft Azure"
	description="Store unstructured data in the cloud with Azure Blob storage (object storage)."
    services="storage"
    documentationCenter="ios"
    authors="micurd"
    manager="jahogg"/>

<tags
    ms.service="storage"
    ms.workload="storage"
    ms.tgt_pltfrm="na"
    ms.devlang="Objective-C"
    ms.topic="article"
    ms.date="07/27/2016"
    ms.author="micurd"/>

# How to use Blob storage from iOS

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]

## Overview

This article will show you how to perform common scenarios using Microsoft Azure Blob storage. The samples are written in Objective-C and use the [Azure Storage Client Library for iOS](https://github.com/Azure/azure-storage-ios). The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs. For more information on blobs, see the [Next Steps](#next-steps) section. You can also download the [sample app](https://github.com/Azure/azure-storage-ios/tree/master/BlobSample) to quickly see the use of Azure Storage in an iOS application.

[AZURE.INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Import the Azure Storage iOS library into your application

You can import the Azure Storage iOS library into your application either by using the [Azure Storage CocoaPod](https://cocoapods.org/pods/AZSClient) or by importing the **Framework** file.

## CocoaPod

1. If you haven't done so already, [Install CocoaPods](https://guides.cocoapods.org/using/getting-started.html#toc_3) on your computer by opening a terminal window and running the following command

        sudo gem install cocoapods

2. Next, in the project directory (the directory containing your `.xcodeproj` file), create a new file called `Podfile`(no file extension). Add the following to `Podfile` and save

        pod 'AZSClient'

3. In the terminal window, navigate to the project directory and run the following command

        pod install

4. If your `.xcodeproj` is open in Xcode, close it. In your project directory open the newly created project file which will have the `.xcworkspace` extension. This is the file you'll work from for now on.

## Framework
In order to use the Azure Storage iOS library, you will first need to build the framework file.

1. First, download or clone the [azure-storage-ios repo](https://github.com/azure/azure-storage-ios).

2. Go into *azure-storage-ios* -> *Lib* -> *Azure Storage Client Library*, and open `AZSClient.xcodeproj` in Xcode.

3. At the top-left of Xcode, change the active scheme from "Azure Storage Client Library" to "Framework".

4. Build the project (⌘+B). This will create a `AZSClient.framework` file on your Desktop.

You can then import the framework file into your application by doing the following:

1. Create a new project or open up your existing project in Xcode.

2. Click on your project in the left-hand navigation and click the *General* tab at the top of the project editor.

3. Under the *Linked Frameworks and Libraries* section, click the Add button (+).

4. Click *Add Other...*. Navigate to and add the `AZSClient.framework` file you just created.

5. Under the *Linked Frameworks and Libraries* section, click the Add button (+) again.

6. In the list of libraries already provided, search for `libxml2.2.dylib` and add it to your project.

7. Click the *Build Settings* tab at the top of the project editor.

8. Under the *Search Paths* section, double-click *Framework Search Paths* and add the path to your `AZSClient.framework` file.

## Import Statement
You will need to include the following import statement in the file where you want to invoke the Azure Storage API.

    // Include the following import statement to use blob APIs.
    #import <AZSClient/AZSClient.h>

## Configure your application to access Blob storage

There are two ways to authenticate your application to access Storage services:

- Shared Key: Use Shared Key for testing purposes only
- Shared Access Signature (SAS): Use SAS for production applications

### Shared Key
Shared Key authentication means that your application will use your account name and account key to access Storage services. For the purposes of quickly showing how to use Blob Storage from iOS, we will be using Shared Key authentication in this getting started.

> [AZURE.WARNING (Only use Shared Key authentication for testing purposes!) ] Your account name and account key, which give full read/write access to the associated Storage account, will be distributed to every person that downloads your app. This is **not** good practice as you risk having your key compromised by untrusted clients.

When using Shared Key authentication, you will create a connection string. The connection string is comprised of:  

- The **DefaultEndpointsProtocol** - you can choose HTTP or HTTPS. However, using HTTPS is highly recommended.
- The **Account Name** - the name of your storage account
- The **Account Key** - If you're using the [Azure Portal](https://portal.azure.com), navigate to your storage account and click the **Keys** icon to find this information. If using the [Azure Classic Portal](https://manage.windowsazure.com), navigate to your storage account in the portal and click **Manage Access Keys**.

Here is how it will look in your application:

    // Create a storage account object from a connection string.
    AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

### Shared Access Signatures (SAS)
For an iOS application, the recommended method for authenticating a request by a client against Blob storage is by using a Shared Access Signature (SAS). SAS allows you to grant a client access to a resource for a specified period of time, with a specified set of permissions.
As the storage account owner, you'll need to generate a SAS for your iOS clients to consume. To generate the SAS, you'll probably want to write a separate service that generates the SAS to be distributed to your clients. For testing purposes, you can use the Microsoft Azure Storage Explorer to generate a SAS. When you create the SAS, you can specify the time interval over which the SAS is valid, and the permissions that the SAS grants to the client.

The following example shows how to use the Microsoft Azure Storage Explorer to generate a SAS.

1. If you haven't already, [Install the Microsoft Azure Storage Explorer](http://storageexplorer.com)

2. Connect to your subscription.

3. Click on your Storage account and click on the "Actions" tab at the bottom left. Click "Get Shared Access Signature" to generate a "connection string" for your SAS.

4. Here is an example of a SAS connection string that grants read and write permissions at the service, container and object level for the blob service of the Storage account.

    SharedAccessSignature=sv=2015-04-05&ss=b&srt=sco&sp=rw&se=2016-07-21T18%3A00%3A00Z&sig=3ABdLOJZosCp0o491T%2BqZGKIhafF1nlM3MzESDDD3Gg%3D;BlobEndpoint=https://youraccount.blob.core.windows.net

6. In your iOS application, you can now get a reference to your account by using the connection string in the following manner:

		// Get a reference to your Storage account
    	AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"SharedAccessSignature=sv=2015-04-05&ss=b&srt=sco&sp=rw&se=2016-07-21T18%3A00%3A00Z&sig=3ABdLOJZosCp0o491T%2BqZGKIhafF1nlM3MzESDDD3Gg%3D;BlobEndpoint=https://youraccount.blob.core.windows.net" error:&accountCreationError];

As you can see, when using a SAS, you’re not exposing your account name and account key in your iOS application. You can learn more about SAS by checking out [Shared Access Signatures: Understanding the SAS model](storage-dotnet-shared-access-signature-part-1.md).

## Asynchronous Operations
> [AZURE.NOTE] All methods that perform a request against the service are asynchronous operations. In the code samples, you’ll find that these methods have a completion handler. Code inside the completion handler will run **after** the request is completed. Code after the completion handler will run **while** the request is being made.

## Create a container
Every blob in Azure Storage must reside in a container. The following example shows how to create a container, called *newcontainer*, in your Storage account if it doesn't already exist. When choosing a name for your container, be mindful of the naming rules mentioned above.

    -(void)createContainer{
      NSError *accountCreationError;

      // Create a storage account object from a connection string.
      AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

      if(accountCreationError){
         NSLog(@"Error in creating account.");
      }

      // Create a blob service client object.
      AZSCloudBlobClient *blobClient = [account getBlobClient];

      // Create a local container object.
      AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"newcontainer"];

      // Create container in your Storage account if the container doesn't already exist
      [blobContainer createContainerIfNotExistsWithCompletionHandler:^(NSError *error, BOOL exists) {
         if (error){
             NSLog(@"Error in creating container.");
         }
      }];
    }

You can confirm that this works by looking at the [Microsoft Azure Storage Explorer](http://storageexplorer.com) and verifying that *newcontainer* is in the list of containers for your Storage account.

## Set Container Permissions
A container's permissions are configured for **Private** access by default. However, containers provide a few different options for container access:

- **Private**: Container and blob data can be read by the account owner only.

- **Blob**: Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request.

- **Container**: Container and blob data can be read via anonymous request. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.

The following example shows you how to create a container with **Container** access permissions which will allow public, read-only access for all users on the Internet:

    -(void)createContainerWithPublicAccess{
        NSError *accountCreationError;

        // Create a storage account object from a connection string.
        AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

        if(accountCreationError){
            NSLog(@"Error in creating account.");
        }

        // Create a blob service client object.
        AZSCloudBlobClient *blobClient = [account getBlobClient];

        // Create a local container object.
        AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

        // Create container in your Storage account if the container doesn't already exist
        [blobContainer createContainerIfNotExistsWithAccessType:AZSContainerPublicAccessTypeContainer requestOptions:nil operationContext:nil completionHandler:^(NSError *error, BOOL exists){
            if (error){
                NSLog(@"Error in creating container.");
            }
        }];
    }

## Upload a blob into a container
As mentioned in the [Blob service concepts](#blob-service-concepts) section, Blob Storage offers three different types of blobs: block blobs, append blobs, and page blobs. At this moment, the Azure Storage iOS library only supports block blobs. In the majority of cases, block blob is the recommended type to use.

The following example shows how to upload a block blob from an NSString. If a blob with the same name already exists in this container, the contents of this blob will be overwritten.

    -(void)uploadBlobToContainer{
        NSError *accountCreationError;

        // Create a storage account object from a connection string.
        AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

        if(accountCreationError){
            NSLog(@"Error in creating account.");
        }

        // Create a blob service client object.
        AZSCloudBlobClient *blobClient = [account getBlobClient];

        // Create a local container object.
        AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

        [blobContainer createContainerIfNotExistsWithAccessType:AZSContainerPublicAccessTypeContainer requestOptions:nil operationContext:nil completionHandler:^(NSError *error, BOOL exists)
         {
             if (error){
                 NSLog(@"Error in creating container.");
             }
             else{
                 // Create a local blob object
                 AZSCloudBlockBlob *blockBlob = [blobContainer blockBlobReferenceFromName:@"sampleblob"];

                 // Upload blob to Storage
                 [blockBlob uploadFromText:@"This text will be uploaded to Blob Storage." completionHandler:^(NSError *error) {
                     if (error){
                         NSLog(@"Error in creating blob.");
                     }
                 }];
             }
         }];
    }

You can confirm that this works by looking at the [Microsoft Azure Storage Explorer](http://storageexplorer.com) and verifying that the container, *containerpublic*, contains the blob, *sampleblob*. In this sample, we used a public container so you can also verify that this worked by going to the blobs URI:

    https://nameofyourstorageaccount.blob.core.windows.net/containerpublic/sampleblob

In addition to uploading a block blob from an NSString, similar methods exist for NSData, NSInputStream or a local file.

## List the blobs in a container
The following example shows how to list all blobs in a container. When performing this operation, be mindful of the following parameters:     

- **continuationToken** - The continuation token represents where the listing operation should start. If no token is provided, it will list blobs from the beginning. Any number of blobs can be listed, from zero up to a set maximum. Even if this method returns zero results, if `results.continuationToken` is not nil, there may be more blobs on the service that have not been listed.
- **prefix** - You can specify the prefix to use for blob listing. Only blobs that begin with this prefix will be listed.
- **useFlatBlobListing** - As mentioned in the [Naming and referencing containers and blobs](#naming-and-referencing-containers-and-blobs) section, although the Blob service is a flat storage scheme, you can create a virtual hierarchy by naming blobs with path information. However, non-flat listing is currently not supported; this is coming soon. For now, this value should be `YES`
- **blobListingDetails** - You can specify which items to include when listing blobs
	- `AZSBlobListingDetailsNone`: List only committed blobs, and do not return blob metadata.
	- `AZSBlobListingDetailsSnapshots`: List committed blobs and blob snapshots.
	- `AZSBlobListingDetailsMetadata`: Retrieve blob metadata for each blob returned in the listing.
	- `AZSBlobListingDetailsUncommittedBlobs`: List committed and uncommitted blobs.
	- `AZSBlobListingDetailsCopy`: Include copy properties in the listing.
	- `AZSBlobListingDetailsAll`: List all available committed blobs, uncommitted blobs, and snapshots, and return all metadata and copy status for those blobs.
- **maxResults** - The maximum number of results to return for this operation. Use -1 to not set a limit.
- **completionHandler** - The block of code to execute with the results of the listing operation.

In this example, a helper method is used to recursively call the list blobs method every time a continuation token is returned.

    -(void)listBlobsInContainer{
        NSError *accountCreationError;

        // Create a storage account object from a connection string.
        AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

        if(accountCreationError){
            NSLog(@"Error in creating account.");
        }

        // Create a blob service client object.
        AZSCloudBlobClient *blobClient = [account getBlobClient];

        // Create a local container object.
        AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

        //List all blobs in container
        [self listBlobsInContainerHelper:blobContainer continuationToken:nil prefix:nil blobListingDetails:AZSBlobListingDetailsAll maxResults:-1 completionHandler:^(NSError *error) {
            if (error != nil){
                NSLog(@"Error in creating container.");
            }
        }];
    }

    //List blobs helper method
    -(void)listBlobsInContainerHelper:(AZSCloudBlobContainer *)container continuationToken:(AZSContinuationToken *)continuationToken prefix:(NSString *)prefix blobListingDetails:(AZSBlobListingDetails)blobListingDetails maxResults:(NSUInteger)maxResults completionHandler:(void (^)(NSError *))completionHandler
    {
        [container listBlobsSegmentedWithContinuationToken:continuationToken prefix:prefix useFlatBlobListing:YES blobListingDetails:blobListingDetails maxResults:maxResults completionHandler:^(NSError *error, AZSBlobResultSegment *results) {
            if (error)
            {
                completionHandler(error);
            }
            else
            {
                for (int i = 0; i < results.blobs.count; i++) {
                    NSLog(@"%@",[(AZSCloudBlockBlob *)results.blobs[i] blobName]);
                }
                if (results.continuationToken)
                {
                    [self listBlobsInContainerHelper:container continuationToken:results.continuationToken prefix:prefix blobListingDetails:blobListingDetails maxResults:maxResults completionHandler:completionHandler];
                }
                else
                {
                    completionHandler(nil);
                }
            }
        }];
    }


## Download a blob

The following example shows how to download a blob to a NSString object.

    -(void)downloadBlobToString{
        NSError *accountCreationError;

        // Create a storage account object from a connection string.
        AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

        if(accountCreationError){
            NSLog(@"Error in creating account.");
        }

        // Create a blob service client object.
        AZSCloudBlobClient *blobClient = [account getBlobClient];

        // Create a local container object.
        AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

        // Create a local blob object
        AZSCloudBlockBlob *blockBlob = [blobContainer blockBlobReferenceFromName:@"sampleblob"];

        // Download blob
        [blockBlob downloadToTextWithCompletionHandler:^(NSError *error, NSString *text) {
            if (error) {
                NSLog(@"Error in downloading blob");
            }
            else{
                NSLog(@"%@",text);
            }
        }];
    }

## Delete a blob

The following example shows how to delete a blob.

    -(void)deleteBlob{
        NSError *accountCreationError;

        // Create a storage account object from a connection string.
        AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

        if(accountCreationError){
            NSLog(@"Error in creating account.");
        }

        // Create a blob service client object.
        AZSCloudBlobClient *blobClient = [account getBlobClient];

        // Create a local container object.
        AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

        // Create a local blob object
        AZSCloudBlockBlob *blockBlob = [blobContainer blockBlobReferenceFromName:@"sampleblob1"];

        // Delete blob
        [blockBlob deleteWithCompletionHandler:^(NSError *error) {
            if (error) {
                NSLog(@"Error in deleting blob.");
            }
        }];
    }

## Delete a blob container

The following example shows how to delete a container.

    -(void)deleteContainer{
      NSError *accountCreationError;

      // Create a storage account object from a connection string.
      AZSCloudStorageAccount *account = [AZSCloudStorageAccount accountFromConnectionString:@"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here" error:&accountCreationError];

      if(accountCreationError){
         NSLog(@"Error in creating account.");
      }

      // Create a blob service client object.
      AZSCloudBlobClient *blobClient = [account getBlobClient];

      // Create a local container object.
      AZSCloudBlobContainer *blobContainer = [blobClient containerReferenceFromName:@"containerpublic"];

      // Delete container
      [blobContainer deleteContainerIfExistsWithCompletionHandler:^(NSError *error, BOOL success) {
         if(error){
             NSLog(@"Error in deleting container");
         }
      }];
    }

## Next steps

Now that you've learned how to use Blob Storage from iOS, follow these links to learn more about the iOS library and the Storage service.

- [Azure Storage Client Library for iOS](https://github.com/azure/azure-storage-ios)
- [Azure Storage iOS Reference Documentation](http://azure.github.io/azure-storage-ios/)
- [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
- [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage)

If you have questions regarding this library feel free to post to our [MSDN Azure forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=windowsazuredata) or [Stack Overflow](http://stackoverflow.com/questions/tagged/windows-azure-storage+or+windows-azure-storage+or+azure-storage-blobs+or+azure-storage-tables+or+azure-table-storage+or+windows-azure-queues+or+azure-storage-queues+or+azure-storage-emulator+or+azure-storage-files).
If you have feature suggestions for Azure Storage, please post to [Azure Storage Feedback](https://feedback.azure.com/forums/217298-storage/).
