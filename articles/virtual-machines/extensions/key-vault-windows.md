---
title: Azure Key Vault VM extension for Windows 
description: Learn how to deploy an agent for automatic refresh of Azure Key Vault secrets on virtual machines with a virtual machine extension.
services: virtual-machines
author: msmbaldwin
tags: keyvault
ms.service: virtual-machines
ms.subservice: extensions
ms.collection: windows
ms.topic: article
ms.date: 04/11/2023
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Azure Key Vault virtual machine extension for Windows

The Azure Key Vault virtual machine (VM) extension provides automatic refresh of certificates stored in an Azure key vault. The extension monitors a list of observed certificates stored in key vaults. When it detects a change, the extension retrieves and installs the corresponding certificates. This article describes the supported platforms, configurations, and deployment options for the Key Vault VM extension for Windows. 

## Operating systems

The Key Vault VM extension supports the following versions of Windows:

- Windows Server 2022
- Windows Server 2019
- Windows Server 2016
- Windows Server 2012

The Key Vault VM extension is also supported on a custom local VM. The VM should be uploaded and converted into a specialized image for use in Azure by using Windows Server 2019 core install.

### Supported certificates

The Key Vault VM extension supports the following certificate content types:

- PKCS #12
- PEM

> [!NOTE]
> The Key Vault VM extension downloads all certificates to the Windows certificate store or to the location specified in the `certificateStoreLocation` property in the VM extension settings. 

## Updates in Version 3.0+

Version 3.0 of the Key Vault VM extension for Windows adds support for the following features:

- Add ACL permissions to downloaded certificates
- Enable Certificate Store configuration per certificate
- Export private keys
- IIS Certificate Rebind support

## Prerequisites

Review the following prerequisites for using the Key Vault VM extension for Windows:

- An Azure Key Vault instance with a certificate. For more information, see [Create a key vault by using the Azure portal](/azure/key-vault/general/quick-create-portal).

- A VM with an assigned [managed identity](/azure/active-directory/managed-identities-azure-resources/overview).

- The **Key Vault Secrets User** role must be assigned at the Key Vault scope level for VMs and Azure Virtual Machine Scale Sets managed identity. This role retrieves a secret's portion of a certificate. For more information, see the following articles:
   - [Authentication in Azure Key Vault](/azure/key-vault/general/authentication)
   - [Use Azure RBAC secret, key, and certificate permissions with Azure Key Vault](/azure/key-vault/general/rbac-guide#using-azure-rbac-secret-key-and-certificate-permissions-with-key-vault)
   - [Key Vault scope role assignment](/azure/key-vault/general/rbac-guide?tabs=azure-cli#key-vault-scope-role-assignment)

-  Virtual Machine Scale Sets should have the following `identity` configuration:

   ```json
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "[parameters('userAssignedIdentityResourceId')]": {}
      }
   }
   ```
  
- The Key Vault VM extension should have the following `authenticationSettings` configuration:

   ```json
   "authenticationSettings": {
      "msiEndpoint": "[parameters('userAssignedIdentityEndpoint')]",
      "msiClientId": "[reference(parameters('userAssignedIdentityResourceId'), variables('msiApiVersion')).clientId]"
   }
   ```

> [!NOTE]
> The old access policy permission model can also be used to provide access to VMs and Virtual Machine Scale Sets. This method requires policy with **get** and **list** permissions on secrets. For more information, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy).


## Extension schema

The following JSON shows the schema for the Key Vault VM extension. Before you consider the schema implementation options, review the following important notes.

- The extension doesn't require protected settings. All settings are considered public information. 

- Observed certificates URLs should be of the form `https://myVaultName.vault.azure.net/secrets/myCertName`.

   This form is preferred because the `/secrets` path returns the full certificate, including the private key, but the `/certificates` path doesn't. For more information about certificates, see [Azure Key Vault keys, secrets and certificates overview](/azure/key-vault/general/about-keys-secrets-certificates).

- The `authenticationSettings` property is **required** for VMs with any **user assigned identities**.

   This property specifies the identity to use for authentication to Key Vault. Define this property with a system-assigned identity to avoid issues with a VM extension with multiple identities. 

### [Version-3.0](#tab/version3)  

```json
{
   "type": "Microsoft.Compute/virtualMachines/extensions",
   "name": "KVVMExtensionForWindows",
   "apiVersion": "2022-08-01",
   "location": "<location>",
   "dependsOn": [
      "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
   ],
   "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForWindows",
      "typeHandlerVersion": "3.0",
      "autoUpgradeMinorVersion": true,
      "settings": {
         "secretsManagementSettings": {
             "pollingIntervalInS": <A string that specifies the polling interval in seconds. Example: 3600>,
             "linkOnRenewal": <Windows only. Ensures s-channel binding when the certificate renews without necessitating redeployment. Example: true>,
             "requireInitialSync": <Initial synchronization of certificates. Example: true>,
             "observedCertificates": <An array of KeyVault URIs that represent monitored certificates, including certificate store location and ACL permission to certificate private key. Example: 
             [
                {
                    "url": <A Key Vault URI to the secret portion of the certificate. Example: "https://myvault.vault.azure.net/secrets/mycertificate1">,
                    "certificateStoreName": <The certificate store name. Example: "MY">,
                    "certificateStoreLocation": <The certificate store location, which currently works locally only. Example: "LocalMachine">,
                    "accounts": <Optional. An array of preferred accounts with read access to certificate private keys. Administrators and SYSTEM get Full Control by default. Example: ["Network Service", "Local Service"]>
                },
                {
                    "url": <Example: "https://myvault.vault.azure.net/secrets/mycertificate2">,
                    "certificateStoreName": <Example: "MY">,
                    "certificateStoreLocation": <Example: "CurrentUser">,
                    "keyExportable": <Optional. Lets the private key be exportable. Example: "false">,
                    "accounts": <Example: ["Local Service"]>
                }
             ]>
         },
         "authenticationSettings": {
             "msiEndpoint":  <Required when the msiClientId property is used. Specifies the MSI endpoint. Example for most Azure VMs: "http://169.254.169.254/metadata/identity/oauth2/token">,
             "msiClientId":  <Required when the VM has any user assigned identities. Specifies the MSI identity. Example:  "c7373ae5-91c2-4165-8ab6-7381d6e75619">
         }
      }
   }
}
```

### [Version-1.0](#tab/version1)  

```json
{
   "type": "Microsoft.Compute/virtualMachines/extensions",
   "name": "KVVMExtensionForWindows",
   "apiVersion": "2022-08-01",
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
            "pollingIntervalInS": <A string that specifies the polling interval in seconds. Example: "3600">,
            "certificateStoreName": <The certificate store name. Example: "MY">,
            "linkOnRenewal": <Windows only. Ensures s-channel binding when the certificate renews without necessitating redeployment. Example: true>,
            "certificateStoreLocation": <The certificate store location, which currently works locally only. Example: "LocalMachine">,
            "requireInitialSync": <Require an initial synchronization of the certificates. Example: true>,
            "observedCertificates": <A string array of KeyVault URIs that represent the monitored certificates. Example: "[https://myvault.vault.azure.net/secrets/mycertificate"]>
         },
         "authenticationSettings": {
            "msiEndpoint":  <Required when the msiClientId property is used. Specifies the MSI endpoint. Example for most Azure VMs: "http://169.254.169.254/metadata/identity/oauth2/token">,
            "msiClientId":  <Required when the VM has any user assigned identities. Specifies the MSI identity. Example: "c7373ae5-91c2-4165-8ab6-7381d6e75619">
         }
      }
   }
}
```

---

## Property values

The JSON schema includes the following properties.

### [Version-3.0](#tab/version3)  

| Name | Value/Example | Data type |
| --- | --- | --- |
| `apiVersion` | 2022-08-01 | date |
| `publisher` | Microsoft.Azure.KeyVault | string |
| `type` | KeyVaultForWindows | string |
| `typeHandlerVersion` | 3.0 | int |
| `pollingIntervalInS` | 3600 | string |
| `linkOnRenewal` (optional) | true | boolean |
| `requireInitialSync` (optional) | false | boolean |
| `observedCertificates`  | [{...}, {...}] | string array |
| `observedCertificates/url` | "https://myvault.vault.azure.net/secrets/mycertificate" | string |
| `observedCertificates/certificateStoreName` | MY | string |
| `observedCertificates/certificateStoreLocation`  | LocalMachine or CurrentUser (case sensitive) | string |
| `observedCertificates/keyExportable` (optional) | false | boolean |
| `observedCertificates/accounts` (optional) | ["Network Service", "Local Service"] | string array |
| `msiEndpoint` | "http://169.254.169.254/metadata/identity/oauth2/token" | string |
| `msiClientId` | c7373ae5-91c2-4165-8ab6-7381d6e75619 | string |

### [Version-1.0](#tab/version1)

| Name | Value/Example | Data type |
| --- | --- | --- |
| `apiVersion` | 2022-08-01 | date |
| `publisher` | Microsoft.Azure.KeyVault | string |
| `type` | KeyVaultForWindows | string |
| `typeHandlerVersion` | 1.0 | int |
| `pollingIntervalInS` | 3600 | string |
| `certificateStoreName` | MY | string |
| `linkOnRenewal` | true | boolean |
| `certificateStoreLocation`  | LocalMachine or CurrentUser (case sensitive) | string |
| `requireInitialSync` | false | boolean |
| `observedCertificates`  | ["https://myvault.vault.azure.net/secrets/mycertificate", <br> "https://myvault.vault.azure.net/secrets/mycertificate2"] | string array
| `msiEndpoint` | "http://169.254.169.254/metadata/identity/oauth2/token" | string |
| `msiClientId` | c7373ae5-91c2-4165-8ab6-7381d6e75619 | string |

---

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager (ARM) templates. Templates are ideal when deploying one or more virtual machines that require post deployment refresh of certificates. The extension can be deployed to individual VMs or Virtual Machine Scale Sets instances. The schema and configuration are common to both template types. 

The JSON configuration for a key vault extension is nested inside the VM or Virtual Machine Scale Sets template. For a VM resource extension, the configuration is nested under the `"resources": []` virtual machine object. For a Virtual Machine Scale Sets instance extension, the configuration is nested under the `"virtualMachineProfile":"extensionProfile":{"extensions" :[]` object.

The following JSON snippets provide example settings for an ARM template deployment of the Key Vault VM extension.

### [Version-3.0](#tab/version3)  

```json
{
   "type": "Microsoft.Compute/virtualMachines/extensions",
   "name": "KeyVaultForWindows",
   "apiVersion": "2022-08-01",
   "location": "<location>",
   "dependsOn": [
      "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
   ],
   "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForWindows",
      "typeHandlerVersion": "3.0",
      "autoUpgradeMinorVersion": true,
      "settings": {
         "secretsManagementSettings": {
             "pollingIntervalInS": <A string that specifies the polling interval in seconds. Example: 3600>,
             "linkOnRenewal": <Windows only. Ensures s-channel binding when the certificate renews without necessitating redeployment. Example: true>,
             "observedCertificates": <An array of KeyVault URIs that represent monitored certificates, including certificate store location and ACL permission to certificate private key. Example:
             [
                {
                    "url": <A Key Vault URI to the secret portion of the certificate. Example: "https://myvault.vault.azure.net/secrets/mycertificate1">,
                    "certificateStoreName": <The certificate store name. Example: "MY">,
                    "certificateStoreLocation": <The certificate store location, which currently works locally only. Example: "LocalMachine">,
                    "accounts": <Optional. An array of preferred accounts with read access to certificate private keys. Administrators and SYSTEM get Full Control by default. Example: ["Network Service", "Local Service"]>
                },
                {
                    "url": <Example: "https://myvault.vault.azure.net/secrets/mycertificate2">,
                    "certificateStoreName": <Example: "MY">,
                    "certificateStoreLocation": <Example: "CurrentUser">,
                    "keyExportable": <Optional. Lets the private key be exportable. Example: "false">,
                    "accounts": <Example: ["Local Service"]>
                },
                {
                    "url": <Example: "https://myvault.vault.azure.net/secrets/mycertificate3">,
                    "certificateStoreName": <Example: "TrustedPeople">,
                    "certificateStoreLocation": <Example: "LocalMachine">
                }
             ]>           
         },
         "authenticationSettings": {
            "msiEndpoint":  <Required when the msiClientId property is used. Specifies the MSI endpoint. Example for most Azure VMs: "http://169.254.169.254/metadata/identity/oauth2/token">,
            "msiClientId":  <Required when the VM has any user assigned identities. Specifies the MSI identity. Example: "c7373ae5-91c2-4165-8ab6-7381d6e75619">
         }
      }
   }
}
```

### [Version-1.0](#tab/version1)  

```json
{
   "type": "Microsoft.Compute/virtualMachines/extensions",
   "name": "KeyVaultForWindows",
   "apiVersion": "2022-08-01",
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
            "pollingIntervalInS": <A string that specifies the polling interval in seconds. Example: 3600>,
            "linkOnRenewal": <Windows only. Ensures s-channel binding when the certificate renews without necessitating redeployment. Example: true>,          
            "certificateStoreName": <The certificate store name. Example: "MY">,
            "certificateStoreLocation": <The certificate store location, which currently works locally only. Example: "LocalMachine">,
            "observedCertificates": <A string array of KeyVault URIs that represent monitored certificates. Example: ["https://myvault.vault.azure.net/secrets/mycertificate", "https://myvault.vault.azure.net/secrets/mycertificate2"]>
         },
         "authenticationSettings": {
            "msiEndpoint":  <Required when the msiClientId property is used. Specifies the MSI endpoint. Example for most Azure VMs: "http://169.254.169.254/metadata/identity/oauth2/token">,
            "msiClientId":  <Required when the VM has any user assigned identities. Specifies the MSI identity. Example:  "c7373ae5-91c2-4165-8ab6-7381d6e75619">  
         }
      }
   }
}
```

---

### Extension dependency ordering

You can enable the Key Vault VM extension to support extension dependency ordering. By default, the Key Vault VM extension reports a successful start as soon as polling begins. However, you can configure the extension to report a successful start only after the extension downloads and installs all certificates.

If you use other extensions that require installation of all certificates before they start, you can enable extension dependency ordering in the Key Vault VM extension. This feature allows other extensions to declare a dependency on the Key Vault VM extension.

You can use this feature to prevent other extensions from starting until all dependent certificates are installed. When the feature is enabled, the Key Vault VM extension retries download and install of certificates indefinitely and remains in a **Transitioning** state, until all certificates are successfully installed. After all certificates are present, the Key Vault VM extension reports a successful start.

To enable the extension dependency ordering feature in the Key Vault VM extension, set the `secretsManagementSettings` property:

```json
"secretsManagementSettings": {
   "requireInitialSync": true,
   ...
}
```

For more information on how to set up dependencies between extensions, see [Sequence extension provisioning in Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing).

> [!IMPORTANT] 
> The extension dependency ordering feature isn't compatible with an ARM template that creates a system-assigned identity and updates a Key Vault access policy with that identity. If you attempt to use the feature in this scenario, a deadlock occurs because the Key Vault access policy can't update until after all extensions start. Instead, use a _single-user-assigned MSI identity_ and pre-ACL your key vaults with that identity before you deploy.

## Azure PowerShell deployment

The Azure Key Vault VM extension can be deployed with Azure PowerShell. Save Key Vault VM extension settings to a JSON file (settings.json). 

The following JSON snippets provide example settings for deploying the Key Vault VM extension with PowerShell.

### [Version-3.0](#tab/version3) 

```json
{   
   "secretsManagementSettings": {
   "pollingIntervalInS": "3600",
   "linkOnRenewal": true,
   "observedCertificates":
   [
      {
          "url": "https://<examplekv>.vault.azure.net/secrets/certificate1",
          "certificateStoreName": "MY",
          "certificateStoreLocation": "LocalMachine",
          "accounts": [
             "Network Service"
          ]
      },
      {
          "url": "https://<examplekv>.vault.azure.net/secrets/certificate2",
          "certificateStoreName": "MY",
          "certificateStoreLocation": "LocalMachine",
          "keyExportable": true,
          "accounts": [
             "Network Service",
             "Local Service"
          ]
      }
   ]},
   "authenticationSettings": {
      "msiEndpoint":  "http://169.254.169.254/metadata/identity/oauth2/token",
      "msiClientId":  "c7373ae5-91c2-4165-8ab6-7381d6e75619"
   }      
}
```

#### Deploy on a VM
    
```powershell
# Build settings
$settings = (get-content -raw ".\settings.json")
$extName =  "KeyVaultForWindows"
$extPublisher = "Microsoft.Azure.KeyVault"
$extType = "KeyVaultForWindows"
 
# Start the deployment
Set-AzVmExtension -TypeHandlerVersion "3.0" -ResourceGroupName <ResourceGroupName> -Location <Location> -VMName <VMName> -Name $extName -Publisher $extPublisher -Type $extType -SettingString $settings
```

#### Deploy on a Virtual Machine Scale Sets instance

```powershell
# Build settings
$settings = ".\settings.json"
$extName = "KeyVaultForWindows"
$extPublisher = "Microsoft.Azure.KeyVault"
$extType = "KeyVaultForWindows"
  
# Add extension to Virtual Machine Scale Sets
$vmss = Get-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName>
Add-AzVmssExtension -VirtualMachineScaleSet $vmss  -Name $extName -Publisher $extPublisher -Type $extType -TypeHandlerVersion "3.0" -Setting $settings

# Start the deployment
Update-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName> -VirtualMachineScaleSet $vmss 
```

### [Version-1.0](#tab/version1)  

Use PowerShell to deploy the version 1.0 Key Vault VM extension to an existing VM or Virtual Machine Scale Sets instance. 

> [!WARNING]
> PowerShell clients often prefix a quote mark `"` with a backslash `\` in the settings JSON file. The extraneous characters cause the akvvm_service to fail with the error, "[CertificateManagementConfiguration] Failed to parse the configuration settings with:not an object."
>
> You can see the supplied backslash `\` and quote `"` characters in the Azure portal under **Settings** > **Extensions + Applications**. To avoid the error, initialize the `$settings` property as a PowerShell `Hashtable`. Avoid using extra quote mark `"` characters, and ensure the variable types match. For more information, see [Everything you wanted to know about hashtables](/powershell/scripting/learn/deep-dives/everything-about-hashtable). 
>

#### Deploy on a VM

```powershell
# Build settings
$settings = '{"secretsManagementSettings": 
{ "pollingIntervalInS": "' + <pollingInterval> + 
'", "certificateStoreName": "' + <certStoreName> + 
'", "certificateStoreLocation": "' + <certStoreLoc> + 
'", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] }, 
"authenticationSettings":
{ "msiEndpoint": "' + <msiEndpoint> +
'", "msiClientId" :"' + <msiClientId> + '"}}' 
$extName =  "KeyVaultForWindows"
$extPublisher = "Microsoft.Azure.KeyVault"
$extType = "KeyVaultForWindows"
 
# Start the deployment
Set-AzVmExtension -TypeHandlerVersion "1.0" -ResourceGroupName <ResourceGroupName> -Location <Location> -VMName <VMName> -Name $extName -Publisher $extPublisher -Type $extType  -SettingString $settings
```

#### Deploy on a Virtual Machine Scale Sets instance

```powershell
# Build settings
$settings = '{"secretsManagementSettings": 
{ "pollingIntervalInS": "' + <pollingInterval> + 
'", "certificateStoreName": "' + <certStoreName> + 
'", "certificateStoreLocation": "' + <certStoreLoc> + 
'", "observedCertificates": ["' + <observedCert1> + '","' + <observedCert2> + '"] } }, 
"authenticationSettings":
{ "msiEndpoint": "' + <msiEndpoint> +
'", "msiClientId" :"' + <msiClientId> + '"}}' 
$extName = "KeyVaultForWindows"
$extPublisher = "Microsoft.Azure.KeyVault"
$extType = "KeyVaultForWindows"
  
# Add extension to Virtual Machine Scale Sets
$vmss = Get-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName>
Add-AzVmssExtension -VirtualMachineScaleSet $vmss  -Name $extName -Publisher $extPublisher -Type $extType -TypeHandlerVersion "1.0" -Setting $settings

# Start the deployment
Update-AzVmss -ResourceGroupName <ResourceGroupName> -VMScaleSetName <VmssName> -VirtualMachineScaleSet $vmss 
```

--- 

## Azure CLI deployment

The Azure Key Vault VM extension can be deployed by using the Azure CLI. Save Key Vault VM extension settings to a JSON file (settings.json). 

The following JSON snippets provide example settings for deploying the Key Vault VM extension with the Azure CLI.

### [Version-3.0](#tab/version3) 

```json
   {   
        "secretsManagementSettings": {
          "pollingIntervalInS": "3600",
          "linkOnRenewal": true,
          "observedCertificates": [
            {
                "url": "https://<examplekv>.vault.azure.net/secrets/certificate1",
                "certificateStoreName": "MY",
                "certificateStoreLocation": "LocalMachine",
                "accounts": [
                    "Network Service"
                ]
            },
            {
                "url": "https://<examplekv>.vault.azure.net/secrets/certificate2",
                "certificateStoreName": "MY",
                "certificateStoreLocation": "LocalMachine",                
                "keyExportable": true,
                "accounts": [
                    "Network Service",
                    "Local Service"
                ]
            }
        ]
        },
          "authenticationSettings": {
          "msiEndpoint":  "http://169.254.169.254/metadata/identity/oauth2/token",
          "msiClientId":  "c7373ae5-91c2-4165-8ab6-7381d6e75619"
        }      
     }
```
 
#### Deploy on a VM
    
```azurecli
# Start the deployment
az vm extension set --name "KeyVaultForWindows" `
 --publisher Microsoft.Azure.KeyVault `
 --resource-group "<resourcegroup>" `
 --vm-name "<vmName>" `
 --settings "@settings.json"
```

#### Deploy on a Virtual Machine Scale Sets instance

```
# Start the deployment
az vmss extension set --name "KeyVaultForWindows" `
 --publisher Microsoft.Azure.KeyVault `
 --resource-group "<resourcegroup>" `
 --vmss-name "<vmssName>" `
 --settings "@settings.json"
```
  
### [Version-1.0](#tab/version1) 

Use the Azure CLI to deploy the version 1.0 Key Vault VM extension to an existing VM or Virtual Machine Scale Sets instance.

#### Deploy on a VM
    
```azurecli
# Start the deployment
az vm extension set --name "KeyVaultForWindows" `
   --publisher Microsoft.Azure.KeyVault `
   --resource-group "<resourcegroup>" `
   --vm-name "<vmName>" `
   --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\",    \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }, \"authenticationSettings\": { \"msiEndpoint\": \"<msiEndpoint>\", \"msiClientId\": \"<msiClientId>\"}}'
```

#### Deploy on a Virtual Machine Scale Sets instance

```azurecli
# Start the deployment
az vmss extension set --name "KeyVaultForWindows" `
 --publisher Microsoft.Azure.KeyVault `
 --resource-group "<resourcegroup>" `
 --vmss-name "<vmName>" `
 --settings '{\"secretsManagementSettings\": { \"pollingIntervalInS\": \"<pollingInterval>\", \"certificateStoreName\": \"<certStoreName>\", \"certificateStoreLocation\": \"<certStoreLoc>\", \"observedCertificates\": [\" <observedCert1> \", \" <observedCert2> \"] }, \"authenticationSettings\": { \"msiEndpoint\": \"<msiEndpoint>\", \"msiClientId\": \"<msiClientId>\"}}'
```

---

## <a name="troubleshoot-and-support"></a> Troubleshoot issues

Here are some suggestions for how to troubleshoot deployment issues.

### Check frequently asked questions

#### Is there a limit on the number of observed certificates?

No. The Key Vault VM extension doesn't limit the number of observed certificates (`observedCertificates`).

#### What's the default permission when no account is specified?

By default, Administrators and SYSTEM receive Full Control.

#### How do you determine if a certificate key is CAPI1 or CNG?

The extension relies on the default behavior of the [PFXImportCertStore API](/windows/win32/api/wincrypt/nf-wincrypt-pfximportcertstore). By default, if a certificate has a Provider Name attribute that matches with CAPI1, then the certificate is imported by using CAPI1 APIs. Otherwise, the certificate is imported by using CNG APIs.

#### Does the extension support certificate auto-rebinding?

Yes, the Azure Key Vault VM extension supports certificate auto-rebinding. The Key Vault VM extension does support S-channel binding on certificate renewal when the `linkOnRenewal` property is set to true.

For IIS, you can configure auto-rebind by enabling automatic rebinding of certificate renewals in IIS. The Azure Key Vault VM extension generates Certificate Lifecycle Notifications when a certificate with a matching SAN is installed. IIS uses this event to auto-rebind the certificate. For more information, see [Certifcate Rebind in IIS](https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html)

### View extension status

Check the status of your extension deployment in the Azure portal, or by using PowerShell or the Azure CLI.

To see the deployment state of extensions for a given VM, run the following commands.

- Azure PowerShell:

   ```powershell
   Get-AzVMExtension -ResourceGroupName <myResourceGroup> -VMName <myVM> -Name <myExtensionName>
   ```

- The Azure CLI:

   ```azurecli
   az vm get-instance-view --resource-group <myResourceGroup> --name <myVM> --query "instanceView.extensions"
   ```

### Review logs and configuration

The Key Vault VM extension logs exist only locally on the VM. Review the log details to help with troubleshooting.

| Log file | Description |
| --- | --- |
| C:\WindowsAzure\Logs\WaAppAgent.log` | Shows when updates occur to the extension. |
| C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows\<_most recent version_>\ | Shows the status of certificate download. The download location is always the Windows computer's MY store (certlm.msc). |
| C:\Packages\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows\<_most recent version_>\RuntimeSettings\ |	The Key Vault VM Extension service logs show the status of the akvvm_service service. |
| C:\Packages\Plugins\Microsoft.Azure.KeyVault.KeyVaultForWindows\<_most recent version_>\Status\	| The configuration and binaries for the Key Vault VM Extension service. |

### Get support

Here are some other options to help you resolve deployment issues:

- For assistance, contact the Azure experts on the [Q&A and Stack Overflow forums](https://azure.microsoft.com/support/community/). 

- If you don't find an answer on the site, you can post a question for input from Microsoft or other members of the community.

- You can also [Contact Microsoft Support](https://support.microsoft.com/contactus/). For information about using Azure support, read the [Azure support FAQ](https://azure.microsoft.com/support/legal/faq/).
