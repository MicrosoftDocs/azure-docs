---
title: Encrypt Disks with Customer-Managed Keys in an Azure Extended Zone
description: Learn how to use Azure Key Vault, Disk Encryption Sets, and the Azure CLI to encrypt disks for virtual machines deployed in an Azure extended zone.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 03/04/2026
---

# Encrypt disks with customer-managed keys in an Azure extended zone

In this article, you learn how to encrypt Azure managed disks with customer-managed keys (CMKs) for virtual machines (VMs) deployed in an Azure extended zone.

The process uses Azure Key Vault and a disk encryption set (DES).

> [!NOTE]
> You can create a key vault and a DES by using either the Azure portal or the Azure CLI. Assigning a DES to disks for Azure Extended Zones workloads is currently supported only via the Azure CLI.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to an extended zone. For more information, see [Request access to an Azure extended zone](request-access.md).
- The Azure CLI installed (version 2.26 or later). [Install the Azure CLI](/cli/azure/install-azure-cli).
- A basic understanding of Azure Key Vault and disk encryption concepts. For more information, see [Azure Key Vault documentation](/azure/key-vault/general/overview) and [Azure Disk Encryption documentation](/azure/virtual-machines/windows/disk-encryption-overview).

## High-level architecture context

When you use CMKs with Azure Extended Zones resources:

- Control plane operations (Azure Resource Manager, Key Vault metadata, and DES) run in the parent Azure region.
- Data plane resources (VMs and disks) run in the extended zone location.
- Disk encryption is enforced at the managed disk level (data plane) by using a DES.

## Create a key vault, encryption key, and DES in an Azure extended zone's parent region

In this section, you create a key vault, an encryption key, and DES in the parent region of an extended zone.

For this example, you choose which tool to use to create the encryption tools. Disk creation and encryption work only via the Azure CLI.

### Create a key vault and an encryption key

To encrypt resources in an Azure extended zone, you must first create an Azure key vault and an RSA key *in the parent Azure region associated with your extended zone*. You can do this task by using the Azure portal. You can also use the Azure CLI or Azure PowerShell. When you create the key vault, ensure that the following tasks occurred:

- All the resources belong to the same resource group.
- Azure role-based access control is enabled.
- Purge protection is enabled.
- An RSA key (2048-bit or later) is created or imported.

## Create a disk encryption set

Next, create a DES that references the Key Vault key. The DES must:

- Be created in the same parent region as the key vault.
- Use a system-assigned managed identity.

Grant the DES access to the Key Vault key by assigning it the Key Vault Crypto Service Encryption User role.

## Deploy a virtual machine in an Azure extended zone

When you deploy a VM in an Azure extended zone, you must specify:

* `--location`: The parent Azure region.
* `--edge-zone`: The extended zone name.

The following example creates a Windows Server 2022 VM in the Los Angeles extended zone by using West US as the parent region.

```cli
az vm create --resource-group 'myResourceGroup' --name 'myVM' --image Win2022Datacenter --size Standard_DS4_v2 --admin-username 'username' --admin-password 'password' --edge-zone losangeles --location westus 

```

## Create an encrypted managed disk by using a DES (CLI only)

After you create the VM, create a managed disk encrypted with your DES. This step explicitly applies CMKs to the disk.

```cli
az disk create --resource-group 'myResourceGroup' --name 'myDisk' --edge-zone losangeles --location westus --size 64 --sku Premium_LRS --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set DES_ID
```

### Verify disk encryption

Use the following command to confirm that the disk is encrypted with a CMK and associated with the correct DES:

``` cli
az disk show -g 'myResourceGroup' -n 'myDisk' --query "{encryptionType:encryption.type, desId:encryption.diskEncryptionSetId}" -o json
```

### Attach the encrypted disk to the VM

After verification, attach the encrypted disk to the VM by using the following command:

```cli
az vm disk attach --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'myDisk'
```

## Clean up resources

If you're finished working with resources from this tutorial, follow these instructions to delete the resource group and all the resources that it contains:

```cli
az group delete --name 'myResourceGroup' --yes --no-wait
```

## Related content

- [Azure Key Vault documentation](/azure/key-vault/general/overview)
- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
