---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 02/10/2020    
ms.author: cynthn
---
| Resource | Limit |
| --- | --- |
| VMs per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |25,000<sup>1</sup> per region. |
| VM total cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per region. Contact support to increase limit. |
| Azure Spot VM total cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per region. Contact support to increase limit. |
| VM per series, such as Dv2 and F, cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per region. Contact support to increase limit. |
| [Availability sets](../articles/virtual-machines/windows/manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) per subscription |2,500 per region. |
| Virtual machines per availability set | 200 |
| Certificates per subscription |Unlimited<sup>2</sup> |

<sup>1</sup>Default limits vary by offer category type, such as Free Trial and Pay-As-You-Go, and by series, such as Dv2, F, and G. For example, the default for Enterprise Agreement subscriptions is 350.

<sup>2</sup>With Azure Resource Manager, certificates are stored in the Azure Key Vault. The number of certificates is unlimited for a subscription. There's a 1-MB limit of certificates per deployment, which consists of either a single VM or an availability set.

> [!NOTE]
> Virtual machine cores have a regional total limit. They also have a limit for regional per-size series, such as Dv2 and F. These limits are separately enforced. For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription can deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two not to exceed a total of 30 cores. An example of a combination is 10 A1 VMs and 20 D1 VMs.  
> <!-- -->
> 
