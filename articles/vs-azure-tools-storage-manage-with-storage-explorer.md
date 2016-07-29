<properties
	pageTitle="Getting started with Storage Explorer (Preview) | Microsoft Azure"
	description="Manage Azure storage resources with Storage Explorer (Preview)"
	services="visual-studio-online"
	documentationCenter="na"
	authors="TomArcher"
	manager="douge"
	editor="" />

 <tags
	ms.service="storage"
	ms.devlang="multiple"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="07/28/2016"
	ms.author="tarcher" />

# Getting started with Storage Explorer (Preview)

## Overview 

Microsoft Azure Storage Explorer (Preview) is a standalone app that enables you to easily work with Azure Storage data on Windows, OSX, and Linux. In this article, you'll learn the various ways of connecting to and managing your Azure storage accounts.

![][15]

## Prerequisites

- [Download and install Storage Explorer (preview)](http://www.storageexplorer.com)

## Connect to a storage account or service

Storage Explorer (Preview) provides a myriad ways to connect to storage accounts. This includes connecting to storage accounts associated with your Azure subscriptions, connecting to storage accounts and services shared from other Azure subscriptions, and even connecting to and managing local storage using the Azure Storage Emulator:

- [Connect to an Azure subscription](#connect-to-an-azure-subscription) - Manage storage resources belonging to your Azure subscription.
- [Work with local development storage](#work-with-local-development-storage) - Manage local storage using the Azure Storage Emulator. 
- [Attach to external storage](#attach-or-detach-an-external-storage-account) - Manage storage resources belonging to another Azure subscription using the storage account's account name and key.
- [Attach storage account using SAS](#attach-storage-account-using-sas) - Manage storage resources belonging to another Azure subscription using a SAS.
- [Attach service using SAS](#attach-service-using-sas) - Manage a specific storage service (blob container, queue, or table) belonging to another Azure subscription using a SAS.

## Connect to an Azure subscription

> [AZURE.NOTE] If you don't have an Azure account, you can [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

1. In Storage Explorer (Preview), select **Azure Account settings**. 

	![][0]

1. The left pane will now display all the Microsoft accounts you've logged into. To connect to another account, select **Add an account**, and follow the dialogs to sign in with a Microsoft account that is associated with at least one active Azure subscription.

	![][1]

1. Once you successfully sign in with a Microsoft account, the left pane will populate with the Azure subscriptions associated with that account. Select the Azure subscriptions with which you want to work, and then select **Apply**. (Selecting **All subscriptions** toggles selecting all or none of the listed Azure subscriptions.)

	![][3]

1. The left pane will now display the storage accounts associated with the selected Azure subscriptions.

	![][4]

## Work with local development storage

Storage Explorer (Preview) enables you to work against local storage using the Azure Storage Emulator. This allows you to write code against and test storage without necessarily having a storage account deployed on Azure (since the storage account is being emulated by the Azure Storage Emulator).

>[AZURE.NOTE] The Azure Storage Emulator is currently supported only for Windows. 

1. In the left pane of Storage Explorer (Preview), expand the **(Local and Attached** > **Storage Accounts** > **(Development)** node.

	![][21]

1. If you have not yet installed the Azure Storage Emulator, you'll be prompted to do so via an infobar. If the infobar is displayed, select **Download the latest version**, and install the emulator. 

	![][22]

1. Once the emulator is installed, you'll have the ability to create and work with local blobs, queues, and tables. To learn how to work with each storage account type, select on the appropriate link below:

	- [Manage Azure blob storage resources](./vs-azure-tools-storage-explorer-blobs.md)
	- Manage Azure file share storage resources - *Coming soon*
	- Manage Azure queue storage resources - *Coming soon*
	- Manage Azure table storage resources - *Coming soon*

## Attach or detach an external storage account

Storage Explorer (Preview) provides the ability to attach to external storage accounts so that storage accounts can be easily shared. This section explains how to attach to (and detach from) external storage accounts.

### Get the storage account credentials

In order to share an external storage account, the owner of that account must first get the 
credentials - account name and key - for the account and then share that information with the 
person wanting to attach to that (external) account. Obtaining the storage account credentials
can be done via the Azure portal by following these steps: 

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	Select **Browse**.
1.	Select **Storage Accounts**.
1.	In the **Storage Accounts** blade, select the desired storage account.
1.	In the **Settings** blade for the selected storage account, select **Access keys**.

	![][5]
	
1.	In the **Access keys** blade, copy the **STORAGE ACCOUNT NAME** and **KEY 1** values for use when attaching to the storage account. 

	![][6]

### Attach to an external storage account
To attach to an external storage account, you'll need the account's name and key. The section *Get the storage account credentials* 
explains how to obtain these values from the Azure portal. However, note that in the portal, the account key is called "key 1" so where 
the Storage Explorer (Preview) asks for an account key, you'll enter (or paste) the "key 1" value. 
 
1.	In Storage Explorer (Preview), select **Connect to Azure storage**.

	![][23]

1.	On the **Connect to Azure Storage** dialog, specify the account key ("key 1" value from the Azure portal), and then select **Next**.

	![][24] 

1.	In the **Attach External Storage** dialog, enter the storage account name in the **Account name** box, specify any other desired settings, and select **Next** when done. 

	![][8]

1.	In the **Connection Summary** dialog, verify the information. If you want to change anything, select **Back** and re-enter the desired settings. Once finished, select **Connect**.

1.	Once connected, the external storage account will be displayed with the text **(External)** appended to the storage account name. 

	![][9]

### Detach from an external storage account

1. 	Right-click the external storage account you want to detach, and - from the context menu - 
select **Detach**.

	![][10]

1.	When the confirmation message box appears, select **Yes** to confirm the detachment from the external storage account.

## Attach storage account using SAS

A [SAS (Shared Access Signature)](storage/storage-dotnet-shared-access-signature-part-1.md) gives the admin of an Azure subscription the ability to
grant access to a storage account on a temporary basis without having to provide their Azure
subscription credentials. 

To illustrate this, let's say UserA is an admin of an Azure subscription, and UserA wants to 
allow UserB to access a storage account for a limited time with certain permissions:

1. UserA generates a SAS (consisting of the connection string for the storage account) for a specific time period and with the desired permissions.
1. UserA shares the SAS with the person wanting access to the storage account - UserB, in our example.  
1. UserB uses Storage Explorer (Preview) to attach to the account belonging to UserA using the supplied SAS. 

### Get a SAS for the account you want to share

1.	In Storage Explorer (Preview), right-click the storage account you want share, and - from the context menu - select **Get Shared Access Signature**.

	![][13]

1. On the **Shared Access Signature** dialog, specify the time frame and permissions you want for the account, and select **Create**.

	![][14]
 
1. A second **Shared Access Signature** dialog will appear displaying the SAS. Select **Copy** next to the **Connection String** to copy it to the clipboard. Select **Close** to dismiss the dialog.

### Attach to the shared account using the SAS

1.	In Storage Explorer (Preview), select **Connect to Azure storage**.

	![][23]

1.	On the **Connect to Azure Storage** dialog, specify the connection string, and then select **Next**.

	![][24] 

1.	In the **Connection Summary** dialog, verify the information. If you want to change anything, select **Back** and re-enter the desired settings. Once finished, select **Connect**.

1.	Once attached, the storage account will be displayed with the text (SAS) appended to the account name you supplied.

	![][17]

## Attach service using SAS

The section [Attach storage account using SAS](#attach-storage-account-using-sas) illustrates how 
an Azure subscription admin can grant temporary access to a storage account by generating (and sharing) a SAS for the storage account. Similarly, a SAS can be generated for a specific service (blob container, queue, or table) within a storage account.  

### Generate a SAS for the service you want to share

In this context, a service can be a blob container, queue, or table. The following sections
explain how to generate the SAS for the listed service:

- [Get the SAS for a blob container](./vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container)
- Get the SAS for a file share - *Coming soon*
- Get the SAS for a queue - *Coming soon*
- Get the SAS for a table - *Coming soon*

### Attach to the shared account service using the SAS

1.	In Storage Explorer (Preview), select **Connect to Azure storage**.

	![][23]

1.	On the **Connect to Azure Storage** dialog, specify the SAS URI, and then select **Next**.

	![][24] 

1.	In the **Connection Summary** dialog, verify the information. If you want to change anything, select **Back** and re-enter the desired settings. Once finished, select **Connect**.

1.	Once attached, the newly attached service will be displayed under the **(Service SAS)** node.

	![][20]

## Search for storage accounts

If you have a long list of storage accounts, a quick way to locate a particular storage account is to use the search box at the top of the left pane. 

As you are typing into the search box, the left pane will display only the storage accounts that match the 
search value you've entered up to that point. The following screen shot illustrates an example where I've searched for all storage accounts where the storage account name contains the text "tarcher".

![][11]
	
To clear the search, select the **x** button in the search box.

## Next steps
- [Manage Azure blob storage resources with Storage Explorer (Preview)](./vs-azure-tools-storage-explorer-blobs.md)

[0]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/settings-icon.png
[1]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/add-account-link.png
[3]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/subscriptions-list.png
[4]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/storage-accounts-list.png
[5]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/access-keys.png
[6]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/access-keys-copy.png
[8]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-external-storage-dlg.png
[9]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/external-storage-account.png
[10]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/detach-external-storage.png
[11]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/storage-account-search.png
[12]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/detach-external-storage-confirmation.png
[13]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/get-sas-context-menu.png
[14]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/get-sas-dlg1.png
[15]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/mase.png
[17]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-account-using-sas-finished.png
[20]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-service-using-sas-finished.png
[21]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/local-storage-drop-down.png
[22]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/download-storage-emulator.png
[23]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/connect-to-azure-storage-icon.png
[24]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/connect-to-azure-storage-next.png
