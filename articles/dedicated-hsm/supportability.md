---
title: Azure Dedicated HSM supportability | Microsoft Docs
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

# Azure Dedicated HSM Supportability

Azure Dedicated HSM Service provides a physical device for sole customer use with complete administrative control and management responsibility. The device made available is a Gemalto SafeNet Luna 7 HSM model A790.  Microsoft will have no administrative access once allocated to a customer, beyond physical serial port attachment, and no further involvement in the design, development, deployment, and management of any applications that use the HSM.  The HSM devices will need management in terms of software updates, backup, monitoring, pulling logs etc. and this is the responsibility of the customer.  In this situation where Microsoft has so little involvement in the lifecycle of the devices and applications that use them, it is not possible to offer any kind of availability guarantee for the device.  Microsoft will ensure the device is reachable from a virtual networking standpoint and functional in terms of power, cooling, and high security installation in Microsoft datacenters.  

## Gemalto support

Every customer using the Dedicated HSM service must have a support contract in place with Gemalto prior to any kind of provisioning activities. As part of the support contract customers receive guidance, support, and services directly from Gemalto. The mechanism to get support from Gemalto is their [customer support portal](https://supportportal.gemalto.com/csm/).
Gemalto will provide any software components required to use the HSM. Any support on the configuration of the HSM and any required consulting services for the design, development, and deployment of applications that make use of the HSM.

### Software components

Various software components are used in the configuration of HSM devices:

* Client software
* SDK
* Tools

### Guidance

Gemalto makes available administration and configuration guidance via the [customer support portal](https://supportportal.gemalto.com/csm/). Once signed in using a valid customer ID, these documents are available for download.
Gemalto also makes available a series of integration guides that may be useful to customers based on the scenario and software level integrations they are trying to achieve. For further information see the [Gemalto partner site for Microsoft](https://safenet.gemalto.com/partners/microsoft/).

### Support

Any software level issue or question in relation to using the HSM’s as part of the Dedicated HSM service should be addressed to Gemalto support directly. All software components listed above and any custom HSM configuration that is post-provisioning will be addressed by Gemalto. For further information see the [Gemalto customer support portal](https://supportportal.gemalto.com/csm/).

### Consulting services

For any assistance in the design, development and deployment of custom applications that leverage the HSM, contact your Gemalto account representative.

## Microsoft support

As part of Dedicated HSM Microsoft is responsible for making available physical HSM devices for the exclusive use of a single customer. Once provisioned, the customer has sole responsibility for any administration and management activities related to the ongoing use and health of the HSM device.  This includes, software updates, monitoring, pulling logs and backups. Microsoft ensures the HSM device is functional. Keeping the device functional involves:

* Making sure that the device has power
* Ensuring an operational state
* The device remains accessible over the network.

Any physical device issues such as component failures or full device level failures should be reported to Microsoft as well as network access issues and issues related to provisioning and decommissioning.  

### Provisioning and decomissioning

When a customer successfully registers for the Dedicated HSM Service they will then be able to create a Dedicated HSM resource which goes through an allocation process mapping a physical device in a specified region to a customer’s pre-defined virtual network (VNET).  Once visible on VNET the customer can then proceed to access via Gemalto client tools and perform custom configuration related to their requirements. That resource creation process is supported by Microsoft and any issues specific to that should be addressed to Microsoft. Custom configuration process and beyond are supported by Gemalto. (see Gemalto support above).
When a customer has finished using an HSM it must be reset in terms of custom configuration and data and deleted as a resource. Microsoft deallocates the device and returns it to the pool of available resources in a pristine state with no evidence of previous customer activity. This decommissioning process is also supported by Microsoft 

### Hardware issues

The HSM devices have redundant and replaceable power supply’s and fan units. However, the fan unit removal will cause a tamper event (as in FIPS 140-2) if removed when the device is powered on and not in maintenance mode. To avoid any issues with triggering tamper events the parts replacement will be treated differently.

* PSU replacement. This will be done as a hot-swap item. The customer should contact Microsoft support with device and event details and we will ensure the component is replaced from spares on-hand.
* Fan replacement. To avoid any issues related to the consequence of accidental tamper events, the fan will be replaced offline. This means that after the customer contacts Microsoft support with device and event details suggesting a fan failure, Microsoft will ask the customer to reset the device to erase all customer data and then allocate a new device as replacement for the customer. The new device will then synchronize as part of its high availability pairing and be operational. Microsoft will replace the fan unit and return the original device to the unused pool in a pristine state.

Any more serious failure of the device will result in that device being replaced for the customer triggering synchronizing with the high availability pairing and return to an operational state. The failed device will have it’s data bearing devices removed and shredded on site at the data center. Only the will the chassis be returned to Gemalto.  

### Networking issues

If the customer determines that there is no logical networking access to the HSM device, they should contact Microsoft support. A simple test for networking access is to use the SSH tool to attempt to connect to the HSM device. If this fails, or any other monitoring determines there is a networking issue, then Microsoft support should be contacted.

## Service level expectations for support

Microsoft support provides the following service levels:

|Severity   | Response during business hours   | Response outside business hours   |
|---|---|---|
| 1  | ?  | ?  |
| 2  |   |   |
| 3  |   |   |
| 4  |   |   |

Gemalto support operates to the following service level assuming the customer has a “Plus Support” contract in place.

|Severity   | Response during business hours   | Response outside business hours   |
|---|---|---|
| 1  | 1 hour  | 1 hour  |
| 2  | 4 hours  | 4 hours  |
| 3  | 4 hours  | 8 hours  |
| 4  | Next business day  | Next business day  |

## Next steps

It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before and device provisioning and application design or deployment.
Further concept level topics:

* [Deployment Architecture](deployment-architecture.md)
* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
