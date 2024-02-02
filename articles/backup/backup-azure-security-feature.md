---
title: Security features that protect hybrid backups
description: Learn how to use security features in Azure Backup to make backups more secure
ms.reviewer: utraghuv
ms.topic: how-to
ms.date: 11/07/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Security features to help protect hybrid backups that use Azure Backup

Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup now provides security features to help protect hybrid backups. This article covers how to enable and leverage these features to protect on-premises workloads using **Microsoft Azure Backup Server (MABS)**, **Data Protection Manager (DPM)**, and **Microsoft Azure Recovery Services (MARS) agent**. These features include:

- **Prevention**. An additional layer of authentication is added whenever a critical operation like changing a passphrase is performed. This validation is to ensure that such operations can be performed only by users who have valid Azure credentials.
- **Alerting**. An email notification is sent to the subscription admin whenever a critical operation like deleting backup data is performed. This email ensures that the user is notified quickly about such actions.
- **Recovery**. Deleted backup data is retained for an additional 14 days from the date of the deletion. This ensures recoverability of the data within a given time period, so there's no data loss even if an attack happens. Also, a greater number of minimum recovery points are maintained to guard against corrupt data.

> [!NOTE]
> Enable Multi-user authorization (MUA) on your recovery services vault to add an additional layer of protection to the critical operation of disabling security features. [Learn more](multi-user-authorization.md).

## Minimum version requirements

Enable the security features only if you're using:

- **Azure Backup agent**: Minimum agent version _2.0.9052_. After you enable these features, upgrade the  agent version to perform critical operations.
- **Azure Backup Server**: Minimum Azure Backup agent version _2.0.9052_ with _Azure Backup Server update 1_.
- **System Center Data Protection Manager**: Minimum Azure Backup agent version _2.0.9052_ with _Data Protection Manager 2012 R2 UR12_/ _Data Protection Manager 2016 UR2_.

>[!Note]
>Ensure that you don’t enable the security features if you're using infrastructure as a service (IaaS) VM backup. Currently, these features aren't available for IaaS VM backup and thus, enabling them won't have an impact.

## Enable security features

If you're creating a Recovery Services vault, you can use all the security features. If you're working with an existing vault, enable security features by following these steps:

1. Sign in to the Azure portal by using your Azure credentials.
2. Select **Browse**, and type **Recovery Services**.

    ![Screenshot of Azure portal Browse option](./media/backup-azure-security-feature/browse-to-rs-vaults.png) <br/>

    The list of Recovery Services vaults appears. From this list, select a vault. The selected vault dashboard opens.
3. From the list of items that appears under the vault, under **Settings**, select **Properties**.

    ![Screenshot of Recovery Services vault options](./media/backup-azure-security-feature/vault-list-properties.png)
4. Under **Security Settings**, select **Update**.

    ![Screenshot of Recovery Services vault properties](./media/backup-azure-security-feature/security-settings-update.png)

    The update link opens the **Security Settings** pane, which provides a summary of the features and lets you enable them.

5. **Enable** the security features and select **Save**.

    ![Screenshot of security settings](./media/backup-azure-security-feature/enable-security-settings-dpm-update.png)

## Recover deleted backup data

If security features setting is enabled, Azure Backup retains deleted backup data for an additional 14 days, and doesn't delete it immediately if the **Stop backup with delete backup data** operation is performed. To restore this data in the 14-day period, take the following steps, depending on what you're using:

For **Azure Recovery Services agent** users:

1. If the computer where backups were happening is still available, reprotect the deleted data sources, and use the [Recover data to the same machine](backup-azure-restore-windows-server.md#use-instant-restore-to-recover-data-to-the-same-machine) in Azure Recovery Services, to recover from all the old recovery points.
2. If this computer isn't available, use [Recover to an alternate machine](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine) to use another Azure Recovery Services computer to get this data.

For **Azure Backup Server** users:

1. If the server where backups were happening is still available, reprotect the deleted data sources, and use the **Recover Data** feature to recover from all the old recovery points.
2. If this server isn't available, use [Recover data from another Azure Backup Server](backup-azure-alternate-dpm-server.md) to use another Azure Backup Server instance to get this data.

For **Data Protection Manager** users:

1. If the server where backups were happening is still available, reprotect the deleted data sources, and use the **Recover Data** feature to recover from all the old recovery points.
2. If this server isn't available, use [Add External DPM](backup-azure-alternate-dpm-server.md) to use another Data Protection Manager server to get this data.

## Prevent attacks

Checks have been added to make sure only valid users can perform various operations. These include adding an extra layer of authentication, and maintaining a minimum retention range for recovery purposes.

### Authentication to perform critical operations

As part of adding an extra layer of authentication for critical operations, you're prompted to enter a security PIN when you perform **Stop Protection with Delete data** and **Change Passphrase** operations for DPM, MABS, and MARS.

Additionally, with MARS version *2.0.9262.0* and later, the operations to remove a volume from MARS file/folder backup, add a new exclusion setting for an existing volume, reduce retention duration, and move to a less-frequent backup schedule are also protected with a security pin for additional security.




> [!NOTE]
> Currently, for the following DPM and MABS versions, security PIN is supported for **Stop Protection with Delete data** to online storage:
>- DPM 2016 UR9 or later
>- DPM 2019 UR1 or later
>- MABS v3 UR1 or later 

To receive this PIN:

1. Sign in to the Azure portal.
2. Browse to **Recovery Services vault** > **Settings** > **Properties**.
3. Under **Security PIN**, select **Generate**. This opens a pane that contains the PIN to be entered in the Azure Recovery Services agent user interface.
    This PIN is valid for only five minutes, and it gets generated automatically after that period.

### Maintain a minimum retention range

To ensure that there are always a valid number of recovery points available, the following checks have been added:

- For daily retention, a minimum of **seven** days of retention should be done.
- For weekly retention, a minimum of **four** weeks of retention should be done.
- For monthly retention, a minimum of **three** months of retention should be done.
- For yearly retention, a minimum of **one** year of retention should be done.

## Notifications for critical operations

Typically, when a critical operation is performed, the subscription admin is sent an email notification with details about the operation. You can configure additional email recipients for these notifications by using the Azure portal.

The security features mentioned in this article provide defense mechanisms against targeted attacks. More importantly, if an attack happens, these features give you the ability to recover your data.

## Troubleshoot errors

| Operation | Error details | Resolution |
| --- | --- | --- |
| Policy change |The backup policy couldn't be modified. Error: The current operation failed due to an internal service error [0x29834]. Please retry the operation after sometime. If the issue persists, please contact Microsoft support. |**Cause:**<br/>This error appears when security settings are enabled, you try to reduce retention range below the minimum values specified above and you're on an unsupported  version (supported versions are specified in first note of this article). <br/>**Recommended Action:**<br/> In this case, you should set retention period above the minimum retention period specified (seven days for daily, four weeks for weekly, three weeks for monthly or one year for yearly) to proceed with policy-related updates. Optionally, a preferred approach would be to update the backup agent, Azure Backup Server and/or DPM UR to leverage all the security updates. |
| Change Passphrase |Security PIN entered is incorrect. (ID: 100130) Provide the correct Security PIN to complete this operation. |**Cause:**<br/> This error comes when you enter invalid or expired Security PIN while performing critical operation (like change passphrase). <br/>**Recommended Action:**<br/> To complete the operation, you must enter valid Security PIN. To get the PIN, sign in to the Azure portal and navigate to Recovery Services vault > Settings > Properties > Generate Security PIN. Use this PIN to change passphrase. |
| Change Passphrase |Operation failed. ID: 120002 |**Cause:**<br/>This error appears when security settings are enabled, you try to change the passphrase and you're on an unsupported version (valid versions specified in first note of this article).<br/>**Recommended Action:**<br/> To change the passphrase, you must first update the backup agent to minimum version 2.0.9052, Azure Backup Server to minimum update 1, and/or DPM to minimum DPM 2012 R2 UR12 or DPM 2016 UR2 (download links below), then enter a valid Security PIN. To get the PIN, sign in to the Azure portal and navigate to Recovery Services vault > Settings > Properties > Generate Security PIN. Use this PIN to change passphrase. |

## Immutability support

When [immutability](backup-azure-immutable-vault-concept.md?tabs=recovery-services-vault) for your Recovery Services vault is enabled, operations that reduce the cloud backup retention or remove cloud backup for on-premises data sources are blocked.

### Immutability support for DPM and MABS

This feature is supported with MARS agent version *2.0.9250.0* and higher from DPM 2022 UR1 and MABS v4.

The following table lists the disallowed operations on DPM connected to an immutable Recovery:

| Operation on Immutable vault | Result with DPM 2022 UR1, MABS v4, and latest MARS agent.    <br><br>   With DPM 2022 UR2 or MABS v4 UR1, you can select the option to retain online recovery points by policy when stopping protection or removing a data source from a protection group from the console.   | Result with older DPM/MABS and or MARS agent |
| --- | --- | --- |
| **Remove Data Source from protection group configured for online backup** | 81001: The backup item(s) can't be deleted because it has active recovery points, and the selected vault is an immutable vault. | 130001: Microsoft Azure Backup encountered an internal error. |
| **Stop protection with delete data** | 81001: The backup item(s) can't be deleted because it has active recovery points, and the selected vault is an immutable vault.    <br><br>   With DPM 2022 UR2 or MABS v4 UR1, you can select the option to retain online recovery points by policy when stopping protection or removing a data source from a protection group from the console.    | 130001: Microsoft Azure Backup encountered an internal error. |
| **Reduce online retention period** | 810002: Reduction in retention during Policy/Protection modification isn't allowed because the selected vault is immutable. | 130001: Microsoft Azure Backup encountered an internal error. |
| **Remove-DPMChildDatasource command** | 81001: The backup item(s) can't be deleted because it has active recovery points, and the selected vault is an immutable vault. <br><br> Use new option *-EnableOnlineRPsPruning* with *-KeepOnlineData* to retain data only up to policy duration.     <br><br>   With DPM 2022 UR2 or MABS v4 UR1, you can select the option to retain online recovery points by policy when stopping protection or removing a data source from a protection group from the console.    | 130001: Microsoft Azure Backup encountered an internal error. <br><br> Use the *-KeepOnlineData* flag to retain data. |

### Immutability support for MARS

The following table lists the disallowed operations for MARS when immutability is enabled on the Recovery Services vault. Other operations, such as increasing retention and excluding a file/folder from backup are allowed.

| Disallowed operation | Result with latest MARS agent | Result with old MARS agent |
| --- | --- | --- |
| **Stop protection with delete data for system state** | Error 810001 <br><br> User trying to delete backup item or stop protection with delete data where backup item has valid (unexpired) recovery point. | Error 130001 <br><br> Microsoft Azure Backup encountered an internal error. |
| **Stop protection with delete data** | Error 810001 <br><br> User trying to delete backup item or stop protection with delete data where backup item has valid (unexpired) recovery point. | Error 130001 <br><br> Microsoft Azure Backup encountered an internal error.    <br><br>    MARS *2.0.9262.0* and later provide the option of stopping protection and retaining recovery points according to the policy in the console. |
| **Reduce online retention period** | User trying to modify policy or protection with reduction of retention. | 130001 <br><br> Microsoft Azure Backup encountered an internal error. |
| **Remove-OBPolicy with -DeleteBackup flag** | 810001 <br><br> User trying to delete backup item or stop protection with delete data where backup item has valid (unexpired) recovery point. <br><br> Use *–EnablePruning* flag to retain backups up to their retention period. | 130001 <br><br> Microsoft Azure Backup encountered an internal error. <br><br> Don't use the *-DeleteBackup* flag.     <br><br>  MARS *2.0.9262.0*  and later provide the option of stopping protection and retaining recovery points according to the policy in the console. |


## Next steps

- [Get started with Azure Recovery Services vault](backup-azure-vms-first-look-arm.md) to enable these features.
- [Download the latest Azure Recovery Services agent](https://aka.ms/azurebackup_agent) to help protect Windows computers and guard your backup data against attacks.
