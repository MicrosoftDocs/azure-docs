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
	ms.date="06/01/2016"
	ms.author="marsma"/>

# Create and manage an Azure Batch account in the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](batch-account-create-portal.md)
- [Batch Management .NET](batch-management-dotnet.md)

The [Azure portal][azure_portal] provides you with the tools you need to create and manage an Azure Batch account, which you can use for large-scale parallel workload processing. In this article, we'll walk though Batch account creation using the portal, and point out important settings and properties of a Batch account. For example, the applications and services you develop with Batch need your account's URL and an access key to communicate with the Batch service APIs, both of which are found in the Azure portal.

>[AZURE.NOTE] The Azure portal currently supports a subset of the features in the Batch service, including account creation, management of Batch account settings and properties, and creation and monitoring of pools and jobs. The full feature set of Batch is available to developers through the Batch APIs.

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

    e. **Storage Account** (optional): A **General purpose** storage account you associate (link) to your new Batch account. The [application packages](batch-application-packages.md) feature of Batch will use the linked storage account for the storage and retrieval of application packages. See [Application deployment with Azure Batch application packages](batch-application-packages.md) for more information on this feature.

     > [AZURE.IMPORTANT] Regenerating keys in a linked Storage account requires special considerations. See [Considerations for Batch accounts](#considerations-for-batch-accounts) below for more details.

4. Click **Create** to create the account.

  The portal will indicate that it is **Deploying** the account, and upon completion, a **Deployments succeeded** notification will appear in *Notifications*.

## View Batch account properties

The Batch account blade displays several properties for the account, as well as provides access to additional settings such as access keys, quotas, users, and storage account association.

* **Batch account URL**: This URL provides access to your Batch account when using APIs such as the [Batch REST][api_rest] API or [Batch .NET][api_net] client library, and adheres to the following format:

    `https://<account_name>.<region>.batch.azure.com`

* **Access keys**: To view and manage your Batch account's access keys, click the key icon to open the **Manage keys** blade, or click **All settings** > **Keys**. An access key is required when communicating with the Batch service APIs, such as with [Batch REST][api_rest] or the [Batch .NET][api_net] client library.

    ![Batch account keys][account_keys]

* **All settings**: To manage all settings for the Batch account or to view its properties, click **All settings** to open the **Settings** blade. This blade provides access to all settings and properties for the account, including viewing the account quotas, selecting an Azure Storage account to link to the Batch account, and managing users.

    ![Batch account settings and properties blades][5]

## Considerations for Batch accounts

* You can also create and manage Batch accounts with the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md) and the [Batch Management .NET](batch-management-dotnet.md) library.

* You aren't charged for the Batch account itself. You are charged for any Azure compute resources that your Batch solutions consume, and for the resources consumed by other services when your workloads run. For example, you are charged for the compute nodes in your pools, and if you use the [application packages](batch-application-packages.md) feature, you are charged for the Azure Storage resources used for storing your application package versions. See [Batch pricing][batch_pricing] for more information.

* You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts in different Azure regions.

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
[5]: ./media/batch-account-create-portal/batch_acct_05.png "Batch account settings and properties blades"
[marketplace_portal]: ./media/batch-account-create-portal/marketplace_batch.PNG
[account_portal]: ./media/batch-account-create-portal/batch_acct_portal.png
[account_keys]: ./media/batch-account-create-portal/account_keys.PNG
