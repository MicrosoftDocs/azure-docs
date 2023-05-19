---
title: Use certificates and securely access Azure Key Vault with Batch
description: Learn how to programmatically access your credentials from Key Vault using Azure Batch.
ms.topic: how-to
ms.date: 06/22/2022
ms.custom: devx-track-azurepowershell
---

# Use certificates to securely access Azure Key Vault with Batch

> [!WARNING]
> Batch account certificates as detailed in this article are [deprecated](batch-certificate-migration-guide.md). To securely access Azure Key Vault, simply use [Pool managed identities](managed-identity-pools.md) with the appropriate access permissions configured for the user-assigned managed identity to access your Key Vault. If you need to provision certificates on Batch nodes, please utilize the available Azure Key Vault VM extension in conjunction with pool Managed Identity to install and manage certificates on your Batch pool. For more information on deploying certificates from Azure Key Vault with Managed Identity on Batch pools, see [Enable automatic certificate rotation in a Batch pool](automatic-certificate-rotation.md).
> 
> `CloudServiceConfiguration` pools do not provide the ability to specify either Managed Identity or the Azure Key Vault VM extension, and these pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). You should migrate to `VirtualMachineConfiguration` pools which provide the aforementioned alternatives.

In this article, you'll learn how to set up Batch nodes with certificates to securely access credentials stored in [Azure Key Vault](../key-vault/general/overview.md).

To authenticate to Azure Key Vault from a Batch node, you need:

- An Azure Active Directory (Azure AD) credential
- A certificate
- A Batch account
- A Batch pool with at least one node

## Obtain a certificate

If you don't already have a certificate, [use the PowerShell cmdlet `New-SelfSignedCertificate`](/powershell/module/pki/new-selfsignedcertificate) to make a new self-signed certificate.

## Create a service principal

Access to Key Vault is granted to either a **user** or a **service principal**. To access Key Vault programmatically, use a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the certificate you created in the previous step. The service principal must be in the same Azure AD tenant as the Key Vault.

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

The URLs for the application aren't important, since we're only using them for Key Vault access.

## Grant rights to Key Vault

The service principal created in the previous step needs permission to retrieve the secrets from Key Vault. Permission can be granted either through the [Azure portal](../key-vault/general/assign-access-policy-portal.md) or with the PowerShell command below.

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName 'BatchVault' -ServicePrincipalName '"https://batch.mydomain.com' -PermissionsToSecrets 'Get'
```

## Assign a certificate to a Batch account

Create a Batch pool, then go to the certificate tab in the pool and assign the certificate you created. The certificate is now on all Batch nodes.

Next, assign the certificate to the Batch account. Assigning the certificate to the account lets Batch assign it to the pools and then to the nodes. The easiest way to do this is to go to your Batch account in the portal, navigate to **Certificates**, and select **Add**. Upload the `.pfx` file you generated earlier and supply the password. Once complete, the certificate is added to the list and you can verify the thumbprint.

Now when you create a Batch pool, you can navigate to **Certificates** within the pool and assign the certificate you created to that pool. When you do so, ensure you select **LocalMachine** for the store location. The certificate is loaded on all Batch nodes in the pool.

## Install Azure PowerShell

If you plan on accessing Key Vault using PowerShell scripts on your nodes, then you need the Azure PowerShell library installed. If your nodes have Windows Management Framework (WMF) 5 installed, you can use the install-module command to download it. If you're using nodes that don’t have WMF 5, the easiest way to install it is to bundle up the Azure PowerShell `.msi` file with your Batch files, and then call the installer as the first part of your Batch startup script. See this example for details:

```powershell
$psModuleCheck=Get-Module -ListAvailable -Name Azure -Refresh
if($psModuleCheck.count -eq 0) {
    $psInstallerPath = Join-Path $downloadPath "azure-powershell.3.4.0.msi" Start-Process msiexec.exe -ArgumentList /i, $psInstallerPath, /quiet -wait
}
```

## Access Key Vault

Now you're ready to access Key Vault in scripts running on your Batch nodes. To access Key Vault from a script, all you need is for your script to authenticate against Azure AD using the certificate. To do this in PowerShell, use the following example commands. Specify the appropriate GUID for **Thumbprint**, **App ID** (the ID of your service principal), and **Tenant ID** (the tenant where your service principal exists).

```powershell
Add-AzureRmAccount -ServicePrincipal -CertificateThumbprint -ApplicationId
```

Once authenticated, access KeyVault as you normally would.

```powershell
$adminPassword=Get-AzureKeyVaultSecret -VaultName BatchVault -Name batchAdminPass
```

These are the credentials to use in your script.

## Next steps

- Learn more about [Azure Key Vault](../key-vault/general/overview.md).
- Review the [Azure Security Baseline for Batch](security-baseline.md).
- Learn about Batch features such as [configuring access to compute nodes](pool-endpoint-configuration.md), [using Linux compute nodes](batch-linux-nodes.md), and [using private endpoints](private-connectivity.md).
