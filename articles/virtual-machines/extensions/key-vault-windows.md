---
title: Azure Key Vault VM Extension for Windows 
description: Deploy an agent performing automatic refresh of Key Vault secrets on virtual machines using a virtual machine extension.
services: virtual-machines
author: msmbaldwin
tags: keyvault
ms.service: virtual-machines
ms.subservice: extensions
ms.collection: windows
ms.topic: article
ms.date: 12/02/2019
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell

---
# Key Vault virtual machine extension for Windows

The Key Vault VM extension provides automatic refresh of certificates stored in an Azure key vault. Specifically, the extension monitors a list of observed certificates stored in key vaults, and, upon detecting a change, retrieves, and installs the corresponding certificates. This document details the supported platforms, configurations, and deployment options for the Key Vault VM extension for Windows. 

### Operating system

The Key Vault VM extension supports below versions of Windows:

- Windows Server 2019
- Windows Server 2016
- Windows Server 2012

The Key Vault VM extension is also supported on custom local VM that is uploaded and converted into a specialized image for use in Azure using Windows Server 2019 core install.

### Supported certificate content types

- PKCS #12
- PEM

## Prerequisites

  - Key Vault instance with certificate. See [Create a Key Vault](../../key-vault/general/quick-create-portal.md)
  - VM must have assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md)
  - The Key Vault Access Policy must be set with secrets `get` and `list` permission for VM/VMSS managed identity to retrieve a secret's portion of certificate. See [How to Authenticate to Key Vault](../../key-vault/general/authentication.md) and [Assign a Key Vault access policy](../../key-vault/general/assign-access-policy-cli.md).
  -  Virtual Machine Scale Sets should have the following identity setting:

  ``` 
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "[parameters('userAssignedIdentityResourceId')]": {}
    }
  }
  ```
  
  - AKV extension should have this setting:

  ```
  "authenticationSettings": {
    "msiEndpoint": "[parameters('userAssignedIdentityEndpoint')]",
    "msiClientId": "[reference(parameters('userAssignedIdentityResourceId'), variables('msiApiVersion')).clientId]"
  }
  ```

## Extension schema

The following JSON shows the schema for the Key Vault VM extension. The extension does not require protected settings - all its settings are considered public information. The extension requires a list of monitored certificates, polling frequency, and the destination certificate store. Specifically:  

```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KVVMExtensionForWindows",
      "apiVersion": "2019-07-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForWindows",
      "typeHandlerVersion": "1.0",
      "autoUpgradeMinorVersion": true,
      "settings": {
        "secretsManagementSettings": {
          "pollingIntervalInS": <string specifying polling interval in seconds, e.g: "3600">,
          "certificateStoreName": <certificate store name, e.g.: "MY">,
          "linkOnRenewal": <Only Windows. This feature ensures s-channel binding when certificate renews, without necessitating a re-deployment.  e.g.: false>,
          "certificateStoreLocation": <certificate store location, currently it works locally only e.g.: "LocalMachine">,
          "requireInitialSync": <initial synchronization of certificates e..g: true>,
          "observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: "https://myvault.vault.azure.net/secrets/mycertificate"
        },
        "authenticationSettings": {
                "msiEndpoint":  <Optional MSI endpoint e.g.: "http://169.254.169.254/metadata/identity">,
                "msiClientId":  <Optional MSI identity e.g.: "c7373ae5-91c2-4165-8ab6-7381d6e75619">
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
> The 'authenticationSettings' property is **required** only for VMs with **user assigned identities**.
> It specifies identity to use for authentication to Key Vault.


### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2019-07-01 | date |
| publisher | Microsoft.Azure.KeyVault | string |
| type | KeyVaultForWindows | string |
| typeHandlerVersion | 1.0 | int |
| pollingIntervalInS | 3600 | string |
| certificateStoreName | MY | string |
| linkOnRenewal | false | boolean |
| certificateStoreLocation  | LocalMachine or CurrentUser (case sensitive) | string |
| requireInitialSync | true | boolean |
| observedCertificates  | ["https://myvault.vault.azure.net/secrets/mycertificate", "https://myvault.vault.azure.net/secrets/mycertificate2"] | string array
| msiEndpoint | http://169.254.169.254/metadata/identity | string |
| msiClientId | c7373ae5-91c2-4165-8ab6-7381d6e75619 | string |


## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment refresh of certificates. The extension can be deployed to individual VMs or virtual machine scale sets. The schema and configuration are common to both template types. 

The JSON configuration for a virtual machine extension must be nested inside the virtual machine resource fragment of the template, specifically `"resources": []` object for the virtual machine template and in case of virtual machine scale set under `"virtualMachineProfile":"extensionProfile":{"extensions" :[]` object.

 > [!NOTE]
> The VM extension would require system or user managed identity to be assigned to authenticate to Key vault.  See [How to authenticate to Key Vault and assign a Key Vault access policy.](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
> 

```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KeyVaultForWindows",
      "apiVersion": "2019-07-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForWindows",
      "typeHandlerVersion": "1.0",
      "autoUpgradeMinorVersion": true,
      "settings": {
        "secretsManagementSettings": {
          "pollingIntervalInS": <string specifying polling interval in seconds, e.g: "3600">,
          "certificateStoreName": <certificate store name, e.g.: "MY">,
          "certificateStoreLocation": <certificate store location, currently it works locally only e.g.: "LocalMachine">,
          "observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: ["https://myvault.vault.azure.net/secrets/mycertificate", "https://myvault.vault.azure.net/secrets/mycertificate2"]>
        }      
      }
      }
    }
```

### Extension Dependency Ordering
The Key Vault VM extension supports extension ordering if configured. By default the extension reports that it has successfully started as soon as it has started polling. However, it can be configured to wait until it has successfully downloaded the complete list of certificates before reporting a successful start. If other extensions depend on having the full set of certificates install before they start, then enabling this setting will allow those extension to declare a dependency on the Key Vault extension. This will prevent those extensions from starting until all certificates they depend on have been installed. The extension will retry the initial download indefinitely and remain in a `Transitioning` state.

To turn this on set the following:
```
"secretsManagementSettings": {
    "requireInitialSync": true,
    ...
}
```

> [!Note] 
> Using this feature is not compatible with an ARM template that creates a system assigned identity and updates a Key Vault access policy with that identity. Doing so will result in a deadlock as the vault access policy cannot be updated until all extensions have started. You should instead use a *single user assigned MSI identity* and pre-ACL your vaults with that identity before deploying.

## Azure PowerShell deployment

> [!WARNING]
> PowerShell clients often add `\` to `"` in the settings.json, which causes akvvm_service to fail with the error `[CertificateManagementConfiguration] Failed to parse the configuration settings with:not an object.`
> The extra `\` and `"` characters will be visible in the portal, in **Extensions** under **Settings**. To avoid this, initialize `$settings` as a PowerShell `HashTable`:
> 
> ```powershell
> $settings = @{
>     "secretsManagementSettings" = @{ 
>         "pollingIntervalInS"       = "<pollingInterval>"; 
>         "certificateStoreName"     = "<certStoreName>"; 
>         "certificateStoreLocation" = "<certStoreLoc>"; 
>         "observedCertificates"     = @("<observedCert1>", "<observedCert2>") } }
> ```
>
  
The Azure PowerShell can be used to deploy the Key Vault VM extension to an existing virtual machine or virtual machine scale set. 

* To deploy the extension on a VM:
    
    ```powershell
        # Build settings
        $settings = '{"secretsManagementSettings": 
        { "pollingIntervalInS": "' + <pollingInterval> + 
        '", "certificateStoreName": "' + <certStoreName> + 
        '", "certificateStoreLocation": "' + <certStoreLoc> + 
        '", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] } }'
        $extName =  "KeyVaultForWindows"
        $extPublisher = "Microsoft.Azure.KeyVault"
        $extType = "KeyVaultForWindows"
       
    
        # Start the deployment
        Set-AzVmExtension -TypeHandlerVersion "1.0" -ResourceGroupName <ResourceGroupName> -Location <Location> -VMName <VMName> -Name $extName -Publisher $extPublisher -Type $extType -SettingString $settings
    
    ```

* To deploy the extension on a virtual machine scale set :

    ```powershell
    
        # Build settings
        $settings = '{"secretsManagementSettings": 
        { "pollingIntervalInS": "' + <pollingInterval> + 
        '", "certificateStoreName": "' + <certStoreName> + 
        '", "certificateStoreLocation": "' + <certStoreLoc> + 
        '", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] } }'
        $extName = "KeyVaultForWindows"
        $extPublisher = "Microsoft.Azure.KeyVault"
        $extType = "KeyVaultForWindows"
        
        # Add Extension to VMSS
        $vmss = Get-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName>
        Add-AzVmssExtension -VirtualMachineScaleSet $vmss  -Name $extName -Publisher $extPublisher -Type $extType -TypeHandlerVersion "1.0" -Setting $settings

        # Start the deployment
        Update-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName> -VirtualMachineScaleSet $vmss 
    
    ```

## Azure CLI deployment

The Azure CLI can be used to deploy the Key Vault VM extension to an existing virtual machine or virtual machine scale set. 
 
* To deploy the extension on a VM:
    
    ```azurecli
       # Start the deployment
         az vm extension set --name "KeyVaultForWindows" `
         --publisher Microsoft.Azure.KeyVault `
         --resource-group "<resourcegroup>" `
         --vm-name "<vmName>" `
         --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\", \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }}'
    ```

* To deploy the extension on a virtual machine scale set :

   ```azurecli
        # Start the deployment
        az vmss extension set --name "KeyVaultForWindows" `
         --publisher Microsoft.Azure.KeyVault `
         --resource-group "<resourcegroup>" `
         --vmss-name "<vmName>" `
         --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\", \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }}'
    ```

Please be aware of the following restrictions/requirements:
- Key Vault restrictions:
  - It must exist at the time of the deployment 
  - The Key Vault Access Policy must be set for VM/VMSS Identity using a Managed Identity. See [How to Authenticate to Key Vault](../../key-vault/general/authentication.md) and [Assign a Key Vault access policy](../../key-vault/general/assign-access-policy-cli.md).

## Troubleshoot and support

### Frequently Asked Questions

* Is there is a limit on the number of observedCertificates you can setup?
  No, Key Vault VM Extension doesn’t have limit on the number of observedCertificates.

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell.

**Azure PowerShell**
```powershell
Get-AzVMExtension -VMName <vmName> -ResourceGroupname <resource group name>
```

**Azure CLI**
```azurecli
 az vm get-instance-view --resource-group <resource group name> --name  <vmName> --query "instanceView.extensions"
```

#### Logs and configuration
The Key Vault VM extension logs only exist locally on the VM and are most informative when it comes to troubleshooting

|Location|Description|
|--|--|
| C:\WindowsAzure\Logs\WaAppAgent.log | Shows when an update to the extension occurred. |
| C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows<most recent version>\ | Shows the status of certificate download. The download location will always be the Windows computer's MY store (certlm.msc). |
| C:\Packages\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows<most recent version>\RuntimeSettings\ |	The Key Vault VM Extension service logs show the status of the akvvm_service service. |
| C:\Packages\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows<most recent version>\Status\	| The configuration and binaries for Key Vault VM Extension service. |
|||  


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
