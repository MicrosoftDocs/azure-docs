---
title: 'Quickstart: Create a Data Science VM - Resource Manager template'
titleSuffix: Azure Data Science Virtual Machine
description: In this quickstart, you use an Azure Resource Manager template to quickly deploy a Data Science Virtual Machine
services: machine-learning
author: s-polly
ms.author: scottpolly
ms.date: 06/10/2020
ms.topic: quickstart
ms.service: data-science-vm
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an Ubuntu Data Science Virtual Machine using an ARM template

This quickstart will show you how to create an Ubuntu Data Science Virtual Machine using an Azure Resource Manager template (ARM template). Data Science Virtual Machines are cloud-based virtual machines preloaded with a suite of data science and machine learning frameworks and tools. When deployed on GPU-powered compute resources, all tools and libraries are configured to use the GPU.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fdatascience%2Fvm-ubuntu-DSVM-GPU-or-CPU%2Fazuredeploy.json)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/services/machine-learning/) before you begin.

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/vm-ubuntu-DSVM-GPU-or-CPU/).

:::code language="json" source="~/quickstart-templates/application-workloads/datascience/vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json":::

The following resources are defined in the template:

* [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces)
* [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
* [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
* [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Create a cloud-based virtual machine. In this template, the virtual machine is configured as a Data Science Virtual Machine running Ubuntu.

## Deploy the template

To use the template from the Azure CLI, login and choose your subscription (See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli)). Then run:

```azurecli-interactive
read -p "Enter the name of the resource group to create:" resourceGroupName &&
read -p "Enter the Azure location (e.g., centralus):" location &&
read -p "Enter the authentication type (must be 'password' or 'sshPublicKey') :" authenticationType &&
read -p "Enter the login name for the administrator account (may not be 'admin'):" adminUsername &&
read -p "Enter administrator account secure string (value of password or ssh public key):" adminPasswordOrKey &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/application-workloads/datascience/vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri $templateUri --parameters adminUsername=$adminUsername authenticationType=$authenticationType adminPasswordOrKey=$adminPasswordOrKey &&
echo "Press [ENTER] to continue ..." &&
read
```

When you run the above command, enter:

1. The name of the resource group you'd like to create to contain the DSVM and associated resources.
1. The Azure location in which you wish to make the deployment.
1. The authentication type you'd like to use (enter the string `password` or `sshPublicKey`).
1. The login name of the administrator account (this value may not be `admin`).
1. The value of the password or ssh public key for the account.

## Review deployed resources

To see your Data Science Virtual Machine:

1. Go to the [Azure portal](https://portal.azure.com)
1. Sign in.
1. Choose the resource group you just created.

You'll see the Resource Group's information:

:::image type="content" source="media/dsvm-tutorial-resource-manager/resource-group-home.png" alt-text="Screenshot of a basic Resource Group containing a DSVM":::

Click on the Virtual Machine resource to go to its information page. Here you can find information on the VM, including connection details.

## Clean up resources

If you don't want to use this virtual machine, delete it. Since the DSVM is associated with other resources such as a storage account, you'll probably want to delete the entire resource group you created. You can delete the resource group using the portal by clicking on the **Delete** button and confirming. Or, you can delete the resource group from the CLI with:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you created a Data Science Virtual Machine from an ARM template.

> [!div class="nextstepaction"]
> [Sample programs & ML walkthroughs](dsvm-samples-and-walkthroughs.md)
