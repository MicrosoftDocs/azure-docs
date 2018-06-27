---
ms.topic: include
---
# Prepay for Virtual Machines with Azure Reserved VM Instances

Prepay for virtual machines and save money with Azure Reserved Virtual Machine (VM) Instances. For more information, see [Azure Reserved Instances offering](https://azure.microsoft.com/pricing/reserved-vm-instances/).

You can buy Azure Reserved Instances in the [Azure portal](https://portal.azure.com). To buy a Reserved Instance:
-	You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
-	For Enterprise subscriptions, Reserved Instance purchases must be enabled in the [EA portal](https://ea.azure.com).
-   For Cloud Solution Provider (CSP) program only the admin agents or sales agents can purchase the Reserved Instances.

[!IMPORTANT]
You must use one of the methods described below to identify the correctly VM size for a reservation purchase.

## Determine the right VM size before purchase
1. Refer to the AdditionalInfo field in your usage file or usage API to determine the correct VM size for a reservation purchase. Do not use the values from Meter Sub-category or Product fields since these fields do not differentiate between S and Non-S versions of a VM.
2. You can also get accurate VM size information using Powershell, Azure Resource Manager or from VM details in the Azure portal.

## Buy a Reserved Virtual Machine Instance
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** to purchase a new Reserved Instance.
4. Fill in the required fields. Running VM instances that match the attributes you select qualify to get the Reserved Instance discount. The actual number of your VM instances that get the discount depend on the scope and quantity selected.

    | Field      | Description|
    |:------------|:--------------|
    |Name        |The name of this Reserved Instance.| 
    |Subscription|The subscription used to pay for the Reserved Instance. The payment method on the subscription is charged the upfront costs for the Reserved Instance. The subscription type must be an enterprise agreement (offer number: MS-AZR-0017P) or Pay-As-You-Go (offer number: MS-AZR-0003P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.|    
    |Scope       |The Reserved Instance’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>Single subscription - The Reserved Instance discount is applied to VMs in this subscription. </li><li>Shared - The Reserved Instance discount is applied to VMs running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions (except dev/test subscriptions) within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</li></ul>|
    |Location    |The Azure region that’s covered by the Reserved Instance.|    
    |VM Size     |The size of the VM instances.|
    |Term        |One year or three years.|
    |Quantity    |The number of instances being purchased within the Reserved Instance. The quantity is the number of running VM instances that can get the billing discount. For example, if you are running 10 Standard_D2 VMs in the East US, then you would specify quantity as 10 to maximize the benefit for all running machines. |
5. You can view the cost of the Reserved Instance when you select **Calculate cost**.

    ![Screenshot before submitting the Reserved Instance purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvminstance-purchase.png)

6. Select **Purchase**.
7. Select **View this Reservation** to see the status of your purchase.

    ![Screenshot after submitting the Reserved Instance purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvmInstance-submit.png)

## Next steps 
The Reserved Instance discount is applied automatically to the number of running virtual machines that match the Reserved Instance scope and attributes. You can update the scope of the Reserved Instance through [Azure portal](https://portal.azure.com), PowerShell, CLI or through the API. 

To learn how to manage a Reserved Instance, see [Manage Azure Reserved Instances](../articles/billing/billing-manage-reserved-vm-instance.md).

To learn more about Azure Reserved Instances, see the following articles:

- [Save money on virtual machines with Reserved Instances](../articles/billing/billing-save-compute-costs-reservations.md)
- [Manage Azure Reserved Instances](../articles/billing/billing-manage-reserved-vm-instance.md)
- [Understand how the Reserved Instance discount is applied](../articles/billing/billing-understand-vm-reservation-charges.md)
- [Understand Reserved Instance usage for your Pay-As-You-Go subscription](../articles/billing/billing-understand-reserved-instance-usage.md)
- [Understand Reserved Instance usage for your Enterprise enrollment](../articles/billing/billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with Reserved Instances](../articles/billing/billing-reserved-instance-windows-software-costs.md)
- [Reserved Instances in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.