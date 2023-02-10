---
title: 'Quickstart: Share data using the .NET SDK'
description: This article will guide you through sharing and receiving data using Microsoft Purview Data Sharing account through the .NET SDK.
author: sidontha
ms.author: sidontha
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
1. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application), get the **application ID**,**tenant ID**, and **object ID**, and note down these values that you use later in this tutorial.
1. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#set-up-authentication), get the **authentication key**, and note down this value that you use later in this tutorial.
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
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    private static string SenderStorageKind = "<Sender Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";
    private static string SenderStorageContainer = "<Share Data Container Name>";
    private static string SenderPathToShare = "<File/Folder Path To Share>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Value If Desired.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experience API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateShare - START");
            await Sender_CreateSentShare();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateShare - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private static async Task<BinaryData> Sender_CreateSentShare()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

        if (sentSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Sent Shares Client.");
        }

        // Create sent share
        var inPlaceSentShareDto = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}",
                description = $"Sent share created via updated experience SDK.",
                artifact = new
                {
                    storeKind = SenderStorageKind,
                    storeReference = new
                    {
                        referenceName = SenderStorageResourceId,
                        type = "ArmResourceReference"
                    },
                    properties = new
                    {
                        paths = new[]
                        {
                            new
                            {
                                receiverPath = ReceiverVisiblePath,
                                containerName = SenderStorageContainer,
                                senderPath = SenderPathToShare
                            }
                        }
                    }
                }
            },
        };

        Operation<BinaryData> sentShare = await sentSharesClient.CreateSentShareAsync(WaitUntil.Completed, SentShareId, RequestContent.Create(inPlaceSentShareDto));
        return Utilities.LogResult(sentShare.Value);
    }
}
```

## Send invitation to a user

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string RecipientUserEmailId = "<Target User's Email Id>";


    // Credential Values
    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Value If Desired.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experience API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoUser - START");
            await Sender_CreateUserRecipient();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoUser - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private static async Task<BinaryData> Sender_CreateUserRecipient()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

        if (string.IsNullOrEmpty(RecipientUserEmailId))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient User Email Id.");
        }

        // Create user recipient and invite
        var invitationData = new
        {
            invitationKind = "User",
            properties = new
            {
                expirationDate = DateTime.Now.AddDays(7).ToString(),
                notify = true, // Send invitation email
                targetEmail = RecipientUserEmailId
            }
        };

        var sentInvitation = await sentShareClient.CreateSentShareInvitationAsync(SentShareId, Utilities.GenerateResourceName(useGuid: true), RequestContent.Create(invitationData));
        return Utilities.LogResult(sentInvitation.Content);
    }
    
}
```

## Send invitation to a service

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string RecipientApplicationTenantId = "<Target Application's Tenant Id>";
    private static string RecipientApplicationObjectId = "<Target Application's Object Id>";

    // Credential Values
    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Value If Desired.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experience API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoService - START");
            await Sender_CreateServiceRecipient();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoService - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private static async Task<BinaryData> Sender_CreateServiceRecipient()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

        if (!Guid.TryParse(RecipientApplicationTenantId, out Guid _))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient Service Tenant Id.");
        }

        if (!Guid.TryParse(RecipientApplicationObjectId, out Guid _))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient Service Object Id.");
        }

        // Create service recipient
        var invitationData = new
        {
            invitationKind = "Service",
            properties = new
            {
                expirationDate = DateTime.Now.AddDays(5).ToString(),
                targetActiveDirectoryId = RecipientApplicationTenantId,
                targetObjectId = RecipientApplicationObjectId
            }
        };

        var sentInvitation = await sentShareClient.CreateSentShareInvitationAsync(SentShareId, Utilities.GenerateResourceName(useGuid: true), RequestContent.Create(invitationData));
        return Utilities.LogResult(sentInvitation.Content);
    }

    
}
```

## List all sent shares

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## List all share recipients

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allRecipients = await sentSharesClient.GetAllSentShareInvitationsAsync(SentShareId).ToResultList();

        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Delete detatched recipients

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allRecipients = await sentSharesClient.GetAllSentShareInvitationsAsync(SentShareId).ToResultList();

            var recipientToDelete = allRecipients.Single(recipient =>
            {
                var doc = JsonDocument.Parse(recipient).RootElement;
                var props = doc.GetProperty("properties");
                var key = props.GetProperty("shareStatus").ToString();
                return key == "Detached";
            });
            var recipientId = JsonDocument.Parse(recipientToDelete).RootElement.GetProperty("id").ToString();
            await sentSharesClient.DeleteSentShareInvitationAsync(WaitUntil.Completed, SentShareId, recipientId);
            
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Delete individual recipient

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);
    private static string recipientId = "<Recipient (Client) Id>"

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            await sentSharesClient.DeleteSentShareInvitationAsync(WaitUntil.Completed, SentShareId, recipientId);
            
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Delete sent share
```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            await sentSharesClient.DeleteSentShareAsync(WaitUntil.Completed, SentShareId);
            
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Create a received share

The below code will allow you to receive a data share.
To use it, be sure to fill out these variables:

- **endpoint** - "https://\<my-account-name>.purview.azure.com/share". Replace **\<my-account-name>** with the name of your Microsoft Purview instance
- **receivedShareName** - a name for the share that is being received
-  **sentShareLocation** - the region where the share is housed. It should be the same region as the sent share and will be one of [Microsoft Purview's available regions](https://azure.microsoft.com/global-infrastructure/services/?products=purview&regions=all).
- **collectionName** - the name of the collection where your share will be housed.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceiverStorageKind = "<Receiver Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string ReceiverStorageResourceId = "<Receiver Storage Account Resource Id>";
    private static string ReceiverStorageContainer = "<Container Name To Receive Data Under>";
    private static string ReceiverTargetFolderName = "<Folder Name to Received Data Under>";
    private static string ReceiverTargetMountPath = "<Mount Path to Received Data Under>";

    //Use if using a service principal to receive a share
    private static bool UseServiceTokenCredentials = false;
    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Values If Desired.
    private static string ReceivedShareId = Utilities.GenerateResourceName(useGuid: true);
    private static string ReceiverVisiblePath = Utilities.GenerateResourceName();

    // General Configs
    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experience API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateReceivedShare - START");
            await Receiver_CreateReceivedShare();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateReceivedShare - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private static async Task<BinaryData> Receiver_CreateReceivedShare(ReceivedSharesClient receivedSharesClient)
    {

        TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

        receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var results = await receivedSharesClient.GetAllDetachedReceivedSharesAsync().ToResultList();
        var detachedReceivedShare = Utilities.LogResults(results);

        if (detachedReceivedShare == null)
        {
            throw new InvalidOperationException("No received shares found.");
        }

        var detachedReceivedShareDocument = JsonDocument.Parse(detachedReceivedShare).RootElement;
        ReceivedShareId = detachedReceivedShareDocument.GetProperty("id").ToString();

        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}",
                sink = new
                {
                    storeKind = ReceiverStorageKind,
                    properties = new
                    {
                        containerName = ReceiverStorageContainer,
                        folder = ReceiverTargetFolderName,
                        mountPath = ReceiverTargetMountPath
                    },
                    storeReference = new
                    {
                        referenceName = ReceiverStorageResourceId,
                        type = "ArmResourceReference"
                    }
                }
            }
        };

        var receivedShare = await receivedSharesClient.CreateOrUpdateReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));
        return Utilities.LogResult(receivedShare.Value);
    }
}
```

## Update received share

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceiverStorageKind = "<Receiver Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string ReAttachStorageResourceId = "<Storage Account Resource Id For Reattaching Recieved Share>";
    private static string ReceiverStorageContainer = "<Container Name To Receive Data Under>";
    private static string ReceiverTargetFolderName = "<Folder Name to Received Data Under>";
    private static string ReceiverTargetMountPath = "<Mount Path to Received Data Under>";

    //Use if using a service principal to receive a share
    private static bool UseServiceTokenCredentials = false;
    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Values If Desired.
    private static string ReceivedShareId = Utilities.GenerateResourceName(useGuid: true);

    // General Configs
    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experience API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: UpdateReceivedShare - START");
            await Receiver_UpdateReceivedShare();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: UpdateReceivedShare - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private static async Task<BinaryData> Receiver_UpdateReceivedShare()
    {

        TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

        receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}-ReAttached",
                sink = new
                {
                    storeKind = ReceiverStorageKind,
                    properties = new
                    {
                        containerName = $"{ReceiverStorageContainer}reattached",
                        folder = ReceiverTargetFolderName,
                        mountPath = ReceiverTargetMountPath
                    },
                    storeReference = new
                    {
                        referenceName = ReAttachStorageResourceId,
                        type = "ArmResourceReference"
                    }
                }
            }
        };

        var receivedShare = await receivedSharesClient.CreateOrUpdateReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));
        return Utilities.LogResult(receivedShare.Value);
    }
}
```

## List all received shares

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverStorageResourceId = "<Storage Account Resource Id For Reattaching Recieved Share>";

    //Use if using a service principal to receive a share
    private static bool UseServiceTokenCredentials = false;
    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // General Configs
    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

            receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

            var allReceivedShares = await receivedSharesClient.GetAllAttachedReceivedSharesAsync(ReceiverStorageResourceId).ToResultList();
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Delete received share

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceivedShareId = Utilities.GenerateResourceName(useGuid: true);

    //Use if using a service principal to receive a share
    private static bool UseServiceTokenCredentials = false;
    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // General Configs
    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

            receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

            await receivedSharesClient.DeleteReceivedShareAsync(WaitUntil.Completed, ReceivedShareId);
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }
}
```

## Full lifecycle script

This script gives the full share lifecycle for Sender, Receiver, and Manager operations. You can use this script and edit the Operations boolean toggles as needed.

```C# Snippet:Azure_Analytics_Purview_Share_Sample
// -----------------------------------------------------------------------
//  <copyright>
//      Copyright (C) Microsoft Corporation. All rights reserved.
//  </copyright>
// -----------------------------------------------------------------------

using Azure;
using Azure.Analytics.Purview.Share;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

namespace ShareNetSample;

public static class ShareNetSample20
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    private static string SenderStorageKind = "<Sender Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";
    private static string SenderStorageContainer = "<Share Data Container Name>";
    private static string SenderPathToShare = "<File/Folder Path To Share>";

    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string RecipientUserEmailId = "<Target User's Email Id>";
    private static string RecipientApplicationTenantId = "<Target Application's Tenant Id>";
    private static string RecipientApplicationObjectId = "<Target Application's Object Id>";

    private static string ReceiverStorageKind = "<Receiver Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string ReceiverStorageResourceId = "<Receiver Storage Account Resource Id>";
    private static string ReceiverStorageContainer = "<Container Name To Receive Data Under>";
    private static string ReceiverTargetFolderName = "<Folder Name to Received Data Under>";
    private static string ReceiverTargetMountPath = "<Mount Path to Received Data Under>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // Set if performing manage share operations
    private static string ReAttachStorageResourceId = "<Storage Account Resource Id For Reattaching Recieved Share>";


    // [OPTIONAL INPUTS] Override Values If Desired.
    private static string SentShareId = Utilities.GenerateResourceName(useGuid: true);
    private static string ReceivedShareId = Utilities.GenerateResourceName(useGuid: true);
    private static string ReceiverVisiblePath = Utilities.GenerateResourceName();


    // Toggle As Needed.
    private static bool PerformSenderOperations = true;
    private static bool PerformReceiverOperations = true;
    private static bool PerformManageOperations = true;


    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";

    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {
            /// Replace all placeholder inputs above with actual values before running this program.
            /// This updated Share experiece API will create Shares based on callers RBAC role on the storage account.
            /// To view/manage Shares via UX in Purview Studio. Storage accounts need to be registered (one time action) in Purview account with DSA permissions.

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: RunShareLifecycle - START");
            await RunShareLifecycle();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: RunShareLifecycle - FINISH");
        }
        catch (Exception ex)
        {
            Utilities.LogError(ex);
        }
    }

    private async static Task RunShareLifecycle()
    {
        SentSharesClient? sentSharesClient = null;
        ReceivedSharesClient? receivedSharesClient = null;

        if (PerformSenderOperations)
        {
            TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

            sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            Utilities.LogCheckpoint("Create Sent Share");
            await Sender_CreateSentShare(sentSharesClient);

            Utilities.LogCheckpoint("Add Service Recipient and Invite");
            await Sender_CreateServiceRecipient(sentSharesClient);

            Utilities.LogCheckpoint("Add User Recipient and Invite");
            await Sender_CreateUserRecipient(sentSharesClient);
        }

        if (PerformReceiverOperations)
        {
            TokenCredential receiverCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

            receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

            Utilities.LogCheckpoint("List And Attach Received Share");
            await Receiver_CreateReceivedShare(receivedSharesClient);
        }

        if (PerformManageOperations && sentSharesClient != null && receivedSharesClient != null)
        {
            Utilities.LogCheckpoint("List All Sent Shares");
            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();
            Utilities.LogResults(allSentShares);

            Utilities.LogCheckpoint("List All Recipients");
            var allRecipients = await sentSharesClient.GetAllSentShareInvitationsAsync(SentShareId).ToResultList();
            Utilities.LogResults(allRecipients);

            Utilities.LogCheckpoint("List All Received Shares");
            var allReceivedShares = await receivedSharesClient.GetAllAttachedReceivedSharesAsync(ReceiverStorageResourceId).ToResultList();
            Utilities.LogResults(allReceivedShares);

            Utilities.LogCheckpoint("Re-atach Received Share");
            await Receiver_UpdateReceivedShare(receivedSharesClient);

            Utilities.LogCheckpoint("Delete Recipient");
            var recipientToDelete = allRecipients.Single(recipient =>
            {
                var doc = JsonDocument.Parse(recipient).RootElement;
                var props = doc.GetProperty("properties");
                var key = props.GetProperty("shareStatus").ToString();
                return key == "Detached";
            });
            var recipientId = JsonDocument.Parse(recipientToDelete).RootElement.GetProperty("id").ToString();
            await sentSharesClient.DeleteSentShareInvitationAsync(WaitUntil.Completed, SentShareId, recipientId);
            Utilities.LogResult(recipientId);

            Utilities.LogCheckpoint("Delete Received Share");
            await receivedSharesClient.DeleteReceivedShareAsync(WaitUntil.Completed, ReceivedShareId);
            Utilities.LogResult(ReceivedShareId);

            Utilities.LogCheckpoint("Delete Sent Share");
            await sentSharesClient.DeleteSentShareAsync(WaitUntil.Completed, SentShareId);
            Utilities.LogResult(SentShareId);
        }
    }

    private static async Task<BinaryData> Sender_CreateSentShare(SentSharesClient sentSharesClient)
    {
        if (sentSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Sent Shares Client.");
        }

        // Create sent share
        var inPlaceSentShareDto = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}",
                description = $"Sent share created via updated experience SDK.",
                artifact = new
                {
                    storeKind = SenderStorageKind,
                    storeReference = new
                    {
                        referenceName = SenderStorageResourceId,
                        type = "ArmResourceReference"
                    },
                    properties = new
                    {
                        paths = new[]
                        {
                            new
                            {
                                receiverPath = ReceiverVisiblePath,
                                containerName = SenderStorageContainer,
                                senderPath = SenderPathToShare
                            }
                        }
                    }
                }
            },
        };

        Operation<BinaryData> sentShare = await sentSharesClient.CreateSentShareAsync(WaitUntil.Completed, SentShareId, RequestContent.Create(inPlaceSentShareDto));
        return Utilities.LogResult(sentShare.Value);
    }

    private static async Task<BinaryData> Sender_CreateUserRecipient(SentSharesClient sentShareClient)
    {
        if (string.IsNullOrEmpty(RecipientUserEmailId))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient User Email Id.");
        }

        // Create user recipient and invite
        var invitationData = new
        {
            invitationKind = "User",
            properties = new
            {
                expirationDate = DateTime.Now.AddDays(7).ToString(),
                notify = true, // Send invitation email
                targetEmail = RecipientUserEmailId
            }
        };

        var sentInvitation = await sentShareClient.CreateSentShareInvitationAsync(SentShareId, Utilities.GenerateResourceName(useGuid: true), RequestContent.Create(invitationData));
        return Utilities.LogResult(sentInvitation.Content);
    }

    private static async Task<BinaryData> Sender_CreateServiceRecipient(SentSharesClient sentShareClient)
    {
        if (!Guid.TryParse(RecipientApplicationTenantId, out Guid _))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient Service Tenant Id.");
        }

        if (!Guid.TryParse(RecipientApplicationObjectId, out Guid _))
        {
            throw new InvalidEnumArgumentException("Invalid Recipient Service Object Id.");
        }

        // Create service recipient
        var invitationData = new
        {
            invitationKind = "Service",
            properties = new
            {
                expirationDate = DateTime.Now.AddDays(5).ToString(),
                targetActiveDirectoryId = RecipientApplicationTenantId,
                targetObjectId = RecipientApplicationObjectId
            }
        };

        var sentInvitation = await sentShareClient.CreateSentShareInvitationAsync(SentShareId, Utilities.GenerateResourceName(useGuid: true), RequestContent.Create(invitationData));
        return Utilities.LogResult(sentInvitation.Content);
    }

    private static async Task<BinaryData> Receiver_CreateReceivedShare(ReceivedSharesClient receivedSharesClient)
    {
        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var results = await receivedSharesClient.GetAllDetachedReceivedSharesAsync().ToResultList();
        var detachedReceivedShare = Utilities.LogResults(results);

        if (detachedReceivedShare == null)
        {
            throw new InvalidOperationException("No received shares found.");
        }

        var detachedReceivedShareDocument = JsonDocument.Parse(detachedReceivedShare).RootElement;
        ReceivedShareId = detachedReceivedShareDocument.GetProperty("id").ToString();

        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}",
                sink = new
                {
                    storeKind = ReceiverStorageKind,
                    properties = new
                    {
                        containerName = ReceiverStorageContainer,
                        folder = ReceiverTargetFolderName,
                        mountPath = ReceiverTargetMountPath
                    },
                    storeReference = new
                    {
                        referenceName = ReceiverStorageResourceId,
                        type = "ArmResourceReference"
                    }
                }
            }
        };

        var receivedShare = await receivedSharesClient.CreateOrUpdateReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));
        return Utilities.LogResult(receivedShare.Value);
    }

    private static async Task<BinaryData> Receiver_UpdateReceivedShare(ReceivedSharesClient receivedSharesClient)
    {
        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = $"SDK-{Utilities.GenerateResourceName(4, 8)}-ReAttached",
                sink = new
                {
                    storeKind = ReceiverStorageKind,
                    properties = new
                    {
                        containerName = $"{ReceiverStorageContainer}reattached",
                        folder = ReceiverTargetFolderName,
                        mountPath = ReceiverTargetMountPath
                    },
                    storeReference = new
                    {
                        referenceName = ReAttachStorageResourceId,
                        type = "ArmResourceReference"
                    }
                }
            }
        };

        var receivedShare = await receivedSharesClient.CreateOrUpdateReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));
        return Utilities.LogResult(receivedShare.Value);
    }
}
```

## Clean up resources

To clean up the resources created for the quick start, use the following guidelines:

1. Within [Microsoft Purview governance portal](https://web.purview.azure.com/), [delete the sent share](how-to-share-data.md#delete-share).
1. Also [delete your received share](how-to-receive-share.md#delete-received-share).
1. Once the shares are successfully deleted, delete the target container and folder Microsoft Purview created in your target storage account when you received shared data.

## Next steps

* [FAQ for data sharing](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
