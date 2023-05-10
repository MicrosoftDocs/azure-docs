---
title: 'Quickstart: Use Bicep to create a virtual network'
titleSuffix: Azure Virtual Network
description: Use Bicep templates to create a virtual network and virtual machines, and deploy Azure Bastion to securely connect from the internet.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/09/2023
ms.author: allensu
ms.custom: mode-arm, devx-track-bicep
---

# Quickstart: Use Bicep templates to create a virtual network

This quickstart shows you how to create a virtual network with two virtual machines (VMs), and then deploy Azure Bastion on the virtual network, by using Bicep templates. You then securely connect to the VMs from the internet by using Azure Bastion, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To deploy the Bicep files, either Azure CLI or PowerShell installed.

  # [CLI](#tab/azure-cli)

  1. [Install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. You need Azure CLI version 2.0.28 or later. Run [az version](/cli/azure/reference-index?#az-version) to find your installed version and dependent libraries, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade.

  1. Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

  # [PowerShell](#tab/azure-powershell)

  1. [Install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the cmdlets. You need Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  1. Run `Connect-AzAccount` to connect to Azure.

  # [Portal](#tab/azure-portal)

  To create and deploy the resources in the Azure portal, see [Quickstart: Use the Azure portal to create a virtual network](quick-create-portal.md).

  ---

## Create the virtual network and VMs

This quickstart uses the [Two VMs in VNET](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/2-vms-internal-load-balancer/main.bicep) Bicep template from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to create the virtual network, resource subnet, and VMs. The Bicep template defines the following Azure resources:

- [Microsoft.Network virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates an Azure virtual network.
- [Microsoft.Network virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a subnet for the VMs.
- [Microsoft.Compute virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Creates the VMs.
- [Microsoft.Compute availabilitySets](/azure/templates/microsoft.compute/availabilitysets): Creates an availability set.
- [Microsoft.Network networkInterfaces](/azure/templates/microsoft.network/networkinterfaces): Creates network interfaces.
- [Microsoft.Network loadBalancers](/azure/templates/microsoft.network/loadbalancers): Creates an internal load balancer.
- [Microsoft.Storage storageAccounts](/azure/templates/microsoft.storage/storageaccounts): Creates a storage account.

Review the Bicep file:

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.compute/2-vms-internal-load-balancer/main.bicep" :::

### Deploy the Bicep template

1. Save the Bicep file to your local computer as *main.bicep*.
1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

   # [CLI](#tab/azure-cli)

   ```azurecli
   az group create --name TestRG --location eastus
   az deployment group create --resource-group TestRG --template-file main.bicep
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell
   New-AzResourceGroup -Name TestRG -Location eastus
   New-AzResourceGroupDeployment -ResourceGroupName TestRG -TemplateFile main.bicep
   ```

   # [Portal](#tab/azure-portal)

   To create the resources in the Azure portal, see [Quickstart: Use the Azure portal to create a virtual network](quick-create-portal.md).

---

When the deployment finishes, a message indicates that the deployment succeeded.

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](~/articles/bastion/bastion-overview.md).

Use the [Azure Bastion as a service](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/azure-bastion/main.bicep) Bicep template from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to deploy and configure Azure Bastion in your virtual network. This Bicep template defines the following Azure resources:

- [Microsoft.Network virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates an AzureBastionSubnet subnet.
- [Microsoft.Network bastionHosts](/azure/templates/microsoft.network/bastionhosts): Creates the Bastion host.
- [Microsoft.Network publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address for the Azure Bastion host.
- [Microsoft Network networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups): Controls the network security group (NSG) settings.

Review the Bicep file:

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azure-bastion/main.bicep" :::

### Deploy the Bicep template

1. Save the Bicep file to your local computer as *bastion.bicep*.
1. Use a text or code editor to make the following changes in the file:

   - Line 2: Change `param vnetName string` from `'vnet01'` to `'VNet'`.
   - Line 5: Change `param vnetIpPrefix string` from `'10.1.0.0/16'` to `'10.0.0.0/16'`.
   - Line 12: Change `param vnetNewOrExisting string` from `'new'` to `'existing'`.
   - Line 15: Change `param bastionSubnetIpPrefix string` from `'10.1.1.0/26'` to `'10.0.1.0/26'`.
   - Line 18: Change `param bastionHostName string` to `param bastionHostName = 'VNet-bastion'`.
   
   The first 18 lines of your Bicep file should now look like this:
   
   ```bicep
   @description('Name of new or existing vnet to which Azure Bastion should be deployed')
   param vnetName string = 'VNet'
   
   @description('IP prefix for available addresses in vnet address space')
   param vnetIpPrefix string = '10.0.0.0/16'
   
   @description('Specify whether to provision new vnet or deploy to existing vnet')
   @allowed([
     'new'
     'existing'
   ])
   param vnetNewOrExisting string = 'existing'
   
   @description('Bastion subnet IP prefix MUST be within vnet IP prefix address space')
   param bastionSubnetIpPrefix string = '10.0.1.0/26'
   
   @description('Name of Azure Bastion resource')
   param bastionHostName = 'VNet-bastion'
   
   ```

1. Save the *bastion.bicep* file.

1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

   # [CLI](#tab/azure-cli)

   ```azurecli
   az deployment group create --resource-group TestRG --template-file bastion.bicep
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell
   New-AzResourceGroupDeployment -ResourceGroupName TestRG -TemplateFile bastion.bicep
   ```

   # [Portal](#tab/azure-portal)

   To create the resources in the Azure portal, see [Quickstart: Use the Azure portal to create a virtual network](quick-create-portal.md).

---

When the deployment finishes, a message indicates that the deployment succeeded.

>[!NOTE]
>VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

## Review deployed resources

Use Azure CLI, Azure PowerShell, or the Azure portal to review the deployed resources.

# [CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group TestRG
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName TestRG
```

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select *resource groups*, and on the **Resource groups** page, select **TestRG** from the list of resource groups.
1. On the **Overview** page for **TestRG**, review all the resources that you created, including the virtual network, the two VMs, and the Azure Bastion host.
1. Select the **VNet** virtual network, and on the **Overview** page for **VNet**, note the defined address space of **10.0.0.0/16**.
1. Select **Subnets** from the left menu, and on the **Subnets** page, note the deployed subnets of **backendSubnet** and **AzureBastionSubnet** with the assigned values from the Bicep files.

---

## Connect to a VM

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **BackendVM1**.

1. At the top of the **BackendVM1** page, select the dropdown arrow next to **Connect**, and then select **Bastion**.

   :::image type="content" source="./media/quick-create-bicep/connect-to-virtual-machine.png" alt-text="Screenshot of connecting to VM1 with Azure Bastion." border="true":::

1. On the **Bastion** page, enter the username and password you created for the VM, and then select **Connect**.

## Communicate between VMs

1. From the desktop of BackendVM1, open PowerShell.

1. Enter `ping BackendVM0`. You get a reply similar to the following message:

   ```powershell
   PS C:\Users\BackendVM1> ping BackendVM0
   
   Pinging BackendVM0.ovvzzdcazhbu5iczfvonhg2zrb.bx.internal.cloudapp.net with 32 bytes of data
   Request timed out.
   Request timed out.
   Request timed out.
   Request timed out.
   
   Ping statistics for 10.0.0.5:
       Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
   ```

   The ping fails because it uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through Windows firewall.

1. To allow ICMP to inbound through Windows firewall on this VM, enter the following command:

   ```powershell
   New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
   ```

1. Close the Bastion connection to BackendVM1.

1. Repeat the steps in [Connect to a VM](#connect-to-a-vm) to connect to BackendVM0.

1. From PowerShell on BackendVM0, enter `ping BackendVM1`.

   This time you get a success reply similar to the following message, because you allowed ICMP through the firewall on VM1.

   ```cmd
   PS C:\Users\BackendVM0> ping BackendVM1
   
   Pinging BackendVM1.e5p2dibbrqtejhq04lqrusvd4g.bx.internal.cloudapp.net [10.0.0.4] with 32 bytes of data:
   Reply from 10.0.0.4: bytes=32 time=2ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   
   Ping statistics for 10.0.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 2ms, Average = 0ms
   ```

1. Close the Bastion connection to BackendVM0.

## Clean up resources

When you're done with the virtual network, use Azure CLI, Azure PowerShell, or the Azure portal to delete the resource group and all its resources.

# [CLI](#tab/azure-cli)

```azurecli
az group delete --name TestRG
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name TestRG
```

# [Portal](#tab/azure-portal)

1. In the Azure portal, on the **Resource groups** page, select the **TestRG** resource group.
1. At the top of the **TestRG** page, select **Delete resource group**.
1. On the **Delete a resource group** page, under **Enter resource group name to confirm deletion**, enter *TestRG*, and then select **Delete**.
1. Select **Delete** again.

---

## Next steps

In this quickstart, you created a virtual network with two subnets, one containing two VMs and the other for Azure Bastion. You deployed Azure Bastion and used it to connect to the VMs, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs is unrestricted in a virtual network. Continue to the next article to learn more about configuring different types of VM network communications.
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
