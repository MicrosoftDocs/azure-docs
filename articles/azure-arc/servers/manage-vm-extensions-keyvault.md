---
title: Azure Key Vault VM extension (preview) for Arc enabled servers
description: This article describes how to deploy the Azure Key Vault virtual machine extension to Azure Arc enabled servers running in hybrid cloud environments.
ms.date: 11/06/2020
ms.topic: conceptual
---

# Azure Key Vault VM extension (preview) for Arc enabled servers

To easily deploy the Key Vault virtual machine (VM) extension, Azure Arc enabled servers supports installing on either Windows or Linux using the following methods:

* The Azure CLI
* The Azure PowerShell
* Azure Resource Manager template

## Prerequisites

While Key Vault supports both user and system assigned identities, Azure Arc enabled servers do not support user assigned identities. Arc enabled servers are assigned a system identity.

> [!NOTE]
> The Key Vault VM extension does not support the following Linux operating systems:
>
>   - CentOS Linux 7 (x64)
>   - Red Hat Enterprise Linux (RHEL) 7 (x64)
>   - Amazon Linux 2 (x64)

Before you deploy the extension, you need to complete the following:

1. [Create a vault and certificate](../../key-vault/certificates/quick-create-portal.md) (self-signed or import).

2. Grant the Azure Arc enabled server access to the certificate secret. If you’re using the [RBAC preview](../../key-vault/general/rbac-guide.md), search for the name of the Azure Arc resource and assign it the **Key Vault Secrets User (preview)** role. If you’re using [Key Vault access policy](../../key-vault/general/assign-access-policy-portal.md), assign Secret **Get** permissions to the Azure Arc resource’s system assigned identity.

## Extension schema

The following JSON shows the schema for the Key Vault VM extension. The extension does not require protected settings - all its settings are considered public information. The extension requires a list of monitored certificates, polling frequency, and the destination certificate store. Specifically:

### Template file for Linux

```json
{
      "type": "Microsoft.HybridCompute/machines/extensions",
      "name": "KeyVaultForLinux",
      "apiVersion": "2019-07-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.HybridCompute/machines/extensions/', <machineName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForLinux",
      "typeHandlerVersion": "1.0",
      "autoUpgradeMinorVersion": true,
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

### Template file for Windows

```json
{
      "type": "Microsoft.HybridCompute/machines/extensions",
      "name": "KVVMExtensionForWindows",
      "apiVersion": "2019-07-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.HybridCompute/machines/extensions/', <machineName>)]"
      ],
      "properties": {
      "publisher": "Microsoft.Azure.KeyVault",
      "type": "KeyVaultForWindows",
      "typeHandlerVersion": "1.0",
      "autoUpgradeMinorVersion": true,
      "settings": {
        "secretsManagementSettings": {
          "pollingIntervalInS": <polling interval in seconds, e.g: "3600">,
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

Save the template file to disk. You can then install the extension on all the connected machines within a resource group with the following command.

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "ContosoEngineering" -TemplateFile "D:\Azure\Templates\LogAnalyticsAgentWin.json"
```

## Azure PowerShell deployment

> [!WARNING]
> PowerShell clients often add `\` to `"` in the settings.json which will cause akvvm_service fails with error: `[CertificateManagementConfiguration] Failed to parse the configuration settings with:not an object.`

The Azure PowerShell can be used to deploy the Key Vault VM extension to an existing Arc enabled server based on the following example: 

```powershell
$Settings = @{ secretsManagementSettings = @{ observedCertificates = @( "https://ryanpu-akv.vault.azure.net/secrets/arc-demo-certificate" # Add more here, don't forget a comma on the preceding line ) certificateStoreLocation = "LocalMachine" certificateStoreName = "My" pollingIntervalInS = "60" } authenticationSettings = @{ msiEndpoint = "http://localhost:40342/metadata/identity" } } $ResourceGroup = "ryanpu-akv-demo" $ArcMachineName = "ryanpu-akv-win" $Location = "eastus2" 

New-AzConnectedMachineExtension -ResourceGroupName $ResourceGroup -MachineName $ArcMachineName -Name "KeyVaultForWindows" -Location $Location -Publisher "Microsoft.Azure.KeyVault" -ExtensionType "KeyVaultForWindows" -Setting (ConvertTo-Json $Settings)
```

The Azure PowerShell can be used to deploy the Key Vault VM extension based on the following example:

```powershell
# Build settings
    $settings = @{
      secretsManagementSettings = @{
       observedCertificates = @{
        "observedCert1"
       }
      certificateStoreLocation = "myMachineName" # For Linux use "/var/lib/waagent/Microsoft.Azure.KeyVault.Store/"
      certificateStore = "myCertificateStoreName"
      pollingIntervalInS = "pollingInterval"
      }
    authenticationLocationSettings = @{
     msiEndpoint = "http://localhost:40342/metadata/identity"
     }
    }

    $resourceGroup = "resourceGroupName"
    $machineName = "myMachineName"
    $location = "regionName"

    # Start the deployment
    New-AzConnectedMachineExtension -ResourceGroupName $resourceGRoup -Location $location -MachineName $machineName -Name "KeyVaultForWindows or KeyVaultforLinux" -Publisher "Microsoft.Azure.KeyVault" -ExtensionType "KeyVaultforWindows or KeyVaultforLinux" -Setting (ConvertTo-Json $settings)
```

## Azure CLI deployment

The Azure CLI can be used to deploy the Key Vault VM extension to an Arc enabled server based on the following example:

```azurecli
az connectedmachine machine-extension create --resource-group "resourceGroupName" --machine-name "myMachineName" --location "regionName" --publisher "Microsoft.Azure.KeyVault" --type "KeyVaultForLinux or KeyVaultForWindows" --name "KeyVaultForLinux or KeyVaultForWindows" --settings '{"secretsManagementSettings": { "pollingIntervalInS": "60", "observedCertificates": ["observedCert1"] }, "authenticationSettings": { "msiEndpoint": "http://localhost:40342/metadata/identity" }}'
```

## Next steps

* You can deploy, manage, and remove VM extensions using the [Azure PowerShell](manage-vm-extensions-powershell.md), from the [Azure portal](manage-vm-extensions-portal.md), the [Azure CLI](manage-vm-extensions-cli.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

* Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).