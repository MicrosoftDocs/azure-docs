# Enable Backup for Azure Stack with PowerShell
<azure-stack-backup-enablebackup-powershell.md>

Enable the Infrastructure Back Service with Windows PowerShell so that Azure Stack can be restored if there is a failure. The cmdlets to enable backup, start backup, and get backup information are all accessible via the operator management endpoint

## Download Azure Stack Tools

Configure Azure Stack tools using these instructions: [https://github.com/Azure/AzureStack-Tools](https://github.com/Azure/AzureStack-Tools). 

Copying the file locally (for example, C:\tools)

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   invoke-webrequest https://github.com/Azure/AzureStack-Tools/archive/master.zip -OutFile master.zip
   expand-archive master.zip -DestinationPath . -Force
   cd AzureStack-Tools-master
   ```

##  Configure Azure Stack Tools

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   Install-Module -Name 'AzureRm.Bootstrapper'
   Install-AzureRmProfile -profile '2017-03-09-profile' -Force
   Install-Module -Name AzureStack -RequiredVersion 1.2.11
   ```

The script may take several minutes to run.

##  Load the Connect and Infrastructure modules

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   cd C:\tools\AzureStack-Tools-master\Connect
    Import-Module .\AzureStack.Connect.psm1
    
    cd C:\tools\AzureStack-Tools-master\Infrastructure
    Import-Module .\AzureStack.Infra.psm1 
    
   ```

##  Setup Rm environment and log into the operator management endpoint

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   # Specify Azure Active Directory tenant name
    $TenantName = "contoso.onmicrosoft.com"
    
    # Set the module repository and the execution policy
    Set-PSRepository `
      -Name "PSGallery" `
      -InstallationPolicy Trusted
    
    Set-ExecutionPolicy RemoteSigned `
      -force
    
    # Configure the Azure Stack operator’s PowerShell environment.
    Add-AzureRMEnvironment `
      -Name "AzureStackAdmin" `
      -ArmEndpoint "https://adminmanagement.seattle.contoso.com"
    
    Set-AzureRmEnvironment `
      -Name "AzureStackAdmin" `
      -GraphAudience "https://graph.windows.net/"
    
    $TenantID = Get-AzsDirectoryTenantId `
      -AADTenantName $TenantName `
      -EnvironmentName AzureStackAdmin
    
    # Sign-in to the operator's console.
    Login-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $TenantID 
    
   ```
## Generate  a new encryption key

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   $encryptionkey = New-EncryptionKeyBase64
   ```

## Provide the backup share, credentials, and encryption key to enable backup

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   $username = "domain\backupoadmin"
    $password = "password"
    $credential = New-Object System.Management.Automation.PSCredential($username, ($password| ConvertTo-SecureString -asPlainText -Force))  
    $location = Get-AzsLocation
    $sharepath = "\\serverIP\AzSBackupStore\contoso.com\seattle"

Set-AzSBackupShare -Location $location -Path $path -UserName $credential.UserName -Password $credential.GetNetworkCredential().password -EncryptionKey $encryptionkey 

   ```
##  Confirm backup settings

Open Windows PowerShell with an elevated prompt, and run the following commands:

   ```powershell
   Get-AzsBackupLocation | ConvertTo-Json 
   {
    "ExternalStoreDefault":  {
        "Path":  "\\\\serverIP\\AzSBackupStore\\contoso.com\\seattle",
        "UserName":  "domain\backupoadmin",
        "Password":  null,
        "EncryptionKeyBase64":  null,
        "BackupFrequencyInMinutes":  "",
        "AvailableCapacity":  "10 GB",
        "IsBackupSchedulerEnabled":  false,
        "NextBackupTime":  null,
        "LastBackupTime":  null
       }
   } 

   ```

## Next steps

- Next step...