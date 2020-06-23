---
title: 'Quickstart: Create a virtual network using a Resource Manager template'
titleSuffix: Azure Virtual Network
description: Learn how to use a Resource Manager template to create an Azure virtual network.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: quickstart
ms.date: 06/23/2020
ms.author: kumud
ms.custom: 
---

# Quickstart: Direct web traffic with Azure Application Gateway - Resource Manager template

In this quickstart, you learn how to create a virtual network using the Azure Resource Manager template. You deploy two virtual machines (VMs). Next, you securely communicate between VMs and connect to VMs from the internet. A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like VMs, to securely communicate with each other and with the internet.


[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](quick-create-portal.md), [Azure PowerShell](quick-create-powershell.md), or [Azure CLI](quick-create-cli.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

This template creates a simple setup with two VMs that are deployed in a virtual network with a single subnet so that you securely communicate between them and connect to VMs from the internet.

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/101-virtual-network-2vms-create/azuredeploy.json)

:::code language="json" source="~/quickstart-templates/ag-docs-qs/azuredeploy.json" range="001-343" highlight="197-297":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : two virtual machines
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : two for the virtual machines


### Deploy the template

Deploy Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an application gateway, the network infrastructure, and two virtual machines in the backend pool running IIS.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-virtual-network-2vms-create%2Fazuredeploy.json)

2. Select or create your resource group, type the virtual machine administrator user name and password.
3. Select **Review + Create** and then select **Create**.

   The deployment can take 20 minutes or longer to complete.


## Connect to a VM from the internet

After you've created *myVm1*, connect to the internet.

1. In the Azure portal, search for and select *myVm1*.

1. Select **Connect**, then **RDP**.

    ![Connect to a virtual machine](./media/quick-create-portal/connect-to-virtual-machine.png)

    The **Connect** page opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the RDP file. If prompted, select **Connect**.

1. Enter the username and password you specified when creating the VM.

    > [!NOTE]
    > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning when you sign in. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.

## Communicate between VMs

1. In the Remote Desktop of *myVm1*, open PowerShell.

1. Enter `ping myVm2`.

    You'll receive a message similar to this output:

    ```output
    Pinging myVm2.0v0zze1s0uiedpvtxz5z0r0cxg.bx.internal.clouda
    Request timed out.
    Request timed out.
    Request timed out.
    Request timed out.

    Ping statistics for 10.1.0.5:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    ```

    The `ping` fails, because `ping` uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through the Windows firewall.

1. To allow *myVm2* to ping *myVm1* in a later step, enter this command:

    ```powershell
    New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
    ```

    This command allows ICMP inbound through the Windows firewall:

1. Close the remote desktop connection to *myVm1*.

1. Complete the steps in [Connect to a VM from the internet](#connect-to-a-vm-from-the-internet) again, but connect to *myVm2*.

1. From a command prompt, enter `ping myvm1`.

    You'll get back something like this message:

    ```output
    Pinging myVm1.0v0zze1s0uiedpvtxz5z0r0cxg.bx.internal.cloudapp.net [10.1.0.4] with 32 bytes of data:
    Reply from 10.1.0.4: bytes=32 time=1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128
    Reply from 10.1.0.4: bytes=32 time<1ms TTL=128

    Ping statistics for 10.1.0.4:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms
    ```

    You receive replies from *myVm1*, because you allowed ICMP through the Windows firewall on the *myVm1* VM in step 3.

1. Close the remote desktop connection to *myVm2*.

## Clean up resources

When you no longer need the resources that you created with the virtual network, delete the resource group. This removes the virtual network and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
