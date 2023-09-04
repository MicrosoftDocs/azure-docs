---
title: Create an Azure AMD-based confidential VM with ARM template
description: Learn how to quickly create and deploy an AMD-based DCasv5 or ECasv5 series Azure confidential virtual machine (confidential VM) using an ARM template.
author: RunCai
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 04/12/2023
ms.author: RunCai
ms.custom: mode-arm, devx-track-azurecli, devx-track-arm-template, devx-track-linux, has-azure-ad-ps-ref
ms.devlang: azurecli
---

# Quickstart: Deploy confidential VM with ARM template

You can use an Azure Resource Manager template (ARM template) to create an Azure [confidential VM](confidential-vm-overview.md) quickly. Confidential VMs run on AMD processors backed by AMD SEV-SNP to achieve VM memory encryption and isolation. For more information, see [Confidential VM Overview](confidential-vm-overview.md).

This tutorial covers deployment of a confidential VM with a custom configuration. 

## Prerequisites

- An Azure subscription. Free trial accounts don't have access to the VMs used in this tutorial. One option is to use a [pay as you go subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/). 
- If you want to deploy from the Azure CLI, [install PowerShell](/powershell/azure/install-azure-powershell) and [install the Azure CLI](/cli/azure/install-azure-cli).

## Deploy confidential VM template with Azure CLI

You can deploy a confidential VM template that has optional OS disk confidential encryption through a platform-managed key.

To create and deploy your confidential VM using an ARM template through the Azure CLI:

1. Sign in to your Azure account in the Azure CLI.

    ```azurecli-interactive
    az login
    ```

1. Set your Azure subscription. Replace `<subscription-id>` with your subscription identifier. Make sure to use a subscription that meets the [prerequisites](#prerequisites).

    ```azurecli-interactive
    az account set --subscription <subscription-id>
    ```

1. Set the variables for your confidential VM. Provide the deployment name (`$deployName`), the resource group (`$resourceGroup`), the VM name (`$vmName`), and the Azure region (`$region`). Replace the sample values with your own information.

    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see [which VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

    ```powershell-interactive
    $deployName="<deployment-name>"
    $resourceGroup="<resource-group-name>"
    $vmName= "<confidential-vm-name>"
    $region="<region-name>"
    ```

    If the resource group you specified doesn't exist, create a resource group with that name.

    ```azurecli-interactive
    az group create -n $resourceGroup -l $region
    ```

1. Deploy your VM to Azure using an ARM template with a custom parameter file

    ```azurecli-interactive
    az deployment group create `
     -g $resourceGroup `
     -n $deployName `
     -u "https://aka.ms/CVMTemplate" `
     -p "<json-parameter-file-path>" `
     -p vmLocation=$region `
        vmName=$vmName
    ```

### Define custom parameter file

When you create a confidential VM through the Azure Command-Line Interface (Azure CLI), you need to define a custom parameter file. To create a custom JSON parameter file:

1. Sign in to your Azure account through the Azure CLI.

1. Create a JSON parameter file. For example, `azuredeploy.parameters.json`.

1. Depending on the OS image you're using, copy either the [example Windows parameter file](#example-windows-parameter-file) or the [example Linux parameter file](#example-linux-parameter-file) into your parameter file.

1. Edit the JSON code in the parameter file as needed. For example,  update the OS image name (`osImageName`) or the administrator username (`adminUsername`). 

1. Configure your security type setting (`securityType`). Choose `VMGuestStateOnly` for no OS disk confidential encryption. Or, choose `DiskWithVMGuestState` for OS disk confidential encryption with a platform-managed key.

1. Save your parameter file.

#### Example Windows parameter file

Use this example to create a custom parameter file for a Windows-based confidential VM.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {

    "vmSize": {
      "value": "Standard_DC2as_v5"
    },
    "osImageName": {
      "value": "Windows Server 2022 Gen 2"
    },
    "securityType": {
      "value": "DiskWithVMGuestState"
    },
    "adminUsername": {
      "value": "testuser"
    },
    "adminPasswordOrKey": {
      "value": "<your password>"
    }
  }
}
```

#### Example Linux parameter file

Use this example to create a custom parameter file for a Linux-based confidential VM.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {

    "vmSize": {
      "value": "Standard_DC2as_v5"
    },
    "osImageName": {
      "value": "Ubuntu 20.04 LTS Gen 2"
    },
    "securityType": {
      "value": "DiskWithVMGuestState"
    },
    "adminUsername": {
      "value": "testuser"
    },
    "authenticationType": {
      "value": "sshPublicKey"
    },
    "adminPasswordOrKey": {
      "value": <your SSH public key>
    }
  }
}
```

> [!NOTE]
> Replace the osImageName value accordingly.

## Deploy confidential VM template with OS disk confidential encryption via customer-managed key

1. Sign in to your Azure account through the Azure CLI.

    ```azurecli-interactive
   az login
    ```

1. Set your Azure subscription. Replace `<subscription-id>` with your subscription identifier. Make sure to use a subscription that meets the [prerequisites](#prerequisites).

    ```azurecli-interactive
    az account set --subscription <subscription-id>
    ```

1. Grant confidential VM Service Principal `Confidential VM Orchestrator` to tenant
    
    For this step you need to be a Global Admin or you need to have the User Access Administrator RBAC role.

    ```azurecli-interactive
    Connect-AzureAD -Tenant "your tenant ID"
    New-AzureADServicePrincipal -AppId bf7b6499-ff71-4aa2-97a4-f372087be7f0 -DisplayName "Confidential VM Orchestrator"    
    ```

1. Set up your Azure key vault. For how to use an Azure Key Vault Managed HSM instead, see the next step.

    1. Create a resource group for your key vault. Your key vault instance and your confidential VM must be in the same Azure region.

        ```azurecli-interactive
        $resourceGroup = <key vault resource group>
        $region = <Azure region>
        az group create --name $resourceGroup --location $region
        ```

    1. Create a key vault instance with a premium SKU and select your preferred region. The standard SKU is not supported.

        ```azurecli-interactive
        $KeyVault = <name of key vault>
        az keyvault create --name $KeyVault --resource-group $resourceGroup --location $region --sku Premium --enable-purge-protection 
        ```

    1. Make sure that you have an **owner** role in this key vault.
    1. Give `Confidential VM Orchestrator` permissions to `get` and `release` the key vault.

        ```azurecli-interactive
        $cvmAgent = az ad sp show --id "bf7b6499-ff71-4aa2-97a4-f372087be7f0" | Out-String | ConvertFrom-Json
        az keyvault set-policy --name $KeyVault --object-id $cvmAgent.Id --key-permissions get release
        ```

1. (Optional) If you don't want to use an Azure key vault, you can create an Azure Key Vault Managed HSM instead.

    1. Follow the [quickstart to create an Azure Key Vault Managed HSM](../key-vault/managed-hsm/quick-create-cli.md) to provision and activate Azure Key Vault Managed HSM. 
    1. Enable purge protection on the Azure Managed HSM. This step is required to enable key release.
    
        ```azurecli-interactive
        az keyvault update-hsm --subscription $subscriptionId -g $resourceGroup --hsm-name $hsm --enable-purge-protection true
        ```

    1. Give `Confidential VM Orchestrator` permissions to managed HSM.

        ```azurecli-interactive
        $cvmAgent = az ad sp show --id "bf7b6499-ff71-4aa2-97a4-f372087be7f0" | Out-String | ConvertFrom-Json
        az keyvault role assignment create --hsm-name $hsm --assignee $cvmAgent.Id --role "Managed HSM Crypto Service Release User" --scope /keys/$KeyName 
        ```

1. Create a new key using Azure Key Vault. For how to use an Azure Managed HSM instead, see the next step.

    1. Prepare and download the [key release policy](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/skr-policy.json) to your local disk.
    1. Create a new key.

        ```azurecli-interactive
        $KeyName = <name of key>
        $KeySize = 3072
        az keyvault key create --vault-name $KeyVault --name $KeyName --ops wrapKey unwrapkey --kty RSA-HSM --size $KeySize --exportable true --policy "@.\skr-policy.json"    
        ```

    1. Get information about the key that you created.

        ```azurecli-interactive
        $encryptionKeyVaultId = ((az keyvault show -n $KeyVault -g $resourceGroup) | ConvertFrom-Json).id
        $encryptionKeyURL= ((az keyvault key show --vault-name $KeyVault --name $KeyName) | ConvertFrom-Json).key.kid        
        ```

    1. Deploy a Disk Encryption Set (DES) using a [DES ARM template](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/deploymentTemplate/deployDES.json) (`deployDES.json`).

        ```azurecli-interactive
        $desName = <name of DES>
        $deployName = <name of deployment>
        $desArmTemplate = <name of DES ARM template file>
        az deployment group create `
            -g $resourceGroup `
            -n $deployName `
            -f $desArmTemplate `
            -p desName=$desName `
            -p encryptionKeyURL=$encryptionKeyURL `
            -p encryptionKeyVaultId=$encryptionKeyVaultId `
            -p region=$region        
        ```

    1. Assign key access to the DES file.

        ```azurecli-interactive
        $desIdentity= (az disk-encryption-set show -n $desName -g 
        $resourceGroup --query [identity.principalId] -o tsv)
        az keyvault set-policy -n $KeyVault `
            -g $resourceGroup `
            --object-id $desIdentity `
            --key-permissions wrapkey unwrapkey get        
        ```

 1. (Optional) Create a new key from an Azure Managed HSM.
    1. Prepare and download the [key release policy](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/skr-policy.json) to your local disk.
    1. Create the new key.

        ```azurecli-interactive
        $KeyName = <name of key>
        $KeySize = 3072
        az keyvault key create --hsm-name $hsm --name $KeyName --ops wrapKey unwrapkey --kty RSA-HSM --size $KeySize --exportable true --policy "@.\skr-policy.json"   
        ```

    1. Get information about the key that you created.

          ```azurecli-interactive
          $encryptionKeyURL = ((az keyvault key show --hsm-name $hsm --name $KeyName) | ConvertFrom-Json).key.kid      
          ```

    1. Deploy a DES.

          ```azurecli-interactive
          $desName = <name of DES>
          az disk-encryption-set create -n $desName `
           -g $resourceGroup `
           --key-url $encryptionKeyURL
          ```

    1. Assign key access to the DES.

          ```azurecli-interactive
          desIdentity=$(az disk-encryption-set show -n $desName -g $resourceGroup --query [identity.principalId] -o tsv)
          az keyvault set-policy -n $hsm `
              -g $resourceGroup `
              --object-id $desIdentity `
              --key-permissions wrapkey unwrapkey get
          ```

1. Deploy your confidential VM with the customer-managed key.

    1. Get the resource ID for the DES.
 
        ```azurecli-interactive
        $desID = (az disk-encryption-set show -n $desName -g $resourceGroup --query [id] -o tsv)
        ```

    1. Deploy your confidential VM using the [confidential VM ARM template](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/deploymentTemplate/deployCPSCVM_cmk.json) (`deployCPSCVM_cmk.json`) and a [deployment parameter file](#example-deployment-parameter-file) (for example, `azuredeploy.parameters.win2022.json`) with the customer-managed key.

        ```azurecli-interactive
        $deployName = <name of deployment>
        $vmName = <name of confidential VM>
        $cvmArmTemplate = <name of confidential VM ARM template file>
        $cvmParameterFile = <name of confidential VM parameter file>

        az deployment group create `
            -g $resourceGroup `
            -n $deployName `
            -f $cvmArmTemplate `
            -p $cvmParameterFile `
            -p diskEncryptionSetId=$desID `
            -p vmName=$vmName
        ```

1. Connect to your confidential VM to make sure the creation was successful.

### Example deployment parameter file

This is an example parameter file for a Windows Server 2022 Gen 2 confidential VM: 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
  
      "vmSize": {
        "value": "Standard_DC2as_v5"
      },
      "osImageName": {
        "value": "Windows Server 2022 Gen 2"
      },
      "osDiskType": {
        "value": "StandardSSD_LRS"
      },
      "securityType": {
        "value": "DiskWithVMGuestState"
      },
      "adminUsername": {
        "value": "testuser"
      },
      "adminPasswordOrKey": {
        "value": "<Your-Password>"
      }
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a confidential VM on AMD in the Azure portal](quick-create-confidential-vm-portal-amd.md)
