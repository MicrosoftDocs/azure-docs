---
title: Migrate Azure CDN from Microsoft (classic) to Azure Front Door Standard or Premium tier (preview)
description: This article provides step-by-step instructions on how to migrate from an Azure CDN from Microsoft (classic) profile to an Azure Front Door Standard or Premium tier profile.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: conceptual
ms.date: 06/25/2024
ms.author: duau
---

# Migrate Azure CDN from Microsoft (classic) to Standard/Premium tier (preview)

> [!IMPORTANT]
> Azure CDN from Microsoft to Azure Front Door migration is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Front Door Standard and Premium tier bring the latest cloud delivery network features to Azure. With enhanced security features and an all-in-one service, your application content is secured and closer to your end users using the Microsoft global network. This article guides you through the migration process to move your Azure CDN from Microsoft (classic) profile to either a Standard or Premium tier profile.

## Prerequisites

* Review the [About Azure CDN from Microsoft (classic) migration](tier-migration.md) article.

## Validate compatibility

1. Go to your Azure CDN from Microsoft (classic) resource and select **Migration** from under *Settings*.

1. Select **Validate** to see if your Azure CDN from Microsoft (classic) profile is compatible for migration. Validation can take up to two minutes depending on the complexity of your CDN profile.

    :::image type="content" source="./media/migrate-tier/validate.png" alt-text="Screenshot of the validated compatibility section of the migration page.":::

    If the migration isn't compatible, you can select **View errors** to see the list of errors, and recommendations to resolve them.

1. Once your Azure CDN from Microsoft (classic) profile validates and is compatible for migration, you can move onto prepare phase.

## Prepare for migration

1. The Azure Front Door profile name remains the same as the Azure CDN from Microsoft (classic) profile name. This name can't be changed.

1. You can select between **Standard** or **Premium** tier based on your business requirements. It's recommended to select Premium tier to take advantage of the full feature set of Azure Front Door.

    > [!NOTE]
    > If your Azure CDN from Microsoft (classic) profile can be migrated to the Standard tier but the number of resources exceeds the Standard tier limits, you'll be migrated to the Premium tier.

    :::image type="content" source="./media/migrate-tier/prepare-tier.png" alt-text="Screenshot of the selected tier for the new Front Door profile.":::

1. You need to change the endpoint name if the CDN endpoint name length exceeds the maximum of 46 characters. This isn't required if the endpoint name is within the character limit. For more information, see [Azure Front Door endpoints](../frontdoor/endpoint.md). Since the maximum endpoint length for Azure Front Door is 64 characters, Azure adds a 16 character hash to the end of the endpoint name to ensure uniqueness and to prevent subdomain takeovers.

    :::image type="content" source="./media/migrate-tier/endpoint-name.png" alt-text="Screenshot of the edit the endpoint name page.":::

1. If you have geo filtering rules in Azure CDN, Azure Front Door creates a Web Application Firewall (WAF) custom rule with the same tier as the Front Door profile.

1. Select **Prepare**, and when prompted, select **Yes** to confirm that you would like to proceed with the migration process. Once confirmed, you won't be able to make any further changes to the Azure CDN from Microsoft (classic) profile.

    :::image type="content" source="./media/migrate-tier/prepare-endpoint.png" alt-text="Screenshot of the prepare button and confirmation message to proceed with the migration.":::

1. Select the link that appears to view the configuration of the new Front Door profile. At this time, you can review each of the settings for the new profile to ensure all settings are correct. Once you're done reviewing the read-only profile, select the **X** in the top right corner of the page to go back to the migration screen.

    :::image type="content" source="./media/migrate-tier/verify-new-profile.png" alt-text="Screenshot of the link to view the new read-only Front Door profile.":::

## Enable managed identities

If you're using your own certificate and you need to enable managed identity so Azure Front Door can access the certificate in your Azure Key Vault. Managed identity is a feature of Microsoft Entra ID that allows you to securely connect to other Azure services without having to manage credentials. For more information, see [What are managed identities for Azure resources?](..//active-directory/managed-identities-azure-resources/overview.md)

> [!NOTE]
> * If you're not using your own certificate, enabling managed identities and granting access to the Key Vault is not required. You can skip to the [**Migrate**](#migrate) phase.
> * Managed certificate is currently **not supported** for Azure Front Door Standard or Premium in Azure Government Cloud. You need to use BYOC for Azure Front Door Standard or Premium in Azure Government Cloud or wait until this capability is available.

1. Select **Enable** and then select either **System assigned** or **User assigned** depending on the type of managed identities you want to use.

    * *System assigned* - Toggle the status to **On** and then select **Save**.

    * *User assigned* - To create a user assigned managed identity, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you've already have a user managed identity, select the identity, and then select **Add**.

1. Select the **X** in the top right corner to return to the migration page. You'll then see that you've successfully enabled managed identities.

## Grant manage identity to Key Vault

Select **Grant** to add the managed identity to all Azure Key Vaults used with the Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/enable-managed-identity.png" alt-text="Screenshot of granting managed identity access to Key Vault.":::

## Migrate

1. Select **Migrate** to initiate the migration process. When prompted, select **Yes** to confirm you want to move forward with the migration. The migration can take a few minutes depending on the complexity of your Front Door (classic) profile.

    :::image type="content" source="./media/migrate-tier/migrate.png" alt-text="Screenshot of migrate and confirmation button for Front Door migration.":::

    > [!NOTE]
    > If you cancel the migration, only the new Azure Front Door profile gets deleted. Any new WAF policy copies will need to be manually deleted.

> [!WARNING]
> Once migration has completed, the Azure CDN from Microsoft (classic) is no longer available.

## Next steps

* Understand the [mapping between Azure CDN and Azure Front Door](tier-migration.md#resource-mapping-after-migration) settings.
