---
title: Azure Resource Manager (ARM) templates in Azure DevTest Labs
description: Learn how Azure DevTest Labs uses Azure Resource Manager (ARM) templates to create and configure lab virtual machines (VMs) and environments.
ms.topic: conceptual
ms.date: 01/03/2022
---

# Azure Resource Manager (ARM) templates in Azure DevTest Labs

Azure DevTest Labs can use Azure Resource Manager (ARM) templates for many tasks, from creating and provisioning labs and virtual machines (VMs) to adding users.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

In DevTest Labs, you can:

- [Use an ARM quickstart template](#arm-quickstart-templates) to deploy a lab with a virtual machine (VM).

- Create your own ARM templates to use for various tasks. Follow the steps at [Create and deploy ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md), and modify the example templates for your needs.

- Access the public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab) for preconfigured [ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates) and [scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts) that you can use as-is or customize.

- [Connect public and private template repositories to DevTest Labs](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs), so lab users can use the templates to create and manage their own resources and environments.

- [Use an ARM template from any available Azure VM base image](devtest-lab-use-resource-manager-template.md) to create more VMs or custom images.

- [Use ARM environment templates](devtest-lab-create-environment-from-arm.md) to create multi-VM infrastructure-as-a-service (IaaS) or platform-as-a-service (PaaS) DevTest Labs environments.

- [Use ARM templates with Azure PowerShell or Azure CLI automation](#arm-template-automation) to create, deploy, and manage labs, environments, and VMs.

## Multi-VM vs. single-VM ARM templates

DevTest Labs often uses ARM templates to create VMs. There are two methods for creating VMs in DevTest Labs. Each method is used for different scenarios and requires different permissions. The ARM template's `resource` property declares the method to use.

### Microsoft.Compute/virtualmachines

ARM templates use the [Microsoft.Compute/virtualmachines](/azure/templates/microsoft.compute/virtualmachines) resource type to provision multiple lab VMs and PaaS resources in a single environment, such as a SharePoint farm. Lab users can use these templates to create multi-VM environments. VMs created with this resource type appear under the environments in the lab's **My environments** list.

:::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/devtestlab-lab-vm-single-environment.png" alt-text="Screenshot that shows V Ms in an environment in the My environments list.":::

For more information and instructions for configuring and using environment templates, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

### Microsoft.DevTestLab/labs/virtualmachines

To provision individual VM configurations, ARM templates use the [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/2018-09-15/labs/virtualmachines) resource type. Each VM created with this resource type appears as a separate item in the lab's **My virtual machines** list. To create and deploy these VMs, you can [use a quickstart template](#arm-quickstart-templates) from the Azure portal. You can also use ARM templates with Azure PowerShell or Azure CLI to [automate VM deployment](#arm-template-automation).

:::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/devtestlab-lab-vm-single-item.png" alt-text="Screenshot that shows the list of single V Ms in the DevTest Labs virtual machines list.":::

## ARM quickstart templates

To use an ARM template to quickly create a DevTest Labs lab with a Windows Server VM, follow the instructions at [Quickstart: Use an ARM template to create a lab in DevTest Labs](create-lab-windows-vm-template.md).

Or, to access DevTest Labs quickstart template from the Azure portal:

1. In the Azure portal, search for and select **Deploy a custom template**.
1. On the **Custom deployment** screen, make sure **Quickstart template** is selected, and select the dropdown arrow next to **Quickstart template (disclaimer)**.
1. Type *devtest* in the filter box, and then select the **dtl-create-lab-windows-vm-claimed** template or other quickstart template from the popup list.
1. Select **Select template**. You can also select **Edit template** to modify the template.

:::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/custom-deployment.png" alt-text="Screenshot of selecting the template on the Custom deployment page.":::

## ARM template automation

Lab administrators can deploy ARM templates with Azure CLI or Azure PowerShell to automate VM creation and management.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Use the Azure CLI commands [az lab vm create](/cli/azure/lab/vm#az_lab_vm_create) and [az deployment group create](/cli/azure/deployment/group#az_deployment_group_create) to automate VM creation with ARM templates. For more information and instructions, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

Use the Azure PowerShell commands [New-AzResource](/powershell/module/az.resources/new-azresource) and [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to provision VMs with ARM templates.

Provisioning VMs with PowerShell requires administrator permissions. Lab administrators can deploy ARM templates to create claimable lab VMs or image factory golden images. Lab users can then use the custom images to create VM instances. For more information and instructions, see [Create a DevTest Labs VM with Azure PowerShell](devtest-lab-vm-powershell.md).

Administrators can also automate ARM environment template deployment to fully manage development and test environments. For information and instructions, see [Automate environment creation with PowerShell](devtest-lab-create-environment-from-arm.md#automate-environment-creation).

You can automate several other common tasks by using ARM templates with PowerShell:

- [Create a custom image from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md)
- [Upload a VHD file to a lab's storage account using PowerShell](devtest-lab-upload-vhd-using-powershell.md)
- [Add an external user to a lab using PowerShell](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
- [Create a lab custom role using PowerShell](devtest-lab-grant-user-permissions-to-specific-lab-policies.md#creating-a-lab-custom-role-using-powershell)

## Next steps

- [Best practices for creating Azure Resource Manager templates](../azure-resource-manager/templates/best-practices.md) has guidelines and suggestions for creating reliable, easy to use ARM templates.
- [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) has general information about using Azure PowerShell with ARM templates.
- The public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab) has preconfigured [quickstart ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates), [PowerShell scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts), [artifacts](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), and [environments](https://github.com/Azure/azure-devtestlab/tree/master/Environments) that you can use as-is or customize for your needs.
- Explore the ARM templates in the [Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates).
