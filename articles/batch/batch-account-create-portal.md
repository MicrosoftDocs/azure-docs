---
title: Create a Batch account in the Azure portal | Microsoft Docs
description: Learn how to create an Azure Batch account in the Azure portal to run large-scale parallel workloads in the cloud
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: ''

ms.assetid: 3fbae545-245f-4c66-aee2-e25d7d5d36db
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/27/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Create a Batch account with the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](batch-account-create-portal.md)
> * [Batch Management .NET](batch-management-dotnet.md)
>
>

Learn how to create an Azure Batch account in the [Azure portal][azure_portal], and choose the account properties that fit your compute scenario. Learn where to find important account properties like access keys and account URLs.

For background about Batch accounts and scenarios, see the [feature overview](batch-api-basics.md).



## Create a Batch account

Use the portal to create a Batch account in one of the two *pool allocation modes*: **Batch service** mode or the newer **user subscription** mode, which requires more configuration. For information about these two modes, see the [feature overview](batch-api-basics.md#account). For features of the user subscription mode, see also the [blog post](https://blogs.technet.microsoft.com/windowshpc/2017/03/17/azure-batch-vnet-and-custom-image-support-for-virtual-machine-pools/).

## Batch service mode



1. Sign in to the [Azure portal][azure_portal].
2. Click **New** > **Compute** > **Batch Service**.

    ![Batch in the Marketplace][marketplace_portal]
3. The **New Batch Account** blade is displayed. See the descriptions below of each blade element.

    ![Create a Batch account][account_portal]

    a. **Account name**: The Batch account name you choose must be unique within the Azure region where the account is created (see **Location** below). The account name may contain only lowercase characters or numbers, and must be 3-24 characters in length.

    b. **Subscription**: The subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

    c. **Pool allocation mode**: Select **Batch service**.

    c. **Resource group**: Select an existing resource group for your new Batch account, or optionally create a new one.

    d. **Location**: The Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group are displayed as options.

    e. **Storage account** (optional): A general-purpose Azure Storage account that you associate with your Batch account. This is recommended for most Batch accounts. See [Linked Azure Storage account](#linked-azure-storage-account) later in this article for more details.

4. Click **Create** to create the account.

   The portal indicates deployment is in progress. Upon completion, a **Deployments succeeded** notification appears in **Notifications**.

## User subscription mode

### Allow Azure Batch to access the subscription (one-time operation)
When creating your first Batch account in user subscription mode, perform the following steps to register your subscription with Batch. (If you previously did this, skip to the next section.)

1. Sign in to the [Azure portal][azure_portal].

2. Click **More Services** > **Subscriptions**, and click the subscription you want to use for the Batch account.

3. In the **Subscription** blade, click **Access control (IAM)** > **Add**.

    ![Subscription access control][subscription_access]

4. On the **Add permissions** blade, select the **Contributor** role, and search for **MicrosoftAzureBatch** (no spaces). Select **MicrosoftAzureBatch**, and click **Save**.

    ![Add Batch permissions][add_permission]

### Create a key vault
In user subscription mode, an Azure key vault is required that belongs to the same resource group as the Batch account to be created. Make sure the resource group is in a region where Batch is [available](https://azure.microsoft.com/regions/services/) and which your subscription supports.

1. In the [Azure portal][azure_portal], click **New** > **Security + Identity** > **Key Vault**.

2. In the **Create Key Vault** blade, enter a name for the key vault, and create a resource group in the region you want for your Batch account. Leave the remaining settings at default values, then click **Create**.

### Create a Batch account

1. In the [Azure portal][azure_portal], click **New** > **Compute** > **Batch Service**.

    ![Batch in the Marketplace][marketplace_portal]
3. The **New Batch Account** blade is displayed. See the descriptions below of each blade element.

    ![Create a Batch account][account_portal_byos]

    a. **Account name**: The Batch account name you choose must be unique within the Azure region where the account is created (see **Location** below). The account name may contain only lowercase characters or numbers, and must be 3-24 characters in length.

    b. **Subscription**: If you have more than one subscription, select the subscription that you registered with the Batch service.

    c. **Pool allocation mode**: Select **User subscription**.

    d. **Key vault**: Select the key vault you created for your Batch account in the previous section. Optionally, create a new key vault. After selecting the vault, select the checkbox to grant Azure Batch access to the key vault.

    c. **Resource group**: Select the resource group in which you  created the key vault.

    d. **Location**: The Azure region in which you created the key vault for the Batch account.

    e. **Storage account** (optional): A general-purpose Azure Storage account that you associate with your Batch account. This is recommended for most Batch accounts. See [Linked Azure Storage account](#linked-azure-storage-account) below for more details.

4. Click **Create** to create the account.

   The portal indicates deployment is in progress. Upon completion, a **Deployments succeeded** notification appears in **Notifications**.



## View Batch account properties
Once the account has been created, you can open the **Batch account blade** to access its settings and properties. You can access all account settings and properties by using the left menu of the Batch account blade.

![Batch account blade in Azure portal][account_blade]

* **Batch account URL**: When you develop an application with the [Batch APIs](batch-apis-tools.md#azure-accounts-for-batch-development), you'll need an account URL to access your Batch resources. A Batch account URL has the following format:

    `https://<account_name>.<region>.batch.azure.com`

![Batch account URL in portal][account_url]

* **Access keys** (Batch service mode): To authenticate access to your Batch account from your application, you'll need an account access key. (This setting is not available in user subscription mode, where you use Azure Active Directory authetication.)

    To view or regenerate your Batch account's access keys, enter `keys` in the left menu **Search** box on the Batch account blade, then select **Keys**.

    ![Batch account keys in Azure portal][account_keys]

[!INCLUDE [batch-pricing-include](../../includes/batch-pricing-include.md)]

## Linked Azure Storage account

You can optionally link a general-purpose Azure Storage account to your Batch account. The [application packages](batch-application-packages.md) feature of Batch uses Azure Blob storage, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications that your Batch tasks run, and persisting the data they produce.

We recommend that you create a new Storage account exclusively for use by your Batch account.

![Creating a "General purpose" storage account][storage_account]

> [!NOTE]
> Azure Batch currently supports only the general-purpose Storage account type. This account type is described in step 5, [Create a storage account] (../storage/storage-create-storage-account.md#create-a-storage-account), in [About Azure storage accounts](../storage/storage-create-storage-account.md).
>
>

> [!WARNING]
> Be careful when regenerating the access keys of a linked Storage account. Regenerate only one Storage account key and click **Sync Keys** on the linked Storage account blade. Wait five minutes to allow the keys to propagate to the compute nodes in your pools, then regenerate and synchronize the other key if necessary. If you regenerate both keys at the same time, your compute nodes will not be able to synchronize either key, and they will lose access to the Storage account.
>
>

![Regenerating storage account keys][4]

## Batch service quotas and limits
Please be aware that as with your Azure subscription and other Azure services, certain [quotas and limits](batch-quota-limit.md) apply to Batch accounts. Current quotas for a Batch account appear in the portal in the account **Properties**.

![Batch account quotas in Azure portal][quotas]



Additionally, many of these quotas can be increased simply with a free product support request submitted in the Azure portal. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for details on requesting quota increases.

## Other Batch account management options
In addition to using the Azure portal, you can also create and manage Batch accounts with the following:

* [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md)
* [Azure CLI](batch-cli-get-started.md)
* [Batch Management .NET](batch-management-dotnet.md)

## Next steps
* See the [Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. The article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the service's features that enable large-scale compute workload execution.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](batch-dotnet-get-started.md) or [Python](batch-python-tutorial.md). These introductory articles guide you through a working application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.

[api_net]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: https://msdn.microsoft.com/library/azure/Dn820158.aspx

[azure_portal]: https://portal.azure.com
[batch_pricing]: https://azure.microsoft.com/pricing/details/batch/

[4]: ./media/batch-account-create-portal/batch_acct_04.png "Regenerating storage account keys"
[marketplace_portal]: ./media/batch-account-create-portal/marketplace_batch.PNG
[account_blade]: ./media/batch-account-create-portal/batch_blade.png
[account_portal]: ./media/batch-account-create-portal/batch_acct_portal.png
[account_keys]: ./media/batch-account-create-portal/account_keys.PNG
[account_url]: ./media/batch-account-create-portal/account_url.png
[storage_account]: ./media/batch-account-create-portal/storage_account.png
[quotas]: ./media/batch-account-create-portal/quotas.png
[subscription_access]: ./media/batch-account-create-portal/subscription_iam.png
[add_permission]: ./media/batch-account-create-portal/add_permission.png
[account_portal_byos]: ./media/batch-account-create-portal/batch_acct_portal_byos.png
