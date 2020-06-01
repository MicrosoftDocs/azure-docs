---
title: 'Quickstart: Use a Resource Manager template to create a Windows VM'
description: In this quickstart, you learn how to use the Azure CLI to create a Windows virtual machine
author: cynthn
ms.service: virtual-machines-windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 06/01/2020
ms.author: cynthn
ms.custom: subject-armqs
<!-- https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows/ -- >

---

# Quickstart: Create a Windows virtual machine using a Resource Manager template

This quickstart shows you how to use a Resource Manager template to deploy a Windows virtual machine (VM) in Azure. 

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/en-us/resources/templates/101-vm-simple-windows/).


:::code language="json" source="~/quickstart-templates/101-vm-simple-windows/azuredeploy.json" range="000-000" highlight="000-000":::

## Deploy the template


[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-vm-simple-windows%2fazuredeploy.json)

## Review deployed resources


## Clean up resources



## Next steps

In this quickstart, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
