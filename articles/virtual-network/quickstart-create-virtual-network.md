---
title: 'Quickstart: Create an Azure Virtual Network'
description: Learn how to use the various deployment methods in Azure to create a virtual network.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: quickstart  #Don't change
ms.date: 04/22/2025

#customer intent: As an administrator or network engineer, I want to create a virtual network and test traffic between virtual machines in the same virtual network.

---

# Quickstart: Create an Azure Virtual Network
 
In this quickstart, learn how to create an Azure Virtual Network (VNet) using the Azure portal, Azure CLI, Azure PowerShell, Resource Manager template, Bicep template, and Terraform. Two virtual machines and an Azure Bastion host are deployed to test connectivity between the virtual machines in the same virtual network. The Azure Bastion host facilitates secure and seamless RDP and SSH connectivity to the virtual machines directly in the Azure portal over SSL.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in the virtual network quickstart." lightbox="./media/quick-create-portal/virtual-network-qs-resources.png":::

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

>[!VIDEO https://learn-video.azurefd.net/vod/player?id=6b5b138e-8406-406e-8b34-40bdadf9fc6d]

If you don't have a service subscription, [create a free trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [Powershell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### [ARM](#tab/arm)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

### [Bicep](#tab/bicep)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To deploy the Bicep files, either the Azure CLI or Azure PowerShell installed.

### [Terraform](#tab/terraform)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

---


### [Portal](#tab/portal)

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-two-virtual-machines.md](../../includes/create-two-virtual-machines.md)]

### [Powershell](#tab/powershell)

## Create a resource group

Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group to host the virtual network. Run the following code to create a resource group named **test-rg** in the **eastus2** Azure region:

```azurepowershell-interactive
$rg = @{
    Name = 'test-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a virtual network

1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network named **vnet-1** with IP address prefix **10.0.0.0/16** in the **test-rg** resource group and **eastus2** location:

    ```azurepowershell-interactive
    $vnet = @{
        Name = 'vnet-1'
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        AddressPrefix = '10.0.0.0/16'
    }
    $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Azure deploys resources to a subnet within a virtual network. Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet configuration named **subnet-1** with address prefix **10.0.0.0/24**:

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'subnet-1'
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.0.0/24'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Associate the subnet configuration to the virtual network by using [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork):

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Bastion, see [What is Azure Bastion?](/azure/bastion/bastion-overview).

 [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Configure a Bastion subnet for your virtual network. This subnet is reserved exclusively for Bastion resources and must be named **AzureBastionSubnet**.

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'AzureBastionSubnet'
        VirtualNetwork = $virtualNetwork
        AddressPrefix = '10.0.1.0/26'
    }
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
    ```

1. Set the configuration:

    ```azurepowershell-interactive
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Create a public IP address for Bastion. The Bastion host uses the public IP to access SSH and RDP over port 443.

    ```azurepowershell-interactive
    $ip = @{
            ResourceGroupName = 'test-rg'
            Name = 'public-ip'
            Location = 'eastus2'
            AllocationMethod = 'Static'
            Sku = 'Standard'
            Zone = 1,2,3
    }
    New-AzPublicIpAddress @ip
    ```

1. Use the [New-AzBastion](/powershell/module/az.network/new-azbastion) command to create a new Standard SKU Bastion host in **AzureBastionSubnet**:

    ```azurepowershell-interactive
    $bastion = @{
        Name = 'bastion'
        ResourceGroupName = 'test-rg'
        PublicIpAddressRgName = 'test-rg'
        PublicIpAddressName = 'public-ip'
        VirtualNetworkRgName = 'test-rg'
        VirtualNetworkName = 'vnet-1'
        Sku = 'Basic'
    }
    New-AzBastion @bastion
    ```

It takes about 10 minutes to deploy the Bastion resources. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create two VMs named **vm-1** and **vm-2** in the **subnet-1** subnet of the virtual network. When you're prompted for credentials, enter usernames and passwords for the VMs.

1. To create the first VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VM. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create a network interface for the VM. ##
    $nic = @{
        Name = "nic-1"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration. ##
    $vmsz = @{
        VMName = "vm-1"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-1"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the VM. ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
    ```

1. To create the second VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VM. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create a network interface for the VM. ##
    $nic = @{
        Name = "nic-2"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration. ##
    $vmsz = @{
        VMName = "vm-2"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-2"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the VM. ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
    ```

> [!TIP]
> You can use the `-AsJob` option to create a VM in the background while you continue with other tasks. For example, run `New-AzVM @vm1 -AsJob`. When Azure starts creating the VM in the background, you get something like the following output:
>
> ```powershell
> Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
> --     ----            -------------   -----         -----------     --------             -------
> 1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
> ```

Azure takes a few minutes to create the VMs. When Azure finishes creating the VMs, it returns output to PowerShell.

> [!NOTE]
> VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

### [CLI](#tab/cli)

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

[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)] For more information about Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md).

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

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

### [ARM](#tab/arm)

## Review the template

The template that you use in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json" :::

The template defines the following Azure resources:

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Create a virtual network.
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Create a subnet.

## Deploy the template

Deploy the Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates a virtual network with two subnets.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fvnet-two-subnets%2Fazuredeploy.json":::

1. In the portal, on the **Create a Virtual Network with two Subnets** page, enter or select the following values:
   - **Resource group**: Select **Create new**, enter **CreateVNetQS-rg** for the resource group name, and then select **OK**.
   - **Virtual Network Name**: Enter a name for the new virtual network.
1. Select **Review + create**, and then select **Create**.
1. When deployment finishes, select the **Go to resource** button to review the resources that you deployed.

## Review deployed resources

Explore the resources that you created with the virtual network by browsing through the settings panes for **VNet1**:

- The **Overview** tab shows the defined address space of **10.0.0.0/16**.

- The **Subnets** tab shows the deployed subnets of **Subnet1** and **Subnet2** with the appropriate values from the template.

To learn about the JSON syntax and properties for a virtual network in a template, see [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks).

### [Bicep](#tab/bicep)

## Create the virtual network and VMs

This quickstart uses the [Two VMs in VNET](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/2-vms-internal-load-balancer/main.bicep) Bicep template from [Azure Resource Manager Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to create the virtual network, resource subnet, and VMs. The Bicep template defines the following Azure resources:

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
1. Deploy the Bicep file by using either the Azure CLI or Azure PowerShell:

   ### CLI

    ```azurecli
    az group create \
        --name TestRG \
        --location eastus
   
    az deployment group create \
        --resource-group TestRG \
        --template-file main.bicep
    ```

   ### PowerShell

   ```azurepowershell
    $rgParams = @{
        Name     = 'TestRG'
        Location = 'eastus'
    }
    New-AzResourceGroup @rgParams

    $deploymentParams = @{
        ResourceGroupName = 'TestRG'
        TemplateFile      = 'main.bicep'
    }
    New-AzResourceGroupDeployment @deploymentParams
    ```

When the deployment finishes, a message indicates that the deployment succeeded.

## Deploy Azure Bastion

Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md).

> [!NOTE]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

Use the [Azure Bastion as a Service](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/azure-bastion/main.bicep) Bicep template from [Azure Resource Manager Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to deploy and configure Bastion in your virtual network. This Bicep template defines the following Azure resources:

- [Microsoft.Network virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates an **AzureBastionSubnet** subnet.
- [Microsoft.Network bastionHosts](/azure/templates/microsoft.network/bastionhosts): Creates the Bastion host.
- [Microsoft.Network publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address for the Bastion host.
- [Microsoft Network networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups): Controls the settings for network security groups.

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

   The first 18 lines of your Bicep file should now look like this example:

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

1. Deploy the Bicep file by using either the Azure CLI or Azure PowerShell:

   #### CLI

   ```azurecli
   az deployment group create \
        --resource-group TestRG \
        --template-file bastion.bicep
   ```

   ### PowerShell

    ```azurepowershell
    $deploymentParams = @{
        ResourceGroupName = 'TestRG'
        TemplateFile      = 'bastion.bicep'
    }
    New-AzResourceGroupDeployment @deploymentParams
    ```

When the deployment finishes, a message indicates that the deployment succeeded.

> [!NOTE]
> VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

## Review deployed resources

Use the Azure CLI, Azure PowerShell, or the Azure portal to review the deployed resources:

### CLI

```azurecli
az resource list --resource-group TestRG
```

### PowerShell

```azurepowershell
Get-AzResource -ResourceGroupName TestRG
```

### Portal

1. In the [Azure portal](https://portal.azure.com), search for and select **resource groups**. On the **Resource groups** page, select **TestRG** from the list of resource groups.

1. On the **Overview** page for **TestRG**, review all the resources that you created, including the virtual network, the two VMs, and the Bastion host.

1. Select the **VNet** virtual network. On the **Overview** page for **VNet**, note the defined address space of **10.0.0.0/16**.

1. On the left menu, select **Subnets**. On the **Subnets** page, note the deployed subnets of **backendSubnet** and **AzureBastionSubnet** with the assigned values from the Bicep files.

### [Terraform](#tab/terraform)

The script uses the Azure Resource Manager (`azurerm`) provider to interact with Azure resources. It uses the  Random (`random`) provider to generate random pet names for the resources.

The script creates the following resources:

- A resource group: A container that holds related resources for an Azure solution.

- A virtual network: A fundamental building block for your private network in Azure.

- Two subnets: Segments of a virtual network's IP address range where you can place groups of isolated resources.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-create-two-subnets). You can view the log file that contains the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-create-two-subnets/TestRecord.md).
>
> For more articles and sample code that show how to use Terraform to manage Azure resources, see the [documentation page for Terraform on Azure](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named *main.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/main.tf":::

1. Create a file named *outputs.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/outputs.tf":::

1. Create a file named *providers.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/providers.tf":::

1. Create a file named *variables.tf* and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-virtual-network-create-two-subnets/variables.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Get the Azure resource group name:

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the virtual network name:

    ```console
    virtual_network_name=$(terraform output -raw virtual_network_name)
    ```

1. Use [`az network vnet show`](/cli/azure/network/vnet#az-network-vnet-show) to display the details of your newly created virtual network:

    ```azurecli
    az network vnet show \
        --resource-group $resource_group_name \
        --name $virtual_network_name
    ```

## Troubleshoot Terraform on Azure

For information about troubleshooting Terraform, see [Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

---

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

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When you finish with the virtual network and the VMs, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all its resources:

```azurepowershell-interactive
$rgParams = @{
    Name = 'test-rg'
    Force = $true
}
Remove-AzResourceGroup @rgParams
```

### [CLI](#tab/cli)

When you finish with the virtual network and the VMs, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all its resources:

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```

### [ARM](#tab/arm)

When you no longer need the resources that you created with the virtual network, delete the resource group. This action removes the virtual network and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

### [Bicep](#tab/bicep)

1. In the Azure portal, on the **Resource groups** page, select the **TestRG** resource group.

1. At the top of the **TestRG** page, select **Delete resource group**.

1. On the **Delete a resource group** page, under **Enter resource group name to confirm deletion**, enter **TestRG**, and then select **Delete**.

1. Select **Delete** again.

### [Terraform](#tab/terraform)

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

---
## Related content

- [Filter network traffic](tutorial-filter-network-traffic.md)

- [Learn more about using Terraform on Azure](/azure/terraform)


