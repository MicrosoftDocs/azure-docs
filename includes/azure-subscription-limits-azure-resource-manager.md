| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| VMs per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per Region |10,000 per Region |
| VM total cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per Region | Contact support |
| VM per series (Dv2, F, etc.) cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20<sup>1</sup> per Region | Contact support |
| [Co-administrators](../articles/billing-add-change-azure-subscription-administrator.md) per subscription |Unlimited |Unlimited |
| [Storage accounts](../articles/storage/storage-create-storage-account.md) per subscription |200 |200<sup>2</sup> |
| [Resource Groups](../articles/azure-resource-manager/resource-group-overview.md) per subscription |800 |800 |
| [Availability Sets](../articles/virtual-machines/windows/manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) per subscription |2000 per Region |2000 per Region |
| Resource Manager API Reads |15000 per hour |15000 per hour |
| Resource Manager API Writes |1200 per hour |1200 per hour |
| Resource Manager API request size |4194304 bytes |4194304 bytes |
| [Cloud services](../articles/cloud-services/cloud-services-choose-me.md) per subscription |Not Applicable<sup>3</sup> |Not Applicable<sup>3</sup> |
| [Affinity groups](../articles/virtual-network/virtual-networks-migrate-to-regional-vnet.md) per subscription |Not Applicable<sup>3</sup> |Not Applicable<sup>3</sup> |

<sup>1</sup>Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go, and series, such as Dv2, F, G, etc.

<sup>2</sup>This includes both Standard and Premium storage accounts. If you require more than 200 storage accounts, make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your business case and may approve up to 250 storage accounts.

<sup>3</sup>These features are no longer required with Azure Resource Groups and the Azure Resource Manager.

> [!NOTE]
> It is important to emphasize that virtual machine cores have a regional total limit as well as a regional per size series (Dv2, F, etc.) limit that are separately enforced.  For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30.  This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combnation of the two not to exceed a total of 30 cores (e.g. 10 A1 VMs and 20 D1 VMs).  
> <!-- -->
> 
> 

