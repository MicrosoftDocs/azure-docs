---
title: Restrict data exfiltration to Azure Storage - Azure CLI
description: In this article, you learn how to limit and restrict virtual network data exfiltration to Azure Storage resources with virtual network service endpoint policies using the Azure CLI.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
tags: azure-resource-manager
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: how-to
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: allensu
ms.custom: devx-track-azurecli, devx-track-linux
# Customer intent: I want only specific Azure Storage account to be allowed access from a virtual network subnet.
---

# Manage data exfiltration to Azure Storage accounts with virtual network service endpoint policies using the Azure CLI

Virtual network service endpoint policies enable you to apply access control on Azure Storage accounts from within a virtual network over service endpoints. This is a key to securing your workloads, managing what storage accounts are allowed and where data exfiltration is allowed.
In this article, you learn how to:

* Create a virtual network and add a subnet.
* Enable service endpoint for Azure Storage.
* Create two Azure Storage accounts and allow network access to it from the subnet created above.
* Create a service endpoint policy to allow access only to one of the storage accounts.
* Deploy a virtual machine (VM) to the subnet.
* Confirm access to the allowed storage account from the subnet.
* Confirm access is denied to the non-allowed storage account from the subnet.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a virtual network

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create \
  --name myResourceGroup \
  --location eastus
```

Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --address-prefix 10.0.0.0/16 \
  --subnet-name Private \
  --subnet-prefix 10.0.0.0/24
```

## Enable a service endpoint 

In this example, a service endpoint for *Microsoft.Storage* is created for the subnet *Private*: 

```azurecli-interactive
az network vnet subnet create \
  --vnet-name myVirtualNetwork \
  --resource-group myResourceGroup \
  --name Private \
  --address-prefix 10.0.0.0/24 \
  --service-endpoints Microsoft.Storage
```

## Restrict network access for a subnet

Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *myNsgPrivate*.

```azurecli-interactive
az network nsg create \
  --resource-group myResourceGroup \
  --name myNsgPrivate
```

Associate the network security group to the *Private* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet). The following example associates the *myNsgPrivate* network security group to the *Private* subnet:

```azurecli-interactive
az network vnet subnet update \
  --vnet-name myVirtualNetwork \
  --name Private \
  --resource-group myResourceGroup \
  --network-security-group myNsgPrivate
```

Create security rules with [az network nsg rule create](/cli/azure/network/nsg/rule). The rule that follows allows outbound access to the public IP addresses assigned to the Azure Storage service: 

```azurecli-interactive
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNsgPrivate \
  --name Allow-Storage-All \
  --access Allow \
  --protocol "*" \
  --direction Outbound \
  --priority 100 \
  --source-address-prefix "VirtualNetwork" \
  --source-port-range "*" \
  --destination-address-prefix "Storage" \
  --destination-port-range "*"
```

Each network security group contains several [default security rules](./network-security-groups-overview.md#default-security-rules). The rule that follows overrides a default security rule that allows outbound access to all public IP addresses. The `destination-address-prefix "Internet"` option denies outbound access to all public IP addresses. The previous rule overrides this rule, due to its higher priority, which allows access to the public IP addresses of Azure Storage.

```azurecli-interactive
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNsgPrivate \
  --name Deny-Internet-All \
  --access Deny \
  --protocol "*" \
  --direction Outbound \
  --priority 110 \
  --source-address-prefix "VirtualNetwork" \
  --source-port-range "*" \
  --destination-address-prefix "Internet" \
  --destination-port-range "*"
```

The following rule allows SSH traffic inbound to the subnet from anywhere. The rule overrides a default security rule that denies all inbound traffic from the internet. SSH is allowed to the subnet so that connectivity can be tested in a later step.

```azurecli-interactive
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNsgPrivate \
  --name Allow-SSH-All \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 120 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "VirtualNetwork" \
  --destination-port-range "22"
```

## Restrict network access to Azure Storage accounts

This section lists steps to restrict network access for an Azure Storage account from the given subnet in a Virtual network via service endpoint.

### Create a storage account

Create two Azure storage accounts with [az storage account create](/cli/azure/storage/account).

```azurecli-interactive
storageAcctName1="allowedstorageacc"

az storage account create \
  --name $storageAcctName1 \
  --resource-group myResourceGroup \
  --sku Standard_LRS \
  --kind StorageV2

storageAcctName2="notallowedstorageacc"

az storage account create \
  --name $storageAcctName2 \
  --resource-group myResourceGroup \
  --sku Standard_LRS \
  --kind StorageV2
```

After the storage accounts are created, retrieve the connection string for the storage accounts into a variable with [az storage account show-connection-string](/cli/azure/storage/account). The connection string is used to create a file share in a later step.

```azurecli-interactive
saConnectionString1=$(az storage account show-connection-string \
  --name $storageAcctName1 \
  --resource-group myResourceGroup \
  --query 'connectionString' \
  --out tsv)

saConnectionString2=$(az storage account show-connection-string \
  --name $storageAcctName2 \
  --resource-group myResourceGroup \
  --query 'connectionString' \
  --out tsv)
```

<a name="account-key"></a>View the contents of the variable and note the value for **AccountKey** returned in the output, because it's used in a later step.

```azurecli-interactive
echo $saConnectionString1

echo $saConnectionString2
```

### Create a file share in the storage account

Create a file share in the storage account with [az storage share create](/cli/azure/storage/share). In a later step, this file share is mounted to confirm network access to it.

```azurecli-interactive
az storage share create \
  --name my-file-share \
  --quota 2048 \
  --connection-string $saConnectionString1 > /dev/null

az storage share create \
  --name my-file-share \
  --quota 2048 \
  --connection-string $saConnectionString2 > /dev/null
```

### Deny all network access to the storage account

By default, storage accounts accept network connections from clients in any network. To limit access to selected networks, change the default action to *Deny* with [az storage account update](/cli/azure/storage/account). Once network access is denied, the storage account is not accessible from any network.

```azurecli-interactive
az storage account update \
  --name $storageAcctName1 \
  --resource-group myResourceGroup \
  --default-action Deny

az storage account update \
  --name $storageAcctName2 \
  --resource-group myResourceGroup \
  --default-action Deny
```

### Enable network access from virtual network subnet

Allow network access to the storage account from the *Private* subnet with [az storage account network-rule add](/cli/azure/storage/account/network-rule).

```azurecli-interactive
az storage account network-rule add \
  --resource-group myResourceGroup \
  --account-name $storageAcctName1 \
  --vnet-name myVirtualNetwork \
  --subnet Private

az storage account network-rule add \
  --resource-group myResourceGroup \
  --account-name $storageAcctName2 \
  --vnet-name myVirtualNetwork \
  --subnet Private
```

## Apply policy to allow access to valid storage account

Azure Service Endpoint policies are only available for Azure Storage. So, we'll be enabling Service Endpoint for *Microsoft.Storage* on this subnet for this example setup.

Service endpoint policies are applied over service endpoints. We will start by creating a service endpoint policy. We will then create the policy definitions under this policy for Azure Storage accounts to be approved for this subnet

Create a service endpoint policy

```azurecli-interactive
az network service-endpoint policy create \
  --resource-group myResourceGroup \
  --name mysepolicy \
  --location eastus
```

Save the resource URI for the allowed storage account in a variable. Before executing the command below, replace *\<your-subscription-id>* with actual value of your subscription ID.

```azurecli-interactive
$serviceResourceId="/subscriptions/<your-subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/allowedstorageacc"
```

Create & add a policy definition for allowing the above Azure Storage account to the service endpoint policy

```azurecli-interactive
az network service-endpoint policy-definition create \
  --resource-group myResourceGroup \
  --policy-name mysepolicy \
  --name mypolicydefinition \
  --service "Microsoft.Storage" \
  --service-resources $serviceResourceId
```

And update the virtual network subnet to associate with it the service endpoint policy created in the previous step

```azurecli-interactive
az network vnet subnet update \
  --vnet-name myVirtualNetwork \
  --resource-group myResourceGroup \
  --name Private \
  --service-endpoints Microsoft.Storage \
  --service-endpoint-policy mysepolicy
```

## Validate access restriction to Azure Storage accounts

### Create the virtual machine

To test network access to a storage account, deploy a VM to the subnet.

Create a VM in the *Private* subnet with [az vm create](/cli/azure/vm). If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVmPrivate \
  --image <SKU linux image> \
  --vnet-name myVirtualNetwork \
  --subnet Private \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After creation, take note of the **publicIpAddress** in the output returned. This address is used to access the VM from the internet in a later step.

### Confirm access to storage account

SSH into the *myVmPrivate* VM. Replace *\<publicIpAddress>* with the public IP address of your *myVmPrivate* VM.

```bash 
ssh <publicIpAddress>
```

Create a folder for a mount point:

```bash
sudo mkdir /mnt/MyAzureFileShare1
```

Mount the Azure file share to the directory you created. Before executing the command below, replace *\<storage-account-key>* with value of *AccountKey* from **$saConnectionString1**.

```bash
sudo mount --types cifs //allowedstorageacc.file.core.windows.net/my-file-share /mnt/MyAzureFileShare1 --options vers=3.0,username=allowedstorageacc,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

You receive the `user@myVmPrivate:~$` prompt. The Azure file share successfully mounted to */mnt/MyAzureFileShare*.

### Confirm access is denied to storage account

From the same VM *myVmPrivate*, create a directory for a mount point:

```bash
sudo mkdir /mnt/MyAzureFileShare2
```

Attempt to mount the Azure file share from storage account *notallowedstorageacc* to the directory you created. 
This article assumes you deployed the latest version of Linux distribution. If you are using earlier versions of Linux distribution, see [Mount on Linux](../storage/files/storage-how-to-use-files-linux.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for additional instructions about mounting file shares. 

Before executing the command below, replace *\<storage-account-key>* with value of *AccountKey* from **$saConnectionString2**.

```bash
sudo mount --types cifs //notallowedstorageacc.file.core.windows.net/my-file-share /mnt/MyAzureFileShare2 --options vers=3.0,username=notallowedstorageacc,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

Access is denied, and you receive a `mount error(13): Permission denied` error, because this storage account is not in the allow list of the service endpoint policy we applied to the subnet. 

Exit the SSH session to the *myVmPublic* VM.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you applied a service endpoint policy over an Azure virtual network service endpoint to Azure Storage. You created Azure Storage accounts and limited network access to only certain storage accounts (and thus denied others) from a virtual network subnet. To learn more about service endpoint policies, see [Service endpoints policies overview](virtual-network-service-endpoint-policies-overview.md).
