---
title: Create a Batch account in the Azure portal
description: Learn how to use the Azure portal to create and manage an Azure Batch account for running large-scale parallel workloads in the cloud.
ms.topic: how-to
ms.date: 01/22/2025
ms.custom: subject-rbac-steps, linux-related-content
---

# Create a Batch account in the Azure portal

This article shows how to use the Azure portal to create an [Azure Batch account](accounts.md) that has account properties to fit your compute scenario. You see how to view account properties like access keys and account URLs. You also learn how to configure and create user subscription mode Batch accounts.

For background information about Batch accounts and scenarios, see [Batch service workflow and resources](batch-service-workflow-features.md).

## Create a Batch account

[!INCLUDE [batch-account-mode-include](../../includes/batch-account-mode-include.md)]

To create a Batch account in the default Batch service mode:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure Search box, enter and then select **batch accounts**.

1. On the **Batch accounts** page, select **Create**.

1. On the **New Batch account** page, enter or select the following details.

   - **Subscription**: Select the subscription to use if not already selected.
   - **Resource group**: Select the resource group for the Batch account, or create a new one.
   - **Account name**: Enter a name for the Batch account. The name must be unique within the Azure region, can contain only lowercase characters or numbers, and must be 3-24 characters long.

     > [!NOTE]
     > The Batch account name is part of its ID and can't be changed after creation.

   - **Location**: Select the Azure region for the Batch account if not already selected.
   - **Storage account**: Optionally, select **Select a storage account** to associate an [Azure Storage account](accounts.md#azure-storage-accounts) with the Batch account.

     :::image type="content" source="media/batch-account-create-portal/batch-account-portal.png" alt-text="Screenshot of the New Batch account screen.":::

     On the **Choose storage account** screen, select an existing storage account or select **Create new** to create a new one. A general-purpose v2 storage account is recommended for the best performance.

     :::image type="content" source="media/batch-account-create-portal/storage_account.png" alt-text="Screenshot of the Create storage account screen.":::

1. Optionally, select **Next: Advanced** or the **Advanced** tab to specify **Identity type**, **Pool allocation mode**, and **Authentication mode**. The default options work for most scenarios. To create the account in **User subscription** mode, see [Configure user subscription mode](#configure-user-subscription-mode).

1. Optionally, select **Next: Networking** or the **Networking** tab to configure [public network access](public-network-access.md) for your Batch account.

   :::image type="content" source="media/batch-account-create-portal/batch-account-networking.png" alt-text="Screenshot of the networking options when creating a Batch account.":::

1. Select **Review + create**, and when validation passes, select **Create** to create the Batch account.

## View Batch account properties

Once the account is created, select **Go to resource** to access its settings and properties. Or search for and select *batch accounts* in the portal Search box, and select your account from the list on the **Batch accounts** page.

:::image type="content" source="media/batch-account-create-portal/batch-blade.png" alt-text="Screenshot of the Batch account page in the Azure portal.":::

On your Batch account page, you can access all account settings and properties from the left navigation menu.

- When you develop an application by using the [Batch APIs](batch-apis-tools.md#azure-accounts-for-batch-development), you use an account URL and key to access your Batch resources. To view the Batch account access information, select **Keys**.

  :::image type="content" source="media/batch-account-create-portal/batch-account-keys.png" alt-text="Screenshot of Batch account keys in the Azure portal.":::

  Batch also supports Microsoft Entra authentication. User subscription mode Batch accounts must be accessed by using Microsoft Entra ID. For more information, see [Authenticate Azure Batch services with Microsoft Entra ID](batch-aad-auth.md).

- To view the name and keys of the storage account associated with your Batch account, select **Storage account**.

- To view the [resource quotas](batch-quota-limit.md) that apply to the Batch account, select **Quotas**.

<a name="additional-configuration-for-user-subscription-mode"></a>
## Configure user subscription mode

You must take several steps before you can create a Batch account in user subscription mode.

> [!IMPORTANT]
> To create a Batch account in user subscription mode, you must have **Contributor** or **Owner** role in the subscription.

### Accept legal terms

You must accept the legal terms for the image before you use a subscription with a Batch account in user subscription mode. If you haven't done this action, you might get the error **Allocation failed due to marketplace purchase eligibility** when you try to allocate Batch nodes.

To accept the legal terms, run the commands [Get-AzMarketplaceTerms](/powershell/module/az.marketplaceordering/get-azmarketplaceterms) and [Set-AzMarketplaceTerms](/powershell/module/az.marketplaceordering/set-azmarketplaceterms) in PowerShell. Set the following parameters based on your Batch pool's configuration:

- `Publisher`: The image's publisher
- `Product`: The image offer
- `Name`: The offer SKU

For example:

```powershell
Get-AzMarketplaceTerms -Publisher 'microsoft-azure-batch' -Product 'ubuntu-server-container' -Name '20-04-lts' | Set-AzMarketplaceTerms -Accept
```

> [!IMPORTANT]
> If you've enabled Private Azure Marketplace, you must follow the steps in [Add new collection](/marketplace/create-manage-private-azure-marketplace-new#add-new-collection) to add a new collection to allow the selected image.

<a name="allow-azure-batch-to-access-the-subscription-one-time-operation"></a>
### Allow Batch to access the subscription

When you create the first user subscription mode Batch account in an Azure subscription, you must register your subscription with Batch resource provider, and assign **Azure Batch Service Orchestration Role** to Microsoft Azure Batch service principal. You need to do this configuration only once per subscription.

> [!IMPORTANT]
> You need **Owner** permissions in the subscription to take this action.

1. In the [Azure portal](https://portal.azure.com), search for and select **subscriptions**.
1. On the **Subscriptions** page, select the subscription you want to use for the Batch account.
1. On the **Subscription** page, select **Resource providers** from the left navigation.
1. On the **Resource providers** page, search for **Microsoft.Batch**. If **Microsoft.Batch** resource provider appears as **NotRegistered**, select it and then select **Register** at the top of the screen.

   :::image type="content" source="media/batch-account-create-portal/register_provider.png" alt-text="Screenshot of the Resource providers page.":::

1. Return to the **Subscription** page and select **Access control (IAM)** from the left navigation.
1. At the top of the **Access control (IAM)** page, select **Add** > **Add role assignment**.
1. On the **Role** tab, search for and select **Azure Batch Service Orchestration Role**, and then select **Next**.
1. On the **Members** tab, select **Select members**. On the **Select members** screen, search for and select **Microsoft Azure Batch**, and then select **Select**.
1. Select **Review + assign** to go to **Review + assign** tab, and select **Review + create** again to apply role assignment changes. 

For detailed steps, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

### Create a key vault

User subscription mode requires [Azure Key Vault](/azure/key-vault/general/overview). The key vault must be in the same subscription and region as the Batch account.

To create a new key vault:

1. Search for and select **key vaults** from the Azure Search box, and then select **Create** on the **Key vaults** page.
1. On the **Create a key vault** page, enter a name for the key vault, and choose an existing resource group or create a new one in the same region as your Batch account.
1. On the **Access configuration** tab, select either **Azure role-based access control** or **Vault access policy** under **Permission model**, and under **Resource access**, check all 3 checkboxes for **Azure Virtual Machine for deployment**, **Azure Resource Manager for template deployment** and **Azure Disk Encryption for volume encryption**.
1. Leave the remaining settings at default values, select **Review + create**, and then select **Create**.

### Create a Batch account in user subscription mode

To create a Batch account in user subscription mode:

1. Follow the preceding instructions to [create a Batch account](#create-a-batch-account), but select **User subscription** for **Pool allocation mode** on the **Advanced** tab of the **New Batch account** page.
1. You must then select **Select a key vault** to select an existing key vault or create a new one.
1. After you select the key vault, select the checkbox next to **I agree to grant Azure Batch access to this key vault**.
1. Select **Review + create**, and then select **Create** to create the Batch account.

### Create a Batch account with designated authentication mode

To create a Batch account with authentication mode settings:

1. Follow the preceding instructions to [create a Batch account](#create-a-batch-account), but select **Batch Service** for **Authentication mode** on the **Advanced** tab of the **New Batch account** page.
1. You must then select **Authentication mode** to define which authentication mode that a Batch account can use by authentication mode property key.
1. You can select either of the 3 **"Microsoft Entra ID**, **Shared Key**, **Task Authentication Token** authentication mode for the Batch account to support or leave the settings at default values. 

   :::image type="content" source="media/batch-account-create-portal/authentication-mode-property.png" alt-text="Screenshot of the Authentication Mode options when creating a Batch account.":::

1. Leave the remaining settings at default values, select **Review + create**, and then select **Create**.

> [!TIP]
> For enhanced security, it is advised to confine the authentication mode of the Batch account solely to **Microsoft Entra ID**. This measure mitigates the risk of shared key exposure and introduces additional RBAC controls. For more details, see [Batch security best practices](./security-best-practices.md#batch-account-authentication).

> [!WARNING]
> The **Task Authentication Token** will retire on September 30, 2024. Should you require this feature, it is recommended to use [User assigned managed identity](./managed-identity-pools.md) in the Batch pool as an alternative. 

### Grant access to the key vault manually

To grant access to the key vault manually in [Azure portal](https://portal.azure.com), you need to assign **Key Vault Secrets Officer** role for Batch:

1. Select **Access control (IAM)** from the left navigation of the key vault page.
1. At the top of the **Access control (IAM)** page, select **Add** > **Add role assignment**.
1. On the **Add role assignment** screen, under **Role** tab, under **Job function roles** sub tab, search and select **Key Vault Secrets Officer** role for the Batch account, and then select **Next**.
1. On the **Members** tab, select **Select members**. On the **Select members** screen, search for and select **Microsoft Azure Batch**, and then select **Select**.
1. Select the **Review + create** button on the bottom to go to **Review + assign** tab, and select the **Review + create** button on the bottom again.

For detailed steps, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

> [!NOTE]
> **KeyVaultNotFound** error returns for Batch account creation if the RBAC role isn't assigned for Batch in the referenced key vault.

If the Key Vault permission model is **Vault access policy**, you also need to configure the **Access policies**:

1. Select **Access policies** from the left navigation of the key vault page.
1. On the **Access policies** page, select **Create**.
1. On the **Create an access policy** screen, select a minimum of **Get**, **List**, **Set**, **Delete**, and **Recover** permissions under **Secret permissions**.

   :::image type="content" source="media/batch-account-create-portal/secret-permissions.png" alt-text="Screenshot of the Secret permissions selections for Azure Batch":::

1. Select **Next**.
1. On the **Principal** tab, search for and select **Microsoft Azure Batch**.
1. Select the **Review + create** tab, and then select **Create**.

### Configure subscription quotas

For user subscription Batch accounts, [core quotas](batch-quota-limit.md) must be set manually. Standard Batch core quotas don't apply to accounts in user subscription mode. The [quotas in your subscription](/azure/azure-resource-manager/management/azure-subscription-service-limits) for regional compute cores, per-series compute cores, and other resources are used and enforced.

To view and configure the core quotas associated with your Batch account:

1. In the [Azure portal](https://portal.azure.com), select your user subscription mode Batch account.
1. From the left menu, select **Quotas**.

## Other Batch account management options

You can also create and manage Batch accounts by using the following tools:

- [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md)
- [Azure CLI](batch-cli-get-started.md)
- [Batch Management .NET](batch-management-dotnet.md)

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn the basics of developing a Batch-enabled application by using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, using Azure Storage for workload file staging and retrieval.
