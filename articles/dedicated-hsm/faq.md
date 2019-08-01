---
title: Frequently asked questions - Azure Dedicated HSM | Microsoft Docs
description: Frequently asked questions covering different topics on Azure Dedicated HSM 
services: dedicated-hsm
author: johncdawson
manager: barbkess
tags: azure-resource-manager
ms.custom: "mvc, seodec18"
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.date: 5/8/2019
ms.author: barclayn
#Customer intent: As an IT Pro, Decision maker I am looking for key storage capability within Azure Cloud that meets FIPS 140-2 Level 3 certification and that gives me exclusive access to the hardware.

---
# Frequently asked questions (FAQ)

Find answers to common questions about Microsoft Azure Dedicated HSM.

## The Basics

### Q: What is a hardware security module (HSM)?

A Hardware Security Module (HSM) is a physical computing device used to safeguard and manage cryptographic keys. Keys stored in HSMs can be used for cryptographic operations. The key material stays safely in tamper-resistant, tamper-evident hardware modules. The HSM only allows authenticated and authorized applications to use the keys. The key material never leaves the HSM protection boundary.

### Q: What is the Azure Dedicated HSM offering?

Azure Dedicated HSM is a cloud-based service that provides HSMs hosted in Azure datacenters that are directly connected to a customer's virtual network. These HSMs are dedicated network appliances (Gemalto's SafeNet Network HSM 7 Model A790). They are deployed directly to a customers' private IP address space and Microsoft does not have any access to the cryptographic functionality of the HSMs. Only the customer has full administrative and cryptographic control over these devices. Customers are responsible for the management of the device and they can get full activity logs directly from their devices. Dedicated HSMs help customers meet compliance/regulatory requirements such as FIPS 140-2 Level 3, HIPAA, PCI-DSS, and eIDAS and many others.

### Q: What hardware is used for Dedicated HSM?

Microsoft has partnered with Gemalto to deliver the Azure Dedicated HSM service. The specific device used is the [SafeNet Luna Network HSM 7 Model A790](https://safenet.gemalto.com/data-encryption/hardware-security-modules-hsms/safenet-network-hsm/). This device not only provides FIPS 140-2 Level 3 validated firmware, but also offers low-latency, high performance, and high capacity via 10 partitions. 

### Q: What is an HSM used for?

HSMs are used for storing cryptographic keys that are used for cryptographic functionality such as SSL (secure socket layer), encrypting data, PKI (public key infrastructure), DRM (digital rights management), and signing documents.

### Q: How does Dedicated HSM work?

Customers can provision HSMs in specific regions using PowerShell or command-line interface. The customer specifies what virtual network the HSMs will be connected to and once provisioned the HSMs will be available in the designated subnet at assigned IP addresses in the customer's private IP address space. Then customers can connect to the HSMs using SSH for appliance management and administration, set up HSM client connections, initialize HSMs, create partitions, define, and assign roles such as partition officer, crypto officer, and crypto user. Then the customer will use Gemalto provided HSM client tools/SDK/software to perform cryptographic operations from their applications.

### Q: What software is provided with the Dedicated HSM service?

Gemalto supplies all software for the HSM device once provisioned by Microsoft. The software is available at the [Gemalto customer support portal](https://supportportal.gemalto.com/csm/). Customers using the Dedicated HSM service are required to be registered for Gemalto support and have a Customer ID that enables access and download of relevant software. The supported client software is version 7.2 which is compatible with the FIPS 140-2 Level 3 validated firmware version 7.0.3. 

### Q: Does Azure Dedicated HSM offer Password-based and PED-based authentication?

At this time, Azure Dedicated HSM only provides HSMs with password-based authentication.

### Q: Will Azure Dedicated HSM host my HSMs for me?

Microsoft only offers the Gemalto SafeNet Luna Network HSM via the Dedicated HSM service and cannot host any customer-provided devices.

### Q: Does Azure Dedicated HSM support payment (PIN/ETF) features?

The Azure Dedicated HSM service uses SafeNet Luna Network HSM 7 (model A790) devices. These devices do not support payment HSM specific functionality (such as PIN or ETF) or certifications. If you would like Azure Dedicated HSM service to support payment HSMs in future, please pass on the feedback to your Microsoft Account Representative.

### Q: Which Azure regions is Dedicated HSM available in?

As of late March 2019, Dedicated HSM is available in the 14 regions listed below. Further regions are planned and can be discussed via your Microsoft Account Representative.

* East US
* East US 2
* West US
* South Central US
* Southeast Asia
* East Asia
* North Europe
* West Europe
* UK South
* UK West
* Canada Central
* Canada East
* Australia East
* Australia Southeast

## Interoperability

### Q: How does my application connect to a Dedicated HSM?

You use Gemalto provided HSM client tools/SDK/software to perform cryptographic operations from your applications. The software is available at the [Gemalto customer support portal](https://supportportal.gemalto.com/csm/). Customers using the Dedicated HSM service are required to be registered for Gemalto support and have a Customer ID that enables access and download of relevant software.

### Q: Can an application connect to Dedicated HSM from a different VNET in or across regions?

Yes, you will need to use [VNET peering](../virtual-network/virtual-network-peering-overview.md) within a region to establish connectivity across virtual networks. For cross-region connectivity, you must use [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

### Q: Can I synchronize Dedicated HSM with on-premises HSMs?

Yes, you can sync on-premises HSMs with Dedicated HSM. [Point-to-point VPN or point-to-site](../vpn-gateway/vpn-gateway-about-vpngateways.md) connectivity can be used to establish connectivity with your on-premises network.

### Q: Can I encrypt data used by other Azure services using keys stored in Dedicated HSM?

No. Azure Dedicated HSMs are only accessible from inside your virtual network.

### Q: Can I import keys from an existing On-premises HSM to Dedicated HSM?

Yes, if you have on-premises Gemalto SafeNet HSMs. There are multiple methods. Refer to the Gemalto HSM documentation.

### Q: What operating systems are supported by Dedicated HSM client software?

* Windows, Linux, Solaris, AIX, HP-UX, FreeBSD
* Virtual: VMware, hyperv, Xen, KVM

### Q: How do I configure my client application to create a high availability configuration with multiple partitions from multiple HSMs?

To have high availability, you need to set up your HSM client application configuration to use partitions from each HSM. Refer to the Gemalto HSM client software documentation.

### Q: What authentication mechanisms are supported by Dedicated HSM?

Azure Dedicated HSM uses SafeNet Network HSM 7 appliances (model A790) and they support password-based authentication.

### Q: What SDKs, APIs, client software is available to use with Dedicated HSM?

PKCS#11, Java (JCA/JCE), Microsoft CAPI, and CNG, OpenSSL

### Q: Can I import/migrate keys from Luna 5/6 HSMs to Azure Dedicated HSMs?

Yes. Please refer to the Gemalto migration guide. 

## Using your HSM

### Q: How do I decide whether to use Azure Key Vault or Azure Dedicated HSM?

Azure Dedicated HSM is the appropriate choice for enterprises migrating to Azure on-premises applications that use HSMs. Dedicated HSMs present an option to migrate an application with minimal changes. If cryptographic operations are performed in the application's code running in an Azure VM or Web App, they can use Dedicated HSM. In general, shrink-wrapped software running in IaaS (infrastructure as a service) models, that support HSMs as a key store can use Dedicate HSM, such as Application gateway or traffic manager for keyless SSL, ADCS (Active Directory Certificate Services), or similar PKI tools, tools/applications used for document signing, code signing, or a SQL Server (IaaS) configured with TDE (transparent database encryption) with master key in an HSM using an EKM (extensible key management) provider. Azure Key Vault is suitable for “born-in-cloud” applications or for encryption at rest scenarios where customer data is processed by PaaS (platform as a service) or SaaS (Software as a service) scenarios such as Office 365 Customer Key, Azure Information Protection, Azure Disk Encryption, Azure Data Lake Store encryption with customer-managed key, Azure Storage encryption with customer managed key, and Azure SQL with customer managed key.

### Q: What usage scenarios best suit Azure Dedicated HSM?

Azure Dedicated HSM is most suitable for migration scenarios. This means that if you are migrating on-premises applications to Azure that are already using HSMs. This provides a low-friction option to migrate to Azure with minimal changes to the application. If cryptographic operations are performed in the application's code running in Azure VM or Web App, Dedicated HSM may be used. In general, shrink-wrapped software running in IaaS (infrastructure as a service) models, that support HSMs as a key store can use Dedicate HSM, such as:

* Application gateway or traffic manager for keyless SSL
* ADCS (Active Directory Certificate Services)
* Similar PKI tools
* Tools/applications used for document signing
* Code signing
* SQL Server (IaaS) configured with TDE (transparent database encryption) with master key in an HSM using an EKM (extensible key management) provider

### Q: Can Dedicated HSM be used with Office 365 Customer Key, Azure Information Protection, Azure Data Lake Store, Disk Encryption, Azure Storage encryption, Azure SQL TDE?

No. Dedicated HSM is provisioned directly into a customer’s private IP Address space so it does not accessible by other Azure or Microsoft services.

## Administration, access, and control

### Q: Does the customer get full exclusive control over the HSMs with Dedicated HSMs?

Yes. Each HSM appliance is fully dedicated to one single customer and no one else has administrative control once provisioned and the administrator password changed.

### Q: What level of access does Microsoft have to my HSM?

Microsoft does not have any administrative or cryptographic control over the HSM. Microsoft does have monitor level access via serial port connection to retrieve basic telemetry such as temperature and component health. This allows Microsoft to provide proactive notification of health issues. If required, the customer can disable this account.

### Q: What is the "tenantadmin" account Microsoft uses, I am used to the admin user being "admin" on SafeNet HSMs?

The HSM device ships with a default user of admin with its usual default password. Microsoft did not want to have default passwords in use while any device is in a pool waiting to be provisioned by customers. This would not meet our strict security requirements. For this reason, we set a strong password which is discarded at provisioning time. Also, at provisioning time we create a new user in the admin role called "tenantadmin". This user has the default password and customers change this as the first action when first logging into the newly provisioned device. This process ensures high degrees of security and maintains our promise of sole administrative control for our customers. It should be noted that the "tenantadmin" user can be used to reset the admin user password if a customer prefers to use that account. 

### Q: Can Microsoft or anyone at Microsoft access keys in my Dedicated HSM?

No. Microsoft does not have any access to the keys stored in customer allocated Dedicated HSM.

### Q: Can I upgrade software/firmware on HSMs allocated to me?

To get best support, Microsoft strongly recommends not to upgrade software/firmware on the HSM. However, the customer does have full administrative control including upgrading software/firmware if specific features are required from different firmware versions. Before making changes, the implications must be understood as this could, for example, effect FIPS validated status. 

### Q: How do I manage Dedicated HSM?

You can manage Dedicated HSMs by accessing them using SSH.

### Q: How do I manage partitions on the Dedicated HSM?

The Gemalto HSM client software is used to manage the HSMs and partitions.

### Q: How do I monitor my HSM?

A customer has full access to HSM activity logs via syslog and SNMP. A customer will need to set up a syslog server or SNMP server to receive the logs or events from the HSMs.

### Q: Can I get full access log of all HSM operations from Dedicated HSM?

Yes. You can send logs from the HSM appliance to a syslog server

## High availability

### Q: Is it possible to configure high availability in the same region or across multiple regions?

Yes. High availability configuration and setup are performed in the HSM client software provided by Gemalto. HSMs from the same VNET or other VNETs in the same region or across regions, or on premises HSMs connected to a VNET using site-to-site or point-to-point VPN can be added to same high availability configuration. It should be noted that this synchronizes key material only and not specific configuration items such as roles.

### Q: Can I add HSMs from my on-premises network to a high availability group with Azure Dedicated HSM?

Yes. They must meet the high availability requirements for SafeNet Luna Network HSM 7.

### Q: Can I add Luna 5/6 HSMs from on-premises networks to a high availability group with Azure Dedicated HSM?

No.

### Q: How many HSMs can I add to the same high availability configuration from one single application?

16 members of an HA group has under-gone, full-throttle testing with excellent results.

## Support

### Q: What is the SLA for Dedicated HSM service?

There is no specific uptime guarantee provided for the Dedicated HSM service. Microsoft will ensure network level access to the device, and hence standard Azure networking SLAs apply.

### Q: How are the HSMs used in Azure Dedicated HSM protected?

Azure datacenters have extensive physical and procedural security controls. In addition to that Dedicated HSMs are hosted in a further restricted access area of the datacenter. These areas have additional physical access controls and video camera surveillance for added security.

### Q: What happens if there is a security breach or hardware tampering event?

Dedicated HSM service uses SafeNet Network HSM 7 appliances. These appliances support physical and logical tamper detection. If there is ever a tamper event the HSMs are automatically zeroized.

### Q: How do I ensure that keys in my Dedicated HSMs are not lost due to error or a malicious insider attack?

It is highly recommended to use an on-premises HSM backup device to perform regular periodic backup of the HSMs for disaster recovery. You will need to use a peer-to-peer or site-to-site VPN connection to an on-premises workstation connected to an HSM backup device.

### Q: How do I get support for Dedicated HSM?

Support is provided by both Microsoft and Gemalto.  If you have an issue with the hardware or network access, raise a support request with Microsoft and if you have an issue with HSM configuration, software and application development please raise a support request with Gemalto. If you have an undetermined issue, raise a support request with Microsoft and then Gemalto can be engaged as required. 

### Q: How do I get the client software, documentation and access to integration guidance for the SafeNet Luna 7 HSM?

After registering for the service, a Gemalto Customer ID will be provided that allows for registration in the Gemalto customer support portal. This will enable access to all software and documentation as well as enabling support requests directly with Gemalto.

### Q: If there is a security vulnerability found and a patch is released by Gemalto, who is responsible for upgrading/patching OS/Firmware?

Microsoft does not have the ability to connect to HSMs allocated to customers. Customers must upgrade and patch their HSMs.

### Q: What if I need to reboot my HSM?

The HSM has a command line reboot option, however, we are experiencing reboot hang issues intermittently and for this reason it is recommended for the safest reboot that you raise a support request with Microsoft to have the device physically rebooted. 

## Cryptography and standards

### Q: Is it safe to store encryption keys for my most important data in Dedicated HSM?

Yes, Dedicated HSM provisions SafeNet Network HSM 7 appliances that use FIPS 140-2 Level 3 validated HSMs. 

### Q: What cryptographic keys and algorithms are supported by Dedicated HSM?

Dedicated HSM service provisions SafeNet Network HSM 7 appliances. They support a wide range of cryptographic key types and algorithms including:
Full Suite B support

* Asymmetric:
  * RSA
  * DSA
  * Diffie-Hellman
  * Elliptic Curve
  * Cryptography (ECDSA, ECDH, Ed25519, ECIES) with named, user-defined, and Brainpool curves, KCDSA
* Symmetric:
  * AES-GCM
  * Triple DES
  * DES
  * ARIA, SEED
  * RC2
  * RC4
  * RC5
  * CAST
  * Hash/Message Digest/HMAC: SHA-1, SHA-2, SM3
  * Key Derivation: SP800-108 Counter Mode
  * Key Wrapping: SP800-38F
  * Random Number Generation: FIPS 140-2 approved DRBG (SP 800-90 CTR mode), complying with BSI DRG.4

### Q: Is Dedicated HSM FIPS 140-2 Level 3 validated?

Yes. Dedicated HSM service provisions SafeNet Network HSM 7 appliances that use FIPS 140-2 Level 3 validated HSMs.

### Q: What do I need to do to make sure I operate Dedicated HSM in FIPS 140-2 Level 3 validated mode?

The Dedicated HSM service provisions SafeNet Luna Network HSM 7 appliances. These appliances use FIPS 140-2 Level 3 validated HSMs. The default deployed configuration, operating system, and firmware are also FIPS validated. You do not need to take any action for FIPS 140-2 Level 3 compliance.

### Q: How does a customer ensure that when an HSM is deprovisioned all the key material is wiped out?

Before requesting deprovisioning, a customer must have zeroized the HSM using Gemalto provided HSM client tools.

## Performance and scale

### Q: How many cryptographic operations are supported per second with Dedicated HSM?

Dedicated HSM provisions SafeNet Network HSM 7 appliances (model A790). Here's a summary of maximum performance for some operations: 

* RSA-2048: 10,000 transactions per second
* ECC P256: 20,000 transactions per second
* AES-GCM: 17,000 transactions per second

### Q: How many partitions can be created in Dedicated HSM?

The SafeNet Luna HSM 7 model A790 used includes a license for 10 partitions in the cost of the service. The device has a limit of 100 partitions and adding partitions up to this limit would incur extra licensing costs and require installation of a new license file on the device.

### Q: How many keys can be supported in Dedicated HSM?

The maximum number of keys is a function of the memory available. The SafeNet Luna 7 model A790 in use has 32MB of memory. The following numbers are also applicable to key pairs if using asymmetric keys.

* RSA-2048 - 19,000
* ECC-P256 - 91,000

Capacity will vary depending on specific key attributes set in the key generation template and number of partitions.
