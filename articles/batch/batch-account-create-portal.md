<properties
	pageTitle="Create an Azure Batch account | Microsoft Azure"
	description="Learn how to create an Azure Batch account in the Azure portal to run large-scale parallel workloads in the cloud"
	services="batch"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/18/2016"
	ms.author="marsma"/>

# Create and manage an Azure Batch account in the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](batch-account-create-portal.md)
- [Batch Management .NET](batch-management-dotnet.md)

The [Azure portal][azure_portal] provides you with the tools you need to create and manage an Azure Batch account, which you can use for large-scale parallel workload processing. In this article, we'll walk though Batch account creation using the portal, as well as discuss several of the most important settings and properties of a Batch account. For example, the applications and services you develop with Batch need your account's URL and an access key to communicate with the Batch service APIs, both of which are found in the Azure portal.

>[AZURE.NOTE] The Azure portal currently supports a subset of the features available in the Batch service, including account creation and the management of some settings and properties. The full feature set of Batch, such as creating and running jobs and tasks, is available to developers through the Batch APIs.

## Create a Batch account

1. Sign in to the [Azure portal][azure_portal].

2. Click **New** > **Compute** > **Batch Service**.

	![Batch in the Marketplace][marketplace_portal]

3. Review the information on the **Batch Service** blade, then click **Create**. Note that deployment model selection is disabled. This is because Batch uses the resource group deployment model only.

	![Batch Service create blade in Azure portal][3]

4. The **New Batch Account** blade is displayed. See items *a* through *f* below for descriptions of each blade element.

    ![Create a Batch account][account_portal]

	a. **Account Name** -- Specify a unique name for your Batch account. This name must be unique within the Azure region the account is created (see *Location* below). It may contain only lowercase characters, numbers, and must be 3-24 characters in length.

	b. **Subscription** -- Select a subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

	c. **Resource group** -- Select a resource group for your new Batch account, or create a new one if there are no resource groups in your subscription.

	d. **Location** -- Select an Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group will be displayed as options.

    e. **Storage Account** (optional) -- You can associate (link) a storage account to your new Batch account. The [application packages](batch-application-packages.md) feature of Batch will use the linked storage account for the storage and retrieval of application packages. See [Application deployment with Azure Batch application packages](batch-application-packages.md) for more information on this feature.

     > [AZURE.TIP] Regenerating keys in a linked Storage account requires special considerations. See the *Additional things to know* section below for more details.

5. Click **Create** to create the account.

  The portal will indicate that it is **Deploying** the account, and upon completion, the Batch Account blade will be displayed.

## Batch Account blade

The Batch account blade displays several properties for the account, as well as provides access to additional settings such as access keys, users, quotas, and a linked Storage account.

* **Batch account URL** -- This URL provides access to your Batch account when using APIs such as the [Batch REST][api_rest] API or [Batch .NET][api_net] client library, and adheres to the following format:

  `https://<account_name>.<region>.batch.azure.com`

* **Access keys** -- To view and manage the access keys for your Batch account, click the key icon to open the **Manage keys** blade, or click **All settings** > **Keys**. These access keys are used in various

 ![Batch account keys][account_keys]

* **All settings** -- To manage all settings for the Batch account or to view its properties, click **All settings** to open the **Settings** blade. This blade provides access to all settings and properties for the account, including viewing the account quotas, selecting an Azure Storage account to link to the Batch account, or managing users.

 ![Batch account settings and properties blades][5]

## Additional things to know about Azure Batch accounts

* Other ways to create and manage Batch accounts include the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md) and the [Batch Management .NET library](batch-management-dotnet.md).

* Azure doesn't charge you to have a Batch account. You are charged only for your use of the Azure compute resources and other services when your workloads run (see [Batch pricing][batch_pricing]).

* You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts in different Azure regions.

* If you're running several large-scale Batch workloads, be aware of certain [Batch service quotas and limits](batch-quota-limit.md) that apply to your Azure subscription and each Batch account. Current quotas on a Batch account appear in the portal in the account properties.

* If you associate a storage account with your Batch account, take care when regenerating the storage account access keys. You should regenerate only a single storage account key, then click **Sync Keys** on the linked storage account blade, wait 5 minutes to allow the keys to propagate to the compute nodes in your pools, then regenerate and synchronize the other key if necessary. If you regenerate both keys at the same time, your compute nodes will not be able to synchronize either key, and will lose access to the storage account.

  ![Regenerating storage account keys][4]

## Next steps

* See the [Azure Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. This article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the many features that enable large-scale compute workload execution.

* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](batch-dotnet-get-started.md). This [introductory article](batch-dotnet-get-started.md) guides you through a working application that uses the Batch service to execute a workload on multiple compute nodes, including how Azure Storage can be used for file staging and retrieval in your Batch solutions.

[api_net]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: https://msdn.microsoft.com/library/azure/mt463120.aspx

[azure_portal]: https://portal.azure.com
[batch_pricing]: https://azure.microsoft.com/pricing/details/batch/

[3]: ./media/batch-account-create-portal/batch_acct_03.png "Batch Service create blade in Azure portal"
[4]: ./media/batch-account-create-portal/batch_acct_04.png "Regenerating storage account keys"
[5]: ./media/batch-account-create-portal/batch_acct_05.png "Batch account settings and properties blades"
[marketplace_portal]: ./media/batch-account-create-portal/marketplace_batch.PNG
[account_portal]: ./media/batch-account-create-portal/batch_acct_portal.png
[account_keys]: ./media/batch-account-create-portal/account_keys.PNG
