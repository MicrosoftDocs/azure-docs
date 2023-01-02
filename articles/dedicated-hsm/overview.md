---
title: What is Dedicated HSM? - Azure Dedicated HSM | Microsoft Docs
description: Learn how Azure Dedicated HSM is an Azure service that provides cryptographic key storage in Azure.
services: dedicated-hsm
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: dedicated-hsm
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: overview
ms.custom: "mvc, seodec18"
ms.date: 03/25/2021
ms.author: keithp
#Customer intent: As an IT Pro, Decision maker I am looking for key storage capability within Azure Cloud that meets FIPS 140-2 Level 3 certification and that gives me exclusive access to the hardware.

---

# What is Azure Dedicated HSM?

Azure Dedicated HSM is an Azure service that provides cryptographic key storage in Azure. Dedicated HSM meets the most stringent security requirements. It's the ideal solution for customers who require FIPS 140-2 Level 3-validated devices and complete and exclusive control of the HSM appliance. 

 HSM devices are deployed globally across several Azure regions. They can be easily provisioned as a pair of devices and configured for high availability. HSM devices can also be provisioned across regions to assure against regional-level failover. Microsoft delivers the Dedicated HSM service by using the [Thales Luna 7 HSM model A790](https://cpl.thalesgroup.com/encryption/hardware-security-modules/network-hsms) appliances. This device offers the highest levels of performance and cryptographic integration options. 

After they're provisioned, HSM devices are connected directly to a customer’s virtual network. They can also be accessed by on-premises application and management tools when you configure point-to-site or site-to-site VPN connectivity. Customers get the software and documentation to configure and manage HSM devices from [Thales customer support portal](https://supportportal.thalesgroup.com/csm).

## Why use Azure Dedicated HSM?

### FIPS 140-2 Level-3 compliance

Many organizations have stringent industry regulations that dictate that cryptographic keys must be stored in [FIPS 140-2 Level-3](https://csrc.nist.gov/publications/detail/fips/140/2/final) validated HSMs. Azure Dedicated HSM and a new single-tenant offering, [Azure Key Vault Managed HSM](../key-vault/managed-hsm/index.yml), help customers from various industry segments, such as financial services industry, government agencies, and others meet FIPS 140-2 Level-3 requirements. While Microsoft’s multi-tenant [Azure Key Vault](../key-vault/index.yml) service currently uses FIPS 140-2 Level-2 validated HSMs. 

### Single-tenant devices

Many of our customers have a requirement for single tenancy of the cryptographic storage device. The Azure Dedicated HSM service enables them to provision a physical device from one of Microsoft’s globally distributed datacenters. After it's provisioned to a customer, only that customer can access the device.

### Full administrative control

Many customers require full administrative control and sole access to their device for administrative purposes. After a device is provisioned, only the customer has administrative or application-level access to the device.

 Microsoft has no administrative control after the customer accesses the device for the first time, at which point the customer changes the password. From that point, the customer is a true single-tenant with full administrative control and application-management capability. Microsoft does maintain monitor-level access (not an admin role) for telemetry via serial port connection. This access covers hardware monitors such as temperature, power supply health, and fan health. 

 The customer is free to disable this monitoring needed. However, if they disable it, they won't receive proactive health alerts from Microsoft.

### High performance

The Thales device was selected for this service for a variety of reasons. It offers a broad range of cryptographic algorithm support, a variety of supported operating systems, and broad API support. The specific model that's deployed offers excellent performance with 10,000 operations per second for RSA-2048. It supports 10 partitions that can be used for unique application instances. This device is a low latency, high capacity, and high throughput device.

### Unique cloud-based offering

Microsoft recognized a specific need for a unique set of customers. It is the only cloud provider that offers new customers a dedicated HSM service that is FIPS 140-2 Level 3-validated and offers such an extent of cloud-based and on-premises application integration.

## Is Azure Dedicated HSM right for you?

Azure Dedicated HSM is a specialized service that addresses unique requirements for a specific type of large-scale organization. As a result, it's expected that the bulk of Azure customers will not fit the profile of use for this service. Many will find the Azure Key Vault or Azure Managed HSM service to be more appropriate and cost effective. To help you decide if it's a fit for your requirements, we've identified the following criteria.

### Best fit

Azure Dedicated HSM is most suitable for “lift-and-shift” scenarios that require direct and sole access to HSM devices. Examples include:

- Migrating applications from on-premises to Azure Virtual Machines
- Migrating applications from Amazon AWS EC2 to virtual machines that use the AWS Cloud HSM Classic service (Amazon is not offering this service to new customers)
- Running shrink-wrapped software such as Apache/Ngnix SSL Offload, Oracle TDE, and ADCS in Azure Virtual Machines 

### Not a fit

Azure Dedicated HSM is not a good fit for the following type of scenario: Microsoft cloud services that support encryption with customer-managed keys (such as Azure Information Protection, Azure Disk Encryption, Azure Data Lake Store, Azure Storage, Azure SQL Database, and Customer Key for Office 365) that are not integrated with Azure Dedicated HSM.

> [!NOTE]
> Customers must have a assigned Microsoft Account Manager and meet the monetary requirement of five million ($5M) USD or greater in overall committed Azure revenue annually to qualify for onboarding and use of Azure Dedicated HSM.  

### It depends

Whether Azure Dedicated HSM will work for you depends on a potentially complex mix of requirements and compromises that you can or cannot make. An example is the FIPS 140-2 Level 3 requirement. This requirement is common, and Azure Dedicated HSM and a new single-tenant offering, [Azure Key Vault Managed HSM](../key-vault/managed-hsm/index.yml) are currently the only options for meeting it. If these mandated requirements aren't relevant, then often it's a choice between Azure Key Vault and Azure Dedicated HSM. Assess your requirements before making a decision.

Situations in which you will have to weigh your options include: 

- New code running in a customer’s Azure virtual machine
- SQL Server TDE in an Azure virtual machine
- Azure Storage client-side encryption
- SQL Server and Azure SQL DB Always Encrypted

## Next steps

This is a highly specialized service. Therefore, we recommend that you fully understand the key concepts in this documentation set, including pricing, support, and service-level agreements. 

The [Thales integration guides](https://cpl.thalesgroup.com/partners/overview) help you facilitate the provisioning of HSMs into an existing virtual network environment. There are also how-to guides for helping you determine how to set up your deployment architecture.

* [High availability](high-availability.md)
* [Physical security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)