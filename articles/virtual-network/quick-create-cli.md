---
title: 'Quickstart: Use the Azure CLI to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use the Azure CLI to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/15/2023
ms.author: allensu
ms.custom: devx-track-azurecli, mode-api
#Customer intent: As a network administrator, I want to use the Azure CLI to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use the Azure CLI to create a virtual network

This quickstart shows you how to create a virtual network by using the Azure CLI, the Azure command-line interface. You then create two virtual machines (VMs) in the network, securely connect to the VMs from the internet, and start private communication between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in the virtual network quickstart.":::

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a resource group

Use [az group create](/cli/azure/group#az-group-create) to create a resource group to host the virtual network. Use the following code to create a resource group named **test-rg** in the **eastus2** Azure region:

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

## Create a virtual network and subnet

Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named **vnet-1** with a subnet named **subnet-1** in the **test-rg** resource group:

```azurecli-interactive
az network vnet create \
    --name vnet-1 \
    --resource-group test-rg \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration.

[!INCLUDE [Pricing](../../includes/bastion-pricing.md)] For more information about Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md).

1. Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurecli-interactive
    az network vnet subnet create \
        --name AzureBastionSubnet \
        --resource-group test-rg \
        --vnet-name vnet-1 \
        --address-prefix 10.0.1.0/26
    ```

1. Create a public IP address for Bastion. This IP address is used to connect to the Bastion host from the internet. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address named **public-ip** in the **test-rg** resource group:

    ```azurecli-interactive
    az network public-ip create \
        --resource-group test-rg \
        --name public-ip \
        --sku Standard \
        --location eastus2 \
        --zone 1 2 3
    ```

1. Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create a Bastion host in **AzureBastionSubnet** for your virtual network:

    ```azurecli-interactive
    az network bastion create \
        --name bastion \
        --public-ip-address public-ip \
        --resource-group test-rg \
        --vnet-name vnet-1 \
        --location eastus2
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [az vm create](/cli/azure/vm#az-vm-create) to create two VMs named **vm-1** and **vm-2** in the **subnet-1** subnet of the virtual network. When you're prompted for credentials, enter user names and passwords for the VMs.

1. To create the first VM, use the following command:

    ```azurecli-interactive
    az vm create \
        --resource-group test-rg \
        --admin-username azureuser \
        --authentication-type password \
        --name vm-1 \
        --image Ubuntu2204 \
        --public-ip-address ""
    ```

1. To create the second VM, use the following command:

    ```azurecli-interactive
    az vm create \
        --resource-group test-rg \
        --admin-username azureuser \
        --authentication-type password \
        --name vm-2 \
        --image Ubuntu2204 \
        --public-ip-address ""
    ```

> [!TIP]
> You can also use the `--no-wait` option to create a VM in the background while you continue with other tasks.

The VMs take a few minutes to create. After Azure creates each VM, the Azure CLI returns output similar to the following message:

```output
    {
      "fqdns": "",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-2",
      "location": "eastus2",
      "macAddress": "00-0D-3A-23-9A-49",
      "powerState": "VM running",
      "privateIpAddress": "10.0.0.5",
      "publicIpAddress": "",
      "resourceGroup": "test-rg"
      "zones": ""
    }
```

> [!NOTE]
> VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Connect to a virtual machine

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** information for **vm-1**, select **Connect**.

1. On the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password that you created when you created the VM, and then select **Connect**.

## Start communication between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.5) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to **vm-1**.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to **vm-2**.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to **vm-2**.

## Clean up resources

When you finish with the virtual network and the VMs, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources:

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```

## Next steps

In this quickstart, you created a virtual network with a default subnet that contains two VMs. You deployed Bastion, and you used it to connect to the VMs and establish communication between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs in a virtual network is unrestricted by default. To learn more about configuring various types of VM network communications, continue to the next article:

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
