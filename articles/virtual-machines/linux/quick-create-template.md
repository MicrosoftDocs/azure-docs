---
title: 'Quickstart: Use a Resource Manager template to create an Ubuntu Linux VM'
description: In this quickstart, you learn how to use a Resource Manager template to create a Linux virtual machine
author: cynthn
ms.service: virtual-machines-linux
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 06/04/2020
ms.author: cynthn
ms.custom: subject-armqs

---

# Quickstart: Create an Ubuntu Linux virtual machine using a Resource Manager template

This quickstart shows you how to use a Resource Manager template to deploy an Ubuntu Linux virtual machine (VM) in Azure. 

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

None.

## Create an Ubuntu Linux virtual machine

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-vm-simple-linux/).

:::code language="json" source="~/quickstart-templates/101-vm-simple-linux/azuredeploy.json" range="1-261" highlight="110-260":::


Several resources are defined in the template:

- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/Microsoft.Network/virtualNetworks/subnets): create a subnet.
- [**Microsoft.Storage/storageAccounts**](/azure/templates/Microsoft.Storage/storageAccounts): create a storage account.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/Microsoft.Network/networkInterfaces): create a NIC.
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/Microsoft.Network/networkSecurityGroups): create a network security group.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/Microsoft.Network/virtualNetworks): create a virtual network.
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/Microsoft.Network/publicIPAddresses): create a public IP address.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/Microsoft.Compute/virtualMachines): create a virtual machine.

### Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    [![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-vm-simple-linux%2fazuredeploy.json)

1. Select or enter the following values. Use the default values, when available.

    - **Subscription**: select an Azure subscription.
    - **Resource group**: select an existing resource group from the drop-down, or select **Create new**, enter a unique name for the resource group, and then click **OK**.
    - **Location**: select a location.  For example, **Central US**.
    - **Admin username**: provide a username, such as *azureuser*.
    - **Authentication type**: You can choose between using an SSH key or a password.
	- **Admin Password Or Key** depending on what you choose for authentication type:
		- If you choose **password**, the password must be at least 12 characters long and meet the [defined complexity requirements](faq.md#what-are-the-password-requirements-when-creating-a-vm).
		- If you choose **sshPublicKey**, paste in the contents of your public key.
    - **DNS label prefix**: enter a unique identifier to use as part of the DNS label.
    - **Ubuntu OS version**: select which version of Ubuntu you want to run on the VM.
    - **Location**: the default is the same location as the resource group, if it already exists.
    - **VM size**: select the [size](sizes.md) to use for the VM.
    - **Virtual Network Name**: name to be used for the vNet.
	- **Subnet Name**: name for the subnet the VM should use.
	- **Network Security Group Name**: name for the NSG.
1. Select **Review + create**. After validation completes, select **Create** to create and deploy the VM.


The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure CLI, Azure PowerShell, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

You can use the Azure portal to check on the VM and other resource that were created. After the deployment is finished, select **Go to resource group** to see the VM and other resources.


## Clean up resources

When no longer needed, delete the resource group, which deletes the VM and all of the resources in the resource group. 

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, type the name of the resource group and then select **Delete**.


## Next steps

In this quickstart, you deployed a simple virtual machine using a Resource Manager template. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)