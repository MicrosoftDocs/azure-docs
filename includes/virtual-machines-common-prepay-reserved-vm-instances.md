---
ms.topic: include
---
# Prepay for Virtual Machines with Azure Reserved VM Instances

Prepay for virtual machines and save money with Azure Reserved Virtual Machine (VM) Instances. For more information, see [Azure Reserved VM Instances offering](https://azure.microsoft.com/pricing/reserved-vm-instances/).

You can buy Azure reserved instances in the [Azure portal](https://portal.azure.com). To buy a Reserved Instance:
-	You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
-	For Enterprise subscriptions, Reserved Instance purchases must be enabled in the [EA portal](https://ea.azure.com).
-   For Cloud Solution Provider (CSP) program only the admin agents or sales agents can purchase the reserved instances.

## Determine the right VM size before purchase
The Meter Sub-category and Product fields in the usage data doesn't distinguish between VM sizes that use premium storage from VM sizes that don't use premium storage, using these field to determine the VM size for reservation purchase can lead to incorrect reservation purchase and not provide you reservation discounts. Use one of the methods below to determine the right VM size for reservation purchase.
- Refer to the AdditionalInfo > ServiceType field in your usage file or usage API data. This field will provide the correct VM size when deploying VMs that can use premium storage.
- You can also get accurate VM size information using Powershell, Azure Resource Manager or from VM details in the Azure portal.

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
    |Optimize for     |VM instance size flexibility applies the reservation discount to other VMs in the same [VM size group](https://aka.ms/RIVMGroups). Capacity priority reserves datacenter capacity for your deployments. This offers additional confidence in your ability to launch the VM instances when you need them. Capacity priority is only available when the reservation scope is single subscription. |
    |Term        |One year or three years.|
    |Quantity    |The number of instances being purchased within the Reserved Instance. The quantity is the number of running VM instances that can get the billing discount. For example, if you are running 10 Standard_D2 VMs in the East US, then you would specify quantity as 10 to maximize the benefit for all running machines. |
5. You can view the cost of the Reserved Instance when you select **Calculate cost**.

    ![Screenshot before submitting the Reserved Instance purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvminstance-purchase.png)

6. Select **Purchase**.
7. Select **View this Reservation** to see the status of your purchase.

    ![Screenshot after submitting the Reserved Instance purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvmInstance-submit.png)

## Next steps 
The Reserved Instance discount is applied automatically to the number of running virtual machines that match the Reserved Instance scope and attributes. You can update the scope of the Reserved Instance through [Azure portal](https://portal.azure.com), PowerShell, CLI or through the API. 

To learn how to manage a reserved instance, see [Manage reserved instances in Azure](../articles/billing/billing-manage-reserved-vm-instance.md).

To learn more about Azure reserved instances, see the following articles:

- [What are Azure Reserved VM Instances?](../articles/billing/billing-save-compute-costs-reservations.md)
- [Manage reserved instances in Azure](../articles/billing/billing-manage-reserved-vm-instance.md)
- [Understand how the reserved instance discount is applied](../articles/billing/billing-understand-vm-reservation-charges.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](../articles/billing/billing-understand-reserved-instance-usage.md)
- [Understand reserved instance usage for your Enterprise enrollment](../articles/billing/billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reserved instances](../articles/billing/billing-reserved-instance-windows-software-costs.md)
- [Reserved instances in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
