---
title: Enforce security with policies on Linux VMs in Azure | Microsoft Docs
description: How to apply a policy to an Azure Resource Manager Linux Virtual Machine
services: virtual-machines-linux
documentationcenter: ''
author: singhkays
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 06778ab4-f8ff-4eed-ae10-26a276fc3faa
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: singhkay

---
# Apply security and policies to Linux VMs with Azure Resource Manager
By using policies, an organization can enforce various conventions and rules throughout the enterprise. Enforcement of the desired behavior can help mitigate risk while contributing to the success of the organization. In this article, we describe how you can use Azure Resource Manager policies to define the desired behavior for your organization's Virtual Machines.

For an introduction to policies, see [Use Policy to manage resources and control access](../../azure-resource-manager/resource-manager-policy.md).

## Define a policy for permitted Virtual Machines
To ensure that virtual machines for your organization are compatible with an application, you can restrict the permitted operating systems. In the following policy example, you allow only Ubuntu 14.04.2-LTS Virtual Machines to be created.

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
                                "Canonical"
                            ]
                        },
                        {
                            "field": "Microsoft.Compute/imageOffer",
                            "in": [
                                "UbuntuServer"
                            ]
                        },
                        {
                            "field": "Microsoft.Compute/imageSku",
                            "in": [
                                "14.04.2-LTS"
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

Use a wild card to modify the preceding policy to allow any Ubuntu LTS image: 

```json
{
  "field": "Microsoft.Compute/virtualMachines/imageSku",
  "like": "*LTS"
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
