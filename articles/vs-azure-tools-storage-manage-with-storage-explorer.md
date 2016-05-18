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

- [Download and install Storage Explorer (preview)](http://go.microsoft.com/fwlink/?LinkId=708343)

## Connect to a storage account or service

Storage Explorer (Preview) allows you to connect to Azure storage accounts - or individual services such as a blob container, queue, or table - associated with your Azure subscription(s). In addition, you can attach to Azure storage accounts shared from another Azure subscription using either the subscription's credentials - account name and key - or a SAS (Shared Access Signature) provided by the Azure subscription owner.

- [Connect to an Azure subscription](#connect-to-an-azure-account)
- [Attach to external storage](#attach-or-detach-an-external-storage-account)
- [Attach Service using SAS]
- [Attach Account using SAS]

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
[12]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/detach-external-storage-confirmation.png