<properties
    pageTitle="Azure Storage Account List"
    description="Manage your storage account settings using the Azure Toolkit for Eclipse"
    services=""
    documentationCenter="java"
    authors="rmcmurray"
    manager="wpickett"
    editor=""/>

<tags
    ms.service="multiple"
    ms.workload="na"
    ms.tgt_pltfrm="multiple"
    ms.devlang="Java"
    ms.topic="article"
    ms.date="08/11/2016" 
    ms.author="robmcm"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/dn205108.aspx -->

# Azure Storage Account List #

Azure storage accounts enable download locations to be used for your JDK, application server, and arbitrary components, as well as for storing state when using caching. Eclipse maintains a list of known storage accounts that are available to your projects in your Eclipse workspace. To open the **Storage Accounts** dialog, which is used to manage that list, within Eclipse, click **Window**, click **Preferences**, expand **Azure**, and then click **Storage Accounts**.

The following shows the **Storage Accounts** dialog.

![][ic719496]

This dialog can also be opened from an **Accounts** link on dialog boxes that use storage accounts, such as the following:

* The **JDK** tab of the **Server Configuration** dialog.
* The **Server** tab of the **Server Configuration** dialog.
* The **Add Component** dialog.
* The **Caching** properties dialog.

## To import your storage accounts using a publish settings file ##

1. Within the **Storage Accounts** dialog, click **Import from PUBLISH-SETTINGS file**.
2. (Skip this step if you have already saved a publish settings file to your local machine.) In the **Import Subscription Information** dialog, click **Download PUBLISH-SETTINGS File**. If you are not yet logged into your Azure account, you will be prompted to log in. Then you'll be prompted to save an Azure publish settings file. (You can ignore the resulting instructions shown on the logon pages - they are provided by the Azure portal and are intended for Visual Studio users.) Save it to your local machine.
3. Still in the **Import Subscription Information** dialog, click the **Browse** button, select the publish settings file that you saved locally previously, and then click **Open**.
4. Click **OK** to close the **Import Subscription Information** dialog.

## To create a new storage account ##

1. Within the **Storage Accounts** dialog, click **Add**.
2. Within the **Add Storage Account** dialog, click **New**.
3. Within the **New Storage Account** dialog, specify values for the following:
    * Storage account name.
    * Location of the storage account.
    * Description of the storage account.
    * The subscription to which the storage account belongs.
4. Click **OK** to close the **New Storage Account** dialog.

It may take several minutes for your storage account to be created. After it is created, click **OK** to close the **Add Storage Account** dialog, and your new storage account will be added to the list of available storage accounts.

## To add an existing storage account to the list ##

1. If you do not already have a Azure storage account, create one by following the steps listed in the **To create a new storage account section** above. (Alternatively, you can create a new storage account at the [Azure Management Portal][].)
2. Within the **Storage Accounts** dialog, click **Add**.
3. Within the **Add Storage Account** dialog, enter values for **Name** and **Access Key**. The account name and access key must be for an existing Azure storage account. Use the **Storage** section of the [Azure Management Portal][] to view your storage account names and keys. Your **Add Storage Account** dialog will look similar to the following.

    ![][ic719497]

4. Click **OK** to close the **Add Storage Account** dialog.

## To modify a storage account to use a new access key ##

1. Within the **Storage Accounts** dialog, click the storage account that you want to edit and then click **Edit**.
2. Within the **Edit Storage Account Access Key** dialog, modify the **Access Key** value.
3. Click **OK** to close the **Edit Storage Account Access Key** dialog.

## To remove a storage account from the list maintained in Eclipse ##

1. Within the **Storage Accounts** dialog, click the storage account that you want to edit and then click **Remove**.
2. Click **OK** when prompted to remove the storage account.

>[AZURE.NOTE] Removing the storage account through the **Storage Accounts** dialog only removes it from the list of storage accounts viewable within Eclipse. It does not remove the storage account from your Azure subscription. Additionally, the storage account could appear again in your list after Eclipse reloads the details of your subscription.

## See Also ##

[Azure Toolkit for Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

[Creating a Hello World Application for Azure in Eclipse][]

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[What's New in the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699552

<!-- IMG List -->

[ic719496]: ./media/azure-toolkit-for-eclipse-azure-storage-account-list/ic719496.png
[ic719497]: ./media/azure-toolkit-for-eclipse-azure-storage-account-list/ic719497.png
