---
title: Azure resource policies for network resources | Microsoft Docs
description: Describes Azure Resource Manager policies for managing the deployment of network resources.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/05/2017
ms.author: tomfitz

---
# Apply resource policies to network resources
This article shows an example [resource policy](resource-manager-policy.md) you can apply to Azure virtual network gateways. This policy ensures consistency for gateways deployed in your organization. 

## Define permitted virtual network gateway SKU

The following policy restricts which SKUs can be deployed for virtual network gateways:

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Network/virtualNetworkGateways"
      },
      {
        "not": {
          "field": "Microsoft.Network/virtualNetworkGateways/sku.name",
          "in": [
            "Basic",
            "VpnGw1"
          ]
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

## Next steps
* After defining a policy rule (as shown in the preceding examples), you need to create the policy definition and assign it to a scope. The scope can be a subscription, resource group, or resource. To assign policies through the portal, see [Use Azure portal to assign and manage resource policies](resource-manager-policy-portal.md). To assign policies through REST API, PowerShell or Azure CLI, see [Assign and manage policies through script](resource-manager-policy-create-assign.md). 
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

