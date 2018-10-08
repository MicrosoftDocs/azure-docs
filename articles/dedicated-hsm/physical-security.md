---
title: Azure Dedicated HSM physical security | Microsoft Docs
description: Azure Dedicated HSM provides key storage capabilities within Azure that meets FIPS 140-2 Level 3 certification
services: key-vault
author: barclayn
manager: mbaldwin

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: barclayn

---
# Azure Dedicated HSM physical security

The Azure Dedicated HSM service addresses advanced security requirements. It is treated with the highest degree of security by Microsoft through its full lifecycle.

## Security through procurement

Microsoft will ensure that the procurement mechanisms we use are highly secure by managing chain of custody and ensuring the specific device ordered and shipped is the device arriving at our datacenters. The HSM devices are stored in a secure storage area until commissioned in the data gallery of the datacenter.  The racks containing the HSM devices are considered “HBI”, or high business impact, and hence are locked at all times and are under video surveillance.

## Security through deployment

When a rack of HSM Devices and associated networking components have been physically installed in the datacenter it must then be configured to be made available as part of the Azure Dedicated HSM Service. This access for this configuration activity is only performed by Microsoft employees (???BACKGROUND CHECKED???) and a “Just In Time” (JIT) administration service is used to ensure only the right employees get access to configure devices for only the purpose and time they need it. This also ensures a log of all activity related to the HSM devices.

## Security in operations

During normal operation of the Dedicated HSM service, there may be need to perform maintenance tasks such as replace swappable items or even replace the device itself.

### Component replacement

The only component that will be replaced on a customer provisioned device is the hot-swappable power supply. This component does not cause a tamper event when removed. A formal ticketing system will be used to allow a Microsoft engineer to access the rear of the HBI rack, requiring temporary issuance of a physical key for access, and perform a hot-swap process on the affected power supply.

### Device replacement

In the case of fan replacement, the HSM device will be reset and deallocated by the customer removing all customer data and configuration. The customer will receive a fresh device to allow continued operation and the device with failed fan will have the fan replaced and the device return to the free pool in pristine condition. A formal ticketing system will be used to allow a Microsoft engineer access to the HBI rack, requiring temporary issuance of a physical key for access, so the fan unit can be replaced.
Another scenario may be device failure leaving it in an unknown state. In this case, the engineer, after getting formal access to the rack, will remove data bearing devices and deposit them in a in-rack device destruction bin so they can be destroyed in a controlled and secure manner later. No data bearing devices will leave a Microsoft datacenter. Stripped of data bearing devices, an HSM device chassis can be returned to Gemalto for replacement.

### Other Rack Access Activities

If for any reason a Microsoft engineer must access the rack containing HSM devices (for example, networking device maintenance), standard procedures will be used for physical key access to the HBI secure rack. All access will also be under video surveillance. The HSM devices are certified to [FIPS 140-2 Level 3](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.140-2.pdf) such that any unauthorized access to the HSM Devices will be signaled to the customer and data will be zeroized.

## Logical level security considerations

The HSM devices are initially provisioned onto a dedicated virtual network created by the customer instead of using the Azure network. While this does have an impact in terms of the ExpressRoute Gateway requirement, it does provide a valuable logical network level isolation increasing confidence in access only being available to the customer.
Once provisioned, the HSM device is fully under the control of the customer. This implies that any logical level security controls are the responsibility of the customer. The customer’s first task will be to change the administrator password and from that point until device reset and decommissioning, Microsoft has no administrative access to the device. The exception for administrative access is the serial port connection and this is only available inside the HBI locked and video surveilled rack inside the highly secured data gallery area of the datacenters.

## Next steps

It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before and device provisioning and application design or deployment.

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Deployment architecture](deployment-architecture.md)