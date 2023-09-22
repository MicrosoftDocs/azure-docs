---
title: Azure Dedicated Host SKU Retirement
description: Azure Dedicated Host SKU Retirement landing page
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 3/15/2021
---

# Azure Dedicated Host SKU Retirement

We continue to modernize and optimize Azure Dedicated Host by using the latest innovations in processor and datacenter technologies. Azure Dedicated Host is a combination of a virtual machine (VM) series and a specific Intel or AMD-based physical server. As we innovate and work with our technology partners, we also need to plan how we retire aging technology.

## UPDATE: Retirement timeline extension
Considering the feedback from several Azure Dedicated Host customers that are running their critical workloads on SKUs that are scheduled for retirement, we have extended the retirement timeline from March 31, 2023 to June 30, 2023. 
We don't intend to move the retirement timeline any further and recommend all ADH users that are using any of the listed SKUs to migrate to newer generation based SKUs to avoid workload disruptions.

## Migrations required by 30 June 2023 [Updated]

All hardware has a finite lifespan, including the underlying hardware for Azure Dedicated Host. As we continue to modernize Azure datacenters, hardware is decommissioned and eventually retired. The hardware that runs the following Dedicated Host SKUs is reaching end of life:

- Dsv3-Type1
- Dsv3-Type2
- Esv3-Type1
- Esv3-Type2

As a result we'll retire these Dedicated Host SKUs on 30 June 2023.

## How does the retirement of Azure Dedicated Host SKUs affect you?

The current retirement impacts the following Azure Dedicated Host SKUs:

- Dsv3-Type1
- Esv3-Type1
- Dsv3-Type2
- Esv3-Type2

Note: If you're running a Dsv3-Type3, Dsv3-Type4, an Esv3-Type3, or an Esv3-Type4 Dedicated Host, you are not impacted.

## What actions should you take?

For manually placed VMs, you need to create a Dedicated Host of a newer SKU, stop the VMs on your existing Dedicated Host, reassign them to the new host, start the VMs, and delete the old host. For automatically placed VMs or for Virtual Machine Scale Sets, you need to create a Dedicated Host of a newer SKU, stop the VMs or Virtual Machine Scale Set, delete the old host, and then start the VMs or Virtual Machine Scale Set. 

Refer to the [Azure Dedicated Host Migration Guide](dedicated-host-migration-guide.md) for more detailed instructions. We recommend moving to the latest generation of Dedicated Host for your VM family.

If you have any questions, contact us through customer support.

## FAQs

### Q: Will migration result in downtime?

A: Yes, you would have to stop/deallocate your VMs or Virtual Machine Scale Sets before moving them to the target host.

### Q: When will the other Dedicated Host SKUs retire?

A: We'll announce Dedicated Host SKU retirements 12 months in advance of the official retirement date of a given Dedicated Host SKU.

### Q: What are the milestones for the Dsv3-Type1, Dsv3-Type2, Esv3-Type1, and Esv3-Type1 retirement?

A: 

| Date          | Action                                                                 |
| ------------- | -----------------------------------------------------------------------|
| 15 March 2022 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement announcement |
| 30 June 2023 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement              |

### Q: What happens to my Azure Reservation?

A: You need to [exchange your reservation](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md#how-to-exchange-or-refund-an-existing-reservation) through the Azure portal to match the new Dedicated Host SKU. 

### Q: What would happen to my host if I do not migrate by June 30, 2023?

A: After June 30, 2023 any dedicated host running on the SKUs that are marked for retirement will be set to 'Host Pending Deallocate' state before eventually deallocating the host. For more assistance, please reach out to Azure support.

### Q:  What will happen to my VMs if a Host is automatically deallocated?

A: If the underlying host is deallocated the VMs that were running on the host would be deallocated but not deleted. You would be able to either create a new host (of same VM family) and allocate VMs on the host or run the VMs on multi-tenant infrastructure.
