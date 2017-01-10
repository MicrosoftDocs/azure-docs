---
title: Azure Disk Encryption for Windows and Linux IaaS VMs| Microsoft Docs
description: The paper provides an overview of Microsoft Azure Disk Encryption for Windows and Linux IaaS VMs.
services: security
documentationcenter: na
author: YuriDio
manager: swadhwa
editor: TomSh

ms.assetid: d3fac8bb-4829-405e-8701-fa7229fb1725
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/03/2017
ms.author: kakhan

---
# Azure Disk Encryption for Windows and Linux IaaS VMs
Microsoft Azure is strongly committed to ensuring your data privacy and sovereignty. You can control your Azure hosted data through a range of advanced technologies to encrypt, control, and manage encryption keys and control and audit data access. With this control, you have the flexibility to choose the solution that best meets your business needs.

This paper introduces Azure Disk Encryption for Windows and Linux IaaS VMs, a new technology solution that helps protect and safeguard your data to meet your organizational security and compliance commitments. The paper provides detailed guidance on how to use the Azure Disk Encryption features, including the supported scenarios and user experiences.

> [!NOTE]
> Certain recommendations contained herein might increase data, network, or compute resource usage, resulting in additional license or subscription costs.

## Overview
Azure Disk Encryption is a new capability that helps you encrypt your Windows and Linux IaaS virtual machine disks. It applies the industry standard [BitLocker](https://technet.microsoft.com/library/cc732774.aspx) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide volume encryption for the OS and the data disks. The solution is integrated with [Azure Key Vault](https://azure.microsoft.com/documentation/services/key-vault/) to help you control and manage the disk-encryption keys and secrets in your key vault subscription, while ensuring that all data in the virtual machine disks are encrypted at rest in your Azure storage.

Azure Disk Encryption for Windows and Linux IaaS VMs is now in general availability in all Azure public regions for VMs with standard and premium storage accounts.

### Encryption Scenarios
The Azure Disk Encryption solution supports the following customer scenarios:

* Enabling encryption on new IaaS VMs that are created from pre-encrypted Virtual Hard Disk (VHD) and encryption keys
* Enabling encryption on new IaaS VMs that are created from the Azure Marketplace images
* Enabling encryption on existing IaaS VMs that are running in Azure
* Disabling encryption on Windows IaaS VMs
* Disabling encryption on data drives for Linux IaaS VMs

The solution supports the following scenarios for IaaS VMs when they are enabled in Microsoft Azure:

* Integration with Azure Key Vault
* Standard tier VMs - [A, D, DS, G, GS, and so forth series IaaS VMs](https://azure.microsoft.com/pricing/details/virtual-machines/)
* Enabling encryption on Windows and Linux IaaS VMs
* Disabling encryption on OS and data drives for Windows IaaS VMs
* Disabling encryption on data drives for Linux IaaS VMs
* Enabling encryption on IaaS VMs that are running Windows client OS
* Enabling encryption on volumes with mount paths
* Enabling encryption on Linux VMs configured with disk striping (RAID) by using mdadm.
* Enabling encryption on Linux VMs by using LVM for data disks.
* Enabling encryption on Windows VMs that are configured by using Storage Spaces
* All Azure public regions are supported

The solution does not support the following scenarios, features, and technology in the release:

* Basic tier IaaS VMs
* Disabling encryption on an OS drive for Linux IaaS VMs
* IaaS VMs that are created using classic VM creation method
* Integration with your on-premises Key Management Service
* Azure Files (Azure file share), Network File System (NFS), dynamic volumes, and Windows VMs that are configured with software-based RAID systems

### Encryption Features
When you enable and deploy Azure Disk Encryption for Azure IaaS VMs, the following capabilities are enabled, depending on the configuration provided:

* Encryption of OS volume to protect boot volume at rest in customer storage
* Encryption of Data volume/s to protect the data volumes at rest in customer storage
* Disabling encryption on OS and data drives for Windows IaaS VMs
* Disabling encryption on data drives for Linux IaaS VMs
* Safeguarding the encryption keys and secrets in your key vault subscription
* Reporting encryption status of the encrypted IaaS VM
* Removal of disk-encryption configuration settings from the IaaS virtual machine
* Backup and restore of encrypted VMs by using the Azure backup service

> [!NOTE]
> Backup and restore of encrypted VMs is supported only for VMs that are encrypted with the key encryption key [KEK] configuration. It is not supported for VMs encrypted without KEK. KEK is an optional parameter to enable VM encryption.

Azure Disk Encryption for IaaS VMS for Windows and Linux solution includes the disk-encryption extension for Windows, the disk-encryption extension for Linux, the disk-encryption PowerShell cmdlets, the disk-encryption Azure command-line interface (CLI) cmdlets, and the disk-encryption Azure Resource Manager templates. The Azure Disk Encryption solution is supported on IaaS VMs that are running Windows or Linux OS. For more details on the supported operating systems, see the "Prerequisites" section.

> [!NOTE]
> There is no additional charge for encrypting VM disks with Azure Disk Encryption.

### Value proposition
When you apply the Azure Disk Encryption-management solution, you can satisfy the following business needs:

* IaaS VMs are secured at rest, because you can use industry-standard encryption technology to address organizational security and compliance requirements.
* IaaS VMs boot under customer-controlled keys and policies, and you can audit their usage in your key vault.

### Encryption workflow
To enable disk encryption for Windows and Linux VMs, do the following:

1. Choose an encryption scenario from among the preceding encryption scenarios.
2. Opt in to enabling disk encryption via the Azure Disk Encryption Resource Manager template, PowerShell cmdlets, or CLI command, and specify the encryption configuration.

   * For the customer-encrypted VHD scenario, upload the encrypted VHD to your storage account and the encryption key material to your key vault, and then provide the encryption configuration to enable encryption on a new IaaS VM.
   * For new VMs that are created from the Marketplace and existing VMs already running in Azure, provide the encryption configuration to enable encryption on the IaaS VM.

3. Grant access to the Azure platform to read the encryption-key material (BitLocker encryption keys for Windows systems and Passphrase for Linux) from your key vault to enable encryption on the IaaS VM.
4. Provide Azure Active Directory (Azure AD) application identity to write the encryption key material to your key vault to enable encryption on the IaaS VM for the scenarios mentioned in step 2.
5. Azure updates the VM service model with encryption and key vault configuration, and sets up your encrypted VM.

![Microsoft Antimalware in Azure](./media/azure-security-disk-encryption/disk-encryption-fig1.png)

### Decryption workflow
To disable disk encryption for IaaS VMs, complete these high-level steps:

1. Choose to disable encryption (decryption) on a running IaaS VM in Azure via the Azure Disk Encryption Resource Manager template or PowerShell cmdlets, and specify the decryption configuration.

 This disable encryption step disables encryption of the OS or data volume or both on the running Windows IaaS VM. However disabling OS disk encryption for Linux is not supported as mentioned in the previous section. The disable step is allowed only for data drives on Linux VMs.
2. Azure updates the VM service model, and the IaaS VM is marked decrypted. The contents of the VM are not encrypted at rest anymore.

 The disable-encryption operation does not delete your key vault and the encryption key material (BitLocker encryption keys for Windows systems or Passphrase for Linux).

## Prerequisites
Before you enable Azure Disk Encryption on Azure IaaS VMs for the supported scenarios that were discussed in the "Overview" section, see the following prerequisites:

* You must have a valid active Azure subscription to create resources in Azure in the supported regions.
* Azure Disk Encryption is supported on the following Windows Server versions: Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, and Windows Server 2016.
* Azure Disk Encryption is supported on the following Windows client versions: Windows 8 client and Windows 10 client.

> [!NOTE]
> For Windows Server 2008 R2, you must have .NET Framework 4.5 installed before you enable encryption in Azure. You can install it from Windows Update by installing the optional update Microsoft .NET Framework 4.5.2 for Windows Server 2008 R2 x64-based systems ([KB2901983](https://support.microsoft.com/kb/2901983)).
>
> Azure Disk Encryption is supported on the following Linux server versions: Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES), and Red Hat Enterprise Linux.

> [!NOTE]
> Linux OS disk encryption is currently supported on the following Linux distributions: RHEL 7.2, CentOS 7.2n, Ubuntu 16.04.
>
> All resources (your key vault, storage account, and VM, for example) must belong to the same Azure region and subscription.

> [!NOTE]
> Azure Disk Encryption requires that your key vault and VMs reside in the same Azure region. Configuring them in separate region causes a failure in enabling the Azure Disk Encryption feature.

* To set up and configure your key vault for Azure Disk Encryption usage, see "Set up and configure your key vault for Azure Disk Encryption usage" in the "Prerequisites" section of this article.
* To set up and configure Azure AD application in Azure Active directory for Azure Disk Encryption usage, see "Set up the Azure AD application in Azure Active Directory" in the "Prerequisites" section of this article.
* To set up and configure the key vault access policy for the Azure AD application, see "Set up the key vault access policy for the Azure AD application" in the "Prerequisites" section of this article.
* To prepare a pre-encrypted Windows VHD, see "Preparing a pre-encrypted Windows VHD" in the Appendix of this article.
* To prepare a pre-encrypted Linux VHD, see "Preparing a pre-encrypted Linux VHD" in the Appendix of this article.
* Azure platform needs access to the encryption keys or secrets in your key vault to make them available to the virtual machine when it boots and decrypts the virtual machine OS volume. To grant permissions to Azure platform to access the  key vault, set the **enabledForDiskEncryption** property on the key vault for this requirement. See "Set up and configure your key vault for Azure Disk Encryption use" in the Appendix of this article for more details.
* Your key vault secret and key encryption key (KEK) URLs must be versioned. Azure enforces this restriction of versioning. For valid secret and KEK URLs, see the following examples:
  * Example of a valid secret URL:
      *https://contosovault.vault.azure.net/secrets/BitLockerEncryptionSecretWithKek/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
  * Example of a valid KEK URL:
      *https://contosovault.vault.azure.net/keys/diskencryptionkek/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
* Azure Disk Encryption does not support specifying port numbers as part of key vault secret and KEK URLs. For examples of nonsupported and suppported key vault URLs, see the following:
  * Unacceptable key vault URL
     *https://contosovault.vault.azure.net:443/secrets/contososecret/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
    * Acceptable key vault URL:
      *https://contosovault.vault.azure.net/secrets/contososecret/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
* To enable the Azure Disk Encryption feature, the IaaS VMs must meet the following network endpoint configuration requirements:
  * To get a token to connect to your key vault, the IaaS VM must be able to connect to an Azure Active Directory endpoint, \[Login.windows.net\].
  * To write the encryption keys to your key vault, the IaaS VM must be able to connect to the key vault endpoint.
  * The IaaS VM must be able to connect to an Azure storage endpoint that hosts the Azure extension repository and an Azure storage account that hosts the VHD files.

> [!NOTE]
> If your security policy limits access from Azure VMs to Internet, you can resolve the above URI to which you need connectivity and configure a specific rule to allow outbound connectivity to the IPs.
>
> Use the latest version of Azure PowerShell SDK version to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell release](https://github.com/Azure/azure-powershell/releases)

> [!NOTE]
> Azure Disk Encryption is not supported on [Azure PowerShell SDK version 1.1.0](https://github.com/Azure/azure-powershell/releases/tag/v1.1.0-January2016). If you are receiving an error related to using Azure PowerShell 1.1.0, please see the article [Azure Disk Encryption Error Related to Azure PowerShell 1.1.0](http://blogs.msdn.com/b/azuresecurity/archive/2016/02/10/azure-disk-encryption-error-related-to-azure-powershell-1-1-0.aspx).

* To run any of the Azure CLI commands and associate it with your Azure subscription, you must first install Azure CLI version:
  * To install Azure CLI and associate it with your Azure subscription, see [How to install and configure Azure CLI](../xplat-cli-install.md)
  * Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager, see [here](../virtual-machines/azure-cli-arm-commands.md)
* Azure Disk Encryption solution use BitLocker external key protector for Windows IaaS VMs. If your VMs are domain joined, do not push any group policies that enforce TPM protectors. Refer to [this article](https://technet.microsoft.com/library/ee706521) for details on the group policy for “Allow BitLocker without a compatible TPM”.
* The Azure Disk Encryption prerequisite PowerShell script to create Azure AD application, create a new key vault, or set up an existing key vault and enable encryption is located [here](https://github.com/Azure/azure-powershell/blob/dev/src/ResourceManager/Compute/Commands.Compute/Extension/AzureDiskEncryption/Scripts/AzureDiskEncryptionPreRequisiteSetup.ps1).
* To use Azure backup service to backup and restore encrypted VMs, when encryption is enabled using Azure Disk Encryption, you must encrypt your VMs using Azure Disk Encryption key encryption key configuration. The backup service supports VMs encrypted using key encryption key [KEK] configuration only. It does not support VMs encrypted without KEK. See disk-encryption deployment scenarios below to enable VM encryption using KEK option.

#### Set up the Azure AD application in Azure Active Directory
When encryption needs to be enabled on a running VM in Azure, Azure Disk Encryption generates and writes the encryption keys to your key vault. Managing encryption keys in key vault needs Azure AD authentication.

For this purpose, an Azure AD application should be created. Detailed steps for registering an application can be found here, in the “Get an Identity for the Application” section in this [blog post](http://blogs.technet.com/b/kv/archive/2015/06/02/azure-key-vault-step-by-step.aspx). This post also contains a number of helpful examples for setting up and configuring your key vault. For authentication purposes, you can use either client secret-based authentication or client certificate-based Azure AD authentication.

##### Client secret-based authentication for Azure AD
The sections that follow have the necessary steps to configure a client secret-based authentication for Azure AD.

##### Create an Azure AD application by using Azure PowerShell
Use the PowerShell cmdlet below to create a new Azure AD app:

    $aadClientSecret = “yourSecret”
    $azureAdApplication = New-AzureRmADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -Password $aadClientSecret
    $servicePrincipal = New-AzureRmADServicePrincipal –ApplicationId $azureAdApplication.ApplicationId

> [!NOTE]
> $azureAdApplication.ApplicationId is the Azure AD ClientID and $aadClientSecret  is the client secret that you should use later to enable ADE.You should safeguard the Azure AD client secret appropriately.

##### Provisioning the Azure AD client ID and secret from the Azure Classic deployment model Portal
Azure AD client ID and secret can also be set up by using the Azure Classic deployment model Portal at https://manage.windowsazure.com, follow the steps below to perform this task:

1. Click the Active Directory tab as shown in Figure below:

![Azure Disk Encryption](./media/azure-security-disk-encryption/disk-encryption-fig3.png)

2. Click Add Application and type the application name as shown below:

![Azure Disk Encryption](./media/azure-security-disk-encryption/disk-encryption-fig4.png)

3. Click the arrow button and configure the app's properties as shown below:

![Azure Disk Encryption](./media/azure-security-disk-encryption/disk-encryption-fig5.png)

4. Click the check mark in the lower left corner to finish. The app's configuration page appears. Notice the Azure AD client ID is located in the bottom of the page as shown in figure below.

![Azure Disk Encryption](./media/azure-security-disk-encryption/disk-encryption-fig6.png)

5. Save the Azure AD client secret by click in the Save button. Click the save button and note the secret from the keys text box, this is the Azure AD client secret. You should safeguard the Azure AD client secret appropriately.

![Azure Disk Encryption](./media/azure-security-disk-encryption/disk-encryption-fig7.png)

> [!NOTE]
> The flow above is not supported in the Portal.

##### Use an existing app
In order to execute the commands below you need the Azure AD PowerShell module, which can be obtained from [here](https://technet.microsoft.com/library/jj151815.aspx).

> [!NOTE]
> The commands below must be executed from a new PowerShell window. Do NOT use Azure PowerShell or the Azure Resource Manager window to execute these commands. The reason for this recommendation is because these cmdlets are in the MSOnline module or Azure AD PowerShell.

    $clientSecret = ‘<yourAadClientSecret>’
    $aadClientID = '<Client ID of your AAD app>'
    connect-msolservice
    New-MsolServicePrincipalCredential -AppPrincipalId $aadClientID -Type password -Value $clientSecret

#### Certificate-based authentication for Azure AD
> [!NOTE]
> AAD certificate-based authentication is currently not supported on Linux VMs.
>
>

The sections that follow have the necessary steps to configure a certificate-based authentication for Azure AD.

##### Create a new Azure AD app
Execute the PowerShell cmdlets below to create a new Azure AD app:

> [!NOTE]
> Replace `yourpassword` string below with your secure password and safeguard the password.

    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate("C:\certificates\examplecert.pfx", "yourpassword")
    $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())
    $azureAdApplication = New-AzureRmADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -KeyValue $keyValue -KeyType AsymmetricX509Cert
    $servicePrincipal = New-AzureRmADServicePrincipal –ApplicationId $azureAdApplication.ApplicationId

After you finish this step, upload a .pfx file to your key vault and enable the access policy needed to deploy that certificate to a VM.

##### Use an existing Azure AD app
If you are configuring certificate-based authentication for an existing app, use the PowerShell cmdlets shown here. Be sure to execute them from a new PowerShell window.

    $certLocalPath = 'C:\certs\myaadapp.cer'
    $aadClientID = '<Client ID of your AAD app>'
    connect-msolservice
    $cer = New-Object System.Security.Cryptography.X509Certificates.X509Certificate
    $cer.Import($certLocalPath)
    $binCert = $cer.GetRawCertData()
    $credValue = [System.Convert]::ToBase64String($binCert);
    New-MsolServicePrincipalCredential -AppPrincipalId $aadClientID -Type asymmetric -Value $credValue -Usage verify

After you finish this step, upload a PFX file to your key vault and enable the access policy that's needed to deploy the certificate to a VM.

##### Upload a PFX file to your key vault
You can read this [blog post](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx) for detail explanation on how this process works. However, the PowerShell cmdlets below are all you need for this task. Make sure to execute them from Azure PowerShell console:

> [!NOTE]
> Replace `yourpassword` string below with your secure password and safeguard the password.

    $certLocalPath = 'C:\certs\myaadapp.pfx'
    $certPassword = "yourpassword"
    $resourceGroupName = ‘yourResourceGroup’
    $keyVaultName = ‘yourKeyVaultName’
    $keyVaultSecretName = ‘yourAadCertSecretName’

    $fileContentBytes = get-content $certLocalPath -Encoding Byte
    $fileContentEncoded = [System.Convert]::ToBase64String($fileContentBytes)

    $jsonObject = @"
    {
    "data": "$filecontentencoded",
    "dataType" :"pfx",
    "password": "$certPassword"
    }
    "@

    $jsonObjectBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonObject)
    $jsonEncoded = [System.Convert]::ToBase64String($jsonObjectBytes)

    Switch-AzureMode -Name AzureResourceManager
    $secret = ConvertTo-SecureString -String $jsonEncoded -AsPlainText -Force
    Set-AzureKeyVaultSecret -VaultName $keyVaultName -Name $keyVaultSecretName -SecretValue $secret
    Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ResourceGroupName $resourceGroupName –EnabledForDeployment

##### Deploy a certificate in your key vault to an existing VM
After you finish uploading the PFX, deploy a certificate in the key vault to an existing VM by doing the following:

    $resourceGroupName = ‘yourResourceGroup’
    $keyVaultName = ‘yourKeyVaultName’
    $keyVaultSecretName = ‘yourAadCertSecretName’
    $vmName = ‘yourVMName’
    $certUrl = (Get-AzureKeyVaultSecret -VaultName $keyVaultName -Name $keyVaultSecretName).Id
    $sourceVaultId = (Get-AzureRmKeyVault -VaultName $keyVaultName -ResourceGroupName $resourceGroupName).ResourceId
    $vm = Get-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName
    $vm = Add-AzureRmVMSecret -VM $vm -SourceVaultId $sourceVaultId -CertificateStore "My" -CertificateUrl $certUrl
    Update-AzureRmVM -VM $vm  -ResourceGroupName $resourceGroupName


#### Set up the key vault access policy for the Azure AD application
Your Azure AD application needs rights to access the keys or secrets in the vault. Use the [Set-AzureKeyVaultAccessPolicy](https://msdn.microsoft.com/library/azure/dn903607.aspx) cmdlet to grant permissions to the application, using the client ID (which was generated when the application was registered) as the –ServicePrincipalName parameter value. You can read [this blog post](http://blogs.technet.com/b/kv/archive/2015/06/02/azure-key-vault-step-by-step.aspx) for some examples on that. Below you also have an example of how to perform this task via PowerShell:

    $keyVaultName = '<yourKeyVaultName>'
    $aadClientID = '<yourAadAppClientID>'
    $rgname = '<yourResourceGroup>'
    Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ServicePrincipalName $aadClientID -PermissionsToKeys 'WrapKey' -PermissionsToSecrets 'Set' -ResourceGroupName $rgname

> [!NOTE]
> Azure Disk Encryption requires you to configure the following access policies to your AAD Client Application: _WrapKey_ and _Set_ permissions.

## Terminology
Use the terminology table as reference to understand some of the common terms used by this technology:

| Terminology | Definition |
| --- | --- |
| Azure AD |Azure AD is [Azure Active Directory](https://azure.microsoft.com/documentation/services/active-directory/). An Azure AD account is a prerequisite for authenticating, storing, and retrieving secrets from a key vault. |
| Azure Key Vault |Key Vault is a cryptographic, key management service that's based on Federal Information Processing Standards (FIPS)-validated hardware security modules that help safeguard your cryptographic keys and sensitive secrets. For more information, see [Key Vault](https://azure.microsoft.com/services/key-vault/) documentation. |
| ARM |Azure Resource Manager |
| BitLocker |[BitLocker](https://technet.microsoft.com/library/hh831713.aspx) is an industry-recognized Windows volume encryption technology that's used to enable disk encryption on Windows IaaS VMs. |
| BEK |BitLocker encryption keys are used to encrypt the OS boot volume and data volumes. The BitLocker keys are safeguarded in a key vault as secrets. |
| CLI |[Azure Command-Line Interface](../xplat-cli-install.md) |
| DM-Crypt |[DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) is the Linux-based, transparent disk-encryption subsystem used to enable disk encryption on Linux IaaS VMs |
| KEK |Key encryption key is the asymmetric key (RSA 2048) used to protect or wrap the secret if desired. You can provide an HSM-protected key or software-protected key. For more details, see [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) documentation for more details |
| PS cmdlets |[Azure PowerShell cmdlets](/powershell/azureps-cmdlets-docs) |

### Set up and configure your key vault for Azure Disk Encryption
Azure Disk Encryption safeguards the disk-encryption keys and secrets in your key vault. To set up your key vault for Azure Disk Encryption, complete the steps in each of the following sections.

#### Create a key vault
To create a key vault, use one of the following options:

* ["101-Create-KeyVault" Resource Manager template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-create-key-vault/azuredeploy.json)
* [Azure PowerShell key vault cmdlets](https://msdn.microsoft.com/library/dn868052.aspx).
* The Azure resource manager portal

> [!NOTE]
> If you have already set up a key vault for your subscription, skip to the next section.

![Azure Key Vault](./media/azure-security-disk-encryption/keyvault-portal-fig1.png)

#### Set up a key encryption key (optional)
If you want to use a key encryption key (KEK) for an additional layer of security to wrap around the BitLocker encryption keys, add a KEK to your key vault for use in the setup process. Use the [Add-AzureKeyVaultKey](https://msdn.microsoft.com/library/dn868048.aspx) cmdlet to create a new key encryption key in the key vault. You can also import a KEK from your on-premises key management HSM. For more details, see [Key Vault Documentation](https://azure.microsoft.com/documentation/services/key-vault/).

    Add-AzureKeyVaultKey [-VaultName] <string> [-Name] <string> -Destination <string> {HSM | Software}

You can add the KEK by going to the Azure Resource Manager portal or by using your key vault interface.

![Azure Key Vault](./media/azure-security-disk-encryption/keyvault-portal-fig2.png)

#### Set key vault permissions
The Azure platform needs access to the encryption keys or secrets in your key vault to make them available to the VM to boot and decrypt the volumes. To grant permissions to the Azure platform so that it can access your key vault, set the _enabledForDiskEncryption_ property on the key vault. You can do so by using the key vault PowerShell cmdlet:

    Set-AzureRmKeyVaultAccessPolicy -VaultName <yourVaultName> -ResourceGroupName <yourResourceGroup> -EnabledForDiskEncryption

You can also set the _enabledForDiskEncryption_ property by visiting https://resources.azure.com.

You must set the *enabledForDiskEncryption* property on your key vault as mentioned before. Otherwise, the deployment will fail.

You can set up access policies for your Azure AD application from the key vault interface:

![Azure Key Vault](./media/azure-security-disk-encryption/keyvault-portal-fig3.png)

![Azure Key Vault](./media/azure-security-disk-encryption/keyvault-portal-fig3b.png)

Make sure that your Key Vault is enabled for Disk Encryption in "Advanced Access Policies":

![Azure key vault](./media/azure-security-disk-encryption/keyvault-portal-fig4.png)

## Disk-encryption deployment scenarios and user experiences
There are many disk-encryption scenarios that you can enable, and the steps may vary according to the scenario. The following sections cover the scenarios in greater detail.

### Enable encryption on new IaaS VMs created from the Marketplace
Disk encryption can be enabled on new IaaS Windows VM from the Marketplace in Azure using the Resource Manager template published [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-create-new-vm-gallery-image). Click on “Deploy to Azure” button on the Azure quickstart template, input encryption configuration in the parameters blade and click OK. Select the subscription, resource group, resource group location, legal terms and agreement and click Create button to enable encryption on a new IaaS VM.

> [!NOTE]
> This template creates a new encrypted Windows VM using the Windows Server 2012 gallery image.

Disk encryption can be enabled on a new IaaS RedHat Linux 7.2 VM with a 200 GB RAID-0 array using [this](https://aka.ms/fde-rhel) resource manager template. After the template is deployed, verify the VM encryption status using the `Get-AzureRmVmDiskEncryptionStatus` cmdlet as described in [Encrypting OS drive on a running Linux VM](#encrypting-os-drive-on-a-running-linux-vm). When the machine returns a status of `VMRestartPending`, restart the VM.

You can see the Resource Manager template parameters details for new VM from the Marketplace scenario using Azure AD client ID in the following table:

| Parameter | Description |
| --- | --- |
| adminUserName |Admin user name for the virtual machine |
| adminPassword |Admin user password for the virtual machine |
| newStorageAccountName |Name of the storage account to store OS and data VHDs |
| vmSize |Size of the VM. Currently, only Standard A, D and G series are supported |
| virtualNetworkName |Name of the VNet to which the VM NIC should belong to. |
| subnetName |Name of the subnet in the vNet to which the VM NIC should belong to |
| AADClientID |Client ID of the Azure AD application that has permissions to write secrets to Key Vault |
| AADClientSecret |Client secret of the Azure AD application that has permissions to write secrets to Key Vault |
| keyVaultURL |URL of the Key Vault to which BitLocker key should be uploaded to. You can get it using the cmdlet: (Get-AzureRmKeyVault -VaultName,-ResourceGroupName ).VaultURI |
| keyEncryptionKeyURL |URL of the key encryption key that's used to encrypt the generated BitLocker key (optional) |
| keyVaultResourceGroup |Resource Group of the key vault |
| vmName |Name of the VM on which encryption operation is to be performed |

> [!NOTE]
> KeyEncryptionKeyURL is an optional parameter. You can bring your own KEK to further safeguard the data encryption key (Passphrase secret) in key vault.

### Enable encryption on new IaaS VMs created from Customer Encrypted VHD and encryption keys
In this scenario you can enable encrypting by using the Resource Manager template, PowerShell cmdlets or CLI commands. The sections below will explain in more details the Resource Manager template and CLI commands.

Follow the instructions from one of these sections for preparing pre-encrypted images that can be used in Azure. Once the image is created, the steps in the next section can be used for creating an encrypted Azure VM.

* [Preparing a pre-encrypted Windows VHD](#preparing-a-pre-encrypted-windows-vhd)
* [Preparing a pre-encrypted Linux VHD](#preparing-a-pre-encrypted-linux-vhd)

#### Using Resource Manager template
Disk encryption can be enabled on customer encrypted VHD using the Resource Manager template published [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-create-pre-encrypted-vm). Click on “Deploy to Azure” button on the Azure quickstart template, input encryption configuration in the parameters blade and click OK. Select the subscription, resource group, resource group location, legal terms and agreement and click Create button to enable encryption on new IaaS VM.

The Resource Manager template parameters details for customer encrypted VHD scenario are described in the table below:

| Parameter | Description |
| --- | --- |
| newStorageAccountName |The name of the storage account to store encrypted OS vhd. This storage account should have already been created in the same resource group and same location as the VM. |
| osVhdUri |The URI of OS vhd from the storage account. |
| osType |The OS product type (Windows/Linux). |
| virtualNetworkName |The name of the VNet that the VM NIC should belong to. The name should already have been created in the same resource group and same location as the VM. |
| subnetName |The name of the subnet in the vNet to which the VM NIC should belong to |
| vmSize |Size of the VM. Currently, only Standard A, D, and G series are supported |
| keyVaultResourceID |The ResourceID that identifies the key vault resource in Azure Resource Manager. You can get it by using the PowerShell cmdlet `(Get-AzureRmKeyVault -VaultName &lt;yourKeyVaultName&gt; -ResourceGroupName &lt;yourResourceGroupName&gt;).ResourceId`. |
| keyVaultSecretUrl | The URL of the disk-encryption key that's set up in key vault. |
| keyVaultKekUrl |URL of the key encryption key that’s to encrypt the generated disk-encryption key |
| vmName | Name of the IaaS VM |

#### Using PowerShell cmdlets
Disk encryption can be enabled on customer encrypted VHD using the PowerShell cmdlets published [here](https://msdn.microsoft.com/library/azure/mt603746.aspx).  

#### Using CLI Commands
Follow the steps below to enable disk encryption for this scenario using CLI commands:

1. Set access policies on your key vault:
   * Set ‘EnabledForDiskEncryption’ flag:
   `azure keyvault set-policy --vault-name <keyVaultName> --enabled-for-disk-encryption true`
   * Set permissions to Azure AD application to write secrets to KeyVault:
   `azure keyvault set-policy --vault-name <keyVaultName> --spn <aadClientID> --perms-to-keys '["wrapKey"]' --perms-to-secrets '["set"]'`
2. To enable encryption on an existing/running VM, type:
`azure vm enable-disk-encryption --resource-group <resourceGroupName> --name <vmName> --aad-client-id <aadClientId> --aad-client-secret <aadClientSecret> --disk-encryption-key-vault-url <keyVaultURL> --disk-encryption-key-vault-id <keyVaultResourceId> --volume-type [All|OS|Data]`
3. Get encryption status:
`azure vm show-disk-encryption-status --resource-group <resourceGroupName> --name <vmName> --json`
4. To enable encryption on a new VM from customer encrypted VHD, use the below parameters with “azure vm create” command:
   * disk-encryption-key-vault-id <disk-encryption-key-vault-id>
   * disk-encryption-key-url <disk-encryption-key-url>
   * key-encryption-key-vault-id <key-encryption-key-vault-id>
   * key-encryption-key-url <key-encryption-key-url>

### Enable encryption on existing or running IaaS Windows VM in Azure
In this scenario you can enable encrypting by using the Resource Manager template, PowerShell cmdlets or CLI commands. The sections below will explain in more details how to enable it using Resource Manager template and CLI commands.

#### Using Resource Manager template
Disk encryption can be enabled on existing/running IaaS Windows VM in Azure using the Resource Manager template published [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-windows-vm). Click on “Deploy to Azure” button on the Azure quickstart template, input encryption configuration in the parameters blade and click OK. Select the subscription, resource group, resource group location, legal terms and agreement and click Create button to enable encryption on existing/running IaaS VM.

The Resource Manager template parameters details for existing/running VM scenario using Azure AD client ID are available in the table below:

| Parameter | Description |
| --- | --- |
| AADClientID | Client ID of the Azure AD application that has permissions to write secrets to the key vault |
| AADClientSecret | Client secret of the Azure AD application that has permissions to write secrets to the key vault |
| keyVaultName |Name of the key vault that the BitLocker key should be uploaded to. You can get it by using the cmdlet (Get-AzureRmKeyVault -ResourceGroupName <yourResourceGroupName>). Vaultname |
|  keyEncryptionKeyURL |URL of the key encryption key that's used to encrypt the generated BitLocker key. This is optional if you select **nokek** in the UseExistingKek dropdown. If  you select **kek** in the UseExistingKek dropdown, you must input the keyEncryptionKeyURL value |
| volumeType | The type of volume on which the encryption operation is performed. Valid values are _OS_, _Data_, and _All_, |
| sequenceVersion |Sequence version of the BitLocker operation. Increment this version number every time a disk-encryption operation is performed on the same VM |
| vmName | Name of the VM on which the encryption operation is to be performed |

> [!NOTE]
> KeyEncryptionKeyURL is an optional parameter. You can bring your own KEK to further safeguard the data encryption key (BitLocker encryption secret) in the key vault.

#### Using PowerShell cmdlets
For information about enabling encryption with Azure Disk Encryption by using PowerShell cmdlets, see the blog posts [Explore Azure Disk Encryption with Azure PowerShell - Part 1](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/17/explore-azure-disk-encryption-with-azure-powershell.aspx) and [Explore Azure Disk Encryption with Azure PowerShell - Part 2](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/21/explore-azure-disk-encryption-with-azure-powershell-part-2.aspx).

#### Using CLI Commands
Follow the steps below to enable encryption on existing/running IaaS Windows VM in Azure using CLI commands:

1. Set access policies in the key vault:
   * Set ‘EnabledForDiskEncryption’ flag: `azure keyvault set-policy --vault-name <keyVaultName> --enabled-for-disk-encryption true`
   * Set permissions to Azure AD application to write secrets to KeyVault: `azure keyvault set-policy --vault-name <keyVaultName> --spn <aadClientID> --perms-to-keys '["wrapKey"]' --perms-to-secrets '["set"]'`
2. To enable encryption on an existing/running VM: `azure vm enable-disk-encryption --resource-group <resourceGroupName> --name <vmName> --aad-client-id <aadClientId> --aad-client-secret <aadClientSecret> --disk-encryption-key-vault-url <keyVaultURL> --disk-encryption-key-vault-id <keyVaultResourceId> --volume-type [All|OS|Data]`
3. Get encryption status: `azure vm show-disk-encryption-status --resource-group <resourceGroupName> --name <vmName> --json`
4. To enable encryption on a new VM from customer encrypted VHD, use the below parameters with “azure vm create” command:
   * disk-encryption-key-vault-id <disk-encryption-key-vault-id>
   * disk-encryption-key-url <disk-encryption-key-url>
   * key-encryption-key-vault-id <key-encryption-key-vault-id>
   * key-encryption-key-url <key-encryption-key-url>

### Enable encryption on existing or running IaaS Linux VM in Azure
Disk encryption can be enabled on existing/running IaaS Linux VM in Azure using the Resource Manager template published  [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm). Click on “Deploy to Azure” button on the Azure quickstart template, input encryption configuration in the parameters blade and click OK. Select the subscription, resource group, resource group location, legal terms and agreement and click Create button to enable encryption on existing/running IaaS VM.

The Resource Manager template parameters details for existing/running VM scenario using Azure AD client ID are described in the table below:

| Parameter | Description |
| --- | --- |
| AADClientID | Client ID of the Azure AD application that has permissions to write secrets to the Key Vault |
| AADClientSecret | Client secret of the Azure AD application that has permissions to write secrets to key vault |
| keyVaultName |Name of the key vault that BitLocker key should be uploaded to. You can get it by using the cmdlet (Get-AzureRmKeyVault -ResourceGroupName <yourResourceGroupName>). Vaultname |
|  keyEncryptionKeyURL |URL of the key encryption key that's used to encrypt the generated BitLocker key. This is optional if you select “nokek” in the UseExistingKek dropdown. If  you select “kek” in the UseExistingKek dropdown, you must input the keyEncryptionKeyURL value |
| volumeType | Type of the volume on which encryption operation is performed. Valid supported values are "OS"/"All" (for RHEL 7.2, CentOS 7.2 & Ubuntu 16.04) and "Data" for all other distros. |
| sequenceVersion |Sequence version of the BitLocker operation. Increment this version number every time a disk-encryption operation is performed on the same VM |
| vmName | Name of the VM on which encryption operation is to be performed |
| passPhrase |Type a strong passphrase as the data encryption key |

> [!NOTE]
> KeyEncryptionKeyURL is an optional parameter. You can bring your own KEK to further safeguard the data encryption key (Passphrase secret) in Key Vault.

#### CLI Commands
Disk encryption can be enabled on customer encrypted VHD using the CLI command installed from [here](../xplat-cli-install.md). Follow the steps below to enable encryption on existing/running IaaS Linux VM in Azure using CLI commands:

1. Set access policies on Key Vault:
   * Set ‘EnabledForDiskEncryption’ flag:
   `azure keyvault set-policy --vault-name <keyVaultName> --enabled-for-disk-encryption true`
   * Set permissions to Azure AD application to write secrets to KeyVault:
   `azure keyvault set-policy --vault-name <keyVaultName> --spn <aadClientID> --perms-to-keys '["wrapKey"]' --perms-to-secrets '["set"]'`
2. To enable encryption on an existing/running VM:
`azure vm enable-disk-encryption --resource-group <resourceGroupName> --name <vmName> --aad-client-id <aadClientId> --aad-client-secret <aadClientSecret> --disk-encryption-key-vault-url <keyVaultURL> --disk-encryption-key-vault-id <keyVaultResourceId> --volume-type [All|OS|Data]`
3. Get encryption status:
`azure vm show-disk-encryption-status --resource-group <resourceGroupName> --name <vmName> --json`
4. To enable encryption on a new VM from customer encrypted VHD, use the below parameters with “azure vm create” command.
   * *disk-encryption-key-vault-id <disk-encryption-key-vault-id>*
   * *disk-encryption-key-url <disk-encryption-key-url>*
   * *key-encryption-key-vault-id <key-encryption-key-vault-id>*
   * *key-encryption-key-url <key-encryption-key-url>*

### Get encryption status of an encrypted IaaS VM
You can get encryption status using Azure Resource Manager portal, [PowerShell cmdlets](https://msdn.microsoft.com/library/azure/mt622700.aspx) or CLI commands. The sections below will explain how to use the Azure portal and CLI commands to get the encryption status.

#### Get encryption status of an encrypted Windows VM using Azure Resource Manager portal
You can get the encryption status of the IaaS VM from Azure Resource Manager portal. Logon to Azure portal at https://portal.azure.com/, click on virtual machines link in the left menu to see summary view of the virtual machines in your subscription. You can filter the virtual machines view by selecting the subscription name from the subscription dropdown. Click on columns located at the top of the virtual machines page menu. Select Disk Encryption column from the choose column blade and click update. You should see the disk-encryption column showing the encryption state “Enabled” or “Not Enabled” for each VM as shown in the figure below.

![Microsoft Antimalware in Azure](./media/azure-security-disk-encryption/disk-encryption-fig2.png)

#### Get encryption status of an encrypted (Windows/Linux) IaaS VM using the disk-encryption PowerShell cmdlet
You can get the encryption status of the IaaS VM from the disk-encryption PowerShell cmdlet “Get-AzureRmVMDiskEncryptionStatus”. To get the encryption settings for your VM, type in your Azure PowerShell session:

    C:\> Get-AzureRmVmDiskEncryptionStatus  -ResourceGroupName $ResourceGroupName -VMName $VMName
    -ExtensionName $ExtensionName

    OsVolumeEncrypted          : NotEncrypted
    DataVolumesEncrypted       : Encrypted
    OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
    ProgressMessage            : https://rheltest1keyvault.vault.azure.net/secrets/bdb6bfb1-5431-4c28-af46-b18d0025ef2a/abebacb83d864a5fa729508315020f8a

The output of Get-AzureRmVMDiskEncryptionStatus can be inspected for encryption key URLs.

    C:\> $status = Get-AzureRmVmDiskEncryptionStatus  -ResourceGroupName $ResourceGroupName -VMNam
    e $VMName -ExtensionName $ExtensionName
    C:\> $status.OsVolumeEncryptionSettings

    DiskEncryptionKey                                                 KeyEncryptionKey                                               Enabled
    -----------------                                                 ----------------                                               -------
    Microsoft.Azure.Management.Compute.Models.KeyVaultSecretReference Microsoft.Azure.Management.Compute.Models.KeyVaultKeyReference    True


    C:\> $status.OsVolumeEncryptionSettings.DiskEncryptionKey.SecretUrl
    https://rheltest1keyvault.vault.azure.net/secrets/bdb6bfb1-5431-4c28-af46-b18d0025ef2a/abebacb83d864a5fa729508315020f8a
    C:\> $status.OsVolumeEncryptionSettings.DiskEncryptionKey

    SecretUrl                                                                                                               SourceVault
    ---------                                                                                                               -----------
    https://rheltest1keyvault.vault.azure.net/secrets/bdb6bfb1-5431-4c28-af46-b18d0025ef2a/abebacb83d864a5fa729508315020f8a Microsoft.Azure.Management....

The OSVolumeEncrypted and DataVolumesEncrypted settings value are set to "Encrypted" showing that both the volumes are encrypted using Azure Disk Encryption. Refer to the "Explore Azure Disk Encryption with Azure PowerShell" blog post [part 1](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/17/explore-azure-disk-encryption-with-azure-powershell.aspx) and [part 2](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/21/explore-azure-disk-encryption-with-azure-powershell-part-2.aspx) for details on how to enable encryption using Azure Disk Encryption using PowerShell cmdlets.

> [!NOTE]
> On Linux VMs, the `Get-AzureRmVMDiskEncryptionStatus` cmdlet takes 3-4 minutes to report the encryption status.

#### Get encryption status of the IaaS VM from disk-encryption CLI command
You can get the encryption status of the IaaS VM from disk-encryption CLI command *azure vm show-disk-encryption-status*. To get the encryption settings for your VM, type in your Azure CLI session:

    azure vm show-disk-encryption-status --resource-group <yourResourceGroupName> --name <yourVMName> --json  

#### Disable Encryption on running Windows IaaS VM
You can disable encryption on a running Windows or Linux IaaS VM via the Azure Disk Encryption Resource Manager template or PowerShell cmdlets and specifies the decryption configuration.

##### Windows VM
The disable encryption step disables encryption of the OS or data volume or both on the running Windows IaaS VM. You cannot disable the OS volume and leave the data volume encrypted. When the disable encryption step is performed, Azure classic deployment model updates the VM service model and the Windows IaaS VM is marked decrypted. The contents of the VM are not encrypted at rest anymore. The disable encryption does not delete the customer Key Vault and the encryption key material (BitLocker encryption keys for Windows and Passphrase for Linux).

##### Linux VM
The disable encryption step disables encryption of the data volume on the running Linux IaaS VM

> [!NOTE]
> Disabling encryption on OS disk is not allowed on Linux VMs.

##### Disable encryption on existing/running IaaS VM in Azure using Resource Manager template
Disk encryption can be disabled on running Windows IaaS VM using the Resource Manager template published [here](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-running-windows-vm). Click on “Deploy to Azure” button on the Azure quickstart template, input decryption configuration in the parameters blade and click OK. Select the subscription, resource group, resource group location, legal terms and agreement and click Create button to enable encryption on a new IaaS VM.

For Linux VM, [this](https://aka.ms/decrypt-linuxvm) template can be used to disable encryption.

Resource Manager template parameters details for disabling encryption on running IaaS VM:

| vmName | Name of the VM on which encryption operation is to be performed |
| --- | --- |
| volumeType | Type of the volume on which decryption operation is performed. Valid values are "OS", "Data", and "All". Note that you cannot disable encryption on running Windows IaaS VM OS/boot volume without disabling encryption on “Data” volume. Also note that disabling encryption on OS disk is not allowed on Linux VMs. |
| sequenceVersion |Sequence version of the BitLocker operation. Increment this version number every time a disk decryption operation is performed on the same VM |

##### Disable encryption on existing/running IaaS VM in Azure using PowerShell cmdlet
To disable using the PowerShell cmdlet, [Disable-AzureRmVMDiskEncryption](https://msdn.microsoft.com/library/azure/mt715776.aspx) cmdlet disables encryption on an infrastructure as a service (IaaS) virtual machine. This cmdlet supports both Windows and Linux VMs. This cmdlet installs an extension on the virtual machine to disable encryption. If the Name parameter is not specified, an extension with the default name "AzureDiskEncryption for Windows VMs" is created.

On Linux VMs, the "AzureDiskEncryptionForLinux" extension is used.

> [!NOTE]
> This cmdlet reboots the virtual machine.

## Appendix
### Connect to your subscription
Review the *Prerequisites* section in this article before proceeding. After you ensure that all prerequisites have been met, connect to your subscription by doing the following:

1. Start an Azure PowerShell session and sign in to your Azure account with the following command:

    `Login-AzureRmAccount`

2. If you have multiple subscriptions and want to specify a specific one to use, type the following to see the subscriptions for your account:

    `Get-AzureRmSubscription`

3. To specify the subscription you want to use, type:

    `Select-AzureRmSubscription -SubscriptionName <Yoursubscriptionname>`

4. To verify the subscription configured is correct, type:

    `Get-AzureRmSubscription`

5. To confirm the Azure Disk Encryption cmdlets are installed, type:

    `Get-command *diskencryption*`

6. You should see the below output confirming Azure Disk Encryption PowerShell installation:

    PS C:\Windows\System32\WindowsPowerShell\v1.0> get-command *diskencryption*
    CommandType  Name                                         Source                                                             
    Cmdlet       Get-AzureRmVMDiskEncryptionStatus            AzureRM.Compute                                                    
    Cmdlet       Disable-AzureRmVMDiskEncryption              AzureRM.Compute                                                    
    Cmdlet       Set-AzureRmVMDiskEncryptionExtension         AzureRM.Compute                                                     

### Preparing a pre-encrypted Windows VHD
The sections that follow are necessary in order to prepare a pre-encrypted Windows VHD for deployment as an encrypted VHD in Azure IaaS. The steps are used to prepare and boot a fresh windows VM (vhd) on Hyper-V or Azure.

#### Update group policy to allow non-TPM for OS protection
You need to configure the BitLocker Group Policy setting called BitLocker Drive Encryption, located under Local Computer Policy \Computer Configuration\Administrative Templates\Windows Components. Change this setting to: *Operating System Drives - Require additional authentication at startup - Allow BitLocker without a compatible TPM* as shown in the figure below:

![Microsoft Antimalware in Azure](./media/azure-security-disk-encryption/disk-encryption-fig8.png)

#### Install BitLocker feature components
For Windows Server 2012 and above use the below command:

    dism /online /Enable-Feature /all /FeatureName:Bitlocker /quiet /norestart

For Windows Server 2008 R2 use the below command:

    ServerManagerCmd -install BitLockers

#### Prepare OS volume for BitLocker using `bdehdcfg`
Execute the command below to compress the OS partition and prepare the machine for BitLocker.

    bdehdcfg -target c: shrink -quiet

#### Using BitLocker to protect the OS volume
Use the [`manage-bde`](https://technet.microsoft.com/library/ff829849.aspx) command to enable encryption on the boot volume using an external key protector and place the external key (.bek file) on the external drive or volume. Encryption will be enabled on the system/boot volume after the next reboot.

    manage-bde -on %systemdrive% -sk [ExternalDriveOrVolume]
    reboot

> [!NOTE]
> The VM needs to be prepared with a separate data/resource vhd for getting the external key using BitLocker.

#### Encrypting OS drive on a running Linux VM
Encryption of OS drive on a running Linux VM is supported on the following distros:

* RHEL 7.2
* CentOS 7.2
* Ubuntu 16.04

Prerequisites for OS disk encryption:

* VM must be created from the Marketplace image in Azure Resource Manager portal.
* Azure VM with at least 4 GB of RAM (recommended size is 7 GB).
* (For RHEL and CentOS) SELinux must be [disabled](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/SELinux_Users_and_Administrators_Guide/sect-Security-Enhanced_Linux-Working_with_SELinux-Changing_SELinux_Modes.html#sect-Security-Enhanced_Linux-Enabling_and_Disabling_SELinux-Disabling_SELinux) on the VM. The VM must be rebooted at least once after disabling SELinux.

##### Steps
1.Create a VM using one of the distros specified above.

For CentOS 7.2, OS disk encryption is supported via a special image. To use this image, specify "7.2n" as the Sku when creating the VM:

    Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName "OpenLogic" -Offer "CentOS" -Skus "7.2n" -Version "latest"

2.Configure the VM according to your needs. If you are going to encrypt all the (OS + data) drives the data drives need to be specified and mountable from /etc/fstab.

> [!NOTE]
> You must use UUID=... to specify data drives in /etc/fstab instead of specifying the block device name, e.g., /dev/sdb1. During encryption the order of drives will change on the VM. If your VM relies on a specific order of block devices it will fail to mount them after encryption.
>
>

3.Logout SSH sessions.

4.To encrypt the OS, specify volumeType as "All" or "OS" when [enabling encryption](#enable-encryption-on-existing-or-running-iaas-linux-vm-in-azure).

> [!NOTE]
> All user-space processes that are not running as `systemd` services shall be killed with a `SIGKILL`. The VM shall be rebooted. Please plan on downtime of the VM when enabling OS disk encryption on a running VM.
>
>

5.Periodically monitor the progress of encryption using instructions in the [next section](#monitoring-os-encryption-progress).

6.Once Get-AzureRmVmDiskEncryptionStatus shows "VMRestartPending", restart your VM by either logging on to it or via Portal/PowerShell/CLI.

    C:\> Get-AzureRmVmDiskEncryptionStatus  -ResourceGroupName $ResourceGroupName -VMName $VMName
    -ExtensionName $ExtensionName

    OsVolumeEncrypted          : VMRestartPending
    DataVolumesEncrypted       : NotMounted
    OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
    ProgressMessage            : OS disk successfully encrypted, please reboot the VM

It is recommended to save [boot diagnostics](https://azure.microsoft.com/en-us/blog/boot-diagnostics-for-virtual-machines-v2/) of the VM *before* rebooting.

#### Monitoring OS encryption progress
There are three ways to monitor OS encryption progress.

1.Use the Get-AzureRmVmDiskEncryptionStatus cmdlet and inspect the ProgressMessage field:

    OsVolumeEncrypted          : EncryptionInProgress
    DataVolumesEncrypted       : NotMounted
    OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
    ProgressMessage            : OS disk encryption started

Once the VM reaches "OS disk encryption started" it will take roughly 40-50 minutes on a Premium-storage backed VM.

Due to [issue #388](https://github.com/Azure/WALinuxAgent/issues/388) in WALinuxAgent, `OsVolumeEncrypted` and `DataVolumesEncrypted` show up as `Unknown` in some distros. With WALinuxAgent version 2.1.5 and above this will be fixed automatically. In case you see `Unknown` in the output, you can verify disk-encryption status by using Azure Resource Viewer.

Go to [Azure Resource Viewer](https://resources.azure.com/), then expand this hierarchy in the selection panel on left:

~~~~
 |-- subscriptions
     |-- [Your subscription]
          |-- resourceGroups
               |-- [Your resource group]
                    |-- providers
                         |-- Microsoft.Compute
                              |-- virtualMachines
                                   |-- [Your virtual machine]
                                        |-- InstanceView
~~~~                

In the InstanceView, scroll down to see the encryption status of your drives.

![VM Instance View](./media/azure-security-disk-encryption/vm-instanceview.png)

2. Look at [boot diagnostics](https://azure.microsoft.com/en-us/blog/boot-diagnostics-for-virtual-machines-v2/). Messages from ADE extension shall be prefixed with `[AzureDiskEncryption]`.

3. Logon on to the VM via SSH and getting the extension log from

    /var/log/azure/Microsoft.Azure.Security.AzureDiskEncryptionForLinux

It is not recommended to log on to the VM while OS encryption is in progress. Therefore, the logs should be copied only when other two methods have failed.

#### Preparing a pre-encrypted Linux VHD
##### Ubuntu 16
###### Configure encryption during distro install
1. Select "Configure encrypted volumes" when partitioning disks.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig1.png)

2. Create a separate boot drive which must not be encrypted. Encrypt your root drive.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig2.png)

3. Provide a passphrase. This is the passphrase that you will upload into KeyVault.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig3.png)

4. Finish partitioning.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig4.png)

5. When booting the VM, you will be asked for a passphrase. Use the passphrase you provided in step 3.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig5.png)

6. Prepare VM for uploading into Azure using [these instructions](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-ubuntu/). Do not run the last step (deprovisioning the VM) yet.

###### Configure encryption to work with Azure
1. Create a file under /usr/local/sbin/azure_crypt_key.sh, with the content in the script below. Pay attention to the KeyFileName, because it is the passphrase file name put by Azure.

    #!/bin/sh
    MountPoint=/tmp-keydisk-mount
    KeyFileName=LinuxPassPhraseFileName
    echo "Trying to get the key from disks ..." >&2
    mkdir -p $MountPoint
    modprobe vfat >/dev/null 2>&1
    modprobe ntfs >/dev/null 2>&1
    sleep 2
    OPENED=0
    cd /sys/block
    for DEV in sd*; do
        echo "> Trying device: $DEV ..." >&2
        mount -t vfat -r /dev/${DEV}1 $MountPoint >/dev/null||
        mount -t ntfs -r /dev/${DEV}1 $MountPoint >/dev/null
        if [ -f $MountPoint/$KeyFileName ]; then
                cat $MountPoint/$KeyFileName
                umount $MountPoint 2>/dev/null
                OPENED=1
                break
        fi
        umount $MountPoint 2>/dev/null
    done

      if [ $OPENED -eq 0 ]; then
        echo "FAILED to find suitable passphrase file ..." >&2
        echo -n "Try to enter your password: " >&2
        read -s -r A </dev/console
        echo -n "$A"
     else
        echo "Success loading keyfile!" >&2
    fi


2. Change the crypt config in */etc/crypttab*. It should look like this:

    xxx_crypt uuid=xxxxxxxxxxxxxxxxxxxxx none luks,discard,keyscript=/usr/local/sbin/azure_crypt_key.sh

3. If you are editing the *azure_crypt_key.sh* in Windows and copied it to Linux, do not forget to run *dos2unix /usr/local/sbin/azure_crypt_key.sh*.

4. Add executable permissions to the script:

    chmod +x /usr/local/sbin/azure_crypt_key.sh

5. Edit */etc/initramfs-tools/modules* by appending lines:

    vfat
    ntfs
    nls_cp437
    nls_utf8
    nls_iso8859-1

6. Run `update-initramfs -u -k all` to update the initramfs to make the `keyscript` take effect.
7. Now you can deprovision the VM.

![Ubuntu 16.04 Setup](./media/azure-security-disk-encryption/ubuntu-1604-preencrypted-fig6.png)

8. Continue to next step and [upload your VHD](#upload-encrypted-vhd-to-an-azure-storage-account) into Azure.

##### openSUSE 13.2
###### Configure encryption during distro install
1. Select "Encrypt Volume Group" when partitioning disks. Provide a passphrase. This is the passphrase that you will upload into KeyVault.

![openSUSE 13.2 Setup](./media/azure-security-disk-encryption/opensuse-encrypt-fig1.png)

2. Boot the VM using your passphrase.

![openSUSE 13.2 Setup](./media/azure-security-disk-encryption/opensuse-encrypt-fig2.png)

3. Prepare VM for uploading into Azure using [these instructions](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-suse-create-upload-vhd/#prepare-opensuse-131). Do not run the last step (deprovisioning the VM) yet.

###### Configure encryption to work with Azure
1. Edit the /etc/dracut.conf and add the following line:

    add_drivers+=" vfat ntfs nls_cp437 nls_iso8859-1"

2. Comment out these lines by the end of the file “/usr/lib/dracut/modules.d/90crypt/module-setup.sh”:

    #        inst_multiple -o \
    #        $systemdutildir/system-generators/systemd-cryptsetup-generator \
    #        $systemdutildir/systemd-cryptsetup \
    #        $systemdsystemunitdir/systemd-ask-password-console.path \
    #        $systemdsystemunitdir/systemd-ask-password-console.service \
    #        $systemdsystemunitdir/cryptsetup.target \
    #        $systemdsystemunitdir/sysinit.target.wants/cryptsetup.target \
    #        systemd-ask-password systemd-tty-ask-password-agent
    #        inst_script "$moddir"/crypt-run-generator.sh /sbin/crypt-run-generator



3. Append the following line at the beginning of the file “/usr/lib/dracut/modules.d/90crypt/parse-crypt.sh”

    DRACUT_SYSTEMD=0

and change all occurrences of

    if [ -z "$DRACUT_SYSTEMD" ]; then

to

    if [ 1 ]; then

4. Edit /usr/lib/dracut/modules.d/90crypt/cryptroot-ask.sh and append this after the “# Open LUKS device”

    MountPoint=/tmp-keydisk-mount
    KeyFileName=LinuxPassPhraseFileName
    echo "Trying to get the key from disks ..." >&2
    mkdir -p $MountPoint >&2
    modprobe vfat >/dev/null >&2
    modprobe ntfs >/dev/null >&2
    for SFS in /dev/sd*; do
    echo "> Trying device:$SFS..." >&2
    mount ${SFS}1 $MountPoint -t vfat -r >&2 ||
    mount ${SFS}1 $MountPoint -t ntfs -r >&2
    if [ -f $MountPoint/$KeyFileName ]; then
        echo "> keyfile got..." >&2
        cp $MountPoint/$KeyFileName /tmp-keyfile >&2
        luksfile=/tmp-keyfile
        umount $MountPoint >&2
        break
    fi
    done


5. Run the “/usr/sbin/dracut -f -v” to update the initrd.

6. Now you can deprovision the VM and [upload your VHD](#upload-encrypted-vhd-to-an-azure-storage-account) into Azure.

##### CentOS 7
###### Configure encryption during distro install
1. Select "Encrypt my data" when partitioning disks.

![CentOS 7 Setup](./media/azure-security-disk-encryption/centos-encrypt-fig1.png)

2. Make sure "Encrypt" is selected for root partition.

![CentOS 7 Setup](./media/azure-security-disk-encryption/centos-encrypt-fig2.png)

3. Provide a passphrase. This is the passphrase that you will upload into KeyVault.

![CentOS 7 Setup](./media/azure-security-disk-encryption/centos-encrypt-fig3.png)

4. When booting the VM, you will be asked for a passphrase. Use the passphrase you provided in step 3.

![CentOS 7 Setup](./media/azure-security-disk-encryption/centos-encrypt-fig4.png)

5. Prepare VM for uploading into Azure using [these instructions](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-centos/#centos-70). Do not run the last step (deprovisioning the VM) yet.

6. Now you can deprovision the VM and [upload your VHD](#upload-encrypted-vhd-to-an-azure-storage-account) into Azure.

###### Configure encryption to work with Azure
1. Edit the /etc/dracut.conf and add the following line:

    add_drivers+=" vfat ntfs nls_cp437 nls_iso8859-1"

2. Comment out these lines by the end of the file “/usr/lib/dracut/modules.d/90crypt/module-setup.sh”:

    #        inst_multiple -o \
    #        $systemdutildir/system-generators/systemd-cryptsetup-generator \
    #        $systemdutildir/systemd-cryptsetup \
    #        $systemdsystemunitdir/systemd-ask-password-console.path \
    #        $systemdsystemunitdir/systemd-ask-password-console.service \
    #        $systemdsystemunitdir/cryptsetup.target \
    #        $systemdsystemunitdir/sysinit.target.wants/cryptsetup.target \
    #        systemd-ask-password systemd-tty-ask-password-agent
    #        inst_script "$moddir"/crypt-run-generator.sh /sbin/crypt-run-generator



3. Append the following line at the beginning of the file “/usr/lib/dracut/modules.d/90crypt/parse-crypt.sh”

    DRACUT_SYSTEMD=0

and change all occurrences of

    if [ -z "$DRACUT_SYSTEMD" ]; then

to

    if [ 1 ]; then

4. Edit /usr/lib/dracut/modules.d/90crypt/cryptroot-ask.sh and append this after the “# Open LUKS device”

    MountPoint=/tmp-keydisk-mount
    KeyFileName=LinuxPassPhraseFileName
    echo "Trying to get the key from disks ..." >&2
    mkdir -p $MountPoint >&2
    modprobe vfat >/dev/null >&2
    modprobe ntfs >/dev/null >&2
    for SFS in /dev/sd*; do
    echo "> Trying device:$SFS..." >&2
    mount ${SFS}1 $MountPoint -t vfat -r >&2 ||
    mount ${SFS}1 $MountPoint -t ntfs -r >&2
    if [ -f $MountPoint/$KeyFileName ]; then
        echo "> keyfile got..." >&2
        cp $MountPoint/$KeyFileName /tmp-keyfile >&2
        luksfile=/tmp-keyfile
        umount $MountPoint >&2
        break
    fi
    done


5. Run the “/usr/sbin/dracut -f -v” to update the initrd.

![CentOS 7 Setup](./media/azure-security-disk-encryption/centos-encrypt-fig5.png)

### Upload encrypted VHD to an Azure storage account
Once BitLocker encryption pr DM-Crypt encryption is enabled, the local encrypted VHD needs to be uploaded to your storage account.

    Add-AzureRmVhd [-Destination] <Uri> [-LocalFilePath] <FileInfo> [[-NumberOfUploaderThreads] <Int32> ] [[-BaseImageUriToPatch] <Uri> ] [[-OverWrite]] [ <CommonParameters>]

### Upload the disk-encryption secret for the pre-encrypted VM to your key vault
The disk-encryption secret obtained previously must be uploaded as a secret in your key vault. The key vault needs to have permissions enabled for your AAD client as well as disk encryption.

    $AadClientId = "YourAADClientId"
    $AadClientSecret = "YourAADClientSecret"

    $KeyVault = New-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $ResourceGroupName -Location $Location

    Set-AzureRmKeyVaultAccessPolicy -VaultName $KeyVaultName -ResourceGroupName $ResourceGroupName -ServicePrincipalName $AadClientId -PermissionsToKeys all -PermissionsToSecrets all
    Set-AzureRmKeyVaultAccessPolicy -VaultName $KeyVaultName -ResourceGroupName $ResourceGroupName -EnabledForDiskEncryption


#### Disk encryption secret not encrypted with a KEK
Use [Set-AzureKeyVaultSecret](https://msdn.microsoft.com/library/dn868050.aspx) to set up the secret in your key vault. In case of a Windows virtual machine, the bek file is encoded as a base64 string and then uploaded to your key vault using the Set-AzureKeyVaultSecret cmdlet. For Linux, the passphrase is encoded as a base64 string and then uploaded to the key vault. In addition, make sure that the following tags are set when you create the secret in the key vault.

    # This is the passphrase that was provided for encryption during distro install
    $passphrase = "contoso-password"

    $tags = @{"DiskEncryptionKeyEncryptionAlgorithm" = "RSA-OAEP"; "DiskEncryptionKeyFileName" = "LinuxPassPhraseFileName"}
    $secretName = [guid]::NewGuid().ToString()
    $secretValue = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($passphrase))
    $secureSecretValue = ConvertTo-SecureString $secretValue -AsPlainText -Force

    $secret = Set-AzureKeyVaultSecret -VaultName $KeyVaultName -Name $secretName -SecretValue $secureSecretValue -tags $tags
    $secretUrl = $secret.Id

The `$secretUrl` shall be used in the next step for [attaching the OS disk without using KEK](#without-using-a-kek).

#### Disk encryption secret encrypted with a KEK
The secret can optionally be encrypted with a key encryption key before you upload it to the key vault. Use the wrap [API](https://msdn.microsoft.com/library/azure/dn878066.aspx) to first encrypt the secret using the key encryption key. The output of this wrap operation is a base64 URL encoded string which is then uploaded as a secret using the [Set-AzureKeyVaultSecret](https://msdn.microsoft.com/library/dn868050.aspx) cmdlet.

    # This is the passphrase that was provided for encryption during distro install
    $passphrase = "contoso-password"

    Add-AzureKeyVaultKey -VaultName $KeyVaultName -Name "keyencryptionkey" -Destination Software
    $KeyEncryptionKey = Get-AzureKeyVaultKey -VaultName $KeyVault.OriginalVault.Name -Name "keyencryptionkey"

    $apiversion = "2015-06-01"

    ##############################
    # Get Auth URI
    ##############################

    $uri = $KeyVault.VaultUri + "/keys"
    $headers = @{}

    $response = try { Invoke-RestMethod -Method GET -Uri $uri -Headers $headers } catch { $_.Exception.Response }

    $authHeader = $response.Headers["www-authenticate"]
    $authUri = [regex]::match($authHeader, 'authorization="(.*?)"').Groups[1].Value

    Write-Host "Got Auth URI successfully"

    ##############################
    # Get Auth Token
    ##############################

    $uri = $authUri + "/oauth2/token"
    $body = "grant_type=client_credentials"
    $body += "&client_id=" + $AadClientId
    $body += "&client_secret=" + [Uri]::EscapeDataString($AadClientSecret)
    $body += "&resource=" + [Uri]::EscapeDataString("https://vault.azure.net")
    $headers = @{}

    $response = Invoke-RestMethod -Method POST -Uri $uri -Headers $headers -Body $body

    $access_token = $response.access_token

    Write-Host "Got Auth Token successfully"

    ##############################
    # Get KEK info
    ##############################

    $uri = $KeyEncryptionKey.Id + "?api-version=" + $apiversion
    $headers = @{"Authorization" = "Bearer " + $access_token}

    $response = Invoke-RestMethod -Method GET -Uri $uri -Headers $headers

    $keyid = $response.key.kid

    Write-Host "Got KEK info successfully"

    ##############################
    # Encrypt passphrase using KEK
    ##############################

    $passphraseB64 = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($Passphrase))
    $uri = $keyid + "/encrypt?api-version=" + $apiversion
    $headers = @{"Authorization" = "Bearer " + $access_token; "Content-Type" = "application/json"}
    $bodyObj = @{"alg" = "RSA-OAEP"; "value" = $passphraseB64}
    $body = $bodyObj | ConvertTo-Json

    $response = Invoke-RestMethod -Method POST -Uri $uri -Headers $headers -Body $body

    $wrappedSecret = $response.value

    Write-Host "Encrypted passphrase successfully"

    ##############################
    # Store secret
    ##############################

    $secretName = [guid]::NewGuid().ToString()
    $uri = $KeyVault.VaultUri + "/secrets/" + $secretName + "?api-version=" + $apiversion
    $secretAttributes = @{"enabled" = $true}
    $secretTags = @{"DiskEncryptionKeyEncryptionAlgorithm" = "RSA-OAEP"; "DiskEncryptionKeyFileName" = "LinuxPassPhraseFileName"}
    $headers = @{"Authorization" = "Bearer " + $access_token; "Content-Type" = "application/json"}
    $bodyObj = @{"value" = $wrappedSecret; "attributes" = $secretAttributes; "tags" = $secretTags}
    $body = $bodyObj | ConvertTo-Json

    $response = Invoke-RestMethod -Method PUT -Uri $uri -Headers $headers -Body $body

    Write-Host "Stored secret successfully"

    $secretUrl = $response.id

The `$KeyEncryptionKey` and `$secretUrl` shall be used in the next step for [attaching the OS disk using KEK](#using-a-kek).

### Specify secret URL when attaching OS Disk
#### Without using a KEK
While attaching the OS disk, `$secretUrl` needs to be passed. The URL was generated in the ["Disk-encryption secret not encrypted with a KEK"](#disk-encryption-secret-not-encrypted-with-a-kek) section.

    Set-AzureRmVMOSDisk `
            -VM $VirtualMachine `
            -Name $OSDiskName `
            -SourceImageUri $VhdUri `
            -VhdUri $OSDiskUri `
            -Linux `
            -CreateOption FromImage `
            -DiskEncryptionKeyVaultId $KeyVault.ResourceId `
            -DiskEncryptionKeyUrl $SecretUrl

#### Using a KEK
When you attach the OS disk, pass `$KeyEncryptionKey` and `$secretUrl`. The URL was generated in the ["Disk-encryption secret not encrypted with a KEK"](#disk-encryption-secret-not-encrypted-with-a-kek) section.

    Set-AzureRmVMOSDisk `
            -VM $VirtualMachine `
            -Name $OSDiskName `
            -SourceImageUri $CopiedTemplateBlobUri `
            -VhdUri $OSDiskUri `
            -Linux `
            -CreateOption FromImage `
            -DiskEncryptionKeyVaultId $KeyVault.ResourceId `
            -DiskEncryptionKeyUrl $SecretUrl `
            -KeyEncryptionKeyVaultId $KeyVault.ResourceId `
            -KeyEncryptionKeyURL $KeyEncryptionKey.Id

## Download this guide
You can download this guide from the [TechNet Gallery](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0).

## For more information
[Explore Azure Disk Encryption with Azure PowerShell](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/16/explore-azure-disk-encryption-with-azure-powershell.aspx?wa=wsignin1.0)

[Explore Azure Disk Encryption with Azure PowerShell - Part 2](http://blogs.msdn.com/b/azuresecurity/archive/2015/11/21/explore-azure-disk-encryption-with-azure-powershell-part-2.aspx)
