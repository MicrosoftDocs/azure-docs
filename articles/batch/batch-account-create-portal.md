---
title: Create a Batch account in the Azure portal | Microsoft Docs
description: Learn how to create an Azure Batch account in the Azure portal to run large-scale parallel workloads in the cloud
services: batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 3fbae545-245f-4c66-aee2-e25d7d5d36db
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/18/2018
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Create a Batch account with the Azure portal

Learn how to create an Azure Batch account in the [Azure portal][azure_portal], and choose the account properties that fit your compute scenario. Learn where to find important account properties like access keys and account URLs.

For background about Batch accounts and scenarios, see the [feature overview](batch-api-basics.md).

## Create a Batch account

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]

1. Sign in to the [Azure portal][azure_portal].

1. Select **Create a resource** > **Compute** > **Batch Service**.

    ![Batch in the Marketplace][marketplace_portal]

1. Enter **New Batch account** settings. See the following details.

    ![Create a Batch account][account_portal]

    a. **Account name**: The name you choose must be unique within the Azure region where the account is created (see **Location** below). The account name can contain only lowercase characters or numbers, and must be 3-24 characters in length.

    b. **Subscription**: The subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

    c. **Resource group**: Select an existing resource group for your new Batch account, or optionally create a new one.

    d. **Location**: The Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group are displayed as options.

    e. **Storage account** (optional): An Azure Storage account that you associate with your Batch account. This is recommended for most Batch accounts. For storage account options in Batch, see the [Batch feature overview](batch-api-basics.md#azure-storage-account). In the portal, select an existing storage account, or optionally create a new one.

      ![Create a storage account][storage_account]

    f. **Pool allocation mode**: For most scenarios, accept the default **Batch service**.

1. Select **Create** to create the account.



## View Batch account properties
Once the account has been created, select the account to access its settings and properties. You can access all account settings and properties by using the left menu.

![Batch account page in Azure portal][account_blade]

* **Batch account name, URL, and keys**: When you develop an application with the [Batch APIs](batch-apis-tools.md#azure-accounts-for-batch-development), you need an account URL and key to access your Batch resources. (Batch also supports Azure Active Directory authentication.)

    To view the Batch account access information, select **Keys**.

    ![Batch account keys in Azure portal][account_keys]

* To view the name and keys of the storage account associated with your Batch account, select **Storage account**.

* To view the resource quotas that apply to the Batch account, select  **Quotas**. For details, see [Batch service quotas and limits](batch-quota-limit.md).


## Additional configuration for user subscription mode

If you choose to create a Batch account in user subscription mode, perform the following additional steps before creating the account.

### Allow Azure Batch to access the subscription (one-time operation)
When creating your first Batch account in user subscription mode, you need to register your subscription with Batch. (If you previously did this, skip to the next section.)

1. Sign in to the [Azure portal][azure_portal].

1. Select **All services** > **Subscriptions**, and select the subscription you want to use for the Batch account.

1. In the **Subscription** page, select **Resource providers**, and search for **Microsoft.Batch**. Check that the **Microsoft.Batch** resource provider is registered in the subscription. If it isn't registered, select the **Register** link.

    ![Register Microsoft.Batch provider][register_provider]

1. In the **Subscription** page, select **Access control (IAM)** > **Add**.

    ![Subscription access control][subscription_access]

1. On the **Add permissions** page, select the **Contributor** role, search for the Batch API. Search for each of these strings until you find the API:
    1. **MicrosoftAzureBatch**.
    1. **Microsoft Azure Batch**. Newer Azure AD tenants may use this name.
    1. **ddbf3205-c6bd-46ae-8127-60eb93363864** is the ID for the Batch API. 

1. Once you find the Batch API, select it and select **Save**.

    ![Add Batch permissions][add_permission]

### Create a key vault
In user subscription mode, an Azure key vault is required that belongs to the same resource group as the Batch account to be created. Make sure the resource group is in a region where Batch is [available](https://azure.microsoft.com/regions/services/) and which your subscription supports.

1. In the [Azure portal][azure_portal], select **New** > **Security** > **Key Vault**.

1. In the **Create Key Vault** page, enter a name for the key vault, and create a resource group in the region you want for your Batch account. Leave the remaining settings at default values, then select **Create**.

When creating the Batch account in user subscription mode, use the resource group for the key vault, specify **User subscription** as the pool allocation mode, and select the key vault.

## Other Batch account management options
In addition to using the Azure portal, you can create and manage Batch accounts with tools including the following:

* [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md)
* [Azure CLI](batch-cli-get-started.md)
* [Batch Management .NET](batch-management-dotnet.md)

## Next steps
* See the [Batch feature overview](batch-api-basics.md) to learn more about Batch service concepts and features. The article discusses the primary Batch resources such as pools, compute nodes, jobs, and tasks, and provides an overview of the service's features for large-scale compute workloads.
* Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.

[azure_portal]: https://portal.azure.com
[batch_pricing]: https://azure.microsoft.com/pricing/details/batch/

[marketplace_portal]: ./media/batch-account-create-portal/marketplace-batch.png
[account_blade]: ./media/batch-account-create-portal/batch_blade.png
[account_portal]: ./media/batch-account-create-portal/batch-account-portal.png
[account_keys]: ./media/batch-account-create-portal/batch-account-keys.png
[account_url]: ./media/batch-account-create-portal/account_url.png
[storage_account]: ./media/batch-account-create-portal/storage_account.png
[subscription_access]: ./media/batch-account-create-portal/subscription_iam.png
[add_permission]: ./media/batch-account-create-portal/add_permission.png
[register_provider]: ./media/batch-account-create-portal/register_provider.png

