---
title: How to use object (Blob) storage from iOS - Azure | Microsoft Docs
description: Store unstructured data in the cloud with Azure Blob storage (object storage).
author: mhopkins-msft

ms.author: mhopkins
ms.date: 11/20/2018
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# How to use Blob storage from iOS

This article shows how to perform common scenarios using Microsoft Azure Blob storage. The samples are written in Objective-C and use the [Azure Storage Client Library for iOS](https://github.com/Azure/azure-storage-ios). The scenarios covered include uploading, listing, downloading, and deleting blobs. For more information on blobs, see the [Next Steps](#next-steps) section. You can also download the [sample app](https://github.com/Azure/azure-storage-ios/tree/master/BlobSample) to quickly see the use of Azure Storage in an iOS application.

To learn more about Blob storage, see [Introduction to Azure Blob storage](storage-blobs-introduction.md).

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Import the Azure Storage iOS library into your application

You can import the Azure Storage iOS library into your application either by using the [Azure Storage CocoaPod](https://cocoapods.org/pods/AZSClient) or by importing the **Framework** file. CocoaPod is the recommended way as it makes integrating the library easier, however importing from the framework file is less intrusive for your existing project.

To use this library, you need the following:

- iOS 8+
- Xcode 7+

## CocoaPod

1. If you haven't done so already, [Install CocoaPods](https://guides.cocoapods.org/using/getting-started.html#toc_3) on your computer by opening a terminal window and running the following command

    ```shell
    sudo gem install cocoapods
    ```

2. Next, in the project directory (the directory containing your .xcodeproj file), create a new file called _Podfile_(no file extension). Add the following to _Podfile_ and save.

    ```ruby
    platform :ios, '8.0'

    target 'TargetName' do
      pod 'AZSClient'
    end
    ```

3. In the terminal window, navigate to the project directory and run the following command

    ```shell
    pod install
    ```

4. If your .xcodeproj is open in Xcode, close it. In your project directory open the newly created project file which will have the .xcworkspace extension. This is the file you'll work from for now on.

## Framework

The other way to use the library is to build the framework manually:

1. First, download or clone the [azure-storage-ios repo](https://github.com/azure/azure-storage-ios).
2. Go into *azure-storage-ios* -> *Lib* -> *Azure Storage Client Library*, and open `AZSClient.xcodeproj` in Xcode.
3. At the top-left of Xcode, change the active scheme from "Azure Storage Client Library" to "Framework".
4. Build the project (⌘+B). This will create an `AZSClient.framework` file on your Desktop.

You can then import the framework file into your application by doing the following:

1. Create a new project or open up your existing project in Xcode.
2. Drag and drop the `AZSClient.framework` into your Xcode project navigator.
3. Select *Copy items if needed*, and click on *Finish*.
4. Click on your project in the left-hand navigation and click the *General* tab at the top of the project editor.
5. Under the *Linked Frameworks and Libraries* section, click the Add button (+).
6. In the list of libraries already provided, search for `libxml2.2.tbd` and add it to your project.

## Import the Library

```objc
// Include the following import statement to use blob APIs.
#import <AZSClient/AZSClient.h>
```

If you are using Swift, you will need to create a bridging header and import \<AZSClient/AZSClient.h> there:

1. Create a header file `Bridging-Header.h`, and add the above import statement.
2. Go to the *Build Settings* tab, and search for *Objective-C Bridging Header*.
3. Double-click on the field of *Objective-C Bridging Header* and add the path to your header file: `ProjectName/Bridging-Header.h`
4. Build the project (⌘+B) to verify that the bridging header was picked up by Xcode.
5. Start using the library directly in any Swift file, there is no need for import statements.

[!INCLUDE [storage-mobile-authentication-guidance](../../../includes/storage-mobile-authentication-guidance.md)]

## Asynchronous Operations

> [!NOTE]
> All methods that perform a request against the service are asynchronous operations. In the code samples, you'll find that these methods have a completion handler. Code inside the completion handler will run **after** the request is completed. Code after the completion handler will run **while** the request is being made.

## Create a container

Every blob in Azure Storage must reside in a container. The following example shows how to create a container, called *newcontainer*, in your Storage account if it doesn't already exist. When choosing a name for your container, be mindful of the naming rules mentioned above.

```objc
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
```

You can confirm that this works by looking at the [Microsoft Azure Storage Explorer](https://storageexplorer.com) and verifying that *newcontainer* is in the list of containers for your Storage account.

## Set Container Permissions

A container's permissions are configured for **Private** access by default. However, containers provide a few different options for container access:

- **Private**: Container and blob data can be read by the account owner only.
- **Blob**: Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request.
- **Container**: Container and blob data can be read via anonymous request. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.

The following example shows you how to create a container with **Container** access permissions, which will allow public, read-only access for all users on the Internet:

```objc
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
```

## Upload a blob into a container

As mentioned in the Blob service concepts section, Blob Storage offers three different types of blobs: block blobs, append blobs, and page blobs. The Azure Storage iOS library supports all three types of blobs. In most cases, block blob is the recommended type to use.

The following example shows how to upload a block blob from an NSString. If a blob with the same name already exists in this container, the contents of this blob will be overwritten.

```objc
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
```

You can confirm that this works by looking at the [Microsoft Azure Storage Explorer](https://storageexplorer.com) and verifying that the container, *containerpublic*, contains the blob, *sampleblob*. In this sample, we used a public container so you can also verify that this application worked by going to the blobs URI:

```http
https://nameofyourstorageaccount.blob.core.windows.net/containerpublic/sampleblob
```

In addition to uploading a block blob from an NSString, similar methods exist for NSData, NSInputStream, or a local file.

## List the blobs in a container

The following example shows how to list all blobs in a container. When performing this operation, be mindful of the following parameters:

- **continuationToken** - The continuation token represents where the listing operation should start. If no token is provided, it will list blobs from the beginning. Any number of blobs can be listed, from zero up to a set maximum. Even if this method returns zero results, if `results.continuationToken` is not nil, there may be more blobs on the service that have not been listed.
- **prefix** - You can specify the prefix to use for blob listing. Only blobs that begin with this prefix will be listed.
- **useFlatBlobListing** - As mentioned in the [Naming and referencing containers and blobs](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata) section, although the Blob service is a flat storage scheme, you can create a virtual hierarchy by naming blobs with path information. However, non-flat listing is currently not supported. This feature is coming soon. For now, this value should be **YES**.
- **blobListingDetails** - You can specify which items to include when listing blobs
  - _AZSBlobListingDetailsNone_: List only committed blobs, and do not return blob metadata.
  - _AZSBlobListingDetailsSnapshots_: List committed blobs and blob snapshots.
  - _AZSBlobListingDetailsMetadata_: Retrieve blob metadata for each blob returned in the listing.
  - _AZSBlobListingDetailsUncommittedBlobs_: List committed and uncommitted blobs.
  - _AZSBlobListingDetailsCopy_: Include copy properties in the listing.
  - _AZSBlobListingDetailsAll_: List all available committed blobs, uncommitted blobs, and snapshots, and return all metadata and copy status for those blobs.
- **maxResults** - The maximum number of results to return for this operation. Use -1 to not set a limit.
- **completionHandler** - The block of code to execute with the results of the listing operation.

In this example, a helper method is used to recursively call the list blobs method every time a continuation token is returned.

```objc
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
```

## Download a blob

The following example shows how to download a blob to a NSString object.

```objc
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
```

## Delete a blob

The following example shows how to delete a blob.

```objc
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
```

## Delete a blob container

The following example shows how to delete a container.

```objc
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
```

## Next steps

Now that you've learned how to use Blob Storage from iOS, follow these links to learn more about the iOS library and the Storage service.

- [Azure Storage Client Library for iOS](https://github.com/azure/azure-storage-ios)
- [Azure Storage iOS Reference Documentation](https://azure.github.io/azure-storage-ios/)
- [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
- [Azure Storage Team Blog](https://docs.microsoft.com/archive/blogs/windowsazurestorage/)

If you have questions regarding this library, feel free to post to our [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-blob-storage.html) or [Stack Overflow](https://stackoverflow.com/questions/tagged/windows-azure-storage+or+windows-azure-storage+or+azure-storage-blobs+or+azure-storage-tables+or+azure-table-storage+or+windows-azure-queues+or+azure-storage-queues+or+azure-storage-emulator+or+azure-storage-files).
If you have feature suggestions for Azure Storage, please post to [Azure Storage Feedback](https://feedback.azure.com/forums/217298-storage/).
