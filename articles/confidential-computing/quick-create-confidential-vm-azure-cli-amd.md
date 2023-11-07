---
title: Create an AMD-based confidential VM with the Azure CLI for Azure confidential computing
description: Learn how to use the Azure CLI to create an AMD-based confidential virtual machine for use with Azure confidential computing.
author: simranparkhe
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 11/29/2022
ms.author: simranparkhe
ms.custom: devx-track-azurecli, devx-track-linux
---

# Quickstart: Create an AMD-based confidential VM with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

This quickstart shows you how to use the Azure Command-Line Interface (Azure CLI) to deploy a confidential virtual machine (confidential VM) in Azure. The Azure CLI is used to create and manage Azure resources via either the command line or scripts.

## Prerequisites

If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Launch Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.30 or later. Run `az--version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:
> [!NOTE]
> Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
```azurecli - interactive
az group create --name myResourceGroup --location eastus
```
## Create Confidential virtual machine using a platform-managed key

Create a VM with the [az vm create](/cli/azure/vm) command.

The following example creates a VM named *myVM* and adds a user account named *azureuser*. The `--generate-ssh-keys` parameter is used to automatically generate an SSH key, and put it in the default key location(*~/.ssh*). To use a specific set of keys instead, use the `--ssh-key-values` option.
For `size`, select a confidential VM size. For more information, see [supported confidential VM families](virtual-machine-solutions-amd.md).

Choose `VMGuestStateOnly` for no OS disk confidential encryption. Or, choose `DiskWithVMGuestState` for OS disk confidential encryption with a platform-managed key. Enabling secure boot is optional, but recommended. For more information, see [secure boot and vTPM](../virtual-machines/trusted-launch.md). For more information on disk encryption and encryption at host, see [confidential OS disk encryption](confidential-vm-overview.md) and [encryption at host](/azure/virtual-machines/linux/disks-enable-host-based-encryption-cli).

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --generate-ssh-keys \
  --size Standard_DC4as_v5 \
  --admin-username <azure-username> \
  --admin-password <azure-password> \
  --enable-vtpm true \
  --image "Canonical:0001-com-ubuntu-confidential-vm-focal:20_04-lts-cvm:latest" \
  --public-ip-sku Standard \
  --security-type ConfidentialVM \
  --os-disk-security-encryption-type VMGuestStateOnly \
  --enable-secure-boot true \
  --encryption-at-host \
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```output
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "<MAC-address>",
  "powerState": "VM running",
  "privateIpAddress": "10.20.255.255",
  "publicIpAddress": "192.168.255.255",
  "resourceGroup": "myResourceGroup",
  "zones": ""
}
```

Make a note of the `publicIpAddress` to use later.

## Create Confidential virtual machine using a Customer Managed Key

To create a confidential [disk encryption set](../virtual-machines/linux/disks-enable-customer-managed-keys-cli.md), you have two options: Using [Azure Key Vault](../key-vault/general/quick-create-cli.md) or [Azure Key Vault managed Hardware Security Module (HSM)](../key-vault/managed-hsm/quick-create-cli.md). Based on your security and compliance needs you can choose either option. However, it is important to note that the standard SKU is not supported. The following example uses Azure Key Vault Premium.

1. Grant confidential VM Service Principal `Confidential VM Orchestrator` to tenant
For this step you need to be a Global Admin or you need to have the User Access Administrator RBAC role.
  ```azurecli
  Connect-Graph -Tenant "your tenant ID" Application.ReadWrite.All
  New-MgServicePrincipal -AppId bf7b6499-ff71-4aa2-97a4-f372087be7f0 -DisplayName "Confidential VM Orchestrator"    
  ```
2.  Create an Azure Key Vault using the [az keyvault create](/cli/azure/keyvault) command. For the pricing tier, select Premium (includes support for HSM backed keys). Make sure that you have an owner role in this key vault.
  ```azurecli-interactive
  az keyvault create -n keyVaultName -g myResourceGroup --enabled-for-disk-encryption true --sku premium --enable-purge-protection true
  ```
3. Give `Confidential VM Orchestrator` permissions to `get` and `release` the key vault.
  ```azurecli
  $cvmAgent = az ad sp show --id "bf7b6499-ff71-4aa2-97a4-f372087be7f0" | Out-String | ConvertFrom-Json
  az keyvault set-policy --name $KeyVault --object-id $cvmAgent.Id --key-permissions get release
  ```
4. Create a key in the key vault using [az keyvault key create](/cli/azure/keyvault). For the key type, use RSA-HSM.
  ```azurecli-interactive
  az keyvault key create --name mykey --vault-name keyVaultName --default-cvm-policy --exportable --kty RSA-HSM
  ```
5. Create the disk encryption set using [az disk-encryption-set create](/cli/azure/disk-encryption-set). Set the encryption type to `ConfidentialVmEncryptedWithCustomerKey`.
  ```azurecli-interactive
$keyVaultKeyUrl=(az keyvault key show --vault-name keyVaultName --name mykey--query [key.kid] -o tsv)

az disk-encryption-set create --resource-group myResourceGroup --name diskEncryptionSetName --key-url $keyVaultKeyUrl  --encryption-type ConfidentialVmEncryptedWithCustomerKey
  ```
6. Grant the disk encryption set resource access to the key vault using [az key vault set-policy](/cli/azure/keyvault).
  ```azurecli-interactive
$desIdentity=(az disk-encryption-set show -n diskEncryptionSetName -g myResourceGroup --query [identity.principalId] -o tsv)

az keyvault set-policy -n keyVaultName -g myResourceGroup --object-id $desIdentity --key-permissions wrapkey unwrapkey get
  ```
7. Use the disk encryption set ID to create the VM.
  ```azurecli-interactive
$diskEncryptionSetID=(az disk-encryption-set show -n diskEncryptionSetName -g myResourceGroup --query [id] -o tsv)
  ```
8. Create a VM with the [az vm create](/cli/azure/vm) command. Choose `DiskWithVMGuestState` for OS disk confidential encryption with a customer-managed key. Enabling secure boot is optional, but recommended.  For more information, see [secure boot and vTPM](../virtual-machines/trusted-launch.md). For more information on disk encryption, see [confidential OS disk encryption](confidential-vm-overview.md).

  ```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --size Standard_DC4as_v5 \
  --admin-username <azure-user> \
  --admin-password <azure-password> \
  --enable-vtpm true \
  --enable-secure-boot true \
  --image "Canonical:0001-com-ubuntu-confidential-vm-focal:20_04-lts-cvm:latest" \
  --public-ip-sku Standard \
  --security-type ConfidentialVM \
  --os-disk-security-encryption-type DiskWithVMGuestState \
  --os-disk-secure-vm-disk-encryption-set $diskEncryptionSetID \
```
It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```output
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "<MAC-address>",
  "powerState": "VM running",
  "privateIpAddress": "10.20.255.255",
  "publicIpAddress": "192.168.255.255",
  "resourceGroup": "myResourceGroup",
  "zones": ""
}
```
Make a note of the `publicIpAddress` to use later.
  
## Connect and attest the CVM through Microsoft Azure Attestation Sample App

To use a sample application in C++ for use with the guest attestation APIs, use the following steps. This example uses a Linux confidential virtual machine. For Windows, see [build instructions for Windows](https://github.com/Azure/confidential-computing-cvm-guest-attestation/tree/main/cvm-attestation-sample-app).

1. Sign in to your confidential VM using its public IP address.

2. Clone the [sample Linux application](https://github.com/Azure/confidential-computing-cvm-guest-attestation).

3. Install the `build-essential` package. This package installs everything required for compiling the sample application.
```bash
sudo apt-get install build-essential 
```
4. Install the packages below.
```bash
sudo apt-get install libcurl4-openssl-dev 
sudo apt-get install libjsoncpp-dev
sudo apt-get install libboost-all-dev
sudo apt install nlohmann-json3-dev
```
5. Download the [attestation package](https://packages.microsoft.com/repos/azurecore/pool/main/a/azguestattestation1/).

6. Install the attestation package. Make sure to replace `<version>` with the version that you downloaded.
```bash
sudo dpkg -i azguestattestation1_<latest-version>_amd64.deb
```
7. Once the above packages have been installed, use the below steps to build and run the app.
```bash
cd confidential-computing-cvm-guest-attestation/cvm-attestation-sample-app
sudo cmake . && make
sudo ./AttestationClient -o token
```
8. To convert the web token to a JSON, use the steps below.
```bash
sudo ./AttestationClient -o token>> /attestation_output

JWT=$(cat /attestation_output)

echo -n $JWT | cut -d "." -f 1 | base64 -d 2>/dev/null | jq .
echo -n $JWT | cut -d "." -f 2 | base64 -d 2>/dev/null | jq .
```

## Next steps

> [!div class="nextstepaction"]
> [Create a confidential VM on AMD with an ARM template](quick-create-confidential-vm-arm-amd.md)
