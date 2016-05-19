<properties
	pageTitle="Getting started with Storage Explorer (Preview) | Microsoft Azure"
	description="Manage Azure storage resources with Storage Explorer (Preview)"
	services="visual-studio-online"
	documentationCenter="na"
	authors="TomArcher"
	manager="douge"
	editor="" />

 <tags
	ms.service="visual-studio-online"
	ms.devlang="multiple"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="05/19/2016"
	ms.author="tarcher" />

# Getting started with Storage Explorer (Preview)

## Overview 

Microsoft Azure Storage Explorer (Preview) is a standalone tool that enables you to manage your Azure storage accounts. In this article, you'll see how to connect to one or more Azure accounts to view and manager their associated storage accounts and resources.  

## Prerequisites

- [Download and install Storage Explorer (preview)](http://go.microsoft.com/fwlink/?LinkId=708343)

## Connect to a storage account or service

Storage Explorer (Preview) allows you to connect to your own Azure storage accounts as well as storage accounts and services shared from other Azure subscriptions:

- [Connect to an Azure subscription](#connect-to-an-azure-subscription) - Manage storage resources belonging to your Azure subscription.
- [Attach to external storage](#attach-or-detach-an-external-storage-account) - Manage storage resources belonging to another Azure subscription using the storage account's account name and key.
- [Attach account using SAS](#attach-account-using-sas) - Manage storage resources belonging to another Azure subscription using a SAS.
- [Attach service using SAS](#attach-service-using-sas) - Manage a specific storage service (blob container, queue, or table) belonging to another Azure subscription using a SAS.

## Connect to an Azure subscription

> [AZURE.NOTE] If you don't have an Azure account, you can [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

1. Start Storage Explorer (Preview). 

1. If you are running Storage Explorer (Preview) for the first time or if you've run Storage Explorer (Preview) before, but haven't
connected to an Azure account, you'll see an infobar that allows you to connect to an Azure account.

	![][0]
	
1. Tap **Connect to Microsoft Azure** and follow the dialogs to sign in with a Microsoft account that is associated with at least one active Azure subscription.

Once you successfully sign in with a Microsoft account, the left pane of the Storage Explorer (Preview) will populate with all the storage accounts associated with all of the Azure subscriptions associated with the 
Microsoft account.

### Filter the Azure subscriptions

Storage Explorer (Preview) allows you to filter which Azure subscriptions associated with your signed-in Microsoft account(s) will have their storage accounts listed in the left-pane.

1. Tap the **Settings** (gear) icon.

	![][1]   

1. 	At the top of left pane, you will see a drop-down list containing all of the Microsoft accounts you've signed into. 

	![][3]
	 
1.	Tap the down-arrow next to the drop-down list to see all of the signed-into Microsoft accounts as well as a link for adding (signing into) additional Microsoft accounts.

	![][4]

1.	Select the desired Microsoft account from the drop-down list.

1. 	The left pane will display all the Azure subscriptions associated with the selected Microsoft account.
The checkbox to the left of each Azure subscription enables you to specify whether
or not you want Storage Explorer (Preview) to list all the storage accounts associated with that Azure subscriptions. Checking/unchecking **All subscriptions** toggles selecting all or none of the 
listed Azure subscriptions.

	![][2]  

1.	When you have finished selecting the Azure subscriptions you want to manage, tap **Apply**. The left pane will update to list all the storage accounts for each selected Azure subscription for the current Microsoft account. 

### Adding additional Microsoft accounts

The following steps walk you through connecting to additional Microsoft accounts to view each account's Azure subscription(s) and storage accounts.

1.	Tap the **Settings** (gear) icon.

	![][1]   

1. 	At the top of the left pane, you will see a drop-down list containing all of the currently connected Microsoft accounts.

	![][3]
	 
1.	Tap the down-arrow next to the drop-down list to see all of the signed-into Microsoft accounts as well as a link for adding (signing into) additional Microsoft accounts.

	![][4]

1.	Tap **Add an account** and follow the dialogs to sign into an account associated with at least one active Azure subscription.

1.	Select the check boxes for the Azure subscriptions you want to browse. 

	![][2]  

1.	Tap **Apply**.

### Switch between Microsoft accounts

While you can connect to multiple Microsoft accounts, the left pane shows only the storage accounts 
associated with the subscriptions for a single (current) Microsoft account. If you connect to multiple
Microsoft accounts, you can switch between the accounts by performing the following steps:

1.	Tap the **Settings** (gear) icon.

	![][1]   

1. 	At the top of the left pane, you will see a drop-down list containing all of the currently connected Microsoft accounts.

	![][3]
	 
1.	Tap the down-arrow next to the drop-down list to see all of the signed-into Microsoft accounts as well as a link for adding (signing into) additional Microsoft accounts.

	![][4]

1.	Tap the desired Microsoft account.

1.	Select the check boxes for the Azure subscriptions you want to browse. 

	![][2]  

1.	Tap **Apply**.
  

## Attach or detach an external storage account

Storage Explorer (Preview) provides the ability to attach to external storage accounts so that storage accounts can be easily shared. This section explains how to attach to (and detach from) external storage accounts.

### Get the storage account credentials

In order to share an external storage account, the owner of that account must first get the 
credentials - account name and key - for the account and then share that information with the 
person wanting to attach to that (external) account. Obtaining the storage account credentials
can be done via the Azure portal by following these steps: 

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	Tap **Browse**.
1.	Tap **Storage Accounts**.
1.	In the **Storage Accounts** blade, tap the desired storage account.
1.	In the **Settings** blade for the selected storage account, tap **Access keys**.

	![][5]
	
1.	In the **Access keys** blade, copy the **STORAGE ACCOUNT NAME** and **KEY 1** values for use when attaching to the storage account. 

	![][6]

### Attach to an external storage account

1.	In Storage Explorer (Preview), right-click **Storage Accounts**, and - from the context menu - select **Attach External Storage**.

	![][7]
	
1.	The section, *Get the storage account credentials*, explains how to obtain the 
storage account name and key 1 values. Those values will be used in this step. In 
the **Attach External Storage** dialog, enter the storage account name in the **Account name** box and the Key 1 value in the **Account key** box. Tap **OK** when done. 

	![][8]

	Once attached, the external storage account will be displayed with the text **(External)** appended to the storage account name. 

	![][9]

### Detach from an external storage account

1. 	Right-click the external storage account you want to detach, and - from the context menu - 
select **Detach**.

	![][10]

1.	When the confirmation message box appears, tap **Yes** to confirm the detachment from the external storage account.

	![][12]

## Attach account using SAS

A SAS (Shared Access Signature) gives the admin of an Azure subscription the ability to
grant access to a storage account on a temporary basis without having to provide their Azure
subscription credentials. 

To illustrate this, let's say UserA is an admin of an Azure subscription, and UserA wants to 
allow UserB to access a storage account for a limited time with certain permissions:

1. UserA generates a SAS (consisting of the connection string for the storage account) for a specific time period and with the desired permissions.
1. UserA shares the SAS with the person wanting access to the storage account - UserB, in our example.  
1. UserB uses Storage Explorer (Preview) to attach to the account belonging to UserA using the supplied SAS. 

### Get a SAS for the account you want to share

1.	Open Storage Explorer (Preview).
1.	In the left pane, right-click the storage account you want share, and - from the context menu - select **Get Shared Access Signature**.

	![][13]

1. On the **Shared Access Signature** dialog, specify the time frame and permissions you want for the account, and tap **Create**.

	![][14]
 
1. A second **Shared Access Signature** dialog will appear displaying the SAS. Tap **Copy** next to the **Connection String** to copy it to the clipboard. Tap **Close** to dismiss the dialog.

### Attach to the shared account using the SAS

1.	Open Storage Explorer (Preview).
1.	In the left pane, right-click **Storage Accounts**, and - from the context menu - select **Attach account using SAS**.
	![][15]

1. On the **Attach Account using SAS** dialog:

	- **Account Name** - Enter the name that you want to associated with this account. **NOTE:** The account name does not have to match the original storage account name for which the SAS was generated. 
 	- **Connection String** - Paste the connection string you copied earlier.
 	- Tap **OK** when done.
	
	![][16]

Once attached, the storage account will be displayed with the text (SAS) appended to the account name you supplied.

![][17]

## Attach service using SAS

The section [Attach account using SAS](#attach-account-using-sas) illustrates how 
an Azure subscription admin can grant temporary access to a storage account by generating (and sharing) a SAS for the storage account. Similarly, a SAS can be generated for a specific service (blob container, queue, or table) within a storage account.  

### Generate a SAS for the service you want to share

In this context, a service can be a blob container, queue, or table. The following sections
explain how to generate the SAS for the listed service:

- [Get the SAS for a blob container](./vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container)
- Get the SAS for a queue - *Coming soon*
- Get the SAS for a table - *Coming soon*

### Attach to the shared account service using the SAS

1.	Open Storage Explorer (Preview).
1.	In the left pane, right-click **Storage Accounts**, and - from the context menu - select **Attach service using SAS**.
	![][18]

1. On the **Attach Account using SAS** dialog, paste in the SAS URI you copied earlier, and tap **OK**.

	![][19]

Once attached, the newly attached service will be displayed under the **(Service SAS)** node. 

![][20]

## Search for storage accounts

If you have a long list of storage accounts, a quick way to locate a particular storage account is to use the search box at the top of the left pane. 

As you are typing into the search box, the left pane will display only the storage accounts that match the 
search value you've entered up to that point. The following screen shot illustrates an example where I've searched for all storage accounts where the storage account name contains the text "tarcher".

![][11]
	
To clear the search, tap the **x** button in the search box.

## Next steps
- [Manage Azure blob storage resources with Storage Explorer (Preview)](./vs-azure-tools-storage-explorer-blobs.md)

[0]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/connect-to-azure.png
[1]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/settings-gear.png
[2]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/filter-subscriptions.png
[3]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/filter-accounts.png
[4]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/accounts-drop-down.png
[5]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/access-keys.png
[6]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/access-keys-copy.png
[7]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-external-storage.png
[8]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-external-storage-dlg.png
[9]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/external-storage-account.png
[10]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/detach-external-storage.png
[11]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/storage-account-search.png
[12]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/detach-external-storage-confirmation.png
[13]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/get-sas-context-menu.png
[14]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/get-sas-dlg1.png
[15]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-account-using-sas-context-menu.png
[16]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-account-using-sas-dlg.png
[17]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-account-using-sas-finished.png
[18]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-service-using-sas-context-menu.png
[19]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-service-using-sas-dlg.png
[20]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/attach-service-using-sas-finished.png
