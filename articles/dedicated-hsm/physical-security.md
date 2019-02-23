---
title: HSM physical security - Azure Dedicated HSM | Microsoft Docs
description: Information about Azure Dedicated HSM devices' physical security in data centers
services: dedicated-hsm
author: barclayn
manager: barbkess
ms.custom: "mvc, seodec18"
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: barclayn

---
# Azure Dedicated HSM physical security

Azure Dedicated HSM helps you meet advanced security requirements for key storage. It is managed following stringent security practices throughout its full lifecycle to meet customers needs.

## Security through procurement

Microsoft follows a secure procurement process. We manage the chain of custody and ensure that the specific device ordered and shipped is the device arriving at our data centers. The devices are in tamper-event plastic backs. They are stored in a secure storage area until commissioned in the data gallery of the data center.  The racks containing the HSM devices are considered high business impact(HBI). The devices are locked and under video surveillance at all times front and back.

## Security through deployment

HSMs are installed in racks together with associated networking components. Once installed, they must be configured before they are made available as part of the Azure Dedicated HSM Service. This configuration activity is performed by Microsoft employees that have undergone a background check. “Just In Time” (JIT) administration is used to limit access to only the right employees and for only the time that access is needed. The procedures and systems used also ensure that all activity related to the HSM devices is logged.

## Security in operations

HSMs are hardware appliances (the actual HSM being a PCI card within the appliance) so it is possible that component level issues may arise. Potential issues include but are not limited to fan and power supply failures. This type of event will require maintenance or break/fix activities to replace any swappable components.

### Component replacement

After a device is provisioned and under customer management, the hot-swappable power supply is the only components that would be replaced. This component is outside of the security boundary and does not cause a tamper event. A ticketing system is used to authorize a Microsoft engineer to access the rear of the HBI rack. When the ticket is processed a temporary physical key is issued. This key gives the engineer access to the device and allows them to swap the affected component. Any other access (that is, tamper event causing) would be done when a device is not allocated to a customer thus minimizing security and availability risk.  

### Device replacement

In the event of total device failure, a process similar to the one used during component failure is followed. If a customer is not able to zeroize the device, or the device is in an unknown state, the data bearing devices will be removed and placed in an in-rack destruction bin. Devices placed in the bin will be destroyed in a controlled and secure manner. No data bearing devices from an HBI rack will leave a Microsoft datacenter.

### Other Rack Access Activities

If a Microsoft engineer must access the rack used by HSM devices (for example, networking device maintenance), standard security procedures will be used to gain access to the HBI secure rack. All access will be under video surveillance. The HSM devices are validated to [FIPS 140-2 Level 3](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.140-2.pdf) so any unauthorized access to the HSM Devices will be signaled to the customer and data will be zeroized.

## Logical level security considerations

HSMs are provisioned to a virtual network created by the customer. This is a customer’s private IUP Address space.  This configuration provides a valuable logical network level isolation and ensures access only by the customer. This implies that all logical level security controls are the responsibility of the customer.

## Next steps

It is recommended that all key concepts of the service, such as high availability and security and supportability for example, are well understood before device provisioning, application design or deployment.

* [High Availability](high-availability.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)
* [Deployment architecture](deployment-architecture.md)