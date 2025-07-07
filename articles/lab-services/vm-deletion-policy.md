---
title: Deletion policy for virtual machines
description: The VM deletion policy for Azure Lab Services
ms.topic: overview
ms.date: 04/23/2025

# customer intent: As an Azure Lab Services customer, I want to understand the VM deletion policy for Azure Lab Services.
---

# Virtual machine deletion policy

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

On June 9, 2025, Azure Lab Services will delete all virtual machines (VMs) that have been inactive since July 1, 2023. 

A virtual machine is considered inactive if no operations were performed on it. These operations include actions such as starting, stopping, resetting passwords, and reimaging. Any associated labs for these virtual machines will also be deleted. This policy applies to template VMs and production VMs.

After the virtual machines are deleted, we won't be able to recover them or their data.  

**Recommended actions**: 
1. Back up any required data from your inactive virtual machines. 
1. Delete the virtual machines and the associated labs to avoid incurring any unnecessary charges. 