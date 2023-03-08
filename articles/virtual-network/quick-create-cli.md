---
title: 'Quickstart: Use Azure CLI to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use Azure CLI to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/06/2023
ms.author: allensu
ms.custom: devx-track-azurecli, mode-api
#Customer intent:  I want to use Azure CLI to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use Azure CLI to create a virtual network

This quickstart shows you how to create a virtual network by using Azure CLI, the Azure command-line interface. You then create two virtual machines (VMs) in the network, securely connect to the VMs from the internet, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### Azure Cloud Shell and Azure CLI

The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of each code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. The steps in this article require Azure CLI version 2.0.28 or later. Run [az version](/cli/azure/reference-index?#az-version) to find your installed version and dependent libraries, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade. If you use a local installation, sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command and following the steps.

## Create a virtual network and subnet

1. First, use [az group create](/cli/azure/group#az-group-create) to create a resource group to host the virtual network. Run the following code to create a resource group named `TestRG` in the `eastus` Azure region.

   ```azurecli-interactive
   az group create \
       --name TestRG \
       --location eastus
   ```

1. Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named `VNet1` with one subnet named `default` in the `TestRG` resource group.

   ```azurecli-interactive
   az network vnet create \
     --name VNet1 \
     --resource-group TestRG \
     --subnet-name default
   ```

## Create virtual machines

Use [az vm create](/cli/azure/vm#az-vm-create) to create two VMs named `VM1` and `VM2` in the `default` subnet of the virtual network. When you're prompted for credentials, enter user names and passwords for the VMs.

1. To create the first VM, run the following code:

   ```azurecli-interactive
   az vm create \
     --resource-group TestRG \
     --name VM1 \
     --image Win2019Datacenter \
     --public-ip-address PublicIP-VM1 \
   ```

1. To create the second VM, run the following code:

   ```azurecli-interactive
   az vm create \
     --resource-group TestRG \
     --name VM2 \
     --image Win2019Datacenter \
     --public-ip-address PublicIP-VM2 \
   ```

>[!NOTE]
>You can also use the `--no-wait` option to create a VM in the background while you continue with other tasks.

<!--[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]-->

The VMs take a few minutes to create. After Azure creates each VM, Azure CLI returns output similar to the following message:

```output
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/CreateVNetQS-rg/providers/Microsoft.Compute/virtualMachines/VM2",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "TestRG"
  "zones": ""
}
```
## Connect to a VM

Use Remote Desktop Protocol (RDP) to connect to the VMs.

1. Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to get the public IP address of VM1.

   ```azurecli-interactive
   az network public-ip show \
     --resource-group TestRG \
     --name myPublicIP-VM1 \
     --query ipAddress \
     --output tsv
   ```

1. Open a command prompt on your local computer and run the `mstsc` command to connect via RDP. Replace `<publicIpAddress>` with the public IP address for VM1.

   ```cmd
   mstsc /v:<publicIpAddress>
   ```
1. If prompted, select **Connect**.

1. Enter the user name and password you specified when creating the VM.

   > [!NOTE]
   > You might need to select **More choices** > **Use a different account** to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You might receive a certificate warning. If you do, select **Yes** or **Continue**.

## Communicate between VMs

1. From the desktop of VM1, open a command prompt and enter `ping myVM2`. You get a reply similar to the following message:

   ```cmd
   C:\windows\system32>ping VM2
   
   Pinging VM2.ovvzzdcazhbu5iczfvonhg2zrb.bx.internal.cloudapp.net with 32 bytes of data:
   Request timed out.
   Request timed out.
   Request timed out.
   Request timed out.
   
   Ping statistics for 10.0.0.5:
       Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
   ```

   The ping fails because it uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through Windows firewall.

1. To allow ICMP to inbound through Windows firewall on this VM, enter the following command:

   ```cmd
   netsh advfirewall firewall add rule name="ICMP Allow incoming V4 echo request" protocol=icmpv4:8,any dir=in action=allow
   ```

1. Close the remote desktop connection to VM1.

1. Repeat the steps in [Connect to a VM](#connect-to-a-vm) to connect to VM2.

1. On VM2, from a command prompt, enter `ping VM1`.

   This time you get a success reply similar to the following message, because you allowed ICMP through the firewall on VM1.

   ```cmd
   C:\windows\system32>ping VM1
   
   Pinging VM1.e5p2dibbrqtejhq04lqrusvd4g.bx.internal.cloudapp.net [10.0.0.4] with 32 bytes of data:
   Reply from 10.0.0.4: bytes=32 time=2ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   
   Ping statistics for 10.0.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 2ms, Average = 0ms
   ```

1. Close the remote desktop connection to VM2.

## Clean up resources

When you're done with the virtual network and the VMs, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources.

```azurecli-interactive
az group delete \
    --name TestRG \
    --yes
```

## Next steps

In this quickstart, you created a virtual network with a default subnet that contains two VMs. You connected to the VMs from the internet via RDP, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs in a virtual network is unrestricted by default. Advance to the next article to learn more about configuring different types of VM network communications.
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)

