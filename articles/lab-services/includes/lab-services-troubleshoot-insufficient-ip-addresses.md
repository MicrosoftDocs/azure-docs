---
ms.service: lab-services
ms.topic: include
author: ntrogh
ms.author: nicktrog
ms.date: 03/28/2023
---

### Lab creation fails because of insufficient IP addresses

Lab creation can fail if the lab account is peered to a virtual network but has too narrow of an IP address range. You can run out of space in the address range if there are too many labs in the lab account (each lab uses 512 addresses). 

For example, if you have a block of /19, this address range can accommodate 8192 IP addresses and 16 labs (8192/512 = 16 labs). In this case, lab creation fails on the 17th lab creation.

Learn how to [increase the IP address range for a lab account](../how-to-connect-peer-virtual-network.md#specify-an-address-range-for-vms-in-the-lab-account).
