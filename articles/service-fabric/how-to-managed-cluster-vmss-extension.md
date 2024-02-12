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
    ...
    "vmExtensions": [
      {
        "name": "KvExtension",
        "properties": {
          "publisher": "Microsoft.Azure.KeyVault",
          "type": "KeyVaultForWindows",
          "typeHandlerVersion": "3.0",
          "autoUpgradeMinorVersion": true,
          "settings": {
            "secretsManagementSettings": {
              "observedCertificates": [
                ...
              ]
            }
          }
        }
      }
    ]
  }
}
```

For more information on configuring Service Fabric managed cluster node types, see [managed cluster node type](/azure/templates/microsoft.servicefabric/2022-01-01/managedclusters/nodetypes).

## How to provision before Service Fabric runtime
To provision extensions before the Service Fabric runtime starts, you can use the `setupOrder` parameter with the value `BeforeSFRuntime` in the extension properties for each extension as needed. This allows you to set up the environment and dependencies before the runtime and applications begin running on the node. See the example below for clarification:

>[!NOTE]
> It's essential to note that if an extension marked with `BeforeSFRuntime` fails, it will prevent the Service Fabric runtime from starting. Consequently, the node will be down from the Service Fabric perspective. Therefore, it is crucial to maintain these extensions with correct configurations and promptly address any issues that may arise to ensure the health of nodes within the cluster.

### Requirements
Use Service Fabric API version `2023-09-01-preview` or later.

### ARM Template example:
```json
{
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "apiVersion": "2023-09-01-preview",
  "name": "[concat(parameters('clusterName'), '/', parameters('nodeTypeName'))]",
  "properties": {
    "isPrimary": true,
    ...
    "vmExtensions": [
        {
            "name": "KvExtension",
            "properties": {
                "setupOrder": [
                    "BeforeSFRuntime"
                ],
                "provisionAfterExtensions" [ "GenevaMonitoringExtension" ],
                "publisher": "Microsoft.Azure.KeyVault",
                "type": "KeyVaultForWindows",
                "typeHandlerVersion": "3.0",
                "autoUpgradeMinorVersion": true,
                "settings": {
                "secretsManagementSettings": {
                  "observedCertificates": [
                    ...
                  ]
                }
              }
            }
        },
        {
          "name": "GenevaMonitoringExtension",
          "properties": {
              "setupOrder": [
                    "BeforeSFRuntime"
                ],
              "autoUpgradeMinorVersion": true,
              "enableAutomaticUpgrade": true,
              "publisher": "Microsoft.Azure.Geneva",
              "type": "GenevaMonitoring",
              "typeHandlerVersion": "2.40",
              "settings": {
                "configurations": [
                  {
                    "ServiceArguments": {
                      ...
                    },
                    "UserArguments": {
                      ...
                    }
                  }
                ]
              }
          }
      }
    ]
  }
}
```

>[!NOTE]
> Special handling for AzureDiskEncryption (ADE) extension: ADE needs to run before the Service Fabric runtime to ensures that the disk is decrypted after a reimage operations, allowing the Service Fabric runtime to start using it. Even if the extension is not explicitly marked with `BeforeSFRuntime`, it will run before the runtime. But note that enabling encryption at host is recommended over using ADE extension. For detailed instructions, refer to [Enable encryption at host](how-to-managed-cluster-enable-disk-encryption.md#enable-encryption-at-host).

## Next steps

To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters frequently asked questions](./faq-managed-cluster.yml)
