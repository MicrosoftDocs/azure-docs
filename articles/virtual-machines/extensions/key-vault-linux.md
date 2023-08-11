---
title: Azure Key Vault VM Extension for Linux 
description: Deploy an agent performing automatic refresh of Key Vault certificates on virtual machines using a virtual machine extension.
services: virtual-machines
author: msmbaldwin
tags: keyvault
ms.service: virtual-machines
ms.subservice: extensions
ms.collection: linux
ms.topic: article
ms.date: 12/02/2019
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-linux
---
# Key Vault virtual machine extension for Linux

The Key Vault VM extension provides automatic refresh of certificates stored in an Azure key vault. Specifically, the extension monitors a list of observed certificates stored in key vaults.  The extension retrieves and installs the corresponding certificates after detecting a change. The Key Vault VM extension is published and supported by Microsoft, currently on Linux VMs. This document details the supported platforms, configurations, and deployment options for the Key Vault VM extension for Linux. 

### Operating system

The Key Vault VM extension supports these Linux distributions:

- Ubuntu 20.04, 22.04 
- [Azure Linux](../../azure-linux/intro-azure-linux.md)

> [!NOTE]
> The Key Vault VM Extension downloads the certificates in the default location or to the location provided by "certStoreLocation" property in the VM Extension settings. The Key Vault VM Extension updates the folder permission to 700 (drwx------) allowing read, write and execute permission to the owner of the folder only

### Supported certificate content types

- PKCS #12
- PEM

## Prerequisites
  - Key Vault instance with certificate. See [Create a Key Vault](../../key-vault/general/quick-create-portal.md)
  - VM/VMSS must have assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md)
  - The Key Vault Access Policy must be set with secrets `get` and `list` permission for VM/VMSS managed identity to retrieve a secret's portion of certificate. See [How to Authenticate to Key Vault](../../key-vault/general/authentication.md) and [Assign a Key Vault access policy](../../key-vault/general/assign-access-policy-cli.md).
  -  VMSS should have the following identity setting:
  ` 
  "identity": {
  "type": "UserAssigned",
  "userAssignedIdentities": {
  "[parameters('userAssignedIdentityResourceId')]": {}
  }
  }
  `
  
 - AKV extension should have this setting:
  `
                  "authenticationSettings": {
                    "msiEndpoint": "[parameters('userAssignedIdentityEndpoint')]",
                    "msiClientId": "[reference(parameters('userAssignedIdentityResourceId'), variables('msiApiVersion')).clientId]"
                  }
   `
## Key Vault VM extension version

* Users can chose to upgrade their Key Vault vm extension version to `V2.0` to use full certificate chain download feature. Issuer certificates (intermediate and root) will be appended to the leaf certificate in the PEM file.

* If you prefer to upgrade to `v2.0`, you would need to delete `v1.0` first, then install `v2.0`.
```azurecli
  az vm extension delete --name KeyVaultForLinux --resource-group ${resourceGroup} --vm-name ${vmName}
  az vm extension set -n "KeyVaultForLinux" --publisher Microsoft.Azure.KeyVault --resource-group "${resourceGroup}" --vm-name "${vmName}" –settings .\akvvm.json –version 2.0
```  
  The flag --version 2.0 is optional because the latest version will be installed by default.	

* If the VM has certificates downloaded by v1.0, deleting the v1.0 AKVVM extension will NOT delete the downloaded certificates.  After installing v2.0, the existing certificates will NOT be modified.  You would need to delete the certificate files or roll-over the certificate to get the PEM file with full-chain on the VM.

## Extension schema

The following JSON shows the schema for the Key Vault VM extension. The extension does not require protected settings - all its settings are considered information without security impact. The extension requires a list of monitored secrets, polling frequency, and the destination certificate store. Specifically:  
```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KVVMExtensionForLinux",
      "apiVersion": "2022-11-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForLinux",
      "typeHandlerVersion": "2.0",
      "autoUpgradeMinorVersion": true,
      "enableAutomaticUpgrade": true,
      "settings": {
        "secretsManagementSettings": {
          "pollingIntervalInS": <polling interval in seconds, e.g. "3600">,
          "certificateStoreName": <It is ignored on Linux>,
          "linkOnRenewal": <Not available on Linux e.g.: false>,
          "certificateStoreLocation": <disk path where certificate is stored, default: "/var/lib/waagent/Microsoft.Azure.KeyVault">,
          "requireInitialSync": <initial synchronization of certificates e..g: true>,
          "observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: ["https://myvault.vault.azure.net/secrets/mycertificate", "https://myvault.vault.azure.net/secrets/mycertificate2"]>
        },
        "authenticationSettings": {
          "msiEndpoint":  <Required when msiClientId is provided. MSI endpoint e.g. for most Azure VMs: "http://169.254.169.254/metadata/identity">,
          "msiClientId":  <Required when VM has any user assigned identities. MSI identity e.g.: "c7373ae5-91c2-4165-8ab6-7381d6e75619".>
        }
       }
      }
    }
```

> [!NOTE]
> Your observed certificates URLs should be of the form `https://myVaultName.vault.azure.net/secrets/myCertName`.
> 
> This is because the `/secrets` path returns the full certificate, including the private key, while the `/certificates` path does not. More information about certificates can be found here: [Key Vault Certificates](../../key-vault/general/about-keys-secrets-certificates.md)

> [!IMPORTANT]
> The 'authenticationSettings' property is **required** for VMs with any **user assigned identities**. Even if you want to use a system assigned identity this is still required otherwise the VM extension will not know which identity to use. Without this section, a VM with user assigned identities will result in the Key Vault extension failing and being unable to download certificates.
> Set msiClientId to the identity that will authenticate to Key Vault.
> 
> Also **required** for **Azure Arc-enabled VMs**.
> Set msiEndpoint to `http://localhost:40342/metadata/identity`.

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2022-07-01 | date |
| publisher | Microsoft.Azure.KeyVault | string |
| type | KeyVaultForLinux | string |
| typeHandlerVersion | 2.0 | int |
| pollingIntervalInS | 3600 | string |
| certificateStoreName | It is ignored on Linux | string |
| linkOnRenewal | false | boolean |
| certificateStoreLocation  | /var/lib/waagent/Microsoft.Azure.KeyVault | string |
| requireInitialSync | true | boolean |
| observedCertificates  | ["https://myvault.vault.azure.net/secrets/mycertificate", "https://myvault.vault.azure.net/secrets/mycertificate2"] | string array
| msiEndpoint | http://169.254.169.254/metadata/identity | string |
| msiClientId | c7373ae5-91c2-4165-8ab6-7381d6e75619 | string |

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment refresh of certificates. The extension can be deployed to individual VMs or virtual machine scale sets. The schema and configuration are common to both template types. 

The JSON configuration for a virtual machine extension must be nested inside the virtual machine resource fragment of the template, specifically `"resources": []` object for the virtual machine template and for a virtual machine scale set under `"virtualMachineProfile":"extensionProfile":{"extensions" :[]` object.

 > [!NOTE]
> The VM extension would require system or user managed identity to be assigned to authenticate to Key vault.  See [How to authenticate to Key Vault and assign a Key Vault access policy.](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
> 

```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KeyVaultForLinux",
      "apiVersion": "2022-11-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForLinux",
      "typeHandlerVersion": "2.0",
      "autoUpgradeMinorVersion": true,
      "enableAutomaticUpgrade": true,
      "settings": {
          "secretsManagementSettings": {
          "pollingIntervalInS": <polling interval in seconds, e.g. "3600">,
          "certificateStoreName": <ingnored on linux>,
          "certificateStoreLocation": <disk path where certificate is stored, default: "/var/lib/waagent/Microsoft.Azure.KeyVault">,
          "observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: "https://myvault.vault.azure.net/secrets/mycertificate"
        }      
      }
      }
    }
```

### Extension Dependency Ordering
The Key Vault VM extension supports extension ordering if configured. By default the extension reports that it has successfully started as soon as it has started polling. However, it can be configured to wait until it has successfully downloaded the complete list of certificates before reporting a successful start. If other extensions depend on having the full set of certificates installed before they start, then enabling this setting will allow those extensions to declare a dependency on the Key Vault extension. This will prevent those extensions from starting until all certificates they depend on have been installed. The extension will retry the initial download indefinitely and remain in a `Transitioning` state.

To turn on extension dependency, set the following:
```
"secretsManagementSettings": {
    "requireInitialSync": true,
    ...
}
```
> [Note] Using this feature is not compatible with an ARM template that creates a system assigned identity and updates a Key Vault access policy with that identity. Doing so will result in a deadlock as the vault access policy cannot be updated until all extensions have started. You should instead use a *single user assigned MSI identity* and pre-ACL your vaults with that identity before deploying.

## Azure PowerShell deployment
> [!WARNING]
> PowerShell clients often add `\` to `"` in the settings.json which will cause akvvm_service fails with error: `[CertificateManagementConfiguration] Failed to parse the configuration settings with:not an object.`

The Azure PowerShell can be used to deploy the Key Vault VM extension to an existing virtual machine or virtual machine scale set. 

* To deploy the extension on a VM:
    
    ```powershell
        # Build settings
        $settings = '{"secretsManagementSettings": 
        { "pollingIntervalInS": "' + <pollingInterval> + 
        '", "certificateStoreName": "' + <certStoreName> + 
        '", "certificateStoreLocation": "' + <certStoreLoc> + 
        '", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] } }'
        $extName =  "KeyVaultForLinux"
        $extPublisher = "Microsoft.Azure.KeyVault"
        $extType = "KeyVaultForLinux"
       
    
        # Start the deployment
        Set-AzVmExtension -TypeHandlerVersion "2.0" -EnableAutomaticUpgrade true -ResourceGroupName <ResourceGroupName> -Location <Location> -VMName <VMName> -Name $extName -Publisher $extPublisher -Type $extType -SettingString $settings
    
    ```

* To deploy the extension on a virtual machine scale set :

    ```powershell
    
        # Build settings
        $settings = '{"secretsManagementSettings": 
        { "pollingIntervalInS": "' + <pollingInterval> + 
        '", "certificateStoreName": "' + <certStoreName> + 
        '", "certificateStoreLocation": "' + <certStoreLoc> + 
        '", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] } }'
        $extName = "KeyVaultForLinux"
        $extPublisher = "Microsoft.Azure.KeyVault"
        $extType = "KeyVaultForLinux"
        
        # Add Extension to VMSS
        $vmss = Get-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName>
        Add-AzVmssExtension -VirtualMachineScaleSet $vmss  -Name $extName -Publisher $extPublisher -Type $extType -TypeHandlerVersion "2.0" -EnableAutomaticUpgrade true -Setting $settings

        # Start the deployment
        Update-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName> -VirtualMachineScaleSet $vmss 
    ```

## Azure CLI deployment

The Azure CLI can be used to deploy the Key Vault VM extension to an existing virtual machine or virtual machine scale set. 
 
* To deploy the extension on a VM:
    
    ```azurecli
       # Start the deployment
         az vm extension set -n "KeyVaultForLinux" `
         --publisher Microsoft.Azure.KeyVault `
         -g "<resourcegroup>" `
         --vm-name "<vmName>" `
         --version 2.0 `
         --enable-auto-upgrade true `
         --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\", \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }}'
    ```

* To deploy the extension on a virtual machine scale set :

   ```azurecli
        # Start the deployment
        az vmss extension set -n "KeyVaultForLinux" `
        --publisher Microsoft.Azure.KeyVault `
        -g "<resourcegroup>" `
        --vmss-name "<vmssName>" `
        --version 2.0 `
        --enable-auto-upgrade true `
        --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\", \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }}'
    ```
Please be aware of the following restrictions/requirements:
- Key Vault restrictions:
  - It must exist at the time of the deployment 
  - The Key Vault Access Policy must be set for VM/VMSS Identity using a Managed Identity. See [How to Authenticate to Key Vault](../../key-vault/general/authentication.md) and [Assign a Key Vault access policy](../../key-vault/general/assign-access-policy-cli.md).


## Troubleshoot and Support

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell.

**Azure PowerShell**
```powershell
Get-AzVMExtension -VMName <vmName> -ResourceGroupname <resource group name>
```

**Azure CLI**
```azurecli
 az vm get-instance-view --resource-group <resource group name> --name  <vmName> --query "instanceView.extensions"
```

[!INCLUDE [azure-cli-troubleshooting.md](../../../includes/azure-cli-troubleshooting.md)]

### Logs and configuration

The Key Vault VM extension logs only exist locally on the VM and are most informative when it comes to troubleshooting.

|Location|Description|
|--|--|
| /var/log/waagent.log	| Shows when an update to the extension occurred. |
| /var/log/azure/Microsoft.Azure.KeyVault.KeyVaultForLinux/*	| Examine the Key Vault VM Extension service logs to determine the status of the akvvm_service service and certificate download. The download location of PEM files are also found in these files with an entry called certificate file name. If certificateStoreLocation is not specified, it will default to /var/lib/waagent/Microsoft.Azure.KeyVault.Store/ |
| /var/lib/waagent/Microsoft.Azure.KeyVault.KeyVaultForLinux-\<most recent version\>/config/*	| The configuration and binaries for Key Vault VM Extension service. |
|||

### Using Symlink

Symbolic links or Symlinks are advanced shortcuts. To avoid monitoring the folder and to get the latest certificate automatically, you can use this symlink `([VaultName].[CertificateName])` to get the latest version of certificate on Linux.

### Frequently Asked Questions

* Is there is a limit on the number of observedCertificates you can setup?
  No, Key Vault VM Extension doesn’t have limit on the number of observedCertificates.
  

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
