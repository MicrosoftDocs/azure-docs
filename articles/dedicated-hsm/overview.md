---
title: What is Dedicated HSM? | Microsoft Docs
description: Azure Dedicated HSM provides key storage capabilities within Azure that meets FIPS 140-2 Level 3 certification
services: dedicated-hsm
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.date: 11/26/2018
ms.author: barclayn
#Customer intent: As an IT Pro, Decision maker I am looking for key storage capability within Azure Cloud that meets FIPS 140-2 Level 3 certification and that gives me exclusive access to the hardware.

---
# What is Dedicated HSM?

Azure Dedicated HSM provides cryptographic key storage in Azure that meets the most stringent security requirements. Dedicated HSM is the ideal solution for customers requiring FIPS 140-2 Level 3 validated devices and complete and exclusive control of the HSM appliance. The HSM devices are deployed globally across several Azure regions and can be easily provisioned as a pair of devices and configured for high availability. HSMs may also be provisioned across regions to assure against regional level failover. Microsoft has delivered the Dedicated HSM service using the [SafeNet Luna Network HSM 7 (Model A790)](https://safenet.gemalto.com/data-encryption/hardware-security-modules-hsms/safenet-network-hsm/) appliance from Gemalto. This device offers the highest levels of performance and cryptographic integration options. When provisioned, HSMs are connected directly to a customer’s virtual network and could also be accessed by on-premises application and management tools by configuring point-to-site or site-to-site VPN connectivity. Customers will acquire software and documentation to configure and manage HSM devices from Gemalto’s support portal.

## Why use Azure dedicated HSM?

### FIPS 140-2 Level 3 Compliance

Many organizations have stringent industry regulations that dictate cryptographic key storage meets  [FIPS 140-2 Level 3](https://csrc.nist.gov/publications/detail/fips/140/2/final) requirements. Microsoft’s multi-tenant Azure Key Vault service currently only provides FIPS 140-2 Level 2 certification. Azure Dedicated HSM fulfills a real need for financial services industry, government agencies, and others who must meet FIPS 140-2 Level 3 requirements.

### Single Tenant Devices

Many of our customers have a requirement for single tenancy of the cryptographic storage device. The Azure Dedicated HSM service will allow for provisioning of a physical device from one of Microsoft’s globally distributed datacenters. Once provisioned to a customer, only that customer will be able to access the device.

### Full Administrative Control

As well as single tenant devices, many customers require full administrative control, and sole access for administrative purposes. Once provisioned, only that customer has any administrative or application level access to the device. Microsoft will have no administrative control after the customer’s first access, which requires change changing the password. From that point, the customer is a true single-tenant with full administrative control and application management capability. Microsoft does maintain a monitor level access (not an admin role) for telemetry via serial port connection covering hardware monitors such as temperature, power supply health, and fan health. The customer is free to disable this if needed, but would then not receive proactive health alerts from Microsoft.

### High Performance

The Gemalto device was selected for this service due to its broad range of cryptographic algorithm support, variety of operating systems supported and broad API support. The specific model deployed offers excellent performance with 10,000 operations per second for RSA-2048. It supports 10 partitions that can be used for unique application instances. This is a low latency, high capacity, and high throughput device.

### Unique Cloud-based Offering

Microsoft recognized a specific need amongst a unique set of customers and is the only cloud provider that offers new customers a dedicated HSM service that is FIPS 140-2 Level 3 validated and offers such an extent of cloud-based and on-premises application integration.

## Is Azure Dedicated HSM right for you?

Azure Dedicated HSM is a specialized service addressing unique requirements amongst a specific type of large-scale organization. As a result, it is expected that the bulk of Azure customers will not fit the profile of use for this service. Many will find the Azure Key Vault service to be more appropriate and more cost effective. To help you decide the fit for your requirements we have identified the following criteria.

### Best Fit

Most suitable for “lift-and-shift” scenarios that require direct and sole access to HSM devices. Examples include:

- Migrating applications from on-premises to Azure Virtual Machines
- Migrating applications from Amazon AWS EC2 to Azure Virtual Machines that use the AWS Cloud HSM Classic service (Amazon is not offering this service to new customers)
- Running shrink-wrapped software in Azure Virtual Machines such as Apache/Ngnix SSL Offload, Oracle TDE, and ADCS

### Not a Fit

Microsoft cloud services that support encryption with customer-managed keys (such as Azure Information Protection, Azure Disk Encryption, Azure Data Lake Store, Azure Storage, Azure SQL, Office 365 Customer Key) are not integrated with Azure Dedicated HSM.

### It Depends

Many scenarios will depend on a potential complex mix of requirements and what compromises can or cannot be made. An example is FIPS 140-2 Level 3 requirement, which is often mandated and hence, currently Dedicated HSM is the only options.  If these mandated requirements are not relevant, then often it would be decision between Azure Key Vault and Dedicated HSM based on assessing a mix of requirements. Examples include:

- New code running in a customer’s Azure Virtual Machine
- SQL Server TDE in an Azure Virtual Machine
- Azure Storage client-side encryption
- SQL Server and Azure SQL DB Always Encrypted

## Next Steps

Considering the highly specialized nature of this service, it is recommended that some of the key concepts found in this documentation set are fully understood, the pricing, support, and service level agreements are fully understood, and then a tutorial is available to facilitate provisioning of HSMs into an existing virtual network environment. [Gemalto integration guides](https://safenet.gemalto.com/partners/microsoft/) and how-to guides for deciding deployment architecture are also a great resource.

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)
