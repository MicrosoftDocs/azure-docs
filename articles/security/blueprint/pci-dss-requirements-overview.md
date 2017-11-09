---

title: PCI DSS requirements - high-level overview
description: PCI DSS customer responsibility matrix (overview)
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 23cf68d8-bebd-4ac4-a194-39e052281c0e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# PCI DSS requirements - high-level overview

The Payment Card Industry Data Security Standard (PCI DSS) was developed to encourage and enhance cardholder data security and facilitate the broad adoption of consistent data security measures globally. PCI DSS provides a baseline of technical and operational requirements designed to protect account data. PCI DSS applies to all entities involved in payment card processing, including merchants, processors, acquirers, issuers, and service providers. PCI DSS also applies to all other entities that store, process, or transmit cardholder data (CHD) and/or sensitive authentication data (SAD). Below is a high-level overview of the 12 PCI DSS requirements.

> [!NOTE]
> These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

|   |   |
|---|---|
| **Build and Maintain a Secure<br/>Network and Systems** | 1. [Install and maintain a firewall configuration to protect cardholder data](pci-dss-requirement-1-firewall.md)<br/><br/> 2. [Do not use vendor-supplied defaults for system passwords and other security parameters](pci-dss-requirement-2-password.md) |  
| **Protect Cardholder Data** | 3. [Protect stored cardholder data](pci-dss-requirement-3-chd.md)<br/><br/> 4. [Encrypt transmission of cardholder data across open, public networks](pci-dss-requirement-4-encryption.md) |
| **Maintain a Vulnerability<br/>Management Program** | 5. [Protect all systems against malware and regularly update anti-virus software or programs](pci-dss-requirement-5-malware.md)<br/><br/> 6. [Develop and maintain secure systems and applications](pci-dss-requirement-6-secure-system.md) |
| **Implement Strong Access<br/>Control Measures** | 7. [Restrict access to cardholder data by business need to know](pci-dss-requirement-7-access.md)<br/><br/> 8. [Identify and authenticate access to system components](pci-dss-requirement-8-identity.md) <br/><br/> 9. [Restrict physical access to cardholder data](pci-dss-requirement-9-physical-access.md) |
| **Regularly Monitor and<br/>Test Networks** | 10. [Track and monitor all access to network resources and cardholder data](pci-dss-requirement-10-monitoring.md) <br/><br/> 11. [Regularly test security systems and processes](pci-dss-requirement-11-testing.md) |
| **Maintain an Information<br/>Security Policy** | 12. [Maintain a policy that addresses information security for all personnel](pci-dss-requirement-12-policy.md) |

