---
title: 'Quickstart: Use the Azure CLI to create a Linux VM'
description: In this quickstart, you learn how to use the Azure CLI to create a Confidential virtual machine
author: simranparkhe
ms.service: virtual-machines
mms.subservice: confidential-computing
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 10/26/2022
ms.author: simranparkhe
ms.custom: devx-track-azurecli
---

# Quickstart: Create a Confidential Virtual Machine with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

This quickstart shows you how to use the Azure CLI to deploy a Confidential virtual machine (VM) in Azure. The Azure CLI is used to create and manage Azure resources via either the command line or scripts.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.30 or later. Run `az--version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:
> [!NOTE]
> Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
```azurecli - interactive
az group create --name myResourceGroup --location eastus
```
## Create Confidential virtual machine using a Platform Managed Key

Create a VM with the [az vm create](/cli/azure/vm) command.

The following example creates a VM named *myVM* and adds a user account named *azureuser*. The `--generate-ssh-keys` parameter is used to automatically generate an SSH key, and put it in the default key location(*~/.ssh*). To use a specific set of keys instead, use the `--ssh-key-values` option.
For Size, select a confidential VM size. For more information, see [supported confidential VM families](virtual-machine-solutions-amd.md).

Choose `VMGuestStateOnly` for no OS disk confidential encryption. Or, choose `DiskWithVMGuestState` for OS disk confidential encryption with a platform-managed key.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --generate-ssh-keys \
  --size Standard_DC2as_v5 \
  --admin-username azureuser \
  --admin-password AzurePassword@123 \
  --enable-vtpm true \
  --enable-secure-boot true \
  --image "Canonical:0001-com-ubuntu-confidential-vm-focal:20_04-lts-cvm:latest" \
  --public-ip-sku Standard \
  --security-type ConfidentialVM \
  --os-disk-security-encryption-type VMGuestStateOnly \
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```output
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-4D-DE-5C",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "20.232.225.109",
  "resourceGroup": "myResourceGroup",
  "zones": ""
}
```

Make a note of the `publicIpAddress` to use later.

## Create Confidential virtual machine using a Customer Managed Key

Create a Confidential [disk encryption set](../virtual-machines/linux/disks-enable-customer-managed-keys-cli.md) using [Azure Key Vault](../key-vault/general/quick-create-cli.md) or [Azure Key Vault managed Hardware Security Module (HSM)](../key-vault/managed-hsm/quick-create-cli.md). The example below will use Azure Key Vault. 

  1.  Create an Azure Key Vault using the [az keyvault create](/cli/azure/keyvault) command. For the pricing tier, select Premium (includes support for HSM backed keys).
  ```azurecli-interactive
  az keyvault create -n keyVaultName -g myResourceGroup --enabled-for-disk-encryption true --sku premium --enable-purge-protection true
  ```
  2. Create a key in the keyvault using [az keyvault key create](/cli/azure/keyvault). For the key type, use RSA-HSM.
  ```azurecli-interactive
  	az keyvault key create --name mykey --vault-name keyVaultName --default-cvm-policy --exportable --kty RSA-HSM
  ```
  3. Create the disk encryption set using [az disk-encryption-set create](/cli/azure/disk-encryption-set). Set the encryption type to ConfidentialVmEncryptedWithCustomerKey.
  ```azurecli-interactive
  $keyVaultKeyUrl=(az keyvault key show --vault-name keyVaultName --name mykey--query [key.kid] -o tsv)

	az disk-encryption-set create --resource-group myResourceGroup --name diskEncryptionSetName --key-url $keyVaultKeyUrl  --encryption-type ConfidentialVmEncryptedWithCustomerKey
  ```
  4. Grant the DiskEncryptionSet resource access to the key vault using [az key vault set-policy](/cli/azure/keyvault).
  ```azurecli-interactive
  	$desIdentity=(az disk-encryption-set show -n diskEncryptionSetName -g myResourceGroup --query [identity.principalId] -o tsv)

		az keyvault set-policy -n keyVaultName -g myResourceGroup --object-id $desIdentity --key-permissions wrapkey unwrapkey get
  ```
  5. Use the DiskEncryptionSetID to create the VM.
  ```azurecli-interactive
  	$diskEncryptionSetID=(az disk-encryption-set show -n diskEncryptionSetName -g myResourceGroup --query [id] -o tsv)
  ```
  6. Create a VM with the [az vm create](/cli/azure/vm) command. Choose `DiskWithVMGuestState` for OS disk confidential encryption with a customer-managed key.

  ```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --size Standard_DC2as_v5 \
  --admin-username azureuser \
  --admin-password AzurePassword@123 \
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
  "macAddress": "60-45-BD-A8-F0-3E",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "20.127.249.106",
  "resourceGroup": "myResourceGroup",
  "zones": ""
}
```
Make a note of the `publicIpAddress` to use later.
  
## Connect to confidential VM

There are different methods to connect to [Windows confidential VMs](#connect-to-windows-vms) and [Linux confidential VMs](#connect-to-linux-vms).

### Connect to Windows VMs

To connect to a confidential VM with a Windows OS, see [How to connect and sign on to an Azure virtual machine running Windows](../virtual-machines/windows/connect-logon.md).

### Connect to Linux VMs

For more information about connecting to Linux VMs, see [Quickstart: Create a Linux virtual machine in the Azure portal](../virtual-machines/linux/quick-create-portal.md).

1. Open your SSH client, such as PuTTY.

2. Enter your confidential VM's public IP address.

3. Connect to the VM. In PuTTY, select **Open**.

4. Enter your VM administrator username and password.

    > [!NOTE]
    > If you 're using PuTTY, you might receive a security alert that the server's host key isn't cached in the registry. If you trust the host, select **Yes** to add the key to PuTTY's cache and continue connecting. To connect just once, without adding the key, select **No**. If you don't trust the host, select **Cancel** to abandon your connection.
## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources. 

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Create a confidential VM on AMD with an ARM template](quick-create-confidential-vm-arm-amd.md)