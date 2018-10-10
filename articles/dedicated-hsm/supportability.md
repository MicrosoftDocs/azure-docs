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
ms.date: 10/10/2018
ms.author: barclayn

---

# Azure Dedicated HSM Supportability

Dedicated HSM gives customers exclusive administrative access of a physical device. Customers have complete administrative control and management responsibilities. Dedicated HSM uses Gemalto SafeNet Luna 7 HSM model A790.  After a device is assigned to a customer Microsoft has no administrative access. Microsoft also has no involvement in the design, development, deployment, and management of any applications that use the HSM.  Customers are responsible for:

* Software updates
* Backup
* Monitoring
* pulling logs

Customers are responsible for applications that use the HSMs. It is not possible for Microsoft to offer any kind of high availability guarantee.  Microsoft is responsible for keeping the device network accessible, and making sure that it has power, cooling, and kept secure.  

## Gemalto support

Every customer using the Dedicated HSM service must have a support contract in place with Gemalto prior to any kind of provisioning activities. As part of their support contract customers receive guidance, support, and services directly from Gemalto. The mechanism to get support from Gemalto is their [customer support portal](https://supportportal.gemalto.com/csm/).
Gemalto will provide any software components required to use the HSM. They will also support configuration, and consulting services for the design, development, and deployment of applications using the HSM.

### Software components

Various software components are used in the configuration of HSM devices:

* Client software
* SDK
* Tools

### Guidance

Gemalto makes available administration and configuration guidance via the [customer support portal](https://supportportal.gemalto.com/csm/). Once signed in using a valid customer ID, these documents are available for download.
Gemalto also provides a series of integration guides to help customers with different scenarios and software integrations. For more information, see the [Gemalto partner site for Microsoft](https://safenet.gemalto.com/partners/microsoft/).

### Support

Any software level issue or question in relation to using the HSMs as part of the Dedicated HSM service should be addressed to Gemalto support directly. All software components listed above and any custom HSM configuration that is post-provisioning will be addressed by Gemalto. For more information, see the [Gemalto customer support portal](https://supportportal.gemalto.com/csm/).

### Consulting services

For any assistance in the design, development and deployment of custom applications that use the HSM, contact your Gemalto account representative.

## Microsoft support

Microsoft is responsible for making physical HSM devices available for the exclusive use of a single customer. Customers are responsible for administration and management.  These responsibilities include:

* Software updates
* Monitoring
* Pulling logs
* Backups

Microsoft responsibilities include:

* Making sure that the device has power
* Keeps an operational state
* The device is accessible over the network.

Issues like:

* Component failures
* Full device failures
* Network access issues
* Problems provisioning and decommissioning.  

Should all be reported to Microsoft.

### Provisioning and decommissioning

After a customer registers for Dedicated HSM they will be able to create a Dedicated HSM resource. The resource goes through an allocation process that maps a physical device in a specified region to a customer’s pre-defined virtual network (VNET).  Once visible on VNET the customer can access the device and configure it. Customers access their dedicated HSMs using Gemalto tools. The resource creation process is supported by Microsoft. Custom configuration process and beyond are supported by Gemalto. (see Gemalto support above).
When a customer has finished using an HSM, it must be reset. The process of resetting the device removes all custom configuration and data. Microsoft deallocates the device and returns it to the pool in a pristine state. This means that when the device is returned to the pool there is no evidence of previous customer activity. The decommissioning process is also handled by Microsoft 

### Hardware issues

The HSM devices have redundant and replaceable power supply’s and fan units. Fan unit removal will cause a tamper event (as in FIPS 140-2) if removed when the device is powered on and not in maintenance mode. To avoid any issues that trigger tamper events the parts replacement will be treated differently.

* PSU replacement. This will be done as a hot-swap item. Customers should contact Microsoft support with device and event details. Microsoft will replace the device.
* Fan replacement. To avoid any issues related to the consequence of accidental tamper events, the fan will be replaced offline. After a customer contacts Microsoft support with device and event details suggesting a fan failure, Microsoft will ask the customer to reset the device to erase all customer data. When the device has been reset Microsoft will allocate a new device to the customer. The new device will then synchronize as part of its high availability pairing and be operational. Microsoft will replace the fan unit and return the original device to the unused pool in a pristine state.

Any more serious failure of the device will result in that device being replaced for the customer triggering synchronizing with the high availability pairing and return to an operational state. The failed device will have it’s data bearing devices removed and shredded on site at the data center. Only the will the chassis be returned to Gemalto.  

### Networking issues

If customers experience networking access problems to the HSM device, they should contact Microsoft support. A simple test for networking access is to use SSH to connect to the HSM device. If this fails contact Microsoft support.

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

It is recommended that key concepts such as high availability and security are well understood before device provisioning and application design or deployment.

* [Deployment Architecture](deployment-architecture.md)
* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
