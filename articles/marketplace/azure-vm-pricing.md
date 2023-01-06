---
title: Configuring prices for virtual machines in Partner Center.
description: Learn how to configure prices for virtual machines in Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshah
ms.author: iqshah
ms.date: 03/28/2022
---

# Configure prices for usage-based monthly billing

The Usage-based monthly billing plan will charge the customer for their hourly use and is billed monthly. This is our "Pay as you go" plan, where customers are only billed for the hours that they've used.
When you select this plan, choose one of the following pricing options:

- **Free** – Your VM offer is free.
- **Flat rate (recommended)** – Your VM offer is the same price regardless of the hardware it runs on.
- **Per core** – Your VM offer pricing is per CPU core count (you give us the price for one CPU core and we’ll increment the pricing based on the size of the hardware).
- **Per core size** – Assign prices based on the number of CPU cores on the hardware it's deployed on.
- **Per market and core size** – Assign prices based on the number of CPU cores on the hardware it's deployed on and also for all markets (currency conversion is done by you the publisher, this option is easier if you use the import pricing feature).

Some things to consider when selecting a pricing option:

- In the first four options, Microsoft does the currency conversion.
- Microsoft suggests using a flat rate pricing for software solutions.
- See [Changing prices in active commercial marketplace offers](price-changes.md) for details and limitations on changing prices in active offers.

## New offering pricing

Microsoft Azure is regularly adding new VM infrastructure. Occasionally we add a machine that has a CPU count that wasn't offered before. Microsoft determines the price for the new core size based on previous pricing and adds them as suggested prices.

Publishers receive an email when the price is set for newly added core sizes and will have some time to review and make adjustments as needed. After the deadline passes, Microsoft publishes the new prices.

If the publisher chose Free, Flat or Per-core size, the publisher has already provided the necessary details on how to price the offer for new core sizes and no further action is needed. However, if the publisher previously selected the Per-core size, or Per-market and core size, they need to contact us (see below link) with their updated pricing information.

## Next steps

- If you have questions, [contact support](https://go.microsoft.com/fwlink/?linkid=2056405).
