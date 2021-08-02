---
title: Create an account in the Azure portal
description: Learn how to create an Azure Batch account in the Azure portal to run large-scale parallel workloads in the cloud.
ms.topic: how-to
ms.date: 07/01/2021
ms.custom: subject-rbac-steps

---

# Create a Batch account with the Azure portal

This topic shows how to create an [Azure Batch account](accounts.md) in the [Azure portal](https://portal.azure.com), choosing the account properties that fit your compute scenario. You'll also learn where to find important account properties like access keys and account URLs.

For background about Batch accounts and scenarios, see [Batch service workflow and resources](batch-service-workflow-features.md).

## Create a Batch account

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the home page, select **Create a resource**.

1. In the Search box, enter **Batch Service**. Select **Batch Service** from the results, then select **Create**.

1. Enter the following details.

    :::image type="content" source="media/batch-account-create-portal/batch-account-portal.png" alt-text="Screenshot of the New Batch account screen.":::

    a. **Subscription**: The subscription in which to create the Batch account. If you have only one subscription, it is selected by default.

    b. **Resource group**: Select an existing resource group for your new Batch account, or optionally create a new one.

    c. **Account name**: The name you choose must be unique within the Azure region where the account is created (see **Location** below). The account name can contain only lowercase characters or numbers, and must be 3-24 characters in length.

    d. **Location**: The Azure region in which to create the Batch account. Only the regions supported by your subscription and resource group are displayed as options.

    e. **Storage account**: An optional [Azure Storage account](accounts.md#azure-storage-accounts) that you associate with your Batch account. You can select an existing storage account, or create a new one. A general-purpose v2 storage account is recommended for the best performance.

    :::image type="content" source="media/batch-account-create-portal/storage_account.png" alt-text="Screenshot of the options when creating a storage account.":::

1. If desired, select **Advanced** to specify **Identity type**, **Public network access** or **Pool allocation mode**. For most scenarios, the default options are fine.

1. Select **Review + create**, then select **Create** to create the account.

## View Batch account properties

Once the account has been created, select the account to access its settings and properties. You can access all account settings and properties by using the left menu.

> [!NOTE]
> The name of the Batch account is its ID and can't be changed. If you need to change the name of a Batch account, you'll need to delete the account and create a new one with the intended name.

:::image type="content" source="media/batch-account-create-portal/batch_blade.png" alt-text="Screenshot of the Batch account page in the Azure portal.":::

When you develop an application with the [Batch APIs](batch-apis-tools.md#azure-accounts-for-batch-development), you need an account URL and key to access your Batch resources. (Batch also supports Azure Active Directory authentication.) To view the Batch account access information, select **Keys**.

:::image type="content" source="media/batch-account-create-portal/batch-account-keys.png" alt-text="Screenshot of Batch account keys in the Azure portal.":::

To view the name and keys of the storage account associated with your Batch account, select **Storage account**.

To view the [resource quotas](batch-quota-limit.md) that apply to the Batch account, select **Quotas**.

## Additional configuration for user subscription mode

If you choose to create a Batch account in user subscription mode, perform the following additional steps before creating the account.

> [!IMPORTANT]
> The user creating the Batch account in user subscription mode needs to have Contributor or Owner role assignment for the subscription in which the Batch account will be created.

### Allow Azure Batch to access the subscription (one-time operation)

When creating your first Batch account in user subscription mode, you need to register your subscription with Batch. (If you already did this, skip to the next section.)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Subscriptions**, and select the subscription you want to use for the Batch account.

1. In the **Subscription** page, select **Resource providers**, and search for **Microsoft.Batch**. Check that the **Microsoft.Batch** resource provider is registered in the subscription. If it's not, select the **Register** link near the top of the screen.

    :::image type="content" source="media/batch-account-create-portal/register_provider.png" alt-text="Screenshot showing the Microsoft.Batch resource provider.":::

1. Return to the **Subscription** page, then select **Access control (IAM)**.

1. Assign the **Contributor** or **Owner** role to the Batch API. You can find this account by searching for **Microsoft Azure Batch** or **MicrosoftAzureBatch**. (The Object ID for the Batch API is **f520d84c-3fd3-4cc8-88d4-2ed25b00d27a**, and the Application ID is **ddbf3205-c6bd-46ae-8127-60eb93363864**.)

   For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

### Create a Key Vault

In user subscription mode, an [Azure Key Vault](../key-vault/general/overview.md) is required. The Key Vault must be in the same subscription and region as the Batch account to be created.

1. From the home page of the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. In the Search box, enter **Key Vault**. Select **Key Vault** from the results and then select **Create**.
1. In the **Create key vault** page, enter a name for the Key Vault, and create a new resource group in the same region you want for your Batch account. Leave the remaining settings at default values, then select **Create**.

When creating the Batch account in user subscription mode, specify **User subscription** as the pool allocation mode, select the Key Vault you created, and check the box to grant Azure Batch access to the Key Vault.

If you prefer to grant access to the Key Vault manually, go to the **Access policies** section of the Key Vault and select **Add Access Policy**. Select the link next to **Select principal** and search for **Microsoft Azure Batch** (Application ID **ddbf3205-c6bd-46ae-8127-60eb93363864**). Select that principal, then configure the **Secret permissions** using the drop-down menu. Azure Batch must be given a minimum of **Get**, **List**, **Set**, and **Delete** permissions. For [Key Vaults with soft-delete enabled](../key-vault/general/soft-delete-overview.md), Azure Batch must also be given **Recover** permission.

:::image type="content" source="media/batch-account-create-portal/secret-permissions.png" alt-text="Screenshot of the Secret permissions selections for Azure Batch":::

Select **Add**, then ensure that the **Azure Virtual Machines for deployment** and **Azure Resource Manager for template deployment** check boxes are selected for the linked **Key Vault** resource. Select **Save** to commit your changes.

:::image type="content" source="media/batch-account-create-portal/key-vault-access-policy.png" alt-text="Screenshot of the Access policy screen.":::

### Configure subscription quotas

For user subscription Batch accounts, [core quotas](batch-quota-limit.md) must be set manually. Standard Batch core quotas do not apply to accounts in user subscription mode, and the [quotas in your subscription](../azure-resource-manager/management/azure-subscription-service-limits.md) for regional compute cores, per-series compute cores, and other resources are used and enforced.

1. In the [Azure portal](https://portal.azure.com), select your user subscription mode Batch account to display its settings and properties.
1. From the left menu, select **Quotas** to view and configure the core quotas associated with your Batch account.

## Other Batch account management options

In addition to using the Azure portal, you can create and manage Batch accounts with tools including the following:

- [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md)
- [Azure CLI](batch-cli-get-started.md)
- [Batch Management .NET](batch-management-dotnet.md)

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, using Azure Storage for workload file staging and retrieval.