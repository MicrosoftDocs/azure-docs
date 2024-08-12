---
title: Filter network traffic - Azure CLI
description: In this article, you learn how to filter network traffic to a subnet, with a network security group, using the Azure CLI.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/09/2024
ms.author: allensu
ms.custom: devx-track-azurecli
# Customer intent: I want to filter network traffic to virtual machines that perform similar functions, such as web servers.
---

# Filter network traffic with a network security group using the Azure CLI

You can filter network traffic inbound to and outbound from a virtual network subnet with a network security group. Network security groups contain security rules that filter network traffic by IP address, port, and protocol. Security rules are applied to resources deployed in a subnet. In this article, you learn how to:

* Create a network security group and security rules
* Create a virtual network and associate a network security group to a subnet
* Deploy virtual machines (VM) into a subnet
* Test traffic filters

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a network security group

A network security group contains security rules. Security rules specify a source and destination. Sources and destinations can be application security groups.

### Create application security groups

First create a resource group for all the resources created in this article with [az group create](/cli/azure/group). The following example creates a resource group in the *westus2* location: 

```azurecli-interactive
az group create \
  --name test-rg \
  --location westus2
```

Create an application security group with [az network asg create](/cli/azure/network/asg). An application security group enables you to group servers with similar port filtering requirements. The following example creates two application security groups.

```azurecli-interactive
az network asg create \
  --resource-group test-rg \
  --name asg-web-servers \
  --location westus2

az network asg create \
  --resource-group test-rg \
  --name asg-mgmt-servers \
  --location westus2
```

### Create a network security group

Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *nsg-1*: 

```azurecli-interactive 
# Create a network security group
az network nsg create \
  --resource-group test-rg \
  --name nsg-1
```

### Create security rules

Create a security rule with [az network nsg rule create](/cli/azure/network/nsg/rule). The following example creates a rule that allows traffic inbound from the internet to the *asg-web-servers* application security group over ports 80 and 443:

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-1 \
  --name Allow-Web-All \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 100 \
  --source-address-prefix Internet \
  --source-port-range "*" \
  --destination-asgs "asg-web-servers" \
  --destination-port-range 80 443
```

The following example creates a rule that allows traffic inbound from the Internet to the *asg-mgmt-servers* application security group over port 22:

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-1 \
  --name Allow-SSH-All \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 110 \
  --source-address-prefix Internet \
  --source-port-range "*" \
  --destination-asgs "asg-mgmt-servers" \
  --destination-port-range 22
```

In this article, the *asg-mgmt-servers* asg exposes SSH (port 22) to the internet. For production environments, use a [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [private](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json) network connection to manage Azure resources instead of exposing port 22 to the internet.

## Create a virtual network

Create a virtual network with [az network vnet create](/cli/azure/network/vnet). The following example creates a virtual named *vnet-1*:

```azurecli-interactive 
az network vnet create \
  --name vnet-1 \
  --resource-group test-rg \
  --address-prefixes 10.0.0.0/16
```

Add a subnet to a virtual network with [az network vnet subnet create](/cli/azure/network/vnet/subnet). The following example adds a subnet named *subnet-1* to the virtual network and associates the *nsg-1* network security group to it:

```azurecli-interactive
az network vnet subnet create \
  --vnet-name vnet-1 \
  --resource-group test-rg \
  --name subnet-1 \
  --address-prefix 10.0.0.0/24 \
  --network-security-group nsg-1
```

## Create virtual machines

Create two VMs in the virtual network so you can validate traffic filtering in a later step. 

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM that serves as a web server. The `--asgs asg-web-servers` option causes Azure to make the network interface it creates for the VM a member of the *asg-web-servers* application security group. The `--nsg ""` option is specified to prevent Azure from creating a default network security group for the network interface Azure creates when it creates the VM. The command prompts you to create a password for the VM. SSH keys aren't used in this example to facilitate the later steps in this article. In a production environment, use SSH keys for security.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-web \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-1 \
  --nsg "" \
  --asgs asg-web-servers \
  --admin-username azureuser \
  --authentication-type password \
  --assign-identity
```

The VM takes a few minutes to create. After the VM is created, output similar to the following example is returned: 

```output
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-web",
  "location": "westus2",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "203.0.113.24",
  "resourceGroup": "test-rg"
}
```

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM that serves as a management server. The `--asgs asg-mgmt-servers` option causes Azure to make the network interface it creates for the VM a member of the *asg-mgmt-servers* application security group.

The following example creates a VM and adds a user account. The `--generate-ssh-keys` parameter causes the CLI to look for an available ssh key in `~/.ssh`. If one is found, that key is used. If not, one is generated and stored in `~/.ssh`. Finally, we deploy the latest `Ubuntu 22.04` image.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-mgmt \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-1 \
  --nsg "" \
  --asgs asg-mgmt-servers \
  --admin-username azureuser \
  --generate-ssh-keys \
  --assign-identity
```

The VM takes a few minutes to create. Don't continue with the next step until Azure finishes creating the VM.

## Enable Microsoft Entra ID sign in for the virtual machines

The following code example the extension to enable a Microsoft Entra ID sign-in for a Linux VM. VM extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines.

```bash
az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADSSHLoginForLinux \
    --resource-group test-rg \
    --vm-name vm-web

az vm extension set \
    --publisher Microsoft.Azure.ActiveDirectory \
    --name AADSSHLoginForLinux \
    --resource-group test-rg \
    --vm-name vm-mgmt
```

## Test traffic filters

Using an SSH client of your choice, connect to the VMs created previously. For example, the following command can be used from a command line interface such as [Windows Subsystem for Linux](/windows/wsl/install) to create an SSH session with the *vm-mgmt* VM. In the previous steps, we enabled Microsoft Entra ID sign-in for the VMs. You can sign-in to the virtual machines using your Microsoft Entra ID credentials or you can use the SSH key that you used to create the VMs. In the following example, we use the SSH key to sign in to management VM and then sign in to the web VM from the management VM with a password.

For more information about how to SSH to a Linux VM and sign in with Microsoft Entra ID, see [Sign in to a Linux virtual machine in Azure by using Microsoft Entra ID and OpenSSH](/entra/identity/devices/howto-vm-sign-in-azure-ad-linux).

### Store IP address of VM in order to SSH

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group test-rg --name vm-mgmt --query publicIps --output tsv)
```

```bash
ssh -o StrictHostKeyChecking=no azureuser@$IP_ADDRESS
```

The connection succeeds because the network interface attached to the *vm-mgmt* VM is in the *asg-mgmt-servers* application security group, which allows port 22 inbound from the Internet.

Use the following command to SSH to the *vm-web* VM from the *vm-mgmt* VM:

```bash 
ssh -o StrictHostKeyChecking=no azureuser@vm-web
```

The connection succeeds because a default security rule within each network security group allows traffic over all ports between all IP addresses within a virtual network. You can't SSH to the *vm-web* VM from the Internet because the security rule for the *asg-web-servers* doesn't allow port 22 inbound from the Internet.

Use the following commands to install the nginx web server on the *vm-web* VM:

```bash 
# Update package source
sudo apt-get -y update

# Install NGINX
sudo apt-get -y install nginx
```

The *vm-web* VM is allowed outbound to the Internet to retrieve nginx because a default security rule allows all outbound traffic to the Internet. Exit the *vm-web* SSH session, which leaves you at the `username@vm-mgmt:~$` prompt of the *vm-mgmt* VM. To retrieve the nginx welcome screen from the *vm-web* VM, enter the following command:

```bash
curl vm-web
```

Sign out of the *vm-mgmt* VM. To confirm that you can access the *vm-web* web server from outside of Azure, enter `curl <publicIpAddress>` from your own computer. The connection succeeds because the *asg-web-servers* application security group, which the network interface attached to the *vm-web* VM is in, allows port 80 inbound from the Internet.

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

## Next steps

In this article, you created a network security group and associated it to a virtual network subnet. To learn more about network security groups, see [Network security group overview](./network-security-groups-overview.md) and [Manage a network security group](manage-network-security-group.md).

Azure routes traffic between subnets by default. You can instead, choose to route traffic between subnets through a VM, serving as a firewall, for example. To learn how, see [Create a route table](tutorial-create-route-table-cli.md).
