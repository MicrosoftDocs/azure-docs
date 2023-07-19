---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 12/03/2021
ms.author: larryfr
---

Azure allows you to place _locks_ on resources, so that they cannot be deleted or are read only. __Locking a resource can lead to unexpected results.__ Some operations that don't seem to modify the resource actually require actions that are blocked by the lock. 

With Azure Machine Learning, applying a delete lock to the resource group for your workspace will prevent scaling operations for Azure ML compute clusters. To work around this problem we recommend __removing__ the lock from resource group and instead applying it to individual items in the group.

> [!IMPORTANT]
> __Do not__ apply the lock to the following resources:
>
> | Resource name | Resource type |
> | ----- | ----- |
> | `<GUID>-azurebatch-cloudservicenetworksecurityggroup` | Network security group |
> | `<GUID>-azurebatch-cloudservicepublicip` | Public IP address |
> | `<GUID>-azurebatch-cloudserviceloadbalancer` | Load balancer |

These resources are used to communicate with, and perform operations such as scaling on, the compute cluster. Removing the resource lock from these resources should allow autoscaling for your compute clusters.

For more information on resource locking, see [Lock resources to prevent unexpected changes](/azure/azure-resource-manager/management/lock-resources).