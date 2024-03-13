---
title: Upgrade the configuration of an Azure Service Fabric cluster 
description: Learn how to upgrade the configuration that runs a Service Fabric cluster in Azure using a Resource Manager template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Upgrade the configuration of a cluster in Azure 

This article describes how to customize the various fabric settings for your Service Fabric cluster. For clusters hosted in Azure, you can customize settings through the [Azure portal](https://portal.azure.com) or by using an Azure Resource Manager template.

> [!NOTE]
> Not all settings are available in the portal, and it is a [best practice to customize it using an Azure Resource Manager template](./service-fabric-best-practices-infrastructure-as-code.md); Portal is for Service Fabric Dev\Test scenario's only.
> 


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Customize cluster settings using Resource Manager templates
Azure clusters can be configured through the JSON Resource Manager template. To learn more about the different settings, see [Configuration settings for clusters](service-fabric-cluster-fabric-settings.md). As an example, the steps below show how to add a new setting *MaxDiskQuotaInMB* to the *Diagnostics* section using Azure Resource Explorer.

1. Go to https://resources.azure.com
2. Navigate to your subscription by expanding **subscriptions** -> **\<Your Subscription>** -> **resourceGroups** -> **\<Your Resource Group>** -> **providers** -> **Microsoft.ServiceFabric** -> **clusters** -> **\<Your Cluster Name>**
3. In the top right corner, select **Read/Write.**
4. Select **Edit** and update the `fabricSettings` JSON element and add a new element:

```json
{
  "name": "Diagnostics",
  "parameters": [
    {
      "name": "MaxDiskQuotaInMB",
      "value": "65536"
    }
  ]
}
```

You can also customize cluster settings in one of the following ways with Azure Resource Manager:

- Use the [Azure portal](../azure-resource-manager/templates/export-template-portal.md) to export and update the Resource Manager template.
- Use [PowerShell](../azure-resource-manager/management/manage-resources-powershell.md) to export and update the Resource Manager template.
- Use the [Azure CLI](../azure-resource-manager/management/manage-resources-cli.md) to export and update the Resource Manager template.
- Use the Azure PowerShell [Set-AzServiceFabricSetting](/powershell/module/az.servicefabric/set-azservicefabricsetting) and [Remove-AzServiceFabricSetting](/powershell/module/az.servicefabric/remove-azservicefabricsetting) commands to modify the setting directly.
- Use the Azure CLI [az sf cluster setting](/cli/azure/sf/cluster/setting) commands to modify the setting directly.

## Next steps
* Learn about the [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md).
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-in-out.md).
