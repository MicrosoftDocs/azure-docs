---
title: Add a virtual machine scale set extension to a Service Fabric managed cluster node type
description: Here's how to add a virtual machine scale set extension a Service Fabric managed cluster node type
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Virtual machine scale set extension support on Service Fabric managed cluster node type(s)

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. This enables you to add [virtual machine scale set extensions](../virtual-machines/extensions/overview.md) to your Service Fabric managed cluster node types. Extensions are small applications that provide post-deployment configuration and automation on Azure VMs. The Azure platform hosts many extensions covering VM configuration, monitoring, security, and utility applications. Publishers take an application, wrap it into an extension, and simplify the installation. All you need to do is provide mandatory parameters. 

## Add a virtual machine scale set extension
You can add a virtual machine scale set extension to a Service Fabric managed cluster node type using the [Add-AzServiceFabricManagedNodeTypeVMExtension](/powershell/module/az.servicefabric/add-azservicefabricmanagednodetypevmextension) PowerShell command.

Alternately, you can add a virtual machine scale set extension on a Service Fabric managed cluster node type in your Azure Resource Manager template, for example:

```json
{
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "apiVersion": "[variables('sfApiVersion')]",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
  ],
  "location": "[resourceGroup().location]",
  "properties": {
    "isPrimary": true,
    "vmInstanceCount": 3,
    "dataDiskSizeGB": 100,
    "vmSize": "Standard_D2",
    "vmImagePublisher": "MicrosoftWindowsServer",
    "vmImageOffer": "WindowsServer",
    "vmImageSku": "2019-Datacenter",
    "vmImageVersion": "latest",
    "vmExtensions": [
      {
        "name": "ExtensionA",
        "properties": {
          "publisher": "ExtensionA.Publisher",
          "type": "KeyVaultForWindows",
          "typeHandlerVersion": "1.0",
          "autoUpgradeMinorVersion": true,
          "settings": {
          }
        }
      }
    ]
  }
}
```

For more information on configuring Service Fabric managed cluster node types, see [managed cluster node type](/azure/templates/microsoft.servicefabric/2022-01-01/managedclusters/nodetypes).

## Next steps

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.yml)
