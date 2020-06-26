---
title: Securely access Key Vault with Batch
description: Learn how to programmatically access your credentials from Key Vault using Azure Batch.
ms.topic: how-to
ms.date: 02/13/2020
---

# Securely access Key Vault with Batch

In this article, you'll learn how to set up Batch nodes to securely access credentials stored in Azure Key Vault. There's no point in putting your admin credentials in Key Vault, then hard-coding credentials to access Key Vault from a script. The solution is to use a certificate that grants your Batch nodes access to Key Vault. With a few steps, we can implement secure key storage for Batch.

To authenticate to Azure Key Vault from a Batch node, you need:

- An Azure Active Directory (Azure AD) credential
- A certificate
- A Batch account
- A Batch pool with at least one node

## Obtain a certificate

If you don't already have a certificate, the easiest way to get one is to generate a self-signed certificate using the `makecert` command-line tool.

You can typically find `makecert` in this path: `C:\Program Files (x86)\Windows Kits\10\bin\<arch>`. Open a command prompt as an administrator and navigate to `makecert` using the following example.

```console
cd C:\Program Files (x86)\Windows Kits\10\bin\x64
```

Next, use the `makecert` tool to create self-signed certificate files called `batchcertificate.cer` and `batchcertificate.pvk`. The common name (CN) used isn't important for this application, but it's helpful to make it something that tells you what the certificate is used for.

```console
makecert -sv batchcertificate.pvk -n "cn=batch.cert.mydomain.org" batchcertificate.cer -b 09/23/2019 -e 09/23/2019 -r -pe -a sha256 -len 2048
```

Batch requires a `.pfx` file. Use the [pvk2pfx](https://docs.microsoft.com/windows-hardware/drivers/devtest/pvk2pfx) tool to convert the `.cer` and `.pvk` files created by `makecert` to a single `.pfx` file.

```console
pvk2pfx -pvk batchcertificate.pvk -spc batchcertificate.cer -pfx batchcertificate.pfx -po
```

## Create a service principal

Access to Key Vault is granted to either a **user** or a **service principal**. To access Key Vault programmatically, use a service principal with the certificate we created previous step.

For more information on Azure service principals, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md).

> [!NOTE]
> The service principal must be in the same Azure AD tenant as the Key Vault.

```powershell
$now = [System.DateTime]::Parse("2020-02-10")
# Set this to the expiration date of the certificate
$expirationDate = [System.DateTime]::Parse("2021-02-10")
# Point the script at the cer file you created $cerCertificateFilePath = 'c:\temp\batchcertificate.cer'
$cer = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$cer.Import($cerCertificateFilePath)
# Load the certificate into memory
$credValue = [System.Convert]::ToBase64String($cer.GetRawCertData())
# Create a new AAD application that uses this certificate
$newADApplication = New-AzureRmADApplication -DisplayName "Batch Key Vault Access" -HomePage "https://batch.mydomain.com" -IdentifierUris "https://batch.mydomain.com" -certValue $credValue -StartDate $now -EndDate $expirationDate
# Create new AAD service principal that uses this application
$newAzureAdPrincipal = New-AzureRmADServicePrincipal -ApplicationId $newADApplication.ApplicationId
```

The URLs for the application aren't important since we're only using them for Key Vault access.

## Grant rights to Key Vault

The service principal created in the previous step needs permission to retrieve the secrets from Key Vault. Permission can be granted either through the Azure portal or with the PowerShell command below.

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName 'BatchVault' -ServicePrincipalName '"https://batch.mydomain.com' -PermissionsToSecrets 'Get'
```

## Assign a certificate to a Batch account

Create a Batch pool, then go to the certificate tab in the pool and assign the certificate you created. The certificate is now on all Batch nodes.

Next, we need to assign the certificate to the Batch account. Assigning the certificate to the account allows us to assign it to the pools and then to the nodes. The easiest way to do this is to go to your Batch account in the portal, navigate to **Certificates**, and select **Add**. Upload the `.pfx` file we generated in the [Obtain a certificate](#obtain-a-certificate) and supply the password. Once complete, the certificate is added to the list and you can verify the thumbprint.

Now when you create a Batch pool, you can do navigate to **Certificates** within the pool and assign the certificate you created to that pool. When you do so, ensure you select **LocalMachine** for the store location. The certificate is loaded on all Batch nodes in the pool.

## Install Azure PowerShell

If you plan on accessing Key Vault using PowerShell scripts on your nodes, then you need the Azure PowerShell library installed. There are a few ways to do this, if your nodes have Windows Management Framework (WMF) 5 installed, then you can use the install-module command to download it. If you're using nodes that don’t have WMF 5, easiest way to install it is to bundle up the Azure PowerShell `.msi` file with your Batch files, and then call the installer as the first part of your Batch startup script. See this example for details:

```powershell
$psModuleCheck=Get-Module -ListAvailable -Name Azure -Refresh
if($psModuleCheck.count -eq 0) {
    $psInstallerPath = Join-Path $downloadPath "azure-powershell.3.4.0.msi" Start-Process msiexec.exe -ArgumentList /i, $psInstallerPath, /quiet -wait
}
```

## Access Key Vault

Now we're all setup to access Key Vault in scripts running on Batch nodes. To access Key Vault from a script, all you need is for your script to authenticate against Azure AD using the certificate. To do this in PowerShell, use the following example commands. Specify the appropriate GUID for **Thumbprint**, **App ID** (the ID of your service principal), and **Tenant ID** (the tenant where your service principal exists).

```powershell
Add-AzureRmAccount -ServicePrincipal -CertificateThumbprint -ApplicationId
```

Once authenticated, access KeyVault as you normally would.

```powershell
$adminPassword=Get-AzureKeyVaultSecret -VaultName BatchVault -Name batchAdminPass
```

These are the credentials to use in your script.
