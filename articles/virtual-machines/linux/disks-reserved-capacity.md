---
title: Select a disk type for Azure IaaS Linux VMs - managed disks
description: Learn about the available Azure disk types for Linux virtual machines, including ultra disks, premium SSDs, standard SSDs, and Standard HDDs.
author: roygara
ms.author: rogarana
ms.date: 11/04/2019
ms.topic: conceptual
ms.service: virtual-machines-linux
ms.subservice: disks
---

# Reduce costs with Azure Disks Reservation

Save on your premium solid state drive (SSD) usage with reserved capacity, combined with Reserved Virtual Machine Instances you can decrease your total VM costs. The reservation discount is applied automatically to the matching disks in the selected reservation scope, you don't need to assign a reservation to a Managed disk to get the discounts. Discounts are applied hourly on the disk usage and any unused reserved capacity does not carry over. Managed disk reservation discount does not apply to unmanaged disks, ultra disks, or page blob consumption.

## Determine your storage needs

Before you purchase a reservation, you should determine what your storage needs are. Currently, we offer disk reservation on select Disk SKUs for premium SSDs. The SKU of a premium SSD determines the disk's size and performance. When determining your storage needs, we do not recommend thinking of disks just as a total capacity, you cannot use a reservation for a larger disk (like a P40) and use that to pay for two smaller disks (P30). You are only making a reservation for the total number of the SKUs that you select.

If you need to create a 1 TiB disk, it maps to P30 disk SKU. If you need a 250 GiB disk, it is rounded up to lowest Disk SKU that can provide the necessary capacity. Disk reservation is made per Disk SKU, hence the reservation consumption is based on the unit of the Disk SKUs instead of the provided size. For example, if you have reserved 1 P40 of 2 TiB provisioned capacity but consumed 2 P30 each of 1 TiB, the two P30 consumption will not be accounted for P40 reservation. 

[!INCLUDE [disk-storage-premium-ssd-sizes](../../../includes/disk-storage-premium-ssd-sizes.md)]

## Purchase considerations

We recommend the following best practices when considering disk reservation purchase:

•	Analyze your usage information to help determine which reservations you should purchase. Make sure you are tracking the usage in Disk SKUs instead of provisioned or used disk capacity. 
•	Examine your Disk Reservation along with your VM reservation. We highly recommend to make reservation for both VM and Disk usage for maximum saving. You can start with determining the right VM reservation, then evaluate the disk reservation accordingly. Per workload, there is a typically a fix disk to VM configuration regarding of the SKUs and units. This approach can simplify the evaluation process and also make sure that you have an aligned plan for both VM and Disks in terms of subscriptions, regions, and others. 

## Purchase restrictions

Reserved Disk SKUs are available for Premium SSD Managed Disks with some exceptions. Reservation discounts don't apply for the following Disks:
•	Unmanaged Disks/Page Blobs of Premium nor Standard
•	Standard SSD or Standard HDD Managed Disks
•	Premium SSD Managed Disks below P30 – Reservations aren’t available for P1/P2/P3/P4/P6/P10/P15/P20 Premium SSD Managed Disk SKUs.
•	Clouds - Reservations aren't available for purchase in Azure Gov, Germany or China regions.
•	Capacity restrictions - In rare circumstances, Azure limits the purchase of new reservations for subset of Disk SKUs, because of low capacity in a region.

## Buy a Disk Reservation

You can purchase Azure Disk Reservations through the Azure portal. Pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see Purchase Azure reservations with up front or monthly payments.

Follow these steps to purchase reserved capacity:

<Portal Purchase Workflow>

## Exchange or refund a reservation

You can exchange or refund a reservation, with certain limitations. These limitations are described in the following sections.

To exchange or refund a reservation, navigate to the reservation details in the Azure portal. Select Exchange or Refund, and follow the instructions to submit a support request. When the request has been processed, Microsoft will send you an email to confirm completion of the request.

For more information about Azure Reservations policies, see Self-service exchanges and refunds for Azure Reservations.

## Exchange a reservation

Exchanging a reservation enables you to receive a prorated refund based on the unused portion of the reservation. You can then apply the refund to the purchase price of a new Azure Disk reservation.
There's no limit on the number of exchanges you can make. Additionally, there's no fee associated with an exchange. The new reservation that you purchase must be of equal or greater value than the prorated credit from the original reservation. An Azure Disk reservation can be exchanged only for another Azure Disk reservation, and not for a reservation for any other Azure service.

## Refund a reservation

You may cancel an Azure Disk reservation at any time. When you cancel, you'll receive a prorated refund based on the remaining term of the reservation, minus a 12 percent early termination fee. The maximum refund per year is $50,000.
Cancelling a reservation immediately terminates the reservation and returns the remaining months to Microsoft. The remaining prorated balance, minus the fee, will be refunded to your original form of purchase.

## Expiration of a reservation

When a reservation expires, any Azure Disk capacity that you are using under that reservation is billed at the pay-as-you go rate. Reservations don't renew automatically.
You will receive an email notification 30 days prior to the expiration of the reservation, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

## Need help? Contact us

If you have questions or need help, create a support request.

## Next steps

•	What are Azure Reservations?
