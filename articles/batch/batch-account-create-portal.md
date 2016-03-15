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
	ms.date="01/28/2016"
	ms.author="marsma"/>

# Create and manage an Azure Batch account in the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](batch-account-create-portal.md)
- [Batch Management .NET](batch-management-dotnet.md)

This article shows you how to use the [Azure portal][azure_portal] to create and manage an Azure Batch account, including where to find settings such as the account URL and account keys. You need a Batch account URL and an associated access key to authenticate all Batch API requests. And you associate all of your Batch resources (such as pools, jobs, and tasks) for your compute workload with a specific Batch account.

>[AZURE.NOTE] The Azure portal currently supports features for Batch account management and viewing some account resources. The full set of Batch features are available to developers through the Batch APIs.

## Create a Batch account

1. Sign in to the [Azure portal][azure_portal].

2. Click **New** > **Compute** > **Batch Service**.

	![Batch in the Marketplace][marketplace_portal]

3. Review the information on the **Batch Service** blade, then click **Create**. Note that deployment model selection is disabled. This is because Batch uses the resource group deployment model only.

	![Batch Service create blade in Azure portal][3]

4. The **New Batch Account** blade is displayed. See items *a* through *f* below for descriptions of each blade element.

    ![Create a Batch account][account_portal]

	a. **Account Name** -- Specify a unique name for your Batch account. This name must be unique within Microsoft Azure, may contain only lowercase characters or numbers, and must be 3-24 characters in length.

	b. **Subscription** -- Select a subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

	c. **Resource group** -- Select a resource group for your new Batch account, or create a new one if there are no resource groups in your subscription.

	d. **Location** -- Select an Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group will be displayed as options.

    e. **Storage keys** -- This information box displays a warning about the rotation of keys in linked storage accounts. See item *f* below, **Storage Account**, for more information.

    f. **Storage Account** (optional) -- You can associate (link) a storage account to your new Batch account. The [application packages](batch-application-packages.md) feature of Batch will use the linked storage account for the storage and retrieval of application packages. See [Application deployment with Azure Batch application packages](batch-application-packages.md) for more information on this feature.

5. Click **Create** to complete the account creation.

## Manage access keys and account settings
After the account is created, you can find it in the portal to manage access keys, authorized users, and other settings.

The Batch account URL appears in **Essentials**. It's a URL of the form `https://<account_name>.<region>.batch.azure.com`.

To see and manage the access keys, click the key icon.

![Batch account keys][account_keys]

## Additional things to know about the Batch account

* Other ways to create and manage Batch accounts include the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md) and the [Batch Management .NET library](batch-management-dotnet.md).

* Azure doesn't charge you to have a Batch account. You only get charged for your use of Azure compute resources and other services when your workloads run (see [Batch pricing][batch_pricing]).

* You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts in different Azure regions.

* If you're running several large-scale Batch workloads, be aware of certain [Batch service quotas and limits](batch-quota-limit.md) that apply to your Azure subscription and each Batch account. Current quotas on a Batch account appear in the portal in the account properties.

## Next steps

* See [Azure Batch feature overview](batch-api-basics.md) to learn more about the Batch concepts.

* Get started developing your first application with the [Batch .NET client library](batch-dotnet-get-started.md).

[azure_portal]: https://portal.azure.com
[batch_pricing]: https://azure.microsoft.com/pricing/details/batch/

[3]: ./media/batch-account-create-portal/batch_acct_03.png
[marketplace_portal]: ./media/batch-account-create-portal/marketplace_batch.PNG
[account_portal]: ./media/batch-account-create-portal/batch_acct_portal.png
[account_keys]: ./media/batch-account-create-portal/account_keys.PNG
