---
title: Chef extension for Azure VMs  | Microsoft Docs
description: Deploy the Chef Client to a virtual machine using the Chef VM Extension.
services: virtual-machines-linux
documentationcenter: ''

author: roiyz-msft
manager: jeconnoc
editor: ''
tags: azure-resource-manager
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/21/2018
ms.author: roiyz
---

# Chef VM Extension for Linux and Windows

Chef Software provides a DevOps automation platform for Linux and Windows that enables the management of both physical and virtual server configurations. The Chef VM Extension is an extension that enables Chef on virtual machines.

## Prerequisites

### Operating system

The Chef VM Extension is supported on all the [Extension Supported OS's](https://support.microsoft.com/help/4078134/azure-extension-supported-operating-systems) in Azure.

### Internet connectivity

The Chef VM Extension requires that the target virtual machine is connected to the internet in order to retrieve the Chef Client payload from the content delivery network (CDN).  

## Extension schema

The following JSON shows the schema for the Chef VM Extension. The extension requires at a minimum the Chef Server URL, the Validation Client Name and the Validation Key for the Chef Server; these values can be found in the `knife.rb` file in the starter-kit.zip that is downloaded when you install [Chef Automate](https://azuremarketplace.microsoft.com/marketplace/apps/chef-software.chef-automate) or a standalone [Chef Server](https://downloads.chef.io/chef-server). Because the validation key should be treated as sensitive data, it should be configured under the **protectedSettings** element, meaning that it will only be decrypted on the target virtual machine.

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(variables('vmName'),'/', parameters('chef_vm_extension_type'))]",
  "apiVersion": "2017-12-01",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
  ],
  "properties": {
    "publisher": "Chef.Bootstrap.WindowsAzure",
    "type": "[parameters('chef_vm_extension_type')]",
    "typeHandlerVersion": "1210.12",
    "settings": {
      "bootstrap_options": {
        "chef_server_url": "[parameters('chef_server_url')]",
        "validation_client_name": "[parameters('chef_validation_client_name')]"
      },
      "runlist": "[parameters('chef_runlist')]"
    },
    "protectedSettings": {
      "validation_key": "[parameters('chef_validation_key')]"
    }
  }
}  
```

### Core property values

| Name | Value / Example | Data Type
| ---- | ---- | ---- | ----
| apiVersion | `2017-12-01` | string (date) |
| publisher | `Chef.Bootstrap.WindowsAzure` | string |
| type | `LinuxChefClient` (Linux), `ChefClient` (Windows) | string |
| typeHandlerVersion | `1210.12` | string (double) |

### Settings

| Name | Value / Example | Data Type | Required?
| ---- | ---- | ---- | ----
| settings/bootstrap_options/chef_server_url | `https://api.chef.io/organizations/myorg` | string (url) | Y |
| settings/bootstrap_options/validation_client_name | `myorg-validator` | string | Y |
| settings/runlist | `recipe[mycookbook::default]` | string | Y |

### Protected settings

| Name | Example | Data Type | Required?
| ---- | ---- | ---- | ---- |
| protectedSettings/validation_key | `-----BEGIN RSA PRIVATE KEY-----\nKEYDATA\n-----END RSA PRIVATE KEY-----` | string | Y |

<!--
### Linux-specific settings

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |

### Windows-specific settings

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
-->

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates can be used to deploy one or more virtual machines, install the Chef Client, connect to the Chef Server and the perform the initial configuration on the server as defined by the [Run-list](https://docs.chef.io/run_lists.html)

A sample Resource Manager template that includes the Chef VM Extension can be found on the [Azure Quick Start Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/chef-json-parameters-linux-vm).

The JSON configuration for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON configuration affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/resource-manager-template-child-resource.md).

## Azure CLI deployment

The Azure CLI can be used to deploy the Chef VM Extension to an existing VM. Replace the **validation_key** with the contents of your validation key (this file as a `.pem` extension).  Replace **validation_client_name**, **chef_server_url** and **run_list** with those values from the `knife.rb` file in your Starter Kit.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myExistingVM \
  --name LinuxChefClient \
  --publisher Chef.Bootstrap.WindowsAzure \
  --version 1210.12 --protected-settings '{"validation_key": "<validation_key>"}' \
  --settings '{ "bootstrap_options": { "chef_server_url": "<chef_server_url>", "validation_client_name": "<validation_client_name>" }, "runlist": "<run_list>" }'
```

## Troubleshooting and support

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myExistingVM -o table
```

Extension execution output is logged to the following file:

### Linux

```bash
/var/lib/waagent/Chef.Bootstrap.WindowsAzure.LinuxChefClient
```

### Windows

```powershell
C:\Packages\Plugins\Chef.Bootstrap.WindowsAzure.ChefClient\
```

### Error codes and their meanings

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 51 | This extension is not supported on the VM's operating system | |

Additional troubleshooting information can be found in the [Chef VM Extension readme](https://github.com/chef-partners/azure-chef-extension).

## Next steps

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
