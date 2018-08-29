---
title: Azure Dedicated HSM Overview | Microsoft Docs
description: Azure Dedicated HSM provides key storage capabilities within Azure that meets FIPS 140-2 Level 3 certification
services: key-vault
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.date: 08/29/2018
ms.author: barclayn
#Customer intent: As an IT Pro, Decision maker I am looking for key storage capability within Azure Cloud that meets FIPS 140-2 Level 3 certification and that gives me exclusive access to the hardware.

---
# Overview – About Dedicated HSM

The Azure Dedicated HSM service provides a cryptographic key storage capability within Microsoft’s Azure Cloud that meets the most stringent security requirements. For customers requiring FIPS 140-2 Level 3 certification and sole access to, and complete control of the HSM devices, this would be the ideal solution. The HSM devices are distributed globally across Microsoft’s datacenters and can be easily provisioned as a single device, or devices distributed across regions for a highly available solution. Microsoft has partnered with Gemalto for the [SafeNet Luna Network HSM 7 (Model A790)](https://safenet.gemalto.com/data-encryption/hardware-security-modules-hsms/safenet-network-hsm/) device which offers the highest levels of performance and capability.  Azure virtual private networking is used to provide access to the devices and potentially connect to a customers on-premises applications and management capabilities. Once provisioned, Gemalto will make available all software components required and Microsoft will ensure the highest levels of access to the devices.

## Why use Azure dedicated HSM?

### FIPS 140-2 Level 3 Compliance

Many of our customers have industry regulations that dictate cryptographic key storage must comply with [FIPS 140-2 Level 3](https://csrc.nist.gov/publications/detail/fips/140/2/final). Microsoft’s multi-tenant Azure Key Vault service currently only provides FIPS 140-2 Level 2 certification and hence Azure Dedicated HSM fulfills a real need for our customers predominantly in the financial services industry and government agencies.

### Single Tenant Devices

Many of our customers have a requirement for single tenancy of the cryptographic storage device. The Azure Dedicated HSM service will allow for provisioning of a physical device from one of Microsoft’s globally distributed datacenters and once access is provided to the customer, only that customer will make any use of the device provisioned.  

### Full Administrative Control

As well as single tenant devices, many customers require full administrative control and even sole access for administrative purposes. Once provisioned, only that customer has any administrative or application level access to the device. Microsoft will have no administrative control after the initial authentication password is delivered to the customer requiring change on first use.  From that point the customer is a true single-tenant with full administrative control and application management capability.

### High Performance

The Gemalto device was specifically selected for this service as it provides a broad range of cryptographic support, a variety of operating system support and broad API support as well as offering excellent performance. The specific model deployed offers 10,000 tps for RSA-2048 and also supports 10 partitions for unique application instances. This is low latency, high capacity and high throughput.

### Unique Cloud-based Offering

Microsoft recognized a specific need amongst a unique set of customers as is the only cloud provider that offers a dedicated HSM service that is FIPS 140-2 Level 3 compliant for new customers.

## Is Azure Dedicated HSM right for you?

Azure Dedicated HSM is a specialized service addressing unique requirements amongst a specific type of large-scale organization. As a result. It is expected that the bulk of Azure customers will not fit the best profile of use for this service and many will find the Azure Key Vault service to be more appropriate and even cost effective. To help you decide the fit for your requirements we have identified the following criteria.

### Best Fit

Most suitable for “lift-and-shift” scenarios that require direct and sole access to HSM devices. Examples include:

- Migrating applications from on-premises to Azure Virtual Machines
- Migrating applications from Amazon AWS EC2 to Azure Virtual Machines that use the AWS Cloud HSM Classic service (Amazon is not offering this service to new customers)
- Running shrink-wrapped software in Azure Virtual Machines such as Apache/Ngnix SSL Offload, Oracle TDE and ADCS

### Not a Fit

Azure Dedicated HSM service has no IaaS/PaaS integration for customer-managed keys and for these scenarios the best fit would be Azure Key Vault service. Examples include:

- Azure Disk Encryption
- Azure Data Lake Store encryption
- Azure Storage server-side encryption
- Azure SQL DB TDE
- Azure Information Protection
- Office 365 service encryption
- Azure App Services SSL
- Azure CDN SSL 
- API Management SSL

### It Depends

Many scenarios will depend on a potential complex mix of requirements and what compromises can or cannot be made. An example is FIPS 140-2 Level 3 requirement which is often mandated and hence, currently Dedicated HSM is the only options.  If these mandated requirements are not relevant, then often it would be decision between Azure Key Vault and Dedicated HSM based on assessing a mix of requirements. Example include:

- New code running in a customer’s Azure Virtual Machine
- SQL Server TDE in an Azure Virtual Machine
- Azure Storage client-side encryption
- SQL Server and Azure SQL DB Always Encrypted

## Next Steps

Considering the highly specialized nature of this service, it is recommended that some of the key concepts found in this documentation set are fully understood, the pricing, support and service level agreements are fully understood, and then a Quickstart is available to facilitate hands-on use of an HSM. Gemalto integration guides and how-to guides for deciding deployment architecture are also a great resource.

- Key Concepts
- Pricing
- SLA
- Quickstart
- Integration guides
