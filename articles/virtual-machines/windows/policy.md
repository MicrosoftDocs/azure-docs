---
title: Enforce security with policies on Windows VMs in Azure | Microsoft Docs
description: How to apply a policy to an Azure Resource Manager Windows Virtual Machine
services: virtual-machines-windows
documentationcenter: ''
author: singhkays
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 0b71ba54-01db-43ad-9bca-8ab358ae141b
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: kasing

---
# Apply security and policies to Windows VMs with Azure Resource Manager
By using policies, an organization can enforce various conventions and rules throughout the enterprise. Enforcement of the desired behavior can help mitigate risk while contributing to the success of the organization. In this article, we describe how you can use Azure Resource Manager policies to define the desired behavior for your organization’s Virtual Machines.

For an introduction to policies, see [Use Policy to manage resources and control access](../../azure-resource-manager/resource-manager-policy.md).

## Define a policy for permitted Virtual Machines
To ensure that virtual machines for your organization are compatible with an application, you can restrict the permitted operating systems. In the following policy example, you allow only Windows Server 2012 R2 Datacenter Virtual Machines to be created:

```json
{
    "if": {
        "allOf": [
            {
                "field": "type",
                "in": [
                    "Microsoft.Compute/disks",
                    "Microsoft.Compute/virtualMachines",
                    "Microsoft.Compute/VirtualMachineScaleSets"
                ]
            },
            {
                "not": {
                    "allOf": [
                        {
                            "field": "Microsoft.Compute/imagePublisher",
                            "in": [
                                "MicrosoftWindowsServer"
                            ]
                        },
                        {
                            "field": "Microsoft.Compute/imageOffer",
                            "in": [
                                "WindowsServer"
                            ]
                        },
                         {
                            "field": "Microsoft.Compute/imageSku",
                            "in": [
                                "2012-Datacenter"
                            ]
                        },
                         {
                            "field": "Microsoft.Compute/imageVersion",
                            "in": [
                                "latest"
                            ]
                        }
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

Use a wild card to modify the preceding policy to allow any Windows Server Datacenter image:

```json
{
  "field": "Microsoft.Compute/imageSku",
  "like": "*Datacenter"
}
```

For information about policy fields, see [Policy aliases](../../azure-resource-manager/resource-manager-policy.md#aliases).

## Use managed disk policy

To require the use of managed disks, use the following policy:

```json
{
    "if": {
        "anyOf": [
            {
                "allOf": [
                    {
                        "field": "type",
                        "equals": "Microsoft.Compute/virtualMachines"
                    },
                    {
                        "field": "Microsoft.Compute/virtualMachines/osDisk.uri",
                        "exists": true
                    }
                ]
            },
            {
                "allOf": [
                    {
                        "field": "type",
                        "equals": "Microsoft.Compute/VirtualMachineScaleSets"
                    },
                    {
                        "anyOf": [
                            {
                                "field": "Microsoft.Compute/VirtualMachineScaleSets/osDisk.vhdContainers",
                                "exists": true
                            },
                            {
                                "field": "Microsoft.Compute/VirtualMachineScaleSets/osdisk.imageUrl",
                                "exists": true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "then": {
        "effect": "deny"
    }
}
```

## Next steps
* After defining a policy rule (as shown in the preceding examples), you need to create the policy definition and assign it to a scope. The scope can be a subscription, resource group, or resource. To assign policies through the portal, see [Use Azure portal to assign and manage resource policies](../../azure-resource-manager/resource-manager-policy-portal.md). To assign policies through REST API, PowerShell or Azure CLI, see [Assign and manage policies through script](../../azure-resource-manager/resource-manager-policy-create-assign.md).
* For an introduction to resource policies, see [Resource policy overview](../../azure-resource-manager/resource-manager-policy.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](../../azure-resource-manager/resource-manager-subscription-governance.md).
