<properties
	pageTitle="Manage Azure storage resources with Storage Explorer (Preview) | Microsoft Azure"
	description="Describes how to use Microsoft Azure Storage Explorer (Preview) to create and manage Azure storage resources."
	services="visual-studio-online"
	documentationCenter="na"
	authors="TomArcher"
	manager="douge"
	editor="" />

 <tags
	ms.service="visual-studio-online"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="04/19/2016"
	ms.author="tarcher" />

# Manage Azure storage resources with Storage Explorer (Preview)

Microsoft Azure Storage Explorer (Preview) is a standalone tool that helps you easily manage your Azure storage accounts. It's useful in situations where you want to quickly manage storage outside of the Azure portal, such as when you're developing apps in Visual Studio. This preview release enables you to easily work with blob storage. You can create and delete containers, upload, download, and delete blobs, and search across all your containers and blobs. Advanced features enable developers and ops to work with SAS keys and policies. Windows developers can also use the Azure storage emulator to test their code using the Local Development storage account.

To view or manage storage resources in Storage Explorer, you need to be able to access an Azure storage account, either in your subscription or an external storage account. If you don't have a storage account, you can create one in just a couple of minutes. If you have an MSDN subscription, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Otherwise, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Manage Azure accounts and subscriptions

To see your Azure storage resources in Storage Explorer, you need to log in to an Azure account with one or more active subscriptions. If you have more than one Azure account, you can add them in Storage Explorer and then choose the subscriptions you want to include in the Storage Explorer resource view. If you haven't used Azure before, or you haven't added the necessary accounts to Visual Studio, you'll be prompted to log in to an Azure account.

### Add an Azure account to Storage Explorer

1.	Choose the **Settings** (gear) icon on the Storage Explorer toolbar.
1.	Choose the **Add an account** link. Log into the Azure account whose storage resources you want to browse. The account you just added should be selected in the account picker dropdown list. All subscriptions for that account appear under the account entry.

	![][0]

1.	Select the check boxes for the account subscriptions you want to browse and then choose the **Apply** button.

	![][1]

	The Azure storage resources for the selected subscriptions appear in Storage Explorer.

### Attach an external storage

1. Get the account name and key for the storage account you want to attach.
	1.	In the Azure preview portal, choose the storage account that want to attach.
	1.	In the **Manage** section of the **Settings** pane in the Azure preview portal, choose the **Keys** button.
	1.	Copy the **Storage Account Name** and **Primary Access Key** values.

		![][2]

1.	On the shortcut menu of the **Storage Accounts** node in Storage Explorer, choose the **Attach External Storage** command.

	![][3]

1. Enter the Storage Account Name in the **Account name** box and Primary Access Key in the **Account key** box. Choose the **Ok** button to continue.

	![][4]

	The external storage appears in Storage Explorer.

	![][5]

1. To remove the external storage, on the shortcut menu of the external storage, choose the Detach command.

	![][6]

## View and navigate storage resources

To navigate to an Azure storage resource and view its information in Storage Explorer, expand the storage type and then choose the resource. Information about the selected resource appears in the **Actions** and **Properties** tabs at the bottom of Storage Explorer.

![][7]

-	The **Actions** tab shows the actions you can take in Storage Explorer for the selected storage resource, such as opening, copying, or deleting it. Actions also appear on the shortcut menu of the resource.

-	The **Properties** tab shows properties of the storage resource, such as its type, locale, associated resource group, and URL.

All storage accounts have the action **Open in portal**. When you choose this action, Storage Explorer shows the selected storage account in the Azure preview portal.

Additional actions and property values appear based on the selected resource. For example, the Blob Containers, Queues, and Tables nodes all have a **Create** action. Individual items (such as blob containers) have actions such as **Open**, **Delete**, and **Get Shared Access Signature**. An actions to open the blob editor appears when you choose a storage account blob.

## Search storage accounts and blob containers

To find storage accounts and blob containers with a specific name in your Azure account subscriptions, enter the name in the **Search** box in Storage Explorer.

![][8]

As you enter characters in the **Search** box, only storage accounts or blob containers with names matching those characters appear in the resource tree. To clear the search, choose the **x** button in the **Search** box.

## Edit storage accounts

To add or change the contents of a storage account, choose the **Open Editor** command for that storage type. You can either choose actions on the shortcut menu of the selected item, or on the **Actions** tab at the bottom of Storage Explorer.

![][9]

You can create or delete blob containers, queues, and tables. You can also edit blobs in Storage Explorer by choosing the **Open Blob Container Editor** action.

### Edit a blob container

1.	Choose the **Open Blob Container Editor** action. The Blob Container Editor appears in the right pane.

	![][10]

1.	Choose the **Upload** button and then choose the **Upload Files** command.

	![][11]

	If the files you want to upload are in a single folder, you can choose the Upload Folder command instead.

1. In the **Upload files** dialog box, choose the ellipsis (**…**) button on the right side of the Files box to select the files you want to upload. Then, choose the type of blob you want to upload it as (block, page, or append). If you want, you can choose to upload the files to a folder in the blob container. Enter the name of the folder in the **Upload to folder (optional)** box. If the folder doesn’t exist, it will be created.

	![][12]

	In the following screenshot, three image files have been uploaded to a new folder called **My New Files** in the **Images** blob container.

	![][13]

	Buttons on the blob editor toolbar let you to select, download, open, copy, and delete files and more. The **Activity** pane at the bottom of the dialog shows whether your operation was successful and enables you to remove only successful activities from view, or clear the pane entirely. Choose the **+** icon next to the uploaded files to view a detailed list of uploaded files.

## Create a Shared Access Signature (SAS)

For some operations, you may need an SAS to access a storage resource. You can create one using Storage Explorer.

1.	Select the item for which you want to create an SAS and then choose the **Get Shared Access Signature** command in the **Actions** pane or on the item’s shortcut menu.

	![][14]

1.	In the **Shared Access Signature** dialog box, choose the policy, start and expiration dates, and time zone. Also, select the check boxes for the access levels you want for the resource, such as read-only, read-write, etc. When you’re done, choose the **Create** button to create the SAS.

	![][15]

1.	The **Shared Access Signature** dialog box lists the container along with the URL and QueryStrings you can use to access the storage resource. Choose the **Copy** button to copy the strings.

	![][16]

## Manage SAS and permissions

To control access to blob containers, you can choose the **Manage Access Control List** and **Set Public Access Level** commands.

-	Manage Access Control List lets you add, edit, and remove access policies (whether users can read, write and so forth) on the selected blob container.
-	Set Public Access Level lets you determine how much access public users get to the resource.  

-

1.	Choose the blob container and then choose the **Manage Access Control List** command on the shortcut menu or in the **Actions** pane.

	![][17]

1.	In the **Access Control List** dialog box, choose the **Add** button to add access policies. Choose an access policy and then select permissions for it. When you’re done, choose the **Save** button.

	![][18]

1.	To set an access level for a blob container, choose it in Storage Explorer and then choose the **Set Public Access Level** command on the shortcut menu or in the **Actions** pane.

	![][19]

1.	In the **Set Container Public Access Level** dialog box, select the option button for the level of access you want to give public users, then choose the **Apply** button.

	![][20]

## Next steps
Learn about the features in Azure Storage services by reading articles in [Introduction to Microsoft Azure Storage](./storage/storage-introduction.md).

[0]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AddAccount1c.png
[1]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/AddAccount2c.png
[2]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/External1c.png
[3]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/External2c.png
[4]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/External3c.png
[5]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/External4c.png
[6]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/External5c.png
[7]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Navigatec.png
[8]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Searchc.png
[9]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Edit1c.png
[10]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Edit2c.png
[11]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Edit3c.png
[12]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Edit4c.png
[13]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/Edit5c.png
[14]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/SAS1c.png
[15]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/SAS2c.png
[16]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/SAS3c.png
[17]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ManageSAS1c.png
[18]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ManageSAS2c.png
[19]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ManageSAS3c.png
[20]: ./media/vs-azure-tools-storage-manage-with-storage-explorer/ManageSAS4c.png
