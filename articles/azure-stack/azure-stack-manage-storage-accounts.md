<properties
	pageTitle="Manage Azure Stack storage accounts  | Microsoft Azure"
	description="Learn how to find, manage, recover and reclaim Azure Stack storage accounts"
	services="azure-stack"
	documentationCenter=""
	authors="AniAnirudh"
	manager="darmour"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/26/2016"
	ms.author="anirudha"/>

# Manage Storage Accounts in Azure Stack

Learn how to manage storage accounts in Azure Stack to find, recover,
and reclaim storage capacity based on business needs.

## Find a storage account

The list of storage accounts in the region can be viewed in Azure Stack
by:

1.  In an internet browser, navigate to
    [https://portal.azurestack.local](https://portal.azurestack.local/).

2.  Sign in to the Azure Stack portal as an administrator (using the
    credentials you provided during deployment)

3.  On the default dashboard – find **region management** list and click
    on the region you wish to explore – for example **(local**).

    ![](media/azure-stack-manage-storage-accounts/image1.png)

4.  Select **Storage** from the **Resource Providers** list.

    ![](media/azure-stack-manage-storage-accounts/image2.png)

5.  Now, on the storage Resource Provider Admin blade – scroll down to
    the “Storage accounts” tab and click on it.

    ![](media/azure-stack-manage-storage-accounts/image3.png)
    
    The resulting page is the list of storage accounts in that region.

    ![](media/azure-stack-manage-storage-accounts/image4.png)

By default, the first 10 accounts are displayed. You can choose to fetch
more by clicking on “load more” link at the bottom of the list <br>
OR <br>
If you are interested in a particular storage account – you can **filter
and fetch the relevant accounts** only.<br>

To filter for accounts:

1. Click on the filter button at the top of the blade.

2. On the filter blade, it allows you to specify **account name**,
    **subscription ID** or **status** to fine-tune the list of storage
    accounts to be displayed. Use them as appropriate.

3. Click update. The list should refresh accordingly.

    ![](media/azure-stack-manage-storage-accounts/image5.png)

4. To reset the filter – click on the filter button, clear out the
    selections and update.

The search text box, on the top of the storage accounts list blade, lets
you highlight the selected text in the list of accounts. This is
really handy in the case when the full name or id is not easily
available.<br>
You can use free text here to help find the account you are interested
in.

![](media/azure-stack-manage-storage-accounts/image6.png)


## Look at account details

Once you have located the accounts you are interested in viewing, you
can click on the particular account to view certain details. A new blade
will open with the account details like the type of the account,
creation time, location etc.

![](media/azure-stack-manage-storage-accounts/image7.png)


## Recover a deleted account

You may be in a situation where you would like to recover a deleted
account.<br>
In AzureStack there is a very simple way to do so.

1.  Go browse to the storage accounts list. [See find a storage account](#find-a-storage-account)

2.  Locate that particular account in the list. You may need to filter.

3.  Check the ‘State’ of the account. It should say “deleted”.

4.  Click on the account that opens the account details blade.

5.  On top of this blade – locate the “recover” button and click on it.

6.  Confirm by pressing “yes”

    ![](media/azure-stack-manage-storage-accounts/image8.png)

7.  The recovery is now in process…wait for indication that it was
    successful.
    You can also click on the “bell” icon at the top of the portal to
    view progress indications.

    ![](media/azure-stack-manage-storage-accounts/image9.png)

  Once the recovered account is successfully synchronized, one can go
  back to using it.

### Some Gotchas

- Your deleted account shows state as “out of retention”.

  This means that the deleted account has exceeded the retention period
  and may not be recoverable anymore.

- Your deleted account does not show in the accounts list.

  This could mean that the deleted account has already been garbage
  collected. In this case it cannot be recovered anymore. See “reclaim
  capacity” below.

## Set Retention Period

Retention period setting allows an admin to specify a time period in
days (between 0 and 9999 days) during which any deleted account can
potentially be recovered. The default retention period is set to 15
days. Setting the value to “0” means that any deleted account will
immediately be out of retention and marked for periodic garbage
collection.

To change the retention period –

1.  In an internet browser, navigate to
    [https://portal.azurestack.local](https://portal.azurestack.local/).

2.  Sign in to the Azure Stack portal as an administrator (using the
    credentials you provided during deployment)

3.  On the default dashboard – find **region management** list and click
    on the region you wish to explore – for example **(local**).

4.  Select **Storage** from the **Resource Providers** list.

5.  Click on the Settings icon on the top to open the setting blade.

6.  Click on configuration - retention period.

7.  You can edit the value and save it.

 This value will be immediately effective and reflect across your
 entire region.

    ![](media/azure-stack-manage-storage-accounts/image10.png)

## Reclaim capacity

One of the side effects of having a retention period is that a deleted
account will continue to consume capacity until it comes out of the
retention period. Now as an admin you may need a way to reclaim this
deleted accounts space even though the retention period has not yet
expired. Currently you can use a cmdline to explicitly override the
retention period and immediately reclaim capacity. To do so –

1.  Assuming you have Azure-PowerShell installed and configured. If not
    please follow the instructions here: To install the latest Azure
    PowerShell version and associate it with your Azure subscription,
    see [How to install and configure Azure
    PowerShell](http://azure.microsoft.com/documentation/articles/powershell-install-configure/).
    For more information about Azure Resource Manager cmdlets, see
    [Using Azure PowerShell with Azure Resource
    Manager](http://go.microsoft.com/fwlink/?LinkId=394767)

2.  Run this cmdlet:

    ```
    PS C:\\>; Clear-ACSStorageAccount -ResourceGroupName system
    -FarmName <your farmname>
    ```

> For more details, please refer to [AzureStack powershell documentation](https://msdn.microsoft.com/library/mt637964.aspx)

> [AZURE.NOTE] Running this cmdlet will permanently delete the account and its
contents. It will no longer be recoverable. Use with care.

