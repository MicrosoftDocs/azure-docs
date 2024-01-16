---
title: Common troubleshooting steps about Standby Pools for Virtual Machine Scale Sets
description: Learn about various troubleshooting steps about Standby Pools on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---

# Troubleshooting

### I created my Standby Pool and it reported back as successful. However, I do not see any VMs being 
created in my subscription. 
Make sure you have entered the correct Subscription ID in the PUT calls. If you accidentally used the 
incorrect subscription or there was an error in your input, the response might still show successful even 
though the actual creation of the VMs will fail on the backend. We are working on building out the error 
messaging to improve this experience. 

### I created a Standby Pool and I noticed that some VMs are coming up in a failed state. 
Ensure you have enough quota to complete the Standby Pool creation. Insufficient quota usually results 
in the platform attempting to create the VMs in the Standby Pool but unable to successfully complete 
the create operation. Check for multiple types of quotas such as Cores, NICs, IP Addresses, etc.

## Next steps