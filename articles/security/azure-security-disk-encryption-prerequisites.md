---
title: Prerequisites - Azure Disk Encryption for IaaS VMs | Microsoft Docs
description: This article provides prerequisites for using Microsoft Azure Disk Encryption for IaaS VMs.
author: msmbaldwin
ms.service: security
ms.topic: article
ms.author: mbaldwin
ms.date: 03/25/2019

ms.custom: seodec18
---

# Azure Disk Encryption prerequisites

This article, Azure Disk Encryption Prerequisites, explains items that need to be in place before you can use Azure Disk Encryption. Azure Disk Encryption is integrated with [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/) to help manage encryption keys. You can use [Azure PowerShell](/powershell/azure/overview), [Azure CLI](/cli/azure/), or the [Azure portal](https://portal.azure.com) to configure Azure Disk Encryption.

Before you enable Azure Disk Encryption on Azure IaaS VMs for the supported scenarios that were discussed in the [Azure Disk Encryption Overview](azure-security-disk-encryption-overview.md) article, be sure to have the prerequisites in place. 

> [!WARNING]
> - If you have previously used [Azure Disk Encryption with Azure AD app](azure-security-disk-encryption-prerequisites-aad.md) to encrypt this VM, you will have to continue use this option to encrypt your VM. You can’t use [Azure Disk Encryption](azure-security-disk-encryption-prerequisites.md) on this encrypted VM as this isn’t a supported scenario, meaning switching away from AAD application for this encrypted VM isn’t supported yet.
> - Certain recommendations might increase data, network, or compute resource usage, resulting in additional license or subscription costs. You must have a valid active Azure subscription to create resources in Azure in the supported regions.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Supported VM sizes

Azure Disk Encryption is available on virtual machines that meet these minimum memory requirements:

| Virtual Machine | Minimum memory requirement |
|--|--|
| Windows VMs | 2 GB |
| Linux VMs when only encrypting data volumes| 2 GB |
| Linux VMs when encrypting both data and OS volumes, and where the root (/) file system usage is 4GB or less | 8 GB |
| Linux VMs when encrypting both data and OS volumes, and where the root (/) file system usage is greater than 4GB | The root file system usage * 2. For instance, a 16 GB of root file system usage requires at least 32GB of RAM |

Once the OS disk encryption process is complete on Linux virtual machines, the VM can be configured to run with less memory. 

> [!NOTE]
> Linux OS disk encryption is not available for [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml).

Azure Disk Encryption is also available for VMs with premium storage. 

## Supported operating systems

### Windows

- Windows client: Windows 8 and later.
- Windows Server: Windows Server 2008 R2 and later.  
 
> [!NOTE]
> Windows Server 2008 R2 requires the .NET Framework 4.5 to be installed for encryption; install it from Windows Update with the optional update Microsoft .NET Framework 4.5.2 for Windows Server 2008 R2 x64-based systems ([KB2901983](https://www.catalog.update.microsoft.com/Search.aspx?q=KB2901983)).  
>  
> Windows Server 2012 R2 Core and Windows Server 2016 Core requires the bdehdcfg component to be installed on the VM for encryption.


### Linux 

Azure Disk Encryption is supported on a subset of the [Azure-endorsed Linux distributions](../virtual-machines/linux/endorsed-distros.md), which is itself a subset of all Linux server possible distributions.

![Venn Diagram of Linux server distributions that support Azure Disk Encryption](./media/azure-security-disk-encryption-faq/ade-supported-distros.png)

Linux server distributions that are not endorsed by Azure do not support Azure Disk Encryption and, of those that are endorsed, only the following distributions and versions support Azure Disk Encryption:

| Linux distribution | Version | Volume type supported for encryption|
| --- | --- |--- |
| Ubuntu | 18.04| OS and data disk |
| Ubuntu | 16.04| OS and data disk |
| Ubuntu | 14.04.5</br>[with Azure tuned kernel updated to 4.15 or later](azure-security-disk-encryption-tsg.md#bkmk_Ubuntu14) | OS and data disk |
| RHEL | 7.6 | OS and data disk (see note below) |
| RHEL | 7.5 | OS and data disk (see note below) |
| RHEL | 7.4 | OS and data disk (see note below) |
| RHEL | 7.3 | OS and data disk (see note below) |
| RHEL | 7.2 | OS and data disk (see note below) |
| RHEL | 6.8 | Data disk (see note below) |
| RHEL | 6.7 | Data disk (see note below) |
| CentOS | 7.6 | OS and data disk |
| CentOS | 7.5 | OS and data disk |
| CentOS | 7.4 | OS and data disk |
| CentOS | 7.3 | OS and data disk |
| CentOS | 7.2n | OS and data disk |
| CentOS | 6.8 | Data disk |
| openSUSE | 42.3 | Data disk |
| SLES | 12-SP4 | Data disk |
| SLES | 12-SP3 | Data disk |

> [!NOTE]
> The new ADE implementation is supported for RHEL OS and data disk for RHEL7 Pay-As-You-Go images. ADE is currently not supported for RHEL Bring-Your-Own-Subscription (BYOS) images. See [Azure Disk Encryption for Linux](azure-security-disk-encryption-linux.md) for more information.

- Azure Disk Encryption requires that your key vault and VMs reside in the same Azure region and subscription. Configuring the resources in separate regions causes a failure in enabling the Azure Disk Encryption feature.

#### Additional prerequisites for Linux IaaS VMs 

- Azure Disk Encryption requires the dm-crypt and vfat modules to be present on the system. Removing or disabling vfat from the default image will prevent the system from reading the key volume and obtaining the key needed to unlock the disks on subsequent reboots. System hardening steps that remove the vfat module from the system are not compatible with Azure Disk Encryption. 
- Before enabling encryption, the data disks to be encrypted need to be properly listed in /etc/fstab. Use a persistent block device name for this entry, as device names in the "/dev/sdX" format can't be relied upon to be associated with the same disk across reboots, particularly after encryption is applied. For more detail on this behavior, see: [Troubleshoot Linux VM device name changes](../virtual-machines/linux/troubleshoot-device-names-problems.md)
- Make sure the /etc/fstab settings are configured properly for mounting. To configure these settings, run the mount -a command or reboot the VM and trigger the remount that way. Once that is complete, check the output of the lsblk command to verify that the drive is still mounted. 
  - If the /etc/fstab file doesn't mount the drive properly before enabling encryption, Azure Disk Encryption won't be able to mount it properly.
  - The Azure Disk Encryption process will move the mount information out of /etc/fstab and into its own configuration file as part of the encryption process. Don't be alarmed to see the entry missing from /etc/fstab after data drive encryption completes.
  - Before starting encryption, be sure to stop all services and processes that could be writing to mounted data disks and disable them, so that they do not restart automatically after a reboot. These could keep files open on these partitions, preventing the encryption procedure to remount them, causing failure of the encryption. 
  - After reboot, it will take time for the Azure Disk Encryption process to mount the newly encrypted disks. They won't be immediately available after a reboot. The process needs time to start, unlock, and then mount the encrypted drives before being available for other processes to access. This process may take more than a minute after reboot depending on the system characteristics.

An example of commands that can be used to mount the data disks and create the necessary /etc/fstab entries can be found in [lines 244-248 of this script file](https://github.com/ejarvi/ade-cli-getting-started/blob/master/validate.sh#L244-L248). 

## <a name="bkmk_GPO"></a> Networking and Group Policy

**To enable the Azure Disk Encryption feature, the IaaS VMs must meet the following network endpoint configuration requirements:**
  - To get a token to connect to your key vault, the IaaS VM must be able to connect to an Azure Active Directory endpoint, \[login.microsoftonline.com\].
  - To write the encryption keys to your key vault, the IaaS VM must be able to connect to the key vault endpoint.
  - The IaaS VM must be able to connect to an Azure storage endpoint that hosts the Azure extension repository and an Azure storage account that hosts the VHD files.
  -  If your security policy limits access from Azure VMs to the Internet, you can resolve the preceding URI and configure a specific rule to allow outbound connectivity to the IPs. For more information, see [Azure Key Vault behind a firewall](../key-vault/key-vault-access-behind-firewall.md).    


**Group Policy:**
 - The Azure Disk Encryption solution uses the BitLocker external key protector for Windows IaaS VMs. For domain joined VMs, don't push any group policies that enforce TPM protectors. For information about the group policy for “Allow BitLocker without a compatible TPM,” see [BitLocker Group Policy Reference](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings#bkmk-unlockpol1).

-  BitLocker policy on domain joined virtual machines with custom group policy must include the following setting: [Configure user storage of BitLocker recovery information -> Allow 256-bit recovery key](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-group-policy-settings). Azure Disk Encryption will fail when custom group policy settings for BitLocker are incompatible. On machines that didn't have the correct policy setting, apply the new policy, force the new policy to update (gpupdate.exe /force), and then restarting may be required.

- Azure Disk Encryption will fail if domain level group policy blocks the AES-CBC algorithm, which is used by BitLocker.


## <a name="bkmk_PSH"></a> Azure PowerShell
[Azure PowerShell](/powershell/azure/overview) provides a set of cmdlets that uses the [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) model for managing your Azure resources. You can use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or you can install it on your local machine using the instructions below to use it in any PowerShell session. If you already have it installed locally, make sure you use the latest version of Azure PowerShell SDK version to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell release](https://github.com/Azure/azure-powershell/releases).

### Install Azure PowerShell for use on your local machine (optional): 
1. Follow the instructions in the links for your operating system, then continue though the rest of the steps below.      
   - [Install and configure Azure PowerShell](/powershell/azure/install-az-ps). 
     - Install PowerShellGet, Azure PowerShell, and load the Az module. 

2. Verify the installed versions of the Az module. If needed, [update the Azure PowerShell module](/powershell/azure/install-az-ps#update-the-azure-powershell-module).
    Using the latest Az module version is recommended.

     ```powershell
     Get-Module Az -ListAvailable | Select-Object -Property Name,Version,Path
     ```

3. Sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.
     
     ```azurepowershell-interactive
     Connect-AzAccount
     # For specific instances of Azure, use the -Environment parameter.
     Connect-AzAccount –Environment (Get-AzEnvironment –Name AzureUSGovernment)
    
     <# If you have multiple subscriptions and want to specify a specific one, 
     get your subscription list with Get-AzSubscription and 
     specify it with Set-AzContext.  #>
     Get-AzSubscription
     Set-AzContext -SubscriptionId "xxxx-xxxx-xxxx-xxxx"
     ```

4.  If needed, review [Getting started with Azure PowerShell](/powershell/azure/get-started-azureps).

## <a name="bkmk_CLI"></a> Install the Azure CLI for use on your local machine (optional)

The [Azure CLI 2.0](/cli/azure) is a command-line tool for managing Azure resources. The CLI is designed to flexibly query data, support long-running operations as non-blocking processes, and make scripting easy. You can use it in your browser with [Azure Cloud Shell](../cloud-shell/overview.md), or you can install it on your local machine and use it in any PowerShell session.

1. [Install Azure CLI](/cli/azure/install-azure-cli) for use on your local machine (optional):

2. Verify the installed version.
     
     ```azurecli-interactive
     az --version
     ``` 

3. Sign in to Azure using [az login](/cli/azure/authenticate-azure-cli).
     
     ```azurecli
     az login
     
     # If you would like to select a tenant, use: 
     az login --tenant "<tenant>"

     # If you have multiple subscriptions, get your subscription list with az account list and specify with az account set.
     az account list
     az account set --subscription "<subscription name or ID>"
     ```

4. Review [Get started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli) if needed. 


## Prerequisite workflow for Key Vault
If you're already familiar with the Key Vault and Azure AD prerequisites for Azure Disk Encryption, you can use the [Azure Disk Encryption prerequisites PowerShell script](https://raw.githubusercontent.com/Azure/azure-powershell/master/src/Compute/Compute/Extension/AzureDiskEncryption/Scripts/AzureDiskEncryptionPreRequisiteSetup.ps1 ). For more information on using the prerequisites script, see the [Encrypt a VM Quickstart](quick-encrypt-vm-powershell.md) and the [Azure Disk Encryption Appendix](azure-security-disk-encryption-appendix.md#bkmk_prereq-script). 

1. If needed, create a resource group.
2. Create a key vault. 
3. Set key vault advanced access policies.

>[!WARNING]
>Before deleting a key vault, ensure that you did not encrypt any existing VMs with it. To protect a vault from accidental deletion, [enable soft delete](../key-vault/key-vault-soft-delete-powershell.md#enabling-soft-delete) and a [resource lock](../azure-resource-manager/resource-group-lock-resources.md) on the vault. 
 
## <a name="bkmk_KeyVault"></a> Create a key vault 
Azure Disk Encryption is integrated with [Azure Key Vault](https://azure.microsoft.com/documentation/services/key-vault/) to help you control and manage the disk-encryption keys and secrets in your key vault subscription. You can create a key vault or use an existing one for Azure Disk Encryption. For more information about key vaults, see [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md) and [Secure your key vault](../key-vault/key-vault-secure-your-key-vault.md). You can use a Resource Manager template, Azure PowerShell, or the Azure CLI to create a key vault. 


>[!WARNING]
>In order to make sure the encryption secrets don’t cross regional boundaries, Azure Disk Encryption needs the Key Vault and the VMs to be co-located in the same region. Create and use a Key Vault that is in the same region as the VM to be encrypted. 


### <a name="bkmk_KVPSH"></a> Create a key vault with PowerShell

You can create a key vault with Azure PowerShell using the [New-AzKeyVault](/powershell/module/az.keyvault/New-azKeyVault) cmdlet. For additional cmdlets for Key Vault, see [Az.KeyVault](/powershell/module/az.keyvault/). 

1. If needed, [connect to your Azure subscription](azure-security-disk-encryption-appendix.md#bkmk_ConnectPSH). 
2. Create a new resource group, if needed, with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup).  To list data center locations, use [Get-AzLocation](/powershell/module/az.resources/get-azlocation). 
     
     ```azurepowershell-interactive
     # Get-AzLocation 
     New-AzResourceGroup –Name 'MyKeyVaultResourceGroup' –Location 'East US'
     ```

3. Create a new key vault using [New-AzKeyVault](/powershell/module/az.keyvault/New-azKeyVault)
    
      ```azurepowershell-interactive
     New-AzKeyVault -VaultName 'MySecureVault' -ResourceGroupName 'MyKeyVaultResourceGroup' -Location 'East US'
     ```

4. Note the **Vault Name**, **Resource Group Name**, **Resource ID**, **Vault URI**, and the **Object ID** that are returned for later use when you encrypt the disks. 


### <a name="bkmk_KVCLI"></a> Create a key vault with Azure CLI
You can manage your key vault with Azure CLI using the [az keyvault](/cli/azure/keyvault#commands) commands. To create a key vault, use [az keyvault create](/cli/azure/keyvault#az-keyvault-create).

1. If needed, [connect to your Azure subscription](azure-security-disk-encryption-appendix.md#bkmk_ConnectCLI).
2. Create a new resource group, if needed, with [az group create](/cli/azure/group#az-group-create). To  list locations, use [az account list-locations](/cli/azure/account#az-account-list) 
     
     ```azurecli-interactive
     # To list locations: az account list-locations --output table
     az group create -n "MyKeyVaultResourceGroup" -l "East US"
     ```

3. Create a new key vault using [az keyvault create](/cli/azure/keyvault#az-keyvault-create).
    
     ```azurecli-interactive
     az keyvault create --name "MySecureVault" --resource-group "MyKeyVaultResourceGroup" --location "East US"
     ```

4. Note the **Vault Name** (name), **Resource Group Name**, **Resource ID** (ID), **Vault URI**, and the **Object ID** that are returned for use later. 

### <a name="bkmk_KVRM"></a> Create a key vault with a Resource Manager template

You can create a key vault by using the [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-key-vault-create).

1. On the Azure quickstart template, click **Deploy to Azure**.
2. Select the subscription, resource group, resource group location, Key Vault name, Object ID,  legal terms, and agreement, and then click **Purchase**. 


## <a name="bkmk_KVper"></a> Set key vault advanced access policies
The Azure platform needs access to the encryption keys or secrets in your key vault to make them available to the VM for booting and decrypting the volumes. Enable disk encryption on the key vault or deployments will fail.  

### <a name="bkmk_KVperPSH"></a> Set key vault advanced access policies with Azure PowerShell
 Use the key vault PowerShell cmdlet [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) to enable disk encryption for the key vault.

  - **Enable Key Vault for disk encryption:** EnabledForDiskEncryption is required for Azure Disk encryption.
      
     ```azurepowershell-interactive 
     Set-AzKeyVaultAccessPolicy -VaultName 'MySecureVault' -ResourceGroupName 'MyKeyVaultResourceGroup' -EnabledForDiskEncryption
     ```

  - **Enable Key Vault for deployment, if needed:** Enables the Microsoft.Compute resource provider to retrieve secrets from this key vault when this key vault is referenced in resource creation, for example when creating a virtual machine.

     ```azurepowershell-interactive
      Set-AzKeyVaultAccessPolicy -VaultName 'MySecureVault' -ResourceGroupName 'MyKeyVaultResourceGroup' -EnabledForDeployment
     ```

  - **Enable Key Vault for template deployment, if needed:** Enables Azure Resource Manager to get secrets from this key vault when this key vault is referenced in a template deployment.

     ```azurepowershell-interactive             
     Set-AzKeyVaultAccessPolicy -VaultName 'MySecureVault' -ResourceGroupName 'MyKeyVaultResourceGroup' -EnabledForTemplateDeployment
     ```

### <a name="bkmk_KVperCLI"></a> Set key vault advanced access policies using the Azure CLI
Use [az keyvault update](/cli/azure/keyvault#az-keyvault-update) to enable disk encryption for the key vault. 

 - **Enable Key Vault for disk encryption:** Enabled-for-disk-encryption is required. 

     ```azurecli-interactive
     az keyvault update --name "MySecureVault" --resource-group "MyKeyVaultResourceGroup" --enabled-for-disk-encryption "true"
     ```  

 - **Enable Key Vault for deployment, if needed:** Enables the Microsoft.Compute resource provider to retrieve secrets from this key vault when this key vault is referenced in resource creation, for example when creating a virtual machine.

     ```azurecli-interactive
     az keyvault update --name "MySecureVault" --resource-group "MyKeyVaultResourceGroup" --enabled-for-deployment "true"
     ``` 

 - **Enable Key Vault for template deployment, if needed:** Allow Resource Manager to retrieve secrets from the vault.
     ```azurecli-interactive  
     az keyvault update --name "MySecureVault" --resource-group "MyKeyVaultResourceGroup" --enabled-for-template-deployment "true"
     ```


### <a name="bkmk_KVperrm"></a> Set key vault advanced access policies through the Azure portal

1. Select your keyvault, go to **Access Policies**, and **Click to show advanced access policies**.
2. Select the box labeled **Enable access to Azure Disk Encryption for volume encryption**.
3. Select **Enable access to Azure Virtual Machines for deployment** and/or **Enable Access to Azure Resource Manager for template deployment**, if needed. 
4. Click **Save**.

    ![Azure key vault advanced access policies](./media/azure-security-disk-encryption/keyvault-portal-fig4.png)


## <a name="bkmk_KEK"></a> Set up a key encryption key (optional)
If you want to use a key encryption key (KEK) for an additional layer of security for encryption keys, add a KEK to your key vault. Use the [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey) cmdlet to create a key encryption key in the key vault. You can also import a KEK from your on-premises key management HSM. For more information, see [Key Vault Documentation](../key-vault/key-vault-hsm-protected-keys.md). When a key encryption key is specified, Azure Disk Encryption uses that key to wrap the encryption secrets before writing to Key Vault.

* When generating keys, use an RSA key type. Azure Disk Encryption does not yet support using Elliptic Curve keys.

* Your key vault secret and KEK URLs must be versioned. Azure enforces this restriction of versioning. For valid secret and KEK URLs, see the following examples:

  * Example of a valid secret URL:
      *https://contosovault.vault.azure.net/secrets/EncryptionSecretWithKek/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
  * Example of a valid KEK URL:
      *https://contosovault.vault.azure.net/keys/diskencryptionkek/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*

* Azure Disk Encryption doesn't support specifying port numbers as part of key vault secrets and KEK URLs. For examples of non-supported and supported key vault URLs, see the following examples:

  * Unacceptable key vault URL
     *https://contosovault.vault.azure.net:443/secrets/contososecret/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*
  * Acceptable key vault URL:
      *https://contosovault.vault.azure.net/secrets/contososecret/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*


### <a name="bkmk_KEKPSH"></a> Set up a key encryption key with Azure PowerShell 
Before using the PowerShell script, you should be familiar with the Azure Disk Encryption prerequisites to understand the steps in the script. The sample script might need changes for your environment. This script creates all Azure Disk Encryption prerequisites and encrypts an existing IaaS VM, wrapping the disk encryption key by using a key encryption key. 

 ```powershell
 # Step 1: Create a new resource group and key vault in the same location.
	 # Fill in 'MyLocation', 'MyKeyVaultResourceGroup', and 'MySecureVault' with your values.
	 # Use Get-AzLocation to get available locations and use the DisplayName.
	 # To use an existing resource group, comment out the line for New-AzResourceGroup
	 
     $Loc = 'MyLocation';
     $KVRGname = 'MyKeyVaultResourceGroup';
     $KeyVaultName = 'MySecureVault'; 
     New-AzResourceGroup –Name $KVRGname –Location $Loc;
     New-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname -Location $Loc;
     $KeyVault = Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname;
     $KeyVaultResourceId = (Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname).ResourceId;
     $diskEncryptionKeyVaultUrl = (Get-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $KVRGname).VaultUri;
	 
 #Step 2: Enable the vault for disk encryption.
     Set-AzKeyVaultAccessPolicy -VaultName $KeyVaultName -ResourceGroupName $KVRGname -EnabledForDiskEncryption;
	  
 #Step 3: Create a new key in the key vault with the Add-AzKeyVaultKey cmdlet.
	 # Fill in 'MyKeyEncryptionKey' with your value.
	 
	 $keyEncryptionKeyName = 'MyKeyEncryptionKey';
     Add-AzKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName -Destination 'HSM';
     $keyEncryptionKeyUrl = (Get-AzKeyVaultKey -VaultName $KeyVaultName -Name $keyEncryptionKeyName).Key.kid;
	 
 #Step 4: Encrypt the disks of an existing IaaS VM
	 # Fill in 'MySecureVM' and 'MyVirtualMachineResourceGroup' with your values. 
	 
	 $VMName = 'MySecureVM';
     $VMRGName = 'MyVirtualMachineResourceGroup';
     Set-AzVMDiskEncryptionExtension -ResourceGroupName $VMRGName -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $KeyVaultResourceId;
```


 
## Next steps
> [!div class="nextstepaction"]
> [Enable Azure Disk Encryption for Windows](azure-security-disk-encryption-windows.md)

> [!div class="nextstepaction"]
> [Enable Azure Disk Encryption for Linux](azure-security-disk-encryption-linux.md)

