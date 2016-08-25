<properties
	pageTitle="Create an Azure Batch account | Microsoft Azure"
	description="Learn how to create an Azure Batch account in the Azure portal to run large-scale parallel workloads in the cloud"
	services="batch"
	documentationCenter=""
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/26/2016"
	ms.author="marsma"/>

# Create an Azure Batch account using the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](batch-account-create-portal.md)
- [Batch Management .NET](batch-management-dotnet.md)

Create an Azure Batch account in the [Azure portal][azure_portal], and learn where to find important account properties like access keys, account URLs, and quotas. We also discuss linking an Azure Storage account to your Batch account so that you can use [application packages](batch-application-packages.md) and [persist job and task output](batch-task-output.md).

## Create a Batch account

1. Sign in to the [Azure portal][azure_portal].

2. Click **New** > **Virtual Machines** > **Batch Service**.

	![Batch in the Marketplace][marketplace_portal]

3. The **New Batch Account** blade is displayed. See items *a* through *e* below for descriptions of each blade element.

    ![Create a Batch account][account_portal]

	a. **Account Name**: A unique name for your Batch account. This name must be unique within the Azure region the account is created (see *Location* below). It may contain only lowercase characters, numbers, and must be 3-24 characters in length.

	b. **Subscription**: A subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

	c. **Resource group**: An existing resource group for your new Batch account, or optionally create a new one.

	d. **Location**: An Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group will be displayed as options.

    e. **Storage Account** (optional): A **General purpose** storage account you associate (link) to your new Batch account. The [application packages](batch-application-packages.md) feature of Batch uses a linked storage account for the storage and retrieval of application packages. See [Application deployment with Azure Batch application packages](batch-application-packages.md) for more information on this feature.

     > [AZURE.IMPORTANT] Regenerating keys in a linked Storage account requires special considerations. See [Considerations for Batch accounts](#other-batch-account-considerations) below for more details.

4. Click **Create** to create the account.

  The portal will indicate that it is **Deploying** the account, and upon completion, a **Deployments succeeded** notification will appear in *Notifications*.

## View Batch account properties

Once the account has been created, you can open the **Batch account blade** to access its settings and properties. All account settings and properties can be found on the left menu of the Batch account blade.

![Batch account keys][account_blade]

* **Batch account URL**: Applications you create with the [Batch development APIs](batch-technical-overview.md#batch-development-apis) need an account URL to manage resources and run jobs in the account. A Batch account URL has the following format:

    `https://<account_name>.<region>.batch.azure.com`

* **Access keys**: Your applications also need an access key when working with resources in your Batch account. To view or regenerate your Batch account's access keys, enter `keys` in the left menu **Search** box on the Batch account blade, then select **Keys**.

    ![Batch account keys][account_keys]

## Pricing

Batch accounts are offered only in a "Free Tier," which means that you aren't charged for the Batch account itself. You are charged for the underlying Azure compute resources that your Batch solutions consume, and for the resources consumed by other services when your workloads run. For example, you are charged for the compute nodes in your pools and for the data that you store in Azure Storage as input or output for your tasks. Similarly, if you use the [application packages](batch-application-packages.md) feature of Batch, you are charged for the Azure Storage resources used for storing your application package versions. See [Batch pricing][batch_pricing] for more information.

## Other Batch account considerations

* You can also create and manage Batch accounts with the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md) and the [Batch Management .NET](batch-management-dotnet.md) library.

* If you're running several large-scale Batch workloads, be aware of certain [Batch service quotas and limits](batch-quota-limit.md) that apply to your Azure subscription and each Batch account. Current quotas on a Batch account appear in the portal in the account properties.

* If you associate (link) a storage account with your Batch account, take care when regenerating the storage account access keys. You should regenerate only a single storage account key, click **Sync Keys** on the linked storage account blade, wait 5 minutes to allow the keys to propagate to the compute nodes in your pools, then regenerate and synchronize the other key if necessary. If you regenerate both keys at the same time, your compute nodes will not be able to synchronize either key, and they will lose access to the storage account.

  ![Regenerating storage account keys][4]

> [AZURE.IMPORTANT] Batch currently supports *only* the **General purpose** storage account type, as described in step #5 [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md). When you link an Azure Storage account to your Batch account, link *only* a **General purpose** storage account.

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
