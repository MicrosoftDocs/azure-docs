---
title: 'Quickstart: Share data using the .NET SDK'
description: This article guides you through sharing and receiving data using Microsoft Purview Data Sharing account through the .NET SDK.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.devlang: csharp
ms.topic: quickstart
ms.date: 02/16/2023
ms.custom: mode-api, references-regions
---

# Quickstart: Share and receive data with the Microsoft Purview Data Sharing .NET SDK

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this quickstart, you'll use the .NET SDK to share data and receive shares from Azure Data Lake Storage (ADLS Gen2) or Blob storage accounts. The article includes code snippets that allow you to create, accept, and manage shares using Microsoft Purview Data Sharing.

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

>[!NOTE]
>This feature has been updated in February 2023, and the SDK and permissions needed to view and manage data shares in Microsoft Purview have changed.
>
>- No permissions are now required in Microsoft Purview to use the SDK to create and manage shares. (Reader permissions are needed to use the Microsoft Purview Governance Portal for sharing data.)
>- Permissions are still required on storage accounts.
>
> See the updated [NuGet package](#install-nuget-packages) and [updated code snippets](#create-a-sent-share) to use the updated SDK.

[!INCLUDE [data-share-quickstart-prerequisites](includes/data-share-quickstart-prerequisites.md)]

### Visual Studio

The walkthrough in this article uses Visual Studio 2022. The procedures for Visual Studio 2013, 2015, 2017, or 2019 may differ slightly.

### Azure .NET SDK

Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/) on your machine.

## Use a service principal

In the code snippets in this tutorial, you can authenticate either using your own credentials or using a service principal.
To set up a service principal, follow these instructions:

1. In [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you're creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
1. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application), get the **application ID**,**tenant ID**, and **object ID**, and note down these values that you use later in this tutorial.
1. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#set-up-authentication), get the **authentication key**, and note down this value that you use later in this tutorial.
1. [assign the application to these roles:](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application)

  |User| Azure Storage Account Roles | Microsoft Purview Collection Roles |
  |:--- |:--- |:--- |
  | **Data Provider** |Owner OR Blob Storage Data Owner|Data Share Contributor|
  | **Data Consumer** |Contributor OR Owner OR Storage Blob Data Contributor OR Blob Storage Data Owner|Data Share Contributor|

## Create a Visual Studio project

Next, create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App**. .NET version 6.0 or above is required.
3. In **Project name**, enter **PurviewDataSharingQuickStart**.
4. Select **Create** to create the project.

## Install NuGet packages

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**.
1. In the **Package Manage Console** run the .NET cli add package command shown on this page to add the NuGet package: [Microsoft.Azure.Analytics.Purview.Sharing NuGet package](https://www.nuget.org/packages/Azure.Analytics.Purview.Sharing).
1. In the **Package Manager Console** pane, run the following commands to install packages.

    ```powershell
    Install-Package Azure.Analytics.Purview.Sharing -IncludePrerelease
    Install-Package Azure.Identity
    ```

    >[!TIP]
    >If you get an error that reads "Could not find any project in..." when attempting these commands, you may just need to move a folder level down in your project. Try the command `dir` to list folders in your directory, then use 'cd \<name of the project folder>' to move down a level to your project folder. Then try again.

## Create a sent share

This script creates a data share that you can send to internal or external users.
To use it, be sure to fill out these variables:

- **SenderTenantId** - the [Azure Tenant ID](/partner-center/find-ids-and-domain-names#find-the-microsoft-azure-ad-tenant-id-and-primary-domain-name) for the sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data will be sent from.
- **ShareName** - A display name for your sent share.
- **ShareDescription** - (optional) A description for your sent share.
- **SenderStorageKind** - either BlobAccount or AdlsGen2Account.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **SenderStorageContainer** - the name of the container where the data to be shared is stored.
- **SenderPathToShare** - the file/folder path to the data to be shared.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.
- **SentShareID** - (optional) This option must be a GUID, and the current value generates one for you, but you can replace it with a different value if you would like.
- **ReceiverVisiblePath** - (optional) The name for the share the receiver will see. Currently set to a GUID, but GUID is not required.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderTenantId = "<Sender Identity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    private static string ShareName = "<Share Display Name>";
    private static string ShareDescription = "Share created using the SDK.";
    private static string SenderStorageKind = "<Sender Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";
    private static string SenderStorageContainer = "<Share Data Container Name>";
    private static string SenderPathToShare = "<File/Folder Path To Share>";

    // Set if using Service principal to create shares
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Value If Desired.
    private static string SentShareId = Guid.NewGuid().ToString();
    private static string ReceiverVisiblePath = Guid.NewGuid().ToString();

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
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    private static async Task<BinaryData> Sender_CreateSentShare()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

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
                displayName = ShareName,
                description = ShareDescription,
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

        Operation<BinaryData> sentShare = await sentSharesClient.CreateOrReplaceSentShareAsync(WaitUntil.Completed, SentShareId, RequestContent.Create(inPlaceSentShareDto));
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(sentShare.Value);
        Console.ForegroundColor = Console.ForegroundColor;
        return sentShare.Value;
    }
}
```

## Send invitation to a user

This script sends an email invitation for a share to a user. If you want to send an invitation to a service principal, [see the next code example](#send-invitation-to-a-service).
To use it, be sure to fill out these variables:

- **RecipientUserEmailId** - Email address for the user to send the invitation to.
- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data will be sent from.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **SentShareDisplayName** - the name of the sent share you're sending an invitation for.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.
- **InvitationId** - (optional) This option must be a GUID, and the current value generates one for you, but you can replace it with a different value if you would like.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string RecipientUserEmailId = "<Target User's Email Id>";

    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to send invitation
    private static bool UseServiceTokenCredentials = false;
    private static string SenderClientId = "<Sender Application (Client) Id>";
    private static string SenderClientSecret = "<Sender Application (Client) Secret>";

    private static string SentShareDisplayName = "<Name of share you're sending an invite for.>";
    private static string InvitationId = Guid.NewGuid().ToString();

    // General Configs
    private static string SenderPurviewEndPoint = $"https://{SenderPurviewAccountName}.purview.azure.com";
    private static string SenderShareEndPoint = $"{SenderPurviewEndPoint}/share";
    private static int StepCounter = 0;

    private static async Task Main(string[] args)
    {
        try
        {

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoUser - START");
            await Sender_CreateUserRecipient();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoUser - FINISH");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }

    private static async Task<BinaryData> Sender_CreateUserRecipient()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

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

        var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("{0}. {1}...", ++StepCounter, "Get a Specific Sent Share");
        Console.ForegroundColor = Console.ForegroundColor;

        var mySentShare = allSentShares.First(sentShareDoc =>
        {
            var doc = JsonDocument.Parse(sentShareDoc).RootElement;
            var props = doc.GetProperty("properties");
            return props.GetProperty("displayName").ToString() == SentShareDisplayName;
        });

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("My Sent Share Id: " + JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString());
        Console.ForegroundColor = Console.ForegroundColor;

        var SentShareId = JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString();

        var sentInvitation = await sentSharesClient.CreateSentShareInvitationAsync(SentShareId, InvitationId, RequestContent.Create(invitationData));

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(sentInvitation.Content);
        Console.ForegroundColor = Console.ForegroundColor;

        return sentInvitation.Content;
    }
}
```

## Send invitation to a service

This script sends an email invitation for a share to a service principal. If you want to send an invitation to a user, [see the previous sample](#send-invitation-to-a-user).
To use it, be sure to fill out these variables:

- **RecipientApplicationTenantId** - the Azure Tenant ID for the receiving service principal.
- **RecipientApplicationObjectId** - the object ID for the receiving service principal.
- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data will be sent from.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **SentShareDisplayName** - the name of the sent share you're sending an invitation for.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.
- **InvitationId** - (optional) This option must be a GUID, and the current value generates one for you, but you can replace it with a different value if you would like.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string RecipientApplicationTenantId = "<Target Application's Tenant Id>";
    private static string RecipientApplicationObjectId = "<Target Application's Object Id>";

    private static string SentShareDisplayName = "<Name of share you're sending an invite for.>";
    private static string InvitationId = Guid.NewGuid().ToString();

    private static string SenderTenantId = "<Sender Indentity's Tenant ID>";
    private static string SenderPurviewAccountName = "<Sender Purview Account Name>";

    private static string SenderStorageResourceId = "<Resource ID for storage account that has been shared>";

    // Set if using Service principal to send invitation
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

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoService - START");
            await Sender_CreateServiceRecipient();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: SendtoService - FINISH");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }

    private static async Task<BinaryData> Sender_CreateServiceRecipient()
    {

        TokenCredential senderCredentials = UseServiceTokenCredentials
                ? new ClientSecretCredential(SenderTenantId, SenderClientId, SenderClientSecret)
                : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = SenderTenantId });

        SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

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


        var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();
        var mySentShare = allSentShares.First(sentShareDoc =>
        {
            var doc = JsonDocument.Parse(sentShareDoc).RootElement;
            var props = doc.GetProperty("properties");
            return props.GetProperty("displayName").ToString() == SentShareDisplayName;
        });

        var SentShareId = JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString();

        var sentInvitation = await sentSharesClient.CreateSentShareInvitationAsync(SentShareId, InvitationId, RequestContent.Create(invitationData));
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(sentInvitation.Content);
        Console.ForegroundColor = Console.ForegroundColor;
        return sentInvitation.Content;
    }

}
```

## List sent shares

This script lists all the sent shares for a specific storage resource.
To use it, be sure to fill out these variables:

- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data was sent from.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where shares have been sent from.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderTenantId = "<Sender Tenant ID>";
    private static string SenderPurviewAccountName = "<Name of the Microsoft Purview account>";
    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to list shares
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

            SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();
            Console.WriteLine(allSentShares);
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## List all share recipients

This script lists all recipients for a specific share.
To use it, be sure to fill out these variables:

- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data was sent from.
- **SentShareDisplayName** - the name of the sent share you're listing recipients for.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareDisplayName = "<Name of share you're listing recipients for.>";
    private static string SenderTenantId = "<Sender Tenant ID>";
    private static string SenderPurviewAccountName = "<Name of the Microsoft Purview account>";

    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to list recipients
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

            SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();
            var mySentShare = allSentShares.First(sentShareDoc =>
            {
                var doc = JsonDocument.Parse(sentShareDoc).RootElement;
                var props = doc.GetProperty("properties");
                return props.GetProperty("displayName").ToString() == SentShareDisplayName;
            });

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("My Sent Share Id: " + JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString());
            Console.ForegroundColor = Console.ForegroundColor;

            var SentShareId = JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString();

            var allRecipients = await sentSharesClient.GetAllSentShareInvitationsAsync(SentShareId).ToResultList();
            Console.WriteLine(allRecipients);

        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## Delete recipient

This script removes a share invitation, and therefore the share, for a recipient.
To use it, be sure to fill out these variables:

- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data was sent from.
- **SentShareDisplayName** - the name of the sent share you're removing a recipient for.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **RecipientUserEmailId** - Email address for the user you want to delete.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SentShareDisplayName = "<Name of share you're removing a recipient for.>";
    private static string SenderTenantId = "<Sender Tenant ID>";
    private static string SenderPurviewAccountName = "<Name of the Microsoft Purview account>";
    private static string RecipientUserEmailId = "<Target User's Email Id>";

    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to delete recipients
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

            SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();

            var mySentShare = allSentShares.First(sentShareDoc =>
            {
                var doc = JsonDocument.Parse(sentShareDoc).RootElement;
                var props = doc.GetProperty("properties");
                return props.GetProperty("displayName").ToString() == SentShareDisplayName;
            });

            var SentShareId = JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString();

            var allRecipients = await sentSharesClient.GetAllSentShareInvitationsAsync(SentShareId).ToResultList();

            var recipient = allRecipients.First(recipient =>
            {
                var doc = JsonDocument.Parse(recipient).RootElement;
                var props = doc.GetProperty("properties");
                return props.TryGetProperty("targetEmail", out JsonElement rcpt) && rcpt.ToString() == RecipientUserEmailId;
            });

            var recipientId = JsonDocument.Parse(recipient).RootElement.GetProperty("id").ToString();

            await sentSharesClient.DeleteSentShareInvitationAsync(WaitUntil.Completed, SentShareId, recipientId);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Remove Id: " + JsonDocument.Parse(recipient).RootElement.GetProperty("id").ToString());
            Console.WriteLine("Complete");
            Console.ForegroundColor = Console.ForegroundColor;

        }

        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## Delete sent share

This script deletes a sent share.
To use it, be sure to fill out these variables:

- **SenderTenantId** - the Azure Tenant ID for the share sender's identity.
- **SenderPurviewAccountName** - the name of the Microsoft Purview account where the data was sent from.
- **SentShareDisplayName** - the name of the sent share you're listing recipients for.
- **SenderStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be sent from.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to create the shares, set this to **true**.
- **SenderClientId** - (optional) If using a service principal to create the shares, this is the Application (client) ID for the service principal.
- **SenderClientSecret** - (optional) If using a service principal to create the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string SenderTenantId = "<Sender Tenant ID>";
    private static string SenderPurviewAccountName = "<Name of the Microsoft Purview account>";
    private static string SentShareDisplayName = "<Name of share you're removing.>";

    private static string SenderStorageResourceId = "<Sender Storage Account Resource Id>";

    // Set if using Service principal to delete share
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

            SentSharesClient? sentSharesClient = new SentSharesClient(SenderShareEndPoint, senderCredentials);

            var allSentShares = await sentSharesClient.GetAllSentSharesAsync(SenderStorageResourceId).ToResultList();

            var mySentShare = allSentShares.First(sentShareDoc =>
            {
                var doc = JsonDocument.Parse(sentShareDoc).RootElement;
                var props = doc.GetProperty("properties");
                return props.GetProperty("displayName").ToString() == SentShareDisplayName;
            });

            var SentShareId = JsonDocument.Parse(mySentShare).RootElement.GetProperty("id").ToString();

            await sentSharesClient.DeleteSentShareAsync(WaitUntil.Completed, SentShareId);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Remove Id: " + SentShareId);
            Console.WriteLine("Complete");
            Console.ForegroundColor = Console.ForegroundColor;

        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## Create a received share

This script allows you to receive a data share.
To use it, be sure to fill out these variables:

- **ReceiverTenantId** - the Azure Tenant ID for the user/service that is receiving the shared data.
- **ReceiverPurviewAccountName** - the name of the Microsoft Purview account where the data will be received.
- **ReceiverStorageKind** - either BlobAccount or AdlsGen2Account.
- **ReceiverStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be received.
- **ReceiverStorageContainer** - the name of the container where the shared data will be stored.
- **ReceiverTargetFolderName** - the folder path to where the shared data will be stored.
- **ReceiverTargetMountPath** - the mount path you'd like to use to store your data in the folder.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to receive the shares, set this to **true**.
- **ReceiverClientId** - (optional) If using a service principal to receive the shares, this is the Application (client) ID for the service principal.
- **ReceiverClientSecret** - (optional) If using a service principal to receive  the shares, add your client secret/authentication key.
- **ReceivedShareId** - (optional) This option must be a GUID, and the current value will generate one for you, but you can replace it with a different value if you would like.
- **ReceiverVisiblePath** - (optional) Name you want to use for the path for your received share.
- **ReceivedShareDisplayName** - (optional) A display name for your received share.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceiverStorageKind = "<Receiver Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string ReceiverStorageResourceId = "<Receiver Storage Account Resource Id>";
    private static string ReceiverStorageContainer = "<Container Name To Receive Data Under>";
    private static string ReceiverTargetFolderName = "<Folder Name to Received Data Under>";
    private static string ReceiverTargetMountPath = "<Mount Path to store Received Data Under>";

    //Use if using a service principal to receive a share
    private static bool UseServiceTokenCredentials = false;
    private static string ReceiverClientId = "<Receiver Caller Application (Client) Id>";
    private static string ReceiverClientSecret = "<Receiver Caller Application (Client) Secret>";

    // [OPTIONAL INPUTS] Override Values If Desired.
    private static string ReceivedShareId = Guid.NewGuid().ToString();
    private static string ReceiverVisiblePath = "ReceivedSharePath";

    private static string ReceivedShareDisplayName = "ReceivedShare";

    // General Configs
    private static string ReceiverPurviewEndPoint = $"https://{ReceiverPurviewAccountName}.purview.azure.com";
    private static string ReceiverShareEndPoint = $"{ReceiverPurviewEndPoint}/share";

    private static async Task Main(string[] args)
    {
        try
        {


            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateReceivedShare - START");
            await Receiver_CreateReceivedShare();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: CreateReceivedShare - FINISH");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    private static async Task<BinaryData> Receiver_CreateReceivedShare()
    {

        TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

        ReceivedSharesClient? receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var results = await receivedSharesClient.GetAllDetachedReceivedSharesAsync().ToResultList();
        var detachedReceivedShare = results;

        if (detachedReceivedShare == null)
        {
            throw new InvalidOperationException("No received shares found.");
        }



        var myReceivedShare = detachedReceivedShare.First(recShareDoc =>
        {
            var doc = JsonDocument.Parse(recShareDoc).RootElement;
            var props = doc.GetProperty("properties");
            return props.GetProperty("displayName").ToString() == ReceivedShareDisplayName;
        });

        var ReceivedShareId = JsonDocument.Parse(myReceivedShare).RootElement.GetProperty("id").ToString();


        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = ReceivedShareDisplayName,
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

        var receivedShare = await receivedSharesClient.CreateOrReplaceReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(receivedShare.Value);
        Console.ForegroundColor = Console.ForegroundColor;

        return receivedShare.Value;
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## List all received shares

This script lists all received shares on a storage account.
To use it, be sure to fill out these variables:

- **ReceiverTenantId** - the Azure Tenant ID for the user/service that is receiving the shared data.
- **ReceiverPurviewAccountName** - the name of the Microsoft Purview account where the data was received.
- **ReceiverStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data has been shared.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to receive the shares, set this to **true**.
- **ReceiverClientId** - (optional) If using a service principal to receive the shares, this is the Application (client) ID for the service principal.
- **ReceiverClientSecret** - (optional) If using a service principal to receive  the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceiverStorageResourceId = "<Storage Account Resource Id that is housing shares>";

    //Use if using a service principal to list shares
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

            ReceivedSharesClient? receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

            var allReceivedShares = await receivedSharesClient.GetAllAttachedReceivedSharesAsync(ReceiverStorageResourceId).ToResultList();
            Console.WriteLine(allReceivedShares);
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## Update received share

This script allows you to update the storage location for a received share. Just like creating a received share, you add the information for the storage account where you want the data to be housed.
To use it, be sure to fill out these variables:

- **ReceiverTenantId** - the Azure Tenant ID for the user/service that is receiving the shared data.
- **ReceiverPurviewAccountName** - the name of the Microsoft Purview account where the data will be received.
- **ReceiverStorageKind** - either BlobAccount or AdlsGen2Account.
- **ReceiverStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data has been shared.
- **ReAttachStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data will be received.
- **ReceiverStorageContainer** - the name of the container where the shared data will be stored.
- **ReceiverTargetFolderName** - the folder path to where the shared data will be stored.
- **ReceiverTargetMountPath** - the mount path you'd like to use to store your data in the folder.
- **ReceivedShareDisplayName** - The display name for your received share.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to receive the shares, set this to **true**.
- **ReceiverClientId** - (optional) If using a service principal to receive the shares, this is the Application (client) ID for the service principal.
- **ReceiverClientSecret** - (optional) If using a service principal to receive  the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.ComponentModel;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceiverStorageKind = "<Receiver Storage Account Kind (BlobAccount / AdlsGen2Account)>";
    private static string ReceiverStorageResourceId = "<Storage Account Resource Id for the account where the share is currently attached.>";
    private static string ReAttachStorageResourceId = "<Storage Account Resource Id For Reattaching Received Share>";
    private static string ReceiverStorageContainer = "<Container Name To Receive Data Under>";
    private static string ReceiverTargetFolderName = "<Folder Name to Received Data Under>";
    private static string ReceiverTargetMountPath = "<Mount Path to Received Data Under>";

    private static string ReceivedShareDisplayName = "<Display name of your received share>";

    //Use if using a service principal to update the share
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

            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: UpdateReceivedShare - START");
            await Receiver_UpdateReceivedShare();
            Console.WriteLine($"{DateTime.Now.ToShortTimeString()}: UpdateReceivedShare - FINISH");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }

    private static async Task<BinaryData> Receiver_UpdateReceivedShare()
    {

        TokenCredential receiverCredentials = UseServiceTokenCredentials
            ? new ClientSecretCredential(ReceiverTenantId, ReceiverClientId, ReceiverClientSecret)
            : new DefaultAzureCredential(new DefaultAzureCredentialOptions { AuthorityHost = new Uri("https://login.windows.net"), TenantId = ReceiverTenantId });

        ReceivedSharesClient? receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

        if (receivedSharesClient == null)
        {
            throw new InvalidEnumArgumentException("Invalid Received Shares Client.");
        }

        var attachedReceivedShareData = new
        {
            shareKind = "InPlace",
            properties = new
            {
                displayName = ReceivedShareDisplayName,
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
                        referenceName = ReAttachStorageResourceId,
                        type = "ArmResourceReference"
                    }
                }
            }
        };

        var allReceivedShares = await receivedSharesClient.GetAllAttachedReceivedSharesAsync(ReceiverStorageResourceId).ToResultList();

        var myReceivedShare = allReceivedShares.First(recShareDoc =>
        {
            var doc = JsonDocument.Parse(recShareDoc).RootElement;
            var props = doc.GetProperty("properties");
            return props.GetProperty("displayName").ToString() == ReceivedShareDisplayName;
        });

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("My Received Share Id: " + JsonDocument.Parse(myReceivedShare).RootElement.GetProperty("id").ToString());
        Console.ForegroundColor = Console.ForegroundColor;


        var ReceivedShareId = JsonDocument.Parse(myReceivedShare).RootElement.GetProperty("id").ToString();

        var receivedShare = await receivedSharesClient.CreateOrReplaceReceivedShareAsync(WaitUntil.Completed, ReceivedShareId, RequestContent.Create(attachedReceivedShareData));

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine(receivedShare.Value);
        Console.ForegroundColor = Console.ForegroundColor;

        return receivedShare.Value;
    }

    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
    }
}
```

## Delete received share

This script deletes a received share.
To use it, be sure to fill out these variables:

- **ReceiverTenantId** - the Azure Tenant ID for the user/service that is receiving the shared data.
- **ReceiverPurviewAccountName** - the name of the Microsoft Purview account where the data will be received.
- **ReceivedShareDisplayName** - The display name for your received share.
- **ReceiverStorageResourceId** - the [resource ID for the storage account](../storage/common/storage-account-get-info.md#get-the-resource-id-for-a-storage-account) where the data has been shared.
- **UseServiceTokenCredentials** - (optional) If you want to use a service principal to receive the shares, set this to **true**.
- **ReceiverClientId** - (optional) If using a service principal to receive the shares, this is the Application (client) ID for the service principal.
- **ReceiverClientSecret** - (optional) If using a service principal to receive  the shares, add your client secret/authentication key.

```C# Snippet:Azure_Analytics_Purview_Share_Samples_01_Namespaces
using Azure;
using Azure.Analytics.Purview.Sharing;
using Azure.Core;
using Azure.Identity;
using System.Text.Json;

public static class PurviewDataSharingQuickStart
{
    // [REQUIRED INPUTS] Set To Actual Values.
    private static string ReceiverTenantId = "<Receiver Indentity's Tenant ID>";
    private static string ReceiverPurviewAccountName = "<Receiver Purview Account Name>";

    private static string ReceivedShareDisplayName = "<Display name of your received share>";

    private static string ReceiverStorageResourceId = "<Storage Account Resource Id for the account where the share is currently attached.>";

    //Use if using a service principal to delete share.
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

            ReceivedSharesClient? receivedSharesClient = new ReceivedSharesClient(ReceiverShareEndPoint, receiverCredentials);

            var allReceivedShares = await receivedSharesClient.GetAllAttachedReceivedSharesAsync(ReceiverStorageResourceId).ToResultList();

            var myReceivedShare = allReceivedShares.First(recShareDoc =>
            {
                var doc = JsonDocument.Parse(recShareDoc).RootElement;
                var props = doc.GetProperty("properties");
                return props.GetProperty("displayName").ToString() == ReceivedShareDisplayName;
            });

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("My Received Share Id: " + JsonDocument.Parse(myReceivedShare).RootElement.GetProperty("id").ToString());
            Console.ForegroundColor = Console.ForegroundColor;

            var ReceivedShareId = JsonDocument.Parse(myReceivedShare).RootElement.GetProperty("id").ToString();

            await receivedSharesClient.DeleteReceivedShareAsync(WaitUntil.Completed, ReceivedShareId);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Delete Complete");
            Console.ForegroundColor = Console.ForegroundColor;
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ForegroundColor = Console.ForegroundColor;
        }
    }
    public static async Task<List<T>> ToResultList<T>(this AsyncPageable<T> asyncPageable)
    {
        List<T> list = new List<T>();

        await foreach (T item in asyncPageable)
        {
            list.Add(item);
        }

        return list;
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
