# Enable Backup for Azure Stack from the administration console
<azure-stack-backup-enablebackup-console.md>

Enable the Infrastructure Back Service through the administration console so that Azure Stack can be restored if there is a failure. You can enable backup using the backup resource provider in the infrastructure management portal.

1. Open the Azure Stack administration console at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.

    ![Azure Stack - Backup controller settings](\media\azure-stack-backup\azure-stack-backup-settings.png).

3. Type the path to the **Backup storage location**. You must use a Universal Naming Convention (UNC) string for the path a file share hosted on a separate device. A UNC string is used to specify the location of resources such as shared files or devices. To ensure availability of the backup data in the event of a disaster, the  device should be in a separate location.
3. Type the **Username** using the domain and username. For example, `Contoso\administrator`.
4. Type the **Password** for the user.
5. Type the password again to **Confirm Password**.
6. Provide a pre-share key in the **Encryption Key** box. Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view this key from this interface Refer to online for more information on how to generate a pre-shared key. 
7. Select OK to save your backup controller settings.

To execute a backup, you need to download the Azure Stack Tools, and then run the PowerShell cmdlet **Start-AzSBackup** on your Azure Stack administration node. For more information, see [Back up Azure Stack](azure-stack-backup-back-up-Azure-Stack.md#Confirm-backup-completed-in-the administration-console).

## Next steps

 - Learn to run a backup, see [Back up Azure Stack](azure-stack-backup-back-up-Azure-Stack.md).
- Learn to verify that your backup ran, see [Confirm backup completed in administration console](azure-stack-backup-back-up-Azure-Stack.md#).