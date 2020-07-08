---
title: Automatic update of the Mobility service in Azure Site Recovery
description: Overview of automatic update of the Mobility service when replicating Azure VMs by using Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 04/02/2020
ms.author: rajanaki
---

# Automatic update of the Mobility service in Azure-to-Azure replication

Azure Site Recovery uses a monthly release cadence to fix any issues and enhance existing features or add new ones. To remain current with the service, you must plan for patch deployment each month. To avoid the overhead associated with each upgrade, you can allow Site Recovery to manage component updates.

As mentioned in [Azure-to-Azure disaster recovery architecture](azure-to-azure-architecture.md), the Mobility service is installed on all Azure virtual machines (VMs) that have replication enabled from one Azure region to another. When you use automatic updates, each new release updates the Mobility service extension.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## How automatic updates work

When you use Site Recovery to manage updates, it deploys a global runbook (used by Azure services) via an automation account, created in the same subscription as the vault. Each vault uses one automation account. For each VM in a vault, the runbook checks for active auto-updates. If a newer version of the Mobility service extension is available, the update is installed.

The default runbook schedule occurs daily at 12:00 AM in the time zone of the replicated VM's geography. You can also change the runbook schedule via the automation account.

> [!NOTE]
> Starting with [Update Rollup 35](site-recovery-whats-new.md#updates-march-2019), you can choose an existing automation account to use for updates. Prior to Update Rollup 35, Site Recovery created the automation account by default. You can only select this option when you enable replication for a VM. It isn't available for a VM that already has replication enabled. The setting you select applies to all Azure VMs protected in the same vault.

Turning on automatic updates doesn't require a restart of your Azure VMs or affect ongoing replication.

Job billing in the automation account is based on the number of job runtime minutes used in a month. Job execution takes a few seconds to about a minute each day and is covered as free units. By default, 500 minutes are included as free units for an automation account, as shown in the following table:

| Free units included (each month) | Price |
|---|---|
| Job runtime 500 minutes | ₹0.14/minute

## Enable automatic updates

There are several ways that Site Recovery can manage the extension updates:

- [Manage as part of the enable replication step](#manage-as-part-of-the-enable-replication-step)
- [Toggle the extension update settings inside the vault](#toggle-the-extension-update-settings-inside-the-vault)
- [Manage updates manually](#manage-updates-manually)

### Manage as part of the enable replication step

When you enable replication for a VM either starting [from the VM view](azure-to-azure-quickstart.md) or [from the recovery services vault](azure-to-azure-how-to-enable-replication.md), you can either allow Site Recovery to manage updates for the Site Recovery extension or manage it manually.

:::image type="content" source="./media/azure-to-azure-autoupdate/enable-rep.png" alt-text="Extension settings":::

### Toggle the extension update settings inside the vault

1. From the Recovery Services vault, go to **Manage** > **Site Recovery Infrastructure**.
1. Under **For Azure Virtual Machines** > **Extension Update Settings** > **Allow Site Recovery to manage**, select **On**.

   To manage the extension manually, select **Off**.

1. Select **Save**.

:::image type="content" source="./media/azure-to-azure-autoupdate/vault-toggle.png" alt-text="Extension update settings":::

> [!IMPORTANT]
> When you choose **Allow Site Recovery to manage**, the setting is applied to all VMs in the vault.

> [!NOTE]
> Either option notifies you of the automation account used for managing updates. If you're using this feature in a vault for the first time, a new automation account is created by default. Alternately, you can customize the setting, and choose an existing automation account. All subsequent takes to enable replication in the same vault will use the previously created automation account. Currently, the drop-down menu will only list automation accounts that are in the same Resource Group as the vault.

### Manage updates manually

1. If there are new updates for the Mobility service installed on your VMs, you'll see the following notification: **New Site Recovery replication agent update is available. Click to install.**

   :::image type="content" source="./media/vmware-azure-install-mobility-service/replicated-item-notif.png" alt-text="Replicated items window":::

1. Select the notification to open the VM selection page.
1. Choose the VMs you want to upgrade, and then select **OK**. The Update Mobility service will start for each selected VM.

   :::image type="content" source="./media/vmware-azure-install-mobility-service/update-okpng.png" alt-text="Replicated items VM list":::

## Common issues and troubleshooting

If there's an issue with the automatic updates, you'll see an error notification under **Configuration issues** in the vault dashboard.

If you can't enable automatic updates, see the following common errors and recommended actions:

- **Error**: You do not have permissions to create an Azure Run As account (service principal) and grant the Contributor role to the service principal.

  **Recommended action**: Make sure that the signed-in account is assigned as Contributor and try again. For more information about assigning permissions, see the required permissions section of [How to: Use the portal to create an Azure AD application and service principal that can access resources](/azure/azure-resource-manager/resource-group-create-service-principal-portal#required-permissions).

  To fix most issues after you enable automatic updates, select **Repair**. If the repair button isn't available, see the error message displayed in the extension update settings pane.

  :::image type="content" source="./media/azure-to-azure-autoupdate/repair.png" alt-text="Site Recovery service repair button in extension update settings":::

- **Error**: The Run As account does not have the permission to access the recovery services resource.

  **Recommended action**: Delete and then [re-create the Run As account](/azure/automation/automation-create-runas-account). Or, make sure that the Automation Run As account's Azure Active Directory application can access the recovery services resource.

- **Error**: Run As account is not found. Either one of these was deleted or not created - Azure Active Directory Application, Service Principal, Role, Automation Certificate asset, Automation Connection asset - or the Thumbprint is not identical between Certificate and Connection.

  **Recommended action**: Delete and then [re-create the Run As account](/azure/automation/automation-create-runas-account).

- **Error**: The Azure Run as Certificate used by the automation account is about to expire.

  The self-signed certificate that is created for the Run As account expires one year from the date of creation. You can renew it at any time before it expires. If you have signed up for email notifications, you will also receive emails when an action is required from your side. This error will be shown two months prior to the expiry date, and will change to a critical error if the certificate has expired. Once the certificate has expired, auto update will not be functional until you renew the same.

  **Recommended action**: To resolve this issue, select **Repair** and then **Renew Certificate**.

  :::image type="content" source="./media/azure-to-azure-autoupdate/automation-account-renew-runas-certificate.PNG" alt-text="renew-cert":::

  > [!NOTE]
  > After you renew the certificate, refresh the page to display the current status.
