# Back up Azure Stack
<azure-stack-backup-back-up-Azure-Stack.md>

Perform an on-demand backup on Azure-Stack with backup in place. If you need to enable the Infrastructure Backup Service, see [Enable Backup for Azure Stack from the administration console](azure-stack-backup-enablebackup-console.md).

## Start Azure Stack Backup

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   Start-AzSBackup -Location $location
   ```

## Confirm backup completed in the administration console

1. Open the Azure Stack administration console at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.
3. Find the **Name** and **Date Completed** of the backup in **Available backups** list.
4. Verify the **State** is **Succeeded**.

You can also confirm the backup completed from the administration console. Navigate to `\MASBackup\<datetime>\<backupid>\BackupInfo.xml`

`if it hasn't not succeeded what are the steps to take?`

## Next steps

- Next step...