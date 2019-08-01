---
title: Supportability - Azure Dedicated HSM | Microsoft Docs
description: Support options and areas of responsibility for Azure Dedicated HSM in different scenarios
services: dedicated-hsm
author: johndaw
manager: barbkess

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.custom: seodec18
ms.date: 03/27/2019
ms.author: barclayn

---

# Azure Dedicated HSM Supportability

The Azure Dedicated HSM Service provides a physical device for sole customer use with complete administrative control and management responsibility. The device made available is a [Gemalto SafeNet Luna 7 HSM model A790](https://safenet.gemalto.com/data-encryption/hardware-security-modules-hsms/safenet-network-hsm/). Microsoft will have no administrative access once provisioned by a customer, beyond physical serial port attachment as a monitoring role.  Without access, Microsoft can have no ongoing software level maintenance or system administration responsibilities. As a result, customers are responsible for typical operational activities.
Customers are fully responsible for applications that use the HSMs and should work with Gemalto for support or consulting-based assistance. Due to the extent of customer ownership of operational hygiene, it is not possible for Microsoft to offer any kind of high availability guarantee for this service. It is the customer’s responsibility to ensure their applications are correctly configured to achieve high-availability. Microsoft will monitor and maintain device health and network connectivity.

## Getting support

Customer support for Dedicated HSM is a joint effort between Microsoft and Gemalto. Any hardware issues or network path issues will be addressed by Microsoft, and anything to do with the actual HSM, such as configuration, software, firmware and application development, will be addressed by Gemalto. This support model ensures the quickest route to the most effective support. If in doubt with a particular issue, raise a support request with Microsoft and we will ensure you are directed appropriately. Microsoft will stay engaged in all support scenarios and strive for the best support experience for our customers.

## Gemalto support

Customers using the Dedicated HSM service qualify for support from Gemalto as per their Plus Support Plan. This just requires a registration process using the Gemalto support portal. A Customer ID and instructions will be provided for this as part of the initial engagement with Microsoft to gain access to the Dedicated HSM service. The mechanism to get support from Gemalto is via their [customer support portal](https://supportportal.gemalto.com/csm/).
A key point of note is that Gemalto will provide all software and documentation required to use the HSM (for example, client access software and SDKs) via download on the customer support portal.

### Software components

Various software components are used in the configuration of HSM devices:

* Client software
* SDK
* Tools

### Guidance

Gemalto makes available administration and configuration guidance via the [customer support portal](https://supportportal.gemalto.com/csm/). Once signed in using a valid customer ID, these documents are available for download. Gemalto also provides a series of integration guides to help customers with different scenarios and software integrations. For more information, see the [Gemalto partner site for Microsoft](https://safenet.gemalto.com/partners/microsoft/).

### Support

Any software level issue or question in relation to using the HSMs as part of the Dedicated HSM service, should be addressed to Gemalto support directly. All software components listed above, and any custom HSM configuration that is post-provisioning, will be addressed by Gemalto. For more information, see the  [Gemalto customer support portal](https://supportportal.gemalto.com/csm/).

### Consulting services

For any assistance in the design, development and deployment of custom applications that use the HSM, contact your Gemalto account representative.

## Microsoft support

Microsoft will ensure physical HSM devices are network accessible and in an operational state for the exclusive use of a single customer. Customers are responsible for configuration, administration, and management of the device. 
Microsoft responsibilities include:

* Making sure that the device has power and cooling
* Maintaining an operational state of the HSM (for example, break/fix scenarios)
* The device is accessible over the network.

Issues such as the following should be reported to Microsoft:

* Component failures
* Full device failure
* Network access issues
* Problems provisioning and deprovisioning.

Microsoft has physical serial port access to the device via a monitoring role (that is, not administrative role) that enables basic health telemetry.  This will allow Microsoft to provide proactive notification of issues to the customer unless the customer chooses to restrict this permission. 

### Provisioning and decommissioning

After a customer has an approved registration for the Dedicated HSM service, they will be able to create HSM resources (currently via PowerShell or command-line interface and not the Azure portal). The resource goes through an allocation process that maps a physical device in a specified region, to a customer’s pre-defined virtual network (VNet). Once visible on a VNet, the customer can access the device and configure it further as per requirements. Customers access their dedicated HSMs using Gemalto client software and tools. The resource creation process is supported by Microsoft. Custom configuration process and beyond are supported by Gemalto. (see Gemalto support above). When a customer has finished using an HSM, it must be reset (or zeroized) to ensure no persistence of data. The process of resetting the device removes all custom configuration and data. Microsoft deallocates the device and returns it to the pool in a pristine state. This means that when the device is returned to the pool there is no evidence of previous customer activity. 

### Hardware issues

The HSM device has redundant and replaceable power supplies and fan units.  However, fan unit removal will still cause a tamper event. When a component failure occurs, Microsoft will use the most appropriate process to address the component level issue in a way that causes minimal interruption and lowest risk to our customers service availability.
Any more serious failure of the device will result in that device being replaced by a fresh one from the free pool. The customer simply includes the new device in the existing HA pair for it to synchronize and return to full operational state. The failed device will have its data bearing devices removed and shredded on site at the data center. Only the chassis will be returned to Gemalto for recycling.


### Networking issues

If customers experience networking access problems to the HSM device, they should contact Microsoft support. A simple test for networking access is to use SSH to connect to the HSM device. If this fails, contact Microsoft support.

## Service level expectations for support

For Microsoft support service levels, refer to the [Azure support plan](https://azure.microsoft.com/support/plans/).
For Gemalto support service levels, refer to the [Gemalto Support Essentials](https://azure.microsoft.com/support/plans/).

## Next steps

It is recommended that key concepts such as high availability and security are well understood before device provisioning and application design or deployment.

* [Deployment Architecture](deployment-architecture.md)
* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)

