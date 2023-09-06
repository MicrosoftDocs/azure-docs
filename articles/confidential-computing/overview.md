---
title: Azure Confidential Computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.author: mamccrea #ananyagarg #sgallagher
ms.custom: ignite-fall-2021, inspire-july-2022
---

# What is confidential computing?

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) - a foundation dedicated to defining and accelerating the adoption of confidential computing. The CCC defines confidential computing as: The protection of data in use by performing computations in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces execution of only authorized code. Any code outside TEE can't read or tamper with data inside the TEE. The confidential computing threat model aims at removing or reducing the ability for a cloud provider operator or other actors in the tenant's domain accessing code and data while it's being executed.

:::image type="content" source="media/overview/three-states-and-ccc-definition.png" alt-text="Graphic of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing eliminates the single largest barrier of encryption - encryption while in use - by protecting sensitive or highly regulated data sets and application workloads in a secure public cloud platform. Confidential computing extends beyond generic data protection. TEEs are also being used to protect proprietary business logic, analytics functions, machine learning algorithms, or entire applications.

## Lessen the need for trust
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.

- **App software vendors**: Trust software by deploying on-premises, using open-source, or by building in-house application software.

- **Hardware vendors**: Trust hardware by using on-premises hardware or in-house hardware.

- **Infrastructure providers**: Trust cloud providers or manage your own on-premises data centers.

## Reducing the attack surface
The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

## Analogy

Confidential Computing can initially be difficult to visualize, consider the following analogy;

Woodgrove Bank stores all the details of your financial transactions and balance inside locked bank vaults.
 
The bank tellers are trusted staff with access to your information to make withdrawal and deposits with your permission on a need to know basis.

For many customers, this posture is acceptable, they **trust** the standard security that the bank and its staff provide, for example background checking staff, monitoring what they're doing and managing the physical security of the building, vault, CCTV etc.

However, there are other customers who don't want even the bank staff to see their account data and want a higher level of privacy (Confidential Computing)

Confidential computing provides a conceptual security deposit box (TEE) within the Woodgrove bank vault where your account information is held. The contents of the box are scrambled (encrypted) and can only be unscrambled (decrypted) with a single key allocated to the customer.

The physical key to the security deposit box is held in another safety deposit box (TEE) inside the bank vault (KeyVault, Managed HSM)\* and protected by a security guard

At any time you, as the customer can ask the security guard of the bank (Attestation Service) to obtain and provide signed evidence (security claim) that your data is held within your security deposit box inside Woodgrove Bank. (in future you'll also be able to ask a third party to check the bank setup and validate security claims for you - project Amber)

If you need to access your account to work on your account data in private, for example to deposit or withdraw cash the customer can obtain the physical key (Secure key Release) by; 
- Providing proof of identity to a security guard who protects the vault
- The security guard checks and signs a letter stating that the customer is holding the correct security deposit box (attestation) and not the security deposit box of another customer
- Once these facts are verified the security guard hands-over the physical key to the box, 
- The key allows the customer to open the box and work with the contents (decrypt its contents)

The contents of the box are private to you, and protected from others as follows;
- The other tellers on the front-desk are unable to see what is in the security deposit box (as the TEE is protected by in-use encryption)
- If the bank is robbed (for example a hacker), the security deposit box can't be opened without the key
- If a corrupt teller (insider threat) managed to evade the standard background checks and employee monitoring, they're unable to open the security deposit box without the key owned by the customer.
- If someone without the key were able to physically access or steal the safety deposit box and smash it open the contents are scrambled (encrypted) and can only be unscrambled (decrypted) with the key owned by the customer.

\*The customer *could* take the key home with them and store it there, but then there's a higher risk of that key being stolen from the person's home or car where there's typically a lower level of security than a bank-vault with 24/7 monitoring and security.

## Industry Leadership

Microsoft are a founding member of the Confidential Computing Consortium (https://confidentialcomputing.io/), an industry body driving the adoption and standardization of confidential computing.

:::image type="content" source="media/overview/CCC-membership.jpg" alt-text="Graphic showing the members of the Confidential Computing Consortium, Microsoft are a founding member and chair of the technical advisory council (TAC)":::

### Next steps
[Microsoft's offerings](https://aka.ms/azurecc) for confidential computing extend from Infrastructure as a Service (IaaS) to Platform as a Service (PaaS) and as well as developer tools to support your journey to data and code confidentiality in the cloud.
Learn more about confidential computing on Azure

> [!div class="nextstepaction"]
> [Overview of Azure Confidential Computing](overview-azure-products.md)

