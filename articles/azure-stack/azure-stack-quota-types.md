---
title: Quota types in Azure Stack | Microsoft Docs
description: Review the different quota types available for services and resources in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/30/2018
ms.author: sethm
ms.reviewer: xiaofmao

---
# Quota types in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

[Quotas](azure-stack-plan-offer-quota-overview.md#plans) define the limits of resources that a user subscription can provision or consume. For example, a quota might allow a user to create up to five VMs. Each resource can have its own types of quotas.

## Compute quota types 
| **Type** | **Default value** | **Description** |
| --- | --- | --- |
| Max number of virtual machines | 20 | The maximum number of virtual machines that a subscription can create in this location. |
| Max number of virtual machine cores | 50 | The maximum number of cores that a subscription can create in this location (for example, an A3 VM has four cores). |
| Max number of availability sets | 10 | The maximum number of availability sets that can be created in this location. |
| Max number of virtual machine scale sets | 20 | The maximum number of virtual machine scale sets that can be created in this location. |

## Storage quota types 
| **Item** | **Default value** | **Description** |
| --- | --- | --- |
| Maximum capacity (GB) |500 |Total storage capacity that can be consumed by a subscription in this location. |
| Total number of storage accounts |20 |The maximum number of storage accounts that a subscription can create in this location. |

> [!NOTE]  
> It can take up to two hours before a storage quota is enforced.


## Network quota types
| **Item** | **Default value** | **Description** |
| --- | --- | --- |
| Max public IPs |50 |The maximum number of public IPs that a subscription can create in this location. |
| Max virtual networks |50 |The maximum number of virtual networks that a subscription can create in this location. |
| Max virtual network gateways |1 |The maximum number of virtual network gateways (VPN Gateways) that a subscription can create in this location. |
| Max network connections |2 |The maximum number of network connections (point-to-point or site-to-site) that a subscription can create across all virtual network gateways in this location. |
| Max load balancers |50 |The maximum number of load balancers that a subscription can create in this location. |
| Max NICs |100 |The maximum number of network interfaces that a subscription can create in this location. |
| Max network security groups |50 |The maximum number of network security groups that a subscription can create in this location. |

## View an existing quota
1. On the default dashboard of the Admin portal, find the **Resource providers** tile.
2. Select the service with the quota that you want to view, like **Compute** or **Storage**.
3. Select **Quotas**, and then select the quota you want to view.


## Edit a quota  
You can choose to edit the original configuration of a quota instead of [using an add-on plan](create-add-on-plan.md). When you edit a quota, the new configuration automatically applies globally to all plans that use that quota and all existing subscriptions that use those plans. The editing of a quota is different than when you use an add-on plan to provide a modified quota, which a user chooses to subscribe to. 

### To edit a quota  
1. On the default dashboard of the Admin portal, find the **Resource providers** tile.
2. Select the service with the quota that you want to modify, like **Compute**, **Network**, or **Storage**.
3. Next, select **Quotas**, and then select the quota you want to change.
4. On the **Set quotas** pane, edit the values, and then select **Save**. 

The new values for the quota apply globally to all plans that use the modified quota and to all existing subscriptions that use those plans. 



## Next steps

- [Learn more about plans, offers, and quotas.](azure-stack-plan-offer-quota-overview.md)
- [Create quotas while creating a plan.](azure-stack-create-plan.md)
