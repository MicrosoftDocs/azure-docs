---
title: Add a virtual machine scale set extension to a Service Fabric managed cluster node type (preview)
description: Here's how to add a virtual machine scale set extension a Service Fabric managed cluster node type
ms.topic: article
ms.date: 09/28/2020
---

# Add a virtual machine scale set extension to a Service Fabric managed cluster node type (preview)

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. This enables you to add [virtual machine scale set extensions](../virtual-machines/extensions/overview.md) to your Service Fabric managed cluster node types.

You can add a virtual machine scale set extension to a node type using the [Add-AzServiceFabricManagedNodeTypeVMExtension](/powershell/module/az.servicefabric/add-azservicefabricmanagednodetypevmextension) PowerShell command.

Alternately, you can  a virtual machine scale set extension on a Service Fabric managed cluster node type in your Azure Resource Manager template, for example:

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
        "vmExtensions": [{
            "name": "ExtensionA",
            "properties": {
                "publisher": "ExtensionA.Publisher",
                "type": "KeyVaultForWindows",
                "typeHandlerVersion": "1.0",
                "autoUpgradeMinorVersion": true,
                "settings": {
                }
            }
        }]
    }
}
```

For more information on configuring Service Fabric managed cluster node types, see [managed cluster node type](/azure/templates/microsoft.servicefabric/2020-01-01-preview/managedclusters/nodetypes).

## Next steps

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.md)
