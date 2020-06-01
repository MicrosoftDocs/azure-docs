---
title: 'Quickstart: Use a Resource Manager template to create a Linux VM'
description: In this quickstart, you learn how to use the Azure CLI to create a Linux virtual machine
author: cynthn
ms.service: virtual-machines-linux
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 06/01/2020
ms.author: cynthn
ms.custom: subject-armqs
<!-- https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux/ -- >

---

# Quickstart: Create a Linux virtual machine using a Resource Manager template

This quickstart shows you how to use a Resource Manager template to deploy a Linux virtual machine (VM) in Azure. 

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an SSH key

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the menu at the top of the page, select the `>_` icon to open Cloud Shell.
1. Make sure the CloudShell says **Bash** in the upper left. If it says PowerShell, use the drop-down to select **Bash** and select **Confirm** to change to the Bash shell.
1. Type `ssh-keygen -t rsa -b 2048` to create the ssh key. 
1. You will be prompted to enter a file in which to save the key pair. Just press **Enter** to save in the default location, listed in brackets. 
1. You will be asked to enter a passphrase. You can type a passphrase for your SSH key or press **Enter** to continue without a passphrase.
1. The `ssh-keygen` command generates public and private keys with the default name of `id_rsa` in the `~/.ssh directory`. The command returns the full path to the public key. Use the path to the public key to display its contents with `cat` by typing `cat ~/.ssh/id_rsa.pub`.
1. Copy the output of this command and save it somewhere to use later in this article. This is your public key and you will need it when configuring your administrator account to log in to your VM.


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/en-us/resources/templates/101-vm-simple-linux/).

:::code language="json" source="~/quickstart-templates/101-vm-simple-linux/azuredeploy.json" range="000-000" highlight="000-000":::

## Deploy the template


[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-vm-simple-linux%2fazuredeploy.json)


```azurecli-interactive
read -p "Enter a project name that is used for generating resource names:" projectName &&
read -p "Enter the location (i.e. centralus):" location &&
templateUri="https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux/azuredeploy.json" &&
resourceGroupName="${projectName}rg" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri
echo "Press [ENTER] to continue ..." &&
read
```

## Review deployed resources

## Clean up resources




## Next steps

In this quickstart, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
