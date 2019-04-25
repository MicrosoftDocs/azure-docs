---
author: yashesvi
ms.author: banders
ms.service: virtual-machines-windows
ms.topic: include
ms.date: 04/13/2019
---

# Prepay for Virtual Machines with Azure Reserved VM Instances

Prepay for virtual machines and save money with Azure Reserved Virtual Machine (VM) Instances. For more information, see [Azure Reserved VM Instances offering](https://azure.microsoft.com/pricing/reserved-vm-instances/).

You can buy a Reserved VM Instance in the [Azure portal](https://portal.azure.com). To buy an instance:

- You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can buy reservations.

The reservation discount is applied automatically to the number of running virtual machines that match the reservation scope and attributes. You can update the scope of the reservation through [Azure portal](https://portal.azure.com), PowerShell, CLI, or through the API.

## Determine the right VM size before you buy

Before you buy a reservation, you should determine the size of the VM that you need. The following sections will help you determine the right VM size.

### Use reservation recommendations

You can use reservation recommendations to help determine the reservations you should purchase.

- Purchase recommendations and recommended quantity are show when you purchase a VM reserved instance in the Azure portal.
- Azure Advisor provides purchase recommendations for individual subscriptions.  
- You can use the APIs to get purchase recommendations for both shared scope and single subscription scope. For more information, see [Reserved instance purchase recommendation APIs for enterprise customers](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation).
- For EA customers, purchase recommendations for shared and single subscription scopes are available with the [Azure Consumption Insights Power BI content pack](/power-bi/service-connect-to-azure-consumption-insights).

### Classic VMs and cloud services

Virtual machine reserved instances automatically apply to both classic VMs and cloud services when instance size flexibility is enabled. There aren't any special SKUs for classic VMs or cloud services. The same VM SKUs apply to them.

For example, you might convert your classic VMs or cloud services to Azure Resource Manager-based VMs. In this example, the reservation discount automatically applies to  matching VMs. There's no need to *exchange* an existing reserved instance - it automatically applies.

### Analyze your usage information
You should analyze your usage information to help determine which reservations you should purchase.

Usage data is available in the usage file and APIs. Use them together to determine which reservation to purchase. You should check for VM instances that have high usage on daily basis to determine the quantity of reservations to purchase.

Avoid the `Meter` subcategory and `Product` fields in usage data. They don't distinguish between VM sizes that use premium storage. If you use these fields to determine the VM size for reservation purchase, you may buy the wrong size. Then you won't get the reservation discount you expect. Instead, refer to the `AdditionalInfo` field in your usage file or usage API to determine the correct VM size.

### Purchase restriction considerations

Reserved VM Instances are available for most VM sizes with some exceptions. Reservation discounts don't apply for the following VMs:

- **VM series** - A-series, Av2-series, or G-series.

- **VMs in preview** - Any VM-series or size that is in preview.

- **Clouds** - Reservations aren't available for purchase in Germany or China regions.

- **Insufficient quota** - A reservation that is scoped to a single subscription must have vCPU quota available in the subscription for the new RI. For example, if the target subscription has a quota limit of 10 vCPUs for D-Series, then you can't buy a reservation for 11 Standard_D1 instances. The quota check for reservations includes the VMs already deployed in the subscription. For example, if the subscription has a quota of 10 vCPUs for D-Series and has two standard_D1 instances deployed, then you can buy a reservation for 10 standard_D1 instances in this subscription. You can [create quote increase request](../articles/azure-supportability/resource-manager-core-quotas-request.md) to resolve this issue.

- **Capacity restrictions** - In rare circumstances, Azure limits the purchase of new reservations for subset of VM sizes, due to low capacity in a region.

## Buy a Reserved VM Instance

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** to purchase a new reservation.
4. Fill in the required fields. Running VM instances that match the attributes you select qualify to get the reservation discount. The actual number of your VM instances that get the discount depend on the scope and quantity selected.

    | Field      | Description|
    |------------|--------------|
    |Name        |The name of this reservation.|
    |Subscription|The subscription used to pay for the reservation. The payment method on the subscription is charged the upfront costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.|    
    |Scope       |The reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>Single subscription - The reservation discount is applied to VMs in this subscription. </li><li>Shared - The reservation discount is applied to VMs running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</li></ul>|
    |Region    |The Azure region that’s covered by the reservation.|    
    |VM Size     |The size of the VM instances.|
    |Optimize for     |VM instance size flexibility applies the reservation discount to other VMs in the same [VM size group](https://aka.ms/RIVMGroups). Capacity priority prioritizes data center capacity for your deployments. This offers additional confidence in your ability to launch the VM instances when you need them. Capacity priority is only available when the reservation scope is single subscription. |
    |Term        |One year or three years.|
    |Quantity    |The number of instances being purchased within the reservation. The quantity is the number of running VM instances that can get the billing discount. For example, if you are running 10 Standard_D2 VMs in the East US, then you would specify quantity as 10 to maximize the benefit for all running machines. |

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2PjmT]

## Change a reservation after purchase

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Instance size flexibility (if applicable)
- Ownership

You can also split a reservation into smaller chunks and merge already split reservations. None of the changes cause a new commercial transaction or change the end date of the reservation.

You cannot make the following types of changes after purchase, directly:

- An existing reservation’s region
- SKU
- Quantity
- Duration

However, you can *exchange* a reservation if you want to make changes.

## Cancellations and exchanges

If you need to cancel your reservation, there may be a 12% early termination fee. Refunds are based on the lowest price of either your purchase price or the current price of the reservation. Refunds are limited to $50,000 per year. The refund you receive is the remaining pro-rated balance minus the 12% early termination fee. To request a cancellation, go to the reservation in the Azure portal and select **Refund** to create a support request.

If you need to change your Reserved VM Instances reservation to another region, VM size group, or term, you can exchange it for another reservation that's of equal or greater value. The term start date for the new reservation doesn't carry over from the exchanged reservation. The 1 or 3-year term starts from when you create the new reservation. To request an exchange, go to the reservation in the Azure portal, and select **Exchange** to create a support request.

For more information about how to exchange or refund reservations, see [Reservation exchanges and refunds](../articles/billing/billing-azure-reservations-self-service-exchange-and-refund.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](../articles/billing/billing-manage-reserved-vm-instance.md).
- To learn more about Azure Reservations, see the following articles:
    - [What are Azure Reservations?](../articles/billing/billing-save-compute-costs-reservations.md)
    - [Manage Reservations in Azure](../articles/billing/billing-manage-reserved-vm-instance.md)
    - [Understand how the reservation discount is applied](../articles/billing/billing-understand-vm-reservation-charges.md)
    - [Understand reservation usage for your Pay-As-You-Go subscription](../articles/billing/billing-understand-reserved-instance-usage.md)
    - [Understand reservation usage for your Enterprise enrollment](../articles/billing/billing-understand-reserved-instance-usage-ea.md)
    - [Windows software costs not included with reservations](../articles/billing/billing-reserved-instance-windows-software-costs.md)
    - [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)
