---
title: Create a Linux VM in Azure from a template 
description: How to use the Azure CLI to create a Linux VM from a Resource Manager template
author: mattmcinnes
ms.service: virtual-machines
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.collection: linux
ms.topic: how-to
ms.date: 02/01/2023
ms.author: mattmcinnes
ms.reviewer: jamesser
---
# How to create a Linux virtual machine with Azure Resource Manager templates

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Learn how to create a Linux virtual machine (VM) by using an Azure Resource Manager template and the Azure CLI from the Azure Cloud shell. To create a Windows virtual machine, see [Create a Windows virtual machine from a Resource Manager template](../windows/ps-template.md).

An alternative is to deploy the template from the Azure portal. To open the template in the portal, select the **Deploy to Azure** button.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-sshkey%2Fazuredeploy.json":::

## Templates overview

Azure Resource Manager templates are JSON files that define the infrastructure and configuration of your Azure solution. By using a template, you can repeatedly deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state. To learn more about the format of the template and how you construct it, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). To view the JSON syntax for resources types, see [Define resources in Azure Resource Manager templates](/azure/templates/microsoft.compute/allversions).

## Quickstart template

>[!NOTE] 
> The provided template creates an [Azure Generation 2 VM](../generation-2.md) by default.

>[!NOTE]
> Only SSH authentication is enabled by default when using the quickstart template. When prompted, provide the value of your own SSH public key, such as the contents of *~/.ssh/id_rsa.pub*.
>
> If you don't have an SSH key pair, [create and use an SSH key pair for Linux VMs in Azure](mac-create-ssh-keys.md). 

Click **Copy** to add the quickstart template to your clipboard:


[!code-json[create-linux-vm](~/quickstart-templates/quickstarts/microsoft.compute/vm-sshkey/azuredeploy.json)]

You can also download or create a template and specify the local path with the `--template-file` parameter.

## Create a quickstart template VM with Azure CLI

After acquiring or creating a quickstart template, create a VM with it using the Azure CLI. 

The following command requests several pieces of input from the user. These include:
- Name of the Resource Group (resourceGroupName)
- Location of the Azure datacenter that hosts the VM (location)
- A name for resources related to the VM (projectName)
- Username for the administrator user (username)
- A public SSH key for accessing the VM's terminal (key)

Creating an Azure virtual machine requires a [resource group](./../../azure-resource-manager/management/manage-resource-groups-portal.md). Quickstart templates include resource group creation as part of the process. 

To run the CLI script, click **Open Cloudshell**. Once you have access to the Azure Cloudshell, click **Copy** to copy the command, right-click the shell, then select **Paste**.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location (i.e. centralus):" &&
read location &&
echo "Enter the project name (used for generating resource names):" &&
read projectName &&
echo "Enter the administrator username:" &&
read username &&
echo "Enter the SSH public key:" &&
read key &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/quickstarts/microsoft.compute/vm-sshkey/azuredeploy.json --parameters projectName=$projectName adminUsername=$username adminPublicKey="$key" &&
az vm show --resource-group $resourceGroupName --name "$projectName-vm" --show-details --query publicIps --output tsv
```

The last line in the command shows the public IP address of the newly created VM. You need the public IP address to connect to the virtual machine. 

## Connect to virtual machine

You can then SSH to your VM as normal. Provide your own public IP address from the preceding command:

```bash
ssh <adminUsername>@<ipAddress>
```

## Other templates

In this example, you created a basic Linux VM. For more Resource Manager templates that include application frameworks or create more complex environments, browse the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Compute&pageNumber=1&sort=Popular).

To learn more about creating templates, view the JSON syntax and properties for the resources types you deployed:

- [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)
- [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
- [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces)
- [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines)

## Next steps

- To learn how to develop Resource Manager templates, see [Azure Resource Manager documentation](../../azure-resource-manager/index.yml).
- To see the Azure virtual machine schemas, see [Azure template reference](/azure/templates/microsoft.compute/allversions).
- To see more virtual machine template samples, see [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Compute&pageNumber=1&sort=Popular).
