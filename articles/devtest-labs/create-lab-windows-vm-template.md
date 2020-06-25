---
title: Create a lab using Azure DevTest Labs and Resource Manager template
description: In this tutorial, you create a lab in Azure DevTest Labs by using an Azure Resource Manager template. A lab admin sets up a lab, creates VMs in the lab, and configures policies.
services: devtest-lab
author: spelluru

ms.service: lab-services
ms.topic: tutorial
ms.date: 06/25/2020
ms.author: spelluru
---

# Tutorial: Set up a lab by using Azure DevTest Labs (Resource Manager template)
In this tutorial, you create a lab with a Windows Server 2019 Datacenter VM by using an Azure Resource Manager template. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

VMs are created in this resource group rather than in the resource group in which the lab exists. 

## Prerequisites

None.

## Create a lab with a Windows Server 2019 Datacenter VM

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-dtl-create-lab-windows-vm/).

:::code language="json" source="~/quickstart-templates/101-dtl-create-lab-windows-vm/azuredeploy.json" range="1-97" highlight="51-85":::

The resources defined in the template include:

- [**Microsoft.DevTestLab/labs**](/azure/templates/microsoft.devtestlab/labs)
- [**Microsoft.DevTestLab labs/virtualnetworks**](/azure/templates/microsoft.devtestlab/labs/virtualnetworks)
- [**Microsoft.DevTestLab labs/virtualmachines template reference**](/azure/templates/microsoft.devtestlab/labs/virtualmachines)

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?term=eventhub&pageNumber=1&sort=Popular).


## Next steps
In this tutorial, you created a lab with a VM and gave a user access to the lab. To learn about how to access the lab as a lab user, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)

