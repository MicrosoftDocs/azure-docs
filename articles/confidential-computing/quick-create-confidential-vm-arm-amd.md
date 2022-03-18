---
title: Create an Azure AMD-based confidential VM with ARM template (preview) 
description: Learn how to quickly create an AMD-based confidential virtual machine (confidential VM) using an ARM template. Deploy the confidential VM from ARM template.
author: RunCai
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 3/18/2022
ms.author: RunCai
ms.custom: mode-arm, devx-track-azurecli 
ms.devlang: azurecli
---


# Quickstart: Deploy confidential VM with ARM template (preview)

> [!IMPORTANT]
> Confidential virtual machines (confidential VMs) in Azure Confidential Computing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can use an Azure Resource Manager template (ARM template) to create a [confidential VM](confidential-vm-overview.md) quickly. The confidential VM you create runs on AMD processors backed by AMD SEV-SNP to achieve VM memory encryption and isolation. For more information, see [Confidential VM Overview](confidential-vm-overview.md).

This tutorial covers deployment of a confidential VM with a custom configuration. 

## Prerequisites

- An Azure subscription. Free trial accounts don't have access to the VMs used in this tutorial. One option is to use a [pay as you go subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/). 
- If you want to deploy from the Azure CLI, [install PowerShell](/powershell/azure/install-az-ps) and [install the Azure CLI](/cli/azure/install-azure-cli).

## Deploy confidential VM template with Azure CLI (for both with and without OS disk confidential encryption via platform-managed key)

To create and deploy a confidential VM using an ARM template through the Azure CLI:

1. Sign in to your Azure account in the Azure CLI.

    ```azurecli
    az login
    ```

1. Set your Azure subscription. Replace `<subscription-id>` with your subscription identifier. Make sure to use a subscription that meets the [prerequisites](#prerequisites).

    ```azurecli
    az account set --subscription <subscription-id>
    ```

1. Set the variables for your confidential VM. Provide the deployment name (`$deployName`), the resource group (`$resourceGroup`), the VM name (`$vmName`), and the Azure region (`$region`). Replace the sample values with your own information.

    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

    ```powershell-interactive
    $deployName="<deployment-name>"
    $resourceGroup="<resource-group-name>"
    $vmName= "<confidential-vm-name>"
    $region="<region-name>"
    ```

    If the resource group you specified doesn't exist, create a resource group with that name.
    
    ```azurecli
    az group create -n $resourceGroup -l $region
    ```

1. Deploy your VM to Azure using ARM template with custom parameter file

      
    ```azurecli
    az deployment group create `
     -g $resourceGroup `
     -n $deployName `
     -u "https://aka.ms/CVMTemplate" `
     -p "<json-parameter-file-path>" `
     -p vmLocation=$region `
        vmName=$vmName
    ```


### Define custom parameter file

When you create your confidential VM using the Azure CLI, you need to define custom parameter file. To create a custom JSON parameter file:

1. Sign into your Azure account in the Azure CLI.

1. Create a JSON parameter file. For example, `azuredeploy.parameters.json`.

1. Depending on the OS image you're using, copy in the [example Windows parameter file](#example-windows-parameter-file) or the [example Linux parameter file](#example-linux-parameter-file).

1. Edit the JSON code in the parameter file as needed. For example, you might want to update the OS image name (`osImageName`), the administrator username (`adminUsername`). Choose "VMGuestStateOnly" from Securitytype (`securitytype`) for no OS disk confidential encryption, or "DiskWithVMGuestState" for OS disk confidential encryption with platform-managed key.

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
      "value": "Password123@@"
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
      "value": {your ssh public key}
    }
  }
}
```

## Deploy confidential VM template with OS disk confidential encryption via customer-managed key

1. Sign in to your Azure account in the Azure CLI.
    ```azurecli-interactive
   az login
    ```

1. Set your Azure subscription. Replace `<subscription-id>` with your subscription identifier. Make sure to use a subscription that meets the [prerequisites](#prerequisites).
    ```azurecli
    az account set --subscription <subscription-id>
    ```

1. Set up **Azure key vault**

    1. Create Azure Key Vault Resource Group
    
    ```azurecli
    $resourceGroup = <key vault resource group>
    $region = <**The region of your AKV instance has to be the same as that of your CVM**>
    az group create --name $resourceGroup --location $region
    ```
    
    b. Create Azure Key Vault instance with **Premium** SKU in region.
    
    ```azurecli
    $KeyVault = <name of key vault>
    az keyvault create --name $KeyVault --resource-group $resourceGroup --location $region --sku Premium --enable-purge-protection 
    ```

    c. Ensure you are **owner** of this key vault.
    
    d. Give **Confidential Guest VM Agent** `get` and `release` permissions to this key vault.
    ```azurecli
    $cvmAgent = az ad sp list --display-name "Confidential Guest VM Agent" | Out-String | ConvertFrom-Json
    az keyvault set-policy --name $KeyVault --object-id $cvmAgent.objectId --key-permissions get release
    ```

1. (Optional) Instead of setting Azure Key Vault, you also can create **Azure Key Vault Managed HSM**.

    1. Follow the steps [Create Azure Key Vault Managed HSM](https://docs.microsoft.com/en-us/azure/key-vault/managed-hsm/quick-create-cli) to provision and activate Azure Key Vault Managed HSM. 
    
    1. Enable purge protection required to enable key release.
    
    ```azurecli
    az keyvault update-hsm --subscription $subscriptionId -g $resourceGroup --hsm-name $hsm --enable-purge-protection true
    ```


    c. Give **Confidential Guest VM Agent** `get` and `release` permissions to the key vault.
    
    ```azurecli
    $cvmAgent = az ad sp list --display-name "Confidential Guest VM Agent" | Out-String | ConvertFrom-Json
    az keyvault set-policy --name $hsm --object-id $cvmAgent.objectId --key-permission get release    
    ```

1. Create a new key.
    1. Prepare/download [key release policy](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/skr-policy.json) to local disk.
    
    1. Create a new key from **Azure key Vault**.
    ```azurecli
    $KeyName = <name of key>
    $KeySize = 3072
    az keyvault key create --vault-name $KeyVault --name $KeyName --ops wrapKey unwrapkey --kty RSA-HSM --size $KeySize --exportable true --policy "@.\skr-policy.json"    
    ```

    b. (optional) Or create a new key from **Azure Key Vault Manage HSM**.
    ```azurecli
    $KeyName = <name of key>
    $KeySize = 3072
    az keyvault key create --hsm-name $hsm --name $KeyName --ops wrapKey unwrapkey --kty RSA-HSM --size $KeySize --policy "@.\skr-policy.json"   
    ```

    c. Deploy a Disk Encryption Set (DES) for key created from **Azure Key Vault**. 
    
      * Get key information
        ```azurecli
        $encryptionKeyVaultId = ((az keyvault show -n $KeyVault -g
        $resourceGroup) | ConvertFrom-Json).id
        $encryptionKeyURL= ((az keyvault key show --vault-name $KeyVault --name $KeyName) | ConvertFrom-Json).key.kid        
        ```
       
      * Use [DES ARM template](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/deploymentTemplate/deployDES.json) `deployDES.json`to deploy a Disk encryption set.
        ```azurecli
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
      * Assign key access to Disk Encryption Set file
        ```azurecli
        $desIdentity= (az disk-encryption-set show -n $desName -g 
        $resourceGroup --query [identity.principalId] -o tsv)
        az keyvault set-policy -n $KeyVault `
            -g $resourceGroup `
            --object-id $desIdentity `
            --key-permissions wrapkey unwrapkey get        
        ```

    c. (Optional) Deploy a disk encryption set (DES) for key created from **Azure Key Vault Managed HSM**. 
    
      * Get key information
      ```azurecli
      $encryptionKeyURL = ((az keyvault key show --hsm-name $hsm --name 
      $KeyName) | ConvertFrom-Json).key.kid      
      ```
 
      * Deploy a Disk Encryption Set
      ```azurecli
      $desName = <name of DES>
      az disk-encryption-set create -n $desName `
       -g $resourceGroup `
       --key-url $encryptionKeyURL
      ```

      * Assign key access to Disk Encryption Set
      ```azurecli
      desIdentity=$(az disk-encryption-set show -n $desName -g $resourceGroup --query [identity.principalId] -o tsv)
      az keyvault set-policy -n $hsm `
          -g $resourceGroup `
          --object-id $desIdentity `
          --key-permissions wrapkey unwrapkey get
      ```

 1. Deploy confidential VM with customer-managed key.
      
      1. Get Disk Encryption Set resource ID.
      ```azurecli
      $desID = (az disk-encryption-set show -n $desName -g $resourceGroup --query [id] -o tsv)
      ```
      b. Use confidential VM [ARM template](https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/deploymentTemplate/deployCPSCVM_cmk.json) `deployCPSCVM_cmk.json`and a parameter file to deploy a confidentialVM with customer-managed key.
      >[!note]
        A [sample parameter file](#sample-cvm-deployment-parameter-file) for a Windows Server 2022 Gen 2 confidential VM listed below.
      ```azurecli
      $deployName = <name of deployment>
      $vmName = <name of CVM>
      $cvmArmTemplate = <name of CVM ARM template file>
      $cvmParameterFile = <name of CVM parameter file>

      az deployment group create `
         -g $resourceGroup `
         -n $deployName `
         -f $cvmArmTemplate `
         -p $cvmParameterFile `
         -p diskEncryptionSetId=$desID `
         -p vmName=$vmName
      ```

1. Connect to confidential VM to ensure provision is successful.
        
### Sample CVM deployment parameter file `azuredeploy.parameters.win2022.json`
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
        "value": "Password123@@"
      }
    }
}
```   

   
## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a confidential VM on AMD in the Azure portal](quick-create-confidential-vm-portal-amd.md)
