---
title: Azure Resource Manager (ARM) templates in Azure DevTest Labs
description: Learn how Azure DevTest Labs uses Azure Resource Manager (ARM) templates to create and configure lab virtual machines (VMs) and environments.
ms.topic: conceptual
ms.date: 01/03/2022
---

# Azure Resource Manager (ARM) templates in Azure DevTest Labs

There are several ways to use Azure Resource Manager (ARM) templates in Azure DevTest Labs:

- [Use an ARM quickstart template](#arm-quickstart-templates) in the Azure portal to create a lab with a virtual machine (VM).

- Save an ARM template from any available Azure virtual machine (VM) base image, edit it to meet your needs, and use it to create more VMs or custom images. Or create your own ARM templates. For more information and instructions, see [Create Azure virtual machines from ARM templates](devtest-lab-use-resource-manager-template.md).

- Use an ARM environment template to create a multi-VM infrastructure-as-a-service (IaaS) or platform-as-a-service (PaaS) DevTest Labs environment. For more information and instructions, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

- [Use ARM templates with Azure PowerShell or Azure CLI automation](#arm-templates-with-azure-powershell-or-azure-cli) to create, deploy, and manage labs and VMs.

The public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab) has preconfigured [ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates) and [scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts) for many DevTest Labs tasks. You can use these templates and scripts as-is, or customize them to meet your needs.

To create your own ARM templates, follow the steps at [Create your first Azure Resource Manager template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md), and modify the templates for your needs. [Best practices for creating Azure Resource Manager templates](../azure-resource-manager/templates/best-practices.md) has many guidelines and suggestions for creating reliable, easy to use ARM templates.

You can [connect public and private template repositories to DevTest Labs](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs), so lab users can use the templates to create and manage their own resources and environments.

## Multi-VM vs. single-VM ARM templates

ARM templates are often used in DevTest Labs for creating VMs. There are two methods for creating VMs in DevTest Labs. Each method is used for different scenarios and requires different permissions. The ARM template's `resource` property declares the method to use.

### Microsoft.Compute/virtualmachines

ARM templates use the [Microsoft.Compute/virtualmachines](/azure/templates/microsoft.compute/virtualmachines) resource type to provision multiple lab VMs and PaaS resources in a single environment, such as a SharePoint farm. Lab users can use these templates to create multi-VM environments. VMs created with this resource type appear under the environments in the lab's **My environments** list.

:::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/devtestlab-lab-vm-single-environment.png" alt-text="Screenshot that shows V Ms in an environment in the My environments list.":::

For more information and instructions for configuring and using environment templates, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

### Microsoft.DevTestLab/labs/virtualmachines

To provision individual VM configurations, ARM templates use the [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/2018-09-15/labs/virtualmachines) resource type. You can [use a quickstart template](#arm-quickstart-templates) from the Azure portal to create and deploy these VMs. You can also use an ARM template with Azure PowerShell or Azure CLI to [automate VM deployment](#automated-arm-template-deployment). Each VM created with this resource type appears as a separate item in the lab's **My virtual machines** list.

:::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/devtestlab-lab-vm-single-item.png" alt-text="Screenshot that shows the list of single V Ms in the DevTest Labs virtual machines list.":::

## ARM quickstart templates

To use an ARM template to quickly create a DevTest Labs lab with a Windows Server VM, follow the instructions at [Quickstart: Use an ARM template to create a lab in DevTest Labs](create-lab-windows-vm-template.md).

Or, to deploy the quickstart template from the Azure portal:

1. In the Azure portal, search for and select **Deploy a custom template**.

1. On the **Custom deployment** screen, make sure **Quickstart template** is selected, and select the dropdown arrow next to **Quickstart template (disclaimer)**.

1. Type *devtest* in the filter box, and then select the **dtl-create-lab-windows-vm-claimed** template from the popup list.

1. Select **Select template**. You can also select **Edit template** to modify the template.

   :::image type="content" source="./media/devtest-lab-use-arm-and-powershell-for-lab-resources/custom-deployment.png" alt-text="Screenshot of selecting the template on the Custom deployment page.":::

1. On the **Creates a lab in Azure DevTest Labs with a claimed VM** screen, complete the following items:

   - **Resource group**: Select an existing resource group from the dropdown list, or create a new resource group so it's easy to clean up later.
   - **Region**: If you created a new resource group, select a location for the resource group and lab.
   - **Lab Name**: Enter a name for the new lab.
   - **Vm Name**: Enter a name for the new VM.
   - **User Name**: Enter a name for the user who can access the VM.
   - **Password**: Enter a password for the VM user.

1. Select **Review + create**, and when validation passes, select **Create**. Deployment, especially creating a VM, takes a while.

## Automated ARM template deployment

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Lab administrators can deploy ARM templates with PowerShell or Azure CLI to automate VM and environment creation and management.

Use the Azure CLI commands [az lab vm create](/cli/azure/lab/vm#az_lab_vm_create) and [az deployment group create](/cli/azure/deployment/group#az_deployment_group_create) to automatically provision VMs with ARM templates. For more information and instructions, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

Use the Azure PowerShell commands [New-AzResource](/powershell/module/az.resources/new-azresource) and [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to provision VMs with ARM templates. Provisioning VMs with PowerShell requires administrator permissions, so the DevTest Labs user role can't do these deployments.

[Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) provides general information about using Azure PowerShell with ARM templates to deploy resources to Azure.

Lab administrators can deploy ARM templates to create claimable lab VMs or image factory golden images. Lab users can then use the custom images to create VM instances. For more information and instructions, see [Create a DevTest Labs VM with Azure PowerShell](devtest-lab-vm-powershell.md).

Administrators can also automate ARM environment template deployment to manage development and test environments. For information and instructions, see [Automate environment creation with PowerShell](devtest-lab-create-environment-from-arm.md#automate-environment-creation-with-powershell).

You can automate several other common tasks by using ARM templates with PowerShell:

- [Create a custom image from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md)
- [Upload a VHD file to a lab's storage account using PowerShell](devtest-lab-upload-vhd-using-powershell.md)
- [Add an external user to a lab using PowerShell](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
- [Create a lab custom role using PowerShell](devtest-lab-grant-user-permissions-to-specific-lab-policies.md#creating-a-lab-custom-role-using-powershell)

### Next steps

- Learn how to create a [private Git repository](devtest-lab-add-artifact-repo.md) where you will store your customized templates or scripts.
- Explore the [Azure Resource Manager templates from Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates).

