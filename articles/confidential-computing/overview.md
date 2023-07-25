---
title: Azure Confidential Computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 11/01/2021
ms.author: mamccrea #ananyagarg #sgallagher
ms.custom: ignite-fall-2021, inspire-july-2022
---

# What is confidential computing?

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) - a foundation dedicated to defining and accelerating the adoption of confidential computing. The CCC defines confidential computing as: The protection of data in use by performing computations in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces execution of only authorized code. Any data in the TEE can't be read or tampered with by any code outside that environment. The confidential computing threat model aims at removing or reducing the ability for a cloud provider operator and other actors in the tenant's domain to access code and data while being executed.

<!-- Confidential computing allows you to isolate your sensitive data while it's being processed. Many industries use confidential computing to protect their data by using confidential computing to:

- Run machine learning processes on sensitive information
- Perform algorithms on encrypted data sets from multiple sources
- Secure financial data
- Protect patient information -->


:::image type="content" source="media/overview-azure-products/three-states.png" alt-text="Graphic of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing eliminates the single largest barrier of encryption - encryption while in use - by protecting sensitive or highly regulated data sets and application workloads in a secure public cloud platform. Confidential computing extends beyond generic data protection. TEEs are also being used to protect proprietary business logic, analytics functions, machine learning algorithms, or entire applications.

In the cloud we typically consider 3 pilars of data protection through encryption

#diagram here

## Protection at-rest

Azure offers a variety of encryption solutions for products to encrpt data when it persists on a storage device (known as "at-rest") like a storage account or database. Starting with Platform Managed Keys (PMK) where Microsoft transparently manage the encryption for you through to Customer Managed Keys (CMK) where the customer can provide and manage encryption keys to protect their data.

## Protection in-transit

Over the last 10 years the entire Internet has moved to protecting data as it passes over the various networks that comprise the Internet using encryption tecnologies like Transport Layer Security (TLS), this has moved to become the default for cloud services and is usually implemented transparently to the end-user

## Protection in-use

Protecting data whilst it is being computed upon (known as in-use) has been technically challenging to acomplish as it requires low-level support in the CPU and compute hardware to acomplish.

Confidential computing provides a Trusted Execution Environment (TEE) where computing can happen without exposing the data outside the TEE and a set of supporting services to ensure integrity and confidentiality that customers can use to obtain cryptographically signed proof of protection.

Confidential Computing is a rapily evolving technology space and offers many solutions to confidentiality and integrity, based on customer needs.

# Simple Example

Confidential Computing can initially be difficult to visualise, consider the following sample example;

Woodgrove Bank stores all the details of your financial transactions and balance inside locked bank vaults 
The bank tellers are trusted staff who have access to this information on a need to know basis to manage your account (make withdrawls, manage loans etc.) and do so on your behalf.
For many customers this is acceptable, they trust the bank as an insitution, and its staff

However, there are other customers who don't want even the bank staff to see their account data and want a higher level of privacy (Confidential Computing)

Confidential computing provides a conceptual security deposit box (TEE) within the Woodgrove bank vault where your account information and keys are held, the contents of the box are scrambled (encrypted) and can only be unscrabled (decrypted) with a single key allocated to the customer

The physical key to the security deposit box is held in another safety deposit box (TEE) inside the bank vault (KeyVault, Managed HSM)\* and protected by a security guard

At any time you, as the customer can ask the security guard of the bank (Attestation Service) to obtain and provide signed evidence that your data is held within this security deposit box inside Woodgrove Bank. (.. in future you'll also be able to ask a 3rd party to check the bank setup and validate this for you - project Amber)

If you need to access your account to work on your account data in private, for example to deposit or withdraw cash the customer can obtain the physical key (Secure key Relase) by; 
- Providing proof of identity to a security guard who protects the vault
- The security guard checks and signs a letter stating that the customer is holding the correct security deposit box (attestation) and not the security deposit box of another customer
- Once these facts are verified the security guard hands-over the physical key to the box, 
- The key allows the customer to open the box and work with the contents (decrypt its contents)

The contents of the box are private to you, and protected from others as follows;
- The other tellers on the front-desk are unable to see what is in the security deposit box (as the TEE is protected by in-use encryption)
- If the bank is robbed (for example a hacker) the security deposit box cannot be opened without the key, even if the box is stolen the contents are encrypted and useless without the key owned by the customer
- If a corrupt teller has managed to evade the standard background checks and employee monitoring they are unable to open the security deposit box without the key owned by the customer and even if they smash it open the contents are scrambled (encrypted) and can only be unscrabled (decrypted) with the key owned by the customer.


\*The customer *could* take the key home with them and store it there, but then there is a significantly higher risk of that key being lost, stolen or even copied from the person's home or even from their car when travelling to the bank where there is a lower level of security than in a typical bank-vault with 24/7 monitoring and security.

# --------------------------------


## Lessen the need for trust
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.

- **App software vendors**: Trust software by deploying on-premises, using open-source, or by building in-house application software.

- **Hardware vendors**: Trust hardware by using on-premises hardware or in-house hardware.

- **Infrastructure providers**: Trust cloud providers or manage your own on-premises data centers.

## Reducing the attack surface
The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical". If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

### Next steps
[Microsoft's offerings](https://aka.ms/azurecc) for confidential computing extend from Infrastructure as a Service (IaaS) to Platform as a Service (PaaS) and as well as developer tools to support your journey to data and code confidentiality in the cloud.
Learn more about confidential computing on Azure

> [!div class="nextstepaction"]
> [Overview of Azure Confidential Computing](overview-azure-products.md)

