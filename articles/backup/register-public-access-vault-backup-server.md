---
title: Re-register the MABS server with Recovery Services vault using public access
description: Learn how to re-register your MABS server with an Azure Backup Recovery Services vault using public access after deleting private endpoints.
#customer intent: As a MABS user, I want to re-register my server with a Recovery Services vault using public access so that I can back up on-premises data securely.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 12/01/2025
ms.topic: how-to
ms.service: azure-backup
---

# Re-register the MABS server with Recovery Services vault using public access

If you don't want to continue using private endpoints for backup, delete them from the vault and re-register MABS. You don’t need to stop protection.

This article describes how to delete private endpoints and register your Microsoft Azure Backup Server (MABS) to use public access of the Recovery Services vault.

## Delete private endpoints

To delete the private endpoint from Recovery Service vault, follow these steps:

1. Go to the vault you created, and then select **Settings** > **Networking** > **Private access**.

1. To stop using the private endpoint, select the **private endpoint** from the list, and then select **Reject** > **Yes**.

   After you confirm rejection, the vault starts rejecting private endpoint connections. Wait for the operation to complete. Once the operation completes the private endpoint **Connection Status** changes to **Rejected**.

   :::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-connection-rejected.png" alt-text="Screenshot shows the rejected status of private endpoint connection." lightbox="media/private-endpoint-vault-backup-server/private-endpoint-connection-rejected.png":::

1. To confirm the deletion for the private endpoint, select the **private endpoint** > **Delete** > **Yes** .

   :::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-deletion-confirmation.png" alt-text="Screenshot shows the private endpoint deletion confirmation dialog box." lightbox="media/private-endpoint-vault-backup-server/private-endpoint-deletion-confirmation.png":::

1. After the private endpoint deletion is complete, go to the **Vault** > **Settings** > **Networking** > **Public access**, and then select **Allow from all network and select apply**.

   :::image type="content" source="media/private-endpoint-vault-backup-server/vault-public-access-settings.png" alt-text="Screenshot shows the vault public access settings with allow from all networks option." lightbox="media/private-endpoint-vault-backup-server/vault-public-access-settings.png":::

## Register the MABS Server with vault

After you delete the private endpoints from the vault, download a new Credential File from the Azure portal for that vault.

To register the MABS Server with the vault, follow these steps:

1. Sign in to the  **MABS** Server, and then select **Management** > **Online** > **Register**.

1. On the **Register Server Wizard**, follow the onscreen instruction and provide the **same passphrase** that was used initially to register MABS Server on the **Encryption Setting** pane.

1. Select **Register** and wait for the registration process to complete.

   :::image type="content" source="media/private-endpoint-vault-backup-server/backup-server-registration.png" alt-text="Screenshot shows the backup server registration process and encryption settings.":::

## Related content

- [About private endpoints (v1 experience) for Azure Backup](private-endpoints-overview.md).
- [About private endpoints (v2 experience) for Azure Backup](backup-azure-private-endpoints-concept.md).
- [Configure private endpoint in Azure Backup vaults for backup using DPM server](/system-center/dpm/private-endpoint-configure-vault-backup-server?view=sc-dpm-2025&preserve-view=true).
- [Reregister the DPM server with Recovery Services vault using public access](/system-center/dpm/register-public-access-vault-backup-server?view=sc-dpm-2025&preserve-view=true).




