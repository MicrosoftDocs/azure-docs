---
title: Configure your Azure Compute Fleet
description: Learn about configuration options for your Compute Fleet.
author: rajeeshr
ms.author: rajeeshr
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Configure your Azure Compute Fleet 

We recommend you consider the following configuration options when creating your Compute Fleet.

| Configuration option | Description |
|----------------------|-------------|
| [Spot VM]() | Compute Fleet will submit a one-time request for a desired capacity or a fleet that maintains target capacity over time. |
| [Compute Fleet allocation strategies]() | Choose an allocation strategies each for Spot and Standard VMs to optimize your Compute Fleet for the lowest price, capacity, or a combination of both. |
| [Attribute based VM selection](attribute-based-vm-selection.md) | Specify your VM sizes and types for your fleet or let Azure Compute Fleet choose the VM sizes and types that meets your application requirement. |
