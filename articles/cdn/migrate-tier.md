---
title: Migrate Azure CDN from Microsoft (classic) to Azure Front Door Standard or Premium tier
description: This article provides step-by-step instructions on how to migrate from an Azure CDN from Microsoft (classic) profile to an Azure Front Door Standard or Premium tier profile.
services: cdn
author: halkazwini
ms.author: halkazwini
ms.service: azure-content-delivery-network
ms.topic: concept-article
ms.date: 08/26/2026
ROBOTS: NOINDEX
# Customer intent: "As a cloud administrator, I want to migrate from Azure CDN from Microsoft (classic) to Azure Front Door Standard or Premium tier, so that I can leverage enhanced security features and improved performance for my application content delivery."
---

# Migrate Azure CDN from Microsoft (classic) to Standard/Premium tier

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

Azure Front Door Standard and Premium tier bring the latest cloud delivery network features to Azure. By using enhanced security features and an all-in-one service, your application content is secured and closer to your end users through the Microsoft global network. This article guides you through the migration process to move your Azure CDN from Microsoft (classic) profile to either a Standard or Premium tier profile.

## Prerequisites

Review the [About Azure CDN from Microsoft (classic) migration](tier-migration.md) article.

## Validate compatibility

1. Go to your Azure CDN from Microsoft (classic) resource and select **Migration** from under *Settings*.

1. Select **Validate** to see if your Azure CDN from Microsoft (classic) profile is compatible for migration. Validation can take up to two minutes depending on the complexity of your CDN profile.

    :::image type="content" source="./media/migrate-tier/validate-cdn-profile.png" alt-text="Screenshot of the validated compatibility section of the migration page.":::

    If the migration isn't compatible, select **View errors** to see the list of errors and recommendations to resolve them.

1. Once your Azure CDN from Microsoft (classic) profile validates and is compatible for migration, you can move onto the prepare phase.

## Prepare for migration

1. The Azure Front Door profile name stays the same as the Azure CDN from Microsoft (classic) profile name. You can't change this name.

1. Select **Standard** or **Premium** tier based on your business requirements. Select the Premium tier to take advantage of the full feature set of Azure Front Door.

    > [!NOTE]
    > If your Azure CDN from Microsoft (classic) profile can migrate to the Standard tier but the number of resources exceeds the Standard tier limits, you'll be migrated to the Premium tier.

1. Change the endpoint name if the CDN endpoint name length exceeds the maximum of 46 characters. This change isn't required if the endpoint name is within the character limit. For more information, see [Azure Front Door endpoints](../frontdoor/endpoint.md). Since the maximum endpoint length for Azure Front Door is 64 characters, Azure adds a 16 character hash to the end of the endpoint name to ensure uniqueness and to prevent subdomain takeovers.

1. If you have geo filtering rules in Azure CDN, Azure Front Door creates a Web Application Firewall (WAF) custom rule with the same tier as the Front Door profile.

1. Select **Prepare**, and when prompted, select **Yes** to confirm that you want to proceed with the migration process. After you confirm, you can't make any further changes to the Azure CDN from Microsoft (classic) profile.

1. Select the link that appears to view the configuration of the new Front Door profile. At this time, you can review each of the settings for the new profile to ensure all settings are correct. When you finish reviewing the read-only profile, select the **X** in the top right corner of the page to return to the migration screen.

    :::image type="content" source="./media/migrate-tier/preparation-success.png" alt-text="Screenshot of the link to view the new read-only Front Door profile.":::

## Enable managed identities

If you use your own certificate, you need to enable managed identity so Azure Front Door can access the certificate in your Azure Key Vault. Managed identity is a feature of Microsoft Entra ID that you use to securely connect to other Azure services without managing credentials. For more information, see [What are managed identities for Azure resources?](..//active-directory/managed-identities-azure-resources/overview.md)

> [!NOTE]
> * If you don't use your own certificate, you don't need to enable managed identities or grant access to the Key Vault. You can skip to the [**Migrate**](#migrate) phase.
> * Managed certificate isn't currently supported for Azure Front Door Standard or Premium in Azure Government Cloud. You need to use BYOC for Azure Front Door Standard or Premium in Azure Government Cloud or wait until this capability is available.

1. Select **Enable** and then select either **System assigned** or **User assigned** depending on the type of managed identities you want to use.

    * *System assigned* - Toggle the status to **On** and then select **Save**.

    * *User assigned* - To create a user assigned managed identity, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If you already have a user managed identity, select the identity, and then select **Add**.

1. Select the **X** in the top right corner to return to the migration page. You see that you successfully enabled managed identities.

## Grant manage identity to Key Vault

Select **Grant** to add the managed identity to all Azure Key Vaults used with the Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/enable-managed-identity.png" alt-text="Screenshot of granting managed identity access to Key Vault.":::

## Migrate

Select **Migrate** to start the migration process. When prompted, select **Yes** to confirm you want to proceed with the migration. The migration can take a few minutes depending on the complexity of your Front Door (classic) profile.

:::image type="content" source="./media/migrate-tier/migrate.png" alt-text="Screenshot of migrate and confirmation button for Front Door migration.":::

> [!NOTE]
> If you cancel the migration, only the new Azure Front Door profile gets deleted. You need to manually delete any new WAF policy copies.

> [!WARNING]
> Once migration finishes, the Azure CDN from Microsoft (classic) is no longer available.

## Post-migration endpoint cutover

Azure CDN from Microsoft (classic) uses a different fully qualified domain name (FQDN) than Azure Front Door Standard or Premium. For example, a classic endpoint might be `contoso.azurefd.net`, while a Standard or Premium endpoint might be `contoso-mdjf2jfgjf82mnzx.z01.azurefd.net`. For more information, see [Endpoints in Azure Front Door](../frontdoor/endpoint.md).

Even though Azure Front Door automatically routes traffic from the classic endpoint to your new Standard or Premium profile without any configuration changes, you must complete the following post-migration action(s) depending on your scenario:

- Custom domains: Update the DNS record to point to the new Azure Front Door Standard/Premium endpoint.

- Direct use of the classic default endpoint: Replace the classic hostname with the new endpoint hostname in your applications, clients, and integrations.

Both endpoints remain functional during the transition, so you can make and validate this change without downtime.

> [!WARNING]
> Complete the endpoint cutover to the new Azure Front Door Standard/Premium endpoint by March 31, 2028. Starting April 1, 2028, classic endpoints are no longer supported and might stop functioning. Custom domains, applications, or clients that still depend on a classic endpoint might stop receiving traffic.

## Next step

> [!div class="nextstepaction"]
> [Resource mapping between Azure CDN and Azure Front Door](tier-migration.md#resource-mapping-after-migration)
