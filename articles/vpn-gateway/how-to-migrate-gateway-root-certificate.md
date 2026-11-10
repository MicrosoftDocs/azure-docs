---
title: How to migrate a gateway root certificate for P2S Gateway
titleSuffix: Azure VPN Gateway  
description: Learn Migrate your P2S VPN gateway to the new root certificate using the Azure portal's guided Prepare, Migrate, and Commit workflow.
ms.service: azure-vpn-gateway
ms.date: 10/20/2026
ms.topic: concept-article
author: raboilla
ms.author: raboilla
ai-usage: ai-assisted
---

# How to migrate a gateway root certificate for P2S Gateway  

This article helps you migrate a point-to-site (P2S) VPN gateway to the new gateway root certificate by using the guided migration experience in the Azure portal. For background on why the migration is needed and who is affected, see [About gateway root certificate migration and P2S VPN profile updates](https://learn.microsoft.com/azure/vpn-gateway/point-to-site-about-gateway-certificate-migration)

> [!Important] 
> You must commit the migration before January 31, 2027. Before you can start the migration, you must download the updated VPN client profile and distribute it to all P2S VPN users. If you start the migration before the updated profile is available on clients, users can lose connectivity.

The migration uses the same Prepare, Migrate, and Commit workflow as the Basic SKU public IP address migration for VPN Gateway. For more information about that workflow, see [How to migrate a Basic SKU public IP address to a Standard SKU for VPN Gateway](https://learn.microsoft.com/azure/vpn-gateway/basic-public-ip-migrate-howto?tabs=portal). Your gateway configuration, including tunnel type, authentication method, address pool, and routing, doesn't change.

## Workflow

In the Azure portal, the migration has the following stages:

- Prepare for migration. Download the updated VPN client profile and distribute it to all P2S VPN clients. Then select **Prepare** so Azure validates the gateway and prepares it for migration.

- Migrate. Azure migrates the gateway to the new certificate configuration.

- Commit. After you validate that VPN users can connect with the updated profile, commit the migration to finalize it. You can select **Abort** before you commit to roll back.

## Before you begin

- You must have Azure RBAC permissions to view the virtual network gateway, make changes to it, and download VPN client configurations.

- The updated VPN client profile must be generated and distributed to all P2S VPN users of the gateway. This requirement applies regardless of the authentication method your gateway uses.

- While preparation and migration are in progress, you can't make configuration changes to the gateway.

- Before starting the G2 root certificate migration, verify that your VPN gateway uses a Standard SKU public IP address. If it currently uses a Basic SKU public IP address, complete the migration to Standard SKU first, and then proceed with the G2 root certificate migration if required.

## Find the migration option

- In the Azure portal, go to your virtual network gateway resource.

- In the left pane, under **Settings**, select **Configuration**. If your gateway is eligible, a banner appears at the top of the page that says **Action required: Migrate your Point-to-Site VPN gateway**.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/p2s-gateway-migration-action-required-banner.png" alt-text="Screenshot of Configuration page showing Action required: Migrate your Point-to-Site VPN gateway banner.":::

- Select the **Point-to-site Profile Migration** tab.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/action-required-migrate-vpn-gateway-banner.png" alt-text="Screenshot of the Point-to-site Profile Migration tab showing migration status and options.":::

## Prepare for migration

The first step is to make sure your clients have the updated VPN client profile.

## Download and distribute the updated VPN client profile

-  In the Azure portal, go to your virtual network gateway. Under **Settings**, select **Point-to-site configuration**.

-  Select **Download VPN client**, and save the ZIP file to your local computer. The ZIP file contains profiles for all supported VPN client types.

-  Distribute the updated profile to all users who connect to the gateway by using P2S VPN, and have them install it. The new profile doesn't automatically overwrite an existing profile on the client. For detailed steps, see [How to update point-to-site VPN clients](https://learn.microsoft.com/azure/vpn-gateway/point-to-site-user-vpn-profile-update?tabs=vpn-gateway).

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/download-vpn-client-selected.png" alt-text="Screenshot of Point-to-site configuration page with Download VPN client button selected and preparing download message.":::

*Screenshot: Point-to-site configuration page with Download VPN client selected.*

> [!NOTE]
> If you select **Prepare** before the updated profile is downloaded and distributed, profile validation fails and you see the message "Profile validation failed. Please download new VPN client profile and distribute to all clients then retry migration." Complete the download and distribution steps, and then retry **Prepare**.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/profile-validation-failed-message.png" alt-text="Screenshot of Point-to-site Profile Migration tab showing profile validation failed error message.":::

*Screenshot: Profile validation failed message.*

## Run Prepare

- Return to **Settings** > **Configuration**, and select the **Point-to-site Profile Migration** tab.

- Select **Prepare**. While preparation is in progress, you can't make changes to the gateway.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/p2s-profile-migration-prepare-button.png" alt-text="Screenshot of Point-to-site Profile Migration tab with the Prepare button highlighted.":::

*Screenshot: Select Prepare to start preparation.*

When preparation finishes, the portal shows **Migration preparation successful**, and the **Migrate** option becomes available.

## Migrate

- After preparation succeeds, select **Migrate**. You can't make changes to the gateway during migration.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/migration-preparation-successful-migrate-button.png" alt-text="Screenshot of Point-to-site Profile Migration tab with Migrate and Abort buttons highlighted.":::

*Screenshot: Migration preparation successful. Select Migrate.*

- The portal shows **Migration in progress**. Wait for the migration to finish. You can select **Refresh** to update the status.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/gateway-profile-migration-status.png" alt-text="Screenshot of Point-to-site Profile Migration tab showing migration in progress status.":::

*Screenshot: Migration in progress.*

## Validate and commit the migration

When the migration succeeds, the portal prompts you to commit it. Before you commit, validate that VPN users can connect successfully by using the updated P2S VPN client profile.

> [!IMPORTANT]
> Validate the migration before you commit. Committing finalizes the migration and can't be undone. If connectivity isn't working as expected, select Abort instead.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/p2s-profile-migration-commit-button.png" alt-text="Screenshot of Point-to-site Profile Migration tab showing successful steps with Commit button highlighted.":::

*Screenshot: Migration successful. Validate connectivity, and then select Commit.*

- Connect to the gateway from a client that has the updated profile installed, and verify that you can reach your Azure resources.

- When connectivity is confirmed, select Commit.

- In the Commit the Point-to-site profile migration dialog, select Commit changes.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/commit-point-to-site-profile-migration.png" alt-text="Screenshot of the Commit the Point-to-site profile migration dialog with Commit changes button.":::

*Screenshot: Commit confirmation dialog.*

The portal shows Migration commit operation in progress. When the commit finishes, the migration is complete.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/p2s-profile-migration-commit-progress.png" alt-text="Screenshot of gateway configuration page showing migration commit operation in progress.":::

*Screenshot: Migration commit in progress.*

## Abort the migration

If you need to roll back, select **Abort**, and then select **Abort changes** in the confirmation dialog. Aborting rolls the gateway back to its previous point-to-site profile configuration. You can abort at any point before you commit. After you commit, the migration can't be undone.

:::image type="content" source="media/how-to-migrate-gateway-root-certificate-for-p2s/abort-p2s-profile-migration-dialog.png" alt-text="Screenshot of the abort confirmation dialog with Abort changes and Cancel buttons.":::

*Screenshot: Abort confirmation dialog.*

## Frequently asked questions

### Do I have to start the migration myself?

Yes, for the customer-initiated migration described in this article, you start **Prepare**, **Migrate**, and **Commit** from the Azure portal. You must complete and commit the migration before January 31, 2027.

### Why does Prepare fail with a profile validation error?

Azure checks that you downloaded the updated VPN client profile for the gateway. Download the profile from **Point-to-site configuration**, distribute it to your clients, and then retry **Prepare**.

### Do I need to update the profile if I don't use certificate authentication?

Yes. The gateway certificate is used regardless of the authentication method configured for your P2S VPN.

### Will my gateway configuration change?

No. Tunnel type, authentication method, address pool, and routing configuration remain unchanged.

### Why do I see Gateway is not currently supported for migration when I select Prepare?

Some Azure VPN gateways aren't currently eligible for the P2S gateway root certificate migration. If your gateway isn't eligible, the migration experience displays the message Gateway is not currently supported for migration when you attempt the Prepare step.
If you receive this message, don't proceed with the migration at this time. No additional action is required until migration support is available for your gateway.

### Can I make changes to the gateway during migration?

No. Gateway changes are blocked during Prepare and Migrate. Plan the migration for a time when you don't need to modify the gateway.

### Is there a cost?

No. There are no pricing changes associated with this migration or with installing a new VPN client profile.

## Next steps

- About gateway root certificate migration and P2S VPN profile updates

- How to update point-to-site VPN clients

- Azure VPN Gateway troubleshooting documentation
