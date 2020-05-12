---
title: Quickstart - Create a Linux virtual machine scale set with an Azure Resource Manager template
description: Learn how to quickly create a Linux virtual machine scale with an Azure Resource Manager template that deploys a sample app and configures autoscale rules
author: ju-shim
ms.author: jushiman
ms.topic: quickstart
ms.service: virtual-machine-scale-sets
ms.subservice: linux
ms.date: 03/27/2020
ms.reviewer: mimckitt
ms.custom: mimckitt

---

# Quickstart: Create a Linux virtual machine scale set with an Azure Resource Manager template

A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on resource usage like CPU, memory demand, or network traffic. An Azure load balancer then distributes traffic to the VM instances in the scale set. In this quickstart, you create a virtual machine scale set and deploy a sample application with an Azure Resource Manager template.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

None.

## Create a scale set

Azure Resource Manager templates let you deploy groups of related resources. In a single template, you can create the virtual machine scale set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create additional, scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/201-vmss-bottle-autoscale/).

:::code language="json" source="~/quickstart-templates/201-vmss-bottle-autoscale/azuredeploy.json" range="1-330" highlight="176-264":::

These resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)
- [**Microsoft.Compute/virtualMachineScaleSets**](/azure/templates/microsoft.compute/virtualmachinescalesets)
- [**Microsoft.Insights/autoscaleSettings**](/azure/templates/microsoft.insights/autoscalesettings)

#### Define a scale set

The highlighted portion is the scale set resource definition. To create a scale with a template, you define the appropriate resources. The core parts of the virtual machine scale set resource type are:

| Property                     | Description of property                                  | Example template value                    |
|------------------------------|----------------------------------------------------------|-------------------------------------------|
| type                         | Azure resource type to create                            | Microsoft.Compute/virtualMachineScaleSets |
| name                         | The scale set name                                       | myScaleSet                                |
| location                     | The location to create the scale set                     | East US                                   |
| sku.name                     | The VM size for each scale set instance                  | Standard_A1                               |
| sku.capacity                 | The number of VM instances to initially create           | 2                                         |
| upgradePolicy.mode           | VM instance upgrade mode when changes occur              | Automatic                                 |
| imageReference               | The platform or custom image to use for the VM instances | Canonical Ubuntu Server 16.04-LTS         |
| osProfile.computerNamePrefix | The name prefix for each VM instance                     | myvmss                                    |
| osProfile.adminUsername      | The username for each VM instance                        | azureuser                                 |
| osProfile.adminPassword      | The password for each VM instance                        | P@ssw0rd!                                 |

To customize a scale set template, you can change the VM size or initial capacity. Another option is to use a different platform or a custom image.

#### Add a sample application

To test your scale set, install a basic web application. When you deploy a scale set, VM extensions can provide post-deployment configuration and automation tasks, such as installing an app. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time. To apply an extension to your scale set, you add the *extensionProfile* section to the preceding resource example. The extension profile typically defines the following properties:

- Extension type
- Extension publisher
- Extension version
- Location of configuration or install scripts
- Commands to execute on the VM instances

The template uses the Custom Script Extension to install [Bottle](https://bottlepy.org/docs/dev/), a Python web framework, and a simple HTTP server.

Two scripts are defined in **fileUris** - *installserver.sh*, and *workserver.py*. These files are downloaded from GitHub, then *commandToExecute* runs `bash installserver.sh` to install and configure the app.

### Deploy the template

You can deploy the template by selecting the following **Deploy to Azure** button. This button opens the Azure portal, loads the complete template, and prompts for a few parameters such as a scale set name, instance count, and admin credentials.

[![Deploy template to Azure](media/virtual-machine-scale-sets-create-template/deploy-button.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-vmss-bottle-autoscale%2Fazuredeploy.json)

You can also deploy a Resource Manager template by using Azure CLI:

```azurecli-interactive
# Create a resource group
az group create --name myResourceGroup --location EastUS

# Deploy template into resource group
az group deployment create \
    --resource-group myResourceGroup \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/azuredeploy.json
```

Answer the prompts to provide a scale set name, instance count, and admin credentials for the VM instances. It takes a few minutes for the scale set and supporting resources to be created.

## Test the deployment

To see your scale set in action, access the sample web application in a web browser. Obtain the public IP address of the load balancer with [az network public-ip list](/cli/azure/network/public-ip) as follows:

```azurecli-interactive
az network public-ip list \
    --resource-group myResourceGroup \
    --query [*].ipAddress -o tsv
```

Enter the public IP address of the load balancer in to a web browser in the format *http:\//publicIpAddress:9000/do_work*. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Default web page in NGINX](media/virtual-machine-scale-sets-create-template/running-python-app.png)

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group, scale set, and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps

In this quickstart, you created a Linux scale set with an Azure template and used the Custom Script Extension to install a basic Python web server on the VM instances. To learn more, continue to the tutorial for how to create and manage Azure virtual machine scale sets.

> [!div class="nextstepaction"]
> [Create and manage Azure virtual machine scale sets](tutorial-create-and-manage-cli.md)
