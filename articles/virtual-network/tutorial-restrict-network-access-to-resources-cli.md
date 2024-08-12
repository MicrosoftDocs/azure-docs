---
title: Restrict network access to PaaS resources - Azure CLI
description: In this article, you learn how to limit and restrict network access to Azure resources, such as Azure Storage and Azure SQL Database, with virtual network service endpoints using the Azure CLI.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/11/2024
ms.author: allensu
ms.custom: devx-track-azurecli
# Customer intent: I want only resources in a virtual network subnet to access an Azure PaaS resource, such as an Azure Storage account.
---

# Restrict network access to PaaS resources with virtual network service endpoints using the Azure CLI

Virtual network service endpoints enable you to limit network access to some Azure service resources to a virtual network subnet. You can also remove internet access to the resources. Service endpoints provide direct connection from your virtual network to supported Azure services, allowing you to use your virtual network's private address space to access the Azure services. Traffic destined to Azure resources through service endpoints always stays on the Microsoft Azure backbone network. In this article, you learn how to:

* Create a virtual network with one subnet
* Add a subnet and enable a service endpoint
* Create an Azure resource and allow network access to it from only a subnet
* Deploy a virtual machine (VM) to each subnet
* Confirm access to a resource from a subnet
* Confirm access is denied to a resource from a subnet and the internet

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a virtual network

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *test-rg* in the *eastus* location.

```azurecli-interactive
az group create \
  --name test-rg \
  --location eastus
```

Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
  --name vnet-1 \
  --resource-group test-rg \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-public \
  --subnet-prefix 10.0.0.0/24
```

## Enable a service endpoint 

You can enable service endpoints only for services that support service endpoints. View service endpoint-enabled services available in an Azure location with [az network vnet list-endpoint-services](/cli/azure/network/vnet). The following example returns a list of service-endpoint-enabled services available in the *eastus* region. The list of services returned will grow over time, as more Azure services become service endpoint enabled.

```azurecli-interactive
az network vnet list-endpoint-services \
  --location eastus \
  --out table
``` 

Create an additional subnet in the virtual network with [az network vnet subnet create](/cli/azure/network/vnet/subnet). In this example, a service endpoint for *Microsoft.Storage* is created for the subnet: 

```azurecli-interactive
az network vnet subnet create \
  --vnet-name vnet-1 \
  --resource-group test-rg \
  --name subnet-private \
  --address-prefix 10.0.1.0/24 \
  --service-endpoints Microsoft.Storage
```

## Restrict network access for a subnet

Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *nsg-private*.

```azurecli-interactive
az network nsg create \
  --resource-group test-rg \
  --name nsg-private
```

Associate the network security group to the *subnet-private* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet). The following example associates the *nsg-private* network security group to the *subnet-private* subnet:

```azurecli-interactive
az network vnet subnet update \
  --vnet-name vnet-1 \
  --name subnet-private \
  --resource-group test-rg \
  --network-security-group nsg-private
```

Create security rules with [az network nsg rule create](/cli/azure/network/nsg/rule). The rule that follows allows outbound access to the public IP addresses assigned to the Azure Storage service: 

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-private \
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
  --resource-group test-rg \
  --nsg-name nsg-private \
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
  --resource-group test-rg \
  --nsg-name nsg-private \
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

## Restrict network access to a resource

The steps necessary to restrict network access to resources created through Azure services enabled for service endpoints varies across services. See the documentation for individual services for specific steps for each service. The remainder of this article includes steps to restrict network access for an Azure Storage account, as an example.

### Create a storage account

Create an Azure storage account with [az storage account create](/cli/azure/storage/account). Replace `<replace-with-your-unique-storage-account-name>` with a name that is unique across all Azure locations, between 3-24 characters in length, using only numbers and lower-case letters.

```azurecli-interactive
storageAcctName="<replace-with-your-unique-storage-account-name>"

az storage account create \
  --name $storageAcctName \
  --resource-group test-rg \
  --sku Standard_LRS \
  --kind StorageV2
```

After the storage account is created, retrieve the connection string for the storage account into a variable with [az storage account show-connection-string](/cli/azure/storage/account). The connection string is used to create a file share in a later step.

For the purposes of this tutorial, the connection string is used to connect to the storage account. Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

For more information about connecting to a storage account using a managed identity, see [Use a managed identity to access Azure Storage](/entra/identity/managed-identities-azure-resources/tutorial-linux-managed-identities-vm-access?pivots=identity-linux-mi-vm-access-storage).

```azurecli-interactive
saConnectionString=$(az storage account show-connection-string \
  --name $storageAcctName \
  --resource-group test-rg \
  --query 'connectionString' \
  --out tsv)
```

<a name="account-key"></a>View the contents of the variable and note the value for **AccountKey** returned in the output, because it's used in a later step.

```azurecli-interactive
echo $saConnectionString
```

### Create a file share in the storage account

Create a file share in the storage account with [az storage share create](/cli/azure/storage/share). In a later step, this file share is mounted to confirm network access to it.

```azurecli-interactive
az storage share create \
  --name file-share \
  --quota 2048 \
  --connection-string $saConnectionString > /dev/null
```

### Deny all network access to a storage account

By default, storage accounts accept network connections from clients in any network. To limit access to selected networks, change the default action to *Deny* with [az storage account update](/cli/azure/storage/account). Once network access is denied, the storage account is not accessible from any network.

```azurecli-interactive
az storage account update \
  --name $storageAcctName \
  --resource-group test-rg \
  --default-action Deny
```

### Enable network access from a subnet

Allow network access to the storage account from the *subnet-private* subnet with [az storage account network-rule add](/cli/azure/storage/account/network-rule).

```azurecli-interactive
az storage account network-rule add \
  --resource-group test-rg \
  --account-name $storageAcctName \
  --vnet-name vnet-1 \
  --subnet subnet-private
```
## Create virtual machines

To test network access to a storage account, deploy a VM to each subnet.

### Create the first virtual machine

Create a VM in the *subnet-public* subnet with [az vm create](/cli/azure/vm). If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-public \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-public \
  --admin-username azureuser \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After the VM is created, the Azure CLI shows information similar to the following example: 

```azurecli 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-public",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "203.0.113.24",
  "resourceGroup": "test-rg"
}
```

### Create the second virtual machine

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-private \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-private \
  --admin-username azureuser \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After creation, take note of the **publicIpAddress** in the output returned. This address is used to access the VM from the internet in a later step.

## Confirm access to storage account

SSH into the *vm-private* VM.

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group test-rg --name vm-private --query publicIps --output tsv)
```

```bash 
ssh -o StrictHostKeyChecking=no azureuser@$IP_ADDRESS
```

Create a folder for a mount point:

```bash
sudo mkdir /mnt/file-share
```

Mount the Azure file share to the directory you created. Before running the following command, replace `<storage-account-name>` with the account name and `<storage-account-key>` with the key you retrieved in [Create a storage account](#create-a-storage-account).

```bash
sudo mount --types cifs //<storage-account-name>.file.core.windows.net/my-file-share /mnt/file-share --options vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

You receive the `user@vm-private:~$` prompt. The Azure file share successfully mounted to */mnt/file-share*.

Confirm that the VM has no outbound connectivity to any other public IP addresses:

```bash
ping bing.com -c 4
```

You receive no replies, because the network security group associated to the *subnet-private* subnet does not allow outbound access to public IP addresses other than the addresses assigned to the Azure Storage service.

Exit the SSH session to the *vm-private* VM.

## Confirm access is denied to storage account

SSH into the *vm-public* VM.

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group test-rg --name vm-public --query publicIps --output tsv)
```

```bash 
ssh -o StrictHostKeyChecking=no azureuser@$IP_ADDRESS
```

Create a directory for a mount point:

```bash
sudo mkdir /mnt/file-share
```

Attempt to mount the Azure file share to the directory you created. This article assumes you deployed the latest version of Ubuntu. If you are using earlier versions of Ubuntu, see [Mount on Linux](../storage/files/storage-how-to-use-files-linux.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for additional instructions about mounting file shares. Before running the following command, replace `<storage-account-name>` with the account name and `<storage-account-key>` with the key you retrieved in [Create a storage account](#create-a-storage-account):

```bash
sudo mount --types cifs //storage-account-name>.file.core.windows.net/file-share /mnt/file-share --options vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

Access is denied, and you receive a `mount error(13): Permission denied` error, because the *vm-public* VM is deployed within the *subnet-public* subnet. The *subnet-public* subnet does not have a service endpoint enabled for Azure Storage, and the storage account only allows network access from the *subnet-private* subnet, not the *subnet-public* subnet.

Exit the SSH session to the *vm-public* VM.

From your computer, attempt to view the shares in your storage account with [az storage share list](/cli/azure/storage/share). Replace `<account-name>` and `<account-key>` with the storage account name and key from [Create a storage account](#create-a-storage-account):

```azurecli-interactive
az storage share list \
  --account-name <account-name> \
  --account-key <account-key>
```

Access is denied and you receive a *This request is not authorized to perform this operation* error, because your computer is not in the *subnet-private* subnet of the *vnet-1* virtual network.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

## Next steps

In this article, you enabled a service endpoint for a virtual network subnet. You learned that service endpoints can be enabled for resources deployed with multiple Azure services. You created an Azure Storage account and limited network access to the storage account to only resources within a virtual network subnet. To learn more about service endpoints, see [Service endpoints overview](virtual-network-service-endpoints-overview.md) and [Manage subnets](virtual-network-manage-subnet.md).

If you have multiple virtual networks in your account, you may want to connect two virtual networks together so the resources within each virtual network can communicate with each other. To learn how, see [Connect virtual networks](tutorial-connect-virtual-networks-cli.md).
