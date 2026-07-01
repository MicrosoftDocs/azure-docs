---
title: 'Quickstart: Create an Azure Virtual Network'
description: Learn how to use the various deployment methods in Azure to create a virtual network.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: quickstart  #Don't change
ms.date: 07/10/2025

#customer intent: As an administrator or network engineer, I want to create a virtual network and test traffic between virtual machines in the same virtual network.

# Customer intent: "As a network engineer, I want to deploy a virtual network with multiple subnets and virtual machines, so that I can establish secure communication and test connectivity between the resources within the network."
---

# Quickstart: Create an Azure Virtual Network
 
Learn how to create an Azure Virtual Network using the Azure portal, Azure CLI, Azure PowerShell, Azure Resource Manager (ARM) template, Bicep template, and Terraform. Two virtual machines and an Azure Bastion host are deployed to test connectivity between the virtual machines in the same virtual network. The Azure Bastion host facilitates secure and seamless RDP and SSH connectivity to the virtual machines directly in the Azure portal over SSL.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in the virtual network quickstart." lightbox="./media/quick-create-portal/virtual-network-qs-resources.png":::

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources such as virtual machines to securely communicate with each other and the internet.

>[!VIDEO https://learn-video.azurefd.net/vod/player?id=6b5b138e-8406-406e-8b34-40bdadf9fc6d]

If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

If you're running Azure CLI locally, use Azure CLI version 2.0.31 or later.

### [ARM template](#tab/arm)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

### [Bicep](#tab/bicep)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- To deploy the Bicep files, either the Azure CLI or Azure PowerShell installed.

### [Terraform](#tab/terraform)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

---

## Resource values

Use the following values to replace the placeholders of resources in this article:

| Setting | Placeholder | Value |
| ------- | ------ | ----------- |
| Resource group | `<resource-group>` | **test-rg** |
| Region | `<region>` | **East US 2** |
| Virtual network | `<virtual-network>` | **vnet-1** |
| Subnet | `<subnet>` | **subnet-1** |
| Network security group | `<network-security-group>` | **nsg-1** |
| Bastion | `<bastion>` | **bastion** |
| Virtual machine 1 | `<virtual-machine-1>` | **vm-1** |
| Virtual machine 2 | `<virtual-machine-2>` | **vm-2** |

### [Portal](#tab/portal)

[!INCLUDE [create-resource-group](../networking/includes/azure-virtual-network/create-resource-group.md)]

[!INCLUDE [create-virtual-network](../networking/includes/azure-virtual-network/create-virtual-network.md)]

[!INCLUDE [deploy-bastion](../networking/includes/azure-virtual-network/deploy-bastion.md)]

[!INCLUDE [create-virtual-machines](../networking/includes/azure-virtual-network/create-virtual-machines.md)]

### [PowerShell](#tab/powershell)

[!INCLUDE [create-resource-group-powershell](../networking/includes/azure-virtual-network/create-resource-group-powershell.md)]

[!INCLUDE [create-virtual-network-powershell](../networking/includes/azure-virtual-network/create-virtual-network-powershell.md)]

[!INCLUDE [deploy-bastion-powershell](../networking/includes/azure-virtual-network/deploy-bastion-powershell.md)]

[!INCLUDE [create-virtual-machines-powershell](../networking/includes/azure-virtual-network/create-virtual-machines-powershell.md)]

### [CLI](#tab/cli)

[!INCLUDE [create-resource-group-cli](../networking/includes/azure-virtual-network/create-resource-group-cli.md)]

[!INCLUDE [create-virtual-network-cli](../networking/includes/azure-virtual-network/create-virtual-network-cli.md)]

[!INCLUDE [deploy-bastion-cli](../networking/includes/azure-virtual-network/deploy-bastion-cli.md)]

[!INCLUDE [create-virtual-machines-cli](../networking/includes/azure-virtual-network/create-virtual-machines-cli.md)]

### [ARM template](#tab/arm)

## Review the template

The template that you use in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json" :::

The template defines the following Azure resources:

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates a virtual network.
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a subnet.

## Deploy the template

Deploy the Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates a virtual network with two subnets.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fvnet-two-subnets%2Fazuredeploy.json":::

1. In the portal, on the **Create a Virtual Network with two Subnets** page, enter, or select the following values:
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

## Create the virtual network and virtual machines

This quickstart uses the [Two VMs in virtual network](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/2-vms-internal-load-balancer/main.bicep) Bicep template from [Azure Resource Manager Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to create the virtual network, resource subnet, and virtual machines. The Bicep template defines the following Azure resources:

- [Microsoft.Network virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates an Azure virtual network.
- [Microsoft.Network virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a subnet for the virtual machines.
- [Microsoft.Compute virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Creates the virtual machines.
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

When the deployment finishes, a message indicates the deployment succeeded.

## Deploy Azure Bastion

Bastion uses your browser to connect to virtual machines in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The virtual machines don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [What is Azure Bastion?](~/articles/bastion/bastion-overview.md)

> [!NOTE]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

Use the [Azure Bastion as a Service](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/azure-bastion/main.bicep) Bicep template from [Azure Resource Manager Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) to deploy and configure Bastion in your virtual network. This Bicep template defines the following Azure resources:

- [Microsoft.Network virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates an **AzureBastionSubnet** subnet.
- [Microsoft.Network bastionHosts](/azure/templates/microsoft.network/bastionhosts): Creates the Bastion host.
- [Microsoft.Network publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address for the Bastion host.
- [Microsoft.Network networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups): Controls the settings for network security groups.

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

When the deployment finishes, a message indicates the deployment succeeded.

> [!NOTE]
> Virtual machines in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the virtual machines use private IPs to communicate within the network. You can remove the public IPs from any virtual machines in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

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

1. On the **Overview** page for **TestRG**, review all the resources that you created, including the virtual network, the two virtual machines, and the Bastion host.

1. Select the **VNet** virtual network. On the **Overview** page for **VNet**, note the defined address space of **10.0.0.0/16**.

1. On the left menu, select **Subnets**. On the **Subnets** page, note the deployed subnets of **backendSubnet** and **AzureBastionSubnet** with the assigned values from the Bicep files.

### [Terraform](#tab/terraform)

The script uses the Azure Resource Manager (`azurerm`) provider to interact with Azure resources. It uses the Random (`random`) provider to generate random pet names for the resources.

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

1. Use [`az network vnet show`](/cli/azure/network/vnet#az-network-vnet-show) to show the details of your newly created virtual network:

    ```azurecli
    az network vnet show \
        --resource-group $resource_group_name \
        --name $virtual_network_name
    ```

## Troubleshoot Terraform on Azure

For information about troubleshooting Terraform, see [Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

---

## Connect to a virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-1**.

1. Select **Connect** then **Connect via Bastion** in the **Overview** section.

1. In the **Bastion** connection page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Authentication Type** | Select **SSH Private Key from Local File**. |
    | **Username** | Enter **azureuser**. |
    | **Local File** | Select the private key file you downloaded or created. |

1. Select **Connect**.

## Start communication between virtual machines

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

1. Close the Bastion session.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-2**.

1. Select **Connect** then **Connect via Bastion** in the **Overview** section.

1. In the **Bastion** connection page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Authentication Type** | Select **SSH Private Key from Local File**. |
    | **Username** | Enter **azureuser**. |
    | **Local File** | Select the private key file you downloaded or created. |

1. Select **Connect**.

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

1. Close the Bastion session.

## Clean up resources

### [Portal](#tab/portal)

[!INCLUDE [clean-up](../networking/includes/azure-virtual-network/clean-up.md)]

### [PowerShell](#tab/powershell)

[!INCLUDE [clean-up-powershell](../networking/includes/azure-virtual-network/clean-up-powershell.md)]

### [CLI](#tab/cli)

[!INCLUDE [clean-up-cli](../networking/includes/azure-virtual-network/clean-up-cli.md)]

### [ARM template](#tab/arm)

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


