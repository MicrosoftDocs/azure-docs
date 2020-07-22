---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/19/2020
 ms.author: rogarana
 ms.custom: include file
---
You can disable encryption using Azure PowerShell, the Azure CLI, or with a Resource Manager template. 

>[!IMPORTANT]
>Disabling encryption with Azure Disk Encryption on Linux VMs is only supported for data volumes. It is not supported on data or OS volumes if the OS volume has been encrypted.  

- **Disable disk encryption with Azure PowerShell:** To disable the encryption, use the [Disable-AzVMDisk​Encryption](/powershell/module/az.compute/disable-azvmdiskencryption) cmdlet. 
     ```azurepowershell-interactive
     Disable-AzVMDiskEncryption -ResourceGroupName 'MyVirtualMachineResourceGroup' -VMName 'MySecureVM' [-VolumeType DATA]
     ```

- **Disable encryption with the Azure CLI:** To disable encryption, use the [az vm encryption disable](/cli/azure/vm/encryption#az-vm-encryption-disable) command. 
     ```azurecli-interactive
     az vm encryption disable --name "MySecureVM" --resource-group "MyVirtualMachineResourceGroup" --volume-type DATA
     ```
- **Disable encryption with a Resource Manager template:** Use the [Disable encryption on a running Linux VM](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-running-linux-vm-without-aad) template to disable encryption.
     1. Click **Deploy to Azure**.
     2. Select the subscription, resource group, location, VM, legal terms, and agreement.
