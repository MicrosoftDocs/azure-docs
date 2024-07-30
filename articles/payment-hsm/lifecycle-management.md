---
title: Azure Payment HSM Lifecycle Management
description: Azure Payment HSM is a bare metal service utilizing Thales payShield 10K devices in Azure data centers, providing automated allocation and deallocation, physical security management, and customer responsibility for key management and HSM monitoring.
services: payment-hsm
author: msmbaldwin

ms.service: payment-hsm
ms.topic: article
ms.date: 07/23/2024
ms.author: mbaldwin

---

# Azure Payment HSM Lifecycle Management

Azure Payment HSM is a Bare Metal service delivered via Thales payShield 10K. Microsoft collaborates with Thales to deploy Thales payShield 10K HSM devices into Azure data centers, modifying them to allow automated allocation/deallocation of those devices to customers. The payShield in Azure has the same management and host command interfaces as on-premises payShield, enabling customers to use the same payShield manager smart cards, readers, and payShield TMD devices.
  
## Deployment and allocation  

Microsoft personnel deploy HSMs into Azure data centers and allocate them to customers through automated tools on-demand. Once an HSM is allocated, Microsoft relinquishes logical access and does not maintain console-access. Microsoft’s administrative access is disabled, and the customer assumes full responsibility for the configuration and maintenance of the HSM and its software.
  
## Security and compliance  

Microsoft handles tasks related to the physical security requirements of the HSM, based on PCI DSS, PCI 3DS, PCI PIN, PCI P2PE requirements. Deallocating HSMs from customers erases all encryption material from the device as part of the mechanism that re-enables Microsoft’s administrative access. Microsoft does not have any ability to manage or affect the security of keys beyond hosting the physical HSM devices.  

## Key management & customer scenarios  

Microsoft customers using Payment HSMs utilize 2 or more "Admin cards" provided by Thales to create a Local Master Key (LMK) and security domain. All key management occurs within this domain.
  
Several scenarios may occur:  

- **Key Loading:** Customers may receive printed key components from third-parties or internal backups for loading into the HSM. Compliance requires the use of a PCI Key-Loading Device (KLD) due to the lack of direct physical access to the HSM by customers.  

- **Key Distribution:** Customers may generate keys within the HSM, but then need to distribute those keys to third parties in the form of key components. The Payment HSM solution – being cloud-based – cannot support printing key components directly from the HSM. However, customers may use a TMD or similar solution to export keys and print from the customer’s secure location.  

## HSM firmware management  

Microsoft allocates Payment HSMs with a base image by default that includes approved firmware for the FIPS 140-2 Level 3 certification and PCI PTS HSMv3 approved. Microsoft is responsible for applying security patches to unallocated HSMs. Customers are responsible for ongoing patching and maintenance of the allocated HSM.  

## HSM monitoring  

Microsoft monitors HSM physical health and network connectivity, which includes individual HSM’s power, temperature/Fan, OOB Connectivity, tamper, HOST1/HOST2/MGMT link status, upstream networking, and equipment.
  
Customers are responsible for monitoring their allocated HSM’s operational health, which includes HSM error logs and audit logs. Customers can utilize all payShield monitoring solutions.

## Managing unresponsive HSM devices  

If a situation arises where a customer allocated HSM is unresponsive, open a support ticket; see [Azure Payment HSM service support guide](support-guide.md#microsoft-support). A representative will work with you and the Engineering group to resolve the issue. This may require either a reboot, or a deallocation/reallocation to resolve.
  
### Rebooting  

There are two methods of rebooting:  

- **Soft Reboot:** The Engineering group can issue an Out of Band (OOB) request to the device for it to initiate a restart and can quickly verify via Service Audit Logs that it was successful. This option can be exercised shortly after a request via Customer Support. Note that there are some circumstances (device network issues, device hard-lock) that would prevent the HSM from receiving this request.  

- **Hard Reboot:** The Engineering group can request on-site datacenter personnel physically interact with the HSM to reboot it. This option can take longer time depending on severity of the impact. We highly recommend customer to discuss with support and engineering group to evaluate the impact, and determine whether customer should create a new HSM to move forward or wait for the hard reboot.  

Customer Data Impact: In either method, customer data should be unaffected by a reboot operation.  

### Deallocation/reallocation  

There are two methods to deallocate/delete an HSM:  

- **Normal Delete:** In this process the customer can Release the HSM via the payShield Manager before deleting the HSM in Azure. This process checks/ensures that the HSM is released (and therefore all customer content/secrets are removed) before it is handed back to Microsoft and will block if that check fails. After the customer releases the HSM they should retry the request. See [Tutorial: Remove a commissioned payment HSM](remove-payment-hsm.md?tabs=azure-cli).

- **Force delete:** If the customer is unable to Release the HSM before deletion (due to unresponsive device, etc.) the Engineering group, with a documented request from the customer, can set a flag that bypasses the Release check. In this case, when the HSM is deleted the automated management system performs an OOB "Reclaim" request, which issues a "Release" command on behalf of the previous customer and clears all customer content (data, logs, etc.).  

Customer Data Impact: In either method, customer data is irrevocably removed by the "Release Device" command.  

### Failed HSMs  

In the case of an actual HSM hardware failure of a customer allocated device the only course of action is to use the "Force Delete" deallocation method. That allows the Azure resource linked with that HSM to be deleted. Once that has been completed, on-site Datacenter personnel are directed to follow the approved Datacenter runbook to destroy data bearing devices (HDD) and the actual HSM contained in the failed HSM.  

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)