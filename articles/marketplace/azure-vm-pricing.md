---
title: Configuring prices for monthly billing in Azure Marketplace
description: Learn how to Configuring prices for VM.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshah
ms.author: iqshah
ms.date: 09/28/2021
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
- Prices are fixed, so once published they cannot be adjusted. However, if you would like to reduce prices for your VM offers you can open a [support ticket](./support.md).

## New offering pricing

Microsoft Azure is regularly adding new VM infrastructure. Occasionally we add a machine that has a CPU count that wasn't offered before. Microsoft determines the price for the new core size based on previous pricing and adds them as suggested prices.

Publishers receive an email when the price is set for new core sizes and will have some time to review and make adjustments as needed. After the deadline passes microsoft publishes the prices for the newly added core sizes.

If the publisher chose Free, Flat or Per core size, then the publisher has already provided the necessary details on how to price the offer for new core sizes and no further action is needed. However, if the publisher previously selected the Per core size, or Per market and core size, then they would need to contact Microsoft with their updated pricing information.

## Next steps

- If you have any questions, open a ticket with [support](./support.md).