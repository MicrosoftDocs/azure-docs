---
title: Migrate from a Run As account to a managed identity
description: This article describes how to migrate from a Run As account to a managed identity in Azure Site Recovery.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.author: ankitadutta
ms.topic: how-to 
ms.date: 09/14/2023
---

# Migrate from a Run As account to Managed Identities 

> [!IMPORTANT]
> - Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use managed identities. For more information, see [migrating from an existing Run As accounts to managed identity](../automation/automation-managed-identity-faq.md).
> - Delaying the feature has a direct impact on our support burden, as it would cause upgrades of mobility agent to fail.

This article shows you how to migrate your runbooks to use a Managed Identities for Azure Site Recovery. Azure Automation Accounts are used by Azure Site Recovery customers to auto-update the agents of their protected virtual machines. Site Recovery creates Azure Automation Run As Accounts when you enable replication via the IaaS VM Blade and Recovery Services Vault. 

On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Microsoft Entra ID and using it to obtain Microsoft Entra tokens. 

## Prerequisites

Before you migrate from a Run As account to a managed identity, ensure that you have the appropriate roles to create a system-assigned identity for your automation account and to assign it the Contributor role in the corresponding recovery services vault.

## Benefits of managed identities

Here are some of the benefits of using managed identities:

- **Credentials access** - You don't need to manage credentials.
- **Simplified authentication** - You can use managed identities to authenticate to any resource that supports Microsoft Entra authentication including your own applications.
- **Cost effective** - Managed identities can be used at no extra cost.
-  **Double encryption** - Managed identity is also used to encrypt/decrypt data and metadata using the customer-managed key stored in Azure Key Vault, providing double encryption.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Migrate from an existing Run As account to a managed identity
 
### Configure managed identities 

You can configure your managed identities through:

- Azure portal
- Azure CLI
- your Azure Resource Manager (ARM) template

> [!NOTE]
> For more information about migration cadence and the support timeline for Run As account creation and certificate renewal, see the [frequently asked questions](../automation/automation-managed-identity-faq.md).


### From Azure portal

**To migrate your Azure Automation account authentication type from a Run As to a managed identity authentication, follow these steps:**


1. In the [Azure portal](https://portal.azure.com), select the recovery services vault for which you want to migrate the runbooks.

1. On the homepage of your recovery services vault page, do the following:
    1. On the left pane, under **Manage**, select **Site Recovery infrastructure**.
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/manage-section.png" alt-text="Screenshot of the **Site Recovery infrastructure** page.":::
    1. Under **For Azure virtual machines**, select **Extension update settings**.
     This page details the authentication type for the automation account that is being used to manage the Site Recovery extensions.

    1. On this page, select **Migrate** to migrate the authentication type for your automation accounts to use Managed Identities. 
        
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/extension-update-settings.png" alt-text="Screenshot of the Create Recovery Services vault page.":::


> [!NOTE]
> Ensure that the System assigned Managed Identity is turned off for the Automation account for the _"Migrate"_ button to appear. If the account is not migrated and the _"Migrate"_ button isn't appearing, turn off the Managed Identity for the Automation Account and try again.

3. After the successful migration of your automation account, the authentication type for the linked account details on the **Extension update settings** page is updated.
1. Once the _Migrate_ operation is completed, toggle the **Site Recovery to manage** button to turn it _On_ again.

When you successfully migrate from a Run As to a Managed Identities account, the following changes are reflected on the Automation Run As Accounts :

-	System Assigned Managed Identity is enabled for the account (if not already enabled).
-	The **Contributor** role permission is  assigned to the Recovery Services vault’s subscription.
-	The script that updates the mobility agent to use Managed Identity based authentication is updated.


### Link an existing managed identity account to vault

To link an existing managed identity Automation account to your Recovery Services vault. Follow these steps:

#### Enable the managed identity for the vault

1. Go to the automation account that you have selected. Under **Account settings**, select **Identity**.

   :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/mi-automation-account.png" alt-text="Screenshot that shows the identity settings page.":::

1. Under the **System assigned**, change the **Status** to **On** and select **Save**.

   An Object ID is generated. The vault is now registered with Azure Active
   Directory.
    :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/enable-managed-identity-in-vault.png" alt-text="Screenshot that shows the system identity settings page.":::

1. Go back to your recovery services vault. On the left pane, select the **Access control (IAM)** option.
    :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/add-mi-iam.png" alt-text="Screenshot that shows IAM settings page.":::
1. Select **Add** > **Add role assignment** > **Contributor** to open the **Add role assignment** page.
1. On the **Add role assignment** page, ensure to select **Managed identity**.
1. Select the **Select members**. In the **Select managed identities** pane, do the following:
    1. In the **Select** field, enter the name of the managed identity automation account.
    1. In the **Managed identity** field, select **All system-assigned managed identities**.
    1. Select the **Select** option.
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/select-mi.png" alt-text="Screenshot that shows select managed identity settings page.":::
1. Select **Review + assign**.
1. Navigate to the **Extension update settings** under the Recovery Services Vault, toggle the **Site Recovery to manage** button to turn it _On_ again.

## Next steps

Learn more about:
- [Managed identities](../active-directory/managed-identities-azure-resources/overview.md).
- [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing).
