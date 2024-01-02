---
title: Access the payShield manager for your Azure Payment HSM
description: Access the payShield manager for your Azure Payment HSM
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 09/12/2022
---

# Tutorial: Access the payShield manager for your payment HSM

After you have [Created an Azure Payment HSM](create-payment-hsm.md), you can create a virtual machine on the same virtual network and use it to access the Thales payShield manager.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a subnet for your virtual machine
> * Create a virtual machine
> * Test Connectivity to your VM, and from the VM to your payment HSM
> * Log into the VM to access the payShield manager

To complete this tutorial, you will need:

- The name of your payment HSM's virtual network. This tutorial assumes the name used in the previous tutorial: "myVNet".
- The address space of your virtual network. This tutorial assumes the address space used in the previous tutorial: "10.0.0.0/16".

## Create a VM subnet

# [Azure CLI](#tab/azure-cli)

Create a subnet for your virtual machine, on the same virtual network as your payment HSM, using the Azure CLI [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command. You must provide a value to the--address-prefixes argument that falls within the VNet's address space, but differs from the payment HSM subnet addresses.

```azurecli-interactive
az network vnet subnet create -g "myResourceGroup" --vnet-name "myVNet" -n "myVMSubnet" --address-prefixes "10.0.1.0/24"
```

The Azure CLI [az network vnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) command will list two subnets associated with your VNet: the subnet with your payment HSM ("mySubnet"), and the newly created "myVMSubnet" subnet.

```azurecli-interactive
az network vnet show -n "myVNet" -g "myResourceGroup"
```

# [Azure PowerShell](#tab/azure-powershell)

First, save the details of your VNet to a variable using the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup"
```

Next, configure a subnet for your virtual machine, on the same virtual network as your payment HSM, using the Azure PowerShell [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) command. You must provide a value to the `--address-prefixes` argument that falls within the VNet's address space, but differs from the payment HSM subnet addresses.

```azurepowershell-interactive
$vmSubnet = New-AzVirtualNetworkSubnetConfig -Name "myVMSubnet" -AddressPrefix "10.0.1.0/24"  
```

Lastly, add the subnet configuration to your VNet variable, and then pass the variable to the Azure PowerShell [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
$vnet.Subnets.Add($vmSubnet)
                   
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

The Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet will now list two subnets associated with your VNet: the subnet with your payment HSM ("mySubnet"), and the newly created "myVMSubnet" subnet.

```azurepowershell-interactive
Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup"
```

# [Portal](#tab/azure-portal)

---

## Create a VM

# [Azure CLI](#tab/azure-cli)

Create a VM on your new subnet, using the Azure CLI [az vm create](/cli/azure/vm#az-vm-create) command. (In this example we will create a Linux VM, but you could also create a Windows VM by augmenting the instructions found at [Create a Windows virtual machine with the Azure CLI](../virtual-machines/windows/quick-create-cli.md) with the details below.)  

```azurecli-interactive
az vm create \
  --resource-group "myResourceGroup" \
  --name "myVM" \
  --image "UbuntuLTS" \
  --vnet-name "myVNet" \
  --subnet "myVMSubnet" \
  --admin-username "azureuser" \
  --generate-ssh-keys
```

Make a note of where the public SSH key is saved, and the value for "publicIpAddress".

# [Azure PowerShell](#tab/azure-powershell)

To create a VM on your new subnet, first set your credentials with the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet. Provide a username of "azureuser" and a password of your choice, saving the object as $cred.

```azurepowershell-interactive
$cred = Get-Credential
```

Now create your VM using the Azure PowerShell [New-AzVm](/powershell/module/az.compute/new-azvm) command. (In this example we will create a Linux VM, but you could also create a Windows VM by augmenting the instructions found at [Create a Windows virtual machine with the Azure PowerShell](../virtual-machines/windows/quick-create-powershell.md) with the details below.)  

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVM" `
    -Location "eastus" `
    -Image "UbuntuLTS" `
    -PublicIpAddressName "myPubIP" `
    -VirtualNetworkName "myVNet" `
    -SubnetName "myVMSubnet" `
    -OpenPorts 22 `
    -Credential $cred `
    -GenerateSshKey `
    -SshKeyName "myVM_key"
```

Make a note of where the private SSH key is saved, and the value for "FullyQualifiedDomainName".

# [Portal](#tab/azure-portal)

To create a VM on your new subnet:

1. select "Virtual machines" from the "Create a Resource" screen of the Azure portal:
  :::image type="content" source="./media/portal-create-vm-1.png" alt-text="Screenshot of the portal resource picker.":::
1. On the "Basics" tab of the creation screen, select the resource group that contains your payment HSM ("myResourceGroup"):
  :::image type="content" source="./media/portal-create-vm-2.png" alt-text="Screenshot of the portal main VM creation screen.":::
1. On the "Networking" tab of the creation screen, select the VNet that contains your payment HSM ("myVNet"), and the subnet you created above ("myVMSubnet"):
  :::image type="content" source="./media/portal-create-vm-3.png" alt-text="Screenshot of the portal networking VM creation screen.":::
1. At the bottom of the networking tab, select "Review and create".
1. Review the details of your VM, and select "Create".
1. Select "Download private key and create resource", and save your VM's private key to a location where you can access it later.

---

## Test connectivity

To access connectivity to your virtual machine, and from your VM to the management NIC IP (10.0.0.4) and host NIC IP, SSH into your VM.  Connect to either the public IP address (for example, azureuser@20.127.60.92) or the fully qualified domain name (for example, azureuser@myvm-b82fbe.eastus.cloudapp.azure.com)

> [!NOTE]
> If created your VM using Azure PowerShell, the Azure portal, or if you did not ask Azure CLI to auto-generate ssh keys when you created the VM, you will need to supply the private key to the ssh command using the "-i" flag (for example, `ssh -i "path/to/sshkey" azureuser@<publicIpAddress-or-FullyQualifiedDomainName>`). Note that the private key **must** be protected ("chmod 400 myVM_key.pem").

```bash
ssh azureuser@<publicIpAddress-or-FullyQualifiedDomainName>
```

If ssh hangs or refuses the connection, review your NSG rules to ensure that you are able to connect to your VM.

If the connection is successful, you should be able to ping both the management NIC IP (10.0.0.4) and the host NIC IP (10.0.0.5) from your VM:

```bash
azureuser@myVM:~$ ping 10.0.0.4
PING 10.0.0.4 (10.0.0.4) 56(84) bytes of data.
64 bytes from 10.0.0.4: icmp_seq=1 ttl=63 time=1.34 ms
64 bytes from 10.0.0.4: icmp_seq=2 ttl=63 time=1.53 ms
64 bytes from 10.0.0.4: icmp_seq=3 ttl=63 time=1.40 ms
64 bytes from 10.0.0.4: icmp_seq=4 ttl=63 time=1.26 ms
^C
--- 10.0.0.4 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
rtt min/avg/max/mdev = 1.263/1.382/1.531/0.098 ms

azureuser@myVM:~$ ping 10.0.0.5
PING 10.0.0.5 (10.0.0.5) 56(84) bytes of data.
64 bytes from 10.0.0.5: icmp_seq=1 ttl=63 time=1.33 ms
64 bytes from 10.0.0.5: icmp_seq=2 ttl=63 time=1.25 ms
64 bytes from 10.0.0.5: icmp_seq=3 ttl=63 time=1.15 ms
64 bytes from 10.0.0.5: icmp_seq=4 ttl=63 time=1.37 ms
```

## Access the payShield manager

To access the payShield manager associated with your payment HSM, SSH into your VM using the -L (local) option. If you needed to use the -i option in the [test connectivity](#test-connectivity), you will need it again here.

The -L option will bind your localhost to the HSM resource. Pass to the -L flag the string "44300:`<MGMT-IP-of-payment-HSM>`:443", where `<MGMT-IP-of-HSM-resource>` represents the Management IP of your payment HSM.

```bash
ssh -L 44300:<MGMT-IP-of-payment-HSM>:443 azureuser@<publicIpAddress-or-FullyQualifiedDomainName>
```

For example, if you used "10.0.0.0" as the address prefix for your Payment HSM subnet, the Management IP will be "10.0.0.5" and your command would be:

```bash
ssh -L 44300:10.0.0.5:443 azureuser@<publicIpAddress-or-FullyQualifiedDomainName>
```

Now go to a browser on your local machine and open `https://localhost:44300` to access the payShield manager.

:::image type="content" source="./media/payshield-manager.png" alt-text="Screenshot of the payShield manager for Azure Payment HSM.":::

Here you can commission the device, install or generate LMKs, test the API, and so on. Follow payShield documentation, and contact Thales support if any issues related to payShield commission, setup, and API testing.

## Next steps

Advance to the next article to learn how to remove a commissioned payment HSM through the payShield manager.
> [!div class="nextstepaction"]
> [Remove a commissioned payment HSM](remove-payment-hsm.md)

More resources:
- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- [Create a payment HSM](create-payment-hsm.md)
