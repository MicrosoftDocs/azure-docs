---
title: Migrate Azure Front Door (classic) to Standard/Premium tier using the Azure portal (Preview)
description: This article provides step-by-step instructions on how to migrate from an Azure Front Door (classic) profile to an Azure Front Door Standard or Premium tier profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/22/2023
ms.author: duau
---

# Migrate Azure Front Door (classic) to Standard/Premium tier using the Azure portal (Preview)

Azure Front Door Standard and Premium tier bring the latest cloud delivery network features to Azure. With enhanced security features and an all-in-one service, your application content is secured and closer to your end users with the Microsoft global network. This article will guide you through the migration process to migrate your Front Door (classic) profile to either a Standard or Premium tier profile to begin using these latest features.

> [!IMPORTANT]
> Migration capability for Azure Front Door is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* Review the [About Front Door tier migration](tier-migration.md) article.
* Ensure your Front Door (classic) profile can be migrated:
    * HTTPS is required for all custom domains. Azure Front Door Standard and Premium enforce HTTPS on all domains. If you don't have your own certificate, you can use an Azure Front Door managed certificate. The certificate is free and managed for you.
    * If you use BYOC (Bring your own certificate) for Azure Front Door (classic), you'll need to grant Key Vault access to your Azure Front Door Standard or Premium profile by completing the following steps:
        * Register the service principal for **Microsoft.AzureFrontDoor-Cdn** as an app in your Azure Active Directory using Azure PowerShell.
        * Grant **Microsoft.AzureFrontDoor-Cdn** access to your Key Vault.
    * Session affinity gets enabled from the origin group settings in the Azure Front Door Standard or Premium profile. In Azure Front Door (classic), session affinity is managed at the domain level. As part of the migration, session affinity is based on the Classic profile's configuration. If you have two domains in the Classic profile that shares the same backend pool (origin group), session affinity has to be consistent across both domains in order for migration to be compatible.

> [!NOTE]
> You don't need to make any DNS changes before or during the migration process.
> 
> However, when the migration is completed and traffic flows through your new Azure Front Door Standard or Premium profile, you should update your DNS records. For more information, see [Update DNS records](#update-dns-records).

## Validate compatibility

1. Go to the Azure Front Door (classic) resource and select **Migration** from under *Settings*.

    :::image type="content" source="./media/migrate-tier/overview.png" alt-text="Screenshot of the migration button for a Front Door (classic) profile.":::

1. Select **Validate** to see if your Front Door (classic) profile is compatible for migration. This check can take up to two minutes depending on the complexity of your Front Door profile.

    :::image type="content" source="./media/migrate-tier/validate.png" alt-text="Screenshot of the validate compatibility button from the migration page.":::

1. If the migration isn't compatible, you can select **View errors to see a list of errors, and recommendation to resolve them.

    :::image type="content" source="./media/migrate-tier/validation-failed.png" alt-text="Screenshot of the Front Door validate migration with errors.":::

1. Once the migration tool has validated that your Front Door profile is compatible to migrate, you can move onto preparing for migration.

    :::image type="content" source="./media/migrate-tier/validation-passed.png" alt-text="Screenshot of the Front Door migration passing validation.":::

## Prepare for migration

1. A default name for the new Front Door profile has been provided for you. You can change this name before proceeding to the next step.

    :::image type="content" source="./media/migrate-tier/prepare-name.png" alt-text="Screenshot of the prepared name for Front Door migration.":::

1. A Front Door tier is automatically selected for you based on the Front Door (classic) WAF policy settings. 

    :::image type="content" source="./media/migrate-tier/prepare-tier.png" alt-text="Screenshot of the selected tier for the new Front Door profile.":::

    * A Standard tier gets selected if you *only have custom WAF rules* associated to the Front Door (classic) profile. You may choose to upgrade to a Premium tier. 
    * A Premium tier gets selected if you *have managed WAF rules* associated to the Classic profile. To use Standard tier, the managed WAF rules must first be removed from the Classic profile.

1. Select **Configure WAF policy upgrades** to configure the WAF policies to be upgraded. Select the action you would like to happen for each WAF policy. You can either copy the old WAF policy to the new WAF policy or select and existing WAF policy that matches the Front Door tier. If you chose to copy the WAF policy, each WAF policy will be given a default WAF policy name that you can change. Select **Apply** once you finish making changes to the WAF policy configuration.

    :::image type="content" source="./media/migrate-tier/prepare-waf.png" alt-text="Screenshot of the configure WAF policy link during Front Door migration preparation.":::

    > [!NOTE]
    > The **Configure WAF policy upgrades** link only appears if you have WAF policies associated to the Front Door (classic) profile.

    For each WAF policy associated to the Front Door (classic) profile select an action. You can make copy of the WAF policy that matches the tier you're migrating the Front Door profile to or you can use an existing WAF policy that matches the tier. You may also update the WAF policy names from the default names assigned. Select **Apply** to save the WAF settings. 

    :::image type="content" source="./media/migrate-tier/waf-policy.png" alt-text="Screenshot of the upgrade wAF policy screen.":::

1. Select **Prepare**, and then select **Yes** to confirm you would like to proceed with the migration process. Once confirmed, you won't be able to make any further changes to the Front Door (classic) settings.

    :::image type="content" source="./media/migrate-tier/prepare-confirmation.png" alt-text="Screenshot the prepare button and confirmation to proceed with Front Door migration.":::

1. Select the link that appears to view the configuration of the new Front Door profile. At this time, review each of the settings for the new profile to ensure all settings are correct. Once you're done reviewing the read-only profile, select the **X** in the top right corner of the page to go back to the migration screen.

    :::image type="content" source="./media/migrate-tier/verify-new-profile.png" alt-text="Screenshot of the link to view the new read-only Front Door profile.":::

> [!NOTE]
> If you're not using your own certificate, enabling managed identities and granting access to the Key Vault is not required. You can skip to the [**Migrate**](migrate-tier.md#migrate) step.

## Enable managed identities

You're using your own certificate and will need to enable managed identity so Azure Front Door can access the certificate in your Key Vault.

1. Select **Enable** and then select either **System assigned** or **User assigned** depending on the type of managed identities you want to use. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)

    :::image type="content" source="./media/migrate-tier/enable-managed-identity.png" alt-text="Screenshot of the enable manage identity button for Front Door migration.":::

    * *System assigned* - Toggle the status to **On** and then select **Save**.

    * *User assigned* - To create a user assigned managed identity, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you've already have a user managed identity, select the identity, and then select **Add**.

1. Select the **X** to return to the migration page. You'll then see that you've successfully enabled managed identities.

    :::image type="content" source="./media/migrate-tier/enable-managed-identity-successful.png" alt-text="Screenshot of managed identity getting enabled.":::

## Grant manage identity to Key Vault

Select **Grant** to add managed identities from the last section to all the Key Vaults used in the Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/grant-access.png" alt-text="Screenshot of granting managed identity access to Key Vault.":::

## Migrate

1. Select **Migrate** to initiate the migration process. When prompted, select **Yes** to confirm you want to move forward with the migration. Once the migration is completed, you can select the banner at the top to go to the new Front Door profile.

    :::image type="content" source="./media/migrate-tier/migrate.png" alt-text="Screenshot of migrate and confirmation button for Front Door migration.":::

    > [!NOTE]
    > If you cancel the migration, only the new Front Door profile will get deleted. Any new WAF policy copies will need to be manually deleted.

    > [!WARNING]
    > Deleting the new profile will delete the production configuration once the **Migrate** step is initiated, which is an irreversible change. 


1. Once the migration completes, you can select the banner the top of the page or the link from the successful message to go to the new Front Door profile.

    :::image type="content" source="./media/migrate-tier/successful-migration.png" alt-text="Screenshot of a successful Front Door migration.":::

1. The Front Door (classic) profile is now in a **Disabled** state and can be deleted from your subscription.

    :::image type="content" source="./media/migrate-tier/classic-profile.png" alt-text="Screenshot of the overview page of a Front Door (classic) in a disabled state.":::

## Update DNS records

Your old Azure Front Door (classic) instance uses a different fully qualified domain name (FQDN) than Azure Front Door Standard and Premium. For example, an Azure Front Door (classic) endpoint might be `contoso.azurefd.net`, while the Azure Front Door Standard or Premium endpoint might be `contoso-mdjf2jfgjf82mnzx.z01.azurefd.net`. For more information about Azure Front Door Standard and Premium endpoints, see [Endpoints in Azure Front Door](./endpoint.md).

You don't need to update your DNS records before or during the migration process. Azure Front Door automatically sends traffic that it receives on the Azure Front Door (classic) endpoint to your Azure Front Door Standard or Premium profile without you making any configuration changes.

However, when your migration is finished, we strongly recommend that you update your DNS records to direct traffic to the new Azure Front Door Standard or Premium endpoint. Changing your DNS records helps to ensure that your profile continues to work in the future. The change in DNS record doesn't cause any downtime. You don't need to plan this update to happen at any specific time, and you can schedule it at your convenience.

## Next steps

* Understand the [mapping between Front Door tiers](tier-mapping.md) settings.
* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
