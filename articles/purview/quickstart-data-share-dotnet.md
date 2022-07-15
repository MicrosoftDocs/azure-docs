---
title: 'Quickstart: Share data using the .NET SDK'
description: This article will guide you through sharing and receiving data using Microsoft Purview Data Sharing account through the .NET SDK.
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.devlang: csharp
ms.topic: quickstart
ms.date: 06/28/2022
ms.custom: mode-api
---
# Quickstart: Share and receive data with the Microsoft Purview Data Sharing .NET SDK

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this quickstart, you'll use the .NET SDK provides to share data and receive shares from Azure Data Lake Storage (ADLS Gen2) or Blob storage accounts.

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

[!INCLUDE [data-share-quickstart-prerequisites](includes/data-share-quickstart-prerequisites.md)]

### Visual Studio

The walkthrough in this article uses Visual Studio 2019. The procedures for Visual Studio 2013, 2015, or 2017 may differ slightly.

### Azure .NET SDK

Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/) on your machine.

## Create an application in Azure Active Directory

1. In [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you're creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
1. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in), get the **application ID** and **tenant ID**, and note down these values that you use later in this tutorial.
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
2. In the **Package Manager Console** pane, run the following commands to install packages. For more information, see the [Microsoft.Azure.Management.DataShare NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.DataShare).

    ```powershell
    Install-Package Microsoft.Azure.Purview.Share.ManagementClient
    Install-Package Microsoft.Azure.Management.ResourceManager -IncludePrerelease
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```

## Create a Microsoft Purview client

1. Open **Program.cs**, include the following statements to add references to namespaces.

    ```csharp
    using Microsoft.Rest;
    using Purview.Share;
    using Purview.Share.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    ```

1. Add the following code to the **Main** method that will run our share code and catch any errors.

   ```csharp
   try
   {
       RunShareLifeCycle().Wait();
   }
   catch (AggregateException ex)
   {
       var purviewException = ex.InnerExceptions.FirstOrDefault() as PurviewShareErrorException;
       if (purviewException != null)
       {
           Console.WriteLine(purviewException.Body.Error.Message);
       }
       else
       {
           Console.WriteLine(ex.ToString());
       }
   }
   catch (Exception ex)
   {
       Console.WriteLine(ex.ToString());
   }
   ```

1. Add a new method that we'll use to house all our activities. For now, we'll just add the code to authenticate and create a share client. You'll always need this piece in your RunShareLifeCycle() method. Fill in the authToken and purviewAccountName with your own information:

   ```csharp
   static async Task RunShareLifeCycle()
   {
       // Create client
       string authToken = "<token with resource set to https://purview.azure.net>";
       string purviewAccountName = "<purivewAccountName>";

       ServiceClientCredentials cred = new TokenCredentials(authToken);
       var client = new PurviewShareClient(cred)
       {
           Endpoint = $"https://{purviewAccountName}.purview.azure.com/share"
       };

       // Use purviewAccountName if caller has Data Share Contributor role on the root collection of Purview account else use name of a collection on which caller has Data Share Contributor role.
       var rootCollection = new Collection
       {
           ReferenceName = purviewAccountName,
           Type = "CollectionReference"
       };
   }
   ```

## Create a data share

You can add the following code to the **RunShareLifeCycle** method to create a data share. Be sure to fill in these values with your own information:
  
- sentShareName
- assetName
- assetNameforReceiver
- senderStorageResourceId
- senderStorageContainer
- senderPathtoShare
- pathNameForReceiver
- invitationName
- invitationDto

```csharp
var sentShareName = "<NAME OF YOUR SHARE>";
var assetName = "<NAME OF YOUR STORAGE ACCOUNT>";
var assetNameForReceiver = "receiver-visible-asset-name";
var senderStorageResourceId = "<YOUR_STORAGE_ACCOUNT_RESOURCE_ID>";
var senderStorageContainer = "<CONTAINER IN YOUR STORAGE ACCOUNT>";
var senderPathToShare = "folder/sample.txt";
var pathNameForReceiver = "<FILE PATH FOR RECEIVED SHARE>";
var invitationName = "<NAME FOR RECEIVED SHARE>";

var invitationDto = new UserInvitation("user@domain.com");
// Instead of sending invitation to Azure login email of the user, you can send invitation to object ID of a service principal and tenant ID.
// Tenant ID is optional. To use this method, comment out the previous line, and uncomment the next line.
//var invitationDto = new ApplicationInvitation("<tenantId>", "<principalId>");


// Create share
var inPlaceSentShareDto = new InPlaceSentShare

{ Collection = rootCollection, Description = "demo share" };
HttpOperationResponse<SentShare> sentShare = await client.SentShares.CreateOrUpdateWithHttpMessagesAsync(sentShareName, inPlaceSentShareDto);

// Add asset to sent share
var pathsToShare = new List<BlobAccountPath> { new BlobAccountPath(senderStorageContainer, pathNameForReceiver, senderPathToShare) };
var assetDto = new BlobAccountAsset(pathsToShare, assetNameForReceiver, senderStorageResourceId);
HttpOperationResponse<Asset> asset = await client.Assets.CreateWithHttpMessagesAsync(sentShareName, assetName, assetDto);

// Send invitation
HttpOperationResponse<SentShareInvitation> invitation =
    await client.SentShareInvitations
        .CreateOrUpdateWithHttpMessagesAsync(sentShareName, invitationName, invitationDto);
```

## View shared or received invitations

You can add the following code to the **RunShareLifeCycle** to review sent or received invitations.

```csharp
// View sent share invitations. (Pending/Rejected)
HttpOperationResponse<SentShareInvitationList> sentShareInvitations = await client.SentShareInvitations.ListWithHttpMessagesAsync(sentShare.Body.Name);
var targetEmail = ((UserInvitation)sentShareInvitations.Body.Value.First()).TargetEmail;

// View received invitations
HttpOperationResponse<ReceivedInvitationList> receivedInvitations =
await client.ReceivedInvitations.ListWithHttpMessagesAsync();
```

## Create a received share

You can add the following code to the **RunShareLifeCycle** method to create a received share from an invitation. Be sure to fill in these values with your own information:
  
- receivedShareName

```csharp
// Create received share
string receivedShareName = "fabrikam-received-share";
UserReceivedInvitation receivedInvitation = (UserReceivedInvitation)receivedInvitations.Body.Value.Last();

var receivedShareDto = new InPlaceReceivedShare(
    rootCollection,
    receivedInvitation.Name,
    receivedInvitation.Location);

HttpOperationResponse<ReceivedShare> receivedShare =
    await client.ReceivedShares.CreateWithHttpMessagesAsync(receivedShareName, receivedShareDto);
```

## View accepted shares and received assets

You can add the following code to the **RunShareLifeCycle** method to see shares you've accepted and assets you've received from those shares. Be sure to fill in these values with your own information:
  
- assetMappingName
- receiverContainerName
- receiverFolderName
- receiverMountPath
- receiverStorageResourceId

```csharp
string assetMappingName = "receiver-asset-mapping";
string receiverContainerName = "receivedcontainer";
string receiverFolderName = "receivedfolder";
string receiverMountPath = "receivedmountpath";
var receiverStorageResourceId = "<RECEIVER_STORAGE_ACCOUNT_RESOURCE_ID>";


// View accepted shares
HttpOperationResponse<AcceptedSentShareList> acceptedSentShares = await client.AcceptedSentShares.ListWithHttpMessagesAsync(sentShare.Body.Name);
var receiverEmail = ((InPlaceAcceptedSentShare)acceptedSentShares.Body.Value.First()).ReceiverEmail;

// Get received assets
HttpOperationResponse<ReceivedAssetList> receivedAssets =
    await client.ReceivedAssets.ListWithHttpMessagesAsync(receivedShareName);
var assetMappingDto = new BlobAccountAssetMapping
{
    AssetId = Guid.Parse(receivedAssets.Body.Value.First().Name),
    ContainerName = receiverContainerName,
    Folder = receiverFolderName,
    MountPath = receiverMountPath,
    StorageAccountResourceId = receiverStorageResourceId
};
HttpOperationResponse<AssetMapping> assetMapping =
    await client.AssetMappings.CreateWithHttpMessagesAsync(
        receivedShareName,
        assetMappingName,
        assetMappingDto);
```

## Full Code

Here's the full .NET code that contains all the aspects we discussed in the last several sections.

```csharp
using Microsoft.Rest;
using Purview.Share;
using Purview.Share.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShareNetSample
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                RunShareLifeCycle().Wait();
            }
            catch (AggregateException ex)
            {
                var purviewException = ex.InnerExceptions.FirstOrDefault() as PurviewShareErrorException;
                if (purviewException != null)
                {
                    Console.WriteLine(purviewException.Body.Error.Message);
                }
                else
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        static async Task RunShareLifeCycle()
        {
            // Create client
            string authToken = "<token with resource set to https://purview.azure.net>";
            ServiceClientCredentials cred = new TokenCredentials(authToken);

            string purviewAccountName = "<purivewAccountName>";
            var client = new PurviewShareClient(cred)
            {
                Endpoint = $"https://{purviewAccountName}.purview.azure.com/share"
            };

            // Use purviewAccountName if caller has Data Share Contributor role on the root collection of Purview account else use name of a collection on which caller has Data Share Contributor role.
            var rootCollection = new Collection
            {
                ReferenceName = purviewAccountName,
                Type = "CollectionReference"
            };

            // Create sent share
            var sentShareName = "fabrikam-sent-share";
            var inPlaceSentShareDto = new InPlaceSentShare
            { Collection = rootCollection, Description = "demo share" };

            HttpOperationResponse<SentShare> sentShare = await client.SentShares.CreateOrUpdateWithHttpMessagesAsync(sentShareName, inPlaceSentShareDto);

            // Add asset to sent share
            var assetName = "fabrikam-blob-asset";
            var assetNameForReceiver = "receiver-visible-asset-name";
            var senderStorageResourceId = "<SENDER_STORAGE_ACCOUNT_RESOURCE_ID>";
            var senderStorageContainer = "fabrikamcontainer";
            var senderPathToShare = "folder/sample.txt";
            var pathNameForReceiver = "from-fabrikam";

            var pathsToShare = new List<BlobAccountPath> { new BlobAccountPath(senderStorageContainer, pathNameForReceiver, senderPathToShare) };
            var assetDto = new BlobAccountAsset(pathsToShare, assetNameForReceiver, senderStorageResourceId);
            HttpOperationResponse<Asset> asset = await client.Assets.CreateWithHttpMessagesAsync(sentShareName, assetName, assetDto);

            // Send invitation
            var invitationName = "invitation-to-fabrikam";
            var invitationDto = new UserInvitation("user@domain.com");

            // Instead of sending invitation to Azure login email of the user, you can send invitation to object ID of a service principal and tenant ID.
            // Tenant ID is optional. To use this method, comment out the previous line, and uncomment the next line.
            //var invitationDto = new ApplicationInvitation("<tenantId>", "<principalId>");

            HttpOperationResponse<SentShareInvitation> invitation =
                await client.SentShareInvitations
                    .CreateOrUpdateWithHttpMessagesAsync(sentShareName, invitationName, invitationDto);

            // View sent share invitations. (Pending/Rejected)
            HttpOperationResponse<SentShareInvitationList> sentShareInvitations = await client.SentShareInvitations.ListWithHttpMessagesAsync(sentShare.Body.Name);
            var targetEmail = ((UserInvitation)sentShareInvitations.Body.Value.First()).TargetEmail;

            // View received invitations
            HttpOperationResponse<ReceivedInvitationList> receivedInvitations =
                await client.ReceivedInvitations.ListWithHttpMessagesAsync();

            // Create received share
            string receivedShareName = "fabrikam-received-share";
            UserReceivedInvitation receivedInvitation = (UserReceivedInvitation)receivedInvitations.Body.Value.Last();

            var receivedShareDto = new InPlaceReceivedShare(
                rootCollection,
                receivedInvitation.Name,
                receivedInvitation.Location);

            HttpOperationResponse<ReceivedShare> receivedShare =
                await client.ReceivedShares.CreateWithHttpMessagesAsync(receivedShareName, receivedShareDto);

            // View accepted shares
            HttpOperationResponse<AcceptedSentShareList> acceptedSentShares = await client.AcceptedSentShares.ListWithHttpMessagesAsync(sentShare.Body.Name);
            var receiverEmail = ((InPlaceAcceptedSentShare)acceptedSentShares.Body.Value.First()).ReceiverEmail;

            // Get received assets
            HttpOperationResponse<ReceivedAssetList> receivedAssets =
                await client.ReceivedAssets.ListWithHttpMessagesAsync(receivedShareName);

            string assetMappingName = "receiver-asset-mapping";
            string receiverContainerName = "receivedcontainer";
            string receiverFolderName = "receivedfolder";
            string receiverMountPath = "receivedmountpath";
            var receiverStorageResourceId = "<RECEIVER_STORAGE_ACCOUNT_RESOURCE_ID>";

            var assetMappingDto = new BlobAccountAssetMapping
            {
                AssetId = Guid.Parse(receivedAssets.Body.Value.First().Name),
                ContainerName = receiverContainerName,
                Folder = receiverFolderName,
                MountPath = receiverMountPath,
                StorageAccountResourceId = receiverStorageResourceId
            };

            HttpOperationResponse<AssetMapping> assetMapping =
                await client.AssetMappings.CreateWithHttpMessagesAsync(
                    receivedShareName,
                    assetMappingName,
                    assetMappingDto);
        }
    }
}
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