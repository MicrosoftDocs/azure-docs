Install and configure PowerShell for Azure Stack - quickstart


This topic is a quick start to install and configure PowerShell for Azure Stack. It combines the steps described in [Install PowerShell]( azure-stack-powershell-install.md), [Download tools]( azure-stack-powershell-download.md), [Configure PowerShell]( azure-stack-powershell-configure.md) articles. We have scoped the steps in this topic for Azure Stack administrator’s environment only, to learn about configuring PowerShell for user environment, see steps for user environment in [Configure PowerShell]( azure-stack-powershell-configure.md#configure-the-powershell-environment) topic.

To install and configure PowerShell for administrator’s environment, open an elevated PowerShell session and run the following script:

```powershell

# Set the module repository and the execution policy
Set-PSRepository `
  -Name "PSGallery" `
  -InstallationPolicy Trusted

Set-ExecutionPolicy Unrestricted -force


# Uninstall any existing Azure PowerShell modules. To uninstall, close all the active PowerShell sessions and run the following command:
Get-Module -ListAvailable | `
  where-Object {$_.Name -like “Azure*”} | `
  Uninstall-Module


# Install PowerShell for Azure Stack
Install-Module `
  -Name AzureRm.BootStrapper `
  -Force

Use-AzureRmProfile `
  -Profile 2017-03-09-profile `
  -Force

Install-Module `
  -Name AzureStack `
  -RequiredVersion 1.2.9 `
  -Force 

Import-Module `
  -Name AzureStack `
  -RequiredVersion 1.2.9 `
  -Force

# Download Azure Stack tools from GitHub and import the connect module
cd \

invoke-webrequest `
  https://github.com/Azure/AzureStack-Tools/archive/master.zip `
  -OutFile master.zip

expand-archive master.zip `
  -DestinationPath . `
  -Force

cd AzureStack-Tools-master

Import-Module `
  .\Connect\AzureStack.Connect.psm1

# Configure the administrator’s PowerShell environment.
Add-AzureStackAzureRmEnvironment `
  -Name "AzureStackAdmin" `
  -ArmEndpoint https://adminmanagement.local.azurestack.external

# Make sure to replace the 
$TenantName = "docustack.onmicrosoft.com"

$TenantID = Get-DirectoryTenantID `
  -AADTenantName $TenantName `
  -EnvironmentName AzureStackAdmin

# Sign-in to the administrative portal. Make sure to assign the UserName and Password details as per your environment.
$UserName= '<Username of the Active Directory service administrator>'
$Password= '<Active Directory service administrator password>'| `
  ConvertTo-SecureString -Force -AsPlainText
$Credential= New-Object PSCredential($UserName,$Password)
  
Login-AzureRmAccount `
  -EnvironmentName "AzureStackAdmin" `
  -TenantId $TenantID `
  -Credential $Credential
    
# Register resource providers on all subscriptions
Register-AllAzureRmProvidersOnAllSubscriptions
 
```

