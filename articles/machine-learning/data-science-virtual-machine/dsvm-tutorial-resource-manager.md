---
title: 'Quickstart: Create a Data Science VM - Resource Manager template'
titleSuffix: Azure Data Science Virtual Machine 
description: In this quickstart, you use an Azure Resource Manager template to quickly deploy a Data Science Virtual Machine
services: machine-learning
author: lobrien
ms.author: laobri
ms.custom: subject-armqs
ms.date: 06/10/2020
ms.service: machine-learning
ms.subservice: data-science-vm
ms.topic: quickstart
---

# Quickstart: Create an Ubuntu Data Science Virtual Machine using a Resource Manager template
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

This quickstart will show you how to create an Ubuntu 18.04 Data Science Virtual Machine using an Azure Resource Manager template. Data Science Virtual Machines are cloud-based virtual machines preloaded with a suite of data science and machine learning frameworks and tools. When deployed on GPU-powered compute resources, all tools and libraries are configured to use the GPU. 

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)

## Create a workspace

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-vm-ubuntu-DSVM-GPU-or-CPU/). The complete template for this article is too long to show here. To view the complete template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json). The portion that defines the specifics of the DSVM is shown here:

:::code language="json" source="~/quickstart-templates/101-vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json" range="235-276":::

The following resources are defined in the template:

* [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Create a cloud-based virtual machine. In this template, the virtual machine is configured as a Data Science Virtual Machine running Ubuntu 18.04.

### Deploy the template 

To use the template from the Azure CLI, login and choose your subscription (See [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest)). Then run:

```azurecli-interactive
read -p "Enter the name of the resource group to create:" resourceGroupName &&
read -p "Enter the Azure location (e.g., centralus):" location &&
read -p "Enter the authentication type (must be 'password' or 'sshPublicKey') :" authenticationType &&
read -p "Enter the login name for the administrator account (may not be 'admin'):" adminUsername &&
read -p "Enter administrator account secure string (value of password or ssh public key):" adminPasswordOrKey &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri $templateUri --parameters adminUsername=$adminUsername authenticationType=$authenticationType adminPasswordOrKey=$adminPasswordOrKey && 
echo "Press [ENTER] to continue ..." &&
read
```

When you run the above command, enter:

1. The name of the resource group you'd like to create to contain the DSVM and associated resources. 
1. The Azure location in which you wish to make the deployment
1. The authentication type you'd like to use (enter the string `password` or `sshPublicKey`)
1. The login name of the administrator account (this value may not be `admin`)
1. The value of the password or ssh public key for the account

## Review deployed resources

To see your Data Science Virtual Machine:

1. Go to https://portal.azure.com 
1. Sign in 
1. Choose the resource group you just created

You'll see the Resource Group's information: 

:::image type="content" source="media/dsvm-tutorial-resource-manager/resource-group-home.png" alt-text="Screenshot of a basic Resource Group containing a DSVM":::

Click on the Virtual Machine resource to go to its information page. Here you can find information on the VM, including connection details. 

## Clean up resources

If you don't want to use this virtual machine, delete it. Since the DSVM is associated with other resources such as a storage account, you'll probably want to delete the entire resource group you created. You can delete the resource group using the portal by clicking on the "Delete" button and confirming. Or, you can delete the resource group from the CLI with: 

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you created a Data Science Virtual Machine from an Azure Resource Manager template. 

> [!div class="nextstepaction"]
> [Sample programs & ML walkthroughs](dsvm-samples-and-walkthroughs.md)
