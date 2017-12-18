# Prepay for Virtual Machines with Reserved VM Instances

Prepay for virtual machines and save money with Reserved Virtual Machine Instances. For more information, see [Reserved Virtual Machine Instances offering](https://azure.microsoft.com/pricing/reserved-vm-instances/).

You can buy Reserved Virtual Machine Instances in the [Azure portal](https://portal.azure.com). To buy a Reserved Virtual Machine Instance:
-	You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
-	For Enterprise subscriptions, reservation purchases must be enabled in the [EA portal](https://ea.azure.com).

## Buy a Reserved Virtual Machine Instance
1. Log in to the [Azure portal](https://portal.azure.com).
2. Select **More Services** > **Reservations**.
3. Select **Add** to purchase a new reservation.
4. Fill in the required fields. Running VM instances that match the attributes you select qualify to get the reservation discount. The actual number of your VM instances that get the discount depend on the scope and quantity selected.

    | Field      | Description|
    |:------------|:--------------|
    |Name        |The name of this reservation.| 
    |Subscription|The subscription used to pay for the reservation. The payment method on the subscription is charged the upfront costs for the reservation. The subscription type must be an enterprise agreement (offer number: MS-AZR-0017P) or Pay-As-You-Go (offer number: MS-AZR-0003P). For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.|    
    |Scope       |The reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: <ul><li>Single subscription - The reservation discount is applied to VMs in this subscription. </li><li>Shared - The reservation discount is applied to VMs running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions (except dev/test subscriptions) within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</li></ul>|
    |Location    |The Azure region that’s covered by the reservation.|    
    |VM Size     |The size of the VM instances.|
    |Term        |One year or three years.|
    |Quantity    |The number of instances being purchased within the reservation. The quantity is the number of running VM instances that can get the billing discount. For example, if you are running 10 Standard_D2 VMs in East US, then you would specify quantity as 10 to maximize the benefit for all running machines. |
5. You can view the cost of the reservation when you select **Calculate cost**.

    ![Screenshot before submitting reservation purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvminstance-purchase.png)

6. Select **Purchase**.
7. Select **View this Reservation** to see the status of your purchase.

    ![Screenshot before submitting reservation purchase](./media/virtual-machines-buy-compute-reservations/virtualmachines-reservedvmInstance-submit.png)

## Next steps after buying a reservation
The reservation discount is applied automatically to the number of running virtual machines that match the reservation scope and attributes. You can update the scope of the reservation through [Azure portal](https://portal.azure.com), PowerShell, CLI or through the API. 

To learn how to manage a reservation, see [Manage Azure Reserved Virtual Machine Instances](https://go.microsoft.com/fwlink/?linkid=861613).

