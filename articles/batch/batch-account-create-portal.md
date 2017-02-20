---
title: Create a Batch account in the Azure Portal | Microsoft Docs
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
ms.date: 01/23/2016
ms.author: tamram

---
# Create an Azure Batch account using the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](batch-account-create-portal.md)
> * [Batch Management .NET](batch-management-dotnet.md)
> 
> 

Learn how to create an Azure Batch account in the [Azure portal][azure_portal], and where to find important account properties like access keys and account URLs. We also discuss Batch pricing, and linking an Azure Storage account to your Batch account so that you can use [application packages](batch-application-packages.md) and [persist job and task output](batch-task-output.md).

## Create a Batch account
1. Sign in to the [Azure portal][azure_portal].
2. Click **New** > **Compute** > **Batch Service**.
   
    ![Batch in the Marketplace][marketplace_portal]
3. The **New Batch Account** blade is displayed. See items *a* through *e* below for descriptions of each blade element.
   
    ![Create a Batch account][account_portal]
   
    a. **Account Name**: The name for your Batch account. The name you choose must be unique within the Azure region where the new account will be created (see **Location** below). The account name may contain only lowercase characters or numbers, and must be 3-24 characters in length.
   
    b. **Subscription**: The subscription in which to create the Batch account. If you have only one subscription, it is selected by default.
   
    c. **Resource group**: Select an existing resource group for your new Batch account, or optionally create a new one.
   
    d. **Location**: The Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group are displayed as options.
   
    e. **Storage Account** (optional): A general-purpose Azure Storage account that you associate with your new Batch account. See [Linked Azure Storage account](#linked-azure-storage-account) below for more details.

4. Click **Create** to create the account.
   
   The portal indicates that it is **Deploying** the account, and upon completion, a **Deployments succeeded** notification appears in *Notifications*.

## View Batch account properties
Once the account has been created, you can open the **Batch account blade** to access its settings and properties. You can access all account settings and properties by using the left menu of the Batch account blade.

![Batch account blade in Azure portal][account_blade]

* **Batch account URL**: When you develop an application with the [Batch APIs](batch-technical-overview.md#batch-development-apis), you'll need an account URL to access your Batch resources. A Batch account URL has the following format:
  
    `https://<account_name>.<region>.batch.azure.com`

![Batch account URL in portal][account_url]

* **Access keys**: To authenticate access to your Batch account from your application, you'll need an account access key. To view or regenerate your Batch account's access keys, enter `keys` in the left menu **Search** box on the Batch account blade, then select **Keys**.
  
    ![Batch account keys in Azure portal][account_keys]

[!INCLUDE [batch-pricing-include](../../includes/batch-pricing-include.md)]

## Linked Azure Storage account

As mentioned earlier, you can optionally link a general-purpose Azure Storage account to your Batch account. The [application packages](batch-application-packages.md) feature of Batch uses Azure Blob storage, as does the [Batch File Conventions .NET](batch-task-output.md) library. These optional features assist you in deploying the applications that your Batch tasks run, and persisting the data they produce.

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

Keep these quotas in mind as you are designing and scaling up your Batch workloads. For example, if your pool isn't reaching the target number of compute nodes you've specified, you might have reached the core quota limit for your Batch account.

The quota for Batch accounts is per region per subscription, so you can have more than one Batch account by default, as long as they are in different regions. You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts that are in the same subscription, but in different Azure regions.

Additionally, many of these quotas can be increased simply with a free product support request submitted in the Azure portal. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for details on requesting quota increases.

## Other Batch account management options
In addition to using the Azure portal, you can also create and manage Batch accounts with the following:

* [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md)
* [Azure CLI](../xplat-cli-install.md)
* [Batch Management .NET](batch-management-dotnet.md)

## Next steps
* See the [Azure Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. The article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the service's features that enable large-scale compute workload execution.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](batch-dotnet-get-started.md). The [introductory article](batch-dotnet-get-started.md) guides you through a working application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.

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
