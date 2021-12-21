---
title: Azure Resource Manager templates in Azure DevTest Labs
description: Learn how Azure DevTest Labs uses Azure Resource Manager (ARM) templates to create and configure virtual machines (VMs) and environments.
ms.topic: conceptual
ms.date: 12/20/2021
---

# ARM templates in Azure DevTest Labs

There are several ways to use Azure Resource Manager (ARM) templates to create, modify, and deploy labs and lab resources in Azure DevTest Labs.

- Save an ARM template from any available base image in DevTest Labs, modify the template to meet your needs, and use it to create VMs.

- Use ARM templates with Azure PowerShell or Azure CLI automation to create, deploy, and manage labs and VMs.

- Use ARM environment templates to create multi-VM infrastructure-as-a-service (IaaS) and platform-as-a-service (PaaS) DevTest Labs environments.

- Use ARM templates for other DevTest Labs functions like adding users or?

## Use ARM templates

In DevTest Labs, you can use your own ARM templates, use publicly available templates as-is, or modify example or base templates and use the modified templates.

### Create your own ARM templates

To create ARM templates, follow the steps at [Create your first Azure Resource Manager template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). You can use the approaches or examples provided, and modify the templates for your needs. [Best practices for creating Azure Resource Manager templates](../azure-resource-manager/templates/best-practices.md) has many guidelines and suggestions for creating reliable, easy to use ARM templates. [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) provides general information about using Azure PowerShell with ARM templates to deploy resources to Azure.

### Use publicly available ARM templates

The public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab) has preconfigured [ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates) and [scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts) that you can use as-is, or customize for your needs.

You can also save any available VM base image from the Azure portal as an ARM template. You can use the template to create VMs with that image, or modify the template to meet your needs. For more information, see [View, edit, and save an ARM template for a VM](devtest-lab-use-resource-manager-template.md#view-edit-and-save-an-arm-template-for-a-vm).

### Make templates available in DevTest Labs

Store your authored, customized, and modified ARM templates under source control in a public or private Git repository. For more information and instructions, see [Store ARM templates in Git repositories](devtest-lab-use-resource-manager-template.md#store-arm-templates-in-git-repositories).

You can connect the public template repository and your private repositories to DevTest Labs so lab users can use the templates directly from the portal.  and [Add template repositories to labs](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

Lab users can create environments by selecting an ARM environment template in the DevTest Labs portal, just as they can select and create individual [VM base images](devtest-lab-comparing-vm-base-image-types.md). For information and instructions on creating environments from ARM templates, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

Lab administrators can automate ARM template deployment with PowerShell or Azure CLI to manage development or test VMs and environments. For information, see [Create a DevTest Labs VM with Azure PowerShell](devtest-lab-vm-powershell.md) and [Automate environment creation with PowerShell](devtest-lab-create-environment-from-arm.md#automate-environment-creation-with-powershell).

## Multi-VM vs. single-VM ARM templates

The most common uses of ARM templates in DevTest Labs are for creating labs, virtual machines (VMs), and environments. There are two methods for creating VMs in DevTest Labs. Each method is used for different scenarios and requires different permissions. The ARM template's `resource` property declares the method to use.

### Microsoft.DevTestLab/labs/virtualmachines

To provision individual VM configurations, ARM templates use a [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/2018-09-15/labs/virtualmachines) resource type. Each VM created with this resource type appears as a separate item in the DevTest Labs **My virtual machines** list.

![Screenshot that shows the list of single V Ms in the DevTest Labs virtual machines list.](./media/devtest-lab-use-arm-template/devtestlab-lab-vm-single-item.png)

For more information and instructions for using ARM templates to create VMs, see [Create virtual machines from ARM templates](devtest-lab-use-resource-manager-template.md).

You can automatically provision VMs by using the Azure PowerShell commands [New-AzResource](/powershell/module/az.resources/new-azresource) or [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) with ARM templates. Provisioning VMs with PowerShell requires administrator permissions, so the DevTest Labs user role can't do these deployments. Lab administrators can use the templates to automate creating claimable lab VMs or image factory golden images.

You can also use the Azure CLI commands [az lab vm create](/cli/azure/lab/vm#az_lab_vm_create) or [az deployment group create](/cli/azure/deployment/group#az_deployment_group_create) to automatically provision VMs with ARM templates. For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

### Microsoft.Compute/virtualmachines

ARM templates can use the [Microsoft.Compute/virtualmachines](/azure/templates/microsoft.compute/virtualmachines) resource type to provision multiple lab VMs and platform-as-a-service (PaaS) resources in a single environment, such as a SharePoint farm. Lab users can use these templates to create multi-VM environments. VMs created with this resource type appear under the environments in the lab's **My environments** list.

![Screenshot that shows V Ms in an environment in the My environments list.](./media/devtest-lab-use-arm-template/devtestlab-lab-vm-single-environment.png)

For more information and instructions for configuring and using environment templates and environments, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).

## Common tasks you can perform in DevTest Labs using PowerShell
There are many other common tasks that you can automate by using ARM templates with PowerShell. The following articles describe how to do these tasks.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

- [Create a custom image from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md)
- [Upload VHD file to lab's storage account using PowerShell](devtest-lab-upload-vhd-using-powershell.md)
- [Add an external user to a lab using PowerShell](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
- [Create a lab custom role using PowerShell](devtest-lab-grant-user-permissions-to-specific-lab-policies.md#creating-a-lab-custom-role-using-powershell)

### Next steps

- Learn how to create a [private Git repository](devtest-lab-add-artifact-repo.md) where you will store your customized templates or scripts.
- Explore the [Azure Resource Manager templates from Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates).
A library of ARM templates is at. Other templates...
