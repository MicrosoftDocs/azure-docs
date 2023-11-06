---
title: Migrate Azure Front Door (classic) to Standard/Premium tier
description: This article provides step-by-step instructions on how to migrate from an Azure Front Door (classic) profile to an Azure Front Door Standard or Premium tier profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/24/2023
ms.author: duau
---

# Migrate Azure Front Door (classic) to Standard/Premium tier

Azure Front Door Standard and Premium tier bring the latest cloud delivery network features to Azure. With enhanced security features and an all-in-one service, your application content is secured and closer to your end users using the Microsoft global network. This article will guide you through the migration process to move your Azure Front Door (classic) profile to either a Standard or Premium tier profile.

## Prerequisites

* Review the [About Front Door tier migration](tier-migration.md) article.
* Ensure your Front Door (classic) profile can be migrated:
    * Azure Front Door Standard and Premium requires all custom domains to use HTTPS. If you don't have your own certificate, you can use an Azure Front Door managed certificate. The certificate is free of charge and gets managed for you.
    * Session affinity gets enabled in the origin group settings for an Azure Front Door Standard or Premium profile. In Azure Front Door (classic), session affinity is set at the domain level. As part of the migration, session affinity is based on the Front Door (classic) profile settings. If you have two domains in your classic profile that shares the same backend pool (origin group), session affinity has to be consistent across both domains in order for migration validation to pass.

> [!NOTE]
> You don't need to make any DNS changes before or during the migration process. However, once the migration completes and traffic is flowing through your new Azure Front Door profile, you need to update your DNS records. For more information, see [Update DNS records](#update-dns-records).

## Validate compatibility

1. Go to your Azure Front Door (classic) resource and select **Migration** from under *Settings*.

    :::image type="content" source="./media/migrate-tier/overview.png" alt-text="Screenshot of the migration button for a Front Door (classic) profile.":::

1. Select **Validate** to see if your Azure Front Door (classic) profile is compatible for migration. Validation can take up to two minutes depending on the complexity of your Front Door profile.

    :::image type="content" source="./media/migrate-tier/validate.png" alt-text="Screenshot of the validate compatibility section of the migration page.":::

    If the migration isn't compatible, you can select **View errors** to see the list of errors, and recommendations to resolve them.

    :::image type="content" source="./media/migrate-tier/validation-failed.png" alt-text="Screenshot of the Front Door (classic) profile failing validation phase.":::

1. Once your Azure Front Door (classic) profile validates and is compatible for migration, you can move onto prepare phase.

    :::image type="content" source="./media/migrate-tier/validation-passed.png" alt-text="Screenshot of the Front Door (classic) profile passing validation for migration.":::

## Prepare for migration

1. A default name has been provided for you for the new Front Door profile. You can change the profile name before proceeding to the next step.

    :::image type="content" source="./media/migrate-tier/prepare-name.png" alt-text="Screenshot the name field in the prepare phase for the new Front Door profile.":::

1. The Front Door tier gets automatically selected for you based on the Front Door (classic) WAF policy settings. 

    :::image type="content" source="./media/migrate-tier/prepare-tier.png" alt-text="Screenshot of the selected tier for the new Front Door profile.":::

    * **Standard** - If you *only have custom WAF rules* associated to the Front Door (classic) profile. You may choose to upgrade to a Premium tier. 
    * **Premium** - If you *have managed WAF rules* associated to the Front Door (classic) profile. To use Standard tier, the managed WAF rules must be removed from the Front Door (classic) profile.

1. Select **Configure WAF policy upgrades** to configure whether you want to upgrade your current WAF policies or to use an existing compatible WAF policy.

    :::image type="content" source="./media/migrate-tier/prepare-waf.png" alt-text="Screenshot of the configure WAF policy link during Front Door migration preparation.":::

    > [!NOTE]
    > The **Configure WAF policy upgrades** link will only appear if you have WAF policies associated to the Front Door (classic) profile.

    For each WAF policy associated to the Front Door (classic) profile select an action. You can make copy of the WAF policy that matches the tier you're migrating the Front Door profile to or you can use an existing compatible WAF policy. You may also change the WAF policy name from the default provided name. Once completed, select **Apply** to save your Front Door WAF settings. 

    :::image type="content" source="./media/migrate-tier/waf-policy.png" alt-text="Screenshot of the upgrade WAF policy screen.":::

1. Select **Prepare**, and when prompted, select **Yes** to confirm that you would like to proceed with the migration process. Once confirmed, you won't be able to make any further changes to the Front Door (classic) profile.

    :::image type="content" source="./media/migrate-tier/prepare-confirmation.png" alt-text="Screenshot of the prepare button and confirmation message to proceed with the migration.":::

1. Select the link that appears to view the configuration of the new Front Door profile. At this time, you can review each of the settings for the new profile to ensure all settings are correct. Once you're done reviewing the read-only profile, select the **X** in the top right corner of the page to go back to the migration screen.

    :::image type="content" source="./media/migrate-tier/verify-new-profile.png" alt-text="Screenshot of the link to view the new read-only Front Door profile.":::

## Enable managed identities

> [!NOTE]
> If you're not using your own certificate, enabling managed identities and granting access to the Key Vault is not required. You can skip to the [**Migrate**](#migrate) phase.

If you're using your own certificate and you'll need to enable managed identity so Azure Front Door can access the certificate in your Azure Key Vault. Managed identity is a feature of Microsoft Entra ID that allows you to securely connect to other Azure services without having to manage credentials. For more information, see [What are managed identities for Azure resources?](..//active-directory/managed-identities-azure-resources/overview.md)

1. Select **Enable** and then select either **System assigned** or **User assigned** depending on the type of managed identities you want to use.

    :::image type="content" source="./media/migrate-tier/enable-managed-identity.png" alt-text="Screenshot of the enable manage identity button for Front Door migration.":::

    * *System assigned* - Toggle the status to **On** and then select **Save**.

    * *User assigned* - To create a user assigned managed identity, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you've already have a user managed identity, select the identity, and then select **Add**.

1. Select the **X** in the top right corner to return to the migration page. You'll then see that you've successfully enabled managed identities.

    :::image type="content" source="./media/migrate-tier/enable-managed-identity-successful.png" alt-text="Screenshot of managed identity getting enabled.":::

## Grant manage identity to Key Vault

Select **Grant** to add the managed identity to all Azure Key Vaults used with the Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/grant-access.png" alt-text="Screenshot of granting managed identity access to Key Vault.":::

## Migrate

1. Select **Migrate** to initiate the migration process. When prompted, select **Yes** to confirm you want to move forward with the migration. The migration may take a few minutes depending on the complexity of your Front Door (classic) profile.

    :::image type="content" source="./media/migrate-tier/migrate.png" alt-text="Screenshot of migrate and confirmation button for Front Door migration.":::

    > [!NOTE]
    > If you cancel the migration, only the new Front Door profile gets deleted. Any new WAF policy copies will need to be manually deleted.

1. Once migration completes, you can select the banner the top of the page or the link at the bottom from the successful message to go to the new Front Door profile.

    :::image type="content" source="./media/migrate-tier/successful-migration.png" alt-text="Screenshot of a successful Front Door migration.":::

1. The Front Door (classic) profile is now **Disabled** and can be deleted from your subscription.

    :::image type="content" source="./media/migrate-tier/classic-profile.png" alt-text="Screenshot of the overview page of a Front Door (classic) in disabled state.":::

> [!WARNING]
> Once migration has completed, if you delete the new profile that will delete the production environment, which is an irreversible change.

## Update DNS records

Your old Azure Front Door (classic) instance uses a different fully qualified domain name (FQDN) than Azure Front Door Standard and Premium. For example, an Azure Front Door (classic) endpoint might be `contoso.azurefd.net`, while the Azure Front Door Standard or Premium endpoint might be `contoso-mdjf2jfgjf82mnzx.z01.azurefd.net`. For more information about Azure Front Door Standard and Premium endpoints, see [Endpoints in Azure Front Door](endpoint.md).

You don't need to update your DNS records before or during the migration process. Azure Front Door automatically sends traffic that it receives on the Azure Front Door (classic) endpoint to your Azure Front Door Standard or Premium profile without you making any configuration changes.

However, once your migration is finished, we strongly recommend that you update your DNS records to direct traffic to the new Azure Front Door Standard or Premium endpoint. Changing your DNS records helps to ensure that your profile continues to work in the future. The change in DNS record won't cause any downtime. You don't need to plan ahead for this update to happen, and can schedule it at your convenience.

## Next steps

* Understand the [mapping between Front Door tiers](tier-mapping.md) settings.
* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
