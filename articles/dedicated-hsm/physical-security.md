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
ms.date: 11/05/2018
ms.author: barclayn

---
# Azure Dedicated HSM physical security

Azure Dedicated HSM helps you meet advanced security requirements. It is managed following stringent security practices throughout its full lifecycle.

## Security through procurement

Microsoft follows a secure procurement process. We manage the chain of custody and ensure that the specific device ordered and shipped is the device arriving at our data centers. The HSM devices are stored in a secure storage area until commissioned in the data gallery of the data center.  The racks containing the HSM devices are considered high business impact(HBI). These devices are locked and under video surveillance at all times.

## Security through deployment

Hardware security modules are installed in racks together with associated networking components. Once installed, they must be configured before they are made available as part of the Azure Dedicated HSM Service. The access for this configuration activity is only performed by Microsoft employees (???BACKGROUND CHECKED???). “Just In Time” (JIT) administration is used to limit access to only the right employees and for only the time that access is needed. The procedures and systems used also ensure that all activity related to the HSM devices is tracked and logged.

## Security in operations

HSMs are hardware devices so it is possible that component level issues may come up. These include but are not limited to fan or power supply failures. This type of event will require maintenance or break/fix activities to replace any swappable devices. In the extreme case of a total device failure, the HSM would be replaced.

### Component replacement

After a device is provisioned and under customer management, the hot-swappable power supply is the only component that may be serviced without triggering a tamper event. If this type of work is required a ticketing system will be used. A request is made in the ticket to allow a Microsoft engineer to access the rear of the HBI rack. When the ticket is processed a temporary physical key is issued. This temporary key gives the Microsoft engineer access to the device and allows them to hot-swap the affected power supply.

### Device replacement

If a fan needs to be replaced, the HSM device will be reset and deallocated by the customer. This process will remove all customer data and configuration. The customer will receive another device. The device with the failed fan will have the fan replaced and the HSM will be made available for reassignment in a pristine condition. A ticket will be created to allow a Microsoft engineer access to the HBI rack. The ticket will allow the engineer to be issued a temporary physical key. The key will allow the engineer to gain access for the fan unit to be replaced.

Another scenario may be a device failure that leaves it in an unknown state. In this case, the engineer, after getting formal access to the rack, will remove data bearing devices and deposit them in a device destruction bin. Devices placed in the bin will be destroyed in a controlled and secure manner. No data bearing devices will leave a Microsoft datacenter. Stripped of data bearing devices, an HSM device chassis can be returned to Gemalto for replacement.

### Other Rack Access Activities

If for any reason a Microsoft engineer must access the rack used by HSM devices (for example, networking device maintenance), standard procedures will be used for physical key access to the HBI secure rack. All access will also be under video surveillance. The HSM devices are certified to [FIPS 140-2 Level 3](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.140-2.pdf) such that any unauthorized access to the HSM Devices will be signaled to the customer and data will be zeroized.

## Logical level security considerations

The HSMs are initially provisioned to a dedicated virtual network created by the customer instead of using the Azure network. This configuration has an impact in terms of the ExpressRoute Gateway requirement but it provides a valuable logical network level isolation. This isolation increases confidence in access only being available to the customer. Once provisioned, the HSM device is fully under the control of the customer. This implies that any logical level security controls are the responsibility of the customer. The customer’s first task will be to change the administrator password. From that point until the device is reset and decommissioned, Microsoft has no administrative access to the device. The exception for administrative access is the serial port connection. The serial port connection is only available inside the rack. The rack is locked inside a highly secured data gallery area of the data centers.

## Next steps

It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before device provisioning, application design or deployment.

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Deployment architecture](deployment-architecture.md)