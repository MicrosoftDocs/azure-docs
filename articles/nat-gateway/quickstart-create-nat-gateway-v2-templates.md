---
title: 'Quickstart: Create a Standard V2 Azure NAT Gateway - Deployment templates'
description: This quickstart shows how to create a NAT gateway by using an Azure Resource Manager template (ARM template) and Bicep template.
author: asudbring
ms.service: azure-nat-gateway
ms.topic: quickstart
ms.date: 09/24/2025
ms.author: allensu
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create a Standard V2 Azure NAT Gateway - Deployment templates

Get started with NAT Gateway V2 by using an Azure Resource Manager template (ARM template) or Bicep template. The templates deploy a NAT gateway, virtual network, subnet, and Ubuntu virtual machine for testing NAT gateway functionality. The NAT gateway is assigned to a subnet of the virtual network.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnat-gateway-1-vm%2Fazuredeploy.json)

## Prerequisites

# [ARM template](#tab/ARM)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

# [Bicep](#tab/Bicep)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

---

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/nat-gateway-1-vm/).

# [ARM template](#tab/ARM)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups): Creates a network security group.
- [**Microsoft.Network/networkSecurityGroups/securityRules**](/azure/templates/microsoft.network/networksecuritygroups/securityrules): Creates a security rule.
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address.
- [**Microsoft.Network/publicIPPrefixes**](/azure/templates/microsoft.network/publicipprefixes): Creates a public IP prefix.
- [**Microsoft.Network/natGateways**](/azure/templates/microsoft.network/natgateways): Creates a NAT gateway resource.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): Creates a virtual network.
- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a virtual network subnet.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): Creates a network interface.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): Creates a virtual machine.

# [Bicep](#tab/Bicep)

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/nat-gateway-1-vm/main.bicep":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups): Creates a network security group.
- [**Microsoft.Network/networkSecurityGroups/securityRules**](/azure/templates/microsoft.network/networksecuritygroups/securityrules): Creates a security rule.
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): Creates a public IP address.
- [**Microsoft.Network/publicIPPrefixes**](/azure/templates/microsoft.network/publicipprefixes): Creates a public IP prefix.
- [**Microsoft.Network/natGateways**](/azure/templates/microsoft.network/natgateways): Creates a NAT gateway resource.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): Creates a virtual network.
- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a virtual network subnet.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): Creates a network interface.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): Creates a virtual machine.

---

## Deploy the template

# [ARM template](#tab/ARM)

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $adminUsername = Read-Host -Prompt "Enter the administrator username"
    $adminPasswordOrKey = Read-Host -Prompt "Enter the SSH public key" -AsSecureString

    $deploymentParams = @{
        ResourceGroupName = $resourceGroupName
        TemplateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json"
        adminUsername = $adminUsername
        adminPasswordOrKey = $adminPasswordOrKey
    }

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment @deploymentParams

    Write-Host "Press [ENTER] to continue ..."
    ```

2. Select **Copy** from the previous code block to copy the PowerShell script.

3. Right-click the shell console pane and then select **Paste**.

4. Enter the values.

    The template deployment creates:

    - Resource group
    - NAT gateway
    - Virtual network and subnet
    - Virtual machine (Ubuntu)

    > [!NOTE]
    > The template uses SSH public key authentication. When prompted, provide your SSH public key, such as the contents of **~/.ssh/id_rsa.pub**. If you need to create an SSH key pair, see [Create and use an SSH key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    ```azurepowershell-interactive
    ResourceGroupName : myResourceGroup
    Location          : centralus
    ProvisioningState : Succeeded
    Timestamp         : 12/9/2019 1:46:56 AM
    Mode              : Incremental
    TemplateLink      : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/nat-gateway-1-vm/azuredeploy.json
    Parameters        :
                        Name                   Type                       Value
                        =====================  =========================  ==========
                        adminUsername          String                     azureuser
                        adminPasswordOrKey     SecureString

    Outputs           :
    DeploymentDebugLogLevel :
    ```

# [Bicep](#tab/Bicep)

1. Save the Bicep file as **main.bicep** to your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    resourceGroupName="myResourceGroup"
    location="centralus"
    adminUsername="azureuser"

    az group create \
        --name $resourceGroupName \
        --location $location

    az deployment group create \
        --resource-group $resourceGroupName \
        --template-file main.bicep \
        --parameters adminUsername=$adminUsername adminPasswordOrKey='<your-ssh-public-key>'
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $location = "centralus"
    $adminUsername = "azureuser"
    $adminPasswordOrKey = "<your-ssh-public-key>"

    $deploymentParams = @{
        ResourceGroupName = $resourceGroupName
        TemplateFile = "main.bicep"
        adminUsername = $adminUsername
        adminPasswordOrKey = $adminPasswordOrKey
    }

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment @deploymentParams
    ```
    ---

    > [!NOTE]
    > Replace **\<your-ssh-public-key\>** with your SSH public key, such as the contents of **~/.ssh/id_rsa.pub**. If you need to create an SSH key pair, see [Create and use an SSH key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    ```output
    DeploymentName          : main
    ResourceGroupName       : myResourceGroup
    ProvisioningState       : Succeeded
    Timestamp               : 12/9/2019 1:46:56 AM
    Mode                    : Incremental
    TemplateLink            :
    Parameters              :
                              Name                   Type                       Value
                              =====================  =========================  ==========
                              adminUsername          String                     azureuser
                              adminPasswordOrKey     SecureString

    Outputs                 :
    DeploymentDebugLogLevel :
    ```

---

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is **myResourceGroup**.

1. Verify that the following resources are in the resource group:

    - **nat-gateway**: NAT gateway
    - **vnet-1**: Virtual network
    - **vm-1**: Virtual machine
    - **public-ip-nat**: Public IP for NAT gateway
    - **nsg-1**: Network security group

## Test NAT gateway

In this section, you test the NAT gateway. You first discover the public IP of the NAT gateway. You then connect to the test virtual machine and verify the outbound connection through the NAT gateway public IP.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **nat-gateway**.

1. Expand **Settings**, then select **Outbound IP**.

1. Make note of the IP address deployed for the outbound IP address.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, then select **Connect via Bastion**.

1. In the **Authentication** pull-down, select **SSH Private Key From Local File**.

1. In **Username**, enter the username you entered during template deployment.

1. In **Local File**, select the SSH private key file that corresponds to your public key.

1. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway you noted earlier.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    203.0.113.25
    ```

## Clean up resources

When you no longer need the resources that you created with the NAT gateway, delete the resource group. This removes the NAT gateway and all the related resources.

# [ARM template](#tab/ARM)

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

# [Bicep](#tab/Bicep)

```azurecli-interactive
az group delete --name myResourceGroup
```

---

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Azure NAT Gateway overview](nat-overview.md)
>
> [Azure NAT Gateway resource](nat-gateway-resource.md)
