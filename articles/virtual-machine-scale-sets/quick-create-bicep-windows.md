---
title: Quickstart - Create a Windows Virtual Machine Scale Set with Bicep
description: Learn how to quickly create a Windows virtual machine scale with Bicep to deploy a sample app and configures autoscale rules
author: ju-shim
ms.author: jushiman
ms.topic: quickstart
ms.service: virtual-machine-scale-sets
ms.collection: windows
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create a Windows Virtual Machine Scale Set with Bicep

A Virtual Machine Scale Set allows you to deploy and manage a set of auto-scaling virtual machines. You can scale the number of VMs in the Virtual Machine Scale Set manually, or define rules to autoscale based on resource usage like CPU, memory demand, or network traffic. An Azure load balancer then distributes traffic to the VM instances in the Virtual Machine Scale Set. In this quickstart, you create a Virtual Machine Scale Set and deploy a sample application with Bicep.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/vmss-windows-webapp-dsc-autoscale/).

:::code language="bicep" source="~/quickstart-templates/demos/vmss-windows-webapp-dsc-autoscale/main.bicep":::

The following resources are defined in the Bicep file:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)
- [**Microsoft.Compute/virtualMachineScaleSets**](/azure/templates/microsoft.compute/virtualmachinescalesets)
- [**Microsoft.Insights/autoscaleSettings**](/azure/templates/microsoft.insights/autoscalesettings)

### Define a scale set

To create a Virtual Machine Scale Set with a Bicep file, you define the appropriate resources. The core parts of the Virtual Machine Scale Set resource type are:

| Property                     | Description of property                                  | Example template value                    |
|------------------------------|----------------------------------------------------------|-------------------------------------------|
| type                         | Azure resource type to create                            | Microsoft.Compute/virtualMachineScaleSets |
| name                         | The scale set name                                       | myScaleSet                                |
| location                     | The location to create the scale set                     | East US                                   |
| sku.name                     | The VM size for each scale set instance                  | Standard_A1                               |
| sku.capacity                 | The number of VM instances to initially create           | 2                                         |
| upgradePolicy.mode           | VM instance upgrade mode when changes occur              | Automatic                                 |
| imageReference               | The platform or custom image to use for the VM instances | Microsoft Windows Server 2016 Datacenter  |
| osProfile.computerNamePrefix | The name prefix for each VM instance                     | myvmss                                    |
| osProfile.adminUsername      | The username for each VM instance                        | azureuser                                 |
| osProfile.adminPassword      | The password for each VM instance                        | P@ssw0rd!                                 |

To customize a Virtual Machine Scale Set Bicep file, you can change the VM size or initial capacity. Another option is to use a different platform or a custom image.

### Add a sample application

To test your Virtual Machine Scale Set, install a basic web application. When you deploy a Virtual Machine Scale Set, VM extensions can provide post-deployment configuration and automation tasks, such as installing an app. Scripts can be downloaded from [GitHub](https://azure.microsoft.com/resources/templates/vmss-windows-webapp-dsc-autoscale/) or provided to the Azure portal at extension run-time. To apply an extension to your Virtual Machine Scale Set, add the `extensionProfile` section to the resource example above. The extension profile typically defines the following properties:

- Extension type
- Extension publisher
- Extension version
- Location of configuration or install scripts
- Commands to execute on the VM instances

The Bicep file uses the PowerShell DSC extension to install an ASP.NET MVC app that runs in IIS.

An install script is downloaded from GitHub, as defined in `url`. The extension then runs `InstallIIS` from the `IISInstall.ps1` script, as defined in `function` and `Script`. The ASP.NET app itself is provided as a Web Deploy package, which is also downloaded from GitHub, as defined in `WebDeployPackagePath`:

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters vmssName=<vmss-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -vmssName "<vmss-name>"
    ```

    ---

    Replace *\<vmss-name\>* with the name of the Virtual Machine Scale Set. It must be 3-61 characters in length and globally unique across Azure. You'll be prompted to enter `adminPassword`.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded. It can take 10-15 minutes for the Virtual Machine Scale Set to be created and apply the extension to configure the app.

## Validate the deployment

To see your Virtual Machine Scale Set in action, access the sample web application in a web browser. Obtain the public IP address of your load balancer using Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
az network public-ip show --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzPublicIpAddress -ResourceGroupName exampleRG | Select IpAddress
```

---

Enter the public IP address of the load balancer in to a web browser in the format *http:\//publicIpAddress/MyApp*. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Running IIS site](./media/virtual-machine-scale-sets-create-powershell/running-iis-site.png)

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to remove the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a Windows Virtual Machine Scale Set with a Bicep file and used the PowerShell DSC extension to install a basic ASP.NET app on the VM instances. To learn more, continue to the tutorial for how to create and manage Azure Virtual Machine Scale Sets.

> [!div class="nextstepaction"]
> [Create and manage Azure Virtual Machine Scale Sets](tutorial-create-and-manage-powershell.md)
