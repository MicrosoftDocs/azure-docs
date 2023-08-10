---
title: Prepay for Azure Dedicated Hosts to save money
description: Learn how to buy Azure Dedicated Hosts Reserved Instances to save on your compute costs.
services: virtual-machines
author: yashar
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/05/2023
ms.author: banders
ms.reviewer: mattmcinnes
---


# Save costs with Azure Dedicated Host reservations

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

When you commit to a reserved instance of Azure Dedicated Hosts, you can save money. The reservation discount is applied automatically to the number of running dedicated hosts that match the reservation scope and attributes. You don't need to assign a reservation to a dedicated host to get the discounts. A reserved instance purchase covers only the compute part of your usage and does
include software licensing costs. See the [Overview of Azure Dedicated Hosts for virtual machines](./dedicated-hosts.md).

## Determine the right dedicated host SKU before you buy


Before you buy a reservation, you should determine which dedicated host you need. A SKU is defined for a dedicated host representing the VM series and
type. 

Start by going over the supported sizes for [Windows virtual machine](./sizes.md) or [Linux](./sizes.md) to identify the VM series.

Next, check whether it is supported on Azure Dedicated Hosts. [Azure Dedicated Hosts pricing](https://aka.ms/ADHPricing) page has the complete list of dedicated hosts SKUs, their CPU information, and various pricing options (including reserved instances).

You may find several SKUs supporting your selected VM series (with different Types). Identify the best SKU by comparing the capacity of the host (number of vCPUs). Note that you will be able to apply your reservation to multiple dedicated hosts SKUs supporting the same VM series (for example DSv3_Type1 and DSv3_Type2) but not across different VM series (like DSv3 and ESv3).



## Purchase restriction considerations

Reserved instances are available for most dedicated host sizes, with some exceptions.

Reservation discounts don't apply for the following:

- **Clouds** - Reservations aren't available for purchase in Germany or China regions.

- **Insufficient quota** - A reservation that is scoped to a single subscription must have vCPU quota available in the subscription for the new reserved instance. For example, if the target subscription has a quota limit of 10 vCPUs for DSv3-Series, then you can't buy a reservation dedicated hosts supporting this series. The quota check for reservations includes the VMs and dedicated hosts already deployed in the subscription. You can [create quota increase request](../azure-portal/supportability/regional-quota-requests.md) to resolve this issue.

- **Capacity restrictions** - In rare circumstances, Azure limits the purchase of new reservations for subset of dedicated host SKUs, because of low capacity in a region.

## Buy a reservation

You can buy a reserved instance of an Azure Dedicated Host instance in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D).

Pay for the reservation [up front or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md). These requirements apply to buying a reserved Dedicated Host instance:

- You must be in an Owner role for at least one EA subscription or a subscription with a pay-as-you-go rate.

- For EA subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin for the subscription.

- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can buy reservations.

To buy an instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **All services** \> **Reservations**.

3. Select **Add** to purchase a new reservation and then click **Dedicated Hosts**.

4. Enter required fields. Running Dedicated Hosts instances that match the attributes you select qualify to get the reservation discount. The actual number of your Dedicated Host instances that get the discount depend on the scope and quantity selected.

If you have an EA agreement, you can use the **Add more option** to quickly add additional instances. The option isn't available for other subscription types.

| **Field**           | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Subscription        | The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P). The charges are deducted from the Azure Prepayment (previously called monetary commitment) balance, if available, or charged as overage. For a subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription. |
| Scope               | The reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Region              | The Azure region that’s covered by the reservation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Dedicated Host Size | The size of the Dedicated Host instances.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Term                | One year or three years.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Quantity            | The number of instances being purchased within the reservation. The quantity is the number of running Dedicated Host instances that can get the billing discount.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

- **Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.

- **Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.

- **Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For EA customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.

- **Management group** — Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.

## Usage data and reservation utilization

Your usage data has an effective price of zero for the usage that gets a reservation discount. You can see which VM instance received the reservation discount for each reservation.

For more information about how reservation discounts appear in usage data, see [Understand Azure reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) if you are an EA customer. If you have an individual subscription, see [Understand Azure reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Change a reservation after purchase

You can make the following types of changes to a reservation after purchase:

- Update reservation scope

- Instance size flexibility (if applicable)

- Ownership

You can also split a reservation into smaller chunks and merge already split reservations. None of the changes cause a new commercial transaction or change the end date of the reservation.

You can't make the following types of changes after purchase, directly:

- An existing reservation’s region

- SKU

- Quantity

- Duration

However, you can *exchange* a reservation if you want to make changes.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

To learn how to manage a reservation, see [Manage Azure Reservations](../cost-management-billing/reservations/manage-reserved-vm-instance.md).

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)

- [Using Azure Dedicated Hosts](./dedicated-hosts.md)

- [Dedicated Hosts Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/)

- [Manage Reservations in Azure](../cost-management-billing/reservations/manage-reserved-vm-instance.md)

- [Understand how the reservation discount is applied](../cost-management-billing/manage/understand-vm-reservation-charges.md)

- [Understand reservation usage for a subscription with pay-as-you-go rates](../cost-management-billing/reservations/understand-reserved-instance-usage.md)

- [Understand reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)

- [Windows software costs not included with reservations](../cost-management-billing/reservations/reserved-instance-windows-software-costs.md)

- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
