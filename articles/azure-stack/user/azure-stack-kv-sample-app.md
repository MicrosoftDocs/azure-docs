---
title: Allow application to retrieve Azure Stack Key Vault secrets  | Microsoft Docs
description: Use a sample app to work with Azure Stack Key Vault
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: 3748b719-e269-4b48-8d7d-d75a84b0e1e5
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/26/2017
ms.author: sngun

---

# Sample application that uses keys and secrets stored in a key vault

In this guide, you'll run a sample application (HelloKeyVault) that retrieves keys and secrets from a key vault in Azure Stack.

## Prerequisites 

Run the following prerequisites either from the [development kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or from a Windows-based external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn):

* Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).  
* Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md). 

## Create and get the key vault and application settings

Firstly, you should create a Key Vault in Azure Stack, and register an application in the Active Directory. You can create and register them by using portal or PowerShell, this topic shows you the PowerShell way to do the tasks. By default, this PowerShell script creates a new application in the active directory, however, you can also use one of your existing application. Make sure to provide valuea for the `aadTenantName` and `applicationPassword` variables. If you don't specify a value for the `applicationPassword` variable this script will generate a random password. 

```powershell
$vaultName           = 'myVault'
$resourceGroupName   = 'myResourceGroup'
$applicationName     = 'myApp'
$location            = 'local' 

# Password for the application, if not specified, this script will generate a random password during app creation.
$applicationPassword = '' 
                         
# Function to generate a random password for the application.
Function GenerateSymmetricKey()
{
    $key = New-Object byte[](32)
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($key)
    return [System.Convert]::ToBase64String($key)
}

Write-Host 'Please log into your Azure Stack user environment' -foregroundcolor Green

$tenantARM = "https://management.local.azurestack.external"
$aadTenantName = "PLEASE FILL THIS IN WITH YOUR AAD TENANT NAME. FOR EXAMPLE: myazurestack.onmicrosoft.com"

# Configure the Azure Stack operator’s PowerShell environment.
Add-AzureRMEnvironment `
  -Name "AzureStackUser" `
  -ArmEndpoint $tenantARM

Set-AzureRmEnvironment `
  -Name "AzureStackAdmin" `
  -GraphAudience "https://graph.windows.net/"

$TenantID = Get-AzsDirectoryTenantId `
  -AADTenantName $aadTenantName `
  -EnvironmentName AzureStackUser

# Sign-in to the user portal.
Login-AzureRmAccount `
  -EnvironmentName "AzureStackUser" `
  -TenantId $TenantID `
  
$now = [System.DateTime]::Now
$oneYearFromNow = $now.AddYears(1)

$applicationPassword = GenerateSymmetricKey
	
# Create a new AD application.
$identifierUri = [string]::Format("http://localhost:8080/{0}",[Guid]::NewGuid().ToString("N"))
$homePage = "http://contoso.com"

Write-Host "Creating a new AAD Application"
$ADApp = New-AzureRmADApplication `
  -DisplayName $applicationName `
  -HomePage $homePage `
  -IdentifierUris $identifierUri `
  -StartDate $now `
  -EndDate $oneYearFromNow `
  -Password $applicationPassword

Write-Host "Creating a new AAD service principal"
$servicePrincipal = New-AzureRmADServicePrincipal `
  -ApplicationId $ADApp.ApplicationId

# Create a new resource group and a key vault within that resource group.
New-AzureRmResourceGroup `
  -Name $resourceGroupName `
  -Location $location   

Write-Host "Creating vault $vaultName"
$vault = New-AzureRmKeyVault -VaultName $vaultName `
  -ResourceGroupName $resourceGroupName `
  -Sku standard `
  -Location $location

# Specify full privileges to the vault for the application.
Write-Host "Setting access policy"
Set-AzureRmKeyVaultAccessPolicy -VaultName $vaultName `
  -ObjectId $servicePrincipal.Id `
  -PermissionsToKeys all `
  -PermissionsToSecrets all

Write-Host "Paste the following settings into the app.config file for the HelloKeyVault project:"
'<add key="VaultUrl" value="' + $vault.VaultUri + '"/>'
'<add key="AuthClientId" value="' + $servicePrincipal.ApplicationId + '"/>'
'<add key="AuthClientSecret" value="' + $applicationPassword + '"/>'
Write-Host

``` 

The following screen shot shows the output of the previous script:

![app config](media/azure-stack-kv-sample-app/settingsoutput.png)

Make a note of the VaultUrl, AuthClientId, AuthClientSecret values returned by the previous script. You will use these values to run the HelloKeyVault application.

## Download and run the sample application

Download the key vault sample from the Azure [key vault client samples](https://www.microsoft.com/en-us/download/details.aspx?id=45343) page. Extract the contents of the .zip file onto your development workstation. There are two samples within the samples folder, we will use the HellpKeyVault sample in this topic. Navigate to the Microsoft.Azure.KeyVault.Samples > samples > HelloKeyVault folder and open the HelloKeyVault application in Visual Studio. 

Open the HelloKeyVault\App.config file and replace the values of <appSettings> element with the VaultUrl, AuthClientId, AuthClientSecret values returned by the previous script. Note that by default the App.config contains place holder for **AuthCertThumbprint** but you will use **AuthClientSecret** instead. After you replace the settings, rebuild the solution and start the application.

![app settings](media/azure-stack-kv-sample-app/appconfig.png)
 
The application signs in to Azure AD, then uses that token to authenticate to key vault in Azure Stack. The application performs operations like create, encrypt, wrap, delete etc. on the keys and secrets of the key vault. You can also pass specific parameters such as ‘encrypt’, ‘decrypt’ etc. to the application, which makes sure that the application executes only those operations against the vault. 


## Next steps
[Deploy a VM with a Key Vault password](azure-stack-kv-deploy-vm-with-secret.md)

[Deploy a VM with a Key Vault certificate](azure-stack-kv-push-secret-into-vm.md)

