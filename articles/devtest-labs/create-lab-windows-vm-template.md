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

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Review the template 
> * Deploy the template
> * Verify the template
> * Cleanup resources

## Prerequisites

None.

## Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-dtl-create-lab-windows-vm/).

:::code language="json" source="~/quickstart-templates/101-dtl-create-lab-windows-vm/azuredeploy.json" range="1-97" highlight="51-85":::

The resources defined in the template include:

- [**Microsoft.DevTestLab/labs**](/azure/templates/microsoft.devtestlab/labs)
- [**Microsoft.DevTestLab labs/virtualnetworks**](/azure/templates/microsoft.devtestlab/labs/virtualnetworks)
- [**Microsoft.DevTestLab labs/virtualmachines**](/azure/templates/microsoft.devtestlab/labs/virtualmachines)

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

## Deploy the template

To deploy the template:

1. Select **Try it** from the following code block, and then follow the instructions to sign in to the Azure Cloud Shell.

   ```azurepowershell-interactive
   $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
   $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
   $resourceGroupName = "${projectName}rg"
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-dtl-create-lab-windows-vm/azuredeploy.json"

   New-AzResourceGroup -Name $resourceGroupName -Location $location
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName

   Write-Host "Press [ENTER] to continue ..."
   ```

   It takes some time to create a lab with a Windows Server 2019 Datacenter VM.

1. Select **Copy** to copy the PowerShell script.
1. Right-click the shell console, and then select **Paste**.

## Verify the deployment
To verify the deployment, open the resource group from the [Azure portal](https://portal.azure.com) and confirm that you see a DevTest Labs instance (lab). When you select the, you see the home page for the lab with one VM in the list of VMs. 

## Clean up resources
When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```

## Next steps
In this tutorial, you created a lab with a VM and gave a user access to the lab. To learn about how to access the lab as a lab user, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)

