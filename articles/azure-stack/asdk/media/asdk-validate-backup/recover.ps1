$adminpass = ConvertTo-SecureString 'D0c$@Msft!!'-AsPlainText -Force
$backupEncryptionKey = ConvertTo-SecureString 'Q1lhbkh2WXhIQWtPT2ZNbm16TVFmTFdyeFhHdktQWk9ublFGdEZQQ0FoaFVIdE5QT0JXaE1XUWlySVF1Z0lvWg==' -AsPlainText -Force
$backupSharePassword = ConvertTo-SecureString 'D0c$@Msft!!' -AsPlainText -Force
$backupShareCred = New-Object System.Management.Automation.PSCredential('administrator', $backupSharePassword)
$externalCertPassword = ConvertTo-SecureString 'D0c$@Msft!!!' -AsPlainText -Force
cd C:\CloudDeployment\Setup
.\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -InfraAzureDirectoryTenantName jeffgilb.com -DNSForwarder 10.50.10.50 -TimeServer 132.163.97.2 -BackupStorePath \\WIN-0D0DBC86S8V\MASBackup -BackupStoreCredential $backupShareCred -BackupEncryptionKeyBase64 $backupEncryptionKey -BackupId 4b21b376-fcb6-45cf-a2b6-0e6139e128d4 -ExternalCertPassword $externalCertPassword