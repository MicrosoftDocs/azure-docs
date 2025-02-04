---
title: Migrate Azure Front Door (classic) to Standard or Premium tier
description: This article provides step-by-step instructions on how to migrate from an Azure Front Door (classic) profile to an Azure Front Door Standard or Premium tier profile.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: duau
---

# Migrate Azure Front Door (classic) to Standard or Premium tier

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

Azure Front Door Standard and Premium tiers offer advanced cloud delivery network features, enhanced security, and improved performance by using the Microsoft global network. This guide helps you migrate your Azure Front Door (classic) profile to a Standard or Premium tier profile.

## Prerequisites

* Review the [About Azure Front Door tier migration](tier-migration.md) article.
* Ensure your Azure Front Door (classic) profile meets the migration requirements:
    * Azure Front Door Standard and Premium require all custom domains to use HTTPS. If you don't have your own certificate, you can use an Azure Front Door managed certificate, which is free and managed for you.
    * Session affinity is enabled in the origin group settings for Azure Front Door Standard or Premium profiles. In Azure Front Door (classic), session affinity is set at the domain level. During migration, session affinity settings are based on the Azure Front Door (classic) profile. If you have two domains in your classic profile sharing the same backend pool (origin group), session affinity must be consistent across both domains for migration validation to pass.

> [!NOTE]
> No DNS changes are required before or during the migration. However, after migration completes and traffic is flowing through your new Azure Front Door profile, you must update your DNS records. For more information, see [Update DNS records](#update-dns-records).

## Validate compatibility

1. Navigate to your Azure Front Door (classic) resource and select **Migration** under *Settings*.

    :::image type="content" source="./media/migrate-tier/overview.png" alt-text="Screenshot of the migration button for an Azure Front Door (classic) profile.":::

1. Select **Validate** to check if your Azure Front Door (classic) profile is compatible for migration. Validation can take up to two minutes depending on the complexity of your profile.

    :::image type="content" source="./media/migrate-tier/validate.png" alt-text="Screenshot of the validate compatibility section of the migration page.":::

    If the migration isn't compatible, select **View errors** to see the list of errors and recommendations for resolving them.

    :::image type="content" source="./media/migrate-tier/validation-failed.png" alt-text="Screenshot of the Azure Front Door (classic) profile failing validation phase.":::

1. Once your Azure Front Door (classic) profile passes validation and is deemed compatible for migration, proceed to the preparation phase.

    :::image type="content" source="./media/migrate-tier/validation-passed.png" alt-text="Screenshot of the Azure Front Door (classic) profile passing validation for migration.":::

## Prepare for migration

1. A default name is provided for the new Azure Front Door profile. You can change this name before proceeding.

    :::image type="content" source="./media/migrate-tier/prepare-name.png" alt-text="Screenshot of the name field in the prepare phase for the new Azure Front Door profile.":::

1. The Azure Front Door tier is automatically selected based on the Azure Front Door (classic) WAF policy settings.

    :::image type="content" source="./media/migrate-tier/prepare-tier.png" alt-text="Screenshot of the selected tier for the new Azure Front Door profile.":::

    * **Standard** - Selected if you only have custom WAF rules associated with the Azure Front Door (classic) profile. You can choose to upgrade to a Premium tier.
    * **Premium** - Selected if you use managed WAF rules associated with the Azure Front Door (classic) profile. To use the Standard tier, remove the managed WAF rules from the Azure Front Door (classic) profile.

1. Select **Configure WAF policy upgrades** to decide whether to upgrade your current WAF policies or use an existing compatible WAF policy.

    :::image type="content" source="./media/migrate-tier/prepare-waf.png" alt-text="Screenshot of the configured WAF policy link during Azure Front Door migration preparation.":::

    > [!NOTE]
    > The **Configure WAF policy upgrades** link appears only if you have WAF policies associated with the Azure Front Door (classic) profile.

    For each WAF policy associated with the Azure Front Door (classic) profile, select an action. You can copy the WAF policy to match the tier you're migrating to or use an existing compatible WAF policy. You can also change the WAF policy name from the default provided name. Once completed, select **Apply** to save your Azure Front Door WAF settings.

    :::image type="content" source="./media/migrate-tier/waf-policy.png" alt-text="Screenshot of the upgrade WAF policy screen.":::

1. Select **Prepare**, and when prompted, select **Yes** to confirm that you want to proceed with the migration process. Once confirmed, you can't make further changes to the Azure Front Door (classic) profile.

    :::image type="content" source="./media/migrate-tier/prepare-confirmation.png" alt-text="Screenshot of the prepare button and confirmation message to proceed with the migration.":::

1. Select the link that appears to view the configuration of the new Azure Front Door profile. Review each setting to ensure they're correct. Once done, select the **X** in the top right corner to return to the migration screen.

    :::image type="content" source="./media/migrate-tier/verify-new-profile.png" alt-text="Screenshot of the link to view the new read-only Azure Front Door profile.":::

## Enable managed identities

If you're using your own certificate, you need to enable managed identity so Azure Front Door can access the certificate in your Azure Key Vault. Managed identity is a feature of Microsoft Entra ID that allows you to securely connect to other Azure services without managing credentials. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

> [!NOTE]
> * If you're not using your own certificate, enabling managed identities and granting access to the Key Vault is not required. You can skip to the [**Migrate**](#migrate) phase.
> * Managed certificates are currently **not supported** for Azure Front Door Standard or Premium in Azure Government Cloud. You need to use BYOC for Azure Front Door Standard or Premium in Azure Government Cloud or wait until this capability is available.

1. Select **Enable** and then choose either **System assigned** or **User assigned** depending on the type of managed identity you want to use.

    :::image type="content" source="./media/migrate-tier/enable-managed-identity.png" alt-text="Screenshot of the enable managed identity button for Azure Front Door migration.":::

    * **System assigned** - Toggle the status to **On** and then select **Save**.
    * **User assigned** - To create a user-assigned managed identity, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you already have a user-assigned managed identity, select the identity, and then select **Add**.

1. Close the page to return to the migration page. You'll then see that managed identities were successfully enabled.

    :::image type="content" source="./media/migrate-tier/enable-managed-identity-successful.png" alt-text="Screenshot of managed identity getting enabled.":::

## Grant managed identity access to Azure Key Vault

Select **Grant** to add the managed identity to all Azure Key Vaults used with the Azure Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/grant-access.png" alt-text="Screenshot of granting managed identity access to Azure Key Vault.":::

## Migrate

1. Select **Migrate** to start the migration process. Confirm by selecting **Yes** when prompted. The migration duration depends on the complexity of your Azure Front Door (classic) profile.

    :::image type="content" source="./media/migrate-tier/migrate.png" alt-text="Screenshot of migrate and confirmation button for Azure Front Door migration.":::

    > [!NOTE]
    > If you cancel the migration, only the new Azure Front Door profile is deleted. Any new WAF policy copies must be manually deleted.

1. After migration completes, select the banner at the top of the page or the link in the success message to access the new Azure Front Door profile.

    :::image type="content" source="./media/migrate-tier/successful-migration.png" alt-text="Screenshot of a successful Azure Front Door migration.":::

1. The Azure Front Door (classic) profile is now **Disabled** and can be deleted from your subscription.

    :::image type="content" source="./media/migrate-tier/classic-profile.png" alt-text="Screenshot of the overview page of an Azure Front Door (classic) in disabled state.":::

> [!WARNING]
> Deleting the new profile after migration will delete the production environment, which is irreversible.

## Update DNS records

Azure Front Door (classic) uses a different fully qualified domain name (FQDN) than Azure Front Door Standard or Premium. For example, a classic endpoint might be `contoso.azurefd.net`, while a Standard or Premium endpoint might be `contoso-mdjf2jfgjf82mnzx.z01.azurefd.net`. For more information, see [Endpoints in Azure Front Door](endpoint.md).

You don't need to update your DNS records before or during the migration. Azure Front Door automatically routes traffic from the classic endpoint to your new Standard or Premium profile without any configuration changes.

After migration, you should update your DNS records to point to the new Azure Front Door endpoint. This ensures your profile continues to function properly in the future. Updating DNS records doesn't cause any downtime and can be done at your convenience.

## Next steps

* Understand the [mapping between Azure Front Door tiers](tier-mapping.md) settings.
* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
