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
	ms.date="05/18/2016"
	ms.author="tarcher" />

# Getting started with Storage Explorer (Preview)

## Overview 

Microsoft Azure Storage Explorer (Preview) is a standalone tool that enables you to manage your Azure storage accounts. 
In this article, you'll see how to connect to one or more Azure accounts to view and manager their associated 
storage accounts and resources.  

## Prerequisites

To complete this tutorial, you'll need the following:

- [Download and install Storage Explorer (preview)](http://go.microsoft.com/fwlink/?LinkId=708343)
- Microsoft Azure account. If you don't have an account, you can [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) 
or [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

## Connect to an Azure account

The first task when using Storage Explorer (Preview) is to sign into an account associated with one or more active Azure subscriptions. 

1. Start Storage Explorer (Preview). 

1. If you are running Storage Explorer (Preview) for the first time or if you've run Storage Explorer (Preview) before, but haven't
connected to an Azure account, you'll see an infobar that allows you to connect to your Azure account.

	![][0]
	
1. Tap **Connect to Microsoft Azure** and follow the dialogs to sign into an account associated with at least one active Azure subscription.

1. Once you successfully sign in, the left pane of the Storage Explorer (Preview) will populate with 
the account's active Azure subscriptions. 

## Filter the displayed Azure subscriptions

Once you connect to an account, the left pane of Storage Explorer (Preview) displays all
of the subscriptions associated with that account. If you have a large quantity of subscriptions, this 
list can be long and unwieldly. In order to filter, or pare down, the list of displayed subscriptions, 
follow these instructions:

1. Tap the **Settings** (gear) icon.

	![][1]   


1. 	At the top of left pane, you will see a drop-down list containing all of the accounts you've connected
to. 

	![][3]
	 
1.	Tap the accounts drop-down list to see all of the connected-to accounts as well as a link for adding more accounts.

	![][4]

1.	Select the desired account from the drop-down list.

1. 	The left pane will now display all of the subscriptions associated with the selected Azure account.
The checkboxes to the left of each subscription enables you to specify which subscriptions
you want displayed. Checking/unchecking **All subscriptions** toggles selecting all or none of the 
listed subscriptions.

	![][2]  

1.	When you have finished checking the subscriptions you want to manage, tap **Apply**. 

1.	The left pane will now display only the storage accounts associated with the subscriptions you selected.

## Add an Azure account to Storage Explorer (Preview)

Storage Explorer (Preview) allows you to connect to multiple accounts. To add an account, follow these steps:

1.	Tap the **Settings** (gear) icon.

	![][1]   

1. 	At the top of left pane, you will see a drop-down list containing all of the accounts you've connected
to. 

	![][3]
	 
1.	Tap the accounts drop-down list to see all of the connected-to accounts as well as a link for adding more accounts.

	![][4]

1.	Tap **Add an account** and follow the dialogs to sign into an account associated with at least one active Azure subscription.

1.	Select the check boxes for the account subscriptions you want to browse. 

	![][2]  

1.	Tap **Apply**.

## Attach or detach an external storage account

As you've seen, you can view the storage accounts associated with an account once you add that account to Storage Explorer (Preview).

In addition, you can also work with *external storage accounts* - those that are not associated with an added account.

This section explains how to attach to (and detach from) external storage accounts.

### Attach to an external storage account

1. Get the account name and key for the storage account you want to attach.
	1.	Sign in to the [Azure portal](https://portal.azure.com).
	1.	Tap **Browse**.
	1.	Tap **Storage Accounts**.
	1.	In the **Storage Accounts** blade, tap the desired storage account.
	1.	In the **Settings** blade for the selected storage account, tap **Access keys**.
	
		![][5]
		
	1.	In the **Access keys** blade, make note of (or copy to a safe place) the **STORAGE ACCOUNT NAME** and **KEY 1** values. (**Note:** The KEY 1 value is used interchangeably with the Primary Access Key that you'll need to provide later.)  
	
		![][6]

1.	In Storage Explorer (Preview), right-click **Storage Accounts**, and from its context menu, select **Attach External Storage**.

	![][7]
	
1.	In the **Attach External Storage** dialog, enter the Storage Account Name in the **Account name** box and Primary Access Key (Key 1 value copied before) in the **Account key** box. Tap **OK** when done. 

	![][8]

	Once attached, the external storage account will be displayed with the text **(External)** appended to the storage account name. 

	![][9]

### Detach from an external storage account

1. 	Right-click the external storage account you want to detach.

1.	From the storage account's context menu, select **Detatch**.

	![][10]

1.	When the confirmation message box appears, tap **Yes** to confirm the detachment from the external storage account.

## Search for storage accounts

If you have a long list of storage accounts, a quick way to locate a particular storage account is to use the search box. 

As you are typing into the search box, the left pane will display only the storage accounts that match the 
search value you've entered up to that point. The following screen shot illustrates an example where I've searched for all
storage accounts where the storage account name contains the text "tarcher".

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