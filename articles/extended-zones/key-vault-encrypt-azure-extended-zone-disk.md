---
title: Encrypt disks with customer-managed keys in an Azure Extended Zone
description: Learn how to use Azure Key Vault, Disk Encryption Sets, and Azure CLI to encrypt disks for virtual machines deployed in an Azure Extended Zone
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 03/04/2026
---

# Encrypt disks with customer-managed keys in an Azure Extended Zone

In this article, you learn how to encrypt Azure managed disks with **customer-managed keys (CMK)** for virtual machines deployed in an **Azure Extended Zone**.

The process uses **Azure Key Vault** and a **Disk Encryption Set (DES)**. 

> [!NOTE]
> While Key Vault and Disk Encryption Sets (DES) can be created using either the Azure portal or Azure CLI, assigning a Disk Encryption Set to disks for Azure Extended Zone workloads is currently supported only via Azure CLI.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

- Azure CLI installed (version 2.26 or later). [Install Azure CLI](/cli/azure/install-azure-cli).

- Basic understanding of Azure Key Vault and disk encryption concepts. For more information, see [Azure Key Vault documentation](/azure/key-vault/general/overview) and [Azure Disk Encryption documentation](/azure/virtual-machines/windows/disk-encryption-overview).

## High-level architecture context 

When using customer-managed keys with Azure Extended Zones resources:
- Control plane operations (Azure Resource Manager, Key Vault metadata, DES) run in the parent Azure region.
- Data plane resources (virtual machines and disks) run in the Extended Zone location.
- Disk encryption is enforced at the managed disk level (data plane) using a Disk Encryption Set.

## Create a Key Vault, encryption key and Disk Encryption Set in an Azure Extended Zone's parent region

In this section, you create a Key Vault, encryption key and Disk Encryption Set in the parent region of an Extended Zone. 

For this example, you have flexibility as to which tool to use to create the encryption tools, but the disk creation and encryption will only work via Azure CLI. 

### Create a Key Vault and encryption key
To encrypt resources in an Azure Extended Zone, you must first create an Azure Key Vault and an RSA key **in the parent Azure region associated with your Extended Zone**. You can do this using the Azure portal, or Azure CLI / PowerShell. When creating the Key Vault, ensure the following:
- All the resources belong to the same resource group.
- Azure role-based access control (RBAC) is enabled.
- Purge protection is enabled.
- You create or import an RSA key (2048-bit or higher).


## Create a Disk Encryption Set (DES)
Next, create a Disk Encryption Set that references the Key Vault key. The Disk Encryption Set must:
- Be created in the same parent region as the Key Vault.
- Use a system-assigned managed identity.

Grant the Disk Encryption Set access to the Key Vault key by assigning it the Key Vault Crypto Service Encryption User role. 

## Deploy a virtual machine in an Azure Extended Zone
When deploying a virtual machine in an Azure Extended Zone, you must specify:

--location: the parent Azure region

--edge-zone: the Extended Zone name

The following example creates a Windows Server 2022 VM in the Los Angeles Extended Zone, using West US as the parent region.

```cli
az vm create --resource-group 'myResourceGroup' --name 'myVM' --image Win2022Datacenter --size Standard_DS4_v2 --admin-username 'username' --admin-password 'password' --edge-zone losangeles --location westus 

```

## Create an encrypted managed disk using a Disk Encryption Set (CLI only)

After creating the VM, create a managed disk encrypted with your Disk Encryption Set. This step explicitly applies customer-managed keys to the disk.

```cli
az disk create --resource-group 'myResourceGroup' --name 'myDisk' --edge-zone losangeles --location westus --size 64 --sku Premium_LRS --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set DES_ID
```

### Verify disk encryption

Use the following command to confirm that the disk is encrypted with a customer-managed key and associated with the correct Disk Encryption Set:

``` cli
az disk show -g 'myResourceGroup' -n 'myDisk' --query "{encryptionType:encryption.type, desId:encryption.diskEncryptionSetId}" -o json
```
### Attach the encrypted disk to the VM

Finally, once verified, attach the encrypted disk to the VM using the following command:
```cli
az vm disk attach --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'myDisk'
```

## Clean up resources
If you're done working with resources from this tutorial, use the following instructions to delete the resource group and all resources it contains:

```cli
az group delete --name 'myResourceGroup' --yes --no-wait
```

## Related content
- [Azure Key Vault documentation](/azure/key-vault/general/overview)
- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
