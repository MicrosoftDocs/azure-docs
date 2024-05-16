---
title: 'Quickstart: Create a Data Science VM - Resource Manager template'
titleSuffix: Azure Data Science Virtual Machine
description: Learn how to use an Azure Resource Manager template to quickly deploy a Data Science Virtual Machine
services: machine-learning
author: s-polly
ms.author: scottpolly
ms.reviewer: franksolomon
ms.date: 04/23/2024
ms.topic: quickstart
ms.service: data-science-vm
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an Ubuntu Data Science Virtual Machine using an ARM template

This quickstart shows how to create an Ubuntu Data Science Virtual Machine (DSVM) using an Azure Resource Manager template (ARM template). A Data Science Virtual Machines is a cloud-based resource, preloaded with a suite of data science and machine learning frameworks and tools. When deployed on GPU-powered compute resources, all tools and libraries are configured to use the GPU.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you know how to use ARM templates, select the **Deploy to Azure** button. This opens the template in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Screenshot showing the button that deploys the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fdatascience%2Fvm-ubuntu-DSVM-GPU-or-CPU%2Fazuredeploy.json":::

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/services/machine-learning/) before you begin.

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

## Review the template

You can find the template used in this quickstart at the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/vm-ubuntu-DSVM-GPU-or-CPU/) resource.

:::code language="json" source="~/quickstart-templates/application-workloads/datascience/vm-ubuntu-DSVM-GPU-or-CPU/azuredeploy.json":::

The template defines these resources:

* [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces)
* [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
* [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
* [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Create a cloud-based virtual machine. In this template, the virtual machine is configured as a Data Science Virtual Machine that runs Ubuntu.

## Deploy the template

To use the template from the Azure CLI, sign in and choose your subscription (See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli)). Then run:

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

When you run this code, enter:

1. The name of the resource group to contain the DSVM and associated resources that you'd like to create
1. The Azure location where you want to make the deployment
1. The authentication type you want to use (enter the string `password` or `sshPublicKey`)
1. The login name of the administrator account (this value might not be `admin`)
1. The value of the password or ssh public key for the account

## Review deployed resources

To display your Data Science Virtual Machine:

1. Go to the [Azure portal](https://portal.azure.com)
1. Sign in
1. Choose the resource group you just created

This displays the Resource Group information:

:::image type="content" source="media/dsvm-tutorial-resource-manager/resource-group-home.png" alt-text="Screenshot showing a basic Resource Group containing a DSVM":::

Select the Virtual Machine resource to go to its information page. Here you can find information about the VM, including connection details.

## Clean up resources

If you don't want to use this virtual machine, you should delete it. Since the DSVM is associated with other resources such as a storage account, you might want to delete the entire resource group you created. Using the portal, you can delete the resource group. Select the **Delete** button and then confirm your choice. You can also delete the resource group from the CLI as shown here:

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
