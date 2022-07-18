---
title: Azure Dedicated Host SKU Retirement
description: Azure Dedicated Host SKU Retirement landing page
author: brittanyrowe
ms.author: brittanyrowe
ms.reviewer: mattmcinnes
ms.service: virtual-machines
ms.subservice: dedicated-hosts
ms.topic: conceptual
ms.date: 3/15/2021
---

# Azure Dedicated Host SKU Retirement

We continue to modernize and optimize Azure Dedicated Host by using the latest innovations in processor and datacenter technologies. Azure Dedicated Host is a combination of a virtual machine (VM) series and a specific Intel or AMD-based physical server. As we innovate and work with our technology partners, we also need to plan how we retire aging technology.

## Migrations required by 31 March 2023

All hardware has a finite lifespan, including the underlying hardware for Azure Dedicated Host. As we continue to modernize Azure datacenters, hardware is decommissioned and eventually retired. The hardware that runs the following Dedicated Host SKUs will be reaching end of life:

- Dsv3-Type1
- Dsv3-Type2
- Esv3-Type1
- Esv3-Type2

As a result we'll retire these Dedicated Host SKUs on 31 March 2023.

## How does the retirement of Azure Dedicated Host SKUs affect you?

The current retirement impacts the following Azure Dedicated Host SKUs:

- Dsv3-Type1
- Esv3-Type1
- Dsv3-Type2
- Esv3-Type2

Note: If you're running a Dsv3-Type3, Dsv3-Type4, an Esv3-Type3, or an Esv3-Type4 Dedicated Host, you won't be impacted.

## What actions should you take?

For manually placed VMs, you'll need to create a Dedicated Host of a newer SKU, stop the VMs on your existing Dedicated Host, reassign them to the new host, start the VMs, and delete the old host. For automatically placed VMs or for virtual machine scale sets, you'll need to create a Dedicated Host of a newer SKU, stop the VMs or virtual machine scale set, delete the old host, and then start the VMs or virtual machine scale set. 

Refer to the [Azure Dedicated Host Migration Guide](dedicated-host-migration-guide.md) for more detailed instructions. We recommend moving to the latest generation of Dedicated Host for your VM family.

If you have any questions, contact us through customer support.

## FAQs

### Q: Will migration result in downtime?

A: Yes, you'll need to stop/deallocate your VMs or virtual machine scale sets before moving them to the target host.

### Q: When will the other Dedicated Host SKUs retire?

A: We'll announce Dedicated Host SKU retirements 12 months in advance of the official retirement date of a given Dedicated Host SKU.

### Q: What are the milestones for the Dsv3-Type1, Dsv3-Type2, Esv3-Type1, and Esv3-Type1 retirement?

A: 

| Date          | Action                                                                 |
| ------------- | -----------------------------------------------------------------------|
| 15 March 2022 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement announcement |
| 31 March 2023 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement              |

### Q: What will happen to my Azure Reservation?

A: You'll need to [exchange your reservation](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md#how-to-exchange-or-refund-an-existing-reservation) through the Azure portal to match the new Dedicated Host SKU. 