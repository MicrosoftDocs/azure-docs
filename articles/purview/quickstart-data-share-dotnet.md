---
title: 'Quickstart: Share data using the .NET SDK'
description: This article will guide you through sharing and receiving data using Microsoft Purview Data Sharing account through the .NET SDK.
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.devlang: csharp
ms.topic: quickstart
ms.date: 08/17/2022
ms.custom: mode-api, references-regions
---
# Quickstart: Share and receive data with the Microsoft Purview Data Sharing .NET SDK

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this quickstart, you'll use the .NET SDK provides to share data and receive shares from Azure Data Lake Storage (ADLS Gen2) or Blob storage accounts. The article includes code snippets that will allow you to share and receive data using Microsoft Purview Data Sharing.

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

[!INCLUDE [data-share-quickstart-prerequisites](includes/data-share-quickstart-prerequisites.md)]

### Visual Studio

The walkthrough in this article uses Visual Studio 2019. The procedures for Visual Studio 2013, 2015, or 2017 may differ slightly.

### Azure .NET SDK

Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/) on your machine.

## Create an application in Azure Active Directory

1. In [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you're creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
1. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in), get the **application ID**,**tenant ID**, and **object ID**, and note down these values that you use later in this tutorial.
1. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options), get the **authentication key**, and note down this value that you use later in this tutorial.
1. [assign the application to these roles:](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application)

  | | Azure Storage Account Roles | Microsoft Purview Collection Roles |
  |:--- |:--- |:--- |
  | **Data Provider** |Owner OR Blob Storage Data Owner|Data Share Contributor|
  | **Data Consumer** |Contributor OR Owner OR Storage Blob Data Contributor OR Blob Storage Data Owner|Data Share Contributor|

## Create a Visual Studio project

Next, create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App (.NET Framework)**. .NET version 4.5.2 or above is required.
3. In **Project name**, enter **PurviewDataSharingQuickStart**.
4. Select **Create** to create the project.

## Install NuGet packages

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**.
2. In the **Package Manager Console** pane, run the following commands to install packages. For more information, see the [Microsoft.Azure.Analytics.Purview.Share NuGet package](https://www.nuget.org/packages/Azure.Analytics.Purview.Share/1.0.3-beta.20).

    ```powershell
    Install-Package Microsoft.Azure.Purview.Share.ManagementClient
    Install-Package Microsoft.Azure.Management.ResourceManager -IncludePrerelease
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    Install-Package Azure.Analytics.Purview.Share
    Install-Package Azure.Analytics.Purview.Account
    ```

## Create a sent share

The below code will create a data share that you can send to internal or external users.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **sentShareName** - a name for your new data share
- **description** - an optional description for your data share
- **collectionName** - the name of the collection where your share will be housed.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure.Core;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
var sentShareClient = new SentSharesClient(endPoint, credential);
var collectionName = "<name of your collection>";

// Get collection internal reference name
// Collections that are not the root collection have a friendlyName (the name you see in the Microsoft Purview Data Map) and an internal reference name used to access the collection programmatically.
var collectionsResponse = await accountClient.GetCollectionsAsync();

var collectionsResponseDocument = JsonDocument.Parse(collectionsResponse.Content);
var collections = collectionsResponseDocument.RootElement.GetProperty("value");

foreach (var collection in collections.EnumerateArray())
{
    if (String.Equals(collectionName, collection.GetProperty("friendlyName").ToString(), StringComparison.OrdinalIgnoreCase))
    {
        collectionName = collection.GetProperty("name").ToString();
    }
}

// Create sent share
var sentShareName = "sample-Share";
var inPlaceSentShareDto = new
{
    shareKind = "InPlace",
    properties = new
    {
        description = "demo share",
        collection = new
        {
            referenceName = collectionName,
            type = "CollectionReference"
        }
    }
};
var sentShare = await sentShareClient.CreateOrUpdateAsync(sentShareName, RequestContent.Create(inPlaceSentShareDto));
```

## Add an asset to a sent share

The below code will add a data asset to a share you're sending.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **sentShareName** - the name of the data share where you'll add the asset
- **assetName** - a name for the asset you'll be adding
- **senderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data asset is stored
- **senderStorageContainer** - the name of container where your asset is housed in your storage account
- **senderPathToShare** - the folder and file path for the asset you'll be sharing
- **pathNameForReceiver** - a (path compliant) name that for the share that will be visible to the data receiver

```C# Snippet:Azure_Analytics_Purview_Share_Samples_02_Namespaces
using Azure.Core;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
// Add asset to sent share
var sentShareName = "sample-Share";
var assetName = "fabrikam-blob-asset";
var assetNameForReceiver = "receiver-visible-asset-name";
var senderStorageResourceId = "<SENDER_STORAGE_ACCOUNT_RESOURCE_ID>";
var senderStorageContainer = "fabrikamcontainer";
var senderPathToShare = "folder/sample.txt";
var pathNameForReceiver = "from-fabrikam";
var assetData = new
{
    // For Adls Gen2 asset use "AdlsGen2Account"
    kind = "blobAccount",
    properties = new
    {
        storageAccountResourceId = senderStorageResourceId,
        receiverAssetName = assetNameForReceiver,
        paths = new[]
        {
            new
            {
                containerName = senderStorageContainer,
                senderPath = senderPathToShare,
                receiverPath = pathNameForReceiver
            }
        }
    }
};
var assetsClient = new AssetsClient(endPoint, credential);
await assetsClient.CreateAsync(WaitUntil.Started, sentShareName, assetName, RequestContent.Create(assetData));
```

## Send invitation

The below code will send an invitation to a data share.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **sentShareName** - the name of the data share you're sending
- **assetName** - a name for your invitation
- **targetEmail** or **targetActiveDirectoryId and targetObjectId** - the email address **or** objectId and tenantId for the user or service principal that will receive the data share. TenantId is optional.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_03_Namespaces
using Azure.Core;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
// Send invitation
var sentShareName = "sample-Share";
var invitationName = "invitation-to-fabrikam";
var invitationData = new
{
    invitationKind = "User",
    properties = new
    {
        targetEmail = "user@domain.com"
    }
};
// Instead of sending invitation to Azure login email of the user, you can send invitation to object ID of a service principal and tenant ID.
// Tenant ID is optional. To use this method, comment out the previous declaration, and uncomment the next one.
//var invitationData = new
//{
//    invitationKind = "Application",
//    properties = new
//    {
//        targetActiveDirectoryId = "<targetActiveDirectoryId>",
//        targetObjectId = "<targetObjectId>"
//    }
//};
var sentShareInvitationsClient = new SentShareInvitationsClient(endPoint, credential);
await sentShareInvitationsClient.CreateOrUpdateAsync(sentShareName, invitationName, RequestContent.Create(invitationData));
```

## View sent share invitations

The below code will allow you to view your sent invitations.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **sentShareName** - the name share that an invitation was sent for

```C# Snippet:Azure_Analytics_Purview_Share_Samples_04_Namespaces
using System.Linq;
using System.Text.Json;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
var sentShareName = "sample-Share";
// View sent share invitations. (Pending/Rejected)
var sentShareInvitationsClient = new SentShareInvitationsClient(endPoint, credential);
var sentShareInvitations = sentShareInvitationsClient.GetSentShareInvitations(sentShareName);
var responseInvitation = sentShareInvitations.FirstOrDefault();
if (responseInvitation == null)
{
    //No invitations
    return;
}
var responseInvitationDocument = JsonDocument.Parse(responseInvitation);
var targetEmail = responseInvitationDocument.RootElement.GetProperty("properties").GetProperty("targetEmail");
```

## View received invitations

The below code will allow you to view your received invitations.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance

```C# Snippet:Azure_Analytics_Purview_Share_Samples_05_Namespaces
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
// View received invitations
var receivedInvitationsClient = new ReceivedInvitationsClient(endPoint, credential);
var receivedInvitations = receivedInvitationsClient.GetReceivedInvitations();
```

## Create a received share

The below code will allow you to receive a data share.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **receivedShareName** - a name for the share that is being received
-  **sentShareLocation** - the region where the share is housed. It should be the same region as the sent share and will be one of [Microsoft Purview's available regions](https://azure.microsoft.com/global-infrastructure/services/?products=purview&regions=all).
- **collectionName** - the name of the collection where your share will be housed.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_06_Namespaces
using System.Linq;
using System.Text.Json;
using Azure.Core;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
var collectionName = "<name of your collection>"

// Create received share
var receivedInvitationsClient = new ReceivedInvitationsClient(endPoint, credential);
var receivedInvitations = receivedInvitationsClient.GetReceivedInvitations();
var receivedShareName = "fabrikam-received-share";
var receivedInvitation = receivedInvitations.LastOrDefault();

// Get collection internal reference name
// Collections that are not the root collection have a friendlyName (the name you see in the Microsoft Purview Data Map) and an internal reference name used to access the collection programmatically.
var collectionsResponse = await accountClient.GetCollectionsAsync();

var collectionsResponseDocument = JsonDocument.Parse(collectionsResponse.Content);
var collections = collectionsResponseDocument.RootElement.GetProperty("value");

foreach (var collection in collections.EnumerateArray())
{
    if (collection.Equals(collection.GetProperty("friendlyName").ToString(), StringComparison.OrdinalIgnoreCase))
    {
        collectionName = collection.GetProperty("name").ToString();
    }
}


if (receivedInvitation == null)
{
    //No received invitations
    return;
}
var receivedInvitationDocument = JsonDocument.Parse(receivedInvitation).RootElement;
var receivedInvitationId = receivedInvitationDocument.GetProperty("name");
var receivedShareData = new
{
    shareKind = "InPlace",
    properties = new
    {
        invitationId = receivedInvitationId,
        sentShareLocation = "eastus",
        collection = new
        {
            referenceName = collectionName,
            type = "CollectionReference"
        }
    }
};
var receivedShareClient = new ReceivedSharesClient(endPoint, credential);
var receivedShare = await receivedShareClient.CreateAsync(receivedShareName, RequestContent.Create(receivedShareData));
```

## View accepted shares

The below code will allow you to view your accepted shares.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **sentShareName** - the name of the share you would like to view

```C# Snippet:Azure_Analytics_Purview_Share_Samples_07_Namespaces
using System.Linq;
using System.Text.Json;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
var sentShareName = "sample-Share";
// View accepted shares
var acceptedSentSharesClient = new AcceptedSentSharesClient(endPoint, credential);
var acceptedSentShares = acceptedSentSharesClient.GetAcceptedSentShares(sentShareName);
var acceptedSentShare = acceptedSentShares.FirstOrDefault();
if (acceptedSentShare == null)
{
    //No accepted sent shares
    return;
}
var receiverEmail = JsonDocument.Parse(acceptedSentShare).RootElement.GetProperty("properties").GetProperty("receiverEmail").GetString();
```

## Get received assets

The below code will allow you to see the assets received from a share.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **receivedShareName** - the name of the share you would like to view the assets from
- **assetMappingName** - consumer provided input that is used as identifier for the created asset mapping
- **receiverContainerName** - the name of the container where the assets were housed
- **receiverFolderName** - the name of the folder where the assets were housed
- **receiverMountPath** - an optional input path parameter for destination mapping location
- **receiverStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data asset is stored

```C# Snippet:Azure_Analytics_Purview_Share_Samples_08_Namespaces
using System;
using System.Linq;
using System.Text.Json;
using Azure.Core;
using Azure.Identity;

var credential = new DefaultAzureCredential();
var endPoint = "https://<my-account-name>.purview.azure.com/share";
// Get received assets
var receivedShareName = "fabrikam-received-share";
var receivedAssetsClient = new ReceivedAssetsClient(endPoint, credential);
var receivedAssets = receivedAssetsClient.GetReceivedAssets(receivedShareName);
var receivedAssetName = JsonDocument.Parse(receivedAssets.First()).RootElement.GetProperty("name").GetString();
string assetMappingName = "receiver-asset-mapping";
string receiverContainerName = "receivedcontainer";
string receiverFolderName = "receivedfolder";
string receiverMountPath = "receivedmountpath";
string receiverStorageResourceId = "<RECEIVER_STORAGE_ACCOUNT_RESOURCE_ID>";
var assetMappingData = new
{
    // For Adls Gen2 asset use "AdlsGen2Account"
    kind = "BlobAccount",
    properties = new
    {
        assetId = Guid.Parse(receivedAssetName),
        storageAccountResourceId = receiverStorageResourceId,
        containerName = receiverContainerName,
        folder = receiverFolderName,
        mountPath = receiverMountPath
    }
};
var assetMappingsClient = new AssetMappingsClient(endPoint, credential);
var assetMapping = await assetMappingsClient.CreateAsync(WaitUntil.Completed, receivedShareName, assetMappingName, RequestContent.Create(assetMappingData));
```

## Clean up resources

To clean up the resources created for the quick start, follow the steps below: 

1. Within [Microsoft Purview governance portal](https://web.purview.azure.com/), [delete the sent share](how-to-share-data.md#delete-a-sent-share).
1. Also [delete your received share](how-to-receive-share.md#delete-received-share).
1. Once the shares are successfully deleted, delete the target container and folder Microsoft Purview created in your target storage account when you received shared data.

## Next steps

* [FAQ for data sharing](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
