---
title: Tutorial - Install applications in a scale set with Azure templates | Microsoft Docs
description: Learn how to use Azure Resource Manager templates to install applications into virtual machine scale sets with the Custom Script Extension
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---
# Tutorial: Install applications in virtual machine scale sets with an Azure template
To run applications on virtual machine (VM) instances in a scale set, you first need to install the application components and required files. In a previous tutorial, you learned how to create and use a custom VM image to deploy your VM instances. This custom image included manual application installs and configurations. You can also automate the install of applications to a scale set after each VM instance is deployed, or update an application that already runs on a scale set. In this tutorial you learn how to:

> [!div class="checklist"]
> * Automatically install applications to your scale set
> * Use the Azure Custom Script Extension
> * Update a running application on a scale set

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.29 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## What is the Azure Custom Script Extension?
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time.

The Custom Script extension integrates with Azure Resource Manager templates, and can also be used with the Azure CLI, Azure PowerShell, Azure portal, or the REST API. For more information, see the [Custom Script Extension overview](../virtual-machines/linux/extensions-customscript.md).

To see the Custom Script Extension in action, create a scale set that installs the NGINX web server and outputs the hostname of the scale set VM instance. The following Custom Script Extension definition downloads a sample script from GitHub, installs the required packages, then writes the VM instance hostname to a basic HTML page.


## Create Custom Script Extension definition
When you define a virtual machine scale set with an Azure template, the *Microsoft.Compute/virtualMachineScaleSets* resource provider can include a section on extensions. The *extensionsProfile* details what is applied to the VM instances in a scale set. To use the Custom Script Extension, you specify a publisher of *Microsoft.Azure.Extensions* and a type of *CustomScript*.

The *fileUris* property is used to define the source install scripts or packages. To start the install process, the required scripts are defined in *commandToExecute*. The following example defines a sample script from GitHub that installs and configures the NGINX web server:

```json
"extensionProfile": {
  "extensions": [
    {
      "name": "AppInstall",
      "properties": {
        "publisher": "Microsoft.Azure.Extensions",
        "type": "CustomScript",
        "typeHandlerVersion": "2.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "fileUris": [
            "https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/automate_nginx.sh"
          ],
          "commandToExecute": "bash automate_nginx.sh"
        }
      }
    }
  ]
}
```

For a complete example of an Azure template that deploys a scale set and the Custom Script Extension, see [https://github.com/Azure-Samples/compute-automation-configurations/blob/master/scale_sets/azuredeploy.json](https://github.com/Azure-Samples/compute-automation-configurations/blob/master/scale_sets/azuredeploy.json). This sample template is used in the next section.


## Create a scale set
Let's use the sample template to create a scale set and apply the Custom Script Extension. First, create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now create a virtual machine scale set with [az group deployment create](/cli/azure/group/deployment). When prompted, provide your own username and password that is used as the credentials for each VM instance:

```azurecli-interactive
az group deployment create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/scale_sets/azuredeploy.json
```

It takes a few minutes to create and configure all the scale set resources and VMs.

Each VM instance in the scale set downloads and runs the script from GitHub. In a more complex example, multiple application components and files could be installed. If the scale set is scaled up, the new VM instances automatically apply the same Custom Script Extension definition and install the required application.


## Test your scale set
To see your web server in action, obtain the public IP address of your load balancer with [az network public-ip show](/cli/azure/network/public-ip). The following example obtains the IP address for *myScaleSetPublicIP* created as part of the scale set:

```azurecli-interactive
az network public-ip show \
  --resource-group myResourceGroup \
  --name myScaleSetPublicIP \
  --query [ipAddress] \
  --output tsv
```

Enter the public IP address of the load balancer in to a web browser. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Basic web page in Nginx](media/tutorial-install-apps-template/running-nginx.png)

Leave the web browser open so that you can see an updated version in the next step.


## Update app deployment
Throughout the lifecycle of a scale set, you may need to deploy an updated version of your application. With the Custom Script Extension, you can reference an updated deploy script and then reapply the extension to your scale set. When the scale set was created in a previous step, the *upgradePolicy* was set to *Automatic*. This setting allows the VM instances in the scale set to automatically update and apply the latest version of your application.

To update the Custom Script Extension definition, edit your template to reference a new install script. A new filename must be used for the Custom Script Extension to recognize the change. The Custom Script Extension does not examine the contents of the script to determine any changes. This following definition uses an updated install script with *_v2* appended to its name:

```json
"extensionProfile": {
  "extensions": [
    {
      "name": "AppInstall",
      "properties": {
        "publisher": "Microsoft.Azure.Extensions",
        "type": "CustomScript",
        "typeHandlerVersion": "2.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "fileUris": [
            "https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/automate_nginx_v2.sh"
          ],
          "commandToExecute": "bash automate_nginx_v2.sh"
        }
      }
    }
  ]
}
```

Apply the Custom Script Extension configuration to the VM instances in your scale set again with [az group deployment create](/cli/azure/group/deployment). This *azuredeployv2.json* template is used to apply the updated version of the application. In practice, you edit the existing *azuredeploy.json* template to reference the updated install script, as shown in the previous section. When prompted, enter the same username and password credentials as used when you first created the scale set:

```azurecli-interactive
az group deployment create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/scale_sets/azuredeploy_v2.json
```

All VM instances in the scale set are automatically updated with the latest version of the sample web page. To see the updated version, refresh the web site in your browser:

![Updated web page in Nginx](media/tutorial-install-apps-template/running-nginx-updated.png)


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```


## Next steps
In this tutorial, you learned how to automatically install and update applications on your scale set with Azure templates:

> [!div class="checklist"]
> * Automatically install applications to your scale set
> * Use the Azure Custom Script Extension
> * Update a running application on a scale set

Advance to the next tutorial to learn how to automatically scale your scale set.

> [!div class="nextstepaction"]
> [Automatically scale your scale sets](tutorial-autoscale-template.md)
